export interface Options {
    scoreIncreasePerSequencialMatchedLetter?: number;
    initialScoreDecreasePerLetter?: number;
    scoreDecreasePerLetterBeforeMatch?: number;
    scoreDecreasePerLetterAfterMatch?: number;
}
export interface FuzzySearcher {
    (needle: string, haystack: string): number;
}
