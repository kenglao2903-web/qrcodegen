import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Maximize2, RotateCcw, X } from "lucide-react";
import type { ScanResult } from "@/types/scanner";

interface ResultDisplayProps {
  result: ScanResult;
  onReset: () => void;
}

export function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fullscreen]);

  return (
    <div className="rounded-t-3xl bg-card text-card-foreground border-t border-border shadow-2xl px-5 pt-5 pb-6">
      <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Detected</p>
          <p className="text-sm font-semibold">{result.format}</p>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="View QR code full screen"
          className="relative group rounded-2xl bg-white p-3 active:scale-[0.98] transition-transform"
        >
          <QRCodeSVG value={result.text} size={180} level="H" includeMargin={false} />
          <span className="absolute bottom-2 right-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-black/70 text-white">
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>

      <div className="mb-4 rounded-xl bg-muted px-3 py-2">
        <p className="text-xs text-muted-foreground mb-0.5">Decoded value</p>
        <p className="text-sm font-mono break-all">{result.text}</p>
      </div>

      <button
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 text-sm font-semibold shadow-lg active:scale-[0.99] transition-transform"
      >
        <RotateCcw className="h-5 w-5" />
        Scan again
      </button>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white p-6"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            aria-label="Close full screen"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(false);
            }}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="flex items-center justify-center w-full max-w-[min(90vw,90vh)] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <QRCodeSVG
              value={result.text}
              level="H"
              includeMargin={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <p className="mt-6 text-xs text-black/60 font-mono break-all text-center max-w-md">
            {result.text}
          </p>
        </div>
      )}
    </div>
  );
}