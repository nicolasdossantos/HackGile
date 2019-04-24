<template>
    <div id="clock">
         <h1 v-if="distance > 0" class="display-2 font-weight-thin">{{`${hours}:${minutes}:${seconds}`}}</h1>
         <h1 v-else class="display-2 font-weight-thin">00:00:00:00</h1>
    </div>
</template> 
 
 
 
 <script>
 export default {
      props: ['endTime'],
 data(){
    var vm = this
    return{
      
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      distance: 0,
      countDownDate: 0,
    }
  },
  mounted(){
    var vm = this
    this.countDownDate = this.endTime


    var x = setInterval(function() {
      var now = new Date().getTime();
      vm.distance = vm.countDownDate - now;


      vm.hours = Math.floor(vm.distance / (1000 * 60 * 60)) < 10 
      ? ("0" + Math.floor(vm.distance / (1000 * 60 * 60))).slice(-2)
      :Math.floor(vm.distance / (1000 * 60 * 60));


      vm.minutes =  Math.floor((vm.distance % (1000 * 60 * 60)) / (1000 * 60)) < 10 
      ? ("0" +  Math.floor((vm.distance % (1000 * 60 * 60)) / (1000 * 60))).slice(-2)
      : Math.floor((vm.distance % (1000 * 60 * 60)) / (1000 * 60));
    
      vm.seconds = Math.floor((vm.distance % (1000 * 60)) / 1000) < 10 
      ? ("0" + Math.floor((vm.distance % (1000 * 60)) / 1000)).slice(-2)
      :Math.floor((vm.distance % (1000 * 60)) / 1000);
    
      
    }, 1000);
  }
  ,beforeUpdate() {
      this.countDownDate = this.endTime
  },
}
 
 </script>

 <style scoped>
 @import url('https://fonts.googleapis.com/css?family=Orbitron');

#clock{
font-family: 'Orbitron', sans-serif;

}
 </style>
