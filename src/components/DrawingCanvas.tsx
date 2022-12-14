import React, { useEffect, useRef } from 'react';

const DrawingCanvas: React.FC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasPosition = useRef<{ x: number; y: number } | null>(null);
  const callbackId = useRef<number>(0); // Used to cancel the animation during cleanup

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

    const canvasWidth = (canvasRef.current.width = window.innerWidth / 2);
    const canvasHeight = (canvasRef.current.height = window.innerHeight);

    // An ImageData object allows us to modify the pixel data of the canvas
    const imageData = context.createImageData(canvasWidth, canvasHeight);

    // Draw an animation frame
    // Code credit: https://rembound.com/articles/drawing-pixels-with-html5-canvas-and-javascript#demo
    const createFrame = (seed: number) => {
      // Loop over all the pixels and draw them cyan
      for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
          const pixelIndex = (y * canvasWidth + x) * 4;

          // Generate a xor pattern with some random noise
          var red = (x + seed) % 256 ^ (y + seed) % 256;
          var green = (2 * x + seed) % 256 ^ (2 * y + seed) % 256;
          var blue = 50 + Math.floor(Math.random() * 100);

          // Rotate the colors
          blue = (blue + seed) % 256;

          // Set the color of the pixel to be cyan
          imageData.data[pixelIndex] = red; // Red component
          imageData.data[pixelIndex + 1] = green; // Green component
          imageData.data[pixelIndex + 2] = blue; // Blue component
          imageData.data[pixelIndex + 3] = 255; // Alpha component
        }
      }
    };

    const animationLoop = (timestamp: number) => {
      // Use the animation timestamp to calculate the seed
      // If we feed in the timestamp directly into createFrame, the animation goes too fast
      const seed = Math.floor(timestamp / 10);
      createFrame(seed);

      // Update the canvas
      context.putImageData(imageData, 0, 0);

      // Keep track of the animation callback ID for cleanup
      callbackId.current = requestAnimationFrame(animationLoop);
    };

    // Begin animating
    callbackId.current = requestAnimationFrame(animationLoop);

    // Cancel the animation during cleanup
    return () => cancelAnimationFrame(callbackId.current);
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
