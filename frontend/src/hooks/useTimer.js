import { useState, useEffect, useRef } from 'react';

export function useTimer(initialTime = 0, limit = null, onTimeUp = null) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          
          if (limit && newTime >= limit) {
            setIsRunning(false);
            if (onTimeUp) onTimeUp();
            return limit;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, limit, onTimeUp]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = (newTime = 0) => {
    setTime(newTime);
    setIsRunning(false);
  };

  return { time, isRunning, start, stop, reset, setTime };
}
