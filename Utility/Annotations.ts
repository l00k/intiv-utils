import { debounce } from 'lodash';

export function Debounce(delay : number = 300)
{
    return (Target : Object, method : string, descriptor : PropertyDescriptor) => {
        let originalMethod = descriptor.value;
        descriptor.value = debounce(originalMethod, delay);
    }
}
