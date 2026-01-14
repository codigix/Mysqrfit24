import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw, ZoomIn, ZoomOut, X, MapPin } from 'lucide-react';

interface Property360ViewProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  imageUrl?: string;
  address?: string;
}

export const Property360View = ({ 
  isOpen, 
  onClose, 
  propertyTitle, 
  imageUrl,
  address 
}: Property360ViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const draw = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#fbf9f6');
      gradient.addColorStop(1, 'hsl(var(--muted))');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context
      ctx.save();
      
      // Move to center and apply zoom
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      
      if (img.complete && img.naturalWidth > 0) {
        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);
        
        // Draw image centered
        const imgWidth = Math.min(400, canvas.width * 0.8);
        const imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth;
        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      } else {
        // Draw placeholder circle with property info
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        ctx.fillStyle = 'hsl(var(--primary))';
        ctx.fill();
        
        ctx.fillStyle = 'hsl(var(--primary-foreground))';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('360° View', 0, -10);
        ctx.fillText('Loading...', 0, 10);
      }
      
      // Restore context
      ctx.restore();
      
      // Draw rotation indicator
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 120 * zoom, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw rotation marker
      const markerX = canvas.width / 2 + Math.cos((rotation * Math.PI) / 180) * 120 * zoom;
      const markerY = canvas.height / 2 + Math.sin((rotation * Math.PI) / 180) * 120 * zoom;
      ctx.beginPath();
      ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.fill();
    };

    img.onload = draw;
    img.onerror = draw;
    
    // Use property image or fallback
    if (imageUrl) {
      img.src = imageUrl;
    } else {
      // Trigger draw for placeholder
      draw();
    }

    // Auto rotation
    const autoRotate = () => {
      if (!isDragging) {
        setRotation(prev => (prev + 0.5) % 360);
      }
      animationRef.current = requestAnimationFrame(autoRotate);
    };
    
    autoRotate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, rotation, zoom, isDragging, imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouseX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouseX;
    setRotation(prev => prev + deltaX * 0.5);
    setLastMouseX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const [showMap, setShowMap] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>360° View - {propertyTitle}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4">
          {/* 360 View Panel */}
          <div className="flex-1 relative" ref={containerRef}>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            
            {/* Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Button variant="secondary" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button variant="secondary" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Info */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg">
              <p className="text-sm font-medium">Drag to rotate • Scroll to zoom</p>
              <p className="text-xs opacity-75">Rotation: {Math.round(rotation)}°</p>
            </div>
          </div>

          {/* Map Panel */}
          {address && (
            <div className="flex-1 relative">
              <div className="absolute top-4 right-4 z-10">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {showMap ? 'Hide Map' : 'Show Map'}
                </Button>
              </div>
              
              {showMap && (
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO4H2Pl2e1Xzb0&q=${encodeURIComponent(address)}`}
                  className="w-full h-full rounded-lg border"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
              
              {!showMap && (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click "Show Map" to view location</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};