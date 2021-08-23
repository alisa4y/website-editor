export function createElm(
  tag: string,
  content?: string,
  style?: Partial<CSSStyleDeclaration>
) {
  let e = document.createElement(tag);
  content && e.append(document.createTextNode(content));
  style && setStyle(e, style);
  return e;
}

export function setStyle(elm: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  for (const key in style) {
    const v = style[key];
    v && (elm.style[key] = v);
  }
}

export function calcCentralMass(elm: HTMLElement){
  let rect = elm.getBoundingClientRect();
  return [(rect.left + rect.right)/2, (rect.top + rect.bottom)/2];
}