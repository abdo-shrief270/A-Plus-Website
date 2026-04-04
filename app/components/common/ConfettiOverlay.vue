<template>
  <div class="fixed inset-0 pointer-events-none z-[9999]" />
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'

const props = defineProps<{
  active?: boolean
  type?: 'burst' | 'school' | 'stars'
}>()

const fire = () => {
  if (props.type === 'school') {
    const end = Date.now() + (2 * 1000)
    const colors = ['#bb0000', '#ffffff']

    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }())
  } else if (props.type === 'stars') {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    }

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star']
      })

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle']
      })
    }

    setTimeout(shoot, 0)
    setTimeout(shoot, 100)
    setTimeout(shoot, 200)
  } else {
    // Default burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00a8ff', '#0097e6', '#e84118', '#fbc531', '#4cd137', '#487eb0', '#9c88ff']
    })
  }
}

watch(() => props.active, (newVal) => {
  if (newVal) {
    fire()
  }
})

defineExpose({ fire })
</script>
