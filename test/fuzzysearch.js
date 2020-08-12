"use strict";

var test = require("tape");
var fuzzysearch = require("../dist/src/index").fuzzysearch;
var findMatchIndices = require("../dist/src/index").findMatchIndices;

test("fuzzysearch should match expectations", function (t) {
  t.equal(!!fuzzysearch("CAR", "cartwheel"), true);
  t.equal(!!fuzzysearch("car", "cartwheel"), true);
  t.equal(!!fuzzysearch("cwhl", "cartwheel"), true);
  t.equal(!!fuzzysearch("cwheel", "cartwheel"), true);
  t.equal(!!fuzzysearch("cartwheel", "cartwheel"), true);
  t.equal(!!fuzzysearch("cwheeel", "cartwheel"), false);
  t.equal(!!fuzzysearch("lw", "cartwheel"), false);

  // chinese unicode testcase
  t.equal(!!fuzzysearch("语言", "php语言"), true);
  t.equal(!!fuzzysearch("hp语", "php语言"), true);
  t.equal(!!fuzzysearch("Py开发", "Python开发者"), true);
  t.equal(!!fuzzysearch("Py 开发", "Python开发者"), false);
  t.equal(!!fuzzysearch("爪哇进阶", "爪哇开发进阶"), true);
  t.equal(!!fuzzysearch("格式工具", "非常简单的格式化工具"), true);
  t.equal(!!fuzzysearch("正则", "学习正则表达式怎么学习"), true);
  t.equal(!!fuzzysearch("学习正则", "正则表达式怎么学习"), false);
  // end chinese unicode testcase

  var searchResults = ["car", "cwheel", "cwe"]
    .map(function (value) {
      var score = fuzzysearch(value, "cartwheel");
      return { value: value, score: score };
    })
    .sort(function (a, b) {
      // hightest to lowest
      return a.score > b.score ? -1 : 1;
    })
    .map(function (data) {
      return data.value;
    });
  t.deepEqual(searchResults, ["cwheel", "car", "cwe"]);

  t.end();
});

// used to generate the README examples
["cwhEE", "eel", "CWe", "crtw", "ee", "eeel", "dog"]
  .map(function (value) {
    return {
      value: value,
      score: fuzzysearch(value, "cartwheel"),
    };
  })
  .sort(function (a, b) {
    return a.score > b.score ? -1 : 1;
  })
  .forEach(function (data) {
    var value = data.value;
    var score = data.score;
    console.log("fuzzysearch(" + "'" + value + "', 'cartwheel') // " + score);
  });
