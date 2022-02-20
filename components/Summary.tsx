import React from 'react';

import { Code, Link, Text } from '@chakra-ui/react';

const Summary = () => {
  return (
    <>
      <Text mt={5} mx="auto" textAlign="center">
        <Code>Groolkit</Code> is a JavaScript library with a bunch of algorithms related
        to grids.
      </Text>
      <Text mt={5} mx="auto" textAlign="center">
        See the source code{' '}
        <Link
          href="https://github.com/znuznu/groolkit"
          aria-label="Groolkit source repository"
          isExternal
          color="red.700"
        >
          here
        </Link>{' '}
        and the npm page{' '}
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
    </>
  );
};

export default Summary;
