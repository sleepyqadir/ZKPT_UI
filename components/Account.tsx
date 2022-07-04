import { useWeb3React } from '@web3-react/core'
import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { useEffect, useState } from 'react'
import { injected } from '../connectors'
import useENSName from '../hooks/useENSName'
import useMetaMaskOnboarding from '../hooks/useMetaMaskOnboarding'
import {
  formatEtherscanLink,
  isSupportedNetwork,
  shortenHex,
  switchNetwork,
} from '../util'
import { Button, Icon } from '@chakra-ui/react'
import { useRouter } from 'next/router'
type AccountProps = {
  triedToEagerConnect: boolean
}

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError } = useWeb3React()
  const router = useRouter()
  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding()

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false)
  useEffect(() => {
    if (active || error) {
      setConnecting(false)
      stopOnboarding()
    }
  }, [active, error, stopOnboarding])

  const ENSName = useENSName(account)

  if (error) {
    return (
      <Button
        onClick={async () => {
          const success = await switchNetwork(true)
        }}
      >
        <Icon
          viewBox="0 0 200 200"
          color="red.500"
          style={{ marginRight: '10px' }}
        >
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
        Switch Network
      </Button>
    )
  }

  if (!triedToEagerConnect) {
    return null
  }

  if (typeof account !== 'string') {
    return (
      <div>
        {isWeb3Available ? (
          <Button
            disabled={connecting}
            onClick={() => {
              setConnecting(true)

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false)
                  switchNetwork(true)
                } else {
                  setError(error)
                }
              })
            }}
            colorScheme={'orange'}
            bg={'#fc6643'}
            loadingText="Connecting..."
            px={6}
            _hover={{
              bg: 'orange.390',
            }}
          >
            {isMetaMaskInstalled ? 'Connect to MetaMask' : 'Connect to Wallet'}{' '}
          </Button>
        ) : (
          <Button onClick={startOnboarding}>Install Metamask</Button>
        )}
      </div>
    )
  }

  return <Button>{ENSName || `${shortenHex(account, 4)}`}</Button>
}

export default Account
