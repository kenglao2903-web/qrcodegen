import { createFileRoute } from "@tanstack/react-router";
import { ScannerContainer } from "@/components/scanner/ScannerContainer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Barcode to QR – Instant Converter" },
      {
        name: "description",
        content:
          "Scan any barcode with your camera and instantly convert it into a high-quality QR code.",
      },
    ],
  }),
});

function Index() {
  return <ScannerContainer />;
}
