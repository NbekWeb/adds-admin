<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps({
  minute: {
    type: Number,
    required: true
  }
})
const emits = defineEmits(['finished'])
const minute = ref(0)
const second = ref(0)
const currentSecond = ref(60)

const timeInterval = ref(null)
const retryTimeOtp = () => {
  let fraction = parseInt(String((props.minute % 1) * 10), 10)
  second.value = props.minute * 60
  minute.value = Math.floor(second.value / 60) - 1

  currentSecond.value = fraction ? fraction * 6 : 60

  timeInterval.value = setInterval(() => {
    currentSecond.value = currentSecond.value - 1
    second.value = second.value - 1

    if (currentSecond.value === 0) {
      currentSecond.value = 60
      minute.value = Math.floor(second.value / 60) - 1
    }

    if (second.value <= 0) {
      emits('finished')
    }
  }, 1000)
}

onMounted(() => {
  retryTimeOtp()
})
onBeforeUnmount(() => {
  clearInterval(timeInterval.value)
})
</script>

<template>
  <span class="timer">
    {{ minute < 10 ? `0${minute}` : minute }}:{{
      currentSecond < 10 ? `0${currentSecond}` : currentSecond
    }}
  </span>
</template>

<style scoped lang="scss">
.timer {
  padding: 0 7px;
}
</style>
