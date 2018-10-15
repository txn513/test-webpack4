<template>
    <section>
        <!--工具条-->
        <div  class="toolbar" style="padding-bottom: 0px;">
            <span>物流管理->物流跟踪</span>
            <div style="text-align:right;">
                <span align="right">
                    <el-button type="primary" @click="refreshLogistics">刷新</el-button>
                    <el-button type="primary" @click="backLogisticsList">返回</el-button>
                </span>
            </div>
        </div>

        <h3 style="margin-top: 20px;">订单记录</h3>
        <el-col :span="24"  style="padding-bottom: 0px;">
            <el-steps v-if="logisticsState == 3" :active="5" :finish-status="status" space="240px">
                <el-step title="提交订单" icon="el-icon-goods" :description="orderTime"></el-step>
                <el-step title="付款成功" icon="el-icon-tickets" :description="orderTime"></el-step>
                <el-step title="商品出库" icon="el-icon-picture" :description="logisticsTime"></el-step>
                <el-step title="等待收货" icon="el-icon-news" :description="logisticsTime"></el-step>
                <el-step title="完成" icon="el-icon-circle-check" :description="recordTime"></el-step>
            </el-steps>
            <el-steps v-if="logisticsState != 3" :active="4" :finish-status="status" space="240px">
                <el-step title="提交订单" icon="el-icon-goods" :description="orderTime"></el-step>
                <el-step title="付款成功" icon="el-icon-tickets" :description="orderTime"></el-step>
                <el-step title="商品出库" icon="el-icon-picture" :description="logisticsTime"></el-step>
                <el-step title="等待收货" icon="el-icon-news" :description="logisticsTime"></el-step>
                <el-step title="完成" icon="el-icon-circle-check" description=""></el-step>
            </el-steps>
        </el-col>

        <!--列表-->
        <h3 style="margin-top: 50px;">物流记录</h3>
        <el-table :data="logisticsData" height="700"
                  element-loading-text="拼命加载中"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 70%;">
            <el-table-column prop="recordTime" label="物流记录时间" :formatter="dateFormat"></el-table-column>
            <el-table-column prop="logisticsInformation" label="物流信息"></el-table-column>

        </el-table>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getLogisticsTrackDetail} from '../../api/api';

    export default {
        data() {
            return {
                logisticsNumber:this.$route.query.logisticsNumber,
                orderNumber:this.$route.query.orderNumber,
                logisticsState:'',//物流状态
                logisticsData:[],//物流信息
                orderTime:'',//订单时间
                logisticsTime:'',//物流发货时间
                recordTime:'',//订单完成时间
                listLoading: false,
            }
        },
        methods: {
            //物流当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            //获取物流信息列表
            getLogisticsTrack() {
                var para = {
                    logisticsNumber:this.logisticsNumber,
                    orderNumber:this.orderNumber
                };
                this.listLoading = true;
                getLogisticsTrackDetail(para).then((res) => {
                    this.listLoading = false;
                    this.logisticsData = res.data.list;//物流信息
                    this.logisticsState = this.logisticsData[0].logisticsState;//物流状态

                    this.orderTime = util.formatDate.format(new Date(this.logisticsData[0].orderTime), 'yyyy-MM-dd hh:mm:ss');
                    this.logisticsTime = util.formatDate.format(new Date(this.logisticsData[0].logisticsTime), 'yyyy-MM-dd hh:mm:ss');
                    this.recordTime = util.formatDate.format(new Date(this.logisticsData[0].recordTime), 'yyyy-MM-dd hh:mm:ss');
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            //刷新物流页面
            refreshLogistics() {
                this.getLogisticsTrack();
                this.$message({showClose: true, message: '刷新成功', type: 'success'});
            },

            //返回物流列表
            backLogisticsList() {
                this.$router.push({path:'/logisticsTrack/list'});
            }

        },
        mounted() {
            this.getLogisticsTrack();
        }
    }

</script>

<style scoped>
    .toolbar{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px 0 10px ;
    }
</style>