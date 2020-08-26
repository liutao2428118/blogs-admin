<template>
    <div class="upload-container">
        <el-upload
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeUpload"
            class="image-uploader"
            drag
            action="https://httpbin.org/post"
        >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
        </el-upload>
        <div class="image-preview">
            <div v-show="imageUrl.length>1" class="image-preview-wrapper">
                <img :src="imageUrl" />
                <div class="image-preview-action">
                    <i class="el-icon-delete" @click="rmImage" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { getToken } from '@/api/qiniu'
import Qiniu from "@/api/qiniu";

const Q = new Qiniu();

export default {
    name: "SingleImageUpload",
    props: {
        value: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            tempUrl: ""
        };
    },
    computed: {
        imageUrl() {
            return this.value;
        }
    },
    methods: {
        rmImage() {
            this.emitInput("");
        },
        emitInput(val) {
            this.$emit("input", val);
        },
        async beforeUpload(file) {
            try {
                const data = await Q.qiniuUpload(file, file.name);
                this.emitInput(data.url);
            } catch (error) {
                console.log(error)
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
    width: 100%;
    position: relative;
    @include clearfix;
    .image-uploader {
        width: 50%;
        float: left;
    }
    .image-preview {
        width: 420px;
        height: 200px;
        position: relative;
        border: 1px dashed #d9d9d9;
        float: left;
        margin-left: 50px;
        .image-preview-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .image-preview-action {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
            cursor: pointer;
            text-align: center;
            line-height: 200px;
            .el-icon-delete {
                font-size: 36px;
            }
        }
        &:hover {
            .image-preview-action {
                opacity: 1;
            }
        }
    }
}
</style>
