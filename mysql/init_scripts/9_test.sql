USE users;

START TRANSACTION;

CALL add_student('n0',	 '', 		'',		 	'', 		'$2b$10$7wCD0k.kK.4a6VUPZK5Ti./u64gageD8f2bwSDORFevoZuq6LGU0S', '');
CALL add_student('n1',	 '', 		'',		 	'', 		'$2b$10$p8zyYdDuR6sHRFgRuRkrtO3CDAUHnoOUhdyNxZIgCWIZceizTZdzq', '');
CALL add_teacher('t0',	 't1', 		'ywww', 	'uasd2', 	'$2b$10$ME8pvYKUrfDxEoIP8gWEGegLUSoI8ZLnSzvLt2O3Gl1Cj1G4tHyTO', '');
CALL add_teacher('t1',	 't2', 		'y333', 	'uwqdq', 	'$2b$10$NM0fRUGmqCjMuFsXKWcxv.BovU8LGn06TeoSyKSuGR3RtBnvEbqWK', '');
CALL add_teacher('t2',	 't3', 		'y222', 	'uewqd', 	'$2b$10$TdPLIakUJoQvM7RGgoSvreZfT7VS0a3xHXdLFeTn7vSFaxnKTWjCO', '');
CALL add_student('n2',	 '', 		'', 		'', 		'$2b$10$K4UxviVaQZGNJ9JPtWRjgefBW/.7JZ7757Zdw0t2q8iV3YobWW1aG', '');
CALL add_admin(	 'a0',	 '', 		'', 		'', 		'$2b$10$aqEDj7HVvQu04RUhGrCeKey4JqNL0h5work9NSh9KNR7CKfz48eA2', '');
CALL add_student('n3',	 '', 		'', 		'', 		'$2b$10$h/GPTRdj8/.bdsyXmCBLuen9Os2mFvSVs3cpmTduO/T9rBXLoE2Ki', '');
CALL add_student('n4',	 '', 		'', 		'', 		'$2b$10$t/M5TORPSVgdB7T1cQQI3OKnhe2dleYz1GOyk0gTc1A8jCHzwl2sa', '');
CALL add_student('n5',	 '', 		'', 		'', 		'$2b$10$mCzt1lCEf7lOzMCkOsgOT.WMwhcjo1J.GqITnPnP6Q8jppYP7vNQu', '');

INSERT INTO s_groups (title, notes) VALUES ("IPO-19", "");
INSERT INTO s_groups (title, notes) VALUES ("IPO-20", "");
INSERT INTO s_groups (title, notes) VALUES ("IPO-21", "");
INSERT INTO s_groups (title, notes) VALUES ("EXTRA", "");

INSERT INTO student_group (student_id, group_id) 
select 
	(select s.id from students as s left join users on s.id = users.id where nick='n0'),
	(select id from s_groups where title='EXTRA');
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

-- 
CALL add_new_class(3, 1, "class [3-1]");
CALL add_new_class(4, 1, "class [4-1]");
CALL add_new_class(5, 1, "class [5-1]");
CALL add_new_class(3, 2, "class [3-2]");
CALL add_new_class(3, 3, "class [3-3]");
CALL add_new_class(4, 2, "class [4-2]");

COMMIT;