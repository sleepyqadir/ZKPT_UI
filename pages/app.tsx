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
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react'
import {
  createDeposit,
  depositEth,
  generateNote,
  withdraw,
  getAddress,
  shortenHex,
  isSupportedNetwork,
} from '../util'
import { useState, useEffect } from 'react'
import useZKPoolContract from '../hooks/useZkPoolContract'
import { useWeb3React } from '@web3-react/core'
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'
const alertTemp = {
  type: 'error',
  title: 'title',
  message: 'message',
}

const successTemp = {
  type: 'success',
  title: 'sucesss',
  message:
    'https://rinkeby.etherscan.io/tx/0x2b306ca659344eb234c01caaa6fa7d2958b33abeeeff42e1e078d88c535f572e',
}

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isAlertOpen,
    onOpen: onIsAlertOpen,
    onClose: onIsAlertClose,
  } = useDisclosure()
  const contract = useZKPoolContract(getAddress())
  const { account, chainId } = useWeb3React()
  const [note, setNote] = useState('')
  const [deposit, setDeposit] = useState(null)
  const [depositLoader, setDepositLoader] = useState(false)
  const [sendDepositLoader, setSendDepositLoader] = useState(false)
  const [alert, setAlert] = useState(alertTemp)
  const [value, setValue] = useState(0)
  const [draw, setDraw] = useState(0)
  const [denomination, setDenomination] = useState(0)

  const getDrawNo = async () => {
    let draw: number = (await contract.currentDrawId()).toNumber()
    let denomination: number =
      parseInt((await contract.denomination()).toString()) / 1e18
    setDraw(draw)

    setDenomination(denomination)
  }

  useEffect(() => {
    contract && getDrawNo()
  }, [contract])
  const handleChange = (value) => setValue(value)

  const onDeposit = async () => {
    try {
      const balance = await await contract.provider.getBalance(account)
      // @ts-ignore
      if (balance.toString() / 1e18 < 0.1) {
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
        const newDeposit = await createDeposit(undefined, undefined, value)
        setDeposit(newDeposit)
        let draw: number = (await contract.currentDrawId()).toNumber()
        setDraw(draw)
        const depositNote = await generateNote(newDeposit, draw)
        setNote(depositNote)
      }
    } catch (err) {
      console.log({ err })
      setDepositLoader(false)
    }
  }

  const onDepositTransaction = async () => {
    setDepositLoader(false)
    const alert = await depositEth(deposit, contract, draw)
    setSendDepositLoader(false)
    setAlert(alert)
    onIsAlertOpen()
    onClose()
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
      <Nav page={'Draws'} />
      {!isSupportedNetwork(chainId) && (
        <Alert status="error">
          <AlertIcon />
          The current selected network is not supported switch to rinkeby
        </Alert>
      )}{' '}
      <Container
        w="100%"
        h="10"
        style={{
          height: '100vh',
          backgroundPosition: 'center',
          marginTop: '10%',
        }}
        maxW="600px"
      >
        {typeof account === 'string' ? (
          <>
            <Box maxW="32rem">
              <Heading mb={4} style={{ fontSize: '24px', textAlign: 'center' }}>
                {`Buy Ticket For Draw ${draw}`}
              </Heading>
              <Text fontSize="md" style={{ textAlign: 'center' }}>
                Buy ticket and pick a random blind guess to become part of
                current draw. At the end of the draw a random number is selected
                through VRF to pick the user.
              </Text>
            </Box>
            <div className="box">
              <div className="inner">
                <h1>ZKPoolTogether 2022</h1>
                <div className="info clearfix">
                  <div className="wp">
                    Draw ID<h2>{draw}</h2>
                  </div>
                  <div className="wp">
                    Curr<h2>ETH</h2>
                  </div>
                  <div className="wp">
                    Entry<h2>{denomination}</h2>
                  </div>
                </div>
                <div className="total clearfix">
                  <h2>
                    Total : <p>0.01 ETH</p>
                  </h2>
                </div>
              </div>
            </div>

            <Flex style={{ marginTop: '5%' }}>
              <NumberInput
                style={{ marginRight: '4%' }}
                maxW="80px"
                value={value}
                onChange={handleChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Slider
                flex="1"
                focusThumbOnChange={false}
                value={value}
                onChange={handleChange}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize="sm" boxSize="24px" children={value} />
              </Slider>
            </Flex>
            <FormControl>
              {' '}
              <FormHelperText>select your random number guess</FormHelperText>
            </FormControl>

            <Button
              colorScheme={'orange'}
              bg={'#fc6643'}
              px={6}
              _hover={{
                bg: 'orange.390',
              }}
              style={{ marginTop: '5%' }}
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
          </>
        ) : (
          <Box maxW="32rem">
            <Heading mb={4} style={{ textAlign: 'center', marginTop: '45%' }}>
              Connect Your Wallet To Buy Ticket!
            </Heading>
          </Box>
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
              <AlertDescription maxWidth="md">
                {alert.type === 'success'
                  ? `${shortenHex(alert.message, 50)}`
                  : alert.message}
              </AlertDescription>
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
                      <a target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon />
                      </a>
                    </Link>
                  </Button>
                </GridItem>
              </Grid>
            )}
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
            deposit amount or to clame the winning amount. Treat your note as a
            private key - never share it with anyone, including zkpooltogether
            developers.
            <Code
              style={{ margin: 20 }}
              colorScheme="#fc6643"
              children={note}
            ></Code>
            <Checkbox>I have backed up the note</Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button
              px={6}
              mr={3}
              onClick={() => {
                navigator.clipboard.writeText(note)
              }}
            >
              {' '}
              <CopyIcon />{' '}
            </Button>
            <Button
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
              px={6}
              _hover={{
                bg: 'orange.390',
              }}
              isLoading={sendDepositLoader}
              loadingText="Depositing..."
              onClick={async () => {
                setSendDepositLoader(true)
                await onDepositTransaction()
              }}
            >
              Deposit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default App
