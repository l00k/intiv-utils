import { Exception } from '../Exception';


type ConfigurationData = {
    [path : string] : any,
};


class Configuration
{

    protected data : ConfigurationData = {};

    public load(data : any)
    {
        this.createFlatData('', data);
    }

    protected createFlatData(path : string, tree : any)
    {
        for (let idx in tree) {
            let nodePath = path + (path ? '.' : '') + idx;
            this.data[nodePath] = tree[idx];

            if (typeof tree[idx] == 'object') {
                this.createFlatData(nodePath, tree[idx]);
            }
        }
    }

    public get<T>(path : string, defaultValue ? : any) : T
    {
        if (!this.data[path]) {
            if (typeof defaultValue == 'undefined') {
                throw new Exception(`Configuration [${path}] not found and default value not defined.`, 1572874195282);
            }
            else {
                return defaultValue;
            }
        }

        return this.data[path];
    }

}


export default Configuration;
