/**
 * Mixin the functions of some base classes into the given class.
 * @param extendedConstructor The extended class to which the mixins should be applied.
 * @param mixinConstructors The mixins that should be applied to the class.
 */
export function applyMixins(extendedConstructor: any, mixinConstructors: any[])
{
    mixinConstructors.forEach(mixinConstructor =>
    {
        Object.getOwnPropertyNames(mixinConstructor.prototype).forEach(name =>
        {
            extendedConstructor.prototype[name] = mixinConstructor.prototype[name];
        });
    });
}
