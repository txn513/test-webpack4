<template>
    <select-group-add :num ="number"  :select="isSelect" @getresult = 'getResultNumber'></select-group-add>
</template>
<script>
    import selectGroupAdd from '@/components/selectGroupAdd';

    export default {
        components:{
            selectGroupAdd
        },
        data() {
            return{
                number:1,//后台传过来的十进制数据
                isSelect: true//是否可选
            }

        },
        methods: {
            getResultNumber(result){
                alert("当前的结果为"+result);

            }

        }
    }
</script>

<style>

</style>
