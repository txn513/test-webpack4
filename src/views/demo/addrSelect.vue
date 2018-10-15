<template>
    <div>

        <el-form   ref="addForm" :model="addForm"  :rules="addFormRules">
            <el-form-item   prop="consignerAddress1">
                <addr-select  ref="child" @getresult = "getResult" @onAreaChange="onAreaChange('consignerAddress1')"  ></addr-select>
            </el-form-item>

            <!--    通过省市区名回显   :editData ="[]" 必须要写  -->
            <el-form-item   prop="consignerAddress2" label="通过省市区名回显: 广东省-深圳市-罗湖区">
                <addr-select   :editData ="[]"   :address="address" ref="child" @getresult = "getResult" @onAreaChange="onAreaChange('consignerAddress2')"  ></addr-select>
            </el-form-item>

            <el-form-item  >
                <el-button  type="primary" @click="btnOk">提交-验证通过省市区名回显</el-button>
            </el-form-item>

            <el-form-item   prop="consignerAddress3" label="通过code回显: 43 4309 430903">
                <addr-select :editData ="editData"  ref="child" @getresult = "getResult" @onAreaChange="onAreaChange('consignerAddress3')"  ></addr-select>
            </el-form-item>

            <!--    -->
            <el-form-item>
                <el-button  type="primary" @click="resetForm">清空选择</el-button>
            </el-form-item>
        </el-form>
    </div>


</template>
<script>
    import addrSelect from '@/components/addrSelect'
    export default {
        components:{
            addrSelect
        },
        data() {
            return{
                editData:[43,4309,430903],//后台返回的修改数据如果此数据为空说明是新增否则是修改
                addForm:{
                    consignerAddress1:'',
                    consignerAddress2:'',
                    consignerAddress3:'',
                },
                addFormRules:{
                   // consignerAddress1:{ required: true, message: '请选择省市区' },
                    consignerAddress2:{ required: true, message: '请选择省市区' },
                   // consignerAddress3:{ required: true, message: '请选择省市区' },
                },
                address:"广东省-深圳市-罗湖区"
            }

        },
        methods: {
            //获取选中的结果
            getResult(result){
                    console.log("当前选中的省市区code为:"+result);
                    this.addForm.consignerAddress2='x';  // 验证通过
                    this.$refs.addForm.validate((valid) => {
                 });
            },
            //清空选中的地址
            btnOk(){
                this.$refs.addForm.validate((valid) => {
                    console.log(valid);
                });
            },
            resetForm(){
                alert(this.address);
                this.$refs.child.resetForm();
            },
            onAreaChange(consignerAddress){
                console.log(consignerAddress);
                this.addForm[consignerAddress]=''; //验证不通过
                console.log(this.addForm);
            }
        },
        mounted(){
        }
    }
</script>

<style>

</style>
