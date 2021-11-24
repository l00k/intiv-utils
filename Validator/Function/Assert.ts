import { Rules } from '../def';
import Validator from '../Validator';


export default function Assert (
    rules : Rules = {},
    isComplex : boolean = false
) {
    return (Target : Object, method : string, parameterIdx : number) => {
        Validator.registerMethodParameterAssertion(
            Target,
            method,
            parameterIdx,
            rules,
            isComplex
        );
    };
}
