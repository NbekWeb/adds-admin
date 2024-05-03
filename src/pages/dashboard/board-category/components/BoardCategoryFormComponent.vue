<script setup>
import { reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useCore from '@/store/core.pinia.js'
import useBoardCategory from '@/store/board-category.pinia.js'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconMinus from '@/components/icons/IconMinus.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const model = defineModel('id')

const corePinia = useCore()
const boardCategoryPinia = useBoardCategory()
const { visibleDrawer, loadingUrl } = storeToRefs(corePinia)

const formRef = ref()
const form = reactive({
  name: {
    uz: null,
    ru: null
  },
  parentId: null,
  orderNumber: 0
})

const rules = ref([
  {
    required: true,
    message: t('REQUIRED_FIELD'),
    trigger: 'blur'
  }
])
function increment() {
  form.orderNumber++
}
function decrement() {
  if (form.orderNumber > 0) {
    form.orderNumber--
  }
}

watch(form, () => {
  const number = form.orderNumber.toString().replace(/[^0-9]/g, '')
  form.orderNumber = number ? number : 0
})
function cansel() {
  model.value = null
  form.name.uz = null
  form.name.ru = null
  form.orderNumber = 0
  visibleDrawer.value.delete('board/category/create')
}
function createBoardCategory() {
  formRef.value
    .validate()
    .then(() => {
      form.parentId = model.value
      boardCategoryPinia.createBoardCategory(form, cansel)
    })
    .catch(() => {})
}
</script>

<template>
  <a-drawer
    :open="visibleDrawer.has('board/category/create')"
    @close="cansel"
    :title="$t('CATEGORY_CREATE')"
  >
    <a-form layout="vertical" :model="form" ref="formRef">
      <a-form-item :label="$t('UZBEK')" :name="['name', 'uz']" :rules="rules">
        <a-input v-model:value="form.name.uz" placeholder="Category" />
      </a-form-item>
      <a-form-item :label="$t('RUSSIAN')" :name="['name', 'ru']" :rules="rules">
        <a-input v-model:value="form.name.ru" placeholder="Category" />
      </a-form-item>
      <a-form-item :label="$t('ORDER_NUMBER')" name="orderNumber">
        <a-input
          class="order-input flex justify-center"
          :placeholder="$t('ORDER_NUMBER')"
          v-model:value="form.orderNumber"
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
