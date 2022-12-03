import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const Circle: React.FC<{
  children?: ReactNode;
  speedMs: number;
  magnitude: number;
  argumentDeg: number;
}> = ({ speedMs, magnitude, argumentDeg, children }) => {
  const ringWidth = 8;
  const direction = -1;
  const orbit = keyframes`
  from {
  transform: rotate(${-argumentDeg * direction}deg) translate(${
    magnitude - ringWidth / 2
  }px) rotate(${argumentDeg * direction}deg);
  }
  to {
  transform: rotate(${-(argumentDeg + 360) * direction}deg) translate(${
    magnitude - ringWidth / 2
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
    height: ${magnitude * 2}px;
    width: ${magnitude * 2}px;
    border-width: ${ringWidth}px;
    top: ${-(magnitude - planetRadius)}px;
    left: ${-(magnitude - planetRadius)}px;
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
