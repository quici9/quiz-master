import { useEffect } from 'react';

export function useKeyboard(keyMap) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if typing in input/textarea
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const handler = keyMap[event.key];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keyMap]);
}
