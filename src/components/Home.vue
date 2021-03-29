<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主题 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <div class="toggle-button" @click="toggleButton">|||</div>
        <el-menu unique-opened :collapse="isCollapse" background-color="#333744" text-color="#fff" active-text-color="#409FFF"
          :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- index  这是是唯一的值，而json数据中id也是唯一的 -->
          <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iocnsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
            :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <!-- 路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menulist: [],
        iocnsObj: {
          '125': 'iconfont icon-icon-user',
          '103': 'iconfont icon-kongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju-tianchong',
          '145': 'iconfont icon-baobiao'
        },
        //是否折叠
        isCollapse: false,
        // 被激活的连接地址
        activePath:''
      }
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      async getMenuList() {
        const {
          data: res
        } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(this.meta.msg);
        this.menulist = res.data;
        // console.log(res);
      },
      // 折叠展开
      toggleButton() {
        this.isCollapse = !this.isCollapse;
      },
      // 点击高亮
      saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = window.sessionStorage.getItem('activePath');
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;

      span {
        margin-left: 10px;
      }
    }

    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      border: 1px solid #fff;
      margin-left: 10px;
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #f3f4ff;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    color: #fff;
    cursor: pointer;
  }
</style>
