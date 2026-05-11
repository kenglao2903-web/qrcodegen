import { useCallback, useState } from "react";
import type { ScanResult } from "@/types/scanner";

export function useScanResult() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState<boolean>(true);

  const handleResult = useCallback((r: ScanResult) => {
    setResult(r);
    setScanning(false);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setScanning(true);
  }, []);

  return { result, scanning, handleResult, reset };
}