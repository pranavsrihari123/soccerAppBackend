-- Drop existing tables if they exist

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Drop all tables
DO $$ 
DECLARE
    table_to_drop text;
BEGIN
    FOR table_to_drop IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || table_to_drop || '" CASCADE';
    END LOOP;
END $$;

-- Enable foreign key checks
RESET session_replication_role;

-- Create ENUM type for user_role if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('player', 'host');
    END IF;
END $$;

-- Create new tables

-- Create a Teams table with additional columns
CREATE TABLE IF NOT EXISTS teams (
    team_id UUID PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    team_rating NUMERIC(6, 2) DEFAULT 0,
    number_of_players INT DEFAULT 1,
    max_number_of_players INT,
    type_of_sport VARCHAR(20) CHECK (type_of_sport IN ('basketball', 'soccer', 'football')),
    intensity VARCHAR(20) CHECK (intensity IN ('casual', 'competitive')),
    gender VARCHAR(20) CHECK (gender IN ('men', 'women', 'co-ed'))
);

-- Index on team_name for quick lookups
CREATE INDEX IF NOT EXISTS idx_teams_team_name ON teams (team_name);

-- Create a User table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_role user_role NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE, -- New column for date of birth
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    rating NUMERIC(6, 2),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female'))
);

-- Index on username for quick lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- Index on email for quick email-based logins
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Create a junction table for user-team relationships
CREATE TABLE IF NOT EXISTS user_teams (
    user_id UUID REFERENCES users(user_id),
    team_id UUID REFERENCES teams(team_id),
    PRIMARY KEY (user_id, team_id)
);

-- Index on team_id for efficient team-related queries
CREATE INDEX IF NOT EXISTS idx_user_teams_team_id ON user_teams (team_id);

-- Create an ImportantDates table
CREATE TABLE IF NOT EXISTS important_dates (
    date_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    event_name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL
);

-- Index on user_id for efficient user-related queries
CREATE INDEX IF NOT EXISTS idx_important_dates_user_id ON important_dates (user_id);

-- Create a Courts table
CREATE TABLE IF NOT EXISTS courts (
    court_id SERIAL PRIMARY KEY,
    court_name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    number_of_courts INT NOT NULL,
    court_photo_path VARCHAR(255)
);

-- Index on court_name for quick lookups
CREATE INDEX IF NOT EXISTS idx_courts_court_name ON courts (court_name);

-- Create a Fields table
CREATE TABLE IF NOT EXISTS fields (
    field_id SERIAL PRIMARY KEY,
    field_name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    number_of_fields INT NOT NULL,
    field_photo_path VARCHAR(255)
);

-- Index on field_name for quick lookups
CREATE INDEX IF NOT EXISTS idx_fields_field_name ON fields (field_name);

-- Create a ChatMessage table for team chats
CREATE TABLE IF NOT EXISTS team_chats (
    message_id SERIAL PRIMARY KEY,
    team_id UUID REFERENCES teams(team_id),
    sender_id UUID REFERENCES users(user_id),
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on team_id for efficient team-related queries
CREATE INDEX IF NOT EXISTS idx_team_chats_team_id ON team_chats (team_id);

-- Create a Games table
CREATE TABLE IF NOT EXISTS games (
    game_id SERIAL PRIMARY KEY,
    court_id INT REFERENCES courts(court_id),
    field_id INT REFERENCES fields(field_id),
    game_date DATE,
    game_time TIME
);

-- Index on court_id for efficient court-related queries
CREATE INDEX IF NOT EXISTS idx_games_court_id ON games (court_id);

-- Index on field_id for efficient field-related queries
CREATE INDEX IF NOT EXISTS idx_games_field_id ON games (field_id);

-- Trigger to update team_rating when player ratings change
DO $do$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'player_rating_change') THEN
        CREATE OR REPLACE FUNCTION update_team_rating()
        RETURNS TRIGGER AS $func$
        BEGIN
            UPDATE teams
            SET team_rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM users
                WHERE team_id = NEW.team_id
            )
            WHERE team_id = NEW.team_id;
        
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;

        CREATE TRIGGER player_rating_change
        AFTER INSERT OR UPDATE OF rating ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_team_rating();
    END IF;
END $do$;
