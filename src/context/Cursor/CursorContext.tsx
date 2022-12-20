import React from 'react';
import Point from './Point';

export class CursorContextState {
  cursorPosition: Point;

  // Used to get the position of the PositionBroadcaster
  positionBroadcastCallback: { (): Point } | null = null;

  constructor(cursorXPosition: number = 0, cursorYPosition: number = 0) {
    this.cursorPosition = new Point(cursorXPosition, cursorYPosition);
  }

  // Returns a deep copy of this instance
  clone(): CursorContextState {
    const newState = new CursorContextState(
      this.cursorPosition.x,
      this.cursorPosition.y
    );

    newState.positionBroadcastCallback = this.positionBroadcastCallback;

    return newState;
  }

  // Clone this state instance, but change the position stored in the clone to newPosition
  // Allows us to change the position without mutating the state
  cloneTransformCursorPosition(newPosition: Point): CursorContextState {
    const newState = this.clone();
    newState.cursorPosition = newPosition;
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
  updateCursorPosition(): Point | null;
  setPositionBroadcastCallback(callback: { (): Point }): void;
}

const CursorContext = React.createContext<CursorContextInterface | null>(null);

export default CursorContext;
