import { Initializable } from '../Initializable';
import { ValidationError } from './def';


type PropertyErrorMap = {
    [property : string] : ValidationError[]
}

type ErrorMap<T> = {
    [subObject : string] : T
}

type ParameterErrorMap = {
    [parameterIdx : number] : ValidationError[]
}


export default class ValidationResult
    extends Initializable<ValidationResult>
{

    public valid : boolean = true;

    public properties : PropertyErrorMap = {};

    public subObjects : ErrorMap<ValidationResult> = {};

    public parameters : ParameterErrorMap = {};

    public returnType : boolean = true;

}
