import { isEmpty } from 'lodash';
import { ObjectManager } from '../ObjectManager';
import Observer from './Observer';


type Callback = (data : any) => any;

type Listners = {
    [eventName : string] : Callback[]
};


export default class EventBus
{

    protected observers : Map<typeof Observer, Observer> = new Map();

    protected listeners : Listners = {};

    public on(eventName : string, callee : Callback, observerClass? : typeof Observer)
    {
        if (isEmpty(this.listeners[eventName])) {
            this.listeners[eventName] = [];
        }

        if (observerClass) {
            let observer = this.observers.get(observerClass);
            if (!observer) {
                observer = ObjectManager.getInstance(<any> observerClass.constructor);
                this.observers.set(observerClass, observer);
            }

            callee.bind(observer);
        }

        this.listeners[eventName].push(callee);
    }

    public async emit(eventName : string, data? : any)
    {
        if (isEmpty(this.listeners[eventName])) {
            return;
        }

        for (const callback of this.listeners[eventName]) {
            await callback(data);
        }
    }

}
