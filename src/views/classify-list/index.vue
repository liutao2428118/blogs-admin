<template>
    <div class="app-container">
        <el-row>
            <el-col :span="24">
                <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="dialogVisible = !dialogVisible"
                >添加分类</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="_id" label="ID" width="300"></el-table-column>
            <el-table-column prop="name" label="分类名称" width="300"></el-table-column>
            <el-table-column prop="genre" label="类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.genre | typeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="handleEdit(scope.row)"
                    >编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="添加/编辑分类"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="genre">
                    <el-select v-model="form.genre" placeholder="请选择类型" style="width: 100%">
                        <el-option label="技术" :value="1"></el-option>
                        <el-option label="生活" :value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit('ruleForm')">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { addClassify, getAllClassify, alterClassify } from "../../api/classify";

const formDefault = {
    name: "",
    genre: "",
};
export default {
    data() {
        return {
            dialogVisible: false,
            form: Object.assign({}, formDefault),
            tableData: [],
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入分类名称",
                        trigger: "blur",
                    },
                ],
                genre: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getAllClassify();
    },
    filters: {
        typeFilter(type) {
            switch (type) {
                case 1:
                    return "技术";
                case 2:
                    return "生活";
                default:
                    return "未知";
            }
        },
    },
    methods: {
        handleClose(done) {
            done();
        },
        handleEdit(row) {
            this.dialogVisible = !this.dialogVisible;

            this.form = row;
        },
        submit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if (this.form._id) {
                        await this.alterClassify();

                        this.form = Object.assign({}, formDefault);
                    } else {
                        await this.addClassify();
                    }

                    this.dialogVisible = !this.dialogVisible;

                    this.getAllClassify();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        async addClassify() {
            await addClassify(this.form)
        },
        async getAllClassify() {
            const { data } = await getAllClassify();

            this.tableData = data;
        },
        async alterClassify() {
            await alterClassify(this.form);
        },
    },
};
</script>
