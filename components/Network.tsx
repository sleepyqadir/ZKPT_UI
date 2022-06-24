import { useWeb3React } from '@web3-react/core'
import { Button, Icon } from '@chakra-ui/react'
import { getNetwork } from '../util'

const Network = () => {
  const { chainId, account } = useWeb3React()

  // manage connecting state for injected connector

  if (typeof account !== 'string') {
    return (
      <div>
        <Button disabled={true}>
          <Icon viewBox="0 0 200 200" color="red.500">
            <path
              fill="currentColor"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
          </Icon>
        </Button>
      </div>
    )
  }

  return <Button>{getNetwork(chainId)}</Button>
}

export default Network
