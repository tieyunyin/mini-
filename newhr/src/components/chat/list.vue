<template>
  <div id="list">
    <ul style="padding-left: 0px">
      <li v-for="item in hrs" :class="{ active:currentSession? item.username === currentSession.username:false }" v-on:click="changeCurrentSession(item)" :key="item.name">
        <img class="avatar" :src="item.userface" :alt="item.name">
        <el-badge :is-dot="isDot[user.username+'#'+item.username]"><p class="name">{{item.name}}</p></el-badge>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'list',
  data () {
    return {
      user:JSON.parse(window.sessionStorage.getItem("user"))
    }
  },
  computed: mapState([
  'hrs',
  'isDot',
  'currentSession'
	]),
  methods:{
    changeCurrentSession:function (id) {
      this.$store.commit('changeCurrentSession',id)
    }
  }
}
</script>

<style lang="scss" scoped>
#list {
	li {
    list-style: none;
		padding: 16px 15px;
		border-bottom: 1px solid #292C33;
		cursor: pointer;
		&:hover {
			background-color: rgba(255, 255, 255, 0.03);
		}
	}
  li.active {/*注意这个是.不是冒号:*/
			background-color: rgba(255, 255, 255, 0.1);
	}
	.avatar {
		border-radius: 2px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
	.name {
		display: inline-block;
		margin-left: 15px;
    margin-top: 0px;
    margin-bottom: 0px;
	}
}
</style>
