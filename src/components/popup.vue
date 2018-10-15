<template>
    <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
        <slot></slot>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>

  export default {
      name: 'popup',
      props:{
          flag:String,
      },
      data () {
        return {
            addFormVisible:false,
            addLoading:false


        }
      },
      computed: {

      },
      created(){
          //绑定关闭事件
          this.$root.eventHub.$on('close', ()=>{
              this.addFormVisible=false;
          } )
      },
      methods: {
          //显示弹出层
         openPop() {

             this.addFormVisible = true;


          },
          //提交到不同的路径
          addSubmit() {
              //触发表单组件里面的提交方法
              this.$root.eventHub.$emit('submit');
          }
      },
      mounted() {

      }
  }
</script>
<style scoped>





</style>