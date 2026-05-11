import { useEffect, useState } from "react";
import { ScannerView } from "./ScannerView";
import { ResultDisplay } from "./ResultDisplay";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useScanResult } from "@/hooks/useScanResult";
import { Camera, X } from "lucide-react";
import logo from "@/assets/bangkok-hospital-logo.png";

export function ScannerContainer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [cameraStarted, setCameraStarted] = useState(false);

  const { result, scanning, handleResult, reset } = useScanResult();
  const { permission, error, retry } = useBarcodeScanner({
    enabled: mounted && cameraStarted && scanning,
    onResult: handleResult,
  });

  const handleReset = () => {
    reset();
  };

  const handleStop = () => {
    setCameraStarted(false);
    reset();
  };

  // Full-screen scanning mode
  if (mounted && cameraStarted && !result) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white">
        <ScannerView
          permission={permission}
          error={error}
          onRetry={retry}
          active={scanning}
        />
        <button
          onClick={handleStop}
          aria-label="Close camera"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur text-white active:scale-95 transition-transform"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-[max(env(safe-area-inset-top),1rem)]">
          <div className="rounded-full bg-black/50 backdrop-blur px-4 py-1.5 text-xs font-medium">
            Align the barcode inside the frame
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background text-foreground">
      <header className="flex items-center justify-center px-5 py-4 border-b border-border">
        <img
          src={logo}
          alt="Bangkok Hospital"
          className="h-8 w-auto object-contain"
        />
      </header>

      <main className="relative flex-1 min-h-0">
        {result ? (
          <div className="flex h-full w-full items-center justify-center px-6 text-center">
            <p className="text-sm text-muted-foreground">Scan complete</p>
          </div>
        ) : (
          <IdleHero logo={logo} onStart={() => setCameraStarted(true)} />
        )}
      </main>

      {result && (
        <div className="shrink-0">
          <ResultDisplay result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}

function IdleHero({ logo, onStart }: { logo: string; onStart: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <img
        src={logo}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto h-3/4 w-auto max-w-[80%] object-contain opacity-[0.04]"
      />
      <div className="relative flex flex-col items-center gap-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Barcode to QR
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            Tap below to open the camera and scan any barcode.
          </p>
        </div>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow-lg active:scale-[0.98] transition-transform"
        >
          <Camera className="h-5 w-5" />
          Start Camera
        </button>
        <p className="text-center text-xs text-muted-foreground py-3 px-5">
          We only access your camera while scanning.
        </p>
      </div>
    </div>
  );
}