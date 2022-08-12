import { ReactNode } from 'react'
import {
  Box,
  Flex,
  Link,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useWeb3React } from '@web3-react/core'
import useEagerConnect from '../hooks/useEagerConnect'
import Account from './Account'
import Network from './Network'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { isSupportedNetwork } from '../util'

type NavProps = {
  page: string
}

export default function Nav({ page }: NavProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { account, chainId } = useWeb3React()
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
              {typeof account === 'string' && isSupportedNetwork(chainId) && (
                <Button onClick={() => router.push(`/${page.toLowerCase()}`)}>
                  {page}
                </Button>
              )}
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Network />
              <Account triedToEagerConnect={triedToEagerConnect} />
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
