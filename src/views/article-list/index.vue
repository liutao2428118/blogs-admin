<template>
    <div class="app-container">
        <el-row>
            <el-col :span="24">
                <el-button type="primary" icon="el-icon-edit" @click="handleTo">发表文章</el-button>
            </el-col>
        </el-row>
        <el-form :inline="true" :model="form" class="form-inline">
            <el-form-item label="文章标题">
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="所属分类">
                <el-select v-model="form.classifyId" placeholder="请选择分类" :clearable="true">
                    <el-option v-for="item in classifyList" :label="item.name" :value="item._id"></el-option>
                </el-select>
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
            <el-table-column label="文章标题" align="center" :show-overflow-tooltip="true" width="240">
                <template slot-scope="scope">{{ scope.row.title }}</template>
            </el-table-column>
            <el-table-column label="所属分类" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.classify && scope.row.classify.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="概要" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">{{ scope.row.outline }}</template>
            </el-table-column>
            <el-table-column class-name="status-col" label="是否发布" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.issued"
                        :active-value="1"
                        :inactive-value="0"
                        @change="switchChange($event, scope.row._id)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否转载">
                <template slot-scope="scope">
                    <span>{{ scope.row.reprint | reprintFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="评论">
                <template slot-scope="scope">
                    <span>{{ scope.row.reply && scope.row.reply.length }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="阅读数">
                <template slot-scope="scope">
                    <span>{{ scope.row.pageview }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="点赞">
                <template slot-scope="scope">
                    <span>{{ scope.row.like }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createdAt | time }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="handleToEdit(scope.row._id)"
                    >编辑</el-button>
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
import moment from "moment";
import { getArticleList, setIsShowArticle } from "@/api/article";
import { getAllClassify } from "../../api/classify";
export default {
    data() {
        return {
            list: null,
            listLoading: true,
            total: 0,
            classifyList: [],
            form: {
                title: "",
                classifyId: "",
                page: 1,
                page_size: 10,
            },
        };
    },
    created() {
        this.fetchArticleList();
        this.getAllClassify();
    },
    filters: {
        reprintFilter(type) {
            switch (type) {
                case 1:
                    return "原创";
                case 2:
                    return "转载";
                default:
                    return "未知";
            }
        },
        time(date) {
            return moment(date).format("YYYY/MM/DD hh:mm:ss");
        }
    },
    methods: {
        async switchChange(status, id) {
            const res = await setIsShowArticle({
                id,
                issued: status,
            });
        },
        handleCurrentChange(page) {
            this.form.page = page;
            this.fetchArticleList();
        },
        handleTo() {
            this.$router.push({ path: "/article/create" });
        },
        handleToEdit(id) {
            this.$router.push({ path: `/article/edit?id=${id}` });
        },
        async getAllClassify() {
            const { data } = await getAllClassify();

            this.classifyList = data
        },
        async fetchArticleList() {
            this.listLoading = true;

            const { data } = await getArticleList(this.form);

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
