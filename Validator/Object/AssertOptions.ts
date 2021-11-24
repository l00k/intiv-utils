import { AssertObjectOptions, ValidatableObject } from '../def';
import Validator from '../Validator';


export default function AssertOptions (
    options : AssertObjectOptions = {}
) {
    return (Target : ValidatableObject) => {
        Validator.registerObjectOptions(Target, options);
    };
}
