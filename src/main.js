import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index.js';
import axios from 'axios'
import dayjs from 'dayjs';
import LoadScript from "vue-plugin-load-script";
import 'dayjs/locale/vi'; // Import locale tiếng Việt
// Set locale cho Dayjs là tiếng Việt
dayjs.locale('vi');

window.axios = axios;
import { 
    Layout,
    Form,
    // FormItem,
    Progress,
    Dropdown,
    Modal,
    Checkbox,
    Input,
    Avatar,
    Select,
    Table,
    Card,
    Menu,
    List,
    Slider,
    Drawer,
    Button, 
    message,
    DatePicker,
    // Textarea
} from 'ant-design-vue';
import './static/fontawesome/css/all.min.css'
import 'ant-design-vue/dist/reset.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
const app = createApp(App);
const pinia = createPinia();
app.use(LoadScript);
app.use(dayjs);
app.use(router);
app.use(Layout);
app.use(Form);
// app.use(FormItem);
app.use(Progress);
app.use(Dropdown);
app.use(Modal);
app.use(Slider);
// app.use(Textarea);
app.use(DatePicker);
app.use(Checkbox);
app.use(Input);
app.use(Avatar);
app.use(Select);
app.use(Button);
app.use(Drawer);
app.use(List);
app.use(Menu);
app.use(Card);
app.use(Table);
app.use(pinia);
app.config.globalProperties.$message = message;
app.mount('#app')
