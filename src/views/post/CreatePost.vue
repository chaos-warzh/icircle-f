<script setup lang="ts">
import { Back, UploadFilled } from "@element-plus/icons-vue"
import { UploadProps } from "element-plus"
import { computed, ref } from "vue"
import { createPost } from "../../api/post.ts"
import { uploadImage } from "../../api/tools.ts"
import { router } from '../../router'

const circleId = Number(router.currentRoute.value.params.circleId)
const name = ref('')
const content = ref()
const photoUrlList = ref<string[]>([])

const imageFileList = ref([])

const hasNameInput = computed(() => name.value != '')
const hasContent = computed(() => content.value != '')
const hasImageFile = computed(() => imageFileList.value.length != 0)
const createProductDisabled = computed(() => {
  return !(hasNameInput.value && hasContent.value && hasImageFile.value);
})

function handleCreateProduct() {
  const payload = {
    circleId: circleId,
    name: name.value,
    content: content.value,
    photoUrlList: photoUrlList.value
  }
  if (payload.photoUrlList.length < 1) {
    ElMessage({
      message: '至少上传1张图片!',
      type: 'error',
      center: true,
    })
    return
  }
  createPost(payload).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: '成功！',
        type: 'success',
        center: true,
      })
      name.value = ''
      content.value = ''
      photoUrlList.value = []
      imageFileList.value = []
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
    photoUrlList.value.push(res.data.result)
  });
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  const index = imageFileList.value.indexOf(file)
  let tempFileList = imageFileList.value
  let tempUrlList = photoUrlList.value
  imageFileList.value = []
  photoUrlList.value = []
  for (let i = 0; i < tempFileList.length; i++) {
    if (i != index) {
      imageFileList.value.push(tempFileList[i])
      photoUrlList.value.push(tempUrlList[i])
    }
  }
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function toBackPage() {
  router.push("/storeDetail/" + circleId)
}
</script>


<template>
  <el-main>
    <el-button @click="toBackPage()" type="primary" circle plain>
      <el-icon>
        <Back/>
      </el-icon>
    </el-button>

    <h1 class="create-product-title">新建帖子</h1>

    <el-form label-position="left" label-width="90px" size="large" class="create-product-form">

      <el-form-item label="标题">
        <el-input id="name" v-model="name"
                  required
                  placeholder="请输入标题"/>
      </el-form-item>

      <el-form-item label="正文">
        <el-input id="content" v-model="content"
                  required
                  placeholder="请输入内容"/>
      </el-form-item>

      <el-form-item label="图片">
        <el-upload
            v-model:file-list="imageFileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
            class="upload-demo"
            list-type="picture"
            :http-request="uploadHttpRequest"
            drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            将文件拖到此处或单击此处上传。
          </div>
        </el-upload>

      </el-form-item>

      <el-form-item>
        <el-button @click.prevent="handleCreateProduct()" :disabled="createProductDisabled"
                   type="primary" plain>
          创建帖子
        </el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>


<style scoped>
.create-product-title {
  margin-left: 25%;
}

.create-product-form {
  margin-left: 25%;
  width: 50%;
}
</style>
