## REPL模块热加载命令行工具

使用方法:

**load(module_name)**

加载模块，module_name为模块名，
若module_name为**/aa/bb/cc-dd.js**,
需要用**ccDd(将-d替换成D)**对象调用其属性或方法。

用法如下:
```sh
> load('express');
undefined
> express.     //按tab
express.__defineGetter__      express.__defineSetter__
express.__lookupGetter__      express.__lookupSetter__
express.__proto__             express.constructor
express.hasOwnProperty        express.isPrototypeOf
express.propertyIsEnumerable  express.toLocaleString
express.toString              express.valueOf
...
```

**reload(module_name)**

重新加载模块，该方法会清空模块缓存后重新加载模块，以达到热加载的目的。

用法如下:
```sh
> reload('express');
reload success, use time: 1ms
```

**clear(module_name)**

清除模块缓存。

用法如下:
```sh
> clear('express');
> express   //回车
ReferenceError: express is not defined          //因为express缓存被清空了
    at repl:1:1
    at REPLServer.defaultEval (repl.js:274:27)
    at bound (domain.js:280:14)
    at REPLServer.runBound [as eval] (domain.js:293:12)
    at REPLServer.<anonymous> (repl.js:441:10)
    at emitOne (events.js:96:13)
    at REPLServer.emit (events.js:188:7)
    at REPLServer.Interface._onLine (readline.js:224:10)
    at REPLServer.Interface._line (readline.js:566:8)
    at REPLServer.Interface._ttyWrite (readline.js:843:14)
```