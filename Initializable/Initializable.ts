import { Mapping, Properties, PropertySymbol, MappingSymbol, ClassConstructor } from './def';
import PropertyDescriptor from './PropertyDescriptor';

type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export default class Initializable<T>
{

    public constructor(data? : RecursivePartial<T>)
    {
    }

    public setData(data? : RecursivePartial<T>)
    {
        if (!data) {
            return;
        }

        const Target = Object.getPrototypeOf(this);

        const mapping = Target[MappingSymbol] || {};
        const properties : Properties = Target[PropertySymbol] || {};

        Object.entries(data)
            .forEach(([fieldName, rawValue]) => {
                const property = mapping[fieldName]
                    ? mapping[fieldName]
                    : fieldName;

                let propertyDsrp = properties[property];
                if (!propertyDsrp) {
                    propertyDsrp = new PropertyDescriptor({ preserveRaw: true });
                }

                // population blocked
                if (!propertyDsrp.populate) {
                    return;
                }

                if (rawValue === undefined || rawValue === null) {
                    this[property] = rawValue;
                }
                else if (propertyDsrp.preserveRaw) {
                    this[property] = rawValue;
                }
                else if (propertyDsrp.isPrimitive) {
                    this[property] = this._parseRawValue(propertyDsrp, rawValue);
                }
                else if (propertyDsrp.isArray) {
                    this[property] = [];

                    if (rawValue instanceof Array) {
                        rawValue.forEach((elm) => {
                            const subElm = this._parseRawValue(propertyDsrp, elm);
                            this[property].push(subElm);
                        });
                    }
                    else if (typeof rawValue == 'object') {
                        Object.keys(rawValue)
                            .forEach((idx) => {
                                const subElm = this._parseRawValue(propertyDsrp, rawValue[idx]);
                                this[property].push(subElm);
                            });
                    }
                }
                else {
                    this[property] = this._parseRawValue(propertyDsrp, rawValue);
                }
            });
    }

    protected _parseRawValue(propertyDsrp : PropertyDescriptor, rawValue : any)
    {
        const type : any = propertyDsrp.arrayOf || propertyDsrp.type;

        if (rawValue === undefined || rawValue === null) {
            return  rawValue;
        }
        else if (!type) {
            return rawValue;
        }
        else if (rawValue instanceof type) {
            return rawValue;
        }
        else if (type === Boolean) {
            return !!rawValue;
        }
        else if (type === Number) {
            return +rawValue;
        }
        else if (type === BigInt) {
            return BigInt(rawValue);
        }
        else if (type === String) {
            return typeof rawValue.toString == 'function'
                ? rawValue.toString()
                : '' + rawValue;
        }
        else if (type.prototype instanceof Initializable) {
            const object = new type();
            (<any>object).setData(rawValue);
            return object;
        }
        else {
            return new type(rawValue);
        }
    }

}
