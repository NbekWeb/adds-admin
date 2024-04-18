<script setup>
import { storeToRefs } from 'pinia'
import { fileBaseUrl } from '@/composables/index.js'
import useCore from '@/store/core.pinia.js'
import useOrder from '@/store/order.pinia.js'
import ScrollbarComponent from '@/components/ScrollbarComponent.vue'
import IconLoader from '@/components/icons/IconLoader.vue'

const corePinia = useCore()
const orderPinia = useOrder()

const { visibleDrawer, loadingUrl } = storeToRefs(corePinia)
const { post } = storeToRefs(orderPinia)

function closeDrawer() {
  visibleDrawer.value.delete('post/get/one')
  orderPinia.clearPost()
}
</script>

<template>
  <a-drawer
    :open="visibleDrawer.has('post/get/one')"
    @close="closeDrawer"
    width="500"
    :title="$t('POST')"
  >
    <a-spin :spinning="loadingUrl.has('get/post/one')">
      <template #indicator>
        <icon-loader />
      </template>
      <scrollbar-component height="calc(100vh - 110px)">
        <template #content>
          <template v-if="post?.messageType === 'IMAGE'">
            <div class="post-image mb-2">
              <img :src="`${fileBaseUrl}/file/${post?.fileHashId}`" alt="" />
            </div>
          </template>
          <div>
            <div>
              <p v-html="post?.text"></p>
            </div>
          </div>
          <div>
            <a-button
              type="primary"
              :href="button.url"
              v-for="button in post?.buttons"
              class="w-full mb-2"
            >
              {{ button.text }}
            </a-button>
          </div>
        </template>
      </scrollbar-component>
    </a-spin>
  </a-drawer>
</template>

<style scoped lang="scss">
.post-image {
  width: 100%;
  height: 300px;
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}
</style>
