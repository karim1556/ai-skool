-- Migration to create tables for quiz questions and options

-- Create the quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Create the quiz_options table
CREATE TABLE IF NOT EXISTS quiz_options (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);
