<template>
    <div class="selectMenu">
        <el-row class="demo-autocomplete" style="margin: 10px 0;">
            <el-col :span="20" :offset="2">
                <el-autocomplete
                class="inline-input"
                v-model="searchMenuKey"
                :fetch-suggestions="querySearch"
                placeholder="请输入要查询的菜单"
                :trigger-on-focus="false"
                @select="handleSelect"
                clearable></el-autocomplete>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: {
    span: Number
  },
  data() {
    return {
      searchMenuKey: "",
      menuSource: []
    }
  },
  methods: {
    querySearch(queryString, cb) {
      const sources = this.menuSource;
      var results = queryString
        ? sources.filter(s => s.value.indexOf(queryString) > -1)
        : [];
      cb(results);
    },
    loadAll() {
      var rets = [];
      var menuList = JSON.parse(sessionStorage.getItem("menuList"));
      function recursionLoad(childMenu) {
        if (childMenu.children) {
          childMenu.children.forEach(children => {
            if (children.path && children.name) {
              rets.push({
                value: children.name,
                path: children.path
              });
            }
            recursionLoad(children);
          });
        }
      }
      menuList.forEach(menu => {
        recursionLoad(menu);
      });
      return rets;
    },
    handleSelect(item){
      this.$router.push(item.path);
    }
  },
  mounted() {
    this.menuSource = this.loadAll();
  }
};
</script>

<style scoped lang="scss">
  @import '~scss_vars';
  .selectMenu {
    position: fixed; top: 60px; left: 0; z-index: 4; background: #fff;
  }
</style>

