<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <Uploader
      action="/upload/"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      :beforeUpload="beforeUpload"
      @file-uploaded="onFileUploaded"
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
          v-model="titleVal"
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
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import Uploader from '../components/Uploader.vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup() {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleVal = ref()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref()
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column
          }
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    const beforeUpload = (file: File) => {
      const isPNG = file.type === 'image/png'
      if (!isPNG) {
        createMessage('上传图片只能是 PNG 格式!', 'error')
      }
      return isPNG
    }

    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessage(`上传图片ID: ${rawData.data._id}`, 'success')
    }

    return {
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      onFormSubmit,
      beforeUpload,
      onFileUploaded
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
