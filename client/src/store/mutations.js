const updateTotalNotifs = (state, payload) => {
    state.notifCount = 0;
    state.categories.forEach((category) => {
        state.notifCount += category.notifs;
    });
}




export default {
    // Save the userId
    setUser: (state, payload) => {
        if (payload) {
            state.user = payload.user;
            state.guest = payload.guest;
        }
        else {
            state.user = null;
            state.guest = null;
        }

    },

    // Set the filter tag from the nav bar
    setNavTag: (state, payload) => {
        state.navTag = payload;
    },
    updateCategoryNotifs(state, payload) {
        // Reset category notifs
        state.categories.forEach((category) => {
            category.notifs = 0;
        })
        // Update notifs for each category
        state.items.forEach(item => {

            if (item.qty <= item.warningQty) {

                // For each of the applied item categories
                item.categories.forEach((itemCat) => {
                    // Find the category with the same name and update it
                    state.categories.find((category) => {
                        return itemCat.toLowerCase() === category.name.toLowerCase();
                    }).notifs += 1;
                });
            }
        });
        updateTotalNotifs(state, null)
    },
    setCategoryNotif(state, payload) {
        const category = state.categories.find((category) => {
            return category.name === payload.name
        });
        category.notifs = payload.notifs;
        updateTotalNotifs();
    },
    setCards(state, payload) {

        state.items = payload;
    },
    setCard(state, payload) {
        const index = state.items.findIndex((item) => {
            return item._id === payload._id;
        });
        state.items[index] = payload;
    },
    addCard(state, payload) {
        state.items = [...state.items, payload];
    },
    removeCard(state, payload) {
        const index = state.items.findIndex((item) => {
            return item._id === payload;
        })
        if (index >= 0) {
            state.items.splice(index, 1)
        }
    }

}