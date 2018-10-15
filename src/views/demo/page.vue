<template>
    <section>

        <!--如果是弹窗flag的值为popup其他则为空-->
      <page @addsubmit="submit"  ref="page">

      </page>
        <el-button @click.native="add()">新增(页面)</el-button>
    </section>
</template>

<script>
    import page from '@/components/page'
    import addform from './addForm.vue'

    export default {
        components: {
            page,

        },
        data() {
            return {
                page:'page',


            }
        },
        methods: {
            add(){
                //调用组件路由(参数为组件名称)
                this.$refs.page.openLink('新增表单1');
            },
            submit(){
                //调用提交的方法
                alert("调取了提交的方法");
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.$refs.page.addFormVisible = false;//关闭子组件弹出层
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            }

        },
        mounted() {

        }
    }

</script>

<style scoped>

</style>