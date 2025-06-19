export class User {
    private _userId!: number;
    public get userId(): number {
        return this._userId;
    }
    public set userId(value: number) {
        this._userId = value;
    }

    private _username: string;
    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    private _email: string;
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    private _password: string;
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    private _userType: string;
    public get userType(): string {
        return this._userType;
    }
    public set userType(value: string) {
        this._userType = value;
    }


    constructor(firstname : string , Email : string , Password : string , type : string){
        this._username = firstname;
        this._email = Email;
        this._password = Password;
        this._userType = type;
    }
    
}
