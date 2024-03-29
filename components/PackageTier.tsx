import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useRef } from 'react'
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
  checked?: boolean
  isSpent: boolean
  isCompleted: boolean
  random: number
}

const PackageTier = ({
  title,
  options,
  isSpent,
  isCompleted,
  random,
}: PackageTierProps) => {
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
      <Heading size={'xl'}>{random}</Heading>
      <Stack>
        <Button
          size="md"
          colorScheme={'orange'}
          bg={'#fc6643'}
          px={6}
          _hover={{
            bg: 'white.390',
          }}
          disabled={!isCompleted}
          onClick={() => {
            router.push({
              pathname: '/check',
              query: { title, random },
            })
          }}
        >
          {!isCompleted ? 'In Progress' : 'Check'}
        </Button>
      </Stack>
    </Stack>
  )
}

export default PackageTier
