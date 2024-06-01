<script setup>
import IconEdit from '@/components/icons/IconEdit.vue'

import useCore from '@/store/core.pinia.js'
import useDuration from '@/store/duration.pinia.js'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const corePinia = useCore()
const durationPinia = useDuration()

const { loadingUrl } = storeToRefs(corePinia)
const { duration } = storeToRefs(durationPinia)

const open = ref(false)

function handleChange() {
  open.value = true
}

function closeChange() {
  open.value = false
}

function updateDuration() {
  durationPinia.changeDuration({
    limitSeconds: duration.value.limitSeconds,
    defaultImageSeconds: duration.value.defaultImageSeconds,
    defaultTextSeconds: duration.value.defaultTextSeconds
  })

  closeChange()
}

onMounted(() => {
  durationPinia.getDuration()
})
</script>

<template>
  <loader-component loading-url="duration/get">
    <a-form layout="vertical" class="mt-2">
      <a-form-item
        :label="$t('KIOSK_VIDEO_MAX')"
      >
        <a-input-number
          :min="1"
          :disabled="!open"
          v-model:value="duration.limitSeconds"
        />
      </a-form-item>

      <a-form-item
        :label="$t('KIOSK_IMG_MAX')"
      >
        <a-input-number
          :min="1"
          :disabled="!open"
          v-model:value="duration.defaultImageSeconds"
        />
      </a-form-item>

      <a-form-item
        :label="$t('KIOSK_TEXT_MAX')"
      >
        <a-input-number
          :min="1"
          :disabled="!open"
          v-model:value="duration.defaultTextSeconds"
        />
      </a-form-item>

      <a-space class="mt-4">
        <a-space v-show="!open">
          <a-button
            @click="handleChange"
            type="primary"
            :loading="loadingUrl.has('duration/update')"
            class="flex align-center"
          >
            {{ $t('KIOSK_TIME_CHANGE') }}
            <icon-edit class="ml-2" @click="handleChange" />
          </a-button>
        </a-space>
        <a-space v-show="open">
          <a-button @click="closeChange">
            {{ $t('CANCEL') }}
          </a-button>
          <a-button
            @click="updateDuration"
            type="primary"
            :loading="loadingUrl.has('duration/update')"
          >
            {{ $t('SAVE') }}
          </a-button>
        </a-space>
      </a-space>
    </a-form>
  </loader-component>
</template>

<style lang="scss" scoped></style>
