import { IUser } from './user.interface';
export declare const UserService: {
    getAllUsersFromDB: (page: number, perPage: number, searchKey: string) => Promise<{
        users: (import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        pagination: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    updateProfileInDB: (id: string, updateData: Partial<IUser>) => Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findUserById: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteUserFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
