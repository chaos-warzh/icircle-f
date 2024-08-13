<script setup lang="ts">
import { Back, Star, StarFilled } from "@element-plus/icons-vue"
import { computed, onMounted, ref } from "vue"
import { checkLiked, commentPost, dislikeComment, likeComment } from "../../api/comment.ts"
import { getPostById, getPostComment} from "../../api/post.ts"
import { parseTime } from "../../utils"
import { router } from "../../router"
import { uploadImage } from "../../api/tools.ts"

const userId = Number(sessionStorage.getItem("userId"))
const postId = Number(router.currentRoute.value.params.postId)
const postVO = ref()
const circleId = ref(0)
const name = ref('')
const photoUrlListPost = ref<string[]>([])
const photoUrlList = ref<string[]>([])
const content = ref('')


const detailOrComment = ref(false) // 默认false为详情页, true为评论页
const comments = ref([])

const dialogVisible = ref(false)
const commentContent = ref('')
const userName = computed(() => {
  return sessionStorage.getItem('name') as string
})

const imageFileList = ref([])


const scoreNum = computed(() => comments.value.length)

onMounted(() => {
  getProductAll()
})

function getProductAll() {
  getProductDetail()
  getPostComment(postId).then(res => {
    comments.value = res.data.result
    initialLiked()
  })
}

function getProductDetail() {
  getPostById(postId).then(res => {
    postVO.value = res.data.result
    circleId.value = postVO.value.circleId
    name.value = postVO.value.name
    photoUrlListPost.value = postVO.value.photoUrlList
    content.value = postVO.value.content;
  })
}

// 点击点赞
function toggleLike(commentId: number) {
  likeComment(commentId, userId).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: '点赞成功！',
        type: 'success',
        center: true,
      })
      getProductAll()
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

// 取消点赞
function toggleCancelLike(commentId: number) {
  dislikeComment(commentId, userId).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: '取消点赞成功！',
        type: 'success',
        center: true,
      })
      getProductAll()
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function initialLiked() {
  comments.value.forEach(comment => {
    checkLiked(comment.id, userId).then(res => {
      if (res.data.code === '000') {
        comment.isLiked = res.data.result
      }
    })
  })
}

function formatTime(row, column) {
  return parseTime(row.time)
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleChange(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    photoUrlList.value.push(res.data.result)
  })
}

function evaluate() {
  const comment = {
    userName: userName.value,
    content: commentContent.value,
    photoUrlList: photoUrlList.value,
    postId: postId
  }
  if (comment.content === '') {
    ElMessage({
      message: '评价内容不能为空！',
      type: 'error',
      center: true,
    })
    return
  }
  commentPost(postId, comment).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: '评论成功！',
        type: 'success',
        center: true,
      })
      dialogVisible.value = false
    } else {
      ElMessage({
        message: '失败！',
        type: 'error',
        center: true,
      })
    }
  })
}


function toBackPage() {
  router.push("/storeDetail/" + circleId.value)
}

</script>


<template>
  <el-container>
    <el-aside width="25%" class="page-aside">
      <div class="product-detail-aside">
        <el-button @click="toBackPage()"
                   type="primary" circle plain class="back-button">
          <el-icon>
            <Back/>
          </el-icon>
        </el-button>

        <el-carousel trigger="click" arrow="always" indicator-position="outside">
          <el-carousel-item v-for="item in photoUrlListPost" :key="item">
            <el-image class="logo-image" :src="item"/>
          </el-carousel-item>
        </el-carousel>


        <el-descriptions :column="1">

        </el-descriptions>
        <div>
          <span>{{ scoreNum }}人评论</span>
        </div>
      </div>
    </el-aside>

    <el-main>
      <el-menu mode="horizontal">
        <el-menu-item index="1" @click="detailOrComment = false">帖子详情</el-menu-item>
        <el-menu-item index="2" @click="detailOrComment = true">评论</el-menu-item>
      </el-menu>
      <div v-if="!detailOrComment">
        <h1 class="product-title">{{ name }}</h1>
        <div style="color: darkgoldenrod;font-size: 20px;">
          {{ content }}

    </div>
    <div class="button-container">
      <el-button  @click="dialogVisible=true" type="primary" size="large" plain>
        发表评论
      </el-button>
    </div>
  <el-dialog title="评论" v-model="dialogVisible" width="60%">
    <el-input v-model="commentContent" placeholder="发一条友善的评论"/>
    <el-upload v-model:file-list="imageFileList" :on-change="handleChange" :on-remove="handleChange" class="upload-demo"
               list-type="picture" :http-request="uploadHttpRequest" drag>
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        将图片拖到此处或单击此处上传。
      </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取  消</el-button>
      <el-button type="primary" @click="evaluate">提交评论</el-button>
    </span>
  </el-dialog>
</div>

      <div v-if="detailOrComment">
        <el-table :data="comments" stripe heitht="250" style="width: 100%"
                  :default-sort="{prop:'time',order:'descending'}">
          <el-table-column prop="userName" label="用户名" width="150"></el-table-column>
          <el-table-column prop="content" label="评论内容" width="250"></el-table-column>
          <el-table-column fixed="right" prop="likeNum" label="点赞数" width="100" sortable></el-table-column>
          <el-table-column prop="time" label="评论时间" width="180" sortable :formatter="formatTime"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="{row}">
              <el-icon v-if="!row.isLiked" @click="toggleLike(row.id)"
                       style="font-size: xx-large">
                <Star></Star>
              </el-icon>
              <el-icon v-else @click="toggleCancelLike(row.id)" style="font-size: xx-large">
                <StarFilled></StarFilled>
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column label="Photo" width="180">
            <template #default="row">
              <div style="display:flex;align-items: center;justify-content: center; height: 100px">
                <el-carousel indicator-position="outside" style="width: 100px; height: 80px;">
                  <el-carousel-item v-for="item in row.row.photoUrlList" :key="item">
                    <el-image style="width: 80px; height: 80px" :src="item"/>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<style>
.button-container {
  text-align: center;
  margin-top: 20px;
  width: 10px
}
</style>

<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}

.back-button {
  margin-top: 20px;
  margin-bottom: 20px;
}

.product-title {
  font-size: 30px;
  margin-bottom: 20px;
}

.product-detail-aside {
  width: 80%;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.logo-image {
  width: 100%;
}

.add-stock-number-input {
  width: 300px;
  margin-bottom: 20px;
}

.add-stock-button {
  margin-bottom: 40px;
}

.main-title {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 30px;
}

.add-stock-main {
  margin-top: 10px;
  margin-left: 20px;
}

.create-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.buy-buttons {
  margin-top: 20px;
  display: flex;
  font-weight: bolder;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.fixed-button {
  position: fixed;
  right: 320px;
  bottom: 320px;
  z-index: 999;
}
</style>
