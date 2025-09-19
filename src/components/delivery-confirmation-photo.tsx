
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCw, Send, AlertTriangle } from 'lucide-react';
import { confirmDelivery } from '@/lib/data-service';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function DeliveryConfirmationPhoto({ orderId, onConfirmed }: { orderId: string, onConfirmed: () => void }) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    if (hasCameraPermission === null && !photoData) {
        getCameraPermission();
    }

    return () => {
      // Cleanup: stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasCameraPermission, toast, photoData]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPhotoData(dataUrl);

    // Stop video stream after taking photo
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
    }
  };

  const retakePhoto = () => {
    setPhotoData(null);
    setHasCameraPermission(null); // This will trigger re-requesting permission
  };

  const handleSubmit = async () => {
    if (!photoData) return;
    setIsSubmitting(true);
    try {
      await confirmDelivery(orderId, photoData, 'PHOTO');
      toast({
        title: 'Return Photo Submitted!',
        description: 'The photo has been submitted. The return process is now complete.',
      });
      onConfirmed();
    } catch (error) {
      console.error('Failed to submit return photo:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not submit the photo. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasCameraPermission === null && !photoData) {
      return <Skeleton className="h-96 w-full" />;
  }

  if (hasCameraPermission === false) {
    return (
      <Alert variant="destructive">
        <Camera className="h-4 w-4" />
        <AlertTitle>Camera Access Required</AlertTitle>
        <AlertDescription>
          You have denied camera access. Please enable it in your browser settings to take a photo of the returned goods.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photograph Returned Goods</CardTitle>
        <CardDescription>Take a clear picture of the item(s) being returned. This is for damage assessment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
          {photoData ? (
            <img src={photoData} alt="Delivery Confirmation" className="h-full w-full object-cover" />
          ) : (
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
          )}
           <canvas ref={canvasRef} className="hidden" />
        </div>

        {photoData ? (
          <div className="flex gap-4">
            <Button variant="outline" className="w-full" onClick={retakePhoto} disabled={isSubmitting}>
              <RefreshCw className="mr-2" /> Retake
            </Button>
            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : <> <Send className="mr-2" /> Submit Photo</> }
            </Button>
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={takePhoto}>
            <Camera className="mr-2" /> Take Photo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
