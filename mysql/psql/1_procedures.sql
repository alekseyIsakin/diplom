DROP FUNCTION IF EXISTS add_new_user_as_admin;
DROP FUNCTION IF EXISTS add_new_user_as_teacher;
DROP FUNCTION IF EXISTS add_new_user_as_student;
DROP FUNCTION IF EXISTS add_new_user;
--
CREATE OR REPLACE FUNCTION add_new_user(
		nick_name TEXT,
		f_name TEXT,
		s_name TEXT,
		t_name TEXT,
		passw TEXT
	) RETURNS BIGINT AS $$
DECLARE resultId BIGINT;
begin
INSERT INTO users(
		id,
		nick,
		first_name,
		second_name,
		thrid_name,
		password
	)
VALUES(
		default,
		nick_name,
		f_name,
		s_name,
		t_name,
		crypt(passw, gen_salt('bf'))
	)
RETURNING id INTO resultId;
RETURN resultId;
END;
$$ LANGUAGE plpgsql;
--
--
CREATE OR REPLACE FUNCTION add_new_user_as_admin(
		nick_name TEXT,
		f_name TEXT,
		s_name TEXT,
		t_name TEXT,
		passw TEXT
	) RETURNS void LANGUAGE plpgsql AS $$
DECLARE resultId BIGINT;
BEGIN
SELECT *
FROM add_new_user(
		nick_name,
		f_name,
		s_name,
		t_name,
		passw
	) INTO resultId;
INSERT INTO admins(id)
VALUES (resultId);
END;
$$;
--
CREATE FUNCTION add_new_user_as_teacher(
	nick_name TEXT,
	f_name TEXT,
	s_name TEXT,
	t_name TEXT,
	passw TEXT
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE resultId BIGINT;
BEGIN
SELECT *
FROM add_new_user(
		nick_name,
		f_name,
		s_name,
		t_name,
		passw
	) INTO resultId;
INSERT INTO teachers(id)
VALUES (resultId);
END;
$$;
--
CREATE FUNCTION add_new_user_as_student(
	nick_name TEXT,
	f_name TEXT,
	s_name TEXT,
	t_name TEXT,
	passw TEXT,
	group_id BIGINT 
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE resultId BIGINT;
BEGIN
SELECT *
FROM add_new_user(
		nick_name,
		f_name,
		s_name,
		t_name,
		passw
	) INTO resultId;
INSERT INTO students(id, group_id)
VALUES (resultId, group_id);
END;
$$;