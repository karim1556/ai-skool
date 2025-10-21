// Helpers to map project payloads between client (camelCase) and DB (snake_case)
export function toDbProject(payload: any) {
  const p: any = {};
  if ('title' in payload) p.title = payload.title;
  if ('shortDescription' in payload) p.short_description = payload.shortDescription;
  if ('description' in payload) p.description = payload.description;
  if ('category' in payload) p.category = payload.category;
  if ('difficulty' in payload) p.difficulty = payload.difficulty;
  if ('duration' in payload) p.duration = payload.duration;
  if ('image' in payload) p.image = payload.image;
  if ('youtubeLink' in payload) p.youtube_link = payload.youtubeLink;
  if ('codeDownloadLink' in payload) p.code_download_link = payload.codeDownloadLink;
  if ('circuitDiagramLink' in payload) p.circuit_diagram_link = payload.circuitDiagramLink;
  if ('instructionsLink' in payload) p.instructions_link = payload.instructionsLink;
  if ('views' in payload) p.views = Number(payload.views ?? 0) || 0;
  if ('likes' in payload) p.likes = Number(payload.likes ?? 0) || 0;
  if ('featured' in payload) p.featured = Boolean(payload.featured);
  if ('tags' in payload) p.tags = Array.isArray(payload.tags) ? payload.tags : [];
  if ('components' in payload) p.components = Array.isArray(payload.components) ? payload.components : [];
  if ('codeSnippet' in payload) p.code_snippet = payload.codeSnippet;
  if ('circuitConnections' in payload) p.circuit_connections = payload.circuitConnections;
  if ('applications' in payload) p.applications = payload.applications;
  if ('studentName' in payload) p.student_name = payload.studentName;
  if ('studentAge' in payload) p.student_age = payload.studentAge;
  if ('school' in payload) p.school = payload.school;
  if ('usesOurComponents' in payload) p.uses_our_components = Boolean(payload.usesOurComponents);
  if ('componentsFromUs' in payload) p.components_from_us = Array.isArray(payload.componentsFromUs) ? payload.componentsFromUs : [];
  if ('achievement' in payload) p.achievement = payload.achievement;
  // allow passing through any additional fields safely
  return p;
}

export function fromDbProject(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description ?? row.shortDescription ?? null,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    duration: row.duration,
    image: row.image,
    youtubeLink: row.youtube_link ?? null,
    codeDownloadLink: row.code_download_link ?? null,
    circuitDiagramLink: row.circuit_diagram_link ?? null,
    instructionsLink: row.instructions_link ?? null,
    views: row.views ?? 0,
    likes: row.likes ?? 0,
    featured: Boolean(row.featured),
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? JSON.parse(row.tags) : []),
    components: Array.isArray(row.components) ? row.components : (row.components ? JSON.parse(row.components) : []),
    codeSnippet: row.code_snippet ?? null,
    circuitConnections: row.circuit_connections ?? null,
    applications: row.applications ?? null,
    studentName: row.student_name ?? null,
    studentAge: row.student_age ?? null,
    school: row.school ?? null,
    usesOurComponents: Boolean(row.uses_our_components),
    componentsFromUs: Array.isArray(row.components_from_us) ? row.components_from_us : (row.components_from_us ? JSON.parse(row.components_from_us) : []),
    achievement: row.achievement ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}
