-- Seed standard levels by category (no courses mapped yet)
INSERT INTO levels (name, category, level_order, description)
VALUES
  ('Level 1', 'Beginner', 1, 'Basic introductions and foundations'),
  ('Level 2', 'Beginner', 2, 'Follow-up to Level 1 with more practice'),
  ('Level 3', 'Beginner', 3, 'Advanced basics preparing for intermediate'),
  ('Pre-course', 'Beginner', 0, 'Orientation and pre-requisite content'),

  ('Level 4', 'Intermediate', 4, 'Builds on Beginner levels with deeper concepts'),
  ('Level 5', 'Intermediate', 5, 'Projects and applications'),
  ('Level 6', 'Intermediate', 6, 'Broader toolset and integrations'),

  ('Level 7', 'Advance', 7, 'Advanced problem solving and systems'),
  ('Level 8', 'Advance', 8, 'Complex projects and specialization'),

  ('Level 9', 'Professional', 9, 'Professional-grade topics and mastery')
ON CONFLICT DO NOTHING;
