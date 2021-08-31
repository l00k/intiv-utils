import { InjectionDescription, ClassConstructor, InjectOptions } from '../def';
import ObjectManager from '../ObjectManager';


export default function Inject(options?: InjectOptions)
{
    return (Target : Object, propertyName : string) => {
        const Type = Reflect.getMetadata('design:type', Target, propertyName);
        const description = new InjectionDescription(Type);
        Object.assign(description, options);
        ObjectManager.registerInjection(Target, propertyName, description);
    };
}

