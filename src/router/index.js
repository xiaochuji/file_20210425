import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: false,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '系统管理',
      icon: 'lock',
      roles: ['admin']
    },
    children: [
      {
        path: 'log',
        component: () => import('@/views/log/index'),
        name: 'log',
        meta: {
          title: '日志'
        }
      },
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '部门管理'
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '角色管理'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '巡察组组长'
        }
      },
      {
        path: 'rolePeoper',
        component: () => import('@/views/permission/rolePeoper'),
        name: 'rolePeoper',
        meta: {
          title: '巡察组组员'
        }
      }
    ]
  },
  {
    path: '/elevent',
    component: Layout,
    redirect: '/elevent/general',
    alwaysShow: true, // will always show the root menu
    name: 'elevent',
    meta: {
      title: '十届党委巡察工作',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'general',
        component: () => import('@/views/elevent/general'),
        name: 'eleventGeneral',
        meta: {
          title: '巡察概况'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'abarbeitung',
        component: () => import('@/views/elevent/abarbeitung'),
        name: 'eleventAbarbeitung',
        meta: {
          title: '巡察整改概况'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'indicate',
        component: () => import('@/views/elevent/indicate'),
        name: 'eleventIndicate',
        meta: {
          title: '指示批示及专项会议研究巡察工作'
          // roles: ['admin']
        }
      },
      {
        path: 'campus',
        component: () => import('@/views/elevent/campus'),
        name: 'eleventcampus',
        meta: {
          title: '校发公文'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'bulletin',
        component: () => import('@/views/elevent/bulletin'),
        name: 'eleventbulletin',
        meta: {
          title: '新闻公告'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'conference',
        component: () => import('@/views/elevent/conference'),
        name: 'eleventconference',
        meta: {
          title: '巡察相关会议信息'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'leading',
        component: () => import('@/views/elevent/leading'),
        name: 'eleventleading',
        meta: {
          title: '巡察工作领导小组会'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'Committee',
        component: () => import('@/views/elevent/Committee'),
        name: 'eleventCommittee',
        meta: {
          title: '党委常委会'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'summary',
        component: () => import('@/views/elevent/summary'),
        name: 'eleventsummary',
        meta: {
          title: '问题汇总'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'handed',
        component: () => import('@/views/elevent/handed'),
        name: 'eleventhanded',
        meta: {
          title: '移交转办'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'machinery',
        component: () => import('@/views/elevent/machinery'),
        name: 'eleventmachinery',
        meta: {
          title: '机械学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'instrument',
        component: () => import('@/views/elevent/instrument'),
        name: 'eleventinstrument',
        meta: {
          title: '精仪学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      // {
      //   path: 'machinery',
      //   component: () => import('@/views/elevent/machinery'),
      //   name: 'eleventmachinery',
      //   meta: {
      //     title: '机械学院党委'
      //     // if do not set roles, means: this page does not require permission
      //   }
      // },
      {
        path: 'automate',
        component: () => import('@/views/elevent/automate'),
        name: 'eleventautomate',
        meta: {
          title: '自动化学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'minIt',
        component: () => import('@/views/elevent/minIt'),
        name: 'eleventminIt',
        meta: {
          title: '微电子学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'construction',
        component: () => import('@/views/elevent/construction'),
        name: 'eleventconstruction',
        meta: {
          title: '建工学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'architecture',
        component: () => import('@/views/elevent/architecture'),
        name: 'eleventarchitecture',
        meta: {
          title: '建筑学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'chemical',
        component: () => import('@/views/elevent/chemical'),
        name: 'eleventchemical',
        meta: {
          title: '化工学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'materials',
        component: () => import('@/views/elevent/materials'),
        name: 'eleventmaterials',
        meta: {
          title: '材料学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'chargeof',
        component: () => import('@/views/elevent/chargeof'),
        name: 'eleventchargeof',
        meta: {
          title: '经管学部党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      // {
      //   path: 'chargeof',
      //   component: () => import('@/views/elevent/chargeof'),
      //   name: 'eleventchargeof',
      //   meta: {
      //     title: '经管学部党委'
      //     // if do not set roles, means: this page does not require permission
      //   }
      // },
      {
        path: 'manage',
        component: () => import('@/views/elevent/manage'),
        name: 'eleventmanage',
        meta: {
          title: '理学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'warting',
        component: () => import('@/views/elevent/warting'),
        name: 'eleventwarting',
        meta: {
          title: '文学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'environment',
        component: () => import('@/views/elevent/environment'),
        name: 'eleventenvironment',
        meta: {
          title: '环境学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'drug',
        component: () => import('@/views/elevent/drug'),
        name: 'eleventdrug',
        meta: {
          title: '药学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'capacity',
        component: () => import('@/views/elevent/capacity'),
        name: 'eleventcapacity',
        meta: {
          title: '智能与计算学部党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'Marxism',
        component: () => import('@/views/elevent/Marxism'),
        name: 'eleventMarxism',
        meta: {
          title: '马克思主义学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'oldCadre',
        component: () => import('@/views/elevent/oldCadre'),
        name: 'eleventoldCadre',
        meta: {
          title: '老干部党总支'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'office',
        component: () => import('@/views/elevent/office'),
        name: 'eleventoffice',
        meta: {
          title: '机关党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'education',
        component: () => import('@/views/elevent/education'),
        name: 'eleventeducation',
        meta: {
          title: '教育学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      // {
      //   path: 'education',
      //   component: () => import('@/views/elevent/education'),
      //   name: 'eleventeducation',
      //   meta: {
      //     title: '教育学院党委'
      //     // if do not set roles, means: this page does not require permission
      //   }
      // },
      {
        path: 'sports',
        component: () => import('@/views/elevent/sports'),
        name: 'eleventsports',
        meta: {
          title: '体育学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'religion',
        component: () => import('@/views/elevent/religion'),
        name: 'eleventreligion',
        meta: {
          title: '国教学院党总支'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'property',
        component: () => import('@/views/elevent/property'),
        name: 'eleventproperty',
        meta: {
          title: '资产公司党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'assets',
        component: () => import('@/views/elevent/assets'),
        name: 'eleventassets',
        meta: {
          title: '图书馆档案馆党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'IC',
        component: () => import('@/views/elevent/IC'),
        name: 'eleventIC',
        meta: {
          title: '内燃所党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'logistical',
        component: () => import('@/views/elevent/logistical'),
        name: 'eleventlogistical',
        meta: {
          title: '后勤保障部党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'smallmedical',
        component: () => import('@/views/elevent/smallmedical'),
        name: 'eleventsmallmedical',
        meta: {
          title: '小幼医党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'press',
        component: () => import('@/views/elevent/press'),
        name: 'eleventpress',
        meta: {
          title: '出版社党总支'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'kindheartedness',
        component: () => import('@/views/elevent/kindheartedness'),
        name: 'eleventkindheartedness',
        meta: {
          title: '仁爱学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'truthSeeking',
        component: () => import('@/views/elevent/truthSeeking'),
        name: 'eleventtruthSeeking',
        meta: {
          title: '求是学部党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'life',
        component: () => import('@/views/elevent/life'),
        name: 'eleventlife',
        meta: {
          title: '生命学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'ocean',
        component: () => import('@/views/elevent/ocean'),
        name: 'eleventocean',
        meta: {
          title: '海洋学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'law',
        component: () => import('@/views/elevent/law'),
        name: 'eleventlaw',
        meta: {
          title: '法学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'mathematics',
        component: () => import('@/views/elevent/mathematics'),
        name: 'eleventmathematics',
        meta: {
          title: '数学学院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'prospect',
        component: () => import('@/views/elevent/prospect'),
        name: 'eleventprospect',
        meta: {
          title: '远教学院党总支'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'area',
        component: () => import('@/views/elevent/area'),
        name: 'eleventarea',
        meta: {
          title: '区域院党工委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'families',
        component: () => import('@/views/elevent/families'),
        name: 'eleventfamilies',
        meta: {
          title: '地科院党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'faculty',
        component: () => import('@/views/elevent/faculty'),
        name: 'eleventfaculty',
        meta: {
          title: '医学部党委'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'shenzhen',
        component: () => import('@/views/elevent/shenzhen'),
        name: 'eleventshenzhen',
        meta: {
          title: '深圳学院直属党支部'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  {
    path: '/funds',
    component: Layout,
    redirect: '/funds/one',
    alwaysShow: true, // will always show the root menu
    name: 'funds',
    meta: {
      title: '经费管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'one',
        component: () => import('@/views/funds/one'),
        name: 'Pagefunds',
        meta: {
          title: '2018年'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'two',
        component: () => import('@/views/funds/two'),
        name: 'twofunds',
        meta: {
          title: '2019年'
          // if do not set roles, means: this page does not require funds
        }
      },
      {
        path: 'three',
        component: () => import('@/views/funds/three'),
        name: 'threefunds',
        meta: {
          title: '2020年'
          // roles: ['admin']
        }
      },
      {
        path: 'foue',
        component: () => import('@/views/funds/foue'),
        name: 'fouefunds',
        meta: {
          title: '2021年'
          // roles: ['admin']
        }
      },
      {
        path: 'five',
        component: () => import('@/views/funds/five'),
        name: 'fivefunds',
        meta: {
          title: '2022年'
          // roles: ['admin']
        }
      },
      {
        path: 'six',
        component: () => import('@/views/funds/six'),
        name: 'sixfunds',
        meta: {
          title: '2023年'
          // roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/property',
    component: Layout,
    redirect: '/property/facility',
    alwaysShow: true, // will always show the root menu
    name: 'property',
    meta: {
      title: '资产管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'facility',
        component: () => import('@/views/property/facility'),
        name: 'facilityproperty',
        meta: {
          title: '设备管理'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'furniture',
        component: () => import('@/views/property/furniture'),
        name: 'furnitureproperty',
        meta: {
          title: '家具管理'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
