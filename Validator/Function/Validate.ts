import { isEmpty } from 'lodash-es';
import { ValidationError } from '../def';
import ValidationException from '../ValidationException';
import ValidationResult from '../ValidationResult';
import Validator from '../Validator';


export default
function Validate(
    validateParamTypes : boolean = true,
    validateReturnType : boolean = false
) {
    return (Target : Object, method : string, descriptor : PropertyDescriptor) => {
        let originalMethod = descriptor.value;

        descriptor.value = function(...params : any[]) {
            const result = Validator.validateMethod(Target, method, params);
            if (!result.valid) {
                throw new ValidationException('Parameter validation using specified rules failed', 1572985034861, result);
            }

            const returnValue = originalMethod.apply(this, params);

            if (validateReturnType) {
                const ReturnType = Reflect.getMetadata('design:returntype', Target, method);

                const valid = Validator.validateType(returnValue, ReturnType);
                if (!valid) {
                    result.valid = false;
                    result.returnType = true;
                    throw new ValidationException('Return value type validation failed', 1572985055963, result);
                }
            }

            return returnValue;
        };
    };
}
