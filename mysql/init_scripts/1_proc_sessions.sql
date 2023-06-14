USE users;
DELIMITER $$;

CREATE VIEW get_registered_classes AS
SELECT
  s.id,
  start_utc_minuts AS start,
  group_id,
	teacher_id,
  duration_minuts AS duration_minuts,
  frequence_cron AS freq_cron,
	t.title as class_title,
	g.title as group_title,
	first_name,
	second_name,
	thrid_name,
  week_cnt
FROM
  shedule as s
  LEFT JOIN teacher_classes as t ON s.class_id = t.id
  LEFT JOIN s_groups as g ON t.group_id = g.id
  LEFT JOIN users as u ON teacher_id = u.id
ORDER BY start ASC;

CREATE VIEW get_groups AS
SELECT
	id, title as group_title
FROM
	s_groups;

CREATE VIEW get_classes AS
SELECT
  teacher_id,
  t.id as class_id,
  g.id as group_id,
  t.title as class_title,
  g.title as group_title
FROM
  teacher_classes as t
left join s_groups as g on g.id=t.group_id;


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
--
--
--
CREATE FUNCTION register_class(
  class_id BIGINT,
  freq_cron VARCHAR(20),
  start_utc BIGINT UNSIGNED,
  duration_minuts SMALLINT UNSIGNED,
  week_cnt TINYINT
) RETURNS BIGINT UNSIGNED
DETERMINISTIC
BEGIN
		shedule (
			class_id,
			frequence_cron,
			start_utc_minuts,
			duration_minuts,
			week_cnt
		)
	VALUES
		(
			class_id,
			freq_cron,
			start_utc,
			duration_minuts,
			week_cnt
		);
	RETURN LAST_INSERT_ID();
END $$;

CREATE PROCEDURE unregister_class(
	shedule_id BIGINT
) BEGIN START TRANSACTION;
DELETE from shedule where id=shedule_id;
COMMIT;
END $$;

CREATE PROCEDURE delay_registered_class(
	shedule_id BIGINT,
	new_start_utc BIGINT UNSIGNED
) BEGIN START TRANSACTION;
UPDATE shedule
	SET start_utc_minuts = new_start_utc
WHERE 
	id=shedule_id;
COMMIT;
END $$;
--
--
--
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

DROP FUNCTION CHECK_COLLISION$$
CREATE FUNCTION check_collision(
  check_start BIGINT UNSIGNED,
  check_duration SMALLINT UNSIGNED,
  check_week_cnt TINYINT,
  c_id BIGINT UNSIGNED
) RETURNS INTEGER
DETERMINISTIC
BEGIN
	DECLARE abs_check_start BIGINT UNSIGNED;
	DECLARE abs_check_week_cnt BIGINT UNSIGNED DEFAULT 1;
	DECLARE week INTEGER;
	IF check_week_cnt=0 THEN SET abs_check_week_cnt=1;
	END IF;
	SET week=(10080*abs_check_week_cnt);
	SET abs_check_start=mod(check_start,week);
	INSERT INTO debug (msg) VALUES (CONCAT('abs start: ', abs_check_start));
	INSERT INTO debug (msg) VALUES (CONCAT('abs start_utc_minuts: ', mod(start_utc_minuts, week)))
	SELECT 
		count(*) INTO @cnt,
	FROM 
		shedule 
	WHERE 
		class_id=c_id and (	
			abs_check_start >= mod(start_utc_minuts, week) and
			abs_check_start <= mod(start_utc_minuts, week + duration_minuts) 
		or 
			abs_check_start+check_duration >= mod(start_utc_minuts, week) and 
			abs_check_start+check_duration <= mod(start_utc_minuts, week) + duration_minuts);
	RETURN @cnt;
END $$
