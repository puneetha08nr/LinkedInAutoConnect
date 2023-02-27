import {
  m as d,
  w as z,
  S,
  c as f,
  a as m,
  q as de,
  v as b,
  k as P,
  r as g,
  b as E,
  d as me,
  i as ve,
  e as ge,
  f as k,
  g as L,
  R as a,
  V as he,
  B as C,
  T as fe,
  h as x,
  L as pe,
  j,
  u as Ce,
  C as ke,
  l as xe,
  F as Se,
  H as be,
  n as Pe,
  o as Ee,
  p as ye,
  s as Te,
  t as we,
} from "./onLoad.js";
const W = d(async () => {
    const [e] = await chrome.tabs.query({ active: !0, currentWindow: !0 });
    return e;
  }),
  ze = W.doneData,
  _e = z(ze, { filter: ({ id: e }) => e !== void 0 }).map(({ id: e }) => e),
  Ae = S(_e, 0),
  F = d((e) => chrome.tabs.connect(e));
f({ from: Ae.updates, to: F });
const _ = m(),
  H = m(),
  Oe = d((e) => {
    e.onMessage.addListener((t) => {
      H({ message: t, port: e });
    });
  });
f({ from: _, to: Oe });
f({ from: F.doneData, to: _ });
var i = ((e) => (
  (e[(e.ConnectionEstablished = 0)] = "ConnectionEstablished"),
  (e[(e.RunningStateUpdated = 1)] = "RunningStateUpdated"),
  (e[(e.ButtonClicksCountUpdated = 2)] = "ButtonClicksCountUpdated"),
  (e[(e.StartAutoConnect = 3)] = "StartAutoConnect"),
  (e[(e.StopAutoConnect = 4)] = "StopAutoConnect"),
  e
))(i || {});
const A = de(H, {
    [i.ConnectionEstablished]: ({ message: e }) =>
      e.id === i.ConnectionEstablished,
    [i.RunningStateUpdated]: ({ message: e }) => e.id === i.RunningStateUpdated,
    [i.ButtonClicksCountUpdated]: ({ message: e }) =>
      e.id === i.ButtonClicksCountUpdated,
    [i.StartAutoConnect]: ({ message: e }) => e.id === i.StartAutoConnect,
    [i.StopAutoConnect]: ({ message: e }) => e.id === i.StopAutoConnect,
  }),
  q = m(),
  G = m(),
  K = m();
b({ clock: A[i.ConnectionEstablished], target: q });
f({ from: A[i.RunningStateUpdated].map(({ message: e }) => e.content), to: K });
f({
  from: A[i.ButtonClicksCountUpdated].map(({ message: e }) => e.content),
  to: G,
});
const O = m();
function Y(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    c;
  for (c = 0; c < r.length; c++)
    (o = r[c]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function h() {
  return (
    (h =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
        return e;
      }),
    h.apply(this, arguments)
  );
}
var Ne = P({
    "0%": { strokeDasharray: "1, 400", strokeDashoffset: "0" },
    "50%": { strokeDasharray: "400, 400", strokeDashoffset: "-100" },
    "100%": { strokeDasharray: "400, 400", strokeDashoffset: "-260" },
  }),
  Be = P({
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  });
P({ "0%": { left: "-40%" }, "100%": { left: "100%" } });
P({
  from: { backgroundPosition: "1rem 0" },
  to: { backgroundPosition: "0 0" },
});
function Re(e) {
  var t = e.value,
    n = t === void 0 ? 0 : t,
    r = e.min,
    o = e.max,
    c = e.valueText,
    v = e.getValueText,
    s = e.isIndeterminate,
    l = me(n, r, o),
    y = function () {
      if (n != null) return ve(v) ? v(n, l) : c;
    };
  return {
    bind: {
      "data-indeterminate": s ? "" : void 0,
      "aria-valuemax": o,
      "aria-valuemin": r,
      "aria-valuenow": s ? void 0 : n,
      "aria-valuetext": y(),
      role: "progressbar",
    },
    percent: l,
    value: n,
  };
}
var De = ["size", "isIndeterminate"],
  Ie = [
    "size",
    "max",
    "min",
    "valueText",
    "getValueText",
    "value",
    "capIsRound",
    "children",
    "thickness",
    "color",
    "trackColor",
    "isIndeterminate",
  ],
  U = function (t) {
    return g.exports.createElement(
      E.circle,
      h({ cx: 50, cy: 50, r: 42, fill: "transparent" }, t)
    );
  },
  Ve = function (t) {
    var n = t.size,
      r = t.isIndeterminate,
      o = Y(t, De);
    return g.exports.createElement(
      E.svg,
      h(
        {
          viewBox: "0 0 100 100",
          __css: {
            width: n,
            height: n,
            animation: r ? Be + " 2s linear infinite" : void 0,
          },
        },
        o
      )
    );
  },
  Me = function (t) {
    var n,
      r = t.size,
      o = r === void 0 ? "48px" : r,
      c = t.max,
      v = c === void 0 ? 100 : c,
      s = t.min,
      l = s === void 0 ? 0 : s,
      y = t.valueText,
      R = t.getValueText,
      ne = t.value,
      ae = t.capIsRound,
      re = t.children,
      D = t.thickness,
      I = D === void 0 ? "10px" : D,
      V = t.color,
      oe = V === void 0 ? "#0078d4" : V,
      M = t.trackColor,
      ie = M === void 0 ? "#edebe9" : M,
      p = t.isIndeterminate,
      ce = Y(t, Ie),
      T = Re({
        min: l,
        max: v,
        value: ne,
        valueText: y,
        getValueText: R,
        isIndeterminate: p,
      }),
      w = p ? void 0 : ((n = T.percent) != null ? n : 0) * 2.64,
      le = ge(w) ? void 0 : w + " " + (264 - w),
      se = p
        ? { css: { animation: Ne + " 1.5s linear infinite" } }
        : {
            strokeDashoffset: 66,
            strokeDasharray: le,
            transitionProperty: "stroke-dasharray, stroke",
            transitionDuration: "0.6s",
            transitionTimingFunction: "ease",
          },
      ue = {
        display: "inline-block",
        position: "relative",
        verticalAlign: "middle",
        fontSize: o,
      };
    return g.exports.createElement(
      E.div,
      h({ className: "chakra-progress" }, T.bind, ce, { __css: ue }),
      g.exports.createElement(
        Ve,
        { size: o, isIndeterminate: p },
        g.exports.createElement(U, {
          stroke: ie,
          strokeWidth: I,
          className: "chakra-progress__track",
        }),
        g.exports.createElement(
          U,
          h(
            {
              stroke: oe,
              strokeWidth: I,
              className: "chakra-progress__indicator",
              strokeLinecap: ae ? "round" : void 0,
              opacity: T.value === 0 && !p ? 0 : void 0,
            },
            se
          )
        )
      ),
      re
    );
  },
  je = E("div", {
    baseStyle: {
      fontSize: "0.24em",
      top: "50%",
      left: "50%",
      width: "100%",
      textAlign: "center",
      position: "absolute",
      transform: "translate(-50%, -50%)",
    },
  });
const X = m(),
  J = m(),
  Ue = S(K, !1),
  $e = S(G, 0);
function Le() {
  const e = k(Ue),
    t = k($e),
    n = k(L);
  return a.createElement(
    he,
    { spacing: "3" },
    a.createElement(
      C,
      null,
      a.createElement(fe, { fontSize: "18px" }, "Invitations Sent")
    ),
    a.createElement(
      C,
      null,
      a.createElement(
        Me,
        { value: (t / Number(n)) * 100, color: "green.400", size: "100px" },
        a.createElement(je, null, t)
      )
    ),
    a.createElement(
      C,
      null,
      a.createElement(
        x,
        {
          colorScheme: e ? "red" : "green",
          onClick: () => (e ? X() : J()),
          isFullWidth: !0,
        },
        e ? "STOP" : "START",
        " CONNECTING"
      )
    )
  );
}
var Q = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0,
  },
  $ = a.createContext && a.createContext(Q),
  u =
    (globalThis && globalThis.__assign) ||
    function () {
      return (
        (u =
          Object.assign ||
          function (e) {
            for (var t, n = 1, r = arguments.length; n < r; n++) {
              t = arguments[n];
              for (var o in t)
                Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
            return e;
          }),
        u.apply(this, arguments)
      );
    },
  We =
    (globalThis && globalThis.__rest) ||
    function (e, t) {
      var n = {};
      for (var r in e)
        Object.prototype.hasOwnProperty.call(e, r) &&
          t.indexOf(r) < 0 &&
          (n[r] = e[r]);
      if (e != null && typeof Object.getOwnPropertySymbols == "function")
        for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
          t.indexOf(r[o]) < 0 &&
            Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
            (n[r[o]] = e[r[o]]);
      return n;
    };
function Z(e) {
  return (
    e &&
    e.map(function (t, n) {
      return a.createElement(t.tag, u({ key: n }, t.attr), Z(t.child));
    })
  );
}
function N(e) {
  return function (t) {
    return a.createElement(Fe, u({ attr: u({}, e.attr) }, t), Z(e.child));
  };
}
function Fe(e) {
  var t = function (n) {
    var r = e.attr,
      o = e.size,
      c = e.title,
      v = We(e, ["attr", "size", "title"]),
      s = o || n.size || "1em",
      l;
    return (
      n.className && (l = n.className),
      e.className && (l = (l ? l + " " : "") + e.className),
      a.createElement(
        "svg",
        u(
          { stroke: "currentColor", fill: "currentColor", strokeWidth: "0" },
          n.attr,
          r,
          v,
          {
            className: l,
            style: u(u({ color: e.color || n.color }, n.style), e.style),
            height: s,
            width: s,
            xmlns: "http://www.w3.org/2000/svg",
          }
        ),
        c && a.createElement("title", null, c),
        e.children
      )
    );
  };
  return $ !== void 0
    ? a.createElement($.Consumer, null, function (n) {
        return t(n);
      })
    : t(Q);
}
function He(e) {
  return N({
    tag: "svg",
    attr: { viewBox: "0 0 24 24" },
    child: [
      { tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" } },
      {
        tag: "path",
        attr: {
          d: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
        },
      },
    ],
  })(e);
}
function qe(e) {
  return N({
    tag: "svg",
    attr: { viewBox: "0 0 24 24" },
    child: [
      { tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" } },
      {
        tag: "path",
        attr: {
          d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
        },
      },
    ],
  })(e);
}
function Ge(e) {
  return N({
    tag: "svg",
    attr: { viewBox: "0 0 24 24" },
    child: [
      { tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" } },
      {
        tag: "path",
        attr: {
          d: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
        },
      },
    ],
  })(e);
}
// var B = ((e) => (
//   (e.SearchPeoplePage = "https://www.linkedin.com/search/results/people/"),
//   (e.MyNetworkPage = "https://www.linkedin.com/mynetwork/"),
//   (e.PatternOfSearchPage = "linkedin.com/search/results/people"),
//   (e.PatternOfMyNetworkPage = "linkedin.com/mynetwork"),
//   e
// ))(B || {});
// const Ke = d(() => {
//     chrome.tabs.create({ url: B.SearchPeoplePage });
//   }),
//   Ye = d(() => {
//     chrome.tabs.create({ url: B.MyNetworkPage });
//   });
function Xe() {
  return a.createElement(
    pe,
    { spacing: 3 },
    a.createElement(
      j,
      null,
      a.createElement(
        x,
        {
          onClick: () => Ye(),
          leftIcon: a.createElement(Ge, null),
          isFullWidth: !0,
        },
        "People You May Know"
      )
    ),
    a.createElement(
      j,
      null,
      a.createElement(
        x,
        {
          onClick: () => Ke(),
          leftIcon: a.createElement(He, null),
          isFullWidth: !0,
        },
        "Search People"
      )
    )
  );
}
const Je = d(() => {
    chrome.runtime.openOptionsPage();
  }),
  Qe = Ce(!1).on(q, () => !0);
function Ze() {
  const e = k(Qe);
  return a.createElement(
    ke,
    { theme: xe },
    a.createElement(
      Se,
      {
        paddingX: 5,
        paddingY: 2,
        backgroundColor: "gray.700",
        align: "center",
        width: "260px",
      },
      a.createElement(
        C,
        null,
        a.createElement(be, { size: "sm" }, "LinkedIn AutoConnect")
      ),
      a.createElement(Pe, null),
      a.createElement(
        C,
        null,
        a.createElement(
          x,
          { size: "sm", onClick: () => Je() },
          a.createElement(qe, null)
        )
      )
    ),
    a.createElement(
      Ee,
      { padding: "5" },
    a.createElement(Le, null)
      //e ? a.createElement(Le, null) : a.createElement(Xe, null)
    )
  );
}
const et = d(() => {
  ye.exports.render(
    a.createElement(Ze),
    document.body.appendChild(document.createElement("div"))
  );
});
f({ from: O, to: [et, W] });
b({
  clock: O,
  source: Te({ maximumAutoConnectionsPerSession: L }),
  target: we,
});
const ee = S(_, null),
  te = d((e) => {
    const { message: t, port: n } = e;
    n.postMessage(t);
  });
z({
  clock: b({
    clock: J,
    source: ee,
    fn: (e) => ({ message: { id: i.StartAutoConnect }, port: e }),
  }),
  filter: (e) => e.port !== null,
  target: te,
});
z({
  clock: b({
    clock: X,
    source: ee,
    fn: (e) => ({ message: { id: i.StopAutoConnect }, port: e }),
  }),
  filter: (e) => e.port !== null,
  target: te,
});
O();
