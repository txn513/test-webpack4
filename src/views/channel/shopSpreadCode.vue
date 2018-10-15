<template>
    <section>
        <!--查询-->
        <div class="toolbar el-col el-col-24" style="margin-top: 40px;text-align:right;">
            <div class="block">
                <!--<div style="float:left"> <el-button type="primary"  align="center"  v-on:click="synchronizationChaParameterBtn" >同步渠道</el-button></div>-->

                <!--按钮-->
                <el-input size="medium" v-model.trim="queryKey" placeholder="输入服务点名称" style="width:370px;"></el-input>
                <el-button type="primary"  v-on:click="getShopList(true)" :loading="listLoading" icon="el-icon-search">查询</el-button> &nbsp; &nbsp;
            </div>
        </div>

        <!--table-->
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="shopList"
                style="width: 100%;margin-top: 30px;">
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="shopName"
                    label="服务点名称">
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    prop="address"
                    label="地址">
            </el-table-column>
            <!--<el-table-column-->
                    <!--sortable-->
                    <!--align="center"-->
                    <!--prop="percentage"-->
                    <!--label="操作">-->
                <!--<template slot-scope="scope">-->

                    <!--<el-button @click="isDelete(scope.row)" type="text" size="small" >{{scope.row.disableFlag}}</el-button>-->
                    <!--&lt;!&ndash; 根据门店id 查找 二维码信息 &ndash;&gt;-->
                    <!--<el-button type="text" size="small" @click="warn(scope.row)">推广码</el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column sortable align="center" prop="percentage" label="操作">
                <template slot-scope="scope">
                    <el-button @click="warn(scope.row)" type="primary" size="mini">推广码</el-button>
                    <el-button @click="isDelete(scope.row)" type="primary" size="mini" >{{scope.row.disableFlag}}</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--分页-->
        <div class="block" style="text-align:right;">
            <el-pagination @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           layout="prev, pager, next"
                           :total="total">
            </el-pagination>
        </div>

        <template>
            <!-- <el-button type="text" @click="outerVisible = true">点击打开外层 Dialog</el-button>-->

            <el-dialog title="注意!!!" :visible.sync="outerVisible" width="20%" >
                <span>用户扫描推广码下载应用之后，务必让用户立即点开应用并进入首页，否则会统计不到。</span>
                <el-dialog width="35%" title="推广码" :visible.sync="innerVisible" append-to-body >

                    <div style="text-align: center;margin:auto;">
                        <div style="float:left">
                            <p >APP二维码</p>
                            <p><img :src="APPQRCodeUrl" width="300"  ></p>
                            <el-button round @click="download(APPQRCodeUrl,0)" >下载图片</el-button>
                        </div>

                        <div style="float:left;">
                            <p>微信二维码</p>
                            <p><img :src="WXQRCodeUrl" width="300"  > </p>
                            <el-button round @click="download(WXQRCodeUrl,1)" ><a :href="WXQRCodeUrl" download="w3logo"></a>下载图片</el-button>
                        </div>

                        <div style="clear: both;"></div>
                    </div>

                </el-dialog>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="outerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="getShowQRcode()">展示推广码</el-button>
                </div>
            </el-dialog>
        </template>


    </section>

</template>

<script>
    import util from '../../common/js/util'
    import { getShopListPage,enableShop,getChaParameter,synchronizationChaParameter} from '../../api/api';
    //import shopImg from '@/assets/shopImg.png';

    //前一天日期
    //    var d = new Date();
    //    d.setTime(d.getTime()-24*60*60*1000);

    export default {
        data() {
            return {
                outerVisible: false,
                innerVisible: false,
                id:"",
                shopName:"",
                shopList: [],
                page: 1,
                listLoading: false,
                total:0,
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                queryKey:"",
                APPQRCodeUrl:"",
                WXQRCodeUrl:"",

            }
        },

        //门店列表
        methods: {
            getShopList(flag) {
                var para = {
                    pageInfo:{
                        pageNum:flag===true?1:this.page,
                        pageSize:this.pageSize
                    },

                    queryKey:this.queryKey           //输入会员账号、昵称

                };
                this.listLoading = true;
                getShopListPage(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data.list;
                            //var ipUrl = process.env.IMG_URL;
                           // var defaultImg = shopImg;
                            for(var i=0;i<list.length;i++){
                                // if (list[i].headPhoto == null || list[i].headPhoto == ""){
                                //     list[i].headPhoto = defaultImg;
                                // }else {
                                //     list[i].headPhoto = ipUrl+list[i].headPhoto;
                                // }

                                // if(list[i].circlesName == null || list[i].circlesName == ""){
                                //     list[i].circlesName = "未定义";
                                // }

                                if(list[i].disableFlag == 0){
                                    list[i].disableFlag = "禁用";
                                }else{
                                    list[i].disableFlag = "启用";
                                }
                            }

                            this.shopList = list;
                            this.total = data.data.paginationInfo.total;
                            //NProgress.done();
                        }

                    }
                    ,data => { this.listLoading = false; }
                );
            },

            //分页查询
            handleCurrentChange(page) {
                this.page = page;
                this.getShopList();
            },

            //警告提醒展示
            warn(row){
                this.outerVisible=true;
                this.id = row.id;
                this.shopName = row.shopName;
            },

            //获取展示二维码
            getShowQRcode(){
                var data = {
                    shopId: this.id
                }

                this.APPQRCodeUrl = "";
                this.WXQRCodeUrl = "";
                //调用二维码
                getChaParameter(data).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var list = data.data;
                        if(list != null &&list.length >0 ){
                            for(var i=0;i<list.length;i++){
                                if(list[i].channelType == 0){
                                    var qrValue =  encodeURIComponent(process.env.APP_QRCode +list[i].channelParameter);
                                    var codeName =  encodeURIComponent(this.shopName+"APP下载推广码.jpg");
                                    this.APPQRCodeUrl = process.env.API_ROOT +"/image/createQrcodeImage?size=2000&codeName="+codeName+"&qrValue="+qrValue;
                                }else if (list[i].channelType == 1){
                                    var codeName =  encodeURIComponent(this.shopName+"公众号推广码.jpg");
                                    this.WXQRCodeUrl = process.env.API_ROOT +"/image/createQrcodeImage?size=2000&codeName="+codeName+"&qrValue="+list[i].qrCode;
                                }
                            }

                            this.innerVisible = true;
                            this.outerVisible = false;
                        }else{
                            this.$message({
                                message: '未找到二维码信息!',
                                type: 'error'
                            });
                            this.outerVisible = false;
                        }
                    }
                });

            },

            download(imgURL,type){
                if(type == 0){
                    this.APPQRCodeUrl = imgURL+"&isOpen=1";
                    window.location.href = this.APPQRCodeUrl;
                }else{
                    this.WXQRCodeUrl = imgURL+"&isOpen=1";
                    window.location.href = this.WXQRCodeUrl;
                }
            },

            //获取该门店订单列表
            getOrderListByShopId(data){
                alert("该功能尚未启,请前往旧版后台操作!");
            },

            //禁用 or 启用
            isDelete(row){

                var del = {
                    id :row.id,
                    disableFlag : row.disableFlag == "禁用" ? 1 :0
                };
                enableShop(del).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        this.getShopList();
                    }
                });
            },

            //同步门店信息至渠道
            synchronizationChaParameterBtn(){
                const loading = this.$loading({
                    lock: true,
                    text: '拼命同步中~',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                synchronizationChaParameter().then((data) => {
                    loading.close();

                    console.log(data);
                    if (this.GLOBAL.isResonseSuccess(data)){

                        this.$message({
                            message: '同步成功!',
                            type: 'success'
                        });
                        this.getShopList();

                    }
                });

            }
        },

        mounted() {
            this.getShopList();
        }
    }

</script>
