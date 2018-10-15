<template>
  <section>
    <el-table
            :data="data"
            border
            style="width: 100%"
            :row-style="showTr"
            :cell-style="showTd"
            :header-cell-style="showTh"
            :span-method="arraySpanMethod"
            @row-click="toggle"
            v-loading="listLoading">
      <el-table-column v-for="(column, index) in columns" :key="column.dataIndex"
                       :label="column.text">
        <template slot-scope="scope">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)" >
            <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
         </span>
          <!--<span v-else-if="index===0" class="ms-tree-space"></span>-->
            <span v-if="column.dataIndex == 'businessTypeCode'&&scope.row[column.dataIndex]" v-text="getBusinessId(scope.row[column.dataIndex])">

          </span>
          <span v-else-if="column.dataIndex == 'mainImgPath'&&scope.row[column.dataIndex]" >
              <img :src="getImgUrl(scope.row[column.dataIndex])" style="width: 50px;height: 50px;">
          </span>
            <span v-else-if="column.dataIndex == 'mainImgPath'&&!scope.row[column.dataIndex]" >
          </span>
          <!--<span v-else-if="column.dataIndex == 'auditType' && scope.row.propertyValue" >
              <span v-if="scope.row.auditFlag == 0" >
                  <el-button v-if="isAuth('mpys:product:audit')" type="danger" size="mini" @click="handleAuditBy(scope.$index, scope.row)">审核</el-button>
              </span>
              <span v-else  >{{scope.row[column.dataIndex]}}</span>

            <el-button type="danger" size="mini" @click="handleAudit(scope.$index, scope.row ,$event)">审核详情</el-button>
          </span>-->
          <!--<span v-else-if="column.dataIndex == 'delete' && scope.row.wikCode" >
            <el-button v-if="isAuth('mpys:product:delete')" type="danger" size="mini" @click="handleDelete(scope.$index, scope.row, $event)">删除</el-button>
          </span>-->
            <span v-else >{{scope.row[column.dataIndex]}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isAuth('mpys:product:update') || isAuth('mpys:product:view') || isAuth('mpys:product:delete')"  fixed="right" label="操作"  width="260">
        <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:product:delete')" type="primary" size="mini" @click="handleDeleteSpu(scope.$index, scope.row, $event)">删除</el-button>
                    <el-button v-if="isAuth('mpys:product:update')" type="primary" size="mini" @click="handleEdit(scope.$index, scope.row, $event)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:product:view')" type="primary" size="mini" @click="handleQuery(scope.$index, scope.row, $event)">查看</el-button>
        </template>
      </el-table-column>

    </el-table>


  </section>

</template>


<style>

</style>
<script>
  import {getSpreadChannelUserInfoFun} from '../../../api/api.js';
  import Utils from '../utils/index.js'
  import util from '@/common/js/util';

//  import Vue from 'vue'
  export default {
    name: 'tree-product',
    props: {
        listLoading: {
            type: Boolean,
            default: function () {
                return false
            }
        },
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
          page: 1,
          total:0,
          pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
          detailVisible : false,
          spreadChannelUserInfo: [],
      }
    },
    computed: {
      // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeProductToArray(me.dataSource, null, null, me.defaultExpandAll)
          console.log(data)
          return data
        }
        return me.list
      }
    },
    methods: {
        /**获取类型**/
        getBusinessId(businessId){
            return util.formatGoodsName(businessId);
        },
        /**图片拼接**/
        getImgUrl(result){
            return this.GLOBAL.getImgUrl(result);
        },

        handleEdit: function (index, row, event) {
            event.stopPropagation();
            event.preventDefault();
            this.$emit('handleEdit',index, row);
        },
        handleAudit: function (index, row, event) {
            event.stopPropagation();
            event.preventDefault();
            this.$emit('handleAudit',index, row);
        },
        handleQuery: function (index, row, event) {
            event.stopPropagation();
            event.preventDefault();
            this.$emit('handleQuery',index, row);
        },
        handleDelete: function (index, row, event) {
            event.stopPropagation();
            event.preventDefault();
            this.$emit('handleDelete',index, row);
        },
        handleDeleteSpu: function (index, row, event) {
            event.stopPropagation();
            event.preventDefault();
            this.$emit('handleDeleteSpu',index, row);
        },
        handleAuditBy: function (index, row) {
            this.$emit('handleAuditBy',index, row);
        },
    // 显示行
      showTr: function ({row, rowIndex}) {
          let obj = {row, rowIndex}
          let show = (obj.row._parent ? (obj.row._parent._expanded && obj.row._parent._show) : true)
          obj.row._show = show
          return show ? '' : 'display:none;'
      },
        //合并最后一列
    arraySpanMethod({ row, column, rowIndex, columnIndex}) {
       if(row.children && columnIndex == this.columns.length && row._expanded) {
           return {
               rowspan:  row.children.length+1,
               colspan: 1
           };
        }

    },
      showTd: function ({row, column, rowIndex, columnIndex}) {

         if(columnIndex==0){
             return  'text-align:left;'
         }
          return  'text-align:center;'

      },
      showTh: function ({row, column, rowIndex, columnIndex}) {

          return  'text-align:center;'

      },

      // 点击行展开下级
      toggle: function (row) {
          row._expanded = !row._expanded
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
    }
  }
</script>
<style scoped>

  th{
    text-align: center;
  }
  .ms-tree-space{
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }


</style>