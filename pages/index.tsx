import Hero from '../components/Hero'

import Nav from '../components/Nav'
import { Container } from '@chakra-ui/react'

function Home() {
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
      <Hero />
    </Container>
  )
}

export default Home
