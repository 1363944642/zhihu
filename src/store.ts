import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: true, name: 'lostelk', columnId: 1 }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'mil' }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    }
  },
  getters: {
    biggerColumnLen(state) {
      return state.columns.filter(item => item.id > 2).length
    },
    getColumnById(state) {
      return (id: number) => {
        return state.columns.find(item => item.id === id)
      }
    },
    getPostByCId(state) {
      return (cid: number) => {
        return state.posts.filter(item => item.columnId === cid)
      }
    }
  }
})

export default store
