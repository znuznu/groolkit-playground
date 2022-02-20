import React from 'react';

import { Flex, Icon, Text, Link } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <div>
      <Flex my={5} justify="center" flexDir="column">
        <Flex justify="center" mb={3}>
          <Link
            href="https://github.com/znuznu/groolkit-playground"
            aria-label="Playground source code"
            my="auto"
            mr={2}
            isExternal
          >
            <Icon
              as={FaGithub}
              w={8}
              h={8}
              color={'gray.400'}
              _hover={{ color: 'gray.600' }}
            />
          </Link>
        </Flex>
        <Flex justify="center">
          <Text fontStyle="italic" size="12px" mb={5} color={'gray.400'}>
            Groolkit and Groolkit playground © Arthur Fröhlich - MIT license
          </Text>
        </Flex>
      </Flex>
    </div>
  );
};

export default Footer;
