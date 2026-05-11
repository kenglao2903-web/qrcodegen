export type BarcodeFormat =
  | "EAN_13"
  | "EAN_8"
  | "UPC_A"
  | "UPC_E"
  | "CODE_128"
  | "CODE_39"
  | "QR_CODE"
  | "ITF";

export interface ScanResult {
  text: string;
  format: string;
  timestamp: number;
}

export type CameraPermissionState =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable";