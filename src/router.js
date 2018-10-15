import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'


Vue.use(VueRouter)

const router = new VueRouter({
    routes
})



router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path === '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('menuList');
        sessionStorage.removeItem('roleList');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));

    if (!user && to.path !== '/login') {
        next({ path: '/login' })
    } else {
        //判断是否第一次登陆，如果是 则进行密码修改，如果没有修改还是让其跳转到修改密码页面
        if (user !== null && user.firstLoginFlag && to.path !== '/updatePwd') {
            next({ path: '/updatePwd' })
        } else{
            if (to.path) {
                next()
            } else {
                next({ path: '/404' })
            }
        }

    }
});

//router.afterEach(transition => {
//NProgress.done();
//});

export default router;