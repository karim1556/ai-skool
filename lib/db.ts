
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    const sqlite3Db = new sqlite3.Database("./lms.db", (err) => {
      if (err) {
        console.error("Error opening database", err);
      }
    });

    db = await open({
      filename: "./lms.db",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        provider TEXT,
        description TEXT,
        image TEXT,
        price REAL,
        original_price REAL,
        lessons INTEGER,
        duration TEXT,
        language TEXT,
        level TEXT,
        rating REAL,
        reviews INTEGER,
        category TEXT,
        is_free BOOLEAN,
        requirements TEXT,
        outcomes TEXT,
        meta_keywords TEXT,
        meta_description TEXT
      );

      CREATE TABLE IF NOT EXISTS sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        sort_order INTEGER,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        type TEXT,
        sort_order INTEGER,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      );
    `);

    // Insert mock data if table is empty
    const count = await db.get("SELECT COUNT(*) as count FROM courses");
    if (count.count === 0) {
      const result = await db.run(
        `INSERT INTO courses (
          title, provider, description, image, price, original_price, lessons,
          duration, language, level, rating, reviews, category, is_free,
          requirements, outcomes, meta_keywords, meta_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Kodable Basics",
          "Kodable Education",
          "An early education program designed for children aged 4 to 8. It introduces foundational concepts of coding, logic, and problem-solving through screen-free play and interactive activities.",
          "/placeholder.svg?height=200&width=300",
          2999,
          3999,
          15,
          "8:30:45",
          "English",
          "Beginner",
          5,
          12,
          "Coding Fundamentals",
          false,
          "No prior coding experience needed.",
          "Students will learn the basics of programming and create their own simple games.",
          "coding, kids, beginner, programming",
          "A beginner-friendly introduction to coding for kids.",
        ]
      );
      const courseId = result.lastID;
      if(courseId) {
        await db.run(`INSERT INTO sections (course_id, title, sort_order) VALUES (?, ?, ?)`, [courseId, "Getting Started", 1]);
      }
    }
  }
  return db;
} 