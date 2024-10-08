<script setup lang="ts">
import { UserFilled } from "@element-plus/icons-vue"
import { computed, ref } from 'vue'
import { userInfo, userInfoUpdate } from '../../api/user.ts'
import { router } from '../../router'
import { parseRole, parseTime } from "../../utils"

const role = sessionStorage.getItem("role")
const name = ref('')
const storeName = ref('')
const tel = ref('')
const address = ref('')
const regTime = ref()

const newName = ref('')

const displayInfoCard = ref(false)

const password = ref('')
const confirmPassword = ref('')

const newPhone = ref('')

const hasConfirmPasswordInput = computed(() => confirmPassword.value != '')
const isPasswordIdentical = computed(() => password.value == confirmPassword.value)
const changeDisabled = computed(() => {
  return !(hasConfirmPasswordInput.value && isPasswordIdentical.value)
})
// 电话号码的规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const telLegal = computed(() => chinaMobileRegex.test(newPhone.value))
// 电话号码是否为空
const hasTelInput = computed(() => newPhone.value != '')

getUserInfo()

function getUserInfo() {
  userInfo().then(res => {
    name.value = res.data.result.name
    tel.value = res.data.result.phone
    storeName.value = res.data.result.storeName
    address.value = res.data.result.address
    regTime.value = parseTime(res.data.result.createTime)
    newName.value = name.value
  })
}

function updateInfo() {
  userInfoUpdate({
    name: newName.value,
    password: undefined,
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        customClass: 'customMessage',
        type: 'success',
        message: '更新成功！',
      })
      getUserInfo()
    } else if (res.data.code === '400') {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
      })
    }
  })
}

function updatePassword() {
  userInfoUpdate({
    name: undefined,
    password: password.value,
  }).then(res => {
    if (res.data.code === '000') {
      password.value = ''
      confirmPassword.value = ''
      ElMessageBox.alert(
          `请重新登录`,
          '修改成功',
          {
            customClass: "customDialog",
            confirmButtonText: '跳转到登录',
            type: "success",
            showClose: false,
            roundButton: true,
            center: true
          }).then(() => router.push({path: "/login"}))
    } else if (res.data.code === '400') {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
      })
      password.value = ''
      confirmPassword.value = ''
    }
  })
}
</script>


<template>
  <el-main class="main-container">
    <el-card class="aside-card">
      <div class="avatar-area">
        <el-avatar :icon="UserFilled" :size="80">
        </el-avatar>
        <span class="avatar-text"> 欢迎您，{{ name }}</span>
      </div>

      <el-divider></el-divider>

      <el-descriptions
          :column="1"
          border
          title="个人信息"
      >
        <template #extra>
          <el-button type="primary"
                     @click="displayInfoCard = displayInfoCard === false;">
            <span v-if="displayInfoCard">修改密码</span>
            <span v-else>修改个人信息</span>
          </el-button>
        </template>

        <el-descriptions-item label="身份">
          <el-tag>{{ parseRole(role) }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="联系电话">
          {{ tel }}
        </el-descriptions-item>

        <el-descriptions-item label="地址" v-if="role === 'USER' || role === 'STAFF'">
          {{ address }}
        </el-descriptions-item>

        <el-descriptions-item label="注册时间">
          {{ regTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="displayInfoCard" class="change-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button @click="updateInfo">更新</el-button>
        </div>
      </template>

      <el-form>
        <el-form-item>
          <label for="name">昵称</label>
          <el-input type="text" id="name" v-model="newName"/>
        </el-form-item>

        <el-form-item>
          <label for="phone">手机号</label>
          <el-input id="phone" v-model="tel" disabled/>
        </el-form-item>

        <el-form-item>
          <label v-if="!hasTelInput" for="newPhone">
            新电话号码
          </label>
          <label v-else-if="!telLegal" for="newPhone" class="error-warn">
            电话号不合法
          </label>
          <label v-else for="newPhone">
            新电话号码
          </label>
          <el-input id="newPhone" v-model="newPhone" :class="{'error-warn-input' :(hasTelInput && !telLegal)}" placeholder="输入新电话号码"></el-input>
        </el-form-item>

      </el-form>
    </el-card>

    <el-card v-if="!displayInfoCard" class="change-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
          <el-button @click="updatePassword" :disabled="changeDisabled">
            修改
          </el-button>
        </div>
      </template>

      <el-form>
        <el-form-item>
          <label for="password">密码</label>
          <el-input type="password" id="password" v-model="password" placeholder="•••••••••" required/>
        </el-form-item>
        <el-form-item>
          <label v-if="!hasConfirmPasswordInput" for="confirm_password">确认密码</label>
          <label v-else-if="!isPasswordIdentical" for="confirm_password" class="error-warn">密码不一致</label>
          <label v-else for="confirm_password">确认密码</label>

          <el-input type="password" id="confirm_password" v-model="confirmPassword"
                    :class="{'error-warn-input' :(hasConfirmPasswordInput && !isPasswordIdentical)}"
                    placeholder="•••••••••" required/>
        </el-form-item>
      </el-form>

    </el-card>
  </el-main>
</template>



<style scoped>

.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}

.main-container {
  display: flex;
  flex-direction: row;
  padding: 15px;
  gap: 5px;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.change-card {
  width: 66%;
}

.avatar-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
}

.avatar-text {
  font-size: x-large;
  font-weight: bolder;
  padding-right: 40px;
}

</style>

