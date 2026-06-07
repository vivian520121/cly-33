import type { FormatAction } from '@/types'

export const textFormatter = {
  compressSpaces(text: string): string {
    return text.replace(/\s+/g, ' ').trim()
  },

  toUpperCase(text: string): string {
    return text.toUpperCase()
  },

  toLowerCase(text: string): string {
    return text.toLowerCase()
  },

  removeNewlines(text: string): string {
    return text.replace(/[\n\r]/g, '')
  },

  trim(text: string): string {
    return text.trim()
  },

  capitalize(text: string): string {
    return text.replace(/\b\w/g, char => char.toUpperCase())
  },

  reverse(text: string): string {
    return text.split('').reverse().join('')
  },

  format(text: string, action: FormatAction): string {
    switch (action) {
      case 'compressSpaces':
        return this.compressSpaces(text)
      case 'toUpperCase':
        return this.toUpperCase(text)
      case 'toLowerCase':
        return this.toLowerCase(text)
      case 'removeNewlines':
        return this.removeNewlines(text)
      case 'trim':
        return this.trim(text)
      case 'capitalize':
        return this.capitalize(text)
      case 'reverse':
        return this.reverse(text)
      default:
        return text
    }
  }
}
