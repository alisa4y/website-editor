import { propertiesOf } from 'ts-reflection';
let ar = propertiesOf<CSSStyleDeclaration>();
console.log(ar);
