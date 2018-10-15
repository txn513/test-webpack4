<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right"  :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-select @change="changCity"  v-model="city.cityId" placeholder="请选择城市" filterable >
                        <el-option
                                v-for="item in cityList"
                                :key="item.id"
                                :label="item.regionName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-cascader
                            v-model="city.classId"
                            placeholder="试试搜索：分类"
                            :options="classList"
                            :props="props"
                            :clearable="true"
                            filterable
                            :show-all-levels="false"
                            @change="getCityPriceList"
                            >
                        </el-cascader>
                </el-form-item>
                <el-form-item >
                    <el-input  v-model.trim="city.productSales" placeholder="请输入服务名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" plain v-on:click="seachDate" :loading="listLoading" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--table-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中"
                  style="width: 100%;">
            <el-table-column  label="缩略图">
                <template slot-scope="scope"><img  :src="getImgUrl(scope.row.imgPath)" style="width: 50px;height: 50px" ></template>
            </el-table-column>
            <el-table-column prop="serviceName" label="服务名称"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="city" label="城市名"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="className" label="所属分类"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="salesPrice" label="基础价格"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="orderBy" label="当前城市排序"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="servicePrice" label="当前城市价格"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column v-if="isAuth('mpys:cityprice:update') || isAuth('mpys:cityprice:delete') || isAuth('mpys:cityprice:oper:update')"   fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:cityprice:update')" type="primary"  size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <span v-if ="scope.row.id != null" >
                        <el-button v-if="isAuth('mpys:cityprice:delete')" type="primary" size="mini" @click="empty(scope.row)">清空</el-button>
                        <span v-if ="scope.row.disableFlag == 0" >
                        <el-button v-if="isAuth('mpys:cityprice:oper:update')" type="primary"  size="mini" @click="changeStatus(scope.row,1)">禁用</el-button>
                        </span>
                        <span v-else >
                            <el-button v-if="isAuth('mpys:cityprice:oper:update')" type="primary"  size="mini" @click="changeStatus(scope.row,0)">启用</el-button>
                        </span>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <!--<el-button v-if="isAuth('mpys:user:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
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


        <el-dialog title="编辑" v-model="formVisible" :visible.sync="formVisible">
            <el-form ref="form" :model="form" :rules="formRules" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:80%;min-width:300px;">
                <el-form-item label="价格" prop="price">
                    <el-input v-model="form.servicePrice" type="number" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="排序值" prop="weight">
                    <el-input v-model="form.orderBy" type="number" style="width: 90%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="operCityPrice" >提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {productClassTreeFun,getCityListData,PriductCityPriceList,PriductCityPriceUpdate,PriductCityPriceInsert,PriductCityPriceClear} from '../../../api/api';

    export default {
        data() {
            return {
                /**基础数据**/
                cityList: [],
                classList: [],
                list:[],
                listLoading: false,
                formVisible : false,

                /**查询列表参数使用**/
                city: {
                    classId:[],
                    cityId:'',
                    cityName:'',
                    productSales:''
                },

                /**分类模板**/
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                },

                /**分页参数**/
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数

                /**请求参数**/
                form : {
                    id:"",
                    cityId:"",
                    cityName:"",
                    skuId:"",
                    classId: "",
                    servicePrice:"",
                    orderBy:""
                },

                /**通用参数验证**/
                formRules: {
                    servicePrice: [{ required: true, message: '请输入价格', trigger: 'blur' }],
                    orderBy: [{ required: true, message: '请输入排序权重，越大越靠前', trigger: 'blur' }],
                },
            };
        },
        methods:{
            /**选择城市触发事件 获取服务分类树形结构**/
            changCity(){
                this.city.anme = "";
                this.listLoading = true;
                productClassTreeFun().then((res) => {
                    this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)){
                    this.classList = res.data;
                    this.getCityPriceList();
                }},data => { this.listLoading = false;});
            },

            /**获取注册城市列表**/
            getCityList() {
                this.listLoading = true;
                getCityListData().then((res) => {
                    this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)){
                    this.cityList = res.data;
                }}, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            /**增,改后回调函数**/
            getCityPriceList() {
                var para = {
                    pageInfo:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                    },
                    cityId:this.city.cityId,
                    classId:this.city.classId[this.city.classId.length-1],
                    productSales:this.city.productSales,
                };
                 PriductCityPriceList(para).then((res) => {
                    this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)){
                    this.list = res.data.list;
                    this.total = res.data.paginationInfo.total;
                }},data => { this.listLoading = false; });
            },

            /**编辑按钮**/
            handleEdit(row){
                this.formVisible=true;
                this.form = {
                    id :row.id,
                    cityId : this.city.cityId,
                    cityName : this.city.regionName,
                    serviceId : row.skuId,
                    servicePrice : row.servicePrice,
                    orderBy: row.orderBy,
                }
            },


            /**按钮操作**/
            operCityPrice () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                    let para = Object.assign({}, this.form);
                    if(this.form.id != undefined && this.form.id != ''){
                        this.$confirm('确认修改该城市服务价格信息吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                        PriductCityPriceUpdate(para).then((res) => {
                            this.editLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.formVisible = false;
                            this.getCityPriceList();
                        }
                    });
                    });
                    }else{
                        this.$confirm('确认新增该城市服务价格信息吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            for(let i = 0; i < this.cityList.length; i++) {
                                if (para.cityId === this.cityList[i].id) {
                                    para.cityName = this.cityList[i].regionName;
                                    break;
                                }
                            }
                        PriductCityPriceInsert(para).then((res) => {
                            this.addLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.formVisible = false;
                            this.getCityPriceList();
                        }
                    });
                    });
                    }
                }
            });
            },

            /**清空按钮，清除城市价格**/
            empty(row){
                this.$confirm('此操作将清空当前城市价格与排序记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'}).then(() => {
                    let para={id:row.id};
                    PriductCityPriceClear(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                        this.$message({
                            type: 'info',
                            message: '操作成功!'
                        });
                        this.getCityPriceList(row);
                        }
                    })}).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '操作失败!'
                });
            });
            },

            /**禁用启用按钮，城市价格服务项目是否开启**/
            changeStatus(row,status) {
                var para = {
                    id: row.id,
                    disableFlag: status
                };
                PriductCityPriceUpdate(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                    this.$message({
                        type: 'info',
                        message: '操作成功!'
                    });
                    this.getCityPriceList(row);
                } else {
                    this.$message({
                        type: 'info',
                        message: '操作失败,请联系管理员!'
                    });
                }
            } , (res) => { } ).catch(() => {

                });
            },


            /**图片拼接**/
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);
            },

            /**查询使用**/
            seachDate(){
                this.handleCurrentChange(1);
            },

            /**处理分页操作**/
            handleSizeChange (val) {
                this.pageSize = val;
                this.getCityPriceList();
            },
            handleCurrentChange (val) {
                this.pageNum = val;
                this.getCityPriceList();
            }
        },
        mounted(){
            //获取注册城市列表
            this.getCityList();
            this.getCityPriceList();
        }
    }

</script>
