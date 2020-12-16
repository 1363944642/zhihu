<template>
  <div class="post-detail-page">
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img
        :src="currentImageUrl"
        alt="currentPost.title"
        class="rounded-lg img-fluid my-4"
        v-if="currentPost.image"
      />
      <div
        class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0"
      >
        <div class="col">
          <userProfile
            :author="currentPost.author"
            v-if="currentPost.author"
          ></userProfile>
        </div>
        <span class="text-muted col text-right font-italic">
          发表于：{{ currentPost.createdAt }}
        </span>
      </div>
      <h1>
        {{ currentPost.title }}
      </h1>
      <div v-html="currentPost.content"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          :to="{ name: 'create', query: { id: currentPost._id } }"
          type="button"
          class="btn btn-success"
          >编辑</router-link
        >
        <button
          type="button"
          class="btn btn-danger"
          @click.prevent="modalIsVisible = true"
        >
          删除
        </button>
      </div>
    </article>
    <modal
      :title="删除文章"
      :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定要删除这篇文章吗?</p>
    </modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
// import MarkdownIt from 'markdown-it'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import userProfile from '../components/userProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'post-detail',
  components: {
    userProfile,
    Modal
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const modalIsVisible = ref(false)
    const size = computed(() => store.state.postsSize)
    const postId = route.params.id
    // const md = new MarkdownIt()

    const currentPost = computed(() => store.getters.getPostByCid(postId)[0])

    onMounted(() => {
      store.dispatch('fetchPost', postId)
    })

    // const currentHTML = computed(() => {
    //   if (currentPost.value && currentPost.value.content) {
    //     return md.render(currentPost.value.content)
    //   }
    // })

    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        return currentPost.value.author._id === _id
      } else {
        return false
      }
    })

    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_600'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', postId).then((rawData) => {
        createMessage('删除成功,2秒后跳转到专栏首页', 'success', 2000)
        setTimeout(() => {
          store.dispatch('fetchPosts', { cid: rawData.data.column, size: size.value, deletePost: true })
          router.push(`/column/${rawData.data.column}`)
        }, 2000)
      })
    }

    return {
      currentPost,
      userProfile,
      currentImageUrl,
      showEditArea,
      Modal,
      modalIsVisible,
      hideAndDelete
      // currentHTML
    }
  }
})
</script>
