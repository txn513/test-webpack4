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
      <el-table-column label="操作" v-if="treeType === 'normal'" width="260">
        <template slot-scope="scope2">
        <span v-if="scope2.row.children == undefined">
          <button  type="button" class="el-button el-button--default el-button--small" @click="clickParent(scope2.row)">
           详情
          </button>
        </span>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog title="详情" v-model="detailVisible" :visible.sync="detailVisible">

      <el-table :data="spreadChannelUserInfo" v-loading="listLoading" element-loading-text="拼命加载中">
        <el-table-column type="index" width=90"> </el-table-column>
        <el-table-column sortable align="center"  property="userId" label="编号"width=90></el-table-column>
        <el-table-column sortable align="center"  property="userName" label="昵称"width=90></el-table-column>
        <el-table-column sortable align="center"  property="phone" label="手机号"width=100></el-table-column>
        <el-table-column sortable align="center"  property="rankId" label="等级"width=90></el-table-column>
        <el-table-column sortable align="center"  property="city" label="城市"width=100></el-table-column>
        <el-table-column sortable align="center" prop="createDate" label="注册时间"width=100></el-table-column>
        <el-table-column sortable align="center"  property="regip" label="注册IP"width=130></el-table-column>
        <el-table-column sortable align="center"  property="latLon" label="注册经纬度"width=120></el-table-column>
        <el-table-column sortable align="center" prop="chaName" label="渠道"width=90></el-table-column>
      </el-table>
      <!--分页-->
      <div class="block" style="text-align:right;">
        <el-pagination @current-change="handleCurrentChange"
                       :page-size="pageSize"
                       layout="prev, pager, next"
                       :total="totalPage">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </section>

</template>


<style>

</style>
<script>
  import {getSpreadChannelUserInfoFun} from '../../../api/api.js';
  import util from '../../../common/js/util';
  import Utils from '../utils/index.js'
//  import Vue from 'vue'
  export default {
    name: 'tree-total',
    props: {
        businessTypeCode:null,
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
      },
        // 这是时间
        time: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data () {
      return {
          page: 1,
          listLoading: false,
          totalPage: 0,
          pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
          detailVisible : false,
          spreadChannelUserInfo: [],
          sprId:0,
          chaType:0
      }
    },
    computed: {
    // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          //console.log(data)
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
        clickParent: function (row)  {

            var para = {
                sprId: row.sprId,
                chaType: row.chaType,
                businessTypeCode: this.businessTypeCode,
                betweenDate:[util.dateFormat("yyyy-MM-dd",new Date(this.time[0])),util.dateFormat("yyyy-MM-dd",new Date(this.time[1]))],  //日期范围
                pageInfo: {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                },
            };
            this.sprId = row.sprId,
            this.chaType = row.chaType
            this.listLoading = true;
            getSpreadChannelUserInfoFun(para).then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    //debugger
                    this.spreadChannelUserInfo =res.data.list;
                    for(var i=0;i<this.spreadChannelUserInfo.length;i++){
                        if(this.spreadChannelUserInfo[i].rankId === 6 || this.spreadChannelUserInfo[i].rankId === 3){
                            this.spreadChannelUserInfo[i].rankId='铜牌会员'
                        } if(this.spreadChannelUserInfo[i].rankId === 2 || this.spreadChannelUserInfo[i].rankId === 8||this.spreadChannelUserInfo[i].rankId === 10 || this.spreadChannelUserInfo[i].rankId === 12){
                            this.spreadChannelUserInfo[i].rankId='银牌会员'
                        }if(this.spreadChannelUserInfo[i].rankId === 1){
                            this.spreadChannelUserInfo[i].rankId='金牌会员'
                        } if(this.spreadChannelUserInfo[i].rankId === 14){
                            this.spreadChannelUserInfo[i].rankId='钻石会员'
                        }
                    }
                    this.totalPage = res.data.paginationInfo.total;
                    this.detailVisible = true;
                } else {
                    alert("操作失败");
                }
            } , (res) => { } ).catch(() => {

            });
        },
       // 分页查询
        handleCurrentChange(page) {
            this.page = page;
           var row ={
                sprId : this.sprId,
                chaType : this.chaType
            }
            this.clickParent(row);
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
      handleDelete () {
          alert(1)
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
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