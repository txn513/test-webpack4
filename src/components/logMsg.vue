<template>
    <div>
        <div class="package-status">
            <div class="status-box" >
                <ul  class="status-list">
                    <li v-for="(item,index) in list" :class="index == 0 ? 'latest': index==list.length-1? '' : 'latest' ">
                        <div class="status-content-before">{{item.logisticsInformation}}</div>
                        <div class="status-time-before">{{timeFormat(item.recordTime)}}</div>
                        <div class="status-line"></div>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>
<script>

  export default {
      props:{
          list:Array

      },
      data () {
        return {

        }
      },
      methods: {
            // 时间格式化
          timeFormat(dateStr) {
            let date = new Date(dateStr);
            let year = date.getFullYear();
            let month = this.addZero(date.getMonth() + 1)
            let day = this.addZero(date.getDate())

            let hour = this.addZero(date.getHours())
            let minute = this.addZero(date.getMinutes())
            let second = this.addZero(date.getSeconds())

            // return {
            //   year, month, day, hour, minute, second
            // }
            return year + '-' + month + '-' + day + ' ' + hour + ':'+ minute + ':' + second
          },
          // 一位数添加零
          addZero(num) {
            let n = num + '';
            if (n.length == 1) {
              return '0' + n
            } else {
              return n
            }
          },
      },
      mounted() {
          //加载省数据

      }
  }
</script>
<style scoped>

    .package-status{padding:18px 0 0 0}
    .package-status .status-list{margin:0;padding:0;margin-top:-5px;padding-left:8px;list-style:none;}
    .package-status .status-list li{border-left:2px solid #d9d9d9;text-align:left;}
    .package-status .status-list li:before{ /* 流程点的样式 */
        content:'';
        border:3px solid #f3f3f3;
        background-color:#d9d9d9;
        display:inline-block;
        width:10px;
        height:10px;
        border-radius:10px;
        margin-left:-9px;
        margin-right:10px
    }
    .package-status .status-list .latest:before{background-color:#0dad12;border-color:#f8e9e4;}
    .package-status .status-box{overflow:hidden}
    .package-status .status-list li{height:auto;}
    .package-status .status-list{margin-top:-8px}
    .package-status .status-box{position:relative}
    .package-status .status-box:before{content:" ";background-color:#f3f3f3;display:block;position:absolute;top:-8px;left:20px;width:10px;height:4px}
    .package-status .status-list{margin-top:0px;}
    /* .package-status .status-list .latest{border:none} */
    /* .package-status .status-list li{margin-bottom:-2px} */



    .status-list li:not(:first-child){
        padding-top:10px;
    }

    .status-content-before{
        text-align:left;
        margin-left:25px;
        margin-top:-20px;
    }
    .status-content-latest{
        text-align:left;
        margin-left:25px;
        color:green;
        margin-top:-20px;
    }
    .status-time-before{
        text-align:left;
        margin-left:25px;
        font-size:10px;
        margin-top:5px;

    }
    .status-time-latest{
        text-align:left;
        margin-left:25px;
        color:green;
        font-size:10px;
        margin-top:5px;
    }
    .status-line {
        border-bottom: 1px solid #ccc;
        margin-left: 25px;
        margin-top: 10px;
    }



</style>