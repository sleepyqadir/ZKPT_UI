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
import useZKPoolContract from '../hooks/useZkPoolContract'
import { useWeb3React } from '@web3-react/core'

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
  const { chainId } = useWeb3React()
  const contract = useZKPoolContract()

  const [users, setUsers] = useState(0)
  const [drawsCount, setDrawsCount] = useState(0)
  const [poolBalance, setPoolBalance] = useState(0)

  useEffect(() => {
    ;(async () => {
      const users = await contract.nextIndex()
      setUsers(users)
      const draws = await contract.currentDrawId()
      const poolBalance = await contract.getBalance()
      setPoolBalance(parseInt(poolBalance.toString()) / 1e18)
      setDrawsCount(parseInt(draws.toString()) + 1)
    })()
  }, [chainId])

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
          // @ts-ignore
          stat={drawsCount}
          icon={<FiServer size={'3em'} />}
        />
        <StatsCard
          title={'Strategy Pool'}
          // @ts-ignore
          stat={poolBalance}
          icon={<p>ETH</p>}
        />
      </SimpleGrid>
    </Box>
  )
}
