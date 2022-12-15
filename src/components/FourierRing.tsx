import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * A cursor moving along a ring. The cursor can have children that will move along with the cursor.
 *
 * @param children - The children of this component, which will rotate with the circle.
 * @param angularVelocityMillisec - The velocity of rotation in milliseconds. Positive values specify counterclockwise rotation and negative values specify clockwise rotation.
 * @param radiusPx - The radius of the circle in pixels
 * @param initialAngleDeg - The starting angle in degrees, measured from the horizontal axis (x-axis)
 */
const FourierRing: React.FC<{
  children?: ReactNode;
  angularVelocityMillisec: number;
  radiusPx: number;
  initialAngleDeg: number;
}> = ({ angularVelocityMillisec, radiusPx, initialAngleDeg, children }) => {
  const ringWidthPx = 2;
  const cursorRadiusPx = 5;
  let rotationDirection: number;
  let angularSpeedMillisec: number;
  if (angularVelocityMillisec >= 0) {
    rotationDirection = 1;
    angularSpeedMillisec = angularVelocityMillisec;
  } else {
    rotationDirection = -1;
    angularSpeedMillisec = -angularVelocityMillisec;
  }

  /*
    Explanation of the transform:
    We have:
    transform: rotate(angle) translate(circleRadius - ringWidth / 2) rotate(-angle);

    The translation moves the cursor to the middle of the ring.

    The first rotation applies the angle of rotation, but also rotates the cursor. This would cause the cursor to rotate as it orbits, which we don't want. The second rotation corrects this.

    In-depth explanation here: https://www.useragentman.com/blog/2013/03/03/animating-circular-paths-using-css3-transitions/
  */

  const orbitAnimation = keyframes`
    from {
      transform: 
        rotate(${-initialAngleDeg * rotationDirection}deg) 
        translate(${radiusPx - ringWidthPx / 2}px) 
        rotate(${initialAngleDeg * rotationDirection}deg);
    }
    to {
      transform: 
        rotate(${-(initialAngleDeg + 360) * rotationDirection}deg) 
        translate(${radiusPx - ringWidthPx / 2}px) 
        rotate(${(initialAngleDeg + 360) * rotationDirection}deg);
    }
  `;

  const OrbitingCursor = styled.div`
    height: ${cursorRadiusPx * 2}px;
    width: ${cursorRadiusPx * 2}px;
    animation: ${orbitAnimation} ${angularSpeedMillisec}ms linear infinite;
  `;

  const Ring = styled.div`
    height: ${radiusPx * 2}px;
    width: ${radiusPx * 2}px;
    border-width: ${ringWidthPx}px;
    top: ${-(radiusPx - cursorRadiusPx)}px;
    left: ${-(radiusPx - cursorRadiusPx)}px;
  `;

  return (
    <Ring className="rounded-full border-blue-600 flex justify-center items-center relative z-10">
      <OrbitingCursor className="rounded-full bg-yellow-500 absolute">
        {children}
      </OrbitingCursor>
    </Ring>
  );
};

export default FourierRing;
