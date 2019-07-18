CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text not null,
    num_employees integer,
    description text,
    logo_url text
)