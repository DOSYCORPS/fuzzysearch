# sored-fuzzysearch

> Tiny and blazing-fast fuzzy search in JavaScript.

Fuzzy searching allows for flexibly matching a string with partial input, useful for filtering data very quickly based on lightweight user input.

This was forked from https://github.com/bevacqua/fuzzysearch to add case insensitivity and scored results

# Install

From `npm`

```shell
npm install --save fuzzysearch
```

# `fuzzysearch(needle, haystack)`

Returns `number` (score value where a larger score represents a better match and `0` is no match) if `needle` matches `haystack` using a fuzzy-searching algorithm. Note that this program doesn't implement _[levenshtein distance][2]_, but rather a simplified version where **there's no approximation**. The method will return `true` only if each character in the `needle` can be found in the `haystack` and occurs after the preceding matches.

```js
const { fuzzysearch, findMatchIndices } = require("scored-fuzzysearch");

fuzzysearch("cwhEE", "cartwheel"); // 0.999994902390217
fuzzysearch("crtw", "cartwheel"); // 0.9997958927178325
fuzzysearch("CWe", "cartwheel"); // 0.9971004280869964
fuzzysearch("eel", "cartwheel"); // 0.9871677449104073
fuzzysearch("ee", "cartwheel"); // 0.985984563434286
fuzzysearch("eeel", "cartwheel"); // 0
fuzzysearch("dog", "cartwheel"); // 0
```

and to get match indices

```js
findMatchIndices("arhel", "cartwheel");
```

returns

```js
[
  { start: 1, length: 2 },
  { start: 5, length: 2 },
  { start: 8, length: 1 },
];
```

Scoring is based on

1. how many characters match
1. how close the initial match character is to the beginning of the test string
1. how many characters match without spacing
1. how close multiple match segments are to eachother
