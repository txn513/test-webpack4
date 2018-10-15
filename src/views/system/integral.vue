<template>
    <section>
        <div style="margin-top: 40px;">
            <!-- 组件有两个属性 value 传入内容双向绑定 setting传入配置信息 -->
            <editor class="editor" :value="content"  :setting="editorSetting" @input="getContent"></editor>
        </div>
        <div style="margin-top: 20px;">
            <el-button @click="save()" size="mini" type="primary">保存</el-button>
            <el-button @click="cancel()" size="mini" type="primary">取消</el-button>
        </div>
    </section>
</template>

<script>
    import editor from '@/components/editor'
    import {addUserAgreementFun,getSysInfoList,updateUserAgreementFun} from '../../api/api';

    export default {
        data() {
            return {
                content:'请输入内容',
                id:'',
                flag: '',
                //tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
                editorSetting:{
                    height:600,
                }
            };
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
                if (!this.flag) {
                    let para ={
                        content: this.content,
                        infoType:1,
                    };
                    addUserAgreementFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        } else {
                            this.open(data.data);
                        }
                    });
                }else {
                    let para ={
                        content: this.content,
                        infoType:1,
                        id:this.id,
                    };
                    updateUserAgreementFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        } else {
                            this.open(data.data);
                        }
                    });
                }
            },

            //数据回显
            getData(){
                var para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    infoType:1
                };
                this.listLoading = true;
                getSysInfoList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            if (data.data.list.length == 0) {
                                this.flag = false;
                            }else {
                                this.flag = true;
                                this.content = data.data.list[0].content;
                                this.id = data.data.list[0].id;
                            }
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            }


        },
        mounted(){
            this.getData();
        }
    }

</script>

