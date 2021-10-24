import { createStore } from 'vuex'

import axios from 'axios'
import router from '@/router/index.js'

export default createStore({
  state() {
		return {
			loggedIn: false,
			forceRouter: false,
			notifications: [
				// {
				// 	type: "error",
				// 	message: "There was an error"
				// }
			]
		}
  },
  mutations: {
	setAuth(state,msg){
        state.loggedIn = msg;
    },
	PUSH_NOTIFICATION(state,notification){
		state.notifications.push({
			...notification,
			id: (Math.random().toString(36) + Date.now().toString(36)).substr(2)
		});
	},
	REMOVE_NOTIFICATION(state,notificationToRemove){
		state.notifications = state.notifications.filter(notification => {
			return notification.id != notificationToRemove.id;
		})
	},
	FORCE_ROUTE(state){
		state.forceRouter = true;
		// console.log(state.forceRouter)
		setTimeout(()=>{
			state.forceRouter = false;
			// console.log(state.forceRouter);
		},1000)
	}
  },
  getters: {
	authGetter(state){
        return state.loggedIn;
    },
	forceRouterGetter(state){
        return state.forceRouter;
    },
  },
  actions: {
	addNotification({commit}, notification){
		commit('PUSH_NOTIFICATION', notification);
	},
	removeNotification({commit}, notification) {
		commit("REMOVE_NOTIFICATION",notification);
	},
	setForceRoute({commit}, type){
		commit("FORCE_ROUTE", type);
	},
	async newList({dispatch}, payload){
		console.log('creating new list')
		
		var fd = new FormData();
        fd.append('list_name', payload.listName);
        fd.append('list_description', payload.listDescription);
		fd.append('token', localStorage.token);
		fd.append('id', localStorage.id);
		await axios.post("server.php?action=newlist",fd).then(function(response){
			if(response.data.error) {
				dispatch('addNotification', {
                    type: "error",
                    message: response.data.message
                })
			}else{
				dispatch('addNotification', {
                    type: "success",
                    message: response.data.message
                })
			}
			// console.log(response);
		});

	},
	async newTodo({dispatch}, payload){
		console.log('creating new todo')
		var fd = new FormData();
        fd.append('list_id', payload.list_id);
        fd.append('todo_type', payload.type);
		fd.append('todo_name', payload.name);
		fd.append('token', localStorage.token);
		fd.append('id', localStorage.id);
		await axios.post("server.php?action=newtodo",fd).then(function(response){
			if(response.data.error) {
				dispatch('addNotification', {
                    type: "error",
                    message: response.data.message
                })
			}else{
				dispatch('addNotification', {
                    type: "success",
                    message: response.data.message
                })
			}
			// console.log(response);
		});

	},
	async login({ commit,dispatch }, payload){
        console.log('logging in')
        var fd = new FormData();
        fd.append('username', payload.username);
        fd.append('password', payload.password);

        
        await axios.post("server.php?action=login",fd).then(function(response){
            // console.log(response.data)
			console.log('sent data')
			
            if(response.data.error){

                console.log("error "+ response.data.message);
                // commit('setError', response.data.message);
                dispatch('addNotification', {
                    type: "error",
                    message: response.data.message
                })
            }else if(response.data.message === "successfully logged in"){
                console.log("success "+ response.data.message);

                localStorage.id = response.data.id;
                localStorage.username = response.data.username;
                localStorage.email = response.data.email;
                localStorage.token = response.data.token;
                // localStorage.signature = response.data.signature;
                // localStorage.expires = response.data.expires;
                
                commit('setAuth', true)//need to set the state loggedIn variable as true
				
                // // commit('setSuccess', "Logged in successfully")
                dispatch('addNotification', {
                    type: "success",
                    message: "Logged in successfully"
                })
                //push user to page
                router.replace('/');
            }else{
				console.log('error logging in');
                // commit('setError', "Something went wrong, please reach out to the admin");
                // dispatch('addNotification', {
                //     type: "error",
                //     message: "Something went wrong, please reach out to the admin"
                // })
            }
        })
    },
	authCheck({ commit, dispatch }){
        // console.log("Has Token: "+!!localStorage.token)
        // console.log('checking auth...')
        // commit('changeCheckingAuth', true)
        commit('setAuth', !!localStorage.token) 

        //set auth to true if we have a token but we need to verify if it is accurate. 
        //Currently the only way I can get this to work with out it auto logging out
        //its bad practice, but with the db being a bit slow it auto redirects before the check is returned
        if(localStorage.token){
            //we need to check to see if we have a token, if we do, we should attempt to relogin
            console.log('verifying token in local storage...')

            var fd = new FormData();
            fd.append('token', localStorage.token);

            axios.post("server.php?action=verifytoken",fd).then(function(response){
                console.log('sending token to api')
                if(response.data.error){
                    // console.log("token invalid");
                    console.log(response.data)
                    // dispatch('logout', {type: 'error', msg: 'Session Invalid, please login again.'});
					dispatch('logout');
                    // commit('changeCheckingAuth', false)
					dispatch('addNotification');
                }else{
                    console.log("token valid");
                    // console.log(response.data)                        
                    commit('setAuth', true)
                    // commit('changeCheckingAuth', false)
                }
                
            })            
        }else{
            // commit('changeCheckingAuth', false)
        }
    },
	logout({commit,dispatch}) {
		commit('setAuth', false);
		localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("token");
		dispatch('addNotification', {
			type: "success",
			message: "Logged out successfully."
		})
		router.replace('/');
	}
  },
  modules: {
  }
})
