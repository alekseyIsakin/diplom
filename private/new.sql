--
-- Drop tables
DROP TABLE IF EXISTS shedule;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS teacher_classes;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS students_group;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS shedule_time;
DROP TABLE IF EXISTS day_of_week;
--
-- Drop functions
drop function if exists new_user_append;
drop function if exists change_user_role;
drop function if exists get_class_shedule;
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
	st_group INTEGER NOT NULL,
	note TEXT,
	FOREIGN KEY (id) REFERENCES users (id) ON
	DELETE RESTRICT,
	FOREIGN KEY (st_group) REFERENCES students_group (id) ON
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
	id SERIAL PRIMARY KEY UNIQUE,
	teacher_id INTEGER NOT NULL,
	title VARCHAR(50),
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
CREATE FUNCTION new_user_append() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO students
VALUES (NEW.id, 0, NULL);
RETURN NEW;
END;
$$;
-- trigger
CREATE TRIGGER new_user_append
AFTER
INSERT ON users FOR EACH ROW EXECUTE FUNCTION new_user_append();
--
-- When user change role
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
-- Functions
CREATE FUNCTION get_class_shedule() RETURNS TABLE (
	day_id integer,
	time_id integer,
	up boolean,
	group_id integer,
	
	day VARCHAR(10),
	from_as_minuts SMALLINT,
	teacher VARCHAR(50),
	class VARCHAR(50),
	cabinet VARCHAR(50),
	student_group VARCHAR(50)
) LANGUAGE plpgsql AS $$ BEGIN
return query
select 
	day_of_week.id,
	shedule_time.id,
	classes.up,
	students_group.id,
	
	day_of_week.title,
	shedule_time.from_as_minuts,
	users.nick,
	teacher_classes.title,
	teacher_classes.cabinet,
	students_group.title
from shedule
	right join classes on shedule.classes_id = classes.shedule_id
	right join teacher_classes on classes.class_id = teacher_classes.id
	right join students_group on teacher_classes.group_id = students_group.id
	right join users on teacher_classes.teacher_id = users.id
	right join day_of_week on day_of_week.id = shedule.day_id
	right join shedule_time ON shedule_time.id = shedule.time_id --where shedule.day_id = 0
order by day_of_week.id ASC,
	shedule_time.from_as_minuts ASC,
	students_group.title ASC,
	classes.up DESC;
END;
$$