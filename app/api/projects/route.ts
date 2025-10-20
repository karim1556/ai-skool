import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'projects.json');

function readProjects() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeProjects(data: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  const projects = readProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const projects = readProjects();
    const nextId = projects.length ? Math.max(...projects.map((p: any) => p.id)) + 1 : 1;
    const newProject = { id: nextId, ...body };
    projects.unshift(newProject);
    writeProjects(projects);
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
