import { c as createLucideIcon, r as reactExports, s as useComposedRefs, j as jsxRuntimeExports, d as cn, u as useSimulationStore, x as SystemStatus, T as TrafficLevel, l as RefreshCw, b as TriangleAlert, A as Activity, S as Skeleton, i as Badge, Z as Zap, y as Radio } from "./index-Cjz6nUaB.js";
import { M as MetricCard, C as Cpu } from "./MetricCard-BLQN2qa8.js";
import { S as StatusBadge } from "./StatusBadge-BMd-Wgia.js";
import { e as useLayoutEffect2, f as useDirection, P as Primitive, c as createContextScope, b as composeEventHandlers, u as useCallbackRef, g as clamp } from "./index-CGA5l0LD.js";
import { h as getSystemComponents, i as getWaitTimeEstimate, C as CircleCheck } from "./trafficApi-j32R7f3i.js";
import { C as CircleX } from "./circle-x-B0UhIhAC.js";
import { C as Clock } from "./clock-CMKEL1lg.js";
import "./trending-up-BRz5CwNs.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
];
const Server = createLucideIcon("server", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function useStateMachine$1(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : reactExports.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? reactExports.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = reactExports.useState();
  const stylesRef = reactExports.useRef(null);
  const prevPresentRef = reactExports.useRef(present);
  const prevAnimationNameRef = reactExports.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine$1(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  reactExports.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || (styles == null ? void 0 : styles.display) === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: reactExports.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return (styles == null ? void 0 : styles.animationName) || "none";
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea$1.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    var _a;
    const height2 = ((_a = context.scrollbarX) == null ? void 0 : _a.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    var _a;
    const width2 = ((_a = context.scrollbarY) == null ? void 0 : _a.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root = ScrollArea$1;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
const STATUS_GLOW = {
  [SystemStatus.Operational]: "border-primary/35 shadow-[0_0_16px_rgba(98,213,228,0.16)]",
  [SystemStatus.Degraded]: "border-accent/40 shadow-[0_0_16px_rgba(217,170,59,0.2)]",
  [SystemStatus.Failed]: "border-destructive/50 shadow-[0_0_16px_rgba(220,60,60,0.28)]",
  [SystemStatus.Maintenance]: "border-border/60"
};
const STATUS_DOT = {
  [SystemStatus.Operational]: "bg-primary animate-pulse",
  [SystemStatus.Degraded]: "bg-accent animate-pulse",
  [SystemStatus.Failed]: "bg-destructive animate-pulse",
  [SystemStatus.Maintenance]: "bg-muted-foreground"
};
const SEVERITY_TEXT = {
  Critical: "text-destructive",
  High: "text-destructive/80",
  Medium: "text-accent",
  Low: "text-primary"
};
const SEVERITY_BORDER = {
  Critical: "border-l-destructive bg-destructive/5",
  High: "border-l-destructive/60",
  Medium: "border-l-accent bg-accent/5",
  Low: "border-l-primary/50"
};
const CONGESTION_COLOR = {
  [TrafficLevel.High]: "text-destructive",
  [TrafficLevel.Medium]: "text-accent",
  [TrafficLevel.Low]: "text-primary",
  [TrafficLevel.NoTraffic]: "text-muted-foreground"
};
function componentIcon(type) {
  const t = type.toLowerCase();
  if (t === "sensor") return Radio;
  if (t.includes("ai")) return Cpu;
  if (t === "database") return Database;
  if (t === "api") return Globe;
  return Server;
}
const FALLBACK_COMPONENTS = [
  {
    id: "s1",
    name: "Sensor Node Alpha",
    componentType: "Sensor",
    status: SystemStatus.Operational,
    uptimePct: 99.1,
    lastChecked: BigInt(Date.now() - 12e3) * 1000000n,
    failureCount: 0n
  },
  {
    id: "s2",
    name: "Sensor Node Beta",
    componentType: "Sensor",
    status: SystemStatus.Degraded,
    uptimePct: 87.3,
    lastChecked: BigInt(Date.now() - 45e3) * 1000000n,
    failureCount: 2n
  },
  {
    id: "s3",
    name: "Sensor Node Gamma",
    componentType: "Sensor",
    status: SystemStatus.Operational,
    uptimePct: 98.7,
    lastChecked: BigInt(Date.now() - 8e3) * 1000000n,
    failureCount: 0n
  },
  {
    id: "s4",
    name: "Sensor Node Delta",
    componentType: "Sensor",
    status: SystemStatus.Failed,
    uptimePct: 41.2,
    lastChecked: BigInt(Date.now() - 12e4) * 1000000n,
    failureCount: 7n
  },
  {
    id: "ai1",
    name: "Vision AI Engine",
    componentType: "AI Model",
    status: SystemStatus.Operational,
    uptimePct: 99.8,
    lastChecked: BigInt(Date.now() - 5e3) * 1000000n,
    failureCount: 0n
  },
  {
    id: "ai2",
    name: "Prediction AI Model",
    componentType: "AI Model",
    status: SystemStatus.Maintenance,
    uptimePct: 95,
    lastChecked: BigInt(Date.now() - 6e5) * 1000000n,
    failureCount: 1n
  },
  {
    id: "db1",
    name: "Traffic Database",
    componentType: "Database",
    status: SystemStatus.Operational,
    uptimePct: 99.9,
    lastChecked: BigInt(Date.now() - 3e3) * 1000000n,
    failureCount: 0n
  },
  {
    id: "api1",
    name: "REST API Gateway",
    componentType: "API",
    status: SystemStatus.Operational,
    uptimePct: 99.5,
    lastChecked: BigInt(Date.now() - 7e3) * 1000000n,
    failureCount: 0n
  }
];
const FALLBACK_SEGMENTS = [
  {
    id: "sg1",
    name: "Main St / 5th Ave",
    district: "Downtown",
    congestionPct: 78n,
    waitTimeSeconds: 95n,
    trafficLevel: TrafficLevel.High,
    avgSpeed: 12,
    lat: 0,
    lon: 0,
    vehicleCount: 120n
  },
  {
    id: "sg2",
    name: "Harbor Bridge",
    district: "Port Area",
    congestionPct: 52n,
    waitTimeSeconds: 60n,
    trafficLevel: TrafficLevel.Medium,
    avgSpeed: 28,
    lat: 0,
    lon: 0,
    vehicleCount: 75n
  },
  {
    id: "sg3",
    name: "University Blvd",
    district: "Midtown",
    congestionPct: 34n,
    waitTimeSeconds: 35n,
    trafficLevel: TrafficLevel.Low,
    avgSpeed: 42,
    lat: 0,
    lon: 0,
    vehicleCount: 40n
  },
  {
    id: "sg4",
    name: "Industrial Ring Rd",
    district: "East Side",
    congestionPct: 89n,
    waitTimeSeconds: 130n,
    trafficLevel: TrafficLevel.High,
    avgSpeed: 8,
    lat: 0,
    lon: 0,
    vehicleCount: 200n
  },
  {
    id: "sg5",
    name: "Westside Expressway",
    district: "West End",
    congestionPct: 20n,
    waitTimeSeconds: 18n,
    trafficLevel: TrafficLevel.Low,
    avgSpeed: 65,
    lat: 0,
    lon: 0,
    vehicleCount: 22n
  },
  {
    id: "sg6",
    name: "Central Park Loop",
    district: "Uptown",
    congestionPct: 61n,
    waitTimeSeconds: 72n,
    trafficLevel: TrafficLevel.Medium,
    avgSpeed: 22,
    lat: 0,
    lon: 0,
    vehicleCount: 88n
  },
  {
    id: "sg7",
    name: "Airport Connector",
    district: "North Gate",
    congestionPct: 45n,
    waitTimeSeconds: 50n,
    trafficLevel: TrafficLevel.Medium,
    avgSpeed: 35,
    lat: 0,
    lon: 0,
    vehicleCount: 55n
  },
  {
    id: "sg8",
    name: "Riverside Drive",
    district: "South Bank",
    congestionPct: 9n,
    waitTimeSeconds: 10n,
    trafficLevel: TrafficLevel.NoTraffic,
    avgSpeed: 72,
    lat: 0,
    lon: 0,
    vehicleCount: 8n
  }
];
function relativeTime(ns) {
  const diff = Date.now() - Number(ns) / 1e6;
  if (diff < 6e4) return `${Math.floor(diff / 1e3)}s ago`;
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  return `${Math.floor(diff / 36e5)}h ago`;
}
function buildUptimeSeries(base, status) {
  const pts = [];
  let v = base;
  const variance = status === SystemStatus.Failed ? 22 : status === SystemStatus.Degraded ? 10 : 3;
  for (let i = 0; i < 20; i++) {
    v = Math.max(0, Math.min(100, v + (Math.random() - 0.5) * variance));
    pts.push(v);
  }
  return { points: pts };
}
function buildWaitEstimates(segments, overrides) {
  return segments.map((seg) => {
    const baseWait = overrides[seg.id] !== void 0 ? overrides[seg.id] : Number(seg.waitTimeSeconds);
    const weatherImpact = seg.trafficLevel === TrafficLevel.High ? 45 : seg.trafficLevel === TrafficLevel.Medium ? 20 : 5;
    return {
      segmentId: seg.id,
      segmentName: seg.name,
      district: seg.district,
      congestionPct: Number(seg.congestionPct),
      baseWait,
      weatherImpact,
      total: baseWait + weatherImpact,
      trafficLevel: seg.trafficLevel
    };
  });
}
function generateLogEntries(components) {
  const entries = [];
  const now = Date.now();
  components.forEach((comp, idx) => {
    if (comp.status === SystemStatus.Failed) {
      entries.push({
        id: `fail-${comp.id}`,
        ts: new Date(now - idx * 25e3).toLocaleTimeString(),
        componentName: comp.name,
        event: `OFFLINE — ${Number(comp.failureCount)} consecutive failure(s) recorded. Last uptime: ${comp.uptimePct.toFixed(1)}%`,
        severity: "Critical",
        action: "Initiate manual restart; escalate to on-call engineer immediately"
      });
    }
    if (comp.status === SystemStatus.Degraded) {
      entries.push({
        id: `deg-${comp.id}`,
        ts: new Date(now - idx * 55e3).toLocaleTimeString(),
        componentName: comp.name,
        event: `Performance degraded — uptime dropped to ${comp.uptimePct.toFixed(1)}%`,
        severity: "Medium",
        action: "Monitor for 10 min; trigger diagnostic if uptime falls below 85%"
      });
    }
    if (comp.status === SystemStatus.Maintenance) {
      entries.push({
        id: `maint-${comp.id}`,
        ts: new Date(now - idx * 12e4).toLocaleTimeString(),
        componentName: comp.name,
        event: "Scheduled maintenance window active — component offline by design",
        severity: "Low",
        action: "Standby — automated recovery expected within scheduled window"
      });
    }
    if (Number(comp.failureCount) > 0 && comp.status === SystemStatus.Operational) {
      entries.push({
        id: `rec-${comp.id}`,
        ts: new Date(now - idx * 9e4).toLocaleTimeString(),
        componentName: comp.name,
        event: `Recovered — ${Number(comp.failureCount)} historical fault(s) on record`,
        severity: "Low",
        action: "Verify stability over next 30 min; clear alert after confirmation"
      });
    }
  });
  const order = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3
  };
  return entries.sort(
    (a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
  );
}
function UptimeSparkline({
  series,
  status
}) {
  const W = 100;
  const H = 28;
  const { points } = series;
  const min = Math.min(...points);
  const max = Math.max(...points, min + 1);
  const scaleY = (v) => H - (v - min) / (max - min) * (H - 4) - 2;
  const pathD = points.map(
    (v, i) => `${i === 0 ? "M" : "L"} ${i / (points.length - 1) * W} ${scaleY(v)}`
  ).join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;
  const clr = status === SystemStatus.Operational ? { stroke: "rgba(98,213,228,0.85)", fill: "rgba(98,213,228,0.08)" } : status === SystemStatus.Degraded ? { stroke: "rgba(217,170,59,0.85)", fill: "rgba(217,170,59,0.08)" } : status === SystemStatus.Failed ? { stroke: "rgba(220,60,60,0.85)", fill: "rgba(220,60,60,0.08)" } : {
    stroke: "rgba(120,120,140,0.55)",
    fill: "rgba(120,120,140,0.04)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: H,
      className: "overflow-visible shrink-0",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: areaD, fill: clr.fill }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: pathD,
            fill: "none",
            stroke: clr.stroke,
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function HealthRing({ pct }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = clamped / 100 * circ;
  const gap = circ - dash;
  const isGood = clamped > 80;
  const isMid = clamped > 50 && clamped <= 80;
  const ringCls = isGood ? "stroke-primary" : isMid ? "stroke-accent" : "stroke-destructive";
  const valCls = isGood ? "text-primary" : isMid ? "text-accent" : "text-destructive";
  const label = isGood ? "NOMINAL" : isMid ? "DEGRADED" : "CRITICAL";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", "data-ocid": "health-ring", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: 128,
          height: 128,
          viewBox: "0 0 128 128",
          className: "-rotate-90",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: 64,
                cy: 64,
                r,
                fill: "none",
                stroke: "rgba(255,255,255,0.05)",
                strokeWidth: 10
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: 64,
                cy: 64,
                r,
                fill: "none",
                strokeWidth: 10,
                strokeLinecap: "round",
                strokeDasharray: `${dash} ${gap}`,
                className: cn("transition-all duration-700", ringCls)
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: cn(
              "font-mono text-[22px] font-bold tabular-nums leading-none",
              valCls
            ),
            children: [
              clamped,
              "%"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px] tracking-[0.15em] text-muted-foreground mt-0.5", children: "HEALTH" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "font-mono text-[9px] font-semibold uppercase tracking-[0.18em]",
          valCls
        ),
        children: label
      }
    )
  ] });
}
function ComponentCard({
  comp,
  series
}) {
  const Icon = componentIcon(comp.componentType);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "relative flex flex-col gap-2.5 rounded-lg border bg-card p-4 transition-smooth",
        STATUS_GLOW[comp.status] ?? "border-border"
      ),
      "data-ocid": `component-card-${comp.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "absolute right-3 top-3 h-1.5 w-1.5 rounded-full",
              STATUS_DOT[comp.status] ?? "bg-muted-foreground"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pr-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-md bg-muted/60 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-semibold text-foreground leading-tight", children: comp.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-wider text-muted-foreground", children: comp.componentType })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: comp.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Uptime" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm font-bold tabular-nums text-foreground", children: [
              comp.uptimePct.toFixed(1),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(UptimeSparkline, { series, status: comp.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] text-muted-foreground", children: [
          "Checked:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/70", children: relativeTime(comp.lastChecked) })
        ] }),
        comp.status !== SystemStatus.Operational && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex items-start gap-1.5 rounded border px-2 py-1.5",
              comp.status === SystemStatus.Failed ? "border-destructive/25 bg-destructive/8" : comp.status === SystemStatus.Degraded ? "border-accent/25 bg-accent/8" : "border-border/50 bg-muted/30"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  className: cn(
                    "mt-0.5 h-3 w-3 shrink-0",
                    comp.status === SystemStatus.Failed ? "text-destructive" : comp.status === SystemStatus.Degraded ? "text-accent" : "text-muted-foreground"
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] leading-snug text-foreground/70", children: comp.status === SystemStatus.Failed ? `${Number(comp.failureCount)} failure(s) — immediate attention required` : comp.status === SystemStatus.Degraded ? `${Number(comp.failureCount)} fault(s) logged — performance reduced` : "Scheduled downtime — recovery expected within 30 min" })
            ]
          }
        )
      ]
    }
  );
}
function WaitTimeTable({ estimates }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[620px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/60 bg-muted/30", children: [
      { label: "Segment Name", align: "left" },
      { label: "District", align: "left" },
      { label: "Congestion", align: "left" },
      { label: "Base Wait", align: "right" },
      { label: "Weather +", align: "right" },
      { label: "Total Wait", align: "right" }
    ].map(({ label, align }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: cn(
          "px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
          align === "right" ? "text-right" : "text-left"
        ),
        children: label
      },
      label
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: estimates.map((est) => {
      const isHigh = est.total > 120;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: cn(
            "border-b border-border/30 transition-colors hover:bg-muted/15",
            isHigh && "bg-accent/4"
          ),
          "data-ocid": `wait-row-${est.segmentId}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[11px] text-foreground", children: est.segmentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[11px] text-muted-foreground", children: est.district }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "font-mono text-[11px] font-semibold tabular-nums",
                  CONGESTION_COLOR[est.trafficLevel]
                ),
                children: [
                  est.congestionPct,
                  "%"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono text-[11px] tabular-nums text-foreground", children: [
              est.baseWait,
              "s"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono text-[11px] tabular-nums text-accent", children: [
              "+",
              est.weatherImpact,
              "s"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: cn(
                    "font-mono text-[11px] font-bold tabular-nums",
                    isHigh ? "text-accent" : "text-foreground"
                  ),
                  children: [
                    est.total,
                    "s"
                  ]
                }
              ),
              isHigh && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "ml-2 border-accent/40 bg-accent/10 px-1 py-0 font-mono text-[8px] text-accent",
                  children: "SLOW"
                }
              )
            ] })
          ]
        },
        est.segmentId
      );
    }) })
  ] }) });
}
const SEV_ICON = {
  Critical: CircleX,
  High: TriangleAlert,
  Medium: TriangleAlert,
  Low: CircleCheck
};
function EventLogEntry({ entry }) {
  const SevIcon = SEV_ICON[entry.severity] ?? Activity;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "border-l-2 px-4 py-3 transition-colors hover:bg-muted/10",
        SEVERITY_BORDER[entry.severity]
      ),
      "data-ocid": `log-entry-${entry.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SevIcon,
            {
              className: cn(
                "mt-0.5 h-3.5 w-3.5 shrink-0",
                SEVERITY_TEXT[entry.severity]
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-semibold text-foreground/80", children: entry.componentName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "font-mono text-[9px] uppercase tracking-wider",
                    SEVERITY_TEXT[entry.severity]
                  ),
                  children: entry.severity
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-mono text-[10px] leading-snug text-foreground/70", children: entry.event }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 font-mono text-[9px] leading-snug text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/70", children: "→ " }),
              entry.action
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 font-mono text-[9px] tabular-nums text-muted-foreground", children: entry.ts })
      ] })
    }
  );
}
function Monitor() {
  const { snapshot, actor } = useSimulationStore();
  const [components, setComponents] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [waitEstimates, setWaitEstimates] = reactExports.useState([]);
  const [lastRefresh, setLastRefresh] = reactExports.useState(null);
  const timerRef = reactExports.useRef(null);
  const seriesMap = reactExports.useMemo(() => {
    const map = {};
    for (const c of components.length > 0 ? components : FALLBACK_COMPONENTS) {
      map[c.id] = buildUptimeSeries(c.uptimePct, c.status);
    }
    return map;
  }, [components]);
  const displayComponents = components.length > 0 ? components : FALLBACK_COMPONENTS;
  const fetchData = reactExports.useCallback(async () => {
    var _a, _b;
    if (!actor) {
      setComponents([]);
      setWaitEstimates(
        buildWaitEstimates(
          ((_a = snapshot == null ? void 0 : snapshot.segments) == null ? void 0 : _a.length) ? snapshot.segments : FALLBACK_SEGMENTS,
          {}
        )
      );
      setLoading(false);
      setLastRefresh(/* @__PURE__ */ new Date());
      return;
    }
    try {
      const comps = await getSystemComponents(actor);
      setComponents(comps);
      const segs = ((_b = snapshot == null ? void 0 : snapshot.segments) == null ? void 0 : _b.length) ? snapshot.segments : FALLBACK_SEGMENTS;
      const overrides = {};
      await Promise.all(
        segs.map(async (seg) => {
          try {
            const raw = await getWaitTimeEstimate(actor, seg.id);
            overrides[seg.id] = Number(raw);
          } catch {
          }
        })
      );
      setWaitEstimates(buildWaitEstimates(segs, overrides));
      setLastRefresh(/* @__PURE__ */ new Date());
    } catch {
      setComponents([]);
      setWaitEstimates(buildWaitEstimates(FALLBACK_SEGMENTS, {}));
    } finally {
      setLoading(false);
    }
  }, [actor, snapshot == null ? void 0 : snapshot.segments]);
  reactExports.useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, 15e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData]);
  const displaySegments = waitEstimates.length > 0 ? waitEstimates : buildWaitEstimates(FALLBACK_SEGMENTS, {});
  const healthPct = snapshot ? Number(snapshot.systemHealth) : 72;
  const logEntries = reactExports.useMemo(
    () => generateLogEntries(displayComponents),
    [displayComponents]
  );
  const operational = displayComponents.filter(
    (c) => c.status === SystemStatus.Operational
  ).length;
  const degraded = displayComponents.filter(
    (c) => c.status === SystemStatus.Degraded
  ).length;
  const failed = displayComponents.filter(
    (c) => c.status === SystemStatus.Failed
  ).length;
  const avgUptime = displayComponents.length > 0 ? (displayComponents.reduce((s, c) => s + c.uptimePct, 0) / displayComponents.length).toFixed(1) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", "data-ocid": "monitor-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "System Monitor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "Infrastructure diagnostics · real-time health" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        lastRefresh && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }),
          lastRefresh.toLocaleTimeString(),
          " · auto 15s"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-primary", children: "Live" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
        "data-ocid": "system-stats",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Operational",
              value: loading ? "—" : operational,
              subtitle: `of ${displayComponents.length} components`,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }),
              colorClass: "text-primary",
              "data-ocid": "stat-operational"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Degraded",
              value: loading ? "—" : degraded,
              subtitle: "Fallback active",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-accent" }),
              colorClass: degraded > 0 ? "text-accent" : void 0,
              "data-ocid": "stat-degraded"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Failed",
              value: loading ? "—" : failed,
              subtitle: "Needs intervention",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 text-destructive" }),
              colorClass: failed > 0 ? "text-destructive" : void 0,
              "data-ocid": "stat-failed"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Avg Uptime",
              value: loading ? "—" : `${avgUptime}%`,
              subtitle: "Network-wide average",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3.5 w-3.5 text-primary" }),
              "data-ocid": "stat-avg-uptime"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-[160px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-start gap-4 rounded-lg border border-border bg-card p-5",
          "data-ocid": "health-panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground", children: "Health Score" }),
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-32 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(HealthRing, { pct: healthPct }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full space-y-1.5 border-t border-border/50 pt-3", children: ["Sensor", "AI Model", "Database", "API"].map(
              (type) => {
                const count = displayComponents.filter(
                  (c) => type === "AI Model" ? c.componentType.toLowerCase().includes("ai") : c.componentType === type
                ).length;
                const IconComp = componentIcon(type);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(IconComp, { className: "h-3 w-3 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase text-muted-foreground", children: type })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-semibold text-foreground", children: count })
                ] }, type);
              }
            ) })
          ]
        }
      ),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: Array.from({ length: 8 }, (_, i) => `sk-comp-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 rounded-lg" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 gap-3 md:grid-cols-4",
          "data-ocid": "component-grid",
          children: displayComponents.map((comp) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ComponentCard,
            {
              comp,
              series: seriesMap[comp.id] ?? buildUptimeSeries(comp.uptimePct, comp.status)
            },
            comp.id
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 xl:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col rounded-lg border border-border bg-card overflow-hidden",
          "data-ocid": "wait-time-panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold uppercase tracking-wider text-foreground", children: "Predictive Wait Times" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: "ml-auto border-primary/30 bg-primary/10 font-mono text-[9px] text-primary",
                  children: [
                    displaySegments.length,
                    " SEGMENTS"
                  ]
                }
              )
            ] }),
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: Array.from({ length: 5 }, (_, i) => `sk-wait-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 rounded" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WaitTimeTable, { estimates: displaySegments }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 px-4 py-2 mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground", children: "Rows highlighted in amber indicate total wait > 120s" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col rounded-lg border border-border bg-card overflow-hidden",
          "data-ocid": "event-log-panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold uppercase tracking-wider text-foreground", children: "Alert Event Log" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: cn(
                    "ml-auto font-mono text-[9px]",
                    logEntries.some((e) => e.severity === "Critical") ? "border-destructive/35 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-primary"
                  ),
                  children: [
                    logEntries.length,
                    " EVENTS"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ScrollArea,
              {
                className: "flex-1",
                style: { maxHeight: 380 },
                "data-ocid": "event-log-scroll",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: Array.from({ length: 4 }, (_, i) => `sk-log-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded" }, k)) }) : logEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-14", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-7 w-7 text-primary/40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "All systems nominal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60", children: "No active alerts to display" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/25", children: logEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventLogEntry, { entry }, entry.id)) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] text-muted-foreground", children: [
              logEntries.length,
              " events · refreshes every 15s"
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-border bg-card overflow-hidden",
        "data-ocid": "uptime-chart",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold uppercase tracking-wider text-foreground", children: "Uptime History — 20 Simulated Ticks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-4", children: [
              { label: "Sensor", color: "bg-primary" },
              { label: "AI Model", color: "bg-accent" },
              { label: "Database", color: "bg-[oklch(0.68_0.18_110)]" },
              { label: "API", color: "bg-[oklch(0.55_0.15_280)]" }
            ].map(({ label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-2 w-2 rounded-full", color) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] text-muted-foreground uppercase", children: label })
            ] }, label)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UptimeMultiChart, { components: displayComponents }) })
        ]
      }
    )
  ] });
}
function UptimeMultiChart({ components }) {
  const W = 800;
  const H = 120;
  const PAD = { top: 8, right: 8, bottom: 20, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const typeGroups = {
    Sensor: components.filter((c) => c.componentType === "Sensor"),
    "AI Model": components.filter(
      (c) => c.componentType.toLowerCase().includes("ai")
    ),
    Database: components.filter((c) => c.componentType === "Database"),
    API: components.filter((c) => c.componentType === "API")
  };
  const seriesDefs = [
    {
      key: "Sensor",
      stroke: "rgba(98,213,228,0.85)",
      fill: "rgba(98,213,228,0.07)"
    },
    {
      key: "AI Model",
      stroke: "rgba(217,170,59,0.85)",
      fill: "rgba(217,170,59,0.07)"
    },
    {
      key: "Database",
      stroke: "rgba(140,200,100,0.85)",
      fill: "rgba(140,200,100,0.07)"
    },
    {
      key: "API",
      stroke: "rgba(140,100,220,0.75)",
      fill: "rgba(140,100,220,0.06)"
    }
  ];
  const N = 20;
  function buildSeries(comps) {
    if (comps.length === 0)
      return Array.from({ length: N }, () => 97 + (Math.random() - 0.5) * 2);
    const base = comps.reduce((s, c) => s + c.uptimePct, 0) / comps.length;
    const status = comps.some((c) => c.status === SystemStatus.Failed) ? SystemStatus.Failed : comps.some((c) => c.status === SystemStatus.Degraded) ? SystemStatus.Degraded : SystemStatus.Operational;
    const variance = status === SystemStatus.Failed ? 18 : status === SystemStatus.Degraded ? 8 : 2.5;
    let v = base;
    return Array.from({ length: N }, () => {
      v = Math.max(60, Math.min(100, v + (Math.random() - 0.5) * variance));
      return v;
    });
  }
  const allSeries = seriesDefs.map(
    ({ key }) => buildSeries(typeGroups[key] ?? [])
  );
  const minY = 60;
  const maxY = 100;
  const scaleX = (i) => PAD.left + i / (N - 1) * innerW;
  const scaleY = (v) => PAD.top + innerH - (v - minY) / (maxY - minY) * innerH;
  const yTicks = [65, 75, 85, 95, 100];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: `0 0 ${W} ${H}`,
      width: "100%",
      height: H,
      preserveAspectRatio: "none",
      className: "overflow-visible",
      "aria-hidden": "true",
      children: [
        yTicks.map((tick) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: PAD.left,
              y1: scaleY(tick),
              x2: W - PAD.right,
              y2: scaleY(tick),
              stroke: "rgba(255,255,255,0.04)",
              strokeWidth: 1
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "text",
            {
              x: PAD.left - 4,
              y: scaleY(tick) + 3,
              fontSize: 8,
              fill: "rgba(150,150,170,0.7)",
              textAnchor: "end",
              fontFamily: "JetBrains Mono, monospace",
              children: [
                tick,
                "%"
              ]
            }
          )
        ] }, tick)),
        Array.from({ length: 5 }, (_, i) => Math.round(i / 4 * (N - 1))).map(
          (idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "text",
            {
              x: scaleX(idx),
              y: H - 4,
              fontSize: 8,
              fill: "rgba(150,150,170,0.6)",
              textAnchor: "middle",
              fontFamily: "JetBrains Mono, monospace",
              children: [
                "T",
                idx + 1
              ]
            },
            idx
          )
        ),
        seriesDefs.map(({ key, stroke, fill }, si) => {
          const pts = allSeries[si];
          const linePath = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`).join(" ");
          const areaPath = `${linePath} L ${scaleX(N - 1)} ${PAD.top + innerH} L ${scaleX(0)} ${PAD.top + innerH} Z`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: areaPath, fill }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: linePath,
                fill: "none",
                stroke,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          ] }, key);
        })
      ]
    }
  );
}
export {
  Monitor
};
