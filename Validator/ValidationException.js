"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = require("../Exception");
class ValidationException extends Exception_1.Exception {
    constructor(message, code, details) {
        super(message, code);
        this.name = 'ValidationException';
        this.details = details || this.details;
    }
}
exports.default = ValidationException;
