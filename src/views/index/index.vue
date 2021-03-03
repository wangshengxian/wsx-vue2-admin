<!--
  首页
-->
<template>
  <div class="main-index">
    <div class="dataCard">
      <h4 class="welcome">欢迎，</h4>
      <cardBox :list="infoList" />
    </div>
  </div>
</template>

<script>
import cardBox from '@/components/cardBox'
export default {
  props: {},

  data() {
    return {
      infoList: [
        { txt: '在线人数1', number: 11 },
        { txt: '在线人数3', number: 33, bgColor: 'green' },
        { txt: '在线人数4', number: 44, bgColor: 'orange' },
        { txt: '在线人数5', number: 55, bgColor: 'red' },
        { txt: '在线人数6', number: 66, bgColor: 'gray' }
      ]
    }
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {},

  components: { cardBox }
}
</script>

<style lang="less" scoped>
@import '~@/assets/styles/variables';

.main-index {
  display: flex;
  flex-direction: column;

  .dataCard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 50px;

    .welcome {
      font-size: 32px;
    }
  }
}
</style>
