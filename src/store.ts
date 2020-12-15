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
  columns: { data: ColumnProps[]; isLoaded: boolean; page: number; totalPage: number };
  posts: { data: PostProps[]; loadedColumns: any };
  user: UserProps;
  post: { data: PostProps[]; loadedColumns: any };
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
const asyncAbdCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: [], isLoaded: true, page: 1, totalPage: 0 },
    posts: { data: [], loadedColumns: [] },
    user: { isLogin: false },
    post: { data: [], loadedColumns: [] }
  },
  mutations: {
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, name: 'mil' }
    // },
    createPost(state, newPost) {
      state.posts.data.push(newPost)
    },
    fatchColumns(state, rawData) {
      state.columns.data.push(...rawData.data.list)
      state.columns.isLoaded = false
      state.columns.page++
    },
    fetchColumn(state, rawData) {
      state.columns.data.push(rawData.data)
    },
    fetchPosts(state, { data, extraData }) {
      state.posts.data = [...state.posts.data, ...data.data.list]
      state.posts.loadedColumns.push(extraData)
    },
    fetchPost(state, { data, extraData }) {
      state.post.data.push(data.data)
      state.post.loadedColumns.push(extraData)
    },
    updatePost(state, rawData) {
      state.posts.data = state.posts.data.map(post => {
        if (post._id === rawData.data._id) {
          return rawData.data
        } else {
          return post
        }
      })
      state.post.data = state.post.data.map(post => {
        if (post._id === rawData.data._id) {
          return rawData.data
        } else {
          return post
        }
      })
    },
    deletePost(state, rawData) {
      state.posts.data = state.posts.data.filter(post => post._id !== rawData.data._id)
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
    fetchColumns({ state, commit }, params = {}) {
      const { size, isLoaded } = params
      if (isLoaded) {
        return asyncAbdCommit(`/columns?currentPage=${state.columns.page}&pageSize=${size}`, 'fatchColumns', commit, { method: 'get' })
      }
    },
    fetchColumn({ state, commit }, cid) {
      if (!state.columns.data.some(data => data._id === cid)) {
        return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts({ state, commit }, cid) {
      if (state.posts.data.length < 5) {
        state.posts.data = []
        return asyncAbdCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      } else if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAbdCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    fetchPost({ state, commit }, cid) {
      if (!state.post.loadedColumns.includes(cid)) {
        return asyncAbdCommit(`/posts/${cid}`, 'fetchPost', commit, { method: 'get' }, cid)
      } else {
        return Promise.resolve(state.post.data.filter(post => post._id === cid)[0])
      }
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
    deletePost({ commit }, id) {
      return asyncAbdCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
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
        return state.columns.data.find(item => item._id === id)
      }
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.data.filter(post => post.column === cid)
    },
    getPostByCid: (state) => (cid: string) => {
      return state.post.data.filter(post => post._id === cid)
    },
    getColumnTotalPage: (state) => (cid: number) => {
      state.columns.totalPage = cid
    }
  }
})

export default store
