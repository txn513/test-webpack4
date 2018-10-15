<template>
    <section>
        <el-form :model="addForm" :rules="addFormRules" ref="addForm">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form align="right" :inline="true" class="demo-form-inline">
                    <el-form-item label="">
                        <el-button type="primary" v-on:click="addSubmit">保存</el-button>
                        <el-button type="primary" v-on:click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>基本信息</h3></el-col>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="订单编号">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px"></span>
                    </template>
                </el-table-column>
                <el-table-column label="调出仓库">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="outStoreCode">
                            <el-select v-model="addForm.outStoreCode" placeholder="请选择" @change="outStoreChange">
                                <el-option v-for="item in outStoreOptions" :key="item.storeNo" :label="item.storeName"
                                           :value="item.storeNo">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="调入仓库">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="inStoreCode">
                            <el-select v-model="addForm.inStoreCode" placeholder="请选择" @change="inStoreChange">
                                <el-option v-for="item in inStoreOptions" :key="item.storeNo" :label="item.storeName"
                                           :value="item.storeNo">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="支付方式">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="payType">
                            <el-select v-model="addForm.payType" placeholder="请选择">
                                <el-option label="月结" value="2"></el-option>
                                <el-option label="到付" value="4"></el-option>
                                <el-option label="寄付" value="6"></el-option>
                                <el-option label="第三方支付" value="8"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="配送方式">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="deliveryType">
                            <el-select v-model="addForm.deliveryType" placeholder="请选择">
                                <el-option label="快递配送" value="1"></el-option>
                                <el-option label="门店自取" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" width="180">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px"></span>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>收货人信息</h3></el-col>
            <el-table :data="consigneeData" border style="width: 100%">
                <el-table-column label="收货人" width="120">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="consignee">
                            <el-input v-model="addForm.consignee" placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="收货电话" width="150">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="phone">
                            <el-input v-model="addForm.phone" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="收货地址">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="region">
                            <el-cascader :options="regionOptions" v-model="selectedRegion" :props="props"></el-cascader>
                            <el-input v-model="addForm.address" placeholder="请输入内容" style="width: 50%"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item label="" prop="goodsTable">
                <el-input type="hidden" :disabled="true"></el-input>
                <el-col :span="24" style="padding-bottom: 0px;"><h3 style=" margin-top: 0; margin-bottom: 0; ">商品信息</h3>
                </el-col>
                <el-col :span="24" style="padding-bottom: 5px;">
                    <el-button type="primary" @click="showSearchMdl">添加商品</el-button>
                </el-col>
            </el-form-item>
            <el-table :data="goodsTable" border style="width: 100%">
                <el-table-column label="商品编号" prop="spuCode" show-overflow-tooltip></el-table-column>
                <el-table-column label="SKU" prop="skuCode" show-overflow-tooltip></el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <div class="image-wrap">
                             <img :src="getImgUrl(scope.row.imgPath)">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="spuName" show-overflow-tooltip></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="属性" prop="property" show-overflow-tooltip></el-table-column>
                <el-table-column label="型号" prop="spuCode" show-overflow-tooltip></el-table-column>
                <el-table-column label="品质" prop="qualityName" show-overflow-tooltip></el-table-column>
                <el-table-column label="损伤部位" prop="damage" show-overflow-tooltip></el-table-column>
                <el-table-column label="调拨数量" prop="number">
                    <template slot-scope="scope">
                        <el-input type="number" min="1" max="99999999" v-model="scope.row.number" placeholder="请输入数量"
                                  value="1"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delSelectedGoods(scope.$index,scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>操作信息</h3></el-col>
            <el-table :data="operatorTable" border style="width: 100%">
                <el-table-column label="操作人" prop="operator" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作时间" prop="datetime" :formatter="dateFormat"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="订单状态" prop="status"></el-table-column>
                <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
            </el-table>
        </el-form>

        <el-dialog title="选择商品" :visible.sync="dialogSearchGoods">
            <el-row :gutter="24" style="padding-bottom: 10px;">
                <el-col :span="4">
                    <el-select v-model="filters.searchType" placeholder="请选择">
                        <el-option label="商品编码" value="1"></el-option>
                        <el-option label="商品名称" value="2"></el-option>
                        <el-option label="SKU" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="17">
                    <el-input v-model="filters.searchKw" placeholder="请输入内容"></el-input>
                </el-col>
                <el-col :span="3" style="float:right">
                    <el-button type="primary" v-on:click="searchList">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="searchGoodsTable" @row-dblclick="selectedGoods" border>
                <el-table-column prop="spuCode" label="商品编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="skuCode" label="SKU" show-overflow-tooltip></el-table-column>
                <el-table-column prop="spuName" label="商品名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="brandName" label="品牌" show-overflow-tooltip></el-table-column>
                <el-table-column prop="qualityName" label="鉴定品质" show-overflow-tooltip></el-table-column>
                <el-table-column prop="damage" label="损伤部位" show-overflow-tooltip></el-table-column>
                <el-table-column prop="property" label="属性" show-overflow-tooltip></el-table-column>
                <el-table-column prop="spuCode" label="型号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="surplusStock" label="数量"></el-table-column>
                <el-table-column prop="storeName" label="所属仓库" show-overflow-tooltip></el-table-column>
            </el-table>
            <!--工具条-->
            <el-row :gutter="24" style=";padding-top: 10px;">
                <el-col :span="24">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="pageNum"
                                   :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="float: right">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
    import {stockSearchGoods, addTransferStock, storeList, regionTree} from '../../api/api';
    import util from '../../common/js/util'

    export default {
        data() {
            var checkOutStore = (rule, value, callback) => {
                if (!value || value == '') {
                    return callback(new Error('请选择出库仓'));
                }
                if (value == this.addForm.inStoreCode) {
                    return callback(new Error('出库仓不能与入库仓一致'));
                }
                else {
                    return callback()
                }
            };
            var checkInStore = (rule, value, callback) => {
                if (!value || value == '') {
                    return callback(new Error('请选择入库仓'));
                }
                if (value == this.addForm.outStoreCode) {
                    return callback(new Error('入库仓不能与出库仓一致'));
                }
                else {
                    return callback()
                }
            };
            var checkRegion = (rule, value, callback) => {
                if (this.selectedRegion == null || this.selectedRegion.length == 0) {
                    return callback(new Error('请选择地区'));
                }
                if (this.addForm.address == '') {
                    return callback(new Error('请输入详细地址'));
                }
                else {
                    return callback()
                }
            };

            return {
                addForm: {
                    outStoreCode: '',
                    inStoreCode: '',
                    payType: '2',
                    deliveryType: '1',
                    consignee: '',
                    phone: '',
                    address: ''
                },
                outStoreOptions: [],
                inStoreOptions: [],
                regionOptions: [],
                selectedRegion: [],
                filters: {
                    searchType: '1',
                    searchKw: '',
                    selectedIds: [],
                    outStoreCode: ''
                },
                props: {
                    label: "name",
                    value: "code"
                },
                dialogSearchGoods: false,
                tableData: [{}],
                consigneeData: [{}],
                goodsTable: [],
                operatorTable: [],
                searchGoodsTable: [],
                addFormRules: {
                    outStoreCode: [{validator: checkOutStore, trigger: 'blur'}],
                    inStoreCode: [{validator: checkInStore, trigger: 'blur'}],
                    payType: [{required: true, message: '请选择支付方式', trigger: 'blur'}],
                    deliveryType: [{required: true, message: '请选择配送方式', trigger: 'blur'}],
                    consignee: [{required: true, message: '请输入收货人', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入收货电话', trigger: 'blur'}, {
                        pattern: /^1[3456789]\d{9}$/,
                        message: '数据格式错误'
                    }],
                    region: [{validator: checkRegion, trigger: 'blur'}]
                },
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false
            }
        },
        methods: {
            dateFormat: function (row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.searchList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.searchList();
            },
            //状态显示转换
            formatStatus: function (row) {
                return row.appraisalResults === 1 ? '合格' : row.status === 0 ? '不合格' : '未知';
            },
            getImgUrl(urlRelativePath) {
                return process.env.IMG_URL + urlRelativePath;
            },
            //获取商品列表
            searchList() {
                var excludeProducts = [];
                if (this.goodsTable.length > 0) {
                    this.goodsTable.forEach(function (data, index) {
                        excludeProducts.push(data.inventoryBarcode);
                    });
                }
                let para = {
                    searchType: this.filters.searchType,
                    kw: this.filters.searchKw,
                    excludeIds: this.filters.selectedIds,
                    excludeProducts: excludeProducts,
                    outStoreCode: this.filters.outStoreCode,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                stockSearchGoods(para).then((res) => {
                    this.listLoading = false;
                    this.searchGoodsTable = res.data.list;
                    this.total = res.data.paginationInfo.total;
                }, (res) => {
                    this.listLoading = false;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            addSubmit() {
                if (this.validateForm()) {
                    var goodsList = [];
                    this.goodsTable.forEach(function (value) {
                        goodsList.push({
                            "id": value.id,
                            "count": value.number
                        });
                    });
                    let para = Object.assign({
                        "allocationNumber": 1,
                        "provinceCode": this.selectedRegion[0],
                        "cityCode": this.selectedRegion[1],
                        "areaCode": this.selectedRegion[2],
                        "goodsList": goodsList
                    }, this.addForm);
                    addTransferStock(para).then((res) => {
                        if (res.code == 1) {
                            this.$message({message: '保存成功', type: 'success'});
                            this.$router.push({path: '/transferView', query: {id: res.data.id}});
                        } else {
                            this.$message({message: res.message, type: 'warning'});
                        }
                    }).catch(err => {
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
                }
            },
            back: function () {
                this.$router.push({path: '/transferList'});
            },
            selectedGoods(row) {
                this.goodsTable.push(row);
                this.filters.selectedIds.push(row.id);
                this.dialogSearchGoods = false;
            },
            delSelectedGoods(index) {
                this.filters.selectedIds.splice(index, 1);
                this.goodsTable.splice(index, 1);
                this.$refs.addForm.validate((valid) => {
                });
            }, initRegion() {
                regionTree().then((res) => {
                    this.regionOptions = res;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            initStore() {
                storeList().then((res) => {
                    this.inStoreOptions = res.data;
                    this.outStoreOptions = res.data;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            }, inStoreChange: function () {
                if (this.addForm.inStoreCode != "" && this.addForm.outStoreCode == this.addForm.inStoreCode) {
                    this.$message({message: '调入库不能与调出仓一致，请重新选择', type: 'warning'});
                    this.addForm.inStoreCode = "";
                }
            },
            outStoreChange: function () {
                this.filters.outStoreCode = this.addForm.outStoreCode;
                this.goodsTable = [];
                if (this.addForm.outStoreCode != "" && this.addForm.outStoreCode == this.addForm.inStoreCode) {
                    this.$message({message: '调出库不能与调入仓一致，请重新选择', type: 'warning'});
                    this.addForm.outStoreCode = "";
                }
            },
            showSearchMdl() {
                this.dialogSearchGoods = true;
                this.searchList();
            },
            validateForm() {
                var flag = true;
                this.$refs.addForm.validate((valid) => {
                    if (!valid) {
                        flag = valid;
                        return;
                    }
                    if (this.goodsTable.length == 0) {
                        this.$message({message: '请选择调拨商品', type: 'warning'});
                        flag = false;
                        return;
                    }
                    var checkNum = true;
                    this.goodsTable.forEach(function (data) {
                        var reg = /^[1-9][0-9]{0,8}$/;
                        if ("undefined" == typeof data.number || !reg.test(data.number)) {
                            checkNum = false;
                            return;
                        }
                    });
                    if (!checkNum) {
                        flag = false;
                        this.$message({message: '调拨数量必须为正整数，且小于等于999999999', type: 'warning'});
                    }
                });
                return flag;
            }
        },
        mounted() {
            this.initRegion();
            this.initStore();
        }
    }
</script>

<style scoped>
    .image-wrap {
        color: #475669;
        font-size: 18px;
        height: 100%;
        margin: 0;
        background: #fff;
    }
    .image-wrap img {
        margin: auto;
        max-width: 50px;
        max-height: 50px;
        vertical-align: middle;
    }
</style>