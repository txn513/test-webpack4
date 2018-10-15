<template>
    <section>
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
                <el-form-item >
                    <el-time-picker
                            v-model="value2"
                            :picker-options="{
                            //selectableRange: '18:30:00 - 20:30:00'
                           }"
                            placeholder="任意时间点">
                    </el-time-picker>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="getCountReg">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--table-->
        <el-table
                :default-sort = "{prop: 'number1', order: 'descending'}"
                v-loading="listLoading"
                :data="countReg"
                :summary-method="getSummaries"
                show-summary
                style="width: 100%;margin-top: 30px;">
            <el-table-column
                    type="index"
                    width="50">
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
                    label="用户数(个)">
            </el-table-column>
        </el-table>

    </section>

</template>

<script>
    import { getCountRegFun} from '../../api/api';
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                countReg:[],
                listLoading: false,
                value1: new Date().setTime(new Date().getTime()-24*60*60*1000),
                value2: '',
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,
            }
        },

        //获取店铺每个店铺前一日成交次数
        methods: {
            getResultNumber(result){
                this.businessTypeCode = result;
            },
            getCountReg() {
                var para = {
                    date:this.value1,
                    time:this.value2,
                    businessTypeCode: this.businessTypeCode,
                };
                this.listLoading = true;
                getCountRegFun(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.countReg = res.data;
                    }
                }
                    ,data => { this.listLoading = false; }
                );
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
                    if (index === 2) {
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

                return sums;
            }
        },

        mounted() {
            this.getCountReg();
        }
    }

</script>
