<template>
    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>

</template>
<script>
    import fileupload from '@/components/fileUpload';

    export default {
        components:{
            fileupload
        },
        data() {
            return{
                type:"4",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片 4为业务图片上传
                num:'2',//参数为1限制为只能上传一张2为多张
                imgList:[
                    {
                        name: 'food.jpeg',
                        url : 'http://test.sinter.cn/upload_mpys/img_goods/2018/05/18/1526625105969.jpg',
                        relativeUrl : "img_goods/2018/05/18/1526625105969.jpg"
                    }
                ]//此数组为空说明是新增

            }

        },
        methods: {
            getResult(result){
                //返回的图片地址
                if(result.length==0){
                    console.log("当前没有图片");
                }else{
                    for(let item of result){
                        console.log(item.url);
                    }
                }

            }

        }
    }
</script>

<style>

</style>
