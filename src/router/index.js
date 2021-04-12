import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import Login from '../components/login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')



// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')



// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')


// import GoodsList from '../components/goods/List.vue'
// import AddGoods from '../components/goods/Add.vue'
const GoodsList = () => import(/* webpackChunkName: "GoodsList_AddGoods" */ '../components/goods/List.vue')
const AddGoods = () => import(/* webpackChunkName: "GoodsList_AddGoods" */ '../components/goods/Add.vue')


// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components//report/Report.vue')


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome,
    }, {
      path: '/users',
      component: Users
    },{
      path: '/rights',
      component: Rights
    },{
      path: '/roles',
      component: Roles
    },
    {
      path: '/categories',
      component: Cate
    },{
      path:'/params',
      component: Params
    },
    {
      path:'/goods',
      component: GoodsList
    },
    {
      path:'/goods/add',
      component: AddGoods
    },
    {
      path:'/orders',
      component: Order
    },
    {
      path:'/reports',
      component: Report
    },
    
  ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转过来
  // next 是一个函数，表示放行
  //      next('url')
  // if(to.path === 'login') return next();
  const tokenSrt = window.sessionStorage.getItem('token');
  // // if(!tokenSrt) return next({ path: '/login' });
  // next();
  if (to.name == 'login') {
    next()
  } else {
    if (tokenSrt) {
      next()
    } else {
      next({
        path: '/login'
      }) // 否则全部重定向到登录页
    }
  }
})
export default router
