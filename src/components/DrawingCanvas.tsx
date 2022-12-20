import React, { useContext, useEffect, useRef } from 'react';
import CursorContext from '../context/Cursor/CursorContext';
import Point from '../util/Point';

const DrawingCanvas: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseCursorPositions = useRef<Point[]>([new Point()]); // Save the user-drawn curve for later analysis
  const canvasPosition = useRef<Point | null>(null);
  const callbackId = useRef<number>(0); // Used to cancel the animation during cleanup
  const lastOrbitingCursorPosition = useRef<Point>(new Point());

  const cursorContext = useContext(CursorContext);

  // Set the last cursor position using a mouse event, then return it
  const setLastPosition = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ): Point => {
    const newPoint = new Point(e.clientX, e.clientY);
    mouseCursorPositions.current.push(newPoint);
    return newPoint;
  };

  // Save the position of the canvas within the page
  const initializeCanvasPosition = () => {
    if (!canvasRef.current) {
      return;
    }

    // Used to get the position of the canvas on the page
    const boundingRect = canvasRef.current.getBoundingClientRect();
    canvasPosition.current = new Point(boundingRect.x, boundingRect.y);
  };

  // Draw on the canvas on pointerDown
  const draw: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    // Only allow the left mouse button
    if (e.buttons !== 1) {
      return;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }

    if (!canvasPosition.current) {
      initializeCanvasPosition();
    }

    // Begin drawing
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00e1e1'; // Cyan

    // Set starting point of stroke
    const lastPoint =
      mouseCursorPositions.current[mouseCursorPositions.current.length - 1];
    ctx.moveTo(
      lastPoint.x - canvasPosition.current!.x,
      lastPoint.y - canvasPosition.current!.y
    );

    // Save the current position
    const currentPoint = setLastPosition(e);

    // Set the end point of the stroke
    ctx.lineTo(
      currentPoint.x - canvasPosition.current!.x,
      currentPoint.y - canvasPosition.current!.y
    );

    // Draw the stroke
    ctx.stroke();
  };

  // Set the position of the cursor
  const setPosition: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    setLastPosition(e);
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) {
      return;
    }

    // Initialize canvas positioning and size
    initializeCanvasPosition();
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    // Resize the canvas on any resizing event
    const observer = new ResizeObserver(() => {
      if (!canvasRef.current) {
        return;
      }

      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
    });
    observer.observe(canvasRef.current);

    // Trace the cursor's path
    const traceCursorPath = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !cursorContext) {
        // Try again next frame

        callbackId.current = requestAnimationFrame(traceCursorPath);
        return;
      }

      if (!canvasPosition.current) {
        initializeCanvasPosition();
      }

      // Begin drawing
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#00e1e1'; // Cyan

      // Set starting point of stroke to the last cursor position
      ctx.moveTo(
        lastOrbitingCursorPosition.current.x - canvasPosition.current!.x,
        lastOrbitingCursorPosition.current.y - canvasPosition.current!.y
      );

      // console.dir({
      //   'Old position:': lastCursorPosition.current,
      // });
      lastOrbitingCursorPosition.current =
        cursorContext.getCursorPosition() ?? new Point();
      // console.dir({ 'New position:': lastCursorPosition.current });

      // Set the end point of the stroke to the current cursor position
      ctx.lineTo(
        lastOrbitingCursorPosition.current.x - canvasPosition.current!.x,
        lastOrbitingCursorPosition.current.y - canvasPosition.current!.y
      );

      // Draw the stroke
      ctx.stroke();

      callbackId.current = requestAnimationFrame(traceCursorPath);
    };
    callbackId.current = requestAnimationFrame(traceCursorPath);

    // Cleanup
    return () => {
      // Disconnect the ResizeObserver on cleanup
      observer.disconnect();

      // Cancel the animation
      cancelAnimationFrame(callbackId.current);
    };
  }, [cursorContext]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={setPosition}
      onPointerMove={draw}
      className="absolute block"
    >
      {children}
    </canvas>
  );
};

export default DrawingCanvas;
