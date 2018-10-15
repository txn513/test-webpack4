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
                    <el-button type="primary" v-on:click="getRetentionRate">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-tabs v-model="activeName" class="el-col el-col-24" @tab-click="handleClick" v-loading="listLoading">
            <el-tab-pane label="次日留存率" name="first">
                <el-table :data="first" :summary-method="getSummaries" show-summary  :default-sort = "{prop: 'number1', order: 'descending'}" style="width: 100%;margin-top: 30px;">
                    <el-table-column type="index" width="50" ></el-table-column>
                    <el-table-column prop="cityName" label="地区" sortable></el-table-column>
                    <el-table-column align="center" prop="number1" label="注册用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="number2" label="登陆用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="percentage" label="次日留存率(登陆用户/注册用户)" sortable :sort-method="sortMethod"></el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="3日留存率" name="second">
                <el-table :data="second" :summary-method="getSummaries" show-summary  :default-sort = "{prop: 'number1', order: 'descending'}" style="width: 100%;margin-top: 30px;">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="cityName" label="地区" sortable></el-table-column>
                    <el-table-column align="center" prop="number1" label="注册用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="number2" label="登陆用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="percentage" label="3日留存率(登陆用户/注册用户)" sortable :sort-method="sortMethod"></el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="周留存率" name="third">
                <el-table :data="third" :summary-method="getSummaries" show-summary  :default-sort = "{prop: 'number1', order: 'descending'}" style="width: 100%;margin-top: 30px;">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="cityName" label="地区" sortable></el-table-column>
                    <el-table-column align="center" prop="number1" label="注册用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="number2" label="登陆用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="percentage" label="周留存率(登陆用户/注册用户)" sortable :sort-method="sortMethod"></el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="月留存率" name="fourth">
                <el-table :data="fourth" :summary-method="getSummaries" show-summary  :default-sort = "{prop: 'number1', order: 'descending'}" style="width: 100%;margin-top: 30px;">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="cityName" label="地区" sortable></el-table-column>
                    <el-table-column align="center" prop="number1" label="注册用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="number2" label="登陆用户(个)" sortable></el-table-column>
                    <el-table-column align="center" prop="percentage" label="月留存率(登陆用户/注册用户)" sortable :sort-method="sortMethod"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import { getRetentionRatePage} from '../../api/api';
    import selectGroup from '@/components/selectGroup';
    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                page: 1,
                listLoading: false,
                total:0,
                pageSize:50,
                flag:"first",
                activeName: 'first',
                first:[],
                second:[],
                third:[],
                fourth:[],
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,
            };
        },
        methods: {
            getResultNumber(result){
                this.businessTypeCode = result;
            },
            handleClick(tab, event) {
                this.flag=tab.name;
                this.getRetentionRate();
            },
            sortMethod(a,b){
                //console.log(a,b);
                return parseFloat(a.percentage)-parseFloat(b.percentage);
            },
            getRetentionRate() {
                var para = {
                    pageInfo:{
                        pageNum:this.page,
                        pageSize:this.pageSize,
                    },
                    flag:this.flag,
                    businessTypeCode: this.businessTypeCode,
                };

                this.listLoading = true;

                getRetentionRatePage(para).then((data) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var list = data.data.list;
                        //强制保留两位小数点
                        for(var i=0;i<list.length;i++){
                            list[i].percentage=parseFloat(list[i].percentage).toFixed(1)+"%";
                        }
                        if(this.flag=="first"){
                            this.first = list;
                        }
                        if(this.flag=="second"){
                            this.second = list;
                        }
                        if(this.flag=="third"){
                            this.third = list;
                        }
                        if(this.flag=="fourth"){
                            this.fourth = list;
                        }

                        this.total = data.data.paginationInfo.total;

                    }
                },data => {this.listLoading = false; });
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

                    if (index === 2 ||index === 3) {

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
                sums[4] = (parseInt(sums[3])/parseInt(sums[2])*100).toFixed(1)+"%";
                return sums;
            }
        },
        mounted() {
            this.getRetentionRate();
        }
    };
</script>