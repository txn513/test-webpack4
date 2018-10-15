import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'font-awesome/css/font-awesome.min.css'
import './element-variables.scss'
import store from './vuex/store'
import Vuex from 'vuex'
import router from './router'
import i18n from './i18n'
import global_ from './Global'
/*引入公共样式*/
import '@/common/css/common.css'
import '@/assets/iconfont/iconfont.css'
Vue.prototype.GLOBAL = global_;

Vue.use(ElementUI);
Vue.use(Vuex);

/**
 * 挂载权限方法
 */
Vue.prototype.isAuth = isAuth;

/**
 * 是否有权限
 */
export function isAuth (key) {
    if (key) {
        return JSON.parse(sessionStorage.getItem('roleList') || '[]').indexOf(key.toLowerCase()) !== -1
    }
    return false;
}

//NProgress.configure({ showSpinner: false });

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    i18n,
    store,
    data: {
        eventHub: new Vue()
    },
    //components: { App }
    render: h => h(App)
}).$mount('#app')

