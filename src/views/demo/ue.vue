<template>
	<div class="app-container">
		<div>
			<!-- 组件有两个属性 value 传入内容双向绑定 setting传入配置信息 -->
			<editor class="editor" :value="content" :isImage="isImage" :setting="editorSetting" @input="getContent"></editor>
		</div>
		<div style="margin-top: 20px;">
			<el-button @click="save()" size="mini" type="primary">保存</el-button>
		</div>
	</div>
</template>
<script>
    import editor from '@/components/editor'
    export default {
        name: "editor-demo",
        data: function () {
            return {
                content:'',
                //tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
                editorSetting:{
                    height:400,
                },
                isImage:true
            }
        },
        components:{
            'editor':editor
        },
		methods:{
            getContent(content){
                this.content = content
            },
            //数据表单提交
            save(){

            }

		}
    }
</script>
<style scoped>
</style>
