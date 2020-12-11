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
          <PostDetail
            :author="currentPost.author"
            v-if="currentPost.author"
          ></PostDetail>
        </div>
        <span class="text-muted col text-right font-italic">
          发表于：{{ currentPost.createdAt }}
        </span>
      </div>
      <h1>
        {{ currentPost.title }}
      </h1>
      <div v-html="currentPost.content"></div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
// import MarkdownIt from 'markdown-it'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PostDetail from '../components/userProfile.vue'

export default defineComponent({
  name: 'post-detail',
  components: {
    PostDetail
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const postId = route.params.id
    // const md = new MarkdownIt()

    onMounted(() => {
      store.dispatch('fetchPost', postId)
    })

    const currentPost = computed(() => store.state.post)

    // const currentHTML = computed(() => {
    //   if (currentPost.value && currentPost.value.content) {
    //     return md.render(currentPost.value.content)
    //   }
    // })

    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_600'
      } else {
        return null
      }
    })

    return {
      currentPost,
      PostDetail,
      currentImageUrl
      // currentHTML
    }
  }
})
</script>
