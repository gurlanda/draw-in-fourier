import React from 'react';
import FourierRing from './FourierRing';
import PositionBroadcaster from './PositionBroadcaster';
import RingParams from '../util/RingParams';

/**
 * A nested set of FourierRings. The most deeply-nested FourierRing contains a PositionBroadcaster and acts as the cursor. The number of nested rings is equal to the length of ringParams.
 * @param ringParams - An array specifying the initial conditions for each FourierRing.
 */
const FourierRingStack: React.FC<{ ringParams: RingParams[] }> = ({
  ringParams,
}) => {
  const createRingStack = (ringParams: RingParams[]): React.ReactNode => {
    // The bottom of the stack contains a PositionBroadcaster. This allows the deepest ring to act as the cursor.
    if (ringParams.length === 0) {
      return <PositionBroadcaster />;
    }

    return (
      <FourierRing
        angularVelocityMillisec={ringParams[0].angularVelocityMillisec}
        radiusPx={ringParams[0].radiusPx}
        initialAngleDeg={ringParams[0].initialAngleDeg}
      >
        {createRingStack(ringParams.slice(1))}
      </FourierRing>
    );
  };

  return <div className="relative">{createRingStack(ringParams)}</div>;
};

export default FourierRingStack;
