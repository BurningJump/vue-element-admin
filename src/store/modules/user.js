import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    menuData:[] //用户菜单
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUData: (state, menuData) => {
      state.menuData = menuData
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      // console.log({commit}, 'commit+++++++++')
      const username = userInfo.username.trim()
      commit('SET_TOKEN', username)
      setToken(username)
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        let res = {
          data: {
            avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            introduction: "我是超级管理员",
            name: "Super Admin",
            roles: ["admin"],
            token: "admin"
          }
        }
        commit('SET_ROLES', ['admin'])
        commit('SET_NAME', "Super Admin")
        commit('SET_AVATAR', "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif")
        commit('SET_INTRODUCTION', "我是超级管理员")
        resolve(res)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    },

    //保存用户菜单
    SaveUserMenu({ commit }, userMenuList) {
      commit('SET_MENUData', userMenuList)      
    }



  }


}

export default user
