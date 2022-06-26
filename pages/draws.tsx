import Nav from '../components/Nav'
import { Box, Container, Divider, Heading, Stack, Text } from '@chakra-ui/react'
import PackageTier from '../components/PackageTier'
import Statistics from '../components/Statistics'
import useZKPoolContract from '../hooks/useZkPoolContract'
import { useState, useEffect } from 'react'

const options = [
  { id: 1, desc: 'Minting Period' },
  { id: 2, desc: 'Winner Seclected' },
  { id: 3, desc: 'Completed' },
]

function Draw() {
  const contract = useZKPoolContract(
    '0x1FD0E73c732E5A1Ca3867674FA84446994891C41',
  )

  const [draws, setDraws] = useState([])

  const getStats = async () => {
    const drawCount = await contract.numDraws()
    const drawsArray = []
    for (let index = 0; index < parseInt(drawCount.toString()); index++) {
      const draw = await contract.draws(index)
      drawsArray.push(draw)
    }
    console.log({ draws: drawsArray })
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
      <Nav />
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
                The Right Plan for <Text color="purple.400">Your Savings</Text>
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
          {draws.map((draw) => {
            return (
              <>
                <Divider />
                <PackageTier
                  title={'Draw 1'}
                  typePlan="1 ETH"
                  options={options}
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
