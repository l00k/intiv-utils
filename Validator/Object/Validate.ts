import { isEmpty } from 'lodash-es';
import { ValidationError } from '../def';
import ValidationException from '../ValidationException';
import ValidationResult from '../ValidationResult';
import Validator from '../Validator';


export default function Validate() {
    return (Target : Object, method : string, descriptor : any) => {
        const originalMethod = descriptor.value;

        descriptor.value = function(...params : any[]) {
            let errors : ValidationResult;

            const result = Validator.validateObject(this);
            if (!result.valid) {
                throw new ValidationException('Object validation using specified rules failed', 1573161073626, errors);
            }

            return originalMethod.apply(this, params);
        };
    };
}
