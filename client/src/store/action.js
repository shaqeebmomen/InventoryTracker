import router from "@/router/index.js";
import Store from "@/store/index.js";
import { v4 as uuidv4 } from 'uuid';
// For testing
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const error = false;

export default {
    login: async (context, payload) => {

        const result = await (
            await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.pass,
                }),
            })
        ).json();
        if (result.errors) {
            return result;
        } else if (result.user) {
            context.commit('setUser', { user: result.user, guest: result.guest });
            return result;
        } else {
            context.commit('setUser', null);
            return null;
        }
    },
    logout: async (context, payload) => {
        const result = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: Store.state.user
            })
        });
        context.commit('setUser', null);
        return result;
    },
    sessionLogin: async (context, payload) => {
        const result = await (
            await fetch("/api/auth/session", {
                method: "POST",
            })
        ).json();
        if (result.errors) {
            return result;
        } else if (result.user) {
            context.commit('setUser', { user: result.user, guest: result.guest });
            return result;
        } else {
            context.commit('setUser', null);
            return null;
        }
    },
    clearUser: (context, payload) => {
        context.commit('setUser', null);
    },
    setNavTag: (context, payload) => {
        context.commit('setNavTag', payload)
    },
    setCategoryNotif(context, payload) {
        /**
         * Payload: 
         * {
         *  name: 'category_name',
         *  value: notifcount
         * }
         */

        context.commit('setCategoryNotif', payload)
    },
    loadCards: async (context, payload) => {
        try {
            const result = await (await fetch('api/parts', {
                method: "GET",

            })).json();
            context.commit('setCards', result);
            context.commit('updateCategoryNotifs', null);
        } catch (error) {
            console.log(error);
        }
    },
    async updateCard(context, payload) {
        // Update backend
        // await timeout(2000);
        // if (error) {
        //     throw new Error('error updating card')
        // }
        // const result = payload;

        if (!Store.state.guest) {
            const result = await fetch('api/parts', {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(payload),
            })
            if (result.status === 403) {
                context.commit('setUser', null);

                location.reload();
                throw Error('Access Denied')
            }
            // Commit to state
            const data = await result.json();
            context.commit('setCard', data);
            context.commit('updateCategoryNotifs', null);
        } else {
            // Commit to state
            context.commit('setCard', Object.assign({}, payload));
            context.commit('updateCategoryNotifs', null);
        }
    },
    async addCard(context, payload) {
        // Add to db
        // await timeout(2000);
        // if (error) {
        //     throw new Error('error updating card')
        // }
        // const result = payload;
        if (!Store.state.guest) {
            const result = await fetch('api/parts', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(payload),
            })
            if (result.status === 403) {
                context.commit('setUser', null);

                location.reload();
                throw Error('Access Denied')
            }
            const data = await result.json();
            // Commit to state
            context.commit('addCard', data);
            context.commit('updateCategoryNotifs', null);
        } else {
            // Commit to state
            payload._id = uuidv4();
            context.commit('addCard', Object.assign({}, payload));
            context.commit('updateCategoryNotifs', null);
        }
    },
    async removeCard(context, payload) {
        // Remove from db
        // await timeout(2000);
        // if (error) {
        //     throw new Error('error updating card')
        // }
        if (!Store.state.guest) {
            const result = await fetch(`api/parts/${payload}`, {
                method: "DELETE"
            })
            if (result.status === 403) {
                context.commit('setUser', null);

                location.reload();
                throw Error('Access Denied')
            } else {
                // Remove from state
                context.commit('removeCard', payload);
                context.commit('updateCategoryNotifs', null);
            }
        } else {
            // Remove from state
            context.commit('removeCard', payload);
            context.commit('updateCategoryNotifs', null);
        }
    }
}