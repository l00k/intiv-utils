function isPlainObject(v : any) : boolean
{
    return (!!v) && (v.constructor === Object);
}

function isFunction(v : any) : boolean
{
    return !!(v && v.constructor && v.call && v.apply);
}

function isArrowFunction(v : any) : boolean
{
    let native = v.toString().trim().endsWith('() { [native code] }');
    let plain = !native && v.hasOwnProperty('prototype');
    return isFunction(v) && !(native || plain);
}

export {
    isPlainObject,
    isFunction,
    isArrowFunction,
};
