var New = require("./new");
var bind = require("./bind");
var render = require("./render");
var attach = require("./attach");
var findTemplate = require("./find-template");
var refresh = require("./refresh");

module.exports = {
  New: New,
  attach: attach,
  bind: bind,
  on: on,
  onKey: onKey,
  select: select,
  render: render.body,
  template: render.template,
  refresh: refresh,
  html: html
};

function html (brick) {
  return brick.render().html;
}

function on (brick, event, selector, callback) {
  if (arguments.length == 3) {
    return brick.element.on(event, callback);
  }

  return brick.element.on(event, selector, callback);
}

function onKey (brick, key, callback) {
  return brick.element.onKey(key, callback);
}

function select (brick, selector) {
  return brick.element.select(selector, brick.element[0]);
}
