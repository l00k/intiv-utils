import { Rules, ValidatableObject } from '../def';
import Validator from '../Validator';


export default function Assert (
    rules : Rules = {},
    validateType : boolean = true
) {
    return (Target : ValidatableObject, property : string) => {
        Validator.registerObjectPropertyAssertion(
            Target,
            property,
            rules,
            validateType
        );
    };
}
