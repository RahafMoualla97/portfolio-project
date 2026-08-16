import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

/**
 * ImageCropper component - Allows users to crop an image before uploading.
 *
 * @param {Object} props
 * @param {string} props.image - The image URL to crop
 * @param {Function} props.onCropComplete - Callback when crop is saved, receives the cropped file
 * @param {Function} props.onCancel - Callback when user cancels cropping
 */
const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  /**
   * Initialize the crop area when the image loads.
   * Creates a centered square crop of 50% width.
   */
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        1, // 1:1 aspect ratio (square)
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  /**
   * Generate the cropped image as a File object and pass it to the parent.
   */
  const handleCropComplete = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });
          onCropComplete(file);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Profile Image</h3>
        <p className="text-sm text-gray-500 mb-4">Drag to crop, resize the selection</p>

        <div className="flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            className="max-h-[50vh]"
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop preview"
              onLoad={onImageLoad}
              crossOrigin="anonymous"
              className="max-h-[50vh] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;