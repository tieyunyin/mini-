import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "@/router";
import store from"@/store"
import {initMenu} from "@/store/menus";
import'font-awesome/css/font-awesome.min.css'
Vue.config.productionTip = false
//Vue.use(router)
Vue.use(ElementUI)
router.beforeEach((to,from,next)=>{
  if(to.path==='/'){
    next();
  }else{
    if(window.sessionStorage.getItem("user")){
      initMenu(router,store);
      next();
    }else{
      next('/?redirect='+to.path);
    }

  }
})
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
