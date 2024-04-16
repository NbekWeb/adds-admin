<script setup>
import { storeToRefs } from 'pinia'
import useCore from '@/store/core.pinia.js'
import useBoardCategory from '@/store/board-category.pinia.js'
import { reactive, ref, watch } from 'vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconMinus from '@/components/icons/IconMinus.vue'

const model = defineModel('id')

const corePinia = useCore()
const boardCategoryPinia = useBoardCategory()
const { visibleDrawer, loadingUrl } = storeToRefs(corePinia)

const form = reactive({
  name: {
    uz: null,
    ru: null
  },
  parentId: model.value
})
const orderNumber = ref(0)
const rules = ref([
  {
    required: true,
    message: 'REQUIRED_FIELD',
    trigger: 'blur'
  }
])
function increment() {
  orderNumber.value++
}
function decrement() {
  if (orderNumber.value > 0) {
    orderNumber.value--
  }
}

watch(orderNumber, () => {
  const number = orderNumber.value.toString().replace(/[^0-9]/g, '')
  orderNumber.value = number ? number : 0
})
function cansel() {
  model.value = null
  orderNumber.value = 0
  form.name.uz = null
  form.name.ru = null
  visibleDrawer.value.delete('board/category/create')
}
function createBoardCategory() {
  boardCategoryPinia.createBoardCategory(
    {
      name: form.name,
      parentId: model.value,
      orderNumber: orderNumber.value
    },
    cansel
  )
}
</script>

<template>
  <a-drawer
    :open="visibleDrawer.has('board/category/create')"
    @close="cansel"
    :title="$t('CATEGORY_CREATE')"
  >
    <a-form layout="vertical" :model="form">
      <a-form-item :label="$t('UZBEK')" :rules="rules">
        <a-input v-model:value="form.name.uz" placeholder="Category" />
      </a-form-item>
      <a-form-item :label="$t('RUSSIAN')" :rules="rules">
        <a-input v-model:value="form.name.ru" placeholder="Category" />
      </a-form-item>
      <a-form-item>
        <a-input
          class="order-input flex justify-center"
          :placeholder="$t('ORDER_NUMBER')"
          v-model:value="orderNumber"
        >
          <template #addonBefore>
            <a-button
              @click="decrement"
              size="small"
              type="link"
              class="increment-decrement-btn flex justify-center align-center"
            >
              <IconMinus />
            </a-button>
          </template>
          <template #addonAfter>
            <a-button
              @click="increment"
              size="small"
              type="link"
              class="increment-decrement-btn flex justify-center align-center"
            >
              <IconPlus />
            </a-button>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <a-space>
      <a-button @click="cansel">
        {{ $t('BACK') }}
      </a-button>
      <a-button
        @click="createBoardCategory"
        type="primary"
        :loading="loadingUrl.has('board/category/create')"
      >
        {{ $t('SAVE') }}
      </a-button>
    </a-space>
  </a-drawer>
</template>

<style scoped lang="scss">
.order-input {
  width: 150px;
  text-align: center;
}
</style>
