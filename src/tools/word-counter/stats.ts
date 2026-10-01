export function stats(input: string) {
  const trimmed = input.trim()
  const chars = Array.from(input).length
  const noSpaces = Array.from(input).filter((char) => !/\s/u.test(char)).length
  const words = trimmed ? trimmed.split(/\s+/u).length : 0
  const sentenceMatches = trimmed ? (input.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? []) : []
  const sentences = sentenceMatches.filter((sentence) => sentence.trim()).length
  const lines = input ? input.split(/\r?\n/u).length : 0
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/u).filter(Boolean).length : 0

  return {
    chars,
    noSpaces,
    words,
    sentences,
    lines,
    paragraphs,
    reading: words / 200,
    speaking: words / 130,
  }
}
