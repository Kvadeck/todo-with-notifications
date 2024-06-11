export default {
    tasks(state) {
        return state.tasks
    },
    hasTasks(state) {
        return state.tasks && state.tasks.length > 0;
    },
    shouldUpdate(state) {
        const lastFetch = state.lastFetch;
        if (!lastFetch) {
            return true;
        }
        const currentTimeStamp = new Date().getTime();
        return (currentTimeStamp - lastFetch) / 1000 > 60;
    },
    getSelectedTasks(state) {
        return state.selectedTasks;
    }
};