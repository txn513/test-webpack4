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
            <span class="label label-default" style="font-size: 15px">订单信息</span>
        </el-col>
        <el-table :data="orderDate"  stripe   v-loading="listLoading" border  style="width: 100%;">
            <el-table-column prop="id" label="订单编号"  align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="下单时间"   align='center' sortable :formatter="dateCreateTime"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="商品分类"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuBrand" label="商品品牌"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityName" label="商品品质"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="productImages" label="商品图片"   align='center' sortable   show-overflow-tooltip>
                <template slot-scope="scope"><img :src="scope.imgPath" class="avatar" ></template>
            </el-table-column>
            <el-table-column prop="remark" label="商品备注"   align='center' sortable  show-overflow-tooltip></el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar" style="padding-bottom: 10px; margin-top: 1%;justify-content: space-between">
            <span class="label label-default" style="font-size: 15px">操作信息</span>
        </el-col>
        <el-table :data="userDate"   v-loading="userLoading" border  style="width: 100%;">
            <el-table-column prop="operator" label="操作者"  align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="操作时间"  align='center' sortable :formatter="dateuUpdateTime"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态"   align='center' sortable  show-overflow-tooltip></el-table-column>
            <el-table-column  prop="operationContent" label="操作"  align='center' sortable  show-overflow-tooltip></el-table-column>
        </el-table>


    </section>


</template>

<script>
    import util from  "@/common/js/util";
    import {queryRecyclingById} from "../../../api/api";
    export default {
        data() {
            return {
                id:this.$route.query.id,
                orderStatus:this.$route.query.orderStatus,
                orderDate:[],
                listLoading:false,

                userDate:[],
                userLoading:false,
                status:'',


            }
        },
        methods: {

            dateCreateTime:function(row ,column){
                if(row.createTime == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(row.createTime));
            },
            dateuUpdateTime:function(row ,column){
                var time = row[column.property];
                if(time == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(time));
            },
            //返回 ----------add
            back: function () {
                this.$router.push({path: '/orderRecycling'});
            },


            // 传送字段数据
            getData(){
                var para = {
                    id:this.id
                };
                this.listLoading = true;
                queryRecyclingById(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            var list = data.data;
                            this.orderDate =[list.orderRecyclingDto];//表示一条
                            if (list.orderRecyclingDto.orderStatus == 70){
                                this.status = "已关闭";
                            }
                            if (list.orderRecyclingDto.orderStatus == 60){
                                this.status = "已完成";
                            }
                            if (list.orderRecyclingDto.orderStatus== 50){
                                this.status = "待付款";
                            }
                            if (list.orderRecyclingDto.orderStatus == 40){
                                this.status = "待确认报价";
                            }
                            if (list.orderRecyclingDto.orderStatus == 30){
                                this.status = "待鉴定";
                            }
                            if (list.orderRecyclingDto.orderStatus == 20){
                                this.status = "待确认寄送";
                            }
                            if (list.orderRecyclingDto.orderStatus == 10){
                                this.status = "待处理";
                            }
                            this.userDate =list.orderOperatingInformationDtos;//表示多条
                        }
                    },data => { this.listLoading = false;}
                );
            }
        },

        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>


