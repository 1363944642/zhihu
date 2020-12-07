<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn-w btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
export const emitter = mitt()

export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    let funcArr: ValidateFunc[] = []
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    emitter.on('from-item-created', callback)
    const submitForm = () => {
      const result = funcArr.map(funcItem => funcItem()).every(mapItem => mapItem)
      context.emit('form-submit', result)
    }
    onUnmounted(() => {
      emitter.off('from-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style scoped>
.btn-w {
  width: 100%;
}
</style>
