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
import logo from '../public/images/logo.png'
import Image from 'next/image'
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

type NavProps = {
  page: string
}

export default function Nav({ page }: NavProps) {
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
            <Image
              width="135"
              height="135"
              src={require('../public/images/logo.png')}
            />
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {typeof account === 'string' && chainId === 4 && (
                <Button onClick={() => router.push(`/${page.toLowerCase()}`)}>
                  {page}
                </Button>
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
