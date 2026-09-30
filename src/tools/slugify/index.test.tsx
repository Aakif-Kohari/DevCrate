import { describe, expect, it } from 'vitest'
import { slugify } from './index'
describe('slugify',()=>{it('removes diacritics and punctuation',()=>expect(slugify('Crème Brûlée!')).toBe('creme-brulee'));it('supports underscore separator',()=>expect(slugify('Hello, world','_')).toBe('hello_world'));it('respects max length without trailing separator',()=>expect(slugify('hello beautiful world','-',8)).toBe('hello'));it('returns empty for symbols only',()=>expect(slugify('!@#$')).toBe(''))})
