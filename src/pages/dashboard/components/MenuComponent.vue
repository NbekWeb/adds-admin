<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useCore from '@/store/core.pinia.js'
import useAuth from '@/store/auth.pinia'
import Logo from '@/components/Logo.vue'
import UserComponent from '@/pages/dashboard/components/UserComponent.vue'
import IconGrid from '@/components/icons/IconGrid.vue'
import IconAnnouncement from '@/components/icons/IconAnnouncement.vue'
import IconCoinsStacked from '@/components/icons/IconCoinsStacked.vue'
import IconNotificationText from '@/components/icons/IconNotificationText.vue'
import IconSettings from '@/components/icons/IconSettings.vue'
import IconHelp from '@/components/icons/IconHelp.vue'
import IconPowerOff from '@/components/icons/IconPowerOff.vue'
import IconShoppingCard from '@/components/icons/IconShoppingCard.vue'
import IconUsers from '@/components/icons/IconUsers.vue'

const { collapsed } = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})
const router = useRouter()
const route = useRoute()

const corePinia = useCore()
const authPinia = useAuth()

const selected = ref([])
const activeLink = computed(() => route.fullPath.split('/')[2])
const setCollapse = ({ key }) => {
  router.push(`/dashboard/${key}`)
}
const logOut = () => {
  localStorage.clear()
  authPinia.$reset()
  router.push('/')
}
</script>

<template>
  <div class="aside" :class="[{ collapsed: collapsed }]">
    <div class="px-3">
      <a-row class="py-3" align="middle" justify="center">
        <a-col
          :xs="24"
          :sm="24"
          :md="collapsed ? 24 : 12"
          :lg="collapsed ? 24 : 8"
          :xxl="collapsed ? 24 : 6"
          class="text-center"
        >
          <logo />
        </a-col>
        <template v-if="!collapsed">
          <a-col :xs="24" :sm="24" :md="12" :lg="16" :xxl="16">
            <h2 class="m-0 logo-name">
              ADS-<span class="text-primary">PRO</span>
            </h2>
          </a-col>
        </template>
      </a-row>
      <user-component :avatar="true" class="mb-4" />
      <a-menu
        @click="setCollapse"
        v-model="selected"
        :selectedKeys="[activeLink]"
        mode="inline"
      >
        <a-menu-item :key="`main`">
          <template #icon>
            <icon-grid />
          </template>
          {{ $t('DashboardListView') }}
        </a-menu-item>
        <a-menu-item :key="`users`">
          <template #icon>
            <IconUsers />
          </template>
          {{ $t('DashboardUsersListView') }}
        </a-menu-item>
        <a-menu-item :key="`boards`">
          <template #icon>
            <icon-announcement />
          </template>
          {{ $t('DashboardBoardListView') }}
        </a-menu-item>
        <a-menu-item :key="`board-categories`">
          <template #icon>
            <icon-announcement />
          </template>
          {{ $t('DashboardBoardCategoryListView') }}
        </a-menu-item>

        <a-menu-item :key="`order`">
          <template #icon>
            <icon-shopping-card />
          </template>
          {{ $t('DashboardOrderListView') }}
        </a-menu-item>
        <!--        <a-menu-item :key="`user`">-->
        <!--          <template #icon>-->
        <!--            <icon-users />-->
        <!--          </template>-->
        <!--          {{ $t('DashboardUserListView') }}-->
        <!--        </a-menu-item>-->
        <a-menu-item :key="`payment`">
          <template #icon>
            <icon-coins-stacked />
          </template>
          {{ $t('DashboardPaymentListView') }}
        </a-menu-item>
      </a-menu>
    </div>
    <div class="aside-footer m-3">
      <ul class="aside-footer-list px-2" :class="[{ collapse: collapsed }]">
        <li>
          <a-tooltip :title="$t('Help')">
            <router-link class="text-success" :to="`/dashboard/help`">
              <a-button type="link" size="small" link>
                <icon-help />
              </a-button>
            </router-link>
          </a-tooltip>
        </li>
        <li>
          <a-tooltip :title="$t('News')">
            <router-link :to="`/dashboard/news`">
              <a-button type="link" size="small" link>
                <icon-notification-text />
              </a-button>
            </router-link>
          </a-tooltip>
        </li>
        <li>
          <a-tooltip :title="$t('Settings')">
            <router-link :to="`/dashboard/settings`">
              <a-button type="link" size="small" link>
                <icon-settings />
              </a-button>
            </router-link>
          </a-tooltip>
        </li>
        <li>
          <a-tooltip :title="$t('LogOut')">
            <a-popconfirm
              :title="$t('DOU_YOU_WANT_TO_LOG_OUT')"
              :ok-text="$t('YES')"
              :cancel-text="$t('NO')"
              @confirm="logOut"
            >
              <a-button class="log-out" type="link" size="small" link danger>
                <icon-power-off />
              </a-button>
            </a-popconfirm>
          </a-tooltip>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';
:deep(.logo) {
  font-size: 36px;
  color: $primary;
}
:deep(.ant-menu) {
  border: none !important;
}
.logo-name {
  font-weight: 700;
  * {
    font-weight: 700;
  }
}
.aside {
  height: 100%;
  overflow: auto;
  position: relative;
  .aside-footer {
    font-size: 16px;
    border-top: 1px solid rgba($muted, 0.3);
    padding-top: 1rem;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    &-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      li {
        display: flex;
        align-items: center;
        justify-content: center;

        button {
          color: $body !important;
        }
        .log-out {
          color: $danger !important;
        }
        .router-link-exact-active {
          button {
            background-color: rgb($info, 0.2);
            color: $primary !important;
          }
        }

        svg {
          vertical-align: -2px;
        }
      }
      &.collapse {
        flex-direction: column;
        li {
          padding: 0.5rem 0.6rem 0.5rem 0.6rem;
        }
      }
    }
    .btn-dark {
      li {
        button {
          color: rgba(255, 255, 255, 0.65) !important;
        }
        .log-out {
          color: $danger !important;
        }
        .router-link-exact-active {
          button {
            background: $primary;
            color: $white !important;
          }
        }
      }
    }
  }
}
.dark {
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
}
</style>
