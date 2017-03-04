function asyncHandler (fn) {
  if (fn.length <= 3) {
    return function(req, res, next) {
      return fn(req, res, next).catch(next)
    }
  } else {
    return function(err, req, res, next) {
      return fn(err, req, res, next).catch(next)
    }
  }
}

function asyncify(expressApp) {
  ['get', 'put', 'post', 'delete'].forEach(function(method) {
    const original = expressApp[method]
    expressApp[method + 'Async'] = function(path, handler) {
      return original.call(expressApp, path, asyncHandler(handler))
    }
  })
  return expressApp
}

module.exports = asyncify
