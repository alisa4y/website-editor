// todo
// create a handle to overlapped layout
// unique color for every layout 
import { calcCentralMass, createElm, setStyle } from "./tools";
import { guard, keys } from "js-tools";
import { interact, resizeElmSide, translateElm } from "interact-element";

type TDirection = "x" | "y";
type TMenuConfig = {
  menu: HTMLElement;
  action: (e: MouseEvent, grid: HTMLElement) => void;
};

const Sides = ["left", "right", "top", "bottom"] as const;
const edgeSpace = 20; // a distance that it wont affect resizing on layout
const gridMenuOnClick = {
  X: (e: MouseEvent, grid: HTMLElement) => {
    addMetric(e, "x", grid);
  },
  Y: (e: MouseEvent, grid: HTMLElement) => {
    addMetric(e, "y", grid);
  },
  "add layout": addLayoutShape,
  "new element": (e: MouseEvent, grid: HTMLElement) => {},
};
export function setupGrid(grid: HTMLElement) {
  let menuConfig = createMenuElm(grid);
  let menu = menuConfig.menu;
  document.body.append(menu);
  let me: MouseEvent;
  grid.addEventListener("contextmenu", function (e) {
    me = e;
    showMenu(e, menuConfig);
  });
  menu.addEventListener("mouseup", () => menuConfig.action(me, grid));
  window.addEventListener("click", () => (menu.style.display = "none"));
}
function createMenuElm(grid: HTMLElement): TMenuConfig {
  let config = {
    menu: createElm("div", undefined, {
      display: "none",
      backgroundColor: "white",
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "1000",
    }),
    action: (e: MouseEvent, grid: HTMLElement) => {},
  };
  let d = config.menu;
  d.id = "grid-menu";
  keys(gridMenuOnClick)
    .map((name) => {
      let item = createElm("div", name);
      item.addEventListener("mousedown", (e) => {
        config.action = gridMenuOnClick[name];
      });
      return item;
    })
    .forEach((m) => d.append(m));
  return config;
}
function showMenu(e: MouseEvent, { menu, action }: TMenuConfig) {
  e.preventDefault();
  setStyle(menu, {
    display: "initial",
    top: e.clientY + "px",
    left: e.clientX + "px",
  });
}

function addMetric(e: MouseEvent, d: TDirection, grid: HTMLElement) {
  let m = createElm("div");
  interact(m, { resize: false });
  d === "x" ? translateElm(0, e.clientY, m) : translateElm(e.clientX, 0, m);
  m.classList.add("line" + d.toUpperCase());
  grid.append(m);
}
function addLayoutShape(e: MouseEvent, grid: HTMLElement) {
  let lay = createGridLayoutElm(grid);
  grid.append(lay);
  let gridRect = grid.getBoundingClientRect();
  console.log(e.clientX, e.clientY, gridRect.x, gridRect.y);

  translateElm(e.clientX - gridRect.x, e.clientY - gridRect.y, lay);
  placeLayout(lay, grid);
}

function createGridLayoutElm(grid: HTMLElement) {
  let d = createElm("div");
  d.classList.add("layout");
  setLayoutColor(d);
  makeDeletableDiv(d);
  let handleMouseUp = placeLayout;
  interact(d, {
    inParent: false,
    onMove: () => {
      handleMouseUp = placeLayout;
    },
    onResize: () => {
      handleMouseUp = stretchLayout;
    },
  });
  d.addEventListener("pointerup", () => handleMouseUp(d, grid));
  return d;
}
function setLayoutColor(l: HTMLElement) {}

function stretchLayout(layout: HTMLElement, grid: HTMLElement) {
  let layRect = layout.getBoundingClientRect();
  let coords = getLayoutPeri(layRect, grid);
  Sides.forEach((s, i) => resizeElmSide(s, coords[i] - layRect[s], layout));
}
function placeLayout(layout: HTMLElement, grid: HTMLElement) {
  let layRect = layout.getBoundingClientRect();
  let cm = calcCentralMass(layout);
  let r = Sides.reduce((o, v, i) => {
    o[v] = cm[Math.floor(i / 2)] + (i % 2) * 2 * (edgeSpace + 5);
    return o;
  }, {} as any);
  let coords = getLayoutPeri(r, grid);
  Sides.forEach((s, i) => resizeElmSide(s, coords[i] - layRect[s], layout));
}
function getLayoutPeri(layRect: DOMRect, grid: HTMLElement) {
  let xLines = getGridLines("x", grid);
  let yLines = getGridLines("y", grid);
  return [
    ...getRangeLines(yLines, "left", layRect),
    ...getRangeLines(xLines, "top", layRect),
  ];
}
function getGridLines(d: TDirection, grid: HTMLElement) {
  let lines = Array.from(grid.getElementsByClassName("line" + d.toUpperCase()))
    .map((l) => l.getBoundingClientRect())
    .sort((a, b) => a.top - b.top);
  let gridRect = grid.getBoundingClientRect();
  let index = d == "y" ? 0 : 2;
  lines.unshift({ [Sides[index]]: gridRect[Sides[index]] } as any as DOMRect);
  lines.push({ [Sides[index]]: gridRect[Sides[index + 1]] } as any as DOMRect);
  return lines;
}
function getRangeLines(
  lines: DOMRect[],
  side: "left" | "top",
  layout: DOMRect
) {
  let otherSide: "right" | "bottom" = side === "left" ? "right" : "bottom";
  let s = lines.findIndex((l) => l[side] - edgeSpace > layout[side]) - 1;
  let e = lines.findIndex((l) => l[side] > layout[otherSide] - edgeSpace);
  console.log(lines, layout);

  console.log(s, e);

  return [
    (s < 0 ? lines[0] : lines[s])[side],
    (e < 0 ? lines[lines.length - 1] : lines[e])[side],
  ];
}
function makeDeletableDiv(d: HTMLElement) {
  let btn = createElm("button", "X");
  btn.classList.add("deleteableButton");
  btn.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    d.remove();
  });
  btn.addEventListener("pointermove", (e) => e.stopPropagation());
  d.append(btn);
}
function addNewElement(tag: string, elm: HTMLElement) {}
