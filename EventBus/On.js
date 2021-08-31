"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ObjectManager_1 = require("../ObjectManager");
const EventBus_1 = tslib_1.__importDefault(require("./EventBus"));
function On(eventName) {
    return (Target, method, descriptor) => {
        let eventBus = ObjectManager_1.ObjectManager.getInstance(EventBus_1.default);
        eventBus.on(eventName, descriptor.value, Target);
    };
}
exports.default = On;
