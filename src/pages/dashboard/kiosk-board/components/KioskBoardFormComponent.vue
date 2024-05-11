<script setup>
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import { useRouter, useRoute } from "vue-router"
import useCore from "@/store/core.pinia.js";
import useBoardCategories from "@/store/board-categories.pinia.js";
import useKioskBoard from "@/store/kiosk-board.pinia.js";
import {Form} from "ant-design-vue";

import {api} from "@/utils/api/index.js";
import {useI18n} from "vue-i18n";
import {debounce} from "@/composables/index.js";

import LoaderComponent from "@/components/LoaderComponent.vue";
import KioskBoardMapComponent from "@/pages/dashboard/kiosk-board/components/KioskBoardMapComponent.vue";

const useForm = Form.useForm
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const coreStore = useCore()
const categoryStore = useBoardCategories()
const kioskBoardStore= useKioskBoard()

const { collapsed, loadingUrl } = storeToRefs(coreStore)
const { categories } = storeToRefs(categoryStore)

const kioskBoardId = ref(null)
const mapAddress = ref(null)
const formStates = ref({
  categoryId: null,
  name: null,
  description: null,
  longitude: null,
  latitude: null,
  timeConfigurations: []
})

const map = ref({
  maker:null,
  name: [],
  searching:false,
  options:[]
})

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
  ]
})

const { resetFields, validate, validateInfos } = useForm(formStates, rules)
const findPlaceByLatLon = (lat, lon, callback) => {
  // Find place by Lat and Lon
  map.value.maker = [
    [
      String(lat),
      String(lon),
    ]
  ]

  api({
    url: 'https://nominatim.openstreetmap.org/reverse',
    params: {
      format: 'json',
      lat: lat,
      lon: lon,
      'accept-language': 'uz',
    }
  }).then((data)=> {
    const mapName = data?.data?.display_name

    map.value.name = mapName
    mapAddress.value = mapName
    formStates.value.longitude = data?.data?.lon
    formStates.value.latitude = data?.data?.lat

    callback()
  }).catch((error)=> {
    coreStore.setToast({
      locale: error?.response?.message,
      type: 'error'
    })
  })
}

const findPlaceByName = (text) => {
  if(!text?.trim()) {
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
      'accept-language': 'uz',
    }
  }).then((data)=> {
    // value = lat and long what wrapper string
    map.value.options = data?.data?.map(item => {
      return {
        label: item?.display_name?.trim(),
        value: `${item?.lat}__${item?.lon}`
      }
    })
  }).catch((error)=> {
    coreStore.setToast({
      locale: error?.response?.message,
      type: 'error'
    })
  }).finally(() => {
    map.value.searching = false
  })
}

const searchingMap = debounce((text)=>{
  // Each 3 ms Searching Place by text
  findPlaceByName(text)
},300)

const handleClickMapOption = (value) => {
  // Lat and Lon split from String to Array
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
      if (kioskBoardId.value) {
        coreStore.loadingUrl.add('kiosk-board/owner/form')
        kioskBoardStore.updateBoard(kioskBoardId.value, formStates.value, () => {
          router.push('/dashboard/kiosk-board')
          resetFields()
          coreStore.loadingUrl.delete('kiosk-board/owner/form')
        })
      } else {
        coreStore.loadingUrl.add('kiosk-board/owner/form')
        kioskBoardStore.createKioskBoard(formStates.value, () => {
          router.push('/dashboard/kiosk-board')
          resetFields()
          coreStore.loadingUrl.delete('kiosk-board/owner/form')
        })
      }
    })
    .catch(() => {})
}

onMounted(() => {
  categoryStore.getBoardCategories()
  if (route.params?.id) {
    coreStore.loadingUrl.add('kiosk-board/owner/form')
    kioskBoardId.value = route.params.id
    kioskBoardStore.getOneKioskBoard(kioskBoardId.value, (data) => {
      formStates.value.name = data?.name
      formStates.value.categoryId = data?.category?.id
      formStates.value.description = data?.description

      findPlaceByLatLon(data?.latitude, data?.longitude, () => {
        coreStore.loadingUrl.delete('kiosk-board/owner/form')
      })
    })
  }
})
</script>

<template>
  <loader-component loading-url="kiosk-board/owner/form">
    <a-form layout="vertical" @submit.prevent="submitForm">
      <a-row :gutter="[20,10]">
        <a-col :span="24" :sm="20" :md="collapsed ? 10 : 24" :lg="10" :xl="12">
          <loader-component loading-url="get/kiosk-board/map-info">
            <a-row :gutter="[10,10]">
              <a-col :span="24">
                <a-form-item
                    :label="$t('KIOSK_BOARD_ADDRESS')"
                >
                  <a-textarea readonly v-model:value="mapAddress" :placeholder="$t('KIOSK_BOARD_ADDRESS')"/>
                </a-form-item>
              </a-col>

              <a-col :span="24" :md="14" :lg="24" :xl="12">
                <a-form-item
                  :label="$t('KIOSK_BOARD_NAME')"
                  v-bind="validateInfos.name"
                >
                  <a-input v-model:value="formStates.name" placeholder="Kiosk-Board nomi"/>
                </a-form-item>
              </a-col>

              <a-col :span="24" :md="14" :lg="24" :xl="12">
                <a-form-item :label="$t('CATEGORY')" v-bind="validateInfos.categoryId">
                  <a-tree-select
                    v-model:value="formStates.categoryId"
                    show-search
                    :placeholder="$t('SELECT_CATEGORY')"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    allow-clear
                    tree-default-expand-all
                    tree-node-filter-prop="label"
                    :tree-data-simple-mode="[categories]"
                    :tree-data="categories"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item :label="$t('DESCRIPTION')" v-bind="validateInfos.description">
                  <a-textarea
                    v-model:value="formStates.description"
                    :placeholder="$t('KIOSK_BOARD_DESCRIPTION')"
                    style="height: 100px;"
                    :maxlength="255"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </loader-component>

          <a-row :gutter="10" class="mt-4 flex justify-end">
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
        </a-col>
        <a-col :span="24" :sm="20" :md="collapsed ? 14 : 24" :lg="14" :xl="12">
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
                    <a-select-option v-for="option in map?.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </template>
            </kiosk-board-map-component>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </loader-component>
</template>


<style lang="scss" scoped>

</style>