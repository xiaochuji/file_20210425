<template>
  <div class="content" style="overflow-y: auto;padding-right: 0;padding-left: 0;" :class="{'has-logo':showLogo}">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <div class="dis">
      <pan-thumb :image="avatar" :width="width" :height="height" style="margin:10px 20px;background: #fff;color: #000;fint-size: 12px;display: none">
        <div style="margin-bottom: 5px;width:100%;height:20px;line-height: 20px">当前角色:</div>
        <span class="pan-info-roles">{{ name2 }}</span>
      </pan-thumb>
    </div>
    <div class="hello" style="display: none">
      <span>{{ username }}你好</span>
      <span>{{ name2 }}</span>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>

    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import PanThumb from '@/components/PanThumb'

export default {
  components: { SidebarItem, Logo, PanThumb },
  data() {
    return {
      routes: [],
      width: '100px',
      height: '100px',
      name2: sessionStorage.getItem('position'),
      username: sessionStorage.getItem('userName'),
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.routes = JSON.parse(sessionStorage.getItem('route'))
    console.log(this.routes, 11)
  }
}
</script>
<style scoped>
  .content::-webkit-scrollbar {
    display: none;/*隐藏滚动条*/
  }
.pan-info-roles {
  font-size: 12px;
  font-weight: 700;
  color: #333;
  display: block;
}
.dis{
  text-align: center;
}
.hello{
  width: 100%;
  height: 40px;
  line-height: 20px;
}
.hello span{
  display: inline-block;
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: #fff;
}
</style>
