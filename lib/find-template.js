module.exports = findTemplate;

function findTemplate (brick, name) {
  if (brick.templates[name]) return brick.templates[name];
  if (!brick.mixings) return;

  var i = -1;
  var len = brick.mixings.length;
  var found;
  while (++i < len) {
    found = findTemplate(brick.mixings[i], name);
    if (found) return found;
  }
}
