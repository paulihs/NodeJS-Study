koa2中间件需要是一个async函数，如果传入的是一个generator函数的话，koa2会使用koa-convert将generator转换成async函数。

编写koa2中间件可以使用如下方式：
```javascript
function log( ctx ) {
    console.log( ctx.method, ctx.header.host + ctx.url )
}

module.exports = function () {
  return async function ( ctx, next ) {
    log(ctx);
    await next()
  }
}
```
koa-router



```javascript


var debug = require('debug')('koa-router');
var compose = require('koa-compose');
var HttpError = require('http-errors');
var methods = require('methods');
var Layer = require('./layer');



module.exports = Router;



function Router(opts) {
  if (!(this instanceof Router)) {
    return new Router(opts);
  }
  //  入参
  this.opts = opts || {};
  //  
  this.methods = this.opts.methods || [
    'HEAD',
    'OPTIONS',
    'GET',
    'PUT',
    'PATCH',
    'POST',
    'DELETE'
  ];

  this.params = {};
  this.stack = [];
}




for (var i = 0; i < methods.length; i++) {
  function setMethodVerb(method) {
    Router.prototype[method] = function(name, path, middleware) {
      var middleware;

      if (typeof path === "string" || path instanceof RegExp) {
        middleware = Array.prototype.slice.call(arguments, 2);
      } else {
        middleware = Array.prototype.slice.call(arguments, 1);
        path = name;
        name = null;
      }

      this.register(path, [method], middleware, {
        name: name
      });

      return this;
    };
  }
  setMethodVerb(methods[i]);
}

// Alias for `router.delete()` because delete is a reserved word
Router.prototype.del = Router.prototype['delete'];


 //  第一个参数为路径（path）

Router.prototype.use = function () {
   // 实例
  var router = this;
  // copy arguments
  var middleware = Array.prototype.slice.call(arguments);

  var path;

  // support array of paths
  if (Array.isArray(middleware[0]) && typeof middleware[0][0] === 'string') {
    var arrPaths = middleware[0];
    for (var i = 0; i < arrPaths.length; i++) {
      var p = arrPaths[i];
      router.use.apply(router, [p].concat(middleware.slice(1)));
    }
    return this;
  }

  var hasPath = typeof middleware[0] === 'string';
  if (hasPath) {
    path = middleware.shift();
  }

  for (var i = 0; i < middleware.length; i++) {
    var m = middleware[i];
    if (m.router) {
      var cloneRouter = Object.assign(Object.create(Router.prototype), m.router, {
        stack: m.router.stack.slice(0)
      });

      for (var j = 0; j < cloneRouter.stack.length; j++) {
        var nestedLayer = cloneRouter.stack[j];
        var cloneLayer = Object.assign(
          Object.create(Layer.prototype),
          nestedLayer
        );

        if (path) cloneLayer.setPrefix(path);
        if (router.opts.prefix) cloneLayer.setPrefix(router.opts.prefix);
        router.stack.push(cloneLayer);
        cloneRouter.stack[j] = cloneLayer;
      }

      if (router.params) {
        function setRouterParams(paramArr) {
          var routerParams = paramArr;
          for (var j = 0; j < routerParams.length; j++) {
            var key = routerParams[j];
            cloneRouter.param(key, router.params[key]);
          }
        }
        setRouterParams(Object.keys(router.params));
      }
    } else {
      router.register(path || '(.*)', [], m, { end: false, ignoreCaptures: !hasPath });
    }
  }

  return this;
};



Router.prototype.prefix = function (prefix) {
  prefix = prefix.replace(/\/$/, '');

  this.opts.prefix = prefix;

  for (var i = 0; i < this.stack.length; i++) {
    var route = this.stack[i];
    route.setPrefix(prefix);
  }

  return this;
};



Router.prototype.routes = Router.prototype.middleware = function () {
  var router = this;

  var dispatch = function dispatch(ctx, next) {
    // debug('%s %s', ctx.method, ctx.path);

    var path = router.opts.routerPath || ctx.routerPath || ctx.path;
    var matched = router.match(path, ctx.method);
    var layerChain, layer, i;

    if (ctx.matched) {
      ctx.matched.push.apply(ctx.matched, matched.path);
    } else {
      ctx.matched = matched.path;
    }

    ctx.router = router;

    if (!matched.route) return next();

    var matchedLayers = matched.pathAndMethod;
    var mostSpecificLayer = matchedLayers[matchedLayers.length - 1];
    ctx._matchedRoute = mostSpecificLayer.path;
    if (mostSpecificLayer.name) {
      ctx._matchedRouteName = mostSpecificLayer.name;
    }

    layerChain = matchedLayers.reduce(function(memo, layer) {
      memo.push(function(ctx, next) {
        ctx.captures = layer.captures(path, ctx.captures);
        ctx.params = layer.params(path, ctx.captures, ctx.params);
        ctx.routerName = layer.name;
        return next();
      });
      return memo.concat(layer.stack);
    }, []);

    return compose(layerChain)(ctx, next);
  };

  dispatch.router = this;

  return dispatch;
};



Router.prototype.allowedMethods = function (options) {
  options = options || {};
  var implemented = this.methods;

  return function allowedMethods(ctx, next) {
    return next().then(function() {
      var allowed = {};

      if (!ctx.status || ctx.status === 404) {
        for (var i = 0; i < ctx.matched.length; i++) {
          var route = ctx.matched[i];
          for (var j = 0; j < route.methods.length; j++) {
            var method = route.methods[j];
              allowed[method] = method
          }
        }

        var allowedArr = Object.keys(allowed);

        if (!~implemented.indexOf(ctx.method)) {
          if (options.throw) {
            var notImplementedThrowable;
            if (typeof options.notImplemented === 'function') {
              notImplementedThrowable = options.notImplemented(); // set whatever the user returns from their function
            } else {
              notImplementedThrowable = new HttpError.NotImplemented();
            }
            throw notImplementedThrowable;
          } else {
            ctx.status = 501;
            ctx.set('Allow', allowedArr.join(', '));
          }
        } else if (allowedArr.length) {
          if (ctx.method === 'OPTIONS') {
            ctx.status = 200;
            ctx.body = '';
            ctx.set('Allow', allowedArr.join(', '));
          } else if (!allowed[ctx.method]) {
            if (options.throw) {
              var notAllowedThrowable;
              if (typeof options.methodNotAllowed === 'function') {
                notAllowedThrowable = options.methodNotAllowed(); // set whatever the user returns from their function
              } else {
                notAllowedThrowable = new HttpError.MethodNotAllowed();
              }
              throw notAllowedThrowable;
            } else {
              ctx.status = 405;
              ctx.set('Allow', allowedArr.join(', '));
            }
          }
        }
      }
    });
  };
};



Router.prototype.all = function (name, path, middleware) {
  var middleware;

  if (typeof path === 'string') {
    middleware = Array.prototype.slice.call(arguments, 2);
  } else {
    middleware = Array.prototype.slice.call(arguments, 1);
    path = name;
    name = null;
  }

  this.register(path, methods, middleware, {
    name: name
  });

  return this;
};



Router.prototype.redirect = function (source, destination, code) {
  // lookup source route by name
  if (source[0] !== '/') {
    source = this.url(source);
  }

  // lookup destination route by name
  if (destination[0] !== '/') {
    destination = this.url(destination);
  }

  return this.all(source, ctx => {
    ctx.redirect(destination);
    ctx.status = code || 301;
  });
};



Router.prototype.register = function (path, methods, middleware, opts) {
  opts = opts || {};

  var router = this;
  var stack = this.stack;

  // support array of paths
  if (Array.isArray(path)) {
    for (var i = 0; i < path.length; i++) {
      var curPath = path[i];
      router.register.call(router, curPath, methods, middleware, opts);
    }

    return this;
  }

  // create route
  var route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
    ignoreCaptures: opts.ignoreCaptures
  });

  if (this.opts.prefix) {
    route.setPrefix(this.opts.prefix);
  }

  // add parameter middleware
  for (var i = 0; i < Object.keys(this.params).length; i++) {
    var param = Object.keys(this.params)[i];
    route.param(param, this.params[param]);
  }

  stack.push(route);

  return route;
};


Router.prototype.route = function (name) {
  var routes = this.stack;

  for (var len = routes.length, i=0; i<len; i++) {
    if (routes[i].name && routes[i].name === name) {
      return routes[i];
    }
  }

  return false;
};



Router.prototype.url = function (name, params) {
  var route = this.route(name);

  if (route) {
    var args = Array.prototype.slice.call(arguments, 1);
    return route.url.apply(route, args);
  }

  return new Error("No route found for name: " + name);
};

/**
 * Match given `path` and return corresponding routes.
 *
 * @param {String} path
 * @param {String} method
 * @returns {Object.<path, pathAndMethod>} returns layers that matched path and
 * path and method.
 * @private
 */

Router.prototype.match = function (path, method) {
  var layers = this.stack;
  var layer;
  var matched = {
    path: [],
    pathAndMethod: [],
    route: false
  };

  for (var len = layers.length, i = 0; i < len; i++) {
    layer = layers[i];

    debug('test %s %s', layer.path, layer.regexp);

    if (layer.match(path)) {
      matched.path.push(layer);

      if (layer.methods.length === 0 || ~layer.methods.indexOf(method)) {
        matched.pathAndMethod.push(layer);
        if (layer.methods.length) matched.route = true;
      }
    }
  }

  return matched;
};



Router.prototype.param = function(param, middleware) {
  this.params[param] = middleware;
  for (var i = 0; i < this.stack.length; i++) {
    var route = this.stack[i];
    route.param(param, middleware);
  }

  return this;
};


Router.url = function (path) {
    var args = Array.prototype.slice.call(arguments, 1);
    return Layer.prototype.url.apply({ path: path }, args);
};
```
