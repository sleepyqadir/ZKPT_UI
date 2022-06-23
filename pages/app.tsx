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
  Select,
  useDisclosure,
  Code,
  Checkbox,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import {
  createDeposit,
  depositEth,
  generateNote,
  parseNote,
  withdraw,
} from '../util'
import { useState } from 'react'
import useZKPoolContract from '../hooks/useZkPoolContract'
function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const contract = useZKPoolContract(
    '0x1FD0E73c732E5A1Ca3867674FA84446994891C41',
  )
  const [note, setNote] = useState('')
  const [deposit, setDeposit] = useState(null)
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawNote, setWithdrawNote] = useState('')
  return (
    <Container
      style={{
        height: '100vh',
        backgroundPosition: 'center',
        marginTop: '20px',
      }}
      maxW="1200px"
    >
      <Nav />
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Select placeholder="Select option">
          <option value="option1">ETH</option>
          <option value="option2">One</option>
          <option value="option3">Dai</option>
        </Select>
        <Button
          colorScheme={'orange'}
          bg={'#fc6643'}
          rounded={'full'}
          px={6}
          _hover={{
            bg: 'orange.390',
          }}
          onClick={async () => {
            onOpen()
            const newDeposit = await createDeposit()
            setDeposit(newDeposit)
            const depositNote = await generateNote(newDeposit)
            setNote(depositNote)
          }}
        >
          Deposit
        </Button>

        <FormControl>
          <FormLabel>Withdraw</FormLabel>
          <Input
            placeholder="Withdraw Note"
            onChange={(e) => {
              setWithdrawNote(e.target.value)
            }}
          />
          <Input
            style={{ marginTop: 10 }}
            placeholder="Withdraw Address"
            onChange={(e) => {
              setWithdrawAddress(e.target.value)
            }}
          />
          <FormHelperText>
            Make sure to add correct formet of note
          </FormHelperText>
        </FormControl>

        <Button
          colorScheme={'orange'}
          bg={'#fc6643'}
          rounded={'full'}
          px={6}
          _hover={{
            bg: 'orange.390',
          }}
          onClick={async () => {
            console.log({ withdrawAddress, withdrawNote, contract })
            await withdraw(withdrawNote, withdrawAddress, contract)
          }}
        >
          Withdraw
        </Button>

        <Modal isOpen={isOpen} size={'xl'} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your private note</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Please back up your note. You will need it later to withdraw your
              deposit. Treat your note as a private key - never share it with
              anyone, including zkpooltogether.co developers.
              <Code
                style={{ marginTop: 20 }}
                colorScheme="#fc6643"
                children={note}
              />
              <Checkbox defaultChecked>I have backed up the note</Checkbox>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={async () => {
                  await depositEth(deposit, contract)
                }}
                variant="ghost"
              >
                Send Deposit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Grid>
    </Container>
  )
}

export default App
