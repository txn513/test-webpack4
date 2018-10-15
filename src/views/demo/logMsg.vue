<template>
    <div>
        <log-msg :list="list"></log-msg>
    </div>


</template>
<script>
    import logMsg from '@/components/logMsg'
    export default {
        components:{
            logMsg
        },
        data() {
            return{
                list:[
                    {
                        logisticsInformation:'快件到达 潮汕中心',
                        recordTime:'2017-08-20 14:16 周日',
                    },
                    {
                        logisticsInformation:'快件到达 潮汕中心',
                        recordTime:'2017-08-20 14:16 周日',
                    },
                    {
                        logisticsInformation:'快件到达 潮汕中心',
                        recordTime:'2017-08-20 14:16 周日',
                    },
                    {
                        logisticsInformation:'快件到达 潮汕中心',
                        recordTime:'2017-08-20 14:16 周日',
                    },
                    {
                        logisticsInformation:'快件到达 潮汕中心',
                        recordTime:'2017-08-20 14:16 周日',
                    }
                ]

            }

        },
        methods: {


        }
    }
</script>

<style>

</style>
