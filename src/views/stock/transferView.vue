<template>
    <section>
        <el-form v-loading="viewLoading" :model="editForm" :rules="editFormRules" ref="editForm">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;justify-content: space-between">
                <div>当前状态:<span class="order-status">{{statusName}}</span></div>
                <el-form align="right" :inline="true" class="demo-form-inline">
                    <el-form-item label="">
                        <el-button type="primary" v-on:click="print">打印调拨单</el-button>
                        <el-button v-if="status==20" type="primary" v-on:click="reject">驳回</el-button>
                        <el-button v-if="status==20" type="primary" v-on:click="examine">通过</el-button>
                        <el-button v-if="status==0" type="primary" v-on:click="save">保存</el-button>
                        <el-button v-if="status==0" type="primary" v-on:click="commit">提交</el-button>
                        <el-button type="primary" v-on:click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>基本信息</h3></el-col>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="订单编号">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{transferStockId}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="调出仓库">
                    <template slot-scope="scope">
                        <el-select v-if="status==0" v-model="editForm.outStoreCode" placeholder="请选择"
                                   @change="outStoreChange">
                            <el-option v-for="item in outStoreOptions" :key="item.storeNo" :label="item.storeName"
                                       :value="item.storeNo">
                            </el-option>
                        </el-select>
                        <span v-if="status!=0" style="margin-left: 10px">{{outStoreName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="调入仓库">
                    <template slot-scope="scope">
                        <el-select v-if="status==0" v-model="editForm.inStoreCode" placeholder="请选择"
                                   @change="inStoreChange">
                            <el-option v-for="item in inStoreOptions" :key="item.storeNo" :label="item.storeName"
                                       :value="item.storeNo">
                            </el-option>
                        </el-select>
                        <span v-if="status!=0" style="margin-left: 10px">{{inStoreName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付方式">
                    <template slot-scope="scope">
                        <el-select v-if="status==0" v-model="editForm.payType" placeholder="请选择">
                            <el-option label="月结" value="2"></el-option>
                            <el-option label="到付" value="4"></el-option>
                            <el-option label="寄付" value="6"></el-option>
                            <el-option label="第三方支付" value="8"></el-option>
                        </el-select>
                        <span v-if="status!=0" style="margin-left: 10px">{{payTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="配送方式">
                    <template slot-scope="scope">
                        <el-select v-if="status==0" v-model="editForm.deliveryType" placeholder="请选择">
                            <el-option label="快递配送" value="1"></el-option>
                            <el-option label="门店自取" value="2"></el-option>
                        </el-select>
                        <span v-if="status!=0" style="margin-left: 10px">{{deliveryTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" width="180">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{applicantName}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>收货人信息</h3></el-col>
            <el-table :data="consigneeData" border style="width: 100%">
                <el-table-column label="收货人" width="120">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="consignee">
                            <el-input v-if="status==0" v-model="editForm.consignee" placeholder="请输入"></el-input>
                            <span v-if="status!=0" style="margin-left: 10px">{{editForm.consignee}}</span>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="收货电话" width="150">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="phone">
                            <el-input v-if="status==0" v-model="editForm.phone" placeholder="请输入内容"></el-input>
                            <span v-if="status!=0" style="margin-left: 10px">{{editForm.phone}}</span>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="收货地址">
                    <template slot-scope="scope">
                        <el-form-item label="" prop="region">
                            <el-cascader v-if="status==0" :options="regionOptions" v-model="selectedRegion"
                                         :props="props"></el-cascader>
                            <span v-if="status!=0">{{provinceName}}</span>
                            <span v-if="status!=0">{{cityName}}</span>
                            <span v-if="status!=0">{{areaName}}</span>
                            <el-input v-if="status==0" v-model="editForm.address" placeholder="请输入内容"
                                      style="width: 50%"></el-input>
                            <span v-if="status!=0">{{editForm.address}}</span>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>商品信息</h3></el-col>
            <el-input type="hidden" :disabled="true"></el-input>
            <el-col v-if="status==0" :span="24" style="padding-bottom: 5px;">
                <el-button type="primary" @click="showSearchMdl">添加商品</el-button>
            </el-col>
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
                <el-table-column label="价格" prop="price" show-overflow-tooltip></el-table-column>
                <el-table-column label="属性" prop="property" show-overflow-tooltip></el-table-column>
                <el-table-column label="型号" prop="spuCode" show-overflow-tooltip></el-table-column>
                <el-table-column label="品质" prop="qualityName" show-overflow-tooltip></el-table-column>
                <el-table-column label="损伤部位" prop="damage" show-overflow-tooltip></el-table-column>
                <el-table-column label="调拨数量" prop="number" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input v-if="status==0" type="number" min="1" max="99999999"
                                  v-model="scope.row.allocationNumber" placeholder="请输入内容"></el-input>
                        <span v-if="status!=0" style="margin-left: 10px">{{scope.row.allocationNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="status==0">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delSelectedGoods(scope.$index,scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>操作信息</h3></el-col>
            <el-table :data="operatorTable" border style="width: 100%">
                <el-table-column label="操作人" prop="creatorName" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作时间" prop="createTime" :formatter="dateFormat"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="订单状态" prop="status" :formatter="formatStatus"
                                 show-overflow-tooltip></el-table-column>
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
            <el-row :gutter="24" style="padding-top: 10px;">
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
    import {
        stockSearchGoods,
        getTransfer,
        storeList,
        saveTransfer,
        commitTransfer,
        examineTransfer,
        rejectTransfer,
        regionTree,
        printTransfer,
        getBillUrl
    } from '../../api/api';
    import util from '../../common/js/util'

    export default {
        data() {
            var checkOutStore = (rule, value, callback) => {
                if (!value || value == '') {
                    return callback(new Error('请选择出库仓'));
                }
                if (value == this.editForm.inStoreCode) {
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
                if (value == this.editForm.outStoreCode) {
                    return callback(new Error('入库仓不能与出库仓一致'));
                }
                else {
                    return callback()
                }
            };
            var checkGoodsTable = (rule, value, callback) => {
                if (this.goodsTable.length == 0) {
                    return callback(new Error('请选择调拨商品'));
                }
                else {
                    return callback()
                }
            };
            var checkRegion = (rule, value, callback) => {
                if (this.selectedRegion == null || this.selectedRegion.length == 0) {
                    return callback(new Error('请选择地区'));
                }
                if (this.editForm.address == '') {
                    return callback(new Error('请输入详细地址'));
                }
                else {
                    return callback()
                }
            };


            return {
                editForm: {
                    inStoreCode: '',
                    outStoreCode: '',
                    consignee: '',
                    phone: '',
                    address: '',
                    payType: '',
                    deliveryType: '',
                },
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
                id: '',
                status: '',
                statusName: '',
                searchType: '1',
                provinceName: '',
                cityName: '',
                areaName: '',
                outStoreName: '',
                inStoreName: '',
                payTypeName: '',
                transferStockId: '',
                applicant: '',
                applicantName: '',
                viewLoading: true,
                listLoading: false,
                dialogSearchGoods: false,
                outStoreOptions: [],
                inStoreOptions: [],
                regionOptions: [],
                selectedRegion: [],
                tableData: [{}],
                consigneeData: [{}],
                goodsTable: [],
                operatorTable: [],
                searchGoodsTable: [],
                editFormRules: {
                    outStoreCode: [{validator: checkOutStore, trigger: 'blur'}],
                    inStoreCode: [{validator: checkInStore, trigger: 'blur'}],
                    payType: [{required: true, message: '请选择支付方式', trigger: 'blur'}],
                    deliveryType: [{required: true, message: '请选择配送方式', trigger: 'blur'}],
                    consignee: [{required: true, message: '请输入收货人', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入收货电话', trigger: 'blur'}, {
                        pattern: /^1[3456789]\d{9}$/,
                        message: '数据格式错误'
                    }],
                    region: [{validator: checkRegion, trigger: 'blur'}],
                    goodsTable: [{validator: checkGoodsTable, trigger: 'blur'}]
                },
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
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
            //状态显示转换
            formatStatus: function (row) {
                switch (row.status) {
                    case 0:
                        return "待处理";
                    case 10:
                        return "待出库";
                    case 20:
                        return "已确认";
                    case 30:
                        return "配送中";
                    case 40:
                        return "待入库";
                    case 50:
                        return "已入库";
                    default:
                        return "未知状态";
                }
            },
            formatPayType: function (payType) {
                switch (payType) {
                    case 2:
                        return "月结";
                    case 4:
                        return "寄付";
                    case 6:
                        return "到付";
                    case 8:
                        return "第三方支付";
                    default:
                        return "未知状态";
                }
            },
            formatDeliveryType: function (deliveryType) {
                switch (deliveryType) {
                    case 1:
                        return "快递配送";
                    case 2:
                        return "门店自取";
                    default:
                        return "未知状态";
                }
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },
            getImgUrl(urlRelativePath) {
                return process.env.IMG_URL + urlRelativePath;
            },
            //初始化数据
            initData() {
                this.id = this.$route.query.id;
                this.viewLoading = true;
                getTransfer(this.id).then((res) => {
                    this.viewLoading = false;
                    //editForm 基础属性
                    this.editForm.outStoreCode = res.data.outStoreCode;
                    this.filters.outStoreCode = res.data.outStoreCode;
                    this.editForm.inStoreCode = res.data.inStoreCode;
                    this.editForm.applicant = res.data.applicant;
                    this.editForm.consignee = res.data.consignee;
                    this.editForm.phone = res.data.phone;
                    this.editForm.address = res.data.address;
                    this.editForm.payType = res.data.payType + "";
                    this.editForm.deliveryType = res.data.deliveryType + "",

                        this.initRegion(() => {
                            this.selectedRegion = [res.data.provinceCode, res.data.cityCode, res.data.areaCode];
                        });

                    //显示用属性
                    this.status = res.data.status;
                    this.statusName = this.formatStatus(res.data);
                    this.outStoreName = res.data.outStoreName;
                    this.inStoreName = res.data.inStoreName;
                    this.provinceName = res.data.provinceName;
                    this.cityName = res.data.cityName;
                    this.areaName = res.data.areaName;
                    this.applicantName = res.data.applicantName;
                    this.payTypeName = this.formatPayType(res.data.payType);
                    this.transferStockId = res.data.transferStockId;
                    this.deliveryTypeName = this.formatDeliveryType(res.data.deliveryType);
                    this.goodsTable = res.data.goodsList;
                    this.operatorTable = res.data.operateList;
                }, (res) => {
                    this.viewLoading = false;
                }).catch(() => {
                });
            },
            //获取商品列表
            searchList() {
                this.listLoading = true;
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
                    outStoreCode: this.filters.outStoreCode,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                stockSearchGoods(para).then((res) => {
                    this.listLoading = false;
                    this.searchGoodsTable = res.data.list;
                    this.total = res.data.paginationInfo.total;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            back: function () {
                this.$router.push({path: '/transferList'});
            },
            selectedGoods(row, e) {
                var flag = true;
                this.goodsTable.forEach(function (value, index) {
                    if (value != null && value.id == row.id) flag = false;
                });
                if (flag) this.goodsTable.push(row);
                this.dialogSearchGoods = false;
                this.$refs.editForm.validate((valid) => {
                });
            },
            delSelectedGoods(index, row) {
                var idx = -1; //标识是否有选中的数据
                this.goodsTable.forEach(function (value, index) {
                    if (value == row) {
                        idx = index;
                        return;
                    }
                });
                if (idx >= 0) this.goodsTable.splice(idx, 1);
                this.$refs.editForm.validate((valid) => {
                });
            }, initRegion(callback) {
                regionTree().then((res) => {
                    this.regionOptions = res;
                    callback & callback.call();
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
                if (this.editForm.inStoreCode != "" && this.editForm.outStoreCode == this.editForm.inStoreCode) {
                    this.$message({message: '调入库不能与调出仓一致，请重新选择', type: 'warning'});
                    this.editForm.inStoreCode = "";
                }
            },
            outStoreChange: function () {
                this.filters.outStoreCode = this.editForm.outStoreCode;
                this.goodsTable = [];
                if (this.editForm.outStoreCode != "" && this.editForm.outStoreCode == this.editForm.inStoreCode) {
                    this.$message({message: '调出库不能与调入仓一致，请重新选择', type: 'warning'});
                    this.editForm.outStoreCode = "";
                }
            },
            showSearchMdl() {
                this.dialogSearchGoods = true;
                this.searchList();
            },
            save() {
                if (this.validateForm()) {
                    this.$prompt('备注', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(({value}) => {
                        var goodsList = [];
                        this.goodsTable.forEach(function (value, index) {
                            goodsList.push({
                                "id": value.id,
                                "count": value.allocationNumber
                            });
                        });
                        let para = Object.assign({
                            "id": this.id,
                            "remark": value,
                            "provinceCode": this.selectedRegion[0],
                            "cityCode": this.selectedRegion[1],
                            "areaCode": this.selectedRegion[2],
                            "goodsList": goodsList,
                            transferStockId: this.transferStockId
                        }, this.editForm);
                        saveTransfer(para).then((res) => {
                            if (res.code == 1) {
                                this.viewLoading = false;
                                this.$message({message: '保存成功', type: 'success'});
                                this.$router.push({path: '/transferView', query: {id: res.data.id}});
                            } else {
                                this.$message({message: res.message, type: 'warning'});
                            }
                        }).catch(err => {
                            var errMsg = err.response.data.message;
                            this.$message({showClose: true, message: errMsg, type: 'error'});
                        });
                    }).catch(() => {
                    });
                }
            },
            commit() {
                if (this.validateForm()) {
                    this.$prompt('备注', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(({value}) => {
                        var goodsList = [];
                        this.goodsTable.forEach(function (value, index) {
                            goodsList.push({
                                "id": value.id,
                                "count": value.allocationNumber
                            });
                        });
                        let para = Object.assign({
                            "id": this.id,
                            "remark": value,
                            "provinceCode": this.selectedRegion[0],
                            "cityCode": this.selectedRegion[1],
                            "areaCode": this.selectedRegion[2],
                            "goodsList": goodsList,
                            transferStockId: this.transferStockId
                        }, this.editForm);
                        commitTransfer(para).then((res) => {
                            if (res.code == 1) {
                                this.viewLoading = true;
                                this.$message({message: '提交成功', type: 'success'});
                                this.back();
                            } else {
                                this.$message({message: res.message, type: 'warning'});
                            }
                        }).catch(err => {
                            var errMsg = err.response.data.message;
                            this.$message({showClose: true, message: errMsg, type: 'error'});
                        });
                    }).catch(() => {
                    });
                }
            },
            examine() {
                this.$prompt('备注', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(({value}) => {
                    this.viewLoading = true;
                    let para = {
                        id: this.id,
                        remark: value
                    }
                    examineTransfer(para).then((res) => {
                        if (res.code == 1) {
                            this.$message({message: '审核成功', type: 'success'});
                            this.back();
                        } else {
                            this.$message({message: res.message, type: 'warning'});
                        }
                    }).catch(err => {
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
                }).catch(() => {
                });
                return;
            },
            reject() {
                this.$prompt('备注', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(({value}) => {
                    let para = {
                        id: this.id,
                        remark: value
                    }
                    rejectTransfer(para).then((res) => {
                        if (res.code == 1) {
                            this.$message({message: '驳回成功', type: 'success'});
                            this.back();
                        } else {
                            this.$message({message: res.message, type: 'warning'});
                        }
                    }).catch(err => {
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
                }).catch(() => {
                });
            }, print() {
                getBillUrl("/transferStock/print?id=" + this.id);
            },
            validateForm() {
                var flag = true;
                this.$refs.editForm.validate((valid) => {
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
                        if ("undefined" == typeof data.allocationNumber || !reg.test(data.allocationNumber)) {
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
            this.initStore();
            this.searchList();
            this.initData();
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