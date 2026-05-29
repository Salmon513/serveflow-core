export const BASE_JSON_CONSTRAINTS = [
  'Return valid JSON only. Do not include markdown, prose, or code fences.',
  'If a value is unknown, return null when the schema allows it instead of guessing.',
  'Keep confidence between 0 and 1.',
  'Prefer short operational answers over verbose explanations.',
];
