<template>
    <div class="app-container">
        <el-form :inline="true" :model="form" class="form-inline">
            <el-form-item label="用户名">
                <el-input v-model="form.username" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="form.page=1;fetchArticleList()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            style="margin-top: 20px;"
        >
            <el-table-column align="center" label="ID" width="240">
                <template slot-scope="scope">{{ scope.row._id }}</template>
            </el-table-column>
            <el-table-column label="用户名" align="center" :show-overflow-tooltip="true" width="240">
                <template slot-scope="scope">{{ scope.row.username }}</template>
            </el-table-column>
            <el-table-column label="邮箱" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.email}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最新登录时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updatedAt | time }}</span>
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
import moment from "moment"
import { getUserList } from "@/api/user"
export default {
    data() {
        return {
            list: null,
            listLoading: true,
            total: 0,
            form: {
                username: "",
                page: 1,
                page_size: 10,
            },
        };
    },
    created() {
        this.fetchUserList()
    },
    filters: {
        time(date) {
            return moment(date).format("YYYY/MM/DD hh:mm:ss");
        }
    },
    methods: {
        handleCurrentChange(page) {
            this.form.page = page;
            this.fetchUserList();
        },
        async fetchUserList() {
            this.listLoading = true;

            const { data } = await getUserList(this.form);

            this.list = data.list;

            this.total = data.total;

            this.listLoading = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.form-inline {
    margin-top: 20px;
}
</style>
