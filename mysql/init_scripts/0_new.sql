CREATE DATABASE users;

USE users;

--
-- Tables
CREATE TABLE users (
  id BIGINT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  nick VARCHAR (50) NOT NULL UNIQUE,
  first_name VARCHAR (50) NOT NULL,
  second_name VARCHAR (50) NOT NULL,
  thrid_name VARCHAR (50),
  passw_hash TEXT NOT NULL
);

CREATE TABLE s_groups (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  notes TEXT
);

CREATE TABLE students(
  id BIGINT NOT NULL,
  note TEXT,
  FOREIGN KEY (id) REFERENCES users (id) ON
  DELETE
    CASCADE
);

CREATE TABLE student_group(
  student_id BIGINT,
  group_id BIGINT,
  FOREIGN KEY (student_id) REFERENCES students (id) ON
    DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES s_groups (id) ON
    DELETE RESTRICT
);

CREATE TABLE teachers(
  id BIGINT NOT NULL UNIQUE,
  FOREIGN KEY (id) REFERENCES users (id) ON
    DELETE CASCADE
);

CREATE TABLE admins(
  id BIGINT NOT NULL UNIQUE,
  FOREIGN KEY (id) REFERENCES users (id) ON
  DELETE
    CASCADE
);

CREATE TABLE teacher_classes (
  id BIGINT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  teacher_id BIGINT NOT NULL,
  group_id BIGINT,
  title VARCHAR(100),
  FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON
  DELETE
    CASCADE,
    FOREIGN KEY (group_id) REFERENCES s_groups (id) ON
  DELETE
    CASCADE
);

CREATE TABLE shedule(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_id BIGINT,
  start_utc0_ms BIGINT UNSIGNED,
  duration_ms SMALLINT  UNSIGNED,
  frequence_cron TEXT,
  once BOOLEAN,
  FOREIGN KEY (class_id) REFERENCES teacher_classes (id) ON
  DELETE
    CASCADE
);

CREATE TABLE sessions(
  group_id BIGINT UNIQUE,
  session_token TEXT,
  FOREIGN KEY (group_id) REFERENCES s_groups (id) ON
  DELETE
    RESTRICT
);