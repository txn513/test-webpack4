<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 10px; margin-top: 1%;justify-content: space-between">
            <div>
                <span class="label label-default" style="font-size: 15px">当前状态:</span>
                <span class="label label-default order-status" style="font-size: 15px">{{orderStatus}}</span>
            </div>
             <el-button  type="primary" @click="back" style="float: right" >返 回</el-button>
        </el-col>
        <h4>基本信息</h4>
        <el-table :data="orderData"  stripe  v-loading="listLoading"  border  style="width: 100%;">
            <el-table-column prop="id" label="订单编号"      show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeName" label="仓库"   align='center'   show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="下单时间"   align='center'  :formatter="dateFormat"   show-overflow-tooltip></el-table-column>
            <el-table-column prop="consignerName" label="供货人"   align='center'    show-overflow-tooltip></el-table-column>
            <el-table-column prop="consignerPhone" label="手机号码"   align='center'    show-overflow-tooltip></el-table-column>
            <el-table-column prop="consignerAddress" label="地址"   align='center'    show-overflow-tooltip></el-table-column>
          <!--  <el-table-column prop="remark" label="商品备注"   align='center'    show-overflow-tooltip></el-table-column>-->
        </el-table>

        <h4>商品信息</h4>
        <el-table :data="orderData"  stripe  v-loading="listLoading"  border  style="width: 100%;">
            <el-table-column prop="id" label="订单编号"      show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="下单时间"   align='center'  :formatter="dateFormat"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="商品分类"   align='center'    show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuBrand" label="商品品牌"   align='center'    show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityName" label="商品品质"   align='center'    show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="productImages" label="商品图片"   align='center'    show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="remark" label="商品备注"   align='center'    show-overflow-tooltip></el-table-column>
        </el-table>


        <h4>操作信息</h4>
        <el-table :data="operations" border  style="width: 100%;">
            <el-table-column prop="operatorId" label="操作者id"      show-overflow-tooltip></el-table-column>
            <el-table-column prop="operator" label="操作者"      show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="操作时间"  :formatter="dateFormat"    show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态"      show-overflow-tooltip></el-table-column>
            <el-table-column prop="operationContent" label="订单内容"   :formatter="infoContentFormatter"    show-overflow-tooltip></el-table-column>
        </el-table>

    </section>

</template>

<script>
    import OrderUtil from '../../../common/js/OrderUtil';
    import {getConsignmentOrderDetail} from "../../../api/api";
    export default {
        data() {
            return {
                id:this.$route.query.id,
                orderData:[],
                listLoading:false,
                userData:[],
                userLoading:false,
                operations:[],
                orderStatus:''
            }
        },
        methods: {
            back: function () {
                this.$router.push({path: '/consignmentOrder'});
            },
            infoContentFormatter(row, column){
                return row.operationContent.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');
            },
            //时间格式化
            dateFormat: function (row, column) {
                return OrderUtil.commonDateFormat(row, column);
            },
            formatStatus: function (row, column) {
                return OrderUtil.formatStatus(row, column);
            },
            // 传送字段数据
            getData(){
                var para = {
                    id:this.id
                };
                this.listLoading = true;
                getConsignmentOrderDetail(para).then((res) => {
                        this.listLoading = false;
                        console.log(res);
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.orderData = res.data.order;
                            this.operations = res.data.operations;
                            console.log(res.data.order[0].orderStatus);
                            console.log(this.formatStatus(res.data.order[0].orderStatus));
                            this.orderStatus = OrderUtil.formatStatusByCode( res.data.order[0].orderStatus);
                            console.log("ready");
                            this.$emit('loadedData');
                        }
                    },data => { this.listLoading = false;}
                );
            }
        },
        created(){
            this.getData();
        },
        mounted() {
            //this.$emit('loaded-data');
        },

    }

</script>

<style scoped>


</style>


