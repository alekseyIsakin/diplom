USE users;
DELIMITER $$;

CREATE VIEW get_registered_classes AS
SELECT
  shedule.id,
  start_utc0_ms AS start,
  group_id,
  duration_ms AS duration_minuts,
  frequence_cron AS freq_cron,
  once
FROM
  shedule
  LEFT JOIN teacher_classes ON class_id = teacher_classes.id;

CREATE VIEW get_classes AS
SELECT
  id,
  teacher_id,
  title,
  group_id
FROM
  teacher_classes;

CREATE PROCEDURE add_new_class(
  teacher_id BIGINT,
  group_id BIGINT,
  title TEXT
) BEGIN START TRANSACTION;
INSERT INTO
  teacher_classes (teacher_id, group_id, title)
VALUES
  (teacher_id, group_id, title);
COMMIT;
END $$;


CREATE PROCEDURE register_class(
  class_id BIGINT,
  freq_cron VARCHAR(20),
  start_utc BIGINT UNSIGNED,
  duration_minuts SMALLINT UNSIGNED,
  once TINYINT
) BEGIN START TRANSACTION;
INSERT INTO
  shedule (
    class_id,
    frequence_cron,
    start_utc0_ms,
    duration_ms,
    once
  )
VALUES
  (
    class_id,
    freq_cron,
    start_utc,
    duration_minuts,
    once
  );
COMMIT;
END $$;

CREATE PROCEDURE unregister_class(
	shedule_id BIGINT
) BEGIN START TRANSACTION;
DELETE from shedule where id=shedule_id;
COMMIT;
END $$;


CREATE PROCEDURE save_session(
	_group_id BIGINT,
	_session_token TEXT
) BEGIN START TRANSACTION;
INSERT INTO sessions 
	(
		group_id,
		session_token
	) 
	VALUES 
	(
		_group_id,
		_session_token
	);
COMMIT;
END $$;

CREATE FUNCTION delete_session(
	_group_id BIGINT
) RETURNS VARCHAR(20) DETERMINISTIC
BEGIN 

DECLARE _session_token VARCHAR(20);
select session_token INTO _session_token FROM sessions WHERE _group_id=group_id;

DELETE FROM sessions 
WHERE	group_id=_group_id;
RETURN (_session_token);
END $$;
