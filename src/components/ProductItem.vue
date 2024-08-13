<script setup lang="ts">
import { ref } from "vue";
import { getPostById } from "../api/post.ts";

// 使用props接收父界面传来的数据
const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
})

const storeId = ref(0)
const name = ref('')
const photoUrlList = ref([])
const stock = ref(0)
const category = ref()
const content = ref()
const photoUrl = ref('')

getPostById(props.postId).then(res => {
  storeId.value = res.data.result.storeId
  name.value = res.data.result.name
  photoUrlList.value = res.data.result.photoUrlList
  stock.value = res.data.result.stock
  category.value = res.data.result.category
  content.value = res.data.result.content

  photoUrl.value = photoUrlList.value[0]
})
</script>


<template>
  <el-card class="product-item-card" shadow="hover">
    <div style="padding: 1px">
      <h1> {{ name }} </h1>
      <el-descriptions :column="1">
        <el-descriptions-item style="font-size: 10px">
          {{ content }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="photo-div">
      <el-image class="photo-image" :src="photoUrl"/>
    </div>
  </el-card>
</template>


<style scoped>
.product-item-card {
  margin: 8px;
  border-radius: 8px;
  min-width: 31%;
}

.photo-div {
  display: flex;
  justify-content: center;
}

.photo-image {
  height: 200px;
}

</style>
