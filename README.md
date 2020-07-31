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
fuzzysearch("crtw", "cartwheel"); // 0.9989972540016198
fuzzysearch("cwhEE", "cartwheel"); // 0.9989965050034285
fuzzysearch("CWe", "cartwheel"); // 0.9965030042394439
fuzzysearch("eel", "cartwheel"); // 0.9865762723408131
fuzzysearch("ee", "cartwheel"); // 0.9855906816591541
fuzzysearch("eeel", "cartwheel"); // 0
fuzzysearch("dog", "cartwheel"); // 0
```

Scoring is based on

1. how many characters match
1. how close the initial match character is to the beginning of the test string
1. how many characters match without spacing
1. how close multiple match segments are to eachother
