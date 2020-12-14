<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img
        :src="authorData"
        :alt="author.nickName"
        class="rounded-circle img-thumbnail author-img"
      />
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ author.nickName }}</h6>
        <span class="text-truncate text-muted d-block">
          {{ author.description }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    author: Object
  },
  setup(props) {
    const authorData = computed(() => {
      if (props.author && props.author.avatar) {
        const { url } = props.author.avatar
        return url
      } else {
        return require('@/assets/avatar.jpg')
      }
    })
    return {
      authorData
    }
  }
})
</script>

<style scoped>
.author-img {
  width: 50px;
  height: 50px;
}
</style>
