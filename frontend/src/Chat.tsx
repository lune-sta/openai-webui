import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import AssistantIcon from '@mui/icons-material/Assistant'
import { useState } from 'react'
import { useAtom } from 'jotai'
import {
  userIdAtom,
  loadingAtom,
  chatIdAtom,
  messagesAtom,
  Message,
  useCreateChat,
  useGetChats,
  userIdAtom,
  useAddMessage,
} from './states/atoms'

const maxWidth = '800px'

type MessageProps = {
  children: Message
  backgroundColor?: string
}

function MessageBox({ children }: MessageProps) {
  const color = children.role === 'user' ? 'primary' : 'secondary'

  return (
    <Box
      sx={{
        backgroundColor: children.role === 'assistant' ? '#eeeeee' : undefined,
      }}
    >
      <Box
        sx={{
          p: 6,
          maxWidth: maxWidth,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ marginRight: 2 }}>
          {children.role === 'user' ? (
            <PersonIcon color={color} fontSize="large" />
          ) : (
            <AssistantIcon color={color} fontSize="large" />
          )}
        </Box>
        <Typography paragraph sx={{ m: 0, color: color }}>
          {children.content}
        </Typography>
      </Box>
    </Box>
  )
}

export default function Chat() {
  const [userId] = useAtom(userIdAtom)
  const [isLoading] = useAtom(loadingAtom)
  const [chatId] = useAtom(chatIdAtom)
  const [messages] = useAtom(messagesAtom)
  const [text, setText] = useState('')

  const createChat = useCreateChat()
  const addMessage = useAddMessage()
  const getChats = useGetChats()

  const handleButtonClick = async () => {
    if (!chatId) {
      await createChat(text).then(() => getChats())
    } else {
      await addMessage(text)
    }
    setText('')
  }

  return (
    <Container maxWidth={false} disableGutters>
      {messages.map((message, index) => (
        <Box key={index}>
          <MessageBox>{message}</MessageBox>
          <Divider />
        </Box>
      ))}
      <Box sx={{ p: 6, maxWidth: maxWidth, margin: '0 auto' }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          fullWidth={true}
          placeholder={'Write your message here.'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              await handleButtonClick()
              e.preventDefault()
            }
          }}
        />
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 2 }}
        >
          {isLoading ? (
            <Button variant="contained" disabled={true}>
              Submit
            </Button>
          ) : (
            <Button variant="contained" onClick={handleButtonClick}>
              Submit
            </Button>
          )}
        </Box>
      </Box>
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        UserID: {userId}
      </Typography>
    </Container>
  )
}
