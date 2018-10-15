<template>
    <section>
        <!--列表-->
        <el-table :data="list"  highlight-current-row  v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="code" label="业务编码" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="业务类型" sortable show-overflow-tooltip></el-table-column>
        <!-- 暂时不用编辑    <el-table-column label="操作" sortable >
                <template slot-scope="scope">
                     <el-button  type="primary" @click="edit(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>   -->
        </el-table>
    </section>
</template>

<script>
    import {getBusinessList,editBusiness} from '../../api/api';

    export default {
        data() {
            return {
                listLoading: false,
                list:[]
            }
        },
        methods: {
            //获取数据列表
            getList() {
                this.listLoading = true;
                getBusinessList().then((res) => {
                    this.listLoading = false;
                    this.list = res.data;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },edit(id){
                this.$prompt('备注', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(({value}) => {
                    let para = {
                        "id": id,
                        "name": value
                    };
                    editBusiness(para).then((res) => {
                        if (res.code == 1) {
                            this.listLoading = false;
                            this.$message({message: '修改成功', type: 'success'});
                            this.getList();
                        } else {
                            this.$message({message: res.message, type: 'warning'});
                        }
                    }, (res) => { }).catch(() => { });
                }).catch(() => {});
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>