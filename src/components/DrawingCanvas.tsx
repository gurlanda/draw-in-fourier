import React, { useContext, useEffect, useRef } from 'react';
import CursorContext from '../context/Cursor/CursorContext';
import Point from '../util/Point';

const DrawingCanvas: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Save the user-drawn curve for later analysis
  const mouseCursorPositions = useRef<Point[]>([new Point()]);

  const canvasPosition = useRef<Point | null>(null);

  // Used to cancel the animation during cleanup
  const callbackId = useRef<number>(0);

  const lastOrbitingCursorPosition = useRef<Point>(new Point());
  const cursorContext = useContext(CursorContext);

  /**
   * Save the last cursor position into state by using a mouse event, then return it.
   * @param e The mouse event to extract the cursor position from.
   * @returns The current position of the cursor.
   */
  const setLastPosition = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ): Point => {
    const newPoint = new Point(e.clientX, e.clientY);
    mouseCursorPositions.current.push(newPoint);
    return newPoint;
  }; // setLastPosition()

  /**
   * Get the position of the canvas' top-right corner within the page and save it into state.
   */
  const initializeCanvasPosition = (): void => {
    if (!canvasRef.current) {
      return;
    }

    // Used to get the position of the canvas on the page
    const boundingRect = canvasRef.current.getBoundingClientRect();
    canvasPosition.current = new Point(boundingRect.x, boundingRect.y);
  }; // initialCanvasPosition()

  /**
   * Draw a line segment on a canvas.
   * @param ctx The canvas context used to draw the line segment.
   * @param canvasPosition The position of the canvas within the page.
   * @param fromPoint The starting coordinates of the line segment, where the origin is the viewport origin.
   * @param toPoint The ending coordinates of the line segment, where the origin is the viewport origin.
   */
  function drawLineSegment(
    ctx: CanvasRenderingContext2D,
    canvasPosition: Point,
    fromPoint: Point,
    toPoint: Point
  ): void {
    // Set the drawing parameters
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00e1e1'; // Cyan

    // Set starting point of stroke
    ctx.moveTo(fromPoint.x - canvasPosition.x, fromPoint.y - canvasPosition.y);

    // Set the end point of the stroke
    ctx.lineTo(toPoint.x - canvasPosition.x, toPoint.y - canvasPosition.y);

    // Draw the stroke
    ctx.stroke();
  }

  /**
   * Draw on the canvas on pointerDown.
   * @param e The MouseEvent used to draw.
   */
  const drawWithPointer: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
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

    // Set starting point of stroke
    const lastPoint =
      mouseCursorPositions.current[
        mouseCursorPositions.current.length - 1
      ].clone();

    // Save the current position
    const currentPoint = setLastPosition(e);

    drawLineSegment(ctx, canvasPosition.current!, lastPoint, currentPoint);
  }; // draw()

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

    /**
     * On the canvas, draw the path of the cursor nested in the FourierRingStack (not the mouse pointer).
     */
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

      // Set the endpoints of the line segment to draw
      const fromPoint = lastOrbitingCursorPosition.current.clone();
      lastOrbitingCursorPosition.current =
        cursorContext.getCursorPosition() ?? new Point();
      const toPoint = lastOrbitingCursorPosition.current.clone();
      drawLineSegment(ctx, canvasPosition.current!, fromPoint, toPoint);

      callbackId.current = requestAnimationFrame(traceCursorPath);
    }; // traceCursorPath()
    callbackId.current = requestAnimationFrame(traceCursorPath);

    // Cleanup
    return () => {
      // Disconnect the ResizeObserver on cleanup
      observer.disconnect();

      // Cancel the animation
      cancelAnimationFrame(callbackId.current);
    }; // Cleanup
  }, [cursorContext]); // useEffect()

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) => {
        setLastPosition(e);
      }}
      onPointerMove={drawWithPointer}
      className="absolute block"
    >
      {children}
    </canvas>
  );
};

export default DrawingCanvas;
