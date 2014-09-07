var New = require("./new");
var bind = require("./bind");
var render = require("./render");
var attach = require("./attach");
var findTemplate = require("./find-template");

module.exports = {
  New: New,
  attach: attach,
  bind: bind,
  on: on,
  select: select,
  render: render.body,
  template: render.template
};

function on (brick, event, selector, callback) {
  return brick.element.on(event, selector, callback);
}

function select (brick, selector) {
  return brick.element.select(selector, brick.element[0]);
}
