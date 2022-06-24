/* eslint-disable react/no-children-prop */
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
} from '@chakra-ui/react'
import { createDeposit, depositEth, generateNote, withdraw } from '../util'
import { useState } from 'react'
import useZKPoolContract from '../hooks/useZkPoolContract'
import { useWeb3React } from '@web3-react/core'

const alertTemp = {
  type: 'error',
  title: 'title',
  message: 'message',
}

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isAlertOpen,
    onOpen: onIsAlertOpen,
    onClose: onIsAlertClose,
  } = useDisclosure()
  const contract = useZKPoolContract(
    '0x1FD0E73c732E5A1Ca3867674FA84446994891C41',
  )
  const { chainId, account } = useWeb3React()
  const [note, setNote] = useState('')
  const [deposit, setDeposit] = useState(null)
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawNote, setWithdrawNote] = useState('')
  const [withdrawLoader, setWithdrawLoader] = useState(false)
  const [depositLoader, setDepositLoader] = useState(false)
  const [alert, setAlert] = useState(alertTemp)

  const onDeposit = async () => {
    try {
      const balance = await await contract.provider.getBalance(account)
      console.log(balance.toString() / 1e18 < 1)
      if (balance.toString() / 1e18 < 1) {
        setAlert({
          type: 'error',
          title: 'Insufficient Balance',
          message: 'You have currently insufficient balance to buy the ticket',
        })
        setDepositLoader(false)
        onIsAlertOpen()
        return
      } else {
        onOpen()
        const newDeposit = await createDeposit()
        setDeposit(newDeposit)
        const depositNote = await generateNote(newDeposit)
        setNote(depositNote)
      }
    } catch (err) {
      setDepositLoader(false)
    }
  }

  const onDepositTransaction = async () => {
    setDepositLoader(false)
    const alert = await depositEth(deposit, contract)
    setAlert(alert)
    onIsAlertOpen()
    onClose()
  }

  return (
    <Container
      style={{
        height: '100vh',
        backgroundPosition: 'center',
      }}
      maxW="1200px"
    >
      <Nav />
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={20}
        style={{
          marginTop: '80px',
        }}
      >
        <GridItem w="100%" h="10">
          <Box maxW="32rem">
            <Heading mb={4} align="center">
              Buy Ticket
            </Heading>
            <Text fontSize="xl" align="center">
              Buying Ticket will generate random note that you can use to
              withdraw your funds to any other address without revealing your
              identity
            </Text>
          </Box>
          <div className="box">
            <div className="inner">
              <h1>ZKPoolTogether 2022</h1>
              <div className="info clearfix">
                <div className="wp">
                  Ticket No<h2>1</h2>
                </div>
                <div className="wp">
                  Curr<h2>ETH</h2>
                </div>
                <div className="wp">
                  Prize<h2>1.00</h2>
                </div>
              </div>
              <div className="total clearfix">
                <h2>
                  Total : <p>1.00 ETH</p>
                </h2>
              </div>
            </div>
          </div>

          <Button
            colorScheme={'orange'}
            bg={'#fc6643'}
            px={6}
            _hover={{
              bg: 'orange.390',
            }}
            style={{ marginTop: '20%' }}
            width="100%"
            isLoading={depositLoader}
            loadingText="Buying"
            onClick={() => {
              setDepositLoader(true)
              onDeposit()
            }}
          >
            Buy
          </Button>
        </GridItem>
        <GridItem w="100%" h="10">
          <Box maxW="32rem">
            <Heading mb={4} align="center">
              Sell Ticket
            </Heading>
            <Text fontSize="xl" align="center">
              Buying Ticket will generate random note that you can use to
              withdraw your funds to any other address without revealing your
              identity
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
            <Input
              style={{ marginTop: 10 }}
              placeholder="Withdraw Address"
              onChange={(e) => {
                setWithdrawAddress(e.target.value)
              }}
              style={{ marginTop: '50px' }}
            />
            <FormHelperText>
              Address you want to withdraw funds to
            </FormHelperText>
          </FormControl>

          <Button
            colorScheme={'orange'}
            bg={'#fc6643'}
            px={6}
            _hover={{
              bg: 'orange.390',
            }}
            style={{ marginTop: '20%' }}
            width="100%"
            isLoading={withdrawLoader}
            loadingText="Withdrawing"
            onClick={async () => {
              console.log({ withdrawAddress, withdrawNote, contract })
              await withdraw(withdrawNote, withdrawAddress, contract)
            }}
          >
            Withdraw
          </Button>
        </GridItem>

        <Modal
          isOpen={isAlertOpen}
          size={'xl'}
          onClose={() => {
            onIsAlertClose()
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <Alert status={alert.type}>
              <AlertIcon />
              <Box>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Box>
            </Alert>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpen}
          size={'xl'}
          onClose={() => {
            setDepositLoader(false)
            onClose()
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your private note</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Please back up your note. You will need it later to withdraw your
              deposit. Treat your note as a private key - never share it with
              anyone, including zkpooltogether.co developers.
              <Code
                style={{ margin: 20 }}
                colorScheme="#fc6643"
                children={note}
              />
              <Checkbox>I have backed up the note</Checkbox>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={'orange'}
                bg={'#fc6643'}
                px={6}
                _hover={{
                  bg: 'orange.390',
                }}
                mr={3}
                onClick={() => {
                  setDepositLoader(false)
                  onClose()
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme={'orange'}
                bg={'#fc6643'}
                px={6}
                _hover={{
                  bg: 'orange.390',
                }}
                onClick={async () => {
                  await onDepositTransaction()
                }}
              >
                Deposit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Grid>
    </Container>
  )
}

export default App
