<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="业务类型">
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="当前状态">
                    <el-select v-model="status" placeholder="当前状态" filterable style="width:140px;" clearable>
                        <el-option
                                v-for="item in flagOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="channelType" placeholder="类型" filterable style="width:140px;" clearable>
                        <el-option
                                v-for="item in channelTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchBannerInfo">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:marketingInfo:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table v-loading="listLoading" stripe border  highlight-current-row :data="tableData" style="width: 100%;margin-top: 30px;">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="marketingImg" width="160" label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.marketingImg" width="60">
                </template>
            </el-table-column>
            <el-table-column prop="marketingTitle" label="横幅主题" show-overflow-tooltip></el-table-column>
            <el-table-column prop="businessId" label="业务类型" :formatter="formatBusiness"></el-table-column>
            <el-table-column prop="channelType" label="类型" :formatter="formatChannelType"></el-table-column>
            <el-table-column prop="marketingType" label="横幅类型" :formatter="formatMarketingType"></el-table-column>
            <el-table-column prop="status" label="当前状态" :formatter="formatStatus"></el-table-column>
            <el-table-column prop="startTime" label="生效时间" sortable :formatter="dateFormat"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" sortable :formatter="dateFormat"></el-table-column>
            <el-table-column prop="skipUrl" label="链接"></el-table-column>
            <el-table-column prop="enableFlag" label="是否启用" sortable :formatter="formatEnableFlag"></el-table-column>
            <el-table-column v-if="isAuth('mpys:marketingInfo:update') || isAuth('mpys:marketingInfo:delete')"  fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:marketingInfo:update')" type="primary"  size="mini" @click="editStatus(scope.row)">{{scope.row.enableFlag == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:marketingInfo:update') && scope.row.enableFlag == 1" type="primary"  size="mini" @click="getMarketingGoodsBtn(scope.row)">横幅商品</el-button>
                    <el-button v-if="isAuth('mpys:marketingInfo:update') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="editIndexBannerBtn(scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:marketingInfo:delete') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--分页工具条-->
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

        <!--新增/编辑界面-->
        <el-dialog title="新增/编辑" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form :model="addIndexBannerForm" label-width="100px" :rules="addFormRules" ref="addIndexBannerForm" class="demo-ruleForm">
                <el-form-item label="有效时间" required>
                    <el-col :span="11">
                        <el-form-item prop="startTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addIndexBannerForm.startTime" style="width: 100%;" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="endTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addIndexBannerForm.endTime" style="width: 100%;"  format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="横幅图片" prop="marketingImg">
                    <el-upload
                            :action="uploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" style="width:400px;height: 300px "  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessId">
                    <template>
                        <select-group-add :num ="addIndexBannerForm.businessId" :select="isEditSelect" @getresult = 'getEditResultNumber'></select-group-add>
                    </template>
                </el-form-item>
                <el-form-item label="类型" prop="channelType">
                    <el-select v-model="addIndexBannerForm.channelType" placeholder="请选择">
                        <el-option
                                v-for="item in channelTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="横幅类型" prop="marketingType">
                    <el-select v-model="addIndexBannerForm.marketingType" placeholder="请选择">
                        <el-option
                                v-for="item in marketingTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="横幅标题" prop="marketingTitle">
                    <el-input v-model="addIndexBannerForm.marketingTitle" ></el-input>
                </el-form-item>
                <el-form-item label="跳转类型" prop="skipType">
                    <el-radio-group v-model="addIndexBannerForm.skipType">
                        <el-radio class="radio" :label="1">url跳转</el-radio>
                        <el-radio class="radio" :label="2">APP内部跳转</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="链接" prop="skipUrl">
                    <el-input type="text" v-model="addIndexBannerForm.skipUrl" ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="addIndexBannerForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortBy">
                    <el-input v-model="addIndexBannerForm.sortBy" type="number"  style="width: 10%;"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                    <el-switch v-model="addIndexBannerForm.enableFlag"></el-switch>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addOrEditSubmit">保存</el-button>
                <el-button @click.native="addFormVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!--关联商品管理界面-->
        <el-dialog title="横幅商品" v-model="marketingGoodsVisible" :visible.sync="marketingGoodsVisible">
            <el-button type="primary" size="small" align="center" plain v-on:click="addMarketingGoodsBtn" icon="el-icon-circle-plus-outline">添加商品</el-button>
            <el-table :data="marketingGoods">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column property="imgPath" label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.imgPath" width="60">
                    </template>
                </el-table-column>
                <el-table-column property="spuCode" label="商品编码"></el-table-column>
                <el-table-column property="productSales" label="商品名称"></el-table-column>
                <el-table-column property="skuCode" label="sku编码"></el-table-column>
                <el-table-column property="className" label="所属分类"></el-table-column>
                <el-table-column property="brandName" label="商品品牌"></el-table-column>
                <el-table-column property="salesPrice" label="售价" sortable></el-table-column>
                <el-table-column property="qualityName" label="新旧程度"></el-table-column>
                <el-table-column sortable align="center" prop="" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="delMarketingGoodsBtn(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="block" style="text-align:right;">
                <el-pagination @current-change="marketingHandleCurrentChange"
                               :page-size="marketingPageSize"
                               layout="prev, pager, next"
                               :total="marketingTotal">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="marketingGoodsVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <!--新增关联的商品界面-->
        <el-dialog title="添加横幅商品" v-model="addMarketingGoodsVisible" :visible.sync="addMarketingGoodsVisible">
            <el-form  :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input size="small" v-model="product.spuCode" placeholder="商品编码" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input size="small" v-model="product.skuCode" placeholder="SKU编码" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="价格区间" >
                    <el-input-number size="small" v-model="product.minPrice" min="0" placeholder="" clearable></el-input-number>至
                    <el-input-number size="small" v-model="product.maxPrice" min="0" placeholder="" clearable></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-input size="small" v-model="product.spuName" placeholder="商品名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-cascader
                            v-model="product.classIdList"
                            placeholder="商品分类"
                            :options="classList"
                            :props="props"
                            :show-all-levels="false"
                            filterable
                            clearable
                            size="small"
                            change-on-select>
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-select size="small" v-model="product.brandId" clearable filterable placeholder="品牌">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.brandName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" size="small" v-on:click="seachGoodList">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="goodsList"  @selection-change="selsChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column sortable align="center"  property="imgPath" label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.imgPath" width="60"  >
                    </template>
                </el-table-column>
                <el-table-column property="spuCode" label="商品编码"></el-table-column>
                <el-table-column property="productSales" label="商品名称"></el-table-column>
                <el-table-column property="skuCode" label="sku编码"></el-table-column>
                <el-table-column property="className" label="所属分类"></el-table-column>
                <el-table-column property="brandName" label="商品品牌"></el-table-column>
                <el-table-column property="salesPrice" label="售价" sortable></el-table-column>
                <el-table-column property="qualityName" label="新旧程度"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addMarketingGoodsConfirmBtn">确认添加</el-button>
                <el-button @click.native="addMarketingGoodsVisible = false">取消</el-button>
            </div>
            <!--分页-->
            <div class="block" style="text-align:right;">
                <el-pagination @current-change="goodsHandleCurrentChange"
                               :page-size="goodsPageSize"
                               layout="prev, pager, next"
                               :total="goodsTotal">
                </el-pagination>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {getIndexBannerList,getIndexBannerOne,addIndexBanner,updateIndexBanner,deleteIndexBanner,enableIndexBanner} from '../../api/api';
    import {getMarketingGoodsList,productSpuPrepareFun,getGoodsList,addMarketingGoods,deleteMarketingGoods,getUploadImgUrl} from '../../api/api';
    import util from '../../common/js/util';
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';
    // 要更改默认图片
    import marketingImg from '@/assets/marketingImg.png';

    export default {
        components:{
            selectGroup,
            selectGroupAdd
        },
        data() {
            return {
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                total:0,
                marketingTotal:0,//横幅商品分页信息
                marketingPage: 1,
                marketingPageSize:5,
                goodsTotal:0,//商品分页信息
                goodsPage: 1,
                goodsPageSize:5,
                marketingId:"",//横幅活动id
                businessTypeCode:"",//业务类型
                number: -1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                isEditSelect: true,//是否可选
                businessId:-1,//业务类型
                status:'',//当前状态
                channelType:'',//类型
                sels: [],//商品复选框选中的值
                addFormVisible : false,
                //图片处理
                imageUrl: '',
                uploadUrl: getUploadImgUrl(),

                product: {
                    spuCode:'',
                    skuCode:'',
                    minPrice:'',
                    maxPrice:'',
                    spuName:'',
                    brandId:'',
                    classId:'',
                    classIdList:[],
                },
                brandList:[],//品牌列表
                classList:[],//分类列表
                /**分类渲染模板**/
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                },

                flagOptions : [{
                    value: null,
                    label: '全部'
                },{
                    value: '0',
                    label: '禁用中'
                },{
                    value: '1',
                    label: '生效中'
                },{
                    value: '2',
                    label: '未生效'
                },{
                    value: '3',
                    label: '已失效'
                }],
                channelTypeOptions:[{
                    value: 1,
                    label: '小程序'
                },{
                    value: 2,
                    label: '公众号'
                },{
                    value:3,
                    label: 'APP'
                },{
                    value:4,
                    label: '商城'
                }],
                marketingTypeOptions:[{
                    value: 3,
                    label: 'banner横幅'
                },{
                    value:4,
                    label: '展示横幅'
                },{
                    value:5,
                    label: '态奢展示横幅左侧大图'
                },{
                    value:6,
                    label: '态奢展示横幅右侧小图'
                },{
                    value:7,
                    label: '态奢展示横幅方块图'
                },{
                    value:9,
                    label: '名品业务banner图'
                }],
                //表单数据
                addIndexBannerForm : {
                    startTime: "",
                    endTime: "",
                    marketingImg: "",
                    businessId: "",
                    channelType: "",
                    marketingType: "",
                    marketingTitle: "",
                    skipType:"",
                    skipUrl: "",
                    remark: "",
                    sortBy: "",
                    enableFlag : false
                },
                //数据校验
                addFormRules: {
                    startTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
                    endTime: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
                    marketingImg: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    businessId: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    channelType: [{required: true, message: '请选择类型', trigger: 'blur'}],
                    marketingType: [{required: true, message: '请选择横幅类型', trigger: 'blur'}],
                    marketingTitle: [{required: true, message: '请输入横幅标题', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    sortBy: [{pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字', trigger: 'blur'}]
                },

                marketingGoodsVisible:false,
                addMarketingGoodsVisible :false,
                listLoading: false,
                marketingGoods:[],      //横幅商品表格数据
                tableData:[],           //banner活动表格数据
                goodsList:[]
            };
        },
        methods:{
            getResultNumber(result){
                this.businessId = result;
            },
            getEditResultNumber(result){
                this.addIndexBannerForm.businessId = result;
            },
            //业务类型转换
            formatBusiness:function (row, column) {
                return row.businessId === 1 ? '洗护' : row.businessId === 2 ? '名品' : row.businessId === 4 ? '态奢' : '悦生活';
            },
            //类型转换
            formatChannelType:function (row, column) {
                return row.channelType === 1 ? '小程序' : row.channelType === 2 ? '公众号' : row.channelType === 3 ? 'APP' : '商城';
            },
            //横幅类型转换
            formatMarketingType:function (row, column) {
                switch (row[column.property]) {
                    case 3:
                        return 'banner横幅';
                        break;
                    case 4:
                        return '展示横幅';
                        break;
                    case 5:
                        return '态奢展示横幅左侧大图';
                        break;
                    case 6:
                        return '态奢展示横幅右侧小图';
                        break;
                    case 7:
                        return '态奢展示横幅方块图';
                        break;
                    case 9:
                        return '名品业务banner图';
                        break;
                    default:
                        return '营销活动';
                }
            },
            //活动状态转换
            formatStatus:function (row, column) {
                return row.status === 0 ? '停用中' : row.status === 1 ? '生效中' : row.status === 2 ? '未生效' : '已失效';
            },
            //状态显示转换
            formatEnableFlag: function (row, column) {
                return row.enableFlag === 1 ? '启用' : row.enableFlag === 0 ? '停用' : '未知';
            },
            //时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            //获取banner活动列表数据
            getIndexBanner() {
                let para = {
                    status: this.status,
                    businessId: this.businessId,
                    channelType: this.channelType,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getIndexBannerList(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            var ipUrl = process.env.IMG_URL;
                            var defaultImg = marketingImg;

                            var list = res.data.list;
                            for(var i=0;i<list.length;i++){
                                if (list[i].marketingImg == null || list[i].marketingImg == ""){
                                    list[i].marketingImg = defaultImg;
                                }else {
                                    list[i].marketingImg = ipUrl+list[i].marketingImg;
                                }

                                if(list[i].enableFlag == 1){
                                    if(new Date(list[i].startTime).getTime() > new Date().getTime()){
                                        list[i].status = 2
                                    }else if(new Date(list[i].startTime).getTime() <= new Date().getTime() && new Date(list[i].endTime).getTime() >= new Date().getTime()){
                                        list[i].status = 1
                                    }else{
                                        list[i].status = 3
                                    }
                                }else{
                                    list[i].status = 0
                                }

                            }

                            this.tableData=list;
                            this.total = res.data.paginationInfo.total;
                        }
                    }
                    ,res => { this.listLoading = false;}
                );
            },

            //图片上传
            beforeAvatarUpload(file){
                const isJPG = file.type === 'image/jpeg';
                const isGIF = file.type === 'image/gif';
                const isPNG = file.type === 'image/png';
                const isBMP = file.type === 'image/bmp';
                const isLt2M = file.size / 1024 / 1024 < 5;

                if (!isJPG && !isGIF && !isPNG && !isBMP) {
                    this.common.errorTip('上传图片必须是JPG/GIF/PNG/BMP 格式!');
                }
                if (!isLt2M) {
                    this.common.errorTip('上传图片大小不能超过 5MB!');
                }
                return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
            },

            handleAvatarSuccess(res, file) {
                this.imageUrl = process.env.IMG_URL + res.data.relativePath;
                this.addIndexBannerForm.marketingImg = res.data.relativePath;
            },

            //点击查询
            searchBannerInfo() {
                this.pageNum = 1;
                this.getIndexBanner();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getIndexBanner();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getIndexBanner();
            },

            //banner商品切换页数
            marketingHandleCurrentChange(val){
                var marketingRow = {id : this.marketingId};
                this.marketingPage = val;
                this.getMarketingGoodsBtn(marketingRow);
            },
            //商品切换页数
            goodsHandleCurrentChange(val){
                var businessTypeRow = {businessTypeCode : this.businessTypeCode};
                this.goodsPage = val;
                this.getGoodsListFun(businessTypeRow);
            },

            //获取banner商品列表
            getMarketingGoodsBtn(row){
                this.marketingId = row.id;
                this.businessTypeCode = row.businessId;
                this.marketingGoods = [];
                var para = {
                    id : row.id,
                    pageInfo: {
                        pageNum: this.marketingPage,
                        pageSize: this.marketingPageSize,
                    }
                };
                getMarketingGoodsList(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        var ipUrl = process.env.IMG_URL;
                        var defaultImg = marketingImg;

                        var list = res.data.list;

                        for(var i=0;i<list.length;i++){
                            if (list[i].imgPath == null || list[i].imgPath == ""){
                                list[i].imgPath = defaultImg;
                            }
                            list[i].imgPath = ipUrl + list[i].imgPath;
                        }

                        this.marketingTotal = res.data.paginationInfo.total;
                        this.marketingGoods = list;
                    }
                });
                this.marketingGoodsVisible = true;
            },

            /**获取当前商品需要得初始化数据**/
            spuPrepare() {
                productSpuPrepareFun().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.classList = res.data.classTree;
                        this.brandList = res.data.brandList;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //获取商品列表条件搜索
            seachGoodList() {
                var businessTypeRow = {businessTypeCode : this.businessTypeCode};
                this.goodsPage = 1;
                this.getGoodsListFun(businessTypeRow);
            },
            //获取商品列表
            getGoodsListFun(row){
                this.businessTypeCode = row.businessTypeCode;
                var para = {
                    businessTypeCode : row.businessTypeCode,
                    spuCode : this.product.spuCode,
                    skuCode : this.product.skuCode,
                    minPrice : this.product.minPrice,
                    maxPrice : this.product.maxPrice,
                    spuName : this.product.spuName,
                    brandId : this.product.brandId,
                    classId : this.product.classIdList[this.product.classIdList.length-1],
                    pageInfo:{
                        pageNum:this.goodsPage,
                        pageSize:this.goodsPageSize,
                    }
                };
                this.listLoading = true;
                getGoodsList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)){
                        var ipUrl = process.env.IMG_URL;
                        var defaultImg = marketingImg;

                        var list = res.data.list;

                        for(var i=0;i<list.length;i++){
                            if (list[i].imgPath == null || list[i].imgPath == ""){
                                list[i].imgPath = defaultImg;
                            }
                            list[i].imgPath = ipUrl + list[i].imgPath;
                        }
                        this.goodsTotal = res.data.paginationInfo.total;
                        this.goodsList = list;
                        this.listLoading = false;
                    }
                });
            },

            //添加banner商品
            addMarketingGoodsBtn(row){
                this.product.spuCode = '';
                this.product.skuCode = '';
                this.product.minPrice = '';
                this.product.maxPrice = '';
                this.product.spuName = '';
                this.product.brandId = '';
                this.product.classId = '';
                this.goodsPage = 1;
                var businessTypeRow = {businessTypeCode : this.businessTypeCode};
                this.getGoodsListFun(businessTypeRow);
                this.addMarketingGoodsVisible = true;
            },

            //添加banner商品
            addMarketingGoodsConfirmBtn(){
                var skuCodes = this.sels.map(item => item.skuCode).join();//获取所有选中行的id组成的字符串，以逗号分隔
                if(skuCodes == ""){
                    this.$message({
                        type: 'info',
                        message: '请选择至少一个添加的商品!'
                    });
                    return;
                }else{
                    var data = {
                        marketingId :this.marketingId,
                        skuCodes : skuCodes
                    }

                    addMarketingGoods(data).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)){
                            this.addMarketingGoodsVisible = false;
                            var marketingRow = {id : this.marketingId};
                            this.getMarketingGoodsBtn(marketingRow);
                        }
                    });

                }
            },

            //删除banner商品
            delMarketingGoodsBtn(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para = {
                        skuCode:row.skuCode,
                        marketingId:this.marketingId
                    };
                    deleteMarketingGoods(para).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            var marketingRow = {id : this.marketingId};
                            this.getMarketingGoodsBtn(marketingRow);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除失败!'
                    });
                });
            },

            //获取所有选中
            selsChange(sels){
                this.sels = sels;
            },

            //添加按钮
            handleAdd(){
                this.addFormVisible=true;
                this.addIndexBannerForm = {
                    id :"",
                    startTime: "",
                    endTime: "",
                    businessId: "",
                    channelType: "",
                    marketingType: "",
                    marketingTitle: "",
                    skipType: "",
                    skipUrl: "",
                    remark: "",
                    sortBy: "",
                    enableFlag : false
                }
                this.imageUrl =""
            },

            //编辑按钮
            editIndexBannerBtn(row){
                var para={id:row.id};
                getIndexBannerOne(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.addIndexBannerForm = {
                            id :res.data.id,
                            startTime: new Date(res.data.startTime),
                            endTime: new Date(res.data.endTime),
                            businessId: res.data.businessId,
                            channelType: res.data.channelType,
                            marketingType: res.data.marketingType,
                            marketingTitle: res.data.marketingTitle,
                            skipType: res.data.skipType,
                            skipUrl: res.data.skipUrl,
                            marketingImg : res.data.marketingImg,
                            remark:res.data.remark,
                            sortBy : res.data.sortBy,
                            enableFlag : res.data.enableFlag== 0 ? false : true
                        };
                        this.imageUrl = process.env.IMG_URL +res.data.marketingImg;
                        this.addFormVisible=true;
                    }
                })
            },

            //添加/编辑信息
            addOrEditSubmit(ve){
                this.$refs.addIndexBannerForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            if(this.addIndexBannerForm.enableFlag){
                                this.addIndexBannerForm.enableFlag = 1;
                            }else{
                                this.addIndexBannerForm.enableFlag = 0;
                            }
                            this.addIndexBannerForm.startTime = util.formatDate.format(new Date(this.addIndexBannerForm.startTime), 'yyyy-MM-dd hh:mm:ss');
                            this.addIndexBannerForm.endTime = util.formatDate.format(new Date(this.addIndexBannerForm.endTime), 'yyyy-MM-dd hh:mm:ss');
                            if(this.addIndexBannerForm.id== null || this.addIndexBannerForm.id ==""){
                                //新增
                                addIndexBanner(this.addIndexBannerForm).then((res) => {
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.addFormVisible = false;
                                        this.getIndexBanner();
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                    }
                                });
                            }else{
                                //修改
                                updateIndexBanner(this.addIndexBannerForm).then((res) => {
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.addFormVisible = false;
                                        this.getIndexBanner();
                                        this.$message({
                                            message: '更新成功',
                                            type: 'success'
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },

            //删除按钮
            handleDel(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para={id:row.id};
                    deleteIndexBanner(para).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.getIndexBanner();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除失败!'
                    });
                });
            },

            //启用/禁用状态
            editStatus: function (row) {
                let para = {
                    enableFlag: row.enableFlag === 1 ? 0 : 1,
                    id: row.id
                };
                this.listLoading = true;
                enableIndexBanner(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.listLoading = false;
                        this.getIndexBanner();
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            }

        },
        mounted(){
            this.getIndexBanner();
            this.spuPrepare();
        }
    }

</script>

