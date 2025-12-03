import QRScanner from '../../components/QRScanner'

export default function ScanTicketPage() {
  return (
    <div className='p-4'>
      <QRScanner
        onScan={(text) => {
          console.log('QR:', text)
          // navigate, call API, v.v.
        }}
      />
    </div>
  )
}
