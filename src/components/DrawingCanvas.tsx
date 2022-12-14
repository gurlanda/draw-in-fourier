import React, { useEffect, useRef } from 'react';

const DrawingCanvas: React.FC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasPosition = useRef<{ x: number; y: number } | null>(null);

  // Set the last cursor position using a mouse event
  const setLastPosition = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    lastPosition.current.x = e.clientX;
    lastPosition.current.y = e.clientY;
  };

  // Save the position of the canvas within the page
  const initializeCanvasPosition = () => {
    if (!canvasRef.current) {
      return;
    }

    // Used to get the position of the canvas on the page
    const boundingRect = canvasRef.current.getBoundingClientRect();
    canvasPosition.current = {
      x: boundingRect.x,
      y: boundingRect.y,
    };
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    initializeCanvasPosition();

    const context = canvasRef.current.getContext('2d');
    if (!context) {
      return;
    }

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    // An ImageData object allows us to modify the pixel data of the canvas
    const imageData = context.createImageData(canvasWidth, canvasHeight);

    // Loop over all the pixels and draw them cyan
    for (let x = 0; x < canvasWidth; x++) {
      for (let y = 0; y < canvasHeight; y++) {
        const pixelIndex = (y * canvasWidth + x) * 4;

        // Set the color of the pixel to be cyan
        imageData.data[pixelIndex] = 0; // Red component
        imageData.data[pixelIndex + 1] = 225; // Green component
        imageData.data[pixelIndex + 2] = 225; // Blue component
        imageData.data[pixelIndex + 3] = 255; // Alpha component
      }
    }

    // Update the canvas
    context.putImageData(imageData, 0, 0);
  }, []);

  // Draw on the canvas using the pointer
  const draw: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    // Only allow the left mouse button
    console.log(e);
    if (e.buttons !== 1) {
      return;
    }

    const canvasContext = canvasRef.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    if (!canvasPosition.current) {
      initializeCanvasPosition();
    }

    // Begin drawing
    canvasContext.beginPath();
    canvasContext.lineWidth = 2;
    canvasContext.lineCap = 'round';
    canvasContext.strokeStyle = '#c0392b';

    // Set starting point of stroke
    canvasContext.moveTo(
      lastPosition.current.x - canvasPosition.current!.x,
      lastPosition.current.y - canvasPosition.current!.y
    );

    // Save the current position
    setLastPosition(e);
    console.log(lastPosition.current);

    // Set the end point of the stroke
    canvasContext.lineTo(
      e.clientX - canvasPosition.current!.x,
      e.clientY - canvasPosition.current!.y
    );

    // Draw the stroke
    canvasContext.stroke();
  };

  // Set the position of the cursor
  const setPosition: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    console.log(lastPosition.current);
    setLastPosition(e);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={setPosition}
      onPointerMove={draw}
    ></canvas>
  );
};

export default DrawingCanvas;
