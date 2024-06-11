export default {
    addTask(state, payload) {
        state.tasks.push(payload);
    },
    setTasks(state, payload) {
        state.tasks = payload;
    },
    setFetchTimestamp(state) {
        state.lastFetch = new Date().getTime();
    },
    setMarked(state, payload) {
        const marked = state.tasks.find(item => item.id === payload);
        marked.completed = !marked.completed;
    },
    selectTask(state, id) {
        state.selectedTasks.push(id);
    },
    removeTask(state, id) {
        state.selectedTasks = state.selectedTasks.filter(item => item !== id);
    },
    clearSelectedTasks(state) {
        state.selectedTasks = []
    }

};