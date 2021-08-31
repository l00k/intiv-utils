import validateJsExt from 'validate.js';

validateJsExt.formatters.intiv = function(errors : any[]) {
    let result = {};
    errors.map((error) => {
        if (!result[error.attribute]) {
            result[error.attribute] = [];
        }

        result[error.attribute].push({
            rule: error.validator,
            options: error.options,
        });
    });
    return result;
};

validateJsExt.validators.type.types.numeric = function(value : any) {
    return value == Number(value);
};

export default validateJsExt;
