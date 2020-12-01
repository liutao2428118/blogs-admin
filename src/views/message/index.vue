<template>
    <div class="app-container">
        <el-row :gutter="12">
            <el-col :span="6">
                <el-card shadow="hover" class="box-card">
                    <div class="num">{{replyList.length}}</div>
                    <div class="title">新评论</div>
                    <svg-icon icon-class="form" class="ico" />
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="box-card">
                    <div class="num">6</div>
                    <div class="title">新留言</div>
                    <svg-icon icon-class="message" class="ico" />
                </el-card>
            </el-col>
            <!-- <el-col :span="6">
                <el-card shadow="hover" class="box-card">
                    <div class="num">2</div>
                    <div class="title">新点赞</div>
                    <i class="el-icon-star-off ico" />
                </el-card>
            </el-col> -->
            <el-col :span="6">
                <el-card shadow="hover" class="box-card">
                    <div class="num">2</div>
                    <div class="title">新文章浏览</div>
                    <svg-icon icon-class="eye-open" class="ico" />
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 40px">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>新评论一览</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="setReplyRead"
                        >全部设为已读</el-button>
                    </div>
                    <el-link
                        v-for="(reply) in replyList"
                        :key="reply._id"
                        class="item"
                        type="info"
                        :href="'/article/' + reply.articleId._id + '#' +reply._id"
                        target="_blank"
                    >{{`${reply.from.username}在`}}{{reply.createdAt | time}}{{`评论了你的文章-${reply.articleId.title}`}}</el-link>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>新留言一览</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="setLeaveRead">全部设为已读</el-button>
                    </div>
                    <div v-for="item in LeaveData" :key="item._id" class="item">{{item.authorId.username}}在{{item.createdAt | time}}留言了</div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 40px">
            <!-- <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>新点赞一览</span>
                        <el-button style="float: right; padding: 3px 0" type="text">全部设为已读</el-button>
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div>
                </el-card>
            </el-col> -->

            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>新文章浏览一览</span>
                        <el-button style="float: right; padding: 3px 0" type="text">全部设为已读</el-button>
                    </div>
                    <div
                        v-for="item in browseArticleList"
                        :key="item._id"
                        class="item"
                    >{{item.browseAt | time}} <span class="article-title">{{item.title}}</span> 被浏览了</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import moment from "moment";
import { getNewReply, setReplyRead } from "../../api/reply";
import { getBrowseList } from "../../api/article";
import { getIsReadLeaveAll, setLeaveRead } from "../../api/leave"
export default {
    props: {},
    data() {
        return {
            replyList: [],
            browseArticleList: [],
            LeaveData: []
        };
    },
    computed: {},
    filters: {
        time(date) {
            return moment(date).format("YYYY/MM/DD hh:mm:ss");
        },
    },
    created() {
        this.getNewReply();
        this.getBrowseList();
        this.getIsReadLeaveAll()
    },
    mounted() {},
    watch: {},
    methods: {
        async getNewReply() {
            const { data } = await getNewReply();

            this.replyList = data;
        },
        async setReplyRead() {
            const replyIds = this.replyList.map((item) => item._id);

            const { data } = await setReplyRead({ replyIds });

            this.getNewReply();
        },
        async getBrowseList() {
            const { data } = await getBrowseList();
            this.browseArticleList = data;
        },
        async getIsReadLeaveAll() {
            const { data } = await getIsReadLeaveAll()

            this.LeaveData = data
        },
        async setLeaveRead() {
            const leaveIds = this.LeaveData.map((item) => item._id);
            await setLeaveRead({leaveIds})
            this.getIsReadLeaveAll()
        }
    },
    components: {},
};
</script>

<style scoped lang="scss">
.box-card {
    position: relative;
}
.num {
    color: #409eff;
    font-size: 30px;
    margin-bottom: 10px;
}
.title {
    color: #409eff;
    font-size: 20px;
}
.ico {
    color: #409eff;
    position: absolute;
    top: 20px;
    right: 40px;
    font-size: 30px;
}

.item {
    display: inline-block;
    width: 100%;
    margin-bottom: 4px;
    padding: 6px;
    font-size: 14px;
    color: #444;
}

.article-title {
    color: #67c23a;
}

.clearfix {
    span {
        color: #67c23a;
    }
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}

.box-card {
    // width: 480px;
}
</style>
