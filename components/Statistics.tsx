import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import { FiServer } from 'react-icons/fi'
import { FiDollarSign } from 'react-icons/fi'
import useZKPoolContract from '../hooks/useZkPoolContract'
import { getAddress } from '../util'

interface StatsCardProps {
  title: string
  stat: string
  icon: ReactNode
}
function StatsCard(props: StatsCardProps) {
  const { title, stat, icon } = props
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'}>{title}</StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  )
}

export default function Statistics() {
  const contract = useZKPoolContract(getAddress())

  const [users, setUsers] = useState(0)
  const [drawsCount, setDrawsCount] = useState('0')

  const getStats = async () => {
    const users = await contract.nextIndex()
    setUsers(users)
    const draws = await contract.numDraws()
    setDrawsCount(draws.toString())
  }

  useEffect(() => {
    contract && getStats()
  }, [contract])

  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={'Users'}
          // @ts-ignore
          stat={users}
          icon={<BsPerson size={'3em'} />}
        />
        <StatsCard
          title={'Draws'}
          stat={drawsCount}
          icon={<FiServer size={'3em'} />}
        />
        <StatsCard
          title={'Total Winning'}
          stat={'7'}
          icon={<FiDollarSign size={'3em'} />}
        />
      </SimpleGrid>
    </Box>
  )
}
