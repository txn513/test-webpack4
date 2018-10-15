<template>
    <section>
        <!-- 列表展示 -->
        <el-table :data="activityList" stripe style="width: 100%">
            <el-table-column sortable prop="id" label="活动编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="activityName" label="活动名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="businessTypeCode" label="业务类型" :formatter="parseBusinessType"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip
                             :formatter="formatDate"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip
                             :formatter="formatDate"></el-table-column>
            <el-table-column prop="sinterCurrency" label="森特币数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="statusFlag" label="活动状态" :formatter="parseStatusFlag"
                             show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="250" class-name="small-padding fixed-width" align="left">
                <template slot-scope="scope">
                    <el-button @click="editDialog(scope.$index,scope.row)" type="primary" size="mini">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <span style="color: red; font-weight: bold">温馨提示:</span> 1、同一业务类型下配置的活动有多个生效时，按照森特币数量最少的活动赠送。2、赠送的森特币数量应该大于0小于100。
        </div>

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editDialogVisible" width="40%">
            <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动编号" prop="id">
                    <el-input disabled v-model="editForm.id" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="活动名称" prop="activityName">
                    <el-input disabled v-model="editForm.activityName" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessTypeCode">
                    <el-input disabled v-model="editForm.businessTypeCode" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="时间范围" prop="activityTime">
                    <el-date-picker
                           v-model="editForm.activityTime"
                           type="datetimerange"
                           range-separator="至"
                           start-placeholder="活动开始日期"
                           end-placeholder="活动结束日期">
                   </el-date-picker>
                </el-form-item>
                <el-form-item label="森特币数量" prop="sinterCurrency">
                    <template slot-scope="scope">
                        <el-input v-model="editForm.sinterCurrency" style="width:15%"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="活动状态" prop="statusFlag">
                    <el-select v-model="editForm.statusFlag" style="width:15%">
                        <el-option v-for="item in statusTypeConst" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')" v-loading="submitLoading">保存</el-button>
                <el-button @click="editDialogVisible=false">取消</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {queryActivities,modifyActivity} from '../../api/api';
    import moment from 'moment';
    import parseFun from './ParseTypeFun'

    export default {
        data() {
            // 森特币 validator 设置
            var validate = (rule, value, callback) => {
                if (value < 0 || value > 100) {
                    callback(new Error('森特币数量范围需大于0小于100'));
                } else {
                    callback();
                }
            };

            return {
                activityList: [],           // 表格数据--活动列表
                statusTypeConst,            // 活动状态类型下拉值
                editDialogVisible: false,   // 编辑详情窗口
                editForm: {
                    id: '',
                    activityName: '',
                    businessTypeCode: '',
                    activityTime: '',
                    sinterCurrency: 0,
                    statusFlag: 0
                },                 // 编辑会员详情的数据

                editRules: {                // 前端校验
                    sinterCurrency: [
                        {required: false, validator: validate, trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            // 查询活动列表
            queryActivityList() {
                queryActivities().then(
                    res => {
                        if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                            this.activityList = res.data;
                        }
                    }).catch(err => {
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
            },

            // 编辑弹出框
            editDialog(index, row){
                this.editDialogVisible = true;
                var businessTypeName = parseFun.getBusinessTypeName(row.businessTypeCode);
                this.editForm = {
                    id: row.id,
                    activityName: row.activityName,
                    businessTypeCode: businessTypeName,
                    activityTime: [new Date(row.startTime),new Date(row.endTime)],
                    sinterCurrency: row.sinterCurrency,
                    statusFlag: row.statusFlag
                }
            },

            // 点击更新活动信息
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.update();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            update(){
                // 创建时间
                let activityTime = this.editForm.activityTime;
                let startTime = activityTime[0];
                let endTime = activityTime[1];

                let param = {
                    activityId: this.editForm.id,
                    startTime: startTime,
                    endTime: endTime,
                    sinterCurrency: this.editForm.sinterCurrency,
                    statusFlag: this.editForm.statusFlag
                };
                modifyActivity(param).then(
                    res => {
                        this.submitLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                            this.$message({showClose: true, message: '编辑成功!', type: 'success'});
                            this.editDialogVisible = false;
                            this.queryActivityList();
                        } else {
                            this.$message({showClose: true, message: res.message, type: 'error'});
                        }
                    }).catch(err => {
                        this.submitLoading = false;
                        let errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
            },

            // 时间格式化:YYYY-MM-DD HH:mm:ss
            formatDate(row, column, cellValue) {
                if (cellValue === null || cellValue === undefined || cellValue === (-2209017600000)) {
                    return '';
                }
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },

            // 解析会员业务类型
            parseBusinessType(row, column, cellValue) {
                switch (cellValue) {
                    case 1:
                        return '森特尔洗护';
                        break;
                    case 2:
                        return '名品易手';
                        break;
                    case 4:
                        return '态奢';
                        break;
                    default:
                        return '未知业务类型';
                }
            },

            // 解析活动状态
            parseStatusFlag(row, column, cellValue) {
                switch (cellValue) {
                    case 0:
                        return '停用';
                        break;
                    case 1:
                        return '启用';
                        break;
                    default:
                        return '未知状态';
                }
            }
        },
        mounted() {
            this.queryActivityList();
        }
    }

    // 活动状态类型下拉选项
    const statusTypeConst = [
        { key: 0, value: '停用' },
        { key: 1, value: '启用' }
    ];

</script>
<style>
    #box {
        text-align: left;
    }

    #box span {
        font-weight: bold;
        width: 100px;
        text-align: right;
        display: inline-block;
        padding-right: 8px;
    }

    .incr {
        font-size: 18px;
        cursor: pointer;
        position: relative;
        bottom: 8px;
        right: -2px;
    }

    .decr {
        font-size: 18px;
        cursor: pointer;
        position: relative;
        right: 9px;
        top: 10px;

    }
</style>