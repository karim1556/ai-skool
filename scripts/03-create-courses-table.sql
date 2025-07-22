
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    provider TEXT,
    description TEXT,
    image TEXT,
    price NUMERIC,
    original_price NUMERIC,
    lessons INTEGER,
    duration TEXT,
    language TEXT,
    level TEXT,
    rating NUMERIC,
    reviews INTEGER,
    category TEXT,
    is_free BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 