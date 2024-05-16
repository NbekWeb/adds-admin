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
    <div class="mt-2">
      <a-card size="small" class="flex align-center duration-drawer">
        <p class="m-0 mr-3">
          {{ $t('KIOSK_VIDEO_MAX') }} -
          <span v-show="!open">{{ duration?.limitSeconds }}</span>
          <a-input-number
            v-show="open"
            size="small"
            :min="1"
            v-model:value="duration.limitSeconds"
          />
        </p>
      </a-card>

      <a-card size="small" class="flex align-center duration-drawer mt-2">
        <p class="m-0 mr-3">
          {{ $t('KIOSK_IMG_MAX') }} -
          <span v-show="!open">{{ duration?.defaultImageSeconds }}</span>
          <a-input-number
            v-show="open"
            size="small"
            :min="1"
            v-model:value="duration.defaultImageSeconds"
          />
        </p>
      </a-card>

      <a-card size="small" class="flex align-center duration-drawer mt-2">
        <p class="m-0 mr-3">
          {{ $t('KIOSK_TEXT_MAX') }} -
          <span v-show="!open">{{ duration?.defaultTextSeconds }}</span>
          <a-input-number
            v-show="open"
            size="small"
            :min="1"
            v-model:value="duration.defaultTextSeconds"
          />
        </p>
      </a-card>

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
    </div>
  </loader-component>
</template>
<style lang="scss" scoped></style>
