<template>
    <select-group :num ="number"  :select="isSelect" @getresult = 'getResultNumber'></select-group>
</template>
<script>
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            return{
                number:6,//后台传过来的十进制数据
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
