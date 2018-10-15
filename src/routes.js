const _import = require('./import_' + process.env.NODE_ENV);
let routes = [
    {path: '/login', component:resolve => {require(['./views/Login.vue'], resolve)}}
    ,{path: '/404', component:resolve => {require(['./views/404.vue'], resolve)} }
    ,{path: '/Home', component:resolve => {require(['./views/Home.vue'], resolve)}}
    ,{ path: '/updatePwd', component: resolve => {require(['./views/user/updatePwd.vue'], resolve)}, name: '修改密码'}

    ,{path: '*', redirect: { path: '/404'}}
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: 'Demo',
        children: [
            { path: '/main', component: resolve => {require(['./views/Main.vue'], resolve)}, name: '主页'}
            ,{ path: '/page6', component: resolve => {require(['./views/demo/Page6.vue'], resolve)}, name: '导航三' }
            ,{ path: '/table', component: resolve => {require(['./views/demo/Table.vue'], resolve)}, name: 'Table' }
            ,{ path: '/treeTable', component: resolve => {require(['./views/demo/treeTable.vue'], resolve)}, name: 'treeTable' }
            ,{ path: '/popup', component: resolve => {require(['./views/demo/popup.vue'], resolve)}, name: 'popup' }
            ,{ path: '/page', component: resolve => {require(['./views/demo/page.vue'], resolve)}, name: 'page' }
            ,{ path: '/validate', component: resolve => {require(['./views/demo/validateForm.vue'], resolve)}, name: 'validate' }
            ,{ path: '/echarts', component: resolve => {require(['./views/demo/echarts.vue'], resolve)} , name: 'echarts' }
            ,{ path: '/form', component: resolve => {require(['./views/demo/Form.vue'], resolve)}, name: 'Form' }
            ,{ path: '/user', component: resolve => {require(['./views/user/user.vue'], resolve)}, name: '列表' }
            ,{ path: '/fileUpload', component:resolve => {require(['./views/demo/FileUpload.vue'], resolve)}, name: '文件上传' }
            ,{ path: '/videoUpload', component:resolve => {require(['./views/demo/VideoUpload.vue'], resolve)}, name: '视频上传' }
            ,{ path: '/fileUploadMulti', component:resolve => {require(['./views/demo/FileUploadMulti.vue'], resolve)}, name: '多文件上传' }
            ,{ path: '/addrSelect', component: resolve => {require(['./views/demo/addrSelect.vue'], resolve)}, name: '地址选择' }
            ,{ path: '/logMsg', component: resolve => {require(['./views/demo/logMsg.vue'], resolve)}, name: '配送信息' }
            ,{ path: '/ue', component: resolve => {require(['./views/demo/ue.vue'], resolve)}, name: '富文本编辑' },
            ,{ path: '/checkGroup', component: resolve => {require(['./views/demo/checkGroup.vue'], resolve)}, name: '多选组件' }
            ,{ path: '/selectGroup', component: resolve => {require(['./views/demo/selectGroup.vue'], resolve)}, name: '下拉查询多选组件' }
            ,{ path: '/selectGroupAdd', component: resolve => {require(['./views/demo/selectGroupAdd.vue'], resolve)}, name: '下拉单选组件' }

        ]
    }
    ,{
        path: 'index',
        component: resolve => {require(['./views/Home.vue'], resolve)} ,
        name: '',
        children: [
            { path: '/index/index', component: resolve => {require(['./views/index/index.vue'],resolve)}, name: '首页'}
        ]
    }
    ,{
        path: 'goods',
        component: resolve => {require(['./views/Home.vue'], resolve)} ,
        name: '商品管理',
        children: [
            { path: '/productSpu/list', component: resolve => {require(['./views/product/productList.vue'], resolve)}, name: '商品列表'}
            ,{ path: '/productSku/list', component: resolve => {require(['./views/product/productSkuList.vue'], resolve)}, name: '运营管理'}
            ,{ path: '/productServicePrice/list', component: resolve => {require(['./views/product/cityPrice/cityServiceList.vue'], resolve)}, name: '城市价格管理'}
            ,{ path: '/brand/list', component: resolve => {require(['./views/product/brand/brandList.vue'], resolve)}, name: '品牌管理' }
            ,{ path: '/productClass/list', component: resolve => {require(['./views/product/class/classList.vue'], resolve)}, name: '分类管理' }
            ,{ path: '/attr/list', component: resolve => {require(['./views/product/attr/attrList.vue'], resolve)}, name: '属性管理' }
            ,{ path: '/productProtection/list', component: resolve => {require(['./views/product/protection/protectionList.vue'], resolve)} , name: '保障管理' }
            ,{ path: '/productQuality/list', component: resolve => {require(['./views/product/quality/qualityList.vue'], resolve)}, name: '品质管理' }
            ,{ path: '/productAccessories/list', component: resolve => {require(['./views/product/accessories/accessoriesList.vue'], resolve)}, name: '配件管理' }
            ,{ path: '/productDamage/list', component: resolve => {require(['./views/product/damage/damageList.vue'], resolve)}, name: '损伤管理' }
            ,{ path: '/goodsaleAnalysis/list', component: resolve => {require(['./views/goodsale/goodsAnalysis.vue'], resolve)}, name: '商品分析统计表'}
        ]
    }
    ,{
        path: 'order',
        component: resolve => {require(['./views/Home.vue'], resolve)} ,
        name: '订单管理',
        children: [
            { path: '/orderSelf/list', component: resolve => {require(['./views/order/selfOrder/selfOrderList.vue'], resolve)}, name: '自营订单'}
            ,{ path: '/orderSelf/queryDetailById', component: resolve => {require(['./views/order/selfOrder/selfOrderDetail.vue'], resolve)}, name: '订单详情'}
            ,{ path: '/orderReturns/list', component: resolve => {require(['./views/order/selfOrder/orderReturnList.vue'], resolve)}, name: '退货处理'}
            ,{ path: '/orderReturns/queryWaitOrder', component: resolve => {require(['./views/order/selfOrder/orderReturnDetail.vue'], resolve)}, name: '待处理'}
            ,{ path: '/orderReturns/queryDealOrder', component: resolve => {require(['./views/order/selfOrder/orderReturnDealing.vue'], resolve)}, name: '退货中'}
            ,{ path: '/orderReturns/queryCompleteOrder', component: resolve => {require(['./views/order/selfOrder/orderReturnComplete.vue'], resolve)}, name: '退货完成'}
            ,{ path: '/orderReturns/queryRefuseOrder', component: resolve => {require(['./views/order/selfOrder/orderReturnRefuse.vue'], resolve)}, name: '拒绝退货'}

            ,{ path: '/page6', component: resolve => {require(['./views/demo/Page6.vue'], resolve)}, name: '订单设置' }
            ,{ path: '/orderAdd', component: resolve => {require(['./views/order/selfOrder/AddSelfOrder.vue'], resolve)}, name: '新增自营订单' }
            ,{ path: '/orderRecycling', component: resolve => {require(['./views/order/recyclingOrder/orderRecycling.vue'], resolve)}, name: '回收订单' }
            ,{ path: '/recyclingOrderAdd', component: resolve => {require(['./views/order/recyclingOrder/recyclingOrderAdd.vue'], resolve)}, name: '添加回收订单'  }
            ,{ path: '/orderRecycling/query', component: resolve => {require(['./views/order/recyclingOrder/recyclingDetail.vue'], resolve)}, name: '回收订单商品详情' }
            ,{ path: '/consignmentOrder', component: resolve => {require(['./views/order/consignmentOrder/consignmentOrder.vue'], resolve)}, name: '寄卖订单' }
            ,{ path: '/consignmentOrderDetail', component: resolve => {require(['./views/order/consignmentOrder/consignmentOrderDetail.vue'], resolve)}, name: '寄卖订单详情'}
            ,{ path: '/consignmentOrderAdd', component: resolve => {require(['./views/order/consignmentOrder/consignmentOrderAdd.vue'], resolve)}, name: '寄卖订单添加'  }
            ,{ path: '/conOrderDetailWaitOperation', component: resolve => {require(['./views/order/consignmentOrder/conOrderDetailWaitOperation.vue'], resolve)}, name: '寄卖订单待操作'  }
            ,{ path: '/conOrderDetailWaitSend', component: resolve => {require(['./views/order/consignmentOrder/conOrderDetailWaitSend.vue'], resolve)}, name: '寄卖订单待发货'  }
            ,{ path: '/conOrderDetailSelling', component: resolve => {require(['./views/order/consignmentOrder/conOrderDetailSelling.vue'], resolve)}, name: '寄卖订单售卖中'  }
            ,{ path: '/conOrderDetailSellingFinish', component: resolve => {require(['./views/order/consignmentOrder/conOrderDetailSellingFinish.vue'], resolve)}, name: '寄卖订单已完成'  }
            ,{ path: '/consignmentOrderReturn', component: resolve => {require(['./views/order/consignmentOrder/consignmentOrderReturn.vue'], resolve)}, name: '寄卖退货订单待处理'  }
            ,{ path: '/orderConsignmentReturn/query', component: resolve => {require(['./views/order/consignmentOrder/consignmentOrderReturnDetail.vue'], resolve)}, name: '寄卖订单退货'  }
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '用户管理',
        children: [
            { path: '/user/list', component: resolve => {require(['./views/user/user.vue'], resolve)}, name: '用户列表'},
            { path: '/menu/list', component: resolve => {require(['./views/user/menu.vue'], resolve)}, name: '菜单管理'},
            { path: '/role/list', component: resolve => {require(['./views/user/role.vue'], resolve)}, name: '功能角色'},
            { path: '/org/list', component: resolve => {require(['./views/user/org.vue'], resolve)}, name: '组织管理'},
            { path: '/dataRole/list', component: resolve => {require(['./views/user/dataRole.vue'], resolve)}, name: '数据角色'},
            { path: '/dept/list', component: resolve => {require(['./views/user/dept.vue'], resolve)}, name: '部门管理'},
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '商户端员工管理',
        children: [
            { path: '/shopAccount/list', component: resolve => {require(['./views/shopaccount/list.vue'], resolve)}, name: '员工列表'},
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '库存管理',
        children: [
            { path: '/stockList', component: resolve => {require(['./views/stock/stockList.vue'], resolve)}, name: '库存查询'},
            { path: '/retainList', component: resolve => {require(['./views/stock/retainList.vue'], resolve)}, name: '商品留存'},
            { path: '/analysisList', component: resolve => {require(['./views/stock/analysisList.vue'], resolve)}, name: '库存分析'},
            { path: '/addTransfer', component: resolve => {require(['./views/stock/addTransfer.vue'], resolve)}, name: '新增调拨单'},
            { path: '/transferList', component: resolve => {require(['./views/stock/transferList.vue'], resolve)}, name: '调拨单列表'},
            { path: '/transferView', component: resolve => {require(['./views/stock/transferView.vue'], resolve)}, name: '调拨单详情'}
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '供应商管理',
        children: [
            { path: '/supplierList', component: resolve => {require(['./views/supplierManagement/supplierList.vue'], resolve)}, name: '供应商'}

        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '仓储管理',
        children: [
            { path: '/storeImportConfirm/list' , component: resolve => {require(['./views/store/StoreImportConfirm.vue'], resolve)}, name: '入库商品确认'}
            ,{ path: '/storeImportIdentifyDetail/list' , component: resolve => {require(['./views/store/StoreImportIdentifyDetail.vue'], resolve)}, name: '商品鉴定表' }
            ,{ path: '/storeExportMain/list' , component: resolve => {require(['./views/store/export/ExportOrderMain.vue'], resolve)}, name: '出库管理' },
            ,{ path: '/storeExportDetail/list' , component: resolve => {require(['./views/store/export/ExportOrderDetail.vue'], resolve)}, name: '出库单详情' }
            ,{ path: '/storeGoods/list' , component: resolve => {require(['./views/store/StoreGoods.vue'], resolve)}, name: '商品库存' }
            ,{ path: '/storeInfo/storeList' , component: resolve => {require(['./views/store/storeList.vue'], resolve)}, name: '仓库管理' }
            ,{ path: '/storeImport/list' , component: resolve => {require(['./views/store/ImportOrderMain.vue'], resolve)}, name: '入库管理' }
            ,{ path: '/storeImportDetail/list' , component: resolve => {require(['./views/store/ImportOrderDetail.vue'], resolve)}, name: '入库详情管理'}
        ]
    },
    {
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '会员管理',
        children: [
            { path: '/member/list' , component: resolve => {require(['./views/member/MemberInfo.vue'], resolve)}, name: '会员列表' },
            { path: '/member/address' , component: resolve => {require(['./views/member/MemberAddress.vue'], resolve)}, name: '会员地址列表' }
        ]
    },
    {
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '采购管理',
        children: [
            { path: '/purchaseOrder/list', component: resolve => {require(['./views/purchase/purchaseList.vue'], resolve)}, name: '采购单'},
            { path: '/purchaseOrderReturn/list', component: resolve => {require(['./views/purchase/purchaseReturnList.vue'], resolve)}, name: '采购退回'},
            { path: '/purchaseConfirm', component: resolve => {require(['./views/purchase/purchaseConfirm.vue'], resolve)}, name: ''},
            { path: '/purchaseCheck', component: resolve => {require(['./views/purchase/purchaseCheck.vue'], resolve)}, name: ''},
            { path: '/purchasePend', component: resolve => {require(['./views/purchase/purchasePend.vue'], resolve)}, name: ''},
            { path: '/purchaseOrder/add', component: resolve => {require(['./views/purchase/AddPurchase.vue'], resolve)}, name: '新增采购单'},
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '物流管理',
        children: [
            { path: '/logisticsTrack/list', component: resolve => {require(['./views/logistics/logisticsTrack.vue'], resolve)}, name: '物流跟踪'},
            { path: '/logisticsTrack/query', component: resolve => {require(['./views/logistics/logisticsTrackDetail.vue'], resolve)}, name: '物流跟踪详情'},
            { path: '/logisticsFreight/list', component: resolve => {require(['./views/logistics/logisticsFreight.vue'], resolve)}, name: '运费管理'},
            { path: '/premium/list', component: resolve => {require(['./views/logistics/premium.vue'], resolve)}, name: '产品保价'},
            { path: '/logisticsCompany/list', component: resolve => {require(['./views/logistics/logisticsCompany.vue'], resolve)}, name: '物流公司'},
            { path: '/businessType/list', component: resolve => {require(['./views/logistics/businessType.vue'], resolve)}, name: '业务类型'},
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '门店管理',
        children: [
            { path: '/shopInfo/list' , component: resolve => {require(['./views/shop/shopInfo.vue'], resolve)}, name: '门店列表'},
            { path: '/luxuryShop/list' , component: resolve => {require(['./views/shop/luxuryShop.vue'], resolve)}, name: '态奢门店列表'},
            { path: '/serviceInfo/list' , component: resolve => {require(['./views/shop/Service.vue'], resolve)}, name: '服务管理'},
            { path: '/meetWorldShop/list' , component: resolve => {require(['./views/shop/meetWorld.vue'], resolve)}, name: '遇界门店列表'},
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '运营管理',
        children: [
            { path: '/marketingInfo/list' , component: resolve => {require(['./views/marketing/marketingInfo.vue'], resolve)}, name: '营销活动'},
            { path: '/bannerInfo/list' , component: resolve => {require(['./views/marketing/bannerInfo.vue'], resolve)}, name: '横幅管理'},
            { path: '/hotBrand/list' , component: resolve => {require(['./views/marketing/hotBrand.vue'], resolve)}, name: '热门品牌'},
            { path: '/city/list' , component: resolve => {require(['./views/marketing/city.vue'], resolve)}, name: '城市管理'},
            { path: '/pickupDiscount/list' , component: resolve => {require(['./views/marketing/pickupDiscount.vue'], resolve)}, name: '取件折扣管理'},
            { path: '/exchangeCode' , component: resolve => {require(['./views/marketing/exchangeCode.vue'], resolve)}, name: '兑换码查询'},
            { path: '/sendMsg' , component: resolve => {require(['./views/marketing/sendMsg.vue'], resolve)}, name: '短信推送'},
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '会员统计汇总',
        children: [
            { path: '/memberTotal/countReg', component: resolve => {require(['./views/membertotal/countReg.vue'], resolve)}, name: '每日新增用户数' }
            ,{ path: '/memberTotal/retentionRate',component: resolve => {require(['./views/membertotal/retentionRate.vue'], resolve)}, name: '留存率' }
            ,{ path: '/memberTotal/regMap', component: resolve => {require(['./views/membertotal/regMap.vue'], resolve)}, name: '注册统计图' }
            ,{ path: '/memberTotal/regMember', component: resolve => {require(['./views/membertotal/regMember.vue'], resolve)}, name: '新增会员' }
            ,{ path: '/memberTotal/busyMember', component: resolve => {require(['./views/membertotal/busyMember.vue'], resolve)}, name: '活跃会员' }
            ,{ path: '/memberTotal/spreadChannel', component: resolve => {require(['./views/membertotal/spreadChannel.vue'], resolve)}, name: '线下推广数据统计' }
            ,{ path: '/memberTotal/spreadChannelInfo', component: resolve => {require(['./views/membertotal/spreadChannelInfo.vue'], resolve)}, name: '线下推广数据统计详情' }
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '申请管理',
        children: [
            { path: '/recycling/list', component: resolve => {require(['./views/apply/recycling/list.vue'], resolve)}, name: '申请列表'},
            { path: '/substitutionDetail', component: resolve => {require(['./views/apply/substitution/detail.vue'], resolve)}, name: '置换详情'},
            { path: '/appraisalDetail', component: resolve => {require(['./views/apply/appraisal/detail.vue'], resolve)}, name: '鉴定详情'},
            { path: '/leaseDetail', component: resolve => {require(['./views/apply/lease/detail.vue'], resolve)}, name: '租赁详情'},
            { path: '/pledgeDetail', component: resolve => {require(['./views/apply/pledge/detail.vue'], resolve)}, name: '质押详情'},
            { path: '/consignmentDetail', component: resolve => {require(['./views/apply/consignment/detail.vue'], resolve)}, name: '寄卖详情'},
            { path: '/recyclingDetail', component: resolve => {require(['./views/apply/recycling/detail.vue'], resolve)}, name: '回收详情'},
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '渠道管理',
        children: [
            { path: '/spreadManage/shop/list', component: resolve => {require(['./views/channel/shopList.vue'], resolve)}, name: '门店推广渠道'},
            { path: '/spreadManage/employee/list', component: resolve => {require(['./views/channel/employeeList.vue'], resolve)}, name: '员工推广渠道'},
            { path: '/shop/getShopListForSpread', component: resolve => {require(['./views/channel/shopSpreadCode.vue'], resolve)}, name: '门店推广码'}
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '会员订单统计',
        children: [
            { path: '/total/perNumber', component: resolve => {require(['./views/total/perNumber.vue'], resolve)}, name: '会员成交率'},
            { path: '/total/averagePrice', component: resolve => {require(['./views/total/average.vue'], resolve)}, name: '平均客单价'},
            { path: '/total/payAveragePrice', component: resolve => {require(['./views/total/payAverage.vue'], resolve)}, name: '平均客单价(已支付)'},
            { path: '/total/payAgain', component: resolve => {require(['./views/total/payAgain.vue'], resolve)}, name: '重复购买率'}
        ]
    },{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '充值管理',
        children: [
            { path: '/rechargeBase/list' , component: resolve => {require(['./views/recharge/rechargeBase.vue'], resolve)}, name: '森特币充值管理'},
            { path: '/rechargeActivity/list' , component: resolve => {require(['./views/recharge/rechargeActivity.vue'], resolve)}, name: '森特币充值活动'},
            { path: '/rechargeTotal' , component: resolve => {require(['./views/recharge/rechargeTotal.vue'], resolve)}, name: '森特币充值统计'}
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '加工厂管理',
        children: [
            { path: '/plantInfo/list' , component: resolve => {require(['./views/plant/plantInfo.vue'], resolve)}, name: '加工厂列表'}
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '服务点管理',
        children: [
            { path: '/servicePoint/list' , component: resolve => {require(['./views/servicePoint/servicePoint.vue'], resolve)}, name: '服务点列表'},
            { path: '/servicePoint/editOrAdd' , component: resolve => {require(['./views/servicePoint/servicePointEditOrAdd.vue'], resolve)}, name: '编辑服务点'},
            { path: '/servicePoint/partition' , component: resolve => {require(['./views/station/partition.vue'], resolve)}, name: '分区设置'},
            { path: '/servicePoint/stationDetail' , component: resolve => {require(['./views/station/stationDetail.vue'], resolve)}, name: '站点详情'},

        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '智能柜管理',
        children: [
            { path: '/site/list', component: resolve => {require(['./views/site/siteList.vue'], resolve)}, name: '智能柜列表'},
        ]
    },{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '会员等级管理',
        children: [
            { path: '/wealthRecordList', component: resolve => {require(['./views/rule/integralManage.vue'], resolve)}, name: '积分管理'},
            { path: '/ruleListForIntegralLevel', component: resolve => {require(['./views/rule/integralLevel.vue'], resolve)}, name: '积分等级规则'},
            { path: '/ruleListForMoneyChangeIntegral', component: resolve => {require(['./views/rule/moneyChangeIntegral.vue'], resolve)}, name: '消费金额兑积分规则'},
            { path: '/ruleListForIntegralChangeCoin', component: resolve => {require(['./views/rule/integralChangeCoin.vue'], resolve)}, name: '积分兑森特币规则'},
        ]
    },
    {
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '财务管理',
        children: [
            { path: '/finance' , component: resolve => {require(['./views/finance/finance.vue'], resolve)}, name: '财务报表'},
            { path: '/turnover' , component: resolve => {require(['./views/finance/turnover.vue'], resolve)}, name: '营业额查询'},
            { path: '/payBill' , component: resolve => {require(['./views/finance/payBill.vue'], resolve)}, name: '支付账单'}
        ]
    },
    {
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '配送员调度',
        children: [
            { path: '/orderAssign' , component: resolve => {require(['./views/orderAssign/orderAssign.vue'], resolve)}, name: '订单指派'},
            { path: '/orderReassign' , component: resolve => {require(['./views/orderAssign/orderReassign.vue'], resolve)}, name: '订单改派'}
        ]
    },
    {
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '服务设置',
        children: [
            { path: '/service/serviceBack' , component: resolve => {require(['./views/service/serviceBack.vue'], resolve)}, name: '服务反馈' },
            { path: '/service/problem' , component: resolve => {require(['./views/service/problem.vue'], resolve)}, name: '常见问题' },
            { path: '/service/serviceIntroduce' , component: resolve => {require(['./views/service/serviceIntroduce.vue'], resolve)}, name: '服务介绍' }
        ]
    },
    {
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '系统设置',
        children: [
            { path: '/system/baseInfoList' , component: resolve => {require(['./views/system/baseInfoList.vue'], resolve)}, name: '基础信息列表' },
            { path: '/business/list', component: resolve => {require(['./views/config/businessList.vue'], resolve)}, name: '业务管理'},
            { path: '/paymanner/list', component: resolve => {require(['./views/configmanage/payManner.vue'], resolve)}, name: '支付方式管理'},
            { path: '/version/list', component: resolve => {require(['./views/system/version.vue'], resolve)}, name: '版本管理'}
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '活动管理',
        children: [
            { path: '/activity/register', component: resolve => {require(['./views/activity/RegisterActivity.vue'], resolve)}, name: '注册送森特币管理'},
            { path: '/activity/list', component: resolve => {require(['./views/activity/list.vue'], resolve)}, name: '活动列表'},
            { path: '/activity/coupon', component: resolve => {require(['./views/activity/coupon.vue'], resolve)}, name: '优惠券管理'},
            { path: '/channeltypemanage/list', component: resolve => {require(['./views/activity/channelType.vue'], resolve)}, name: '活动渠道管理'},
            { path: '/activity/couponInfoList', component: resolve => {require(['./views/activity/couponList.vue'], resolve)}, name: '优惠券列表'},
            { path: '/activity/redeemCode', component: resolve => {require(['./views/activity/redeemCode.vue'], resolve)}, name: '兑换码管理'},
            { path: '/activity/activityCount', component: resolve => {require(['./views/activity/activityCount.vue'], resolve)}, name: '统计数据'},
            { path: '/activity/redeemCodeCount', component: resolve => {require(['./views/activity/redeemCodeList.vue'], resolve)}, name: '兑换码列表'},
    ]
    }
    ,
    {
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '内容管理',
        children: [
            { path: '/content/category' , component: resolve => {require(['./views/content/category.vue'], resolve)}, name: '分类管理' },
            { path: '/content/article' , component: resolve => {require(['./views/content/article.vue'], resolve)}, name: '文章信息管理' },
            { path: '/content/appInfo' , component: resolve => {require(['./views/content/appInfo.vue'], resolve)}, name: '应用管理' },
            { path: '/content/video' , component: resolve => {require(['./views/content/video.vue'], resolve)}, name: '视频列表' }
        ]
    }
    ,{
        path: '/',
        component: resolve => {require(['./views/Home.vue'], resolve)},
        name: '财务统计表',
        children: [
            { path: '/goodsale/list', component: resolve => {require(['./views/goodsale/goodsSale.vue'], resolve)}, name: '商品销售统计表'},
            { path: '/selfOrderTotal', component: resolve => {require(['./views/finance/selfOrderTotal.vue'], resolve)}, name: '自营销售订单统计表'},
        ]
    }

];

export default routes;