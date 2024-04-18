<script setup>
import { reactive } from 'vue'

const { status } = defineProps({
  status: {
    type: String
  }
})
const statusIcon = reactive({
  CREATED: '📌',
  APPROVED: '✔️',
  PENDING: '🕒',
  STARTED: '💼',
  FINISHED: '✅',
  CANCELED: '🚫',
  REJECTED: '🚫'
})
</script>

<template>
  <a-tag
    :color="
      status === 'CREATED'
        ? 'magenta'
        : status === 'PENDING'
          ? 'processing'
          : status === 'APPROVED'
            ? 'lime'
            : status === 'CANCELED' || status === 'REJECTED'
              ? 'error'
              : status === 'FINISHED'
                ? 'success'
                : status === 'STARTED'
                  ? 'warning'
                  : ''
    "
    :bordered="false"
    v-bind="$attrs"
  >
    <template #icon> {{ statusIcon[status] }} </template>
    {{ $t(status) }}
  </a-tag>
</template>

<style scoped lang="scss"></style>
