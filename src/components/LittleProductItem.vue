<script setup lang="ts">
import {router} from "../router";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

function toProductDetail(postId: number) {
  router.push("/productDetail/" + postId)
}

</script>

<template>
  <el-card shadow="hover">
    <div style="padding: 14px">
      <el-descriptions :column="1">
        <el-descriptions-item style="font-size: 10px">
          <div style="color: blue;text-decoration: underline;font-size: 20px"
               @click="toProductDetail(props.product.id)">
            {{ props.product.name }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <el-carousel trigger="click" arrow="always" indicator-position="outside">
        <el-carousel-item v-for="item in props.product.photoUrlList" :key="item">
          <el-image class="logo-image" :src="item"/>
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-card>
</template>

<style scoped>

</style>