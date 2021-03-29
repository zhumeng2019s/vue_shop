<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <!-- for 嵌套 渲染二级权限 -->
                <el-row
                  :class="[in2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, in2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, in3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index">#</el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
    <!-- close函数监听关闭事件 -->
      <!-- 树型控件 -->
      <el-tree :data="rightslist" :props="treeProps"  show-checkbox node-key="id" 
      default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      // 控制分权框显隐
      setRightDialogVisible: false,
      // 权限数据
      rightslist:[],
      // 数型控件的属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      // 默认选中的节点id值
      defKeys:[],
      // 当前 id
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色权限列表失败");
      }
      this.rolesList = res.data;
      // console.log(res);
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操将永久权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
      return  this.$message.error("删除权限失败");
      }
      role.children = res.data;
      // this.getRolesList();
    },

    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree ");
      if (res.meta.status !== 200) {
       return this.$message.error("获取权限失败");
      }
      console.log(res);
      this.rightslist = res.data;
      // 递归获取三级节点id
      this.getLeafKeys(role,this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 递归函数，获取角色下权限id
    getLeafKeys(node,arr){
      // 如果当前node节点中不包括children属性，则是三级节点
      if(!node.children){
        return arr.push(node.id);
      }
      node.children.forEach(item =>{
        this.getLeafKeys(item,arr);
      })
    },
    // 监听权限对话框关闭
    setRightDialogClosed(){
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights(){
      const  keys = [
         ...this.$refs.treeRef.getCheckedKeys(),
         ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(',');
      const {data:res} =   await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
       if (res.meta.status !== 200) {
       return this.$message.error("分配权限失败");
      }
      this.$message.success('分配权限成功');
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

