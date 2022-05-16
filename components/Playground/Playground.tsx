import React, { useEffect, useState } from 'react';

import { Canvas, Vector3 } from '@react-three/fiber';

import { Box, Code, Flex } from '@chakra-ui/react';
import Result from '../Result';
import Selector from '../Selector';
import {
  getFloodResult,
  getFovResult,
  getLineResult,
  getPathResult,
  GkAlgorithm,
  GkResult,
  isFlood,
  isFov,
  isLine,
  isPath,
  oneCursorAlgorithms,
  twoCursorsAlgorithms
} from '../../models/groolkit';
import { OrbitControls, Environment, PerspectiveCamera, Sky } from '@react-three/drei';
import { Position, Tile, TileKind } from '../../models/playground';
import TileMesh from './TileMesh';
import useKeyPress from '../../hooks/useKeyPress';
import Controls from './Controls';

import dungeonPreset from '../../presets/dungeon';
import nonePreset from '../../presets/none';

const GRID_SIZE = 24;
const BUILD_CAMERA_V3: Vector3 = [0, 8.5, 0];
const DEFAULT_CAMERA_V3: Vector3 = BUILD_CAMERA_V3;

enum Mode {
  BUILD = 'BUILD',
  ALGORITHM = 'ALGORITHM'
}

export enum MouseButton {
  LEFT = 'LEFT',
  MIDDLE = 'MIDDLE',
  RIGHT = 'RIGHT'
}

const algorithmOptionGroups: {
  label: string;
  options: { value: GkAlgorithm; displayName: string }[];
}[] = [
  {
    label: 'FOV',
    options: [{ value: 'rsc', displayName: 'Recursive Shadow Casting' }]
  },
  {
    label: 'Path',
    options: [
      { value: 'astar4', displayName: 'A* (Orthogonal)' },
      { value: 'astar8', displayName: 'A* (Diagonal)' },
      { value: 'dijkstra4', displayName: 'Dijkstra (Orthogonal)' },
      { value: 'dijkstra8', displayName: 'Dijkstra (Diagonal)' }
    ]
  },
  {
    label: 'Flood',
    options: [{ value: 'floodFill', displayName: 'Flood filling' }]
  },
  {
    label: 'Line',
    options: [{ value: 'lineLerp', displayName: 'Linear interpolation' }]
  }
];

type Presets = 'dungeon' | 'none';
const presetsOptionGroups: {
  label?: string;
  options: { value: 'dungeon' | 'none'; displayName: string }[];
}[] = [
  {
    options: [
      { value: 'none', displayName: 'None' },
      { value: 'dungeon', displayName: 'Dungeon' }
    ]
  }
];

type Cursors = {
  first?: Position;
  second?: Position;
};

const Playground = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<GkAlgorithm>('astar4');
  const [currentPreset, setCurrentPreset] = useState<Presets>('none');
  const [grid, setGrid] = useState(nonePreset);
  const [canvasSize] = useState(500);
  const [result, setResult] = useState<GkResult | undefined>(undefined);
  const [cursors, setCursors] = useState<Cursors>({
    first: undefined,
    second: undefined
  });
  const [gridOffset] = useState(GRID_SIZE / 2);
  const [mode, setMode] = useState(Mode.ALGORITHM);
  const bPressed = useKeyPress('b');
  const [pointerDown, setPointerDown] = useState(false);
  const [lastButtonPressed, setLastButtonPressed] = useState<MouseButton | undefined>(
    undefined
  );

  const handleBuildRightButton = (tile: Tile) => {
    // TODO single array to avoid that
    const clone = JSON.parse(JSON.stringify(grid));
    clone[tile.position.x][tile.position.y].kind = TileKind.EMPTY;
    setGrid(clone);
  };

  const handleBuildLeftButton = (tile: Tile) => {
    // TODO single array to avoid that
    const clone = JSON.parse(JSON.stringify(grid));
    clone[tile.position.x][tile.position.y].kind = TileKind.BLOCK;
    setGrid(clone);
  };

  const handleClick = (tile: Tile, button: MouseButton) => {
    if (mode === Mode.ALGORITHM) {
      switch (button) {
        case MouseButton.LEFT:
          handleAlgorithm(tile);
          return;
      }
    }

    if (mode === Mode.BUILD) {
      switch (button) {
        case MouseButton.LEFT:
          handleBuildLeftButton(tile);
          return;
        case MouseButton.RIGHT:
          handleBuildRightButton(tile);
          return;
      }
    }
  };

  const handleBuildHover = (tile: Tile, button: MouseButton) => {
    if (button == MouseButton.MIDDLE) {
      return;
    }

    const replaceTileKind = button === MouseButton.LEFT ? TileKind.BLOCK : TileKind.EMPTY;

    // TODO single array to avoid that
    const clone = JSON.parse(JSON.stringify(grid));
    clone[tile.position.x][tile.position.y].kind = replaceTileKind;
    setGrid(clone);
  };

  // Update cursors
  const handleAlgorithm = (tile: Tile) => {
    // @ts-ignore type safe
    if (twoCursorsAlgorithms.includes(currentAlgorithm)) {
      if (!cursors.first) {
        setCursors({ first: tile.position });
        return;
      }

      if (!cursors.second) {
        setCursors({ ...cursors, second: tile.position });
        return;
      }

      setCursors({ first: cursors.second, second: tile.position });
      return;
    }

    // @ts-ignore type safe
    if (oneCursorAlgorithms.includes(currentAlgorithm)) {
      setCursors({ first: tile.position });
    }
  };

  const handleHover = (tile: Tile) => {
    if (mode === Mode.BUILD && pointerDown) {
      handleBuildHover(tile, lastButtonPressed ?? MouseButton.MIDDLE);
    }
  };

  const handleSelectAlgorithmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setCurrentAlgorithm(event.target.value);
  };

  const handleSelectPresetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setCurrentPreset(event.target.value);
  };

  const isTileCrossed = (tile: Tile): boolean => {
    if (!result?.positions) {
      return false;
    }

    return result.positions.some(
      (position) => position.x === tile.position.x && position.y === tile.position.y
    );
  };

  useEffect(() => {
    if (bPressed) {
      setMode(mode === Mode.BUILD ? Mode.ALGORITHM : Mode.BUILD);
    }
  }, [bPressed]);

  useEffect(() => {
    // @ts-ignore type safe
    if (oneCursorAlgorithms.includes(currentAlgorithm)) {
      if (cursors.first) {
        if (isFov(currentAlgorithm)) {
          const result = getFovResult({
            algorithm: currentAlgorithm,
            grid,
            callback: (t: Tile) => t.kind === TileKind.EMPTY,
            position: cursors.first
          });

          setResult(result);
          return;
        }

        if (isFlood(currentAlgorithm)) {
          const result = getFloodResult({
            algorithm: currentAlgorithm,
            grid,
            callback: (t: Tile) => t.kind === TileKind.EMPTY,
            position: cursors.first
          });

          setResult(result);
          return;
        }
      }

      return;
    }

    // @ts-ignore type safe
    if (twoCursorsAlgorithms.includes(currentAlgorithm)) {
      if (cursors.first && cursors.second) {
        if (isPath(currentAlgorithm)) {
          const result = getPathResult({
            algorithm: currentAlgorithm,
            grid,
            callback: (t: Tile) => t.kind === TileKind.BLOCK,
            start: cursors.first,
            end: cursors.second
          });

          setResult(result);
          return;
        }

        if (isLine(currentAlgorithm)) {
          const result = getLineResult({
            algorithm: currentAlgorithm,
            grid,
            callback: (t: Tile) => t.kind === TileKind.BLOCK,
            start: cursors.first,
            end: cursors.second
          });

          setResult(result);
          return;
        }
      }
    }
  }, [cursors, grid, currentAlgorithm]);

  useEffect(() => {
    setCursors({ first: undefined, second: undefined });
    setResult(undefined);
  }, [currentAlgorithm]);

  useEffect(() => {
    setCursors({ first: undefined, second: undefined });
    setResult(undefined);

    switch (currentPreset) {
      case 'none':
        setGrid(nonePreset);
        break;
      case 'dungeon':
        setGrid(dungeonPreset);
        break;
    }
  }, [currentPreset]);

  useEffect(() => {
    setCursors({ first: undefined, second: undefined });
    setResult(undefined);
  }, [mode]);

  return (
    <Flex>
      <Flex
        mx={'auto'}
        justifyContent={'center'}
        borderRadius="lg"
        borderWidth="1px"
        mt={5}
        p={3}
      >
        <Box mr={5}>
          <Selector
            title="Presets"
            optionGroups={presetsOptionGroups}
            defaultValue="none"
            onChange={handleSelectPresetChange}
          />
          <Selector
            title="Algorithm"
            optionGroups={algorithmOptionGroups}
            defaultValue="astar4"
            onChange={handleSelectAlgorithmChange}
          />
          <Result result={result} />
        </Box>
        <Flex direction="column">
          <Code margin="0 0 0.4rem auto">{mode}</Code>
          <Box w={canvasSize} h={canvasSize} border={'1px solid black'}>
            <Canvas
              onPointerDown={(event) => {
                switch (event.button) {
                  case 0:
                    setLastButtonPressed(MouseButton.LEFT);
                    break;
                  case 2:
                    setLastButtonPressed(MouseButton.RIGHT);
                    break;
                }

                setPointerDown(true);
              }}
              onPointerUp={() => {
                setPointerDown(false);
              }}
            >
              <OrbitControls
                enableDamping={mode === Mode.ALGORITHM}
                enableRotate={mode === Mode.ALGORITHM}
                enableZoom={mode === Mode.ALGORITHM}
                enablePan={false}
                dampingFactor={0.08}
                screenSpacePanning={false}
                minDistance={2}
                maxDistance={15}
                maxPolarAngle={Math.PI / 2}
                // Invert LEFT and RIGHT to be able to rotate with right button
                mouseButtons={{
                  LEFT: 2,
                  MIDDLE: 1,
                  RIGHT: 0
                }}
              />
              {/* @ts-ignore */}
              <PerspectiveCamera
                makeDefault={mode === Mode.BUILD}
                position={BUILD_CAMERA_V3}
                fov={75}
                near={0.1}
                far={75}
              />
              {/* @ts-ignore */}
              <PerspectiveCamera
                makeDefault={mode === Mode.ALGORITHM}
                position={DEFAULT_CAMERA_V3}
                fov={75}
                near={0.1}
                far={75}
              />
              <pointLight position={[0, 10, 0]} />
              <Sky />
              <Environment preset="city" />
              <group>
                {grid.map((row, i) =>
                  row.map((tile, j) => (
                    <TileMesh
                      key={`${i}-${j}`}
                      position={[
                        0.51 * j - gridOffset * 0.5 + 0.25,
                        0,
                        0.51 * i - gridOffset * 0.5 + 0.25
                      ]}
                      tile={tile}
                      handleClick={(button: MouseButton) => handleClick(tile, button)}
                      handleHover={() => handleHover(tile)}
                      isResult={isTileCrossed(tile)}
                      isLimit={
                        (cursors.first?.x === tile.position.x &&
                          cursors.first?.y === tile.position.y) ||
                        (cursors.second?.x === tile.position.x &&
                          cursors.second?.y === tile.position.y)
                      }
                    />
                  ))
                )}
              </group>
            </Canvas>
          </Box>
          <Controls />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Playground;
