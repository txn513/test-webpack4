<template>
  <section>
    <el-table
            :data="data"
            border
            style="width: 100%"
            :row-style="showTr"
            :cell-style="showTd">
      <el-table-column v-for="(column, index) in columns" :key="column.dataIndex"
                       :label="column.text" >
        <template slot-scope="scope">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
            <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
        </span>
          <span v-else-if="index===0" class="ms-tree-space"></span>
         {{scope.row[column.dataIndex]}}
        </template>
      </el-table-column>
      <el-table-column prop="typeIcon" label="图片"  width="260">
        <template slot-scope="scope">
          <img :src="scope.row.typeIcon" width="60"  >
        </template>
      </el-table-column>
      <!--操作按钮-->
      <el-table-column label="操作" v-if="treeType === 'normal'" width="260">
        <template slot-scope="scope2">
              <el-button @click="edit(scope2.row)" type="text">编辑</el-button>
            <!--存在叶子节点，不能删除-->
            <span v-if="scope2.row.children == undefined">
              <el-button @click="handleDelete(scope2.row)" type="text">删除</el-button>
            </span>
        </template>
      </el-table-column>

    </el-table>


      <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible">
        <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="140px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
          <el-form-item label="服务分类名称" prop="typeName">
            <el-input  v-model="editForm.typeName" type="text" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="分类英文名" prop="typeEnglishName">
            <el-input  v-model="editForm.typeEnglishName" type="text" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="图片预览" prop="typeIcon">
            <el-upload
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handEditleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" style="width:400px;height: 300px "  class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="分类图片宽度" prop="widthPic">
            <el-input  v-model="editForm.widthPic" type="text" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="分类图片高度" prop="heightPic">
            <el-input  v-model="editForm.heightPic" type="text" style="width: 70%;"></el-input>
          </el-form-item>
          <el-form-item label="排序值" prop="weight">
            <el-input v-model="editForm.weight" type="text" style="width: 30%;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editFormSubmit('editForm')" >提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

  </section>

</template>


<style>

</style>
<script>
  import {getServiceTypeOne} from '../../../api/api.js';
  import {updateServiceType} from '../../../api/api.js';
  import {deleteServiceType} from '../../../api/api.js';
  import {getUploadImgUrl} from '../../../api/api.js';
  import {isUploadSuccess} from '../../../api/api.js';
  import {processResponseData} from '../../../api/api.js';
  import Utils from '../utils/index.js'

  //  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {
          //图片处理
          imageUrl: '',
          uploadUrl: getUploadImgUrl(),
          page: 1,
          listLoading: true,
          total:0,
          pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
          detailVisible : false,
          spreadChannelUserInfo: [],
          editFormVisible : false,
          typeIcon:'',
          editForm : {
              typeName: "",
              weight: "",
              typeIcon:"",
              widthPic:"",
              heightPic:"",
              typeEnglishName:""
          },
          formRules: {
              typeName: [
                  { required: true, message: '请输入服务名称', trigger: 'blur' },
                  { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
              ],
              weight: [
                  { required: true, message: '请输入排序权重，越大越靠前', trigger: 'blur' },
              ],
              typeIcon: [
                  { required: true, message: '请添加图片', trigger: 'blur' },
              ],
              /*widthPic: [
                  { required: true, message: '请添加图片宽度', trigger: 'blur' },
              ],
              heightPic: [
                  { required: true, message: '请添加图片高度', trigger: 'blur' },
              ],*/
              typeEnglishName: [
                  { required: true, message: '请输入英文名', trigger: 'blur' },
              ],
          },
      }
    },
    computed: {
    // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          console.log(data)
          return data
        }
        return me.dataSource
      }
    },
    methods: {
    // 显示行
      showTr: function ({row, rowIndex}) {

          let obj = {row, rowIndex}
          let show = (obj.row._parent ? (obj.row._parent._expanded && obj.row._parent._show) : true)
          obj.row._show = show
          return show ? '' : 'display:none;'
      },
      showTd: function ({row, column, rowIndex, columnIndex}) {

         if(columnIndex==0){
             return  'text-align:left;'
         }
          return  'text-align:center;'

      },

    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
        //编辑按钮，打开编辑框
        edit(row){
          //alert(row.value);
            var para={id:row.value};
            getServiceTypeOne(para).then((data) => {
                if (this.GLOBAL.isResonseSuccess(data)) {
                    this.editForm.id = data.data.id;
                    this.editForm.typeIcon = data.data.typeIcon;
                    this.editForm.typeName = data.data.typeName;
                    this.editForm.weight = data.data.weight;
                    this.editForm.widthPic = data.data.widthPic;
                    this.editForm.heightPic = data.data.heightPic;
                    this.editForm.typeEnglishName = data.data.typeEnglishName;
                    this.imageUrl = process.env.IMG_URL +data.data.typeIcon;
                    this.editFormVisible=true;
                }
            })
        },
        //编辑成功，提交修改请求
        editFormSubmit(ve){
            //var that = this;
            this.$refs[ve].validate((valid) => {
                if (valid) {
                    console.log(this.editForm);
                    updateServiceType(this.editForm).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.editFormVisible = false;
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            window.location.reload();
                            // this.getServiceTypeList();
                        } else {
                            this.open(data.data);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {

        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },

        //图片上传
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg';
            const isGIF = file.type === 'image/gif';
            const isPNG = file.type === 'image/png';
            const isBMP = file.type === 'image/bmp';
            const isLt2M = file.size / 1024 / 1024 < 5;

            if (!isJPG && !isGIF && !isPNG && !isBMP) {
                this.common.errorTip('上传图片必须是JPG/GIF/PNG/BMP 格式!');
            }
            if (!isLt2M) {
                this.common.errorTip('上传图片大小不能超过 5MB!');
            }
            return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
        },

        //处理编辑图片上传URL
        handEditleAvatarSuccess(res, file) {
            if (this.GLOBAL.isResonseSuccess(res)) {
                if (isUploadSuccess(res.data)) {
                    if (res.data.relativePath) {
                        this.imageUrl = process.env.IMG_URL + res.data.relativePath;
                        this.editForm.typeIcon = res.data.relativePath;
                    }
                }
            } else {
                processResponseData(res);
            }

        },

      handleDelete (row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            var para={id:row.value};
            deleteServiceType(para).then((data) => {
                if (this.GLOBAL.isResonseSuccess(data)) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    window.location.reload();
                }else {
                    alert("删除失败");
                }
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },


    }
  }
</script>
<style scoped>
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}



</style>