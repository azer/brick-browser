var dom = require("./dom");

module.exports = refresh;

function refresh (brick, callback) {
  if (!brick.wrapper.update && !brick.wrapper.show) {
    return dom.update(brick, callback);
  }

  if (!brick.wrapper.update) {
    brick.wrapper.show();
    return dom.update(brick, callback);
  }

  brick.wrapper.update(function (error) {
    if (error) return brick.onError.publish(error);

    if (brick.wrapper.show) brick.wrapper.show();

    dom.update(brick, callback);
  });
}
