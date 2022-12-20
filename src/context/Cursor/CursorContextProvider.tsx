import React, { useState } from 'react';
import CursorContext, { CursorContextState } from './CursorContext';
import Point from '../../util/Point';

const CursorContextProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CursorContextState>(
    new CursorContextState()
  );

  // Get the current position of the broadcaster
  const getCursorPosition = (): Point | null => {
    if (!state.positionBroadcastCallback) {
      return null;
    }

    const newPosition = state.positionBroadcastCallback();
    return newPosition;
  };

  // Allows the broadcaster to set the callback used to retrieve its position
  const setPositionBroadcastCallback = (callback: { (): Point }) => {
    const newState = state.cloneTransformPositionCallback(callback);
    setState(newState);
  };

  const providedMethods = {
    getCursorPosition,
    setPositionBroadcastCallback,
  };

  return (
    <CursorContext.Provider value={{ state, ...providedMethods }}>
      {children}
    </CursorContext.Provider>
  );
};

export default CursorContextProvider;
