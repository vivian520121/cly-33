export function useClipboard() {
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }
      
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      textArea.style.top = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      
      try {
        document.execCommand('copy')
        document.body.removeChild(textArea)
        return true
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      return false
    }
  }

  return {
    copyToClipboard
  }
}
