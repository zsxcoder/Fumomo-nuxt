export default defineNuxtPlugin(() => {
  const quoteContent = ref('')
  
  const giscus = {
    setQuote(content: string) {
      quoteContent.value = content
    },
    
    getQuote() {
      return quoteContent.value
    },
    
    clearQuote() {
      quoteContent.value = ''
    }
  }
  
  return {
    provide: {
      giscus
    }
  }
})