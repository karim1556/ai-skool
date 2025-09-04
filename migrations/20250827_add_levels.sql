-- Create levels table and mapping table level_courses

CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level_order SMALLINT NOT NULL DEFAULT 1,
  description TEXT,
  thumbnail TEXT,
  meta_keywords TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- A course can belong to multiple levels (flexible). Enforce unique pair.
CREATE TABLE IF NOT EXISTS level_courses (
  level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (level_id, course_id)
);

-- Helpful index for filtering by category and order
CREATE INDEX IF NOT EXISTS idx_levels_category_order ON levels(category, level_order);
CREATE INDEX IF NOT EXISTS idx_level_courses_course ON level_courses(course_id);
