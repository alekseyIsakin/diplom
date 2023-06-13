type ErrorHandler = (error?: Error) => void;
type SuccesHandler<T> = (results: T) => void;
type CheckPassportS = {
    id: Number;
    nick: String;
    group_id: Number[];
};
type GetGroupsR = {
    id: Number;
    group_title: String;
};
type GetRegisteredClassesParticial = {
    id: Number;
    start: Number;
    duration_minuts: Number;
    group_id: Number;
    freq_cron: String;
    week_cnt: Number;
};
type GetRegisteredClassesFull = {
    id: Number;
    start: Number;
    duration_minuts: Number;
    group_id: Number;
    week_cnt: Number;
    class_title: string;
    group_title: string;
    first_name: string;
    second_name: string;
    thrid_name: string;
};
type GetClassesR = {
    teacher_id: Number;
    class_id: Number;
    group_id: Number;
    class_title: String;
    group_title: String;
};
type RegisterNewClassesR = {
    id: Number;
};
export declare class DataBase {
    static check_user_password(error: ErrorHandler, success: SuccesHandler<CheckPassportS>, user_nick: String, password: String): Promise<void>;
    static get_groups(error: ErrorHandler, success: SuccesHandler<GetGroupsR[]>): void;
    static add_new_class(error: ErrorHandler, success: SuccesHandler<null>, teacher_id: Number, group_id: Number, class_title: String): void;
    static get_classes(error: ErrorHandler, success: SuccesHandler<GetClassesR[]>, class_title: String, teacher_id: Number): void;
    static get_partial_registered_classes(error: ErrorHandler, success: SuccesHandler<GetRegisteredClassesParticial[]>, from: Number, to: Number, group_id: Number[], teacher_id?: Number): void;
    static get_full_registered_classes(error: ErrorHandler, success: SuccesHandler<GetRegisteredClassesFull[]>, from: Number, to: Number, group_id: Number[], teacher_id?: Number): void;
    static delete_classes(error: ErrorHandler, success: SuccesHandler<null>, classes_id: number[], teacher_id: number): void;
    static register_class(error: ErrorHandler, success: SuccesHandler<RegisterNewClassesR>, class_id: number, freq_cron: number, start: number, duration_minuts: number, week_cnt: number): void;
    static delay_registered_class_on_week(error: ErrorHandler, success: SuccesHandler<null>, class_id: number, start_utc: number, week_cnt: number): void;
    /** clear all stored sessions from DB
     * @param {ErrorHandler} success
     * @param {SuccesHandler<null>} error
    */
    static clear_sessions(error: ErrorHandler, success: SuccesHandler<null>): void;
    static unregister_class(error: ErrorHandler, success: SuccesHandler<null>, registered_class_id: Number): void;
    static unregister_classes(error: ErrorHandler, success: SuccesHandler<null>, registered_class_id: Number[]): void;
    static save_sesion(error: ErrorHandler, success: SuccesHandler<null>, group_id: Number, openvidu_session: String): void;
    static delete_sesion(error: ErrorHandler, success: SuccesHandler<string[]>, group_id: Number): void;
}
export {};
