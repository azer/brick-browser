var hyperglue = require("hyperglue");
var findTemplate = require("./find-template");

module.exports = {
  template: template,
  body: body
}

function body (brick) {
  return template(brick, brick.defaultTemplate());
}

function template (brick, name) {
  var template = findTemplate(brick, name);
  var isDefaultTemplate = brick.defaultTemplate() == name;

  if (!template) return [];

  var source = template();

  var classes;
  if (isDefaultTemplate) {
    source = '<div id="' + brick.id + '" class="brick-body ' + classesOf(brick).join(' ') + '">\n  ' + source + '\n</div>';
  } else {
    source = '<div>' + source + '</div>';
  }

  var options = {};
  var key;

  for (key in brick.bindings) {
    options[key] = brick.bindings[key].options;
  }

  var dom = hyperglue(source, options);

  if (isDefaultTemplate) return { html: dom.outerHTML };

  return { html: dom.innerHTML };
}

function classesOf (brick) {
  var result = ['brick-' + brick.key];

  var i = 0;
  if (brick.mixings) {
    brick.mixings.forEach(function (b) {
      result.push('brick-' + b.key);
    });
  }

  return result;
}
