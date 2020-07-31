"use strict";

var INITIAL_SCORE_DECRESE_PER_LETTER = 1 - 0.0005;
var DECREASE_BEFORE_MATCH = 1 - 0.002;
var MATCH_INCREASE = 1 + 0.001;
var DECREASE_AFTER_MATCH = 1 - 0.0005;
function initialScore(word) {
  return Math.pow(INITIAL_SCORE_DECRESE_PER_LETTER, word.length);
}

function genCharCode(str, inc) {
  return str.charCodeAt(0) + inc;
}

var opposites = {};
for (var i = 0; i < 26; i++) {
  opposites[genCharCode("a", i)] = genCharCode("A", i);
  opposites[genCharCode("A", i)] = genCharCode("a", i);
}

/**
 * Return a score for the match.  If there is no match at all, return 0
 */
function fuzzysearch(needle, haystack) {
  var hlen = haystack.length;
  var nlen = needle.length;
  if (nlen > hlen) {
    return 0;
  }
  if (nlen === hlen) {
    return needle.toUpperCase() === haystack.toUpperCase();
  }

  var score = initialScore(haystack);
  var hadPreviousMatch = false;
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    var opposite = opposites[nch];
    var testChar;
    while (j < hlen) {
      testChar = haystack.charCodeAt(j++);
      if (testChar === nch || testChar === opposite) {
        hadPreviousMatch = true;
        score *= MATCH_INCREASE;
        continue outer;
      } else {
        if (hadPreviousMatch) {
          score *= DECREASE_AFTER_MATCH;
        } else {
          score *= DECREASE_BEFORE_MATCH;
        }
      }
    }
    return 0;
  }
  return score;
}

module.exports = fuzzysearch;
