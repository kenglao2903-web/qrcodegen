import { Html5QrcodeSupportedFormats } from "html5-qrcode";

export const SUPPORTED_FORMATS: Html5QrcodeSupportedFormats[] = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.QR_CODE,
];

export const SCANNER_ELEMENT_ID = "barcode-scanner-region";

export const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 280, height: 160 },
  aspectRatio: 1.7777,
  disableFlip: false,
};