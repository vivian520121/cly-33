import type { SymbolStyle, DividerStyle } from '@/types'

export const symbolStyles: SymbolStyle[] = [
  { id: 'flower', name: '花朵花边', prefix: '✿', suffix: '✿' },
  { id: 'star', name: '星星装饰', prefix: '★', suffix: '★' },
  { id: 'heart', name: '爱心边框', prefix: '♥', suffix: '♥' },
  { id: 'bracket', name: '括号装饰', prefix: '༺', suffix: '༻' },
  { id: 'wave', name: '波浪花边', prefix: '≈', suffix: '≈' },
  { id: 'arrow', name: '箭头装饰', prefix: '➤', suffix: '◄' },
  { id: 'diamond', name: '菱形装饰', prefix: '◆', suffix: '◆' },
  { id: 'moon', name: '星月装饰', prefix: '☽', suffix: '☾' },
  { id: 'crown', name: '皇冠装饰', prefix: '♔', suffix: '♚' },
  { id: 'music', name: '音符装饰', prefix: '♪', suffix: '♫' },
  { id: 'sparkle', name: '闪耀装饰', prefix: '✧', suffix: '✦' },
  { id: 'circle', name: '圆形装饰', prefix: '◯', suffix: '◯' }
]

export const dividerStyles: DividerStyle[] = [
  { id: 'line', name: '普通线条', pattern: '─' },
  { id: 'double', name: '双线条', pattern: '═' },
  { id: 'dotted', name: '点线', pattern: '•' },
  { id: 'star', name: '星星线', pattern: '★' },
  { id: 'heart', name: '爱心线', pattern: '♥' },
  { id: 'wave', name: '波浪线', pattern: '~' },
  { id: 'diamond', name: '菱形线', pattern: '◆' },
  { id: 'flower', name: '花朵线', pattern: '✿' }
]

export const emojis = [
  '😀', '😂', '😍', '🥰', '😎', '🤔', '😭', '😡', '🥳', '🤩',
  '❤️', '💔', '💕', '💖', '💯', '✨', '🔥', '💫', '⭐', '🌟',
  '🎉', '🎊', '🎁', '🎈', '🏆', '💪', '👍', '👎', '👏', '🙌',
  '🌸', '🌺', '🌻', '🌹', '🍀', '🌈', '☀️', '🌙', '⚡', '💧'
]

export const symbolDecorator = {
  applyDecoration(text: string, style: SymbolStyle): string {
    return `${style.prefix} ${text} ${style.suffix}`
  },

  applyCustomDecoration(text: string, prefix: string, suffix: string): string {
    return `${prefix}${text}${suffix}`
  },

  generateDivider(style: DividerStyle, length: number = 30): string {
    return style.pattern.repeat(length)
  },

  addEmoji(text: string, emoji: string, position: 'before' | 'after' | 'both' = 'before'): string {
    switch (position) {
      case 'before':
        return `${emoji} ${text}`
      case 'after':
        return `${text} ${emoji}`
      case 'both':
        return `${emoji} ${text} ${emoji}`
      default:
        return text
    }
  }
}
