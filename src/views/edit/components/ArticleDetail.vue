<template>
    <div class="createPost-container">
        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
            <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
                <el-button
                    v-loading="loading"
                    style="margin-left: 10px;"
                    type="success"
                    @click="submitForm"
                >发布</el-button>
                <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
            </sticky>

            <div class="createPost-main-container">
                <el-row>
                    <Warning />

                    <el-col :span="24">
                        <el-form-item style="margin-bottom: 40px;" prop="title">
                            <MDinput v-model="postForm.title" :maxlength="100" name="name">标题</MDinput>
                        </el-form-item>

                        <div class="postInfo-container">
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item
                                        label-width="90px"
                                        prop="reprint"
                                        label="是否转载:"
                                        class="postInfo-container-item"
                                    >
                                        <el-switch
                                            v-model="postForm.reprint"
                                            :active-value="2"
                                            :inactive-value="1"
                                        ></el-switch>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" v-if="postForm.reprint === 2">
                                    <el-form-item
                                        label-width="90px"
                                        prop="reprintUrl"
                                        label="转载链接:"
                                        class="postInfo-container-item"
                                    >
                                        <el-input
                                            v-model="postForm.reprintUrl"
                                            :rows="2"
                                            type="text"
                                            autosize
                                            placeholder="请输入"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item
                                        label-width="60px"
                                        prop="classify"
                                        label="分类:"
                                        class="postInfo-container-item"
                                    >
                                        <el-select v-model="postForm.classify" placeholder="请选择">
                                            <el-option
                                                :label="item.name"
                                                :value="item._id"
                                                v-for="item in classifyList"
                                                :key="item._id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6">
                                    <el-form-item
                                        label-width="120px"
                                        label="发布时间:"
                                        class="postInfo-container-item"
                                    >
                                        <el-date-picker
                                            v-model="postForm.createdAt"
                                            type="datetime"
                                            format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="请选择"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>

                <el-form-item
                    label="封面图:"
                    label-width="70px"
                    prop="imageUrl"
                    style="margin-bottom: 30px;"
                >
                    <Upload v-model="postForm.imageUrl" />
                </el-form-item>

                <el-form-item
                    style="margin-bottom: 40px;"
                    prop="outline"
                    label-width="70px"
                    label="概述:"
                >
                    <el-input
                        v-model="postForm.outline"
                        :rows="1"
                        type="textarea"
                        class="article-textarea"
                        autosize
                        placeholder="请输入"
                    />
                    <span
                        v-show="contentShortLength"
                        class="word-counter"
                    >{{ contentShortLength }}words</span>
                </el-form-item>

                <el-form-item prop="content" style="margin-bottom: 30px;">
                    <mavon-editor
                        v-model="postForm.content"
                        ref="md"
                        @imgAdd="$imgAdd"
                        @imgDel="$imgDel"
                    />
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import Upload from "@/components/Upload/SingleImage2";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import { addArticle, getArticleOne, amendArticleOne } from "@/api/article";
import Warning from "./Warning";
import Qiniu from "@/api/qiniu";
import { getAllClassify } from "@/api/classify";

const Q = new Qiniu();

const defaultForm = {
    issued: 1, //是否发布 1直接发布，0暂时不发布
    title: "", // 文章题目
    classify: "", //分类
    content: "", // 文章内容
    outline: "", // 文章摘要
    reprintUrl: "", // 文章外链
    reprint: 1, //是否转载 1原创 2转载
    imageUrl: "", // 文章图片
    createdAt: Date.now(),
};

export default {
    name: "ArticleDetail",
    props: {
        isEdit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const validateRequire = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(rule.field + "为必传项"));
            } else {
                callback();
            }
        };
        const validateSourceUri = (rule, value, callback) => {
            if (value) {
                if (validURL(value)) {
                    callback();
                } else {
                    callback(new Error("外链url填写不正确"));
                }
            } else {
                callback();
            }
        };
        return {
            postForm: Object.assign({}, defaultForm),
            loading: false,
            rules: {
                imageUrl: [{ validator: validateRequire }],
                title: [{ validator: validateRequire }],
                content: [{ validator: validateRequire }],
                outline: [{ validator: validateRequire }],
                classify: [{ validator: validateRequire }],
                reprint: [{ validator: validateRequire }],
                reprintUrl: [
                    {
                        required: true,
                        message: "请输入转载链接",
                        trigger: "blur",
                    },
                ]
            },
            classifyList: [],
        };
    },
    computed: {
        contentShortLength() {
            return this.postForm.outline.length;
        }
    },
    created() {
        if (this.isEdit) {
            const id = this.$route.query && this.$route.query.id;
            this.fetchData(id);
        }
        this.getAllClassify();
    },
    methods: {
        // 绑定@imgAdd event
        async $imgAdd(pos, $file) {
            try {
                const data = await Q.qiniuUpload($file, $file.name);
                this.$refs.md.$img2Url(pos, data.url);
            } catch (error) {
                throw error;
            }
        },
        //删除图片，并不是修改就会触发，仅支持工具栏操作
        $imgDel(pos, url) {
            console.log(pos);
            console.log(url);
        },
        // 获取全部分类下拉框
        async getAllClassify() {
            try {
                const { data } = await getAllClassify();

                this.classifyList = data;
            } catch (error) {
                throw error;
            }
        },
        /**
         * 文章详情回显
         */
        async fetchData(id) {
            const { data } = await getArticleOne({ id });

            this.postForm = data;
        },
        // 发布
        async submitForm() {
            this.$refs.postForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true;

                    try {
                        if (this.isEdit) {
                            await amendArticleOne(this.postForm) //修改
                        } else {
                            await addArticle(this.postForm) //新增
                        }
                    } catch (error) {
                        this.loading = false
                        throw error
                    }
                   

                    this.$router.push("/article/article-list");
                    this.$notify({
                        title: "成功",
                        message: "发布文章成功",
                        type: "success",
                        duration: 2000,
                    });

                    this.loading = false;
                } else {
                    this.$message({
                        message: "请填写必要的选项",
                        type: "warning",
                    })
                    return false;
                }
            });
        },
        // 草稿
        async draftForm() {
            if (
                this.postForm.content.length === 0 ||
                this.postForm.title.length === 0
            ) {
                this.$message({
                    message: "请填写必要的标题和内容",
                    type: "warning",
                });
                return;
            }

            this.postForm.issued = 0;
            await this.addArticle();
            this.$message({
                message: "保存成功",
                type: "success",
                showClose: true,
                duration: 1000,
            });
        },
    },
    components: {
        MDinput,
        Sticky,
        Upload,
        Warning,
    },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
    position: relative;

    .createPost-main-container {
        padding: 40px 45px 20px 50px;

        .postInfo-container {
            position: relative;
            @include clearfix;
            margin-bottom: 10px;

            .postInfo-container-item {
                float: left;
            }
        }
    }

    .word-counter {
        width: 40px;
        position: absolute;
        right: 10px;
        top: 0px;
    }
}

.article-textarea /deep/ {
    textarea {
        padding-right: 40px;
        resize: none;
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid #bfcbd9;
    }
}
</style>
