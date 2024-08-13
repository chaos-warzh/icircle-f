<script setup lang="ts">
import { Search } from "@element-plus/icons-vue"
import { onMounted, reactive, ref } from "vue"
import { getAllCircle } from "../../api/circle.ts"
import LittleProductItem from "../../components/LittleProductItem.vue"
import StoreItem from "../../components/StoreItem.vue"
import { router } from '../../router'
import { getSearchedPosts } from "../../api/post.ts"


const circleList = ref()

const productName = ref('')
const searchForm = reactive({
  productName: '',
})
const drawer = ref(false)

const searchResult = ref([])

onMounted(() => {
  // 获取circle列表
  getAllCircle().then(res => {
    circleList.value = res.data.result
  })
})

// 点击按钮，跳转到create界面
function toCreateCirclePage() {
  router.push("/CreateCircle")
}

// 点击商店卡片，跳转到对应的商店界面
function toStoreDetailPage(circleId: Number) {
  router.push("/storeDetail/" + circleId)
}

function handleSearch() {
  if (searchForm.productName === '') {
    ElMessage.error('请输入商品名')
  }
  getSearchedPosts(searchForm.productName).then(res => {
    searchResult.value = res.data.result
  })

}

function openSearch() {
  if (productName.value === '') {
    ElMessage.error('请输入商品名')
  } else {
    getSearchedPosts(productName.value).then(res => {
      searchResult.value = res.data.result
      drawer.value = true
    })
  }
}

</script>


<template>
  <el-container>
    <el-main>
      <div v-if="1 === 1">
        <el-button class="add-store-button" type="primary" plain
                   @click="toCreateCirclePage()">
          创建圈子
        </el-button>
      </div>
      <div class="center-pattern">
        <div>
          <el-input
              v-model="productName"
              style="width: 340px;"
              size="large"
              placeholder="Please Input"
              :prefix-icon="Search"
          />
          <el-button size="large" type="primary" plain @click="openSearch">
            搜索帖子
          </el-button>
          <el-button size="large" type="primary" plain @click="drawer=true">
            筛选帖子
          </el-button>
        </div>
      </div>

      <div class="store-item-list">
        <StoreItem v-for="circleVO in circleList" :circleId="circleVO.id" @click="toStoreDetailPage(circleVO.id)"/>
      </div>
    </el-main>
    <el-drawer
        v-model="drawer"
        title="搜索帖子"
    >
      <template #header>
        <el-icon>
          <Search/>
          搜索帖子
        </el-icon>
      </template>
      <el-form :model="searchForm" @submit.native.prevent>
        <el-form-item style="width: 300px" label="帖子标题"
                      :rules="[
            {required: true, message: '请输入标题名'}
        ]">
          <el-input v-model="searchForm.productName" placeholder="搜索帖子"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <LittleProductItem v-for="product in searchResult" :product="product"/>
    </el-drawer>
  </el-container>
</template>


<style scoped>
.add-store-button {
  margin-left: 30px;
}

.store-item-list {
  display: flex;
  padding: 2px;
  flex-flow: wrap;
  justify-content: center;
  align-content: start;
}

.side-border {
  border-left: 2px solid deepskyblue;
  border-right: 2px solid deepskyblue;
  border-bottom: 2px solid deepskyblue;
  border-top: 2px solid deepskyblue;
  border-radius: 10px;
  width: 25%;
}

.top-style {
  margin-top: 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-descriptions-item {
  display: flex;
  align-items: center;
}

.medal-icon {
  font-size: 28px;
}

.store-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.center-pattern {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
