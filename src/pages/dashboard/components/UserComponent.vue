<script setup>
import IconImageEmpty from '@/components/icons/IconImageEmpty.vue'
import useAuth from '@/store/auth.pinia.js'
import { storeToRefs } from 'pinia'

const { avatar, size } = defineProps({
  avatar: {
    type: [Boolean, null],
    default: null
  },
  size: {
    type: String,
    default: 'large'
  }
})

const authPinia = useAuth()
const { user } = storeToRefs(authPinia)
</script>

<template>
  <div class="user">
    <div class="avatar">
      <template v-if="avatar">
        <img src="@/assets/images/for_remove/avatar.png" alt="" />
      </template>
      <template v-else>
        <div class="no-avatar">
          <icon-image-empty />
        </div>
      </template>
    </div>
    <div class="name">
      <b>{{ user?.fullName }} </b>
      <p class="m-0">ID: {{ user?.id }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';
.user {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($muted, 0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba($muted, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    color: $muted;
    background-color: rgba($muted, 0.2);
    font-size: 18px;
    overflow: hidden;
    svg {
      vertical-align: -2px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .name {
    width: calc(100% - 36px);
    padding-left: 0.5rem;
    font-size: 12px;
    height: 28px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
.collapsed .user {
  padding: 0;
  border: none;
  .name {
    display: none;
  }
}
</style>
