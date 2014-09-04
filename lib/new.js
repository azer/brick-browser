var format = require("format-text");
var filenameId = require("filename-id");
var pubsub = require("pubsub");

var MIXINGS_KEY = '#';

var instanceCounter = 1;

module.exports = New;

function New (options) {
  var Brick = require('../');
  var id;

  options || (options = {});

  var brick = Brick(options);
  var defaultTemplateName;

  brick.isBrick = true;
  brick.templates = {};
  brick.id = 'brick-' + brick.key + '-' + (instanceCounter++);

  var key;
  for (key in brick.source.html) {
    id = filenameId(key);

    if (!defaultTemplate() || id == 'index') {
      defaultTemplate(id);
    }

    brick.templates[id] = template(brick.source.html[key]);
  }

  brick.onReady = pubsub();
  brick.onError = pubsub();
  brick.browser = true;

  brick.defaultTemplate = defaultTemplate;

  if (options.mixing) {
    brick.mixing = mix(brick, options.mixing, options.dom[MIXINGS_KEY]);
  }

  return brick;

  function defaultTemplate (newValue) {
    if (brick.parentMixing) return brick.parentMixing.defaultTemplate(newValue);

    if (newValue) defaultTemplateName = newValue;

    return defaultTemplateName;
  }
}

function template (source) {
  read.returnsTemplate = true;

  return read;

  function read () {
    return source;
  }
}

function mix (brick, mixings, dom) {
  if (!brick.bindings) brick.bindings = {};

  if (brick.parentMixing) brick.bindings = brick.parentMixing.bindings;

  brick.mixings = mixings.map(function (Factory) {
    var b = Factory.New({ brick: { dom: dom[Factory._brick.meta.key] } }).brick;
    b.bindings = brick.bindings;
    b.parentMixing = brick;
    return b;
  });
}
