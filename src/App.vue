<template>
  <div id="app" v-cloak :class="{ios: ios}">
    <nav>
      <i class="fa fa-angle-left" @click="back"></i>
      <span class="title">{{title}}</span>
    </nav>
    <div class="containter" :style="bg">
      <div class="lead" :style="pos[seat]">
        <img :src="info.avatar" alt="">
      </div>
      <!-- 背包按钮 -->
      <div class="backpack-btn" @click="backpack=true">
        <img src="../static/img/back.png" alt="">
      </div>
      <!-- 我的背包 -->
      <div class="cover" v-if="backpack">
        <div class="backpack-content">
          <div class="backpack-top">
            <div class="coupon" v-for="(item, index) in myList">
              <img :src="'../static/img/coupon'+(item.ind+1)+'.png'" alt=""><span>x{{item.num}}</span>
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
        <span>{{info.todayTimes}}次</span>
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
                <div class="lottery-item" v-for="(item, index) in 9">
                  <img :src="'../static/img/coupon'+(index+1)+'.png'" alt="">
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
              <p>{{answer.title}}</p>
            </div>
            <div class="answer-radios">
              <div class="labels">
                <label for="r1"><div><div v-if="answerRadio===1"></div></div><span>{{answer.otherData[0]}}</span></label>
                <label for="r2"><div><div v-if="answerRadio===2"></div></div><span>{{answer.otherData[1]}}</span></label>
                <label for="r3"><div><div v-if="answerRadio===3"></div></div><span>{{answer.otherData[2]}}</span></label>
                <label for="r4"><div><div v-if="answerRadio===4"></div></div><span>{{answer.otherData[3]}}</span></label>
              </div>
              <form action="">              
                <input @click="answerClick(1)" :disabled="disabled" ref="radio1" type="radio" name="answer" id="r1">
                <input @click="answerClick(2)" :disabled="disabled" ref="radio2" type="radio" name="answer" id="r2">
                <input @click="answerClick(3)" :disabled="disabled" ref="radio3" type="radio" name="answer" id="r3">
                <input @click="answerClick(4)" :disabled="disabled" ref="radio4" type="radio" name="answer" id="r4">
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
                <img v-if="moraResultFlag===1" class="mora-result" src="../static/img/mora-win.png" alt="">
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
      <!-- 飓风回到原点 -->
      <div class="cover" v-if="wind" @click="closeWind">
        <div class="wind">
          <div class="wind-text">
            <img src="../static/img/wind2.png" alt="">
          </div>
        </div>
      </div>
      <div class="cover" v-if="couponActive" @click="closeCoupon">
        <div class="coupons">
          <img v-if="couponId===108" src="../static/img/coupon8.png" alt="">
          <img v-if="couponId===109" src="../static/img/coupon9.png" alt="">
          <img v-if="couponId===110" src="../static/img/coupon2.png" alt="">
          <img v-if="couponFree" src="../static/img/coupon7.png" alt="">
        </div>
      </div>
      <div class="point" @click="point=true">
        <img src="../static/img/point.png" alt="">
      </div>
      <div v-if="point" class="point-content">
        <div @click.stop="point=false" class="point-close"><img src="../static/img/x.png" alt=""></div>
        <div>获取骰子的途径：<br>商城下单并在线付款订单（已付款）<br>可获得一次摇骰子的机会<br>每日自动刷新2次摇骰子的机会<br>（就算剩一个，第二天还是两个)</div>
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
      answer: {title: '', otherData: [], otherId: 0}, // 答题题目
      disabled: false, // 单选框是否禁用
      answerResult: false, // 答题结果显示
      answerResultFlg: null, // 答题结果对错
      moraActive: false, // 猜拳
      moraResult: false, // 猜拳结果显示
      moraResultFlag: null, // 猜拳结果
      moraTab: null, // 猜拳选择
      moraAi: null, // 系统猜拳
      info: {}, // 用户信息
      diceType: null, // 出发事件
      wind: false, // 飓风
      lotteryFlg: false, // 能否抽奖
      page: 1, // 背包页数
      myList: [], // 我的背包
      couponActive: false, // 抽到优惠卷
      couponId: null, // 抽到优惠卷ID
      couponFree: null, // 抽到包邮卷
      bg: {backgroundImage: 'url(' + require('../static/img/bg.png') + ')'},
      point: false
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
    closeWind () {
      this.wind = false
      this.seat = 0
    },
    closeCoupon () {
      this.couponActive = false
    },
    getInfo () {
      // 获取个人信息
      this.$http.post('/html.php?input=' + this.$xys.input, {
        action: 'monopoly_step',
        type: 1
      }).then(res => {
        let data = res.data
        if (parseInt(data.status) === 1) {
          this.info = data.data
          this.seat = data.data.nowStep - 1
          this.canDice = true
        } else {
          this.canDice = false
        }
      })
    },
    dice () {
      // 掷骰子
      if (!this.canDice) return

      this.$http.post('/html.php?input=' + this.$xys.input, {
        action: 'monopoly_step',
        type: 0
      }).then(res => {
        let data = res.data
        if (parseInt(data.status) === 1) {
          this.initGame()
          this.canDice = false
          this.diceActive = true
          this.diceResult = false
          this.diceGif = true
          this.info.todayTimes--
          this.diceNum = data.data.step
          this.index = 1
          this.diceType = data.data.action

          // 答题
          if (data.data.title) {
            this.answer.title = data.data.title
          }
          if (data.data.otherData) {
            for (const key in data.data.otherData) {
              if (data.data.otherData.hasOwnProperty(key)) {
                this.answer.otherData.push(data.data.otherData[key])
              }
            }
          }
          if (data.data.otherId) {
            this.answer.otherId = data.data.otherId
            this.couponId = data.data.otherId
          }
          setTimeout(() => {
            this.diceGif = false
            this.diceResult = true
            setTimeout(() => {
              this.move()
              this.diceActive = false
            }, 1000)
          }, 2000)
        } else {
          Toast('次数已用完')
        }
      })
    },
    move () {
      // 人物移动
      let time = setInterval(() => {
        this.seat++
        this.index++
        if (this.index > this.diceNum) {
          clearInterval(time)
          setTimeout(() => {
            this.canDice = true
            switch (parseInt(this.diceType)) {
              case 1:
                this.lotteryActive = true
                break
              case 2:
                this.moraActive = true
                break
              case 3:
                this.answerActive = true
                break
              case 4:
                this.wind = true
                this.info.todayTimes++
                break
              case 5:
                this.couponActive = true
                this.couponFree = true
                break
              case 6:
                this.couponActive = true
                break
              default:
                break
            }
          }, 1000)
        }
      }, 1000)
    },
    lottery () {
      // 抽奖
      var that = this
      var TextNum2 = 0
      if (this.lotteryFlg) return
      this.lotteryFlg = true
      reset()
      letGo()
      setTimeout(() => {
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
      function letGo () {
        // 转动抽奖
        that.$http.post('/html.php?input=' + that.$xys.input, {
          action: 'monopoly_lottery'
        }).then(res => {
          let data = res.data
          if (parseInt(data.status) === 1) {
            that.lotteryWin = true
            switch (parseInt(data.data)) {
              case 107:
                TextNum2 = 7
                break
              case 108:
                TextNum2 = 9
                break
              case 109:
                TextNum2 = 8
                break
              case 110:
                TextNum2 = 2
                break
              case 111:
                TextNum2 = 6
                break
              case 112:
                TextNum2 = 5
                break
              case 113:
                TextNum2 = 4
                break
              case 114:
                TextNum2 = 3
                break
              case 1:
                TextNum2 = 1
                that.lotteryWin = false
                break
              default:
                break
            }
            var num2 = -1.32 * (TextNum2 - 1) + 0.4 + 'rem'
            $('.lottery-scroll').animate({'top': '-6rem'}, 1000, 'linear', function () {
              $(this).css('top', '-0.75rem').animate({'top': num2}, 1800, 'linear')
            })
          }
        })
      }
      function reset () {
        // 重置位置
        $('.lottery-scroll').css({'top': '-0.75rem'})
      }
    },
    answerClick (index) {
      // 答题
      if (index === this.answerRadio) return
      this.answerRadio = index
      this.disabled = true
      var answerRe = ''
      switch (index) {
        case 1:
          answerRe = 'A'
          break
        case 2:
          answerRe = 'B'
          break
        case 3:
          answerRe = 'C'
          break
        case 4:
          answerRe = 'D'
          break
        default:
          break
      }
      this.$http.post('/html.php?input=' + this.$xys.input, {
        action: 'monopoly_answer',
        answerId: this.answer.otherId,
        answerRe: answerRe
      }).then(res => {
        let data = res.data
        this.answerResult = true
        if (parseInt(data.status) === 1) {
          this.answerResultFlg = true
          this.answerActive = false
          this.lotteryActive = true
        } else {
          this.answerResultFlg = false
        }
      })
    },
    chooseMora (index) {
      // 猜拳
      if (!this.moraTab) {
        this.moraTab = index
        this.$http.post('/html.php?input=' + this.$xys.input, {
          action: 'monopoly_morra',
          type: index
        }).then(res => {
          let data = res.data
          if (parseInt(data.status) === 1) {
            setTimeout(() => {
              this.moraAi = data.data.sysType
              this.moraResult = true
              this.moraResultFlag = data.data.iswin
              if (parseInt(data.data.iswin) === 1) {
                this.info.todayTimes++
                this.lotteryFlg = false
              }
            }, 2000)
          }
        })
      }
    },
    initGame () {
      this.answerRadio = null
      this.moraTab = null
      this.moraResult = null
      this.answerResult = null
      this.moraAi = null
      this.disabled = false
      this.couponFree = null
      this.couponId = null
      this.lotteryFlg = false
      this.answer = {title: '', otherData: [], otherId: 0}
    },
    getMylist () {
      // 获取背包信息
      this.$http.post('/html.php?input=' + this.$xys.input, {
        action: 'monopoly_mylist',
        page: this.page
      }).then(res => {
        let data = res.data
        if (parseInt(data.status) === 1) {
          data.data.forEach((v, i) => {
            switch (parseInt(v.tid)) {
              case 107:
                v.ind = 7
                break
              case 108:
                v.ind = 9
                break
              case 109:
                v.ind = 8
                break
              case 110:
                v.ind = 2
                break
              case 111:
                v.ind = 6
                break
              case 112:
                v.ind = 5
                break
              case 113:
                v.ind = 4
                break
              case 114:
                v.ind = 3
                break
              default:
                break
            }
          })
          this.myList = data.data
        }
      })
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
    this.getInfo()
    this.getMylist()
  },
  watch: {
    seat () {
      if (this.seat > 92) {
        this.seat = 0
      }
    }
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
  z-index: 10;
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
  background-repeat no-repeat
  background-size 100% 100%
  position relative
.lead
  width 1.14rem
  height 1.25rem
  position absolute
  transition all 1s ease
  z-index 9
  background-image url('../static/img/lead.png')
  background-size 100% 100%
  img
    width 0.88rem
    height 0.88rem
    position absolute
    left 0
    right 0
    top 0.13rem
    margin auto
    border-radius 50%
    object-fit cover
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
    margin-left 1.4rem
  img
    width 100%
    height 100%
.backpack-btn
  width 1.33rem
  height 1.33rem
  position fixed
  right 0.28rem
  top calc(0.36rem+1.33rem)
  img
    width 100%
    height 100%
.ios .backpack-btn
  top 0.36rem
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
      height 1.27rem
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
  height 8rem
  position absolute
  $center()
  display flex
  flex-direction column
  align-items center
  .answer-content
    width 4.75rem
    height 4rem
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
      margin-top 1rem
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
.wind
  .wind-text
    width 3.37rem
    height 0.73rem
    position absolute
    top 2.28rem
    left 0
    right 0
    margin auto
.coupons
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  margin auto
  width 3.29rem
  height 1.27rem
  img
    width 100%
    height 100%
.point
  position fixed
  left 1.6rem
  bottom 0.84rem
  width 0.37rem
  height 0.37rem
.point-content
  border-radius 0.1rem
  background-color rgb(255, 255, 255)
  width 4.8rem
  height 3.41rem
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  margin auto
  color #2e2e2e
  font-size 0.28rem
  text-align center
  padding-top 0.64rem
  box-sizing border-box
  .point-close
    width 0.5rem
    height 0.5rem
    position absolute
    top 0.13rem
    right 0.13rem
    img
      width 0.17rem
      height 0.16rem
      margin-left 0.27rem
</style>
