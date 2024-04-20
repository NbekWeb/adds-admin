<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { tableIndex } from '@/composables'
import useUser from '@/store/user.pinia'
import useCore from '@/store/core.pinia'

import IconTrash from '@/components/icons/IconTrash.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import PageHeaderComponent from '@/components/PageHeaderComponent.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import UserFormComponent from '@/pages/dashboard/users/components/UserFormComponent.vue'

const route = useRoute()
const router = useRouter()

const corePinia = useCore()
const userPinia = useUser()

const { loadingUrl, visibleDrawer } = storeToRefs(corePinia)
const { users, totalElements, totalPages, size } = storeToRefs(userPinia)

const reg = new RegExp(`^([0-9]{2})([0-9]{3})([0-9]{2})([0-9]{${2}})`)

const columns = reactive([
  {
    title: 'INDEX',
    dataIndex: 'id',
    key: 'id',
    width: 40,
    align: 'center'
  },
  {
    title: 'F_I_O',
    dataIndex: 'fullName',
    key: 'fullName'
  },
  {
    title: 'PHONE_NUMBER',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'ROLE',
    dataIndex: 'role',
    key: 'role'
  },
  {
    title: 'STATUS',
    dataIndex: 'active',
    key: 'active',
    width: 110,
    align: 'center'
  },
  {
    title: 'ACTIONS',
    key: 'action',
    width: 100,
    align: 'center'
  }
])
const userId = ref(null)

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

const pagination = computed(() => ({
  total: totalElements.value,
  current: currentPage.value,
  pageSize: size.value
}))

function handleTableChange(pag) {
  router.push({
    query: {
      page: pag.current
    }
  })
  userPinia.getAllUsers(pag.current - 1)
}

function deleteUserById(id) {
  userPinia.deleteUser(id, () => {
    userPinia.getAllUsers(currentPage.value - 1)
  })
}

function handleChangeUser(id) {
  visibleDrawer.value.add('user/form')
  userId.value = id
  userPinia.getUserById(id)
}
function handleChangeUserStatus(id, status) {
  userPinia.updateUserStatus(id, status, () => {
    userPinia.getAllUsers(currentPage.value - 1)
  })
}
onMounted(() => {
  userPinia.getAllUsers(currentPage.value - 1)
})
</script>

<template>
  <page-header-component :title="$t('DashboardUsersListView')">
    <template #actions>
      <a-button
        type="primary"
        class="btn"
        @click="visibleDrawer.add('user/form')"
      >
        <IconPlus /> {{ $t('ADD') }}
      </a-button>
    </template>
  </page-header-component>
  <user-form-component v-model:id="userId" />
  <loader-component loading-url="user/get/all">
    <a-table
      @change="handleTableChange"
      :columns="columns"
      bordered
      :data-source="users"
      :pagination="totalPages > 1 ? pagination : false"
      row-key="username"
      size="middle"
      :scroll="{ y: 'calc(100vh - 250px)', x: 'max-content' }"
      class="table-custom-class"
    >
      <template #headerCell="{ column }">
        {{ $t(column.title) }}
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'id'">
          {{ tableIndex(index, totalElements, currentPage - 1, size) }}
        </template>
        <template v-if="column.key === 'username'">
          {{ record.username?.replace(reg, '$1 $2-$3-$4') }}
        </template>
        <template v-if="column.key === 'active'">
          <a-switch
            @click="handleChangeUserStatus(record.id, !record.active)"
            :checked="record.active"
            :loading="loadingUrl.has(`user/change/status/${record.id}`)"
            :checked-children="$t('ACTIVE')"
            :un-checked-children="$t('INACTIVE')"
            :style="{
              backgroundColor: `${record.active ? 'green' : 'red'}`
            }"
          />
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              class="btn"
              type="primary"
              size="middle"
              @click="handleChangeUser(record.id)"
            >
              <template #icon>
                <IconEdit />
              </template>
            </a-button>
            <a-button
              :loading="loadingUrl.has(`user/delete/${record.id}`)"
              @click="deleteUserById(record.id)"
              class="btn"
              type="primary"
              size="middle"
              danger
            >
              <template #icon>
                <IconTrash />
              </template>
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </loader-component>
</template>
<style lang="scss"></style>
