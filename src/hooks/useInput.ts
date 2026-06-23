import { useEffect } from 'react';
import type { Keys } from '../types';

// Global input state that can be mutated by keyboard or touch controls
export const inputState: Keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  handbrake: false,
  interact: false,
  wheelie: false,
  horn: false,
};

export const useInput = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputState.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputState.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputState.right = true;
          break;
        case 'Space':
          inputState.handbrake = true;
          e.preventDefault();
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          inputState.wheelie = true;
          break;
        case 'Enter':
          inputState.interact = true;
          break;
        case 'KeyH':
          inputState.horn = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputState.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputState.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputState.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputState.right = false;
          break;
        case 'Space':
          inputState.handbrake = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          inputState.wheelie = false;
          break;
        case 'Enter':
          inputState.interact = false;
          break;
        case 'KeyH':
          inputState.horn = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return inputState;
};
