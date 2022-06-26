import Nav from '../components/Nav'
import { Box, Container, Divider, Heading, Stack, Text } from '@chakra-ui/react'
import PackageTier from '../components/PackageTier'

const options = [
  { id: 1, desc: 'Minting Period' },
  { id: 2, desc: 'Winner Seclected' },
  { id: 3, desc: 'Completed' },
]

function Draw() {
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
          <Divider />
          <PackageTier title={'Draw 1'} typePlan="1 ETH" options={options} />
          <Divider />
          <PackageTier
            title={'Draw 2'}
            checked={true}
            typePlan="1 ETH"
            options={options}
          />
          <Divider />
          <PackageTier title={'Draw 3'} typePlan="1 ETH" options={options} />
        </Stack>
      </Box>
    </Container>
  )
}

export default Draw
