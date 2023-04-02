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
INSERT into students_group VALUES (1, 'g1','');
INSERT into students_group VALUES (2, 'g2','');
-- all users
INSERT into users VALUES (0, 'a1','','','','***');
INSERT into users VALUES (1, 's1','','','','***');
INSERT into users VALUES (2, 's2','','','','***');
INSERT into users VALUES (3, 's3','','','','***');
INSERT into users VALUES (4, 's4','','','','***');
INSERT into users VALUES (5, 't1','','','','***');
INSERT into users VALUES (7, 't2','','','','***');
INSERT into users VALUES (8, 't3','','','','***');
-- teachers
INSERT into teachers VALUES (5);
INSERT into teachers VALUES (7);
INSERT into teachers VALUES (8);
-- admins
INSERT into admins VALUES (0);
-- student groups
UPDATE students SET st_group = 1 WHERE id = 1;
UPDATE students SET st_group = 1 WHERE id = 2;
UPDATE students SET st_group = 2 WHERE id = 3;
UPDATE students SET st_group = 2 WHERE id = 4;

-- default values
-- time
INSERT into shedule_time VALUES (0, 540, 45);
INSERT into shedule_time VALUES (1, 600, 45);
INSERT into shedule_time VALUES (2, 660, 45);
INSERT into shedule_time VALUES (3, 720, 45);
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
INSERT into teacher_classes VALUES (1, 5, 'p1','1111', 1);
INSERT into teacher_classes VALUES (2, 5, 'p2','1111', 2);
INSERT into teacher_classes VALUES (3, 7, 'p2','1112', 1);
INSERT into teacher_classes VALUES (4, 7, 'p3','1114', 1);
INSERT into teacher_classes VALUES (5, 7, 'p1','1112', 2);
INSERT into teacher_classes VALUES (6, 7, 'p3','1113', 2);
INSERT into teacher_classes VALUES (7, 8, 'p3','1114', 1);
INSERT into teacher_classes VALUES (8, 8, 'p2','1113', 2);
INSERT into teacher_classes VALUES (9, 5, 'p1','1111', 2);

-- classes
INSERT into classes VALUES (1,1,TRUE ,1);
INSERT into classes VALUES (2,1,TRUE ,8);
INSERT into classes VALUES (3,1,FALSE ,3);
INSERT into classes VALUES (4,1,FALSE ,2);
INSERT into classes VALUES (5,2,TRUE ,7);
INSERT into classes VALUES (6,2,TRUE ,6);
INSERT into classes VALUES (7,2,FALSE ,1);
INSERT into classes VALUES (8,2,FALSE ,9);
INSERT into classes VALUES (9,3,TRUE ,6);
INSERT into classes VALUES (10,3,FALSE ,1);

-- shedule
INSERT into shedule VALUES (0, 0, 1);
INSERT into shedule VALUES (0, 1, 2);
INSERT into shedule VALUES (0, 2, 3);
INSERT into shedule VALUES (0, 3, NULL);

-- Query
select day_of_week.title, 
	shedule_time.from_as_minuts,
	users.nick,
	teacher_classes.title, 
	teacher_classes.cabinet, 
	students_group.title,
from shedule 
	right join classes on shedule.classes_id = classes.shedule_id 
	right join teacher_classes on classes.class_id = teacher_classes.id
	right join students_group on teacher_classes.group_id = students_group.id
	right join users on teacher_classes.teacher_id = users.id
	right join day_of_week on day_of_week.id = shedule.day_id
	right join shedule_time ON shedule_time.id = shedule.time_id
	--order by 
where classes.up = false



