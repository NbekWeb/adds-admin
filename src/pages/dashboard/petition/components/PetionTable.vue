<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { tableIndex } from '@/composables'
import useCore from '@/store/core.pinia.js'
import usePetition from '@/store/petition.pinia.js'

const router = useRouter()

const corePinia = useCore()
const boardPinia = usePetition()

const { petitions, totalElements, totalPages, size } = storeToRefs(boardPinia)
const { loadingUrl } = storeToRefs(corePinia)
const currentPage = ref(1)

const paginationChange = (pagination) => {
  console.log(pagination.current)
  currentPage.value = pagination.current
  boardPinia.getAllKioskBoards(pagination.current - 1)
}

const columns = ref([
  {
    title: 'INDEX',
    dataIndex: 'id',
    key: 'id',
    width: 40
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: 'PHONE_NUMBER',
    dataIndex: 'phone',
    key: 'phone',
    width: 150
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
    width: 500
  },
  {
    title: 'ADD',
    dataIndex: 'add',
    key: 'add',
    width: 150
  }
])
const pagination = computed(() => ({
  total: totalElements.value,
  current: currentPage.value,
  pageSize: size.value
}))

onMounted(() => {
  boardPinia.getAllKioskBoards(currentPage.value - 1)
})
</script>

<template>
  <a-table
    :columns="columns"
    bordered
    :data-source="petitions"
    :loading="loadingUrl.has('petition')"
    :pagination="totalPages > 1 ? pagination : false"
    @change="paginationChange"
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
      <template v-if="column.key === 'name'">
        {{ record.owner.fullName }}
      </template>
      <template v-if="column.key === 'phone'">
        +998{{ record.phoneNumber }}
      </template>
      <template v-if="column.key === 'description'">
        <a-popover title="Tavsif" placement="top">
          <template #content>
            <p class="description-content">{{ record.text }}</p>
          </template>
          <p class="description">
            {{ record.text }}
          </p>
        </a-popover>
      </template>

      <template v-if="column.key === 'add'">
        <a-button
          type="primary"
          class="btn"
          @click="
            router.push({
              name: 'DashboardKioskPostCreateFormView',
              params: { id: record.owner.id }
            })
          "
        >
          <template #icon>
            <IconPlus />
          </template>
          {{ $t('ADD') }}
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
.description,
.category {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.description-content {
  width: 500px;
  max-width: 80%;
}
.table-custom-class {
  &:global(
      .ant-pagination.ant-pagination-mini .ant-pagination-options-size-changer
    ) {
    display: none;
  }
}
</style>
