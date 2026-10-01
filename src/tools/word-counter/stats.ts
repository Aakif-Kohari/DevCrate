export function stats(input: string) {
  const chars = Array.from(input).length
  const noSpaces = Array.from(input).filter((char) => !/\s/u.test(char)).length
  const words = input.trim() ? input.trim().split(/\s+/u).length : 0
  const sentences = input.trim()
    ? (input.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? []).filter((sentence) => sentence.trim()).length
    : 0
  const lines = input ? input.split(/\r?\n/u).length : 0
  const paragraphs = input.trim()\n    ? input.trim().split(/\n\s*\n/u).filter(Boolean).length\n    : 0

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
