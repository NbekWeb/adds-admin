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
    destroy-on-close
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
              <img
                :src="`${fileBaseUrl}/file/${post?.fileDto.fileHashId}`"
                alt=""
              />
            </div>
          </template>
          <template v-if="post?.messageType === 'VIDEO'">
            <div class="flex justify-center">
              <video-player-component
                class="plyr-video"
                :file="{
                  snapshotHashId: post?.snapshotHashId,
                  hashId: post?.fileDto?.fileHashId
                }"
              />
            </div>
          </template>
          <template v-if="post?.messageType === 'DOCUMENT'">
            <div class="document justify-between align-center p-2">
              <span class="flex align-center">
                <IconFile />
                <span>{{ post?.fileName }}</span>
              </span>
              <a-space class="ml-3">
                <a
                  target="_blank"
                  rel="opener"
                  :href="`${fileBaseUrl}/file/${post?.fileHashId}`"
                >
                  <a-button class="btn" type="text">
                    <template #icon>
                      <IconEye />
                    </template>
                  </a-button>
                </a>
              </a-space>
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
@import '@/assets/styles/variable';
.post-image {
  width: 100%;
  height: 300px;
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}
.plyr-video {
  width: 100% !important;
  height: 300px !important;
}
.document {
  display: inline-flex;
  width: 100%;
  background: $light;
  font-size: 24px;
  border-radius: 4px;
  span {
    margin-left: 4px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  button {
    font-size: 18px;
  }
}
</style>
