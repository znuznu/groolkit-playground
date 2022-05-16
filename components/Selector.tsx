import React, { ChangeEventHandler } from 'react';

import { Box, Select, Text } from '@chakra-ui/react';

type SelectorProps = {
  title: string;
  defaultValue: string;
  optionGroups: {
    label?: string;
    options: { value: string; displayName: string }[];
  }[];
  onChange: ChangeEventHandler;
};

const Selector = ({ title, defaultValue, optionGroups, onChange }: SelectorProps) => {
  return (
    <Box maxW="sm">
      <Text fontWeight="bold">{title}</Text>
      <Select size="md" onChange={onChange} defaultValue={defaultValue} mt={1}>
        {optionGroups.map((group) =>
          group.label ? (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((options) => (
                <option key={options.value} value={options.value}>
                  {options.displayName}
                </option>
              ))}
            </optgroup>
          ) : (
            group.options.map((options) => (
              <option key={options.value} value={options.value}>
                {options.displayName}
              </option>
            ))
          )
        )}
      </Select>
    </Box>
  );
};

export default Selector;
