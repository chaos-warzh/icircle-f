<script setup lang="ts">
import { Back, UploadFilled } from "@element-plus/icons-vue"
import { UploadProps } from "element-plus"
import { computed, ref } from 'vue'
import { createCircle } from "../../api/circle.ts"
import { uploadImage } from "../../api/tools.ts"
import { router } from '../../router'

// 输入框值（需要前端阻拦不合法输入）
const name = ref('')
const imageFileList = ref([])
const logoUrl = ref('')

const hasNameInput = computed(() => name.value != '')
const hasImageFile = computed(() => logoUrl.value != '')
const createDisabled = computed(() => {
  return !(hasNameInput.value && hasImageFile.value)
})

// 创建circle按钮触发
function handleCreateCircle() {
  const payload = {
    name: name.value,
    logoUrl: logoUrl.value
  };
  createCircle(payload).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: '添加圈子成功！',
        type: 'success',
        center: true,
      })
      name.value = ''
      logoUrl.value = ''
      imageFileList.value.splice(0)
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function handleChange(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    logoUrl.value = res.data.result
  })
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  imageFileList.value = []
  logoUrl.value = ''
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 1 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function toBackPage() {
  router.push("/allStore")
}
</script>


<template>
  <el-main>
    <el-button @click="toBackPage()" type="primary" circle plain>
      <el-icon>
        <Back/>
      </el-icon>
    </el-button>

    <h1 class="create-store-title">新建兴趣圈</h1>

    <el-form label-position="left" label-width="90px" size="large" class="create-store-form">

      <el-form-item label="圈子名">
        <el-input id="name" v-model="name" required placeholder="请输入圈子名"/>
      </el-form-item>

      <el-form-item label="圈子Logo">
        <el-upload
            v-model:file-list="imageFileList"
            :limit="1"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            class="upload-demo"
            list-type="picture"
            :http-request="uploadHttpRequest"
            drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            将文件拖到此处或单击此处上传。仅允许上传一份文件。
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button @click.prevent="handleCreateCircle()" :disabled="createDisabled"
                   type="primary" plain>
          创建圈子
        </el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>


<style scoped>
.create-store-title {
  margin-left: 25%;
}

.create-store-form {
  margin-left: 25%;
  width: 50%;
}
</style>
