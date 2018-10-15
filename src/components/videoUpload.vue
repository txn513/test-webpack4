<template>
    <section>
        <!-- action必选参数, 上传的地址 -->
        <el-upload
            class="avatar-uploader el-upload--text"
            :action="uploadUrl"
            :show-file-list="false"
            :on-remove="handleRemove"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess">
            <video v-if="videoSrc !='' && videoFlag == false" :src="videoSrc" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
            <i v-else-if="videoSrc =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
            <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>
        </el-upload>
        <P class="text" style="color: red;">(请保证视频格式正确，且不超过5M)</P>
    </section>

</template>
<script>
    import { uploadVideo,processResponseData, isUploadSuccess } from '@/api/api';

    export default {
        props:{
            src:String

        },
        watch:{


        },
        data() {
            return {
                uploadUrl:'',
                videoFlag:'',//是否存在视频
                videoUploadPercent:null,//上传进度百分比
                videoSrc:''//上传后的图片地址列表
            };
        },
        methods: {
            //上传成功
            handleVideoSuccess(res, file) {
                this.videoFlag = false;
                this.videoUploadPercent = 0;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    if (isUploadSuccess(res.data)) {
                        if (res.data.relativePath) {
                            this.$emit("getresult",res.data.relativePath);
                            this.videoSrc = this.GLOBAL.getImgUrl(res.data.relativePath);
                        }
                    }
                } else {
                    processResponseData(res);
                }
            },
            //上传进度
            uploadVideoProcess(event, file, fileList){
                this.videoFlag = true;
                this.videoUploadPercent = Number(file.percentage.toFixed(0));
            },
            beforeUploadVideo(file) {
                const isLt10M = file.size / 1024 / 1024 < 5;
                if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1) {
                    this.$message.error('请上传正确的视频格式');
                    return false;
                }
                if (!isLt10M) {
                    this.$message.error('上传视频大小不能超过5MB哦!');
                    return false;
                }
            },
            //删除
            handleRemove(file){
                if(file.url&&file.status=="success"){
                    this.$emit("getresult",'');
                }else{

                }

            }
        },
        mounted(){
            this.uploadUrl = uploadVideo();
            if(this.src){
                this.videoSrc = this.GLOBAL.getImgUrl(this.src);
            }
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
