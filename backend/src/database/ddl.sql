-- `CREATE TYPE` create a new personalize data type on PostgreSQL
-- `transaction_type` its a name of new personalize data type
-- `AS ENUM` defined that its access **only listered values** 
CREATE TYPE transaction_type AS ENUM ('receita', 'despesa', 'investimento');

-- Transactions table
CREATE TABLE transactions (
	id SERIAL PRIMARY KEY,
	type transaction_type NOT NULL,
	description TEXT,
	value NUMERIC(10,2) NOT NULL,
	date DATE DEFAULT CURRENT_DATE
);

-- Users table, to have multiple regiters
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name varchar(100) NOT NULL,
	email VARCHAR(100) NOT NULL,
	password varchar(100) NOT NULL
);