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
DO $$
DECLARE
    day bigint;
begin
FOR day IN select id as day from day_of_week
LOOP
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+1,		1,		'1');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+2,		2,		'2');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+3,		3,		'3');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+4,		4,		'4');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+5,		5,		'5');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+6,		6,		'6');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+7,		7,		'7');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+8,		8,		'8');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+9,		9,		'9');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+10,		10,		'10');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+11,		11,		'11');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+12,		1,		'12');

	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+1,		15,		'11');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+2,		16,		'22');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+3,		17,		'33');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+4,		18,		'44');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+5,		19,		'55');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+6,		19,		'66');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+7,		21,		'77');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+8,		17,		'88');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES (	(@day-1)*14+9,		28,		'99');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES ( 	(@day-1)*14+10,		23,		'1100');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES ( 	(@day-1)*14+11,		28,		'1111');
	INSERT into classes ( shedule_id, class_id, cabinet) VALUES ( 	(@day-1)*14+12,		24,		'1122');
END LOOP;
end;
$$ LANGUAGE plpgsql;

-- shedule

DO $$
DECLARE
    day bigint;
    tm bigint;
begin
FOR day IN select id as day from day_of_week
LOOP
	FOR tm IN select id as tm from shedule_time
	LOOP
		INSERT into shedule (day_id, time_id, up) VALUES (@day, @tm,	TRUE);
		INSERT into shedule (day_id, time_id, up) VALUES (@day, @tm,	FALSE);
	END LOOP;
END LOOP;
end;
$$ LANGUAGE plpgsql;