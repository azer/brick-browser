var domquery = require("domquery");
var diff = require('virtual-dom/diff');
var applyPatches = require('virtual-dom/patch');
var virtualHTML = require("virtual-html");
var render = require("./render");

module.exports = {
  setup: setup,
  update: update
};

function setup (brick) {
  if (brick.element) return;

  var id, element;

  if (brick.dom && brick.dom.id && brick.dom.id.length) {
    id = brick.dom.id.splice(0, 1)[0];
    element = document.getElementById(id);
    brick.id = id;
  } else {
    element = document.createElement('div');
    element.setAttribute('id', brick.id);
  }

  brick.element = domquery(element);
}

function update (brick, callback) {
  if (brick.parentMixing) return callback && callback();

  getCurrentVDOM(brick, function (error, currentVDOM) {
    if (error || !currentVDOM) return reset(brick, callback);

    getNewVDOM(brick, function (error, newVDOM) {
      if (error) {
        return callback && callback(error);
      }

      var patches = diff(currentVDOM, newVDOM);
      applyPatches(brick.element[0], patches);
      brick.vdom = newVDOM;

      callback && callback();
    });
  });
}

function getCurrentVDOM (brick, callback) {
  if (brick.vdom) return callback(undefined, brick.vdom);

  var parent = brick.element[0];
  var current = parent && parent.outerHTML;

  if (!current) return callback();

  virtualHTML(current, function (error, vdom) {
    if (error) return callback(error);

    brick.vdom = vdom;
    callback(undefined, brick.vdom);
  });
}

function getNewVDOM (brick, callback) {
  var rendered = render.body(brick);

  if (!rendered || !rendered.html) return callback(new Error('Unable to render new DOM.'));

  virtualHTML(rendered.html, callback);
}

function reset (brick) {
  throw new Error('not implemented');
}
