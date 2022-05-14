import React from 'react';

import { Box, Code, Link, Text } from '@chakra-ui/react';

const Summary = () => {
  return (
    <Box textAlign="center">
      <Text mt={5} mx="auto">
        <Code>Groolkit</Code> is a JavaScript library with a bunch of algorithms related
        to grids.
      </Text>
      <Text>This playground is a way to visualize what Groolkit offers.</Text>
      <Text mt={5} mx="auto">
        See the source code{' '}
        <Link
          href="https://github.com/znuznu/groolkit"
          aria-label="Groolkit source repository"
          isExternal
          color="red.700"
        >
          here
        </Link>
        , the documentation{' '}
        <Link
          href="https://znuznu.github.io/groolkit/"
          aria-label="Groolkit documentation repository"
          isExternal
          color="red.700"
        >
          here
        </Link>
        , and the npm page{' '}
        <Link
          href="https://www.npmjs.com/package/@znuznu/groolkit"
          aria-label="Groolkit npm page"
          isExternal
          color="red.700"
        >
          here
        </Link>
        .
      </Text>
    </Box>
  );
};

export default Summary;
