import React, { useState } from 'react';
import CursorContext, { CursorContextState } from './CursorContext';
import Point from './Point';

const CursorContextProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CursorContextState>(
    new CursorContextState()
  );

  // Update the position of the broadcaster
  const updateCursorPosition = (): Point | null => {
    if (!state.positionBroadcastCallback) {
      return null;
    }

    const newPosition = state.positionBroadcastCallback();

    // Update the state without mutating
    const newState = state.cloneTransformCursorPosition(newPosition);
    setState(newState);
    console.log('updateCursorPosition()');
    // console.log(state);
    return newPosition;
  };

  // Allows the broadcaster to set the callback used to update its position
  const setPositionBroadcastCallback = (callback: { (): Point }) => {
    const newState = state.cloneTransformPositionCallback(callback);
    console.log('setPositionUpdateCallback()');
    // newState.flag = 'Changed!';
    // console.log(newState.flag);
    // newState.updateCursorPositionCallback();
    setState(newState);
  };

  const providedMethods = {
    updateCursorPosition,
    setPositionBroadcastCallback,
  };

  return (
    <CursorContext.Provider value={{ state, ...providedMethods }}>
      {children}
    </CursorContext.Provider>
  );
};

export default CursorContextProvider;
