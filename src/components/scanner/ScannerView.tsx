import { SCANNER_ELEMENT_ID } from "@/constants/scanner";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import type { CameraPermissionState } from "@/types/scanner";

interface ScannerViewProps {
  permission: CameraPermissionState;
  error: string | null;
  onRetry: () => void;
  active: boolean;
}

export function ScannerView({ permission, error, onRetry, active }: ScannerViewProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <div id={SCANNER_ELEMENT_ID} className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover" />

      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative w-[80%] max-w-sm aspect-[16/9]">
            <div className="absolute inset-0 rounded-2xl border border-white/20" />
            <span className="absolute -top-px -left-px h-8 w-8 border-t-2 border-l-2 border-white rounded-tl-2xl" />
            <span className="absolute -top-px -right-px h-8 w-8 border-t-2 border-r-2 border-white rounded-tr-2xl" />
            <span className="absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-white rounded-bl-2xl" />
            <span className="absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-white rounded-br-2xl" />
          </div>
        </div>
      )}

      {permission === "requesting" && (
        <Overlay>
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-sm text-white/80">Requesting camera…</p>
        </Overlay>
      )}

      {(permission === "denied" || permission === "unavailable") && (
        <Overlay>
          {permission === "denied" ? (
            <CameraOff className="h-10 w-10 text-white" />
          ) : (
            <Camera className="h-10 w-10 text-white" />
          )}
          <p className="text-sm text-white/90 text-center max-w-xs px-6">
            {error ?? "Camera unavailable."}
          </p>
          <button
            onClick={onRetry}
            className="mt-2 rounded-full bg-white text-black text-sm font-medium px-5 py-2"
          >
            Try again
          </button>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm">
      {children}
    </div>
  );
}