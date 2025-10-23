import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const DATA_PATH = path.join(process.cwd(), 'data', 'camps.json')

async function readCamps() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

export async function GET() {
  const camps = await readCamps()
  return NextResponse.json({ camps })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const camps = await readCamps()
    const id = (camps[camps.length - 1]?.id || 0) + 1
    const newCamp = { id, ...body }
    camps.push(newCamp)
    await fs.writeFile(DATA_PATH, JSON.stringify(camps, null, 2), 'utf-8')
    return NextResponse.json({ camp: newCamp }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message || 'Failed' }, { status: 500 })
  }
}
