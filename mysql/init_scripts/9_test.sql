USE users;

START TRANSACTION;

CALL add_student('n0', '', '', '', '123', '');
CALL add_student('n1', '', '', '', '123', '');
CALL add_teacher('t0', '', '', '', '123', '');
CALL add_teacher('t1', '', '', '', '123', '');
CALL add_student('n2', '', '', '', '123', '');
CALL add_teacher('t2', '', '', '', '123', '');
CALL add_admin('a0', '', '', '', '123', '');
CALL add_student('n3', '', '', '', '123', '');
CALL add_student('n4', '', '', '', '123', '');
CALL add_student('n5', '', '', '', '123', '');

INSERT INTO s_groups (title, notes) VALUES ("IPO-19", "");
INSERT INTO s_groups (title, notes) VALUES ("IPO-20", "");
INSERT INTO s_groups (title, notes) VALUES ("IPO-21", "");

INSERT INTO student_group (student_id, group_id) 
select 
	(select s.id from students as s left join users on s.id = users.id where nick='n0'),
	(select id from s_groups where title='IPO-21');

INSERT INTO student_group (student_id, group_id) 
select 
	(select s.id from students as s left join users on s.id = users.id where nick='n1'),
	(select id from s_groups where title='IPO-19');
	INSERT INTO student_group (student_id, group_id) 
select 
	(select s.id from students as s left join users on s.id = users.id where nick='n2'),
	(select id from s_groups where title='IPO-19');
	INSERT INTO student_group (student_id, group_id) 
select 
	(select s.id from students as s left join users on s.id = users.id where nick='n3'),
	(select id from s_groups where title='IPO-20');
	INSERT INTO student_group (student_id, group_id) 
select 
	(select s.id from students as s left join users on s.id = users.id where nick='n4'),
	(select id from s_groups where title='IPO-19');
	INSERT INTO student_group (student_id, group_id) 
select 
	(select s.id from students as s left join users on s.id = users.id where nick='n5'),
	(select id from s_groups where title='IPO-21');
COMMIT;