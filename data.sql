

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text not null,
    num_employees integer,
    description text,
    logo_url text
);

CREATE TABLE jobs(
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text not null,
    salary float not null,
    equity float not null,
    company_handle text not null REFERENCES companies ON DELETE CASCADE ,
    date_posted timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT jobs_equity_check CHECK ((equity < 1))
);