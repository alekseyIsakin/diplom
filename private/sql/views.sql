
--
CREATE VIEW get_class_teachers AS
select u.id,
	u.second_name
from teachers as t
	left join users as u on u.id = t.id;
--
--
--
CREATE VIEW get_class_shedule AS
select day_of_week.id as day_id,
	shedule_time.id as time_id,
	classes.up as up,
	students_group.id as group_id,
	students_group.year as group_year,
	students_group.facultet_id as facultet_id,
	shedule_time.duration_as_minuts as duration,
	classes.class_id as class_id,
	day_of_week.title as day,
	shedule_time.from_as_minuts as from_as_minuts,
	users.first_name as t_fname,
	users.second_name as t_sname,
	users.thrid_name as t_tname,
	users.id as teacher_id,
	teacher_classes.title as class,
	classes.cabinet as cabinet,
	students_group.title as student_group
from shedule
	right join classes on shedule.classes_id = classes.shedule_id
	right join teacher_classes on classes.class_id = teacher_classes.id
	right join students_group on teacher_classes.group_id = students_group.id
	right join users on teacher_classes.teacher_id = users.id
	right join day_of_week on day_of_week.id = shedule.day_id
	right join shedule_time ON shedule_time.id = shedule.time_id
order by day_of_week.id ASC,
	shedule_time.from_as_minuts ASC,
	students_group.title ASC,
	classes.up DESC;