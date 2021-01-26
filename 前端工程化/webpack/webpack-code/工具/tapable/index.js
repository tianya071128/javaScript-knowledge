const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesLoopHook,
    AsyncSeriesWaterfallHook
 } = require("./lib");

 class Car {
    constructor() {
        this.hooks = {
            // syncHook: new SyncHook(["newSpeed"])
            // syncHook: new SyncBailHook(["newSpeed"])
            // syncHook: new SyncWaterfallHook(["newSpeed"])
            // syncHook: new SyncLoopHook(["newSpeed"]),
            // asyncHook: new AsyncParallelHook(["newSpeed"])
            asyncHook: new AsyncSeriesHook(["newSpeed"])
        };
    }

    setSpeed(newSpeed) {
        this.hooks.syncHook.promise(newSpeed);
    }

    setAsync(newSpeed) {
        this.hooks.asyncHook.callAsync(newSpeed);
    }
}

const myCar = new Car();
// myCar.hooks.syncHook.tap('myPlugin', (newSpeed) => console.log(newSpeed));

myCar.hooks.asyncHook.tapPromise('myPlugin', (newSpeed) => console.log(newSpeed));
myCar.hooks.asyncHook.tapAsync('myPlugin', (newSpeed) => console.log(newSpeed));
myCar.hooks.asyncHook.tapPromise('myPlugin', (newSpeed) => console.log(newSpeed));

myCar.setAsync('执行插件');