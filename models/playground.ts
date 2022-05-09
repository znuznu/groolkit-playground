export type Position = {
  x: number;
  y: number;
};

export enum TileKind {
  BLOCK,
  EMPTY
}

export type Tile = {
  // The type of tile, empty or block (wall for example)
  kind: TileKind;

  // 2D position of the Tile in the grid
  position: Position;

  // Whether this tile is crossed by a path or an algorithm
  isCrossed: boolean;
};
