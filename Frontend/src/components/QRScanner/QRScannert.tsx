// src/components/qr/QRScanner.tsx
import { useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

type QRScannerProps = {
  onScan: (text: string) => void
  onError?: (err: unknown) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250
    }, false)

    scanner.render(
      (decodedText) => {
        onScan(decodedText)
      },
      (err) => {
        if (onError) onError(err)
      }
    )

    return () => {
      scanner.clear().catch(() => undefined)
    }
  }, [onScan, onError])

  return <div id='qr-reader' />
}
