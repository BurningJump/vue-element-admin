export function parseFunctionName(varString) {
  var funName = varString
  if (varString != null && varString.indexOf(':') > 0) {
    var s = varString.split(':')
    funName = s[0]
  }
  return funName
}

export function parseFunctionParams(varString) {
  var params = null
  if (varString != null && varString.indexOf(':') > 0) {
    var s = varString.split(':')
    params = s[1].split(',')
  }
  return params
}
