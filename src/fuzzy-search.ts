import { Options, FuzzySearcher } from "./types";

var INITIAL_SCORE_DECRESE_PER_LETTER = 0.0005;
var DECREASE_BEFORE_MATCH = 0.002;
var MATCH_INCREASE = 0.0012;
var DECREASE_AFTER_MATCH = 0.0005;

function genCharCode(str: string, inc: number) {
  return str.charCodeAt(0) + inc;
}

var opposites: Record<number, number> = {};
for (var i = 0; i < 26; i++) {
  opposites[genCharCode("a", i)] = genCharCode("A", i);
  opposites[genCharCode("A", i)] = genCharCode("a", i);
}

/**
 * Return a score for the match.  If there is no match at all, return 0
 */
export function createSearcher(options: Options): FuzzySearcher {
  const increaseIncrement =
    typeof options.scoreIncreasePerSequencialMatchedLetter === "number"
      ? options.scoreIncreasePerSequencialMatchedLetter
      : MATCH_INCREASE;
  const initialScoreDecreasePerLetter =
    typeof options.initialScoreDecreasePerLetter === "number"
      ? 1 - options.initialScoreDecreasePerLetter
      : 1 - INITIAL_SCORE_DECRESE_PER_LETTER;
  const scoreDecreasePerLetterBeforeMatch =
    typeof options.scoreDecreasePerLetterBeforeMatch === "number"
      ? 1 - options.scoreDecreasePerLetterBeforeMatch
      : 1 - DECREASE_BEFORE_MATCH;
  const scoreIncreasePerLetter =
    typeof options.scoreIncreasePerSequencialMatchedLetter === "number"
      ? 1 + options.scoreIncreasePerSequencialMatchedLetter
      : 1 + MATCH_INCREASE;
  const scoreDecreasePerLetterAfterMatch =
    typeof options.scoreDecreasePerLetterAfterMatch === "number"
      ? 1 - options.scoreDecreasePerLetterAfterMatch
      : 1 - DECREASE_AFTER_MATCH;
  const initialScore = function (word: string) {
    return Math.pow(initialScoreDecreasePerLetter, word.length);
  };

  return function fuzzysearch(needle: string, haystack: string): number {
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
        } else {
          increase = scoreIncreasePerLetter;
          if (hadPreviousMatch) {
            score *= scoreDecreasePerLetterAfterMatch;
          } else {
            score *= scoreDecreasePerLetterBeforeMatch;
          }
        }
      }
      return 0;
    }
    return score;
  };
}

export function findMatchIndices(needle: string, haystack: string) {
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
        } else {
          currrentMatch.length = currrentMatch.length + 1;
        }
        continue outer;
      } else {
        currrentMatch = undefined;
      }
    }
    return 0;
  }
  return indices;
}

export const fuzzysearch = createSearcher({});
