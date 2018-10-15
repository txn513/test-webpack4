<template>
    <section>

        <div v-loading="listLoading">


            <!--table-->
            <el-table
                    :data="orderList"
                    style="width: 100%;margin-top: 60px;">
                <el-table-column
                        prop="id"
                        label="ID">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名">
                </el-table-column>
                <el-table-column
                        prop="suggestion"
                        label="留言内容">
                </el-table-column>
                <el-table-column
                        prop="picUrls"
                        label="图片">
                    <template slot-scope="scope">
                        <div v-if="scope.row.picUrls">
                        <img v-for="item in scope.row.picUrls.split(',')" :src="getImgUrl(item)"
                                                          style="width: 50px;height: 50px;margin-left: 10px" >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        :formatter="dateFormat"
                        label="留言时间">
                </el-table-column>

                <el-table-column
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" size="mini" type="primary">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页-->
        <div class="block" style="text-align:right;">

            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float: right;margin-top: 10px">
            </el-pagination>

        </div>
    </section>
</template>

<script>
    import {getFeedBackList, deleteFeedBackFun} from '../../api/api';
    import util from '../../common/js/util';
    export default {
        data() {
            return {
                listLoading: false,
                pageSize: this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                totalPage: 0,
                page: 1,
                total:0,
                pageNum: 1, //当前页码
                orderList: [],//表格数据
                id: "",
                userName: "",
                suggestion: "",
                picUrls: "",
                createTime: "",
            };
        },
        methods: {

            //分页显示所有反馈数据列表
            getFeedBackListFun() {
                var para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getFeedBackList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.total = data.data.paginationInfo.total;
                            this.orderList = data.data.list;
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },
            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },


            // 图片拼接
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);

            },
            //分页查询
            handleCurrentChange(page) {
                this.pageNum = page;
                 this.getFeedBackListFun();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                 this.getFeedBackListFun();
            },

            //删除函数
            handleClick(row) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para = {id: row.id};
                    deleteFeedBackFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getFeedBackListFun();
                        } else {
                            alert("删除失败");
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除已取消!'
                    });
                });
            },
        },
        mounted() {
            this.getFeedBackListFun();
        }
    }

</script>

