"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Initializable_1 = require("../Initializable");
class ValidationResult extends Initializable_1.Initializable {
    constructor() {
        super(...arguments);
        this.valid = true;
        this.properties = {};
        this.subObjects = {};
        this.parameters = {};
        this.returnType = true;
    }
}
exports.default = ValidationResult;
