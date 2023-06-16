'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBase = void 0;
require('dotenv').config();
const mysql = require("mysql2");
const { loggers } = require('winston');
const logger = require('./logger')(__filename);
const bcrypt = require('bcrypt');
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_SECRET,
    port: process.env.MYSQL_PORT
});
connection.connect();
function make_query(query, params) {
    return connection
        .promise()
        .query(query, params)
        .then((results) => {
        let r = {
            error: undefined,
            results: results[0]
        };
        return r;
    })
        .catch((error) => {
        logger._error(`error when query:\n\t${error.message}]`, true);
        return { error: error, results: [] };
    });
}
const compare_password = (passw_hash, passw) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(passw, passw_hash);
});
class DataBase {
    static start_check_connect() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.warn(`first connection to mysql`);
            while (true) {
                logger.warn(`check connect `);
                connection.connect((err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        logger._error(`connection failed`);
                        DataBase.is_connected = false;
                    }
                    else {
                        logger.warn(`still connect `);
                        DataBase.is_connected = true;
                    }
                }));
                if (DataBase.is_connected)
                    break;
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
        });
    }
    static check_user_password(error, success, user_nick, password) {
        return __awaiter(this, void 0, void 0, function* () {
            logger._debug(`check passport of user [${user_nick}]`);
            const q = "SELECT id, nick, passw_hash as p, group_id from users left join student_group on users.id=student_id where nick=?;";
            const v = [user_nick];
            const p = make_query(q, v);
            if (p !== undefined)
                p.then((value) => {
                    logger._debug(`check_passw [${JSON.stringify(value)}]`, true);
                    if (value.results.length <= 0 || value.error) {
                        logger._debug(`unknown user [${user_nick}]`);
                        error(value.error);
                        return;
                    }
                    compare_password(value.results[0].p, password)
                        .then(r => {
                        if (r) {
                            const g_id = [];
                            value.results.every(v => g_id.push(v.group_id));
                            success({
                                id: value.results[0].id,
                                nick: value.results[0].nick,
                                group_id: g_id,
                            });
                            logger._debug(`passport is valid user:[${user_nick}]`);
                        }
                        else {
                            logger._debug(`passport is invalid user:[${user_nick}]`);
                            error(value.error);
                        }
                    });
                });
        });
    }
    // static add_new_student(nick, f_name, t_name, s_name, password) { }
    // static add_new_teacher(nick, f_name, t_name, s_name, password) { }
    // static add_new_admin(nick, f_name, t_name, s_name, password) { }
    // static get_students() { }
    // static get_teachers() { }
    // static get_admins() { }
    // static change_role(id, new_role) { }
    // static delete_user(id) { }
    // static add_new_group(title) { }
    // static delete_group(title) { }
    static get_groups(error, success, group_ids) {
        const q = `SELECT id, group_title FROM get_groups ${group_ids === undefined ?
            ';' :
            'where id in (' + new Array(group_ids === null || group_ids === void 0 ? void 0 : group_ids.length).fill('?').join() + ')'}`;
        const v = [];
        if (group_ids !== undefined)
            for (let i = 0; i < group_ids.length; i++)
                v.push(group_ids[i]);
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(value.results);
            });
    }
    // static add_student_to_group(student_id, group_id) { }
    // static remove_student_from_group(student_id, group_id) { }
    static add_new_class(error, success, teacher_id, group_id, class_title) {
        const q = "CALL add_new_class(?,?,?)";
        const v = [teacher_id, group_id, class_title];
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(null);
            });
    }
    static get_classes(error, success, class_title, teacher_id) {
        const q = "SELECT teacher_id, class_id, group_id, class_title, group_title FROM get_classes WHERE teacher_id=?" + (class_title === undefined ? ';' : ' and class_title like ?;');
        const v = [teacher_id, class_title];
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(value.results);
            });
    }
    /**
     * succes return 'true' when no collision detected
     *
     * @param error
     * @param success
     * @param from
     * @param duration
     * @param group_id
     * @param week_cnt
     */
    static check_register_ccollision(error, success, from, duration, class_id, week_cnt) {
        const q = "SELECT check_collision(?,?,?,?) as collisions";
        const v = [from, duration, week_cnt, class_id];
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(value.results[0].collisions == 0);
            });
    }
    static get_partial_registered_classes(error, success, from, to, group_id, teacher_id) {
        logger._info(`get registered classes for\n\t group:[${group_id}]; teacher:[${teacher_id}]; from:[${from}]; to[${to}]`);
        const q = `SELECT id, start, group_id, duration_minuts, freq_cron, week_cnt  from get_registered_classes  where start>=? and start<=? ` +
            (group_id.length == 0 ? '' : 'and group_id in (' + (new Array(group_id.length).fill('?')).join() + ')') +
            (teacher_id === null ? '' : 'and teacher_id=? ');
        const v = [from, to];
        if (group_id.length == 0)
            group_id.forEach(el => v.push(el));
        if (teacher_id !== null)
            v.push(teacher_id);
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(value.results);
            });
    }
    static get_full_registered_classes(error, success, from, to, group_id, teacher_id) {
        logger._info(`get registered classes for\n\t group:[${group_id}]; teacher:[${teacher_id}]; from:[${from}]; to[${to}]`);
        const q = `SELECT id, start, group_id, teacher_id, duration_minuts, freq_cron, class_title, group_title, first_name, second_name, thrid_name, week_cnt from get_registered_classes  where start>=? and start<=? ` +
            (group_id.length == 0 ? '' : 'and group_id in (' + (new Array(group_id.length).fill('?')).join() + ')') +
            (teacher_id === null ? '' : 'and teacher_id=? ');
        const v = [from, to];
        if (group_id != undefined && group_id.length > 0)
            group_id.forEach(el => v.push(el));
        if (teacher_id !== null)
            v.push(teacher_id);
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(value.results);
            });
    }
    // static delete_class(id) { }
    static delete_classes(error, success, classes_id, teacher_id) {
        logger._info(`delete classes ${classes_id}`);
        const q = "delete from teacher_classes where teacher_id=? and id in (" + new Array(classes_id.length).fill('?').join() + ")";
        const v = [teacher_id];
        classes_id.forEach(el => v.push(el));
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(null);
            });
    }
    static register_class(error, success, class_id, freq_cron, start, duration_minuts, week_cnt) {
        logger._info(`register class ${class_id} ${freq_cron} ${duration_minuts}`);
        const q = "select register_class(?,?,?,?,?) as id;";
        const v = [class_id, freq_cron, start, duration_minuts, week_cnt];
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(value.results[0]);
            });
    }
    static delay_registered_class_on_week(error, success, class_id, start_utc, week_cnt) {
        const week = 7 * 24 * 60 * week_cnt;
        const q = "CALL delay_registered_class(?,?);";
        const v = [class_id, start_utc + week];
        logger._info(`update class delay ${class_id} on [${start_utc + week}]`);
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(null);
            });
    }
    /** clear all stored sessions from DB
     * @param {ErrorHandler} success
     * @param {SuccesHandler<null>} error
    */
    static clear_sessions(error, success) {
        logger._info(`clear saved sessions`, true);
        const q = "delete from sessions";
        const p = make_query(q);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(null);
            });
    }
    static get_sessions_token(error, success, user_id) {
        const q = `
			SELECT count(*) as is_teacher from teachers where id=?;`;
        const v = [user_id];
        const p = make_query(q, v);
        p === null || p === void 0 ? void 0 : p.then((value) => {
            if (value.error) {
                error(value.error);
                return;
            }
            let p;
            if (value.results[0].is_teacher == 0)
                p = DataBase.get_sessions_token_for_students(error, success, user_id);
            else
                p = DataBase.get_sessions_token_for_teacher(error, success, user_id);
            p === null || p === void 0 ? void 0 : p.then(res => {
                logger._debug(JSON.stringify(res));
                if (res.error)
                    error(res.error);
                else
                    success(res.results);
            }).catch(err => {
                logger._debug(JSON.stringify(err));
            });
        });
    }
    static get_sessions_token_for_teacher(error, success, user_id) {
        const q = `
			SELECT * from get_session_teacher_groups where user_id=?;`;
        const v = [user_id];
        return make_query(q, v);
    }
    static get_sessions_token_for_students(error, success, user_id) {
        const q = `
			SELECT * from get_session_student_groups where user_id=?;`;
        const v = [user_id];
        return make_query(q, v);
    }
    static unregister_class(error, success, registered_class_id) {
        logger._info(`unregister_class ${registered_class_id}`, true);
        const q = "CALL unregister_class(?);";
        const v = [registered_class_id];
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(null);
            });
    }
    static unregister_classes(error, success, registered_class_id) {
        logger._info(`unregister_class ${registered_class_id}`, true);
        const q = "delete from shedule where id in (" + new Array(registered_class_id.length).fill('?').join() + ")";
        const v = registered_class_id;
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(null);
            });
    }
    static save_sesion(error, success, id, group_id, openvidu_session) {
        const q = "CALL save_session(?,?,?);";
        const v = [id, group_id, openvidu_session];
        logger._info(`save sessions for group: ${v}`, true);
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error)
                    error(value.error);
                else
                    success(null);
            });
    }
    static delete_sesion(error, success, group_id) {
        const q = "select delete_session(?) as deleted;";
        logger._info(`close session [${group_id}]`, true);
        const v = [group_id];
        const p = make_query(q, v);
        if (p !== undefined)
            p.then((value) => {
                if (value.error || value.results.length == 0)
                    error(value.error);
                else
                    success(value.results);
            });
    }
}
exports.DataBase = DataBase;
DataBase.is_connected = false;
//# sourceMappingURL=ManagerDB.js.map