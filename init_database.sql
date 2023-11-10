-- Create a User table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_role ENUM ('player', 'host') NOT NULL
);

-- Enable the PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create a Profiles table with location data
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    rating NUMERIC(6, 2), -- Change the data type and precision as needed
    location GEOGRAPHY(POINT) -- Define the location column
);

-- Create an index on the username field for quick lookups
CREATE UNIQUE INDEX idx_users_username ON users (username);

-- Create an index on the email field for quick email-based logins
CREATE UNIQUE INDEX idx_users_email ON users (email);
