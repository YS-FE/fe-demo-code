const fs = require('fs');
const asyncHooks = require('async_hooks');

class MyResource extends asyncHooks.AsyncResource {
  constructor() {
    super('my-resource');
  }

  asyncMethod(callback) {
    this.runInAsyncScope(callback, null, 'todo');
  }

  close() {
    this.emitDestroy();
  }
}


/**
 * 追踪 函数调用
 */
const hook = asyncHooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    fs.writeSync(1, `init: asyncId-${asyncId}, type-${type}, triggerAsyncId-${triggerAsyncId}\n`);
  },
  before(asyncId) {
    fs.writeSync(1, `before: asyncId-${asyncId}\n`);
  },
  after(asyncId) {
    fs.writeSync(1, `after: asyncId-${asyncId}\n`);
  },
  destroy(asyncId) {
    fs.writeSync(1, `destroy: asyncId-${asyncId}\n`);
  }
});

hook.enable();

let resource = new MyResource();
resource.asyncMethod((arg) => {
  console.log("arg = ", arg);
});

resource.close();

// hook.disable();