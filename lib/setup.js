var nextTick = require("just-next-tick");
var dom = require("./dom");

module.exports = async;

function async (brick, embedding) {
  nextTick(function () {
    setup(brick, embedding);
  });
}

function setup (brick, embedding) {
  dom.setup(brick);

  if (!embedding.update && !embedding.show) {
    render(brick, function () {
      ready(brick, embedding);
    });
    return;
  }

  if (!embedding.update) {
    embedding.show();

    render(brick, function () {
      ready(brick, embedding);
    });

    return;
  }

  embedding.update(createUpdateCallback(brick, embedding));
}

function ready (brick, embedding) {
  if (!brick.onReady.publish) return;

  var onReady = brick.onReady;

  brick.onReady = function (fn) {
    fn(brick);
  };

  brick.onReady.subscribe = brick.onReady;

  if (embedding.ready) embedding.ready();

  console.log('%s is ready', brick.key);
  onReady.publish(brick);
}

function createUpdateCallback (brick, embedding) {
  return function (error) {
    if (error) return brick.onError.publish(error);

    if (embedding.show) embedding.show();

    render(brick, function () {
      console.log('throwing ready event for %s', brick.key);
      ready(brick, embedding);
    });
  };
}

function render (brick, callback) {
  waitAttachments(brick, function () {
    console.log('rendering %s', brick.key);
    dom.update(brick, callback);
  });
}

function waitAttachments (brick, callback) {
  var waiting = 0;

  var key, i;
  for (key in brick.attachments) {
    i = brick.attachments[key].length;

    while (i--) {
      wait(brick.attachments[key][i]);
    }
  }

  if (waiting == 0) {
    console.log('%s has nothing to wait', brick.key);
    callback();
  }

  function wait (attachment) {
    var locked;

    waiting++;

    console.log('%s waiting %d', brick.key, waiting);

    attachment.onReady(function () {
      if (locked) return;

      locked = true;

      console.log('%s waiting %d more', brick.key, waiting - 1);

      if (--waiting > 0) return;

      console.log('%s no more wait!!', brick.key);

      callback();
    });
  }
}
