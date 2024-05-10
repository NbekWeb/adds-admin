<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  status: {
    type: String
  }
})

const statusList = ref({
  REJECTED_BY_MODERATOR: 'error',
  CANCELED: 'error',
  REJECTED: 'error',
  FAILED: 'error',
  EXPIRED: 'error',
  REJECTED_BY_BOARD_OWNER: 'error',
  APPROVED: 'lime',
  BOARD_OWNER_APPROVED: 'lime',
  ACCEPTED: 'lime',
  FINISHED: 'success',
  STARTED: 'warning',
  PENDING: 'processing',
  AWAITING_BOARD_OWNER: 'processing',
  CREATED: 'magenta'
})
const statusIcon = reactive({
  CREATED: '📌',
  APPROVED: '✅',
  BOARD_OWNER_APPROVED: '✅',
  PENDING: '🕒',
  STARTED: '💼',
  FINISHED: '✅',
  CANCELED: '🚫',
  REJECTED: '🚫',
  FAILED: '🚫'
})
</script>

<template>
  <a-tag
    :color="statusList[status]"
    :bordered="false"
    class="m-0"
    v-bind="$attrs"
  >
    <template #icon> {{ statusIcon[status] }}</template>
    {{ $t(status) }}
  </a-tag>
</template>

<style scoped lang="scss"></style>
