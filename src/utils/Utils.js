export default {
  sizeToStr: size => {
    var data = ''
    if (size < 0.1 * 1024) {
      data = size.toFixed(2) + 'B'
    } else if (size < 0.1 * 1024 * 1024) {
      data = (size / 1024).toFixed(2) + 'KB'
    } else if (size < 0.1 * 1024 * 1024 * 1024) {
      data = (size / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }
    var sizeStr = data + ''
    var len = sizeStr.indexOf('.')
    var dec = sizeStr.substr(len + 1, 2)
    if (dec == '00') {
      return sizeStr.substring(0, len) + sizeStr.substr(len + 3, 3)
    }
    return sizeStr
  }
}
