import { Path, Line, FOV, Flood } from '@znuznu/groolkit';

export type GkResult =
  | Path.PathResult
  | Line.LineResult
  | FOV.FOVResult
  | Flood.FloodResult;

type PathAlgorithm = 'astar4' | 'astar8' | 'dijkstra4' | 'dijkstra8';
type FOVAlgorithm = 'rsc';
type FloodAlgorithm = 'floodFill';
type LineAlgorithm = 'lineLerp';

export type GkAlgorithm = PathAlgorithm | FOVAlgorithm | FloodAlgorithm | LineAlgorithm;
