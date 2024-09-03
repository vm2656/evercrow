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
  // Split the text into words and stem each word
  const words = text.split(/\s+/);
  const stemmedWords = words.map(stemWord);

  // Stem the query for comparison
  const stemmedQuery = stemWord(query);

  // Calculate the maximum allowed Levenshtein distance (20% of query length)
  const maxDistance = Math.floor(stemmedQuery.length * 0.2);

  let count = 0;
  let bestMatch = { word: '', distance: Infinity };

  // Compare each stemmed word with the stemmed query
  stemmedWords.forEach((stemmedWord, index) => {
    // Calculate Levenshtein distance between stemmed word and query
    const distance = levenshtein(stemmedWord, stemmedQuery);

    // If distance is within allowed range, increment match count
    if (distance <= maxDistance) {
      count++;
    }

    // Keep track of the closest match
    if (distance < bestMatch.distance) {
      bestMatch = { word: words[index], distance };
    }
  });

  const result: SearchResult = { count };

  // Add "did you mean" suggestion if the best match is close but not exact
  if (bestMatch.word.toLowerCase() !== query.toLowerCase() && bestMatch.distance <= maxDistance) {
    result.didYouMean = bestMatch.word;
  }

  return result;
}