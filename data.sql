
DROP DATABASE IF EXISTS "jobly";
CREATE DATABASE "jobly";
\c "jobly"

CREATE TABLE companies(
    handle TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    num_employees INTEGER,
    description TEXT,
    logo_url TEXT
);

CREATE TABLE users(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    photo_url TEXT,
    is_admin BOOLEAN NOT NULL default FALSE
);

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT,
    equity FLOAT CHECK(equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted timestamp NOT NULL DEFAULT NOW()

);

CREATE TABLE applications(
    username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    job_id INTEGER  REFERENCES jobs ON DELETE CASCADE,
    state TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY(username, job_id)
);
INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES
  ('testHandle', 'testName', 20, 'testing company','http://google.com'),
  ('apple', 'apple', 10000, 'a big company','http://google.com');


INSERT INTO users (username, password, first_name, last_name, email, photo_url) VALUES
('mcTestUsername', 'test1234', 'test', 'testLastName', 'test@test.com', 'http:google.com'),
('maragreene', 'password1', 'mara', 'greene', 'mgreene@skidmore.edu', 'http:google.com');


  
INSERT INTO jobs (title, salary, equity, company_handle) VALUES 
('ceo', 1000000, 0.3, 'testHandle'),
('boss',100000, 0.4,'apple');




Create test database with tables

DROP DATABASE IF EXISTS "jobly-test";
CREATE DATABASE "jobly-test";
\c "jobly-test"


CREATE TABLE companies(
    handle TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    num_employees INTEGER,
    description TEXT,
    logo_url TEXT
);

CREATE TABLE users(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    photo_url TEXT,
    is_admin BOOLEAN NOT NULL default FALSE
);

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT,
    equity FLOAT CHECK(equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted timestamp NOT NULL DEFAULT NOW()
);

