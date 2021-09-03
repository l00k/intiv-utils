import { InjectionDescription } from '../def';
import Configuration from '../Configuration';


export default function Config(configPath : string, defaultValue : any = null)
{
    return (Target : Object, propertyName : string) => {
        const description = new InjectionDescription();
        Object.assign(description, { configPath, defaultValue });

        Configuration.getSingleton()
            .registerInjection(Target, propertyName, description);
    };
}

