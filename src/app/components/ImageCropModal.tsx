'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog } from '@headlessui/react';

interface ImageCropModalProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageUrl, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(async (croppedArea: any, croppedAreaPixels: any) => {
    try {
      const image = new Image();
      image.src = imageUrl;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const base64Image = canvas.toDataURL('image/jpeg');
      onSave(base64Image);
    } catch (e) {
      console.error(e);
    }
  }, [imageUrl, onSave]);

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-zinc-900 p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4 flex items-center justify-between">
            Crop Image
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Title>
          
          <div className="relative aspect-square w-full bg-zinc-800 rounded-xl overflow-hidden">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onCropComplete(crop, { x: 0, y: 0, width: 400, height: 400 })}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ImageCropModal; 