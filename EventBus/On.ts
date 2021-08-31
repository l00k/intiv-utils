import { ObjectManager } from '../ObjectManager';
import EventBus from './EventBus';
import Observer from './Observer';


export type ClassConstructor<T = {}> = new (...args : any[]) => T;

function On<T extends Observer>(eventName : string)
{
    return (Target : T, method : string, descriptor : PropertyDescriptor) => {
        let eventBus = <EventBus> ObjectManager.getInstance(EventBus);
        eventBus.on(eventName, descriptor.value, <any>Target);
    };
}

export default On;
