<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? "编辑文章" : "新建文章" }}</h4>
    <Uploader
      :uploaded="isEditModeUploadedData"
      action="/upload/"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
    >
      <template #ready>
        <h2>点击上传头图</h2>
      </template>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status"></div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #success="dataProps">
        <img :src="dataProps.uploadedData.data.url" />
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          :modelValue="titleVal"
          @update:model-value="titleVal = $event"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? "更新文章" : "发表文章" }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import Uploader from '../components/Uploader.vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
import { beforeUploadCheck } from '../helper'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup() {
    const isEditModeUploadedData = ref()
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const store = useStore<GlobalDataProps>()
    const titleVal = ref()
    const size = computed(() => store.state.postsSize)
    let imageId = ''

    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref()
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]

    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then(rawData => {
          const currentPost = rawData.data || rawData
          if (currentPost.image) {
            isEditModeUploadedData.value = { data: currentPost.image }
            console.log(isEditModeUploadedData.value)
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })

    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? { id: route.query.id, payload: newPost } : newPost
          store.dispatch(actionName, sendData).then((rawData) => {
            createMessage('发表成功, 2秒后跳转到文章页面', 'success', 2000)
            setTimeout(() => {
              store.dispatch('fetchPosts', { cid: rawData.data.column, size: size.value, createPost: true }).then((data) => {
                store.getters.getPotsTotalPage(Math.ceil(data.data.count / size.value))
              })
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }

    // const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
    //   createMessage(`上传图片ID: ${rawData.data._id}`, 'success')
    // }
    // const beforeUpload = (file: File) => {
    //   const isPNG = file.type === 'image/png'
    //   if (!isPNG) {
    //     createMessage('上传图片只能是 PNG 格式!', 'error')
    //   }
    //   return isPNG
    // }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error.length !== 0) {
        if (error.indexOf('format') > -1 && error.length === 1) {
          createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
        } else if (error.indexOf('size') > -1 && error.length === 1) {
          createMessage('上传图片大小不能超过 1MB', 'error')
        } else {
          createMessage('❎上传图片大小不能超过 1MB 并且 ❎上传图片只能是 JPG/PNG 格式!', 'error')
        }
      }
      return passed
    }
    return {
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      onFormSubmit,
      // beforeUpload,
      // onFileUploaded,
      uploadCheck,
      handleFileUploaded,
      isEditModeUploadedData,
      isEditMode
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
