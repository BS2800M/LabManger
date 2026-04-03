import { computed, ref } from 'vue'
import { openErrorMessageBox } from '@/utils/messagebox'

export function usePageLoading() {
  const loadingCount = ref(0)
  const pageLoading = computed(() => loadingCount.value > 0)

  async function withPageLoading(task, options = {}) {
    const {
      timeoutMs = 10000,
      timeoutTitle = '请求超时',
      timeoutMessage = '请求超过 10 秒未完成，请检查网络或稍后重试。',
    } = options

    loadingCount.value += 1
    let timer = null
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
          openErrorMessageBox({
            title: timeoutTitle,
            message: timeoutMessage,
          })
          reject(new Error(timeoutMessage))
        }, timeoutMs)
      })

      const taskPromise = (async () => await task())()
      return await Promise.race([taskPromise, timeoutPromise])
    } finally {
      if (timer) clearTimeout(timer)
      loadingCount.value = Math.max(0, loadingCount.value - 1)
    }
  }

  return {
    loadingCount,
    pageLoading,
    withPageLoading,
  }
}
