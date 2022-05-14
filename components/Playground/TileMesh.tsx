import React, { useEffect, useState } from 'react';

import { Vector3 } from '@react-three/fiber';
import { Tile, TileKind } from '../../models/playground';
import { MouseButton } from './Playground';

type TileProps = {
  position: Vector3;
  tile: Tile;
  handleClick: (button: MouseButton) => void;
  handleHover: () => void;
  isLimit?: boolean;
  isResult?: boolean;
};

enum Color {
  BLOCK = 'black',
  EMPTY = 'white',
  HOVERED = 'red',
  END = 'green',
  RESULT = 'yellow',
  RESULT_ON_BLOCK = '#282828'
}

const TileMesh = ({
  position,
  tile,
  handleClick,
  handleHover,
  isLimit,
  isResult
}: TileProps) => {
  const [isHovered, setHover] = useState(false);

  const getColor = (): Color => {
    if (isHovered) {
      return Color.HOVERED;
    }

    if (isLimit) {
      return Color.END;
    }

    if (isResult && tile.kind === TileKind.BLOCK) {
      return Color.RESULT_ON_BLOCK;
    }

    if (isResult) {
      return Color.RESULT;
    }

    if (tile.kind === TileKind.BLOCK) {
      return Color.BLOCK;
    }

    return Color.EMPTY;
  };

  return (
    <mesh
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
        switch (event.nativeEvent.button) {
          case 0:
            handleClick(MouseButton.LEFT);
            break;
          case 1:
            handleClick(MouseButton.MIDDLE);
            break;
          case 2:
            handleClick(MouseButton.RIGHT);
            break;
        }
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHover(true);
        handleHover();
      }}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[0.5, 0.1, 0.5]} />
      <meshPhysicalMaterial
        args={[
          {
            roughness: 0.65,
            thickness: 2,
            envMapIntensity: 1,
            transmission: 0
          }
        ]}
        color={getColor()}
      />
    </mesh>
  );
};

export default TileMesh;
