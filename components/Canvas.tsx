import useCanvas from '../hooks/useCanvas';
import style from '../styles/Canvas.module.css';

export type DrawFn = (context: CanvasRenderingContext2D) => void;

type CanvasProps = {
  draw: DrawFn;
  size: { width: number; height: number };
};

const Canvas = ({ draw, size }: CanvasProps) => {
  const canvasRef = useCanvas(draw);

  return (
    <canvas
      ref={canvasRef}
      width={`${size.width}`}
      height={`${size.height}`}
      className={style.canvas}
      // onClick={handleClick}
      // onPointerMove={handleMov}
      // onPointerOut={handleOutCanvas}
    />
  );
};

export default Canvas;
