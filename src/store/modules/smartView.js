import { basicConstant } from '@/smartview/VBasicConstant.js'

const smartView = {
  state: {
    cachedForms: []
  },
  // getters: {
  //   // ...

  //   getDetailForm: (state) => (formName, dataId) => {
  //     state.cachedForms.find(form =>
  //       form.componentName === formName &&
  //       form.ctype === basicConstant.FORMTYPE_DETAIL &&
  //       form.dataId === dataId)
  //   },
  //   getFormById: (state) => (id) => {
  //     return state.cachedForms.find(form => form.formId === id)
  //   }

  // },
  mutations: {
    ADD_CACHED_FORM: (state, view) => {
      if (state.cachedForms.includes(view.formId)) return
      state.cachedForms.push(view)
    },

    DEL_CACHED_FORM: (state, view) => {
      for (const i of state.cachedForms) {
        if (i === view.formId) {
          const index = state.cachedForms.indexOf(i)
          state.cachedForms.splice(index, 1)
          break
        }
      }
    },

    DEL_OTHERS_CACHED_FORMS: (state, view) => {
      for (const i of state.cachedForms) {
        if (i === view.formId) {
          const index = state.cachedForms.indexOf(i)
          state.cachedForms = state.cachedForms.slice(index, index + 1)
          break
        }
      }
    },

    DEL_ALL_CACHED_FORMS: state => {
      state.cachedForms = []
    }
  },
  actions: {
    addForm({ dispatch }, view) {
      dispatch('addCachedForm', view)
    },
    addCachedForm({ commit }, view) {
      commit('ADD_CACHED_FORM', view)
    },

    delForm({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delCachedForm', view)
        resolve({
          cachedForms: [...state.cachedForms]
        })
      })
    },
    delCachedForm({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_CACHED_FORM', view)
        resolve([...state.cachedForms])
      })
    },

    delOthersForms({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delOthersCachedForms', view)
        resolve({
          cachedForms: [...state.cachedForms]
        })
      })
    },
    delOthersCachedForms({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_FORMS', view)
        resolve([...state.cachedForms])
      })
    },

    delAllForms({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delAllCachedForms', view)
        resolve({
          cachedForms: [...state.cachedForms]
        })
      })
    },
    delAllCachedForms({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_FORMS')
        resolve([...state.cachedForms])
      })
    }
  }
}

export default smartView
