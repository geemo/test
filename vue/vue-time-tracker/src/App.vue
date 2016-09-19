<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container">
        <a href="" class="navbar-brand">
          <i class="glyphicon glyphicon-time"></i> 计划表
        </a>
        <ul class="nav navbar-nav">
          <li><a href="" v-link="{ path: '/home' }">首页</a></li>
          <li><a href="" v-link="{ path: '/time-entries' }">计划列表</a></li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <div class="col-sm-3"></div>
      <div class="col-sm-9">
        <router-view></router-view>
      </div>
    </div>

    <div class="container">
      <div class="col-sm-3">
        <sidebar :time="totalTime"></sidebar>
      </div>
      <div class="col-sm-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from "./components/Sidebar.vue";

  export default {
    components: {
      Sidebar
    },

    data () {
      return {
        totalTime: 0
      }
    },

    ready () {
      this.$http.get('/time')
          .then(ret => {
            console.log(ret);
            this.totalTime = ret.data && ret.data.time || 0;
          }, err => console.log(err));
    },

    events: {
      timeUpdate (timeEntry) {
        this.totalTime += parseFloat(timeEntry.totalTime);
      },

      deleteTime (timeEntry) {
        this.totalTime -= parseFloat(timeEntry.totalTime);
      }
    }
  };
</script>