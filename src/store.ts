import { createStore } from 'vuex'
import axios from 'axios'
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps | string;
  description: string;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

const store = createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: [],
    user: { isLogin: true, name: 'lostelk', columnId: 1 }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'mil' }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fatchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    }
  },
  actions: {
    fetchColumns(context) {
      axios.get('/columns').then(resp => {
        context.commit('fatchColumns', resp.data)
      })
    },
    fetchColumn(context, cid) {
      axios.get(`/columns/${cid}`).then(resp => {
        context.commit('fetchColumn', resp.data)
      })
    },
    fetchPosts(context, cid) {
      axios.get(`/columns/${cid}/posts`).then(resp => {
        context.commit('fetchPosts', resp.data)
      })
    }
  },
  getters: {
    getColumnById(state) {
      return (id: string) => {
        return state.columns.find(item => item._id === id)
      }
    }
    // getPostByCId(state) {
    //   return (cid: string) => {
    //     return state.posts.filter(item => item.column === cid)
    //   }
    // }
  }
})

export default store
