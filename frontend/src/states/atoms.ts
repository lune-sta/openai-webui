import { atom, useAtom } from 'jotai'

// ToDo: 環境変数から取得する
const baseUrl = 'http://localhost:8080'

export const userIdAtom = atom<string | null>(null)

export const loadingAtom = atom<boolean>(false)
export const chatIdAtom = atom(null)

export type Message = {
  role: string
  content: string
}
export const messagesAtom = atom<Message[]>([])

export const useCreateChat = () => {
  const [userId] = useAtom(userIdAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [, setChatId] = useAtom(chatIdAtom)
  const [, setMessages] = useAtom(messagesAtom)

  return async (text: string) => {
    if (!userId) {
      return
    }
    setLoading(true)

    const formData = new FormData()
    formData.append('content', text)

    let response = await fetch(baseUrl + '/chats', {
      method: 'POST',
      headers: { 'user-id': userId },
      body: formData,
    })
    let data = await response.json()
    setChatId(data.chat_id)

    setMessages((oldMessages: Message[]) => [
      ...oldMessages,
      {
        role: 'user',
        content: text,
      },
    ])
    response = await fetch(baseUrl + `/chats/${data.chat_id}/messages`, {
      method: 'POST',
      headers: { 'user-id': userId },
      body: formData,
    })
    data = await response.json()
    setMessages((oldMessages: Message[]) => [...oldMessages, data])
    setLoading(false)
  }
}

export const useAddMessage = () => {
  const [userId] = useAtom(userIdAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [chatId] = useAtom(chatIdAtom)
  const [, setMessages] = useAtom(messagesAtom)

  return async (text: string) => {
    if (!userId) {
      return
    }
    setLoading(true)

    const formData = new FormData()
    formData.append('content', text)

    setMessages((oldMessages: Message[]) => [
      ...oldMessages,
      {
        role: 'user',
        content: text,
      },
    ])
    const response = await fetch(baseUrl + `/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'user-id': userId },
      body: formData,
    })
    const data = await response.json()
    setMessages((oldMessages: Message[]) => [...oldMessages, data])
    setLoading(false)
  }
}
