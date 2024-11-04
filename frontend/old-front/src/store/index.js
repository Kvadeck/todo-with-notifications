import { createStore } from "vuex";
import tasksModule from "@/store/modules/tasks/index.js"

const store = createStore({
    modules: {
        tasks: tasksModule
    }
});

export default store;