<script setup lang="ts">
import { ref } from "vue";
import { getCircleById } from "../api/circle.ts";

// 使用props接收父界面传来的数据
const props = defineProps({
  circleId: {
    type: Number,
    required: true
  }
})

const name = ref('')
const logoUrl = ref('')
const activeNum = ref('')

getCircleById(props.circleId).then(res => {
  name.value = res.data.result.name
  logoUrl.value = res.data.result.logoUrl
  activeNum.value = res.data.result.activeUserNum
})
</script>


<template>
  <el-card class="store-item-card" :body-style="{ padding: '0px' }" shadow="hover">
    <el-image class="logo-image" :src="logoUrl"/>

    <div style="padding: 14px">
      <h1> {{ name }} </h1>
      <el-descriptions :column="1">
        <el-descriptions-item style="font-size: 10px" label="活跃人数:">
          {{ activeNum }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>


<style scoped>
.store-item-card {
  margin: 20px;
  border-radius: 8px;
  min-width: 25%;
  max-width: 30px;
}

.logo-image {
  height: 250px;
  display: block;
}

</style>
