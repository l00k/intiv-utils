import { InjectionDescription, InjectableOptions, ClassConstructor } from '../def';
import ObjectManager from '../ObjectManager';


export default function Injectable<T>(options? : InjectableOptions)
{
    return (Target : ClassConstructor<T>) => {
        ObjectManager.getSingleton()
            .registerInjectable(Target, options);
    };
}
