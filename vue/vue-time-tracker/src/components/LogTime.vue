<template>
    <div class="form-horizontal">
        <div class="form-group">
            <div class="col-sm-6">
                <label>日期</label>
                <input 
                    type="date"
                    class="form-control"
                    v-model="timeEntry.date"
                    placeholder="Date">
            </div>
            <div class="col-sm-6">
                <label>时间</label>
                <input 
                    type="number"
                    class="form-control"
                    v-model="timeEntry.totalTime"
                    placeholder="Hours">
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-12">
                <label for="">备注</label>
                <input 
                    type="text"
                    class="form-control"
                    v-model="timeEntry.comment"
                    placeholder="Comment">
            </div>
        </div>
        <button class="btn btn-primary" @click="save()">保存</button>
        <button v-link="{ path: '/time-entries' }" class="btn btn-danger">取消</button>
        <hr>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                timeEntry: {

                }
            };
        },

        methods: {
            save () {
                // console.log(this.timeEntry);
                // let timeEntry = this.timeEntry;
                // this.$dispatch('timeUpdate', timeEntry);
                // this.timeEntry = {};
                const timeEntry = this.timeEntry;
                this.$http.post('/create', {
                    date: timeEntry.date,
                    totalTime: timeEntry.totalTime,
                    comment: timeEntry.comment
                }).then(ret => {
                    console.log(ret);
                    console.log(timeEntry);
                    this.$dispatch('timeUpdate', timeEntry);
                    this.timeEntry = {};
                });
            }
        }
    }
</script>

<style scoped>

</style>