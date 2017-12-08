export default {
  // input: 'nrttD1wzYOtFA5zhGipasOS9jewBmcSeS7JnfBQpNlRliYyKFoAwz8lzAC%2FHGqm1y%2F0wATZXQlFQcy74tYtTOONvw2dyXH7Tu1zaBhZa1kjAMBWE%2BJKJwM3in1nRKgV921GGyTHXlnFLEDSOjl0NU6PfJCe0pAw24vxJdKkVTu2HaZCyBpN%2FJY5oD5PKWIovaAk%3D',
  // input: 'msc38JRl%2FxA%2BGMd1zrnBjnJMQXG2yyVyGAwYsgwgn%2Bvosx6AweEE0eE1gRLmDpeXZJt9V8pAcC%2FlsuXodPqBbMz7HiziM6BaWcJ4FNCIpqun7yt3kWOo0jUbJ5o804Z2IPEVpJqcefh%2BAaYGtazq%2Fotv8uGL3tMJy7RoRNidjlgLgihYyBkrEE1mp1mBcfCVXV48w2Cld2Ftzr8%3D',
  input: '',
  ios: false,
  videoList: {},
  choose: null,
  uid: null,
  formatDate (time) {
    if (time < 10) {
      time = '0' + time
    }
    return time
  },
  calCountDown (distanceTime, cb) {
    var that = this
    var html
    var time = distanceTime
    if (distanceTime >= 0) {
      var intHour, intMinute, intSecond
      // intDay = Math.floor(distanceTime / 86400000)
      intHour = Math.floor(distanceTime / 3600000)
      distanceTime -= intHour * 3600000
      intMinute = Math.floor(distanceTime / 60000)
      distanceTime -= intMinute * 60000
      intSecond = Math.floor(distanceTime / 1000)

      html = that.formatDate(intHour) + ':' + that.formatDate(intMinute) + ':' + that.formatDate(intSecond)
      cb && cb(html)
      setTimeout(function () {
        that.calCountDown(time - 1000, cb)
      }, 1000)
    } else {
      html = ''
      cb && cb(html)
    }
  },
  getValue (key) {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      return user[key]
    }
    return false
  },
  logout () {
    let user = localStorage.getItem('user')
    if (user) {
      localStorage.removeItem('user')
    }
  }
}
