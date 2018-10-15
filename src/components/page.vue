<template>
    <div>

        <transition name="fade"
                    mode="out-in">
            <router-view></router-view>
        </transition>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
    </div>

</template>
<script>

  export default {
      name: 'page',
      props:{
          flag:String,
      },
      data () {
          return{
              addFormVisible:false
          }

      },
      computed: {

      },
      created(){
          //绑定关闭事件
          this.$root.eventHub.$on('close', (yourData)=>{
              this.addFormVisible=false;
          } )
      },
      methods: {
          //显示弹出层
         openLink(name) {
             this.$router.push({name:name,params:""});
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