import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [],
    user: String
  },
  getters: {
    projects: state => {
      return state.projects;
    },
    member: state => {
      return state.user;
    }
  },
  mutations: {
    updateProject (state, projects){
      state.projects = projects;
    },
    updateUser (state, user){
      state.user = user;
    }
  },
  actions: {
    updateProject({commit}, projects){
      commit('updateProject', projects);
    },
    updateUser({commit}, user){
      commit('updateUser', user);
    }
  }
})
