DROP TABLE users;
DROP TABLE roles;
CREATE EXTENSION pgcrypto;



CREATE TABLE roles (
	id serial PRIMARY KEY,
	name TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
	id serial PRIMARY KEY UNIQUE,
	nick varchar (50) NOT NULL UNIQUE,
	first_name varchar (50) NOT NULL,
	second_name varchar (50) NOT NULL,
	thrid_name varchar (50),
	role integer NOT NULL,
	password TEXT NOT NULL,
	FOREIGN KEY (role) REFERENCES roles (id)
);



INSERT INTO roles(id, name) VALUES (0, 'student');
INSERT INTO roles(id, name) VALUES (1, 'teacher');
INSERT INTO roles(id, name) VALUES (2, 'admin');


CREATE OR REPLACE PROCEDURE add_new_user(nick_name TEXT, f_name TEXT, s_name TEXT, t_name TEXT, passw TEXT) AS 
$$
BEGIN
	INSERT INTO users(nick, first_name, second_name, thrid_name, role, password) 
		values(nick_name, f_name, s_name, t_name, 0, crypt(passw, gen_salt('bf')));
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_user_password(user_name TEXT, passw TEXT) 
RETURNS BOOLEAN AS
$$
DECLARE passed BOOLEAN;
BEGIN
	SELECT (password = crypt(passw, password)) INTO passed
	from users
	where users.nick = user_name;
	
	RETURN passed;
END;
$$
LANGUAGE plpgsql;