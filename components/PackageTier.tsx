import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'
import { checkNullifier } from '../util'
import {
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface PackageTierProps {
  title: string
  options: Array<{ id: number; desc: string; status: boolean }>
  typePlan: string
  checked?: boolean
  winnerSelected: boolean
  drawNullifier: any
  isSpent: boolean
}

const PackageTier = ({
  title,
  options,
  typePlan,
  winnerSelected,
  checked = false,
  isSpent,
  drawNullifier,
}: PackageTierProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)
  const router = useRouter()

  return (
    <Stack
      p={3}
      py={3}
      justifyContent={{
        base: 'flex-start',
        md: 'space-around',
      }}
      direction={{
        base: 'column',
        md: 'row',
      }}
      alignItems={{ md: 'center' }}
    >
      <Heading size={'md'}>Draw: {title}</Heading>
      <List spacing={3} textAlign="start">
        {options.map((desc, id) => (
          <ListItem key={desc.id}>
            {desc.status ? (
              <ListIcon as={CheckIcon} color="green.500" />
            ) : (
              <ListIcon as={CloseIcon} color="red.500" />
            )}
            {desc.desc}
          </ListItem>
        ))}
      </List>
      <Heading size={'xl'}>{typePlan}</Heading>
      <Stack>
        <Button
          size="md"
          colorScheme={'orange'}
          bg={'#fc6643'}
          px={6}
          _hover={{
            bg: 'white.390',
          }}
          disabled={!winnerSelected || isSpent}
          onClick={() => {
            router.push({
              pathname: '/check',
              query: { drawNullifier: drawNullifier, title },
            })
          }}
        >
          {isSpent
            ? 'Already Spent'
            : !winnerSelected
            ? 'In Progress'
            : 'Check'}
        </Button>
      </Stack>
    </Stack>
  )
}

export default PackageTier
