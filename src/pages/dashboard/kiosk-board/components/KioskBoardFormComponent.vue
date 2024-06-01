<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import useCore from '@/store/core.pinia.js'
import useBoardCategories from '@/store/board-category.pinia.js'
import useKioskBoard from '@/store/kiosk-board.pinia.js'
import { Form } from 'ant-design-vue'

import { api } from '@/utils/api/index.js'
import { useI18n } from 'vue-i18n'
import { debounce } from '@/composables/index.js'

import LoaderComponent from '@/components/LoaderComponent.vue'
import MoneyInputComponent from '@/components/MoneyInputComponent.vue'
import ScrollbarComponent from '@/components/ScrollbarComponent.vue'
import KioskBoardMapComponent from '@/pages/dashboard/kiosk-board/components/KioskBoardMapComponent.vue'

const useForm = Form.useForm
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const coreStore = useCore()
const categoryStore = useBoardCategories()
const kioskBoardStore = useKioskBoard()

const { collapsed, loadingUrl, visibleDrawer } = storeToRefs(coreStore)
const { categories } = storeToRefs(categoryStore)

const mapAddress = ref(null)
const formStates = ref({
  categoryId: null,
  name: null,
  description: null,
  longitude: null,
  latitude: null,
  timeConfigurations: [],
  amount: null
})

const map = ref({
  maker: null,
  name: [],
  searching: false,
  options: []
})

const selectedTime = ref({ time: [], dayOfWeek: null })

const rules = ref({
  name: [
    {
      required: true,
      message: t('REQUIRED_FIELD'),
      trigger: 'blur'
    }
  ],
  description: [
    {
      required: true,
      message: t('REQUIRED_FIELD'),
      trigger: 'blur'
    }
  ],
  categoryId: [
    {
      required: true,
      message: t('REQUIRED_FIELD'),
      trigger: 'blur'
    }
  ],
  longitude: [
    {
      required: true,
      message: t('REQUIRED_FIELD'),
      trigger: 'blur'
    }
  ],
  timeConfigurations: [
    {
      validator: (rules, value) =>
        value.length > 0
          ? Promise.resolve()
          : Promise.reject(new Error(t('REQUIRED_FIELD'))),
      trigger: 'blur'
    }
  ],
  amount: [
    {
      required: true,
      message: t('REQUIRED_FIELD'),
      trigger: 'blur'
    }
  ]
})

const orderWeeks = ref(0)

const optionsWeek = ref([
  {
    value: 'MONDAY',
    label: t('MONDAY'),
    disabled: false
  },
  {
    value: 'TUESDAY',
    label: t('TUESDAY'),
    disabled: false
  },
  {
    value: 'WEDNESDAY',
    label: t('WEDNESDAY'),
    disabled: false
  },
  {
    value: 'THURSDAY',
    label: t('THURSDAY'),
    disabled: false
  },
  {
    value: 'FRIDAY',
    label: t('FRIDAY'),
    disabled: false
  },
  {
    value: 'SATURDAY',
    label: t('SATURDAY'),
    disabled: false
  },
  {
    value: 'SUNDAY',
    label: t('SUNDAY'),
    disabled: false
  }
])
const { resetFields, validate, validateInfos } = useForm(formStates, rules)
const findPlaceByLatLon = (lat, lon, callback) => {
  // Find place by Lat and Lon
  map.value.maker = [[String(lat), String(lon)]]

  api({
    url: 'https://nominatim.openstreetmap.org/reverse',
    params: {
      format: 'json',
      lat: lat,
      lon: lon,
      'accept-language': 'uz'
    }
  })
    .then((data) => {
      const mapName = data?.data?.display_name

      map.value.name = mapName
      mapAddress.value = mapName
      formStates.value.longitude = data?.data?.lon
      formStates.value.latitude = data?.data?.lat

      callback()
    })
    .catch((error) => {
      coreStore.switchStatus(error)
    })
}

const findPlaceByName = (text) => {
  if (!text?.trim()) {
    // If text is empty search don't work
    return
  }
  map.value.options = []
  map.value.searching = true
  api({
    url: 'https://nominatim.openstreetmap.org/search',
    params: {
      format: 'json',
      q: text?.trim(),
      'accept-language': 'uz'
    }
  })
    .then((data) => {
      // value = lat and long what wrapper string
      map.value.options = data?.data?.map((item) => {
        return {
          label: item?.display_name?.trim(),
          value: `${item?.lat}__${item?.lon}`
        }
      })
    })
    .catch((error) => {
      coreStore.switchStatus(error)
    })
    .finally(() => {
      map.value.searching = false
    })
}

const searchingMap = debounce((text) => {
  findPlaceByName(text)
}, 300)

const handleClickMapOption = (value) => {
  coreStore.loadingUrl.add('get/kiosk-board/map-info')
  const latLon = value?.split('__')
  const latitude = latLon?.[0]
  const longitude = latLon?.[1]
  findPlaceByLatLon(latitude, longitude, () => {
    coreStore.loadingUrl.delete('get/kiosk-board/map-info')
  })
}

const changeMap = (e) => {
  coreStore.loadingUrl.add('get/kiosk-board/map-info')
  findPlaceByLatLon(e.latlng.lat, e.latlng.lng, () => {
    coreStore.loadingUrl.delete('get/kiosk-board/map-info')
  })
}

const submitForm = () => {
  validate()
    .then(() => {
      coreStore.loadingUrl.add('kiosk-board/owner/form')
      kioskBoardStore.createKioskBoard({
        ...formStates.value,
        ownerId: route.params.id
      })
      router.push({ name: 'DashboardKioskBoardListView' })
    })
    .catch(() => {})
}

function resetTimeConfig() {
  selectedTime.value.dayOfWeek = null
  selectedTime.value.time = []
  coreStore.visibleDrawer.delete('time/form')
}

const addTimConfig = () => {
  formStates.value.timeConfigurations.push({
    startTime: selectedTime.value.time[0],
    endTime: selectedTime.value.time[1],
    dayOfWeek: selectedTime.value.dayOfWeek
  })
  optionsWeek.value = optionsWeek.value.map((week) => {
    if (week.value === selectedTime.value.dayOfWeek) {
      week.disabled = true
    }
    return week
  })
  orderWeeks.value++
  resetTimeConfig()
}

onMounted(() => {
  categoryStore.getAllBoardCategories()
})
</script>

<template>
  <scrollbar-component height="calc(100vh - 145px)">
    <template #content v-if="true">
      <a-form
        layout="vertical"
        @submit.prevent="submitForm"
        class="h-full flex flex-column"
      >
        <a-row :gutter="[20, 10]">
          <a-col
            :span="24"
            :sm="20"
            :md="collapsed ? 10 : 24"
            :lg="10"
            :xl="12"
          >
            <loader-component loading-url="get/kiosk-board/map-info">
              <a-row :gutter="[10, 10]">
                <a-col :span="24">
                  <a-form-item :label="$t('KIOSK_BOARD_ADDRESS')">
                    <a-textarea
                      readonly
                      v-model:value="mapAddress"
                      :placeholder="$t('KIOSK_BOARD_ADDRESS')"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item
                    :label="$t('KIOSK_BOARD_NAME')"
                    v-bind="validateInfos.name"
                  >
                    <a-input
                      v-model:value="formStates.name"
                      :placeholder="$t('KIOSK_BOARD_NAME')"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item
                    :label="$t('CATEGORY')"
                    v-bind="validateInfos.categoryId"
                  >
                    <a-tree-select
                      v-model:value="formStates.categoryId"
                      show-search
                      :placeholder="$t('SELECT_CATEGORY')"
                      :dropdown-style="{
                        maxHeight: '400px',
                        overflow: 'auto'
                      }"
                      allow-clear
                      tree-default-expand-all
                      tree-node-filter-prop="label"
                      :tree-data-simple-mode="[categories]"
                      :tree-data="categories"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('KIOSK_BOARD_PRICE')"
                    v-bind="validateInfos.amount"
                  >
                    <money-input-component
                      v-model:value="formStates.amount"
                      :placeholder="$t('AMOUNT')"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item
                    :label="$t('DESCRIPTION')"
                    v-bind="validateInfos.description"
                  >
                    <a-textarea
                      v-model:value="formStates.description"
                      :placeholder="$t('DESCRIPTION')"
                      style="height: 160px"
                      :maxlength="255"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </loader-component>
          </a-col>
          <a-col
            :span="24"
            :sm="20"
            :md="collapsed ? 14 : 24"
            :lg="14"
            :xl="12"
            class="pr-4"
          >
            <a-form-item v-bind="validateInfos.longitude">
              <kiosk-board-map-component
                @change="changeMap"
                :markers="map.maker"
              >
                <template #button>
                  <div class="flex text-start" style="max-width: 400px">
                    <a-select
                      show-search
                      v-model:value="map.name"
                      :placeholder="$t('FIND_KIOSK_BOARD')"
                      :filter-option="false"
                      :not-found-content="map.searching ? undefined : null"
                      :default-active-first-option="false"
                      @search="searchingMap"
                      @change="(e) => handleClickMapOption(e)"
                    >
                      <template v-if="map.searching" #notFoundContent>
                        <a-spin size="small" />
                      </template>
                      <a-select-option
                        v-for="option in map?.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </a-select-option>
                    </a-select>
                  </div>
                </template>
              </kiosk-board-map-component>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          v-bind="validateInfos.description"
          :label="$t('BOARD_TIME_CONFIGURATIONS')"
          class="mr-3"
        >
          <a-row :gutter="[16, 16]">
            <template
              v-if="
                formStates.timeConfigurations &&
                formStates.timeConfigurations.length > 0
              "
            >
              <a-col
                v-for="(
                  timeConfiguration, index
                ) in formStates.timeConfigurations"
                :key="index"
                :span="4"
              >
                <a-card size="small">
                  <strong class="pr-2">{{
                    $t(timeConfiguration.dayOfWeek)
                  }}</strong>
                  {{ timeConfiguration.startTime }} -
                  {{ timeConfiguration.endTime }}
                </a-card>
              </a-col>
            </template>

            <template v-if="orderWeeks < 7">
              <a-col :span="4">
                <a-button
                  @click="visibleDrawer.add('time/form')"
                  class="btn h-full w-full"
                >
                  <IconPlus />
                  {{ $t('ADD_NEW_TIME') }}
                </a-button>
              </a-col>
            </template>
            <a-modal
              centered
              width="450px"
              :title="$t('ADD_NEW_TIME')"
              destroy-on-close
              :footer="null"
              :open="visibleDrawer.has('time/form')"
              @cancel="visibleDrawer.delete('time/form')"
            >
              <a-form-item
                :label="$t('LIVE_TIME')"
                v-bind="validateInfos.timeConfigurations"
              >
                <a-time-range-picker
                  v-model:value="selectedTime.time"
                  valueFormat="HH:mm"
                  format="HH:mm"
                  class="w-full"
                  :placeholder="[t('START_TIME'), t('END_TIME')]"
                />
              </a-form-item>

              <a-form-item
                :label="$t('WEEK_SELECT')"
                v-bind="validateInfos.timeConfigurations"
              >
                <a-select
                  :placeholder="t('WEEK_SELECT')"
                  class="w-full"
                  :options="optionsWeek"
                  v-model:value="selectedTime.dayOfWeek"
                >
                </a-select>
              </a-form-item>
              <div class="flex justify-between">
                <a-button @click="resetTimeConfig">
                  {{ $t('CANCEL') }}
                </a-button>

                <a-button
                  type="primary"
                  @click="addTimConfig"
                  :disabled="
                    !(selectedTime.time.length > 0 && selectedTime.dayOfWeek)
                  "
                >
                  {{ $t('SAVE') }}
                </a-button>
              </div>
            </a-modal>
          </a-row>
        </a-form-item>

        <a-row :gutter="10" class="flex justify-end w-full pb-4">
          <a-col>
            <a-button @click="$router.back()">
              {{ $t('BACK') }}
            </a-button>
          </a-col>
          <a-col>
            <a-button type="primary" @click="submitForm">
              {{ $t('SAVE') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </template>
  </scrollbar-component>
</template>

<style lang="scss" scoped>
.wrap {
  flex-wrap: wrap;
  gap: 10px;
}
</style>
