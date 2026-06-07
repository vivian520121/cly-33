export interface HistoryItem {
  id: string
  originalText: string
  convertedText: string
  type: 'font' | 'symbol' | 'format'
  timestamp: number
}

export type FontStyle = 'bold' | 'italic' | 'outline' | 'symbol' | 'reverse' | 'pinyin' | 'boldItalic' | 'script' | 'gothic'

export interface SymbolStyle {
  id: string
  name: string
  prefix: string
  suffix: string
}

export interface DividerStyle {
  id: string
  name: string
  pattern: string
}

export type FormatAction = 'compressSpaces' | 'toUpperCase' | 'toLowerCase' | 'removeNewlines' | 'trim' | 'capitalize' | 'reverse'

export interface FontResult {
  style: FontStyle
  name: string
  result: string
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
