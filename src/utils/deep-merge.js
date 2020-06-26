/**
 * This function performs recursive merge base and patch objects. It's designed
 * to combine the default and user-provided frontendPreferences.
 *
 * Both values must be JSON values, i.e. plain objects, arrays or JSON
 * primitives. The resulting object has the same (deep) JSON type as the base:
 * if any field of base is, for example, a number then the same field of result
 * will be number. If patch field has a different type, the base value will be
 * used.
 *
 * This rule isn't applied to the null base value (or base field value), it is
 * allowed to override null by any other JSON type. But it is not recommended
 * and it is not recommended to use nulls in base objects.
 */
export function deepMergeJSON(base, patch) {
  const baseType = jsonType(base);
  const patchType = jsonType(patch);

  if (baseType === 'object' && patchType === 'object') {
    const clone = {};
    for (const key of Object.keys(base)) {
      clone[key] = deepMergeJSON(base[key], patch[key]);
    }
    return clone;
  } else if ((baseType !== patchType && baseType !== 'null') || patchType === 'unknown') {
    return base;
  }

  return patch;
}

const knownTypes = ['string', 'number', 'object', 'array', 'boolean', 'null'];

function jsonType(value) {
  const jsType = typeof value;
  if (jsType === 'object') {
    if (value === null) {
      return 'null';
    } else if (Array.isArray(value)) {
      return 'array';
    }
    return 'object';
  }
  return knownTypes.includes(jsType) ? jsType : 'unknown';
}
