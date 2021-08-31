"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const def_1 = require("../def");
const ObjectManager_1 = tslib_1.__importDefault(require("../ObjectManager"));
function Inject(options) {
    return (Target, propertyName) => {
        const Type = Reflect.getMetadata('design:type', Target, propertyName);
        const description = new def_1.InjectionDescription(Type);
        Object.assign(description, options);
        ObjectManager_1.default.registerInjection(Target, propertyName, description);
    };
}
exports.default = Inject;
