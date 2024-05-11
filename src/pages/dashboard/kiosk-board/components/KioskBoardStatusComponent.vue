<script setup>
defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

<template>
  <a-tag
    class="status text-bold m-0"
    :bordered="false"
    :color="
      status === 'CREATED'
        ? 'processing'
        : status === 'ACTIVE'
          ? 'success'
          : status === 'APPROVED '
            ? 'cyan'
            : status === 'EDITED'
              ? 'warning'
              : status === 'INACTIVE'
                ? 'error'
                : ''
    "
  >
    {{ $t(status) }}</a-tag
  >
</template>

<style scoped lang="scss">
.status {
  font-weight: bolder;
  cursor: pointer;
}
</style>
