Camps Admin - data schema and admin form

Goal
- Allow admins to create, edit and delete Summer Camps from the admin UI. Frontend `app/camps/page.tsx` should display camps from the API (`/api/camps`).

Data shape (per camp)
- id: number (auto-generated)
- title: string
- description: string (HTML or markdown allowed)
- grade: string (e.g., "Grades 5-12")
- duration: string (e.g., "1 Week")
- schedule: string (e.g., "Mon-Fri, 2 hours daily")
- level: string (Beginner/Intermediate/Advanced)
- format: string (e.g., "Live Online", "Hybrid")
- image: string (public URL or storage path)
- subjects: string[] (['python','ai','robotics'])
- price: number
- originalPrice: number
- popular: boolean
- featured: boolean

Suggested admin form fields
- Title (text)
- Short description (textarea)
- Grade (text)
- Duration (text)
- Schedule (text)
- Level (select: Beginner/Intermediate/Advanced)
- Format (select)
- Image (file upload) -> stored in supabase storage or public/uploads
- Subjects (tags multi-select)
- Price (number)
- Original price (number)
- Popular (checkbox)
- Featured (checkbox)

API endpoints (dev)
- GET /api/camps -> list
- POST /api/camps -> create (body=camp without id)
- GET /api/camps/:id -> single
- PUT /api/camps/:id -> update
- DELETE /api/camps/:id -> delete

Supabase migration (recommended)
- Create `camps` table with columns matching the data shape. Use JSONB for `subjects`.

Notes
- I added a file-backed API for quick local dev. When you have Supabase up, we can switch the API to use Supabase (server-side) and keep the same endpoints.
- Next step: add admin pages under `app/admin/camps` with a create/edit form that POSTs/PUTs to `/api/camps`.
