import { useWeb3React } from '@web3-react/core'
import Head from 'next/head'
import Link from 'next/link'
import Account from '../components/Account'
import ETHBalance from '../components/ETHBalance'
import Hero from '../components/Hero'
import TokenBalance from '../components/TokenBalance'
import useEagerConnect from '../hooks/useEagerConnect'

// import Background from '../public/images/background.png'
import Background from '../public/images/background3.jpg'
import Nav from '../components/Nav'
import { Container } from '@chakra-ui/react'

const DAI_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

function Home() {
  const { account, library } = useWeb3React()

  const triedToEagerConnect = useEagerConnect()

  const isConnected = typeof account === 'string' && !!library

  return (
    <Container
      style={{
        height: '100vh',
        backgroundPosition: 'center',
        marginTop: '20px',
      }}
      maxW="1200px"
    >
      <Nav />

      <Hero />
      {/* 
      <main>
       

        {isConnected && (
          <section>
            <ETHBalance />

            <TokenBalance tokenAddress={DAI_TOKEN_ADDRESS} symbol="DAI" />
          </section>
        )}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style> */}
    </Container>
  )
}

export default Home
