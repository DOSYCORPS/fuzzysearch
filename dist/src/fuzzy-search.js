"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuzzysearch = exports.findMatchIndices = exports.createSearcher = void 0;
var INITIAL_SCORE_DECRESE_PER_LETTER = 0.0005;
var DECREASE_BEFORE_MATCH = 0.002;
var MATCH_INCREASE = 0.0012;
var DECREASE_AFTER_MATCH = 0.0005;
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
function createSearcher(options) {
    var increaseIncrement = typeof options.scoreIncreasePerSequencialMatchedLetter === "number"
        ? options.scoreIncreasePerSequencialMatchedLetter
        : MATCH_INCREASE;
    var initialScoreDecreasePerLetter = typeof options.initialScoreDecreasePerLetter === "number"
        ? 1 - options.initialScoreDecreasePerLetter
        : 1 - INITIAL_SCORE_DECRESE_PER_LETTER;
    var scoreDecreasePerLetterBeforeMatch = typeof options.scoreDecreasePerLetterBeforeMatch === "number"
        ? 1 - options.scoreDecreasePerLetterBeforeMatch
        : 1 - DECREASE_BEFORE_MATCH;
    var scoreIncreasePerLetter = typeof options.scoreIncreasePerSequencialMatchedLetter === "number"
        ? 1 + options.scoreIncreasePerSequencialMatchedLetter
        : 1 + MATCH_INCREASE;
    var scoreDecreasePerLetterAfterMatch = typeof options.scoreDecreasePerLetterAfterMatch === "number"
        ? 1 - options.scoreDecreasePerLetterAfterMatch
        : 1 - DECREASE_AFTER_MATCH;
    var initialScore = function (word) {
        return Math.pow(initialScoreDecreasePerLetter, word.length);
    };
    return function fuzzysearch(needle, haystack) {
        var hlen = haystack.length;
        var nlen = needle.length;
        if (nlen > hlen) {
            return 0;
        }
        var score = initialScore(haystack);
        var hadPreviousMatch = false;
        var increase = scoreIncreasePerLetter;
        outer: for (var i = 0, j = 0; i < nlen; i++) {
            var nch = needle.charCodeAt(i);
            var opposite = opposites[nch];
            var testChar;
            while (j < hlen) {
                testChar = haystack.charCodeAt(j++);
                if (testChar === nch || testChar === opposite) {
                    hadPreviousMatch = true;
                    score *= increase;
                    increase += increaseIncrement;
                    continue outer;
                }
                else {
                    increase = scoreIncreasePerLetter;
                    if (hadPreviousMatch) {
                        score *= scoreDecreasePerLetterAfterMatch;
                    }
                    else {
                        score *= scoreDecreasePerLetterBeforeMatch;
                    }
                }
            }
            return 0;
        }
        return score;
    };
}
exports.createSearcher = createSearcher;
function findMatchIndices(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return 0;
    }
    if (nlen === hlen) {
        return [{ start: 0, length: haystack.length }];
    }
    var indices = [];
    var currrentMatch;
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        var opposite = opposites[nch];
        var testChar;
        while (j < hlen) {
            testChar = haystack.charCodeAt(j++);
            if (testChar === nch || testChar === opposite) {
                if (!currrentMatch) {
                    currrentMatch = { start: j - 1, length: 1 };
                    indices.push(currrentMatch);
                }
                else {
                    currrentMatch.length = currrentMatch.length + 1;
                }
                continue outer;
            }
            else {
                currrentMatch = undefined;
            }
        }
        return 0;
    }
    return indices;
}
exports.findMatchIndices = findMatchIndices;
exports.fuzzysearch = createSearcher({});
//# sourceMappingURL=fuzzy-search.js.map