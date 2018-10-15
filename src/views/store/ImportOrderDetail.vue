<template>

  <section>
    <!-- 列表展示 -->
    <el-table :data="importOrderDetails" stripe style="width: 100%">
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable prop="supplierName" label="供应商" show-overflow-tooltip></el-table-column>
      <el-table-column sortable prop="productName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="productCode" label="商品型号"></el-table-column>
      <el-table-column prop="productProperty" label="商品属性" show-overflow-tooltip></el-table-column>
      <el-table-column prop="planQty" label="预到数量" ></el-table-column>
      <el-table-column prop="realQty" label="已收数量" ></el-table-column>
      <el-table-column prop="name" label="收货人"></el-table-column>
      <el-table-column  prop="packagesNumber" label="实收数量" width="100">
        <template slot-scope = "scope" v-if="scope.row.planQty!= scope.row.realQty" >
          <el-input :disabled = "!isShow"  v-model="scope.row.packagesNumber" type="number" min="1" ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="receivedTime" label="收货时间" width="175" :formatter="formatDate" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" class-name="small-padding fixed-width" >
        <template v-if="isShow" slot-scope="scope">
          <el-button v-if="scope.row.planQty!= scope.row.realQty"  @click="signImportOrder(scope.row)" type="primary" size="mini">确认收货</el-button>
          <el-button v-if="scope.row.orderStatus != 0" @click="cancel(scope.row)" type="primary" size="mini">取消收货</el-button>
        </template>
      </el-table-column>

    </el-table>

  </section>

</template>

<script>
    import util from '../../common/js/util'
    import {queryImportDetailsByImportNo,signImportOrder,cancelImportOrder} from '../../api/api';
    import parse from './export/ParseTypeFun'
    import moment from 'moment';

    export default {

        data() {

            return {
                importNo: this.$route.query.importNo,  // 获取入库主页面传递的参数
                flag:this.$route.query.flag,
                importOrderDetails: [],    // 表格数据--入库详情单列表
                listLoading: false,
                isShow: true,

            }
        },

        methods: {
            // 查询入库单商品明细
            queryImportDetailsByImportNo() {
                // debugger
                let param = {
                    importNo: this.importNo
                };
                this.listLoading = true;
                queryImportDetailsByImportNo(param).then(
                    res => {
                        this.listLoading = false;
                        this.importOrderDetails = res.data;
                    }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
                if(this.flag){
                    this.isShow = false;

                }
            },

            // 签收
            signImportOrder(row) {
               // debugger
                let param = {
                    id:row.id,
                    importNo: row.importNo,
                    packagesNumber:row.packagesNumber,
                    articleNo:row.articleNo,
                    importTime:row.importTime
                };
                this.listLoading = true;
                if(row.packagesNumber <= 0){
                    this.$message.error("实收数量要求大于0");
                    return;
                }
                if(parseInt(row.packagesNumber)+parseInt(row.realQty)>parseInt(row.planQty)){
                    this.$message.error("实收数量与已收数量之和不能超过预收数量");
                    return;
                }
                if(row.packagesNumber % 1 != 0||!row.packagesNumber){

                    this.$message.error("实收数量应该为正整数");
                    return;
                }
                signImportOrder(param).then(
                    res => {
                        this.listLoading = false;
                        this.queryImportDetailsByImportNo();
                    }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            // 取消收货
            cancel(row) {
                //debugger
                let param = {
                    id:row.id,
                    importNo: row.importNo,
                    articleNo:row.articleNo,
                };
                this.listLoading = true;
                //console.log(row.importNo);
                //console.log(row.articleNo);
                cancelImportOrder(param).then(
                    res => {
                        this.listLoading = false;
                        this.queryImportDetailsByImportNo();
                    }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            // 时间格式化:YYYY-MM-DD HH:mm:ss
            formatDate(row, column, cellValue) {
                if(cellValue === null || cellValue === undefined || cellValue === (-2209017600000)){
                    return '';
                }
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        mounted() {
            this.queryImportDetailsByImportNo();
        }
    }
</script>

<style>

</style>