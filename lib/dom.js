var domquery = require("domquery");
var diff = require('virtual-dom/diff');
var applyPatches = require('virtual-dom/patch');
var virtualHTML = require("virtual-html");
var createRootNode = require('virtual-dom/create-element');
var render = require("./render");

module.exports = {
  setup: setup,
  update: update
};

function setup (brick) {
  if (brick.element) return;

  var id;

  if (brick.dom && brick.dom.id && brick.dom.id.length) {
    id = brick.dom.id.splice(0, 1)[0];
    brick.element = document.getElementById(id);
    brick.id = id;
    brick.element = domquery(brick.element);
  }
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

  var wrapper = brick.element && brick.element[0];
  var parent = brick.parent && brick.parent.element && (brick.parent.element[0] || document);

  !wrapper && (wrapper = parent.querySelector('#' + brick.id));

  var current = wrapper && wrapper.outerHTML;

  if (!current) return callback();

  if (!brick.element) brick.element = domquery(wrapper);

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

function reset (brick, callback) {
  getNewVDOM(brick, function (error, vdom) {
    if (error) {
      throw error;
    }

    brick.vdom = vdom;
    brick.element = domquery(createRootNode(vdom));
    document.body.appendChild(brick.element[0]);

    callback && callback();
  });
}
