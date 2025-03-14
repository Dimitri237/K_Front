<template>
  <div class="splash-screen">
    <h1 class="animate__animated animate__fadeInDown">K_RELLE</h1>
    <h2 class="animate__animated animate__fadeInUp">Scanner</h2>

  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push('/login');
    }, 5000);
  },
};
</script>

<style scoped>
.splash-screen {
  height: 100vh; 
  width: 100%;
  margin-top: 35vh;
}
h1{
  color: #4CAF50;
  font-size: 100px;
  width: 100%;
  text-align: center;
  font-family: Montserrat, sans-serif;
  margin-top: 200px;
}
h2{
  color: black;
  font-size: 50px;
  width: 100%;
  text-align: center;
  font-family: Montserrat, sans-serif;
}
</style>