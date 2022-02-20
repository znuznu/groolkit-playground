import React, { useEffect, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import Result from './Result';
import Selector from './Selector';
import { GkAlgorithm } from '../models/groolkit';
import Canvas, { DrawFn } from './Canvas';

const TILE_SIZE_PX = 24;

const getEmptyGrid = (cols: number, rows: number): number[][] => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
};

const getGridCanvasWidth = (grid: any[][]) => {
  return grid[0].length * TILE_SIZE_PX + grid[0].length;
};

const getGridCanvasHeight = (grid: any[][]) => {
  return grid.length * TILE_SIZE_PX + grid.length;
};

const Playground = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<GkAlgorithm>('astar4');
  const [grid, setGrid] = useState(getEmptyGrid(24, 24));
  const [canvasWidth, setCanvasWidth] = useState(getGridCanvasWidth(grid));
  const [canvasHeight, setCanvasHeight] = useState(getGridCanvasHeight(grid));

  useEffect(() => {
    setCanvasWidth(getGridCanvasWidth(grid));
    setCanvasHeight(getGridCanvasHeight(grid));
  }, [grid]);

  const clear: DrawFn = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  };

  const drawGridLines: DrawFn = (context: CanvasRenderingContext2D) => {
    clear(context);
    context.fillStyle = '#000000';
    context.globalAlpha = 0.1;
    context.beginPath();

    for (let x = 1; x < grid[0].length; x++) {
      context.moveTo(x * TILE_SIZE_PX + 1 * x, 0);
      context.lineTo(x * TILE_SIZE_PX + 1 * x, getGridCanvasHeight(grid));
    }

    for (let y = 1; y < grid.length; y++) {
      context.moveTo(0, y * TILE_SIZE_PX + 1 * y);
      context.lineTo(getGridCanvasWidth(grid), y * TILE_SIZE_PX + 1 * y);
    }

    context.stroke();
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setCurrentAlgorithm(event.target.value);
  };

  useEffect(() => {}, [currentAlgorithm]);

  return (
    <Flex>
      <Flex
        mx={'auto'}
        justifyContent={'center'}
        borderRadius="lg"
        borderWidth="1px"
        mt={5}
        p={5}
      >
        <Box mr={5}>
          <Selector onChange={handleSelectChange} />
          <Result result={undefined} />
        </Box>
        <Canvas
          draw={drawGridLines}
          size={{
            width: canvasWidth,
            height: canvasHeight
          }}
        />
      </Flex>
    </Flex>
  );
};

export default Playground;
