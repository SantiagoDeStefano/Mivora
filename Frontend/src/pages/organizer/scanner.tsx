import { useEffect, useState } from 'react';
import { Html5QrcodeScanner, QrcodeSuccessCallback } from 'html5-qrcode';
import { Container } from '../../layouts/Container';
import { Card } from '../../components/Card';

export default function QRScannerPage() {
  const [feedback, setFeedback] = useState({ message: 'Initializing scanner...', type: 'info' });

  useEffect(() => {
    // This function will be called on a successful scan
    const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      
      // Stop the scanner after a successful scan to prevent re-scanning
      html5QrcodeScanner.clear();
      
      // Send the result to your backend
      checkInAttendee(decodedText);
    };
    
    // Optional: Handle scan errors
    const onScanFailure = (_error: string) => {
        console.warn("Scan failed:", _error);    
      };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader", // The ID of the div element
      { fps: 10, qrbox: { width: 250, height: 250 } }, // Scanner configuration
      false // Verbose output
    );
    
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    setFeedback({ message: 'Point camera at a QR code', type: 'info' });

    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner.", error);
      });
    };
  }, []); // The empty dependency array ensures this runs only once

  const checkInAttendee = async (ticketId: string) => {
    // ... your check-in logic remains the same
    setFeedback({ message: `Success! Checked in ticket: ${ticketId}`, type: 'success' });
  };

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h2 className="text-2xl sm:text-3xl font-semibold">QR Code Scanner</h2>
        <Card className="mt-6 mx-auto max-w-lg p-4">
          {/* This div is where the scanner will be rendered */}
          <div id="qr-reader" style={{ width: '100%' }}></div>
            <div className = {`mt-4 p-4 text-center rounded-lg ${
                feedback.type === 'success' ? 'bg-emerald-100 text-emerald-800' :
                feedback.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
          </div>
        </Card>
      </Container>
    </section>
  );
}