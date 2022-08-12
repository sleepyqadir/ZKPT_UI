import { useWeb3React } from '@web3-react/core'
import React from 'react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Box,
  Icon,
} from '@chakra-ui/react'
import { getNetwork, switchNetwork } from '../util'
import { activeNetworks, networks, networksSwitchId } from '../config'
import { useState } from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons'

const Network = () => {
  const { chainId, account } = useWeb3React()

  const [menuHeight, setMenuHeight] = useState(null)

  const getNetworks = () => {
    const options = []
    for (const key in networks) {
      if (parseFloat(key) !== chainId) {
        options.push(
          <MenuItem onClick={() => switchNetwork(networksSwitchId[key])}>
            <Text>{networks[key]}</Text>
            <Box pos="absolute" ml="80%">
              <Icon
                viewBox="0 0 200 200"
                color={activeNetworks[key] ? 'green.500' : 'red.500'}
                style={{ marginRight: '10px' }}
              >
                <path
                  fill="currentColor"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                />
              </Icon>
            </Box>
          </MenuItem>,
        )
      }
    }
    return options
  }

  if (typeof account !== 'string') {
    return null
  }

  return (
    <>
      {/*  @ts-ignore */}
      <Menu className="dropdown" closeOnSelect={false}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {getNetwork(chainId)}
        </MenuButton>
        <MenuList style={{ height: menuHeight }} className="dropdown">
          <div className="main-menu">{getNetworks()}</div>
        </MenuList>
      </Menu>
    </>
  )
}

export default Network
