<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            <el-input size="medium" v-model.trim="exchangeCode" placeholder="兑换码编号或订单id"clearable style="width:370px;"></el-input>
            &nbsp;&nbsp;
            <!--提交按钮-->
            <el-button type="primary" v-on:click="getExchangeCode(true)" :loading="listLoading" icon="el-icon-search">查询</el-button>
        </div>

        <!--table-->
        <el-table
                v-loading="listLoading"
                :data="tableData"
                style="width: 100%;margin-top: 30px;">
            <el-table-column
                    align="center"
                    type="index">
            </el-table-column>
            <el-table-column
                    align="center"
                    sortable
                    prop="exchangeCode"
                    label="兑换码编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    sortable
                    prop="useFlag"
                    label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.useFlag==1">已使用</span>
                    <span v-if="scope.row.useFlag==0">未使用</span>
                </template>
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    prop="orderId"
                    label="关联订单">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.orderId}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float: right">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import {getExchangeCodeFun} from '../../api/api';

    export default {
        data() {
            return {
                listLoading:false,
                total:0,
                pageNum: 1, //当前页码
                pageSize:10,
                exchangeCode:'',
                tableData:[],//表格数据
            };
        },
        methods:{
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getExchangeCode();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getExchangeCode();
            },

            //获取注册城市列表
            getExchangeCode(flag){
                var para = {
                    exchangeCode:this.exchangeCode,
                    pageInfo:{
                        pageNum:flag===true?1:this.pageNum,
                        pageSize: this.pageSize,
                    },
                };
                this.listLoading=true;
                getExchangeCodeFun(para).then((data) => {
                        this.listLoading=false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.total = data.data.paginationInfo.total;
                            this.tableData=data.data.list;
                        }
                    },data => { this.listLoading = false;}
                );
            },
            handleClick(row) {
                console.log(row);
                this.$router.push({path: '/orderSelf/queryDetailById?id='+row.orderId+'&orderStatus='+row.orderStatus});
            }
        },
        mounted(){
            this.getExchangeCode();
        }
    }

</script>

