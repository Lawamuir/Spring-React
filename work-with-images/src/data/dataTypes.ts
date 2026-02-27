export interface History {
    imagePaths:string[],
    mode:number[],
    insertedMessage:string[],
    exportedMessages:string[],
}

export interface User{
    id:number,
    login:string,
    pass:string,
    mode?:number,
    path?:string,
    updatedPath?:string,
}
