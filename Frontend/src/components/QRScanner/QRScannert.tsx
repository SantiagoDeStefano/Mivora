
import { useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'

type QRScannerProps = {
  onScan: (text: string) => void
  onError?: (err: unknown) => void
  active?: boolean
  allowUpload?: boolean
}

export default function QRScanner({
  onScan,
  onError,
  active = true,
  allowUpload = false
}: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scannerRef = useRef<QrScanner | null>(null)

  useEffect(() => {
    // If not active, make sure scanner is stopped/destroyed
    if (!active) {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
      return
    }

    if (!videoRef.current) return

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        onScan(result.data)
      },
      {
        onDecodeError: (err) => {
          if (onError) onError(err)
        },
        preferredCamera: 'environment'
      }
    )

    scannerRef.current = scanner

    scanner.start().catch((err) => {
      onError?.(err)
    })

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
    }
  }, [active, onScan, onError])

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      })
      onScan(result.data)
    } catch (err) {
      onError?.(err)
    } finally {
      // allow re-uploading the same file
      e.target.value = ''
    }
  }

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: '100%', maxWidth: 400 }}
        muted
        playsInline
      />
      {allowUpload && (
        <div className='mt-2'>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  )
}
