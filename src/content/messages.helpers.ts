import mockMessages from './messages.mock.json'
import officialMessages from './messages.official.json'
import type { MessageMap, ResolvedMessage } from './messages.types'

const mock = mockMessages as MessageMap
const official = officialMessages as MessageMap

export const resolveMessage = (id: number): ResolvedMessage => {
  try {
    const key = String(id)
    const officialText = official[key]?.text?.trim() ?? ''
    const mockText = mock[key]?.text?.trim() ?? ''

    return {
      id,
      source: officialText ? 'official' : 'mock',
      text: officialText || mockText || `Momento ${id}`,
    }
  } catch (error) {
    console.error('[content] Não foi possível resolver a mensagem.', error)

    return {
      id,
      source: 'mock',
      text: `Momento ${id}`,
    }
  }
}

export const resolveAllMessages = (total: number): ResolvedMessage[] =>
  Array.from({ length: total }, (_, index) => resolveMessage(index + 1))
