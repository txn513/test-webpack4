<template>
    <section>
        <!--工具条-->
        <div  class="toolbar" style="padding-bottom: 0px;">
           <span > 订单状态:<span class="order-status">{{orderStatus2}}</span></span>
            <div style="text-align:right;">
                <span align="right">
                     <el-button  type="primary" @click="updateOrderStatus()" >修改订单状态</el-button>
                </span>
                <span v-if="orderStatus2 == '待发货'" align="right">
                    <el-button  type="primary" @click="updateConsigneeFormUpdate()" >修改收货人信息</el-button>
                    <el-button  type="primary" @click="updateInvoiceeData()">修改发票信息</el-button>
                </span>
                <span v-if="orderStatus2 == '待收货'" align="right">
                    <span v-if="isTrue" align="right">
                        <el-button  type="primary" @click="logisticsTrackingFun" >物流跟踪</el-button>
                    </span>
                    <el-button  type="primary" @click="returnGoodsUpdate()">转退货处理</el-button>
                    <el-button  type="primary" @click="ensureDelivery()">确认客户已收货</el-button>
                </span>
                <span v-if="orderStatus2 == '用户确认已收货/已完成'" align="right">
                    <span v-if="isTrue" align="right">
                        <el-button  type="primary" @click="logisticsTrackingFun" >物流跟踪</el-button>
                    </span>
                    <el-button  type="primary" @click="returnGoodsUpdate()">转退货处理</el-button>
                </span>
            </div>
        </div>

        <h3 style="margin-top: 50px;">会员信息</h3>
        <el-table
                :data="memberBaseInfoData"
                stripe
                style="width: 100%"
                aria-label="会员信息">
            <el-table-column
                    sortable
                    prop="memberId"
                    label="会员ID"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="username"
                    label="会员昵称"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="phone"
                    label="手机号"
                    width="180"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="rankName"
                    label="会员等级"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="discount"
                    label="会员折扣"
                    show-overflow-tooltip>
            </el-table-column>
        </el-table>


        <h3 style="margin-top: 50px;">基本信息</h3>
        <el-table
                :data="baseData"
                stripe
                style="width: 100%"
                aria-label="基本信息">
            <el-table-column
                    sortable
                    prop="id"
                    label="订单号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderSourceType"
                    label="订单来源"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderOutId"
                    label="外部订单编号"
                    width="180"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                sortable
                prop="createTime"
                :formatter="dateFormat"
                label="提交时间"
                show-overflow-tooltip>
        </el-table-column>
        <el-table-column
                sortable
                prop="storeName"
                label="所属"
                show-overflow-tooltip>
        </el-table-column>
        <el-table-column
                sortable
                prop="plantName"
                label="加工中心"
                show-overflow-tooltip>
        </el-table-column>
            <!--<el-table-column
                    sortable
                    prop="userName"
                    label="用户账号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderStatus"
                    label="订单状态"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payType"
                    label="支付方式"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="logisticsCompanyName"
                    label="配送方式"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="logisticsNo"
                    label="物流单号"
                    how-overflow-tooltip>
            </el-table-column>-->
        </el-table>

        <h3 style="margin-top: 50px;">发票信息</h3>
        <el-table
                :data="invoiceeData"
                stripe
                style="width: 100%"
                aria-label="发票信息">
            <el-table-column
                    sortable
                    prop="invoiceProforma"
                    label="发票类型"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="invoiceFlag"
                    :formatter="invoiceFlagFormat"
                    label="发票状态"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="invoiceType"
                    label="发票抬头"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="invoiceContent"
                    label="发票内容"
                    how-overflow-tooltip :formatter="formatInvoiceContent">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="gatherInfo"
                    label="收票信息"
                    how-overflow-tooltip>
            </el-table-column>
        </el-table>

        <h3 style="margin-top: 50px;">配送信息</h3>
        <el-table
                :data="consigneeData"
                stripe
                style="width: 100%"
                aria-label="配送信息">
            <el-table-column
                    sortable
                    prop="distributionType"
                    :formatter="distributionTypeFormat"
                    label="配送方式"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="receiverName"
                    label="收货人姓名"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="receiverPhone"
                    label="手机号码"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="receiverCode"
                    label="邮政编码|取货门店"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="receiverAddress"
                    label="收货地址"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="logisticsNo"
                    label="物流单号"
                    how-overflow-tooltip>
            </el-table-column>
        </el-table>

        <h3 style="margin-top: 50px;">支付信息</h3>
        <el-table
                :data="payRecordData"
                stripe
                style="width: 100%"
                aria-label="支付信息">
            <el-table-column
                    sortable
                    prop="payStatus"
                    :formatter="payStatusFormat"
                    label="支付状态"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payType"
                    :formatter="payTpyeFormat"
                    label="支付方式"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="useSintercurrency"
                    label="森特币使用数量"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payMoney"
                    label="支付金额"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payRate"
                    label="支付费率"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payHandlingFee"
                    label="支付手续费"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="discountedPrice"
                    label="优惠金额"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payTime"
                    :formatter="dateFormat"
                    label="支付时间"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="tradeNo"
                    label="支付流水"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="remartk"
                    label="备注"
                    how-overflow-tooltip>
            </el-table-column>
        </el-table>

        <h3 style="margin-top: 50px;">费用信息</h3>
        <el-table
                :data="orderSelfCostData"
                stripe
                style="width: 100%"
                aria-label="费用信息">
            <el-table-column
                    sortable
                    prop="initialPrice"
                    label="商品合计"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="gapPrice"
                    label="差价"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="logisticsPrice"
                    label="运费"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="activityCouponPrice"
                    label="优惠券"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="activityPrice"
                    label="活动优惠"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="discountPrice"
                    label="折扣金额"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payPrice"
                    label="应付金额"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="paidPrice"
                    label="实付金额"
                    how-overflow-tooltip>
            </el-table-column>
        </el-table>

        <h3 style="margin-top: 50px;">订单商品详细信息</h3>
        <el-table
                :data="orderSelfProductsData.goodinfo"
                stripe
                style="width: 100%"
                aria-label="订单商品详细信息">
            <el-table-column
                    sortable
                    prop="spuCode"
                    label="商品编号"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="skuCode"
                    label="SKU"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="spuName"
                    label="商品名称"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="salesPrice"
                    label="价格"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="property"
                    label="属性"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="spuModel"
                    label="商品型号"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="number"
                    label="数量"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="qualityName"
                    label="品质"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="damage"
                    label="损伤部位"
                    how-overflow-tooltip>
            </el-table-column>
            <!--<el-table-column
                    sortable
                    prop="storeName"
                    label="所属仓库"
                    how-overflow-tooltip>
            </el-table-column>-->
            <el-table-column
                    sortable
                    prop="total"
                    label="小计"
                    how-overflow-tooltip>

                <template slot-scope = "scope">
                    {{scope.row.total}}
                    <a v-if="scope.row.orderDetailImgDetailResDtoList && scope.row.orderDetailImgDetailResDtoList.length > 0" @click="showProductImg(scope.$index, scope.row)">
                        查看
                    </a>
                    <a v-if="scope.row.returnFlag == 1" @click="showReturnDetail(scope.$index, scope.row)">
                        | 查看退货详情
                    </a>
                </template>
            </el-table-column>
        </el-table>

        <h3 style="margin-top: 50px;">操作信息</h3>
        <el-table
                :data="orderOperatingInformationsData"
                stripe
                style="width: 100%"
                aria-label="操作信息">
            <el-table-column
                    sortable
                    prop="operator"
                    label="操作者"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="createTime"
                    :formatter="dateFormat"
                    label="操作时间"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderStatus"
                    label="订单状态"
                    how-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="operationContent"
                    label="操作"
                    how-overflow-tooltip>
            </el-table-column>
        </el-table>

        <el-dialog title="修改订单状态" v-model="updateOrderStatusVisible" :visible.sync="updateOrderStatusVisible" class="orderDetailDialog" :append-to-body='true'>
            <el-form :model="updateOrderStatusForm" :rules="updateOrderStatusFormRules" ref="updateOrderStatusForm" label-width="110px">
                <el-form-item label="订单状态" prop="invoiceType">
                    <el-select v-model="updateOrderStatusForm.orderStatus">
                        <el-option label="提交状态" value=0></el-option>
                        <el-option label="申请取消" value=10></el-option>
                        <el-option label="待发货" value=20></el-option>
                        <el-option label="待收货" value=30></el-option>
                        <el-option v-if="businessCode == '1'" label="智能柜预约中" value=40></el-option>
                        <el-option v-if="businessCode == '1'" label="智能柜预约失败" value=50></el-option>
                        <el-option v-if="businessCode == '1'" label="智能柜预约成功" value=60></el-option>
                        <el-option v-if="businessCode == '1'" label="用户已将货物存柜" value=70></el-option>
                        <el-option v-if="businessCode == '1'" label="用户已将货物存柜" value=70></el-option>
                        <el-option v-if="businessCode == '1'" label="门店已分配收件员" value=80></el-option>
                        <el-option v-if="businessCode == '1'" label="收件员确认前往" value=90></el-option>
                        <el-option v-if="businessCode == '1'" label="收件员从柜中取件" value=100></el-option>
                        <el-option v-if="businessCode == '1'" label="已关联订单" value=110></el-option>
                        <el-option v-if="businessCode == '1'" label="门店收到客户的货物" value=120></el-option>
                        <el-option v-if="businessCode == '1'" label="加工中心收货员从门店收货" value=130></el-option>
                        <el-option v-if="businessCode == '1'" label="加工中心已收货" value=140></el-option>
                        <el-option v-if="businessCode == '1'" label="清洗中" value=150></el-option>
                        <el-option v-if="businessCode == '1'" label="清洗完成" value=160></el-option>
                        <el-option v-if="businessCode == '1'" label="送回门店" value=170></el-option>
                        <el-option v-if="businessCode == '1'" label="门店确认收货" value=180></el-option>
                        <el-option v-if="businessCode == '1'" label="门店分配派件员" value=190></el-option>
                        <el-option v-if="businessCode == '1'" label="派件员配送中" value=200></el-option>
                        <el-option v-if="businessCode == '1'" label="派件员已存入柜中" value=210></el-option>
                        <el-option label="已签收" value=220></el-option>
                        <el-option label="用户确认已收货/已完成" value=230></el-option>
                        <el-option v-if="businessCode == '1'" label="用户评价" value=240></el-option>
                        <el-option v-if="businessCode == '1'" label="商家回收" value=250></el-option>
                        <el-option v-if="businessCode == '1'" label="客户紧急取走" value=260></el-option>
                        <el-option label="提交退货" value=270></el-option>
                        <el-option label="已取消" value=280></el-option>
                        <el-option label="已退货" value=290></el-option>
                        <el-option label="关闭" value=300></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateOrderStatusVisible = false">取消</el-button>
                <el-button type="primary" @click="submitUpdateOrderStatusForm()">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改发票信息" v-model="updateInvoiceeVisible" :visible.sync="updateInvoiceeVisible" class="orderDetailDialog" :append-to-body='true'>

            <el-form :model="invoiceForm" :rules="invoiceFormRules" ref="invoiceForm" label-width="110px" style="margin:20px;width:62%;min-width:600px;">
                <el-form-item label="发票类型">
                    <span>{{invoiceForm.invoiceProforma}}</span>
                </el-form-item>
                <el-form-item label="发票抬头类型" prop="invoiceType">
                    <el-select v-model="invoiceForm.invoiceType" placeholder="请选择发票抬头类型" @change="invoiceTileType">
                        <el-option label="个人" value="1"></el-option>
                        <el-option label="单位" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="发票抬头名称" prop="invoiceTitleName" v-if="invoiceTileTypeFlag == 1" >
                    <el-input v-model="invoiceForm.invoiceTitleName" placeholder="请填写姓名"></el-input>
                </el-form-item>
                <el-form-item label="发票抬头名称" prop="invoiceTitleCompany" v-if="invoiceTileTypeFlag == 2">
                    <el-input v-model="invoiceForm.invoiceTitleCompany" placeholder="请填写公司发票抬头"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号" prop="payTaxesNo" v-if="invoiceTileTypeFlag == 2">
                    <el-input v-model="invoiceForm.payTaxesNo" placeholder="请填写纳税人识别号"></el-input>
                </el-form-item>

                <el-form-item label="发票内容" prop="invoiceContent">
                    <el-radio-group v-model="invoiceForm.invoiceContent">
                        <el-radio label="1">商品明细</el-radio>
                        <el-radio label="2">商品类别</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="收票人手机" prop="invoicePhone">
                    <el-input v-model="invoiceForm.invoicePhone"></el-input>
                </el-form-item>
                <el-form-item label="收票人邮箱" prop="invoiceEmail">
                    <el-input v-model="invoiceForm.invoiceEmail"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateInvoiceeVisible = false">取消</el-button>
                <el-button type="primary" @click="submitInvoiceForm('invoiceForm')">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="转到退货处理" v-model="returnGoodsVisible" :visible.sync="returnGoodsVisible" :append-to-body='true'>

            <el-form :label-position="labelPosition"  :model="returnGoods">
                <span v-if="this.orderSelfProductsData.goodinfo.length>1">
                    <span v-if="this.orderSelfProductsData.goodstatus.length==1"></span>
                     <span v-else>
                        <el-form-item label="退货商品选择:"></el-form-item>
                        <el-checkbox-group v-model="returnGoods.skuCode" @change="handleskuCodeChange">
                            <el-checkbox v-for="product in this.orderSelfProductsData.goodinfo" :label="product.skuCode" :key="product.skuCode" v-if="product.returnFlag==0">{{product.spuName}}{{product.property}}</el-checkbox>
                        </el-checkbox-group>
                    </span>
                </span>
                <el-form-item label="问题描述">
                    <el-input type="textarea" v-model="returnGoods.problemDescription"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="returnGoodsForm('returnGoods')">确认转退货处理</el-button>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="returnGoodsVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改收货人信息" v-model="updateConsigneeVisible" :visible.sync="updateConsigneeVisible" class="orderDetailDialog" :append-to-body='true'>

            <el-form :label-position="labelPosition"  :model="updateConsignee" :rules="updateConsigneeFormRules" ref="updateConsignee" label-width="110px" style="margin:20px;width:100%;min-width:800px;">
                <el-form-item label="客户姓名" prop="receiverName">
                    <el-col :span="8">
                        <el-input  v-model="updateConsignee.receiverName"></el-input>
                    </el-col >
                </el-form-item>
                <el-form-item label="联系方式" prop="receiverPhone">
                    <el-col :span="8">
                        <el-input  v-model="updateConsignee.receiverPhone"></el-input>
                    </el-col >
                </el-form-item>

                <el-form-item label="邮政编码" prop="receiverCode">
                    <el-col :span="8">
                        <el-input  v-model="updateConsignee.receiverCode"></el-input>
                    </el-col >
                </el-form-item>

                <el-form-item label="所在区域" prop="consignerAddress">
                    <el-select v-model="province.value" placeholder="请选择" style="width: 15%"  @change="initCity">
                        <el-option v-for="(item,index) in province.options" :key="item.code" :label="item.regionNameC" :value="index" />
                    </el-select>
                    <el-select v-model="city.value" placeholder="请选择" style="width: 15%" @change="initArea">
                        <el-option v-for="(item,index) in city.options" :key="item.code" :label="item.regionNameC" :value="index" />
                    </el-select>
                    <el-select v-model="area.value" placeholder="请选择" style="width: 15%">
                        <el-option v-for="(item,index) in area.options" :key="item.code" :label="item.regionNameC" :value="index"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="详细地址" prop="address">
                    <el-col :span="20">
                        <el-input  v-model="updateConsignee.address"></el-input>
                    </el-col >
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateConsigneeVisible = false">取消</el-button>
                <el-button type="primary" @click="updateConsigneeForm('updateConsignee')">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="物流信息" v-model="logisticsTrackingVisible" :visible.sync="logisticsTrackingVisible" :append-to-body='true'  >
            <div  class="toolbar" style="padding: 10px;justify-content: flex-start" >
                <span > 物流公司:<span class="order-status">{{logisticsCompany}}</span></span><span style="margin-left: 10em">物流单号:<span class="order-status">{{logisticsNo}}</span></span>
            </div>
            <template>
                <div>
                    <log-msg :list="logisticsTracking"></log-msg>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="logisticsTrackingVisible = false">关闭</el-button>
            </div>
        </el-dialog>


        <div class="el-carousel-wrap" v-show="showProductImages">
            <div class="inner">
                <div class="wrap">
                    <el-carousel :autoplay="false" arrow="always" height="600px" indicator-position="none" @change="carouselChange">
                        <el-carousel-item v-for="(item, index) in orderDetailImages" :key="index">
                          <div class="image-wrap">
                              <img :src="getImgUrl(item.imgPath)">
                          </div>
                        </el-carousel-item>
                    </el-carousel>
                    <div class="cover-left cover" v-if="showProductImgIdx <= 0"></div>
                    <div class="cover-right cover" v-if="showProductImgIdx >= orderDetailImages.length-1"></div>
                    <div class="cancel-btn" @click='closeOrderImages'>X</div>
                </div>
                 
                
                
            </div>
        </div>

    </section>
</template>
<script>
    import util from '../../../common/js/util'
    import logMsg from '@/components/logMsg'
    import OrderUtil from '../../../common/js/OrderUtil';
    import {orderSelfDetailFun,orderSelfQueryConsigneeFun,orderSelfUpdateConsigneeFun ,orderSelfQueryInvoiceFun,
        orderSelfUpdateInvoiceFun,getRegion,orderReturnsInsertFun,ensureDeliveryFun,getLogisticsTrackDetail,queryOrderFun,updateOrderFun,queryProductImgFun} from '../../../api/api';

    export default {
        components:{
            logMsg
        },

        props:{
            currentOrderId:''
        },

        watch: {
            currentOrderId: function (val) {
                this.queryDetailById();
            }
        },
        data() {
            var checkInvoiceTitleName = (rule, value, callback) =>{
                if((this.invoiceForm.invoiceType == '1' ||this.invoiceForm.invoiceType == '') && this.invoiceForm.invoiceTitleName == ''){
                    return callback(new Error('请填写姓名'));
                } else {
                    return callback()
                }
            };

            var checkInvoiceTitleCompany = (rule, value, callback) =>{
                if(this.invoiceForm.invoiceType == '2' && this.invoiceForm.invoiceTitleCompany == ''){
                    return callback(new Error('请填写公司发票抬头'));
                } else {
                    return callback()
                }
            };

            return {
                options: [{
                    value: 1,
                    label: '个人'
                },{
                    value: 2,
                    label: '单位'
                }],

                id:this.$route.query.id,
                orderStatus:this.$route.query.orderStatus,
                orderStatus1:"",
                orderStatus2:"",
                memberBaseInfoData:[],
                payRecordData:[],
                baseData:[],//基本信息
                invoiceeData:[],//发票信息
                consigneeData:[],//收货人信息
                orderSelfCostData:[],//费用信息
                orderSelfProductsData:{goodinfo:[],goodstatus:[]},//订单商品详情信息
                orderOperatingInformationsData:[],//操作日志信息
                updateInvoiceeVisible:false,//修改发票信息
                updateOrderStatusVisible:false,//修改订单状态
                listLoading:false,
                labelPosition:'right',
                businessCode:'',
                orderDetailImages: [],
                showProductImages: false,
                showProductImgIdx: 0,

                updateOrderStatusForm:{
                    orderStatus: ''
                },

                invoiceForm:{
                    invoiceType: '',
                    invoiceTitle: '',
                    invoiceTitleName: '',
                    invoiceTitleCompany: '',
                    payTaxesNo: '',
                    invoiceContent: '',
                    invoicePhone: '',
                    invoiceEmail: '',
                    invoiceProforma: ''
                },
                returnGoodsVisible:false,//转退货处理
                checkList:[],
                returnGoods:{
                    problemDescription:'',
                    skuCode:[],
                    orderId:this.$route.query.id,
                    orderStatus:"",
                },

                type:[],
                updateConsigneeVisible:false,//修改收货人信息
                updateConsignee:{},
                province:{options: [{}],value:''},
                city:{options: [{}],value:''},
                area:{options: [{}],value:''},

                updateOrderStatusFormRules:{
                    orderStatus:[{ required: true, message: '请选择订单状态'}]
                },

                //修改收货人信息验证
                updateConsigneeFormRules: {
                    receiverName: [
                        {required: true, message: '请输入客户名称', trigger: 'blur'},
                        { max: 32, message: '收货人姓名不能超过32个字符', trigger: 'blur' }
                        ],
                    receiverPhone: [{required: true, message: '请输入客户电话', trigger: 'blur'},  {pattern: /^1[34578][0-9]{9}$/, message: '手机号格式错误' }],
                    receiverCode:[
                        {pattern: /^(\d)*$/, message: '邮编格式错误' },
                        { max: 20, message: '邮政编码不能超过20个字符', trigger: 'blur' }
                        ],
                    consignerAddress:{ required: true, message: '请选择省市区' },
                    address: [
                        {required: true, message: '请输入客户详细地址', trigger: 'blur'},
                        { max: 200, message: '收货人详细地址不能超过200个字符', trigger: 'blur' }],
                },
                //修改发票信息验证
                invoiceFormRules:{
                    invoiceType: [
                        { required: true, message: '请选择发票抬头类型' }
                    ],
                    invoiceContent: [
                        { required: true, message: '请选择发票内容' }
                    ],
                    invoicePhone:[{required: true, message: '请输入收票人手机', trigger: 'blur'},  {pattern: /^1[34578][0-9]{9}$/, message: '手机号格式错误' }],
                    invoiceEmail:[{required: true, message: '请输入收票人邮箱', trigger: 'blur'},  {pattern: /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/, message: '邮箱格式错误' }],
                    invoiceTitleName: [
                        {validator: checkInvoiceTitleName, required: true, trigger: 'blur'},
                        { max: 64, message: '发票抬头名称不能超过64个字符', trigger: 'blur' }
                    ],
                    invoiceTitleCompany: [
                        {validator: checkInvoiceTitleCompany, required: true, trigger: 'blur'},
                        { max: 64, message: '发票抬头名称不能超过64个字符', trigger: 'blur' }
                    ],
                    payTaxesNo: [
                        { required: true, message: '请填写纳税人识别号', trigger: 'blur' },
                        { max: 32, message: '纳税人识别号不能超过32个字符', trigger: 'blur' }
                    ],
                },
                provinceCode:"",
                cityCode:"",
                logisticsTracking:[],//物流跟踪信息
                logisticsTrackingVisible:false,
                isTrue:false,//是否展示物流跟踪变量
                returnNo:"",//退货单号
                returnNo1:this.$route.query.orderReturnId,//跳转用的退货单号
                returnsStatus:this.$route.query.returnsStatus,//跳转用的退货单号状态
                logisticsCompany:"",
                logisticsNo:"",
                invoiceTileTypeFlag: 1,  //发票类型，1：个人 2: 单位
                businessCode: '',
            }
        },
        methods: {
            queryDetailById(){
                if (this.currentOrderId){
                    var para = {
                        id:this.currentOrderId
                    }
                } else {
                    var para = {
                        id:this.id
                    }
                }

                this.listLoading = true;
                orderSelfDetailFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;

                            if (list.orderReturnViews && list.orderReturnViews.length > 0){
                                this.returnNo = list.orderReturnViews[0].id;//自营退货订单id
                                this.returnsStatus = list.orderReturnViews[0].returnsStatus;//自营退货订单状态
                            }

                            //订单所属会员信息
                            if (list.orderMemberBaseInfoResDto){
                                this.memberBaseInfoData = [list.orderMemberBaseInfoResDto];
                            }

                            //订单支付信息
                            if (list.orderPayRecordInfo){
                                if (null === list.orderPayRecordInfo.payRate || 'undefined' === list.orderPayRecordInfo.payRate || 0 === list.orderPayRecordInfo.payRate){
                                    list.orderPayRecordInfo.payRate = '0.00%';
                                }

                                if (null === list.orderPayRecordInfo.payHandlingFee || 'undefined' === list.orderPayRecordInfo.payHandlingFee || 0 === list.orderPayRecordInfo.payHandlingFee){
                                    list.orderPayRecordInfo.payHandlingFee = '0.00';
                                }

                                if (null === list.orderPayRecordInfo.discountedPrice || 'undefined' === list.orderPayRecordInfo.discountedPrice || 0 === list.orderPayRecordInfo.discountedPrice){
                                    list.orderPayRecordInfo.discountedPrice = '0.00';
                                }

                                if (null === list.orderPayRecordInfo.payMoney || 'undefined' === list.orderPayRecordInfo.payMoney || 0 === list.orderPayRecordInfo.payMoney){
                                    list.orderPayRecordInfo.payMoney = '0.00';
                                }

                                if (null === list.orderPayRecordInfo.useSintercurrency || 'undefined' === list.orderPayRecordInfo.useSintercurrency || 0 === list.orderPayRecordInfo.useSintercurrency){
                                    list.orderPayRecordInfo.useSintercurrency = '0.00';
                                }
                                this.payRecordData = [list.orderPayRecordInfo];
                            }

                            this.baseData = [list.orderSelf];//基本信息
                            this.businessCode = this.baseData[0].businessCode;
                            if(this.baseData[0].distributionType===3){
                                this.isTrue = true;
                            }
                            if(this.baseData[0].orderStatus === 0)
                            {
                                this.baseData[0].orderStatus = "提交状态";
                                this.orderStatus1=0;
                                this.orderStatus2="提交状态";
                            } else if(this.baseData[0].orderStatus === 10){
                                this.baseData[0].orderStatus = "申请取消";
                                this.orderStatus1=10;
                                this.orderStatus2="申请取消";
                            } else if(this.baseData[0].orderStatus === 20){
                                this.baseData[0].orderStatus = "待发货";
                                this.orderStatus1=20;
                                this.orderStatus2="待发货";
                            } else if(this.baseData[0].orderStatus === 30){
                                this.baseData[0].orderStatus = "待收货";
                                this.orderStatus1=30;
                                this.orderStatus2="待收货";
                            } else if(this.baseData[0].orderStatus === 40){
                                this.baseData[0].orderStatus = "智能柜预约中";
                                this.orderStatus1=40;
                                this.orderStatus2="智能柜预约中";
                            } else if(this.baseData[0].orderStatus === 50){
                                this.baseData[0].orderStatus = "智能柜预约失败";
                                this.orderStatus1=50;
                                this.orderStatus2="智能柜预约失败";
                            } else if(this.baseData[0].orderStatus === 60){
                                this.baseData[0].orderStatus = "智能柜预约成功";
                                this.orderStatus1=60;
                                this.orderStatus2="智能柜预约成功";
                            } else if(this.baseData[0].orderStatus === 70){
                                this.baseData[0].orderStatus = "用户已将货物存柜";
                                this.orderStatus1=70;
                                this.orderStatus2="用户已将货物存柜";
                            } else if(this.baseData[0].orderStatus === 80){
                                this.baseData[0].orderStatus = "门店已分配收件员";
                                this.orderStatus1=80;
                                this.orderStatus2="门店已分配收件员";
                            } else if(this.baseData[0].orderStatus === 90){
                                this.baseData[0].orderStatus = "收件员确认前往";
                                this.orderStatus1=90;
                                this.orderStatus2="收件员确认前往";
                            } else if(this.baseData[0].orderStatus === 100){
                                this.baseData[0].orderStatus = "收件员从柜中取件";
                                this.orderStatus1=100;
                                this.orderStatus2="收件员从柜中取件";
                            } else if(this.baseData[0].orderStatus === 110){
                                this.baseData[0].orderStatus = "已关联订单";
                                this.orderStatus1=110;
                                this.orderStatus2="已关联订单";
                            } else if(this.baseData[0].orderStatus === 120){
                                this.baseData[0].orderStatus = "门店收到客户的货物";
                                this.orderStatus1=120;
                                this.orderStatus2="门店收到客户的货物";
                            } else if(this.baseData[0].orderStatus === 130){
                                this.baseData[0].orderStatus = "加工中心收货员从门店收货";
                                this.orderStatus1=130;
                                this.orderStatus2="加工中心收货员从门店收货";
                            } else if(this.baseData[0].orderStatus === 140){
                                this.baseData[0].orderStatus = "加工中心已收货";
                                this.orderStatus1=140;
                                this.orderStatus2="加工中心已收货";
                            } else if(this.baseData[0].orderStatus === 150){
                                this.baseData[0].orderStatus = "清洗中";
                                this.orderStatus1=150;
                                this.orderStatus2="清洗中";
                            } else if(this.baseData[0].orderStatus === 160){
                                this.baseData[0].orderStatus = "清洗完成";
                                this.orderStatus1=160;
                                this.orderStatus2="清洗完成";
                            } else if(this.baseData[0].orderStatus === 170){
                                this.baseData[0].orderStatus = "送回门店";
                                this.orderStatus1=170;
                                this.orderStatus2="送回门店";
                            } else if(this.baseData[0].orderStatus === 180){
                                this.baseData[0].orderStatus = "门店确认收货";
                                this.orderStatus1=180;
                                this.orderStatus2="门店确认收货";
                            } else if(this.baseData[0].orderStatus === 190){
                                this.baseData[0].orderStatus = "门店分配派件员";
                                this.orderStatus1=190;
                                this.orderStatus2="门店分配派件员";
                            } else if(this.baseData[0].orderStatus === 200){
                                this.baseData[0].orderStatus = "派件员配送中";
                                this.orderStatus1=200;
                                this.orderStatus2="派件员配送中";
                            } else if(this.baseData[0].orderStatus === 210){
                                this.baseData[0].orderStatus = "派件员已存入柜中";
                                this.orderStatus1=210;
                                this.orderStatus2="派件员已存入柜中";
                            } else if(this.baseData[0].orderStatus === 220){
                                this.baseData[0].orderStatus = "已签收";
                                this.orderStatus1=220;
                                this.orderStatus2="已签收";
                            } else if(this.baseData[0].orderStatus === 230){
                                this.baseData[0].orderStatus = "用户确认已收货/已完成";
                                this.orderStatus1=230;
                                this.orderStatus2="用户确认已收货/已完成";
                            } else if(this.baseData[0].orderStatus === 240){
                                this.baseData[0].orderStatus = "用户评价";
                                this.orderStatus1=240;
                                this.orderStatus2="用户评价";
                            } else if(this.baseData[0].orderStatus === 250){
                                this.baseData[0].orderStatus = "商家回收";
                                this.orderStatus1=250;
                                this.orderStatus2="商家回收";
                            } else if(this.baseData[0].orderStatus === 260){
                                this.baseData[0].orderStatus = "客户紧急取走";
                                this.orderStatus1=260;
                                this.orderStatus2="客户紧急取走";
                            } else if(this.baseData[0].orderStatus === 270){
                                this.baseData[0].orderStatus = "提交退货";
                                this.orderStatus1=270;
                                this.orderStatus2="提交退货";
                            } else if(this.baseData[0].orderStatus === 280){
                                this.baseData[0].orderStatus = "已取消";
                                this.orderStatus1=280;
                                this.orderStatus2="已取消";
                            } else if(this.baseData[0].orderStatus === 290){
                                this.baseData[0].orderStatus = "已退货";
                                this.orderStatus1=290;
                                this.orderStatus2="已退货";
                            } else if(this.baseData[0].orderStatus === 300){
                                this.baseData[0].orderStatus = "关闭";
                                this.orderStatus1=300;
                                this.orderStatus2="关闭";
                            } else {
                                this.baseData[0].orderStatus = "未知";
                                this.orderStatus2="未知";
                            }

                            //'订单来源类型(10:京东;11:淘宝;5:门店)',
                            if (this.baseData[0].orderSourceType === 10) {
                                this.baseData[0].orderSourceType = "京东"
                            } else if (this.baseData[0].orderSourceType === 11) {
                                this.baseData[0].orderSourceType = "淘宝"
                            } else if (this.baseData[0].orderSourceType === 5) {
                                this.baseData[0].orderSourceType = "门店"
                            } else if (this.baseData[0].orderSourceType === 1) {
                                this.baseData[0].orderSourceType = "小程序"
                            } else if (this.baseData[0].orderSourceType === 2) {
                                this.baseData[0].orderSourceType = "微信公众号"
                            } else if (this.baseData[0].orderSourceType === 3) {
                                this.baseData[0].orderSourceType = "苹果app"
                            } else if (this.baseData[0].orderSourceType === 4) {
                                this.baseData[0].orderSourceType = "安卓app"
                            } else if (this.baseData[0].orderSourceType === 12){
                                this.baseData[0].orderSourceType = "其他"
                            }
                            if (list.oderInvoice){
                                this.invoiceeData = [list.oderInvoice];//发票信息
                                if (this.invoiceeData && this.invoiceeData[0].invoiceProforma && this.invoiceeData[0].invoiceProforma === 1){//发票形式(1:纸质发票;2:电子普通发票)
                                    this.invoiceeData[0].invoiceProforma = "纸质发票"
                                } else if(this.invoiceeData && this.invoiceeData[0].invoiceProforma && this.invoiceeData[0].invoiceProforma === 2){
                                    this.invoiceeData[0].invoiceProforma = "电子普通发票"
                                }

                                if(this.invoiceeData[0].invoiceType === 1){//发票类型 (1:个人 ;2:单位)
                                    this.invoiceeData[0].invoiceType = "个人"
                                }else  if(this.invoiceeData[0].invoiceType === 2){
                                    this.invoiceeData[0].invoiceType = "单位"
                                }
                            }

                            this.consigneeData = [list.orderSelfConsigneeInfo];//收货人信息


                            if(this.consigneeData[0].receiverCode === null ||this.consigneeData[0].receiverCode==="")
                            {
                                this.consigneeData[0].receiverCode = list.orderSelfConsigneeInfo.shopName;
                            }

                            this.orderSelfCostData = [list.orderSelfCostInfo];//费用信息

                            this.orderSelfCostData[0].initialPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].initialPrice).toFixed(2));
                            this.orderSelfCostData[0].logisticsPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].logisticsPrice).toFixed(2));
                            this.orderSelfCostData[0].couponPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].couponPrice).toFixed(2));
                            this.orderSelfCostData[0].activityCouponPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].activityCouponPrice).toFixed(2));
                            this.orderSelfCostData[0].activityPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].activityPrice).toFixed(2));
                            this.orderSelfCostData[0].discountPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].discountPrice).toFixed(2));
                            this.orderSelfCostData[0].paidPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].paidPrice).toFixed(2));
                            this.orderSelfCostData[0].payPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].payPrice).toFixed(2));
                            this.orderSelfCostData[0].gapPrice=util.moneyFormat(parseFloat(this.orderSelfCostData[0].gapPrice).toFixed(2));

                            this.orderSelfProductsData.goodinfo = list.orderSelfProducts;//订单商品明细信息
                            for(var z=0;z<this.orderSelfProductsData.goodinfo.length;z++){
                                if(this.orderSelfProductsData.goodinfo[z].returnFlag===0){//没有退货
                                    this.orderSelfProductsData.goodstatus.push(this.orderSelfProductsData.goodinfo[z].skuCode);
                                }
                                this.orderSelfProductsData.goodinfo[z].salesPrice=util.moneyFormat(parseFloat(this.orderSelfProductsData.goodinfo[z].salesPrice).toFixed(2));
                                this.orderSelfProductsData.goodinfo[z].total=util.moneyFormat(parseFloat(this.orderSelfProductsData.goodinfo[z].total).toFixed(2));
                            }

                            this.orderOperatingInformationsData = list.orderOperatingInformations;//操作日志信息
                            for(var z=0;z<this.orderOperatingInformationsData.length;z++){
                                if( this.orderOperatingInformationsData[z].remark )
                                    this.orderOperatingInformationsData[z].operationContent=this.orderOperatingInformationsData[z].operationContent+" (备注:"+this.orderOperatingInformationsData[z].remark+")";
                            }
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //修改发票信息
            updateInvoiceeData(){

                //如果该订单没有发票
                if (this.baseData && this.baseData.length > 0 && this.baseData[0].invoiceFlag === 0){
                    this.$message({
                        message: '该订单没有发票',
                        type: 'warning'
                    });
                    return;
                }

                this.updateInvoiceeVisible=true;
                if (this.currentOrderId){
                    var para={
                        orderId:this.currentOrderId
                    }
                } else {
                    var para={
                        orderId:this.id
                    }
                }

                orderSelfQueryInvoiceFun(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        if (res.data){
                            this.invoiceForm = res.data;
                            if(this.invoiceForm.invoiceProforma ===1 ){
                                this.invoiceForm.invoiceProforma = '纸质发票';
                            }else if(this.invoiceForm.invoiceProforma === 2){
                                this.invoiceForm.invoiceProforma = '电子普通发票';
                            }

                            if (this.invoiceForm.invoiceType === 1 ){
                                this.invoiceForm.invoiceType  = '1';
                                this.invoiceTileTypeFlag = 1;
                                this.invoiceForm.invoiceTitleName = this.invoiceForm.invoiceTitle;
                                this.invoiceForm.invoiceTitleCompany = '';
                                this.invoiceForm.payTaxesNo = '';
                            }

                            if (this.invoiceForm.invoiceType === 2 ){
                                this.invoiceForm.invoiceType  = '2';
                                this.invoiceTileTypeFlag = 2;
                                this.invoiceForm.invoiceTitleCompany = this.invoiceForm.invoiceTitle;
                                this.invoiceForm.invoiceTitleName = '';
                            }
                        }
                    }
                    else {
                        this.$message({
                            message: '操作失败,'+res.message==undefined?"":res.message,
                            type: 'warning'
                        });
                    }
                    this.listLoading = false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            submitInvoiceForm(formName) {
                this.$refs.invoiceForm.validate((valid) => {
                    if (valid) {
                            this.listLoading = true;
                            let para = Object.assign({}, this.invoiceForm);

                            if(para.invoiceType == '1'){
                                para.invoiceTitle = para.invoiceTitleName;
                                para.invoiceTitleCompany = '';
                                para.payTaxesNo = '';
                            }

                            if(para.invoiceType == '2'){
                                para.invoiceTitle = para.invoiceTitleCompany;
                                this.invoiceForm.invoiceTitleName = '';
                            }

                            para.orderStatus = this.orderStatus1;
                            if (this.invoiceForm.invoiceProforma === "电子普通发票") {
                                para.invoiceProforma = 2;
                            }

                            orderSelfUpdateInvoiceFun(para).then((res) => {
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.updateInvoiceeVisible = false;
                                    this.queryDetailById();
                                    }
                                    else {
                                        this.$message({
                                            message: '操作失败,'+res.message==undefined?"":res.message,
                                            type: 'warning'
                                        });
                                    }
                                this.listLoading = false;
                            }, (res) => { this.listLoading = false; } ).catch(() => {});
                    }
                })
            },

            //修改订单状态点击事件
            updateOrderStatus(){
                this.updateOrderStatusVisible = true;
                if (this.currentOrderId){
                    var para={
                        orderId:this.currentOrderId
                    }
                } else {
                    var para={
                        orderId:this.id
                    }
                }

                queryOrderFun(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)){
                        if (res.data){
                            this.updateOrderStatusForm.orderStatus = res.data.orderStatus + '';
                            this.businessCode = res.data.businessCode + '';
                        }
                    }
                })
            },

            submitUpdateOrderStatusForm(){
                this.$refs.updateOrderStatusForm.validate((valid) => {
                    if (valid) {
                        this.listLoading = true;
                        var para = Object.assign({}, this.updateOrderStatusForm);
                        if (this.currentOrderId){
                            para.orderId = this.currentOrderId;
                        } else {
                            para.orderId = this.id;
                        }

                        updateOrderFun(para).then((res)=>{
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.updateOrderStatusVisible = false;
                                this.queryDetailById();
                            }
                            else {
                                this.$message({
                                    message: '修改失败,'+res.message == undefined ? "" : res.message,
                                    type: 'warning'
                                });
                            }
                        }).catch(() => {});
                    }
                })
            },

            //修改收货人信息
            updateConsigneeFormUpdate(){
                this.updateConsigneeVisible=true;

                if (this.currentOrderId){
                    var para={
                        id:this.currentOrderId
                    }
                } else {
                    var para={
                        id:this.id
                    }
                }
                this.listLoading = true;
                orderSelfQueryConsigneeFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.updateConsignee=data.data;
                            this.province.value=data.data.province;
                            this.province.regionNameC= this.province.value;
                            let index = -1;
                            let item   = this.province.options.find((item)=>{
                                index++;
                                return item.regionNameC === data.data.province;//筛选出匹配数据
                            });
                            this.province.value = index;
                            this.province.options[this.province.value ].code = item.code;

                            this.initCity();
                            let _this = this;
                            setTimeout(function() {
                                let index2 = -1;
                                let item2 = _this.city.options.find((item) => {
                                    index2++;
                                    return item.regionNameC === data.data.city;//筛选出匹配数据
                                });
                                _this.city.value = index2;
                                _this.city.options[_this.city.value].code = item2.code;
                                _this.initArea();
                            },50);

                            setTimeout(function(){
                                let index3 = -1;
                                let item3 = _this.area.options.find((item) => {
                                    index3++;
                                    return item.regionNameC === data.data.area;//筛选出匹配数据
                                });
                                _this.area.value = index3;
                                _this.area.options[_this.area.value].code = item3.code;
                            },100);
                            setTimeout(function(){
                                _this.area.regionNameC=data.data.area;
                                _this.updateConsigneeFormRules.consignerAddress.required=false;
                            },400);
                            this.updateConsigneeFormRules.consignerAddress.required=false;
                        }
                    },data => { this.listLoading = false;}
                );
            },
            updateConsigneeForm(x){
                this.$refs.updateConsignee.validate((valid) => {
                    if (valid) {
                        //省市区地址拼接
                        let receiverAddress = "";
                        try {
                            receiverAddress = this.province.options[this.province.value].regionNameC+"-"+this.city.options[this.city.value].regionNameC+"-"+this.area.options[this.area.value].regionNameC+ "-" + this.updateConsignee.address;
                        }
                        catch (err) {
                            console.log(err.toLocaleString());
                            receiverAddress= this.province.regionNameC+"-"+this.city.regionNameC+"-"+this.area.regionNameC+"-"+this.updateConsignee.address;
                        }
                        let para = Object.assign({}, this.updateConsignee);
                        delete para.address;
                        para.receiverAddress=receiverAddress;
                        para.orderStatus = this.orderStatus1;
                        this.listLoading = true;
                        orderSelfUpdateConsigneeFun(para).then((res) => {
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.updateConsigneeVisible=false;
                                this.queryDetailById();
                            }
                            else {
                                    this.$message({
                                        message: '操作失败,'+res.message==undefined?"":res.message,
                                        type: 'warning'
                                    });
                                }
                            this.listLoading = false;
                        }, (res) => { this.listLoading = false; } ).catch(() => {});
                    }
                })

            },
            initProvince(){
                getRegion({upperRegion:0}).then((res) => {
                    this.city.value="";
                    this.area.value="";
                    this.province.options = res.data;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            initCity(){
                let code= this.province.options[this.province.value ].code;
                getRegion({upperRegion:code}).then((res) => {
                    this.updateConsigneeFormRules.consignerAddress.required=true;
                    this.city.value="";
                    this.area.value="";
                    this.city.options = res.data;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            initArea(){
                let code= this.city.options[this.city.value].code;
                getRegion({upperRegion:code}).then((res) => {
                    this.updateConsigneeFormRules.consignerAddress.required=false;
                    this.area.options = res.data;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            handleskuCodeChange(value) {

            },
            //转退货处理
            returnGoodsUpdate(){
                this.returnGoodsVisible=true;
            },

            returnGoodsForm(){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    if(this.orderSelfProductsData.goodinfo.length > 1 && this.orderSelfProductsData.goodstatus.length === 1){
                        this.returnGoods.skuCode.push(this.orderSelfProductsData.goodstatus[0]);
                    }
                    let para = Object.assign({}, this.returnGoods);
                    para.orderStatus = this.orderStatus1;
                    this.listLoading = true;
                    orderReturnsInsertFun(para).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.returnNo = res.data.id;//自营退货订单id
                            this.returnsStatus = res.data.returnsStatus;//自营退货订单状态
                            this.returnGoodsVisible = false;
                            this.queryDetailById();
                        }
                        else {
                            this.$message({
                                message: '操作失败,'+res.message==undefined?"":res.message,
                                type: 'warning'
                            })
                        }
                    this.listLoading = false;

                }, (res) => { this.listLoading = false; } ).catch(() => {});
                });
            },
            //查看退货详情
            showReturnDetail(index,row) {
                var orderPath;
                if(this.returnsStatus && this.returnsStatus != "") {
                    switch (Number(this.returnsStatus)) {
                        //待处理
                        case 10:
                            orderPath = '/orderReturns/queryWaitOrder';
                            break;
                        //退货中
                        case 20:
                            orderPath = '/orderReturns/queryDealOrder';
                            break;
                        //已完成
                        case 40:
                            orderPath = '/orderReturns/queryCompleteOrder';
                            break;
                        //已拒绝
                        case 50:
                            orderPath = '/orderReturns/queryRefuseOrder';
                            break;
                        default:
                            orderPath = '/orderReturns/queryWaitOrder';
                    }
                }

                if(this.returnNo1 && this.returnNo1 != "") {
                    if (this.currentOrderId){
                        this.$router.push({path: orderPath + '?id=' + this.returnNo1 + '&orderId=' + this.currentOrderId});
                    } else {
                        this.$router.push({path: orderPath + '?id=' + this.returnNo1 + '&orderId=' + this.id});
                    }
                }else{
                    if (this.currentOrderId){
                        this.$router.push({path: orderPath + '?id=' + this.returnNo + '&orderId=' + this.currentOrderId});
                    } else {
                        this.$router.push({path: orderPath + '?id=' + this.returnNo + '&orderId=' + this.id});
                    }
                }
            },
            //确认用户已收货
            ensureDelivery(){
                this.$confirm('确认订单已完成吗？', '提示', {}).then(() => {
                    if (this.currentOrderId){
                        var para={
                            id:this.currentOrderId,
                            distributionType:this.baseData[0].distributionType,
                            logisticsNo:this.baseData[0].logisticsNo
                        };
                    } else {
                        var para={
                            id:this.id,
                            distributionType:this.baseData[0].distributionType,
                            logisticsNo:this.baseData[0].logisticsNo
                        };
                    }

                    this.listLoading = true;
                    ensureDeliveryFun(para).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.returnGoodsVisible = false;
                            this.queryDetailById();
                        }
                        else {
                            this.$message({
                                message: '操作失败,'+res.message==undefined?"":res.message,
                                type: 'warning'
                            });
                        }
                    this.listLoading = false;
                    }, (res) => { this.listLoading = false; } ).catch(() => {});
                });
            },  //物流跟踪
            logisticsTrackingFun(){
                this.logisticsTracking = [];
                this.logisticsTrackingVisible = true;
                if (this.currentOrderId){
                    var para = {
                        orderNumber:this.currentOrderId,
                        logisticsNumber:this.baseData[0].logisticsNo,
                    };
                } else {
                    var para = {
                        orderNumber:this.id,
                        logisticsNumber:this.baseData[0].logisticsNo,
                    };
                }

                this.listLoading = true;
                getLogisticsTrackDetail(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.logisticsTracking = res.data.list;
                        this.logisticsCompany = this.logisticsTracking[0].logisticsCompany;
                        this.logisticsNo = this.logisticsTracking[0].logisticsNumber;
                    }else {
                        this.$message({
                            message: '操作失败,'+res.message==undefined?"":res.message,
                            type: 'warning'
                        });
                    }
                    this.listLoading = false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //时间格式化
            dateFormat(row, column) {
                return OrderUtil.commonDateFormat(row, column);
            },

            formatInvoiceContent: function (row, column) {
                return row.invoiceContent === '1' ? '商品明细' : row.invoiceContent === '2' ? '商品类型' : '未知';
            },

            //发票类型 1：个人 2：单位
            invoiceTileType(value) {
                if (value == '1') {
                    this.invoiceTileTypeFlag = 1;
                } else {
                    this.invoiceTileTypeFlag = 2;
                }
            },

            invoiceFlagFormat(row){
                return row.invoiceFlag === 0 ? '未开' : row.invoiceFlag === 1 ? '已开' : '未知';
            },

            distributionTypeFormat(row){
                if (row.distributionType === 0){
                    return '派件上门';
                } else if (row.distributionType === 1){
                    return '到店自取';
                } else if (row.distributionType === 2){
                    return '到柜自取';
                } else if (row.distributionType === 3){
                    return '快递配送';
                } else {
                    return '未知';
                }
            },

            payStatusFormat(row){
                if (row.payStatus === 0){
                    return '未付款';
                } else if (row.payStatus === 1){
                    return '已付款';
                } else {
                    return '未知';
                }
            },

            payTpyeFormat(row){
                if (row.payType === 0){
                    return '微信';
                } else if (row.payType === 1){
                    return '支付宝';
                } else if (row.payType === 2){
                    return '森特币';
                } else if (row.payType === 3){
                    return '优惠券';
                } else if (row.payType === 4){
                    return '积分';
                } else if (row.payType === 5){
                    return 'pos机';
                } else if (row.payType === 6){
                    return '银联';
                } else if (row.payType === 9){
                    return '森特币';
                }  else if (row.payType === -1){
                    return '无';
                } else {
                    return '未知';
                }
            },

            showProductImg(index,row) {
                this.orderDetailImages = row.orderDetailImgDetailResDtoList;
                this.showProductImages = true
            },
            closeOrderImages(){
                this.showProductImages = false
            },
            getImgUrl(urlRelativePath) {
                return process.env.IMG_URL + urlRelativePath;
            },
            carouselChange(e){
                console.log(e)
                this.showProductImgIdx = e
            },
        },
        mounted() {
            this.queryDetailById();
            this.initProvince();
        }
    }

</script>

<style scoped>
    a{
        color: blue;
        cursor: pointer;
        text-decoration: none;
    }
    .container {
        position: relative;
    } 
    .el-button {
        margin-left: 10px;
    }
    .toolbar{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px 0 10px ;
    }

    .el-dialog__wrapper {
        position: absolute;
        /*z-index: 3010 !important;*/
    }

    .el-carousel-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.2);
        z-index: 100;
    }
    .el-carousel-wrap .inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        width: 1000px;
        text-align: center;
    }
    .el-carousel-wrap .wrap .cancel-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        /*transform: translateX(-50%);*/
        width: 36px;
        height: 36px;
        border-radius: 50%;
        z-index: 100;
        /*border: 1px solid rgba(31, 45, 61, 0.11);*/
        line-height: 36px;
        font-size: 16px;
        color: #fff;
        background: rgba(31, 45, 61, 0.11);
        cursor: pointer;
        font-weight: 300;
    }
    .el-carousel-wrap .wrap .cancel-btn:hover {
        background: rgba(31, 45, 61, 0.23)
    }
    .el-carousel__item .image-wrap {
        color: #475669;
        font-size: 18px;
        line-height: 600px;
        height: 100%;
        margin: 0;
        background: #fff;
      }
      .el-carousel__item .image-wrap img {
        margin: auto;
        max-width: 70%;
        max-height: 90%;
        vertical-align: middle;
      }
      .el-carousel-wrap .cover {
        position: absolute;
        top: 0;
        background: #fff;
        width: 60px;
        height: 600px;
        /*transform: translateY(-50%);*/
        z-index: 100;
      }
      .el-carousel-wrap .wrap {
        position: relative;
      }
      .el-carousel-wrap .cover-left {
        /*left: 10px;*/
        left: 0;
      }
      .el-carousel-wrap .cover-right {
        /*right: 10px;*/
        right: 0;
      }

</style>