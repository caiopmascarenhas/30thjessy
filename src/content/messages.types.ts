export interface MessageEntry {
  text: string
}

export type MessageMap = Record<string, MessageEntry>

export interface ResolvedMessage extends MessageEntry {
  id: number
  source: 'mock' | 'official'
}
