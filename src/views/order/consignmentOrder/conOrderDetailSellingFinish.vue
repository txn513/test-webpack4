<template>
    <div>
        <consignmentOrderDetail ref="child"></consignmentOrderDetail>

        <div >
            <div style="text-align: center;margin-top: 20px">
                <el-button  v-if="isAuth(CON_PRIVILEGE.UPDATE)"  type="primary" style="align-content: center; " @click="btnOk"> 查看订单</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import consignmentOrderDetail from "./consignmentOrderDetail"
    import OrderUtil from '../../../common/js/OrderUtil';
    export default {
        data() {
            return {
                //寄卖订单状态枚举常量
                CON_STATUS : OrderUtil.data().CON_STATUS,
                CON_PRIVILEGE:OrderUtil.data().CON_PRIVILEGE,

            };
        },
        components: {
            consignmentOrderDetail
        },
        methods: {
            btnOk() {
                let t = this.$refs.child.id;
                // alert(this.$refs.child.orderData[0].selfId);
                //TODO
                // this.$router.push({path: '/orderSelf/queryDetailById?id='+row.id+'&orderStatus='+row.orderStatus});
                // this.$router.push({path: '/orderSelf/queryDetailById?id='+this.$refs.child.orderData[0].selfId+'&orderStatus=40'});
                this.$router.push({path: '/orderSelf/queryDetailById?id=' + this.$refs.child.orderData[0].selfId + '&orderStatus=已完成'});
                console.log(t);
            }
        },
        mounted() {
            console.log(this.$refs.child.id);
        }
    }
</script>

<style scoped>


</style>


