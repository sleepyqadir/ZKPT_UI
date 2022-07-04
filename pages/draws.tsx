import Nav from '../components/Nav'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import PackageTier from '../components/PackageTier'
import Statistics from '../components/Statistics'
import useZKPoolContract from '../hooks/useZkPoolContract'
import { useState, useEffect } from 'react'
import { getAddress, isSupportedNetwork } from '../util'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

function Draw() {
  const contract = useZKPoolContract(getAddress())

  const { account, chainId } = useWeb3React()

  const [draws, setDraws] = useState([])

  const getStats = async () => {
    const draws = await contract.getDraws()
    const drawReverse = [...draws].reverse()
    console.log(drawReverse[0].endTime.toString())
    setDraws(drawReverse)
  }

  // useEffect(() => {
  //   contract && getStats()
  //   setTimeout(() => {
  //     contract && getStats()
  //   }, 1000 * 30)
  // }, [contract])

  useEffect(() => {
    contract && getStats()
  }, [contract])

  return (
    <Container
      style={{
        height: '100vh',
        backgroundPosition: 'center',
        marginTop: '20px',
      }}
      maxW="1200px"
    >
      <Nav page={'App'} />
      {!isSupportedNetwork(chainId) && (
        <Alert status="error">
          <AlertIcon />
          The current selected network is not supported switch to rinkeby to see
          data
        </Alert>
      )}{' '}
      <Statistics />
      <Box py={6} px={5} style={{ minHeight: '100vh' }}>
        <Stack spacing={4} width={'100%'} direction={'column'}>
          <Divider />
          <Stack
            style={{ marginRight: '75px' }}
            justifyContent={{
              base: 'flex-start',
              md: 'space-around',
            }}
            direction={{
              base: 'column',
              md: 'row',
            }}
          >
            <Heading size={'md'}>DRAWS</Heading>
            <Heading size={'md'}>STATUS</Heading>
            <Heading size={'md'}>Random No</Heading>
            <Heading size={'md'}>CHECK</Heading>
          </Stack>
          {draws.map((draw) => {
            return (
              <>
                <Divider />
                <PackageTier
                  title={draw.drawId.toString()}
                  isSpent={draw.isSpent}
                  isCompleted={draw.isCompleted}
                  random={draw.isCompleted ? draw.random.toString() : 'Not yet'}
                  options={[
                    { id: 1, desc: 'Spent', status: draw.isSpent },
                    {
                      id: 2,
                      desc: 'Winner Seclected',
                      status: draw.isCompleted,
                    },
                    {
                      id: 3,
                      desc: 'Completed',
                      status: draw.isCompleted,
                    },
                  ]}
                />
              </>
            )
          })}
        </Stack>
      </Box>
    </Container>
  )
}

export default Draw
