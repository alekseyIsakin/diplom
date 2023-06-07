CREATE DATABASE users;
USE users;
--
-- Tables
CREATE TABLE users (
	id bigint PRIMARY KEY UNIQUE,
	nick VARCHAR (50) NOT NULL UNIQUE,
	first_name VARCHAR (50) NOT NULL,
	second_name VARCHAR (50) NOT NULL,
	thrid_name VARCHAR (50),
	password TEXT NOT NULL
);
CREATE TABLE s_groups (
	id BIGINT PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	notes TEXT
);
CREATE TABLE students(
	id bigint NOT NULL ,
	note TEXT,
	FOREIGN KEY (id) REFERENCES users (id) ON
	DELETE CASCADE
);
CREATE TABLE student_groups(
	student_id bigint UNIQUE,
	group_id bigint UNIQUE,
	FOREIGN KEY (student_id) REFERENCES students (id) ON
	DELETE CASCADE,
	FOREIGN KEY (group_id) REFERENCES s_groups (id) ON
	DELETE RESTRICT
);
CREATE TABLE teachers(
	id bigint NOT NULL UNIQUE,
	FOREIGN KEY (id) REFERENCES users (id) ON
	DELETE CASCADE
);
CREATE TABLE admins(
	id bigint NOT NULL UNIQUE,
	FOREIGN KEY (id) REFERENCES users (id) ON
	DELETE CASCADE
);
CREATE TABLE teacher_classes (
	id bigint PRIMARY KEY UNIQUE,
	teacher_id bigint NOT NULL,
	group_id bigint,
	title VARCHAR(100),
	FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON
	DELETE CASCADE,
	FOREIGN KEY (group_id) REFERENCES s_groups (id) ON
	DELETE CASCADE
);
CREATE TABLE shedule(
	id bigint PRIMARY KEY,
	class_id bigint,
	start_utc0_ms bigint,
	duration_ms bigint,
	frequence_cron TEXT,
	FOREIGN KEY (class_id) REFERENCES teacher_classes (id) ON
	DELETE CASCADE
);

