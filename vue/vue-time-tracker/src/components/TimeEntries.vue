<template>
    <div>
        <button
            v-if="$route.path !== '/time-entries/log-time'"
            v-link="{ path: '/time-entries/log-time' }"
            class="btn btn-primary">创建</button>
        <div v-if="$route.path === '/time-entries/log-time'">
            <h3>创建</h3>
        </div>
        <hr>
        <router-view></router-view>
        <div class="time-entries">
            <p v-if="!timeEntries.length"><strong>没有任何任务</strong></p>
            <div class="list-group">
                <a class="list-group-item" v-for="timeEntry in timeEntries">
                    <div class="row">
                        <div class="col-sm-2 user-details">
                            <img src="http://q.qlogo.cn/qqapp/100229475/EE4115CA85A73A143917ED0A46566278/100" class="avatar img-circle img-responsive">
                            <p class="text-center"><strong>geemo</strong></p>
                        </div>
                        <div class="col-sm-2 text-center time-block">
                            <h3 class="list-group-item-text total-time">
                                <i class="glyphicon glyphicon-time"></i>
                                {{ timeEntry.totalTime }}
                            </h3>
                            <p class="label label-primary text-center">
                                <i class="glyphicon glyphicon-calendar"></i>
                                {{ timeEntry.date }}
                            </p>
                        </div>
                        <div class="col-sm-7 comment-section">
                            <p>{{ timeEntry.comment }}</p>
                        </div>
                        <div class="col-sm-1">
                            <button 
                                class="btn btn-xs btn-danger delete-button"
                                @click="deleteTimeEntry(timeEntry)">X</button>

                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                timeEntries: []
            };
        },

        methods: {
            deleteTimeEntry (timeEntry) {
                if(window.confirm('确定要删除嘛?')) {
                    console.log(this.timeEntries);
                    let index = this.timeEntries.indexOf(timeEntry);
                    let _id = timeEntry._id;
                    this.$http.delete(`/delete/${_id}`)
                        .then(console.log.bind(console), console.error.bind(console));
                    this.timeEntries.splice(index, 1);
                    this.$dispatch('deleteTime', timeEntry);
                }
            }
        },

        route: {
            data () {
                this.$http.get('/time-entries')
                    .then(ret => {
                        this.timeEntries = ret.data && ret.data.entries || [];
                    }, err => console.log(err));
            }
        },

        events: {
            timeUpdate (timeEntry) {
                this.timeEntries.push(timeEntry);
                return true;
            }
        }
    };
</script>

<style scoped>
    .avatar {
        height: 75px;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .user-details {
        background-color: #f5f5f5;
        border-right: 1px solid #ddd;
        margin: -10px 0;
    }

    .time-block {
        padding: 10px;
    }

    .comment-section {
        padding: 20px;
    }
</style>