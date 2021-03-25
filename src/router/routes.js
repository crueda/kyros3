import store from '@/store/index.js'

function guard (to, from, next) {
  if (store.state.app.loggedIn) {
    next()
  } else {
    next('/login')
  }
}

function guardAdmin (to, from, next) {
  if (store.state.app.loggedIn && store.state.app.role === 'admin') {
    next()
  } else {
    next('/login')
  }
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: guard,
    children: [
      {path: '/dashboard', name: 'dashboard', component: () => import('pages/Dashboard.vue')},
    ]
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    // component: () => import('pages/Error404.vue')
    component: () => import('pages/Login.vue')
  })
}

export default routes
