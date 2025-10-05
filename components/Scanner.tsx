
import React, { useRef, useEffect, useCallback } from 'react';
import { LibraryType } from '../types';

interface ScannerProps {
  library: LibraryType;
  onResult: (result: string, scanTime: number) => void;
  isScanning: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ library, onResult, isScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const zxingControlsRef = useRef<any>(null);

  const stopScan = useCallback(() => {
    // Stop ZXing
    if (zxingControlsRef.current) {
        zxingControlsRef.current.stop();
        zxingControlsRef.current = null;
    }
    // Stop QuaggaJS
    if ((window as any).Quagga && (window as any).Quagga.running) {
        (window as any).Quagga.stop();
    }
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!isScanning) {
      stopScan();
      return;
    }

    const startScan = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Camera not supported on this browser!');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.playsInline = true;
                videoRef.current.play();

                const startTime = performance.now();

                if (library === LibraryType.ZXing) {
                    const { BrowserMultiFormatReader, NotFoundException } = (window as any).ZXing;
                    const codeReader = new BrowserMultiFormatReader();
                    
                    const controls = await codeReader.decodeFromStream(stream, videoRef.current, (result, err, controls) => {
                        if (result) {
                            const scanTime = performance.now() - startTime;
                            onResult(result.getText(), scanTime);
                            controls.stop();
                        }
                        if (err && !(err instanceof NotFoundException)) {
                            console.error('ZXing error:', err);
                        }
                    });
                    zxingControlsRef.current = controls;

                } else if (library === LibraryType.QuaggaJS) {
                    (window as any).Quagga.init({
                        inputStream : {
                            name : "Live",
                            type : "LiveStream",
                            target: videoRef.current
                        },
                        decoder : {
                            readers : ["code_128_reader", "ean_reader", "upc_reader", "codabar_reader"]
                        },
                        locate: true,
                    }, (err: any) => {
                        if (err) {
                            console.error('QuaggaJS initialization error:', err);
                            return;
                        }
                        (window as any).Quagga.start();
                    });

                    (window as any).Quagga.onDetected((data: any) => {
                        const scanTime = performance.now() - startTime;
                        onResult(data.codeResult.code, scanTime);
                        (window as any).Quagga.stop();
                    });
                     (window as any).Quagga.onProcessed(() => {});
                }
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Could not access the camera. Please grant permission and try again.');
        }
    };
    
    startScan();

    return () => {
      stopScan();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, isScanning, onResult]);


  return (
    <>
      <video ref={videoRef} className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3/4 h-1/2 border-4 border-cyan-400/50 rounded-lg animate-pulse shadow-lg"></div>
      </div>
      {!isScanning && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-xl">Initializing scanner...</p>
        </div>
      )}
    </>
  );
};

export default Scanner;
