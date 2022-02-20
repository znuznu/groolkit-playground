import { useRef, useEffect } from 'react';
import { DrawFn } from '../components/Canvas';

const useCanvas = (draw: DrawFn) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // @ts-ignore TODO
    const context = canvas.getContext('2d');

    const render = () => {
      draw(context);
    };

    render();
  }, [draw]);

  return canvasRef;
};

export default useCanvas;
