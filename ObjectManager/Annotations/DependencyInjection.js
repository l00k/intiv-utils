"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ObjectManager_1 = tslib_1.__importDefault(require("../ObjectManager"));
function DependencyInjection() {
    return (Target) => {
        // @ts-ignore
        const ExtClass = class extends Target {
            constructor(...ctorArgs) {
                super(...ctorArgs);
                ObjectManager_1.default.loadDependencies(this, Target.prototype);
            }
        };
        // copy static variables
        Object.assign(ExtClass, Target);
        // assign name
        Object.defineProperty(ExtClass, 'name', { value: Target.name });
        return ExtClass;
    };
}
exports.default = DependencyInjection;
