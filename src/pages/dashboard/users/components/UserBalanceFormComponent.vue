<script setup>
import IconWallet from '@/components/icons/IconWallet.vue'
import MoneyInputComponent from '@/components/MoneyInputComponent.vue'
import { reactive, ref } from 'vue'
import useUser from '@/store/user.pinia.js'
import { useI18n } from 'vue-i18n'
import useCore from '@/store/core.pinia.js'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
})
const corePinia = useCore()
const userPinia = useUser()

const { loadingUrl } = storeToRefs(corePinia)

const open = ref(false)
const balanceRef = ref()
const form = reactive({
  amount: null,
  userId: null
})
const rule = reactive([
  { required: true, message: t('REQUIRED_FIELD'), trigger: 'blur' }
])

function handleCloseBalanceModal() {
  form.userId = null
  form.amount = null
}

function handleFillingUserBalance() {
  balanceRef.value.validate().then(() => {
    form.userId = props.userId
    userPinia.fillingUserBalance(props.userId, form, () => {
      form.userId = null
      form.amount = null
      open.value = false
    })
  })
}
</script>

<template>
  <a-popover
    @open-change="handleCloseBalanceModal"
    v-model:open="open"
    placement="topLeft"
    trigger="click"
  >
    <template #content>
      <a-form
        :model="form"
        ref="balanceRef"
        layout="vertical"
        class="balance-filling-form"
      >
        <a-form-item
          :rules="rule"
          name="amount"
          :label="`${$t('FILLING_UP_THE_USER_ACCOUNT')} (${$t('SOUM')})`"
        >
          <money-input-component
            v-model:value="form.amount"
            placeholder="1 000 000"
          />
        </a-form-item>
        <div class="flex justify-end">
          <a-space>
            <a-button @click="open = false" size="small">
              {{ $t('CANCEL') }}
            </a-button>
            <a-button
              size="small"
              type="primary"
              @click="handleFillingUserBalance"
              :loading="loadingUrl.has(`user/balance/${userId}`)"
            >
              {{ $t('FILLING') }}
            </a-button>
          </a-space>
        </div>
      </a-form>
    </template>

    <a-button class="btn" size="middle" @click="open = true">
      <template #icon>
        <IconWallet />
      </template>
    </a-button>
  </a-popover>
</template>

<style scoped lang="scss"></style>
