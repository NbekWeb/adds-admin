import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/pages/dashboard/DashboardView.vue'
import DashboardListView from '@/pages/dashboard/DashboardListView.vue'
import NotFound from '@/pages/_404.vue'
import ServerError from '@/pages/_500.vue'
import DashboardUsersListView from '@/pages/dashboard/users/DashboardUsersListView.vue'
import DashboardUserView from '../pages/dashboard/users/DashboardUserView.vue'
import DashboardBoardView from '@/pages/dashboard/board/DashboardBoardView.vue'
import DashboardBoardListView from '@/pages/dashboard/board/DashboardBoardListView.vue'
import DashboardBoardCategoryView from '@/pages/dashboard/board-category/DashboardBoardCategoryView.vue'
import DashboardBoardCategoryListView from '@/pages/dashboard/board-category/DashboardBoardCategoryListView.vue'
import DashboardOrderView from '@/pages/dashboard/order/DashboardOrderView.vue'
import DashboardOrderListView from '@/pages/dashboard/order/DashboardOrderListView.vue'
import DashboardKioskBoardView from '@/pages/dashboard/kiosk-board/DashboardKioskBoardView.vue'
import DashboardKioskBoardListView from '@/pages/dashboard/kiosk-board/DashboardKioskBoardListView.vue'
import DashboardKioskPostCreateFormView from '@/pages/dashboard/kiosk-board/create/DashboardKioskPostCreateFormView.vue'


const AuthView = () => import('@/pages/auth/AuthView.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AuthView',
      component: AuthView
    },
    {
      path: '/dashboard',
      name: 'DashboardView',
      component: DashboardView,
      redirect: '/dashboard/main',
      children: [
        {
          path: 'main',
          name: 'DashboardListView',
          component: DashboardListView
        },
        {
          path: 'users',
          name: 'DashboardUserView',
          component: DashboardUserView,
          children: [
            {
              path: '',
              name: 'DashboardUsersListView',
              component: DashboardUsersListView
            }
          ]
        },
        {
          path: 'boards',
          name: 'DashboardBoardView',
          component: DashboardBoardView,
          children: [
            {
              path: '',
              name: 'DashboardBoardListView',
              component: DashboardBoardListView
            }
          ]
        },
        {
          path: 'kiosk-boards',
          name: 'DashboardKioskBoardView',
          component: DashboardKioskBoardView,
          children: [
            {
              path: '',
              name: 'DashboardKioskBoardListView',
              component: DashboardKioskBoardListView
            },
            {
              path: 'create',
              name: 'DashboardKioskPostCreateFormView',
              component: DashboardKioskPostCreateFormView
            }
          ]
        },
        {
          path: 'board-categories',
          name: 'DashboardBoardCategoryView',
          component: DashboardBoardCategoryView,
          children: [
            {
              path: '',
              name: 'DashboardBoardCategoryListView',
              component: DashboardBoardCategoryListView
            }
          ]
        },
        {
          path: 'orders',
          name: 'DashboardOrderView',
          component: DashboardOrderView,
          children: [
            {
              path: '',
              name: 'DashboardOrderListView',
              component: DashboardOrderListView
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound,
      name: 'DashboardNotFond'
    },
    {
      path: '/500',
      component: ServerError,
      name: 'ServerError'
    }
  ]
})

const routerFactory = (i18n) => {
  router.beforeEach((to, from, next) => {
    document.title = i18n.t(to.name)
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      if (to.path.includes('dashboard')) {
        return next()
      } else if (to.name === 'ServerError') {
        return next()
      } else {
        return next({ name: 'DashboardView' })
      }
    } else {
      if (!to.path.includes('dashboard')) {
        return next()
      } else {
        return next({ name: 'AuthView' })
      }
    }
  })
  return router
}

export default routerFactory
