<template>
    <section>

        <!--如果是弹窗flag的值为popup其他则为空-->
      <popup @addsubmit="submit"  ref="popup">
          <addform>
          </addform>
      </popup>
        <el-button @click.native="add()">新增(弹窗)</el-button>
    </section>
</template>

<script>
    import popup from '@/components/popup'
    import addform from './addForm.vue'

    export default {
        components: {
            popup,
            addform
        },
        data() {
            return {
                popup:'popup',
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    date: '',
                    addr: ''
                },
                flag:1,
                rules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]

                }

            }
        },
        methods: {
            add(){
                this.$refs.popup.openPop();
            },
            submit(){
                //调用提交的方法
                alert("调取了提交的方法");
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.$refs.popup.addFormVisible = false;//关闭子组件弹出层
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