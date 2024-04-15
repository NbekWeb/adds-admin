<script setup>
import { computed, onMounted, reactive } from 'vue'
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

const route = useRoute()
const router = useRouter()

const corePinia = useCore()
const userPinia = useUser()

const { users, totalElements, totalPages, size } = storeToRefs(userPinia)
const { loadingUrl } = storeToRefs(corePinia)

const columns = reactive([
  {
    title: 'No',
    dataIndex: 'id',
    key: 'id',
    width: 10
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
    title: 'ACTIONS',
    key: 'action',
    width: 100,
    align: 'center'
  }
])

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

onMounted(() => {
  userPinia.getAllUsers(currentPage.value - 1)
})
</script>

<template>
  <page-header-component :title="$t('DashboardUsersListView')">
    <template #actions>
      <a-button type="primary" class="btn">
        <IconPlus /> {{ $t('ADD') }}
      </a-button>
    </template>
  </page-header-component>
  <loader-component loading-url="user/get/all">
    <a-table
      @change="handleTableChange"
      :columns="columns"
      bordered
      :data-source="users"
      :pagination="totalPages > 1 ? pagination : false"
      row-key="username"
      size="middle"
      class="table-custom-class"
    >
      <template #headerCell="{ column }">
        {{ $t(column.title) }}
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'id'">
          {{ tableIndex(index, totalElements, currentPage - 1, size) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button class="btn" type="primary" size="middle">
              <template #icon>
                <IconEdit />
              </template>
            </a-button>
            <a-button class="btn" type="primary" size="middle" danger>
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
<style lang="scss">
.table-custom-class {
  height: 93% !important;
}
</style>
