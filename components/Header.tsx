import React from 'react';

import { Badge, Box, Flex, Heading } from '@chakra-ui/react';

type Version = {
  major: number;
  minor: number;
  patch: number;
};

type HeaderProps = {
  version: Version;
};

const Header = ({ version }: HeaderProps) => {
  return (
    <Box mx="auto" borderTop="8px solid" borderColor="red.700">
      <Flex mt={3} justifyContent="center">
        <Box>
          <Heading as="h1" display="inline" mb={10}>
            Groolkit playground
          </Heading>
          <Badge ml={1} colorScheme="red">
            {`${version.major}.${version.minor}.${version.patch}`}
          </Badge>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
