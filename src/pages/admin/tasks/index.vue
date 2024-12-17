<template>
  <div>
    <JQueryGantt />
  </div>
</template>

<script>
import JQueryGantt from '../../../components/JQueryGanttComponent.vue' // Import component Gantt

import('../../../assets/gantt/platform.css')
import('../../../assets/gantt/libs/jquery/dateField/jquery.dateField.css')
import('../../../assets/gantt/gantt.css')
// import('../../../assets/gantt/ganttPrint.css')
import('../../../assets/gantt/libs/jquery/valueSlider/mb.slider.css')
export default {
  name: 'Tasks',
  components: {
    JQueryGantt,
  },
}
</script>

<style scoped>
.resEdit {
  padding: 15px;
}

.resLine {
  width: 95%;
  padding: 3px;
  margin: 5px;
  border: 1px solid #d0d0d0;
}

body {
  overflow: hidden;
}

.ganttButtonBar h1 {
  color: #000000;
  font-weight: bold;
  font-size: 28px;
  margin-left: 10px;
}


</style>