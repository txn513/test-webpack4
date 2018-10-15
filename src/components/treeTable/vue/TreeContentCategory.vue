<template>
  <section>
    <el-table
            :data="data"
            border
            style="width: 100%"
            :row-style="showTr"
            :cell-style="showTd"
            :header-cell-style="showTh"
            tooltip-effect="dark"
            @row-click="toggle">
      <el-table-column v-for="(column, index) in columns" :key="column.dataIndex"
                       :label="column.text">
        <template slot-scope="scope">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)" >
            <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
         </span>
          <span v-else-if="index===0" class="ms-tree-space"></span>
          <span v-if="column.dataIndex == 'iconCls'" > <i :class="scope.row[column.dataIndex]" aria-hidden="true"></i></span>
          {{scope.row[column.dataIndex]}}
        </template>
      </el-table-column>
      <el-table-column v-if="isAuth('scloud:contentcategory:update') || isAuth('scloud:contentcategory:delete')" fixed="right" label="操作"  width="260">
        <template slot-scope="scope">
          <!--<el-button v-if="isAuth('scloud:contentCategory:update')" type="primary" size="mini" @click="editStatus(scope.$index, scope.row,$event)">{{scope.row.status == 1 ? "停用" : "启用"}}</el-button>-->
          <el-button v-if="isAuth('scloud:contentcategory:update')" type="primary" size="mini" @click="handleEdit(scope.$index, scope.row,$event)">编辑</el-button>
          <el-button v-if="isAuth('scloud:contentcategory:delete')" type="primary" size="mini" @click="handleDel(scope.$index, scope.row,$event)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>


  </section>

</template>


<style>

</style>
<script>
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
          page: 1,
          listLoading: true,
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
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          console.log(data)
          return data
        }
        return me.dataSource
      }
    },
    methods: {
       handleEdit: function (index, row, event) {
             event.stopPropagation();
             event.preventDefault();
            this.$emit('handleEdit',index, row);
        },
        handleDel: function (index, row, event) {
            event.stopPropagation();
            event.preventDefault();
            this.$emit('handleDel',index, row);
        },
        editStatus: function (index, row, event) {
            event.stopPropagation();
            event.preventDefault();
            this.$emit('editStatus',index, row);
        },
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
      showTh: function ({row, column, rowIndex, columnIndex}) {

          return  'text-align:center;'

      },

      // 点击行展开下级
      toggle: function (row,event) {
          /*event.stopPropagation();
          event.preventDefault();*/
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
      handleDelete () {
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



</style>