import React, { useEffect, useRef } from 'react';

const DrawingCanvas: React.FC<{}> = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const context = ref.current.getContext('2d');
      if (!context) {
        return;
      }

      const canvasWidth = ref.current.width;
      const canvasHeight = ref.current.height;

      const imageData = context.createImageData(canvasWidth, canvasHeight);

      // Loop over all the pixels
      for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
          const pixelIndex = (y * canvasWidth + x) * 4;

          // Set the color of the pixel to be pure green
          imageData.data[pixelIndex] = 255; // Red component
          imageData.data[pixelIndex + 1] = 255; // Green component
          imageData.data[pixelIndex + 2] = 0; // Blue component
          imageData.data[pixelIndex + 3] = 255; // Alpha component
        }
      }

      // Update the canvas
      context.putImageData(imageData, 0, 0);
    }
  });

  return <canvas ref={ref}></canvas>;
};

export default DrawingCanvas;
