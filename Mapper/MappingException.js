"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = require("../Exception");
class MappingException extends Exception_1.Exception {
    constructor() {
        super(...arguments);
        this.name = 'MappingException';
        this.metadata = {
            responseCode: 406 // not acceptable
        };
    }
}
exports.default = MappingException;
