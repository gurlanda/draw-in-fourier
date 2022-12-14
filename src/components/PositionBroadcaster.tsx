import React, { useContext, useEffect, useRef } from 'react';
import CursorContext from '../context/Cursor/CursorContext';
import Point from '../util/Point';

// This component will broadcast its position within the viewport
// In particular, we will use this component to give other components access to the position of a FourierRing's cursor
const PositionBroadcaster: React.FC<{}> = () => {
  const cursorContext = useContext(CursorContext);
  const divRef = useRef<HTMLDivElement>(null);
  // const animationCallbackId = useRef<number>(0);

  useEffect(() => {
    if (!cursorContext) {
      return;
    }

    // This callback allows other components (in particular, the canvas) to request the broadcaster's position in the page
    const broadcastCursorPosition = (): Point => {
      if (!divRef.current) {
        return new Point();
      }

      // Allows us to get the position of the Cursor relative to the viewport
      const boundingClientRect = divRef.current.getBoundingClientRect();

      // prettier-ignore
      const position = new Point(
        boundingClientRect.x,
        boundingClientRect.y
      );

      return position;
    };
    cursorContext.setPositionBroadcastCallback(broadcastCursorPosition);
    // eslint-disable-next-line
  }, []);

  if (!cursorContext) {
    return <div ref={divRef}></div>;
  }

  return <div ref={divRef}></div>;
};

export default PositionBroadcaster;
