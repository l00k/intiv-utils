"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ObjectManager_1 = tslib_1.__importDefault(require("../ObjectManager"));
function Injectable(options) {
    return (Target) => {
        ObjectManager_1.default.registerInjectable(Target, options);
    };
}
exports.default = Injectable;
