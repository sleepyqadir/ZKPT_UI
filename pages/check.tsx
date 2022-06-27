import Nav from '../components/Nav'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  Button,
  Container,
  Input,
  useDisclosure,
  Code,
  Checkbox,
  FormControl,
  FormHelperText,
  Box,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormErrorMessage,
} from '@chakra-ui/react'
import { checkNullifier, getAddress, withdrawWinning } from '../util'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { ethers } from 'ethers'
import useZKPoolContract from '../hooks/useZkPoolContract'

const alertTemp = {
  type: 'error',
  title: 'title',
  message: 'message',
}

function Check() {
  const [withdrawNote, setWithdrawNote] = useState()
  const [checkLoader, setCheckLoader] = useState(false)
  const [alert, setAlert] = useState(alertTemp)
  const [isAddressError, setIsAddressError] = useState(false)
  const [isEligible, setIsEligible] = useState(false)
  const [withdrawLoader, setWithdrawLoader] = useState(false)
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [message, setMessage] = useState(
    'Enter your deposit note to check weather or not you have won the this draw',
  )

  const contract = useZKPoolContract(getAddress())

  const {
    isOpen: isAlertOpen,
    onOpen: onIsAlertOpen,
    onClose: onIsAlertClose,
  } = useDisclosure()
  const router = useRouter()

  const { drawNullifier, title } = router.query
  const onCheckEligibility = async () => {
    try {
      setCheckLoader(true)
      const alert = await checkNullifier(withdrawNote, drawNullifier)
      if (alert.type === 'eligibility') {
        console.log({ alert })
        setIsEligible(alert.status)
        if (alert.status) {
          setMessage(
            'Hurray you have won the draw enter the withdrawal address to withdraw winning amount',
          )
        } else {
          setMessage(alert.title)
        }
        setCheckLoader(false)
      } else {
        setCheckLoader(false)
        // @ts-ignore
        setAlert(alert)
        onIsAlertOpen()
      }
    } catch (err) {
      setCheckLoader(false)
      console.log({ err })

      setAlert({
        type: 'error',
        title: 'Something Went Wrong',
        message: err.message,
      })
      onIsAlertOpen()
    }
  }

  const onWithdraw = async () => {
    try {
      if (!ethers.utils.isAddress(withdrawAddress)) {
        setWithdrawLoader(false)
        setIsAddressError(true)
        return
      }
      const alert = await withdrawWinning(
        title,
        withdrawNote,
        withdrawAddress,
        contract,
      )
      setWithdrawLoader(false)
      // @ts-ignore
      setAlert(alert)
      onIsAlertOpen()
    } catch (err) {
      setWithdrawLoader(false)
      console.log({ err })
    }
  }

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
      <Container
        style={{
          height: '100vh',
          backgroundPosition: 'center',
          marginTop: '60px',
        }}
        maxW="500px"
      >
        {' '}
        <Box maxW="32rem">
          <Heading mb={4} style={{ textAlign: 'center' }}>
            {!isEligible ? `Draw: ${title}` : `🎉 You Won 🎉`}
          </Heading>
          <Text fontSize="xl" align="center">
            {message}
          </Text>
        </Box>
        <FormControl style={{ marginTop: '50px' }}>
          <Input
            placeholder="Withdraw Note"
            onChange={(e) => {
              setWithdrawNote(e.target.value)
            }}
          />

          <FormHelperText>
            Make sure to add correct formet of note
          </FormHelperText>
        </FormControl>
        {!isEligible && (
          <Button
            colorScheme={'orange'}
            bg={'#fc6643'}
            px={6}
            _hover={{
              bg: 'orange.390',
            }}
            style={{ marginTop: '10%' }}
            width="100%"
            isLoading={checkLoader}
            loadingText="Checking..."
            onClick={() => {
              onCheckEligibility()
            }}
          >
            Check
          </Button>
        )}
        {isEligible && (
          <>
            {' '}
            <FormControl isInvalid={isAddressError}>
              <Input
                placeholder="Withdraw Address"
                onChange={(e) => {
                  setIsAddressError(false)
                  setWithdrawAddress(e.target.value)
                }}
                style={{ marginTop: '60px' }}
              />
              {!isAddressError ? (
                <FormHelperText>
                  Address you want to withdraw funds to
                </FormHelperText>
              ) : (
                <FormErrorMessage>Invalid Address Formet</FormErrorMessage>
              )}
            </FormControl>
            <Button
              colorScheme={'orange'}
              bg={'#fc6643'}
              px={6}
              _hover={{
                bg: 'orange.390',
              }}
              style={{ marginTop: '10%' }}
              width="100%"
              isLoading={withdrawLoader}
              loadingText="Withdrawing"
              onClick={() => {
                setWithdrawLoader(true)
                onWithdraw()
              }}
            >
              Withdraw
            </Button>{' '}
          </>
        )}
      </Container>
      <Modal
        isOpen={isAlertOpen}
        size={'xl'}
        onClose={() => {
          onIsAlertClose()
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <Alert
            // @ts-ignore
            status={alert.type}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <Box>
              <AlertTitle mt={4} mb={1} fontSize="lg">
                {alert.title}
              </AlertTitle>
              <AlertDescription maxWidth="md">{alert.message}</AlertDescription>
            </Box>
            {alert.type === 'success' && (
              <Grid margin="2" templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(alert.message)
                    }}
                  >
                    {' '}
                    <CopyIcon />{' '}
                  </Button>
                </GridItem>
                <GridItem>
                  <Button>
                    <Link href={alert.message}>
                      <a target="_blank"></a>
                    </Link>
                    <ExternalLinkIcon />
                  </Button>
                </GridItem>
              </Grid>
            )}
          </Alert>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default Check
