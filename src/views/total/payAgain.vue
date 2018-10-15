<template>
    <section>
        <!--日期和时间控件-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item >
                    <el-date-picker
                            v-model="value1"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>


                <!--按钮-->
                <el-button type="primary"  v-on:click="getPayAgain(true)" :loading="listLoading" icon="el-icon-search">查询</el-button> &nbsp; &nbsp;
            </el-form>
        </el-col>


        <!--table-->
        <el-table
                :default-sort = "{prop: 'number1', order: 'descending'}"
                v-loading="listLoading"
                :data="payAgain"
                :summary-method="getSummaries"
                show-summary
                style="width: 100%;margin-top: 30px;">
            <el-table-column
                    type="index"
                    label="序号"
                    width="50">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="shopName"
                    label="门店">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="cityName"
                    label="地区">
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    prop="number1"
                    label="所有消费用户(个)">
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    prop="number2"
                    label="再次消费用户(个)">
            </el-table-column>
            <el-table-column
                    sortable
                    :sort-method="sortMethod"
                    align="center"
                    prop="percentage"
                    label="比列(再次消费用户/所有消费用户)">
            </el-table-column>
        </el-table>

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
    import util from '../../common/js/util'
    import { getPayAgainPage} from '../../api/api';
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                payAgain: [],
                listLoading: false,
                total:0,
                pageNum: 1, //当前页码
                pageSize:10,
                value1: new Date().setTime(new Date().getTime()-24*60*60*1000),
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,
            }
        },

        //获取店铺每个店铺前一日成交次数
        methods: {

            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getPayAgain();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getPayAgain();
            },

            getResultNumber(result){
                this.businessTypeCode = result;
            },
            getPayAgain(flag) {
                var para = {
                    pageInfo:{
                        pageNum:flag===true?1:this.pageNum,
                        pageSize: this.pageSize,
                    },
                    date:this.value1,
                    //time:this.value2,
                   // date:util.dateFormat("yyyy-MM-dd",new Date(this.value1)),
                    businessTypeCode: this.businessTypeCode,
                };

                this.listLoading = true;

                getPayAgainPage(para).then((data) => {
                    //debugger
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var list = data.data.list;
                        for(var i=0;i<list.length;i++){
                            list[i].percentage=parseFloat(list[i].percentage).toFixed(1)+"%";
                        }
                        this.payAgain = list;
                        this.total = data.data.paginationInfo.total;
                    }
                }
                ,data => { this.listLoading = false; });
            },

            sortMethod(a,b){
                //console.log(a,b);
                return parseFloat(a.percentage)-parseFloat(b.percentage);
            },



            //表格合计
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];

                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总计';
                        return;
                    }

                    if (index === 3 ||index === 4) {

                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] += '个';
                        } else {
                            sums[index] = '';
                        }
                    }
                });

                sums[5] = (parseInt(sums[4])/parseInt(sums[3])*100).toFixed(1)+"%";
                return sums;
            }
        },

        mounted() {
            this.getPayAgain();
        }
    }

</script>
