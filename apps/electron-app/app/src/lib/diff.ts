import transform from "lodash.transform";
import isEqual from "lodash.isequal";
import isArray from "lodash.isarray";
import isObject from "lodash.isobject";

export const difference = (origObj: any, newObj: any) => {
  function changes(newObj: any, origObj: any) {
    let arrayIndexCounter = 0;
    return transform(newObj, function (result: any, value, key) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] =
          isObject(value) && isObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  }
  return changes(newObj, origObj);
};
