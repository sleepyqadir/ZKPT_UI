import { Web3ReactProvider } from '@web3-react/core'
import type { AppProps } from 'next/app'
import getLibrary from '../getLibrary'
import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default NextWeb3App
