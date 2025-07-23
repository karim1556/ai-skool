
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Enable verbose mode for better debugging
sqlite3.verbose();

// Import better-sqlite3 for potential fallback
let betterSqlite3: any;
try {
  betterSqlite3 = require('better-sqlite3');
  console.log('better-sqlite3 loaded successfully');
} catch (error) {
  console.log('better-sqlite3 not available, will use sqlite3');
}

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    // Use in-memory database for Vercel deployment
    // This will work for read operations during runtime but won't persist data between function invocations
    const isProduction = process.env.NODE_ENV === 'production';
    const dbPath = isProduction ? ':memory:' : './lms.db';
    
    try {
      // For production (Vercel), we'll use a more robust approach to handle SQLite in serverless
      if (isProduction) {
        console.log('Running in production mode with in-memory SQLite database');
        
        // Try to use better-sqlite3 first if available (may work better in serverless)
        if (betterSqlite3) {
          try {
            console.log('Attempting to use better-sqlite3 for in-memory database');
            const betterDb = new betterSqlite3(':memory:');
            
            // We need to wrap better-sqlite3 to match the sqlite interface
            db = {
              exec: (sql: string) => Promise.resolve(betterDb.exec(sql)),
              all: (sql: string, params: any[] = []) => Promise.resolve(betterDb.prepare(sql).all(...params)),
              get: (sql: string, params: any[] = []) => Promise.resolve(betterDb.prepare(sql).get(...params)),
              run: (sql: string, params: any[] = []) => Promise.resolve(betterDb.prepare(sql).run(...params)),
              close: () => Promise.resolve(betterDb.close())
            } as unknown as Database;
            
            console.log('Successfully initialized better-sqlite3 in-memory database');
          } catch (betterError) {
            console.error('Failed to initialize better-sqlite3:', betterError);
            console.log('Falling back to regular sqlite3...');
            // Fall back to regular sqlite3
            db = await open({
              filename: ':memory:',
              driver: sqlite3.Database,
            });
            console.log('In-memory SQLite database opened successfully with sqlite3');
          }
        } else {
          // Use regular sqlite3 if better-sqlite3 is not available
          db = await open({
            filename: ':memory:',
            driver: sqlite3.Database,
          });
          console.log('In-memory SQLite database opened successfully with sqlite3');
        }
      } else {
        // Development mode - use file-based database with regular sqlite3
        const sqlite3Db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error("Error opening database", err);
          }
        });

        db = await open({
          filename: dbPath,
          driver: sqlite3.Database,
        });
        
        console.log(`SQLite database opened successfully at ${dbPath}`);
      }
    } catch (error) {
      console.error("Failed to initialize SQLite database:", error);
      throw error;
    }

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
        content TEXT,
        duration INTEGER,
        is_preview BOOLEAN DEFAULT 0,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        time_limit INTEGER,
        passing_score INTEGER,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        max_score INTEGER,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        enrollment_date TEXT,
        completion_status TEXT,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );
    `);
    
    // If using in-memory database in production, we need to ensure data is loaded each time
    if (isProduction) {
      console.log("Running in production mode with in-memory database");
      // Additional initialization for in-memory database can be added here
    }

    // Always insert mock data when using in-memory database in production
    // or insert if table is empty in development
    const shouldInsertData = isProduction || (await db.get("SELECT COUNT(*) as count FROM courses")).count === 0;
    
    if (shouldInsertData) {
      console.log("Inserting sample data into database");
      
      // Insert sample course
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
        // Insert sample section
        const sectionResult = await db.run(
          `INSERT INTO sections (course_id, title, sort_order) VALUES (?, ?, ?)`, 
          [courseId, "Getting Started", 1]
        );
        
        // Insert sample lesson in the section
        if (sectionResult.lastID) {
          await db.run(
            `INSERT INTO lessons (section_id, title, type, sort_order, content, duration, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sectionResult.lastID, "Introduction to the Course", "video", 1, "Welcome to the course content", 300, 1]
          );
        }
      }
    }
  }
  return db;
}