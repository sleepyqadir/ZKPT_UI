import { ReactNode } from 'react'
import {
  Box,
  Flex,
  Link,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useWeb3React } from '@web3-react/core'
import useEagerConnect from '../hooks/useEagerConnect'
import Account from './Account'
import Network from './Network'
import { Router } from 'next/router'
// import ETHBalance from './ETHBalance'
import { useRouter } from 'next/router'

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}
  >
    {children}
  </Link>
)

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account, library, chainId } = useWeb3React()
  const triedToEagerConnect = useEagerConnect()
  const router = useRouter()
  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <h1>ZKPT</h1>
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {typeof account === 'string' && chainId === 4 && (
                <Button onClick={() => router.push('/draws')}>Draws</Button>
              )}
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              {/* {typeof account === 'string' && <ETHBalance />} */}
              <Network />
              <Account triedToEagerConnect={triedToEagerConnect} />
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
