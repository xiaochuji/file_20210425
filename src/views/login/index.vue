<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t("login.title") }}
        </h3>
        <!-- <lang-select class="set-language" /> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        {{ $t("login.logIn") }}
      </el-button>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">
            {{ $t('login.username') }} : editor
          </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          {{ $t('login.thirdparty') }}
        </el-button>
      </div> -->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t("login.thirdpartyTips") }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import router from '../../router'
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './components/SocialSignin'
import { setToken } from '@/utils/auth'
import http from '@/config/http.js'
import Layout from '@/layout'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  mixins: [http],
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getRoute() {
      const arr = [
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
      sessionStorage.setItem('route', JSON.stringify(arr))
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.apiPost('/login/login', {
        userAccount: this.loginForm.username,
        userPassword: this.loginForm.password
      }).then((res) => {
        if (res.res) {
          setToken(res.token)
          this.$router.push({
            path: '/permission'
          })
          this.getRoute()
        }
      })
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     this.$store.dispatch('user/login', this.loginForm)
      //       .then(() => {
      //         setToken(res.token)
      //         alert(123)
      //         this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      //         this.loading = false
      //       })
      //       .catch(() => {
      //         this.loading = false
      //       })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
