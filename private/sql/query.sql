-- SELECT u.id, t.id FROM users u RIGHT JOIN teachers t on u.id = t.id;
DELETE from tokens;
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
INSERT into facultets(title, notes) VALUES ('ФЭиА','');
INSERT into facultets(title, notes) VALUES ('ФЭиС','');
--
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИПО-19',	'', 19, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИСиТ-19',	'', 19, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'МТС-19',	'', 19, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИПО-20',	'', 20, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИСиТ-20',	'', 20, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'МТС-20',	'', 20, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИПО-21',	'', 21, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИСиТ-21',	'', 21, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'МТС-21',	'', 21, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИПО-22',	'', 22, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ИСиТ-22',	'', 22, id FROM facultets as f WHERE f.title='ФЭиА');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'МТС-22',	'', 22, id FROM facultets as f WHERE f.title='ФЭиА');
--
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПГС-19',	'', 19, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПИЭ-19',	'', 19, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭСМ-19',	'', 19, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭиУ-19',	'', 19, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПГС-20',	'', 20, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПИЭ-20',	'', 20, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭСМ-20',	'', 20, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭиУ-20',	'', 20, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПГС-21',	'', 21, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПИЭ-21',	'', 21, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭСМ-21',	'', 21, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭиУ-21',	'', 21, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПГС-22',	'', 22, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ПИЭ-22',	'', 22, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭСМ-22',	'', 22, id FROM facultets as f WHERE f.title='ФЭиС');
INSERT into students_group(title, notes, year, facultet_id) (SELECT 'ЭиУ-22',	'', 22, id FROM facultets as f WHERE f.title='ФЭиС');
--
-- all users
select add_new_user_as_student('1_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='ИПО-19'));
select add_new_user_as_student('2_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='ИПО-19'));
select add_new_user_as_student('3_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='ИПО-19'));
select add_new_user_as_student('4_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='ИПО-19'));
select add_new_user_as_teacher('5_teacher','М.', 'Полячкова', 'А.','123');
select add_new_user_as_student('6_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='ИПО-19'));
select add_new_user_as_teacher('7_teacher','В.','Кушнарёв','С.','123');
select add_new_user_as_teacher('8_teacher', 'К.','Фигура','Н.','123');
select add_new_user_as_teacher('9_teacher', 'Д.','Горохов','Б.','123');
select add_new_user_as_teacher('10_teacher','С.','Шаров','В.','123');
select add_new_user_as_student('11_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='ИСиТ-19'));
select add_new_user_as_student('12_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='ИСиТ-19'));
select add_new_user_as_student('13_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='ИСиТ-19'));
select add_new_user_as_student('14_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='ИСиТ-19'));
select add_new_user_as_student('15_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='ИСиТ-19'));

-- default values
-- time
INSERT into shedule_time(from_as_minuts, duration_as_minuts) VALUES ( 495, 95);
INSERT into shedule_time(from_as_minuts, duration_as_minuts) VALUES ( 600, 95);
INSERT into shedule_time(from_as_minuts, duration_as_minuts) VALUES ( 705, 95);
INSERT into shedule_time(from_as_minuts, duration_as_minuts) VALUES ( 810, 95);
INSERT into shedule_time(from_as_minuts, duration_as_minuts) VALUES ( 915, 95);
INSERT into shedule_time(from_as_minuts, duration_as_minuts) VALUES ( 1020, 95);
INSERT into shedule_time(from_as_minuts, duration_as_minuts) VALUES ( 1125, 95);
-- INSERT into shedule_time VALUES (0, 495, 30);
-- INSERT into shedule_time VALUES (1, 600, 15);
-- INSERT into shedule_time VALUES (2, 705, 10);
-- INSERT into shedule_time VALUES (3, 810, 20);
-- INSERT into shedule_time VALUES (4, 915, 95);
-- INSERT into shedule_time VALUES (5, 1020, 95);
-- INSERT into shedule_time VALUES (6, 1125, 300);
-- day
INSERT into day_of_week(title) VALUES ('mon');
INSERT into day_of_week(title) VALUES ('thu');
INSERT into day_of_week(title) VALUES ('sat');
INSERT into day_of_week(title) VALUES ('thu');
INSERT into day_of_week(title) VALUES ('fri');
INSERT into day_of_week(title) VALUES ('sat');
INSERT into day_of_week(title) VALUES ('sun');
--

-- teacher classes
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 5, 'л. Прикладные пакеты общего назначения','1348', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 5, 'л. Прикладные пакеты общего назначения','1343', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 5, 'лаб. Прикладные пакеты общего назначения','1348', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 5, 'лаб. Прикладные пакеты общего назначения','1343', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 7, 'л. Технические и программные средства защиты информации','1348', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 8, 'л. Средства интеграции программных модулей','1346', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 8, 'л. Средства интеграции программных модулей','1348', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 8, 'лаб. Средства интеграции программных модулей','1343', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 8, 'лаб. Средства интеграции программных модулей','1346', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 9, 'л. Экспертные системы','1344', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 9, 'лаб. Экспертные системы','1344', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 10, 'л. Прикладные пакеты в экономике','1348', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 10, 'лаб. Прикладные пакеты в экономике','1343', 1);
INSERT into teacher_classes (teacher_id, title, cabinet, group_id ) VALUES ( 10, 'лаб. Прикладные пакеты в экономике','1346', 1);

INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 5, 'л. Прикладные пакеты общего назначения','1348', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 5, 'л. Прикладные пакеты общего назначения','1343', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 5, 'лаб. Прикладные пакеты общего назначения','1348', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 5, 'лаб. Прикладные пакеты общего назначения','1343', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 7, 'л. Технические и программные средства защиты информации','1348', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 8, 'л. Средства интеграции программных модулей','1346', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 8, 'л. Средства интеграции программных модулей','1348', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 8, 'лаб. Средства интеграции программных модулей','1343', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 8, 'лаб. Средства интеграции программных модулей','1346', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 9, 'л. Экспертные системы','1344', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 9, 'лаб. Экспертные системы','1344', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 10, 'л. Прикладные пакеты в экономике','1348', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 10, 'лаб. Прикладные пакеты в экономике','1343', 2);
INSERT into teacher_classes ( teacher_id, title, cabinet, group_id ) VALUES ( 10, 'лаб. Прикладные пакеты в экономике','1346', 2);
--
-- classes one for day-time-group line
INSERT into classes ( shedule_id, up, class_id) VALUES (	1,		TRUE,		1);
INSERT into classes ( shedule_id, up, class_id) VALUES (	1,		FALSE,		2);
INSERT into classes ( shedule_id, up, class_id) VALUES (	2,		TRUE,		3);
INSERT into classes ( shedule_id, up, class_id) VALUES (	2,		FALSE,		4);
INSERT into classes ( shedule_id, up, class_id) VALUES (	3,		TRUE,		5);
INSERT into classes ( shedule_id, up, class_id) VALUES (	4,		TRUE,		5);
INSERT into classes ( shedule_id, up, class_id) VALUES (	5,		TRUE,		7);
INSERT into classes ( shedule_id, up, class_id) VALUES (	6,		TRUE,		3);
INSERT into classes ( shedule_id, up, class_id) VALUES (	7,		TRUE,		14);
INSERT into classes ( shedule_id, up, class_id) VALUES (	7,		FALSE,		9);
INSERT into classes ( shedule_id, up, class_id) VALUES (	8,		TRUE,		14);
INSERT into classes ( shedule_id, up, class_id) VALUES (	8,		FALSE,		10);

INSERT into classes ( shedule_id, up, class_id) VALUES (	1,		TRUE,		15);
INSERT into classes ( shedule_id, up, class_id) VALUES (	1,		FALSE,		16);
INSERT into classes ( shedule_id, up, class_id) VALUES (	2,		TRUE,		17);
INSERT into classes ( shedule_id, up, class_id) VALUES (	2,		FALSE,		18);
INSERT into classes ( shedule_id, up, class_id) VALUES (	3,		TRUE,		19);
INSERT into classes ( shedule_id, up, class_id) VALUES (	4,		TRUE,		19);
INSERT into classes ( shedule_id, up, class_id) VALUES (	5,		TRUE,		21);
INSERT into classes ( shedule_id, up, class_id) VALUES (	6,		TRUE,		17);
INSERT into classes ( shedule_id, up, class_id) VALUES (	7,		TRUE,		28);
INSERT into classes ( shedule_id, up, class_id) VALUES ( 	7,		FALSE,		23);
INSERT into classes ( shedule_id, up, class_id) VALUES ( 	8,		TRUE,		28);
INSERT into classes ( shedule_id, up, class_id) VALUES ( 	8,		FALSE,		24);

-- shedule

INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 1, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 2, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 3, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 4, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 5, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 6, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 7, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 1, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 2, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 3, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 4, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 5, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 6, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 7, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 1, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 2, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 3, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 4, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 5, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 6, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 7, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 1, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 2, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 3, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 4, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 5, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 6, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 7, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 1, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 2, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 3, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 4, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 5, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 6, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 7, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 1, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 2, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 3, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 4, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 5, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 6, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 7, 1);


