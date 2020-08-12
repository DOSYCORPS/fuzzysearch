import { Options, FuzzySearcher } from "./types";
/**
 * Return a score for the match.  If there is no match at all, return 0
 */
export declare function createSearcher(options: Options): FuzzySearcher;
export declare function findMatchIndices(needle: string, haystack: string): 0 | {
    start: number;
    length: number;
}[];
export declare const fuzzysearch: FuzzySearcher;
