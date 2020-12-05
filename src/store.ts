import { createStore, Commit } from 'vuex'
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
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: unknown) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    token: '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false, name: 'lostelk', columnId: 1 }
  },
  mutations: {
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, name: 'mil' }
    // },
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
    },
    setLoading(state, status) {
      state.loading = status
    },
    login(state, rawData) {
      state.token = rawData.data.token
    }
  },
  actions: {
    // 1-1 正常写法 { commit } 为context.commit的对象结构写法 data为resp.data的对象结构写法
    // async fetchColumn({ commit }, cid) {
    //   const { data } = await axios.get(`/columns/${cid}`)
    //   commit('fetchColumn', data)
    // }
    // 1-1 封装后
    fetchColumns({ commit }) {
      getAndCommit('/columns', 'fatchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },

    // 1-2 正常写法
    // async login({ commit }, payload) {
    //   const { data } = await axios.post('/user/login', payload)
    //   commit('login', data)
    //   // return data
    // }
    // 1-2 封装后
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    }
  },
  getters: {
    getColumnById(state) {
      return (id: string) => {
        return state.columns.find(item => item._id === id)
      }
    }
  }
})

export default store
