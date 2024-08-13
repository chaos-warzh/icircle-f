<script setup lang="ts">
import { Back } from "@element-plus/icons-vue"
import { ref } from "vue"
import { getCircleActiveNum, getCircleById, getCommentCount as getCircleCommentCount } from "../../api/circle.ts"
import { getPostsByCircleId } from "../../api/post.ts"
import ProductItem from "../../components/ProductItem.vue"
import { router } from '../../router'

// 从当前router地址中获得circleId参数值
const circleId = router.currentRoute.value.params.circleId
const circleVO = ref()
const name = ref('')
const logoUrl = ref('')
const postList = ref()

const activeUserNum = ref(0)
const commentCount = ref(0) // 评论人数

getCircleById(Number(circleId)).then(res => {
  circleVO.value = res.data.result
  name.value = circleVO.value.name
  logoUrl.value = circleVO.value.logoUrl
})

getPostsByCircleId(Number(circleId)).then(res => {
  postList.value = res.data.result
})
getCircleActiveNum(Number(circleId)).then(res => {
  activeUserNum.value = res.data.result
})
getCircleCommentCount(Number(circleId)).then(res => {
  commentCount.value = res.data.result
})

function toCreateProductPage() {
  router.push("/createProduct/" + circleId)
}

function toProductDetailPage(postId: number) {
  router.push("/productDetail/" + postId)
}

function toBackPage() {
  router.push("/allStore")
}
</script>


<template>
  <el-container>
    <el-aside width="25%" class="page-aside">
      <div class="circle-detail-main">
        <el-button @click="toBackPage()"
                   type="primary" circle plain class="back-button">
          <el-icon>
            <Back/>
          </el-icon>
        </el-button>

        <el-image class="logo-image" :src="logoUrl"/>

        <span class="circle-title">{{ name }}</span>

        <span style="font-size: 10px">共{{ activeUserNum }}人活跃</span>
        <el-button class="create-product-button" type="primary" plain
                   @click="toCreateProductPage()" v-if="1=== 1">发帖
        </el-button>
      </div>
    </el-aside>

    <el-main>
      <div>
        <span class="post-list-title">帖子列表</span>
      </div>
      <div class="all-post-main">
        <ProductItem class="post-item-list"
                     v-for="postVO in postList" :postId="postVO.id"
                     @click="toProductDetailPage(postVO.id)"/>
      </div>
    </el-main>
  </el-container>

</template>


<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}

.back-button {
  margin-top: 20px;
  margin-bottom: 20px;
}

.circle-title {
  font-size: 30px;
  margin-bottom: 20px;
}

.circle-detail-main {
  width: 80%;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.logo-image {
  width: 100%;
}

.create-product-button {
  margin-top: 20px;
}

.post-list-title {
  font-size: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
}

.all-post-main {
  display: flex;
  flex-direction: row;
  padding: 20px;
  flex-flow: wrap;
  align-content: start;
  justify-content: start;
}
</style>
