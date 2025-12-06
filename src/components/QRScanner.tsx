import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  title?: string;
  description?: string;
}

export function QRScanner({ onScan, onError, title = "QR Code Scanner", description = "Position the QR code within the frame" }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScanned = useRef(false);

  const startScanning = async () => {
    try {
      setError(null);
      hasScanned.current = false;
      
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      // Request camera permission and start scanning
      await scanner.start(
        { facingMode: "environment" }, // Use back camera on mobile
        {
          fps: 10, // Frames per second to scan
          qrbox: { width: 250, height: 250 }, // Scanning box size
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback - called when QR code is detected
          if (!hasScanned.current) {
            hasScanned.current = true;
            onScan(decodedText);
            stopScanning();
          }
        },
        (errorMessage) => {
          // Error callback - ignore these as they're just "no QR code found" messages
          // Only log actual critical errors
          if (errorMessage && !errorMessage.includes('NotFoundException')) {
            console.debug("QR scan error:", errorMessage);
          }
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to start camera. Please ensure camera permissions are granted.';
      setError(errorMsg);
      setIsScanning(false);
      onError?.(errorMsg);
      console.error('Camera start error:', err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanning();
      }
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Scanner Container */}
        <div 
          id="qr-reader" 
          className={`w-full rounded-lg overflow-hidden border-2 ${isScanning ? 'border-primary' : 'border-gray-300'}`}
          style={{ minHeight: isScanning ? '300px' : '0px' }}
        ></div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          {!isScanning ? (
            <Button onClick={startScanning} className="w-full sm:w-auto">
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopScanning} className="w-full sm:w-auto">
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Instructions */}
        {isScanning && (
          <div className="text-sm text-muted-foreground text-center space-y-1">

          </div>
        )}
      </CardContent>
    </Card>
  );
}
