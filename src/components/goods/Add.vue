<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeIabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addFrom.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cd"
                  v-for="(cd, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 后台上传的图片地址 -->
            <el-upload
              :action="uplodUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本组件 -->
            <quill-editor v-model="addFrom.goods_introduce">

            </quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
    <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: "0",
      //   添加商品
      addFrom: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类列表
        goods_cat: [],
        pics: [],
        // 商品详情
        goods_introduce:'',
        attrs:[],
      },
      addFromRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTabData: [],
      onlyTableData: [],
      uplodUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible:false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.$message.success("获取数据成功");
      this.catelist = res.data;
      console.log(res);
    },
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = [];
      }
      console.log(this.addFrom.goods_cat);
    },
    beforeIabLeave(activeName, oldActiveName) {
      // console.log(oldActiveName+'即将离开');
      // console.log(activeName+'即将进入');
      // console.log(this.addFrom.goods_cat.length);
      if (oldActiveName === "0" && this.addFrom.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    async tabClicked() {
      // 动态参数模板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        }
        res.data.forEach((item) => {
          // split() 字符串转数组
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTabData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态参数失败");
        }
        this.onlyTableData = res.data;
      }
    },
    //图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible  = true;
    },
    //处理移除
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addFrom.pics.findIndex((x) => x.pic === filePath);
      this.addFrom.pics.splice(i, 1);
      console.log(this.addFrom);
    },
    // 图片上传成功
    handleSuccess(response) {
      // console.log(response);
      // return;
      const picsInfo = { pic: response.data.tmp_path };
      this.addFrom.pics.push(picsInfo);
      console.log(this.addFrom);
    },
    add(){
      this.$refs.addFromRef.validate(async valid => {
        if(!valid){
          return this.$message.error('填写必要的表单信息');
        } 
        // lodash cloneDeep(obj);
       const form =  _.cloneDeep(this.addFrom);
       form.goods_cat = form.goods_cat.join(',');
      //  处理动态参数
      this.manyTabData.forEach(item=>{
        const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')};
        this.addFrom.attrs.push(newInfo);
      })
      // 处理静态属性
      this.onlyTableData.forEach(item=>{
        const  newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals};
         this.addFrom.attrs.push(newInfo);
      })
      form.attrs = this.addFrom.attrs;
      //  console.log(form);
        const {data:res} = await this.$http.post('goods',form);
        if(res.meta.status !== 201){
         return this.$message.error('添加商品失败');
        }
        this.$message.success('添加商品成功');
        this.$router.push('/goods');
      })
    }
  },
  computed: {
    cateId() {
      if (this.addFrom.goods_cat.length === 3) {
        return this.addFrom.goods_cat[2];
      }
      return null;
    },
  },
};
</script>
<style lang='less' scoped>
.el-checkbox {
  // margin: 上  右  下 左 ;
  margin: 0 10px 0 0 !important ;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>