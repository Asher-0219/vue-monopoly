<template>
  <div id="app" v-cloak :class="{ios: ios}">
    <nav>
      <i class="fa fa-angle-left" @click="back"></i>
      <span class="title">{{title}}</span>
    </nav>
    <div class="containter">
      <div class="lead" :style="pos[seat]">
        <img src="../static/img/lead.png" alt="">
      </div>
      <!-- 背包按钮 -->
      <div class="backpack-btn" @click="backpack=true">
        <img src="../static/img/back.png" alt="">
      </div>
      <!-- 我的背包 -->
      <div class="cover" v-if="backpack">
        <div class="backpack-content">
          <div class="backpack-top">
            <div class="coupon">
              <img src="../static/img/coupon1.png" alt=""><span>x3</span>
            </div>
          </div>
          <div class="backpack-btn1" @click="backpack=false">
            <img src="../static/img/use.png" alt="">
          </div>
          <div class="backpack-btn2" @click="backpack=false">
            <img src="../static/img/back-home.png" alt="">
          </div>
        </div>
      </div>
      <!-- 掷骰子按钮 -->
      <div class="dice-btn" @click="dice">
        <span>2次</span>
      </div>
      <!-- 触发事件 -->
      <!-- 摇骰子 -->
      <div class="dice" v-if="diceActive">
        <img v-if="diceGif" class="dice-gif" src="../static/img/a.gif" alt="">
        <img v-if="diceResult" class="dice-num" :src="'../static/img/' + diceNum + '.png'" alt="">
      </div>
      <!-- 随机抽奖 -->
      <div class="cover" v-if="lotteryActive">
        <div class="lottery">
          <div class="lottery-content" @click="lottery">
            <div class="lottery-list">
              <div class="lottery-scroll">
                <div class="lottery-item" v-for="(item, index) in 5">
                  <img src="../static/img/free.png" alt="">
                </div>
                <div class="lottery-item" v-for="(item, index) in 5">
                  <img src="../static/img/free.png" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="lottery-btn" @click="lotteryActive=false">
            <img src="../static/img/close.png" alt="">
          </div>
          <!-- 中奖结果 -->
          <div class="lottery-result" v-if="resultActive" v-html="resultText"></div>
        </div>
      </div>
      <!-- 答题 -->
      <div class="cover" v-if="answerActive">
        <div class="answer">
          <div class="answer-award award">
            <img src="../static/img/reward1.png" alt="">
          </div>
          <div class="answer-content">
            <div class="answer-text">
              <p>在中国神话传说中,</p>
              <p>女娲的形象是人首什么动物身？</p>
            </div>
            <div class="answer-radios">
              <form action="">
                <label for="r1"><div><div v-if="answerRadio===1"></div></div><span>蛇</span></label>
                <label for="r2"><div><div v-if="answerRadio===2"></div></div><span>狐狸</span></label>
                <label for="r3"><div><div v-if="answerRadio===3"></div></div><span>猫</span></label>
                <input @click="answer(1)" :disabled="disabled" ref="radio1" type="radio" name="answer" id="r1">
                <input @click="answer(2)" :disabled="disabled" ref="radio2" type="radio" name="answer" id="r2">
                <input @click="answer(3)" :disabled="disabled" ref="radio3" type="radio" name="answer" id="r3">
              </form>
            </div>
            <div class="answer-result" v-if="answerResult">
              <img v-if="answerResultFlg" src="../static/img/answer-true.png" alt="">
              <img v-else src="../static/img/answer-false.png" alt="">
            </div>
          </div>
          <div class="answer-close" @click="answerActive=false">
            <img src="../static/img/close.png" alt="">
          </div>
        </div>
      </div>
      <!-- 猜拳 -->
      <div class="cover" v-if="moraActive">
        <div class="mora">
          <div class="mora-award award">
            <img src="../static/img/reward2.png" alt="">
          </div>
          <div class="mora-content">
            <div class="mora1">
              <img v-if="!moraAi && moraTab" class="mora-gif" src="../static/img/b.gif" alt="">
              <img v-if="moraAi && moraTab" class="icon" :class="'icon'+moraAi" :src="'../static/img/'+(moraAi)*11+'.png'" alt="">
            </div>
            <div class="mora2">
              <img v-if="moraTab" :class="'icon'+moraTab" class="icon" :src="'../static/img/'+(moraTab)*11+'.png'" alt="">
              <div v-if="moraResult" class="mora-result">
                <img v-if="moraResultFlag" class="mora-result" src="../static/img/mora-win.png" alt="">
                <img v-else class="mora-result" src="../static/img/mora-loser.png" alt="">
              </div>
            </div>
            <div class="mora3">
              <div class="mora-item" :class="moraTab===(index+1)?'active':''"  @click="chooseMora(index+1)" v-for="(item, index) in 3">
                <img :src="'../static/img/'+(index+1)*11+'.png'" alt="">
                <img class="mora-item-active" v-if="moraTab===(index+1)" src="../static/img/active.png" alt="">
              </div>
            </div>
          </div>
          <div class="mora-close" @click="moraActive=false">
            <img src="../static/img/close.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from './components/toast/toast.js'
import postion from './postion'
import $ from 'jquery'

export default {
  data () {
    return {
      title: '大富翁',
      ios: false,
      seat: 0, // 第几个格子
      pos: null, // 格子位置
      index: 1, // 走几步
      diceNum: 1, // 摇到的骰子数
      canDice: true, // 是否可以掷骰子
      diceActive: false, // 掷骰子
      diceGif: false, // 骰子动画
      diceResult: false, // 骰子结果
      backpack: false, // 背包
      lotteryActive: false, // 随机抽奖
      resultText: '', // 抽奖结果文字
      resultActive: false, // 抽奖结果显示
      lotteryWin: false, // 是否中奖
      answerActive: false, // 答题
      answerRadio: null, // 答题选项
      disabled: false, // 单选框是否禁用
      answerResult: false, // 答题结果显示
      answerResultFlg: false, // 答题结果对错
      moraActive: false, // 猜拳
      moraResult: false, // 猜拳结果显示
      moraResultFlag: false, // 猜拳结果
      moraTab: null, // 猜拳选择
      moraAi: null // 系统猜拳
    }
  },
  name: 'app',
  methods: {
    back (id) {
      if (this.$route.path !== '/') {
        this.$router.go(-1)
      } else {
        window.open('http://xys/xys_force_back')
      }
    },
    dice () {
      // 掷骰子
      if (!this.canDice) return
      this.canDice = false
      this.diceActive = true
      this.diceResult = false
      this.diceGif = true
      this.diceNum = Math.ceil(Math.random() * 6)
      this.index = 1
      setTimeout(() => {
        this.diceGif = false
        this.diceResult = true
        this.canDice = true
        setTimeout(() => {
          this.move()
          this.diceActive = false
        }, 1000)
      }, 2000)
    },
    move () {
      // 人物移动
      let time = setInterval(() => {
        this.seat++
        this.index++
        if (this.index > this.diceNum) {
          clearInterval(time)
        }
      }, 1000)
    },
    lottery () {
      // 抽奖
      var flag = false
      var TextNum2
      if (!flag) {
        flag = true
        reset()
        letGo()
        setTimeout(() => {
          flag = false
          this.resultActive = true
          if (this.lotteryWin) {
            this.resultText = '恭喜你!<br/>奖品已经放入背包'
          } else {
            this.resultText = '很遗憾，<br/>再接再厉吧～'
          }
          setTimeout(() => {
            this.resultActive = false
          }, 2000)
        }, 3000)
      }
      function letGo () {
        // 转动抽奖
        TextNum2 = parseInt(Math.random() * $('.lottery-item').length)
        var num2 = -1.32 * TextNum2 + 0.4 + 'rem'
        $('.lottery-scroll').animate({'top': '-6rem'}, 1000, 'linear', function () {
          $(this).css('top', '-0.75rem').animate({'top': num2}, 1800, 'linear')
        })
      }
      function reset () {
        // 重置位置
        $('.lottery-scroll').css({'top': '-0.75rem'})
      }
    },
    answer (index) {
      // 答题
      if (index === this.answerRadio) return
      this.answerRadio = index
      this.disabled = true
      this.answerResult = true
    },
    chooseMora (index) {
      // 猜拳
      if (!this.moraTab) {
        this.moraTab = index
        setTimeout(() => {
          this.moraAi = Math.ceil(Math.random() * 3)
        }, 2000)
      }
    }
  },
  created () {
    this.pos = postion.postion
    if (/iphone/ig.test(navigator.appVersion)) {
      this.ios = true
    }
    let args = location.search.replace('?', '').split('=')
    if (args[0] === 'input') {
      this.$xys.input = args[1]
    } else {
      Toast('请重新登录或在App打开')
    }
  },
  mounted () {
    // console.log(this.$refs.radio1.checked)
  }
}
</script>

<style lang="stylus">
@import './common/styl/base.styl';

nav-height = 48px;

[v-cloak] {
  display: none;
}
$center() {
  margin auto
  top 0
  bottom 0
  left 0
  right 0
}
#app
  padding-top: nav-height
  overflow auto
  &.ios
    padding-top: 0
    nav
      display: none
nav {
  z-index: 5;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: nav-height;
  border-bottom: 1px solid #d1d1d1;
  text-align: center;
  background-color: #fafafa;

  .fa {
    position: absolute;
    left: 0.2rem;
    top: 0;
    width: 0.48rem;
    height: 100%;
    font-size: 32px;
    line-height: nav-height;
  }

  .title {
    display: block;
    height: 100%;
    margin: 0 auto;
    font-size: 0.32rem;
    line-height: nav-height;
    font-weight bold
  }
}
.containter
  width 15.5rem
  height 13.34rem
  background-image url('../static/img/bg.png')
  background-repeat no-repeat
  background-size 100% 100%
  position relative
.lead
  width 1.14rem
  height 1.25rem
  position absolute
  transition all 1s ease
  z-index 9
  img
    width 100%
    height 100%
.dice
  width 7.5rem
  height 3.19rem
  background rgba(0,0,0,0.8)
  position fixed
  $center()
  z-index 10
.cover
  position fixed
  $center()
  background rgba(0,0,0,0.7)
  z-index 11
.dice-gif
  width 2.97rem
  height 2.66rem
  position absolute
  $center()
.dice-num
  width 1.15rem
  height 1.12rem
  position absolute
  $center()
.dice-btn
  width 3.21rem
  height 1.05rem
  position fixed
  left 0
  right 0
  bottom 0.5rem
  margin 0 auto
  line-height 1.05rem
  color #ff4747
  font-size 0.65rem
  background-image url('../static/img/number.png')
  background-size 100% 100%
  font-weight bold
  span
    margin-left 1.6rem
  img
    width 100%
    height 100%
.backpack-btn
  width 1.33rem
  height 1.33rem
  position fixed
  right 0.28rem
  top 0.36rem
  img
    width 100%
    height 100%
.backpack-content
  position absolute
  $center()
  display flex
  flex-direction column
  align-items center
  height 8.3rem
  .backpack-top
    border 0.13rem solid #ffffff
    border-radius 0.05rem
    background-color rgb(243, 197, 197)
    width 4.62rem
    height 5.40rem
    display flex
    flex-direction column
    overflow auto
    .coupon
      margin-left 0.5rem
      margin-top 0.3rem
      img
        display inline-block
        width 3.3rem
        height 1.26rem
        margin-right 0.14rem
      span
        color #303030
        font-size 0.35rem
  .backpack-btn1,.backpack-btn2
    width 2.78rem
    height 0.69rem
    img
      width 100%
      height 100%
  .backpack-btn1
    margin-top 0.7rem
    margin-bottom 0.42rem
.lottery
  height 6.8rem
  display flex
  flex-direction column
  align-items center
  position absolute
  $center()
  .lottery-content
    width 4.44rem
    height 5.51rem
    margin-bottom 0.47rem
    background-image url('../static/img/random.png')
    background-size 100% 100%
    .lottery-list
      margin 0 auto
      margin-top 0.7rem
      width 3.65rem
      height 2.37rem
      overflow auto
      position relative
  .lottery-btn
    width 0.66rem
    height 0.66rem
.lottery-scroll
  position relative
  top -0.8rem
.lottery-item
  width 3.29rem
  height 1.27rem
  margin auto
  margin-bottom 0.05rem
  img
    width 100%
    height 100%
.lottery-result
  border-radius 0.05rem
  background rgba(0,0,0,0.8)
  position absolute
  width 3.21rem
  height 1.91rem
  top 0.86rem
  left 0
  right 0
  margin 0 auto
  color #ffffff
  font-size 0.24rem
  text-align center
  padding-top 0.66rem
  box-sizing border-box
.answer
  height 7rem
  position absolute
  $center()
  display flex
  flex-direction column
  align-items center
  .answer-content
    width 4.75rem
    height 3.76rem
    margin-bottom 0.54rem
    background-image url('../static/img/ans.png')
    background-size 100% 100%
    padding-left 0.49rem
    box-sizing border-box
    position relative
    .answer-text
      color #303030
      font-size 0.28rem
      font-weight bold
      margin-top 1.3rem
      margin-bottom 0.2rem
    .answer-result
      width 1.86rem
      height 1.08rem
      position absolute
      right 0.06rem
      bottom 0.27rem
      img
        width 100%
        height 100%
        object-fit cover
  .answer-close
    width 0.66rem
    height 0.66rem
    img
      width 100%
      height 100%
form
  display flex
  align-items center
label
  display flex
  align-items center
  margin-right 0.4rem
  color #7f7f7f
  font-size 0.28rem
  &>div
    border-radius 50%
    border 0.03rem solid rgb(127,127,127)
    width 0.18rem
    height 0.18rem
    margin-right 0.12rem
    position relative
    &>div
      width 0.12rem
      height 0.12rem
      position absolute
      $center()
      border-radius 50%
      background-color rgb(255, 156, 0)
input
  opacity 0
.mora
  display flex
  flex-direction column
  align-items center
  height 9.1rem
  position absolute
  $center()
  .mora-content
    width 5.78rem
    height 5.84rem
    margin-bottom 0.56rem
    .mora1
      background #936fe9
      border-top-left-radius 0.1rem
      border-top-right-radius 0.1rem
    .mora2
      background #e94c78
    .mora3
      background #f5cb2c
      border-bottom-left-radius 0.1rem
      border-bottom-right-radius 0.1rem
      justify-content space-between
      padding 0 0.26rem
      box-sizing border-box
    .mora-item
      border-radius 0.15rem
      width 1.33rem
      height 1.33rem
      background #ffffff
      position relative
      box-shadow 0.04rem 0.04rem 0 #e5e5e5
      img:nth-child(1)
        position absolute
        $center()
      img:nth-child(2)
        position absolute
        top -0.13rem
        right -0.12rem
        width 0.47rem
        height 0.48rem
    .mora-item:nth-child(2) img:nth-child(1)
      width 1.05rem
      height 0.85rem
    .mora-item:nth-child(1) img:nth-child(1)
      width 0.98rem
      height 0.88rem
    .mora-item:nth-child(3) img:nth-child(1)
      width 0.92rem
      height 0.9rem
    .mora-gif
      width 3.16rem
      height 3.16rem
      margin-left 1.1rem
      margin-top 0.5rem
    &>div
      width 100%
      height 33.3333%
      display flex
      align-items center
      .icon
        margin-left 1.9rem
        margin-right 0.12rem
      .icon1
        width 1.55rem
        height 1.39rem
      .icon2
        width 1.43rem
        height 1.16rem
      .icon3
        width 1.39rem
        height 1.36rem
      .mora-result
        width 2.01rem
        height 1.17rem
  .mora-close
    width 0.66rem
    height 0.66rem
    img
      width 100%
      height 100%
.award
  width 3.81rem
  height 1.2rem
  align-self flex-end
  margin-bottom 0.8rem
</style>
