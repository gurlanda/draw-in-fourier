import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const Circle: React.FC<{
  children?: ReactNode;
  speedMs: number;
  magnitudePx: number;
  argumentDeg: number;
}> = ({ speedMs, magnitudePx, argumentDeg, children }) => {
  // If speedMs is negative, reverse the direction of rotation
  // (Positive rotation <=> speedMs > 0
  //  Negative rotation <=> speedMs < 0)
  let direction = 1;
  if (speedMs < 0) {
    direction = -1;
    speedMs = -speedMs; // After this line, speedMs will represent the magnitude of angular velocity (i.e. it will lose its direction)
  }

  const ringWidth = 8;
  const orbit = keyframes`
  from {
  transform: rotate(${-argumentDeg * direction}deg) translate(${
    magnitudePx - ringWidth / 2
  }px) rotate(${argumentDeg * direction}deg);
  }
  to {
  transform: rotate(${-(argumentDeg + 360) * direction}deg) translate(${
    magnitudePx - ringWidth / 2
  }px) rotate(${(argumentDeg + 360) * direction}deg);
  }
  `;

  const planetRadius = 10;
  const OrbitingPlanet = styled.div`
    height: ${planetRadius * 2}px;
    width: ${planetRadius * 2}px;
    animation: ${orbit} ${speedMs}ms linear infinite;
  `;

  const Ring = styled.div`
    height: ${magnitudePx * 2}px;
    width: ${magnitudePx * 2}px;
    border-width: ${ringWidth}px;
    top: ${-(magnitudePx - planetRadius)}px;
    left: ${-(magnitudePx - planetRadius)}px;
  `;

  return (
    <Ring className="rounded-full border-blue-600 flex justify-center items-center relative">
      <OrbitingPlanet className="rounded-full bg-yellow-500 absolute">
        {children}
      </OrbitingPlanet>
    </Ring>
  );
};

export default Circle;
