import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import FriendChat from "@/views/chat/FriendChat.vue";
Vue.use(Router)
export default new Router({
    routes: [    {
        hidden:true,
        path: '/',
        name: 'Login',
        component: Login
    },
        {
            hidden:true,
            path:'/Home',
            name:'Home',
            component: Home,
            children:[
                {
                    hidden:true,
                    path: '/chat',
                    name: '在线聊天',
                    component: FriendChat,
                }
            ]

        }
        ]
})

