--
-- Drop views
DROP VIEW IF EXISTS get_class_shedule;
DROP VIEW IF EXISTS get_class_teachers;

--
CREATE EXTENSION IF NOT EXISTS pgcrypto;
--
-- Drop tables
DROP TABLE IF EXISTS tokens  CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS teacher_classes CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS students_group CASCADE;
DROP TABLE IF EXISTS facultets CASCADE;
DROP TABLE IF EXISTS shedule CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS shedule_time CASCADE;
DROP TABLE IF EXISTS day_of_week CASCADE;
--
-- Drop functions
DROP FUNCTION IF EXISTS new_user_append;
DROP FUNCTION IF EXISTS change_user_role;
--
-- Tables
CREATE TABLE users (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
	nick VARCHAR (50) NOT NULL UNIQUE,
	first_name VARCHAR (50) NOT NULL,
	second_name VARCHAR (50) NOT NULL,
	thrid_name VARCHAR (50),
	password TEXT NOT NULL
);
CREATE TABLE facultets(
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
	title VARCHAR(50) NOT NULL UNIQUE,
	notes TEXT
);
CREATE TABLE students_group(
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
	title VARCHAR(50) NOT NULL,
	notes TEXT,
	year SMALLINT NOT NULL,
	facultet_id BIGINT,
	FOREIGN KEY (facultet_id) REFERENCES facultets(id)
);
CREATE TABLE students(
	id INTEGER NOT NULL UNIQUE,
	group_id INTEGER NOT NULL,
	note TEXT,
	FOREIGN KEY (id) REFERENCES users (id) ON
	DELETE RESTRICT,
	FOREIGN KEY (group_id) REFERENCES students_group (id) ON
	DELETE RESTRICT
);
CREATE TABLE teachers(
	id INTEGER NOT NULL UNIQUE,
	FOREIGN KEY (id) REFERENCES users (id) ON
	DELETE RESTRICT
);
CREATE TABLE admins(
	id INTEGER NOT NULL UNIQUE,
	FOREIGN KEY (id) REFERENCES users (id) ON
	DELETE RESTRICT
);
CREATE TABLE teacher_classes (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
	teacher_id INTEGER NOT NULL,
	title VARCHAR(100),
	group_id INTEGER,
	FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON
	DELETE RESTRICT,
	FOREIGN KEY (group_id) REFERENCES students_group (id) ON
	DELETE RESTRICT
);
CREATE TABLE tokens (
	channel_name VARCHAR (50) PRIMARY KEY UNIQUE,
	token TEXT NOT NULL,
	group_id INTEGER,
	class_id INTEGER NOT NULL,
	FOREIGN KEY (group_id) REFERENCES students_group(id),
	FOREIGN KEY (class_id) REFERENCES teacher_classes(id)
);
CREATE TABLE classes (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	shedule_id INTEGER NOT NULL,
	class_id INTEGER NOT NULL,
	cabinet VARCHAR(50),
	FOREIGN KEY (class_id) REFERENCES teacher_classes (id) ON
	DELETE CASCADE
);
CREATE TABLE shedule_time (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	from_as_minuts SMALLINT,
	duration_as_minuts SMALLINT
);
CREATE TABLE day_of_week (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	title VARCHAR(10)
);
CREATE TABLE shedule(
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	day_id INTEGER NOT NULL,
	time_id INTEGER NOT NULL,
	up BOOLEAN NOT NULL,
	FOREIGN KEY (day_id) REFERENCES day_of_week (id),
	FOREIGN KEY (time_id) REFERENCES shedule_time (id)
);
--
-- Tgriggers
--
-- When new user append
-- CREATE FUNCTION new_user_append() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
-- INSERT INTO students
-- VALUES (NEW.id, 0, NULL);
-- RETURN NEW;
-- END;
-- $$;
-- --
-- CREATE TRIGGER new_user_append
-- AFTER
-- INSERT ON users FOR EACH ROW EXECUTE FUNCTION new_user_append();
--
-- When user change the role
CREATE FUNCTION change_user_role() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM students s
where NEW.id = s.id;
DELETE FROM teachers t
where NEW.id = t.id;
DELETE FROM admins a
where NEW.id = a.id;
RETURN NEW;
END;
$$;
-- trigger
CREATE TRIGGER change_student_role BEFORE
INSERT ON students FOR EACH ROW EXECUTE FUNCTION change_user_role();
CREATE TRIGGER change_admin_role BEFORE
INSERT ON admins FOR EACH ROW EXECUTE FUNCTION change_user_role();
CREATE TRIGGER change_teacher_role BEFORE
INSERT ON teachers FOR EACH ROW EXECUTE FUNCTION change_user_role();
--
--
--
-- Procedures
-- Views
-- get info for full table
