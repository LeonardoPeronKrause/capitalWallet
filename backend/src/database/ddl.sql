-- `CREATE TYPE` create a new personalize data type on PostgreSQL
-- `transaction_type` its a name of new personalize data type
-- `AS ENUM` defined that its access **only listered values** 
CREATE TYPE transaction_type AS ENUM ('receita', 'despesa', 'investimento');

CREATE TABLE transactions (
	id SERIAL PRIMARY KEY,
	type transaction_type NOT NULL,
	description TEXT,
	value NUMERIC(10,2) NOT NULL,
	date DATE DEFAULT CURRENT_DATE
);