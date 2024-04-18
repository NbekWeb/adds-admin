<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import useCore from '@/store/core.pinia.js'
import useUser from '@/store/user.pinia.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import PhoneNumberInputComponent from '@/components/PhoneNumberInputComponent.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const { t } = useI18n()

const corePina = useCore()
const userPinia = useUser()

const id = defineModel('id')
const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)
const { visibleDrawer, loadingUrl } = storeToRefs(corePina)
const { form } = storeToRefs(userPinia)

const formRef = ref()
const rules = ref([
  {
    required: true,
    message: t('REQUIRED_FIELD'),
    trigger: 'blur'
  }
])

function close() {
  visibleDrawer.value.delete('user/form')
  id.value = null
  userPinia.clearForm()
}
function submitForm() {
  formRef.value.validateFields(['fullName', 'username']).then(() => {
    userPinia.updateUser(id.value, () => {
      userPinia.getAllUsers(currentPage - 1)
      close()
    })
  })
}
</script>

<template>
  <a-drawer :open="visibleDrawer.has('user/form')" @close="close">
    <loader-component loading-url="user/get/one">
      <a-form layout="vertical" ref="formRef" :model="form">
        <a-row :gutter="[12, 0]">
          <a-col :span="24">
            <a-form-item :label="$t('F_I_O')" name="fullName" :rules="rules">
              <a-input
                v-model:value="form.fullName"
                :placeholder="$t('F_I_O')"
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              :label="
                $t(form.role === 'DEVELOPER' ? 'USERNAME' : 'PHONE_NUMBER')
              "
              :rules="rules"
              name="username"
            >
              <template v-if="form.role === 'DEVELOPER'">
                <a-input v-model:value="form.username" />
              </template>
              <template v-else>
                <phone-number-input-component v-model:value="form.username" />
              </template>
            </a-form-item>
          </a-col>

          <template v-if="form.role === 'DEVELOPER'">
            <a-col :span="24">
              <a-form-item
                :label="$t('PASSWORD')"
                :rules="rules"
                name="password"
              >
                <a-input-password v-model:value="form.password" />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-form-item class="flex justify-end">
          <a-space>
            <a-button @click="close">
              {{ $t('CANCEL') }}
            </a-button>
            <a-button
              type="primary"
              :loading="loadingUrl.has('user/update')"
              @click="submitForm"
            >
              {{ $t('SAVE') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </loader-component>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
