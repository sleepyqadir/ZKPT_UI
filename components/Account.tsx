import { useWeb3React } from '@web3-react/core'
import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { useEffect, useState } from 'react'
import { injected } from '../connectors'
import useENSName from '../hooks/useENSName'
import useMetaMaskOnboarding from '../hooks/useMetaMaskOnboarding'
import { formatEtherscanLink, shortenHex } from '../util'
import { Button } from '@chakra-ui/react'
type AccountProps = {
  triedToEagerConnect: boolean
}

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError } = useWeb3React()

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
    return null
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
