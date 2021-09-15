import { InjectionDescription, ClassConstructor, InjectOptions } from '../def';
import ObjectManager from '../ObjectManager';


export default function Singleton<T>()
{
    return (Target : ClassConstructor<T>) => {
        ObjectManager.getSingleton()
            .registerSingleton(Target);
    };
}

