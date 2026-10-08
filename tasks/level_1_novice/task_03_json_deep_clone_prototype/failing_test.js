import { deepClone } from './source.js';
import assert from 'node:assert';

const proto = { inheritedProp: "should_not_copy" };
const obj = Object.create(proto);
obj.ownProp = "valid";

const copy = deepClone(obj);
assert.strictEqual(Object.prototype.hasOwnProperty.call(copy, 'inheritedProp'), false, "深拷贝不得将原型链上的继承属性变成拷贝对象的自有属性！");