var hyperglue = require("hyperglue");
var findTemplate = require("./find-template");

module.exports = {
  template: template,
  body: body,
  root: root,
  classes: classesOf
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
    source = root(brick, source);
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

function root (brick, content) {
  return '<div id="'
    + brick.id
    + '" class="brick-body '
    + classesOf(brick).join(' ')
    + '">\n  '
    + (content || '')
    + '\n</div>';
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

function expand (obj) {
  if (!obj) return obj;

  if (typeof obj._html == 'function') {
    obj._html = obj._html();
    return obj;
  }

  if (obj[':first'] && typeof obj[':first']._html == 'function') {
    obj[':first']._html = obj[':first']._html();
    return obj;
  }

  if (!Array.isArray(obj)) return obj;

  var i = obj.length;
  while (i--) {
    expand(obj[i]);
  }

  return obj;
}
