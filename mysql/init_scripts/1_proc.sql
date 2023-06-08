USE users;

DELIMITER $$;

CREATE PROCEDURE add_user (
  nick VARCHAR(50),
  f_name VARCHAR(50),
  s_name VARCHAR(50),
  t_name VARCHAR(50),
  p_hash TEXT
) BEGIN
INSERT INTO
  users (
    nick,
    first_name,
    second_name,
    thrid_name,
    passw_hash
  )
VALUES
  (
    nick,
    f_name,
    s_name,
    t_name,
    p_hash
  );

END $$;

CREATE PROCEDURE add_student (
  nick VARCHAR(50),
  f_name VARCHAR(50),
  s_name VARCHAR(50),
  t_name VARCHAR(50),
  p_hash TEXT,
  note TEXT
) BEGIN DECLARE last_id BIGINT DEFAULT 0;

START TRANSACTION;

CALL add_user(nick, f_name, s_name, t_name, p_hash);

SET
  last_id = LAST_INSERT_ID();

INSERT INTO
  students (id, note)
VALUES
  (last_id, " ");

COMMIT;

END $$;

CREATE PROCEDURE add_teacher (
  nick VARCHAR(50),
  f_name VARCHAR(50),
  s_name VARCHAR(50),
  t_name VARCHAR(50),
  p_hash TEXT,
  note TEXT
) BEGIN DECLARE last_id BIGINT DEFAULT 0;

START TRANSACTION;

CALL add_user(nick, f_name, s_name, t_name, p_hash);

SET
  last_id = LAST_INSERT_ID();

INSERT INTO
  teachers (id)
VALUES
  (last_id);

COMMIT;

END $$;

CREATE PROCEDURE add_admin (
  nick VARCHAR(50),
  f_name VARCHAR(50),
  s_name VARCHAR(50),
  t_name VARCHAR(50),
  p_hash TEXT,
  note TEXT
) BEGIN DECLARE last_id BIGINT DEFAULT 0;

START TRANSACTION;

CALL add_user(nick, f_name, s_name, t_name, p_hash);

SET
  last_id = LAST_INSERT_ID();

INSERT INTO
  admins (id)
VALUES
  (last_id);

COMMIT;

END $$;

CREATE PROCEDURE is_teacher (IN user_id BIGINT, OUT teacher TINYINT) BEGIN
SELECT
  COUNT(id) INTO teacher
FROM
  teachers
WHERE
  id = user_id;

END $$;