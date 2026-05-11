import {
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  QrcodeSuccessCallback,
  QrcodeErrorCallback,
} from "html5-qrcode";
import { SCANNER_ELEMENT_ID, SCANNER_CONFIG, SUPPORTED_FORMATS } from "@/constants/scanner";

let instance: Html5Qrcode | null = null;

function getInstance(): Html5Qrcode {
  if (!instance) {
    instance = new Html5Qrcode(SCANNER_ELEMENT_ID, {
      formatsToSupport: SUPPORTED_FORMATS,
      verbose: false,
    });
  }
  return instance;
}

export async function startScanner(
  onSuccess: QrcodeSuccessCallback,
  onError?: QrcodeErrorCallback,
): Promise<void> {
  const scanner = getInstance();
  const config: Html5QrcodeCameraScanConfig = {
    fps: SCANNER_CONFIG.fps,
    qrbox: SCANNER_CONFIG.qrbox,
    aspectRatio: SCANNER_CONFIG.aspectRatio,
    disableFlip: SCANNER_CONFIG.disableFlip,
  };
  await scanner.start({ facingMode: "environment" }, config, onSuccess, onError);
}

export async function stopScanner(): Promise<void> {
  if (!instance) return;
  try {
    if (instance.isScanning) {
      await instance.stop();
    }
    instance.clear();
  } catch {
    // no-op
  }
}

export function destroyScanner(): void {
  instance = null;
}