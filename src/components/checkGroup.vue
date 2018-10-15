<template>
    <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
        <el-checkbox label="洗护"></el-checkbox>
        <el-checkbox label="名品"></el-checkbox>
        <el-checkbox label="态奢"></el-checkbox>
    </el-checkbox-group>
</template>
<script>

  export default {
      name: 'checkGroup',
      props:['num','route'],
      data () {
        return {
            checkList: []
        }
      },
      computed: {

      },
      created(){

      },
      methods: {
          handleCheckedChange(){
              let str1 = this.checkList.includes("洗护")?'1':'0';
              let str2 = this.checkList.includes("名品")?'1':'0';
              let str3 = this.checkList.includes("态奢")?'1':'0';
              let result = parseInt(str1+str2+str3,2);
              this.$emit("getresult",result);

          },
          //保证字符串为三位小于三位前面自动补0
          pad(str,n){
              return str.padStart(n,'0');
          }
      },
      mounted() {

          let result = this.pad(this.num.toString(2),3).split("");
          if(result[0]==1){
              this.checkList.push("洗护");
          }
          if(result[1]==1){
              this.checkList.push("名品");
          }
          if(result[2]==1){
              this.checkList.push("态奢");
          }
      }
  }
</script>
<style scoped>





</style>