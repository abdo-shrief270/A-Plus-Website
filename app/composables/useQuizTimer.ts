import { ref, computed, watch, onUnmounted, type Ref } from 'vue'

/**
 * Countdown to a server-provided deadline. Computes remaining time from the
 * wall clock each tick (deadline − now) instead of decrementing a counter,
 * so it stays accurate through tab sleep/throttling. The server enforces the
 * real deadline; this is display + auto-submit trigger only.
 */
export function useQuizTimer(deadlineAt: Ref<string | null>, onExpire?: () => void) {
  const remainingSeconds = ref<number | null>(null)
  let interval: ReturnType<typeof setInterval> | null = null
  let expired = false

  const tick = () => {
    if (!deadlineAt.value) {
      remainingSeconds.value = null
      return
    }
    const ms = new Date(deadlineAt.value).getTime() - Date.now()
    remainingSeconds.value = Math.max(0, Math.ceil(ms / 1000))
    if (remainingSeconds.value === 0 && !expired) {
      expired = true
      stop()
      onExpire?.()
    }
  }

  const start = () => {
    stop()
    expired = false
    tick()
    if (deadlineAt.value) {
      interval = setInterval(tick, 1000)
    }
  }

  const stop = () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  watch(deadlineAt, start, { immediate: true })
  onUnmounted(stop)

  const formatted = computed(() => {
    if (remainingSeconds.value === null) return ''
    const m = Math.floor(remainingSeconds.value / 60)
    const s = remainingSeconds.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const isCritical = computed(() =>
    remainingSeconds.value !== null && remainingSeconds.value > 0 && remainingSeconds.value < 5 * 60
  )

  return { remainingSeconds, formatted, isCritical, stop }
}
