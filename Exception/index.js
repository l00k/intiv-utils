"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorException = exports.RuntimeException = exports.InitiationException = exports.Exception = exports.Throwable = void 0;
class Throwable extends Error {
    constructor(message, code, error) {
        super(message);
        this.name = 'Throwable';
        this.code = 1584917642177;
        this.metadata = {
            responseCode: 500 // general interal server error
        };
        this.code = code || this.code;
        if (error) {
            this.initErrorMessage(message, error);
        }
    }
    toString() {
        return this.name + (this.code ? ' [' + this.code + ']' : '') + ': ' + this.message;
    }
    initErrorMessage(message, error) {
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = (new Error(message)).stack;
        }
        let messageLines = (this.message.match(/\n/g) || []).length + 1;
        this.stack = this.constructor.name + ': ' + message + '\n' +
            this.stack.split('\n').slice(1, messageLines + 1).join('\n')
            + '\n'
            + error.stack;
    }
}
exports.Throwable = Throwable;
/**
 * Exceptions
 */
class Exception extends Throwable {
    constructor() {
        super(...arguments);
        this.name = 'Exception';
        this.code = 1584918043677;
    }
}
exports.Exception = Exception;
class InitiationException extends Exception {
    constructor() {
        super(...arguments);
        this.name = 'InitiationException';
        this.code = 1584918121810;
    }
}
exports.InitiationException = InitiationException;
class RuntimeException extends Exception {
    constructor() {
        super(...arguments);
        this.name = 'RuntimeException';
        this.code = 1584918093925;
    }
}
exports.RuntimeException = RuntimeException;
/**
 * Errors
 */
class ErrorException extends Throwable {
    constructor() {
        super(...arguments);
        this.name = 'ErrorException';
        this.code = 1584917646475;
    }
}
exports.ErrorException = ErrorException;
