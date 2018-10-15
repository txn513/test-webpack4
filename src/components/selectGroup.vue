<template>
    <div>
        <el-select
                v-model="checkList"
                multiple
                collapse-tags
                :disabled ='!select'
                style="width: 150px;"
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
      name: 'selectGroup',
      props:['num','select'],
      data () {
        return {
            checkList:[],//自定义方式的类型
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
                      this.select = true;
                      this.checkList = [];
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
                //选择所以权限
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
              this.checkList = [];
              if(this.num==-1){
                  //全选
                  for(let item of this.options){
                      this.checkList.push(item.code);
                  }
              }else if(this.num==0){
              }else{
                  for (let [index, elem] of this.options.entries()){
                      if(this.num&elem.code){
                          let item = this.num&parseInt(elem.code);
                          this.checkList.push(item+'');
                      }

                  }
              }
          },
          handleCheckedChange(){
              let result = 0;
              if(this.checkList.length==this.options.length){
                  result = -1;
              }else {
                  //根据选中的值获取code
                  for(let item of this.checkList){
                      result+= parseInt(item);
                  }


              }

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