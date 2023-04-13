--
-- Drop views
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DROP VIEW IF EXISTS get_class_shedule;
--
-- Drop tables
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS teacher_classes;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS students_group;
DROP TABLE IF EXISTS shedule;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS shedule_time;
DROP TABLE IF EXISTS day_of_week;
--
-- Drop functions
DROP FUNCTION IF EXISTS new_user_append;
DROP FUNCTION IF EXISTS change_user_role;
--
-- Tables
CREATE TABLE users (
	id SERIAL PRIMARY KEY UNIQUE,
	nick VARCHAR (50) NOT NULL UNIQUE,
	first_name VARCHAR (50) NOT NULL,
	second_name VARCHAR (50) NOT NULL,
	thrid_name VARCHAR (50),
	password TEXT NOT NULL
);
CREATE TABLE students_group(
	id SERIAL PRIMARY KEY UNIQUE,
	title VARCHAR(50) NOT NULL,
	notes Text
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
CREATE TABLE tokens (
	channel_name VARCHAR (50) PRIMARY KEY UNIQUE,
	token TEXT NOT NULL,
	group_id INTEGER,
	FOREIGN KEY (group_id) REFERENCES students_group(id)
);
CREATE TABLE teacher_classes (
	id SERIAL PRIMARY KEY UNIQUE,
	teacher_id INTEGER NOT NULL,
	title VARCHAR(100),
	cabinet VARCHAR(50),
	group_id INTEGER,
	FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON
	DELETE RESTRICT,
	FOREIGN KEY (group_id) REFERENCES students_group (id) ON
	DELETE RESTRICT
);
CREATE TABLE classes (
	id SERIAL PRIMARY KEY NOT NULL,
	shedule_id INTEGER NOT NULL,
	up BOOLEAN NOT NULL,
	class_id INTEGER NOT NULL,
	FOREIGN KEY (class_id) REFERENCES teacher_classes (id) ON
	DELETE CASCADE
);
CREATE TABLE shedule_time (
	id SERIAL PRIMARY KEY,
	from_as_minuts SMALLINT,
	duration_as_minuts SMALLINT
);
CREATE TABLE day_of_week (id SERIAL PRIMARY KEY, title VARCHAR(10));
CREATE TABLE shedule(
	day_id INTEGER NOT NULL,
	time_id INTEGER NOT NULL,
	classes_id INTEGER,
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
CREATE VIEW get_class_shedule AS
select day_of_week.id as day_id,
	shedule_time.id as time_id,
	classes.up as up,
	students_group.id as group_id,
	shedule_time.duration_as_minuts as duration,
	classes.id as class_id,
	day_of_week.title as day,
	shedule_time.from_as_minuts as from_as_minuts,
	users.first_name as t_fname,
	users.second_name as t_sname,
	users.thrid_name as t_tname,
	teacher_classes.title as class,
	teacher_classes.cabinet as cabinet,
	students_group.title as student_group
from shedule
	right join classes on shedule.classes_id = classes.shedule_id
	right join teacher_classes on classes.class_id = teacher_classes.id
	right join students_group on teacher_classes.group_id = students_group.id
	right join users on teacher_classes.teacher_id = users.id
	right join day_of_week on day_of_week.id = shedule.day_id
	right join shedule_time ON shedule_time.id = shedule.time_id
order by day_of_week.id ASC,
	shedule_time.from_as_minuts ASC,
	students_group.title ASC,
	classes.up DESC;
END;