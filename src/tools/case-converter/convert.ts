type CaseResult = { label: string; value: string }

function wordsFrom(input: string): string[] {
  return input
    .replace(/([\p{Ll}\p{Nd}])([\p{Lu}])/gu, '$1 $2')
    .replace(/([\p{Lu}]+)([\p{Lu}][\p{Ll}])/gu, '$1 $2')
    .split(/[\s_-]+/u)
    .map((word) => word.trim())
    .filter(Boolean)
}

function capitalize(word: string): string {
  if (!word) return ''
  const [first, ...rest] = Array.from(word.toLocaleLowerCase())
  return first.toLocaleUpperCase() + rest.join('')
}

export function convertCases(input: string): CaseResult[] {
  const words = wordsFrom(input)
  const lower = words.map((word) => word.toLocaleLowerCase())
  const pascal = lower.map(capitalize).join('')

  return [
    {
      label: 'camelCase',
      value: lower.length ? lower[0] + lower.slice(1).map(capitalize).join('') : '',
    },
    { label: 'PascalCase', value: pascal },
    { label: 'snake_case', value: lower.join('_') },
    { label: 'CONSTANT_CASE', value: lower.join('_').toLocaleUpperCase() },
    { label: 'kebab-case', value: lower.join('-') },
    { label: 'Title Case', value: lower.map(capitalize).join(' ') },
    { label: 'UPPER CASE', value: lower.join(' ').toLocaleUpperCase() },
    { label: 'lower case', value: lower.join(' ') },
  ]
}
