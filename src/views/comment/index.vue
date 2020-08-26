<template>
    <div class="app-container">
         <el-form :inline="true" :model="form" class="form-inline">
            <el-form-item label="所属文章">
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="用户">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="form.page=1;getReplyList()">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="所属文章">
                <template slot-scope="scope">{{ scope.row.articleId && scope.row.articleId.title }}</template>
            </el-table-column>
            <el-table-column prop="content" label="用户">
                <template slot-scope="scope">{{ scope.row.from && scope.row.from.username }}</template>
            </el-table-column>
            <el-table-column prop="content" label="被回复者">
                <template slot-scope="scope">
                    {{ scope.row.to ? scope.row.to && scope.row.to.username : '_'}}
                </template>
            </el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                    <el-link type="primary" :href="'http://127.0.0.1:3000/article/' + (scope.row.articleId && scope.row.articleId._id) + '#' + scope.row._id" target="_blank">回复</el-link>
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
import { getReplyList, deleteReply } from "../../api/reply";
export default {
    data() {
        return {
            tableData: [],
            total: 0,
            form: {
                title: '',
                username: '',
                page: 1,
                page_size: 10,
            },
        };
    },
    created() {
        this.getReplyList();
    },
    methods: {
        handleCurrentChange(page) {
            this.form.page = page
            this.getReplyList()
        },
        handleDelete(id) {
            this.$confirm("确定要删除此条评论吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then((_) => {
                    this.deleteReply(id);
                })
                .catch((_) => {});
        },
        async getReplyList() {
            const { data } = await getReplyList(this.form);

            this.tableData = data.list;
            this.total = data.total
        },
        async deleteReply(id) {
            const { data } = await deleteReply({ id });

            this.getReplyList()
        },
    },
};
</script>

<style lang="scss" scoped>

</style>