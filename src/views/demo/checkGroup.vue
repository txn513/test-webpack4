<template>
    <check-group :num ="num" @getresult = 'getResult'></check-group>
</template>
<script>
    import checkGroup from '@/components/checkGroup';

    export default {
        components:{
            checkGroup
        },
        data() {
            return{
                num: 2//后台传过来的十进制数据
            }

        },
        methods: {
            getResult(result){
                alert("当前的结果为"+result);

            }

        }
    }
</script>

<style>

</style>
