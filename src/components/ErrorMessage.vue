<template>
    <div v-if="message" class="error-message">
      <i class="fa-solid fa-circle-exclamation me-1"></i>
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        default: '',
      },
    },
  };
  </script>
  
  <style>
  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
  }
  .icon-warning {
  color: red;
  margin-left: 5px;
}

  </style>
  