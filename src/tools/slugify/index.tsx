import { useMemo, useState } from 'react'

export function slugify(input: string, separator: '-' | '_' = '-', maxLength?: number): string {
  let slug = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, separator).replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
    .replace(new RegExp(`${separator}{2,}`, 'g'), separator)
  if (maxLength && maxLength > 0 && slug.length > maxLength) slug = slug.slice(0, maxLength).replace(new RegExp(`${separator}+$`), '')
  return slug
}

export default function SlugGenerator() {
 const [input,setInput]=useState(''); const [separator,setSeparator]=useState<'-'|'_'>('-'); const [max,setMax]=useState('')
 const output=useMemo(()=>slugify(input,separator,max ? Number(max) : undefined),[input,separator,max])
 return <div className="space-y-4"><div><label htmlFor="slug-input" className="mb-1 block text-sm font-medium">Text</label><textarea id="slug-input" className="focus-ring h-40 w-full rounded-lg border border-border bg-card p-3" value={input} onChange={e=>setInput(e.target.value)} /></div><div className="flex flex-wrap gap-4"><label>Separator <select aria-label="Separator" value={separator} onChange={e=>setSeparator(e.target.value as '-'|'_')}><option value="-">-</option><option value="_">_</option></select></label><label>Maximum length <input aria-label="Maximum length" type="number" min="1" value={max} onChange={e=>setMax(e.target.value)} /></label></div><div><span className="text-sm font-medium">Slug</span><output aria-label="Slug" className="mt-1 block break-all rounded-lg border border-border bg-muted p-3 font-mono">{output}</output></div></div>
}
