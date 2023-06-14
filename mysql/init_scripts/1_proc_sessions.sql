USE users;

DELIMITER $$;

CREATE VIEW get_registered_classes AS
SELECT
	s.id,
	start_utc_minuts AS START,
	group_id,
	teacher_id,
	duration_minuts AS duration_minuts,
	frequence_cron AS freq_cron,
	t.title AS class_title,
	G.title AS group_title,
	first_name,
	second_name,
	thrid_name,
	week_cnt
FROM
	shedule AS s
	LEFT JOIN teacher_classes AS t ON s.class_id = t.id
	LEFT JOIN s_groups AS G ON t.group_id = G.id
	LEFT JOIN users AS u ON teacher_id = u.id
ORDER BY
	START ASC;

CREATE VIEW get_groups AS
SELECT
	id,
	title AS group_title
FROM
	s_groups;

CREATE VIEW get_classes AS
SELECT
	teacher_id,
	t.id AS class_id,
	G.id AS group_id,
	t.title AS class_title,
	G.title AS group_title
FROM
	teacher_classes AS t
	LEFT JOIN s_groups AS G ON G.id = t.group_id;

CREATE PROCEDURE add_new_class(
	teacher_id BIGINT,
	group_id BIGINT,
	title TEXT
) BEGIN
	START TRANSACTION;

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
) RETURNS BIGINT UNSIGNED DETERMINISTIC BEGIN
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

CREATE PROCEDURE unregister_class(shedule_id BIGINT) BEGIN
	START TRANSACTION;

DELETE FROM
	shedule
WHERE
	id = shedule_id;

COMMIT;

END $$;

CREATE PROCEDURE delay_registered_class(
	shedule_id BIGINT,
	new_start_utc BIGINT UNSIGNED
) BEGIN
	START TRANSACTION;

UPDATE
	shedule
SET
	start_utc_minuts = new_start_utc
WHERE
	id = shedule_id;

COMMIT;

END $$;

--
--
--
CREATE PROCEDURE save_session(_group_id BIGINT, _session_token TEXT) BEGIN
	START TRANSACTION;

INSERT INTO
	sessions (group_id, session_token)
VALUES
	(_group_id, _session_token);

COMMIT;

END $$;

CREATE FUNCTION delete_session(_group_id BIGINT) RETURNS VARCHAR(20) DETERMINISTIC BEGIN
	DECLARE
		_session_token VARCHAR(20);

SELECT
	session_token INTO _session_token
FROM
	sessions
WHERE
	_group_id = group_id;

DELETE FROM
	sessions
WHERE
	group_id = _group_id;

RETURN (_session_token);

END $$;
--
--
--
DROP FUNCTION CHECK_COLLISION $$ CREATE FUNCTION check_collision(
	check_start BIGINT UNSIGNED,
	check_duration SMALLINT UNSIGNED,
	check_week_cnt TINYINT,
	group_id BIGINT UNSIGNED
) RETURNS INTEGER DETERMINISTIC BEGIN
	DECLARE
		abs_check_start BIGINT UNSIGNED;

DECLARE
	abs_check_week_cnt BIGINT UNSIGNED DEFAULT 1;

DECLARE
	WEEK INTEGER;

IF check_week_cnt = 0 THEN
SELECT
	COUNT(*) INTO @cnt
FROM
	shedule AS s
	LEFT JOIN teacher_classes AS t ON t.id = s.class_id
WHERE
	t.group_id = group_id
	AND(
		check_start >= start_utc_minuts
		AND check_start <= start_utc_minuts + duration_minuts
		OR check_start + check_duration >= start_utc_minuts
		AND check_start + check_duration <= start_utc_minuts + duration_minuts
	);

ELSE
SET
	WEEK =(10080 * abs_check_week_cnt);

SET
	abs_check_start = MOD(check_start, WEEK);

SET
	abs_check_week_cnt = check_week_cnt;

SELECT
	COUNT(*) INTO -- st, 
	@cnt
FROM
	shedule AS s
	LEFT JOIN teacher_classes AS t ON t.id = s.class_id
WHERE
	t.group_id = group_id
	AND (
		abs_check_start >= MOD(start_utc_minuts, WEEK)
		AND abs_check_start <= MOD(start_utc_minuts, WEEK) + duration_minuts
		OR abs_check_start + check_duration >= MOD(start_utc_minuts, WEEK)
		AND abs_check_start + check_duration <= MOD(start_utc_minuts, WEEK) + duration_minuts
	);

END IF;

RETURN @cnt;

END $$