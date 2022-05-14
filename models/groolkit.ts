import { Path, Line, FOV, Flood } from '@znuznu/groolkit';
import { Position, Tile } from './playground';

export type GkResult =
  | Path.PathResult
  | Line.LineResult
  | FOV.FOVResult
  | Flood.FloodResult;

const pathAlgorithms = ['astar4', 'astar8', 'dijkstra4', 'dijkstra8'] as const;
const lineAlgorithms = ['lineLerp'] as const;
const fovAlgorithms = ['rsc'] as const;
const floodAlgorithms = ['floodFill'] as const;

type FloodAlgorithm = typeof floodAlgorithms[number];
type PathAlgorithm = typeof pathAlgorithms[number];
type FOVAlgorithm = typeof fovAlgorithms[number];
type LineAlgorithm = typeof lineAlgorithms[number];

export type GkAlgorithm = PathAlgorithm | FOVAlgorithm | FloodAlgorithm | LineAlgorithm;

export const twoCursorsAlgorithms = [...pathAlgorithms, ...lineAlgorithms];
export const oneCursorAlgorithms = [...floodAlgorithms, ...fovAlgorithms];

export function isFov(algorithm: string): algorithm is FOVAlgorithm {
  return (fovAlgorithms as readonly string[]).includes(algorithm);
}

export function isPath(algorithm: string): algorithm is PathAlgorithm {
  return (pathAlgorithms as readonly string[]).includes(algorithm);
}

export function isFlood(algorithm: string): algorithm is FloodAlgorithm {
  return (floodAlgorithms as readonly string[]).includes(algorithm);
}

export function isLine(algorithm: string): algorithm is LineAlgorithm {
  return (lineAlgorithms as readonly string[]).includes(algorithm);
}

export const getFovResult = ({
  algorithm,
  grid,
  callback,
  position
}: {
  algorithm: FOVAlgorithm;
  grid: Tile[][];
  callback: (t: Tile) => boolean;
  position: Position;
}): GkResult => {
  switch (algorithm) {
    case 'rsc':
      return new FOV.RecursiveShadowCasting(grid, callback).compute(position);
  }
};

export const getFloodResult = ({
  algorithm,
  grid,
  callback,
  position
}: {
  algorithm: FloodAlgorithm;
  grid: Tile[][];
  callback: (t: Tile) => boolean;
  position: Position;
}): GkResult => {
  switch (algorithm) {
    case 'floodFill':
      return new Flood.FloodFill(grid, callback).process(position);
  }
};

export const getPathResult = ({
  algorithm,
  grid,
  callback,
  start,
  end
}: {
  algorithm: PathAlgorithm;
  grid: Tile[][];
  callback: (n: Tile) => boolean;
  start: Position;
  end: Position;
}): GkResult => {
  let path: Path.Path<Tile> | undefined = undefined;

  switch (algorithm) {
    case 'astar4':
      path = new Path.AStar(grid, { type: 4 }, callback);
      break;
    case 'astar8':
      path = new Path.AStar(grid, { type: 8 }, callback);
      break;
    case 'dijkstra4':
      path = new Path.Dijkstra(grid, { type: 4 }, callback);
      break;
    case 'dijkstra8':
      path = new Path.Dijkstra(grid, { type: 8 }, callback);
      break;
  }

  path.init();

  return path.search(start, end);
};

export const getLineResult = ({
  algorithm,
  grid,
  callback,
  start,
  end
}: {
  algorithm: LineAlgorithm;
  grid: Tile[][];
  callback: (n: Tile) => boolean;
  start: Position;
  end: Position;
}) => {
  let line = undefined;

  switch (algorithm) {
    case 'lineLerp':
      line = new Line.LineLerp(grid, callback);
      break;
  }

  return line.process(start, end);
};
