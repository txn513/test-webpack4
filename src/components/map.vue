<template>
    <div id="allmap" :loading="loadingMap" :center="center"></div>
</template>
<script>
import BMap from "BMap";
export default {
  data() {
    return {
      loadingMap: true,
      map: null
    };
  },
  props: {
    center: {
      longitude: 0,
      latitude: 0
    },
    fullName: String
  },
  watch: {
    fullName: function(newFullName, oldFullName) {
      this.reload(newFullName);
    }
  },
  methods: {
    initMap() {
      this.loadingMap = true;
      var fullName = this.fullName == "" ? "深圳市" : this.fullName;
      this.dialogVisible = true;
      const map = new BMap.Map("allmap");
      this.map = map;
      var point;
      if (this.center.longitude > 0 && this.center.latitude > 0) {
        point = new BMap.Point(this.center.longitude, this.center.latitude);
        map.centerAndZoom(point, 15);
      } else {
        map.centerAndZoom(fullName, 12);
      }

      map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
      this.loadingMap = false;
      //单击获取点击的经纬度
      var _this = this;
      map.addEventListener("click", e => {
        this.$emit("sinterMapClick", e);
      });
      if (point != null) {
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      }

      //控制地图高度
      document.getElementById("allmap").style.height = document.documentElement.clientHeight - 210 + "px";
    },
    reload(fullName) {
      this.map.centerAndZoom(fullName, 12);
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>
<style>
#allmap {
  width: 100%;
  height: 500px !important;
  overflow: hidden;
}
</style>


