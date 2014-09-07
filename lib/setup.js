var nextTick = require("just-next-tick");
var dom = require("./dom");

module.exports = async;

function async (brick, embedding) {
  nextTick(function () {
    setup(brick, embedding);
    loop(brick, embedding);
  });
}

function setup (brick, embedding) {
  dom.setup(brick);

  if (!embedding.update && !embedding.show) {
    dom.update(brick);
    return ready(brick, embedding);
  }

  if (!embedding.update) {
    embedding.show();
    dom.update(brick);
    return ready(brick, embedding);
  }

  embedding.update(createUpdateCallback(brick, embedding));
}

function ready (brick, embedding) {
  if (!brick.onReady.publish) return;

  var onReady = brick.onReady;

  brick.onReady = function (fn) {
    fn();
  };

  brick.onReady.subscribe = brick.onReady;

  if (embedding.ready) embedding.ready();

  onReady.publish();
}

function createUpdateCallback (brick, embedding) {
  return function (error) {
    if (error) return brick.onError.publish(error);

    if (embedding.show) embedding.show();

    dom.update(brick);

    ready(brick, embedding);
  };
}

function loop (brick, embedding) {
  if (!embedding.loop) return;
  embedding.loop(function () {
    embedding.update(createUpdateCallback(brick, embedding));
    loop(brick, embedding);
  });
}
