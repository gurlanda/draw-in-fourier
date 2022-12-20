import React from 'react';
import Point from '../../util/Point';

export class CursorContextState {
  // Used to get the position of the PositionBroadcaster
  positionBroadcastCallback: { (): Point } | null = null;

  // Returns a deep copy of this instance
  clone(): CursorContextState {
    const newState = new CursorContextState();
    newState.positionBroadcastCallback = this.positionBroadcastCallback;
    return newState;
  }

  // Clone this state instance, but change the callback stored in the clone to newCallback
  // Allows us to change the callback without mutating the state
  cloneTransformPositionCallback(newCallback: {
    (): Point;
  }): CursorContextState {
    const newState = this.clone();

    newState.positionBroadcastCallback = newCallback;

    return newState;
  }
}

export interface CursorContextInterface {
  state: CursorContextState;
  getCursorPosition(): Point | null;
  setPositionBroadcastCallback(callback: { (): Point }): void;
}

const CursorContext = React.createContext<CursorContextInterface | null>(null);

export default CursorContext;
