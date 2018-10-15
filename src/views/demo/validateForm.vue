<template>
    <section>
        <el-form :model="addForm" :rules="rules" label-width="80px" ref="addForm">
           <el-form-item label="手机号码" prop="tel">
               <el-input v-model="addForm.tel" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item label="邮箱"  prop="email" >
               <el-input v-model="addForm.email" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item label="个人网址" prop="url">
               <el-input v-model="addForm.url" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item label="生日" prop="birth">
               <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
           </el-form-item>
           </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="submit" :loading="addLoading">提交</el-button>
        </div>
    </section>
</template>

<script>
    import  {VDT ,VDATA} from '@/common/js/validate'

    export default {
        data() {
            return {
                addLoading:false,
                //新增界面数据
                addForm: {
                    tel: '',
                    email: '',
                    url:'',
                    age: 0

                },
                rules: {
                    tel: [
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"required" : { msg : "请输入手机号码"}, "mphone" : {msg:"请输入有效的手机号码"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"required" : { msg : "请输入电子邮箱"}, "email" : {msg:"请输入有效的电子邮箱"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    url: [
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"required" : { msg : "请输入URL路径"}, "url" : {msg:"请输入有效URL路径"}, "maxlength":{param: "200", msg: "最大值不能超过200个字符"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    birth: [
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"required" : { msg : "请选择生日"}, "date" : {msg:"请选择有效的日期"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ]

                }

            }
        },
        methods: {
            submit(){

               this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        alert("调取了提交的方法");
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            }

        },
        created(){

        },
        mounted() {

        }
    }

</script>

<style scoped>

</style>