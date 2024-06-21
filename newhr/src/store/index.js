import Vuex from 'vuex'
import Vue from 'vue'
import {getRequest} from "@/utils/api";
import '../utils/stomp'
import SockJS from '../utils/sockjs'

Vue.use(Vuex)
new Date();
const store =  new Vuex.Store({
    state:{
        routes:[],
        sessions:{},
        currentSession:null,
        currentHr:JSON.parse(window.sessionStorage.getItem("user")),
        filterKey:'',
        hrs:[],
        stomp:null,
        isDot:{}
    },
    mutations:{
        INIT_CURRENTHR(state,hr){
            state.currentHr=hr;
        },
        initRoutes(state,data){
            state.routes=data;
        },
        changeCurrentSession (state,id) {
            Vue.set(state.isDot,state.currentHr.username+'#'+id.username,false);
            state.currentSession = id;
        },
        addMessage (state,msg) {
            state.currentHr=JSON.parse(window.sessionStorage.getItem("user"));
          let mss=  state.sessions[state.currentHr.username+'#'+msg.to];
          if(!mss){
              //state.sessions[state.currentHr.username+'#'+msg.to]=[]
              Vue.set(state.sessions,state.currentHr.username+'#'+msg.to,[]);
          }
           state.sessions[state.currentHr.username+'#'+msg.to].push({
                content:msg.content,
                date: new Date(),
                self:!msg.notSelf
            })
            //console.log(state.sessions);
            //console.log(state.currentSession);
        },
        // eslint-disable-next-line no-unused-vars
        INIT_DATA (state) {

             let data = localStorage.getItem('vue-chat-session');
             if (data) {
                 state.sessions = JSON.parse(data);
             }
        },
        INIT_HR(state,data){
            state.hrs=data;
        }
    },
    actions:{

    connect(context){
        // eslint-disable-next-line no-undef
        context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
        //console.log(context.state.stomp);
            context.state.stomp.connect({},success=>{
                context.state.stomp.subscribe('/user/queue/chat',msg=>{
                    let receiveMsg=JSON.parse(msg.body);
                    if(!context.state.currentSession||receiveMsg.from!=context.state.currentSession.username){
                        Vue.set(context.state.isDot,context.state.currentHr.username+'#'+receiveMsg.from,true);
                    }
                    receiveMsg.notSelf=true;
                    receiveMsg.to=receiveMsg.from;
                    context.commit('addMessage',receiveMsg);
                })

            },error=>{
            })
        },
        initData (context) {
           // console.log("FFFFFF");
        context.commit('INIT_DATA')
        getRequest('/chat/hrs/').then(resp=> {
                if (resp) {
                    context.commit('INIT_HR',resp);
                }
            }
        )
    }
}
})
store.watch(function (state) {
    return state.sessions
},function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
    deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;
