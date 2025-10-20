import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'projects.json');

async function readProjects() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    // If the file doesn't exist or parsing fails, return empty array
    return [];
  }
}

async function writeProjects(data: any) {
  // Ensure directory exists is not strictly necessary here as data/ is in repo,
  // but keep this simple and write atomically.
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const projects = await readProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const projects = await readProjects();
    const nextId = projects.length ? Math.max(...projects.map((p: any) => p.id)) + 1 : 1;
    const newProject = { id: nextId, ...body };
    projects.unshift(newProject);
    await writeProjects(projects);
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (err) {
    console.error('[API] /api/projects error', err);
    return NextResponse.json({ error: 'Invalid payload or write error' }, { status: 400 });
  }
}
