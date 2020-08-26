<template>
    <div class="app-container">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户">
                <template slot-scope="scope">{{ scope.row.authorId && scope.row.authorId.username }}</template>
            </el-table-column>
            <el-table-column prop="content" label="留言内容">
                <template slot-scope="scope">{{ scope.row.content}}</template>
            </el-table-column>
            <el-table-column prop="content" label="时间">
                <template slot-scope="scope">{{ scope.row.createdAt | time}}</template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        :href="'http://127.0.0.1:3000/about/' + form.page + '#' + scope.row._id"
                        target="_blank"
                    >回复</el-link>
                    <el-button type="text" @click="handleDelete(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @current-change="handleCurrentChange"
            :page-size="form.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
            style="margin-top: 60px;"
        ></el-pagination>
    </div>
</template>

<script>
import { getLeaveList, deleteLeave } from "../../api/leave";
import moment from "moment";
export default {
    data() {
        return {
            tableData: [],
            total: 0,
            form: {
                page: 1,
                page_size: 10,
            },
        };
    },
    created() {
        this.getLeaveList();
    },
    filters: {
        time(date) {
            return moment(date).format("YYYY/MM/DD hh:mm:ss");
        },
    },
    methods: {
        async getLeaveList() {
            const { data } = await getLeaveList(this.form);

            this.tableData = data.list;
            this.total = data.total;
        },
        handleDelete(id) {
            this.$confirm("确定要删除此条留言吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async (_) => {
                    await deleteLeave({ id });
                    this.getLeaveList();
                })
                .catch((_) => {});
        },
        handleCurrentChange(page) {
            this.form.page = page;
            this.getLeaveList();
        },
    },
};
</script>

<style scoped>
.line {
    text-align: center;
}
</style>

