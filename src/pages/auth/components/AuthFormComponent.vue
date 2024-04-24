<script setup>
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Form } from 'ant-design-vue'
import useCore from '@/store/core.pinia.js'
import useAuth from '@/store/auth.pinia.js'

const useForm = Form.useForm
const { t } = useI18n()
const corePinia = useCore()
const authPinia = useAuth()

const { loadingUrl } = storeToRefs(corePinia)

const formRef = ref(null)

const formState = reactive({
  username: null,
  password: null
})

const rules = ref([
  {
    required: true,
    message: t('REQUIRED_FIELD'),
    trigger: 'change'
  }
])

function onSubmit() {
  formRef.value
    .validate()
    .then((value) => {
      authPinia.login(value)
    })
    .catch((error) => {})
}
</script>

<template>
  <a-form ref="formRef" layout="vertical" :model="formState">
    <a-form-item label="Login" :rules="rules" name="username">
      <a-input size="default" v-model:value="formState.username" />
    </a-form-item>
    <a-form-item label="Password" name="password" :rules="rules">
      <a-input-password size="default" v-model:value="formState.password" />
    </a-form-item>
    <a-form-item>
      <a-button
        class="w-full mb-2"
        html-type="submit"
        type="primary"
        @click="onSubmit"
      >
        Login
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="scss"></style>
