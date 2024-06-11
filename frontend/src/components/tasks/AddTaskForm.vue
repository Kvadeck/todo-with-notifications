<template>
  <base-card>
    <h2>Write your task</h2>
    <form @submit.prevent="submitForm">
      <div class="form-control" :class="{invalid: !taskName.isValid}">
        <label for="taskName">Task:</label>
        <input id="taskName" v-model.trim="taskName.val"
               @blur="clearValidity('taskName')"/>
        <p v-if="!taskName.isValid">Task must not be empty.</p>
      </div>

      <div class="form-control" :class="{invalid: !category.isValid}">
        <h3 :class="{invalid: !category.isValid}">Category:</h3>
        <div>
          <input type="checkbox" id="home" value="home" v-model="category.val" @blur="clearValidity('category')">
          <label for="home">Home</label>
        </div>
        <div>
          <input type="checkbox" id="work" value="work" v-model="category.val"
                 @blur="clearValidity('category')">
          <label for="work">Work</label>
        </div>
        <div>
          <input type="checkbox" id="family" value="family" v-model="category.val" @blur="clearValidity('category')">
          <label for="family">Family</label>
        </div>
        <p v-if="!category.isValid">At least one category must be selected</p>
      </div>

      <div class="form-control" :class="{invalid: !time.isValid}">
        <label for="time">Deadline time:</label>
        <input type="datetime-local" id="time" name="time" v-model="time.val" @blur="clearValidity('time')"/>
        <p v-if="!time.isValid">Time must not be empty.</p>
      </div>

      <p v-if="!formIsValid">Please fix the above errors and submit again.</p>

      <base-button @click="submitForm" v-on:keyup="submitForm" type="button">Add</base-button>

    </form>
  </base-card>

</template>

<script>
export default {
  emits: ['save-data'],
  data() {
    return {
      taskName: {
        val: '',
        isValid: true
      },
      time: {
        val: '',
        isValid: true
      },
      category: {
        val: [],
        isValid: true
      },
      formIsValid: true,
      completed: false
    }
  },
  methods: {
    submitForm() {
      this.validateForm();

      if (!this.formIsValid) {
        return;
      }

      const formData = {
        taskName: this.taskName.val,
        time: this.time.val,
        category: this.category.val,
        completed: this.completed
      };
      this.$emit('save-data', formData)


      this.taskName.val = '';
      this.time.val = null
      this.category.val = []


    },
    validateForm() {
      this.formIsValid = true;

      if (this.taskName.val === '') {
        this.taskName.isValid = false;
        this.formIsValid = false;
      }

      if (!this.time.val) {
        this.time.isValid = false;
        this.formIsValid = false;
      }

      if (this.category.val.length === 0) {
        this.category.isValid = false;
        this.formIsValid = false;
      }

    },
    clearValidity(input) {
      this[input].isValid = true;
    },
  }
}

</script>

<style scoped>
h2 {
  margin: 0.5rem 0;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: #f44336;
}

.invalid h3 {
  color: #f44336;
}

.invalid input,
.invalid textarea {
  border: 1px solid #f44336;
}

.invalid p {
  color: #f44336;
}

form p {
  color: #f44336;
}

</style>