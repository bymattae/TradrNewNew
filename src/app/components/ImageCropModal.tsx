import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
}

export default function ImageCropModal({ imageUrl, onClose, onSave }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): string => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleSave = () => {
    if (imgRef.current && completedCrop) {
      const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop);
      onSave(croppedImageUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-white">Edit photo</h3>
        <button
          onClick={handleSave}
          className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
        >
          Save
        </button>
      </div>

      {/* Crop Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-2xl w-full">
          <ReactCrop
            crop={crop}
            onChange={(c: Crop) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            className="rounded-xl overflow-hidden border border-zinc-800/50 bg-zinc-900/50"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop me"
              className="max-h-[70vh] w-full object-contain"
            />
          </ReactCrop>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-white font-medium">Tips</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
              Drag to reposition
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
              Pinch or use slider to zoom
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 