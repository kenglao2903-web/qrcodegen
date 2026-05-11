import { useCallback, useEffect, useRef, useState } from "react";
import { startScanner, stopScanner, destroyScanner } from "@/services/scannerService";
import { vibrate } from "@/services/qrService";
import type { CameraPermissionState, ScanResult } from "@/types/scanner";

interface UseBarcodeScannerOptions {
  enabled: boolean;
  onResult: (result: ScanResult) => void;
}

export function useBarcodeScanner({ enabled, onResult }: UseBarcodeScannerOptions) {
  const PERM_KEY = "barcode.cameraPermissionGranted";
  const previouslyGranted =
    typeof window !== "undefined" && window.localStorage?.getItem(PERM_KEY) === "1";
  const [permission, setPermission] = useState<CameraPermissionState>(
    previouslyGranted ? "granted" : "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    handledRef.current = false;
    // Only show "requesting" UI for first-time users; skip the flash if we
    // already have a granted permission cached.
    if (!previouslyGranted) setPermission("requesting");
    setError(null);

    startScanner(
      (decodedText, decodedResult) => {
        if (handledRef.current) return;
        handledRef.current = true;
        vibrate(80);
        onResult({
          text: decodedText,
          format: String(decodedResult?.result?.format?.formatName ?? "UNKNOWN"),
          timestamp: Date.now(),
        });
      },
      () => {
        // Per-frame decode errors are noisy; ignore.
      },
    )
      .then(() => {
        if (cancelled) return;
        setPermission("granted");
        try {
          window.localStorage?.setItem(PERM_KEY, "1");
        } catch {
          // ignore storage errors
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        if (/permission|denied|NotAllowed/i.test(message)) {
          setPermission("denied");
          try {
            window.localStorage?.removeItem(PERM_KEY);
          } catch {
            // ignore
          }
          setError("Camera access denied. Enable it in your browser settings.");
        } else if (/NotFound|no camera/i.test(message)) {
          setPermission("unavailable");
          setError("No camera found on this device.");
        } else {
          setPermission("unavailable");
          setError(message || "Failed to start the camera.");
        }
      });

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [enabled, onResult]);

  useEffect(() => () => void destroyScanner(), []);

  const retry = useCallback(() => {
    setError(null);
    setPermission("idle");
  }, []);

  return { permission, error, retry };
}