import { MapOptions, MapSymbol } from './def';


function ApplyMapping()
{
    return (Target : Object, method : string, descriptor : any) => {
        const TargetProto = Target.constructor.prototype;
        const MethodProto = TargetProto[method];

        // collect default mapping
        const paramTypes = Reflect.getMetadata('design:paramtypes', Target, method);

        if (!MethodProto[MapSymbol]) {
            MethodProto[MapSymbol] = {};
        }

        for (let parameterIdx in paramTypes) {
            const paramType = paramTypes[parameterIdx];

            if (!MethodProto[MapSymbol][parameterIdx]) {
                MethodProto[MapSymbol][parameterIdx] = {
                    targetClass: paramType,
                };
            }
        }

        // apply patch to method
        let originalMethod = descriptor.value;

        descriptor.value = async function(...params : any[]) {
            for (let parameterIdx in params) {
                if (
                    !MethodProto[MapSymbol][parameterIdx]
                    || !params[parameterIdx]
                ) {
                    continue;
                }

                const paramMap : MapOptions = MethodProto[MapSymbol][parameterIdx];

                // resolve getter
                let plainValue = !!paramMap.getterCallee
                    ? await paramMap.getterCallee.call(this, ...params)
                    : params[parameterIdx];

                params[parameterIdx] = paramMap.mappingFunction(plainValue, paramMap);
            }

            return await originalMethod.apply(this, params);
        };
    };
}

export default ApplyMapping;
