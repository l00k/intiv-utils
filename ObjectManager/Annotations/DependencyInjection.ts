import { ClassConstructor } from '../def';
import ObjectManager from '../ObjectManager';


export default function DependencyInjection<T>() {
    return (Target : ClassConstructor<T>) => {
        // @ts-ignore
        const ExtClass = class extends Target
        {
            constructor(...ctorArgs : any[])
            {
                super(...ctorArgs);
                ObjectManager.loadDependencies(this, Target.prototype);
            }
        };

        // copy static variables
        Object.assign(ExtClass, Target);

        // assign name
        Object.defineProperty(ExtClass, 'name', { value: Target.name });

        return <any> ExtClass;
    };
}
