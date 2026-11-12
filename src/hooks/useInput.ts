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
  reset: false,
  cameraToggle: false,
  garage: false,
};

export const useInput = () => {
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const tag = (target as HTMLElement | null)?.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
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
        case 'KeyE':
        case 'Enter':
          inputState.interact = true;
          break;
        case 'KeyC':
          inputState.cameraToggle = true;
          break;
        case 'KeyG':
          inputState.garage = true;
          break;
        case 'KeyH':
          inputState.horn = true;
          break;
        case 'KeyR':
        case 'Backspace':
          inputState.reset = true;
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
        case 'KeyE':
        case 'Enter':
          inputState.interact = false;
          break;
        case 'KeyC':
          inputState.cameraToggle = false;
          break;
        case 'KeyG':
          inputState.garage = false;
          break;
        case 'KeyH':
          inputState.horn = false;
          break;
        case 'KeyR':
        case 'Backspace':
          inputState.reset = false;
          break;
      }
    };

    const resetKeys = () => {
      inputState.forward = false;
      inputState.backward = false;
      inputState.left = false;
      inputState.right = false;
      inputState.handbrake = false;
      inputState.interact = false;
      inputState.wheelie = false;
      inputState.horn = false;
      inputState.reset = false;
      inputState.cameraToggle = false;
      inputState.garage = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetKeys);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetKeys);
    };
  }, []);

  return inputState;
};
