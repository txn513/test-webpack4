<template>

    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 10px; margin-top: 1%;justify-content: space-between">
            <div>
                <span class="label label-default" style="font-size: 15px">当前状态</span>
                <span class="label label-default" style="font-size: 15px"> > </span>
                <span class="label label-default order-status" style="font-size: 15px" >{{status}}</span>
            </div>
            <el-button  type="primary" @click="back" style="float: right" >返 回</el-button>
        </el-col>

        <el-col :span="24" class="toolbar" style="padding-bottom: 10px; margin-top: 1%;justify-content: space-between">
            <span class="label label-default" style="font-size: 15px">基本信息</span>
        </el-col>
        <el-table :data="infoDate"  stripe   v-loading="infoLoading" border  style="width: 100%;">
            <el-table-column prop="id" label="订单编号"  align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="下单时间"   align='center' sortable :formatter="dateCreateTime"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="userId" label="用户账号"   align='center' sortable  :formatter="judgeUser"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="receiverName" label="供货人"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="receiverPhone" label="手机号码"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="receiverAddress" label="地址"   align='center' sortable  show-overflow-tooltip></el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar" style="padding-bottom: 10px; margin-top: 1%;justify-content: space-between">
            <span class="label label-default" style="font-size: 15px">商品信息</span>
        </el-col>
        <el-table :data="orderDate"  stripe   v-loading="listLoading" border  style="width: 100%;">
            <el-table-column prop="id" label="订单编号"  align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="下单时间"   align='center' sortable :formatter="dateCreateTime"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="商品分类"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuBrand" label="商品品牌"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityName" label="商品品质"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="" label="商品图片"   align='center' sortable show-overflow-tooltip >
                <template slot-scope="scope"><img :src="scope.imgPath" class="avatar" ></template>
            </el-table-column>
            <el-table-column prop="remark" label="商品备注"   align='center' sortable  show-overflow-tooltip></el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar" style="padding-bottom: 10px; margin-top: 1%;justify-content: space-between">
            <span class="label label-default" style="font-size: 15px">操作信息</span>
        </el-col>

        <el-table :data="userDate"   v-loading="userLoading" border  style="width: 100%;">
            <el-table-column prop="operator" label="操作者"  align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="操作时间"  align='center' :formatter="dateUpdateTime" sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column  prop="operationContent" label="操作"  align='center' sortable  show-overflow-tooltip></el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0.5%;display: flex;justify-content: center" v-if="isShow">
            <el-button   type="success" style="align-content: center; " @click="btnAgreeReturn"> 同意退货</el-button>
            <el-button   type="warning" style="align-content: center; " @click="refuseReturnOrder"> 拒绝退货</el-button>
        </el-col>


    </section>


</template>


<script>


    import util from  "@/common/js/util";
    import OrderUtil from '../../../common/js/OrderUtil';
    import {queryConsignmentReturnById,updateConsignmentOrderStatus,consignmentOrderupdateStatus} from "../../../api/api";
    export default {

        data() {

            return {
                id:this.$route.query.id,
                orderId:this.$route.query.orderId,
                orderStatus:this.$route.query.orderStatus,
                orderDate:[],
                listLoading:false,
                userDate:[],
                userLoading:false,
                infoDate:[],
                infoLoading:false,
                isShow:true,
                status:'',


            }
        },

        methods: {

            judgeUser:function(row ,column){
                if(  row.userId == 0){
                    return ''
                }
                return row.userId;
            },
            dateCreateTime:function(row ,column){
                if(row.createTime == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(row.createTime));
            },
            dateUpdateTime :function(row ,column){
                var time = row[column.property];
                if(time == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(time));
            },
            //返回列表界面
            back: function () {
                this.$router.push({path: '/consignmentOrderReturn'});
            },
            //同意退货
            btnAgreeReturn(){
                this.$confirm('确认同意退货吗？', '提示', {}).then(() => {
                    var para = {
                        id:this.id,
                    };
                    this.listLoading = true;
                    consignmentOrderupdateStatus(para).then((res) => {
                            this.listLoading = false;
                            OrderUtil.handleResult(res,()=>{
                                this.getData();
                               // this.status = '待发货';

                            });
                        }
                    );
                });
            },
            //拒绝退货
            refuseReturnOrder(){
                this.$confirm('确认拒绝吗？', '提示', {}).then(() => {
                    var para = {
                        id:this.id,
                        orderId:this.orderId,
                    };
                    this.listLoading = true;
                    updateConsignmentOrderStatus(para).then((data) => {
                        this.$message({
                            message: '退货已拒绝',
                            type: 'success'
                        });
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            var list = data.data;
                            this.getData();
                        }
                    }, data => {
                        this.listLoading = false;
                    });
                });

            },
            // 传送字段数据
            getData(){
                var para = {
                    id:this.id
                };
                // alert(this.id);
                this.listLoading = true;
                queryConsignmentReturnById(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            var list = data.data;
                            this.infoDate =[list.orderConsignmentReturnResDto];//表示一条

                            this.orderDate =[list.orderConsignmentReturnResDto];//表示一条

                            if (list.orderConsignmentReturnResDto.orderStatus== 60){
                                this.isShow = false
                                this.status = "已拒绝";
                            }
                            if (list.orderConsignmentReturnResDto.orderStatus== 50){
                                this.isShow = false
                                this.status = "已完成";
                            }
                            if (list.orderConsignmentReturnResDto.orderStatus== 40){
                                this.isShow = false
                                this.status = "已发货";
                            }
                            if (list.orderConsignmentReturnResDto.orderStatus== 30){
                                this.isShow = false
                                this.status = "待发货";
                            }
                            if (list.orderConsignmentReturnResDto.orderStatus== 20){
                                this.isShow = false
                                this.status = "退货中";
                            }
                            if (list.orderConsignmentReturnResDto.orderStatus== 10){
                                this.status = "待处理";
                            }
                            this.userDate =list.orderOperatingInformationDtos;//表示多条
                        }
                    },data => { this.listLoading = false;}
                );
            }
        },

        //拒绝退货


        mounted() {
            this.getData();

        }
    }
</script>


<style>

</style>