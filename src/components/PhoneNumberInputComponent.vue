<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  disable: Boolean,
  value: {
    type: String || null
  },
  size: {
    type: String,
    default: 'middle'
  }
})
const emits = defineEmits(['update:modelValue'])
const phone_number = ref()

function formatPhoneNumber() {
  const v = phone_number.value.replace(/[^0-9]/g, '')
  const l = v.length
  let lastValue
  if (l < 3) {
    const reg = new RegExp(`^([0-9]{2})`)
    lastValue = v.replace(reg, '$1')
  } else if (l < 6) {
    const reg = new RegExp(`^([0-9]{2})([0-9]{${l - 2}})`)
    lastValue = v.replace(reg, '$1 $2')
  } else if (l < 8) {
    const reg = new RegExp(`^([0-9]{2})([0-9]{3})([0-9]{${l - 5}})`)
    lastValue = v.replace(reg, '$1 $2-$3')
  } else {
    const reg = new RegExp(`^([0-9]{2})([0-9]{3})([0-9]{2})([0-9]{${l - 7}})`)
    lastValue = v.replace(reg, '$1 $2-$3-$4')
  }
  emits('update:modelValue', v)
  return (phone_number.value = lastValue)
}

const handleChangeProps = () => {
  const reg = new RegExp(`^([0-9]{2})([0-9]{3})([0-9]{2})([0-9]{${2}})`)
  if (props.value && props.value.length === 9) {
    phone_number.value = props.value.replace(reg, '$1 $2-$3-$4')
  } else if (props.value === null) {
    phone_number.value = ''
  }
}

watch(props, () => {
  handleChangeProps()
})
onMounted(() => {
  handleChangeProps()
})
</script>

<template>
  <a-input
    type="text"
    :size="size"
    @change="formatPhoneNumber"
    :maxlength="12"
    :disabled="disable"
    v-model:value="phone_number"
    placeholder="90 654-25-48"
  >
    <template #addonBefore> +998 </template>
  </a-input>
</template>

<style scoped lang="scss"></style>
