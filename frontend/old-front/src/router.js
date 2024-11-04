import {createRouter, createWebHistory} from "vue-router";

import NotFound from "@/pages/NotFound.vue";
import TasksList from "@/pages/tasks/TasksList.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: TasksList, name:'Todo list'},
        {path: '/:notFound(.*)', component: NotFound}
    ]
});

export default router;