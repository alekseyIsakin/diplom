-- SELECT u.id, t.id FROM users u RIGHT JOIN teachers t on u.id = t.id;
DELETE from tokens;
DELETE from classes;
DELETE from shedule;
DELETE from teacher_classes;
DELETE from students;
DELETE from students_group;
DELETE from facultets;
DELETE from teachers;
DELETE from admins;
DELETE from users;
DELETE from shedule_time;
DELETE from day_of_week;
-- groups
INSERT into facultets(title, notes) VALUES ('����','');
INSERT into facultets(title, notes) VALUES ('����','');
--
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-19',	'', 19, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '����-19',	'', 19, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-19',	'', 19, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-20',	'', 20, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '����-20',	'', 20, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-20',	'', 20, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-21',	'', 21, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '����-21',	'', 21, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-21',	'', 21, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-22',	'', 22, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '����-22',	'', 22, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-22',	'', 22, id FROM facultets as f WHERE f.title='����');
--
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-19',	'', 19, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-19',	'', 19, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-19',	'', 19, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-19',	'', 19, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-20',	'', 20, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-20',	'', 20, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-20',	'', 20, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-20',	'', 20, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-21',	'', 21, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-21',	'', 21, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-21',	'', 21, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-21',	'', 21, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-22',	'', 22, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-22',	'', 22, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-22',	'', 22, id FROM facultets as f WHERE f.title='����');
INSERT into students_group(title, notes, year, facultet_id) (SELECT '���-22',	'', 22, id FROM facultets as f WHERE f.title='����');
--
-- all users
select add_new_user_as_student('1_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='���-19'));
select add_new_user_as_student('2_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='���-19'));
select add_new_user_as_student('3_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='���-19'));
select add_new_user_as_student('4_st','fn','sn','tn','123', (select id FROM students_group as g WHERE g.title='���-19'));
select add_new_user_as_teacher('5_teacher','�.', '���������', '�.','123');
select add_new_user_as_student('6_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='���-19'));
select add_new_user_as_teacher('7_teacher','�.','�������','�.','123');
select add_new_user_as_teacher('8_teacher', '�.','������','�.','123');
select add_new_user_as_teacher('9_teacher', '�.','�������','�.','123');
select add_new_user_as_teacher('10_teacher','�.','�����','�.','123');
select add_new_user_as_student('11_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='����-19'));
select add_new_user_as_student('12_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='����-19'));
select add_new_user_as_student('13_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='����-19'));
select add_new_user_as_student('14_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='����-19'));
select add_new_user_as_student('15_st','fn','sn','tn','123', (select id FROM students_group as g  WHERE g.title='����-19'));

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
--
-- teacher classes

INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1----------', (select id from students_group where title='���-19')  from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1---------', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1--------', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1-------', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1------', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1-----', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1----', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1---', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1--', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1-', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) (select id, '1', (select id from students_group where title='���-19') from get_class_teachers where second_name='������');
INSERT into teacher_classes (teacher_id, title, group_id ) VALUES ( 10, '�. ���������� ������ � ���������', 1);
INSERT into teacher_classes (teacher_id, title, group_id ) VALUES ( 10, '���. ���������� ������ � ���������', 1);
INSERT into teacher_classes (teacher_id, title, group_id ) VALUES ( 10, '���. ���������� ������ � ���������', 1);

INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 5, '�. ���������� ������ ������ ����������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 5, '�. ���������� ������ ������ ����������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 5, '���. ���������� ������ ������ ����������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 5, '���. ���������� ������ ������ ����������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 7, '�. ����������� � ����������� �������� ������ ����������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 8, '�. �������� ���������� ����������� �������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 8, '�. �������� ���������� ����������� �������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 8, '���. �������� ���������� ����������� �������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 8, '���. �������� ���������� ����������� �������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 9, '�. ���������� �������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 9, '���. ���������� �������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 10, '�. ���������� ������ � ���������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 10, '���. ���������� ������ � ���������', 2);
INSERT into teacher_classes ( teacher_id, title, group_id ) VALUES ( 10, '���. ���������� ������ � ���������', 2);
--
-- classes one for day-time-group line
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	1,		TRUE,		1,		'1');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	1,		FALSE,		2,		'2');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	2,		TRUE,		3,		'3');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	2,		FALSE,		4,		'4');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	3,		TRUE,		5,		'5');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	4,		TRUE,		6,		'6');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	5,		TRUE,		7,		'7');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	6,		TRUE,		8,		'8');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	7,		FALSE,		9,		'9');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	7,		TRUE,		10,		'0');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	8,		TRUE,		11,		'1');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	8,		FALSE,		1,		'2');

INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	1,		TRUE,		15,		'1');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	1,		FALSE,		16,		'2');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	2,		TRUE,		17,		'3');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	2,		FALSE,		18,		'4');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	3,		TRUE,		19,		'5');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	4,		TRUE,		19,		'6');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	5,		TRUE,		21,		'7');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	6,		TRUE,		17,		'8');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES (	7,		TRUE,		28,		'9');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES ( 	7,		FALSE,		23,		'0');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES ( 	8,		TRUE,		28,		'1');
INSERT into classes ( shedule_id, up, class_id, cabinet) VALUES ( 	8,		FALSE,		24,		'2');

-- shedule

INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 1, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 2, 2);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 3, 3);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 4, 4);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 5, 5);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 6, 6);
INSERT into shedule (day_id, time_id, classes_id) VALUES (1, 7, 7);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 1, 8);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 2, 9);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 3, 10);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 4, 11);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 5, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 6, 2);
INSERT into shedule (day_id, time_id, classes_id) VALUES (2, 7, 3);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 1, 4);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 2, 5);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 3, 6);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 4, 7);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 5, 8);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 6, 9);
INSERT into shedule (day_id, time_id, classes_id) VALUES (3, 7, 10);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 1, 11);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 2, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 3, 2);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 4, 3);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 5, 4);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 6, 5);
INSERT into shedule (day_id, time_id, classes_id) VALUES (4, 7, 6);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 1, 7);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 2, 8);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 3, 9);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 4, 10);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 5, 11);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 6, 1);
INSERT into shedule (day_id, time_id, classes_id) VALUES (5, 7, 2);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 1, 3);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 2, 4);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 3, 5);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 4, 6);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 5, 7);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 6, 8);
INSERT into shedule (day_id, time_id, classes_id) VALUES (6, 7, 9);