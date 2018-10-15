<template>
    <section>
        <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                list-type="picture-card"
                :file-list = "imglist"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="color: red;">(仅支持jpg，png格式上传)</span>
    </section>

</template>
<script>
    import { getUploadImgUrl,getUploadAvatarUrl,getUploadGoodsUrl,getUploadBusinessUrl, processResponseData, isUploadSuccess } from '@/api/api';

    export default {
        props:{
            type:String,
            number:String,
            imglist:Array
        },
        watch:{
            //监听imglist的动态变化
            imglist:{
                handler(curVal,oldVal){
                    this.result = curVal;
                },
                deep:true
            }


        },
        data() {
            return {
                imageUrl: '',
                uploadUrl: "",
                result:this.imglist//上传后的图片地址列表
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                if (this.GLOBAL.isResonseSuccess(res)) {
                    if (isUploadSuccess(res.data)) {
                        if (res.data.relativePath) {
                            this.result.push({name:"",url:this.GLOBAL.getImgUrl(res.data.relativePath),relativeUrl:res.data.relativePath});
                            this.$emit("getresult",this.result);
                        }
                    }
                } else {
                    processResponseData(res);
                }
            },
            beforeAvatarUpload(file) {
                const isNumber = this.number==1 && this.result.length==1;
                const isNumberMax = this.number==2 && this.result.length>4;
                const isJPG = file.type === 'image/jpeg'||'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                if (isNumber) {
                    this.$message.error('只能上传一张图片');
                }
                if (isNumberMax) {
                    this.$message.error('最多只能上传五张图片');
                }
                return isJPG && isLt2M && !isNumber && !isNumberMax;
            },
            //删除图片
            handleRemove(file){
                if(file.url&&file.status=="success"){
                    this.result.splice(this.result.findIndex(item => item.url == file.url), 1);
                    this.$emit("getresult",this.result);
                }else{

                }

            }
        },
        mounted(){
            //判断上传图片的类型
            if(this.type==1){
                this.uploadUrl = getUploadImgUrl();
            }else if(this.type==2){
                this.uploadUrl = getUploadAvatarUrl();
            }else if(this.type==3){
                this.uploadUrl = getUploadGoodsUrl();
            }else{
                this.uploadUrl = getUploadBusinessUrl();
            }
        }
    }
</script>

<style>

</style>
