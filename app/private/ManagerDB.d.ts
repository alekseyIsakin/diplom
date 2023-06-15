type ErrorHandler = (error?: Error) => void;
type SuccesHandler<T> = (results: T) => void;
type CheckPassportS = {
    id: number;
    nick: String;
    group_id: number[];
};
type GetGroupsR = {
    id: number;
    group_title: String;
};
type GetSessionsTokenR = {
    tiken: String;
    group_title: String;
    student_id: number;
};
type GetRegisteredClassesParticial = {
    id: number;
    start: number;
    duration_minuts: number;
    group_id: number;
    freq_cron: String;
    week_cnt: number;
};
type GetRegisteredClassesFull = {
    id: number;
    start: number;
    duration_minuts: number;
    group_id: number;
    week_cnt: number;
    class_title: string;
    group_title: string;
    first_name: string;
    second_name: string;
    thrid_name: string;
};
type GetClassesR = {
    teacher_id: number;
    class_id: number;
    group_id: number;
    class_title: String;
    group_title: String;
};
type RegisterNewClassesR = {
    id: number;
};
export declare class DataBase {
    static is_connected: boolean;
    static start_check_connect(): Promise<void>;
    static check_user_password(error: ErrorHandler, success: SuccesHandler<CheckPassportS>, user_nick: String, password: String): Promise<void>;
    static get_groups(error: ErrorHandler, success: SuccesHandler<GetGroupsR[]>): void;
    static add_new_class(error: ErrorHandler, success: SuccesHandler<null>, teacher_id: number, group_id: number, class_title: String): void;
    static get_classes(error: ErrorHandler, success: SuccesHandler<GetClassesR[]>, class_title: String, teacher_id: number): void;
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
    static check_register_ccollision(error: ErrorHandler, success: SuccesHandler<boolean>, from: number, duration: number, class_id: number, week_cnt: number): void;
    static get_partial_registered_classes(error: ErrorHandler, success: SuccesHandler<GetRegisteredClassesParticial[]>, from: number, to: number, group_id: number[], teacher_id?: number): void;
    static get_full_registered_classes(error: ErrorHandler, success: SuccesHandler<GetRegisteredClassesFull[]>, from: number, to: number, group_id: number[], teacher_id?: number): void;
    static delete_classes(error: ErrorHandler, success: SuccesHandler<null>, classes_id: number[], teacher_id: number): void;
    static register_class(error: ErrorHandler, success: SuccesHandler<RegisterNewClassesR>, class_id: number, freq_cron: number, start: number, duration_minuts: number, week_cnt: number): void;
    static delay_registered_class_on_week(error: ErrorHandler, success: SuccesHandler<null>, class_id: number, start_utc: number, week_cnt: number): void;
    /** clear all stored sessions from DB
     * @param {ErrorHandler} success
     * @param {SuccesHandler<null>} error
    */
    static clear_sessions(error: ErrorHandler, success: SuccesHandler<null>): void;
    static get_sessions_token(error: ErrorHandler, success: SuccesHandler<GetSessionsTokenR[]>, user_id: number): void;
    static unregister_class(error: ErrorHandler, success: SuccesHandler<null>, registered_class_id: number): void;
    static unregister_classes(error: ErrorHandler, success: SuccesHandler<null>, registered_class_id: number[]): void;
    static save_sesion(error: ErrorHandler, success: SuccesHandler<null>, group_id: number, openvidu_session: String): void;
    static delete_sesion(error: ErrorHandler, success: SuccesHandler<string[]>, group_id: number): void;
}
export {};
