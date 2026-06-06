import type { Prototype } from '../types'

const API = '/api/projects'

async function request(url: string, method: string, body?: unknown): Promise<any> {
  const opts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function savePrototype(prototype: Prototype): Promise<void> {
  const { generatedCode, ...meta } = prototype
  await request(`${API}/${encodeURIComponent(prototype.id)}`, 'POST', {
    ...meta,
    generatedCode,
  })
}

export async function loadPrototype(id: string): Promise<Prototype | undefined> {
  try {
    const data = await request(`${API}/${encodeURIComponent(id)}`, 'GET')
    return data as Prototype
  } catch {
    return undefined
  }
}

export async function listPrototypes(): Promise<Prototype[]> {
  const list = await request(API, 'GET')
  return list.map((p: any) => ({
    id: p.slug,
    name: p.name,
    prompt: p.prompt ?? '',
    generatedCode: '',
    annotations: p.annotations ?? [],
    mode: p.mode ?? 'preview',
    createdAt: p.createdAt ?? Date.now(),
    updatedAt: p.updatedAt ?? Date.now(),
  }))
}

export async function deletePrototype(id: string): Promise<void> {
  await request(`${API}/${encodeURIComponent(id)}`, 'DELETE')
}

export function exportToJSON(prototype: Prototype): string {
  return JSON.stringify({
    version: 1,
    exportedAt: Date.now(),
    prototype,
  }, null, 2)
}

export async function importFromJSON(jsonString: string): Promise<Prototype> {
  const data = JSON.parse(jsonString)
  if (!data.prototype) {
    throw new Error('Invalid prototype JSON format')
  }
  const prototype = data.prototype as Prototype
  await savePrototype(prototype)
  return prototype
}

export async function listImages(slug: string): Promise<{ name: string; url: string }[]> {
  const data = await request(`${API}/${encodeURIComponent(slug)}/images`, 'GET')
  return data.images ?? []
}
