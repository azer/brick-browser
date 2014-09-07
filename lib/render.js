var hyperglue = require("hyperglue");
var findTemplate = require("./find-template");

module.exports = {
  body: body,
  template: template
};

function body (brick) {
  return template(brick, brick.defaultTemplate());
}

function template (brick, name) {
  var template = findTemplate(brick, name);
  var isDefaultTemplate = brick.defaultTemplate() == name;

  if (!template) return [];

  var source;

  if (isDefaultTemplate) {
    source = '<div>';
  } else {
    source = '<div class="brick-' + brick.key + '-template-' + name + '">';
  }

  source += template() + '</div>';

  var options = {};
  var key;

  for (key in brick.bindings) {
    options[key] = brick.bindings[key].options;
  }

  var rendered = hyperglue(source, options);
  var coll;

  if (isDefaultTemplate) {
    coll = Array.prototype.slice.call(rendered.children);
  } else {
    coll = [rendered];
    coll.isBrickTemplate = true;
  }

  return coll;
}
