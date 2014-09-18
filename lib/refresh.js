var dom = require("./dom");

module.exports = refresh;

function refresh (brick) {
  if (!brick.wrapper.update && !brick.wrapper.show) {
    return dom.update(brick);
  }

  if (!brick.wrapper.update) {
    brick.wrapper.show();
    return dom.update(brick);
  }

  brick.wrapper.update(function (error) {
    if (error) return brick.onError.publish(error);

    if (brick.wrapper.show) brick.wrapper.show();

    dom.update(brick);
  });
}
