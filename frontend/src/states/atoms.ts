import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'

// ToDo: 環境変数から取得する
const baseUrl = 'http://localhost:8080'

export const userIdAtom = atom<string | null>(null)
export const chatIdAtom = atom<string | null>(null)

export type Message = {
  role: string
  content: string
}
export const messagesAtom = atom<Message[]>([])

export type Chat = {
  chat_id: string
  title: string
}
export const chatsAtom = atom<Chat[]>([])
export const useCreateChat = () => {
  const [userId] = useAtom(userIdAtom)
  const [, setChatId] = useAtom(chatIdAtom)
  const [, setMessages] = useAtom(messagesAtom)

  return async (text: string) => {
    if (!userId) {
      return
    }

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
  }
}

export const useAddMessage = () => {
  const [userId] = useAtom(userIdAtom)
  const [chatId] = useAtom(chatIdAtom)
  const [, setMessages] = useAtom(messagesAtom)

  return async (text: string) => {
    if (!userId) {
      return
    }

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
  }
}

export const useGetChats = () => {
  const [userId] = useAtom(userIdAtom)
  const [, setChats] = useAtom(chatsAtom)

  return useCallback(async () => {
    if (!userId) {
      return
    }

    const response = await fetch(baseUrl + `/chats`, {
      method: 'GET',
      headers: { 'user-id': userId },
    })
    const data = await response.json()
    setChats(data['chats'])
  }, [userId, setChats])
}

export const useSwitchChat = () => {
  const [userId] = useAtom(userIdAtom)
  const [, setChatId] = useAtom(chatIdAtom)
  const [, setMessages] = useAtom(messagesAtom)

  return async (chatId: string | null) => {
    if (!userId) {
      return
    }

    setChatId(chatId)

    const response = await fetch(baseUrl + `/chats/${chatId}/messages`, {
      method: 'GET',
      headers: { 'user-id': userId },
    })

    const data = await response.json()
    setMessages(data['messages'])
  }
}
