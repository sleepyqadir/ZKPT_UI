import Nav from '../components/Nav'
import { Box, Container, Divider, Heading, Stack, Text } from '@chakra-ui/react'
import PackageTier from '../components/PackageTier'
import Statistics from '../components/Statistics'
import useZKPoolContract from '../hooks/useZkPoolContract'
import { useState, useEffect } from 'react'
import { getAddress } from '../util'

function Draw() {
  const contract = useZKPoolContract(getAddress())

  const [draws, setDraws] = useState([])

  const getStats = async () => {
    const draws = await contract.getDraws()
    console.log('========>', draws[2].nullifierHashIndex.toString())
    setDraws(draws)
  }

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
      <Statistics />
      <Box py={6} px={5} style={{ minHeight: '100vh' }}>
        <Stack spacing={4} width={'100%'} direction={'column'}>
          <Stack
            p={5}
            alignItems={'center'}
            justifyContent={{
              base: 'flex-start',
              md: 'space-around',
            }}
            direction={{
              base: 'column',
              md: 'row',
            }}
          >
            <Stack
              width={{
                base: '100%',
                md: '40%',
              }}
              textAlign={'center'}
            >
              <Heading size={'lg'}>
                The Right Plan for <Text color="#fc6643">Your Savings</Text>
              </Heading>
            </Stack>
            <Stack
              width={{
                base: '100%',
                md: '60%',
              }}
            >
              <Text textAlign={'center'}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                quod in iure vero. Facilis magnam, sed officiis commodi labore
                odit.
              </Text>
            </Stack>
          </Stack>
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
            <Heading size={'md'}>TICKET PRIZE</Heading>
            <Heading size={'md'}>CHECK</Heading>
          </Stack>
          {draws.map((draw) => {
            return (
              <>
                <Divider />
                <PackageTier
                  title={draw.drawId.toString()}
                  drawNullifier={draw.nullifierHash}
                  isSpent={draw.isSpent}
                  winnerSelected={
                    draw.nullifierHash ===
                    '0x0000000000000000000000000000000000000000000000000000000000000000'
                      ? false
                      : true
                  }
                  typePlan="0.1 ETH"
                  options={[
                    { id: 1, desc: 'Spent', status: draw.isSpent },
                    {
                      id: 2,
                      desc: 'Winner Seclected',
                      status:
                        draw.nullifierHash ===
                        '0x0000000000000000000000000000000000000000000000000000000000000000'
                          ? false
                          : true,
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
