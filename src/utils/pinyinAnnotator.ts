import { pinyinMap } from './fontConverter'

export interface PinyinChar {
  char: string
  pinyin: string
  isHanzi: boolean
  customPinyin?: string
}

export interface PinyinOptions {
  fontSize: number
  color: string
  showPinyin: boolean
}

const defaultOptions: PinyinOptions = {
  fontSize: 14,
  color: '#6366f1',
  showPinyin: true
}

function isHanzi(char: string): boolean {
  return /[\u4e00-\u9fa5]/.test(char)
}

export function parseTextToPinyinChars(text: string, customPinyins?: Record<string, string>): PinyinChar[] {
  const chars: PinyinChar[] = []
  
  for (const char of text) {
    if (isHanzi(char)) {
      const pinyin = customPinyins?.[char] || pinyinMap[char] || ''
      chars.push({
        char,
        pinyin: pinyin || char,
        isHanzi: true,
        customPinyin: customPinyins?.[char]
      })
    } else {
      chars.push({
        char,
        pinyin: char,
        isHanzi: false
      })
    }
  }
  
  return chars
}

export function generatePinyinHtml(
  chars: PinyinChar[],
  options: Partial<PinyinOptions> = {}
): string {
  const opts = { ...defaultOptions, ...options }
  
  if (!opts.showPinyin) {
    return chars.map(c => c.char).join('')
  }
  
  return chars.map(item => {
    if (!item.isHanzi) {
      return item.char
    }
    
    const pinyin = item.customPinyin || item.pinyin
    return `<ruby style="display: inline-flex; flex-direction: column-reverse; align-items: center; line-height: 1.2; margin: 0 2px;">
  <span style="font-size: ${opts.fontSize}px; color: ${opts.color}; line-height: 1; margin-bottom: 2px;">${pinyin}</span>
  <span style="font-size: inherit; line-height: 1;">${item.char}</span>
</ruby>`
  }).join('')
}

export function generatePlainText(chars: PinyinChar[]): string {
  return chars.map(item => {
    if (!item.isHanzi) return item.char
    const pinyin = item.customPinyin || item.pinyin
    return `${item.char}(${pinyin})`
  }).join('')
}

export { defaultOptions }
