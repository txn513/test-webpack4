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

			<!--	<el-form-item >
					<el-time-picker
							v-model="value2"
							:picker-options="{
                            }"
							placeholder="任意时间点">
					</el-time-picker>
				</el-form-item>-->

				<!--按钮-->
				<el-button type="primary"  v-on:click="getPayAveragePrice(true)" :loading="listLoading" icon="el-icon-search">查询</el-button> &nbsp; &nbsp;
			</el-form>
		</el-col>

		<!--table-->
		<el-table
				:default-sort = "{prop: 'number1', order: 'descending'}"
				v-loading="listLoading"
				:data="payAveragePrice"
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
					label="支付用户(个)">
			</el-table-column>
			<el-table-column
					sortable
					align="center"
					prop="total"
					label="总金额(元)">
			</el-table-column>
			<el-table-column
					sortable
					align="center"
					prop="rate"
					label="用户平均支出(元)">
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
    import { getPayAveragePricePage} from '../../api/api';
    import selectGroup from '@/components/selectGroup';

	export default {
        components:{
            selectGroup
        },
        data() {
            return {
                payAveragePrice: [],
				listLoading: false,
                total:0,
                pageNum: 1, //当前页码
                pageSize:10,
                value1: new Date().setTime(new Date().getTime()-24*60*60*1000),
                //value2: '',
                logining: false,
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,
            }
        },

        //统计前一日全网支付用户与全部用户（前一日注册用户）的比率（支付用户量/全部用户量*100%）
        methods: {

            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getPayAveragePrice();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getPayAveragePrice();
            },

            getResultNumber(result){
                this.businessTypeCode = result;
            },
            getPayAveragePrice(flag) {
                var para = {
                    pageInfo:{
                        pageNum:flag===true?1:this.pageNum,
                        pageSize: this.pageSize,
                    },
                    date:this.value1,
                    //time:this.value2,
                    //date:util.dateFormat("yyyy-MM-dd",new Date(this.value1)),
                    //time:this.value2?util.dateFormat("hh:mm:ss",new Date(this.value2)):'',
                    businessTypeCode: this.businessTypeCode,
                };

                this.listLoading = true;
                getPayAveragePricePage(para).then((data) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var list = data.data.list;
                        for(var i=0;i<list.length;i++){
                            list[i].rate=util.moneyFormat(parseFloat(list[i].rate).toFixed(2));
                            //list[i].total=util.moneyFormat(parseFloat(list[i].total).toFixed(2));
                        }
                        this.payAveragePrice = list;
                        this.total = data.data.paginationInfo.total;
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

                    if (index === 3 ) {

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

                    if (index === 4) {

                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    if(index == 2){
                                        total1 =prev + curr;
                                    }
                                    if(index == 3){
                                        total2 =prev + curr;
                                    }
                                    return prev+curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] = parseFloat(sums[index]).toFixed(2);
                            sums[index] += '元';
                        } else {
                            sums[index] = '';
                        }
                    }
				});
                sums[5] = (parseFloat(sums[4])/parseInt(sums[3])).toFixed(2)+"元";
                return sums;
            }
        },

        mounted() {
			this.getPayAveragePrice();
        }
    }

</script>
