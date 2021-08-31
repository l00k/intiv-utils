"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ObjectManager_1 = require("../ObjectManager");
class EventBus {
    constructor() {
        this.observers = new Map();
        this.listeners = {};
    }
    on(eventName, callee, observerClass) {
        if (lodash_1.isEmpty(this.listeners[eventName])) {
            this.listeners[eventName] = [];
        }
        if (observerClass) {
            let observer = this.observers.get(observerClass);
            if (!observer) {
                observer = ObjectManager_1.ObjectManager.getInstance(observerClass.constructor);
                this.observers.set(observerClass, observer);
            }
            callee.bind(observer);
        }
        this.listeners[eventName].push(callee);
    }
    async emit(eventName, data) {
        if (lodash_1.isEmpty(this.listeners[eventName])) {
            return;
        }
        for (const callback of this.listeners[eventName]) {
            await callback(data);
        }
    }
}
exports.default = EventBus;
