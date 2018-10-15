<template>
    <div>
        <el-select
                clearable
                v-model="checkList"
                collapse-tags
                :disabled ='!select'
                placeholder="请选择"
                @change="handleCheckedChange">
            <el-option
                    v-for="item in options"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
            </el-option>
        </el-select>
    </div>

</template>
<script>
  export default {
      name: 'selectGroupAdd',
      props:['num','select'],
      data () {
        return {
            checkList:'',//选中的值
          options: [
            ],

        }
      },

      watch:{
          //num
          num:{
              handler(curVal,oldVal){
                  //状态重置
                  if(!curVal){
                      this.checkList = '';
                  }else{
                      this.init();
                  }
              },
              deep:true
          }


      },
      computed: {

      },
      created(){

      },
      methods: {
          //根据路由获取业务类型
          getBusinessByRoute: function () {
              let dataRoleList = JSON.parse(sessionStorage.getItem("dataRoleList"));
              //根据当前路由确定当前业务列表
              let bsType = dataRoleList.find((value, index, arr) => {
                  return value.path == this.$route.path
              });//当前的业务代码
              let businessList = JSON.parse(sessionStorage.getItem("businessList"));
              let result = [];//当前的业务数组

              if(bsType.businessType==-1){
                //选择所有权限
                  result = businessList;
                  for(let item of result){
                    item.code+='';
                  }
              }else{
                  let codeResult = [];
                  for (let item of businessList){
                      codeResult.push(bsType.businessType&parseInt(item.code));
                  }

                  for(let item of codeResult){
                      for(let item1 of businessList){
                          if(item==item1.code){
                              result.push({
                                  name: item1.name,
                                  code: item1.code+''
                              });
                          }
                      }
                  }
              }

              this.options = result;
              this.init();
          },
          init(){
              if(this.num==0){

              }else{
                  this.checkList = this.num+'';
              }
          },
          handleCheckedChange(){
              let result = 0;
              //根据选中的值获取code
              result+= parseInt(this.checkList);
              this.$emit("getresult",result);

          }

      },
      mounted() {
          this.getBusinessByRoute();
      }
  }
</script>
<style scoped>





</style>