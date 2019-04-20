import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [],
    currentProject: String,
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
    updateProjects (state, projects){
      state.projects = projects;
    },
    updateUser (state, user){
      state.user = user;
    },
    updateCurrentProject (state, project){
      state.currentProject = project;
    }
  },
  actions: {
    updateProjects({commit}, projects){
      commit('updateProjects', projects);
    },
    updateUser({commit}, user){
      commit('updateUser', user);
    },
    updateCurrentProject({commit}, project){
      commit('updateCurrentProject', project);
    }
  }
})
