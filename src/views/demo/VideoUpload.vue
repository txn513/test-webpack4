<template>
    <video-upload @getresult="getResult" :src = "src"></video-upload>

</template>
<script>
    import videoUpload from '@/components/videoUpload';

    export default {
        components:{
            videoUpload
        },
        data() {
            return{
                src:''//此字段为空说明是新增

            }

        },
        methods: {
            getResult(result){
                //返回的图片地址
                if(!result){
                    console.log("当前没有视频");
                }else{
                    console.log(result);

                }

            }

        }
    }
</script>

<style>

</style>
