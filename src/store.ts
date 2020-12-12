import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  post: PostProps[];
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: unknown) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
const asyncAbdCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false },
    post: []
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
    fetchPost(state, rawData) {
      state.post = rawData.data
    },
    updatePost(state, rawData) {
      state.posts = state.posts.map(post => {
        if (post._id === rawData.data._id) {
          return rawData.data
        } else {
          return post
        }
      })
    },
    setLoading(state, status) {
      state.loading = status
    },
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    logout(state) {
      state.token = ''
      localStorage.remove('tolen')
      delete axios.defaults.headers.common.Authorization
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
      return getAndCommit('/columns', 'fatchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ commit }, cid) {
      return getAndCommit(`/posts/${cid}`, 'fetchPost', commit)
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
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
    },
    createPost({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', commit, payload)
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAbdCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    async loginAndFetch({ dispatch }, payload) {
      // return dispatch('login', payload).then(() => {
      //   dispatch('fetchCurrentUser')
      // })
      await dispatch('login', payload)
      await dispatch('fetchCurrentUser')
    }
  },
  getters: {
    getColumnById(state) {
      return (id: string) => {
        return state.columns.find(item => item._id === id)
      }
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
