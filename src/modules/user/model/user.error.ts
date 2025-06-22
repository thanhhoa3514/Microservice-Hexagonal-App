export class UserAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`User with email ${email} already exists`);
        this.name = "UserAlreadyExistsError";
    }
}

export class UserNotFoundError extends Error {
    constructor(id: string) {
        super(`User with id ${id} not found`);
        this.name = "UserNotFoundError";
    }
}

export class UserInvalidCredentialsError extends Error {
    constructor() {
        super("Invalid credentials");
        this.name = "UserInvalidCredentialsError";
    }
}

export class UserInvalidTokenError extends Error {
    constructor() {
        super("Invalid token");
        this.name = "UserInvalidTokenError";
    }
}

export class UserInvalidPasswordError extends Error {
    constructor() {
        super("Invalid password");
        this.name = "UserInvalidPasswordError";
    }
}

export class UserNotActiveError extends Error {
    constructor() {
        super("User not active");
        this.name = "UserNotActiveError";
    }
}