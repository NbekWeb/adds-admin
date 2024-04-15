<script setup>
import { onMounted, ref } from 'vue'
const model = defineModel()
const props = defineProps({
  disabled: Boolean,
  value: String,
  count: {
    type: Number,
    required: true
  }
})
const inputIndex = ref(null)
const digits = ref([])

const counterInput = () => {
  for (let i = 0; i < props.count; i++) {
    digits.value.push('')
  }
}

const handlePaste = (e) => {
  const pasteData = e.clipboardData.getData('text')
  const onlyNumbers = pasteData.match(/^\d+$/)

  if (onlyNumbers) {
    digits.value = pasteData.split('')
    model.value = pasteData
  }
}
const handleInput = (e) => {
  if (new RegExp('^([0-9])$').test(e.data)) {
    digits.value[inputIndex.value] = e.data
    if (e.target.nextElementSibling) e.target.nextElementSibling.focus()
  }
  model.value = digits.value.join('')
}

const handleKeydown = (e) => {
  if (e.key === 'Backspace') {
    if (e.target.previousElementSibling && !digits.value[inputIndex.value]) {
      e.target.previousElementSibling.focus()
    } else if (digits.value[inputIndex.value]) {
      digits.value[inputIndex.value] = ''
    }
  }
  model.value = digits.value.join('')
}

const handleFocus = (index) => {
  inputIndex.value = index
}
onMounted(() => {
  counterInput()
})
</script>

<template>
  <a-input-group>
    <a-row
      class="otp-container"
      @keydown="handleKeydown"
      @input="handleInput"
      @paste="handlePaste"
    >
      <a-input
        v-for="(item, i) in digits"
        :key="i"
        :disabled="disabled"
        @focus="handleFocus(i)"
        type="text"
        class="digit-box ant-col"
        size="large"
        :value="item"
        :autofocus="i === 0"
        placeholder="#"
        :maxlength="1"
      />
    </a-row>
  </a-input-group>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';
@import '@/assets/styles/responsive';
.otp-container {
  justify-content: space-between;
}
.digit-box {
  width: 2.5rem;
  padding-left: 13px;
  padding-right: 13px;

  @include responsive-sm {
    width: 3rem;
    padding-left: 17px;
    padding-right: 17px;
  }
}
</style>
