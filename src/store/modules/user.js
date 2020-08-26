import { login, logout, getInfo } from '@/api/user'
import { getSession, setSession, removeSession } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getSession(),
        name: '',
        avatar: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                commit('SET_NAME', data.username)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout().then(() => {
                removeSession()
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    resetSession({ commit }) {
        return new Promise(resolve => {
            removeSession()
            commit('RESET_STATE')
            resolve()
        })
    },

    // getUploadToken() {
    //     return new Promise(async (resolve, reject) => {
    //             const uploadToken = await new Qiniu().fetchUploadToken()
    //             resolve(uploadToken)
    //     })
    // }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

