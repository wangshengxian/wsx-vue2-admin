<!--
  首页
-->
<template>
  <div class="main-index">
    <div class="dataCard">
      <h4 class="welcome">欢迎，</h4>
      <cardBox :list="infoList" />
    </div>
    <div class="mainWrap">
      <div class="groupBox">
        <p class="labelTxt">三级联动--动态获取数据:</p>
        <cascader v-model="cascaderVal" :options="cascaderList" />
      </div>
    </div>
  </div>
</template>

<script>
import cardBox from '@/components/cardBox'
import cascader from '@/components/cascader'
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
      ],
      cascaderVal: '',
      cascaderList: []
    }
  },
  computed: {},
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      let list = [
        { value: '1', label: '分类1', leaf: false, children: [] },
        { value: '2', label: '分类2', leaf: false, children: [] }
      ]
      this.cascaderVal = ['1', '11']
      this.cascaderList = list
    }
  },

  components: { cardBox, cascader }
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
    min-width: 1120px;
    padding-bottom: 50px;

    .welcome {
      font-size: 32px;
    }
  }
}

.mainWrap {
  .groupBox {
    display: flex;
    align-items: center;

    .labelTxt {
      margin-right: 10px;
    }
  }
}
</style>
