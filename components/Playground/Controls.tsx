import React from 'react';

import { Box, Flex, Heading, Kbd, ListItem, UnorderedList } from '@chakra-ui/react';

const Controls = () => {
  return (
    <Flex mt={3} flexDir={'column'}>
      <Box as="span" mb="0.7rem">
        Press <Kbd>b</Kbd> to switch mode
      </Box>
      <Box mb="0.7rem">
        <Heading as="h3" size="sm" mb="0.2rem">
          Build
        </Heading>
        <UnorderedList>
          <ListItem>
            <Box as="span">Left click (hover) to add a block</Box>
          </ListItem>
          <ListItem>
            <Box as="span">Right click (hover) to remove block</Box>
          </ListItem>
        </UnorderedList>
      </Box>
      <Box>
        <Heading as="h3" size="sm" mb="0.2rem">
          Algorithm
        </Heading>
        <UnorderedList>
          <ListItem>
            <Box as="span">Left click to set cursor(s)</Box>
          </ListItem>
          <ListItem>
            <Box as="span">Right click to rotate camera</Box>
          </ListItem>
          <ListItem>
            <Box as="span">Middle mouse to zoom in/out</Box>
          </ListItem>
        </UnorderedList>
      </Box>
    </Flex>
  );
};

export default Controls;
