<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;margin-bottom:30px;text-align:right;">
            <h3 style="display: inline;text-align: left;">
                待处理订单:<span style="color:red;">{{num}}</span>&nbsp;&nbsp;&nbsp;
            </h3>
            <el-input size="medium" v-model.trim="orderId" placeholder="请输入订单号" style="width:200px;"></el-input>&nbsp;

            <el-input size="medium" v-model.trim="receiverName" placeholder="请输入客户姓名" style="width:200px;"></el-input>&nbsp;

            <el-input size="medium" v-model.trim="receiverPhone" placeholder="请输入客户号码" style="width:200px;"></el-input>&nbsp;
            &nbsp;&nbsp;
            <el-button type="primary" v-on:click="getOrderAssign(true)" :loading="listLoading" icon="el-icon-search">查询</el-button>&nbsp;
        </div>

        <div v-loading="listLoading" >
            <!--table-->
            <el-table
                    :data="orderAssignList"
                    style="width: 100%;">
                <el-table-column
                        width="220"
                        align="center"
                        prop="orderId"
                        label="订单编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="typeFlag"
                        label="状态">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="number"
                        label="物品件数">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="receiverName"
                        label="客户姓名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="receiverPhone"
                        label="客户号码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="pickupType"
                        label="取件方式">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="distributionType"
                        label="派送方式">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="remark"
                        label="备注">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="dialogTable(scope.$index, scope.row)">指定配送员</el-button>
                        <el-dialog title="指定配送员" :visible.sync="dialogTableVisible">
                            <div class="toolbar el-col el-col-24" style="text-align: right;margin-bottom: 25px;">
                                <el-select v-model="currentState" placeholder="请选择状态" style="width:120px;">
                                    <el-option label="可接单" value="0"></el-option>
                                    <el-option label="未开工" value="1"></el-option>
                                    <!--<el-option label="忙碌中" value="2"></el-option>-->
                                </el-select>
                                &nbsp;
                                <el-input v-model="trueName" placeholder="请输入配送员名称" style="width:170px;"></el-input>
                               <!-- &nbsp;
                                <el-select v-model="area" placeholder="请选择所属区域" style="width:155px;">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>-->
                                &nbsp;
                                <el-select v-model="shopId" placeholder="请选择所属服务点" filterable  style="width:165px;">
                                    <el-option
                                            v-for="item in servicePoints"
                                            :key="item.id"
                                            :label="item.orgName"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                &nbsp;
                                <el-button type="primary" v-on:click="getDispatchList" :loading="listLoading1">搜索</el-button>
                                <el-button type="primary" v-on:click="reset">重置</el-button>
                            </div>

                            <el-table :data="dispatchList" v-loading="listLoading1">
                                <el-table-column align="center" property="currentState" label="状态" ></el-table-column>
                                <el-table-column align="center" property="trueName" label="姓名"></el-table-column>
                                <el-table-column align="center" property="phone" label="手机"></el-table-column>
                                <el-table-column align="center" property="cityName" label="所属区域"></el-table-column>
                                <el-table-column align="center" property="servicePointName" label="所属服务点"></el-table-column>
                                <!--<el-table-column align="center" property="" label="距目的地距离"></el-table-column>-->
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="mini" @click="dispatch(scope.$index, scope.row)">指派</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="block" style="text-align:right;">
                                <el-pagination @current-change="handleCurrentChange1"
                                               :page-size="pageSize1"
                                               layout="prev, pager, next"
                                               :total="total1">
                                </el-pagination>
                            </div>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <div class="block" style="text-align:right;">
                <!--<el-pagination @current-change="handleCurrentChange"
                               :page-size="pageSize"
                               layout="prev, pager, next"
                               :total="total">
                </el-pagination>-->

                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total" style="float: right;margin-top: 10px">
                </el-pagination>
            </div>
        </div>
    </section>
</template>

<script>
    import {getOrderAssignPage} from '../../api/api';
    import {getServicePointListFun} from '../../api/api';
    import {getDispatchListPage} from '../../api/api';
    import {orderDispatchFun} from '../../api/api';
    import util from '../../common/js/util';

    export default {
        data() {
            return {
                receiverName:'',//客户姓名
                receiverPhone:'',//客户号码
                num:0,//订单数量
                currentState:'',//配送员状态
                trueName:'',//配送员姓名或id
                shopId:null,//所属服务点
                servicePoints:[],//服务点列表

                listLoading: false,
                //异常列表分页参数
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                total:0,
                page: 1,
                //配送员分页参数
                total1:0,
                page1: 1,
                pageSize1:8,
                listLoading1: false,

                orderId:'',//订单号
                orderAssignList:[],//订单列表
                //配送员列表
                dispatchList: [],
                dialogTableVisible: false,
                dialogFormVisible: false,

                currOrderId:null,//当前用户选择的异常订单的id
            };
        },
        methods:{
            //获取异常订单(订单改派)列表
            getOrderAssign(flag) {
                var para = {
                    pageInfo:{
                        pageNum:flag===true?1:this.page,
                        pageSize:this.pageSize,
                    },
                    orderId:this.orderId,//订单号
                    receiverName:this.receiverName,//客户姓名
                    receiverPhone:this.receiverPhone,//客户号码
                };
                this.listLoading = true;
                getOrderAssignPage(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.num=data.data.list.length;
                            this.orderAssignList=data.data.list;
                            this.total = data.data.paginationInfo.total;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //获取配送员列表
            getDispatchList() {
                let para1 = {
                    pageInfo:{
                        pageNum:this.page1,
                        pageSize:this.pageSize1,
                    },
                    currentState:this.currentState,//配送员状态
                    trueName:this.trueName,//配送员姓名或id
                    shopId:this.shopId,//所属服务点id
                    pageFlag:true,//分页标志
                };
                this.listLoading1 = true;
                getDispatchListPage(para1).then((data) => {
                        this.listLoading1 = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.dispatchList=data.data.list;
                            this.total1 = data.data.paginationInfo.total;
                        }
                    }
                );
            },
            //获取服务点列表
            getServicePointList(){
                getServicePointListFun(null).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.servicePoints=data.data;
                        }
                    }
                );
            },
            //执行ajax,为订单指定派送员
            orderDispatch(orderId,dipatchId,index){
                var param={
                    id:orderId,
                    storePickerid:dipatchId
                };
                //console.log(param);
                orderDispatchFun(param).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.$message({
                                type: 'success',
                                message: '订单指派成功!'
                            });
                            //关闭弹窗
                            this.dialogTableVisible=false;
                            this.getOrderAssign();
                            //this.orderAssignList.splice(index, 1);
                        }else{
                            this.$message({
                                type: 'error',
                                message: '网络异常!'
                            });
                        }
                    }
                );
            },
            //开始为订单指定派送员
            startDispatch(orderId,dipatchId,index){
                //console.log(orderId,dipatchId);
                this.$confirm('您确定将订单指派给该配送员吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //执行ajax
                    this.orderDispatch(orderId,dipatchId,index);
                });
            },
            //弹出框,选择配送员
            dialogTable(index, row){
                this.dialogTableVisible = true;
                //初始化当前选择的订单id
                this.currOrderId=row.orderId;
                if(this.servicePoints.length==0||this.dispatchList.length==0){
                    //获取服务点列表
                    this.getServicePointList();
                    //获取配送员列表
                    this.getDispatchList();
                }
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getOrderAssign();
            },
            //异常订单分页查询
            handleCurrentChange(page) {
                this.page = page;
                this.getOrderAssign();
            },
            //配送员分页查询
            handleCurrentChange1(page1) {
                this.page1 = page1;
                this.getDispatchList();
            },
            //重置配送员搜索条件
            reset() {
                this.currentState='';//配送员状态
                this.trueName='';//配送员姓名或id
                this.shopId=null;//所属服务点id
                this.page = 1;
                this.getDispatchList();
            },
            //为订单指定派送员
            dispatch(index, row){
                //订单id,配送员id
                this.startDispatch(this.currOrderId,row.id,index);
            },

        },
        mounted(){
            //获取异常订单列表
            this.getOrderAssign();
        }
    }

</script>

