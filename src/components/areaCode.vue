<template>
    <el-form :inline="true">
        <el-form-item>
            <el-select
                    v-model="province.value"
                    placeholder="请选择省"
                    @change="initProvince"
                    style="width:175px">
                <el-option
                        v-for="item in province.options"
                        :key="item.code"
                        :label="item.regionNameC"
                        :value="item.code" >
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-select
                    v-model="city.value"
                    placeholder="请选择市"
                    @change="initCity"
                    :disabled="isCity"
                    style="width:175px">
                <el-option
                        v-for="item in city.options"
                        :key="item.code"
                        :label="item.regionNameC"
                        :value="item.code"
                >
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-select
                    v-model="area.value"
                    placeholder="请选择区县"
                    @change = "getResult"
                    :disabled="isArea"
                    style="width:175px">
                <el-option
                        v-for="item in area.options"
                        :key="item.code"
                        :label="item.regionNameC"
                        :value="item.code">
                </el-option>
            </el-select>
        </el-form-item>


    </el-form>
</template>
<script>
    import {getRegion,getListCodeByRegionName} from '@/api/api';
    export default {
        props:{
            shopData:{
                type: Array,
            },
            address :{String}
        },
        data () {
            return {
                province:{options: [{}],value:''},
                city:{options: [{}],value:''},
                area:{options: [{}],value:''},
                isCity:true,
                isArea:true
            }
        },
        //监听传过来的数据变化，以动态更新显示的值
        watch: {
            // shopData: {
            //     handler(newValue, oldValue) {
            //         this.initProvince();
            //     },
            //     deep: true,
            //     immediate: true
            // },
            // address: {
            //     handler(newValue, oldValue) {
            //         console.log(" handler(newValue, oldValue)"+this.address,newValue,oldValue);
            //         if(this.address){
            //             getListCodeByRegionName({regionNameC:this.address}).then((res) => {
            //                 console.log(res);
            //                 if (res.code==1) {
            //                     // this.shopData = res.data;
            //                     this.shopData[0] = res.data[0];
            //                     this.shopData[1] = res.data[1];
            //                     this.shopData[2] = res.data[2];
            //                 }
            //                 this.initProvince();
            //             }, (res) => { this.listLoading = false; } ).catch(() => {});
            //         }
            //     },
            //     deep: true,
            //     immediate: true
            // },
        },
        methods: {

            //根code获取名字
            getNameByCode(code,data){
                for(let i = 0;i<data.length;i++){
                    if(data[i].code==code){
                        return data[i].regionNameC;
                    }
                }
            },
            initProvince(e){
                this.shopData[0] = e;
                getRegion({upperRegion:0}).then((res) => {
                    this.province.options = res.data;
                    //根据code获取其名字
                    if(this.shopData.length==3 && this.shopData[0]){
                        this.province.value = this.getNameByCode(this.shopData[0],res.data);
                        this.initCity();
                        this.getProvince();
                    }
                }, (res) => { this.listLoading = false;} ).catch(() => {});

            },
            initCity(e){
                this.shopData[1] = e;
                let param;
                //根据是否为数字来判断是否修改了当前值
                if(!Number(this.province.value)){
                    param = this.shopData[0];
                }else{
                    param = this.province.value;
                }
                //父组件 选择改变
                this.$emit("onAreaChange");
                getRegion({upperRegion:param}).then((res) => {
                    // console.log(res.data)
                    this.city.options = res.data;
                    this.isCity = false;
                    this.city.value = "";
                    this.area.value = "";
                    if(!Number(this.province.value) && this.shopData[1]){
                        this.city.value =this.getNameByCode(this.shopData[1],res.data);
                        this.initArea();
                        this.getCity();
                    }
                }, (res) => { this.listLoading = false;} ).catch(() => {});
            },
            initArea(e){
                this.shopData[2] = e;
                let param;
                //根据是否为数字来判断是否修改了当前值
                let isLoaded = true;
                if(!Number(this.city.value)){
                    param = this.shopData[1];
                }else{
                    param = this.city.value
                    isLoaded =false;
                }
                getRegion({upperRegion:param}).then((res) => {
                    this.area.options = res.data;
                    this.isArea = false;
                    this.area.value = "";
                    if(!Number(this.city.value) && this.shopData[2] ){
                        this.area.value = this.getNameByCode(this.shopData[2],res.data);
                        this.getResult(); //回显使用
                    }
                    // if(isLoaded) {
                    //
                    // }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            getProvince(){
                //触发子组件的方法
                let province,provinceCode;
                if(!Number(this.province.value)){
                    province = this.province.value;
                    provinceCode = this.shopData[0];
                }else{
                    province = this.getNameByCode(this.province.value,this.province.options);
                    provinceCode = this.province.value;
                }

                this.$emit("getProvince",provinceCode+' '+province);
            },
            getCity(){
                //触发子组件的方法
                let province,city,provinceCode,cityCode;
                if(!Number(this.province.value)){
                    province = this.province.value;
                    provinceCode = this.shopData[0];
                }else{
                    province = this.getNameByCode(this.province.value,this.province.options);
                    provinceCode = this.province.value;
                }
                if(!Number(this.city.value)){
                    city = this.city.value;
                    cityCode = this.shopData[1];
                }else{
                    city = this.getNameByCode(this.city.value,this.city.options);
                    cityCode = this.city.value;
                }
                this.$emit("getCity",provinceCode+' '+cityCode+' '+province+' '+city);
            },
            getResult(){
                //触发子组件的方法
                let province,city,area,provinceCode,cityCode,areaCode;
                if(!Number(this.province.value)){
                    province = this.province.value;
                    provinceCode = this.shopData[0];
                }else{
                    province = this.getNameByCode(this.province.value,this.province.options);
                    provinceCode = this.province.value;
                }
                if(!Number(this.city.value)){
                    city = this.city.value;
                    cityCode = this.shopData[1];
                }else{
                    city = this.getNameByCode(this.city.value,this.city.options);
                    cityCode = this.city.value;
                }

                if(!Number(this.area.value)){
                    area = this.area.value;
                    areaCode = this.shopData[2];
                }else{
                    area = this.getNameByCode(this.area.value,this.area.options);
                    areaCode = this.area.value;
                }
                this.$emit("getresult",provinceCode+' '+cityCode+' '+areaCode+' '+province+' '+city+' '+area);
            },

            resetForm(){
                this.province.value = "";
                this.city.value = "";
                this.area.value = "";
            }
        },
        mounted() {
            //加载省数据
            // console.log("mounted",this.address);
             console.log("mounted",this.shopData);
            // if(!this.address){
            //
            // }
            this.initProvince();

        }

    }
</script>
<style scoped>





</style>