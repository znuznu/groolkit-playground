import React, { ChangeEventHandler } from 'react';

import { Box, Select, Text } from '@chakra-ui/react';
import { GkAlgorithm } from '../models/groolkit';

const optionsGroups: {
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

type SelectorProps = {
  onChange?: ChangeEventHandler;
};

const Selector = ({ onChange }: SelectorProps) => {
  return (
    <Box maxW="sm">
      <Text fontWeight="bold">Algorithm</Text>
      <Select size="md" onChange={onChange} defaultValue="astar4" mt={1}>
        {optionsGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((options) => (
              <option key={options.value} value={options.value}>
                {options.displayName}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
    </Box>
  );
};

export default Selector;
