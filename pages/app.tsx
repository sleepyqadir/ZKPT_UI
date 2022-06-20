import Nav from '../components/Nav'
import { Container, Input } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
function App() {
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
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem w="100%" h="10" bg="blue.500"></GridItem>
        <GridItem w="100%" h="10" bg="blue.500">
          <Input id="email" type="email" />
        </GridItem>
      </Grid>
    </Container>
  )
}

export default App
