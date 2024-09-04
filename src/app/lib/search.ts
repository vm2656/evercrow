import levenshtein from 'js-levenshtein';
import { stemmer } from 'stemmer';

interface SearchResult {
  count: number;
  didYouMean?: string;
}

function stemWord(word: string): string {
  return stemmer(word.toLowerCase());
}

export function fuzzySearch(text: string, query: string): SearchResult {
  const words = text.split(/\s+/);
  const stemmedWords = words.map(stemWord);
  const stemmedQuery = stemWord(query);

  // Calculate the maximum allowed Levenshtein distance for counting matches (10% of query length)
  const maxDistanceForCount = Math.floor(stemmedQuery.length * 0.1);

  // More relaxed distance for "Did you mean" suggestions (30% of query length)
  const maxDistanceForSuggestion = Math.floor(stemmedQuery.length * 0.3);

  let count = 0;
  let bestMatch = { word: '', distance: Infinity };

  stemmedWords.forEach((stemmedWord, index) => {
    const distance = levenshtein(stemmedWord, stemmedQuery);

    if (distance <= maxDistanceForCount) {
      count++;
    }

    if (distance < bestMatch.distance) {
      bestMatch = { word: words[index], distance };
    }
  });

  const result: SearchResult = { count };

  // Add "did you mean" suggestion if the best match is close but not exact
  // using the more relaxed maxDistanceForSuggestion
  if (bestMatch.word.toLowerCase() !== query.toLowerCase() && bestMatch.distance <= maxDistanceForSuggestion) {
    result.didYouMean = bestMatch.word;
  }

  return result;
}