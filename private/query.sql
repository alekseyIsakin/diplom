-- SELECT u.id, t.id FROM users u RIGHT JOIN teachers t on u.id = t.id;
DELETE from classes;
DELETE from shedule;
DELETE from teacher_classes;
DELETE from students;
DELETE from students_group;
DELETE from teachers;
DELETE from admins;
DELETE from users;
DELETE from shedule_time;
DELETE from day_of_week;
-- groups
INSERT into students_group VALUES (0, 'without group','');
INSERT into students_group VALUES (1, 'ИПО-19','');
INSERT into students_group VALUES (2, 'ИСиТ-19','');
INSERT into students_group VALUES (3, 'МТС-19','');
-- all users
INSERT into users VALUES (0, 'a1','','','','***');
INSERT into users VALUES (1, 's1','','','','***');
INSERT into users VALUES (2, 's2','','','','***');
INSERT into users VALUES (3, 's3','','','','***');
INSERT into users VALUES (4, 's4','','','','***');
INSERT into users VALUES (5,		't1',		'М.',		'Полячкова',		'А.',		'***');
INSERT into users VALUES (7,		't2',		'В.',		'Кушнарёв',			'С.',		'***');
INSERT into users VALUES (8,		't3',		'К.',		'Фигура',				'Н.',		'***');
INSERT into users VALUES (9,		't4',		'Д.',		'Горохов',			'Б.',		'***');
INSERT into users VALUES (10,		't5',		'С.',		'Шаров',				'В.',		'***');
-- teachers
INSERT into teachers VALUES (5);
INSERT into teachers VALUES (7);
INSERT into teachers VALUES (8);
INSERT into teachers VALUES (9);
INSERT into teachers VALUES (10);
-- admins
INSERT into admins VALUES (0);
-- student groups
UPDATE students SET st_group = 1 WHERE id = 1;
UPDATE students SET st_group = 2 WHERE id = 3;
UPDATE students SET st_group = 2 WHERE id = 4;
UPDATE students SET st_group = 1 WHERE id = 2;

-- default values
-- time
INSERT into shedule_time VALUES (0, 495, 95);
INSERT into shedule_time VALUES (1, 600, 95);
INSERT into shedule_time VALUES (2, 705, 95);
INSERT into shedule_time VALUES (3, 810, 95);
INSERT into shedule_time VALUES (4, 915, 95);
INSERT into shedule_time VALUES (5, 1020, 95);
INSERT into shedule_time VALUES (6, 1125, 95);
-- day
INSERT into day_of_week VALUES (0, 'mon');
INSERT into day_of_week VALUES (1, 'thu');
INSERT into day_of_week VALUES (2, 'sat');
INSERT into day_of_week VALUES (3, 'thu');
INSERT into day_of_week VALUES (4, 'fri');
INSERT into day_of_week VALUES (5, 'sat');
INSERT into day_of_week VALUES (6, 'sun');
--

-- teacher classes
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (1, 5, 'л. Прикладные пакеты общего назначения','1348', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (2, 5, 'л. Прикладные пакеты общего назначения','1343', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (3, 5, 'лаб. Прикладные пакеты общего назначения','1348', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (4, 5, 'лаб. Прикладные пакеты общего назначения','1343', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (5, 7, 'л. Технические и программные средства защиты информации','1348', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (6, 8, 'л. Средства интеграции программных модулей','1346', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (7, 8, 'л. Средства интеграции программных модулей','1348', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (8, 8, 'лаб. Средства интеграции программных модулей','1343', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (14, 8, 'лаб. Средства интеграции программных модулей','1346', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (9, 9, 'л. Экспертные системы','1344', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (10, 9, 'лаб. Экспертные системы','1344', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (11, 10, 'л. Прикладные пакеты в экономике','1348', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (12, 10, 'лаб. Прикладные пакеты в экономике','1343', 1);
INSERT into teacher_classes (id, teacher_id, title, cabinet, group_id ) VALUES (13, 10, 'лаб. Прикладные пакеты в экономике','1346', 1);
--
-- classes one for day-time-group line
INSERT into classes (id, shedule_id, up, class_id) VALUES (1,		1,		TRUE,			1);
INSERT into classes (id, shedule_id, up, class_id) VALUES (2,		1,		FALSE,		2);
INSERT into classes (id, shedule_id, up, class_id) VALUES (3,		2,		TRUE,			3);
INSERT into classes (id, shedule_id, up, class_id) VALUES (4,		2,		FALSE,		4);
INSERT into classes (id, shedule_id, up, class_id) VALUES (5,		3,		TRUE,			5);
INSERT into classes (id, shedule_id, up, class_id) VALUES (6,		4,		TRUE,			5);
INSERT into classes (id, shedule_id, up, class_id) VALUES (7,		5,		TRUE,			7);
INSERT into classes (id, shedule_id, up, class_id) VALUES (8,		6,		TRUE,			3);
INSERT into classes (id, shedule_id, up, class_id) VALUES (9,		7,		TRUE,			14);
INSERT into classes (id, shedule_id, up, class_id) VALUES (10,	7,		FALSE,		9);
INSERT into classes (id, shedule_id, up, class_id) VALUES (11,		8,		TRUE,			14);
INSERT into classes (id, shedule_id, up, class_id) VALUES (12,	8,		FALSE,		10);

-- shedule
INSERT into shedule (day_id, time_id, classes_id) VALUES (0, 0, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (0, 1, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (0, 2, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (0, 3, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (0, 4, 2);
INSERT into shedule (day_id, time_id, classes_id) VALUES (0, 5, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (0, 6, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 0, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 1, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 2, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 3, 3);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 4, 4);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 5, 5);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 6, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 0, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 1, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 2, 6);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 3, 7);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 4, 8);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 5, null);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 6, null);




