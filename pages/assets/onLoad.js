function Og(e, t) {
  return (
    t.forEach(function (r) {
      r &&
        typeof r != "string" &&
        !Array.isArray(r) &&
        Object.keys(r).forEach(function (n) {
          if (n !== "default" && !(n in e)) {
            var o = Object.getOwnPropertyDescriptor(r, n);
            Object.defineProperty(
              e,
              n,
              o.get
                ? o
                : {
                    enumerable: !0,
                    get: function () {
                      return r[n];
                    },
                  }
            );
          }
        });
    }),
    Object.freeze(
      Object.defineProperty(e, Symbol.toStringTag, { value: "Module" })
    )
  );
}
const Bg = function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
  new MutationObserver((o) => {
    for (const a of o)
      if (a.type === "childList")
        for (const i of a.addedNodes)
          i.tagName === "LINK" && i.rel === "modulepreload" && n(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(o) {
    const a = {};
    return (
      o.integrity && (a.integrity = o.integrity),
      o.referrerpolicy && (a.referrerPolicy = o.referrerpolicy),
      o.crossorigin === "use-credentials"
        ? (a.credentials = "include")
        : o.crossorigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function n(o) {
    if (o.ep) return;
    o.ep = !0;
    const a = r(o);
    fetch(o.href, a);
  }
};
Bg();
function Vf(e, t, r, n) {
  ((st(e) || ut(e)) && ("family" in e || "graphite" in e)) ||
    lt(`${t}: expect ${r} to be a unit (store, event or effect)${n}`);
}
function Kt(e, t, r) {
  if (Array.isArray(e))
    for (let n = 0; n < e.length; n++) Vf(e[n], t, `${n} item of ${r}`, "");
  else Vf(e, t, r, " or array of units");
}
function Ft({
  node: e = [],
  from: t,
  source: r,
  parent: n = t || r,
  to: o,
  target: a,
  child: i = o || a,
  scope: l = {},
  meta: s = {},
  family: u = { type: "regular" },
  regional: p,
} = {}) {
  let g = za(n),
    v = za(u.links),
    m = za(u.owners),
    y = [],
    w = {};
  for (let c = 0; c < e.length; c++) {
    let d = e[c];
    d && (y.push(d), Qg(d, w));
  }
  let h = {
    id: Ug(),
    seq: y,
    next: za(i),
    meta: s,
    scope: l,
    family: { type: u.type || "crosslink", links: v, owners: m },
    reg: w,
  };
  for (let c = 0; c < v.length; c++) cl(v[c]).push(h);
  for (let c = 0; c < m.length; c++) fl(m[c]).push(h);
  for (let c = 0; c < g.length; c++) g[c].next.push(h);
  return p && xn && Ho(fn(xn), [h]), h;
}
function Hr(e, t, r) {
  let n = Pt,
    o = null,
    a = fe;
  if (
    (e.target &&
      ((t = e.params),
      (r = e.defer),
      (n = "page" in e ? e.page : n),
      e.stack && (o = e.stack),
      (a = dn(e) || a),
      (e = e.target)),
    a && fe && a !== fe && (fe = null),
    Array.isArray(e))
  )
    for (let m = 0; m < e.length; m++) ts("pure", n, Qe(e[m]), o, t[m], a);
  else ts("pure", n, Qe(e), o, t, a);
  if (r && !Ia) return;
  let i,
    l,
    s,
    u,
    p,
    g,
    v = { isRoot: Ia, currentPage: Pt, forkPage: fe, isWatch: ui };
  Ia = 0;
  e: for (; (u = qg()); ) {
    let { idx: m, stack: y, type: w } = u;
    (s = y.node), (Pt = p = y.page), (fe = dn(y)), (g = (p || s).reg);
    let h = { fail: 0, scope: s.scope };
    i = l = 0;
    for (let c = m; c < s.seq.length && !i; c++) {
      let d = s.seq[c],
        x = d.data;
      switch (d.type) {
        case "barrier": {
          let k = x.barrierID;
          p && (k = `${p.fullID}_${k}`);
          let $ = x.priority;
          if (c !== m || w !== $) {
            rs.has(k) || (rs.add(k), Ys(c, y, $, k));
            continue e;
          }
          rs.delete(k);
          break;
        }
        case "mov": {
          let k;
          switch (x.from) {
            case "stack":
              k = fn(y);
              break;
            case "a":
            case "b":
              k = y[x.from];
              break;
            case "value":
              k = x.store;
              break;
            case Zt:
              g[x.store.id] ||
                ((y.page = p = bm(p, x.store.id)), (g = p ? p.reg : s.reg)),
                (k = Sn(g[x.store.id]));
          }
          switch (x.to) {
            case "stack":
              y.value = k;
              break;
            case "a":
            case "b":
              y[x.to] = k;
              break;
            case Zt:
              Yf(p, s, x.target.id).current = k;
          }
          break;
        }
        case "check":
          switch (x.type) {
            case "defined":
              l = fn(y) === void 0;
              break;
            case "changed":
              l = fn(y) === Sn(Yf(p, s, x.store.id));
          }
          break;
        case "filter":
          l = !Xf(h, x, y);
          break;
        case "run":
          if (c !== m || w !== "effect") {
            Ys(c, y, "effect");
            continue e;
          }
        case "compute":
          (ui = s.meta.op === "watch"),
            (y.value = Xf(h, x, y)),
            (ui = v.isWatch);
      }
      i = h.fail || l;
    }
    if (!i)
      for (let c = 0; c < s.next.length; c++)
        ts("child", p, s.next[c], y, fn(y), dn(y));
  }
  (Ia = v.isRoot), (Pt = v.currentPage), (fe = dn(v));
}
function lm(e, t = "combine") {
  let r = t + "(",
    n = "",
    o = 0;
  for (let a in e) {
    let i = e[a];
    if (
      (i != null &&
        ((r += n), (r += wt(i) ? i.compositeName.fullName : i.toString())),
      (o += 1),
      o === 25)
    )
      break;
    n = ", ";
  }
  return (r += ")"), r;
}
function Fg(e, t) {
  let r,
    n,
    o,
    a = e;
  return (
    t
      ? ((o = t.compositeName),
        e.length === 0
          ? ((r = o.path), (n = o.fullName))
          : ((r = o.path.concat([e])),
            (n = o.fullName.length === 0 ? e : o.fullName + "/" + e)))
      : ((r = e.length === 0 ? [] : [e]), (n = e)),
    { shortName: a, fullName: n, path: r }
  );
}
function Ti(e, t) {
  for (let r in e) t(e[r], r);
}
function Ng(e, t) {
  e.forEach(t);
}
function xt(e, t) {
  let r = (o, ...a) =>
    Pt
      ? ((i, l, s, u) => {
          let p = Pt,
            g = null;
          if (l) for (g = Pt; g && g.template !== l; ) g = Bt(g);
          Gf(g);
          let v = i.create(s, u);
          return Gf(p), v;
        })(r, n, o, a)
      : r.create(o, a);
  (r.graphite = Ft({ meta: Em("event", r, t, e), regional: 1 })),
    (r.create = (o) => (Hr(fe ? fe.find(r) : r, o), o)),
    (r.watch = Gg(wm, r)),
    (r.map = (o) => {
      let a, i;
      st(o) && ((a = o), (i = o.name), (o = o.fn));
      let l = xt(xm(r, i), a);
      return qf(r, l, Pi, o), l;
    }),
    (r.filter = (o) => Kf(r, "filter", o.fn ? o : o.fn, [zt({ fn: Wo })])),
    (r.filterMap = (o) =>
      Kf(r, "filterMap", o, [kt({ fn: Wo }), Xr.defined()])),
    (r.prepend = (o) => {
      let a = xt("* \u2192 " + r.shortName, { parent: Bt(r) }),
        i = Vo();
      return i && Qe(a).seq.push(i.upward), qf(a, r, "prepend", o), ty(r, a), a;
    });
  let n = Vo();
  return r;
}
function Vr(e, t) {
  function r(g, v) {
    s.off(g), si(s).set(g, rc(Zf(g, s, "on", 1, v, p)));
  }
  let n = fr(e),
    o = fr(e),
    a = _m("updates"),
    i = Vo();
  (n.after = [{ type: "copy", to: o }]), i && i.plain.push(n, o);
  let l = n.id,
    s = {
      subscribers: new Map(),
      updates: a,
      defaultState: e,
      stateRef: n,
      getState() {
        let g,
          v = n;
        if (Pt) {
          let m = Pt;
          for (; m && !m.reg[l]; ) m = Bt(m);
          m && (g = m);
        }
        return !g && fe && fe.reg[l] && (g = fe), g && (v = g.reg[l]), Sn(v);
      },
      setState(g) {
        let v;
        fe && (v = fe.nodeMap[Qe(s).id]),
          v || (v = s),
          Hr({ target: v, params: g, defer: 1 });
      },
      reset(...g) {
        for (let v of g) s.on(v, () => s.defaultState);
        return s;
      },
      on(g, v) {
        if ((Kt(g, ".on", "first argument"), Array.isArray(g)))
          for (let m of g) r(m, v);
        else r(g, v);
        return s;
      },
      off(g) {
        let v = si(s).get(g);
        return v && (v(), si(s).delete(g)), s;
      },
      map(g, v) {
        let m, y, w;
        st(g) && ((m = g), (y = g.name), (v = g.firstState), (g = g.fn));
        let h = s.getState();
        h !== void 0 && (w = g(h, v));
        let c = Vr(w, { name: xm(s, y), config: m, strict: 0 });
        return (
          Zf(s, c, Pi, 0, g), (Ge(c).before = [{ type: Pi, fn: g, from: n }]), c
        );
      },
      watch(g, v) {
        if (!v || !wt(g)) {
          let m = wm(s, g);
          return g(s.getState()), m;
        }
        return (
          ut(v) || lt("second argument should be a function"),
          g.watch((m) => v(s.getState(), m))
        );
      },
    },
    u = Em(Zt, s, t),
    p = s.defaultConfig.updateFilter;
  return (
    (s.graphite = Ft({
      scope: { state: n },
      node: [
        Xr.defined(),
        Xr.changed({ store: o }),
        p && ke({ store: o, to: "a" }),
        p && zt({ fn: (g, v, { a: m }) => p(g, m) }),
        Do({ store: n }),
        Do({ store: o }),
      ],
      child: a,
      meta: u,
      regional: 1,
    })),
    km &&
      e === void 0 &&
      lt("current state can't be undefined, use null instead"),
    Ho(s, [a]),
    s
  );
}
function sm(...e) {
  let t, r, n;
  ec(e[0], (l, s) => {
    (n = l), (e = s);
  });
  let o,
    a,
    i = e[e.length - 1];
  if ((ut(i) ? ((r = e.slice(0, -1)), (t = i)) : (r = e), r.length === 1)) {
    let l = r[0];
    St(l) || ((o = l), (a = 1));
  }
  return (
    a || ((o = r), t && (t = ry(t))),
    st(o) || lt("shape should be an object"),
    ny(Array.isArray(o), o, n, t)
  );
}
function Lg() {
  let e = {};
  return (
    (e.req = new Promise((t, r) => {
      (e.rs = t), (e.rj = r);
    })),
    e.req.catch(() => {}),
    e
  );
}
function jg(e, t) {
  let r = xt(e, t),
    n =
      r.defaultConfig.handler ||
      (() => lt(`no handler used in ${r.getType()}`)),
    o = Qe(r);
  (o.meta.onCopy = ["runner"]),
    (o.meta.unit = r.kind = "effect"),
    (r.use = (m) => (
      ut(m) || lt(".use argument should be a function"), (n = m), r
    ));
  let a = (r.finally = _m("finally")),
    i = (r.done = a.filterMap({
      named: "done",
      fn({ status: m, params: y, result: w }) {
        if (m === "done") return { params: y, result: w };
      },
    })),
    l = (r.fail = a.filterMap({
      named: "fail",
      fn({ status: m, params: y, error: w }) {
        if (m === "fail") return { params: y, error: w };
      },
    })),
    s = (r.doneData = i.map({ named: "doneData", fn: ({ result: m }) => m })),
    u = (r.failData = l.map({ named: "failData", fn: ({ error: m }) => m })),
    p = Ft({
      scope: { getHandler: (r.use.getCurrent = () => n), finally: a },
      node: [
        $i({
          fn({ params: m, req: y }, { finally: w, getHandler: h }, c) {
            let d,
              x = Jf({ params: m, req: y, ok: 1, anyway: w, stack: c }),
              k = Jf({ params: m, req: y, ok: 0, anyway: w, stack: c });
            try {
              d = h()(m);
            } catch ($) {
              return void k($);
            }
            st(d) && ut(d.then) ? d.then(x, k) : x(d);
          },
        }),
      ],
      meta: { op: "fx", fx: "runner", onCopy: ["finally"] },
    });
  (o.scope.runner = p),
    o.seq.push(
      kt({
        fn: (m, y, w) =>
          Bt(w) ? { params: m, req: { rs(h) {}, rj(h) {} } } : m,
      }),
      $i({
        fn: (m, { runner: y }, w) => (
          Hr({ target: y, params: m, defer: 1, forkPage: dn(w) }), m.params
        ),
      })
    ),
    (r.create = (m) => {
      let y = Lg(),
        w = { params: m, req: y };
      if (fe) {
        if (!ui) {
          let h = fe;
          y.req
            .finally(() => {
              Zg(h);
            })
            .catch(() => {});
        }
        Hr(fe.find(r), w);
      } else Hr(r, w);
      return y.req;
    });
  let g = (r.inFlight = Vr(0, { named: "inFlight" })
      .on(r, (m) => m + 1)
      .on(a, (m) => m - 1)),
    v = (r.pending = g.map({ fn: (m) => m > 0, named: "pending" }));
  return Ho(r, [a, i, l, s, u, v, g, p]), r;
}
function um(e, t) {
  let r = xt(t || lm(e, "merge"));
  return (
    Kt(e, "merge", "first argument"),
    ey({ from: e, to: r, meta: { op: "merge" } }),
    r
  );
}
function Us(...e) {
  let t,
    r,
    n,
    o,
    [[a, i, l], s] = tc(e);
  i === void 0 &&
    st(a) &&
    ((m) => {
      let y = 0;
      return (
        Ng(ay, (w) => {
          w in m &&
            (m[w] == null && lt(`sample: ${w} should be defined`), (y = 1));
        }),
        y
      );
    })(a) &&
    ((i = a.clock),
    (l = a.fn),
    (o = a.greedy),
    (t = a.target),
    (r = a.name),
    (n = a.sid),
    (a = a.source));
  let u = 1;
  a === void 0 &&
    (Kt(i, "sample", "clock"),
    Array.isArray(i) && (i = um(i)),
    (a = i),
    (u = 0)),
    u && !wt(a) && (a = sm(a)),
    i === void 0 && (i = a),
    Kt(i, "sample", "clock"),
    (r = s || r || a.shortName);
  let p = Vo(),
    g = !!t;
  t ||
    (St(a) && St(i)
      ? (t = Vr(l ? l(Sn(Ge(a)), Sn(Ge(i))) : Sn(Ge(a)), { name: r, sid: n }))
      : ((t = xt(r)), p && Qe(t).seq.push(p.loader)));
  let v = g && wt(t) && Qe(t).meta.nativeTemplate;
  if (St(a)) {
    let m = Ge(a);
    Ho(a, [
      xr(i, t, {
        scope: { fn: l, targetTemplate: v },
        node: [
          p && p.loader,
          !o && jo({ priority: "sampler" }),
          ke({ store: m, to: l ? "a" : "stack" }),
          l && kt({ fn: gm }),
          p && g && p.upward,
        ],
        meta: { op: "sample", sample: Zt },
      }),
    ]),
      p && (ko(p.plain, m) || ko(p.closure, m) || p.closure.push(m));
  } else {
    let m = fr(0),
      y = fr(),
      w = fr();
    p && p.plain.push(m, y, w),
      Ft({
        parent: a,
        node: [Do({ store: y }), ke({ from: "value", store: 1, target: m })],
        family: { owners: [a, t, i], links: t },
        meta: { op: "sample", sample: "source" },
        regional: 1,
      }),
      Ho(a, [
        xr(i, t, {
          scope: { fn: l, targetTemplate: v },
          node: [
            p && p.loader,
            Do({ store: w }),
            ke({ store: m }),
            zt({ fn: (h) => h }),
            !o && jo({ priority: "sampler" }),
            ke({ store: y }),
            ke({ store: w, to: "a" }),
            l && kt({ fn: vm }),
            p && g && p.upward,
          ],
          meta: { op: "sample", sample: "clock" },
        }),
      ]);
  }
  return t;
}
function K5(...e) {
  let t = { op: "guard" },
    r = "guard",
    [[n, o], a] = tc(e);
  a && ((t.config = a), a.name && (r = a.name)), o || ((o = n), (n = o.source));
  let { filter: i, greedy: l, clock: s, name: u = r } = o,
    p = o.target || xt(u, t.config),
    g = wt(i),
    v = 1;
  return (
    n === void 0 &&
      (Kt(s, "guard", "clock"),
      Array.isArray(s) && (s = um(s)),
      (n = s),
      (v = 0)),
    v && !wt(n) && (n = sm(n)),
    s &&
      (Kt(s, "guard", "clock"),
      (n = Us({
        source: n,
        clock: s,
        greedy: l,
        fn: g ? null : (m, y) => ({ source: m, clock: y }),
      }))),
    Kt(p, "guard", "target"),
    g
      ? Us({
          source: i,
          clock: n,
          target: Ft({
            node: [
              zt({ fn: ({ guard: m }) => m }),
              kt({ fn: ({ data: m }) => m }),
            ],
            child: p,
            meta: t,
            family: { owners: [n, i, p, ...[].concat(s || [])], links: p },
            regional: 1,
          }),
          fn: (m, y) => ({ guard: m, data: y }),
          greedy: l,
          name: u,
        })
      : (ut(i) || lt("`filter` should be function or unit"),
        xr(n, p, {
          scope: { fn: i },
          node: s
            ? [
                zt({ fn: ({ source: m, clock: y }, { fn: w }) => w(m, y) }),
                kt({ fn: ({ source: m }) => m }),
              ]
            : [zt({ fn: Wo })],
          meta: t,
        })),
    p
  );
}
function Dg(e, t, r) {
  if (St(e)) return e;
  if (wt(e)) {
    let o,
      a = Bt(e);
    return (
      fm(e) &&
        (o = Vr(t, { parent: a, name: e.shortName, ɔ: r }).on(e, (i, l) => l)),
      dm(e) &&
        (o = Vr(t, { parent: a, name: e.shortName, ɔ: r }).on(
          e.done,
          (i, { result: l }) => l
        )),
      a && a.hooks.store(o),
      o
    );
  }
  let n = Array.isArray(e) ? [] : {};
  return (
    Ti(e, (o, a) => {
      n[a] = St(o) ? o : Vr(o, { name: a });
    }),
    n
  );
}
function Z5(...e) {
  let t,
    [[r, n], o] = tc(e),
    a = !n;
  a && ((t = r.cases), (n = r.match), (r = r.source));
  let i = St(n),
    l = !wt(n) && ut(n),
    s = !i && !l && st(n);
  t || (t = {}),
    a ||
      (s || lt("match should be an object"),
      Ti(n, (m, y) => {
        t[y] = xt(o);
      }),
      (t.__ = xt(o)));
  let u,
    p = Vo(),
    g = new Set([].concat(r, Object.values(t))),
    v = Object.keys(i || l ? t : n);
  if (i || l)
    i && g.add(n),
      (u = [
        i && jo({ priority: "sampler" }),
        i && ke({ store: Ge(n), to: "a" }),
        zt({
          fn(m, y, w) {
            let h = String(i ? w.a : n(m));
            os(y, ko(v, h) ? h : "__", m, w);
          },
        }),
      ]);
  else if (s) {
    let m = fr({});
    m.type = "shape";
    let y,
      w = (m.before = []),
      h = [
        ke({ store: m, to: "a" }),
        kt({
          fn(d, { key: x }, { a: k }) {
            k[x] = d;
          },
        }),
      ],
      c = [];
    Ti(n, (d, x) => {
      if (wt(d)) {
        (y = 1), c.push(x), g.add(d);
        let k = xr(d, [], { node: h, scope: { key: x } });
        if (St(d)) {
          m.current[x] = d.getState();
          let $ = Ge(d);
          w.push({ type: "field", field: x, from: $ }),
            p && (ko(p.plain, $) || k.seq.unshift(p.loader));
        }
      }
    }),
      y && p && p.plain.push(m),
      (u = [
        y && jo({ priority: "sampler" }),
        y && ke({ store: m, to: "a" }),
        zt({
          fn(d, x, k) {
            for (let $ = 0; $ < v.length; $++) {
              let T = v[$];
              if (ko(c, T) ? k.a[T] : n[T](d)) return void os(x, T, d, k);
            }
            os(x, "__", d, k);
          },
        }),
      ]);
  } else lt("expect match to be unit, function or object");
  if (
    (Ft({
      meta: { onCopy: Object.keys(t), op: "split" },
      parent: r,
      scope: t,
      node: u,
      family: { type: "crosslink", owners: Array.from(g) },
      regional: 1,
    }),
    !a)
  )
    return t;
}
let Wg = (typeof Symbol != "undefined" && Symbol.observable) || "@@observable",
  Zt = "store",
  cm = "effect",
  Pi = "map",
  wt = (e) => (ut(e) || st(e)) && "kind" in e;
const sl = (e) => (t) => wt(t) && t.kind === e;
let St = sl(Zt),
  fm = sl("event"),
  dm = sl(cm),
  pm = sl("domain");
var Hg = {
  __proto__: null,
  unit: wt,
  store: St,
  event: fm,
  effect: dm,
  domain: pm,
};
let lt = (e) => {
    throw Error(e);
  },
  st = (e) => typeof e == "object" && e !== null,
  ut = (e) => typeof e == "function",
  mm = (e) => {
    st(e) || ut(e) || lt("expect first argument be an object");
  };
const Ku = () => {
  let e = 0;
  return () => (++e).toString(36);
};
let Vg = Ku(),
  hm = Ku(),
  Ug = Ku(),
  Gg = (e, t) => e.bind(null, t),
  ul = (e, t, r) => e.bind(null, t, r);
const Yr = (e, t, r) => ({ id: hm(), type: e, data: r, hasRef: t });
let Yg = 0,
  jo = ({ priority: e = "barrier" }) =>
    Yr("barrier", 0, { barrierID: ++Yg, priority: e }),
  ke = ({ from: e = Zt, store: t, target: r, to: n = r ? Zt : "stack" }) =>
    Yr("mov", e === Zt, { from: e, store: t, to: n, target: r }),
  Xr = {
    defined: () => Yr("check", 0, { type: "defined" }),
    changed: ({ store: e }) => Yr("check", 1, { type: "changed", store: e }),
  },
  kt = ul(Yr, "compute", 0),
  zt = ul(Yr, "filter", 0),
  $i = ul(Yr, "run", 0),
  Do = ({ store: e }) => ke({ from: "stack", target: e }),
  fr = (e) => ({ id: hm(), current: e }),
  Sn = ({ current: e }) => e,
  vm = (e, { fn: t }, { a: r }) => t(e, r),
  gm = (e, { fn: t }, { a: r }) => t(r, e),
  Wo = (e, { fn: t }) => t(e),
  Qe = (e) => e.graphite || e,
  cl = (e) => e.family.owners,
  fl = (e) => e.family.links,
  Ge = (e) => e.stateRef,
  ym = (e) => e.config,
  Gs = (e) => e.ɔ,
  fn = (e) => e.value,
  si = (e) => e.subscribers,
  Bt = (e) => e.parent,
  dn = (e) => e.forkPage,
  Ho = (e, t) => {
    let r = Qe(e);
    for (let n = 0; n < t.length; n++) {
      let o = Qe(t[n]);
      r.family.type !== "domain" && (o.family.type = "crosslink"),
        cl(o).push(r),
        fl(r).push(o);
    }
  },
  xn = null,
  Vo = () => xn,
  Xg = (e) => (e && xn && xn.sidRoot && (e = `${xn.sidRoot}\u0254${e}`), e);
const za = (e = []) => {
  let t = [];
  if (Array.isArray(e))
    for (let r = 0; r < e.length; r++)
      Array.isArray(e[r]) ? t.push(...e[r]) : t.push(e[r]);
  else t.push(e);
  return t.map(Qe);
};
let Qg = ({ hasRef: e, type: t, data: r }, n) => {
    let o;
    e && ((o = r.store), (n[o.id] = o)),
      t === "mov" && r.to === Zt && ((o = r.target), (n[o.id] = o));
  },
  pn = null;
const Zu = (e, t) => {
    if (!e) return t;
    if (!t) return e;
    let r,
      n = e.v.type === t.v.type;
    return (
      ((n && e.v.id > t.v.id) || (!n && e.v.type === "sampler")) &&
        ((r = e), (e = t), (t = r)),
      (r = Zu(e.r, t)),
      (e.r = e.l),
      (e.l = r),
      e
    );
  },
  Ju = [];
let Uf = 0;
for (; Uf < 5; ) Ju.push({ first: null, last: null, size: 0 }), (Uf += 1);
const qg = () => {
    for (let e = 0; e < 5; e++) {
      let t = Ju[e];
      if (t.size > 0) {
        if (e === 2 || e === 3) {
          t.size -= 1;
          let n = pn.v;
          return (pn = Zu(pn.l, pn.r)), n;
        }
        t.size === 1 && (t.last = null);
        let r = t.first;
        return (t.first = r.r), (t.size -= 1), r.v;
      }
    }
  },
  ts = (e, t, r, n, o, a) =>
    Ys(
      0,
      { a: null, b: null, node: r, parent: n, value: o, page: t, forkPage: a },
      e
    ),
  Ys = (e, t, r, n = 0) => {
    let o = Kg(r),
      a = Ju[o],
      i = { v: { idx: e, stack: t, type: r, id: n }, l: 0, r: 0 };
    o === 2 || o === 3
      ? (pn = Zu(pn, i))
      : (a.size === 0 ? (a.first = i) : (a.last.r = i), (a.last = i)),
      (a.size += 1);
  },
  Kg = (e) => {
    switch (e) {
      case "child":
        return 0;
      case "pure":
        return 1;
      case "barrier":
        return 2;
      case "sampler":
        return 3;
      case cm:
        return 4;
      default:
        return -1;
    }
  },
  rs = new Set();
let fe,
  Ia = 1,
  ui = 0,
  Pt = null,
  Zg = (e) => {
    fe = e;
  },
  Gf = (e) => {
    Pt = e;
  };
const bm = (e, t) => {
    if (e) {
      for (; e && !e.reg[t]; ) e = Bt(e);
      if (e) return e;
    }
    return null;
  },
  Yf = (e, t, r) => (bm(e, r) || t).reg[r],
  Xf = (e, { fn: t }, r) => {
    try {
      return t(fn(r), e.scope, r);
    } catch (n) {
      console.error(n), (e.fail = 1);
    }
  };
let Sm = (e, t) => "" + e.shortName + t,
  xm = (e, t) => (t == null ? Sm(e, " \u2192 *") : t),
  ec = (e, t) => {
    mm(e), Gs(e) && t(ym(e), Gs(e));
  },
  tc = (e) => {
    let t;
    return (
      ec(e[0], (r, n) => {
        (t = r), (e = n);
      }),
      [e, t]
    );
  },
  ko = (e, t) => e.includes(t),
  ns = (e, t) => {
    let r = e.indexOf(t);
    r !== -1 && e.splice(r, 1);
  };
const Qf = (e, t) => {
    ns(e.next, t), ns(cl(e), t), ns(fl(e), t);
  },
  Xs = (e, t, r) => {
    let n;
    (e.next.length = 0), (e.seq.length = 0), (e.scope = null);
    let o = fl(e);
    for (; (n = o.pop()); )
      Qf(n, e),
        (t || (r && !e.meta.sample) || n.family.type === "crosslink") &&
          Xs(n, t, n.meta.op !== "on" && r);
    for (o = cl(e); (n = o.pop()); )
      Qf(n, e),
        r && n.family.type === "crosslink" && Xs(n, t, n.meta.op !== "on" && r);
  },
  no = (e) => e.clear();
let Jg = (e, { deep: t } = {}) => {
    let r = 0;
    if ((e.ownerSet && e.ownerSet.delete(e), St(e))) no(si(e));
    else if (pm(e)) {
      r = 1;
      let n = e.history;
      no(n.events), no(n.effects), no(n.stores), no(n.domains);
    }
    Xs(Qe(e), !!t, r);
  },
  rc = (e) => {
    let t = ul(Jg, e, void 0);
    return (t.unsubscribe = t), t;
  },
  xr = (e, t, { node: r, scope: n, meta: o }) =>
    Ft({
      node: r,
      parent: e,
      child: t,
      scope: n,
      meta: o,
      family: { owners: [e, t], links: t },
      regional: 1,
    }),
  ey = (e) => {
    let t;
    ec(e, (a, i) => {
      (t = a), (e = i);
    });
    let { from: r, to: n, meta: o = { op: "forward" } } = e;
    return (
      Kt(r, "forward", '"from"'),
      Kt(n, "forward", '"to"'),
      t && (o.config = t),
      rc(Ft({ parent: r, child: n, meta: o, family: {}, regional: 1 }))
    );
  },
  wm = (e, t) => {
    if ((ut(t) || lt(".watch argument should be a function"), fe)) {
      let r = fe.nodeMap[Qe(e).id];
      r && (e = r);
    }
    return rc(
      Ft({
        scope: { fn: t },
        node: [$i({ fn: Wo })],
        parent: e,
        meta: { op: "watch" },
        family: { owners: e },
        regional: 1,
      })
    );
  };
const ci = (e, t) => (
  st(e) &&
    (ci(ym(e), t),
    e.name != null &&
      (st(e.name)
        ? ci(e.name, t)
        : ut(e.name)
        ? (t.handler = e.name)
        : (t.name = e.name)),
    e.loc && (t.loc = e.loc),
    (e.sid || e.sid === null) && (t.sid = e.sid),
    e.handler && (t.handler = e.handler),
    e.updateFilter && (t.updateFilter = e.updateFilter),
    Bt(e) && (t.parent = Bt(e)),
    "strict" in e && (t.strict = e.strict),
    e.named && (t.named = e.named),
    ci(Gs(e), t)),
  t
);
let km,
  ty = (e, t, r = "event") => {
    Bt(e) && Bt(e).hooks[r](t);
  },
  Em = (e, t, r, n) => {
    let o = ci({ name: n, config: r }, {}),
      a = e === "domain",
      i = Vg(),
      { parent: l = null, sid: s = null, strict: u = 1, named: p = null } = o,
      g = p || o.name || (a ? "" : i),
      v = Fg(g, l),
      m = {
        unit: (t.kind = e),
        name: (t.shortName = g),
        sid: (t.sid = Xg(s)),
        named: p,
        unitId: (t.id = i),
      };
    return (
      (t.parent = l),
      (t.compositeName = v),
      (t.defaultConfig = o),
      (t.thru = (y) => y(t)),
      (t.getType = () => v.fullName),
      !a &&
        ((t.subscribe = (y) => (
          mm(y),
          t.watch(
            ut(y)
              ? y
              : (w) => {
                  y.next && y.next(w);
                }
          )
        )),
        (t[Wg] = () => t)),
      (km = u),
      m
    );
  },
  _m = (e) => xt({ named: e });
const qf = (e, t, r, n) =>
    xr(e, t, { scope: { fn: n }, node: [kt({ fn: Wo })], meta: { op: r } }),
  Kf = (e, t, r, n) => {
    let o;
    st(r) && ((o = r), (r = r.fn));
    let a = xt(Sm(e, " \u2192? *"), o);
    return xr(e, a, { scope: { fn: r }, node: n, meta: { op: t } }), a;
  },
  Zf = (e, t, r, n, o, a) => {
    let i = Ge(t),
      l = [
        ke({ store: i, to: "a" }),
        kt({ fn: n ? gm : vm }),
        Xr.defined(),
        Xr.changed({ store: i }),
        a && zt({ fn: (s, u, { a: p }) => a(s, p) }),
        Do({ store: i }),
      ];
    return xr(e, t, { scope: { fn: o }, node: l, meta: { op: r } });
  },
  ry = (e) => (t) => e(...t),
  ny = (e, t, r, n) => {
    let o = e ? (v) => v.slice() : (v) => ({ ...v }),
      a = e ? [] : {},
      i = o(a),
      l = fr(i),
      s = fr(1);
    l.type = e ? "list" : "shape";
    let u = Vr(i, { name: r || lm(t) });
    Qe(u).meta.isCombine = 1;
    let p = [
        Xr.defined(),
        ke({ store: l, to: "a" }),
        zt({ fn: (v, { key: m }, { a: y }) => v !== y[m] }),
        ke({ store: s, to: "b" }),
        kt({
          fn(v, { clone: m, key: y }, w) {
            w.b && (w.a = m(w.a)), (w.a[y] = v);
          },
        }),
        ke({ from: "a", target: l }),
        ke({ from: "value", store: 0, target: s }),
        jo({ priority: "barrier" }),
        ke({ from: "value", store: 1, target: s }),
        ke({ store: l }),
        n && kt({ fn: n }),
        Xr.changed({ store: Ge(u) }),
      ],
      g = (l.before = []);
    return (
      Ti(t, (v, m) => {
        if (!St(v)) return void (i[m] = a[m] = v);
        (a[m] = v.defaultState),
          (i[m] = v.getState()),
          xr(v, u, {
            scope: { key: m, clone: o },
            node: p,
            meta: { op: "combine" },
          });
        let y = Ge(v);
        g.push({ type: "field", field: m, from: y });
      }),
      (u.defaultShape = t),
      (l.after = [
        n ? { type: Pi, to: Ge(u), fn: n } : { type: "copy", to: Ge(u) },
      ]),
      (u.defaultState = n ? (Ge(u).current = n(i)) : a),
      u
    );
  };
let Jf =
    ({ params: e, req: t, ok: r, anyway: n, stack: o }) =>
    (a) =>
      Hr({
        target: [n, oy],
        params: [
          r
            ? { status: "done", params: e, result: a }
            : { status: "fail", params: e, error: a },
          { fn: r ? t.rs : t.rj, value: a },
        ],
        defer: 1,
        page: o.page,
        forkPage: dn(o),
      }),
  oy = Ft({
    node: [
      $i({
        fn({ fn: e, value: t }) {
          e(t);
        },
      }),
    ],
    meta: { op: "fx", fx: "sidechain" },
  });
const ay = ["source", "clock", "target"],
  os = (e, t, r, n) => {
    let o = e[t];
    o &&
      Hr({
        target: o,
        params: Array.isArray(o) ? o.map(() => r) : r,
        defer: 1,
        stack: n,
      });
  };
var Ma =
    typeof globalThis != "undefined"
      ? globalThis
      : typeof window != "undefined"
      ? window
      : typeof global != "undefined"
      ? global
      : typeof self != "undefined"
      ? self
      : {},
  C = { exports: {} },
  W = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/ var ed = Object.getOwnPropertySymbols,
  iy = Object.prototype.hasOwnProperty,
  ly = Object.prototype.propertyIsEnumerable;
function sy(e) {
  if (e == null)
    throw new TypeError(
      "Object.assign cannot be called with null or undefined"
    );
  return Object(e);
}
function uy() {
  try {
    if (!Object.assign) return !1;
    var e = new String("abc");
    if (((e[5] = "de"), Object.getOwnPropertyNames(e)[0] === "5")) return !1;
    for (var t = {}, r = 0; r < 10; r++) t["_" + String.fromCharCode(r)] = r;
    var n = Object.getOwnPropertyNames(t).map(function (a) {
      return t[a];
    });
    if (n.join("") !== "0123456789") return !1;
    var o = {};
    return (
      "abcdefghijklmnopqrst".split("").forEach(function (a) {
        o[a] = a;
      }),
      Object.keys(Object.assign({}, o)).join("") === "abcdefghijklmnopqrst"
    );
  } catch {
    return !1;
  }
}
var Cm = uy()
  ? Object.assign
  : function (e, t) {
      for (var r, n = sy(e), o, a = 1; a < arguments.length; a++) {
        r = Object(arguments[a]);
        for (var i in r) iy.call(r, i) && (n[i] = r[i]);
        if (ed) {
          o = ed(r);
          for (var l = 0; l < o.length; l++)
            ly.call(r, o[l]) && (n[o[l]] = r[o[l]]);
        }
      }
      return n;
    };
/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var nc = Cm,
  jn = 60103,
  Tm = 60106;
W.Fragment = 60107;
W.StrictMode = 60108;
W.Profiler = 60114;
var Pm = 60109,
  $m = 60110,
  Rm = 60112;
W.Suspense = 60113;
var Am = 60115,
  zm = 60116;
if (typeof Symbol == "function" && Symbol.for) {
  var mt = Symbol.for;
  (jn = mt("react.element")),
    (Tm = mt("react.portal")),
    (W.Fragment = mt("react.fragment")),
    (W.StrictMode = mt("react.strict_mode")),
    (W.Profiler = mt("react.profiler")),
    (Pm = mt("react.provider")),
    ($m = mt("react.context")),
    (Rm = mt("react.forward_ref")),
    (W.Suspense = mt("react.suspense")),
    (Am = mt("react.memo")),
    (zm = mt("react.lazy"));
}
var td = typeof Symbol == "function" && Symbol.iterator;
function cy(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (td && e[td]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
function pa(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1;
    r < arguments.length;
    r++
  )
    t += "&args[]=" + encodeURIComponent(arguments[r]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Im = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Mm = {};
function Dn(e, t, r) {
  (this.props = e),
    (this.context = t),
    (this.refs = Mm),
    (this.updater = r || Im);
}
Dn.prototype.isReactComponent = {};
Dn.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(pa(85));
  this.updater.enqueueSetState(this, e, t, "setState");
};
Dn.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Om() {}
Om.prototype = Dn.prototype;
function oc(e, t, r) {
  (this.props = e),
    (this.context = t),
    (this.refs = Mm),
    (this.updater = r || Im);
}
var ac = (oc.prototype = new Om());
ac.constructor = oc;
nc(ac, Dn.prototype);
ac.isPureReactComponent = !0;
var ic = { current: null },
  Bm = Object.prototype.hasOwnProperty,
  Fm = { key: !0, ref: !0, __self: !0, __source: !0 };
function Nm(e, t, r) {
  var n,
    o = {},
    a = null,
    i = null;
  if (t != null)
    for (n in (t.ref !== void 0 && (i = t.ref),
    t.key !== void 0 && (a = "" + t.key),
    t))
      Bm.call(t, n) && !Fm.hasOwnProperty(n) && (o[n] = t[n]);
  var l = arguments.length - 2;
  if (l === 1) o.children = r;
  else if (1 < l) {
    for (var s = Array(l), u = 0; u < l; u++) s[u] = arguments[u + 2];
    o.children = s;
  }
  if (e && e.defaultProps)
    for (n in ((l = e.defaultProps), l)) o[n] === void 0 && (o[n] = l[n]);
  return {
    $$typeof: jn,
    type: e,
    key: a,
    ref: i,
    props: o,
    _owner: ic.current,
  };
}
function fy(e, t) {
  return {
    $$typeof: jn,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function lc(e) {
  return typeof e == "object" && e !== null && e.$$typeof === jn;
}
function dy(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (r) {
      return t[r];
    })
  );
}
var rd = /\/+/g;
function as(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? dy("" + e.key)
    : t.toString(36);
}
function fi(e, t, r, n, o) {
  var a = typeof e;
  (a === "undefined" || a === "boolean") && (e = null);
  var i = !1;
  if (e === null) i = !0;
  else
    switch (a) {
      case "string":
      case "number":
        i = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case jn:
          case Tm:
            i = !0;
        }
    }
  if (i)
    return (
      (i = e),
      (o = o(i)),
      (e = n === "" ? "." + as(i, 0) : n),
      Array.isArray(o)
        ? ((r = ""),
          e != null && (r = e.replace(rd, "$&/") + "/"),
          fi(o, t, r, "", function (u) {
            return u;
          }))
        : o != null &&
          (lc(o) &&
            (o = fy(
              o,
              r +
                (!o.key || (i && i.key === o.key)
                  ? ""
                  : ("" + o.key).replace(rd, "$&/") + "/") +
                e
            )),
          t.push(o)),
      1
    );
  if (((i = 0), (n = n === "" ? "." : n + ":"), Array.isArray(e)))
    for (var l = 0; l < e.length; l++) {
      a = e[l];
      var s = n + as(a, l);
      i += fi(a, t, r, s, o);
    }
  else if (((s = cy(e)), typeof s == "function"))
    for (e = s.call(e), l = 0; !(a = e.next()).done; )
      (a = a.value), (s = n + as(a, l++)), (i += fi(a, t, r, s, o));
  else if (a === "object")
    throw (
      ((t = "" + e),
      Error(
        pa(
          31,
          t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t
        )
      ))
    );
  return i;
}
function Oa(e, t, r) {
  if (e == null) return e;
  var n = [],
    o = 0;
  return (
    fi(e, n, "", "", function (a) {
      return t.call(r, a, o++);
    }),
    n
  );
}
function py(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      (e._status = 0),
      (e._result = t),
      t.then(
        function (r) {
          e._status === 0 &&
            ((r = r.default), (e._status = 1), (e._result = r));
        },
        function (r) {
          e._status === 0 && ((e._status = 2), (e._result = r));
        }
      );
  }
  if (e._status === 1) return e._result;
  throw e._result;
}
var Lm = { current: null };
function tr() {
  var e = Lm.current;
  if (e === null) throw Error(pa(321));
  return e;
}
var my = {
  ReactCurrentDispatcher: Lm,
  ReactCurrentBatchConfig: { transition: 0 },
  ReactCurrentOwner: ic,
  IsSomeRendererActing: { current: !1 },
  assign: nc,
};
W.Children = {
  map: Oa,
  forEach: function (e, t, r) {
    Oa(
      e,
      function () {
        t.apply(this, arguments);
      },
      r
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Oa(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Oa(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!lc(e)) throw Error(pa(143));
    return e;
  },
};
W.Component = Dn;
W.PureComponent = oc;
W.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = my;
W.cloneElement = function (e, t, r) {
  if (e == null) throw Error(pa(267, e));
  var n = nc({}, e.props),
    o = e.key,
    a = e.ref,
    i = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((a = t.ref), (i = ic.current)),
      t.key !== void 0 && (o = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var l = e.type.defaultProps;
    for (s in t)
      Bm.call(t, s) &&
        !Fm.hasOwnProperty(s) &&
        (n[s] = t[s] === void 0 && l !== void 0 ? l[s] : t[s]);
  }
  var s = arguments.length - 2;
  if (s === 1) n.children = r;
  else if (1 < s) {
    l = Array(s);
    for (var u = 0; u < s; u++) l[u] = arguments[u + 2];
    n.children = l;
  }
  return { $$typeof: jn, type: e.type, key: o, ref: a, props: n, _owner: i };
};
W.createContext = function (e, t) {
  return (
    t === void 0 && (t = null),
    (e = {
      $$typeof: $m,
      _calculateChangedBits: t,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
    }),
    (e.Provider = { $$typeof: Pm, _context: e }),
    (e.Consumer = e)
  );
};
W.createElement = Nm;
W.createFactory = function (e) {
  var t = Nm.bind(null, e);
  return (t.type = e), t;
};
W.createRef = function () {
  return { current: null };
};
W.forwardRef = function (e) {
  return { $$typeof: Rm, render: e };
};
W.isValidElement = lc;
W.lazy = function (e) {
  return { $$typeof: zm, _payload: { _status: -1, _result: e }, _init: py };
};
W.memo = function (e, t) {
  return { $$typeof: Am, type: e, compare: t === void 0 ? null : t };
};
W.useCallback = function (e, t) {
  return tr().useCallback(e, t);
};
W.useContext = function (e, t) {
  return tr().useContext(e, t);
};
W.useDebugValue = function () {};
W.useEffect = function (e, t) {
  return tr().useEffect(e, t);
};
W.useImperativeHandle = function (e, t, r) {
  return tr().useImperativeHandle(e, t, r);
};
W.useLayoutEffect = function (e, t) {
  return tr().useLayoutEffect(e, t);
};
W.useMemo = function (e, t) {
  return tr().useMemo(e, t);
};
W.useReducer = function (e, t, r) {
  return tr().useReducer(e, t, r);
};
W.useRef = function (e) {
  return tr().useRef(e);
};
W.useState = function (e) {
  return tr().useState(e);
};
W.version = "17.0.2";
C.exports = W;
var Qr = C.exports,
  nd = Og({ __proto__: null, default: Qr }, [C.exports]),
  hy = { exports: {} },
  dt = {},
  jm = { exports: {} },
  Dm = {};
/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  var t, r, n, o;
  if (typeof performance == "object" && typeof performance.now == "function") {
    var a = performance;
    e.unstable_now = function () {
      return a.now();
    };
  } else {
    var i = Date,
      l = i.now();
    e.unstable_now = function () {
      return i.now() - l;
    };
  }
  if (typeof window == "undefined" || typeof MessageChannel != "function") {
    var s = null,
      u = null,
      p = function () {
        if (s !== null)
          try {
            var z = e.unstable_now();
            s(!0, z), (s = null);
          } catch (F) {
            throw (setTimeout(p, 0), F);
          }
      };
    (t = function (z) {
      s !== null ? setTimeout(t, 0, z) : ((s = z), setTimeout(p, 0));
    }),
      (r = function (z, F) {
        u = setTimeout(z, F);
      }),
      (n = function () {
        clearTimeout(u);
      }),
      (e.unstable_shouldYield = function () {
        return !1;
      }),
      (o = e.unstable_forceFrameRate = function () {});
  } else {
    var g = window.setTimeout,
      v = window.clearTimeout;
    if (typeof console != "undefined") {
      var m = window.cancelAnimationFrame;
      typeof window.requestAnimationFrame != "function" &&
        console.error(
          "This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
        ),
        typeof m != "function" &&
          console.error(
            "This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
          );
    }
    var y = !1,
      w = null,
      h = -1,
      c = 5,
      d = 0;
    (e.unstable_shouldYield = function () {
      return e.unstable_now() >= d;
    }),
      (o = function () {}),
      (e.unstable_forceFrameRate = function (z) {
        0 > z || 125 < z
          ? console.error(
              "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
            )
          : (c = 0 < z ? Math.floor(1e3 / z) : 5);
      });
    var x = new MessageChannel(),
      k = x.port2;
    (x.port1.onmessage = function () {
      if (w !== null) {
        var z = e.unstable_now();
        d = z + c;
        try {
          w(!0, z) ? k.postMessage(null) : ((y = !1), (w = null));
        } catch (F) {
          throw (k.postMessage(null), F);
        }
      } else y = !1;
    }),
      (t = function (z) {
        (w = z), y || ((y = !0), k.postMessage(null));
      }),
      (r = function (z, F) {
        h = g(function () {
          z(e.unstable_now());
        }, F);
      }),
      (n = function () {
        v(h), (h = -1);
      });
  }
  function $(z, F) {
    var B = z.length;
    z.push(F);
    e: for (;;) {
      var re = (B - 1) >>> 1,
        pe = z[re];
      if (pe !== void 0 && 0 < O(pe, F)) (z[re] = F), (z[B] = pe), (B = re);
      else break e;
    }
  }
  function T(z) {
    return (z = z[0]), z === void 0 ? null : z;
  }
  function P(z) {
    var F = z[0];
    if (F !== void 0) {
      var B = z.pop();
      if (B !== F) {
        z[0] = B;
        e: for (var re = 0, pe = z.length; re < pe; ) {
          var He = 2 * (re + 1) - 1,
            Et = z[He],
            pt = He + 1,
            Dt = z[pt];
          if (Et !== void 0 && 0 > O(Et, B))
            Dt !== void 0 && 0 > O(Dt, Et)
              ? ((z[re] = Dt), (z[pt] = B), (re = pt))
              : ((z[re] = Et), (z[He] = B), (re = He));
          else if (Dt !== void 0 && 0 > O(Dt, B))
            (z[re] = Dt), (z[pt] = B), (re = pt);
          else break e;
        }
      }
      return F;
    }
    return null;
  }
  function O(z, F) {
    var B = z.sortIndex - F.sortIndex;
    return B !== 0 ? B : z.id - F.id;
  }
  var A = [],
    L = [],
    ve = 1,
    G = null,
    Q = 3,
    Je = !1,
    Me = !1,
    jt = !1;
  function Kn(z) {
    for (var F = T(L); F !== null; ) {
      if (F.callback === null) P(L);
      else if (F.startTime <= z)
        P(L), (F.sortIndex = F.expirationTime), $(A, F);
      else break;
      F = T(L);
    }
  }
  function Zn(z) {
    if (((jt = !1), Kn(z), !Me))
      if (T(A) !== null) (Me = !0), t(Jn);
      else {
        var F = T(L);
        F !== null && r(Zn, F.startTime - z);
      }
  }
  function Jn(z, F) {
    (Me = !1), jt && ((jt = !1), n()), (Je = !0);
    var B = Q;
    try {
      for (
        Kn(F), G = T(A);
        G !== null &&
        (!(G.expirationTime > F) || (z && !e.unstable_shouldYield()));

      ) {
        var re = G.callback;
        if (typeof re == "function") {
          (G.callback = null), (Q = G.priorityLevel);
          var pe = re(G.expirationTime <= F);
          (F = e.unstable_now()),
            typeof pe == "function" ? (G.callback = pe) : G === T(A) && P(A),
            Kn(F);
        } else P(A);
        G = T(A);
      }
      if (G !== null) var He = !0;
      else {
        var Et = T(L);
        Et !== null && r(Zn, Et.startTime - F), (He = !1);
      }
      return He;
    } finally {
      (G = null), (Q = B), (Je = !1);
    }
  }
  var Wl = o;
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (z) {
      z.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      Me || Je || ((Me = !0), t(Jn));
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return Q;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return T(A);
    }),
    (e.unstable_next = function (z) {
      switch (Q) {
        case 1:
        case 2:
        case 3:
          var F = 3;
          break;
        default:
          F = Q;
      }
      var B = Q;
      Q = F;
      try {
        return z();
      } finally {
        Q = B;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = Wl),
    (e.unstable_runWithPriority = function (z, F) {
      switch (z) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          z = 3;
      }
      var B = Q;
      Q = z;
      try {
        return F();
      } finally {
        Q = B;
      }
    }),
    (e.unstable_scheduleCallback = function (z, F, B) {
      var re = e.unstable_now();
      switch (
        (typeof B == "object" && B !== null
          ? ((B = B.delay), (B = typeof B == "number" && 0 < B ? re + B : re))
          : (B = re),
        z)
      ) {
        case 1:
          var pe = -1;
          break;
        case 2:
          pe = 250;
          break;
        case 5:
          pe = 1073741823;
          break;
        case 4:
          pe = 1e4;
          break;
        default:
          pe = 5e3;
      }
      return (
        (pe = B + pe),
        (z = {
          id: ve++,
          callback: F,
          priorityLevel: z,
          startTime: B,
          expirationTime: pe,
          sortIndex: -1,
        }),
        B > re
          ? ((z.sortIndex = B),
            $(L, z),
            T(A) === null &&
              z === T(L) &&
              (jt ? n() : (jt = !0), r(Zn, B - re)))
          : ((z.sortIndex = pe), $(A, z), Me || Je || ((Me = !0), t(Jn))),
        z
      );
    }),
    (e.unstable_wrapCallback = function (z) {
      var F = Q;
      return function () {
        var B = Q;
        Q = F;
        try {
          return z.apply(this, arguments);
        } finally {
          Q = B;
        }
      };
    });
})(Dm);
jm.exports = Dm;
/** @license React v17.0.2
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var dl = C.exports,
  ie = Cm,
  ye = jm.exports;
function R(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1;
    r < arguments.length;
    r++
  )
    t += "&args[]=" + encodeURIComponent(arguments[r]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
if (!dl) throw Error(R(227));
var Wm = new Set(),
  Uo = {};
function Jr(e, t) {
  Mn(e, t), Mn(e + "Capture", t);
}
function Mn(e, t) {
  for (Uo[e] = t, e = 0; e < t.length; e++) Wm.add(t[e]);
}
var er = !(
    typeof window == "undefined" ||
    typeof window.document == "undefined" ||
    typeof window.document.createElement == "undefined"
  ),
  vy =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  od = Object.prototype.hasOwnProperty,
  ad = {},
  id = {};
function gy(e) {
  return od.call(id, e)
    ? !0
    : od.call(ad, e)
    ? !1
    : vy.test(e)
    ? (id[e] = !0)
    : ((ad[e] = !0), !1);
}
function yy(e, t, r, n) {
  if (r !== null && r.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return n
        ? !1
        : r !== null
        ? !r.acceptsBooleans
        : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function by(e, t, r, n) {
  if (t === null || typeof t == "undefined" || yy(e, t, r, n)) return !0;
  if (n) return !1;
  if (r !== null)
    switch (r.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function Ie(e, t, r, n, o, a, i) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = n),
    (this.attributeNamespace = o),
    (this.mustUseProperty = r),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = a),
    (this.removeEmptyString = i);
}
var Ce = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Ce[e] = new Ie(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Ce[t] = new Ie(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Ce[e] = new Ie(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Ce[e] = new Ie(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Ce[e] = new Ie(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Ce[e] = new Ie(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Ce[e] = new Ie(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Ce[e] = new Ie(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Ce[e] = new Ie(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var sc = /[\-:]([a-z])/g;
function uc(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(sc, uc);
    Ce[t] = new Ie(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(sc, uc);
    Ce[t] = new Ie(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(sc, uc);
  Ce[t] = new Ie(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Ce[e] = new Ie(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Ce.xlinkHref = new Ie(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Ce[e] = new Ie(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function cc(e, t, r, n) {
  var o = Ce.hasOwnProperty(t) ? Ce[t] : null,
    a =
      o !== null
        ? o.type === 0
        : n
        ? !1
        : !(
            !(2 < t.length) ||
            (t[0] !== "o" && t[0] !== "O") ||
            (t[1] !== "n" && t[1] !== "N")
          );
  a ||
    (by(t, r, o, n) && (r = null),
    n || o === null
      ? gy(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r))
      : o.mustUseProperty
      ? (e[o.propertyName] = r === null ? (o.type === 3 ? !1 : "") : r)
      : ((t = o.attributeName),
        (n = o.attributeNamespace),
        r === null
          ? e.removeAttribute(t)
          : ((o = o.type),
            (r = o === 3 || (o === 4 && r === !0) ? "" : "" + r),
            n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r))));
}
var en = dl.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  yo = 60103,
  Br = 60106,
  ir = 60107,
  fc = 60108,
  Eo = 60114,
  dc = 60109,
  pc = 60110,
  pl = 60112,
  _o = 60113,
  Ri = 60120,
  ml = 60115,
  mc = 60116,
  hc = 60121,
  vc = 60128,
  Hm = 60129,
  gc = 60130,
  Qs = 60131;
if (typeof Symbol == "function" && Symbol.for) {
  var ge = Symbol.for;
  (yo = ge("react.element")),
    (Br = ge("react.portal")),
    (ir = ge("react.fragment")),
    (fc = ge("react.strict_mode")),
    (Eo = ge("react.profiler")),
    (dc = ge("react.provider")),
    (pc = ge("react.context")),
    (pl = ge("react.forward_ref")),
    (_o = ge("react.suspense")),
    (Ri = ge("react.suspense_list")),
    (ml = ge("react.memo")),
    (mc = ge("react.lazy")),
    (hc = ge("react.block")),
    ge("react.scope"),
    (vc = ge("react.opaque.id")),
    (Hm = ge("react.debug_trace_mode")),
    (gc = ge("react.offscreen")),
    (Qs = ge("react.legacy_hidden"));
}
var ld = typeof Symbol == "function" && Symbol.iterator;
function oo(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (ld && e[ld]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var is;
function bo(e) {
  if (is === void 0)
    try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      is = (t && t[1]) || "";
    }
  return (
    `
` +
    is +
    e
  );
}
var ls = !1;
function Ba(e, t) {
  if (!e || ls) return "";
  ls = !0;
  var r = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (s) {
          var n = s;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (s) {
          n = s;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (s) {
        n = s;
      }
      e();
    }
  } catch (s) {
    if (s && n && typeof s.stack == "string") {
      for (
        var o = s.stack.split(`
`),
          a = n.stack.split(`
`),
          i = o.length - 1,
          l = a.length - 1;
        1 <= i && 0 <= l && o[i] !== a[l];

      )
        l--;
      for (; 1 <= i && 0 <= l; i--, l--)
        if (o[i] !== a[l]) {
          if (i !== 1 || l !== 1)
            do
              if ((i--, l--, 0 > l || o[i] !== a[l]))
                return (
                  `
` + o[i].replace(" at new ", " at ")
                );
            while (1 <= i && 0 <= l);
          break;
        }
    }
  } finally {
    (ls = !1), (Error.prepareStackTrace = r);
  }
  return (e = e ? e.displayName || e.name : "") ? bo(e) : "";
}
function Sy(e) {
  switch (e.tag) {
    case 5:
      return bo(e.type);
    case 16:
      return bo("Lazy");
    case 13:
      return bo("Suspense");
    case 19:
      return bo("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = Ba(e.type, !1)), e;
    case 11:
      return (e = Ba(e.type.render, !1)), e;
    case 22:
      return (e = Ba(e.type._render, !1)), e;
    case 1:
      return (e = Ba(e.type, !0)), e;
    default:
      return "";
  }
}
function wn(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case ir:
      return "Fragment";
    case Br:
      return "Portal";
    case Eo:
      return "Profiler";
    case fc:
      return "StrictMode";
    case _o:
      return "Suspense";
    case Ri:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case pc:
        return (e.displayName || "Context") + ".Consumer";
      case dc:
        return (e._context.displayName || "Context") + ".Provider";
      case pl:
        var t = e.render;
        return (
          (t = t.displayName || t.name || ""),
          e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")
        );
      case ml:
        return wn(e.type);
      case hc:
        return wn(e._render);
      case mc:
        (t = e._payload), (e = e._init);
        try {
          return wn(e(t));
        } catch {}
    }
  return null;
}
function wr(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "object":
    case "string":
    case "undefined":
      return e;
    default:
      return "";
  }
}
function Vm(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function xy(e) {
  var t = Vm(e) ? "checked" : "value",
    r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    n = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof r != "undefined" &&
    typeof r.get == "function" &&
    typeof r.set == "function"
  ) {
    var o = r.get,
      a = r.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return o.call(this);
        },
        set: function (i) {
          (n = "" + i), a.call(this, i);
        },
      }),
      Object.defineProperty(e, t, { enumerable: r.enumerable }),
      {
        getValue: function () {
          return n;
        },
        setValue: function (i) {
          n = "" + i;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function Fa(e) {
  e._valueTracker || (e._valueTracker = xy(e));
}
function Um(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var r = t.getValue(),
    n = "";
  return (
    e && (n = Vm(e) ? (e.checked ? "true" : "false") : e.value),
    (e = n),
    e !== r ? (t.setValue(e), !0) : !1
  );
}
function Ai(e) {
  if (
    ((e = e || (typeof document != "undefined" ? document : void 0)),
    typeof e == "undefined")
  )
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function qs(e, t) {
  var r = t.checked;
  return ie({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: r != null ? r : e._wrapperState.initialChecked,
  });
}
function sd(e, t) {
  var r = t.defaultValue == null ? "" : t.defaultValue,
    n = t.checked != null ? t.checked : t.defaultChecked;
  (r = wr(t.value != null ? t.value : r)),
    (e._wrapperState = {
      initialChecked: n,
      initialValue: r,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function Gm(e, t) {
  (t = t.checked), t != null && cc(e, "checked", t, !1);
}
function Ks(e, t) {
  Gm(e, t);
  var r = wr(t.value),
    n = t.type;
  if (r != null)
    n === "number"
      ? ((r === 0 && e.value === "") || e.value != r) && (e.value = "" + r)
      : e.value !== "" + r && (e.value = "" + r);
  else if (n === "submit" || n === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? Zs(e, t.type, r)
    : t.hasOwnProperty("defaultValue") && Zs(e, t.type, wr(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function ud(e, t, r) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var n = t.type;
    if (
      !(
        (n !== "submit" && n !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    (t = "" + e._wrapperState.initialValue),
      r || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (r = e.name),
    r !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    r !== "" && (e.name = r);
}
function Zs(e, t, r) {
  (t !== "number" || Ai(e.ownerDocument) !== e) &&
    (r == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
}
function wy(e) {
  var t = "";
  return (
    dl.Children.forEach(e, function (r) {
      r != null && (t += r);
    }),
    t
  );
}
function Js(e, t) {
  return (
    (e = ie({ children: void 0 }, t)),
    (t = wy(t.children)) && (e.children = t),
    e
  );
}
function kn(e, t, r, n) {
  if (((e = e.options), t)) {
    t = {};
    for (var o = 0; o < r.length; o++) t["$" + r[o]] = !0;
    for (r = 0; r < e.length; r++)
      (o = t.hasOwnProperty("$" + e[r].value)),
        e[r].selected !== o && (e[r].selected = o),
        o && n && (e[r].defaultSelected = !0);
  } else {
    for (r = "" + wr(r), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === r) {
        (e[o].selected = !0), n && (e[o].defaultSelected = !0);
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function eu(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(R(91));
  return ie({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function cd(e, t) {
  var r = t.value;
  if (r == null) {
    if (((r = t.children), (t = t.defaultValue), r != null)) {
      if (t != null) throw Error(R(92));
      if (Array.isArray(r)) {
        if (!(1 >= r.length)) throw Error(R(93));
        r = r[0];
      }
      t = r;
    }
    t == null && (t = ""), (r = t);
  }
  e._wrapperState = { initialValue: wr(r) };
}
function Ym(e, t) {
  var r = wr(t.value),
    n = wr(t.defaultValue);
  r != null &&
    ((r = "" + r),
    r !== e.value && (e.value = r),
    t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)),
    n != null && (e.defaultValue = "" + n);
}
function fd(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
var tu = {
  html: "http://www.w3.org/1999/xhtml",
  mathml: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg",
};
function Xm(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function ru(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Xm(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : e;
}
var Na,
  Qm = (function (e) {
    return typeof MSApp != "undefined" && MSApp.execUnsafeLocalFunction
      ? function (t, r, n, o) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, r, n, o);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== tu.svg || "innerHTML" in e) e.innerHTML = t;
    else {
      for (
        Na = Na || document.createElement("div"),
          Na.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Na.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Go(e, t) {
  if (t) {
    var r = e.firstChild;
    if (r && r === e.lastChild && r.nodeType === 3) {
      r.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Co = {
    animationIterationCount: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  ky = ["Webkit", "ms", "Moz", "O"];
Object.keys(Co).forEach(function (e) {
  ky.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Co[t] = Co[e]);
  });
});
function qm(e, t, r) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : r || typeof t != "number" || t === 0 || (Co.hasOwnProperty(e) && Co[e])
    ? ("" + t).trim()
    : t + "px";
}
function Km(e, t) {
  e = e.style;
  for (var r in t)
    if (t.hasOwnProperty(r)) {
      var n = r.indexOf("--") === 0,
        o = qm(r, t[r], n);
      r === "float" && (r = "cssFloat"), n ? e.setProperty(r, o) : (e[r] = o);
    }
}
var Ey = ie(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function nu(e, t) {
  if (t) {
    if (Ey[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(R(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(R(60));
      if (
        !(
          typeof t.dangerouslySetInnerHTML == "object" &&
          "__html" in t.dangerouslySetInnerHTML
        )
      )
        throw Error(R(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(R(62));
  }
}
function ou(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
function yc(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var au = null,
  En = null,
  _n = null;
function dd(e) {
  if ((e = ha(e))) {
    if (typeof au != "function") throw Error(R(280));
    var t = e.stateNode;
    t && ((t = Sl(t)), au(e.stateNode, e.type, t));
  }
}
function Zm(e) {
  En ? (_n ? _n.push(e) : (_n = [e])) : (En = e);
}
function Jm() {
  if (En) {
    var e = En,
      t = _n;
    if (((_n = En = null), dd(e), t)) for (e = 0; e < t.length; e++) dd(t[e]);
  }
}
function bc(e, t) {
  return e(t);
}
function eh(e, t, r, n, o) {
  return e(t, r, n, o);
}
function Sc() {}
var th = bc,
  Fr = !1,
  ss = !1;
function xc() {
  (En !== null || _n !== null) && (Sc(), Jm());
}
function _y(e, t, r) {
  if (ss) return e(t, r);
  ss = !0;
  try {
    return th(e, t, r);
  } finally {
    (ss = !1), xc();
  }
}
function Yo(e, t) {
  var r = e.stateNode;
  if (r === null) return null;
  var n = Sl(r);
  if (n === null) return null;
  r = n[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (n = !n.disabled) ||
        ((e = e.type),
        (n = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !n);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (r && typeof r != "function") throw Error(R(231, t, typeof r));
  return r;
}
var iu = !1;
if (er)
  try {
    var ao = {};
    Object.defineProperty(ao, "passive", {
      get: function () {
        iu = !0;
      },
    }),
      window.addEventListener("test", ao, ao),
      window.removeEventListener("test", ao, ao);
  } catch {
    iu = !1;
  }
function Cy(e, t, r, n, o, a, i, l, s) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(r, u);
  } catch (p) {
    this.onError(p);
  }
}
var To = !1,
  zi = null,
  Ii = !1,
  lu = null,
  Ty = {
    onError: function (e) {
      (To = !0), (zi = e);
    },
  };
function Py(e, t, r, n, o, a, i, l, s) {
  (To = !1), (zi = null), Cy.apply(Ty, arguments);
}
function $y(e, t, r, n, o, a, i, l, s) {
  if ((Py.apply(this, arguments), To)) {
    if (To) {
      var u = zi;
      (To = !1), (zi = null);
    } else throw Error(R(198));
    Ii || ((Ii = !0), (lu = u));
  }
}
function tn(e) {
  var t = e,
    r = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), (t.flags & 1026) !== 0 && (r = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? r : null;
}
function rh(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function pd(e) {
  if (tn(e) !== e) throw Error(R(188));
}
function Ry(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = tn(e)), t === null)) throw Error(R(188));
    return t !== e ? null : e;
  }
  for (var r = e, n = t; ; ) {
    var o = r.return;
    if (o === null) break;
    var a = o.alternate;
    if (a === null) {
      if (((n = o.return), n !== null)) {
        r = n;
        continue;
      }
      break;
    }
    if (o.child === a.child) {
      for (a = o.child; a; ) {
        if (a === r) return pd(o), e;
        if (a === n) return pd(o), t;
        a = a.sibling;
      }
      throw Error(R(188));
    }
    if (r.return !== n.return) (r = o), (n = a);
    else {
      for (var i = !1, l = o.child; l; ) {
        if (l === r) {
          (i = !0), (r = o), (n = a);
          break;
        }
        if (l === n) {
          (i = !0), (n = o), (r = a);
          break;
        }
        l = l.sibling;
      }
      if (!i) {
        for (l = a.child; l; ) {
          if (l === r) {
            (i = !0), (r = a), (n = o);
            break;
          }
          if (l === n) {
            (i = !0), (n = a), (r = o);
            break;
          }
          l = l.sibling;
        }
        if (!i) throw Error(R(189));
      }
    }
    if (r.alternate !== n) throw Error(R(190));
  }
  if (r.tag !== 3) throw Error(R(188));
  return r.stateNode.current === r ? e : t;
}
function nh(e) {
  if (((e = Ry(e)), !e)) return null;
  for (var t = e; ; ) {
    if (t.tag === 5 || t.tag === 6) return t;
    if (t.child) (t.child.return = t), (t = t.child);
    else {
      if (t === e) break;
      for (; !t.sibling; ) {
        if (!t.return || t.return === e) return null;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return null;
}
function md(e, t) {
  for (var r = e.alternate; t !== null; ) {
    if (t === e || t === r) return !0;
    t = t.return;
  }
  return !1;
}
var oh,
  wc,
  ah,
  ih,
  su = !1,
  $t = [],
  dr = null,
  pr = null,
  mr = null,
  Xo = new Map(),
  Qo = new Map(),
  io = [],
  hd =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " "
    );
function uu(e, t, r, n, o) {
  return {
    blockedOn: e,
    domEventName: t,
    eventSystemFlags: r | 16,
    nativeEvent: o,
    targetContainers: [n],
  };
}
function vd(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      dr = null;
      break;
    case "dragenter":
    case "dragleave":
      pr = null;
      break;
    case "mouseover":
    case "mouseout":
      mr = null;
      break;
    case "pointerover":
    case "pointerout":
      Xo.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Qo.delete(t.pointerId);
  }
}
function lo(e, t, r, n, o, a) {
  return e === null || e.nativeEvent !== a
    ? ((e = uu(t, r, n, o, a)),
      t !== null && ((t = ha(t)), t !== null && wc(t)),
      e)
    : ((e.eventSystemFlags |= n),
      (t = e.targetContainers),
      o !== null && t.indexOf(o) === -1 && t.push(o),
      e);
}
function Ay(e, t, r, n, o) {
  switch (t) {
    case "focusin":
      return (dr = lo(dr, e, t, r, n, o)), !0;
    case "dragenter":
      return (pr = lo(pr, e, t, r, n, o)), !0;
    case "mouseover":
      return (mr = lo(mr, e, t, r, n, o)), !0;
    case "pointerover":
      var a = o.pointerId;
      return Xo.set(a, lo(Xo.get(a) || null, e, t, r, n, o)), !0;
    case "gotpointercapture":
      return (
        (a = o.pointerId), Qo.set(a, lo(Qo.get(a) || null, e, t, r, n, o)), !0
      );
  }
  return !1;
}
function zy(e) {
  var t = Nr(e.target);
  if (t !== null) {
    var r = tn(t);
    if (r !== null) {
      if (((t = r.tag), t === 13)) {
        if (((t = rh(r)), t !== null)) {
          (e.blockedOn = t),
            ih(e.lanePriority, function () {
              ye.unstable_runWithPriority(e.priority, function () {
                ah(r);
              });
            });
          return;
        }
      } else if (t === 3 && r.stateNode.hydrate) {
        e.blockedOn = r.tag === 3 ? r.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function di(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var r = Cc(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (r !== null)
      return (t = ha(r)), t !== null && wc(t), (e.blockedOn = r), !1;
    t.shift();
  }
  return !0;
}
function gd(e, t, r) {
  di(e) && r.delete(t);
}
function Iy() {
  for (su = !1; 0 < $t.length; ) {
    var e = $t[0];
    if (e.blockedOn !== null) {
      (e = ha(e.blockedOn)), e !== null && oh(e);
      break;
    }
    for (var t = e.targetContainers; 0 < t.length; ) {
      var r = Cc(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (r !== null) {
        e.blockedOn = r;
        break;
      }
      t.shift();
    }
    e.blockedOn === null && $t.shift();
  }
  dr !== null && di(dr) && (dr = null),
    pr !== null && di(pr) && (pr = null),
    mr !== null && di(mr) && (mr = null),
    Xo.forEach(gd),
    Qo.forEach(gd);
}
function so(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    su ||
      ((su = !0),
      ye.unstable_scheduleCallback(ye.unstable_NormalPriority, Iy)));
}
function lh(e) {
  function t(o) {
    return so(o, e);
  }
  if (0 < $t.length) {
    so($t[0], e);
    for (var r = 1; r < $t.length; r++) {
      var n = $t[r];
      n.blockedOn === e && (n.blockedOn = null);
    }
  }
  for (
    dr !== null && so(dr, e),
      pr !== null && so(pr, e),
      mr !== null && so(mr, e),
      Xo.forEach(t),
      Qo.forEach(t),
      r = 0;
    r < io.length;
    r++
  )
    (n = io[r]), n.blockedOn === e && (n.blockedOn = null);
  for (; 0 < io.length && ((r = io[0]), r.blockedOn === null); )
    zy(r), r.blockedOn === null && io.shift();
}
function La(e, t) {
  var r = {};
  return (
    (r[e.toLowerCase()] = t.toLowerCase()),
    (r["Webkit" + e] = "webkit" + t),
    (r["Moz" + e] = "moz" + t),
    r
  );
}
var mn = {
    animationend: La("Animation", "AnimationEnd"),
    animationiteration: La("Animation", "AnimationIteration"),
    animationstart: La("Animation", "AnimationStart"),
    transitionend: La("Transition", "TransitionEnd"),
  },
  us = {},
  sh = {};
er &&
  ((sh = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete mn.animationend.animation,
    delete mn.animationiteration.animation,
    delete mn.animationstart.animation),
  "TransitionEvent" in window || delete mn.transitionend.transition);
function hl(e) {
  if (us[e]) return us[e];
  if (!mn[e]) return e;
  var t = mn[e],
    r;
  for (r in t) if (t.hasOwnProperty(r) && r in sh) return (us[e] = t[r]);
  return e;
}
var uh = hl("animationend"),
  ch = hl("animationiteration"),
  fh = hl("animationstart"),
  dh = hl("transitionend"),
  ph = new Map(),
  kc = new Map(),
  My = [
    "abort",
    "abort",
    uh,
    "animationEnd",
    ch,
    "animationIteration",
    fh,
    "animationStart",
    "canplay",
    "canPlay",
    "canplaythrough",
    "canPlayThrough",
    "durationchange",
    "durationChange",
    "emptied",
    "emptied",
    "encrypted",
    "encrypted",
    "ended",
    "ended",
    "error",
    "error",
    "gotpointercapture",
    "gotPointerCapture",
    "load",
    "load",
    "loadeddata",
    "loadedData",
    "loadedmetadata",
    "loadedMetadata",
    "loadstart",
    "loadStart",
    "lostpointercapture",
    "lostPointerCapture",
    "playing",
    "playing",
    "progress",
    "progress",
    "seeking",
    "seeking",
    "stalled",
    "stalled",
    "suspend",
    "suspend",
    "timeupdate",
    "timeUpdate",
    dh,
    "transitionEnd",
    "waiting",
    "waiting",
  ];
function Ec(e, t) {
  for (var r = 0; r < e.length; r += 2) {
    var n = e[r],
      o = e[r + 1];
    (o = "on" + (o[0].toUpperCase() + o.slice(1))),
      kc.set(n, t),
      ph.set(n, o),
      Jr(o, [n]);
  }
}
var Oy = ye.unstable_now;
Oy();
var Z = 8;
function un(e) {
  if ((1 & e) !== 0) return (Z = 15), 1;
  if ((2 & e) !== 0) return (Z = 14), 2;
  if ((4 & e) !== 0) return (Z = 13), 4;
  var t = 24 & e;
  return t !== 0
    ? ((Z = 12), t)
    : (e & 32) !== 0
    ? ((Z = 11), 32)
    : ((t = 192 & e),
      t !== 0
        ? ((Z = 10), t)
        : (e & 256) !== 0
        ? ((Z = 9), 256)
        : ((t = 3584 & e),
          t !== 0
            ? ((Z = 8), t)
            : (e & 4096) !== 0
            ? ((Z = 7), 4096)
            : ((t = 4186112 & e),
              t !== 0
                ? ((Z = 6), t)
                : ((t = 62914560 & e),
                  t !== 0
                    ? ((Z = 5), t)
                    : e & 67108864
                    ? ((Z = 4), 67108864)
                    : (e & 134217728) !== 0
                    ? ((Z = 3), 134217728)
                    : ((t = 805306368 & e),
                      t !== 0
                        ? ((Z = 2), t)
                        : (1073741824 & e) !== 0
                        ? ((Z = 1), 1073741824)
                        : ((Z = 8), e))))));
}
function By(e) {
  switch (e) {
    case 99:
      return 15;
    case 98:
      return 10;
    case 97:
    case 96:
      return 8;
    case 95:
      return 2;
    default:
      return 0;
  }
}
function Fy(e) {
  switch (e) {
    case 15:
    case 14:
      return 99;
    case 13:
    case 12:
    case 11:
    case 10:
      return 98;
    case 9:
    case 8:
    case 7:
    case 6:
    case 4:
    case 5:
      return 97;
    case 3:
    case 2:
    case 1:
      return 95;
    case 0:
      return 90;
    default:
      throw Error(R(358, e));
  }
}
function qo(e, t) {
  var r = e.pendingLanes;
  if (r === 0) return (Z = 0);
  var n = 0,
    o = 0,
    a = e.expiredLanes,
    i = e.suspendedLanes,
    l = e.pingedLanes;
  if (a !== 0) (n = a), (o = Z = 15);
  else if (((a = r & 134217727), a !== 0)) {
    var s = a & ~i;
    s !== 0
      ? ((n = un(s)), (o = Z))
      : ((l &= a), l !== 0 && ((n = un(l)), (o = Z)));
  } else
    (a = r & ~i),
      a !== 0 ? ((n = un(a)), (o = Z)) : l !== 0 && ((n = un(l)), (o = Z));
  if (n === 0) return 0;
  if (
    ((n = 31 - kr(n)),
    (n = r & (((0 > n ? 0 : 1 << n) << 1) - 1)),
    t !== 0 && t !== n && (t & i) === 0)
  ) {
    if ((un(t), o <= Z)) return t;
    Z = o;
  }
  if (((t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= n; 0 < t; )
      (r = 31 - kr(t)), (o = 1 << r), (n |= e[r]), (t &= ~o);
  return n;
}
function mh(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function Mi(e, t) {
  switch (e) {
    case 15:
      return 1;
    case 14:
      return 2;
    case 12:
      return (e = cn(24 & ~t)), e === 0 ? Mi(10, t) : e;
    case 10:
      return (e = cn(192 & ~t)), e === 0 ? Mi(8, t) : e;
    case 8:
      return (
        (e = cn(3584 & ~t)),
        e === 0 && ((e = cn(4186112 & ~t)), e === 0 && (e = 512)),
        e
      );
    case 2:
      return (t = cn(805306368 & ~t)), t === 0 && (t = 268435456), t;
  }
  throw Error(R(358, e));
}
function cn(e) {
  return e & -e;
}
function cs(e) {
  for (var t = [], r = 0; 31 > r; r++) t.push(e);
  return t;
}
function vl(e, t, r) {
  e.pendingLanes |= t;
  var n = t - 1;
  (e.suspendedLanes &= n),
    (e.pingedLanes &= n),
    (e = e.eventTimes),
    (t = 31 - kr(t)),
    (e[t] = r);
}
var kr = Math.clz32 ? Math.clz32 : jy,
  Ny = Math.log,
  Ly = Math.LN2;
function jy(e) {
  return e === 0 ? 32 : (31 - ((Ny(e) / Ly) | 0)) | 0;
}
var Dy = ye.unstable_UserBlockingPriority,
  Wy = ye.unstable_runWithPriority,
  pi = !0;
function Hy(e, t, r, n) {
  Fr || Sc();
  var o = _c,
    a = Fr;
  Fr = !0;
  try {
    eh(o, e, t, r, n);
  } finally {
    (Fr = a) || xc();
  }
}
function Vy(e, t, r, n) {
  Wy(Dy, _c.bind(null, e, t, r, n));
}
function _c(e, t, r, n) {
  if (pi) {
    var o;
    if ((o = (t & 4) === 0) && 0 < $t.length && -1 < hd.indexOf(e))
      (e = uu(null, e, t, r, n)), $t.push(e);
    else {
      var a = Cc(e, t, r, n);
      if (a === null) o && vd(e, n);
      else {
        if (o) {
          if (-1 < hd.indexOf(e)) {
            (e = uu(a, e, t, r, n)), $t.push(e);
            return;
          }
          if (Ay(a, e, t, r, n)) return;
          vd(e, n);
        }
        Th(e, t, n, null, r);
      }
    }
  }
}
function Cc(e, t, r, n) {
  var o = yc(n);
  if (((o = Nr(o)), o !== null)) {
    var a = tn(o);
    if (a === null) o = null;
    else {
      var i = a.tag;
      if (i === 13) {
        if (((o = rh(a)), o !== null)) return o;
        o = null;
      } else if (i === 3) {
        if (a.stateNode.hydrate)
          return a.tag === 3 ? a.stateNode.containerInfo : null;
        o = null;
      } else a !== o && (o = null);
    }
  }
  return Th(e, t, n, o, r), null;
}
var lr = null,
  Tc = null,
  mi = null;
function hh() {
  if (mi) return mi;
  var e,
    t = Tc,
    r = t.length,
    n,
    o = "value" in lr ? lr.value : lr.textContent,
    a = o.length;
  for (e = 0; e < r && t[e] === o[e]; e++);
  var i = r - e;
  for (n = 1; n <= i && t[r - n] === o[a - n]; n++);
  return (mi = o.slice(e, 1 < n ? 1 - n : void 0));
}
function hi(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function ja() {
  return !0;
}
function yd() {
  return !1;
}
function qe(e) {
  function t(r, n, o, a, i) {
    (this._reactName = r),
      (this._targetInst = o),
      (this.type = n),
      (this.nativeEvent = a),
      (this.target = i),
      (this.currentTarget = null);
    for (var l in e)
      e.hasOwnProperty(l) && ((r = e[l]), (this[l] = r ? r(a) : a[l]));
    return (
      (this.isDefaultPrevented = (
        a.defaultPrevented != null ? a.defaultPrevented : a.returnValue === !1
      )
        ? ja
        : yd),
      (this.isPropagationStopped = yd),
      this
    );
  }
  return (
    ie(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var r = this.nativeEvent;
        r &&
          (r.preventDefault
            ? r.preventDefault()
            : typeof r.returnValue != "unknown" && (r.returnValue = !1),
          (this.isDefaultPrevented = ja));
      },
      stopPropagation: function () {
        var r = this.nativeEvent;
        r &&
          (r.stopPropagation
            ? r.stopPropagation()
            : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0),
          (this.isPropagationStopped = ja));
      },
      persist: function () {},
      isPersistent: ja,
    }),
    t
  );
}
var Wn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Pc = qe(Wn),
  ma = ie({}, Wn, { view: 0, detail: 0 }),
  Uy = qe(ma),
  fs,
  ds,
  uo,
  gl = ie({}, ma, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: $c,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== uo &&
            (uo && e.type === "mousemove"
              ? ((fs = e.screenX - uo.screenX), (ds = e.screenY - uo.screenY))
              : (ds = fs = 0),
            (uo = e)),
          fs);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ds;
    },
  }),
  bd = qe(gl),
  Gy = ie({}, gl, { dataTransfer: 0 }),
  Yy = qe(Gy),
  Xy = ie({}, ma, { relatedTarget: 0 }),
  ps = qe(Xy),
  Qy = ie({}, Wn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  qy = qe(Qy),
  Ky = ie({}, Wn, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Zy = qe(Ky),
  Jy = ie({}, Wn, { data: 0 }),
  Sd = qe(Jy),
  e1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  t1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  r1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function n1(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = r1[e]) ? !!t[e] : !1;
}
function $c() {
  return n1;
}
var o1 = ie({}, ma, {
    key: function (e) {
      if (e.key) {
        var t = e1[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = hi(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
        ? t1[e.keyCode] || "Unidentified"
        : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: $c,
    charCode: function (e) {
      return e.type === "keypress" ? hi(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? hi(e)
        : e.type === "keydown" || e.type === "keyup"
        ? e.keyCode
        : 0;
    },
  }),
  a1 = qe(o1),
  i1 = ie({}, gl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  xd = qe(i1),
  l1 = ie({}, ma, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: $c,
  }),
  s1 = qe(l1),
  u1 = ie({}, Wn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  c1 = qe(u1),
  f1 = ie({}, gl, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
        ? -e.wheelDeltaY
        : "wheelDelta" in e
        ? -e.wheelDelta
        : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  d1 = qe(f1),
  p1 = [9, 13, 27, 32],
  Rc = er && "CompositionEvent" in window,
  Po = null;
er && "documentMode" in document && (Po = document.documentMode);
var m1 = er && "TextEvent" in window && !Po,
  vh = er && (!Rc || (Po && 8 < Po && 11 >= Po)),
  wd = String.fromCharCode(32),
  kd = !1;
function gh(e, t) {
  switch (e) {
    case "keyup":
      return p1.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function yh(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var hn = !1;
function h1(e, t) {
  switch (e) {
    case "compositionend":
      return yh(t);
    case "keypress":
      return t.which !== 32 ? null : ((kd = !0), wd);
    case "textInput":
      return (e = t.data), e === wd && kd ? null : e;
    default:
      return null;
  }
}
function v1(e, t) {
  if (hn)
    return e === "compositionend" || (!Rc && gh(e, t))
      ? ((e = hh()), (mi = Tc = lr = null), (hn = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return vh && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var g1 = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Ed(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!g1[e.type] : t === "textarea";
}
function bh(e, t, r, n) {
  Zm(n),
    (t = Oi(t, "onChange")),
    0 < t.length &&
      ((r = new Pc("onChange", "change", null, r, n)),
      e.push({ event: r, listeners: t }));
}
var $o = null,
  Ko = null;
function y1(e) {
  Eh(e, 0);
}
function yl(e) {
  var t = gn(e);
  if (Um(t)) return e;
}
function b1(e, t) {
  if (e === "change") return t;
}
var Sh = !1;
if (er) {
  var ms;
  if (er) {
    var hs = "oninput" in document;
    if (!hs) {
      var _d = document.createElement("div");
      _d.setAttribute("oninput", "return;"),
        (hs = typeof _d.oninput == "function");
    }
    ms = hs;
  } else ms = !1;
  Sh = ms && (!document.documentMode || 9 < document.documentMode);
}
function Cd() {
  $o && ($o.detachEvent("onpropertychange", xh), (Ko = $o = null));
}
function xh(e) {
  if (e.propertyName === "value" && yl(Ko)) {
    var t = [];
    if ((bh(t, Ko, e, yc(e)), (e = y1), Fr)) e(t);
    else {
      Fr = !0;
      try {
        bc(e, t);
      } finally {
        (Fr = !1), xc();
      }
    }
  }
}
function S1(e, t, r) {
  e === "focusin"
    ? (Cd(), ($o = t), (Ko = r), $o.attachEvent("onpropertychange", xh))
    : e === "focusout" && Cd();
}
function x1(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return yl(Ko);
}
function w1(e, t) {
  if (e === "click") return yl(t);
}
function k1(e, t) {
  if (e === "input" || e === "change") return yl(t);
}
function E1(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var rt = typeof Object.is == "function" ? Object.is : E1,
  _1 = Object.prototype.hasOwnProperty;
function Zo(e, t) {
  if (rt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var r = Object.keys(e),
    n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (n = 0; n < r.length; n++)
    if (!_1.call(t, r[n]) || !rt(e[r[n]], t[r[n]])) return !1;
  return !0;
}
function Td(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Pd(e, t) {
  var r = Td(e);
  e = 0;
  for (var n; r; ) {
    if (r.nodeType === 3) {
      if (((n = e + r.textContent.length), e <= t && n >= t))
        return { node: r, offset: t - e };
      e = n;
    }
    e: {
      for (; r; ) {
        if (r.nextSibling) {
          r = r.nextSibling;
          break e;
        }
        r = r.parentNode;
      }
      r = void 0;
    }
    r = Td(r);
  }
}
function wh(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
      ? !1
      : t && t.nodeType === 3
      ? wh(e, t.parentNode)
      : "contains" in e
      ? e.contains(t)
      : e.compareDocumentPosition
      ? !!(e.compareDocumentPosition(t) & 16)
      : !1
    : !1;
}
function $d() {
  for (var e = window, t = Ai(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var r = typeof t.contentWindow.location.href == "string";
    } catch {
      r = !1;
    }
    if (r) e = t.contentWindow;
    else break;
    t = Ai(e.document);
  }
  return t;
}
function cu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
var C1 = er && "documentMode" in document && 11 >= document.documentMode,
  vn = null,
  fu = null,
  Ro = null,
  du = !1;
function Rd(e, t, r) {
  var n = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
  du ||
    vn == null ||
    vn !== Ai(n) ||
    ((n = vn),
    "selectionStart" in n && cu(n)
      ? (n = { start: n.selectionStart, end: n.selectionEnd })
      : ((n = (
          (n.ownerDocument && n.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (n = {
          anchorNode: n.anchorNode,
          anchorOffset: n.anchorOffset,
          focusNode: n.focusNode,
          focusOffset: n.focusOffset,
        })),
    (Ro && Zo(Ro, n)) ||
      ((Ro = n),
      (n = Oi(fu, "onSelect")),
      0 < n.length &&
        ((t = new Pc("onSelect", "select", null, t, r)),
        e.push({ event: t, listeners: n }),
        (t.target = vn))));
}
Ec(
  "cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(
    " "
  ),
  0
);
Ec(
  "drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(
    " "
  ),
  1
);
Ec(My, 2);
for (
  var Ad =
      "change selectionchange textInput compositionstart compositionend compositionupdate".split(
        " "
      ),
    vs = 0;
  vs < Ad.length;
  vs++
)
  kc.set(Ad[vs], 0);
Mn("onMouseEnter", ["mouseout", "mouseover"]);
Mn("onMouseLeave", ["mouseout", "mouseover"]);
Mn("onPointerEnter", ["pointerout", "pointerover"]);
Mn("onPointerLeave", ["pointerout", "pointerover"]);
Jr(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
Jr(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
Jr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Jr(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
Jr(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
Jr(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var So =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ),
  kh = new Set("cancel close invalid load scroll toggle".split(" ").concat(So));
function zd(e, t, r) {
  var n = e.type || "unknown-event";
  (e.currentTarget = r), $y(n, t, void 0, e), (e.currentTarget = null);
}
function Eh(e, t) {
  t = (t & 4) !== 0;
  for (var r = 0; r < e.length; r++) {
    var n = e[r],
      o = n.event;
    n = n.listeners;
    e: {
      var a = void 0;
      if (t)
        for (var i = n.length - 1; 0 <= i; i--) {
          var l = n[i],
            s = l.instance,
            u = l.currentTarget;
          if (((l = l.listener), s !== a && o.isPropagationStopped())) break e;
          zd(o, l, u), (a = s);
        }
      else
        for (i = 0; i < n.length; i++) {
          if (
            ((l = n[i]),
            (s = l.instance),
            (u = l.currentTarget),
            (l = l.listener),
            s !== a && o.isPropagationStopped())
          )
            break e;
          zd(o, l, u), (a = s);
        }
    }
  }
  if (Ii) throw ((e = lu), (Ii = !1), (lu = null), e);
}
function J(e, t) {
  var r = $h(t),
    n = e + "__bubble";
  r.has(n) || (Ch(t, e, 2, !1), r.add(n));
}
var Id = "_reactListening" + Math.random().toString(36).slice(2);
function _h(e) {
  e[Id] ||
    ((e[Id] = !0),
    Wm.forEach(function (t) {
      kh.has(t) || Md(t, !1, e, null), Md(t, !0, e, null);
    }));
}
function Md(e, t, r, n) {
  var o = 4 < arguments.length && arguments[4] !== void 0 ? arguments[4] : 0,
    a = r;
  if (
    (e === "selectionchange" && r.nodeType !== 9 && (a = r.ownerDocument),
    n !== null && !t && kh.has(e))
  ) {
    if (e !== "scroll") return;
    (o |= 2), (a = n);
  }
  var i = $h(a),
    l = e + "__" + (t ? "capture" : "bubble");
  i.has(l) || (t && (o |= 4), Ch(a, e, o, t), i.add(l));
}
function Ch(e, t, r, n) {
  var o = kc.get(t);
  switch (o === void 0 ? 2 : o) {
    case 0:
      o = Hy;
      break;
    case 1:
      o = Vy;
      break;
    default:
      o = _c;
  }
  (r = o.bind(null, t, r, e)),
    (o = void 0),
    !iu ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (o = !0),
    n
      ? o !== void 0
        ? e.addEventListener(t, r, { capture: !0, passive: o })
        : e.addEventListener(t, r, !0)
      : o !== void 0
      ? e.addEventListener(t, r, { passive: o })
      : e.addEventListener(t, r, !1);
}
function Th(e, t, r, n, o) {
  var a = n;
  if ((t & 1) === 0 && (t & 2) === 0 && n !== null)
    e: for (;;) {
      if (n === null) return;
      var i = n.tag;
      if (i === 3 || i === 4) {
        var l = n.stateNode.containerInfo;
        if (l === o || (l.nodeType === 8 && l.parentNode === o)) break;
        if (i === 4)
          for (i = n.return; i !== null; ) {
            var s = i.tag;
            if (
              (s === 3 || s === 4) &&
              ((s = i.stateNode.containerInfo),
              s === o || (s.nodeType === 8 && s.parentNode === o))
            )
              return;
            i = i.return;
          }
        for (; l !== null; ) {
          if (((i = Nr(l)), i === null)) return;
          if (((s = i.tag), s === 5 || s === 6)) {
            n = a = i;
            continue e;
          }
          l = l.parentNode;
        }
      }
      n = n.return;
    }
  _y(function () {
    var u = a,
      p = yc(r),
      g = [];
    e: {
      var v = ph.get(e);
      if (v !== void 0) {
        var m = Pc,
          y = e;
        switch (e) {
          case "keypress":
            if (hi(r) === 0) break e;
          case "keydown":
          case "keyup":
            m = a1;
            break;
          case "focusin":
            (y = "focus"), (m = ps);
            break;
          case "focusout":
            (y = "blur"), (m = ps);
            break;
          case "beforeblur":
          case "afterblur":
            m = ps;
            break;
          case "click":
            if (r.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            m = bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            m = Yy;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            m = s1;
            break;
          case uh:
          case ch:
          case fh:
            m = qy;
            break;
          case dh:
            m = c1;
            break;
          case "scroll":
            m = Uy;
            break;
          case "wheel":
            m = d1;
            break;
          case "copy":
          case "cut":
          case "paste":
            m = Zy;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            m = xd;
        }
        var w = (t & 4) !== 0,
          h = !w && e === "scroll",
          c = w ? (v !== null ? v + "Capture" : null) : v;
        w = [];
        for (var d = u, x; d !== null; ) {
          x = d;
          var k = x.stateNode;
          if (
            (x.tag === 5 &&
              k !== null &&
              ((x = k),
              c !== null && ((k = Yo(d, c)), k != null && w.push(Jo(d, k, x)))),
            h)
          )
            break;
          d = d.return;
        }
        0 < w.length &&
          ((v = new m(v, y, null, r, p)), g.push({ event: v, listeners: w }));
      }
    }
    if ((t & 7) === 0) {
      e: {
        if (
          ((v = e === "mouseover" || e === "pointerover"),
          (m = e === "mouseout" || e === "pointerout"),
          v &&
            (t & 16) === 0 &&
            (y = r.relatedTarget || r.fromElement) &&
            (Nr(y) || y[Hn]))
        )
          break e;
        if (
          (m || v) &&
          ((v =
            p.window === p
              ? p
              : (v = p.ownerDocument)
              ? v.defaultView || v.parentWindow
              : window),
          m
            ? ((y = r.relatedTarget || r.toElement),
              (m = u),
              (y = y ? Nr(y) : null),
              y !== null &&
                ((h = tn(y)), y !== h || (y.tag !== 5 && y.tag !== 6)) &&
                (y = null))
            : ((m = null), (y = u)),
          m !== y)
        ) {
          if (
            ((w = bd),
            (k = "onMouseLeave"),
            (c = "onMouseEnter"),
            (d = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((w = xd),
              (k = "onPointerLeave"),
              (c = "onPointerEnter"),
              (d = "pointer")),
            (h = m == null ? v : gn(m)),
            (x = y == null ? v : gn(y)),
            (v = new w(k, d + "leave", m, r, p)),
            (v.target = h),
            (v.relatedTarget = x),
            (k = null),
            Nr(p) === u &&
              ((w = new w(c, d + "enter", y, r, p)),
              (w.target = x),
              (w.relatedTarget = h),
              (k = w)),
            (h = k),
            m && y)
          )
            t: {
              for (w = m, c = y, d = 0, x = w; x; x = an(x)) d++;
              for (x = 0, k = c; k; k = an(k)) x++;
              for (; 0 < d - x; ) (w = an(w)), d--;
              for (; 0 < x - d; ) (c = an(c)), x--;
              for (; d--; ) {
                if (w === c || (c !== null && w === c.alternate)) break t;
                (w = an(w)), (c = an(c));
              }
              w = null;
            }
          else w = null;
          m !== null && Od(g, v, m, w, !1),
            y !== null && h !== null && Od(g, h, y, w, !0);
        }
      }
      e: {
        if (
          ((v = u ? gn(u) : window),
          (m = v.nodeName && v.nodeName.toLowerCase()),
          m === "select" || (m === "input" && v.type === "file"))
        )
          var $ = b1;
        else if (Ed(v))
          if (Sh) $ = k1;
          else {
            $ = x1;
            var T = S1;
          }
        else
          (m = v.nodeName) &&
            m.toLowerCase() === "input" &&
            (v.type === "checkbox" || v.type === "radio") &&
            ($ = w1);
        if ($ && ($ = $(e, u))) {
          bh(g, $, r, p);
          break e;
        }
        T && T(e, v, u),
          e === "focusout" &&
            (T = v._wrapperState) &&
            T.controlled &&
            v.type === "number" &&
            Zs(v, "number", v.value);
      }
      switch (((T = u ? gn(u) : window), e)) {
        case "focusin":
          (Ed(T) || T.contentEditable === "true") &&
            ((vn = T), (fu = u), (Ro = null));
          break;
        case "focusout":
          Ro = fu = vn = null;
          break;
        case "mousedown":
          du = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (du = !1), Rd(g, r, p);
          break;
        case "selectionchange":
          if (C1) break;
        case "keydown":
        case "keyup":
          Rd(g, r, p);
      }
      var P;
      if (Rc)
        e: {
          switch (e) {
            case "compositionstart":
              var O = "onCompositionStart";
              break e;
            case "compositionend":
              O = "onCompositionEnd";
              break e;
            case "compositionupdate":
              O = "onCompositionUpdate";
              break e;
          }
          O = void 0;
        }
      else
        hn
          ? gh(e, r) && (O = "onCompositionEnd")
          : e === "keydown" && r.keyCode === 229 && (O = "onCompositionStart");
      O &&
        (vh &&
          r.locale !== "ko" &&
          (hn || O !== "onCompositionStart"
            ? O === "onCompositionEnd" && hn && (P = hh())
            : ((lr = p),
              (Tc = "value" in lr ? lr.value : lr.textContent),
              (hn = !0))),
        (T = Oi(u, O)),
        0 < T.length &&
          ((O = new Sd(O, e, null, r, p)),
          g.push({ event: O, listeners: T }),
          P ? (O.data = P) : ((P = yh(r)), P !== null && (O.data = P)))),
        (P = m1 ? h1(e, r) : v1(e, r)) &&
          ((u = Oi(u, "onBeforeInput")),
          0 < u.length &&
            ((p = new Sd("onBeforeInput", "beforeinput", null, r, p)),
            g.push({ event: p, listeners: u }),
            (p.data = P)));
    }
    Eh(g, t);
  });
}
function Jo(e, t, r) {
  return { instance: e, listener: t, currentTarget: r };
}
function Oi(e, t) {
  for (var r = t + "Capture", n = []; e !== null; ) {
    var o = e,
      a = o.stateNode;
    o.tag === 5 &&
      a !== null &&
      ((o = a),
      (a = Yo(e, r)),
      a != null && n.unshift(Jo(e, a, o)),
      (a = Yo(e, t)),
      a != null && n.push(Jo(e, a, o))),
      (e = e.return);
  }
  return n;
}
function an(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Od(e, t, r, n, o) {
  for (var a = t._reactName, i = []; r !== null && r !== n; ) {
    var l = r,
      s = l.alternate,
      u = l.stateNode;
    if (s !== null && s === n) break;
    l.tag === 5 &&
      u !== null &&
      ((l = u),
      o
        ? ((s = Yo(r, a)), s != null && i.unshift(Jo(r, s, l)))
        : o || ((s = Yo(r, a)), s != null && i.push(Jo(r, s, l)))),
      (r = r.return);
  }
  i.length !== 0 && e.push({ event: t, listeners: i });
}
function Bi() {}
var gs = null,
  ys = null;
function Ph(e, t) {
  switch (e) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      return !!t.autoFocus;
  }
  return !1;
}
function pu(e, t) {
  return (
    e === "textarea" ||
    e === "option" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Bd = typeof setTimeout == "function" ? setTimeout : void 0,
  T1 = typeof clearTimeout == "function" ? clearTimeout : void 0;
function Ac(e) {
  e.nodeType === 1
    ? (e.textContent = "")
    : e.nodeType === 9 && ((e = e.body), e != null && (e.textContent = ""));
}
function Cn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
  }
  return e;
}
function Fd(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var r = e.data;
      if (r === "$" || r === "$!" || r === "$?") {
        if (t === 0) return e;
        t--;
      } else r === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var bs = 0;
function P1(e) {
  return { $$typeof: vc, toString: e, valueOf: e };
}
var bl = Math.random().toString(36).slice(2),
  sr = "__reactFiber$" + bl,
  Fi = "__reactProps$" + bl,
  Hn = "__reactContainer$" + bl,
  Nd = "__reactEvents$" + bl;
function Nr(e) {
  var t = e[sr];
  if (t) return t;
  for (var r = e.parentNode; r; ) {
    if ((t = r[Hn] || r[sr])) {
      if (
        ((r = t.alternate),
        t.child !== null || (r !== null && r.child !== null))
      )
        for (e = Fd(e); e !== null; ) {
          if ((r = e[sr])) return r;
          e = Fd(e);
        }
      return t;
    }
    (e = r), (r = e.parentNode);
  }
  return null;
}
function ha(e) {
  return (
    (e = e[sr] || e[Hn]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function gn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(R(33));
}
function Sl(e) {
  return e[Fi] || null;
}
function $h(e) {
  var t = e[Nd];
  return t === void 0 && (t = e[Nd] = new Set()), t;
}
var mu = [],
  yn = -1;
function Tr(e) {
  return { current: e };
}
function te(e) {
  0 > yn || ((e.current = mu[yn]), (mu[yn] = null), yn--);
}
function se(e, t) {
  yn++, (mu[yn] = e.current), (e.current = t);
}
var Er = {},
  Ae = Tr(Er),
  Ne = Tr(!1),
  qr = Er;
function On(e, t) {
  var r = e.type.contextTypes;
  if (!r) return Er;
  var n = e.stateNode;
  if (n && n.__reactInternalMemoizedUnmaskedChildContext === t)
    return n.__reactInternalMemoizedMaskedChildContext;
  var o = {},
    a;
  for (a in r) o[a] = t[a];
  return (
    n &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = o)),
    o
  );
}
function Le(e) {
  return (e = e.childContextTypes), e != null;
}
function Ni() {
  te(Ne), te(Ae);
}
function Ld(e, t, r) {
  if (Ae.current !== Er) throw Error(R(168));
  se(Ae, t), se(Ne, r);
}
function Rh(e, t, r) {
  var n = e.stateNode;
  if (((e = t.childContextTypes), typeof n.getChildContext != "function"))
    return r;
  n = n.getChildContext();
  for (var o in n) if (!(o in e)) throw Error(R(108, wn(t) || "Unknown", o));
  return ie({}, r, n);
}
function vi(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Er),
    (qr = Ae.current),
    se(Ae, e),
    se(Ne, Ne.current),
    !0
  );
}
function jd(e, t, r) {
  var n = e.stateNode;
  if (!n) throw Error(R(169));
  r
    ? ((e = Rh(e, t, qr)),
      (n.__reactInternalMemoizedMergedChildContext = e),
      te(Ne),
      te(Ae),
      se(Ae, e))
    : te(Ne),
    se(Ne, r);
}
var zc = null,
  Ur = null,
  $1 = ye.unstable_runWithPriority,
  Ic = ye.unstable_scheduleCallback,
  hu = ye.unstable_cancelCallback,
  R1 = ye.unstable_shouldYield,
  Dd = ye.unstable_requestPaint,
  vu = ye.unstable_now,
  A1 = ye.unstable_getCurrentPriorityLevel,
  xl = ye.unstable_ImmediatePriority,
  Ah = ye.unstable_UserBlockingPriority,
  zh = ye.unstable_NormalPriority,
  Ih = ye.unstable_LowPriority,
  Mh = ye.unstable_IdlePriority,
  Ss = {},
  z1 = Dd !== void 0 ? Dd : function () {},
  Gt = null,
  gi = null,
  xs = !1,
  Wd = vu(),
  $e =
    1e4 > Wd
      ? vu
      : function () {
          return vu() - Wd;
        };
function Bn() {
  switch (A1()) {
    case xl:
      return 99;
    case Ah:
      return 98;
    case zh:
      return 97;
    case Ih:
      return 96;
    case Mh:
      return 95;
    default:
      throw Error(R(332));
  }
}
function Oh(e) {
  switch (e) {
    case 99:
      return xl;
    case 98:
      return Ah;
    case 97:
      return zh;
    case 96:
      return Ih;
    case 95:
      return Mh;
    default:
      throw Error(R(332));
  }
}
function Kr(e, t) {
  return (e = Oh(e)), $1(e, t);
}
function ea(e, t, r) {
  return (e = Oh(e)), Ic(e, t, r);
}
function Nt() {
  if (gi !== null) {
    var e = gi;
    (gi = null), hu(e);
  }
  Bh();
}
function Bh() {
  if (!xs && Gt !== null) {
    xs = !0;
    var e = 0;
    try {
      var t = Gt;
      Kr(99, function () {
        for (; e < t.length; e++) {
          var r = t[e];
          do r = r(!0);
          while (r !== null);
        }
      }),
        (Gt = null);
    } catch (r) {
      throw (Gt !== null && (Gt = Gt.slice(e + 1)), Ic(xl, Nt), r);
    } finally {
      xs = !1;
    }
  }
}
var I1 = en.ReactCurrentBatchConfig;
function yt(e, t) {
  if (e && e.defaultProps) {
    (t = ie({}, t)), (e = e.defaultProps);
    for (var r in e) t[r] === void 0 && (t[r] = e[r]);
    return t;
  }
  return t;
}
var Li = Tr(null),
  ji = null,
  bn = null,
  Di = null;
function Mc() {
  Di = bn = ji = null;
}
function Oc(e) {
  var t = Li.current;
  te(Li), (e.type._context._currentValue = t);
}
function Fh(e, t) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) === t) {
      if (r === null || (r.childLanes & t) === t) break;
      r.childLanes |= t;
    } else (e.childLanes |= t), r !== null && (r.childLanes |= t);
    e = e.return;
  }
}
function Tn(e, t) {
  (ji = e),
    (Di = bn = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      ((e.lanes & t) !== 0 && (bt = !0), (e.firstContext = null));
}
function ct(e, t) {
  if (Di !== e && t !== !1 && t !== 0)
    if (
      ((typeof t != "number" || t === 1073741823) &&
        ((Di = e), (t = 1073741823)),
      (t = { context: e, observedBits: t, next: null }),
      bn === null)
    ) {
      if (ji === null) throw Error(R(308));
      (bn = t),
        (ji.dependencies = { lanes: 0, firstContext: t, responders: null });
    } else bn = bn.next = t;
  return e._currentValue;
}
var ar = !1;
function Bc(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null },
    effects: null,
  };
}
function Nh(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function hr(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function vr(e, t) {
  if (((e = e.updateQueue), e !== null)) {
    e = e.shared;
    var r = e.pending;
    r === null ? (t.next = t) : ((t.next = r.next), (r.next = t)),
      (e.pending = t);
  }
}
function Hd(e, t) {
  var r = e.updateQueue,
    n = e.alternate;
  if (n !== null && ((n = n.updateQueue), r === n)) {
    var o = null,
      a = null;
    if (((r = r.firstBaseUpdate), r !== null)) {
      do {
        var i = {
          eventTime: r.eventTime,
          lane: r.lane,
          tag: r.tag,
          payload: r.payload,
          callback: r.callback,
          next: null,
        };
        a === null ? (o = a = i) : (a = a.next = i), (r = r.next);
      } while (r !== null);
      a === null ? (o = a = t) : (a = a.next = t);
    } else o = a = t;
    (r = {
      baseState: n.baseState,
      firstBaseUpdate: o,
      lastBaseUpdate: a,
      shared: n.shared,
      effects: n.effects,
    }),
      (e.updateQueue = r);
    return;
  }
  (e = r.lastBaseUpdate),
    e === null ? (r.firstBaseUpdate = t) : (e.next = t),
    (r.lastBaseUpdate = t);
}
function ta(e, t, r, n) {
  var o = e.updateQueue;
  ar = !1;
  var a = o.firstBaseUpdate,
    i = o.lastBaseUpdate,
    l = o.shared.pending;
  if (l !== null) {
    o.shared.pending = null;
    var s = l,
      u = s.next;
    (s.next = null), i === null ? (a = u) : (i.next = u), (i = s);
    var p = e.alternate;
    if (p !== null) {
      p = p.updateQueue;
      var g = p.lastBaseUpdate;
      g !== i &&
        (g === null ? (p.firstBaseUpdate = u) : (g.next = u),
        (p.lastBaseUpdate = s));
    }
  }
  if (a !== null) {
    (g = o.baseState), (i = 0), (p = u = s = null);
    do {
      l = a.lane;
      var v = a.eventTime;
      if ((n & l) === l) {
        p !== null &&
          (p = p.next =
            {
              eventTime: v,
              lane: 0,
              tag: a.tag,
              payload: a.payload,
              callback: a.callback,
              next: null,
            });
        e: {
          var m = e,
            y = a;
          switch (((l = t), (v = r), y.tag)) {
            case 1:
              if (((m = y.payload), typeof m == "function")) {
                g = m.call(v, g, l);
                break e;
              }
              g = m;
              break e;
            case 3:
              m.flags = (m.flags & -4097) | 64;
            case 0:
              if (
                ((m = y.payload),
                (l = typeof m == "function" ? m.call(v, g, l) : m),
                l == null)
              )
                break e;
              g = ie({}, g, l);
              break e;
            case 2:
              ar = !0;
          }
        }
        a.callback !== null &&
          ((e.flags |= 32),
          (l = o.effects),
          l === null ? (o.effects = [a]) : l.push(a));
      } else
        (v = {
          eventTime: v,
          lane: l,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        }),
          p === null ? ((u = p = v), (s = g)) : (p = p.next = v),
          (i |= l);
      if (((a = a.next), a === null)) {
        if (((l = o.shared.pending), l === null)) break;
        (a = l.next),
          (l.next = null),
          (o.lastBaseUpdate = l),
          (o.shared.pending = null);
      }
    } while (1);
    p === null && (s = g),
      (o.baseState = s),
      (o.firstBaseUpdate = u),
      (o.lastBaseUpdate = p),
      (ga |= i),
      (e.lanes = i),
      (e.memoizedState = g);
  }
}
function Vd(e, t, r) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var n = e[t],
        o = n.callback;
      if (o !== null) {
        if (((n.callback = null), (n = r), typeof o != "function"))
          throw Error(R(191, o));
        o.call(n);
      }
    }
}
var Lh = new dl.Component().refs;
function Wi(e, t, r, n) {
  (t = e.memoizedState),
    (r = r(n, t)),
    (r = r == null ? t : ie({}, t, r)),
    (e.memoizedState = r),
    e.lanes === 0 && (e.updateQueue.baseState = r);
}
var wl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? tn(e) === e : !1;
  },
  enqueueSetState: function (e, t, r) {
    e = e._reactInternals;
    var n = Ye(),
      o = gr(e),
      a = hr(n, o);
    (a.payload = t), r != null && (a.callback = r), vr(e, a), yr(e, o, n);
  },
  enqueueReplaceState: function (e, t, r) {
    e = e._reactInternals;
    var n = Ye(),
      o = gr(e),
      a = hr(n, o);
    (a.tag = 1),
      (a.payload = t),
      r != null && (a.callback = r),
      vr(e, a),
      yr(e, o, n);
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var r = Ye(),
      n = gr(e),
      o = hr(r, n);
    (o.tag = 2), t != null && (o.callback = t), vr(e, o), yr(e, n, r);
  },
};
function Ud(e, t, r, n, o, a, i) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(n, a, i)
      : t.prototype && t.prototype.isPureReactComponent
      ? !Zo(r, n) || !Zo(o, a)
      : !0
  );
}
function jh(e, t, r) {
  var n = !1,
    o = Er,
    a = t.contextType;
  return (
    typeof a == "object" && a !== null
      ? (a = ct(a))
      : ((o = Le(t) ? qr : Ae.current),
        (n = t.contextTypes),
        (a = (n = n != null) ? On(e, o) : Er)),
    (t = new t(r, a)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = wl),
    (e.stateNode = t),
    (t._reactInternals = e),
    n &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = o),
      (e.__reactInternalMemoizedMaskedChildContext = a)),
    t
  );
}
function Gd(e, t, r, n) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(r, n),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(r, n),
    t.state !== e && wl.enqueueReplaceState(t, t.state, null);
}
function gu(e, t, r, n) {
  var o = e.stateNode;
  (o.props = r), (o.state = e.memoizedState), (o.refs = Lh), Bc(e);
  var a = t.contextType;
  typeof a == "object" && a !== null
    ? (o.context = ct(a))
    : ((a = Le(t) ? qr : Ae.current), (o.context = On(e, a))),
    ta(e, r, o, n),
    (o.state = e.memoizedState),
    (a = t.getDerivedStateFromProps),
    typeof a == "function" && (Wi(e, t, a, r), (o.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function" ||
      (typeof o.UNSAFE_componentWillMount != "function" &&
        typeof o.componentWillMount != "function") ||
      ((t = o.state),
      typeof o.componentWillMount == "function" && o.componentWillMount(),
      typeof o.UNSAFE_componentWillMount == "function" &&
        o.UNSAFE_componentWillMount(),
      t !== o.state && wl.enqueueReplaceState(o, o.state, null),
      ta(e, r, o, n),
      (o.state = e.memoizedState)),
    typeof o.componentDidMount == "function" && (e.flags |= 4);
}
var Da = Array.isArray;
function co(e, t, r) {
  if (
    ((e = r.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (r._owner) {
      if (((r = r._owner), r)) {
        if (r.tag !== 1) throw Error(R(309));
        var n = r.stateNode;
      }
      if (!n) throw Error(R(147, e));
      var o = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === o
        ? t.ref
        : ((t = function (a) {
            var i = n.refs;
            i === Lh && (i = n.refs = {}),
              a === null ? delete i[o] : (i[o] = a);
          }),
          (t._stringRef = o),
          t);
    }
    if (typeof e != "string") throw Error(R(284));
    if (!r._owner) throw Error(R(290, e));
  }
  return e;
}
function Wa(e, t) {
  if (e.type !== "textarea")
    throw Error(
      R(
        31,
        Object.prototype.toString.call(t) === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : t
      )
    );
}
function Dh(e) {
  function t(h, c) {
    if (e) {
      var d = h.lastEffect;
      d !== null
        ? ((d.nextEffect = c), (h.lastEffect = c))
        : (h.firstEffect = h.lastEffect = c),
        (c.nextEffect = null),
        (c.flags = 8);
    }
  }
  function r(h, c) {
    if (!e) return null;
    for (; c !== null; ) t(h, c), (c = c.sibling);
    return null;
  }
  function n(h, c) {
    for (h = new Map(); c !== null; )
      c.key !== null ? h.set(c.key, c) : h.set(c.index, c), (c = c.sibling);
    return h;
  }
  function o(h, c) {
    return (h = Cr(h, c)), (h.index = 0), (h.sibling = null), h;
  }
  function a(h, c, d) {
    return (
      (h.index = d),
      e
        ? ((d = h.alternate),
          d !== null
            ? ((d = d.index), d < c ? ((h.flags = 2), c) : d)
            : ((h.flags = 2), c))
        : c
    );
  }
  function i(h) {
    return e && h.alternate === null && (h.flags = 2), h;
  }
  function l(h, c, d, x) {
    return c === null || c.tag !== 6
      ? ((c = Cs(d, h.mode, x)), (c.return = h), c)
      : ((c = o(c, d)), (c.return = h), c);
  }
  function s(h, c, d, x) {
    return c !== null && c.elementType === d.type
      ? ((x = o(c, d.props)), (x.ref = co(h, c, d)), (x.return = h), x)
      : ((x = xi(d.type, d.key, d.props, null, h.mode, x)),
        (x.ref = co(h, c, d)),
        (x.return = h),
        x);
  }
  function u(h, c, d, x) {
    return c === null ||
      c.tag !== 4 ||
      c.stateNode.containerInfo !== d.containerInfo ||
      c.stateNode.implementation !== d.implementation
      ? ((c = Ts(d, h.mode, x)), (c.return = h), c)
      : ((c = o(c, d.children || [])), (c.return = h), c);
  }
  function p(h, c, d, x, k) {
    return c === null || c.tag !== 7
      ? ((c = An(d, h.mode, x, k)), (c.return = h), c)
      : ((c = o(c, d)), (c.return = h), c);
  }
  function g(h, c, d) {
    if (typeof c == "string" || typeof c == "number")
      return (c = Cs("" + c, h.mode, d)), (c.return = h), c;
    if (typeof c == "object" && c !== null) {
      switch (c.$$typeof) {
        case yo:
          return (
            (d = xi(c.type, c.key, c.props, null, h.mode, d)),
            (d.ref = co(h, null, c)),
            (d.return = h),
            d
          );
        case Br:
          return (c = Ts(c, h.mode, d)), (c.return = h), c;
      }
      if (Da(c) || oo(c))
        return (c = An(c, h.mode, d, null)), (c.return = h), c;
      Wa(h, c);
    }
    return null;
  }
  function v(h, c, d, x) {
    var k = c !== null ? c.key : null;
    if (typeof d == "string" || typeof d == "number")
      return k !== null ? null : l(h, c, "" + d, x);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case yo:
          return d.key === k
            ? d.type === ir
              ? p(h, c, d.props.children, x, k)
              : s(h, c, d, x)
            : null;
        case Br:
          return d.key === k ? u(h, c, d, x) : null;
      }
      if (Da(d) || oo(d)) return k !== null ? null : p(h, c, d, x, null);
      Wa(h, d);
    }
    return null;
  }
  function m(h, c, d, x, k) {
    if (typeof x == "string" || typeof x == "number")
      return (h = h.get(d) || null), l(c, h, "" + x, k);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case yo:
          return (
            (h = h.get(x.key === null ? d : x.key) || null),
            x.type === ir ? p(c, h, x.props.children, k, x.key) : s(c, h, x, k)
          );
        case Br:
          return (h = h.get(x.key === null ? d : x.key) || null), u(c, h, x, k);
      }
      if (Da(x) || oo(x)) return (h = h.get(d) || null), p(c, h, x, k, null);
      Wa(c, x);
    }
    return null;
  }
  function y(h, c, d, x) {
    for (
      var k = null, $ = null, T = c, P = (c = 0), O = null;
      T !== null && P < d.length;
      P++
    ) {
      T.index > P ? ((O = T), (T = null)) : (O = T.sibling);
      var A = v(h, T, d[P], x);
      if (A === null) {
        T === null && (T = O);
        break;
      }
      e && T && A.alternate === null && t(h, T),
        (c = a(A, c, P)),
        $ === null ? (k = A) : ($.sibling = A),
        ($ = A),
        (T = O);
    }
    if (P === d.length) return r(h, T), k;
    if (T === null) {
      for (; P < d.length; P++)
        (T = g(h, d[P], x)),
          T !== null &&
            ((c = a(T, c, P)), $ === null ? (k = T) : ($.sibling = T), ($ = T));
      return k;
    }
    for (T = n(h, T); P < d.length; P++)
      (O = m(T, h, P, d[P], x)),
        O !== null &&
          (e && O.alternate !== null && T.delete(O.key === null ? P : O.key),
          (c = a(O, c, P)),
          $ === null ? (k = O) : ($.sibling = O),
          ($ = O));
    return (
      e &&
        T.forEach(function (L) {
          return t(h, L);
        }),
      k
    );
  }
  function w(h, c, d, x) {
    var k = oo(d);
    if (typeof k != "function") throw Error(R(150));
    if (((d = k.call(d)), d == null)) throw Error(R(151));
    for (
      var $ = (k = null), T = c, P = (c = 0), O = null, A = d.next();
      T !== null && !A.done;
      P++, A = d.next()
    ) {
      T.index > P ? ((O = T), (T = null)) : (O = T.sibling);
      var L = v(h, T, A.value, x);
      if (L === null) {
        T === null && (T = O);
        break;
      }
      e && T && L.alternate === null && t(h, T),
        (c = a(L, c, P)),
        $ === null ? (k = L) : ($.sibling = L),
        ($ = L),
        (T = O);
    }
    if (A.done) return r(h, T), k;
    if (T === null) {
      for (; !A.done; P++, A = d.next())
        (A = g(h, A.value, x)),
          A !== null &&
            ((c = a(A, c, P)), $ === null ? (k = A) : ($.sibling = A), ($ = A));
      return k;
    }
    for (T = n(h, T); !A.done; P++, A = d.next())
      (A = m(T, h, P, A.value, x)),
        A !== null &&
          (e && A.alternate !== null && T.delete(A.key === null ? P : A.key),
          (c = a(A, c, P)),
          $ === null ? (k = A) : ($.sibling = A),
          ($ = A));
    return (
      e &&
        T.forEach(function (ve) {
          return t(h, ve);
        }),
      k
    );
  }
  return function (h, c, d, x) {
    var k =
      typeof d == "object" && d !== null && d.type === ir && d.key === null;
    k && (d = d.props.children);
    var $ = typeof d == "object" && d !== null;
    if ($)
      switch (d.$$typeof) {
        case yo:
          e: {
            for ($ = d.key, k = c; k !== null; ) {
              if (k.key === $) {
                switch (k.tag) {
                  case 7:
                    if (d.type === ir) {
                      r(h, k.sibling),
                        (c = o(k, d.props.children)),
                        (c.return = h),
                        (h = c);
                      break e;
                    }
                    break;
                  default:
                    if (k.elementType === d.type) {
                      r(h, k.sibling),
                        (c = o(k, d.props)),
                        (c.ref = co(h, k, d)),
                        (c.return = h),
                        (h = c);
                      break e;
                    }
                }
                r(h, k);
                break;
              } else t(h, k);
              k = k.sibling;
            }
            d.type === ir
              ? ((c = An(d.props.children, h.mode, x, d.key)),
                (c.return = h),
                (h = c))
              : ((x = xi(d.type, d.key, d.props, null, h.mode, x)),
                (x.ref = co(h, c, d)),
                (x.return = h),
                (h = x));
          }
          return i(h);
        case Br:
          e: {
            for (k = d.key; c !== null; ) {
              if (c.key === k)
                if (
                  c.tag === 4 &&
                  c.stateNode.containerInfo === d.containerInfo &&
                  c.stateNode.implementation === d.implementation
                ) {
                  r(h, c.sibling),
                    (c = o(c, d.children || [])),
                    (c.return = h),
                    (h = c);
                  break e;
                } else {
                  r(h, c);
                  break;
                }
              else t(h, c);
              c = c.sibling;
            }
            (c = Ts(d, h.mode, x)), (c.return = h), (h = c);
          }
          return i(h);
      }
    if (typeof d == "string" || typeof d == "number")
      return (
        (d = "" + d),
        c !== null && c.tag === 6
          ? (r(h, c.sibling), (c = o(c, d)), (c.return = h), (h = c))
          : (r(h, c), (c = Cs(d, h.mode, x)), (c.return = h), (h = c)),
        i(h)
      );
    if (Da(d)) return y(h, c, d, x);
    if (oo(d)) return w(h, c, d, x);
    if (($ && Wa(h, d), typeof d == "undefined" && !k))
      switch (h.tag) {
        case 1:
        case 22:
        case 0:
        case 11:
        case 15:
          throw Error(R(152, wn(h.type) || "Component"));
      }
    return r(h, c);
  };
}
var Hi = Dh(!0),
  Wh = Dh(!1),
  va = {},
  It = Tr(va),
  ra = Tr(va),
  na = Tr(va);
function Lr(e) {
  if (e === va) throw Error(R(174));
  return e;
}
function yu(e, t) {
  switch ((se(na, t), se(ra, e), se(It, va), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : ru(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = ru(t, e));
  }
  te(It), se(It, t);
}
function Fn() {
  te(It), te(ra), te(na);
}
function Yd(e) {
  Lr(na.current);
  var t = Lr(It.current),
    r = ru(t, e.type);
  t !== r && (se(ra, e), se(It, r));
}
function Fc(e) {
  ra.current === e && (te(It), te(ra));
}
var le = Tr(0);
function Vi(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var r = t.memoizedState;
      if (
        r !== null &&
        ((r = r.dehydrated), r === null || r.data === "$?" || r.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if ((t.flags & 64) !== 0) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var Qt = null,
  ur = null,
  Mt = !1;
function Hh(e, t) {
  var r = nt(5, null, null, 0);
  (r.elementType = "DELETED"),
    (r.type = "DELETED"),
    (r.stateNode = t),
    (r.return = e),
    (r.flags = 8),
    e.lastEffect !== null
      ? ((e.lastEffect.nextEffect = r), (e.lastEffect = r))
      : (e.firstEffect = e.lastEffect = r);
}
function Xd(e, t) {
  switch (e.tag) {
    case 5:
      var r = e.type;
      return (
        (t =
          t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null ? ((e.stateNode = t), !0) : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), !0) : !1
      );
    case 13:
      return !1;
    default:
      return !1;
  }
}
function bu(e) {
  if (Mt) {
    var t = ur;
    if (t) {
      var r = t;
      if (!Xd(e, t)) {
        if (((t = Cn(r.nextSibling)), !t || !Xd(e, t))) {
          (e.flags = (e.flags & -1025) | 2), (Mt = !1), (Qt = e);
          return;
        }
        Hh(Qt, r);
      }
      (Qt = e), (ur = Cn(t.firstChild));
    } else (e.flags = (e.flags & -1025) | 2), (Mt = !1), (Qt = e);
  }
}
function Qd(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Qt = e;
}
function Ha(e) {
  if (e !== Qt) return !1;
  if (!Mt) return Qd(e), (Mt = !0), !1;
  var t = e.type;
  if (e.tag !== 5 || (t !== "head" && t !== "body" && !pu(t, e.memoizedProps)))
    for (t = ur; t; ) Hh(e, t), (t = Cn(t.nextSibling));
  if ((Qd(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(R(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var r = e.data;
          if (r === "/$") {
            if (t === 0) {
              ur = Cn(e.nextSibling);
              break e;
            }
            t--;
          } else (r !== "$" && r !== "$!" && r !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      ur = null;
    }
  } else ur = Qt ? Cn(e.stateNode.nextSibling) : null;
  return !0;
}
function ws() {
  (ur = Qt = null), (Mt = !1);
}
var Pn = [];
function Nc() {
  for (var e = 0; e < Pn.length; e++)
    Pn[e]._workInProgressVersionPrimary = null;
  Pn.length = 0;
}
var Ao = en.ReactCurrentDispatcher,
  it = en.ReactCurrentBatchConfig,
  oa = 0,
  ue = null,
  Pe = null,
  we = null,
  Ui = !1,
  zo = !1;
function Oe() {
  throw Error(R(321));
}
function Lc(e, t) {
  if (t === null) return !1;
  for (var r = 0; r < t.length && r < e.length; r++)
    if (!rt(e[r], t[r])) return !1;
  return !0;
}
function jc(e, t, r, n, o, a) {
  if (
    ((oa = a),
    (ue = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Ao.current = e === null || e.memoizedState === null ? O1 : B1),
    (e = r(n, o)),
    zo)
  ) {
    a = 0;
    do {
      if (((zo = !1), !(25 > a))) throw Error(R(301));
      (a += 1),
        (we = Pe = null),
        (t.updateQueue = null),
        (Ao.current = F1),
        (e = r(n, o));
    } while (zo);
  }
  if (
    ((Ao.current = Qi),
    (t = Pe !== null && Pe.next !== null),
    (oa = 0),
    (we = Pe = ue = null),
    (Ui = !1),
    t)
  )
    throw Error(R(300));
  return e;
}
function jr() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return we === null ? (ue.memoizedState = we = e) : (we = we.next = e), we;
}
function rn() {
  if (Pe === null) {
    var e = ue.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Pe.next;
  var t = we === null ? ue.memoizedState : we.next;
  if (t !== null) (we = t), (Pe = e);
  else {
    if (e === null) throw Error(R(310));
    (Pe = e),
      (e = {
        memoizedState: Pe.memoizedState,
        baseState: Pe.baseState,
        baseQueue: Pe.baseQueue,
        queue: Pe.queue,
        next: null,
      }),
      we === null ? (ue.memoizedState = we = e) : (we = we.next = e);
  }
  return we;
}
function Rt(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function fo(e) {
  var t = rn(),
    r = t.queue;
  if (r === null) throw Error(R(311));
  r.lastRenderedReducer = e;
  var n = Pe,
    o = n.baseQueue,
    a = r.pending;
  if (a !== null) {
    if (o !== null) {
      var i = o.next;
      (o.next = a.next), (a.next = i);
    }
    (n.baseQueue = o = a), (r.pending = null);
  }
  if (o !== null) {
    (o = o.next), (n = n.baseState);
    var l = (i = a = null),
      s = o;
    do {
      var u = s.lane;
      if ((oa & u) === u)
        l !== null &&
          (l = l.next =
            {
              lane: 0,
              action: s.action,
              eagerReducer: s.eagerReducer,
              eagerState: s.eagerState,
              next: null,
            }),
          (n = s.eagerReducer === e ? s.eagerState : e(n, s.action));
      else {
        var p = {
          lane: u,
          action: s.action,
          eagerReducer: s.eagerReducer,
          eagerState: s.eagerState,
          next: null,
        };
        l === null ? ((i = l = p), (a = n)) : (l = l.next = p),
          (ue.lanes |= u),
          (ga |= u);
      }
      s = s.next;
    } while (s !== null && s !== o);
    l === null ? (a = n) : (l.next = i),
      rt(n, t.memoizedState) || (bt = !0),
      (t.memoizedState = n),
      (t.baseState = a),
      (t.baseQueue = l),
      (r.lastRenderedState = n);
  }
  return [t.memoizedState, r.dispatch];
}
function po(e) {
  var t = rn(),
    r = t.queue;
  if (r === null) throw Error(R(311));
  r.lastRenderedReducer = e;
  var n = r.dispatch,
    o = r.pending,
    a = t.memoizedState;
  if (o !== null) {
    r.pending = null;
    var i = (o = o.next);
    do (a = e(a, i.action)), (i = i.next);
    while (i !== o);
    rt(a, t.memoizedState) || (bt = !0),
      (t.memoizedState = a),
      t.baseQueue === null && (t.baseState = a),
      (r.lastRenderedState = a);
  }
  return [a, n];
}
function qd(e, t, r) {
  var n = t._getVersion;
  n = n(t._source);
  var o = t._workInProgressVersionPrimary;
  if (
    (o !== null
      ? (e = o === n)
      : ((e = e.mutableReadLanes),
        (e = (oa & e) === e) &&
          ((t._workInProgressVersionPrimary = n), Pn.push(t))),
    e)
  )
    return r(t._source);
  throw (Pn.push(t), Error(R(350)));
}
function Vh(e, t, r, n) {
  var o = ze;
  if (o === null) throw Error(R(349));
  var a = t._getVersion,
    i = a(t._source),
    l = Ao.current,
    s = l.useState(function () {
      return qd(o, t, r);
    }),
    u = s[1],
    p = s[0];
  s = we;
  var g = e.memoizedState,
    v = g.refs,
    m = v.getSnapshot,
    y = g.source;
  g = g.subscribe;
  var w = ue;
  return (
    (e.memoizedState = { refs: v, source: t, subscribe: n }),
    l.useEffect(
      function () {
        (v.getSnapshot = r), (v.setSnapshot = u);
        var h = a(t._source);
        if (!rt(i, h)) {
          (h = r(t._source)),
            rt(p, h) ||
              (u(h), (h = gr(w)), (o.mutableReadLanes |= h & o.pendingLanes)),
            (h = o.mutableReadLanes),
            (o.entangledLanes |= h);
          for (var c = o.entanglements, d = h; 0 < d; ) {
            var x = 31 - kr(d),
              k = 1 << x;
            (c[x] |= h), (d &= ~k);
          }
        }
      },
      [r, t, n]
    ),
    l.useEffect(
      function () {
        return n(t._source, function () {
          var h = v.getSnapshot,
            c = v.setSnapshot;
          try {
            c(h(t._source));
            var d = gr(w);
            o.mutableReadLanes |= d & o.pendingLanes;
          } catch (x) {
            c(function () {
              throw x;
            });
          }
        });
      },
      [t, n]
    ),
    (rt(m, r) && rt(y, t) && rt(g, n)) ||
      ((e = {
        pending: null,
        dispatch: null,
        lastRenderedReducer: Rt,
        lastRenderedState: p,
      }),
      (e.dispatch = u = Hc.bind(null, ue, e)),
      (s.queue = e),
      (s.baseQueue = null),
      (p = qd(o, t, r)),
      (s.memoizedState = s.baseState = p)),
    p
  );
}
function Uh(e, t, r) {
  var n = rn();
  return Vh(n, e, t, r);
}
function mo(e) {
  var t = jr();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = t.queue =
      {
        pending: null,
        dispatch: null,
        lastRenderedReducer: Rt,
        lastRenderedState: e,
      }),
    (e = e.dispatch = Hc.bind(null, ue, e)),
    [t.memoizedState, e]
  );
}
function Gi(e, t, r, n) {
  return (
    (e = { tag: e, create: t, destroy: r, deps: n, next: null }),
    (t = ue.updateQueue),
    t === null
      ? ((t = { lastEffect: null }),
        (ue.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((r = t.lastEffect),
        r === null
          ? (t.lastEffect = e.next = e)
          : ((n = r.next), (r.next = e), (e.next = n), (t.lastEffect = e))),
    e
  );
}
function Kd(e) {
  var t = jr();
  return (e = { current: e }), (t.memoizedState = e);
}
function Yi() {
  return rn().memoizedState;
}
function Su(e, t, r, n) {
  var o = jr();
  (ue.flags |= e),
    (o.memoizedState = Gi(1 | t, r, void 0, n === void 0 ? null : n));
}
function Dc(e, t, r, n) {
  var o = rn();
  n = n === void 0 ? null : n;
  var a = void 0;
  if (Pe !== null) {
    var i = Pe.memoizedState;
    if (((a = i.destroy), n !== null && Lc(n, i.deps))) {
      Gi(t, r, a, n);
      return;
    }
  }
  (ue.flags |= e), (o.memoizedState = Gi(1 | t, r, a, n));
}
function Zd(e, t) {
  return Su(516, 4, e, t);
}
function Xi(e, t) {
  return Dc(516, 4, e, t);
}
function Gh(e, t) {
  return Dc(4, 2, e, t);
}
function Yh(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Xh(e, t, r) {
  return (
    (r = r != null ? r.concat([e]) : null), Dc(4, 2, Yh.bind(null, t, e), r)
  );
}
function Wc() {}
function Qh(e, t) {
  var r = rn();
  t = t === void 0 ? null : t;
  var n = r.memoizedState;
  return n !== null && t !== null && Lc(t, n[1])
    ? n[0]
    : ((r.memoizedState = [e, t]), e);
}
function qh(e, t) {
  var r = rn();
  t = t === void 0 ? null : t;
  var n = r.memoizedState;
  return n !== null && t !== null && Lc(t, n[1])
    ? n[0]
    : ((e = e()), (r.memoizedState = [e, t]), e);
}
function M1(e, t) {
  var r = Bn();
  Kr(98 > r ? 98 : r, function () {
    e(!0);
  }),
    Kr(97 < r ? 97 : r, function () {
      var n = it.transition;
      it.transition = 1;
      try {
        e(!1), t();
      } finally {
        it.transition = n;
      }
    });
}
function Hc(e, t, r) {
  var n = Ye(),
    o = gr(e),
    a = {
      lane: o,
      action: r,
      eagerReducer: null,
      eagerState: null,
      next: null,
    },
    i = t.pending;
  if (
    (i === null ? (a.next = a) : ((a.next = i.next), (i.next = a)),
    (t.pending = a),
    (i = e.alternate),
    e === ue || (i !== null && i === ue))
  )
    zo = Ui = !0;
  else {
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var l = t.lastRenderedState,
          s = i(l, r);
        if (((a.eagerReducer = i), (a.eagerState = s), rt(s, l))) return;
      } catch {
      } finally {
      }
    yr(e, o, n);
  }
}
var Qi = {
    readContext: ct,
    useCallback: Oe,
    useContext: Oe,
    useEffect: Oe,
    useImperativeHandle: Oe,
    useLayoutEffect: Oe,
    useMemo: Oe,
    useReducer: Oe,
    useRef: Oe,
    useState: Oe,
    useDebugValue: Oe,
    useDeferredValue: Oe,
    useTransition: Oe,
    useMutableSource: Oe,
    useOpaqueIdentifier: Oe,
    unstable_isNewReconciler: !1,
  },
  O1 = {
    readContext: ct,
    useCallback: function (e, t) {
      return (jr().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: ct,
    useEffect: Zd,
    useImperativeHandle: function (e, t, r) {
      return (
        (r = r != null ? r.concat([e]) : null), Su(4, 2, Yh.bind(null, t, e), r)
      );
    },
    useLayoutEffect: function (e, t) {
      return Su(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var r = jr();
      return (
        (t = t === void 0 ? null : t), (e = e()), (r.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, r) {
      var n = jr();
      return (
        (t = r !== void 0 ? r(t) : t),
        (n.memoizedState = n.baseState = t),
        (e = n.queue =
          {
            pending: null,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t,
          }),
        (e = e.dispatch = Hc.bind(null, ue, e)),
        [n.memoizedState, e]
      );
    },
    useRef: Kd,
    useState: mo,
    useDebugValue: Wc,
    useDeferredValue: function (e) {
      var t = mo(e),
        r = t[0],
        n = t[1];
      return (
        Zd(
          function () {
            var o = it.transition;
            it.transition = 1;
            try {
              n(e);
            } finally {
              it.transition = o;
            }
          },
          [e]
        ),
        r
      );
    },
    useTransition: function () {
      var e = mo(!1),
        t = e[0];
      return (e = M1.bind(null, e[1])), Kd(e), [e, t];
    },
    useMutableSource: function (e, t, r) {
      var n = jr();
      return (
        (n.memoizedState = {
          refs: { getSnapshot: t, setSnapshot: null },
          source: e,
          subscribe: r,
        }),
        Vh(n, e, t, r)
      );
    },
    useOpaqueIdentifier: function () {
      if (Mt) {
        var e = !1,
          t = P1(function () {
            throw (
              (e || ((e = !0), r("r:" + (bs++).toString(36))), Error(R(355)))
            );
          }),
          r = mo(t)[1];
        return (
          (ue.mode & 2) === 0 &&
            ((ue.flags |= 516),
            Gi(
              5,
              function () {
                r("r:" + (bs++).toString(36));
              },
              void 0,
              null
            )),
          t
        );
      }
      return (t = "r:" + (bs++).toString(36)), mo(t), t;
    },
    unstable_isNewReconciler: !1,
  },
  B1 = {
    readContext: ct,
    useCallback: Qh,
    useContext: ct,
    useEffect: Xi,
    useImperativeHandle: Xh,
    useLayoutEffect: Gh,
    useMemo: qh,
    useReducer: fo,
    useRef: Yi,
    useState: function () {
      return fo(Rt);
    },
    useDebugValue: Wc,
    useDeferredValue: function (e) {
      var t = fo(Rt),
        r = t[0],
        n = t[1];
      return (
        Xi(
          function () {
            var o = it.transition;
            it.transition = 1;
            try {
              n(e);
            } finally {
              it.transition = o;
            }
          },
          [e]
        ),
        r
      );
    },
    useTransition: function () {
      var e = fo(Rt)[0];
      return [Yi().current, e];
    },
    useMutableSource: Uh,
    useOpaqueIdentifier: function () {
      return fo(Rt)[0];
    },
    unstable_isNewReconciler: !1,
  },
  F1 = {
    readContext: ct,
    useCallback: Qh,
    useContext: ct,
    useEffect: Xi,
    useImperativeHandle: Xh,
    useLayoutEffect: Gh,
    useMemo: qh,
    useReducer: po,
    useRef: Yi,
    useState: function () {
      return po(Rt);
    },
    useDebugValue: Wc,
    useDeferredValue: function (e) {
      var t = po(Rt),
        r = t[0],
        n = t[1];
      return (
        Xi(
          function () {
            var o = it.transition;
            it.transition = 1;
            try {
              n(e);
            } finally {
              it.transition = o;
            }
          },
          [e]
        ),
        r
      );
    },
    useTransition: function () {
      var e = po(Rt)[0];
      return [Yi().current, e];
    },
    useMutableSource: Uh,
    useOpaqueIdentifier: function () {
      return po(Rt)[0];
    },
    unstable_isNewReconciler: !1,
  },
  N1 = en.ReactCurrentOwner,
  bt = !1;
function Be(e, t, r, n) {
  t.child = e === null ? Wh(t, null, r, n) : Hi(t, e.child, r, n);
}
function Jd(e, t, r, n, o) {
  r = r.render;
  var a = t.ref;
  return (
    Tn(t, o),
    (n = jc(e, t, r, n, a, o)),
    e !== null && !bt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -517),
        (e.lanes &= ~o),
        qt(e, t, o))
      : ((t.flags |= 1), Be(e, t, n, o), t.child)
  );
}
function ep(e, t, r, n, o, a) {
  if (e === null) {
    var i = r.type;
    return typeof i == "function" &&
      !Qc(i) &&
      i.defaultProps === void 0 &&
      r.compare === null &&
      r.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), Kh(e, t, i, n, o, a))
      : ((e = xi(r.type, null, n, t, t.mode, a)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  return (
    (i = e.child),
    (o & a) === 0 &&
    ((o = i.memoizedProps),
    (r = r.compare),
    (r = r !== null ? r : Zo),
    r(o, n) && e.ref === t.ref)
      ? qt(e, t, a)
      : ((t.flags |= 1),
        (e = Cr(i, n)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e))
  );
}
function Kh(e, t, r, n, o, a) {
  if (e !== null && Zo(e.memoizedProps, n) && e.ref === t.ref)
    if (((bt = !1), (a & o) !== 0)) (e.flags & 16384) !== 0 && (bt = !0);
    else return (t.lanes = e.lanes), qt(e, t, a);
  return xu(e, t, r, n, a);
}
function ks(e, t, r) {
  var n = t.pendingProps,
    o = n.children,
    a = e !== null ? e.memoizedState : null;
  if (n.mode === "hidden" || n.mode === "unstable-defer-without-hiding")
    if ((t.mode & 4) === 0) (t.memoizedState = { baseLanes: 0 }), Ua(t, r);
    else if ((r & 1073741824) !== 0)
      (t.memoizedState = { baseLanes: 0 }), Ua(t, a !== null ? a.baseLanes : r);
    else
      return (
        (e = a !== null ? a.baseLanes | r : r),
        (t.lanes = t.childLanes = 1073741824),
        (t.memoizedState = { baseLanes: e }),
        Ua(t, e),
        null
      );
  else
    a !== null ? ((n = a.baseLanes | r), (t.memoizedState = null)) : (n = r),
      Ua(t, n);
  return Be(e, t, o, r), t.child;
}
function Zh(e, t) {
  var r = t.ref;
  ((e === null && r !== null) || (e !== null && e.ref !== r)) &&
    (t.flags |= 128);
}
function xu(e, t, r, n, o) {
  var a = Le(r) ? qr : Ae.current;
  return (
    (a = On(t, a)),
    Tn(t, o),
    (r = jc(e, t, r, n, a, o)),
    e !== null && !bt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -517),
        (e.lanes &= ~o),
        qt(e, t, o))
      : ((t.flags |= 1), Be(e, t, r, o), t.child)
  );
}
function tp(e, t, r, n, o) {
  if (Le(r)) {
    var a = !0;
    vi(t);
  } else a = !1;
  if ((Tn(t, o), t.stateNode === null))
    e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2)),
      jh(t, r, n),
      gu(t, r, n, o),
      (n = !0);
  else if (e === null) {
    var i = t.stateNode,
      l = t.memoizedProps;
    i.props = l;
    var s = i.context,
      u = r.contextType;
    typeof u == "object" && u !== null
      ? (u = ct(u))
      : ((u = Le(r) ? qr : Ae.current), (u = On(t, u)));
    var p = r.getDerivedStateFromProps,
      g =
        typeof p == "function" ||
        typeof i.getSnapshotBeforeUpdate == "function";
    g ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((l !== n || s !== u) && Gd(t, i, n, u)),
      (ar = !1);
    var v = t.memoizedState;
    (i.state = v),
      ta(t, n, i, o),
      (s = t.memoizedState),
      l !== n || v !== s || Ne.current || ar
        ? (typeof p == "function" && (Wi(t, r, p, n), (s = t.memoizedState)),
          (l = ar || Ud(t, r, l, n, v, s, u))
            ? (g ||
                (typeof i.UNSAFE_componentWillMount != "function" &&
                  typeof i.componentWillMount != "function") ||
                (typeof i.componentWillMount == "function" &&
                  i.componentWillMount(),
                typeof i.UNSAFE_componentWillMount == "function" &&
                  i.UNSAFE_componentWillMount()),
              typeof i.componentDidMount == "function" && (t.flags |= 4))
            : (typeof i.componentDidMount == "function" && (t.flags |= 4),
              (t.memoizedProps = n),
              (t.memoizedState = s)),
          (i.props = n),
          (i.state = s),
          (i.context = u),
          (n = l))
        : (typeof i.componentDidMount == "function" && (t.flags |= 4),
          (n = !1));
  } else {
    (i = t.stateNode),
      Nh(e, t),
      (l = t.memoizedProps),
      (u = t.type === t.elementType ? l : yt(t.type, l)),
      (i.props = u),
      (g = t.pendingProps),
      (v = i.context),
      (s = r.contextType),
      typeof s == "object" && s !== null
        ? (s = ct(s))
        : ((s = Le(r) ? qr : Ae.current), (s = On(t, s)));
    var m = r.getDerivedStateFromProps;
    (p =
      typeof m == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function") ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((l !== g || v !== s) && Gd(t, i, n, s)),
      (ar = !1),
      (v = t.memoizedState),
      (i.state = v),
      ta(t, n, i, o);
    var y = t.memoizedState;
    l !== g || v !== y || Ne.current || ar
      ? (typeof m == "function" && (Wi(t, r, m, n), (y = t.memoizedState)),
        (u = ar || Ud(t, r, u, n, v, y, s))
          ? (p ||
              (typeof i.UNSAFE_componentWillUpdate != "function" &&
                typeof i.componentWillUpdate != "function") ||
              (typeof i.componentWillUpdate == "function" &&
                i.componentWillUpdate(n, y, s),
              typeof i.UNSAFE_componentWillUpdate == "function" &&
                i.UNSAFE_componentWillUpdate(n, y, s)),
            typeof i.componentDidUpdate == "function" && (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 256))
          : (typeof i.componentDidUpdate != "function" ||
              (l === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate != "function" ||
              (l === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 256),
            (t.memoizedProps = n),
            (t.memoizedState = y)),
        (i.props = n),
        (i.state = y),
        (i.context = s),
        (n = u))
      : (typeof i.componentDidUpdate != "function" ||
          (l === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 4),
        typeof i.getSnapshotBeforeUpdate != "function" ||
          (l === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 256),
        (n = !1));
  }
  return wu(e, t, r, n, a, o);
}
function wu(e, t, r, n, o, a) {
  Zh(e, t);
  var i = (t.flags & 64) !== 0;
  if (!n && !i) return o && jd(t, r, !1), qt(e, t, a);
  (n = t.stateNode), (N1.current = t);
  var l =
    i && typeof r.getDerivedStateFromError != "function" ? null : n.render();
  return (
    (t.flags |= 1),
    e !== null && i
      ? ((t.child = Hi(t, e.child, null, a)), (t.child = Hi(t, null, l, a)))
      : Be(e, t, l, a),
    (t.memoizedState = n.state),
    o && jd(t, r, !0),
    t.child
  );
}
function rp(e) {
  var t = e.stateNode;
  t.pendingContext
    ? Ld(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Ld(e, t.context, !1),
    yu(e, t.containerInfo);
}
var Va = { dehydrated: null, retryLane: 0 };
function np(e, t, r) {
  var n = t.pendingProps,
    o = le.current,
    a = !1,
    i;
  return (
    (i = (t.flags & 64) !== 0) ||
      (i = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0),
    i
      ? ((a = !0), (t.flags &= -65))
      : (e !== null && e.memoizedState === null) ||
        n.fallback === void 0 ||
        n.unstable_avoidThisFallback === !0 ||
        (o |= 1),
    se(le, o & 1),
    e === null
      ? (n.fallback !== void 0 && bu(t),
        (e = n.children),
        (o = n.fallback),
        a
          ? ((e = op(t, e, o, r)),
            (t.child.memoizedState = { baseLanes: r }),
            (t.memoizedState = Va),
            e)
          : typeof n.unstable_expectedLoadTime == "number"
          ? ((e = op(t, e, o, r)),
            (t.child.memoizedState = { baseLanes: r }),
            (t.memoizedState = Va),
            (t.lanes = 33554432),
            e)
          : ((r = qc({ mode: "visible", children: e }, t.mode, r, null)),
            (r.return = t),
            (t.child = r)))
      : e.memoizedState !== null
      ? a
        ? ((n = ip(e, t, n.children, n.fallback, r)),
          (a = t.child),
          (o = e.child.memoizedState),
          (a.memoizedState =
            o === null ? { baseLanes: r } : { baseLanes: o.baseLanes | r }),
          (a.childLanes = e.childLanes & ~r),
          (t.memoizedState = Va),
          n)
        : ((r = ap(e, t, n.children, r)), (t.memoizedState = null), r)
      : a
      ? ((n = ip(e, t, n.children, n.fallback, r)),
        (a = t.child),
        (o = e.child.memoizedState),
        (a.memoizedState =
          o === null ? { baseLanes: r } : { baseLanes: o.baseLanes | r }),
        (a.childLanes = e.childLanes & ~r),
        (t.memoizedState = Va),
        n)
      : ((r = ap(e, t, n.children, r)), (t.memoizedState = null), r)
  );
}
function op(e, t, r, n) {
  var o = e.mode,
    a = e.child;
  return (
    (t = { mode: "hidden", children: t }),
    (o & 2) === 0 && a !== null
      ? ((a.childLanes = 0), (a.pendingProps = t))
      : (a = qc(t, o, 0, null)),
    (r = An(r, o, n, null)),
    (a.return = e),
    (r.return = e),
    (a.sibling = r),
    (e.child = a),
    r
  );
}
function ap(e, t, r, n) {
  var o = e.child;
  return (
    (e = o.sibling),
    (r = Cr(o, { mode: "visible", children: r })),
    (t.mode & 2) === 0 && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((e.nextEffect = null),
      (e.flags = 8),
      (t.firstEffect = t.lastEffect = e)),
    (t.child = r)
  );
}
function ip(e, t, r, n, o) {
  var a = t.mode,
    i = e.child;
  e = i.sibling;
  var l = { mode: "hidden", children: r };
  return (
    (a & 2) === 0 && t.child !== i
      ? ((r = t.child),
        (r.childLanes = 0),
        (r.pendingProps = l),
        (i = r.lastEffect),
        i !== null
          ? ((t.firstEffect = r.firstEffect),
            (t.lastEffect = i),
            (i.nextEffect = null))
          : (t.firstEffect = t.lastEffect = null))
      : (r = Cr(i, l)),
    e !== null ? (n = Cr(e, n)) : ((n = An(n, a, o, null)), (n.flags |= 2)),
    (n.return = t),
    (r.return = t),
    (r.sibling = n),
    (t.child = r),
    n
  );
}
function lp(e, t) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), Fh(e.return, t);
}
function Es(e, t, r, n, o, a) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: n,
        tail: r,
        tailMode: o,
        lastEffect: a,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = n),
      (i.tail = r),
      (i.tailMode = o),
      (i.lastEffect = a));
}
function sp(e, t, r) {
  var n = t.pendingProps,
    o = n.revealOrder,
    a = n.tail;
  if ((Be(e, t, n.children, r), (n = le.current), (n & 2) !== 0))
    (n = (n & 1) | 2), (t.flags |= 64);
  else {
    if (e !== null && (e.flags & 64) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && lp(e, r);
        else if (e.tag === 19) lp(e, r);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    n &= 1;
  }
  if ((se(le, n), (t.mode & 2) === 0)) t.memoizedState = null;
  else
    switch (o) {
      case "forwards":
        for (r = t.child, o = null; r !== null; )
          (e = r.alternate),
            e !== null && Vi(e) === null && (o = r),
            (r = r.sibling);
        (r = o),
          r === null
            ? ((o = t.child), (t.child = null))
            : ((o = r.sibling), (r.sibling = null)),
          Es(t, !1, o, r, a, t.lastEffect);
        break;
      case "backwards":
        for (r = null, o = t.child, t.child = null; o !== null; ) {
          if (((e = o.alternate), e !== null && Vi(e) === null)) {
            t.child = o;
            break;
          }
          (e = o.sibling), (o.sibling = r), (r = o), (o = e);
        }
        Es(t, !0, r, null, a, t.lastEffect);
        break;
      case "together":
        Es(t, !1, null, null, void 0, t.lastEffect);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function qt(e, t, r) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (ga |= t.lanes),
    (r & t.childLanes) !== 0)
  ) {
    if (e !== null && t.child !== e.child) throw Error(R(153));
    if (t.child !== null) {
      for (
        e = t.child, r = Cr(e, e.pendingProps), t.child = r, r.return = t;
        e.sibling !== null;

      )
        (e = e.sibling),
          (r = r.sibling = Cr(e, e.pendingProps)),
          (r.return = t);
      r.sibling = null;
    }
    return t.child;
  }
  return null;
}
var Jh, ku, e0, t0;
Jh = function (e, t) {
  for (var r = t.child; r !== null; ) {
    if (r.tag === 5 || r.tag === 6) e.appendChild(r.stateNode);
    else if (r.tag !== 4 && r.child !== null) {
      (r.child.return = r), (r = r.child);
      continue;
    }
    if (r === t) break;
    for (; r.sibling === null; ) {
      if (r.return === null || r.return === t) return;
      r = r.return;
    }
    (r.sibling.return = r.return), (r = r.sibling);
  }
};
ku = function () {};
e0 = function (e, t, r, n) {
  var o = e.memoizedProps;
  if (o !== n) {
    (e = t.stateNode), Lr(It.current);
    var a = null;
    switch (r) {
      case "input":
        (o = qs(e, o)), (n = qs(e, n)), (a = []);
        break;
      case "option":
        (o = Js(e, o)), (n = Js(e, n)), (a = []);
        break;
      case "select":
        (o = ie({}, o, { value: void 0 })),
          (n = ie({}, n, { value: void 0 })),
          (a = []);
        break;
      case "textarea":
        (o = eu(e, o)), (n = eu(e, n)), (a = []);
        break;
      default:
        typeof o.onClick != "function" &&
          typeof n.onClick == "function" &&
          (e.onclick = Bi);
    }
    nu(r, n);
    var i;
    r = null;
    for (u in o)
      if (!n.hasOwnProperty(u) && o.hasOwnProperty(u) && o[u] != null)
        if (u === "style") {
          var l = o[u];
          for (i in l) l.hasOwnProperty(i) && (r || (r = {}), (r[i] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (Uo.hasOwnProperty(u)
              ? a || (a = [])
              : (a = a || []).push(u, null));
    for (u in n) {
      var s = n[u];
      if (
        ((l = o != null ? o[u] : void 0),
        n.hasOwnProperty(u) && s !== l && (s != null || l != null))
      )
        if (u === "style")
          if (l) {
            for (i in l)
              !l.hasOwnProperty(i) ||
                (s && s.hasOwnProperty(i)) ||
                (r || (r = {}), (r[i] = ""));
            for (i in s)
              s.hasOwnProperty(i) &&
                l[i] !== s[i] &&
                (r || (r = {}), (r[i] = s[i]));
          } else r || (a || (a = []), a.push(u, r)), (r = s);
        else
          u === "dangerouslySetInnerHTML"
            ? ((s = s ? s.__html : void 0),
              (l = l ? l.__html : void 0),
              s != null && l !== s && (a = a || []).push(u, s))
            : u === "children"
            ? (typeof s != "string" && typeof s != "number") ||
              (a = a || []).push(u, "" + s)
            : u !== "suppressContentEditableWarning" &&
              u !== "suppressHydrationWarning" &&
              (Uo.hasOwnProperty(u)
                ? (s != null && u === "onScroll" && J("scroll", e),
                  a || l === s || (a = []))
                : typeof s == "object" && s !== null && s.$$typeof === vc
                ? s.toString()
                : (a = a || []).push(u, s));
    }
    r && (a = a || []).push("style", r);
    var u = a;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
t0 = function (e, t, r, n) {
  r !== n && (t.flags |= 4);
};
function ho(e, t) {
  if (!Mt)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var r = null; t !== null; )
          t.alternate !== null && (r = t), (t = t.sibling);
        r === null ? (e.tail = null) : (r.sibling = null);
        break;
      case "collapsed":
        r = e.tail;
        for (var n = null; r !== null; )
          r.alternate !== null && (n = r), (r = r.sibling);
        n === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (n.sibling = null);
    }
}
function L1(e, t, r) {
  var n = t.pendingProps;
  switch (t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return null;
    case 1:
      return Le(t.type) && Ni(), null;
    case 3:
      return (
        Fn(),
        te(Ne),
        te(Ae),
        Nc(),
        (n = t.stateNode),
        n.pendingContext &&
          ((n.context = n.pendingContext), (n.pendingContext = null)),
        (e === null || e.child === null) &&
          (Ha(t) ? (t.flags |= 4) : n.hydrate || (t.flags |= 256)),
        ku(t),
        null
      );
    case 5:
      Fc(t);
      var o = Lr(na.current);
      if (((r = t.type), e !== null && t.stateNode != null))
        e0(e, t, r, n, o), e.ref !== t.ref && (t.flags |= 128);
      else {
        if (!n) {
          if (t.stateNode === null) throw Error(R(166));
          return null;
        }
        if (((e = Lr(It.current)), Ha(t))) {
          (n = t.stateNode), (r = t.type);
          var a = t.memoizedProps;
          switch (((n[sr] = t), (n[Fi] = a), r)) {
            case "dialog":
              J("cancel", n), J("close", n);
              break;
            case "iframe":
            case "object":
            case "embed":
              J("load", n);
              break;
            case "video":
            case "audio":
              for (e = 0; e < So.length; e++) J(So[e], n);
              break;
            case "source":
              J("error", n);
              break;
            case "img":
            case "image":
            case "link":
              J("error", n), J("load", n);
              break;
            case "details":
              J("toggle", n);
              break;
            case "input":
              sd(n, a), J("invalid", n);
              break;
            case "select":
              (n._wrapperState = { wasMultiple: !!a.multiple }),
                J("invalid", n);
              break;
            case "textarea":
              cd(n, a), J("invalid", n);
          }
          nu(r, a), (e = null);
          for (var i in a)
            a.hasOwnProperty(i) &&
              ((o = a[i]),
              i === "children"
                ? typeof o == "string"
                  ? n.textContent !== o && (e = ["children", o])
                  : typeof o == "number" &&
                    n.textContent !== "" + o &&
                    (e = ["children", "" + o])
                : Uo.hasOwnProperty(i) &&
                  o != null &&
                  i === "onScroll" &&
                  J("scroll", n));
          switch (r) {
            case "input":
              Fa(n), ud(n, a, !0);
              break;
            case "textarea":
              Fa(n), fd(n);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof a.onClick == "function" && (n.onclick = Bi);
          }
          (n = e), (t.updateQueue = n), n !== null && (t.flags |= 4);
        } else {
          switch (
            ((i = o.nodeType === 9 ? o : o.ownerDocument),
            e === tu.html && (e = Xm(r)),
            e === tu.html
              ? r === "script"
                ? ((e = i.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof n.is == "string"
                ? (e = i.createElement(r, { is: n.is }))
                : ((e = i.createElement(r)),
                  r === "select" &&
                    ((i = e),
                    n.multiple
                      ? (i.multiple = !0)
                      : n.size && (i.size = n.size)))
              : (e = i.createElementNS(e, r)),
            (e[sr] = t),
            (e[Fi] = n),
            Jh(e, t, !1, !1),
            (t.stateNode = e),
            (i = ou(r, n)),
            r)
          ) {
            case "dialog":
              J("cancel", e), J("close", e), (o = n);
              break;
            case "iframe":
            case "object":
            case "embed":
              J("load", e), (o = n);
              break;
            case "video":
            case "audio":
              for (o = 0; o < So.length; o++) J(So[o], e);
              o = n;
              break;
            case "source":
              J("error", e), (o = n);
              break;
            case "img":
            case "image":
            case "link":
              J("error", e), J("load", e), (o = n);
              break;
            case "details":
              J("toggle", e), (o = n);
              break;
            case "input":
              sd(e, n), (o = qs(e, n)), J("invalid", e);
              break;
            case "option":
              o = Js(e, n);
              break;
            case "select":
              (e._wrapperState = { wasMultiple: !!n.multiple }),
                (o = ie({}, n, { value: void 0 })),
                J("invalid", e);
              break;
            case "textarea":
              cd(e, n), (o = eu(e, n)), J("invalid", e);
              break;
            default:
              o = n;
          }
          nu(r, o);
          var l = o;
          for (a in l)
            if (l.hasOwnProperty(a)) {
              var s = l[a];
              a === "style"
                ? Km(e, s)
                : a === "dangerouslySetInnerHTML"
                ? ((s = s ? s.__html : void 0), s != null && Qm(e, s))
                : a === "children"
                ? typeof s == "string"
                  ? (r !== "textarea" || s !== "") && Go(e, s)
                  : typeof s == "number" && Go(e, "" + s)
                : a !== "suppressContentEditableWarning" &&
                  a !== "suppressHydrationWarning" &&
                  a !== "autoFocus" &&
                  (Uo.hasOwnProperty(a)
                    ? s != null && a === "onScroll" && J("scroll", e)
                    : s != null && cc(e, a, s, i));
            }
          switch (r) {
            case "input":
              Fa(e), ud(e, n, !1);
              break;
            case "textarea":
              Fa(e), fd(e);
              break;
            case "option":
              n.value != null && e.setAttribute("value", "" + wr(n.value));
              break;
            case "select":
              (e.multiple = !!n.multiple),
                (a = n.value),
                a != null
                  ? kn(e, !!n.multiple, a, !1)
                  : n.defaultValue != null &&
                    kn(e, !!n.multiple, n.defaultValue, !0);
              break;
            default:
              typeof o.onClick == "function" && (e.onclick = Bi);
          }
          Ph(r, n) && (t.flags |= 4);
        }
        t.ref !== null && (t.flags |= 128);
      }
      return null;
    case 6:
      if (e && t.stateNode != null) t0(e, t, e.memoizedProps, n);
      else {
        if (typeof n != "string" && t.stateNode === null) throw Error(R(166));
        (r = Lr(na.current)),
          Lr(It.current),
          Ha(t)
            ? ((n = t.stateNode),
              (r = t.memoizedProps),
              (n[sr] = t),
              n.nodeValue !== r && (t.flags |= 4))
            : ((n = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(n)),
              (n[sr] = t),
              (t.stateNode = n));
      }
      return null;
    case 13:
      return (
        te(le),
        (n = t.memoizedState),
        (t.flags & 64) !== 0
          ? ((t.lanes = r), t)
          : ((n = n !== null),
            (r = !1),
            e === null
              ? t.memoizedProps.fallback !== void 0 && Ha(t)
              : (r = e.memoizedState !== null),
            n &&
              !r &&
              (t.mode & 2) !== 0 &&
              ((e === null &&
                t.memoizedProps.unstable_avoidThisFallback !== !0) ||
              (le.current & 1) !== 0
                ? Ee === 0 && (Ee = 3)
                : ((Ee === 0 || Ee === 3) && (Ee = 4),
                  ze === null ||
                    ((ga & 134217727) === 0 && (Un & 134217727) === 0) ||
                    $n(ze, Re))),
            (n || r) && (t.flags |= 4),
            null)
      );
    case 4:
      return Fn(), ku(t), e === null && _h(t.stateNode.containerInfo), null;
    case 10:
      return Oc(t), null;
    case 17:
      return Le(t.type) && Ni(), null;
    case 19:
      if ((te(le), (n = t.memoizedState), n === null)) return null;
      if (((a = (t.flags & 64) !== 0), (i = n.rendering), i === null))
        if (a) ho(n, !1);
        else {
          if (Ee !== 0 || (e !== null && (e.flags & 64) !== 0))
            for (e = t.child; e !== null; ) {
              if (((i = Vi(e)), i !== null)) {
                for (
                  t.flags |= 64,
                    ho(n, !1),
                    a = i.updateQueue,
                    a !== null && ((t.updateQueue = a), (t.flags |= 4)),
                    n.lastEffect === null && (t.firstEffect = null),
                    t.lastEffect = n.lastEffect,
                    n = r,
                    r = t.child;
                  r !== null;

                )
                  (a = r),
                    (e = n),
                    (a.flags &= 2),
                    (a.nextEffect = null),
                    (a.firstEffect = null),
                    (a.lastEffect = null),
                    (i = a.alternate),
                    i === null
                      ? ((a.childLanes = 0),
                        (a.lanes = e),
                        (a.child = null),
                        (a.memoizedProps = null),
                        (a.memoizedState = null),
                        (a.updateQueue = null),
                        (a.dependencies = null),
                        (a.stateNode = null))
                      : ((a.childLanes = i.childLanes),
                        (a.lanes = i.lanes),
                        (a.child = i.child),
                        (a.memoizedProps = i.memoizedProps),
                        (a.memoizedState = i.memoizedState),
                        (a.updateQueue = i.updateQueue),
                        (a.type = i.type),
                        (e = i.dependencies),
                        (a.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (r = r.sibling);
                return se(le, (le.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          n.tail !== null &&
            $e() > $u &&
            ((t.flags |= 64), (a = !0), ho(n, !1), (t.lanes = 33554432));
        }
      else {
        if (!a)
          if (((e = Vi(i)), e !== null)) {
            if (
              ((t.flags |= 64),
              (a = !0),
              (r = e.updateQueue),
              r !== null && ((t.updateQueue = r), (t.flags |= 4)),
              ho(n, !0),
              n.tail === null && n.tailMode === "hidden" && !i.alternate && !Mt)
            )
              return (
                (t = t.lastEffect = n.lastEffect),
                t !== null && (t.nextEffect = null),
                null
              );
          } else
            2 * $e() - n.renderingStartTime > $u &&
              r !== 1073741824 &&
              ((t.flags |= 64), (a = !0), ho(n, !1), (t.lanes = 33554432));
        n.isBackwards
          ? ((i.sibling = t.child), (t.child = i))
          : ((r = n.last),
            r !== null ? (r.sibling = i) : (t.child = i),
            (n.last = i));
      }
      return n.tail !== null
        ? ((r = n.tail),
          (n.rendering = r),
          (n.tail = r.sibling),
          (n.lastEffect = t.lastEffect),
          (n.renderingStartTime = $e()),
          (r.sibling = null),
          (t = le.current),
          se(le, a ? (t & 1) | 2 : t & 1),
          r)
        : null;
    case 23:
    case 24:
      return (
        Xc(),
        e !== null &&
          (e.memoizedState !== null) != (t.memoizedState !== null) &&
          n.mode !== "unstable-defer-without-hiding" &&
          (t.flags |= 4),
        null
      );
  }
  throw Error(R(156, t.tag));
}
function j1(e) {
  switch (e.tag) {
    case 1:
      Le(e.type) && Ni();
      var t = e.flags;
      return t & 4096 ? ((e.flags = (t & -4097) | 64), e) : null;
    case 3:
      if ((Fn(), te(Ne), te(Ae), Nc(), (t = e.flags), (t & 64) !== 0))
        throw Error(R(285));
      return (e.flags = (t & -4097) | 64), e;
    case 5:
      return Fc(e), null;
    case 13:
      return (
        te(le),
        (t = e.flags),
        t & 4096 ? ((e.flags = (t & -4097) | 64), e) : null
      );
    case 19:
      return te(le), null;
    case 4:
      return Fn(), null;
    case 10:
      return Oc(e), null;
    case 23:
    case 24:
      return Xc(), null;
    default:
      return null;
  }
}
function Vc(e, t) {
  try {
    var r = "",
      n = t;
    do (r += Sy(n)), (n = n.return);
    while (n);
    var o = r;
  } catch (a) {
    o =
      `
Error generating stack: ` +
      a.message +
      `
` +
      a.stack;
  }
  return { value: e, source: t, stack: o };
}
function Eu(e, t) {
  try {
    console.error(t.value);
  } catch (r) {
    setTimeout(function () {
      throw r;
    });
  }
}
var D1 = typeof WeakMap == "function" ? WeakMap : Map;
function r0(e, t, r) {
  (r = hr(-1, r)), (r.tag = 3), (r.payload = { element: null });
  var n = t.value;
  return (
    (r.callback = function () {
      Ki || ((Ki = !0), (Ru = n)), Eu(e, t);
    }),
    r
  );
}
function n0(e, t, r) {
  (r = hr(-1, r)), (r.tag = 3);
  var n = e.type.getDerivedStateFromError;
  if (typeof n == "function") {
    var o = t.value;
    r.payload = function () {
      return Eu(e, t), n(o);
    };
  }
  var a = e.stateNode;
  return (
    a !== null &&
      typeof a.componentDidCatch == "function" &&
      (r.callback = function () {
        typeof n != "function" &&
          (At === null ? (At = new Set([this])) : At.add(this), Eu(e, t));
        var i = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: i !== null ? i : "",
        });
      }),
    r
  );
}
var W1 = typeof WeakSet == "function" ? WeakSet : Set;
function up(e) {
  var t = e.ref;
  if (t !== null)
    if (typeof t == "function")
      try {
        t(null);
      } catch (r) {
        br(e, r);
      }
    else t.current = null;
}
function H1(e, t) {
  switch (t.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
      return;
    case 1:
      if (t.flags & 256 && e !== null) {
        var r = e.memoizedProps,
          n = e.memoizedState;
        (e = t.stateNode),
          (t = e.getSnapshotBeforeUpdate(
            t.elementType === t.type ? r : yt(t.type, r),
            n
          )),
          (e.__reactInternalSnapshotBeforeUpdate = t);
      }
      return;
    case 3:
      t.flags & 256 && Ac(t.stateNode.containerInfo);
      return;
    case 5:
    case 6:
    case 4:
    case 17:
      return;
  }
  throw Error(R(163));
}
function V1(e, t, r) {
  switch (r.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
      if (
        ((t = r.updateQueue),
        (t = t !== null ? t.lastEffect : null),
        t !== null)
      ) {
        e = t = t.next;
        do {
          if ((e.tag & 3) === 3) {
            var n = e.create;
            e.destroy = n();
          }
          e = e.next;
        } while (e !== t);
      }
      if (
        ((t = r.updateQueue),
        (t = t !== null ? t.lastEffect : null),
        t !== null)
      ) {
        e = t = t.next;
        do {
          var o = e;
          (n = o.next),
            (o = o.tag),
            (o & 4) !== 0 && (o & 1) !== 0 && (d0(r, e), Z1(r, e)),
            (e = n);
        } while (e !== t);
      }
      return;
    case 1:
      (e = r.stateNode),
        r.flags & 4 &&
          (t === null
            ? e.componentDidMount()
            : ((n =
                r.elementType === r.type
                  ? t.memoizedProps
                  : yt(r.type, t.memoizedProps)),
              e.componentDidUpdate(
                n,
                t.memoizedState,
                e.__reactInternalSnapshotBeforeUpdate
              ))),
        (t = r.updateQueue),
        t !== null && Vd(r, t, e);
      return;
    case 3:
      if (((t = r.updateQueue), t !== null)) {
        if (((e = null), r.child !== null))
          switch (r.child.tag) {
            case 5:
              e = r.child.stateNode;
              break;
            case 1:
              e = r.child.stateNode;
          }
        Vd(r, t, e);
      }
      return;
    case 5:
      (e = r.stateNode),
        t === null && r.flags & 4 && Ph(r.type, r.memoizedProps) && e.focus();
      return;
    case 6:
      return;
    case 4:
      return;
    case 12:
      return;
    case 13:
      r.memoizedState === null &&
        ((r = r.alternate),
        r !== null &&
          ((r = r.memoizedState),
          r !== null && ((r = r.dehydrated), r !== null && lh(r))));
      return;
    case 19:
    case 17:
    case 20:
    case 21:
    case 23:
    case 24:
      return;
  }
  throw Error(R(163));
}
function cp(e, t) {
  for (var r = e; ; ) {
    if (r.tag === 5) {
      var n = r.stateNode;
      if (t)
        (n = n.style),
          typeof n.setProperty == "function"
            ? n.setProperty("display", "none", "important")
            : (n.display = "none");
      else {
        n = r.stateNode;
        var o = r.memoizedProps.style;
        (o = o != null && o.hasOwnProperty("display") ? o.display : null),
          (n.style.display = qm("display", o));
      }
    } else if (r.tag === 6) r.stateNode.nodeValue = t ? "" : r.memoizedProps;
    else if (
      ((r.tag !== 23 && r.tag !== 24) || r.memoizedState === null || r === e) &&
      r.child !== null
    ) {
      (r.child.return = r), (r = r.child);
      continue;
    }
    if (r === e) break;
    for (; r.sibling === null; ) {
      if (r.return === null || r.return === e) return;
      r = r.return;
    }
    (r.sibling.return = r.return), (r = r.sibling);
  }
}
function fp(e, t) {
  if (Ur && typeof Ur.onCommitFiberUnmount == "function")
    try {
      Ur.onCommitFiberUnmount(zc, t);
    } catch {}
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      if (
        ((e = t.updateQueue), e !== null && ((e = e.lastEffect), e !== null))
      ) {
        var r = (e = e.next);
        do {
          var n = r,
            o = n.destroy;
          if (((n = n.tag), o !== void 0))
            if ((n & 4) !== 0) d0(t, r);
            else {
              n = t;
              try {
                o();
              } catch (a) {
                br(n, a);
              }
            }
          r = r.next;
        } while (r !== e);
      }
      break;
    case 1:
      if (
        (up(t), (e = t.stateNode), typeof e.componentWillUnmount == "function")
      )
        try {
          (e.props = t.memoizedProps),
            (e.state = t.memoizedState),
            e.componentWillUnmount();
        } catch (a) {
          br(t, a);
        }
      break;
    case 5:
      up(t);
      break;
    case 4:
      o0(e, t);
  }
}
function dp(e) {
  (e.alternate = null),
    (e.child = null),
    (e.dependencies = null),
    (e.firstEffect = null),
    (e.lastEffect = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.return = null),
    (e.updateQueue = null);
}
function pp(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function mp(e) {
  e: {
    for (var t = e.return; t !== null; ) {
      if (pp(t)) break e;
      t = t.return;
    }
    throw Error(R(160));
  }
  var r = t;
  switch (((t = r.stateNode), r.tag)) {
    case 5:
      var n = !1;
      break;
    case 3:
      (t = t.containerInfo), (n = !0);
      break;
    case 4:
      (t = t.containerInfo), (n = !0);
      break;
    default:
      throw Error(R(161));
  }
  r.flags & 16 && (Go(t, ""), (r.flags &= -17));
  e: t: for (r = e; ; ) {
    for (; r.sibling === null; ) {
      if (r.return === null || pp(r.return)) {
        r = null;
        break e;
      }
      r = r.return;
    }
    for (
      r.sibling.return = r.return, r = r.sibling;
      r.tag !== 5 && r.tag !== 6 && r.tag !== 18;

    ) {
      if (r.flags & 2 || r.child === null || r.tag === 4) continue t;
      (r.child.return = r), (r = r.child);
    }
    if (!(r.flags & 2)) {
      r = r.stateNode;
      break e;
    }
  }
  n ? _u(e, r, t) : Cu(e, r, t);
}
function _u(e, t, r) {
  var n = e.tag,
    o = n === 5 || n === 6;
  if (o)
    (e = o ? e.stateNode : e.stateNode.instance),
      t
        ? r.nodeType === 8
          ? r.parentNode.insertBefore(e, t)
          : r.insertBefore(e, t)
        : (r.nodeType === 8
            ? ((t = r.parentNode), t.insertBefore(e, r))
            : ((t = r), t.appendChild(e)),
          (r = r._reactRootContainer),
          r != null || t.onclick !== null || (t.onclick = Bi));
  else if (n !== 4 && ((e = e.child), e !== null))
    for (_u(e, t, r), e = e.sibling; e !== null; ) _u(e, t, r), (e = e.sibling);
}
function Cu(e, t, r) {
  var n = e.tag,
    o = n === 5 || n === 6;
  if (o)
    (e = o ? e.stateNode : e.stateNode.instance),
      t ? r.insertBefore(e, t) : r.appendChild(e);
  else if (n !== 4 && ((e = e.child), e !== null))
    for (Cu(e, t, r), e = e.sibling; e !== null; ) Cu(e, t, r), (e = e.sibling);
}
function o0(e, t) {
  for (var r = t, n = !1, o, a; ; ) {
    if (!n) {
      n = r.return;
      e: for (;;) {
        if (n === null) throw Error(R(160));
        switch (((o = n.stateNode), n.tag)) {
          case 5:
            a = !1;
            break e;
          case 3:
            (o = o.containerInfo), (a = !0);
            break e;
          case 4:
            (o = o.containerInfo), (a = !0);
            break e;
        }
        n = n.return;
      }
      n = !0;
    }
    if (r.tag === 5 || r.tag === 6) {
      e: for (var i = e, l = r, s = l; ; )
        if ((fp(i, s), s.child !== null && s.tag !== 4))
          (s.child.return = s), (s = s.child);
        else {
          if (s === l) break e;
          for (; s.sibling === null; ) {
            if (s.return === null || s.return === l) break e;
            s = s.return;
          }
          (s.sibling.return = s.return), (s = s.sibling);
        }
      a
        ? ((i = o),
          (l = r.stateNode),
          i.nodeType === 8 ? i.parentNode.removeChild(l) : i.removeChild(l))
        : o.removeChild(r.stateNode);
    } else if (r.tag === 4) {
      if (r.child !== null) {
        (o = r.stateNode.containerInfo),
          (a = !0),
          (r.child.return = r),
          (r = r.child);
        continue;
      }
    } else if ((fp(e, r), r.child !== null)) {
      (r.child.return = r), (r = r.child);
      continue;
    }
    if (r === t) break;
    for (; r.sibling === null; ) {
      if (r.return === null || r.return === t) return;
      (r = r.return), r.tag === 4 && (n = !1);
    }
    (r.sibling.return = r.return), (r = r.sibling);
  }
}
function _s(e, t) {
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      var r = t.updateQueue;
      if (((r = r !== null ? r.lastEffect : null), r !== null)) {
        var n = (r = r.next);
        do
          (n.tag & 3) === 3 &&
            ((e = n.destroy), (n.destroy = void 0), e !== void 0 && e()),
            (n = n.next);
        while (n !== r);
      }
      return;
    case 1:
      return;
    case 5:
      if (((r = t.stateNode), r != null)) {
        n = t.memoizedProps;
        var o = e !== null ? e.memoizedProps : n;
        e = t.type;
        var a = t.updateQueue;
        if (((t.updateQueue = null), a !== null)) {
          for (
            r[Fi] = n,
              e === "input" && n.type === "radio" && n.name != null && Gm(r, n),
              ou(e, o),
              t = ou(e, n),
              o = 0;
            o < a.length;
            o += 2
          ) {
            var i = a[o],
              l = a[o + 1];
            i === "style"
              ? Km(r, l)
              : i === "dangerouslySetInnerHTML"
              ? Qm(r, l)
              : i === "children"
              ? Go(r, l)
              : cc(r, i, l, t);
          }
          switch (e) {
            case "input":
              Ks(r, n);
              break;
            case "textarea":
              Ym(r, n);
              break;
            case "select":
              (e = r._wrapperState.wasMultiple),
                (r._wrapperState.wasMultiple = !!n.multiple),
                (a = n.value),
                a != null
                  ? kn(r, !!n.multiple, a, !1)
                  : e !== !!n.multiple &&
                    (n.defaultValue != null
                      ? kn(r, !!n.multiple, n.defaultValue, !0)
                      : kn(r, !!n.multiple, n.multiple ? [] : "", !1));
          }
        }
      }
      return;
    case 6:
      if (t.stateNode === null) throw Error(R(162));
      t.stateNode.nodeValue = t.memoizedProps;
      return;
    case 3:
      (r = t.stateNode), r.hydrate && ((r.hydrate = !1), lh(r.containerInfo));
      return;
    case 12:
      return;
    case 13:
      t.memoizedState !== null && ((Yc = $e()), cp(t.child, !0)), hp(t);
      return;
    case 19:
      hp(t);
      return;
    case 17:
      return;
    case 23:
    case 24:
      cp(t, t.memoizedState !== null);
      return;
  }
  throw Error(R(163));
}
function hp(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var r = e.stateNode;
    r === null && (r = e.stateNode = new W1()),
      t.forEach(function (n) {
        var o = tb.bind(null, e, n);
        r.has(n) || (r.add(n), n.then(o, o));
      });
  }
}
function U1(e, t) {
  return e !== null &&
    ((e = e.memoizedState), e === null || e.dehydrated !== null)
    ? ((t = t.memoizedState), t !== null && t.dehydrated === null)
    : !1;
}
var G1 = Math.ceil,
  qi = en.ReactCurrentDispatcher,
  Uc = en.ReactCurrentOwner,
  N = 0,
  ze = null,
  me = null,
  Re = 0,
  Zr = 0,
  Tu = Tr(0),
  Ee = 0,
  kl = null,
  Vn = 0,
  ga = 0,
  Un = 0,
  Gc = 0,
  Pu = null,
  Yc = 0,
  $u = 1 / 0;
function Gn() {
  $u = $e() + 500;
}
var M = null,
  Ki = !1,
  Ru = null,
  At = null,
  _r = !1,
  Io = null,
  xo = 90,
  Au = [],
  zu = [],
  Jt = null,
  Mo = 0,
  Iu = null,
  yi = -1,
  Yt = 0,
  bi = 0,
  Oo = null,
  Si = !1;
function Ye() {
  return (N & 48) !== 0 ? $e() : yi !== -1 ? yi : (yi = $e());
}
function gr(e) {
  if (((e = e.mode), (e & 2) === 0)) return 1;
  if ((e & 4) === 0) return Bn() === 99 ? 1 : 2;
  if ((Yt === 0 && (Yt = Vn), I1.transition !== 0)) {
    bi !== 0 && (bi = Pu !== null ? Pu.pendingLanes : 0), (e = Yt);
    var t = 4186112 & ~bi;
    return (
      (t &= -t),
      t === 0 && ((e = 4186112 & ~e), (t = e & -e), t === 0 && (t = 8192)),
      t
    );
  }
  return (
    (e = Bn()),
    (N & 4) !== 0 && e === 98
      ? (e = Mi(12, Yt))
      : ((e = By(e)), (e = Mi(e, Yt))),
    e
  );
}
function yr(e, t, r) {
  if (50 < Mo) throw ((Mo = 0), (Iu = null), Error(R(185)));
  if (((e = El(e, t)), e === null)) return null;
  vl(e, t, r), e === ze && ((Un |= t), Ee === 4 && $n(e, Re));
  var n = Bn();
  t === 1
    ? (N & 8) !== 0 && (N & 48) === 0
      ? Mu(e)
      : (ft(e, r), N === 0 && (Gn(), Nt()))
    : ((N & 4) === 0 ||
        (n !== 98 && n !== 99) ||
        (Jt === null ? (Jt = new Set([e])) : Jt.add(e)),
      ft(e, r)),
    (Pu = e);
}
function El(e, t) {
  e.lanes |= t;
  var r = e.alternate;
  for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (r = e.alternate),
      r !== null && (r.childLanes |= t),
      (r = e),
      (e = e.return);
  return r.tag === 3 ? r.stateNode : null;
}
function ft(e, t) {
  for (
    var r = e.callbackNode,
      n = e.suspendedLanes,
      o = e.pingedLanes,
      a = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;

  ) {
    var l = 31 - kr(i),
      s = 1 << l,
      u = a[l];
    if (u === -1) {
      if ((s & n) === 0 || (s & o) !== 0) {
        (u = t), un(s);
        var p = Z;
        a[l] = 10 <= p ? u + 250 : 6 <= p ? u + 5e3 : -1;
      }
    } else u <= t && (e.expiredLanes |= s);
    i &= ~s;
  }
  if (((n = qo(e, e === ze ? Re : 0)), (t = Z), n === 0))
    r !== null &&
      (r !== Ss && hu(r), (e.callbackNode = null), (e.callbackPriority = 0));
  else {
    if (r !== null) {
      if (e.callbackPriority === t) return;
      r !== Ss && hu(r);
    }
    t === 15
      ? ((r = Mu.bind(null, e)),
        Gt === null ? ((Gt = [r]), (gi = Ic(xl, Bh))) : Gt.push(r),
        (r = Ss))
      : t === 14
      ? (r = ea(99, Mu.bind(null, e)))
      : ((r = Fy(t)), (r = ea(r, a0.bind(null, e)))),
      (e.callbackPriority = t),
      (e.callbackNode = r);
  }
}
function a0(e) {
  if (((yi = -1), (bi = Yt = 0), (N & 48) !== 0)) throw Error(R(327));
  var t = e.callbackNode;
  if (Pr() && e.callbackNode !== t) return null;
  var r = qo(e, e === ze ? Re : 0);
  if (r === 0) return null;
  var n = r,
    o = N;
  N |= 16;
  var a = u0();
  (ze !== e || Re !== n) && (Gn(), Rn(e, n));
  do
    try {
      Q1();
      break;
    } catch (l) {
      s0(e, l);
    }
  while (1);
  if (
    (Mc(),
    (qi.current = a),
    (N = o),
    me !== null ? (n = 0) : ((ze = null), (Re = 0), (n = Ee)),
    (Vn & Un) !== 0)
  )
    Rn(e, 0);
  else if (n !== 0) {
    if (
      (n === 2 &&
        ((N |= 64),
        e.hydrate && ((e.hydrate = !1), Ac(e.containerInfo)),
        (r = mh(e)),
        r !== 0 && (n = wo(e, r))),
      n === 1)
    )
      throw ((t = kl), Rn(e, 0), $n(e, r), ft(e, $e()), t);
    switch (
      ((e.finishedWork = e.current.alternate), (e.finishedLanes = r), n)
    ) {
      case 0:
      case 1:
        throw Error(R(345));
      case 2:
        Ir(e);
        break;
      case 3:
        if (
          ($n(e, r), (r & 62914560) === r && ((n = Yc + 500 - $e()), 10 < n))
        ) {
          if (qo(e, 0) !== 0) break;
          if (((o = e.suspendedLanes), (o & r) !== r)) {
            Ye(), (e.pingedLanes |= e.suspendedLanes & o);
            break;
          }
          e.timeoutHandle = Bd(Ir.bind(null, e), n);
          break;
        }
        Ir(e);
        break;
      case 4:
        if (($n(e, r), (r & 4186112) === r)) break;
        for (n = e.eventTimes, o = -1; 0 < r; ) {
          var i = 31 - kr(r);
          (a = 1 << i), (i = n[i]), i > o && (o = i), (r &= ~a);
        }
        if (
          ((r = o),
          (r = $e() - r),
          (r =
            (120 > r
              ? 120
              : 480 > r
              ? 480
              : 1080 > r
              ? 1080
              : 1920 > r
              ? 1920
              : 3e3 > r
              ? 3e3
              : 4320 > r
              ? 4320
              : 1960 * G1(r / 1960)) - r),
          10 < r)
        ) {
          e.timeoutHandle = Bd(Ir.bind(null, e), r);
          break;
        }
        Ir(e);
        break;
      case 5:
        Ir(e);
        break;
      default:
        throw Error(R(329));
    }
  }
  return ft(e, $e()), e.callbackNode === t ? a0.bind(null, e) : null;
}
function $n(e, t) {
  for (
    t &= ~Gc,
      t &= ~Un,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var r = 31 - kr(t),
      n = 1 << r;
    (e[r] = -1), (t &= ~n);
  }
}
function Mu(e) {
  if ((N & 48) !== 0) throw Error(R(327));
  if ((Pr(), e === ze && (e.expiredLanes & Re) !== 0)) {
    var t = Re,
      r = wo(e, t);
    (Vn & Un) !== 0 && ((t = qo(e, t)), (r = wo(e, t)));
  } else (t = qo(e, 0)), (r = wo(e, t));
  if (
    (e.tag !== 0 &&
      r === 2 &&
      ((N |= 64),
      e.hydrate && ((e.hydrate = !1), Ac(e.containerInfo)),
      (t = mh(e)),
      t !== 0 && (r = wo(e, t))),
    r === 1)
  )
    throw ((r = kl), Rn(e, 0), $n(e, t), ft(e, $e()), r);
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Ir(e),
    ft(e, $e()),
    null
  );
}
function Y1() {
  if (Jt !== null) {
    var e = Jt;
    (Jt = null),
      e.forEach(function (t) {
        (t.expiredLanes |= 24 & t.pendingLanes), ft(t, $e());
      });
  }
  Nt();
}
function i0(e, t) {
  var r = N;
  N |= 1;
  try {
    return e(t);
  } finally {
    (N = r), N === 0 && (Gn(), Nt());
  }
}
function l0(e, t) {
  var r = N;
  (N &= -2), (N |= 8);
  try {
    return e(t);
  } finally {
    (N = r), N === 0 && (Gn(), Nt());
  }
}
function Ua(e, t) {
  se(Tu, Zr), (Zr |= t), (Vn |= t);
}
function Xc() {
  (Zr = Tu.current), te(Tu);
}
function Rn(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var r = e.timeoutHandle;
  if ((r !== -1 && ((e.timeoutHandle = -1), T1(r)), me !== null))
    for (r = me.return; r !== null; ) {
      var n = r;
      switch (n.tag) {
        case 1:
          (n = n.type.childContextTypes), n != null && Ni();
          break;
        case 3:
          Fn(), te(Ne), te(Ae), Nc();
          break;
        case 5:
          Fc(n);
          break;
        case 4:
          Fn();
          break;
        case 13:
          te(le);
          break;
        case 19:
          te(le);
          break;
        case 10:
          Oc(n);
          break;
        case 23:
        case 24:
          Xc();
      }
      r = r.return;
    }
  (ze = e),
    (me = Cr(e.current, null)),
    (Re = Zr = Vn = t),
    (Ee = 0),
    (kl = null),
    (Gc = Un = ga = 0);
}
function s0(e, t) {
  do {
    var r = me;
    try {
      if ((Mc(), (Ao.current = Qi), Ui)) {
        for (var n = ue.memoizedState; n !== null; ) {
          var o = n.queue;
          o !== null && (o.pending = null), (n = n.next);
        }
        Ui = !1;
      }
      if (
        ((oa = 0),
        (we = Pe = ue = null),
        (zo = !1),
        (Uc.current = null),
        r === null || r.return === null)
      ) {
        (Ee = 1), (kl = t), (me = null);
        break;
      }
      e: {
        var a = e,
          i = r.return,
          l = r,
          s = t;
        if (
          ((t = Re),
          (l.flags |= 2048),
          (l.firstEffect = l.lastEffect = null),
          s !== null && typeof s == "object" && typeof s.then == "function")
        ) {
          var u = s;
          if ((l.mode & 2) === 0) {
            var p = l.alternate;
            p
              ? ((l.updateQueue = p.updateQueue),
                (l.memoizedState = p.memoizedState),
                (l.lanes = p.lanes))
              : ((l.updateQueue = null), (l.memoizedState = null));
          }
          var g = (le.current & 1) !== 0,
            v = i;
          do {
            var m;
            if ((m = v.tag === 13)) {
              var y = v.memoizedState;
              if (y !== null) m = y.dehydrated !== null;
              else {
                var w = v.memoizedProps;
                m =
                  w.fallback === void 0
                    ? !1
                    : w.unstable_avoidThisFallback !== !0
                    ? !0
                    : !g;
              }
            }
            if (m) {
              var h = v.updateQueue;
              if (h === null) {
                var c = new Set();
                c.add(u), (v.updateQueue = c);
              } else h.add(u);
              if ((v.mode & 2) === 0) {
                if (
                  ((v.flags |= 64),
                  (l.flags |= 16384),
                  (l.flags &= -2981),
                  l.tag === 1)
                )
                  if (l.alternate === null) l.tag = 17;
                  else {
                    var d = hr(-1, 1);
                    (d.tag = 2), vr(l, d);
                  }
                l.lanes |= 1;
                break e;
              }
              (s = void 0), (l = t);
              var x = a.pingCache;
              if (
                (x === null
                  ? ((x = a.pingCache = new D1()), (s = new Set()), x.set(u, s))
                  : ((s = x.get(u)),
                    s === void 0 && ((s = new Set()), x.set(u, s))),
                !s.has(l))
              ) {
                s.add(l);
                var k = eb.bind(null, a, u, l);
                u.then(k, k);
              }
              (v.flags |= 4096), (v.lanes = t);
              break e;
            }
            v = v.return;
          } while (v !== null);
          s = Error(
            (wn(l.type) || "A React component") +
              ` suspended while rendering, but no fallback UI was specified.

Add a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.`
          );
        }
        Ee !== 5 && (Ee = 2), (s = Vc(s, l)), (v = i);
        do {
          switch (v.tag) {
            case 3:
              (a = s), (v.flags |= 4096), (t &= -t), (v.lanes |= t);
              var $ = r0(v, a, t);
              Hd(v, $);
              break e;
            case 1:
              a = s;
              var T = v.type,
                P = v.stateNode;
              if (
                (v.flags & 64) === 0 &&
                (typeof T.getDerivedStateFromError == "function" ||
                  (P !== null &&
                    typeof P.componentDidCatch == "function" &&
                    (At === null || !At.has(P))))
              ) {
                (v.flags |= 4096), (t &= -t), (v.lanes |= t);
                var O = n0(v, a, t);
                Hd(v, O);
                break e;
              }
          }
          v = v.return;
        } while (v !== null);
      }
      f0(r);
    } catch (A) {
      (t = A), me === r && r !== null && (me = r = r.return);
      continue;
    }
    break;
  } while (1);
}
function u0() {
  var e = qi.current;
  return (qi.current = Qi), e === null ? Qi : e;
}
function wo(e, t) {
  var r = N;
  N |= 16;
  var n = u0();
  (ze === e && Re === t) || Rn(e, t);
  do
    try {
      X1();
      break;
    } catch (o) {
      s0(e, o);
    }
  while (1);
  if ((Mc(), (N = r), (qi.current = n), me !== null)) throw Error(R(261));
  return (ze = null), (Re = 0), Ee;
}
function X1() {
  for (; me !== null; ) c0(me);
}
function Q1() {
  for (; me !== null && !R1(); ) c0(me);
}
function c0(e) {
  var t = p0(e.alternate, e, Zr);
  (e.memoizedProps = e.pendingProps),
    t === null ? f0(e) : (me = t),
    (Uc.current = null);
}
function f0(e) {
  var t = e;
  do {
    var r = t.alternate;
    if (((e = t.return), (t.flags & 2048) === 0)) {
      if (((r = L1(r, t, Zr)), r !== null)) {
        me = r;
        return;
      }
      if (
        ((r = t),
        (r.tag !== 24 && r.tag !== 23) ||
          r.memoizedState === null ||
          (Zr & 1073741824) !== 0 ||
          (r.mode & 4) === 0)
      ) {
        for (var n = 0, o = r.child; o !== null; )
          (n |= o.lanes | o.childLanes), (o = o.sibling);
        r.childLanes = n;
      }
      e !== null &&
        (e.flags & 2048) === 0 &&
        (e.firstEffect === null && (e.firstEffect = t.firstEffect),
        t.lastEffect !== null &&
          (e.lastEffect !== null && (e.lastEffect.nextEffect = t.firstEffect),
          (e.lastEffect = t.lastEffect)),
        1 < t.flags &&
          (e.lastEffect !== null
            ? (e.lastEffect.nextEffect = t)
            : (e.firstEffect = t),
          (e.lastEffect = t)));
    } else {
      if (((r = j1(t)), r !== null)) {
        (r.flags &= 2047), (me = r);
        return;
      }
      e !== null && ((e.firstEffect = e.lastEffect = null), (e.flags |= 2048));
    }
    if (((t = t.sibling), t !== null)) {
      me = t;
      return;
    }
    me = t = e;
  } while (t !== null);
  Ee === 0 && (Ee = 5);
}
function Ir(e) {
  var t = Bn();
  return Kr(99, q1.bind(null, e, t)), null;
}
function q1(e, t) {
  do Pr();
  while (Io !== null);
  if ((N & 48) !== 0) throw Error(R(327));
  var r = e.finishedWork;
  if (r === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), r === e.current))
    throw Error(R(177));
  e.callbackNode = null;
  var n = r.lanes | r.childLanes,
    o = n,
    a = e.pendingLanes & ~o;
  (e.pendingLanes = o),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= o),
    (e.mutableReadLanes &= o),
    (e.entangledLanes &= o),
    (o = e.entanglements);
  for (var i = e.eventTimes, l = e.expirationTimes; 0 < a; ) {
    var s = 31 - kr(a),
      u = 1 << s;
    (o[s] = 0), (i[s] = -1), (l[s] = -1), (a &= ~u);
  }
  if (
    (Jt !== null && (n & 24) === 0 && Jt.has(e) && Jt.delete(e),
    e === ze && ((me = ze = null), (Re = 0)),
    1 < r.flags
      ? r.lastEffect !== null
        ? ((r.lastEffect.nextEffect = r), (n = r.firstEffect))
        : (n = r)
      : (n = r.firstEffect),
    n !== null)
  ) {
    if (
      ((o = N), (N |= 32), (Uc.current = null), (gs = pi), (i = $d()), cu(i))
    ) {
      if ("selectionStart" in i)
        l = { start: i.selectionStart, end: i.selectionEnd };
      else
        e: if (
          ((l = ((l = i.ownerDocument) && l.defaultView) || window),
          (u = l.getSelection && l.getSelection()) && u.rangeCount !== 0)
        ) {
          (l = u.anchorNode),
            (a = u.anchorOffset),
            (s = u.focusNode),
            (u = u.focusOffset);
          try {
            l.nodeType, s.nodeType;
          } catch {
            l = null;
            break e;
          }
          var p = 0,
            g = -1,
            v = -1,
            m = 0,
            y = 0,
            w = i,
            h = null;
          t: for (;;) {
            for (
              var c;
              w !== l || (a !== 0 && w.nodeType !== 3) || (g = p + a),
                w !== s || (u !== 0 && w.nodeType !== 3) || (v = p + u),
                w.nodeType === 3 && (p += w.nodeValue.length),
                (c = w.firstChild) !== null;

            )
              (h = w), (w = c);
            for (;;) {
              if (w === i) break t;
              if (
                (h === l && ++m === a && (g = p),
                h === s && ++y === u && (v = p),
                (c = w.nextSibling) !== null)
              )
                break;
              (w = h), (h = w.parentNode);
            }
            w = c;
          }
          l = g === -1 || v === -1 ? null : { start: g, end: v };
        } else l = null;
      l = l || { start: 0, end: 0 };
    } else l = null;
    (ys = { focusedElem: i, selectionRange: l }),
      (pi = !1),
      (Oo = null),
      (Si = !1),
      (M = n);
    do
      try {
        K1();
      } catch (A) {
        if (M === null) throw Error(R(330));
        br(M, A), (M = M.nextEffect);
      }
    while (M !== null);
    (Oo = null), (M = n);
    do
      try {
        for (i = e; M !== null; ) {
          var d = M.flags;
          if ((d & 16 && Go(M.stateNode, ""), d & 128)) {
            var x = M.alternate;
            if (x !== null) {
              var k = x.ref;
              k !== null &&
                (typeof k == "function" ? k(null) : (k.current = null));
            }
          }
          switch (d & 1038) {
            case 2:
              mp(M), (M.flags &= -3);
              break;
            case 6:
              mp(M), (M.flags &= -3), _s(M.alternate, M);
              break;
            case 1024:
              M.flags &= -1025;
              break;
            case 1028:
              (M.flags &= -1025), _s(M.alternate, M);
              break;
            case 4:
              _s(M.alternate, M);
              break;
            case 8:
              (l = M), o0(i, l);
              var $ = l.alternate;
              dp(l), $ !== null && dp($);
          }
          M = M.nextEffect;
        }
      } catch (A) {
        if (M === null) throw Error(R(330));
        br(M, A), (M = M.nextEffect);
      }
    while (M !== null);
    if (
      ((k = ys),
      (x = $d()),
      (d = k.focusedElem),
      (i = k.selectionRange),
      x !== d && d && d.ownerDocument && wh(d.ownerDocument.documentElement, d))
    ) {
      for (
        i !== null &&
          cu(d) &&
          ((x = i.start),
          (k = i.end),
          k === void 0 && (k = x),
          ("selectionStart" in d)
            ? ((d.selectionStart = x),
              (d.selectionEnd = Math.min(k, d.value.length)))
            : ((k =
                ((x = d.ownerDocument || document) && x.defaultView) || window),
              k.getSelection &&
                ((k = k.getSelection()),
                (l = d.textContent.length),
                ($ = Math.min(i.start, l)),
                (i = i.end === void 0 ? $ : Math.min(i.end, l)),
                !k.extend && $ > i && ((l = i), (i = $), ($ = l)),
                (l = Pd(d, $)),
                (a = Pd(d, i)),
                l &&
                  a &&
                  (k.rangeCount !== 1 ||
                    k.anchorNode !== l.node ||
                    k.anchorOffset !== l.offset ||
                    k.focusNode !== a.node ||
                    k.focusOffset !== a.offset) &&
                  ((x = x.createRange()),
                  x.setStart(l.node, l.offset),
                  k.removeAllRanges(),
                  $ > i
                    ? (k.addRange(x), k.extend(a.node, a.offset))
                    : (x.setEnd(a.node, a.offset), k.addRange(x)))))),
          x = [],
          k = d;
        (k = k.parentNode);

      )
        k.nodeType === 1 &&
          x.push({ element: k, left: k.scrollLeft, top: k.scrollTop });
      for (typeof d.focus == "function" && d.focus(), d = 0; d < x.length; d++)
        (k = x[d]),
          (k.element.scrollLeft = k.left),
          (k.element.scrollTop = k.top);
    }
    (pi = !!gs), (ys = gs = null), (e.current = r), (M = n);
    do
      try {
        for (d = e; M !== null; ) {
          var T = M.flags;
          if ((T & 36 && V1(d, M.alternate, M), T & 128)) {
            x = void 0;
            var P = M.ref;
            if (P !== null) {
              var O = M.stateNode;
              switch (M.tag) {
                case 5:
                  x = O;
                  break;
                default:
                  x = O;
              }
              typeof P == "function" ? P(x) : (P.current = x);
            }
          }
          M = M.nextEffect;
        }
      } catch (A) {
        if (M === null) throw Error(R(330));
        br(M, A), (M = M.nextEffect);
      }
    while (M !== null);
    (M = null), z1(), (N = o);
  } else e.current = r;
  if (_r) (_r = !1), (Io = e), (xo = t);
  else
    for (M = n; M !== null; )
      (t = M.nextEffect),
        (M.nextEffect = null),
        M.flags & 8 && ((T = M), (T.sibling = null), (T.stateNode = null)),
        (M = t);
  if (
    ((n = e.pendingLanes),
    n === 0 && (At = null),
    n === 1 ? (e === Iu ? Mo++ : ((Mo = 0), (Iu = e))) : (Mo = 0),
    (r = r.stateNode),
    Ur && typeof Ur.onCommitFiberRoot == "function")
  )
    try {
      Ur.onCommitFiberRoot(zc, r, void 0, (r.current.flags & 64) === 64);
    } catch {}
  if ((ft(e, $e()), Ki)) throw ((Ki = !1), (e = Ru), (Ru = null), e);
  return (N & 8) !== 0 || Nt(), null;
}
function K1() {
  for (; M !== null; ) {
    var e = M.alternate;
    Si ||
      Oo === null ||
      ((M.flags & 8) !== 0
        ? md(M, Oo) && (Si = !0)
        : M.tag === 13 && U1(e, M) && md(M, Oo) && (Si = !0));
    var t = M.flags;
    (t & 256) !== 0 && H1(e, M),
      (t & 512) === 0 ||
        _r ||
        ((_r = !0),
        ea(97, function () {
          return Pr(), null;
        })),
      (M = M.nextEffect);
  }
}
function Pr() {
  if (xo !== 90) {
    var e = 97 < xo ? 97 : xo;
    return (xo = 90), Kr(e, J1);
  }
  return !1;
}
function Z1(e, t) {
  Au.push(t, e),
    _r ||
      ((_r = !0),
      ea(97, function () {
        return Pr(), null;
      }));
}
function d0(e, t) {
  zu.push(t, e),
    _r ||
      ((_r = !0),
      ea(97, function () {
        return Pr(), null;
      }));
}
function J1() {
  if (Io === null) return !1;
  var e = Io;
  if (((Io = null), (N & 48) !== 0)) throw Error(R(331));
  var t = N;
  N |= 32;
  var r = zu;
  zu = [];
  for (var n = 0; n < r.length; n += 2) {
    var o = r[n],
      a = r[n + 1],
      i = o.destroy;
    if (((o.destroy = void 0), typeof i == "function"))
      try {
        i();
      } catch (s) {
        if (a === null) throw Error(R(330));
        br(a, s);
      }
  }
  for (r = Au, Au = [], n = 0; n < r.length; n += 2) {
    (o = r[n]), (a = r[n + 1]);
    try {
      var l = o.create;
      o.destroy = l();
    } catch (s) {
      if (a === null) throw Error(R(330));
      br(a, s);
    }
  }
  for (l = e.current.firstEffect; l !== null; )
    (e = l.nextEffect),
      (l.nextEffect = null),
      l.flags & 8 && ((l.sibling = null), (l.stateNode = null)),
      (l = e);
  return (N = t), Nt(), !0;
}
function vp(e, t, r) {
  (t = Vc(r, t)),
    (t = r0(e, t, 1)),
    vr(e, t),
    (t = Ye()),
    (e = El(e, 1)),
    e !== null && (vl(e, 1, t), ft(e, t));
}
function br(e, t) {
  if (e.tag === 3) vp(e, e, t);
  else
    for (var r = e.return; r !== null; ) {
      if (r.tag === 3) {
        vp(r, e, t);
        break;
      } else if (r.tag === 1) {
        var n = r.stateNode;
        if (
          typeof r.type.getDerivedStateFromError == "function" ||
          (typeof n.componentDidCatch == "function" &&
            (At === null || !At.has(n)))
        ) {
          e = Vc(t, e);
          var o = n0(r, e, 1);
          if ((vr(r, o), (o = Ye()), (r = El(r, 1)), r !== null))
            vl(r, 1, o), ft(r, o);
          else if (
            typeof n.componentDidCatch == "function" &&
            (At === null || !At.has(n))
          )
            try {
              n.componentDidCatch(t, e);
            } catch {}
          break;
        }
      }
      r = r.return;
    }
}
function eb(e, t, r) {
  var n = e.pingCache;
  n !== null && n.delete(t),
    (t = Ye()),
    (e.pingedLanes |= e.suspendedLanes & r),
    ze === e &&
      (Re & r) === r &&
      (Ee === 4 || (Ee === 3 && (Re & 62914560) === Re && 500 > $e() - Yc)
        ? Rn(e, 0)
        : (Gc |= r)),
    ft(e, t);
}
function tb(e, t) {
  var r = e.stateNode;
  r !== null && r.delete(t),
    (t = 0),
    t === 0 &&
      ((t = e.mode),
      (t & 2) === 0
        ? (t = 1)
        : (t & 4) === 0
        ? (t = Bn() === 99 ? 1 : 2)
        : (Yt === 0 && (Yt = Vn),
          (t = cn(62914560 & ~Yt)),
          t === 0 && (t = 4194304))),
    (r = Ye()),
    (e = El(e, t)),
    e !== null && (vl(e, t, r), ft(e, r));
}
var p0;
p0 = function (e, t, r) {
  var n = t.lanes;
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Ne.current) bt = !0;
    else if ((r & n) !== 0) bt = (e.flags & 16384) !== 0;
    else {
      switch (((bt = !1), t.tag)) {
        case 3:
          rp(t), ws();
          break;
        case 5:
          Yd(t);
          break;
        case 1:
          Le(t.type) && vi(t);
          break;
        case 4:
          yu(t, t.stateNode.containerInfo);
          break;
        case 10:
          n = t.memoizedProps.value;
          var o = t.type._context;
          se(Li, o._currentValue), (o._currentValue = n);
          break;
        case 13:
          if (t.memoizedState !== null)
            return (r & t.child.childLanes) !== 0
              ? np(e, t, r)
              : (se(le, le.current & 1),
                (t = qt(e, t, r)),
                t !== null ? t.sibling : null);
          se(le, le.current & 1);
          break;
        case 19:
          if (((n = (r & t.childLanes) !== 0), (e.flags & 64) !== 0)) {
            if (n) return sp(e, t, r);
            t.flags |= 64;
          }
          if (
            ((o = t.memoizedState),
            o !== null &&
              ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
            se(le, le.current),
            n)
          )
            break;
          return null;
        case 23:
        case 24:
          return (t.lanes = 0), ks(e, t, r);
      }
      return qt(e, t, r);
    }
  else bt = !1;
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      if (
        ((n = t.type),
        e !== null &&
          ((e.alternate = null), (t.alternate = null), (t.flags |= 2)),
        (e = t.pendingProps),
        (o = On(t, Ae.current)),
        Tn(t, r),
        (o = jc(null, t, n, e, o, r)),
        (t.flags |= 1),
        typeof o == "object" &&
          o !== null &&
          typeof o.render == "function" &&
          o.$$typeof === void 0)
      ) {
        if (
          ((t.tag = 1), (t.memoizedState = null), (t.updateQueue = null), Le(n))
        ) {
          var a = !0;
          vi(t);
        } else a = !1;
        (t.memoizedState =
          o.state !== null && o.state !== void 0 ? o.state : null),
          Bc(t);
        var i = n.getDerivedStateFromProps;
        typeof i == "function" && Wi(t, n, i, e),
          (o.updater = wl),
          (t.stateNode = o),
          (o._reactInternals = t),
          gu(t, n, e, r),
          (t = wu(null, t, n, !0, a, r));
      } else (t.tag = 0), Be(null, t, o, r), (t = t.child);
      return t;
    case 16:
      o = t.elementType;
      e: {
        switch (
          (e !== null &&
            ((e.alternate = null), (t.alternate = null), (t.flags |= 2)),
          (e = t.pendingProps),
          (a = o._init),
          (o = a(o._payload)),
          (t.type = o),
          (a = t.tag = nb(o)),
          (e = yt(o, e)),
          a)
        ) {
          case 0:
            t = xu(null, t, o, e, r);
            break e;
          case 1:
            t = tp(null, t, o, e, r);
            break e;
          case 11:
            t = Jd(null, t, o, e, r);
            break e;
          case 14:
            t = ep(null, t, o, yt(o.type, e), n, r);
            break e;
        }
        throw Error(R(306, o, ""));
      }
      return t;
    case 0:
      return (
        (n = t.type),
        (o = t.pendingProps),
        (o = t.elementType === n ? o : yt(n, o)),
        xu(e, t, n, o, r)
      );
    case 1:
      return (
        (n = t.type),
        (o = t.pendingProps),
        (o = t.elementType === n ? o : yt(n, o)),
        tp(e, t, n, o, r)
      );
    case 3:
      if ((rp(t), (n = t.updateQueue), e === null || n === null))
        throw Error(R(282));
      if (
        ((n = t.pendingProps),
        (o = t.memoizedState),
        (o = o !== null ? o.element : null),
        Nh(e, t),
        ta(t, n, null, r),
        (n = t.memoizedState.element),
        n === o)
      )
        ws(), (t = qt(e, t, r));
      else {
        if (
          ((o = t.stateNode),
          (a = o.hydrate) &&
            ((ur = Cn(t.stateNode.containerInfo.firstChild)),
            (Qt = t),
            (a = Mt = !0)),
          a)
        ) {
          if (((e = o.mutableSourceEagerHydrationData), e != null))
            for (o = 0; o < e.length; o += 2)
              (a = e[o]),
                (a._workInProgressVersionPrimary = e[o + 1]),
                Pn.push(a);
          for (r = Wh(t, null, n, r), t.child = r; r; )
            (r.flags = (r.flags & -3) | 1024), (r = r.sibling);
        } else Be(e, t, n, r), ws();
        t = t.child;
      }
      return t;
    case 5:
      return (
        Yd(t),
        e === null && bu(t),
        (n = t.type),
        (o = t.pendingProps),
        (a = e !== null ? e.memoizedProps : null),
        (i = o.children),
        pu(n, o) ? (i = null) : a !== null && pu(n, a) && (t.flags |= 16),
        Zh(e, t),
        Be(e, t, i, r),
        t.child
      );
    case 6:
      return e === null && bu(t), null;
    case 13:
      return np(e, t, r);
    case 4:
      return (
        yu(t, t.stateNode.containerInfo),
        (n = t.pendingProps),
        e === null ? (t.child = Hi(t, null, n, r)) : Be(e, t, n, r),
        t.child
      );
    case 11:
      return (
        (n = t.type),
        (o = t.pendingProps),
        (o = t.elementType === n ? o : yt(n, o)),
        Jd(e, t, n, o, r)
      );
    case 7:
      return Be(e, t, t.pendingProps, r), t.child;
    case 8:
      return Be(e, t, t.pendingProps.children, r), t.child;
    case 12:
      return Be(e, t, t.pendingProps.children, r), t.child;
    case 10:
      e: {
        (n = t.type._context),
          (o = t.pendingProps),
          (i = t.memoizedProps),
          (a = o.value);
        var l = t.type._context;
        if ((se(Li, l._currentValue), (l._currentValue = a), i !== null))
          if (
            ((l = i.value),
            (a = rt(l, a)
              ? 0
              : (typeof n._calculateChangedBits == "function"
                  ? n._calculateChangedBits(l, a)
                  : 1073741823) | 0),
            a === 0)
          ) {
            if (i.children === o.children && !Ne.current) {
              t = qt(e, t, r);
              break e;
            }
          } else
            for (l = t.child, l !== null && (l.return = t); l !== null; ) {
              var s = l.dependencies;
              if (s !== null) {
                i = l.child;
                for (var u = s.firstContext; u !== null; ) {
                  if (u.context === n && (u.observedBits & a) !== 0) {
                    l.tag === 1 &&
                      ((u = hr(-1, r & -r)), (u.tag = 2), vr(l, u)),
                      (l.lanes |= r),
                      (u = l.alternate),
                      u !== null && (u.lanes |= r),
                      Fh(l.return, r),
                      (s.lanes |= r);
                    break;
                  }
                  u = u.next;
                }
              } else i = l.tag === 10 && l.type === t.type ? null : l.child;
              if (i !== null) i.return = l;
              else
                for (i = l; i !== null; ) {
                  if (i === t) {
                    i = null;
                    break;
                  }
                  if (((l = i.sibling), l !== null)) {
                    (l.return = i.return), (i = l);
                    break;
                  }
                  i = i.return;
                }
              l = i;
            }
        Be(e, t, o.children, r), (t = t.child);
      }
      return t;
    case 9:
      return (
        (o = t.type),
        (a = t.pendingProps),
        (n = a.children),
        Tn(t, r),
        (o = ct(o, a.unstable_observedBits)),
        (n = n(o)),
        (t.flags |= 1),
        Be(e, t, n, r),
        t.child
      );
    case 14:
      return (
        (o = t.type),
        (a = yt(o, t.pendingProps)),
        (a = yt(o.type, a)),
        ep(e, t, o, a, n, r)
      );
    case 15:
      return Kh(e, t, t.type, t.pendingProps, n, r);
    case 17:
      return (
        (n = t.type),
        (o = t.pendingProps),
        (o = t.elementType === n ? o : yt(n, o)),
        e !== null &&
          ((e.alternate = null), (t.alternate = null), (t.flags |= 2)),
        (t.tag = 1),
        Le(n) ? ((e = !0), vi(t)) : (e = !1),
        Tn(t, r),
        jh(t, n, o),
        gu(t, n, o, r),
        wu(null, t, n, !0, e, r)
      );
    case 19:
      return sp(e, t, r);
    case 23:
      return ks(e, t, r);
    case 24:
      return ks(e, t, r);
  }
  throw Error(R(156, t.tag));
};
function rb(e, t, r, n) {
  (this.tag = e),
    (this.key = r),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = n),
    (this.flags = 0),
    (this.lastEffect = this.firstEffect = this.nextEffect = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function nt(e, t, r, n) {
  return new rb(e, t, r, n);
}
function Qc(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function nb(e) {
  if (typeof e == "function") return Qc(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === pl)) return 11;
    if (e === ml) return 14;
  }
  return 2;
}
function Cr(e, t) {
  var r = e.alternate;
  return (
    r === null
      ? ((r = nt(e.tag, t, e.key, e.mode)),
        (r.elementType = e.elementType),
        (r.type = e.type),
        (r.stateNode = e.stateNode),
        (r.alternate = e),
        (e.alternate = r))
      : ((r.pendingProps = t),
        (r.type = e.type),
        (r.flags = 0),
        (r.nextEffect = null),
        (r.firstEffect = null),
        (r.lastEffect = null)),
    (r.childLanes = e.childLanes),
    (r.lanes = e.lanes),
    (r.child = e.child),
    (r.memoizedProps = e.memoizedProps),
    (r.memoizedState = e.memoizedState),
    (r.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (r.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (r.sibling = e.sibling),
    (r.index = e.index),
    (r.ref = e.ref),
    r
  );
}
function xi(e, t, r, n, o, a) {
  var i = 2;
  if (((n = e), typeof e == "function")) Qc(e) && (i = 1);
  else if (typeof e == "string") i = 5;
  else
    e: switch (e) {
      case ir:
        return An(r.children, o, a, t);
      case Hm:
        (i = 8), (o |= 16);
        break;
      case fc:
        (i = 8), (o |= 1);
        break;
      case Eo:
        return (
          (e = nt(12, r, t, o | 8)),
          (e.elementType = Eo),
          (e.type = Eo),
          (e.lanes = a),
          e
        );
      case _o:
        return (
          (e = nt(13, r, t, o)),
          (e.type = _o),
          (e.elementType = _o),
          (e.lanes = a),
          e
        );
      case Ri:
        return (e = nt(19, r, t, o)), (e.elementType = Ri), (e.lanes = a), e;
      case gc:
        return qc(r, o, a, t);
      case Qs:
        return (e = nt(24, r, t, o)), (e.elementType = Qs), (e.lanes = a), e;
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case dc:
              i = 10;
              break e;
            case pc:
              i = 9;
              break e;
            case pl:
              i = 11;
              break e;
            case ml:
              i = 14;
              break e;
            case mc:
              (i = 16), (n = null);
              break e;
            case hc:
              i = 22;
              break e;
          }
        throw Error(R(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = nt(i, r, t, o)), (t.elementType = e), (t.type = n), (t.lanes = a), t
  );
}
function An(e, t, r, n) {
  return (e = nt(7, e, n, t)), (e.lanes = r), e;
}
function qc(e, t, r, n) {
  return (e = nt(23, e, n, t)), (e.elementType = gc), (e.lanes = r), e;
}
function Cs(e, t, r) {
  return (e = nt(6, e, null, t)), (e.lanes = r), e;
}
function Ts(e, t, r) {
  return (
    (t = nt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = r),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function ob(e, t, r) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.pendingContext = this.context = null),
    (this.hydrate = r),
    (this.callbackNode = null),
    (this.callbackPriority = 0),
    (this.eventTimes = cs(0)),
    (this.expirationTimes = cs(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = cs(0)),
    (this.mutableSourceEagerHydrationData = null);
}
function ab(e, t, r) {
  var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Br,
    key: n == null ? null : "" + n,
    children: e,
    containerInfo: t,
    implementation: r,
  };
}
function Zi(e, t, r, n) {
  var o = t.current,
    a = Ye(),
    i = gr(o);
  e: if (r) {
    r = r._reactInternals;
    t: {
      if (tn(r) !== r || r.tag !== 1) throw Error(R(170));
      var l = r;
      do {
        switch (l.tag) {
          case 3:
            l = l.stateNode.context;
            break t;
          case 1:
            if (Le(l.type)) {
              l = l.stateNode.__reactInternalMemoizedMergedChildContext;
              break t;
            }
        }
        l = l.return;
      } while (l !== null);
      throw Error(R(171));
    }
    if (r.tag === 1) {
      var s = r.type;
      if (Le(s)) {
        r = Rh(r, s, l);
        break e;
      }
    }
    r = l;
  } else r = Er;
  return (
    t.context === null ? (t.context = r) : (t.pendingContext = r),
    (t = hr(a, i)),
    (t.payload = { element: e }),
    (n = n === void 0 ? null : n),
    n !== null && (t.callback = n),
    vr(o, t),
    yr(o, i, a),
    i
  );
}
function Ps(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function gp(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var r = e.retryLane;
    e.retryLane = r !== 0 && r < t ? r : t;
  }
}
function Kc(e, t) {
  gp(e, t), (e = e.alternate) && gp(e, t);
}
function ib() {
  return null;
}
function Zc(e, t, r) {
  var n =
    (r != null &&
      r.hydrationOptions != null &&
      r.hydrationOptions.mutableSources) ||
    null;
  if (
    ((r = new ob(e, t, r != null && r.hydrate === !0)),
    (t = nt(3, null, null, t === 2 ? 7 : t === 1 ? 3 : 0)),
    (r.current = t),
    (t.stateNode = r),
    Bc(t),
    (e[Hn] = r.current),
    _h(e.nodeType === 8 ? e.parentNode : e),
    n)
  )
    for (e = 0; e < n.length; e++) {
      t = n[e];
      var o = t._getVersion;
      (o = o(t._source)),
        r.mutableSourceEagerHydrationData == null
          ? (r.mutableSourceEagerHydrationData = [t, o])
          : r.mutableSourceEagerHydrationData.push(t, o);
    }
  this._internalRoot = r;
}
Zc.prototype.render = function (e) {
  Zi(e, this._internalRoot, null, null);
};
Zc.prototype.unmount = function () {
  var e = this._internalRoot,
    t = e.containerInfo;
  Zi(null, e, null, function () {
    t[Hn] = null;
  });
};
function ya(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function lb(e, t) {
  if (
    (t ||
      ((t = e ? (e.nodeType === 9 ? e.documentElement : e.firstChild) : null),
      (t = !(!t || t.nodeType !== 1 || !t.hasAttribute("data-reactroot")))),
    !t)
  )
    for (var r; (r = e.lastChild); ) e.removeChild(r);
  return new Zc(e, 0, t ? { hydrate: !0 } : void 0);
}
function _l(e, t, r, n, o) {
  var a = r._reactRootContainer;
  if (a) {
    var i = a._internalRoot;
    if (typeof o == "function") {
      var l = o;
      o = function () {
        var u = Ps(i);
        l.call(u);
      };
    }
    Zi(t, i, e, o);
  } else {
    if (
      ((a = r._reactRootContainer = lb(r, n)),
      (i = a._internalRoot),
      typeof o == "function")
    ) {
      var s = o;
      o = function () {
        var u = Ps(i);
        s.call(u);
      };
    }
    l0(function () {
      Zi(t, i, e, o);
    });
  }
  return Ps(i);
}
oh = function (e) {
  if (e.tag === 13) {
    var t = Ye();
    yr(e, 4, t), Kc(e, 4);
  }
};
wc = function (e) {
  if (e.tag === 13) {
    var t = Ye();
    yr(e, 67108864, t), Kc(e, 67108864);
  }
};
ah = function (e) {
  if (e.tag === 13) {
    var t = Ye(),
      r = gr(e);
    yr(e, r, t), Kc(e, r);
  }
};
ih = function (e, t) {
  return t();
};
au = function (e, t, r) {
  switch (t) {
    case "input":
      if ((Ks(e, r), (t = r.name), r.type === "radio" && t != null)) {
        for (r = e; r.parentNode; ) r = r.parentNode;
        for (
          r = r.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]'
          ),
            t = 0;
          t < r.length;
          t++
        ) {
          var n = r[t];
          if (n !== e && n.form === e.form) {
            var o = Sl(n);
            if (!o) throw Error(R(90));
            Um(n), Ks(n, o);
          }
        }
      }
      break;
    case "textarea":
      Ym(e, r);
      break;
    case "select":
      (t = r.value), t != null && kn(e, !!r.multiple, t, !1);
  }
};
bc = i0;
eh = function (e, t, r, n, o) {
  var a = N;
  N |= 4;
  try {
    return Kr(98, e.bind(null, t, r, n, o));
  } finally {
    (N = a), N === 0 && (Gn(), Nt());
  }
};
Sc = function () {
  (N & 49) === 0 && (Y1(), Pr());
};
th = function (e, t) {
  var r = N;
  N |= 2;
  try {
    return e(t);
  } finally {
    (N = r), N === 0 && (Gn(), Nt());
  }
};
function m0(e, t) {
  var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!ya(t)) throw Error(R(200));
  return ab(e, t, null, r);
}
var sb = { Events: [ha, gn, Sl, Zm, Jm, Pr, { current: !1 }] },
  vo = {
    findFiberByHostInstance: Nr,
    bundleType: 0,
    version: "17.0.2",
    rendererPackageName: "react-dom",
  },
  ub = {
    bundleType: vo.bundleType,
    version: vo.version,
    rendererPackageName: vo.rendererPackageName,
    rendererConfig: vo.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: en.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = nh(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: vo.findFiberByHostInstance || ib,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ != "undefined") {
  var Ga = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Ga.isDisabled && Ga.supportsFiber)
    try {
      (zc = Ga.inject(ub)), (Ur = Ga);
    } catch {}
}
dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sb;
dt.createPortal = m0;
dt.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(R(188))
      : Error(R(268, Object.keys(e)));
  return (e = nh(t)), (e = e === null ? null : e.stateNode), e;
};
dt.flushSync = function (e, t) {
  var r = N;
  if ((r & 48) !== 0) return e(t);
  N |= 1;
  try {
    if (e) return Kr(99, e.bind(null, t));
  } finally {
    (N = r), Nt();
  }
};
dt.hydrate = function (e, t, r) {
  if (!ya(t)) throw Error(R(200));
  return _l(null, e, t, !0, r);
};
dt.render = function (e, t, r) {
  if (!ya(t)) throw Error(R(200));
  return _l(null, e, t, !1, r);
};
dt.unmountComponentAtNode = function (e) {
  if (!ya(e)) throw Error(R(40));
  return e._reactRootContainer
    ? (l0(function () {
        _l(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[Hn] = null);
        });
      }),
      !0)
    : !1;
};
dt.unstable_batchedUpdates = i0;
dt.unstable_createPortal = function (e, t) {
  return m0(
    e,
    t,
    2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null
  );
};
dt.unstable_renderSubtreeIntoContainer = function (e, t, r, n) {
  if (!ya(r)) throw Error(R(200));
  if (e == null || e._reactInternals === void 0) throw Error(R(38));
  return _l(e, t, r, !1, n);
};
dt.version = "17.0.2";
function h0() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(h0);
    } catch (e) {
      console.error(e);
    }
}
h0(), (hy.exports = dt);
function J5(e) {
  Hg.store(e) || fb("expect useStore argument to be a store");
  let t = e.getState(),
    r = Qr.useReducer((o) => o + 1, 0)[1],
    n = Qr.useRef({ store: e, value: t, pending: 0 });
  return (
    cb(() => {
      let o = e.updates.watch((l) => {
          let s = n.current;
          s.pending || ((s.value = l), (s.pending = 1), r(), (s.pending = 0));
        }),
        a = e.getState(),
        i = n.current;
      return (
        i.store === e &&
          i.value !== a &&
          ((i.value = a), (i.pending = 1), r(), (i.pending = 0)),
        (i.store = e),
        o
      );
    }, [e]),
    t
  );
}
let cb = typeof window != "undefined" ? Qr.useLayoutEffect : Qr.useEffect,
  fb = (e) => {
    throw Error(e);
  };
function db(e) {
  if (e.sheet) return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e) return document.styleSheets[t];
}
function pb(e) {
  var t = document.createElement("style");
  return (
    t.setAttribute("data-emotion", e.key),
    e.nonce !== void 0 && t.setAttribute("nonce", e.nonce),
    t.appendChild(document.createTextNode("")),
    t.setAttribute("data-s", ""),
    t
  );
}
var mb = (function () {
    function e(r) {
      var n = this;
      (this._insertTag = function (o) {
        var a;
        n.tags.length === 0
          ? n.insertionPoint
            ? (a = n.insertionPoint.nextSibling)
            : n.prepend
            ? (a = n.container.firstChild)
            : (a = n.before)
          : (a = n.tags[n.tags.length - 1].nextSibling),
          n.container.insertBefore(o, a),
          n.tags.push(o);
      }),
        (this.isSpeedy = r.speedy === void 0 ? !0 : r.speedy),
        (this.tags = []),
        (this.ctr = 0),
        (this.nonce = r.nonce),
        (this.key = r.key),
        (this.container = r.container),
        (this.prepend = r.prepend),
        (this.insertionPoint = r.insertionPoint),
        (this.before = null);
    }
    var t = e.prototype;
    return (
      (t.hydrate = function (n) {
        n.forEach(this._insertTag);
      }),
      (t.insert = function (n) {
        this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 &&
          this._insertTag(pb(this));
        var o = this.tags[this.tags.length - 1];
        if (this.isSpeedy) {
          var a = db(o);
          try {
            a.insertRule(n, a.cssRules.length);
          } catch {}
        } else o.appendChild(document.createTextNode(n));
        this.ctr++;
      }),
      (t.flush = function () {
        this.tags.forEach(function (n) {
          return n.parentNode && n.parentNode.removeChild(n);
        }),
          (this.tags = []),
          (this.ctr = 0);
      }),
      e
    );
  })(),
  Te = "-ms-",
  Ji = "-moz-",
  V = "-webkit-",
  v0 = "comm",
  Jc = "rule",
  ef = "decl",
  hb = "@import",
  g0 = "@keyframes",
  vb = Math.abs,
  Cl = String.fromCharCode,
  gb = Object.assign;
function yb(e, t) {
  return (
    (((((((t << 2) ^ Fe(e, 0)) << 2) ^ Fe(e, 1)) << 2) ^ Fe(e, 2)) << 2) ^
    Fe(e, 3)
  );
}
function y0(e) {
  return e.trim();
}
function bb(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function U(e, t, r) {
  return e.replace(t, r);
}
function Ou(e, t) {
  return e.indexOf(t);
}
function Fe(e, t) {
  return e.charCodeAt(t) | 0;
}
function aa(e, t, r) {
  return e.slice(t, r);
}
function Ct(e) {
  return e.length;
}
function tf(e) {
  return e.length;
}
function Ya(e, t) {
  return t.push(e), e;
}
function Sb(e, t) {
  return e.map(t).join("");
}
var Tl = 1,
  Nn = 1,
  b0 = 0,
  De = 0,
  de = 0,
  Yn = "";
function Pl(e, t, r, n, o, a, i) {
  return {
    value: e,
    root: t,
    parent: r,
    type: n,
    props: o,
    children: a,
    line: Tl,
    column: Nn,
    length: i,
    return: "",
  };
}
function go(e, t) {
  return gb(Pl("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function xb() {
  return de;
}
function wb() {
  return (
    (de = De > 0 ? Fe(Yn, --De) : 0), Nn--, de === 10 && ((Nn = 1), Tl--), de
  );
}
function Xe() {
  return (
    (de = De < b0 ? Fe(Yn, De++) : 0), Nn++, de === 10 && ((Nn = 1), Tl++), de
  );
}
function Ot() {
  return Fe(Yn, De);
}
function wi() {
  return De;
}
function ba(e, t) {
  return aa(Yn, e, t);
}
function ia(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function S0(e) {
  return (Tl = Nn = 1), (b0 = Ct((Yn = e))), (De = 0), [];
}
function x0(e) {
  return (Yn = ""), e;
}
function ki(e) {
  return y0(ba(De - 1, Bu(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function kb(e) {
  for (; (de = Ot()) && de < 33; ) Xe();
  return ia(e) > 2 || ia(de) > 3 ? "" : " ";
}
function Eb(e, t) {
  for (
    ;
    --t &&
    Xe() &&
    !(de < 48 || de > 102 || (de > 57 && de < 65) || (de > 70 && de < 97));

  );
  return ba(e, wi() + (t < 6 && Ot() == 32 && Xe() == 32));
}
function Bu(e) {
  for (; Xe(); )
    switch (de) {
      case e:
        return De;
      case 34:
      case 39:
        e !== 34 && e !== 39 && Bu(de);
        break;
      case 40:
        e === 41 && Bu(e);
        break;
      case 92:
        Xe();
        break;
    }
  return De;
}
function _b(e, t) {
  for (; Xe() && e + de !== 47 + 10; )
    if (e + de === 42 + 42 && Ot() === 47) break;
  return "/*" + ba(t, De - 1) + "*" + Cl(e === 47 ? e : Xe());
}
function Cb(e) {
  for (; !ia(Ot()); ) Xe();
  return ba(e, De);
}
function Tb(e) {
  return x0(Ei("", null, null, null, [""], (e = S0(e)), 0, [0], e));
}
function Ei(e, t, r, n, o, a, i, l, s) {
  for (
    var u = 0,
      p = 0,
      g = i,
      v = 0,
      m = 0,
      y = 0,
      w = 1,
      h = 1,
      c = 1,
      d = 0,
      x = "",
      k = o,
      $ = a,
      T = n,
      P = x;
    h;

  )
    switch (((y = d), (d = Xe()))) {
      case 40:
        if (y != 108 && P.charCodeAt(g - 1) == 58) {
          Ou((P += U(ki(d), "&", "&\f")), "&\f") != -1 && (c = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        P += ki(d);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        P += kb(y);
        break;
      case 92:
        P += Eb(wi() - 1, 7);
        continue;
      case 47:
        switch (Ot()) {
          case 42:
          case 47:
            Ya(Pb(_b(Xe(), wi()), t, r), s);
            break;
          default:
            P += "/";
        }
        break;
      case 123 * w:
        l[u++] = Ct(P) * c;
      case 125 * w:
      case 59:
      case 0:
        switch (d) {
          case 0:
          case 125:
            h = 0;
          case 59 + p:
            m > 0 &&
              Ct(P) - g &&
              Ya(
                m > 32
                  ? bp(P + ";", n, r, g - 1)
                  : bp(U(P, " ", "") + ";", n, r, g - 2),
                s
              );
            break;
          case 59:
            P += ";";
          default:
            if (
              (Ya((T = yp(P, t, r, u, p, o, l, x, (k = []), ($ = []), g)), a),
              d === 123)
            )
              if (p === 0) Ei(P, t, T, T, k, a, g, l, $);
              else
                switch (v) {
                  case 100:
                  case 109:
                  case 115:
                    Ei(
                      e,
                      T,
                      T,
                      n && Ya(yp(e, T, T, 0, 0, o, l, x, o, (k = []), g), $),
                      o,
                      $,
                      g,
                      l,
                      n ? k : $
                    );
                    break;
                  default:
                    Ei(P, T, T, T, [""], $, 0, l, $);
                }
        }
        (u = p = m = 0), (w = c = 1), (x = P = ""), (g = i);
        break;
      case 58:
        (g = 1 + Ct(P)), (m = y);
      default:
        if (w < 1) {
          if (d == 123) --w;
          else if (d == 125 && w++ == 0 && wb() == 125) continue;
        }
        switch (((P += Cl(d)), d * w)) {
          case 38:
            c = p > 0 ? 1 : ((P += "\f"), -1);
            break;
          case 44:
            (l[u++] = (Ct(P) - 1) * c), (c = 1);
            break;
          case 64:
            Ot() === 45 && (P += ki(Xe())),
              (v = Ot()),
              (p = g = Ct((x = P += Cb(wi())))),
              d++;
            break;
          case 45:
            y === 45 && Ct(P) == 2 && (w = 0);
        }
    }
  return a;
}
function yp(e, t, r, n, o, a, i, l, s, u, p) {
  for (
    var g = o - 1, v = o === 0 ? a : [""], m = tf(v), y = 0, w = 0, h = 0;
    y < n;
    ++y
  )
    for (var c = 0, d = aa(e, g + 1, (g = vb((w = i[y])))), x = e; c < m; ++c)
      (x = y0(w > 0 ? v[c] + " " + d : U(d, /&\f/g, v[c]))) && (s[h++] = x);
  return Pl(e, t, r, o === 0 ? Jc : l, s, u, p);
}
function Pb(e, t, r) {
  return Pl(e, t, r, v0, Cl(xb()), aa(e, 2, -2), 0);
}
function bp(e, t, r, n) {
  return Pl(e, t, r, ef, aa(e, 0, n), aa(e, n + 1, -1), n);
}
function w0(e, t) {
  switch (yb(e, t)) {
    case 5103:
      return V + "print-" + e + e;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return V + e + e;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return V + e + Ji + e + Te + e + e;
    case 6828:
    case 4268:
      return V + e + Te + e + e;
    case 6165:
      return V + e + Te + "flex-" + e + e;
    case 5187:
      return (
        V + e + U(e, /(\w+).+(:[^]+)/, V + "box-$1$2" + Te + "flex-$1$2") + e
      );
    case 5443:
      return V + e + Te + "flex-item-" + U(e, /flex-|-self/, "") + e;
    case 4675:
      return (
        V +
        e +
        Te +
        "flex-line-pack" +
        U(e, /align-content|flex-|-self/, "") +
        e
      );
    case 5548:
      return V + e + Te + U(e, "shrink", "negative") + e;
    case 5292:
      return V + e + Te + U(e, "basis", "preferred-size") + e;
    case 6060:
      return (
        V +
        "box-" +
        U(e, "-grow", "") +
        V +
        e +
        Te +
        U(e, "grow", "positive") +
        e
      );
    case 4554:
      return V + U(e, /([^-])(transform)/g, "$1" + V + "$2") + e;
    case 6187:
      return (
        U(U(U(e, /(zoom-|grab)/, V + "$1"), /(image-set)/, V + "$1"), e, "") + e
      );
    case 5495:
    case 3959:
      return U(e, /(image-set\([^]*)/, V + "$1$`$1");
    case 4968:
      return (
        U(
          U(e, /(.+:)(flex-)?(.*)/, V + "box-pack:$3" + Te + "flex-pack:$3"),
          /s.+-b[^;]+/,
          "justify"
        ) +
        V +
        e +
        e
      );
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return U(e, /(.+)-inline(.+)/, V + "$1$2") + e;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (Ct(e) - 1 - t > 6)
        switch (Fe(e, t + 1)) {
          case 109:
            if (Fe(e, t + 4) !== 45) break;
          case 102:
            return (
              U(
                e,
                /(.+:)(.+)-([^]+)/,
                "$1" +
                  V +
                  "$2-$3$1" +
                  Ji +
                  (Fe(e, t + 3) == 108 ? "$3" : "$2-$3")
              ) + e
            );
          case 115:
            return ~Ou(e, "stretch")
              ? w0(U(e, "stretch", "fill-available"), t) + e
              : e;
        }
      break;
    case 4949:
      if (Fe(e, t + 1) !== 115) break;
    case 6444:
      switch (Fe(e, Ct(e) - 3 - (~Ou(e, "!important") && 10))) {
        case 107:
          return U(e, ":", ":" + V) + e;
        case 101:
          return (
            U(
              e,
              /(.+:)([^;!]+)(;|!.+)?/,
              "$1" +
                V +
                (Fe(e, 14) === 45 ? "inline-" : "") +
                "box$3$1" +
                V +
                "$2$3$1" +
                Te +
                "$2box$3"
            ) + e
          );
      }
      break;
    case 5936:
      switch (Fe(e, t + 11)) {
        case 114:
          return V + e + Te + U(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        case 108:
          return V + e + Te + U(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        case 45:
          return V + e + Te + U(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return V + e + Te + e + e;
  }
  return e;
}
function zn(e, t) {
  for (var r = "", n = tf(e), o = 0; o < n; o++) r += t(e[o], o, e, t) || "";
  return r;
}
function $b(e, t, r, n) {
  switch (e.type) {
    case hb:
    case ef:
      return (e.return = e.return || e.value);
    case v0:
      return "";
    case g0:
      return (e.return = e.value + "{" + zn(e.children, n) + "}");
    case Jc:
      e.value = e.props.join(",");
  }
  return Ct((r = zn(e.children, n)))
    ? (e.return = e.value + "{" + r + "}")
    : "";
}
function Rb(e) {
  var t = tf(e);
  return function (r, n, o, a) {
    for (var i = "", l = 0; l < t; l++) i += e[l](r, n, o, a) || "";
    return i;
  };
}
function Ab(e) {
  return function (t) {
    t.root || ((t = t.return) && e(t));
  };
}
function zb(e, t, r, n) {
  if (e.length > -1 && !e.return)
    switch (e.type) {
      case ef:
        e.return = w0(e.value, e.length);
        break;
      case g0:
        return zn([go(e, { value: U(e.value, "@", "@" + V) })], n);
      case Jc:
        if (e.length)
          return Sb(e.props, function (o) {
            switch (bb(o, /(::plac\w+|:read-\w+)/)) {
              case ":read-only":
              case ":read-write":
                return zn(
                  [go(e, { props: [U(o, /:(read-\w+)/, ":" + Ji + "$1")] })],
                  n
                );
              case "::placeholder":
                return zn(
                  [
                    go(e, {
                      props: [U(o, /:(plac\w+)/, ":" + V + "input-$1")],
                    }),
                    go(e, { props: [U(o, /:(plac\w+)/, ":" + Ji + "$1")] }),
                    go(e, { props: [U(o, /:(plac\w+)/, Te + "input-$1")] }),
                  ],
                  n
                );
            }
            return "";
          });
    }
}
var Sp = function (t) {
  var r = new WeakMap();
  return function (n) {
    if (r.has(n)) return r.get(n);
    var o = t(n);
    return r.set(n, o), o;
  };
};
function k0(e) {
  var t = Object.create(null);
  return function (r) {
    return t[r] === void 0 && (t[r] = e(r)), t[r];
  };
}
var Ib = function (t, r, n) {
    for (
      var o = 0, a = 0;
      (o = a), (a = Ot()), o === 38 && a === 12 && (r[n] = 1), !ia(a);

    )
      Xe();
    return ba(t, De);
  },
  Mb = function (t, r) {
    var n = -1,
      o = 44;
    do
      switch (ia(o)) {
        case 0:
          o === 38 && Ot() === 12 && (r[n] = 1), (t[n] += Ib(De - 1, r, n));
          break;
        case 2:
          t[n] += ki(o);
          break;
        case 4:
          if (o === 44) {
            (t[++n] = Ot() === 58 ? "&\f" : ""), (r[n] = t[n].length);
            break;
          }
        default:
          t[n] += Cl(o);
      }
    while ((o = Xe()));
    return t;
  },
  Ob = function (t, r) {
    return x0(Mb(S0(t), r));
  },
  xp = new WeakMap(),
  Bb = function (t) {
    if (!(t.type !== "rule" || !t.parent || t.length < 1)) {
      for (
        var r = t.value,
          n = t.parent,
          o = t.column === n.column && t.line === n.line;
        n.type !== "rule";

      )
        if (((n = n.parent), !n)) return;
      if (
        !(t.props.length === 1 && r.charCodeAt(0) !== 58 && !xp.get(n)) &&
        !o
      ) {
        xp.set(t, !0);
        for (
          var a = [], i = Ob(r, a), l = n.props, s = 0, u = 0;
          s < i.length;
          s++
        )
          for (var p = 0; p < l.length; p++, u++)
            t.props[u] = a[s] ? i[s].replace(/&\f/g, l[p]) : l[p] + " " + i[s];
      }
    }
  },
  Fb = function (t) {
    if (t.type === "decl") {
      var r = t.value;
      r.charCodeAt(0) === 108 &&
        r.charCodeAt(2) === 98 &&
        ((t.return = ""), (t.value = ""));
    }
  },
  Nb = [zb],
  Lb = function (t) {
    var r = t.key;
    if (r === "css") {
      var n = document.querySelectorAll("style[data-emotion]:not([data-s])");
      Array.prototype.forEach.call(n, function (w) {
        var h = w.getAttribute("data-emotion");
        h.indexOf(" ") !== -1 &&
          (document.head.appendChild(w), w.setAttribute("data-s", ""));
      });
    }
    var o = t.stylisPlugins || Nb,
      a = {},
      i,
      l = [];
    (i = t.container || document.head),
      Array.prototype.forEach.call(
        document.querySelectorAll('style[data-emotion^="' + r + ' "]'),
        function (w) {
          for (
            var h = w.getAttribute("data-emotion").split(" "), c = 1;
            c < h.length;
            c++
          )
            a[h[c]] = !0;
          l.push(w);
        }
      );
    var s,
      u = [Bb, Fb];
    {
      var p,
        g = [
          $b,
          Ab(function (w) {
            p.insert(w);
          }),
        ],
        v = Rb(u.concat(o, g)),
        m = function (h) {
          return zn(Tb(h), v);
        };
      s = function (h, c, d, x) {
        (p = d),
          m(h ? h + "{" + c.styles + "}" : c.styles),
          x && (y.inserted[c.name] = !0);
      };
    }
    var y = {
      key: r,
      sheet: new mb({
        key: r,
        container: i,
        nonce: t.nonce,
        speedy: t.speedy,
        prepend: t.prepend,
        insertionPoint: t.insertionPoint,
      }),
      nonce: t.nonce,
      inserted: a,
      registered: {},
      insert: s,
    };
    return y.sheet.hydrate(l), y;
  };
function el() {
  return (
    (el = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    el.apply(this, arguments)
  );
}
var E0 = { exports: {} },
  X = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Se = typeof Symbol == "function" && Symbol.for,
  rf = Se ? Symbol.for("react.element") : 60103,
  nf = Se ? Symbol.for("react.portal") : 60106,
  $l = Se ? Symbol.for("react.fragment") : 60107,
  Rl = Se ? Symbol.for("react.strict_mode") : 60108,
  Al = Se ? Symbol.for("react.profiler") : 60114,
  zl = Se ? Symbol.for("react.provider") : 60109,
  Il = Se ? Symbol.for("react.context") : 60110,
  of = Se ? Symbol.for("react.async_mode") : 60111,
  Ml = Se ? Symbol.for("react.concurrent_mode") : 60111,
  Ol = Se ? Symbol.for("react.forward_ref") : 60112,
  Bl = Se ? Symbol.for("react.suspense") : 60113,
  jb = Se ? Symbol.for("react.suspense_list") : 60120,
  Fl = Se ? Symbol.for("react.memo") : 60115,
  Nl = Se ? Symbol.for("react.lazy") : 60116,
  Db = Se ? Symbol.for("react.block") : 60121,
  Wb = Se ? Symbol.for("react.fundamental") : 60117,
  Hb = Se ? Symbol.for("react.responder") : 60118,
  Vb = Se ? Symbol.for("react.scope") : 60119;
function Ke(e) {
  if (typeof e == "object" && e !== null) {
    var t = e.$$typeof;
    switch (t) {
      case rf:
        switch (((e = e.type), e)) {
          case of:
          case Ml:
          case $l:
          case Al:
          case Rl:
          case Bl:
            return e;
          default:
            switch (((e = e && e.$$typeof), e)) {
              case Il:
              case Ol:
              case Nl:
              case Fl:
              case zl:
                return e;
              default:
                return t;
            }
        }
      case nf:
        return t;
    }
  }
}
function _0(e) {
  return Ke(e) === Ml;
}
X.AsyncMode = of;
X.ConcurrentMode = Ml;
X.ContextConsumer = Il;
X.ContextProvider = zl;
X.Element = rf;
X.ForwardRef = Ol;
X.Fragment = $l;
X.Lazy = Nl;
X.Memo = Fl;
X.Portal = nf;
X.Profiler = Al;
X.StrictMode = Rl;
X.Suspense = Bl;
X.isAsyncMode = function (e) {
  return _0(e) || Ke(e) === of;
};
X.isConcurrentMode = _0;
X.isContextConsumer = function (e) {
  return Ke(e) === Il;
};
X.isContextProvider = function (e) {
  return Ke(e) === zl;
};
X.isElement = function (e) {
  return typeof e == "object" && e !== null && e.$$typeof === rf;
};
X.isForwardRef = function (e) {
  return Ke(e) === Ol;
};
X.isFragment = function (e) {
  return Ke(e) === $l;
};
X.isLazy = function (e) {
  return Ke(e) === Nl;
};
X.isMemo = function (e) {
  return Ke(e) === Fl;
};
X.isPortal = function (e) {
  return Ke(e) === nf;
};
X.isProfiler = function (e) {
  return Ke(e) === Al;
};
X.isStrictMode = function (e) {
  return Ke(e) === Rl;
};
X.isSuspense = function (e) {
  return Ke(e) === Bl;
};
X.isValidElementType = function (e) {
  return (
    typeof e == "string" ||
    typeof e == "function" ||
    e === $l ||
    e === Ml ||
    e === Al ||
    e === Rl ||
    e === Bl ||
    e === jb ||
    (typeof e == "object" &&
      e !== null &&
      (e.$$typeof === Nl ||
        e.$$typeof === Fl ||
        e.$$typeof === zl ||
        e.$$typeof === Il ||
        e.$$typeof === Ol ||
        e.$$typeof === Wb ||
        e.$$typeof === Hb ||
        e.$$typeof === Vb ||
        e.$$typeof === Db))
  );
};
X.typeOf = Ke;
E0.exports = X;
var C0 = E0.exports,
  Ub = {
    $$typeof: !0,
    render: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0,
  },
  Gb = {
    $$typeof: !0,
    compare: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0,
    type: !0,
  },
  T0 = {};
T0[C0.ForwardRef] = Ub;
T0[C0.Memo] = Gb;
var Yb = !0;
function Xb(e, t, r) {
  var n = "";
  return (
    r.split(" ").forEach(function (o) {
      e[o] !== void 0 ? t.push(e[o] + ";") : (n += o + " ");
    }),
    n
  );
}
var P0 = function (t, r, n) {
    var o = t.key + "-" + r.name;
    (n === !1 || Yb === !1) &&
      t.registered[o] === void 0 &&
      (t.registered[o] = r.styles);
  },
  $0 = function (t, r, n) {
    P0(t, r, n);
    var o = t.key + "-" + r.name;
    if (t.inserted[r.name] === void 0) {
      var a = r;
      do t.insert(r === a ? "." + o : "", a, t.sheet, !0), (a = a.next);
      while (a !== void 0);
    }
  };
function Qb(e) {
  for (var t = 0, r, n = 0, o = e.length; o >= 4; ++n, o -= 4)
    (r =
      (e.charCodeAt(n) & 255) |
      ((e.charCodeAt(++n) & 255) << 8) |
      ((e.charCodeAt(++n) & 255) << 16) |
      ((e.charCodeAt(++n) & 255) << 24)),
      (r = (r & 65535) * 1540483477 + (((r >>> 16) * 59797) << 16)),
      (r ^= r >>> 24),
      (t =
        ((r & 65535) * 1540483477 + (((r >>> 16) * 59797) << 16)) ^
        ((t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)));
  switch (o) {
    case 3:
      t ^= (e.charCodeAt(n + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(n + 1) & 255) << 8;
    case 1:
      (t ^= e.charCodeAt(n) & 255),
        (t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16));
  }
  return (
    (t ^= t >>> 13),
    (t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)),
    ((t ^ (t >>> 15)) >>> 0).toString(36)
  );
}
var qb = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1,
  },
  Kb = /[A-Z]|^ms/g,
  Zb = /_EMO_([^_]+?)_([^]*?)_EMO_/g,
  R0 = function (t) {
    return t.charCodeAt(1) === 45;
  },
  wp = function (t) {
    return t != null && typeof t != "boolean";
  },
  $s = k0(function (e) {
    return R0(e) ? e : e.replace(Kb, "-$&").toLowerCase();
  }),
  kp = function (t, r) {
    switch (t) {
      case "animation":
      case "animationName":
        if (typeof r == "string")
          return r.replace(Zb, function (n, o, a) {
            return (Tt = { name: o, styles: a, next: Tt }), o;
          });
    }
    return qb[t] !== 1 && !R0(t) && typeof r == "number" && r !== 0
      ? r + "px"
      : r;
  };
function la(e, t, r) {
  if (r == null) return "";
  if (r.__emotion_styles !== void 0) return r;
  switch (typeof r) {
    case "boolean":
      return "";
    case "object": {
      if (r.anim === 1)
        return (Tt = { name: r.name, styles: r.styles, next: Tt }), r.name;
      if (r.styles !== void 0) {
        var n = r.next;
        if (n !== void 0)
          for (; n !== void 0; )
            (Tt = { name: n.name, styles: n.styles, next: Tt }), (n = n.next);
        var o = r.styles + ";";
        return o;
      }
      return Jb(e, t, r);
    }
    case "function": {
      if (e !== void 0) {
        var a = Tt,
          i = r(e);
        return (Tt = a), la(e, t, i);
      }
      break;
    }
  }
  if (t == null) return r;
  var l = t[r];
  return l !== void 0 ? l : r;
}
function Jb(e, t, r) {
  var n = "";
  if (Array.isArray(r))
    for (var o = 0; o < r.length; o++) n += la(e, t, r[o]) + ";";
  else
    for (var a in r) {
      var i = r[a];
      if (typeof i != "object")
        t != null && t[i] !== void 0
          ? (n += a + "{" + t[i] + "}")
          : wp(i) && (n += $s(a) + ":" + kp(a, i) + ";");
      else if (
        Array.isArray(i) &&
        typeof i[0] == "string" &&
        (t == null || t[i[0]] === void 0)
      )
        for (var l = 0; l < i.length; l++)
          wp(i[l]) && (n += $s(a) + ":" + kp(a, i[l]) + ";");
      else {
        var s = la(e, t, i);
        switch (a) {
          case "animation":
          case "animationName": {
            n += $s(a) + ":" + s + ";";
            break;
          }
          default:
            n += a + "{" + s + "}";
        }
      }
    }
  return n;
}
var Ep = /label:\s*([^\s;\n{]+)\s*(;|$)/g,
  Tt,
  af = function (t, r, n) {
    if (
      t.length === 1 &&
      typeof t[0] == "object" &&
      t[0] !== null &&
      t[0].styles !== void 0
    )
      return t[0];
    var o = !0,
      a = "";
    Tt = void 0;
    var i = t[0];
    i == null || i.raw === void 0
      ? ((o = !1), (a += la(n, r, i)))
      : (a += i[0]);
    for (var l = 1; l < t.length; l++) (a += la(n, r, t[l])), o && (a += i[l]);
    Ep.lastIndex = 0;
    for (var s = "", u; (u = Ep.exec(a)) !== null; ) s += "-" + u[1];
    var p = Qb(a) + s;
    return { name: p, styles: a, next: Tt };
  },
  eS = function (t) {
    return t();
  },
  A0 = nd["useInsertionEffect"] ? nd["useInsertionEffect"] : !1,
  tS = A0 || eS,
  _p = A0 || C.exports.useLayoutEffect,
  z0 = C.exports.createContext(
    typeof HTMLElement != "undefined" ? Lb({ key: "css" }) : null
  );
z0.Provider;
var I0 = function (t) {
    return C.exports.forwardRef(function (r, n) {
      var o = C.exports.useContext(z0);
      return t(r, o, n);
    });
  },
  sa = C.exports.createContext({}),
  rS = function (t, r) {
    if (typeof r == "function") {
      var n = r(t);
      return n;
    }
    return el({}, t, r);
  },
  nS = Sp(function (e) {
    return Sp(function (t) {
      return rS(e, t);
    });
  }),
  oS = function (t) {
    var r = C.exports.useContext(sa);
    return (
      t.theme !== r && (r = nS(r)(t.theme)),
      C.exports.createElement(sa.Provider, { value: r }, t.children)
    );
  },
  lf = I0(function (e, t) {
    var r = e.styles,
      n = af([r], void 0, C.exports.useContext(sa)),
      o = C.exports.useRef();
    return (
      _p(
        function () {
          var a = t.key + "-global",
            i = new t.sheet.constructor({
              key: a,
              nonce: t.sheet.nonce,
              container: t.sheet.container,
              speedy: t.sheet.isSpeedy,
            }),
            l = !1,
            s = document.querySelector(
              'style[data-emotion="' + a + " " + n.name + '"]'
            );
          return (
            t.sheet.tags.length && (i.before = t.sheet.tags[0]),
            s !== null &&
              ((l = !0), s.setAttribute("data-emotion", a), i.hydrate([s])),
            (o.current = [i, l]),
            function () {
              i.flush();
            }
          );
        },
        [t]
      ),
      _p(
        function () {
          var a = o.current,
            i = a[0],
            l = a[1];
          if (l) {
            a[1] = !1;
            return;
          }
          if ((n.next !== void 0 && $0(t, n.next, !0), i.tags.length)) {
            var s = i.tags[i.tags.length - 1].nextElementSibling;
            (i.before = s), i.flush();
          }
          t.insert("", n, i, !1);
        },
        [t, n.name]
      ),
      null
    );
  });
function aS() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return af(t);
}
var M0 = function () {
    var t = aS.apply(void 0, arguments),
      r = "animation-" + t.name;
    return {
      name: r,
      styles: "@keyframes " + r + "{" + t.styles + "}",
      anim: 1,
      toString: function () {
        return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
      },
    };
  },
  iS = function () {
    return C.exports.createElement(lf, {
      styles: `
      html {
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        font-family: system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        touch-action: manipulation;
      }

      body {
        position: relative;
        min-height: 100%;
        font-feature-settings: 'kern';
      }

      *,
      *::before,
      *::after {
        border-width: 0;
        border-style: solid;
        box-sizing: border-box;
      }

      main {
        display: block;
      }

      hr {
        border-top-width: 1px;
        box-sizing: content-box;
        height: 0;
        overflow: visible;
      }

      pre,
      code,
      kbd,
      samp {
        font-family: SFMono-Regular,  Menlo, Monaco, Consolas, monospace;
        font-size: 1em;
      }

      a {
        background-color: transparent;
        color: inherit;
        text-decoration: inherit;
      }

      abbr[title] {
        border-bottom: none;
        text-decoration: underline;
        -webkit-text-decoration: underline dotted;
        text-decoration: underline dotted;
      }

      b,
      strong {
        font-weight: bold;
      }

      small {
        font-size: 80%;
      }

      sub,
      sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }

      sub {
        bottom: -0.25em;
      }

      sup {
        top: -0.5em;
      }

      img {
        border-style: none;
      }

      button,
      input,
      optgroup,
      select,
      textarea {
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
        margin: 0;
      }

      button,
      input {
        overflow: visible;
      }

      button,
      select {
        text-transform: none;
      }

      button::-moz-focus-inner,
      [type="button"]::-moz-focus-inner,
      [type="reset"]::-moz-focus-inner,
      [type="submit"]::-moz-focus-inner {
        border-style: none;
        padding: 0;
      }

      fieldset {
        padding: 0.35em 0.75em 0.625em;
      }

      legend {
        box-sizing: border-box;
        color: inherit;
        display: table;
        max-width: 100%;
        padding: 0;
        white-space: normal;
      }

      progress {
        vertical-align: baseline;
      }

      textarea {
        overflow: auto;
      }

      [type="checkbox"],
      [type="radio"] {
        box-sizing: border-box;
        padding: 0;
      }

      [type="number"]::-webkit-inner-spin-button,
      [type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }

      [type="search"] {
        -webkit-appearance: textfield;
        outline-offset: -2px;
      }

      [type="search"]::-webkit-search-decoration {
        -webkit-appearance: none !important;
      }

      ::-webkit-file-upload-button {
        -webkit-appearance: button;
        font: inherit;
      }

      details {
        display: block;
      }

      summary {
        display: list-item;
      }

      template {
        display: none;
      }

      [hidden] {
        display: none !important;
      }

      body,
      blockquote,
      dl,
      dd,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      hr,
      figure,
      p,
      pre {
        margin: 0;
      }

      button {
        background: transparent;
        padding: 0;
      }

      fieldset {
        margin: 0;
        padding: 0;
      }

      ol,
      ul {
        margin: 0;
        padding: 0;
      }

      textarea {
        resize: vertical;
      }

      button,
      [role="button"] {
        cursor: pointer;
      }

      button::-moz-focus-inner {
        border: 0 !important;
      }

      table {
        border-collapse: collapse;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-size: inherit;
        font-weight: inherit;
      }

      button,
      input,
      optgroup,
      select,
      textarea {
        padding: 0;
        line-height: inherit;
        color: inherit;
      }

      img,
      svg,
      video,
      canvas,
      audio,
      iframe,
      embed,
      object {
        display: block;
      }

      img,
      video {
        max-width: 100%;
        height: auto;
      }

      [data-js-focus-visible] :focus:not([data-focus-visible-added]) {
        outline: none;
        box-shadow: none;
      }

      select::-ms-expand {
        display: none;
      }
    `,
    });
  },
  lS = iS,
  Fu = { exports: {} };
(function (e, t) {
  var r = 200,
    n = "__lodash_hash_undefined__",
    o = 800,
    a = 16,
    i = 9007199254740991,
    l = "[object Arguments]",
    s = "[object Array]",
    u = "[object AsyncFunction]",
    p = "[object Boolean]",
    g = "[object Date]",
    v = "[object Error]",
    m = "[object Function]",
    y = "[object GeneratorFunction]",
    w = "[object Map]",
    h = "[object Number]",
    c = "[object Null]",
    d = "[object Object]",
    x = "[object Proxy]",
    k = "[object RegExp]",
    $ = "[object Set]",
    T = "[object String]",
    P = "[object Undefined]",
    O = "[object WeakMap]",
    A = "[object ArrayBuffer]",
    L = "[object DataView]",
    ve = "[object Float32Array]",
    G = "[object Float64Array]",
    Q = "[object Int8Array]",
    Je = "[object Int16Array]",
    Me = "[object Int32Array]",
    jt = "[object Uint8Array]",
    Kn = "[object Uint8ClampedArray]",
    Zn = "[object Uint16Array]",
    Jn = "[object Uint32Array]",
    Wl = /[\\^$.*+?()[\]{}|]/g,
    z = /^\[object .+?Constructor\]$/,
    F = /^(?:0|[1-9]\d*)$/,
    B = {};
  (B[ve] = B[G] = B[Q] = B[Je] = B[Me] = B[jt] = B[Kn] = B[Zn] = B[Jn] = !0),
    (B[l] =
      B[s] =
      B[A] =
      B[p] =
      B[L] =
      B[g] =
      B[v] =
      B[m] =
      B[w] =
      B[h] =
      B[d] =
      B[k] =
      B[$] =
      B[T] =
      B[O] =
        !1);
  var re = typeof Ma == "object" && Ma && Ma.Object === Object && Ma,
    pe = typeof self == "object" && self && self.Object === Object && self,
    He = re || pe || Function("return this")(),
    Et = t && !t.nodeType && t,
    pt = Et && !0 && e && !e.nodeType && e,
    Dt = pt && pt.exports === Et,
    Hl = Dt && re.process,
    kf = (function () {
      try {
        var f = pt && pt.require && pt.require("util").types;
        return f || (Hl && Hl.binding && Hl.binding("util"));
      } catch {}
    })(),
    Ef = kf && kf.isTypedArray;
  function wv(f, b, E) {
    switch (E.length) {
      case 0:
        return f.call(b);
      case 1:
        return f.call(b, E[0]);
      case 2:
        return f.call(b, E[0], E[1]);
      case 3:
        return f.call(b, E[0], E[1], E[2]);
    }
    return f.apply(b, E);
  }
  function kv(f, b) {
    for (var E = -1, I = Array(f); ++E < f; ) I[E] = b(E);
    return I;
  }
  function Ev(f) {
    return function (b) {
      return f(b);
    };
  }
  function _v(f, b) {
    return f == null ? void 0 : f[b];
  }
  function Cv(f, b) {
    return function (E) {
      return f(b(E));
    };
  }
  var Tv = Array.prototype,
    Pv = Function.prototype,
    Ea = Object.prototype,
    Vl = He["__core-js_shared__"],
    _a = Pv.toString,
    Wt = Ea.hasOwnProperty,
    _f = (function () {
      var f = /[^.]+$/.exec((Vl && Vl.keys && Vl.keys.IE_PROTO) || "");
      return f ? "Symbol(src)_1." + f : "";
    })(),
    Cf = Ea.toString,
    $v = _a.call(Object),
    Rv = RegExp(
      "^" +
        _a
          .call(Wt)
          .replace(Wl, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?"
          ) +
        "$"
    ),
    Ca = Dt ? He.Buffer : void 0,
    Tf = He.Symbol,
    Pf = He.Uint8Array,
    $f = Ca ? Ca.allocUnsafe : void 0,
    Rf = Cv(Object.getPrototypeOf, Object),
    Af = Object.create,
    Av = Ea.propertyIsEnumerable,
    zv = Tv.splice,
    Rr = Tf ? Tf.toStringTag : void 0,
    Ta = (function () {
      try {
        var f = Yl(Object, "defineProperty");
        return f({}, "", {}), f;
      } catch {}
    })(),
    Iv = Ca ? Ca.isBuffer : void 0,
    zf = Math.max,
    Mv = Date.now,
    If = Yl(He, "Map"),
    eo = Yl(Object, "create"),
    Ov = (function () {
      function f() {}
      return function (b) {
        if (!zr(b)) return {};
        if (Af) return Af(b);
        f.prototype = b;
        var E = new f();
        return (f.prototype = void 0), E;
      };
    })();
  function Ar(f) {
    var b = -1,
      E = f == null ? 0 : f.length;
    for (this.clear(); ++b < E; ) {
      var I = f[b];
      this.set(I[0], I[1]);
    }
  }
  function Bv() {
    (this.__data__ = eo ? eo(null) : {}), (this.size = 0);
  }
  function Fv(f) {
    var b = this.has(f) && delete this.__data__[f];
    return (this.size -= b ? 1 : 0), b;
  }
  function Nv(f) {
    var b = this.__data__;
    if (eo) {
      var E = b[f];
      return E === n ? void 0 : E;
    }
    return Wt.call(b, f) ? b[f] : void 0;
  }
  function Lv(f) {
    var b = this.__data__;
    return eo ? b[f] !== void 0 : Wt.call(b, f);
  }
  function jv(f, b) {
    var E = this.__data__;
    return (
      (this.size += this.has(f) ? 0 : 1),
      (E[f] = eo && b === void 0 ? n : b),
      this
    );
  }
  (Ar.prototype.clear = Bv),
    (Ar.prototype.delete = Fv),
    (Ar.prototype.get = Nv),
    (Ar.prototype.has = Lv),
    (Ar.prototype.set = jv);
  function Ht(f) {
    var b = -1,
      E = f == null ? 0 : f.length;
    for (this.clear(); ++b < E; ) {
      var I = f[b];
      this.set(I[0], I[1]);
    }
  }
  function Dv() {
    (this.__data__ = []), (this.size = 0);
  }
  function Wv(f) {
    var b = this.__data__,
      E = Pa(b, f);
    if (E < 0) return !1;
    var I = b.length - 1;
    return E == I ? b.pop() : zv.call(b, E, 1), --this.size, !0;
  }
  function Hv(f) {
    var b = this.__data__,
      E = Pa(b, f);
    return E < 0 ? void 0 : b[E][1];
  }
  function Vv(f) {
    return Pa(this.__data__, f) > -1;
  }
  function Uv(f, b) {
    var E = this.__data__,
      I = Pa(E, f);
    return I < 0 ? (++this.size, E.push([f, b])) : (E[I][1] = b), this;
  }
  (Ht.prototype.clear = Dv),
    (Ht.prototype.delete = Wv),
    (Ht.prototype.get = Hv),
    (Ht.prototype.has = Vv),
    (Ht.prototype.set = Uv);
  function nn(f) {
    var b = -1,
      E = f == null ? 0 : f.length;
    for (this.clear(); ++b < E; ) {
      var I = f[b];
      this.set(I[0], I[1]);
    }
  }
  function Gv() {
    (this.size = 0),
      (this.__data__ = {
        hash: new Ar(),
        map: new (If || Ht)(),
        string: new Ar(),
      });
  }
  function Yv(f) {
    var b = Ra(this, f).delete(f);
    return (this.size -= b ? 1 : 0), b;
  }
  function Xv(f) {
    return Ra(this, f).get(f);
  }
  function Qv(f) {
    return Ra(this, f).has(f);
  }
  function qv(f, b) {
    var E = Ra(this, f),
      I = E.size;
    return E.set(f, b), (this.size += E.size == I ? 0 : 1), this;
  }
  (nn.prototype.clear = Gv),
    (nn.prototype.delete = Yv),
    (nn.prototype.get = Xv),
    (nn.prototype.has = Qv),
    (nn.prototype.set = qv);
  function on(f) {
    var b = (this.__data__ = new Ht(f));
    this.size = b.size;
  }
  function Kv() {
    (this.__data__ = new Ht()), (this.size = 0);
  }
  function Zv(f) {
    var b = this.__data__,
      E = b.delete(f);
    return (this.size = b.size), E;
  }
  function Jv(f) {
    return this.__data__.get(f);
  }
  function eg(f) {
    return this.__data__.has(f);
  }
  function tg(f, b) {
    var E = this.__data__;
    if (E instanceof Ht) {
      var I = E.__data__;
      if (!If || I.length < r - 1)
        return I.push([f, b]), (this.size = ++E.size), this;
      E = this.__data__ = new nn(I);
    }
    return E.set(f, b), (this.size = E.size), this;
  }
  (on.prototype.clear = Kv),
    (on.prototype.delete = Zv),
    (on.prototype.get = Jv),
    (on.prototype.has = eg),
    (on.prototype.set = tg);
  function rg(f, b) {
    var E = ql(f),
      I = !E && Ql(f),
      D = !E && !I && Nf(f),
      q = !E && !I && !D && jf(f),
      ne = E || I || D || q,
      j = ne ? kv(f.length, String) : [],
      oe = j.length;
    for (var et in f)
      (b || Wt.call(f, et)) &&
        !(
          ne &&
          (et == "length" ||
            (D && (et == "offset" || et == "parent")) ||
            (q &&
              (et == "buffer" || et == "byteLength" || et == "byteOffset")) ||
            Bf(et, oe))
        ) &&
        j.push(et);
    return j;
  }
  function Ul(f, b, E) {
    ((E !== void 0 && !Aa(f[b], E)) || (E === void 0 && !(b in f))) &&
      Gl(f, b, E);
  }
  function ng(f, b, E) {
    var I = f[b];
    (!(Wt.call(f, b) && Aa(I, E)) || (E === void 0 && !(b in f))) &&
      Gl(f, b, E);
  }
  function Pa(f, b) {
    for (var E = f.length; E--; ) if (Aa(f[E][0], b)) return E;
    return -1;
  }
  function Gl(f, b, E) {
    b == "__proto__" && Ta
      ? Ta(f, b, { configurable: !0, enumerable: !0, value: E, writable: !0 })
      : (f[b] = E);
  }
  var og = gg();
  function $a(f) {
    return f == null
      ? f === void 0
        ? P
        : c
      : Rr && Rr in Object(f)
      ? yg(f)
      : Eg(f);
  }
  function Mf(f) {
    return to(f) && $a(f) == l;
  }
  function ag(f) {
    if (!zr(f) || wg(f)) return !1;
    var b = Zl(f) ? Rv : z;
    return b.test(Pg(f));
  }
  function ig(f) {
    return to(f) && Lf(f.length) && !!B[$a(f)];
  }
  function lg(f) {
    if (!zr(f)) return kg(f);
    var b = Ff(f),
      E = [];
    for (var I in f) (I == "constructor" && (b || !Wt.call(f, I))) || E.push(I);
    return E;
  }
  function Of(f, b, E, I, D) {
    f !== b &&
      og(
        b,
        function (q, ne) {
          if ((D || (D = new on()), zr(q))) sg(f, b, ne, E, Of, I, D);
          else {
            var j = I ? I(Xl(f, ne), q, ne + "", f, b, D) : void 0;
            j === void 0 && (j = q), Ul(f, ne, j);
          }
        },
        Df
      );
  }
  function sg(f, b, E, I, D, q, ne) {
    var j = Xl(f, E),
      oe = Xl(b, E),
      et = ne.get(oe);
    if (et) {
      Ul(f, E, et);
      return;
    }
    var Ve = q ? q(j, oe, E + "", f, b, ne) : void 0,
      ro = Ve === void 0;
    if (ro) {
      var Jl = ql(oe),
        es = !Jl && Nf(oe),
        Hf = !Jl && !es && jf(oe);
      (Ve = oe),
        Jl || es || Hf
          ? ql(j)
            ? (Ve = j)
            : $g(j)
            ? (Ve = mg(j))
            : es
            ? ((ro = !1), (Ve = fg(oe, !0)))
            : Hf
            ? ((ro = !1), (Ve = pg(oe, !0)))
            : (Ve = [])
          : Rg(oe) || Ql(oe)
          ? ((Ve = j),
            Ql(j) ? (Ve = Ag(j)) : (!zr(j) || Zl(j)) && (Ve = bg(oe)))
          : (ro = !1);
    }
    ro && (ne.set(oe, Ve), D(Ve, oe, I, q, ne), ne.delete(oe)), Ul(f, E, Ve);
  }
  function ug(f, b) {
    return Cg(_g(f, b, Wf), f + "");
  }
  var cg = Ta
    ? function (f, b) {
        return Ta(f, "toString", {
          configurable: !0,
          enumerable: !1,
          value: Ig(b),
          writable: !0,
        });
      }
    : Wf;
  function fg(f, b) {
    if (b) return f.slice();
    var E = f.length,
      I = $f ? $f(E) : new f.constructor(E);
    return f.copy(I), I;
  }
  function dg(f) {
    var b = new f.constructor(f.byteLength);
    return new Pf(b).set(new Pf(f)), b;
  }
  function pg(f, b) {
    var E = b ? dg(f.buffer) : f.buffer;
    return new f.constructor(E, f.byteOffset, f.length);
  }
  function mg(f, b) {
    var E = -1,
      I = f.length;
    for (b || (b = Array(I)); ++E < I; ) b[E] = f[E];
    return b;
  }
  function hg(f, b, E, I) {
    var D = !E;
    E || (E = {});
    for (var q = -1, ne = b.length; ++q < ne; ) {
      var j = b[q],
        oe = I ? I(E[j], f[j], j, E, f) : void 0;
      oe === void 0 && (oe = f[j]), D ? Gl(E, j, oe) : ng(E, j, oe);
    }
    return E;
  }
  function vg(f) {
    return ug(function (b, E) {
      var I = -1,
        D = E.length,
        q = D > 1 ? E[D - 1] : void 0,
        ne = D > 2 ? E[2] : void 0;
      for (
        q = f.length > 3 && typeof q == "function" ? (D--, q) : void 0,
          ne && Sg(E[0], E[1], ne) && ((q = D < 3 ? void 0 : q), (D = 1)),
          b = Object(b);
        ++I < D;

      ) {
        var j = E[I];
        j && f(b, j, I, q);
      }
      return b;
    });
  }
  function gg(f) {
    return function (b, E, I) {
      for (var D = -1, q = Object(b), ne = I(b), j = ne.length; j--; ) {
        var oe = ne[f ? j : ++D];
        if (E(q[oe], oe, q) === !1) break;
      }
      return b;
    };
  }
  function Ra(f, b) {
    var E = f.__data__;
    return xg(b) ? E[typeof b == "string" ? "string" : "hash"] : E.map;
  }
  function Yl(f, b) {
    var E = _v(f, b);
    return ag(E) ? E : void 0;
  }
  function yg(f) {
    var b = Wt.call(f, Rr),
      E = f[Rr];
    try {
      f[Rr] = void 0;
      var I = !0;
    } catch {}
    var D = Cf.call(f);
    return I && (b ? (f[Rr] = E) : delete f[Rr]), D;
  }
  function bg(f) {
    return typeof f.constructor == "function" && !Ff(f) ? Ov(Rf(f)) : {};
  }
  function Bf(f, b) {
    var E = typeof f;
    return (
      (b = b == null ? i : b),
      !!b &&
        (E == "number" || (E != "symbol" && F.test(f))) &&
        f > -1 &&
        f % 1 == 0 &&
        f < b
    );
  }
  function Sg(f, b, E) {
    if (!zr(E)) return !1;
    var I = typeof b;
    return (I == "number" ? Kl(E) && Bf(b, E.length) : I == "string" && b in E)
      ? Aa(E[b], f)
      : !1;
  }
  function xg(f) {
    var b = typeof f;
    return b == "string" || b == "number" || b == "symbol" || b == "boolean"
      ? f !== "__proto__"
      : f === null;
  }
  function wg(f) {
    return !!_f && _f in f;
  }
  function Ff(f) {
    var b = f && f.constructor,
      E = (typeof b == "function" && b.prototype) || Ea;
    return f === E;
  }
  function kg(f) {
    var b = [];
    if (f != null) for (var E in Object(f)) b.push(E);
    return b;
  }
  function Eg(f) {
    return Cf.call(f);
  }
  function _g(f, b, E) {
    return (
      (b = zf(b === void 0 ? f.length - 1 : b, 0)),
      function () {
        for (
          var I = arguments, D = -1, q = zf(I.length - b, 0), ne = Array(q);
          ++D < q;

        )
          ne[D] = I[b + D];
        D = -1;
        for (var j = Array(b + 1); ++D < b; ) j[D] = I[D];
        return (j[b] = E(ne)), wv(f, this, j);
      }
    );
  }
  function Xl(f, b) {
    if (!(b === "constructor" && typeof f[b] == "function") && b != "__proto__")
      return f[b];
  }
  var Cg = Tg(cg);
  function Tg(f) {
    var b = 0,
      E = 0;
    return function () {
      var I = Mv(),
        D = a - (I - E);
      if (((E = I), D > 0)) {
        if (++b >= o) return arguments[0];
      } else b = 0;
      return f.apply(void 0, arguments);
    };
  }
  function Pg(f) {
    if (f != null) {
      try {
        return _a.call(f);
      } catch {}
      try {
        return f + "";
      } catch {}
    }
    return "";
  }
  function Aa(f, b) {
    return f === b || (f !== f && b !== b);
  }
  var Ql = Mf(
      (function () {
        return arguments;
      })()
    )
      ? Mf
      : function (f) {
          return to(f) && Wt.call(f, "callee") && !Av.call(f, "callee");
        },
    ql = Array.isArray;
  function Kl(f) {
    return f != null && Lf(f.length) && !Zl(f);
  }
  function $g(f) {
    return to(f) && Kl(f);
  }
  var Nf = Iv || Mg;
  function Zl(f) {
    if (!zr(f)) return !1;
    var b = $a(f);
    return b == m || b == y || b == u || b == x;
  }
  function Lf(f) {
    return typeof f == "number" && f > -1 && f % 1 == 0 && f <= i;
  }
  function zr(f) {
    var b = typeof f;
    return f != null && (b == "object" || b == "function");
  }
  function to(f) {
    return f != null && typeof f == "object";
  }
  function Rg(f) {
    if (!to(f) || $a(f) != d) return !1;
    var b = Rf(f);
    if (b === null) return !0;
    var E = Wt.call(b, "constructor") && b.constructor;
    return typeof E == "function" && E instanceof E && _a.call(E) == $v;
  }
  var jf = Ef ? Ev(Ef) : ig;
  function Ag(f) {
    return hg(f, Df(f));
  }
  function Df(f) {
    return Kl(f) ? rg(f, !0) : lg(f);
  }
  var zg = vg(function (f, b, E, I) {
    Of(f, b, E, I);
  });
  function Ig(f) {
    return function () {
      return f;
    };
  }
  function Wf(f) {
    return f;
  }
  function Mg() {
    return !1;
  }
  e.exports = zg;
})(Fu, Fu.exports);
var ot = Fu.exports;
function sS(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
function Bo(e) {
  return typeof e == "number";
}
function uS(e) {
  return typeof e != "number" || Number.isNaN(e) || !Number.isFinite(e);
}
function sf(e) {
  return Array.isArray(e);
}
function Dr(e) {
  return typeof e == "function";
}
function eT(e) {
  return typeof e == "undefined" || e === void 0;
}
function je(e) {
  var t = typeof e;
  return e != null && (t === "object" || t === "function") && !sf(e);
}
function cS(e) {
  return je(e) && Object.keys(e).length === 0;
}
function tT(e) {
  return e == null;
}
function uf(e) {
  return Object.prototype.toString.call(e) === "[object String]";
}
function O0(e) {
  return /^var\(--.+\)$/.test(e);
}
var fS = !1;
function B0(e, t) {
  var r = {};
  return (
    Object.keys(e).forEach(function (n) {
      t.includes(n) || (r[n] = e[n]);
    }),
    r
  );
}
function dS(e, t) {
  var r = {};
  return (
    t.forEach(function (n) {
      n in e && (r[n] = e[n]);
    }),
    r
  );
}
function pS(e, t, r, n) {
  var o = typeof t == "string" ? t.split(".") : [t];
  for (n = 0; n < o.length && e; n += 1) e = e[o[n]];
  return e === void 0 ? r : e;
}
var mS = function (t) {
    var r = new WeakMap(),
      n = function (a, i, l, s) {
        if (typeof a == "undefined") return t(a, i, l);
        r.has(a) || r.set(a, new Map());
        var u = r.get(a);
        if (u.has(i)) return u.get(i);
        var p = t(a, i, l, s);
        return u.set(i, p), p;
      };
    return n;
  },
  Ll = mS(pS);
function F0(e, t) {
  var r = {};
  return (
    Object.keys(e).forEach(function (n) {
      var o = e[n],
        a = t(o, n, e);
      a && (r[n] = o);
    }),
    r
  );
}
var cf = function (t) {
    return F0(t, function (r) {
      return r != null;
    });
  },
  ff = function (t) {
    return Object.keys(t);
  },
  tl = function (t) {
    return t.reduce(function (r, n) {
      var o = n[0],
        a = n[1];
      return (r[o] = a), r;
    }, {});
  };
function hS(e) {
  var t = parseFloat(e.toString()),
    r = e.toString().replace(String(t), "");
  return { unitless: !r, value: t, unit: r };
}
function Nu(e) {
  if (e == null) return e;
  var t = hS(e),
    r = t.unitless;
  return r || Bo(e) ? e + "px" : e;
}
var N0 = function (t, r) {
    return parseInt(t[1], 10) > parseInt(r[1], 10) ? 1 : -1;
  },
  df = function (t) {
    return tl(Object.entries(t).sort(N0));
  };
function Cp(e) {
  var t = df(e);
  return Object.assign(Object.values(t), t);
}
function vS(e) {
  var t = Object.keys(df(e));
  return new Set(t);
}
function gS(e) {
  var t;
  if (!e) return e;
  e = (t = Nu(e)) != null ? t : e;
  var r = e.endsWith("px") ? -1 : -0.0635;
  return Bo(e)
    ? "" + (e + r)
    : e.replace(/([0-9]+\.?[0-9]*)/, function (n) {
        return "" + (parseFloat(n) + r);
      });
}
function Xa(e, t) {
  var r = ["@media screen"];
  return (
    e && r.push("and", "(min-width: " + Nu(e) + ")"),
    t && r.push("and", "(max-width: " + Nu(t) + ")"),
    r.join(" ")
  );
}
function yS(e) {
  var t;
  if (!e) return null;
  e.base = (t = e.base) != null ? t : "0px";
  var r = Cp(e),
    n = Object.entries(e)
      .sort(N0)
      .map(function (i, l, s) {
        var u,
          p = i[0],
          g = i[1],
          v = (u = s[l + 1]) != null ? u : [],
          m = v[1];
        return (
          (m = parseFloat(m) > 0 ? gS(m) : void 0),
          {
            breakpoint: p,
            minW: g,
            maxW: m,
            maxWQuery: Xa(null, m),
            minWQuery: Xa(g),
            minMaxQuery: Xa(g, m),
          }
        );
      }),
    o = vS(e),
    a = Array.from(o.values());
  return {
    keys: o,
    normalized: r,
    isResponsive: function (l) {
      var s = Object.keys(l);
      return (
        s.length > 0 &&
        s.every(function (u) {
          return o.has(u);
        })
      );
    },
    asObject: df(e),
    asArray: Cp(e),
    details: n,
    media: [null].concat(
      r
        .map(function (i) {
          return Xa(i);
        })
        .slice(1)
    ),
    toArrayValue: function (l) {
      if (!je(l)) throw new Error("toArrayValue: value must be an object");
      for (
        var s = a.map(function (u) {
          var p;
          return (p = l[u]) != null ? p : null;
        });
        sS(s) === null;

      )
        s.pop();
      return s;
    },
    toObjectValue: function (l) {
      if (!Array.isArray(l))
        throw new Error("toObjectValue: value must be an array");
      return l.reduce(function (s, u, p) {
        var g = a[p];
        return g != null && u != null && (s[g] = u), s;
      }, {});
    },
  };
}
function pf(e) {
  return (
    e != null &&
    typeof e == "object" &&
    "nodeType" in e &&
    e.nodeType === Node.ELEMENT_NODE
  );
}
function L0(e) {
  var t;
  if (!pf(e)) return !1;
  var r = (t = e.ownerDocument.defaultView) != null ? t : window;
  return e instanceof r.HTMLElement;
}
function rT(e) {
  var t, r;
  return pf(e) && (t = (r = mf(e)) == null ? void 0 : r.defaultView) != null
    ? t
    : window;
}
function mf(e) {
  var t;
  return pf(e) && (t = e.ownerDocument) != null ? t : document;
}
function bS() {
  return !!(
    typeof window != "undefined" &&
    window.document &&
    window.document.createElement
  );
}
var Sa = bS(),
  Tp = function (t) {
    return t ? "" : void 0;
  },
  nT = function (t) {
    return t ? !0 : void 0;
  },
  $r = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return r.filter(Boolean).join(" ");
  };
function oT(e) {
  var t = e.key,
    r = e.keyCode,
    n = r >= 37 && r <= 40 && t.indexOf("Arrow") !== 0,
    o = n ? "Arrow" + t : t;
  return o;
}
function SS(e) {
  return L0(e) && e.tagName.toLowerCase() === "input" && "select" in e;
}
function xS(e) {
  var t = L0(e) ? mf(e) : document;
  return t.activeElement === e;
}
function Pp(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function wS(e, t) {
  if (!!e) {
    if (typeof e == "string") return Pp(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (
      (r === "Object" && e.constructor && (r = e.constructor.name),
      r === "Map" || r === "Set")
    )
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return Pp(e, t);
  }
}
function kS(e, t) {
  var r =
    (typeof Symbol != "undefined" && e[Symbol.iterator]) || e["@@iterator"];
  if (r) return (r = r.call(e)).next.bind(r);
  if (
    Array.isArray(e) ||
    (r = wS(e)) ||
    (t && e && typeof e.length == "number")
  ) {
    r && (e = r);
    var n = 0;
    return function () {
      return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function at(e) {
  for (
    var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
    n < t;
    n++
  )
    r[n - 1] = arguments[n];
  return Dr(e) ? e.apply(void 0, r) : e;
}
function aT() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return function (o) {
    t.some(function (a) {
      return a == null || a(o), o == null ? void 0 : o.defaultPrevented;
    });
  };
}
function ES(e) {
  var t;
  return function () {
    if (e) {
      for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
        o[a] = arguments[a];
      (t = e.apply(this, o)), (e = null);
    }
    return t;
  };
}
var ua = function () {},
  hf = ES(function (e) {
    return function () {
      var t = e.condition,
        r = e.message;
      t && fS && console.warn(r);
    };
  }),
  _S = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return function (o) {
      return r.reduce(function (a, i) {
        return i(a);
      }, o);
    };
  };
function iT(e, t) {
  t === void 0 && (t = {});
  var r = t,
    n = r.isActive,
    o = n === void 0 ? xS : n,
    a = r.nextTick,
    i = r.preventScroll,
    l = i === void 0 ? !0 : i,
    s = r.selectTextIfInput,
    u = s === void 0 ? !0 : s;
  if (!e || o(e)) return -1;
  function p() {
    if (!e) {
      hf({
        condition: !0,
        message:
          "[chakra-ui]: can't call focus() on `null` or `undefined` element",
      });
      return;
    }
    if (CS()) e.focus({ preventScroll: l });
    else if ((e.focus(), l)) {
      var g = TS(e);
      PS(g);
    }
    SS(e) && u && e.select();
  }
  return a ? requestAnimationFrame(p) : (p(), -1);
}
var Qa = null;
function CS() {
  if (Qa == null) {
    Qa = !1;
    try {
      var e = document.createElement("div");
      e.focus({
        get preventScroll() {
          return (Qa = !0), !0;
        },
      });
    } catch {}
  }
  return Qa;
}
function TS(e) {
  for (
    var t,
      r = mf(e),
      n = (t = r.defaultView) != null ? t : window,
      o = e.parentNode,
      a = [],
      i = r.scrollingElement || r.documentElement;
    o instanceof n.HTMLElement && o !== i;

  )
    (o.offsetHeight < o.scrollHeight || o.offsetWidth < o.scrollWidth) &&
      a.push({ element: o, scrollTop: o.scrollTop, scrollLeft: o.scrollLeft }),
      (o = o.parentNode);
  return (
    i instanceof n.HTMLElement &&
      a.push({ element: i, scrollTop: i.scrollTop, scrollLeft: i.scrollLeft }),
    a
  );
}
function PS(e) {
  for (var t = kS(e), r; !(r = t()).done; ) {
    var n = r.value,
      o = n.element,
      a = n.scrollTop,
      i = n.scrollLeft;
    (o.scrollTop = a), (o.scrollLeft = i);
  }
}
function Lu(e, t) {
  return (
    t === void 0 && (t = 1 / 0),
    (!je(e) && !Array.isArray(e)) || !t
      ? e
      : Object.entries(e).reduce(function (r, n) {
          var o = n[0],
            a = n[1];
          return (
            je(a) || sf(a)
              ? Object.entries(Lu(a, t - 1)).forEach(function (i) {
                  var l = i[0],
                    s = i[1];
                  r[o + "." + l] = s;
                })
              : (r[o] = a),
            r
          );
        }, {})
  );
}
var lT = Number.MIN_SAFE_INTEGER || -9007199254740991,
  sT = Number.MAX_SAFE_INTEGER || 9007199254740991;
function $S(e) {
  var t = parseFloat(e);
  return uS(t) ? 0 : t;
}
function uT(e, t) {
  var r = $S(e),
    n = Math.pow(10, t != null ? t : 10);
  return (r = Math.round(r * n) / n), t ? r.toFixed(t) : r.toString();
}
function cT(e) {
  if (!Number.isFinite(e)) return 0;
  for (var t = 1, r = 0; Math.round(e * t) / t !== e; ) (t *= 10), (r += 1);
  return r;
}
function fT(e, t, r) {
  return ((e - t) * 100) / (r - t);
}
function dT(e, t, r) {
  return e == null
    ? e
    : (hf({ condition: r < t, message: "clamp: max cannot be less than min" }),
      Math.min(Math.max(e, t), r));
}
Object.freeze(["base", "sm", "md", "lg", "xl", "2xl"]);
function j0(e, t) {
  return sf(e)
    ? e.map(function (r) {
        return r === null ? null : t(r);
      })
    : je(e)
    ? ff(e).reduce(function (r, n) {
        return (r[n] = t(e[n])), r;
      }, {})
    : e != null
    ? t(e)
    : null;
}
function RS(e, t) {
  if (e != null) {
    if (Dr(e)) {
      e(t);
      return;
    }
    try {
      e.current = t;
    } catch {
      throw new Error("Cannot assign value '" + t + "' to ref '" + e + "'");
    }
  }
}
function pT() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return function (n) {
    t.forEach(function (o) {
      return RS(o, n);
    });
  };
}
function xa(e) {
  e === void 0 && (e = {});
  var t = e,
    r = t.strict,
    n = r === void 0 ? !0 : r,
    o = t.errorMessage,
    a =
      o === void 0
        ? "useContext: `context` is undefined. Seems you forgot to wrap component within the Provider"
        : o,
    i = t.name,
    l = C.exports.createContext(void 0);
  l.displayName = i;
  function s() {
    var u = C.exports.useContext(l);
    if (!u && n) {
      var p = new Error(a);
      throw (
        ((p.name = "ContextError"),
        Error.captureStackTrace == null || Error.captureStackTrace(p, s),
        p)
      );
    }
    return u;
  }
  return [l.Provider, s, l];
}
function D0(e) {
  return C.exports.Children.toArray(e).filter(function (t) {
    return C.exports.isValidElement(t);
  });
}
var AS = Sa ? C.exports.useLayoutEffect : C.exports.useEffect;
function vf(e, t) {
  t === void 0 && (t = []);
  var r = C.exports.useRef(e);
  return (
    AS(function () {
      r.current = e;
    }),
    C.exports.useCallback(function () {
      for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
        o[a] = arguments[a];
      return r.current == null ? void 0 : r.current.apply(r, o);
    }, t)
  );
}
function mT(e, t, r, n) {
  var o = vf(t);
  return (
    C.exports.useEffect(
      function () {
        var a,
          i = (a = at(r)) != null ? a : document;
        if (!!t)
          return (
            i.addEventListener(e, o, n),
            function () {
              i.removeEventListener(e, o, n);
            }
          );
      },
      [e, r, n, o, t]
    ),
    function () {
      var a,
        i = (a = at(r)) != null ? a : document;
      i.removeEventListener(e, o, n);
    }
  );
}
function hT(e) {
  e === void 0 && (e = !1);
  var t = C.exports.useState(e),
    r = t[0],
    n = t[1],
    o = C.exports.useMemo(function () {
      return {
        on: function () {
          return n(!0);
        },
        off: function () {
          return n(!1);
        },
        toggle: function () {
          return n(function (i) {
            return !i;
          });
        },
      };
    }, []);
  return [r, o];
}
function vT(e, t) {
  var r = e !== void 0,
    n = r && typeof e != "undefined" ? e : t;
  return [r, n];
}
var zS = { current: 1 },
  W0 = C.exports.createContext(zS),
  IS = C.exports.memo(function (e) {
    var t = e.children;
    return C.exports.createElement(W0.Provider, { value: { current: 1 } }, t);
  }),
  MS = function (t) {
    return t.current++;
  };
function gT(e, t) {
  var r = C.exports.useContext(W0),
    n = C.exports.useState(r.current),
    o = n[0],
    a = n[1];
  return (
    C.exports.useEffect(
      function () {
        a(MS(r));
      },
      [r]
    ),
    C.exports.useMemo(
      function () {
        return e || [t, o].filter(Boolean).join("-");
      },
      [e, t, o]
    )
  );
}
var yT = function (t, r) {
  var n = C.exports.useRef(!1);
  return (
    C.exports.useEffect(function () {
      if (n.current) return t();
      n.current = !0;
    }, r),
    n.current
  );
};
function bT(e, t) {
  return (
    t === void 0 && (t = []),
    C.exports.useEffect(function () {
      return function () {
        return e();
      };
    }, t)
  );
}
function ST(e, t) {
  var r = vf(e);
  C.exports.useEffect(
    function () {
      var n = null,
        o = function () {
          return r();
        };
      return (
        t !== null && (n = window.setInterval(o, t)),
        function () {
          n && window.clearInterval(n);
        }
      );
    },
    [t, r]
  );
}
function OS(e, t) {
  if (e != null) {
    if (typeof e == "function") {
      e(t);
      return;
    }
    try {
      e.current = t;
    } catch {
      throw new Error("Cannot assign value '" + t + "' to ref '" + e + "'");
    }
  }
}
function BS() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return C.exports.useMemo(function () {
    return t.every(function (n) {
      return n == null;
    })
      ? null
      : function (n) {
          t.forEach(function (o) {
            o && OS(o, n);
          });
        };
  }, t);
}
function xT(e, t) {
  var r = vf(e);
  C.exports.useEffect(
    function () {
      if (t != null) {
        var n = null;
        return (
          (n = window.setTimeout(function () {
            r();
          }, t)),
          function () {
            n && window.clearTimeout(n);
          }
        );
      }
    },
    [t, r]
  );
}
var FS = xa({ strict: !1, name: "PortalManagerContext" }),
  NS = FS[0];
function LS(e) {
  var t = e.children,
    r = e.zIndex;
  return C.exports.createElement(NS, { value: { zIndex: r } }, t);
}
xa({ strict: !1, name: "PortalContext" });
var jS = {
    body: { classList: { add: function () {}, remove: function () {} } },
    addEventListener: function () {},
    removeEventListener: function () {},
    activeElement: { blur: function () {}, nodeName: "" },
    querySelector: function () {
      return null;
    },
    querySelectorAll: function () {
      return [];
    },
    getElementById: function () {
      return null;
    },
    createEvent: function () {
      return { initEvent: function () {} };
    },
    createElement: function () {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute: function () {},
        getElementsByTagName: function () {
          return [];
        },
      };
    },
  },
  H0 = jS,
  ln = function () {},
  DS = {
    document: H0,
    navigator: { userAgent: "" },
    CustomEvent: function () {
      return this;
    },
    addEventListener: ln,
    removeEventListener: ln,
    getComputedStyle: function () {
      return {
        getPropertyValue: function () {
          return "";
        },
      };
    },
    matchMedia: function () {
      return { matches: !1, addListener: ln, removeListener: ln };
    },
    requestAnimationFrame: function (t) {
      return typeof setTimeout == "undefined" ? (t(), null) : setTimeout(t, 0);
    },
    cancelAnimationFrame: function (t) {
      typeof setTimeout != "undefined" && clearTimeout(t);
    },
    setTimeout: function () {
      return 0;
    },
    clearTimeout: ln,
    setInterval: function () {
      return 0;
    },
    clearInterval: ln,
  },
  WS = DS,
  HS = { window: WS, document: H0 },
  V0 = Sa ? { window, document } : HS,
  U0 = C.exports.createContext(V0);
function VS() {
  return C.exports.useContext(U0);
}
function US(e) {
  var t = e.children,
    r = e.environment,
    n = C.exports.useState(null),
    o = n[0],
    a = n[1],
    i = C.exports.useMemo(
      function () {
        var s,
          u = o == null ? void 0 : o.ownerDocument,
          p = o == null ? void 0 : o.ownerDocument.defaultView,
          g = u ? { document: u, window: p } : void 0,
          v = (s = r != null ? r : g) != null ? s : V0;
        return v;
      },
      [o, r]
    ),
    l = !o && !r;
  return Qr.createElement(
    U0.Provider,
    { value: i },
    t,
    l &&
      Qr.createElement("span", {
        ref: function (u) {
          u && a(u);
        },
      })
  );
}
var qa = { light: "chakra-ui-light", dark: "chakra-ui-dark" },
  GS = { classList: { add: ua, remove: ua } },
  YS = function (t) {
    return Sa ? t.body : GS;
  };
function XS(e, t) {
  var r = YS(t);
  r.classList.add(e ? qa.dark : qa.light),
    r.classList.remove(e ? qa.light : qa.dark);
}
function QS(e) {
  var t = window.matchMedia == null ? void 0 : window.matchMedia(e);
  if (!!t) return !!t.media === t.matches;
}
var G0 = {
  light: "(prefers-color-scheme: light)",
  dark: "(prefers-color-scheme: dark)",
};
function qS(e) {
  var t,
    r = (t = QS(G0.dark)) != null ? t : e === "dark";
  return r ? "dark" : "light";
}
function KS(e) {
  if (!("matchMedia" in window)) return ua;
  var t = window.matchMedia(G0.dark),
    r = function () {
      e(t.matches ? "dark" : "light", !0);
    };
  return (
    t.addEventListener("change", r),
    function () {
      t.removeEventListener("change", r);
    }
  );
}
var $p = {
    get: function () {
      return (
        document.documentElement.style.getPropertyValue(
          "--chakra-ui-color-mode"
        ) || document.documentElement.dataset.theme
      );
    },
    set: function (t) {
      Sa &&
        (document.documentElement.style.setProperty(
          "--chakra-ui-color-mode",
          t
        ),
        document.documentElement.setAttribute("data-theme", t));
    },
  },
  Rp = function () {
    return typeof Storage != "undefined";
  },
  Ap = "chakra-ui-color-mode",
  ZS = {
    get: function (t) {
      if (!Rp()) return t;
      try {
        var r = localStorage.getItem(Ap);
        return r != null ? r : t;
      } catch {
        return t;
      }
    },
    set: function (t) {
      if (!!Rp())
        try {
          localStorage.setItem(Ap, t);
        } catch {}
    },
    type: "localStorage",
  },
  Y0 = C.exports.createContext({}),
  X0 = function () {
    var t = C.exports.useContext(Y0);
    if (t === void 0)
      throw new Error("useColorMode must be used within a ColorModeProvider");
    return t;
  };
function JS(e) {
  var t = e.value,
    r = e.children,
    n = e.options,
    o = n.useSystemColorMode,
    a = n.initialColorMode,
    i = e.colorModeManager,
    l = i === void 0 ? ZS : i,
    s = a === "dark" ? "dark" : "light",
    u = C.exports.useState(l.type === "cookie" ? l.get(s) : s),
    p = u[0],
    g = u[1],
    v = VS(),
    m = v.document;
  C.exports.useEffect(
    function () {
      if (Sa && l.type === "localStorage") {
        var c = qS(s);
        if (o) return g(c);
        var d = $p.get(),
          x = l.get();
        return g(d || x || (a === "system" ? c : s));
      }
    },
    [l, o, s, a]
  ),
    C.exports.useEffect(
      function () {
        var c = p === "dark";
        XS(c, m), $p.set(c ? "dark" : "light");
      },
      [p, m]
    );
  var y = C.exports.useCallback(
      function (c, d) {
        if ((d === void 0 && (d = !1), !d)) l.set(c);
        else if (l.get() && !o) return;
        g(c);
      },
      [l, o]
    ),
    w = C.exports.useCallback(
      function () {
        y(p === "light" ? "dark" : "light");
      },
      [p, y]
    );
  C.exports.useEffect(
    function () {
      var c = o || a === "system",
        d;
      return (
        c && (d = KS(y)),
        function () {
          d && c && d();
        }
      );
    },
    [y, o, a]
  );
  var h = C.exports.useMemo(
    function () {
      return {
        colorMode: t != null ? t : p,
        toggleColorMode: t ? ua : w,
        setColorMode: t ? ua : y,
      };
    },
    [p, y, w, t]
  );
  return C.exports.createElement(Y0.Provider, { value: h }, r);
}
function ca() {
  return (
    (ca =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    ca.apply(this, arguments)
  );
}
var ex = function (t, r) {
  return function (n) {
    var o = String(r),
      a = t ? t + "." + o : o;
    return je(n.__cssMap) && a in n.__cssMap ? n.__cssMap[a].varRef : r;
  };
};
function fa(e) {
  var t = e.scale,
    r = e.transform,
    n = e.compose,
    o = function (i, l) {
      var s,
        u = ex(t, i)(l),
        p = (s = r == null ? void 0 : r(u, l)) != null ? s : u;
      return n && (p = n(p, l)), p;
    };
  return o;
}
function ht(e, t) {
  return function (r) {
    var n = { property: r, scale: e };
    return (n.transform = fa({ scale: e, transform: t })), n;
  };
}
var tx = function (t) {
  var r = t.rtl,
    n = t.ltr;
  return function (o) {
    return o.direction === "rtl" ? r : n;
  };
};
function rx(e) {
  var t = e.property,
    r = e.scale,
    n = e.transform;
  return {
    scale: r,
    property: tx(t),
    transform: r ? fa({ scale: r, compose: n }) : n,
  };
}
var Rs,
  As,
  Q0 = [
    "rotate(var(--chakra-rotate, 0))",
    "scaleX(var(--chakra-scale-x, 1))",
    "scaleY(var(--chakra-scale-y, 1))",
    "skewX(var(--chakra-skew-x, 0))",
    "skewY(var(--chakra-skew-y, 0))",
  ];
function nx() {
  return [
    "translateX(var(--chakra-translate-x, 0))",
    "translateY(var(--chakra-translate-y, 0))",
  ]
    .concat(Q0)
    .join(" ");
}
function ox() {
  return [
    "translate3d(var(--chakra-translate-x, 0), var(--chakra-translate-y, 0), 0)",
  ]
    .concat(Q0)
    .join(" ");
}
var ax = {
    "--chakra-blur": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-invert": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-sepia": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-drop-shadow": "var(--chakra-empty,/*!*/ /*!*/)",
    filter: [
      "var(--chakra-blur)",
      "var(--chakra-brightness)",
      "var(--chakra-contrast)",
      "var(--chakra-grayscale)",
      "var(--chakra-hue-rotate)",
      "var(--chakra-invert)",
      "var(--chakra-saturate)",
      "var(--chakra-sepia)",
      "var(--chakra-drop-shadow)",
    ].join(" "),
  },
  ix = {
    backdropFilter: [
      "var(--chakra-backdrop-blur)",
      "var(--chakra-backdrop-brightness)",
      "var(--chakra-backdrop-contrast)",
      "var(--chakra-backdrop-grayscale)",
      "var(--chakra-backdrop-hue-rotate)",
      "var(--chakra-backdrop-invert)",
      "var(--chakra-backdrop-opacity)",
      "var(--chakra-backdrop-saturate)",
      "var(--chakra-backdrop-sepia)",
    ].join(" "),
    "--chakra-backdrop-blur": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-invert": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-opacity": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-backdrop-sepia": "var(--chakra-empty,/*!*/ /*!*/)",
  };
function lx(e) {
  return {
    "--chakra-ring-offset-shadow":
      "var(--chakra-ring-inset) 0 0 0 var(--chakra-ring-offset-width) var(--chakra-ring-offset-color)",
    "--chakra-ring-shadow":
      "var(--chakra-ring-inset) 0 0 0 calc(var(--chakra-ring-width) + var(--chakra-ring-offset-width)) var(--chakra-ring-color)",
    "--chakra-ring-width": e,
    boxShadow: [
      "var(--chakra-ring-offset-shadow)",
      "var(--chakra-ring-shadow)",
      "var(--chakra-shadow, 0 0 #0000)",
    ].join(", "),
  };
}
var sx = {
    "row-reverse": {
      space: "--chakra-space-x-reverse",
      divide: "--chakra-divide-x-reverse",
    },
    "column-reverse": {
      space: "--chakra-space-y-reverse",
      divide: "--chakra-divide-y-reverse",
    },
  },
  q0 = "& > :not(style) ~ :not(style)",
  ux =
    ((Rs = {}),
    (Rs[q0] = {
      marginInlineStart:
        "calc(var(--chakra-space-x) * calc(1 - var(--chakra-space-x-reverse)))",
      marginInlineEnd:
        "calc(var(--chakra-space-x) * var(--chakra-space-x-reverse))",
    }),
    Rs),
  cx =
    ((As = {}),
    (As[q0] = {
      marginTop:
        "calc(var(--chakra-space-y) * calc(1 - var(--chakra-space-y-reverse)))",
      marginBottom:
        "calc(var(--chakra-space-y) * var(--chakra-space-y-reverse))",
    }),
    As);
function rl(e, t) {
  return (
    (rl =
      Object.setPrototypeOf ||
      function (n, o) {
        return (n.__proto__ = o), n;
      }),
    rl(e, t)
  );
}
function fx(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  (e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    t && rl(e, t);
}
function ju() {
  ju = function (o, a) {
    return new r(o, void 0, a);
  };
  var e = RegExp.prototype,
    t = new WeakMap();
  function r(o, a, i) {
    var l = new RegExp(o, a);
    return t.set(l, i || t.get(o)), rl(l, r.prototype);
  }
  fx(r, RegExp),
    (r.prototype.exec = function (o) {
      var a = e.exec.call(this, o);
      return a && (a.groups = n(a, this)), a;
    }),
    (r.prototype[Symbol.replace] = function (o, a) {
      if (typeof a == "string") {
        var i = t.get(this);
        return e[Symbol.replace].call(
          this,
          o,
          a.replace(/\$<([^>]+)>/g, function (s, u) {
            return "$" + i[u];
          })
        );
      } else if (typeof a == "function") {
        var l = this;
        return e[Symbol.replace].call(this, o, function () {
          var s = arguments;
          return (
            typeof s[s.length - 1] != "object" &&
              ((s = [].slice.call(s)), s.push(n(s, l))),
            a.apply(this, s)
          );
        });
      } else return e[Symbol.replace].call(this, o, a);
    });
  function n(o, a) {
    var i = t.get(a);
    return Object.keys(i).reduce(function (l, s) {
      return (l[s] = o[i[s]]), l;
    }, Object.create(null));
  }
  return ju.apply(this, arguments);
}
var Du = {
    "to-t": "to top",
    "to-tr": "to top right",
    "to-r": "to right",
    "to-br": "to bottom right",
    "to-b": "to bottom",
    "to-bl": "to bottom left",
    "to-l": "to left",
    "to-tl": "to top left",
  },
  dx = new Set(Object.values(Du)),
  K0 = new Set([
    "none",
    "-moz-initial",
    "inherit",
    "initial",
    "revert",
    "unset",
  ]),
  px = function (t) {
    return t.trim();
  };
function mx(e, t) {
  var r, n;
  if (e == null || K0.has(e)) return e;
  var o = ju(/(^[\x2DA-Za-z]+)\(((.*))\)/g, { type: 1, values: 2 }),
    a = (r = (n = o.exec(e)) == null ? void 0 : n.groups) != null ? r : {},
    i = a.type,
    l = a.values;
  if (!i || !l) return e;
  var s = i.includes("-gradient") ? i : i + "-gradient",
    u = l.split(",").map(px).filter(Boolean),
    p = u[0],
    g = u.slice(1);
  if ((g == null ? void 0 : g.length) === 0) return e;
  var v = p in Du ? Du[p] : p;
  g.unshift(v);
  var m = g.map(function (y) {
    if (dx.has(y)) return y;
    var w = y.indexOf(" "),
      h = w !== -1 ? [y.substr(0, w), y.substr(w + 1)] : [y],
      c = h[0],
      d = h[1],
      x = Z0(d) ? d : d && d.split(" "),
      k = "colors." + c,
      $ = k in t.__cssMap ? t.__cssMap[k].varRef : c;
    return x ? [$].concat(Array.isArray(x) ? x : [x]).join(" ") : $;
  });
  return s + "(" + m.join(", ") + ")";
}
var Z0 = function (t) {
    return uf(t) && t.includes("(") && t.includes(")");
  },
  hx = function (t, r) {
    return mx(t, r != null ? r : {});
  },
  vx = function (t) {
    var r = parseFloat(t.toString()),
      n = t.toString().replace(String(r), "");
    return { unitless: !n, value: r, unit: n };
  },
  _t = function (t) {
    return function (r) {
      return t + "(" + r + ")";
    };
  },
  Y = {
    filter: function (t) {
      return t !== "auto" ? t : ax;
    },
    backdropFilter: function (t) {
      return t !== "auto" ? t : ix;
    },
    ring: function (t) {
      return lx(Y.px(t));
    },
    bgClip: function (t) {
      return t === "text"
        ? { color: "transparent", backgroundClip: "text" }
        : { backgroundClip: t };
    },
    transform: function (t) {
      return t === "auto" ? nx() : t === "auto-gpu" ? ox() : t;
    },
    px: function (t) {
      if (t == null) return t;
      var r = vx(t),
        n = r.unitless;
      return n || Bo(t) ? t + "px" : t;
    },
    fraction: function (t) {
      return !Bo(t) || t > 1 ? t : t * 100 + "%";
    },
    float: function (t, r) {
      var n = { left: "right", right: "left" };
      return r.direction === "rtl" ? n[t] : t;
    },
    degree: function (t) {
      if (O0(t) || t == null) return t;
      var r = uf(t) && !t.endsWith("deg");
      return Bo(t) || r ? t + "deg" : t;
    },
    gradient: hx,
    blur: _t("blur"),
    opacity: _t("opacity"),
    brightness: _t("brightness"),
    contrast: _t("contrast"),
    dropShadow: _t("drop-shadow"),
    grayscale: _t("grayscale"),
    hueRotate: _t("hue-rotate"),
    invert: _t("invert"),
    saturate: _t("saturate"),
    sepia: _t("sepia"),
    bgImage: function (t) {
      if (t == null) return t;
      var r = Z0(t) || K0.has(t);
      return r ? t : "url(" + t + ")";
    },
    outline: function (t) {
      var r = String(t) === "0" || String(t) === "none";
      return t !== null && r
        ? { outline: "2px solid transparent", outlineOffset: "2px" }
        : { outline: t };
    },
    flexDirection: function (t) {
      var r,
        n = (r = sx[t]) != null ? r : {},
        o = n.space,
        a = n.divide,
        i = { flexDirection: t };
      return o && (i[o] = 1), a && (i[a] = 1), i;
    },
  },
  S = {
    borderWidths: ht("borderWidths"),
    borderStyles: ht("borderStyles"),
    colors: ht("colors"),
    borders: ht("borders"),
    radii: ht("radii", Y.px),
    space: ht("space", Y.px),
    spaceT: ht("space", Y.px),
    degreeT: function (t) {
      return { property: t, transform: Y.degree };
    },
    prop: function (t, r, n) {
      return ca(
        { property: t, scale: r },
        r && { transform: fa({ scale: r, transform: n }) }
      );
    },
    propT: function (t, r) {
      return { property: t, transform: r };
    },
    sizes: ht("sizes", Y.px),
    sizesT: ht("sizes", Y.fraction),
    shadows: ht("shadows"),
    logical: rx,
    blur: ht("blur", Y.blur),
  },
  _i = {
    background: S.colors("background"),
    backgroundColor: S.colors("backgroundColor"),
    backgroundImage: S.propT("backgroundImage", Y.bgImage),
    backgroundSize: !0,
    backgroundPosition: !0,
    backgroundRepeat: !0,
    backgroundAttachment: !0,
    backgroundClip: { transform: Y.bgClip },
    bgSize: S.prop("backgroundSize"),
    bgPosition: S.prop("backgroundPosition"),
    bg: S.colors("background"),
    bgColor: S.colors("backgroundColor"),
    bgPos: S.prop("backgroundPosition"),
    bgRepeat: S.prop("backgroundRepeat"),
    bgAttachment: S.prop("backgroundAttachment"),
    bgGradient: S.propT("backgroundImage", Y.gradient),
    bgClip: { transform: Y.bgClip },
  };
Object.assign(_i, { bgImage: _i.backgroundImage, bgImg: _i.backgroundImage });
var H = {
  border: S.borders("border"),
  borderWidth: S.borderWidths("borderWidth"),
  borderStyle: S.borderStyles("borderStyle"),
  borderColor: S.colors("borderColor"),
  borderRadius: S.radii("borderRadius"),
  borderTop: S.borders("borderTop"),
  borderBlockStart: S.borders("borderBlockStart"),
  borderTopLeftRadius: S.radii("borderTopLeftRadius"),
  borderStartStartRadius: S.logical({
    scale: "radii",
    property: { ltr: "borderTopLeftRadius", rtl: "borderTopRightRadius" },
  }),
  borderEndStartRadius: S.logical({
    scale: "radii",
    property: { ltr: "borderBottomLeftRadius", rtl: "borderBottomRightRadius" },
  }),
  borderTopRightRadius: S.radii("borderTopRightRadius"),
  borderStartEndRadius: S.logical({
    scale: "radii",
    property: { ltr: "borderTopRightRadius", rtl: "borderTopLeftRadius" },
  }),
  borderEndEndRadius: S.logical({
    scale: "radii",
    property: { ltr: "borderBottomRightRadius", rtl: "borderBottomLeftRadius" },
  }),
  borderRight: S.borders("borderRight"),
  borderInlineEnd: S.borders("borderInlineEnd"),
  borderBottom: S.borders("borderBottom"),
  borderBlockEnd: S.borders("borderBlockEnd"),
  borderBottomLeftRadius: S.radii("borderBottomLeftRadius"),
  borderBottomRightRadius: S.radii("borderBottomRightRadius"),
  borderLeft: S.borders("borderLeft"),
  borderInlineStart: { property: "borderInlineStart", scale: "borders" },
  borderInlineStartRadius: S.logical({
    scale: "radii",
    property: {
      ltr: ["borderTopLeftRadius", "borderBottomLeftRadius"],
      rtl: ["borderTopRightRadius", "borderBottomRightRadius"],
    },
  }),
  borderInlineEndRadius: S.logical({
    scale: "radii",
    property: {
      ltr: ["borderTopRightRadius", "borderBottomRightRadius"],
      rtl: ["borderTopLeftRadius", "borderBottomLeftRadius"],
    },
  }),
  borderX: S.borders(["borderLeft", "borderRight"]),
  borderInline: S.borders("borderInline"),
  borderY: S.borders(["borderTop", "borderBottom"]),
  borderBlock: S.borders("borderBlock"),
  borderTopWidth: S.borderWidths("borderTopWidth"),
  borderBlockStartWidth: S.borderWidths("borderBlockStartWidth"),
  borderTopColor: S.colors("borderTopColor"),
  borderBlockStartColor: S.colors("borderBlockStartColor"),
  borderTopStyle: S.borderStyles("borderTopStyle"),
  borderBlockStartStyle: S.borderStyles("borderBlockStartStyle"),
  borderBottomWidth: S.borderWidths("borderBottomWidth"),
  borderBlockEndWidth: S.borderWidths("borderBlockEndWidth"),
  borderBottomColor: S.colors("borderBottomColor"),
  borderBlockEndColor: S.colors("borderBlockEndColor"),
  borderBottomStyle: S.borderStyles("borderBottomStyle"),
  borderBlockEndStyle: S.borderStyles("borderBlockEndStyle"),
  borderLeftWidth: S.borderWidths("borderLeftWidth"),
  borderInlineStartWidth: S.borderWidths("borderInlineStartWidth"),
  borderLeftColor: S.colors("borderLeftColor"),
  borderInlineStartColor: S.colors("borderInlineStartColor"),
  borderLeftStyle: S.borderStyles("borderLeftStyle"),
  borderInlineStartStyle: S.borderStyles("borderInlineStartStyle"),
  borderRightWidth: S.borderWidths("borderRightWidth"),
  borderInlineEndWidth: S.borderWidths("borderInlineEndWidth"),
  borderRightColor: S.colors("borderRightColor"),
  borderInlineEndColor: S.colors("borderInlineEndColor"),
  borderRightStyle: S.borderStyles("borderRightStyle"),
  borderInlineEndStyle: S.borderStyles("borderInlineEndStyle"),
  borderTopRadius: S.radii(["borderTopLeftRadius", "borderTopRightRadius"]),
  borderBottomRadius: S.radii([
    "borderBottomLeftRadius",
    "borderBottomRightRadius",
  ]),
  borderLeftRadius: S.radii(["borderTopLeftRadius", "borderBottomLeftRadius"]),
  borderRightRadius: S.radii([
    "borderTopRightRadius",
    "borderBottomRightRadius",
  ]),
};
Object.assign(H, {
  rounded: H.borderRadius,
  roundedTop: H.borderTopRadius,
  roundedTopLeft: H.borderTopLeftRadius,
  roundedTopRight: H.borderTopRightRadius,
  roundedTopStart: H.borderStartStartRadius,
  roundedTopEnd: H.borderStartEndRadius,
  roundedBottom: H.borderBottomRadius,
  roundedBottomLeft: H.borderBottomLeftRadius,
  roundedBottomRight: H.borderBottomRightRadius,
  roundedBottomStart: H.borderEndStartRadius,
  roundedBottomEnd: H.borderEndEndRadius,
  roundedLeft: H.borderLeftRadius,
  roundedRight: H.borderRightRadius,
  roundedStart: H.borderInlineStartRadius,
  roundedEnd: H.borderInlineEndRadius,
  borderStart: H.borderInlineStart,
  borderEnd: H.borderInlineEnd,
  borderTopStartRadius: H.borderStartStartRadius,
  borderTopEndRadius: H.borderStartEndRadius,
  borderBottomStartRadius: H.borderEndStartRadius,
  borderBottomEndRadius: H.borderEndEndRadius,
  borderStartRadius: H.borderInlineStartRadius,
  borderEndRadius: H.borderInlineEndRadius,
  borderStartWidth: H.borderInlineStartWidth,
  borderEndWidth: H.borderInlineEndWidth,
  borderStartColor: H.borderInlineStartColor,
  borderEndColor: H.borderInlineEndColor,
  borderStartStyle: H.borderInlineStartStyle,
  borderEndStyle: H.borderInlineEndStyle,
});
var gx = {
    color: S.colors("color"),
    textColor: S.colors("color"),
    fill: S.colors("fill"),
    stroke: S.colors("stroke"),
  },
  Wu = {
    boxShadow: S.shadows("boxShadow"),
    mixBlendMode: !0,
    blendMode: S.prop("mixBlendMode"),
    backgroundBlendMode: !0,
    bgBlendMode: S.prop("backgroundBlendMode"),
    opacity: !0,
  };
Object.assign(Wu, { shadow: Wu.boxShadow });
var yx = {
    filter: { transform: Y.filter },
    blur: S.blur("--chakra-blur"),
    brightness: S.propT("--chakra-brightness", Y.brightness),
    contrast: S.propT("--chakra-contrast", Y.contrast),
    hueRotate: S.degreeT("--chakra-hue-rotate"),
    invert: S.propT("--chakra-invert", Y.invert),
    saturate: S.propT("--chakra-saturate", Y.saturate),
    dropShadow: S.propT("--chakra-drop-shadow", Y.dropShadow),
    backdropFilter: { transform: Y.backdropFilter },
    backdropBlur: S.blur("--chakra-backdrop-blur"),
    backdropBrightness: S.propT("--chakra-backdrop-brightness", Y.brightness),
    backdropContrast: S.propT("--chakra-backdrop-contrast", Y.contrast),
    backdropHueRotate: S.degreeT("--chakra-backdrop-hue-rotate"),
    backdropInvert: S.propT("--chakra-backdrop-invert", Y.invert),
    backdropSaturate: S.propT("--chakra-backdrop-saturate", Y.saturate),
  },
  nl = {
    alignItems: !0,
    alignContent: !0,
    justifyItems: !0,
    justifyContent: !0,
    flexWrap: !0,
    flexDirection: { transform: Y.flexDirection },
    experimental_spaceX: {
      static: ux,
      transform: fa({
        scale: "space",
        transform: function (t) {
          return t !== null ? { "--chakra-space-x": t } : null;
        },
      }),
    },
    experimental_spaceY: {
      static: cx,
      transform: fa({
        scale: "space",
        transform: function (t) {
          return t != null ? { "--chakra-space-y": t } : null;
        },
      }),
    },
    flex: !0,
    flexFlow: !0,
    flexGrow: !0,
    flexShrink: !0,
    flexBasis: S.sizes("flexBasis"),
    justifySelf: !0,
    alignSelf: !0,
    order: !0,
    placeItems: !0,
    placeContent: !0,
    placeSelf: !0,
    gap: S.space("gap"),
    rowGap: S.space("rowGap"),
    columnGap: S.space("columnGap"),
  };
Object.assign(nl, { flexDir: nl.flexDirection });
var J0 = {
    gridGap: S.space("gridGap"),
    gridColumnGap: S.space("gridColumnGap"),
    gridRowGap: S.space("gridRowGap"),
    gridColumn: !0,
    gridRow: !0,
    gridAutoFlow: !0,
    gridAutoColumns: !0,
    gridColumnStart: !0,
    gridColumnEnd: !0,
    gridRowStart: !0,
    gridRowEnd: !0,
    gridAutoRows: !0,
    gridTemplate: !0,
    gridTemplateColumns: !0,
    gridTemplateRows: !0,
    gridTemplateAreas: !0,
    gridArea: !0,
  },
  bx = {
    appearance: !0,
    cursor: !0,
    resize: !0,
    userSelect: !0,
    pointerEvents: !0,
    outline: { transform: Y.outline },
    outlineOffset: !0,
    outlineColor: S.colors("outlineColor"),
  },
  tt = {
    width: S.sizesT("width"),
    inlineSize: S.sizesT("inlineSize"),
    height: S.sizes("height"),
    blockSize: S.sizes("blockSize"),
    boxSize: S.sizes(["width", "height"]),
    minWidth: S.sizes("minWidth"),
    minInlineSize: S.sizes("minInlineSize"),
    minHeight: S.sizes("minHeight"),
    minBlockSize: S.sizes("minBlockSize"),
    maxWidth: S.sizes("maxWidth"),
    maxInlineSize: S.sizes("maxInlineSize"),
    maxHeight: S.sizes("maxHeight"),
    maxBlockSize: S.sizes("maxBlockSize"),
    d: S.prop("display"),
    overflow: !0,
    overflowX: !0,
    overflowY: !0,
    overscrollBehavior: !0,
    overscrollBehaviorX: !0,
    overscrollBehaviorY: !0,
    display: !0,
    verticalAlign: !0,
    boxSizing: !0,
    boxDecorationBreak: !0,
    float: S.propT("float", Y.float),
    objectFit: !0,
    objectPosition: !0,
    visibility: !0,
    isolation: !0,
  };
Object.assign(tt, {
  w: tt.width,
  h: tt.height,
  minW: tt.minWidth,
  maxW: tt.maxWidth,
  minH: tt.minHeight,
  maxH: tt.maxHeight,
  overscroll: tt.overscrollBehavior,
  overscrollX: tt.overscrollBehaviorX,
  overscrollY: tt.overscrollBehaviorY,
});
var Sx = {
    listStyleType: !0,
    listStylePosition: !0,
    listStylePos: S.prop("listStylePosition"),
    listStyleImage: !0,
    listStyleImg: S.prop("listStyleImage"),
  },
  xx = {
    border: "0px",
    clip: "rect(0, 0, 0, 0)",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: "0px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    position: "absolute",
  },
  wx = {
    position: "static",
    width: "auto",
    height: "auto",
    clip: "auto",
    padding: "0",
    margin: "0",
    overflow: "visible",
    whiteSpace: "normal",
  },
  zs = function (t, r, n) {
    var o = {},
      a = Ll(t, r, {});
    for (var i in a) {
      var l = i in n && n[i] != null;
      l || (o[i] = a[i]);
    }
    return o;
  },
  kx = {
    srOnly: {
      transform: function (t) {
        return t === !0 ? xx : t === "focusable" ? wx : {};
      },
    },
    layerStyle: {
      processResult: !0,
      transform: function (t, r, n) {
        return zs(r, "layerStyles." + t, n);
      },
    },
    textStyle: {
      processResult: !0,
      transform: function (t, r, n) {
        return zs(r, "textStyles." + t, n);
      },
    },
    apply: {
      processResult: !0,
      transform: function (t, r, n) {
        return zs(r, t, n);
      },
    },
  },
  Fo = {
    position: !0,
    pos: S.prop("position"),
    zIndex: S.prop("zIndex", "zIndices"),
    inset: S.spaceT("inset"),
    insetX: S.spaceT(["left", "right"]),
    insetInline: S.spaceT("insetInline"),
    insetY: S.spaceT(["top", "bottom"]),
    insetBlock: S.spaceT("insetBlock"),
    top: S.spaceT("top"),
    insetBlockStart: S.spaceT("insetBlockStart"),
    bottom: S.spaceT("bottom"),
    insetBlockEnd: S.spaceT("insetBlockEnd"),
    left: S.spaceT("left"),
    insetInlineStart: S.logical({
      scale: "space",
      property: { ltr: "left", rtl: "right" },
    }),
    right: S.spaceT("right"),
    insetInlineEnd: S.logical({
      scale: "space",
      property: { ltr: "right", rtl: "left" },
    }),
  };
Object.assign(Fo, {
  insetStart: Fo.insetInlineStart,
  insetEnd: Fo.insetInlineEnd,
});
var Ex = {
    ring: { transform: Y.ring },
    ringColor: S.colors("--chakra-ring-color"),
    ringOffset: S.prop("--chakra-ring-offset-width"),
    ringOffsetColor: S.colors("--chakra-ring-offset-color"),
    ringInset: S.prop("--chakra-ring-inset"),
  },
  ee = {
    margin: S.spaceT("margin"),
    marginTop: S.spaceT("marginTop"),
    marginBlockStart: S.spaceT("marginBlockStart"),
    marginRight: S.spaceT("marginRight"),
    marginInlineEnd: S.spaceT("marginInlineEnd"),
    marginBottom: S.spaceT("marginBottom"),
    marginBlockEnd: S.spaceT("marginBlockEnd"),
    marginLeft: S.spaceT("marginLeft"),
    marginInlineStart: S.spaceT("marginInlineStart"),
    marginX: S.spaceT(["marginInlineStart", "marginInlineEnd"]),
    marginInline: S.spaceT("marginInline"),
    marginY: S.spaceT(["marginTop", "marginBottom"]),
    marginBlock: S.spaceT("marginBlock"),
    padding: S.space("padding"),
    paddingTop: S.space("paddingTop"),
    paddingBlockStart: S.space("paddingBlockStart"),
    paddingRight: S.space("paddingRight"),
    paddingBottom: S.space("paddingBottom"),
    paddingBlockEnd: S.space("paddingBlockEnd"),
    paddingLeft: S.space("paddingLeft"),
    paddingInlineStart: S.space("paddingInlineStart"),
    paddingInlineEnd: S.space("paddingInlineEnd"),
    paddingX: S.space(["paddingInlineStart", "paddingInlineEnd"]),
    paddingInline: S.space("paddingInline"),
    paddingY: S.space(["paddingTop", "paddingBottom"]),
    paddingBlock: S.space("paddingBlock"),
  };
Object.assign(ee, {
  m: ee.margin,
  mt: ee.marginTop,
  mr: ee.marginRight,
  me: ee.marginInlineEnd,
  marginEnd: ee.marginInlineEnd,
  mb: ee.marginBottom,
  ml: ee.marginLeft,
  ms: ee.marginInlineStart,
  marginStart: ee.marginInlineStart,
  mx: ee.marginX,
  my: ee.marginY,
  p: ee.padding,
  pt: ee.paddingTop,
  py: ee.paddingY,
  px: ee.paddingX,
  pb: ee.paddingBottom,
  pl: ee.paddingLeft,
  ps: ee.paddingInlineStart,
  paddingStart: ee.paddingInlineStart,
  pr: ee.paddingRight,
  pe: ee.paddingInlineEnd,
  paddingEnd: ee.paddingInlineEnd,
});
var _x = {
    textDecorationColor: S.colors("textDecorationColor"),
    textDecoration: !0,
    textDecor: { property: "textDecoration" },
    textDecorationLine: !0,
    textDecorationStyle: !0,
    textDecorationThickness: !0,
    textUnderlineOffset: !0,
    textShadow: S.shadows("textShadow"),
  },
  Cx = {
    clipPath: !0,
    transform: S.propT("transform", Y.transform),
    transformOrigin: !0,
    translateX: S.spaceT("--chakra-translate-x"),
    translateY: S.spaceT("--chakra-translate-y"),
    skewX: S.degreeT("--chakra-skew-x"),
    skewY: S.degreeT("--chakra-skew-y"),
    scaleX: S.prop("--chakra-scale-x"),
    scaleY: S.prop("--chakra-scale-y"),
    scale: S.prop(["--chakra-scale-x", "--chakra-scale-y"]),
    rotate: S.degreeT("--chakra-rotate"),
  },
  Tx = {
    transition: !0,
    transitionDelay: !0,
    animation: !0,
    willChange: !0,
    transitionDuration: S.prop("transitionDuration", "transition.duration"),
    transitionProperty: S.prop("transitionProperty", "transition.property"),
    transitionTimingFunction: S.prop(
      "transitionTimingFunction",
      "transition.easing"
    ),
  },
  Px = {
    fontFamily: S.prop("fontFamily", "fonts"),
    fontSize: S.prop("fontSize", "fontSizes", Y.px),
    fontWeight: S.prop("fontWeight", "fontWeights"),
    lineHeight: S.prop("lineHeight", "lineHeights"),
    letterSpacing: S.prop("letterSpacing", "letterSpacings"),
    textAlign: !0,
    fontStyle: !0,
    wordBreak: !0,
    overflowWrap: !0,
    textOverflow: !0,
    textTransform: !0,
    whiteSpace: !0,
    noOfLines: {
      static: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "var(--chakra-line-clamp)",
      },
      property: "--chakra-line-clamp",
    },
    isTruncated: {
      transform: function (t) {
        if (t === !0)
          return {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          };
      },
    },
  },
  $x = {
    scrollBehavior: !0,
    scrollSnapAlign: !0,
    scrollSnapStop: !0,
    scrollSnapType: !0,
    scrollMargin: S.spaceT("scrollMargin"),
    scrollMarginTop: S.spaceT("scrollMarginTop"),
    scrollMarginBottom: S.spaceT("scrollMarginBottom"),
    scrollMarginLeft: S.spaceT("scrollMarginLeft"),
    scrollMarginRight: S.spaceT("scrollMarginRight"),
    scrollMarginX: S.spaceT(["scrollMarginLeft", "scrollMarginRight"]),
    scrollMarginY: S.spaceT(["scrollMarginTop", "scrollMarginBottom"]),
    scrollPadding: S.spaceT("scrollPadding"),
    scrollPaddingTop: S.spaceT("scrollPaddingTop"),
    scrollPaddingBottom: S.spaceT("scrollPaddingBottom"),
    scrollPaddingLeft: S.spaceT("scrollPaddingLeft"),
    scrollPaddingRight: S.spaceT("scrollPaddingRight"),
    scrollPaddingX: S.spaceT(["scrollPaddingLeft", "scrollPaddingRight"]),
    scrollPaddingY: S.spaceT(["scrollPaddingTop", "scrollPaddingBottom"]),
  };
function zp(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Rx(e, t) {
  if (!!e) {
    if (typeof e == "string") return zp(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (
      (r === "Object" && e.constructor && (r = e.constructor.name),
      r === "Map" || r === "Set")
    )
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return zp(e, t);
  }
}
function Ax(e, t) {
  var r =
    (typeof Symbol != "undefined" && e[Symbol.iterator]) || e["@@iterator"];
  if (r) return (r = r.call(e)).next.bind(r);
  if (
    Array.isArray(e) ||
    (r = Rx(e)) ||
    (t && e && typeof e.length == "number")
  ) {
    r && (e = r);
    var n = 0;
    return function () {
      return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
var xe = {
    hover: function (t, r) {
      return t + ":hover " + r + ", " + t + "[data-hover] " + r;
    },
    focus: function (t, r) {
      return t + ":focus " + r + ", " + t + "[data-focus] " + r;
    },
    focusVisible: function (t, r) {
      return t + ":focus-visible " + r;
    },
    focusWithin: function (t, r) {
      return t + ":focus-within " + r;
    },
    active: function (t, r) {
      return t + ":active " + r + ", " + t + "[data-active] " + r;
    },
    disabled: function (t, r) {
      return t + ":disabled " + r + ", " + t + "[data-disabled] " + r;
    },
    invalid: function (t, r) {
      return t + ":invalid " + r + ", " + t + "[data-invalid] " + r;
    },
    checked: function (t, r) {
      return t + ":checked " + r + ", " + t + "[data-checked] " + r;
    },
    indeterminate: function (t, r) {
      return (
        t +
        ":indeterminate " +
        r +
        ", " +
        t +
        "[aria-checked=mixed] " +
        r +
        ", " +
        t +
        "[data-indeterminate] " +
        r
      );
    },
    readOnly: function (t, r) {
      return (
        t +
        ":read-only " +
        r +
        ", " +
        t +
        "[readonly] " +
        r +
        ", " +
        t +
        "[data-read-only] " +
        r
      );
    },
    expanded: function (t, r) {
      return (
        t +
        ":read-only " +
        r +
        ", " +
        t +
        "[aria-expanded=true] " +
        r +
        ", " +
        t +
        "[data-expanded] " +
        r
      );
    },
    placeholderShown: function (t, r) {
      return t + ":placeholder-shown " + r;
    },
  },
  rr = function (t) {
    return ev(
      function (r) {
        return t(r, "&");
      },
      "[role=group]",
      "[data-group]",
      ".group"
    );
  },
  Vt = function (t) {
    return ev(
      function (r) {
        return t(r, "~ &");
      },
      "[data-peer]",
      ".peer"
    );
  },
  ev = function (t) {
    for (
      var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1;
      o < r;
      o++
    )
      n[o - 1] = arguments[o];
    return n.map(t).join(", ");
  },
  da = {
    _hover: "&:hover, &[data-hover]",
    _active: "&:active, &[data-active]",
    _focus: "&:focus, &[data-focus]",
    _highlighted: "&[data-highlighted]",
    _focusWithin: "&:focus-within",
    _focusVisible: "&:focus-visible",
    _disabled: "&[disabled], &[aria-disabled=true], &[data-disabled]",
    _readOnly: "&[aria-readonly=true], &[readonly], &[data-readonly]",
    _before: "&::before",
    _after: "&::after",
    _empty: "&:empty",
    _expanded: "&[aria-expanded=true], &[data-expanded]",
    _checked: "&[aria-checked=true], &[data-checked]",
    _grabbed: "&[aria-grabbed=true], &[data-grabbed]",
    _pressed: "&[aria-pressed=true], &[data-pressed]",
    _invalid: "&[aria-invalid=true], &[data-invalid]",
    _valid: "&[data-valid], &[data-state=valid]",
    _loading: "&[data-loading], &[aria-busy=true]",
    _selected: "&[aria-selected=true], &[data-selected]",
    _hidden: "&[hidden], &[data-hidden]",
    _autofill: "&:-webkit-autofill",
    _even: "&:nth-of-type(even)",
    _odd: "&:nth-of-type(odd)",
    _first: "&:first-of-type",
    _last: "&:last-of-type",
    _notFirst: "&:not(:first-of-type)",
    _notLast: "&:not(:last-of-type)",
    _visited: "&:visited",
    _activeLink: "&[aria-current=page]",
    _activeStep: "&[aria-current=step]",
    _indeterminate:
      "&:indeterminate, &[aria-checked=mixed], &[data-indeterminate]",
    _groupHover: rr(xe.hover),
    _peerHover: Vt(xe.hover),
    _groupFocus: rr(xe.focus),
    _peerFocus: Vt(xe.focus),
    _groupFocusVisible: rr(xe.focusVisible),
    _peerFocusVisible: Vt(xe.focusVisible),
    _groupActive: rr(xe.active),
    _peerActive: Vt(xe.active),
    _groupDisabled: rr(xe.disabled),
    _peerDisabled: Vt(xe.disabled),
    _groupInvalid: rr(xe.invalid),
    _peerInvalid: Vt(xe.invalid),
    _groupChecked: rr(xe.checked),
    _peerChecked: Vt(xe.checked),
    _groupFocusWithin: rr(xe.focusWithin),
    _peerFocusWithin: Vt(xe.focusWithin),
    _peerPlaceholderShown: Vt(xe.placeholderShown),
    _placeholder: "&::placeholder",
    _placeholderShown: "&:placeholder-shown",
    _fullScreen: "&:fullscreen",
    _selection: "&::selection",
    _rtl: "[dir=rtl] &, &[dir=rtl]",
    _ltr: "[dir=ltr] &, &[dir=ltr]",
    _mediaDark: "@media (prefers-color-scheme: dark)",
    _mediaReduceMotion: "@media (prefers-reduced-motion: reduce)",
    _dark:
      ".chakra-ui-dark &:not([data-theme]),[data-theme=dark] &:not([data-theme]),&[data-theme=dark]",
    _light:
      ".chakra-ui-light &:not([data-theme]),[data-theme=light] &:not([data-theme]),&[data-theme=light]",
  },
  zx = ff(da),
  gf = ot(
    {},
    _i,
    H,
    gx,
    nl,
    tt,
    yx,
    Ex,
    bx,
    J0,
    kx,
    Fo,
    Wu,
    ee,
    $x,
    Px,
    _x,
    Cx,
    Sx,
    Tx
  );
Object.assign({}, ee, tt, nl, J0, Fo);
var Ix = [].concat(ff(gf), zx),
  Mx = ca({}, gf, da),
  Ox = function (t) {
    return t in Mx;
  },
  Bx = function (t) {
    return function (r) {
      if (!r.__breakpoints) return t;
      var n = r.__breakpoints,
        o = n.isResponsive,
        a = n.toArrayValue,
        i = n.media,
        l = {};
      for (var s in t) {
        var u = at(t[s], r);
        if (u != null) {
          if (((u = je(u) && o(u) ? a(u) : u), !Array.isArray(u))) {
            l[s] = u;
            continue;
          }
          for (var p = u.slice(0, i.length).length, g = 0; g < p; g += 1) {
            var v = i == null ? void 0 : i[g];
            if (!v) {
              l[s] = u[g];
              continue;
            }
            (l[v] = l[v] || {}), u[g] != null && (l[v][s] = u[g]);
          }
        }
      }
      return l;
    };
  },
  Fx = function (t, r) {
    return t.startsWith("--") && uf(r) && !O0(r);
  },
  Nx = function (t, r) {
    var n, o;
    if (r == null) return r;
    var a = function (g) {
        var v, m;
        return (v = t.__cssMap) == null || (m = v[g]) == null
          ? void 0
          : m.varRef;
      },
      i = function (g) {
        var v;
        return (v = a(g)) != null ? v : g;
      },
      l = r.split(",").map(function (p) {
        return p.trim();
      }),
      s = l[0],
      u = l[1];
    return (r = (n = (o = a(s)) != null ? o : i(u)) != null ? n : i(r)), r;
  };
function Lx(e) {
  var t = e.configs,
    r = t === void 0 ? {} : t,
    n = e.pseudos,
    o = n === void 0 ? {} : n,
    a = e.theme,
    i = function l(s, u) {
      u === void 0 && (u = !1);
      var p = at(s, a),
        g = Bx(p)(a),
        v = {};
      for (var m in g) {
        var y,
          w,
          h,
          c,
          d,
          x = g[m],
          k = at(x, a);
        m in o && (m = o[m]), Fx(m, k) && (k = Nx(a, k));
        var $ = r[m];
        if (($ === !0 && ($ = { property: m }), je(k))) {
          var T;
          (v[m] = (T = v[m]) != null ? T : {}), (v[m] = ot({}, v[m], l(k, !0)));
          continue;
        }
        var P =
          (y =
            (w = $) == null || w.transform == null
              ? void 0
              : w.transform(k, a, p)) != null
            ? y
            : k;
        P = (h = $) != null && h.processResult ? l(P, !0) : P;
        var O = at((c = $) == null ? void 0 : c.property, a);
        if (!u && (d = $) != null && d.static) {
          var A = at($.static, a);
          v = ot({}, v, A);
        }
        if (O && Array.isArray(O)) {
          for (var L = Ax(O), ve; !(ve = L()).done; ) {
            var G = ve.value;
            v[G] = P;
          }
          continue;
        }
        if (O) {
          O === "&" && je(P) ? (v = ot({}, v, P)) : (v[O] = P);
          continue;
        }
        if (je(P)) {
          v = ot({}, v, P);
          continue;
        }
        v[m] = P;
      }
      return v;
    };
  return i;
}
var tv = function (t) {
  return function (r) {
    var n = Lx({ theme: r, pseudos: da, configs: gf });
    return n(t);
  };
};
function rv(e) {
  return je(e) && e.reference ? e.reference : String(e);
}
var jl = function (t) {
    for (
      var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1;
      o < r;
      o++
    )
      n[o - 1] = arguments[o];
    return n
      .map(rv)
      .join(" " + t + " ")
      .replace(/calc/g, "");
  },
  Ip = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + jl.apply(void 0, ["+"].concat(r)) + ")";
  },
  Mp = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + jl.apply(void 0, ["-"].concat(r)) + ")";
  },
  Hu = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + jl.apply(void 0, ["*"].concat(r)) + ")";
  },
  Op = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + jl.apply(void 0, ["/"].concat(r)) + ")";
  },
  Bp = function (t) {
    var r = rv(t);
    return r != null && !Number.isNaN(parseFloat(r))
      ? String(r).startsWith("-")
        ? String(r).slice(1)
        : "-" + r
      : Hu(r, -1);
  },
  Mr = Object.assign(
    function (e) {
      return {
        add: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Mr(Ip.apply(void 0, [e].concat(n)));
        },
        subtract: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Mr(Mp.apply(void 0, [e].concat(n)));
        },
        multiply: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Mr(Hu.apply(void 0, [e].concat(n)));
        },
        divide: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Mr(Op.apply(void 0, [e].concat(n)));
        },
        negate: function () {
          return Mr(Bp(e));
        },
        toString: function () {
          return e.toString();
        },
      };
    },
    { add: Ip, subtract: Mp, multiply: Hu, divide: Op, negate: Bp }
  );
function jx(e, t) {
  return t === void 0 && (t = "-"), e.replace(/\s+/g, t);
}
function nv(e) {
  var t = jx(e.toString());
  if (t.includes("\\.")) return e;
  var r = !Number.isInteger(parseFloat(e.toString()));
  return r ? t.replace(".", "\\.") : e;
}
function Dx(e, t) {
  return t === void 0 && (t = ""), [t, nv(e)].filter(Boolean).join("-");
}
function Wx(e, t) {
  return "var(" + nv(e) + (t ? ", " + t : "") + ")";
}
function Hx(e, t) {
  return t === void 0 && (t = ""), "--" + Dx(e, t);
}
function Vx(e, t, r) {
  var n = Hx(e, r);
  return { variable: n, reference: Wx(n, t) };
}
function Fp(e, t) {
  return Vx(String(e).replace(/\./g, "-"), void 0, t);
}
function Ux(e, t) {
  for (
    var r = {},
      n = {},
      o = function () {
        var u = i[a],
          p = u[0],
          g = u[1],
          v = g.isSemantic,
          m = g.value,
          y = Fp(p, t == null ? void 0 : t.cssVarPrefix),
          w = y.variable,
          h = y.reference;
        if (!v) {
          if (p.startsWith("space")) {
            var c = p.split("."),
              d = c[0],
              x = c.slice(1),
              k = d + ".-" + x.join("."),
              $ = Mr.negate(m),
              T = Mr.negate(h);
            n[k] = { value: $, var: w, varRef: T };
          }
          return (
            (r[w] = m), (n[p] = { value: m, var: w, varRef: h }), "continue"
          );
        }
        var P = function (L) {
            var ve = String(p).split(".")[0],
              G = [ve, L].join("."),
              Q = e[G];
            if (!Q) return L;
            var Je = Fp(G, t == null ? void 0 : t.cssVarPrefix),
              Me = Je.reference;
            return Me;
          },
          O = je(m) ? m : { default: m };
        (r = ot(
          r,
          Object.entries(O).reduce(function (A, L) {
            var ve,
              G,
              Q = L[0],
              Je = L[1],
              Me = P(Je);
            if (Q === "default") return (A[w] = Me), A;
            var jt = (ve = da == null ? void 0 : da[Q]) != null ? ve : Q;
            return (A[jt] = ((G = {}), (G[w] = Me), G)), A;
          }, {})
        )),
          (n[p] = { value: h, var: w, varRef: h });
      },
      a = 0,
      i = Object.entries(e);
    a < i.length;
    a++
  )
    var l = o();
  return { cssVars: r, cssMap: n };
}
function Gx(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    o,
    a;
  for (a = 0; a < n.length; a++)
    (o = n[a]), !(t.indexOf(o) >= 0) && (r[o] = e[o]);
  return r;
}
var Yx = ["__cssMap", "__cssVars", "__breakpoints"],
  Xx = [
    "colors",
    "borders",
    "borderWidths",
    "borderStyles",
    "fonts",
    "fontSizes",
    "fontWeights",
    "letterSpacings",
    "lineHeights",
    "radii",
    "space",
    "shadows",
    "sizes",
    "zIndices",
    "transition",
    "blur",
  ];
function Qx(e) {
  var t = Xx;
  return dS(e, t);
}
function qx(e) {
  return e.semanticTokens;
}
function Kx(e) {
  e.__cssMap, e.__cssVars, e.__breakpoints;
  var t = Gx(e, Yx);
  return t;
}
function Zx(e) {
  var t,
    r,
    n = e.tokens,
    o = e.semanticTokens,
    a = Object.entries((t = Lu(n)) != null ? t : {}).map(function (l) {
      var s = l[0],
        u = l[1],
        p = { isSemantic: !1, value: u };
      return [s, p];
    }),
    i = Object.entries((r = Lu(o, 1)) != null ? r : {}).map(function (l) {
      var s = l[0],
        u = l[1],
        p = { isSemantic: !0, value: u };
      return [s, p];
    });
  return tl([].concat(a, i));
}
function Jx(e) {
  var t,
    r = Kx(e),
    n = Qx(r),
    o = qx(r),
    a = Zx({ tokens: n, semanticTokens: o }),
    i = (t = r.config) == null ? void 0 : t.cssVarPrefix,
    l = Ux(a, { cssVarPrefix: i }),
    s = l.cssMap,
    u = l.cssVars,
    p = {
      "--chakra-ring-inset": "var(--chakra-empty,/*!*/ /*!*/)",
      "--chakra-ring-offset-width": "0px",
      "--chakra-ring-offset-color": "#fff",
      "--chakra-ring-color": "rgba(66, 153, 225, 0.6)",
      "--chakra-ring-offset-shadow": "0 0 #0000",
      "--chakra-ring-shadow": "0 0 #0000",
      "--chakra-space-x-reverse": "0",
      "--chakra-space-y-reverse": "0",
    };
  return (
    Object.assign(r, {
      __cssVars: ca({}, p, u),
      __cssMap: s,
      __breakpoints: yS(r.breakpoints),
    }),
    r
  );
}
var ew = typeof Element != "undefined",
  tw = typeof Map == "function",
  rw = typeof Set == "function",
  nw = typeof ArrayBuffer == "function" && !!ArrayBuffer.isView;
function Ci(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var r, n, o;
    if (Array.isArray(e)) {
      if (((r = e.length), r != t.length)) return !1;
      for (n = r; n-- !== 0; ) if (!Ci(e[n], t[n])) return !1;
      return !0;
    }
    var a;
    if (tw && e instanceof Map && t instanceof Map) {
      if (e.size !== t.size) return !1;
      for (a = e.entries(); !(n = a.next()).done; )
        if (!t.has(n.value[0])) return !1;
      for (a = e.entries(); !(n = a.next()).done; )
        if (!Ci(n.value[1], t.get(n.value[0]))) return !1;
      return !0;
    }
    if (rw && e instanceof Set && t instanceof Set) {
      if (e.size !== t.size) return !1;
      for (a = e.entries(); !(n = a.next()).done; )
        if (!t.has(n.value[0])) return !1;
      return !0;
    }
    if (nw && ArrayBuffer.isView(e) && ArrayBuffer.isView(t)) {
      if (((r = e.length), r != t.length)) return !1;
      for (n = r; n-- !== 0; ) if (e[n] !== t[n]) return !1;
      return !0;
    }
    if (e.constructor === RegExp)
      return e.source === t.source && e.flags === t.flags;
    if (e.valueOf !== Object.prototype.valueOf)
      return e.valueOf() === t.valueOf();
    if (e.toString !== Object.prototype.toString)
      return e.toString() === t.toString();
    if (((o = Object.keys(e)), (r = o.length), r !== Object.keys(t).length))
      return !1;
    for (n = r; n-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, o[n])) return !1;
    if (ew && e instanceof Element) return !1;
    for (n = r; n-- !== 0; )
      if (
        !(
          (o[n] === "_owner" || o[n] === "__v" || o[n] === "__o") &&
          e.$$typeof
        ) &&
        !Ci(e[o[n]], t[o[n]])
      )
        return !1;
    return !0;
  }
  return e !== e && t !== t;
}
var ow = function (t, r) {
    try {
      return Ci(t, r);
    } catch (n) {
      if ((n.message || "").match(/stack|recursion/i))
        return (
          console.warn("react-fast-compare cannot handle circular refs"), !1
        );
      throw n;
    }
  },
  aw =
    /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,
  iw = k0(function (e) {
    return (
      aw.test(e) ||
      (e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        e.charCodeAt(2) < 91)
    );
  }),
  lw = iw,
  sw = function (t) {
    return t !== "theme";
  },
  Np = function (t) {
    return typeof t == "string" && t.charCodeAt(0) > 96 ? lw : sw;
  },
  Lp = function (t, r, n) {
    var o;
    if (r) {
      var a = r.shouldForwardProp;
      o =
        t.__emotion_forwardProp && a
          ? function (i) {
              return t.__emotion_forwardProp(i) && a(i);
            }
          : a;
    }
    return typeof o != "function" && n && (o = t.__emotion_forwardProp), o;
  },
  uw = function (t) {
    var r = t.cache,
      n = t.serialized,
      o = t.isStringTag;
    return (
      P0(r, n, o),
      tS(function () {
        return $0(r, n, o);
      }),
      null
    );
  },
  cw = function e(t, r) {
    var n = t.__emotion_real === t,
      o = (n && t.__emotion_base) || t,
      a,
      i;
    r !== void 0 && ((a = r.label), (i = r.target));
    var l = Lp(t, r, n),
      s = l || Np(o),
      u = !s("as");
    return function () {
      var p = arguments,
        g =
          n && t.__emotion_styles !== void 0 ? t.__emotion_styles.slice(0) : [];
      if (
        (a !== void 0 && g.push("label:" + a + ";"),
        p[0] == null || p[0].raw === void 0)
      )
        g.push.apply(g, p);
      else {
        g.push(p[0][0]);
        for (var v = p.length, m = 1; m < v; m++) g.push(p[m], p[0][m]);
      }
      var y = I0(function (w, h, c) {
        var d = (u && w.as) || o,
          x = "",
          k = [],
          $ = w;
        if (w.theme == null) {
          $ = {};
          for (var T in w) $[T] = w[T];
          $.theme = C.exports.useContext(sa);
        }
        typeof w.className == "string"
          ? (x = Xb(h.registered, k, w.className))
          : w.className != null && (x = w.className + " ");
        var P = af(g.concat(k), h.registered, $);
        (x += h.key + "-" + P.name), i !== void 0 && (x += " " + i);
        var O = u && l === void 0 ? Np(d) : s,
          A = {};
        for (var L in w) (u && L === "as") || (O(L) && (A[L] = w[L]));
        return (
          (A.className = x),
          (A.ref = c),
          C.exports.createElement(
            C.exports.Fragment,
            null,
            C.exports.createElement(uw, {
              cache: h,
              serialized: P,
              isStringTag: typeof d == "string",
            }),
            C.exports.createElement(d, A)
          )
        );
      });
      return (
        (y.displayName =
          a !== void 0
            ? a
            : "Styled(" +
              (typeof o == "string"
                ? o
                : o.displayName || o.name || "Component") +
              ")"),
        (y.defaultProps = t.defaultProps),
        (y.__emotion_real = y),
        (y.__emotion_base = o),
        (y.__emotion_styles = g),
        (y.__emotion_forwardProp = l),
        Object.defineProperty(y, "toString", {
          value: function () {
            return "." + i;
          },
        }),
        (y.withComponent = function (w, h) {
          return e(w, el({}, r, h, { shouldForwardProp: Lp(y, h, !0) })).apply(
            void 0,
            g
          );
        }),
        y
      );
    };
  },
  fw = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan",
  ],
  Vu = cw.bind();
fw.forEach(function (e) {
  Vu[e] = Vu(e);
});
function Uu() {
  return (
    (Uu =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    Uu.apply(this, arguments)
  );
}
var dw = function (t) {
    var r = t.cssVarsRoot,
      n = t.theme,
      o = t.children,
      a = C.exports.useMemo(
        function () {
          return Jx(n);
        },
        [n]
      );
    return C.exports.createElement(
      oS,
      { theme: a },
      C.exports.createElement(pw, { root: r }),
      o
    );
  },
  pw = function (t) {
    var r = t.root,
      n = r === void 0 ? ":host, :root" : r,
      o = [n, "[data-theme]"].join(",");
    return C.exports.createElement(lf, {
      styles: function (i) {
        var l;
        return (l = {}), (l[o] = i.__cssVars), l;
      },
    });
  };
function mw() {
  var e = C.exports.useContext(sa);
  if (!e)
    throw Error(
      "useTheme: `theme` is undefined. Seems you forgot to wrap your app in `<ChakraProvider />` or `<ThemeProvider />`"
    );
  return e;
}
var ov = xa({
    name: "StylesContext",
    errorMessage:
      "useStyles: `styles` is undefined. Seems you forgot to wrap the components in `<StylesProvider />` ",
  }),
  wT = ov[0],
  kT = ov[1],
  hw = function () {
    var t = X0(),
      r = t.colorMode;
    return C.exports.createElement(lf, {
      styles: function (o) {
        var a = Ll(o, "styles.global"),
          i = at(a, { theme: o, colorMode: r });
        if (!!i) {
          var l = tv(i)(o);
          return l;
        }
      },
    });
  };
function Xn(e) {
  return B0(e, ["styleConfig", "size", "variant", "colorScheme"]);
}
function vw() {
  var e = X0(),
    t = mw();
  return Uu({}, e, { theme: t });
}
function yf(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    o,
    a;
  for (a = 0; a < n.length; a++)
    (o = n[a]), !(t.indexOf(o) >= 0) && (r[o] = e[o]);
  return r;
}
var gw = new Set(
    [].concat(Ix, [
      "textStyle",
      "layerStyle",
      "apply",
      "isTruncated",
      "noOfLines",
      "focusBorderColor",
      "errorBorderColor",
      "as",
      "__css",
      "css",
      "sx",
    ])
  ),
  yw = new Set(["htmlWidth", "htmlHeight", "htmlSize"]),
  bw = function (t) {
    return yw.has(t) || !gw.has(t);
  },
  Sw = ["theme", "css", "__css", "sx"],
  xw = ["baseStyle"],
  ww = function (t) {
    var r = t.baseStyle;
    return function (n) {
      n.theme;
      var o = n.css,
        a = n.__css,
        i = n.sx,
        l = yf(n, Sw),
        s = F0(l, function (v, m) {
          return Ox(m);
        }),
        u = at(r, n),
        p = Object.assign({}, a, u, cf(s), i),
        g = tv(p)(n.theme);
      return o ? [g, o] : g;
    };
  };
function Is(e, t) {
  var r = t != null ? t : {},
    n = r.baseStyle,
    o = yf(r, xw);
  o.shouldForwardProp || (o.shouldForwardProp = bw);
  var a = ww({ baseStyle: n });
  return Vu(e, o)(a);
}
function Lt(e) {
  return C.exports.forwardRef(e);
}
var kw = ["styleConfig"];
function Qn(e, t, r) {
  var n;
  t === void 0 && (t = {}), r === void 0 && (r = {});
  var o = t,
    a = o.styleConfig,
    i = yf(o, kw),
    l = vw(),
    s = l.theme,
    u = l.colorMode,
    p = Ll(s, "components." + e),
    g = a || p,
    v = ot(
      { theme: s, colorMode: u },
      (n = g == null ? void 0 : g.defaultProps) != null ? n : {},
      cf(B0(i, ["children"]))
    ),
    m = C.exports.useRef({});
  if (g) {
    var y,
      w,
      h,
      c,
      d,
      x,
      k = at((y = g.baseStyle) != null ? y : {}, v),
      $ = at(
        (w = (h = g.variants) == null ? void 0 : h[v.variant]) != null ? w : {},
        v
      ),
      T = at(
        (c = (d = g.sizes) == null ? void 0 : d[v.size]) != null ? c : {},
        v
      ),
      P = ot({}, k, T, $);
    (x = r) != null &&
      x.isMultiPart &&
      g.parts &&
      g.parts.forEach(function (A) {
        var L;
        P[A] = (L = P[A]) != null ? L : {};
      });
    var O = ow(m.current, P);
    O || (m.current = P);
  }
  return m.current;
}
function Ew(e, t) {
  return Qn(e, t, { isMultiPart: !0 });
}
function _w() {
  var e = new Map();
  return new Proxy(Is, {
    apply: function (r, n, o) {
      return Is.apply(void 0, o);
    },
    get: function (r, n) {
      return e.has(n) || e.set(n, Is(n)), e.get(n);
    },
  });
}
var be = _w(),
  Cw = function (t) {
    var r = t.children,
      n = t.colorModeManager,
      o = t.portalZIndex,
      a = t.resetCSS,
      i = a === void 0 ? !0 : a,
      l = t.theme,
      s = l === void 0 ? {} : l,
      u = t.environment,
      p = t.cssVarsRoot,
      g = C.exports.createElement(US, { environment: u }, r);
    return C.exports.createElement(
      IS,
      null,
      C.exports.createElement(
        dw,
        { theme: s, cssVarsRoot: p },
        C.exports.createElement(
          JS,
          { colorModeManager: n, options: s.config },
          i && C.exports.createElement(lS, null),
          C.exports.createElement(hw, null),
          o ? C.exports.createElement(LS, { zIndex: o }, g) : g
        )
      )
    );
  },
  av = {
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  };
function ce() {
  return (
    (ce =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    ce.apply(this, arguments)
  );
}
var Tw = {
    max: "max-content",
    min: "min-content",
    full: "100%",
    "3xs": "14rem",
    "2xs": "16rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    "8xl": "90rem",
  },
  Pw = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
  iv = ce({}, av, Tw, { container: Pw });
function _e(e, t) {
  $w(e) && (e = "100%");
  var r = Rw(e);
  return (
    (e = t === 360 ? e : Math.min(t, Math.max(0, parseFloat(e)))),
    r && (e = parseInt(String(e * t), 10) / 100),
    Math.abs(e - t) < 1e-6
      ? 1
      : (t === 360
          ? (e = (e < 0 ? (e % t) + t : e % t) / parseFloat(String(t)))
          : (e = (e % t) / parseFloat(String(t))),
        e)
  );
}
function Ka(e) {
  return Math.min(1, Math.max(0, e));
}
function $w(e) {
  return typeof e == "string" && e.indexOf(".") !== -1 && parseFloat(e) === 1;
}
function Rw(e) {
  return typeof e == "string" && e.indexOf("%") !== -1;
}
function lv(e) {
  return (e = parseFloat(e)), (isNaN(e) || e < 0 || e > 1) && (e = 1), e;
}
function Za(e) {
  return e <= 1 ? "".concat(Number(e) * 100, "%") : e;
}
function Wr(e) {
  return e.length === 1 ? "0" + e : String(e);
}
function Aw(e, t, r) {
  return { r: _e(e, 255) * 255, g: _e(t, 255) * 255, b: _e(r, 255) * 255 };
}
function jp(e, t, r) {
  (e = _e(e, 255)), (t = _e(t, 255)), (r = _e(r, 255));
  var n = Math.max(e, t, r),
    o = Math.min(e, t, r),
    a = 0,
    i = 0,
    l = (n + o) / 2;
  if (n === o) (i = 0), (a = 0);
  else {
    var s = n - o;
    switch (((i = l > 0.5 ? s / (2 - n - o) : s / (n + o)), n)) {
      case e:
        a = (t - r) / s + (t < r ? 6 : 0);
        break;
      case t:
        a = (r - e) / s + 2;
        break;
      case r:
        a = (e - t) / s + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s: i, l };
}
function Ms(e, t, r) {
  return (
    r < 0 && (r += 1),
    r > 1 && (r -= 1),
    r < 1 / 6
      ? e + (t - e) * (6 * r)
      : r < 1 / 2
      ? t
      : r < 2 / 3
      ? e + (t - e) * (2 / 3 - r) * 6
      : e
  );
}
function zw(e, t, r) {
  var n, o, a;
  if (((e = _e(e, 360)), (t = _e(t, 100)), (r = _e(r, 100)), t === 0))
    (o = r), (a = r), (n = r);
  else {
    var i = r < 0.5 ? r * (1 + t) : r + t - r * t,
      l = 2 * r - i;
    (n = Ms(l, i, e + 1 / 3)), (o = Ms(l, i, e)), (a = Ms(l, i, e - 1 / 3));
  }
  return { r: n * 255, g: o * 255, b: a * 255 };
}
function Dp(e, t, r) {
  (e = _e(e, 255)), (t = _e(t, 255)), (r = _e(r, 255));
  var n = Math.max(e, t, r),
    o = Math.min(e, t, r),
    a = 0,
    i = n,
    l = n - o,
    s = n === 0 ? 0 : l / n;
  if (n === o) a = 0;
  else {
    switch (n) {
      case e:
        a = (t - r) / l + (t < r ? 6 : 0);
        break;
      case t:
        a = (r - e) / l + 2;
        break;
      case r:
        a = (e - t) / l + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s, v: i };
}
function Iw(e, t, r) {
  (e = _e(e, 360) * 6), (t = _e(t, 100)), (r = _e(r, 100));
  var n = Math.floor(e),
    o = e - n,
    a = r * (1 - t),
    i = r * (1 - o * t),
    l = r * (1 - (1 - o) * t),
    s = n % 6,
    u = [r, i, a, a, l, r][s],
    p = [l, r, r, i, a, a][s],
    g = [a, a, l, r, r, i][s];
  return { r: u * 255, g: p * 255, b: g * 255 };
}
function Wp(e, t, r, n) {
  var o = [
    Wr(Math.round(e).toString(16)),
    Wr(Math.round(t).toString(16)),
    Wr(Math.round(r).toString(16)),
  ];
  return n &&
    o[0].startsWith(o[0].charAt(1)) &&
    o[1].startsWith(o[1].charAt(1)) &&
    o[2].startsWith(o[2].charAt(1))
    ? o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0)
    : o.join("");
}
function Mw(e, t, r, n, o) {
  var a = [
    Wr(Math.round(e).toString(16)),
    Wr(Math.round(t).toString(16)),
    Wr(Math.round(r).toString(16)),
    Wr(Ow(n)),
  ];
  return o &&
    a[0].startsWith(a[0].charAt(1)) &&
    a[1].startsWith(a[1].charAt(1)) &&
    a[2].startsWith(a[2].charAt(1)) &&
    a[3].startsWith(a[3].charAt(1))
    ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0)
    : a.join("");
}
function Ow(e) {
  return Math.round(parseFloat(e) * 255).toString(16);
}
function Hp(e) {
  return Ue(e) / 255;
}
function Ue(e) {
  return parseInt(e, 16);
}
function Bw(e) {
  return { r: e >> 16, g: (e & 65280) >> 8, b: e & 255 };
}
var Gu = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};
function Fw(e) {
  var t = { r: 0, g: 0, b: 0 },
    r = 1,
    n = null,
    o = null,
    a = null,
    i = !1,
    l = !1;
  return (
    typeof e == "string" && (e = jw(e)),
    typeof e == "object" &&
      (Ut(e.r) && Ut(e.g) && Ut(e.b)
        ? ((t = Aw(e.r, e.g, e.b)),
          (i = !0),
          (l = String(e.r).substr(-1) === "%" ? "prgb" : "rgb"))
        : Ut(e.h) && Ut(e.s) && Ut(e.v)
        ? ((n = Za(e.s)),
          (o = Za(e.v)),
          (t = Iw(e.h, n, o)),
          (i = !0),
          (l = "hsv"))
        : Ut(e.h) &&
          Ut(e.s) &&
          Ut(e.l) &&
          ((n = Za(e.s)),
          (a = Za(e.l)),
          (t = zw(e.h, n, a)),
          (i = !0),
          (l = "hsl")),
      Object.prototype.hasOwnProperty.call(e, "a") && (r = e.a)),
    (r = lv(r)),
    {
      ok: i,
      format: e.format || l,
      r: Math.min(255, Math.max(t.r, 0)),
      g: Math.min(255, Math.max(t.g, 0)),
      b: Math.min(255, Math.max(t.b, 0)),
      a: r,
    }
  );
}
var Nw = "[-\\+]?\\d+%?",
  Lw = "[-\\+]?\\d*\\.\\d+%?",
  cr = "(?:".concat(Lw, ")|(?:").concat(Nw, ")"),
  Os = "[\\s|\\(]+("
    .concat(cr, ")[,|\\s]+(")
    .concat(cr, ")[,|\\s]+(")
    .concat(cr, ")\\s*\\)?"),
  Bs = "[\\s|\\(]+("
    .concat(cr, ")[,|\\s]+(")
    .concat(cr, ")[,|\\s]+(")
    .concat(cr, ")[,|\\s]+(")
    .concat(cr, ")\\s*\\)?"),
  gt = {
    CSS_UNIT: new RegExp(cr),
    rgb: new RegExp("rgb" + Os),
    rgba: new RegExp("rgba" + Bs),
    hsl: new RegExp("hsl" + Os),
    hsla: new RegExp("hsla" + Bs),
    hsv: new RegExp("hsv" + Os),
    hsva: new RegExp("hsva" + Bs),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  };
function jw(e) {
  if (((e = e.trim().toLowerCase()), e.length === 0)) return !1;
  var t = !1;
  if (Gu[e]) (e = Gu[e]), (t = !0);
  else if (e === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  var r = gt.rgb.exec(e);
  return r
    ? { r: r[1], g: r[2], b: r[3] }
    : ((r = gt.rgba.exec(e)),
      r
        ? { r: r[1], g: r[2], b: r[3], a: r[4] }
        : ((r = gt.hsl.exec(e)),
          r
            ? { h: r[1], s: r[2], l: r[3] }
            : ((r = gt.hsla.exec(e)),
              r
                ? { h: r[1], s: r[2], l: r[3], a: r[4] }
                : ((r = gt.hsv.exec(e)),
                  r
                    ? { h: r[1], s: r[2], v: r[3] }
                    : ((r = gt.hsva.exec(e)),
                      r
                        ? { h: r[1], s: r[2], v: r[3], a: r[4] }
                        : ((r = gt.hex8.exec(e)),
                          r
                            ? {
                                r: Ue(r[1]),
                                g: Ue(r[2]),
                                b: Ue(r[3]),
                                a: Hp(r[4]),
                                format: t ? "name" : "hex8",
                              }
                            : ((r = gt.hex6.exec(e)),
                              r
                                ? {
                                    r: Ue(r[1]),
                                    g: Ue(r[2]),
                                    b: Ue(r[3]),
                                    format: t ? "name" : "hex",
                                  }
                                : ((r = gt.hex4.exec(e)),
                                  r
                                    ? {
                                        r: Ue(r[1] + r[1]),
                                        g: Ue(r[2] + r[2]),
                                        b: Ue(r[3] + r[3]),
                                        a: Hp(r[4] + r[4]),
                                        format: t ? "name" : "hex8",
                                      }
                                    : ((r = gt.hex3.exec(e)),
                                      r
                                        ? {
                                            r: Ue(r[1] + r[1]),
                                            g: Ue(r[2] + r[2]),
                                            b: Ue(r[3] + r[3]),
                                            format: t ? "name" : "hex",
                                          }
                                        : !1)))))))));
}
function Ut(e) {
  return Boolean(gt.CSS_UNIT.exec(String(e)));
}
var wa = (function () {
  function e(t, r) {
    t === void 0 && (t = ""), r === void 0 && (r = {});
    var n;
    if (t instanceof e) return t;
    typeof t == "number" && (t = Bw(t)), (this.originalInput = t);
    var o = Fw(t);
    (this.originalInput = t),
      (this.r = o.r),
      (this.g = o.g),
      (this.b = o.b),
      (this.a = o.a),
      (this.roundA = Math.round(100 * this.a) / 100),
      (this.format = (n = r.format) !== null && n !== void 0 ? n : o.format),
      (this.gradientType = r.gradientType),
      this.r < 1 && (this.r = Math.round(this.r)),
      this.g < 1 && (this.g = Math.round(this.g)),
      this.b < 1 && (this.b = Math.round(this.b)),
      (this.isValid = o.ok);
  }
  return (
    (e.prototype.isDark = function () {
      return this.getBrightness() < 128;
    }),
    (e.prototype.isLight = function () {
      return !this.isDark();
    }),
    (e.prototype.getBrightness = function () {
      var t = this.toRgb();
      return (t.r * 299 + t.g * 587 + t.b * 114) / 1e3;
    }),
    (e.prototype.getLuminance = function () {
      var t = this.toRgb(),
        r,
        n,
        o,
        a = t.r / 255,
        i = t.g / 255,
        l = t.b / 255;
      return (
        a <= 0.03928
          ? (r = a / 12.92)
          : (r = Math.pow((a + 0.055) / 1.055, 2.4)),
        i <= 0.03928
          ? (n = i / 12.92)
          : (n = Math.pow((i + 0.055) / 1.055, 2.4)),
        l <= 0.03928
          ? (o = l / 12.92)
          : (o = Math.pow((l + 0.055) / 1.055, 2.4)),
        0.2126 * r + 0.7152 * n + 0.0722 * o
      );
    }),
    (e.prototype.getAlpha = function () {
      return this.a;
    }),
    (e.prototype.setAlpha = function (t) {
      return (
        (this.a = lv(t)), (this.roundA = Math.round(100 * this.a) / 100), this
      );
    }),
    (e.prototype.toHsv = function () {
      var t = Dp(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, v: t.v, a: this.a };
    }),
    (e.prototype.toHsvString = function () {
      var t = Dp(this.r, this.g, this.b),
        r = Math.round(t.h * 360),
        n = Math.round(t.s * 100),
        o = Math.round(t.v * 100);
      return this.a === 1
        ? "hsv(".concat(r, ", ").concat(n, "%, ").concat(o, "%)")
        : "hsva("
            .concat(r, ", ")
            .concat(n, "%, ")
            .concat(o, "%, ")
            .concat(this.roundA, ")");
    }),
    (e.prototype.toHsl = function () {
      var t = jp(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, l: t.l, a: this.a };
    }),
    (e.prototype.toHslString = function () {
      var t = jp(this.r, this.g, this.b),
        r = Math.round(t.h * 360),
        n = Math.round(t.s * 100),
        o = Math.round(t.l * 100);
      return this.a === 1
        ? "hsl(".concat(r, ", ").concat(n, "%, ").concat(o, "%)")
        : "hsla("
            .concat(r, ", ")
            .concat(n, "%, ")
            .concat(o, "%, ")
            .concat(this.roundA, ")");
    }),
    (e.prototype.toHex = function (t) {
      return t === void 0 && (t = !1), Wp(this.r, this.g, this.b, t);
    }),
    (e.prototype.toHexString = function (t) {
      return t === void 0 && (t = !1), "#" + this.toHex(t);
    }),
    (e.prototype.toHex8 = function (t) {
      return t === void 0 && (t = !1), Mw(this.r, this.g, this.b, this.a, t);
    }),
    (e.prototype.toHex8String = function (t) {
      return t === void 0 && (t = !1), "#" + this.toHex8(t);
    }),
    (e.prototype.toRgb = function () {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a,
      };
    }),
    (e.prototype.toRgbString = function () {
      var t = Math.round(this.r),
        r = Math.round(this.g),
        n = Math.round(this.b);
      return this.a === 1
        ? "rgb(".concat(t, ", ").concat(r, ", ").concat(n, ")")
        : "rgba("
            .concat(t, ", ")
            .concat(r, ", ")
            .concat(n, ", ")
            .concat(this.roundA, ")");
    }),
    (e.prototype.toPercentageRgb = function () {
      var t = function (r) {
        return "".concat(Math.round(_e(r, 255) * 100), "%");
      };
      return { r: t(this.r), g: t(this.g), b: t(this.b), a: this.a };
    }),
    (e.prototype.toPercentageRgbString = function () {
      var t = function (r) {
        return Math.round(_e(r, 255) * 100);
      };
      return this.a === 1
        ? "rgb("
            .concat(t(this.r), "%, ")
            .concat(t(this.g), "%, ")
            .concat(t(this.b), "%)")
        : "rgba("
            .concat(t(this.r), "%, ")
            .concat(t(this.g), "%, ")
            .concat(t(this.b), "%, ")
            .concat(this.roundA, ")");
    }),
    (e.prototype.toName = function () {
      if (this.a === 0) return "transparent";
      if (this.a < 1) return !1;
      for (
        var t = "#" + Wp(this.r, this.g, this.b, !1),
          r = 0,
          n = Object.entries(Gu);
        r < n.length;
        r++
      ) {
        var o = n[r],
          a = o[0],
          i = o[1];
        if (t === i) return a;
      }
      return !1;
    }),
    (e.prototype.toString = function (t) {
      var r = Boolean(t);
      t = t != null ? t : this.format;
      var n = !1,
        o = this.a < 1 && this.a >= 0,
        a = !r && o && (t.startsWith("hex") || t === "name");
      return a
        ? t === "name" && this.a === 0
          ? this.toName()
          : this.toRgbString()
        : (t === "rgb" && (n = this.toRgbString()),
          t === "prgb" && (n = this.toPercentageRgbString()),
          (t === "hex" || t === "hex6") && (n = this.toHexString()),
          t === "hex3" && (n = this.toHexString(!0)),
          t === "hex4" && (n = this.toHex8String(!0)),
          t === "hex8" && (n = this.toHex8String()),
          t === "name" && (n = this.toName()),
          t === "hsl" && (n = this.toHslString()),
          t === "hsv" && (n = this.toHsvString()),
          n || this.toHexString());
    }),
    (e.prototype.toNumber = function () {
      return (
        (Math.round(this.r) << 16) +
        (Math.round(this.g) << 8) +
        Math.round(this.b)
      );
    }),
    (e.prototype.clone = function () {
      return new e(this.toString());
    }),
    (e.prototype.lighten = function (t) {
      t === void 0 && (t = 10);
      var r = this.toHsl();
      return (r.l += t / 100), (r.l = Ka(r.l)), new e(r);
    }),
    (e.prototype.brighten = function (t) {
      t === void 0 && (t = 10);
      var r = this.toRgb();
      return (
        (r.r = Math.max(0, Math.min(255, r.r - Math.round(255 * -(t / 100))))),
        (r.g = Math.max(0, Math.min(255, r.g - Math.round(255 * -(t / 100))))),
        (r.b = Math.max(0, Math.min(255, r.b - Math.round(255 * -(t / 100))))),
        new e(r)
      );
    }),
    (e.prototype.darken = function (t) {
      t === void 0 && (t = 10);
      var r = this.toHsl();
      return (r.l -= t / 100), (r.l = Ka(r.l)), new e(r);
    }),
    (e.prototype.tint = function (t) {
      return t === void 0 && (t = 10), this.mix("white", t);
    }),
    (e.prototype.shade = function (t) {
      return t === void 0 && (t = 10), this.mix("black", t);
    }),
    (e.prototype.desaturate = function (t) {
      t === void 0 && (t = 10);
      var r = this.toHsl();
      return (r.s -= t / 100), (r.s = Ka(r.s)), new e(r);
    }),
    (e.prototype.saturate = function (t) {
      t === void 0 && (t = 10);
      var r = this.toHsl();
      return (r.s += t / 100), (r.s = Ka(r.s)), new e(r);
    }),
    (e.prototype.greyscale = function () {
      return this.desaturate(100);
    }),
    (e.prototype.spin = function (t) {
      var r = this.toHsl(),
        n = (r.h + t) % 360;
      return (r.h = n < 0 ? 360 + n : n), new e(r);
    }),
    (e.prototype.mix = function (t, r) {
      r === void 0 && (r = 50);
      var n = this.toRgb(),
        o = new e(t).toRgb(),
        a = r / 100,
        i = {
          r: (o.r - n.r) * a + n.r,
          g: (o.g - n.g) * a + n.g,
          b: (o.b - n.b) * a + n.b,
          a: (o.a - n.a) * a + n.a,
        };
      return new e(i);
    }),
    (e.prototype.analogous = function (t, r) {
      t === void 0 && (t = 6), r === void 0 && (r = 30);
      var n = this.toHsl(),
        o = 360 / r,
        a = [this];
      for (n.h = (n.h - ((o * t) >> 1) + 720) % 360; --t; )
        (n.h = (n.h + o) % 360), a.push(new e(n));
      return a;
    }),
    (e.prototype.complement = function () {
      var t = this.toHsl();
      return (t.h = (t.h + 180) % 360), new e(t);
    }),
    (e.prototype.monochromatic = function (t) {
      t === void 0 && (t = 6);
      for (
        var r = this.toHsv(), n = r.h, o = r.s, a = r.v, i = [], l = 1 / t;
        t--;

      )
        i.push(new e({ h: n, s: o, v: a })), (a = (a + l) % 1);
      return i;
    }),
    (e.prototype.splitcomplement = function () {
      var t = this.toHsl(),
        r = t.h;
      return [
        this,
        new e({ h: (r + 72) % 360, s: t.s, l: t.l }),
        new e({ h: (r + 216) % 360, s: t.s, l: t.l }),
      ];
    }),
    (e.prototype.onBackground = function (t) {
      var r = this.toRgb(),
        n = new e(t).toRgb();
      return new e({
        r: n.r + (r.r - n.r) * r.a,
        g: n.g + (r.g - n.g) * r.a,
        b: n.b + (r.b - n.b) * r.a,
      });
    }),
    (e.prototype.triad = function () {
      return this.polyad(3);
    }),
    (e.prototype.tetrad = function () {
      return this.polyad(4);
    }),
    (e.prototype.polyad = function (t) {
      for (
        var r = this.toHsl(), n = r.h, o = [this], a = 360 / t, i = 1;
        i < t;
        i++
      )
        o.push(new e({ h: (n + i * a) % 360, s: r.s, l: r.l }));
      return o;
    }),
    (e.prototype.equals = function (t) {
      return this.toRgbString() === new e(t).toRgbString();
    }),
    e
  );
})();
function sv(e) {
  if ((e === void 0 && (e = {}), e.count !== void 0 && e.count !== null)) {
    var t = e.count,
      r = [];
    for (e.count = void 0; t > r.length; )
      (e.count = null), e.seed && (e.seed += 1), r.push(sv(e));
    return (e.count = t), r;
  }
  var n = Dw(e.hue, e.seed),
    o = Ww(n, e),
    a = Hw(n, o, e),
    i = { h: n, s: o, v: a };
  return e.alpha !== void 0 && (i.a = e.alpha), new wa(i);
}
function Dw(e, t) {
  var r = Uw(e),
    n = ol(r, t);
  return n < 0 && (n = 360 + n), n;
}
function Ww(e, t) {
  if (t.hue === "monochrome") return 0;
  if (t.luminosity === "random") return ol([0, 100], t.seed);
  var r = uv(e).saturationRange,
    n = r[0],
    o = r[1];
  switch (t.luminosity) {
    case "bright":
      n = 55;
      break;
    case "dark":
      n = o - 10;
      break;
    case "light":
      o = 55;
      break;
  }
  return ol([n, o], t.seed);
}
function Hw(e, t, r) {
  var n = Vw(e, t),
    o = 100;
  switch (r.luminosity) {
    case "dark":
      o = n + 20;
      break;
    case "light":
      n = (o + n) / 2;
      break;
    case "random":
      (n = 0), (o = 100);
      break;
  }
  return ol([n, o], r.seed);
}
function Vw(e, t) {
  for (var r = uv(e).lowerBounds, n = 0; n < r.length - 1; n++) {
    var o = r[n][0],
      a = r[n][1],
      i = r[n + 1][0],
      l = r[n + 1][1];
    if (t >= o && t <= i) {
      var s = (l - a) / (i - o),
        u = a - s * o;
      return s * t + u;
    }
  }
  return 0;
}
function Uw(e) {
  var t = parseInt(e, 10);
  if (!Number.isNaN(t) && t < 360 && t > 0) return [t, t];
  if (typeof e == "string") {
    var r = fv.find(function (i) {
      return i.name === e;
    });
    if (r) {
      var n = cv(r);
      if (n.hueRange) return n.hueRange;
    }
    var o = new wa(e);
    if (o.isValid) {
      var a = o.toHsv().h;
      return [a, a];
    }
  }
  return [0, 360];
}
function uv(e) {
  e >= 334 && e <= 360 && (e -= 360);
  for (var t = 0, r = fv; t < r.length; t++) {
    var n = r[t],
      o = cv(n);
    if (o.hueRange && e >= o.hueRange[0] && e <= o.hueRange[1]) return o;
  }
  throw Error("Color not found");
}
function ol(e, t) {
  if (t === void 0) return Math.floor(e[0] + Math.random() * (e[1] + 1 - e[0]));
  var r = e[1] || 1,
    n = e[0] || 0;
  t = (t * 9301 + 49297) % 233280;
  var o = t / 233280;
  return Math.floor(n + o * (r - n));
}
function cv(e) {
  var t = e.lowerBounds[0][0],
    r = e.lowerBounds[e.lowerBounds.length - 1][0],
    n = e.lowerBounds[e.lowerBounds.length - 1][1],
    o = e.lowerBounds[0][1];
  return {
    name: e.name,
    hueRange: e.hueRange,
    lowerBounds: e.lowerBounds,
    saturationRange: [t, r],
    brightnessRange: [n, o],
  };
}
var fv = [
    {
      name: "monochrome",
      hueRange: null,
      lowerBounds: [
        [0, 0],
        [100, 0],
      ],
    },
    {
      name: "red",
      hueRange: [-26, 18],
      lowerBounds: [
        [20, 100],
        [30, 92],
        [40, 89],
        [50, 85],
        [60, 78],
        [70, 70],
        [80, 60],
        [90, 55],
        [100, 50],
      ],
    },
    {
      name: "orange",
      hueRange: [19, 46],
      lowerBounds: [
        [20, 100],
        [30, 93],
        [40, 88],
        [50, 86],
        [60, 85],
        [70, 70],
        [100, 70],
      ],
    },
    {
      name: "yellow",
      hueRange: [47, 62],
      lowerBounds: [
        [25, 100],
        [40, 94],
        [50, 89],
        [60, 86],
        [70, 84],
        [80, 82],
        [90, 80],
        [100, 75],
      ],
    },
    {
      name: "green",
      hueRange: [63, 178],
      lowerBounds: [
        [30, 100],
        [40, 90],
        [50, 85],
        [60, 81],
        [70, 74],
        [80, 64],
        [90, 50],
        [100, 40],
      ],
    },
    {
      name: "blue",
      hueRange: [179, 257],
      lowerBounds: [
        [20, 100],
        [30, 86],
        [40, 80],
        [50, 74],
        [60, 60],
        [70, 52],
        [80, 44],
        [90, 39],
        [100, 35],
      ],
    },
    {
      name: "purple",
      hueRange: [258, 282],
      lowerBounds: [
        [20, 100],
        [30, 87],
        [40, 79],
        [50, 70],
        [60, 65],
        [70, 59],
        [80, 52],
        [90, 45],
        [100, 42],
      ],
    },
    {
      name: "pink",
      hueRange: [283, 334],
      lowerBounds: [
        [20, 100],
        [30, 90],
        [40, 86],
        [60, 84],
        [80, 80],
        [90, 75],
        [100, 73],
      ],
    },
  ],
  he = function (t, r, n) {
    var o = Ll(t, "colors." + r, r),
      a = new wa(o),
      i = a.isValid;
    return i ? o : n;
  },
  Gw = function (t) {
    return function (r) {
      var n = he(r, t),
        o = new wa(n).isDark();
      return o ? "dark" : "light";
    };
  },
  Yw = function (t) {
    return function (r) {
      return Gw(t)(r) === "dark";
    };
  },
  Ln = function (t, r) {
    return function (n) {
      var o = he(n, t);
      return new wa(o).setAlpha(r).toRgbString();
    };
  };
function Vp(e, t) {
  return (
    e === void 0 && (e = "1rem"),
    t === void 0 && (t = "rgba(255, 255, 255, 0.15)"),
    {
      backgroundImage:
        `linear-gradient(
    45deg,
    ` +
        t +
        ` 25%,
    transparent 25%,
    transparent 50%,
    ` +
        t +
        ` 50%,
    ` +
        t +
        ` 75%,
    transparent 75%,
    transparent
  )`,
      backgroundSize: e + " " + e,
    }
  );
}
function Xw(e) {
  var t = sv().toHexString();
  return !e || cS(e)
    ? t
    : e.string && e.colors
    ? qw(e.string, e.colors)
    : e.string && !e.colors
    ? Qw(e.string)
    : e.colors && !e.string
    ? Kw(e.colors)
    : t;
}
function Qw(e) {
  var t = 0;
  if (e.length === 0) return t.toString();
  for (var r = 0; r < e.length; r += 1)
    (t = e.charCodeAt(r) + ((t << 5) - t)), (t = t & t);
  for (var n = "#", o = 0; o < 3; o += 1) {
    var a = (t >> (o * 8)) & 255;
    n += ("00" + a.toString(16)).substr(-2);
  }
  return n;
}
function qw(e, t) {
  var r = 0;
  if (e.length === 0) return t[0];
  for (var n = 0; n < e.length; n += 1)
    (r = e.charCodeAt(n) + ((r << 5) - r)), (r = r & r);
  return (r = ((r % t.length) + t.length) % t.length), t[r];
}
function Kw(e) {
  return e[Math.floor(Math.random() * e.length)];
}
function _(e, t) {
  return function (r) {
    return r.colorMode === "dark" ? t : e;
  };
}
function ka(e) {
  var t = e.orientation,
    r = e.vertical,
    n = e.horizontal;
  return t ? (t === "vertical" ? r : n) : {};
}
function Yu() {
  return (
    (Yu =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    Yu.apply(this, arguments)
  );
}
var Zw = function (t) {
  return (
    hf({
      condition: !0,
      message: [
        "[chakra-ui]: createBreakpoints(...) will be deprecated pretty soon",
        "simply pass the breakpoints as an object. Remove the createBreakpoint(..) call",
      ].join(""),
    }),
    Yu({ base: "0em" }, t)
  );
};
function Up(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    (n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, n.key, n);
  }
}
function Jw(e, t, r) {
  return t && Up(e.prototype, t), r && Up(e, r), e;
}
var ek = (function () {
  function e(t) {
    var r = this;
    (this.map = {}),
      (this.called = !1),
      (this.assert = function () {
        if (!r.called) {
          r.called = !0;
          return;
        }
        throw new Error(
          "[anatomy] .part(...) should only be called once. Did you mean to use .extend(...) ?"
        );
      }),
      (this.parts = function () {
        r.assert();
        for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
          o[a] = arguments[a];
        for (var i = 0, l = o; i < l.length; i++) {
          var s = l[i];
          r.map[s] = r.toPart(s);
        }
        return r;
      }),
      (this.extend = function () {
        for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
          o[a] = arguments[a];
        for (var i = 0, l = o; i < l.length; i++) {
          var s = l[i];
          s in r.map || (r.map[s] = r.toPart(s));
        }
        return r;
      }),
      (this.toPart = function (n) {
        var o = ["container", "root"].includes(n != null ? n : "")
            ? [r.name]
            : [r.name, n],
          a = o.filter(Boolean).join("__"),
          i = "chakra-" + a,
          l = {
            className: i,
            selector: "." + i,
            toString: function () {
              return n;
            },
          };
        return l;
      }),
      (this.__type = {});
  }
  return (
    Jw(e, [
      {
        key: "selectors",
        get: function () {
          var r = tl(
            Object.entries(this.map).map(function (n) {
              var o = n[0],
                a = n[1];
              return [o, a.selector];
            })
          );
          return r;
        },
      },
      {
        key: "classNames",
        get: function () {
          var r = tl(
            Object.entries(this.map).map(function (n) {
              var o = n[0],
                a = n[1];
              return [o, a.className];
            })
          );
          return r;
        },
      },
      {
        key: "keys",
        get: function () {
          return Object.keys(this.map);
        },
      },
    ]),
    e
  );
})();
function K(e) {
  return new ek(e);
}
function dv(e) {
  return je(e) && e.reference ? e.reference : String(e);
}
var Dl = function (t) {
    for (
      var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1;
      o < r;
      o++
    )
      n[o - 1] = arguments[o];
    return n
      .map(dv)
      .join(" " + t + " ")
      .replace(/calc/g, "");
  },
  Gp = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + Dl.apply(void 0, ["+"].concat(r)) + ")";
  },
  Yp = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + Dl.apply(void 0, ["-"].concat(r)) + ")";
  },
  Xu = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + Dl.apply(void 0, ["*"].concat(r)) + ")";
  },
  Xp = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return "calc(" + Dl.apply(void 0, ["/"].concat(r)) + ")";
  },
  Qp = function (t) {
    var r = dv(t);
    return r != null && !Number.isNaN(parseFloat(r))
      ? String(r).startsWith("-")
        ? String(r).slice(1)
        : "-" + r
      : Xu(r, -1);
  },
  Xt = Object.assign(
    function (e) {
      return {
        add: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Xt(Gp.apply(void 0, [e].concat(n)));
        },
        subtract: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Xt(Yp.apply(void 0, [e].concat(n)));
        },
        multiply: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Xt(Xu.apply(void 0, [e].concat(n)));
        },
        divide: function () {
          for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return Xt(Xp.apply(void 0, [e].concat(n)));
        },
        negate: function () {
          return Xt(Qp(e));
        },
        toString: function () {
          return e.toString();
        },
      };
    },
    { add: Gp, subtract: Yp, multiply: Xu, divide: Xp, negate: Qp }
  );
function tk(e) {
  return !Number.isInteger(parseFloat(e.toString()));
}
function rk(e, t) {
  return t === void 0 && (t = "-"), e.replace(/\s+/g, t);
}
function pv(e) {
  var t = rk(e.toString());
  return t.includes("\\.") ? e : tk(e) ? t.replace(".", "\\.") : e;
}
function nk(e, t) {
  return t === void 0 && (t = ""), [t, pv(e)].filter(Boolean).join("-");
}
function ok(e, t) {
  return "var(" + pv(e) + (t ? ", " + t : "") + ")";
}
function ak(e, t) {
  return t === void 0 && (t = ""), "--" + nk(e, t);
}
function Ze(e, t) {
  var r = ak(e, t == null ? void 0 : t.prefix);
  return { variable: r, reference: ok(r, ik(t == null ? void 0 : t.fallback)) };
}
function ik(e) {
  return typeof e == "string" ? e : e == null ? void 0 : e.reference;
}
var lk = K("accordion")
    .parts("root", "container", "button", "panel")
    .extend("icon"),
  sk = K("alert").parts("title", "description", "container").extend("icon"),
  uk = K("avatar")
    .parts("label", "badge", "container")
    .extend("excessLabel", "group"),
  ck = K("breadcrumb").parts("link", "item", "container").extend("separator");
K("button").parts();
var fk = K("checkbox").parts("control", "icon", "container").extend("label");
K("progress").parts("track", "filledTrack").extend("label");
var dk = K("drawer")
    .parts("overlay", "dialogContainer", "dialog")
    .extend("header", "closeButton", "body", "footer"),
  pk = K("editable").parts("preview", "input", "textarea"),
  mk = K("form").parts("container", "requiredIndicator", "helperText"),
  hk = K("formError").parts("text", "icon"),
  vk = K("input").parts("addon", "field", "element"),
  gk = K("list").parts("container", "item", "icon"),
  yk = K("menu")
    .parts("button", "list", "item")
    .extend("groupTitle", "command", "divider"),
  bk = K("modal")
    .parts("overlay", "dialogContainer", "dialog")
    .extend("header", "closeButton", "body", "footer"),
  Sk = K("numberinput").parts("root", "field", "stepperGroup", "stepper");
K("pininput").parts("field");
var xk = K("popover")
    .parts("content", "header", "body", "footer")
    .extend("popper", "arrow", "closeButton"),
  wk = K("progress").parts("label", "filledTrack", "track"),
  kk = K("radio").parts("container", "control", "label"),
  Ek = K("select").parts("field", "icon"),
  _k = K("slider").parts("container", "track", "thumb", "filledTrack"),
  Ck = K("stat").parts("container", "label", "helpText", "number", "icon"),
  Tk = K("switch").parts("container", "track", "thumb"),
  Pk = K("table").parts(
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "tfoot",
    "caption"
  ),
  $k = K("tabs").parts(
    "root",
    "tab",
    "tablist",
    "tabpanel",
    "tabpanels",
    "indicator"
  ),
  Rk = K("tag").parts("container", "label", "closeButton"),
  mv = {
    letterSpacings: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
    lineHeights: {
      normal: "normal",
      none: 1,
      shorter: 1.25,
      short: 1.375,
      base: 1.5,
      tall: 1.625,
      taller: "2",
      3: ".75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    fonts: {
      heading:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
    },
  },
  Ak = {
    borderTopWidth: "1px",
    borderColor: "inherit",
    _last: { borderBottomWidth: "1px" },
  },
  zk = {
    transitionProperty: "common",
    transitionDuration: "normal",
    fontSize: "1rem",
    _focus: { boxShadow: "outline" },
    _hover: { bg: "blackAlpha.50" },
    _disabled: { opacity: 0.4, cursor: "not-allowed" },
    px: 4,
    py: 2,
  },
  Ik = { pt: 2, px: 4, pb: 5 },
  Mk = { fontSize: "1.25em" },
  Ok = { root: {}, container: Ak, button: zk, panel: Ik, icon: Mk },
  Bk = { parts: lk.keys, baseStyle: Ok },
  Fk = {
    container: { px: 4, py: 3 },
    title: { fontWeight: "bold", lineHeight: 6, marginEnd: 2 },
    description: { lineHeight: 6 },
    icon: { flexShrink: 0, marginEnd: 3, w: 5, h: 6 },
  };
function bf(e) {
  var t = e.theme,
    r = e.colorScheme,
    n = he(t, r + ".100", r),
    o = Ln(r + ".200", 0.16)(t);
  return _(n, o)(e);
}
var Nk = function (t) {
    var r = t.colorScheme;
    return {
      container: { bg: bf(t) },
      icon: { color: _(r + ".500", r + ".200")(t) },
    };
  },
  Lk = function (t) {
    var r = t.colorScheme;
    return {
      container: {
        paddingStart: 3,
        borderStartWidth: "4px",
        borderStartColor: _(r + ".500", r + ".200")(t),
        bg: bf(t),
      },
      icon: { color: _(r + ".500", r + ".200")(t) },
    };
  },
  jk = function (t) {
    var r = t.colorScheme;
    return {
      container: {
        pt: 2,
        borderTopWidth: "4px",
        borderTopColor: _(r + ".500", r + ".200")(t),
        bg: bf(t),
      },
      icon: { color: _(r + ".500", r + ".200")(t) },
    };
  },
  Dk = function (t) {
    var r = t.colorScheme;
    return {
      container: {
        bg: _(r + ".500", r + ".200")(t),
        color: _("white", "gray.900")(t),
      },
    };
  },
  Wk = { subtle: Nk, "left-accent": Lk, "top-accent": jk, solid: Dk },
  Hk = { variant: "subtle", colorScheme: "blue" },
  Vk = { parts: sk.keys, baseStyle: Fk, variants: Wk, defaultProps: Hk },
  Uk = function (t) {
    return {
      transform: "translate(25%, 25%)",
      borderRadius: "full",
      border: "0.2em solid",
      borderColor: _("white", "gray.800")(t),
    };
  },
  Gk = function (t) {
    return { bg: _("gray.200", "whiteAlpha.400")(t) };
  },
  Yk = function (t) {
    var r = t.name,
      n = t.theme,
      o = r ? Xw({ string: r }) : "gray.400",
      a = Yw(o)(n),
      i = "white";
    a || (i = "gray.800");
    var l = _("white", "gray.800")(t);
    return { bg: o, color: i, borderColor: l, verticalAlign: "top" };
  },
  Xk = function (t) {
    return { badge: Uk(t), excessLabel: Gk(t), container: Yk(t) };
  };
function nr(e) {
  var t = iv[e];
  return {
    container: {
      width: e,
      height: e,
      fontSize: "calc(" + (t != null ? t : e) + " / 2.5)",
    },
    excessLabel: { width: e, height: e },
    label: {
      fontSize: "calc(" + (t != null ? t : e) + " / 2.5)",
      lineHeight: e !== "100%" ? (t != null ? t : e) : void 0,
    },
  };
}
var Qk = {
    "2xs": nr("4"),
    xs: nr("6"),
    sm: nr("8"),
    md: nr("12"),
    lg: nr("16"),
    xl: nr("24"),
    "2xl": nr("32"),
    full: nr("100%"),
  },
  qk = { size: "md" },
  Kk = { parts: uk.keys, baseStyle: Xk, sizes: Qk, defaultProps: qk },
  Zk = {
    px: 1,
    textTransform: "uppercase",
    fontSize: "xs",
    borderRadius: "sm",
    fontWeight: "bold",
  },
  Jk = function (t) {
    var r = t.colorScheme,
      n = t.theme,
      o = Ln(r + ".500", 0.6)(n);
    return { bg: _(r + ".500", o)(t), color: _("white", "whiteAlpha.800")(t) };
  },
  e2 = function (t) {
    var r = t.colorScheme,
      n = t.theme,
      o = Ln(r + ".200", 0.16)(n);
    return { bg: _(r + ".100", o)(t), color: _(r + ".800", r + ".200")(t) };
  },
  t2 = function (t) {
    var r = t.colorScheme,
      n = t.theme,
      o = Ln(r + ".200", 0.8)(n),
      a = he(n, r + ".500"),
      i = _(a, o)(t);
    return { color: i, boxShadow: "inset 0 0 0px 1px " + i };
  },
  r2 = { solid: Jk, subtle: e2, outline: t2 },
  n2 = { variant: "subtle", colorScheme: "gray" },
  In = { baseStyle: Zk, variants: r2, defaultProps: n2 },
  o2 = {
    transitionProperty: "common",
    transitionDuration: "fast",
    transitionTimingFunction: "ease-out",
    cursor: "pointer",
    textDecoration: "none",
    outline: "none",
    color: "inherit",
    _hover: { textDecoration: "underline" },
    _focus: { boxShadow: "outline" },
  },
  a2 = { link: o2 },
  i2 = { parts: ck.keys, baseStyle: a2 },
  l2 = {
    lineHeight: "1.2",
    borderRadius: "md",
    fontWeight: "semibold",
    transitionProperty: "common",
    transitionDuration: "normal",
    _focus: { boxShadow: "outline" },
    _disabled: { opacity: 0.4, cursor: "not-allowed", boxShadow: "none" },
    _hover: { _disabled: { bg: "initial" } },
  },
  hv = function (t) {
    var r = t.colorScheme,
      n = t.theme;
    if (r === "gray")
      return {
        color: _("inherit", "whiteAlpha.900")(t),
        _hover: { bg: _("gray.100", "whiteAlpha.200")(t) },
        _active: { bg: _("gray.200", "whiteAlpha.300")(t) },
      };
    var o = Ln(r + ".200", 0.12)(n),
      a = Ln(r + ".200", 0.24)(n);
    return {
      color: _(r + ".600", r + ".200")(t),
      bg: "transparent",
      _hover: { bg: _(r + ".50", o)(t) },
      _active: { bg: _(r + ".100", a)(t) },
    };
  },
  s2 = function (t) {
    var r = t.colorScheme,
      n = _("gray.200", "whiteAlpha.300")(t);
    return ce(
      { border: "1px solid", borderColor: r === "gray" ? n : "currentColor" },
      hv(t)
    );
  },
  u2 = {
    yellow: {
      bg: "yellow.400",
      color: "black",
      hoverBg: "yellow.500",
      activeBg: "yellow.600",
    },
    cyan: {
      bg: "cyan.400",
      color: "black",
      hoverBg: "cyan.500",
      activeBg: "cyan.600",
    },
  },
  c2 = function (t) {
    var r,
      n = t.colorScheme;
    if (n === "gray") {
      var o = _("gray.100", "whiteAlpha.200")(t);
      return {
        bg: o,
        _hover: {
          bg: _("gray.200", "whiteAlpha.300")(t),
          _disabled: { bg: o },
        },
        _active: { bg: _("gray.300", "whiteAlpha.400")(t) },
      };
    }
    var a = (r = u2[n]) != null ? r : {},
      i = a.bg,
      l = i === void 0 ? n + ".500" : i,
      s = a.color,
      u = s === void 0 ? "white" : s,
      p = a.hoverBg,
      g = p === void 0 ? n + ".600" : p,
      v = a.activeBg,
      m = v === void 0 ? n + ".700" : v,
      y = _(l, n + ".200")(t);
    return {
      bg: y,
      color: _(u, "gray.800")(t),
      _hover: { bg: _(g, n + ".300")(t), _disabled: { bg: y } },
      _active: { bg: _(m, n + ".400")(t) },
    };
  },
  f2 = function (t) {
    var r = t.colorScheme;
    return {
      padding: 0,
      height: "auto",
      lineHeight: "normal",
      verticalAlign: "baseline",
      color: _(r + ".500", r + ".200")(t),
      _hover: {
        textDecoration: "underline",
        _disabled: { textDecoration: "none" },
      },
      _active: { color: _(r + ".700", r + ".500")(t) },
    };
  },
  d2 = {
    bg: "none",
    color: "inherit",
    display: "inline",
    lineHeight: "inherit",
    m: 0,
    p: 0,
  },
  p2 = { ghost: hv, outline: s2, solid: c2, link: f2, unstyled: d2 },
  m2 = {
    lg: { h: 12, minW: 12, fontSize: "lg", px: 6 },
    md: { h: 10, minW: 10, fontSize: "md", px: 4 },
    sm: { h: 8, minW: 8, fontSize: "sm", px: 3 },
    xs: { h: 6, minW: 6, fontSize: "xs", px: 2 },
  },
  h2 = { variant: "solid", size: "md", colorScheme: "gray" },
  v2 = { baseStyle: l2, variants: p2, sizes: m2, defaultProps: h2 },
  g2 = function (t) {
    var r = t.colorScheme;
    return {
      w: "100%",
      transitionProperty: "box-shadow",
      transitionDuration: "normal",
      border: "2px solid",
      borderRadius: "sm",
      borderColor: "inherit",
      color: "white",
      _checked: {
        bg: _(r + ".500", r + ".200")(t),
        borderColor: _(r + ".500", r + ".200")(t),
        color: _("white", "gray.900")(t),
        _hover: {
          bg: _(r + ".600", r + ".300")(t),
          borderColor: _(r + ".600", r + ".300")(t),
        },
        _disabled: {
          borderColor: _("gray.200", "transparent")(t),
          bg: _("gray.200", "whiteAlpha.300")(t),
          color: _("gray.500", "whiteAlpha.500")(t),
        },
      },
      _indeterminate: {
        bg: _(r + ".500", r + ".200")(t),
        borderColor: _(r + ".500", r + ".200")(t),
        color: _("white", "gray.900")(t),
      },
      _disabled: {
        bg: _("gray.100", "whiteAlpha.100")(t),
        borderColor: _("gray.100", "transparent")(t),
      },
      _focus: { boxShadow: "outline" },
      _invalid: { borderColor: _("red.500", "red.300")(t) },
    };
  },
  y2 = { _disabled: { cursor: "not-allowed" } },
  b2 = { userSelect: "none", _disabled: { opacity: 0.4 } },
  S2 = { transitionProperty: "transform", transitionDuration: "normal" },
  x2 = function (t) {
    return { icon: S2, container: y2, control: g2(t), label: b2 };
  },
  w2 = {
    sm: {
      control: { h: 3, w: 3 },
      label: { fontSize: "sm" },
      icon: { fontSize: "0.45rem" },
    },
    md: {
      control: { w: 4, h: 4 },
      label: { fontSize: "md" },
      icon: { fontSize: "0.625rem" },
    },
    lg: {
      control: { w: 5, h: 5 },
      label: { fontSize: "lg" },
      icon: { fontSize: "0.625rem" },
    },
  },
  k2 = { size: "md", colorScheme: "blue" },
  al = { parts: fk.keys, baseStyle: x2, sizes: w2, defaultProps: k2 },
  Ja,
  ei,
  ti,
  No = Ze("close-button-size"),
  E2 = function (t) {
    var r = _("blackAlpha.100", "whiteAlpha.100")(t),
      n = _("blackAlpha.200", "whiteAlpha.200")(t);
    return {
      w: [No.reference],
      h: [No.reference],
      borderRadius: "md",
      transitionProperty: "common",
      transitionDuration: "normal",
      _disabled: { opacity: 0.4, cursor: "not-allowed", boxShadow: "none" },
      _hover: { bg: r },
      _active: { bg: n },
      _focus: { boxShadow: "outline" },
    };
  },
  _2 = {
    lg: ((Ja = {}), (Ja[No.variable] = "40px"), (Ja.fontSize = "16px"), Ja),
    md: ((ei = {}), (ei[No.variable] = "32px"), (ei.fontSize = "12px"), ei),
    sm: ((ti = {}), (ti[No.variable] = "24px"), (ti.fontSize = "10px"), ti),
  },
  C2 = { size: "md" },
  T2 = { baseStyle: E2, sizes: _2, defaultProps: C2 },
  P2 = In.variants,
  $2 = In.defaultProps,
  R2 = { fontFamily: "mono", fontSize: "sm", px: "0.2em", borderRadius: "sm" },
  A2 = { baseStyle: R2, variants: P2, defaultProps: $2 },
  z2 = { w: "100%", mx: "auto", maxW: "60ch", px: "1rem" },
  I2 = { baseStyle: z2 },
  M2 = { opacity: 0.6, borderColor: "inherit" },
  O2 = { borderStyle: "solid" },
  B2 = { borderStyle: "dashed" },
  F2 = { solid: O2, dashed: B2 },
  N2 = { variant: "solid" },
  L2 = { baseStyle: M2, variants: F2, defaultProps: N2 };
function sn(e) {
  return e === "full"
    ? { dialog: { maxW: "100vw", h: "100vh" } }
    : { dialog: { maxW: e } };
}
var j2 = { bg: "blackAlpha.600", zIndex: "overlay" },
  D2 = { display: "flex", zIndex: "modal", justifyContent: "center" },
  W2 = function (t) {
    var r = t.isFullHeight;
    return ce({}, r && { height: "100vh" }, {
      zIndex: "modal",
      maxH: "100vh",
      bg: _("white", "gray.700")(t),
      color: "inherit",
      boxShadow: _("lg", "dark-lg")(t),
    });
  },
  H2 = { px: 6, py: 4, fontSize: "xl", fontWeight: "semibold" },
  V2 = { position: "absolute", top: 2, insetEnd: 3 },
  U2 = { px: 6, py: 2, flex: 1, overflow: "auto" },
  G2 = { px: 6, py: 4 },
  Y2 = function (t) {
    return {
      overlay: j2,
      dialogContainer: D2,
      dialog: W2(t),
      header: H2,
      closeButton: V2,
      body: U2,
      footer: G2,
    };
  },
  X2 = {
    xs: sn("xs"),
    sm: sn("md"),
    md: sn("lg"),
    lg: sn("2xl"),
    xl: sn("4xl"),
    full: sn("full"),
  },
  Q2 = { size: "xs" },
  q2 = { parts: dk.keys, baseStyle: Y2, sizes: X2, defaultProps: Q2 },
  K2 = {
    borderRadius: "md",
    py: "3px",
    transitionProperty: "common",
    transitionDuration: "normal",
  },
  Z2 = {
    borderRadius: "md",
    py: "3px",
    transitionProperty: "common",
    transitionDuration: "normal",
    width: "full",
    _focus: { boxShadow: "outline" },
    _placeholder: { opacity: 0.6 },
  },
  J2 = {
    borderRadius: "md",
    py: "3px",
    transitionProperty: "common",
    transitionDuration: "normal",
    width: "full",
    _focus: { boxShadow: "outline" },
    _placeholder: { opacity: 0.6 },
  },
  eE = { preview: K2, input: Z2, textarea: J2 },
  tE = { parts: pk.keys, baseStyle: eE },
  rE = function (t) {
    return { marginStart: 1, color: _("red.500", "red.300")(t) };
  },
  nE = function (t) {
    return {
      mt: 2,
      color: _("gray.500", "whiteAlpha.600")(t),
      lineHeight: "normal",
      fontSize: "sm",
    };
  },
  oE = function (t) {
    return {
      container: { width: "100%", position: "relative" },
      requiredIndicator: rE(t),
      helperText: nE(t),
    };
  },
  aE = { parts: mk.keys, baseStyle: oE },
  iE = function (t) {
    return {
      color: _("red.500", "red.300")(t),
      mt: 2,
      fontSize: "sm",
      lineHeight: "normal",
    };
  },
  lE = function (t) {
    return { marginEnd: "0.5em", color: _("red.500", "red.300")(t) };
  },
  sE = function (t) {
    return { text: iE(t), icon: lE(t) };
  },
  uE = { parts: hk.keys, baseStyle: sE },
  cE = {
    fontSize: "md",
    marginEnd: 3,
    mb: 2,
    fontWeight: "medium",
    transitionProperty: "common",
    transitionDuration: "normal",
    opacity: 1,
    _disabled: { opacity: 0.4 },
  },
  fE = { baseStyle: cE },
  dE = { fontFamily: "heading", fontWeight: "bold" },
  pE = {
    "4xl": { fontSize: ["6xl", null, "7xl"], lineHeight: 1 },
    "3xl": { fontSize: ["5xl", null, "6xl"], lineHeight: 1 },
    "2xl": { fontSize: ["4xl", null, "5xl"], lineHeight: [1.2, null, 1] },
    xl: { fontSize: ["3xl", null, "4xl"], lineHeight: [1.33, null, 1.2] },
    lg: { fontSize: ["2xl", null, "3xl"], lineHeight: [1.33, null, 1.2] },
    md: { fontSize: "xl", lineHeight: 1.2 },
    sm: { fontSize: "md", lineHeight: 1.2 },
    xs: { fontSize: "sm", lineHeight: 1.2 },
  },
  mE = { size: "xl" },
  hE = { baseStyle: dE, sizes: pE, defaultProps: mE },
  vE = {
    field: {
      width: "100%",
      minWidth: 0,
      outline: 0,
      position: "relative",
      appearance: "none",
      transitionProperty: "common",
      transitionDuration: "normal",
    },
  },
  or = {
    lg: { fontSize: "lg", px: 4, h: 12, borderRadius: "md" },
    md: { fontSize: "md", px: 4, h: 10, borderRadius: "md" },
    sm: { fontSize: "sm", px: 3, h: 8, borderRadius: "sm" },
    xs: { fontSize: "xs", px: 2, h: 6, borderRadius: "sm" },
  },
  gE = {
    lg: { field: or.lg, addon: or.lg },
    md: { field: or.md, addon: or.md },
    sm: { field: or.sm, addon: or.sm },
    xs: { field: or.xs, addon: or.xs },
  };
function Sf(e) {
  var t = e.focusBorderColor,
    r = e.errorBorderColor;
  return {
    focusBorderColor: t || _("blue.500", "blue.300")(e),
    errorBorderColor: r || _("red.500", "red.300")(e),
  };
}
var yE = function (t) {
    var r = t.theme,
      n = Sf(t),
      o = n.focusBorderColor,
      a = n.errorBorderColor;
    return {
      field: {
        border: "1px solid",
        borderColor: "inherit",
        bg: "inherit",
        _hover: { borderColor: _("gray.300", "whiteAlpha.400")(t) },
        _readOnly: { boxShadow: "none !important", userSelect: "all" },
        _disabled: { opacity: 0.4, cursor: "not-allowed" },
        _invalid: { borderColor: he(r, a), boxShadow: "0 0 0 1px " + he(r, a) },
        _focus: {
          zIndex: 1,
          borderColor: he(r, o),
          boxShadow: "0 0 0 1px " + he(r, o),
        },
      },
      addon: {
        border: "1px solid",
        borderColor: _("inherit", "whiteAlpha.50")(t),
        bg: _("gray.100", "whiteAlpha.300")(t),
      },
    };
  },
  bE = function (t) {
    var r = t.theme,
      n = Sf(t),
      o = n.focusBorderColor,
      a = n.errorBorderColor;
    return {
      field: {
        border: "2px solid",
        borderColor: "transparent",
        bg: _("gray.100", "whiteAlpha.50")(t),
        _hover: { bg: _("gray.200", "whiteAlpha.100")(t) },
        _readOnly: { boxShadow: "none !important", userSelect: "all" },
        _disabled: { opacity: 0.4, cursor: "not-allowed" },
        _invalid: { borderColor: he(r, a) },
        _focus: { bg: "transparent", borderColor: he(r, o) },
      },
      addon: {
        border: "2px solid",
        borderColor: "transparent",
        bg: _("gray.100", "whiteAlpha.50")(t),
      },
    };
  },
  SE = function (t) {
    var r = t.theme,
      n = Sf(t),
      o = n.focusBorderColor,
      a = n.errorBorderColor;
    return {
      field: {
        borderBottom: "1px solid",
        borderColor: "inherit",
        borderRadius: 0,
        px: 0,
        bg: "transparent",
        _readOnly: { boxShadow: "none !important", userSelect: "all" },
        _invalid: {
          borderColor: he(r, a),
          boxShadow: "0px 1px 0px 0px " + he(r, a),
        },
        _focus: {
          borderColor: he(r, o),
          boxShadow: "0px 1px 0px 0px " + he(r, o),
        },
      },
      addon: {
        borderBottom: "2px solid",
        borderColor: "inherit",
        borderRadius: 0,
        px: 0,
        bg: "transparent",
      },
    };
  },
  xE = {
    field: { bg: "transparent", px: 0, height: "auto" },
    addon: { bg: "transparent", px: 0, height: "auto" },
  },
  wE = { outline: yE, filled: bE, flushed: SE, unstyled: xE },
  kE = { size: "md", variant: "outline" },
  ae = {
    parts: vk.keys,
    baseStyle: vE,
    sizes: gE,
    variants: wE,
    defaultProps: kE,
  },
  EE = function (t) {
    return {
      bg: _("gray.100", "whiteAlpha")(t),
      borderRadius: "md",
      borderWidth: "1px",
      borderBottomWidth: "3px",
      fontSize: "0.8em",
      fontWeight: "bold",
      lineHeight: "normal",
      px: "0.4em",
      whiteSpace: "nowrap",
    };
  },
  _E = { baseStyle: EE },
  CE = {
    transitionProperty: "common",
    transitionDuration: "fast",
    transitionTimingFunction: "ease-out",
    cursor: "pointer",
    textDecoration: "none",
    outline: "none",
    color: "inherit",
    _hover: { textDecoration: "underline" },
    _focus: { boxShadow: "outline" },
  },
  TE = { baseStyle: CE },
  PE = { marginEnd: "0.5rem", display: "inline", verticalAlign: "text-bottom" },
  $E = { container: {}, item: {}, icon: PE },
  RE = { parts: gk.keys, baseStyle: $E },
  AE = function (t) {
    return {
      bg: _("#fff", "gray.700")(t),
      boxShadow: _("sm", "dark-lg")(t),
      color: "inherit",
      minW: "3xs",
      py: "2",
      zIndex: 1,
      borderRadius: "md",
      borderWidth: "1px",
    };
  },
  zE = function (t) {
    return {
      py: "0.4rem",
      px: "0.8rem",
      transitionProperty: "background",
      transitionDuration: "ultra-fast",
      transitionTimingFunction: "ease-in",
      _focus: { bg: _("gray.100", "whiteAlpha.100")(t) },
      _active: { bg: _("gray.200", "whiteAlpha.200")(t) },
      _expanded: { bg: _("gray.100", "whiteAlpha.100")(t) },
      _disabled: { opacity: 0.4, cursor: "not-allowed" },
    };
  },
  IE = { mx: 4, my: 2, fontWeight: "semibold", fontSize: "sm" },
  ME = { opacity: 0.6 },
  OE = {
    border: 0,
    borderBottom: "1px solid",
    borderColor: "inherit",
    my: "0.5rem",
    opacity: 0.6,
  },
  BE = { transitionProperty: "common", transitionDuration: "normal" },
  FE = function (t) {
    return {
      button: BE,
      list: AE(t),
      item: zE(t),
      groupTitle: IE,
      command: ME,
      divider: OE,
    };
  },
  NE = { parts: yk.keys, baseStyle: FE },
  LE = { bg: "blackAlpha.600", zIndex: "modal" },
  jE = function (t) {
    var r = t.isCentered,
      n = t.scrollBehavior;
    return {
      display: "flex",
      zIndex: "modal",
      justifyContent: "center",
      alignItems: r ? "center" : "flex-start",
      overflow: n === "inside" ? "hidden" : "auto",
    };
  },
  DE = function (t) {
    var r = t.scrollBehavior;
    return {
      borderRadius: "md",
      bg: _("white", "gray.700")(t),
      color: "inherit",
      my: "3.75rem",
      zIndex: "modal",
      maxH: r === "inside" ? "calc(100% - 7.5rem)" : void 0,
      boxShadow: _("lg", "dark-lg")(t),
    };
  },
  WE = { px: 6, py: 4, fontSize: "xl", fontWeight: "semibold" },
  HE = { position: "absolute", top: 2, insetEnd: 3 },
  VE = function (t) {
    var r = t.scrollBehavior;
    return {
      px: 6,
      py: 2,
      flex: 1,
      overflow: r === "inside" ? "auto" : void 0,
    };
  },
  UE = { px: 6, py: 4 },
  GE = function (t) {
    return {
      overlay: LE,
      dialogContainer: jE(t),
      dialog: DE(t),
      header: WE,
      closeButton: HE,
      body: VE(t),
      footer: UE,
    };
  };
function vt(e) {
  return e === "full"
    ? {
        dialog: {
          maxW: "100vw",
          minH: "100vh",
          "@supports(min-height: -webkit-fill-available)": {
            minH: "-webkit-fill-available",
          },
          my: 0,
        },
      }
    : { dialog: { maxW: e } };
}
var YE = {
    xs: vt("xs"),
    sm: vt("sm"),
    md: vt("md"),
    lg: vt("lg"),
    xl: vt("xl"),
    "2xl": vt("2xl"),
    "3xl": vt("3xl"),
    "4xl": vt("4xl"),
    "5xl": vt("5xl"),
    "6xl": vt("6xl"),
    full: vt("full"),
  },
  XE = { size: "md" },
  QE = { parts: bk.keys, baseStyle: GE, sizes: YE, defaultProps: XE },
  ri,
  qp,
  Kp,
  qE = ae.variants,
  KE = ae.defaultProps,
  xf = Ze("number-input-stepper-width"),
  vv = Ze("number-input-input-padding"),
  ZE = Xt(xf).add("0.5rem").toString(),
  JE = ((ri = {}), (ri[xf.variable] = "24px"), (ri[vv.variable] = ZE), ri),
  e_ = (qp = (Kp = ae.baseStyle) == null ? void 0 : Kp.field) != null ? qp : {},
  t_ = { width: [xf.reference] },
  r_ = function (t) {
    return {
      borderStart: "1px solid",
      borderStartColor: _("inherit", "whiteAlpha.300")(t),
      color: _("inherit", "whiteAlpha.800")(t),
      _active: { bg: _("gray.200", "whiteAlpha.300")(t) },
      _disabled: { opacity: 0.4, cursor: "not-allowed" },
    };
  },
  n_ = function (t) {
    return { root: JE, field: e_, stepperGroup: t_, stepper: r_(t) };
  };
function ni(e) {
  var t,
    r,
    n = ae.sizes[e],
    o = { lg: "md", md: "md", sm: "sm", xs: "sm" },
    a = (t = (r = n.field) == null ? void 0 : r.fontSize) != null ? t : "md",
    i = mv.fontSizes[a.toString()];
  return {
    field: ce({}, n.field, {
      paddingInlineEnd: vv.reference,
      verticalAlign: "top",
    }),
    stepper: {
      fontSize: Xt(i).multiply(0.75).toString(),
      _first: { borderTopEndRadius: o[e] },
      _last: { borderBottomEndRadius: o[e], mt: "-1px", borderTopWidth: 1 },
    },
  };
}
var o_ = { xs: ni("xs"), sm: ni("sm"), md: ni("md"), lg: ni("lg") },
  a_ = {
    parts: Sk.keys,
    baseStyle: n_,
    sizes: o_,
    variants: qE,
    defaultProps: KE,
  },
  Zp,
  i_ = ce({}, ae.baseStyle.field, { textAlign: "center" }),
  l_ = {
    lg: { fontSize: "lg", w: 12, h: 12, borderRadius: "md" },
    md: { fontSize: "md", w: 10, h: 10, borderRadius: "md" },
    sm: { fontSize: "sm", w: 8, h: 8, borderRadius: "sm" },
    xs: { fontSize: "xs", w: 6, h: 6, borderRadius: "sm" },
  },
  s_ = {
    outline: function (t) {
      var r;
      return (r = ae.variants.outline(t).field) != null ? r : {};
    },
    flushed: function (t) {
      var r;
      return (r = ae.variants.flushed(t).field) != null ? r : {};
    },
    filled: function (t) {
      var r;
      return (r = ae.variants.filled(t).field) != null ? r : {};
    },
    unstyled: (Zp = ae.variants.unstyled.field) != null ? Zp : {},
  },
  u_ = ae.defaultProps,
  c_ = { baseStyle: i_, sizes: l_, variants: s_, defaultProps: u_ },
  Fs = Ze("popper-bg"),
  f_ = Ze("popper-arrow-bg"),
  d_ = Ze("popper-arrow-shadow-color"),
  p_ = { zIndex: 10 },
  m_ = function (t) {
    var r,
      n = _("white", "gray.700")(t),
      o = _("gray.200", "whiteAlpha.300")(t);
    return (
      (r = {}),
      (r[Fs.variable] = "colors." + n),
      (r.bg = Fs.reference),
      (r[f_.variable] = Fs.reference),
      (r[d_.variable] = "colors." + o),
      (r.width = "xs"),
      (r.border = "1px solid"),
      (r.borderColor = "inherit"),
      (r.borderRadius = "md"),
      (r.boxShadow = "sm"),
      (r.zIndex = "inherit"),
      (r._focus = { outline: 0, boxShadow: "outline" }),
      r
    );
  },
  h_ = { px: 3, py: 2, borderBottomWidth: "1px" },
  v_ = { px: 3, py: 2 },
  g_ = { px: 3, py: 2, borderTopWidth: "1px" },
  y_ = {
    position: "absolute",
    borderRadius: "md",
    top: 1,
    insetEnd: 2,
    padding: 2,
  },
  b_ = function (t) {
    return {
      popper: p_,
      content: m_(t),
      header: h_,
      body: v_,
      footer: g_,
      arrow: {},
      closeButton: y_,
    };
  },
  S_ = { parts: xk.keys, baseStyle: b_ };
function x_(e) {
  var t = e.colorScheme,
    r = e.theme,
    n = e.isIndeterminate,
    o = e.hasStripe,
    a = _(Vp(), Vp("1rem", "rgba(0,0,0,0.1)"))(e),
    i = _(t + ".500", t + ".200")(e),
    l =
      `linear-gradient(
    to right,
    transparent 0%,
    ` +
      he(r, i) +
      ` 50%,
    transparent 100%
  )`,
    s = !n && o;
  return ce({}, s && a, n ? { bgImage: l } : { bgColor: i });
}
var w_ = {
    lineHeight: "1",
    fontSize: "0.25em",
    fontWeight: "bold",
    color: "white",
  },
  k_ = function (t) {
    return { bg: _("gray.100", "whiteAlpha.300")(t) };
  },
  E_ = function (t) {
    return ce(
      { transitionProperty: "common", transitionDuration: "slow" },
      x_(t)
    );
  },
  __ = function (t) {
    return { label: w_, filledTrack: E_(t), track: k_(t) };
  },
  C_ = {
    xs: { track: { h: "0.25rem" } },
    sm: { track: { h: "0.5rem" } },
    md: { track: { h: "0.75rem" } },
    lg: { track: { h: "1rem" } },
  },
  T_ = { size: "md", colorScheme: "blue" },
  P_ = { parts: wk.keys, sizes: C_, baseStyle: __, defaultProps: T_ },
  $_ = function (t) {
    var r = al.baseStyle(t),
      n = r.control,
      o = n === void 0 ? {} : n;
    return ce({}, o, {
      borderRadius: "full",
      _checked: ce({}, o._checked, {
        _before: {
          content: '""',
          display: "inline-block",
          pos: "relative",
          w: "50%",
          h: "50%",
          borderRadius: "50%",
          bg: "currentColor",
        },
      }),
    });
  },
  R_ = function (t) {
    return {
      label: al.baseStyle(t).label,
      container: al.baseStyle(t).container,
      control: $_(t),
    };
  },
  A_ = {
    md: { control: { w: 4, h: 4 }, label: { fontSize: "md" } },
    lg: { control: { w: 5, h: 5 }, label: { fontSize: "lg" } },
    sm: { control: { width: 3, height: 3 }, label: { fontSize: "sm" } },
  },
  z_ = { size: "md", colorScheme: "blue" },
  I_ = { parts: kk.keys, baseStyle: R_, sizes: A_, defaultProps: z_ },
  M_ = function (t) {
    return ce({}, ae.baseStyle.field, {
      bg: _("white", "gray.700")(t),
      appearance: "none",
      paddingBottom: "1px",
      lineHeight: "normal",
      "> option, > optgroup": { bg: _("white", "gray.700")(t) },
    });
  },
  O_ = {
    width: "1.5rem",
    height: "100%",
    insetEnd: "0.5rem",
    position: "relative",
    color: "currentColor",
    fontSize: "1.25rem",
    _disabled: { opacity: 0.5 },
  },
  B_ = function (t) {
    return { field: M_(t), icon: O_ };
  },
  oi = { paddingInlineEnd: "2rem" },
  F_ = ot({}, ae.sizes, {
    lg: { field: oi },
    md: { field: oi },
    sm: { field: oi },
    xs: { field: oi, icon: { insetEnd: "0.25rem" } },
  }),
  N_ = {
    parts: Ek.keys,
    baseStyle: B_,
    sizes: F_,
    variants: ae.variants,
    defaultProps: ae.defaultProps,
  },
  L_ = function (t, r) {
    return M0({
      from: { borderColor: t, background: t },
      to: { borderColor: r, background: r },
    });
  },
  j_ = function (t) {
    var r = _("gray.100", "gray.800")(t),
      n = _("gray.400", "gray.600")(t),
      o = t.startColor,
      a = o === void 0 ? r : o,
      i = t.endColor,
      l = i === void 0 ? n : i,
      s = t.speed,
      u = t.theme,
      p = he(u, a),
      g = he(u, l);
    return {
      opacity: 0.7,
      borderRadius: "2px",
      borderColor: p,
      background: g,
      animation: s + "s linear infinite alternate " + L_(p, g),
    };
  },
  D_ = { baseStyle: j_ },
  W_ = function (t) {
    return {
      borderRadius: "md",
      fontWeight: "semibold",
      _focus: {
        boxShadow: "outline",
        padding: "1rem",
        position: "fixed",
        top: "1.5rem",
        insetStart: "1.5rem",
        bg: _("white", "gray.700")(t),
      },
    };
  },
  H_ = { baseStyle: W_ };
function V_(e) {
  return ka({
    orientation: e.orientation,
    vertical: {
      left: "50%",
      transform: "translateX(-50%)",
      _active: { transform: "translateX(-50%) scale(1.15)" },
    },
    horizontal: {
      top: "50%",
      transform: "translateY(-50%)",
      _active: { transform: "translateY(-50%) scale(1.15)" },
    },
  });
}
var U_ = function (t) {
    var r = t.orientation;
    return ce(
      {
        display: "inline-block",
        position: "relative",
        cursor: "pointer",
        _disabled: { opacity: 0.6, cursor: "default", pointerEvents: "none" },
      },
      ka({ orientation: r, vertical: { h: "100%" }, horizontal: { w: "100%" } })
    );
  },
  G_ = function (t) {
    return {
      overflow: "hidden",
      borderRadius: "sm",
      bg: _("gray.200", "whiteAlpha.200")(t),
      _disabled: { bg: _("gray.300", "whiteAlpha.300")(t) },
    };
  },
  Y_ = function (t) {
    return ce(
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        outline: 0,
        zIndex: 1,
        borderRadius: "full",
        bg: "white",
        boxShadow: "base",
        border: "1px solid",
        borderColor: "transparent",
        transitionProperty: "transform",
        transitionDuration: "normal",
        _focus: { boxShadow: "outline" },
        _disabled: { bg: "gray.300" },
      },
      V_(t)
    );
  },
  X_ = function (t) {
    var r = t.colorScheme;
    return {
      width: "inherit",
      height: "inherit",
      bg: _(r + ".500", r + ".200")(t),
    };
  },
  Q_ = function (t) {
    return { container: U_(t), track: G_(t), thumb: Y_(t), filledTrack: X_(t) };
  },
  q_ = function (t) {
    return {
      thumb: { w: "16px", h: "16px" },
      track: ka({
        orientation: t.orientation,
        horizontal: { h: "4px" },
        vertical: { w: "4px" },
      }),
    };
  },
  K_ = function (t) {
    return {
      thumb: { w: "14px", h: "14px" },
      track: ka({
        orientation: t.orientation,
        horizontal: { h: "4px" },
        vertical: { w: "4px" },
      }),
    };
  },
  Z_ = function (t) {
    return {
      thumb: { w: "10px", h: "10px" },
      track: ka({
        orientation: t.orientation,
        horizontal: { h: "2px" },
        vertical: { w: "2px" },
      }),
    };
  },
  J_ = { lg: q_, md: K_, sm: Z_ },
  eC = { size: "md", colorScheme: "blue" },
  tC = { parts: _k.keys, sizes: J_, baseStyle: Q_, defaultProps: eC },
  Ns,
  Ls,
  js,
  Ds,
  Ws,
  Or = Ze("spinner-size"),
  rC = { width: [Or.reference], height: [Or.reference] },
  nC = {
    xs: ((Ns = {}), (Ns[Or.variable] = "0.75rem"), Ns),
    sm: ((Ls = {}), (Ls[Or.variable] = "1rem"), Ls),
    md: ((js = {}), (js[Or.variable] = "1.5rem"), js),
    lg: ((Ds = {}), (Ds[Or.variable] = "2rem"), Ds),
    xl: ((Ws = {}), (Ws[Or.variable] = "3rem"), Ws),
  },
  oC = { size: "md" },
  aC = { baseStyle: rC, sizes: nC, defaultProps: oC },
  iC = { fontWeight: "medium" },
  lC = { opacity: 0.8, marginBottom: 2 },
  sC = { verticalAlign: "baseline", fontWeight: "semibold" },
  uC = { marginEnd: 1, w: "14px", h: "14px", verticalAlign: "middle" },
  cC = { container: {}, label: iC, helpText: lC, number: sC, icon: uC },
  fC = {
    md: {
      label: { fontSize: "sm" },
      helpText: { fontSize: "sm" },
      number: { fontSize: "2xl" },
    },
  },
  dC = { size: "md" },
  pC = { parts: Ck.keys, baseStyle: cC, sizes: fC, defaultProps: dC },
  ai,
  ii,
  li,
  Lo = Ze("switch-track-width"),
  Gr = Ze("switch-track-height"),
  Hs = Ze("switch-track-diff"),
  mC = Xt.subtract(Lo, Gr),
  Qu = Ze("switch-thumb-x"),
  hC = function (t) {
    var r = t.colorScheme;
    return {
      borderRadius: "full",
      p: "2px",
      width: [Lo.reference],
      height: [Gr.reference],
      transitionProperty: "common",
      transitionDuration: "fast",
      bg: _("gray.300", "whiteAlpha.400")(t),
      _focus: { boxShadow: "outline" },
      _disabled: { opacity: 0.4, cursor: "not-allowed" },
      _checked: { bg: _(r + ".500", r + ".200")(t) },
    };
  },
  vC = {
    bg: "white",
    transitionProperty: "transform",
    transitionDuration: "normal",
    borderRadius: "inherit",
    width: [Gr.reference],
    height: [Gr.reference],
    _checked: { transform: "translateX(" + Qu.reference + ")" },
  },
  gC = function (t) {
    var r, n;
    return {
      container:
        ((n = {}),
        (n[Hs.variable] = mC),
        (n[Qu.variable] = Hs.reference),
        (n._rtl = ((r = {}), (r[Qu.variable] = Xt(Hs).negate().toString()), r)),
        n),
      track: hC(t),
      thumb: vC,
    };
  },
  yC = {
    sm: {
      container:
        ((ai = {}),
        (ai[Lo.variable] = "1.375rem"),
        (ai[Gr.variable] = "0.75rem"),
        ai),
    },
    md: {
      container:
        ((ii = {}),
        (ii[Lo.variable] = "1.875rem"),
        (ii[Gr.variable] = "1rem"),
        ii),
    },
    lg: {
      container:
        ((li = {}),
        (li[Lo.variable] = "2.875rem"),
        (li[Gr.variable] = "1.5rem"),
        li),
    },
  },
  bC = { size: "md", colorScheme: "blue" },
  SC = { parts: Tk.keys, baseStyle: gC, sizes: yC, defaultProps: bC },
  xC = {
    table: {
      fontVariantNumeric: "lining-nums tabular-nums",
      borderCollapse: "collapse",
      width: "full",
    },
    th: {
      fontFamily: "heading",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "wider",
      textAlign: "start",
    },
    td: { textAlign: "start" },
    caption: {
      mt: 4,
      fontFamily: "heading",
      textAlign: "center",
      fontWeight: "medium",
    },
  },
  il = { "&[data-is-numeric=true]": { textAlign: "end" } },
  wC = function (t) {
    var r = t.colorScheme;
    return {
      th: ce(
        {
          color: _("gray.600", "gray.400")(t),
          borderBottom: "1px",
          borderColor: _(r + ".100", r + ".700")(t),
        },
        il
      ),
      td: ce(
        { borderBottom: "1px", borderColor: _(r + ".100", r + ".700")(t) },
        il
      ),
      caption: { color: _("gray.600", "gray.100")(t) },
      tfoot: { tr: { "&:last-of-type": { th: { borderBottomWidth: 0 } } } },
    };
  },
  kC = function (t) {
    var r = t.colorScheme;
    return {
      th: ce(
        {
          color: _("gray.600", "gray.400")(t),
          borderBottom: "1px",
          borderColor: _(r + ".100", r + ".700")(t),
        },
        il
      ),
      td: ce(
        { borderBottom: "1px", borderColor: _(r + ".100", r + ".700")(t) },
        il
      ),
      caption: { color: _("gray.600", "gray.100")(t) },
      tbody: {
        tr: {
          "&:nth-of-type(odd)": {
            "th, td": {
              borderBottomWidth: "1px",
              borderColor: _(r + ".100", r + ".700")(t),
            },
            td: { background: _(r + ".100", r + ".700")(t) },
          },
        },
      },
      tfoot: { tr: { "&:last-of-type": { th: { borderBottomWidth: 0 } } } },
    };
  },
  EC = { simple: wC, striped: kC, unstyled: {} },
  _C = {
    sm: {
      th: { px: "4", py: "1", lineHeight: "4", fontSize: "xs" },
      td: { px: "4", py: "2", fontSize: "sm", lineHeight: "4" },
      caption: { px: "4", py: "2", fontSize: "xs" },
    },
    md: {
      th: { px: "6", py: "3", lineHeight: "4", fontSize: "xs" },
      td: { px: "6", py: "4", lineHeight: "5" },
      caption: { px: "6", py: "2", fontSize: "sm" },
    },
    lg: {
      th: { px: "8", py: "4", lineHeight: "5", fontSize: "sm" },
      td: { px: "8", py: "5", lineHeight: "6" },
      caption: { px: "6", py: "2", fontSize: "md" },
    },
  },
  CC = { variant: "simple", size: "md", colorScheme: "gray" },
  TC = {
    parts: Pk.keys,
    baseStyle: xC,
    variants: EC,
    sizes: _C,
    defaultProps: CC,
  },
  PC = function (t) {
    var r = t.orientation;
    return { display: r === "vertical" ? "flex" : "block" };
  },
  $C = function (t) {
    var r = t.isFitted;
    return {
      flex: r ? 1 : void 0,
      transitionProperty: "common",
      transitionDuration: "normal",
      _focus: { zIndex: 1, boxShadow: "outline" },
    };
  },
  RC = function (t) {
    var r = t.align,
      n = r === void 0 ? "start" : r,
      o = t.orientation,
      a = { end: "flex-end", center: "center", start: "flex-start" };
    return {
      justifyContent: a[n],
      flexDirection: o === "vertical" ? "column" : "row",
    };
  },
  AC = { p: 4 },
  zC = function (t) {
    return { root: PC(t), tab: $C(t), tablist: RC(t), tabpanel: AC };
  },
  IC = {
    sm: { tab: { py: 1, px: 4, fontSize: "sm" } },
    md: { tab: { fontSize: "md", py: 2, px: 4 } },
    lg: { tab: { fontSize: "lg", py: 3, px: 4 } },
  },
  MC = function (t) {
    var r,
      n,
      o = t.colorScheme,
      a = t.orientation,
      i = a === "vertical",
      l = a === "vertical" ? "borderStart" : "borderBottom",
      s = i ? "marginStart" : "marginBottom";
    return {
      tablist: ((r = {}), (r[l] = "2px solid"), (r.borderColor = "inherit"), r),
      tab:
        ((n = {}),
        (n[l] = "2px solid"),
        (n.borderColor = "transparent"),
        (n[s] = "-2px"),
        (n._selected = {
          color: _(o + ".600", o + ".300")(t),
          borderColor: "currentColor",
        }),
        (n._active = { bg: _("gray.200", "whiteAlpha.300")(t) }),
        (n._disabled = { opacity: 0.4, cursor: "not-allowed" }),
        n),
    };
  },
  OC = function (t) {
    var r = t.colorScheme;
    return {
      tab: {
        borderTopRadius: "md",
        border: "1px solid",
        borderColor: "transparent",
        mb: "-1px",
        _selected: {
          color: _(r + ".600", r + ".300")(t),
          borderColor: "inherit",
          borderBottomColor: _("white", "gray.800")(t),
        },
      },
      tablist: {
        mb: "-1px",
        borderBottom: "1px solid",
        borderColor: "inherit",
      },
    };
  },
  BC = function (t) {
    var r = t.colorScheme;
    return {
      tab: {
        border: "1px solid",
        borderColor: "inherit",
        bg: _("gray.50", "whiteAlpha.50")(t),
        mb: "-1px",
        _notLast: { marginEnd: "-1px" },
        _selected: {
          bg: _("#fff", "gray.800")(t),
          color: _(r + ".600", r + ".300")(t),
          borderColor: "inherit",
          borderTopColor: "currentColor",
          borderBottomColor: "transparent",
        },
      },
      tablist: {
        mb: "-1px",
        borderBottom: "1px solid",
        borderColor: "inherit",
      },
    };
  },
  FC = function (t) {
    var r = t.colorScheme,
      n = t.theme;
    return {
      tab: {
        borderRadius: "full",
        fontWeight: "semibold",
        color: "gray.600",
        _selected: { color: he(n, r + ".700"), bg: he(n, r + ".100") },
      },
    };
  },
  NC = function (t) {
    var r = t.colorScheme;
    return {
      tab: {
        borderRadius: "full",
        fontWeight: "semibold",
        color: _("gray.600", "inherit")(t),
        _selected: {
          color: _("#fff", "gray.800")(t),
          bg: _(r + ".600", r + ".300")(t),
        },
      },
    };
  },
  LC = {},
  jC = {
    line: MC,
    enclosed: OC,
    "enclosed-colored": BC,
    "soft-rounded": FC,
    "solid-rounded": NC,
    unstyled: LC,
  },
  DC = { size: "md", variant: "line", colorScheme: "blue" },
  WC = {
    parts: $k.keys,
    baseStyle: zC,
    sizes: IC,
    variants: jC,
    defaultProps: DC,
  },
  HC = {
    fontWeight: "medium",
    lineHeight: 1.2,
    outline: 0,
    _focus: { boxShadow: "outline" },
  },
  VC = { lineHeight: 1.2, overflow: "visible" },
  UC = {
    fontSize: "18px",
    w: "1.25rem",
    h: "1.25rem",
    transitionProperty: "common",
    transitionDuration: "normal",
    borderRadius: "full",
    marginStart: "0.375rem",
    marginEnd: "-1",
    opacity: 0.5,
    _disabled: { opacity: 0.4 },
    _focus: { boxShadow: "outline", bg: "rgba(0, 0, 0, 0.14)" },
    _hover: { opacity: 0.8 },
    _active: { opacity: 1 },
  },
  GC = { container: HC, label: VC, closeButton: UC },
  YC = {
    sm: {
      container: {
        minH: "1.25rem",
        minW: "1.25rem",
        fontSize: "xs",
        px: 2,
        borderRadius: "md",
      },
      closeButton: { marginEnd: "-2px", marginStart: "0.35rem" },
    },
    md: {
      container: {
        minH: "1.5rem",
        minW: "1.5rem",
        fontSize: "sm",
        borderRadius: "md",
        px: 2,
      },
    },
    lg: {
      container: {
        minH: 8,
        minW: 8,
        fontSize: "md",
        borderRadius: "md",
        px: 3,
      },
    },
  },
  XC = {
    subtle: function (t) {
      return { container: In.variants.subtle(t) };
    },
    solid: function (t) {
      return { container: In.variants.solid(t) };
    },
    outline: function (t) {
      return { container: In.variants.outline(t) };
    },
  },
  QC = { size: "md", variant: "subtle", colorScheme: "gray" },
  qC = {
    parts: Rk.keys,
    variants: XC,
    baseStyle: GC,
    sizes: YC,
    defaultProps: QC,
  },
  Jp,
  em,
  tm,
  rm,
  nm,
  KC = ce({}, ae.baseStyle.field, {
    paddingY: "8px",
    minHeight: "80px",
    lineHeight: "short",
    verticalAlign: "top",
  }),
  ZC = {
    outline: function (t) {
      var r;
      return (r = ae.variants.outline(t).field) != null ? r : {};
    },
    flushed: function (t) {
      var r;
      return (r = ae.variants.flushed(t).field) != null ? r : {};
    },
    filled: function (t) {
      var r;
      return (r = ae.variants.filled(t).field) != null ? r : {};
    },
    unstyled: (Jp = ae.variants.unstyled.field) != null ? Jp : {},
  },
  JC = {
    xs: (em = ae.sizes.xs.field) != null ? em : {},
    sm: (tm = ae.sizes.sm.field) != null ? tm : {},
    md: (rm = ae.sizes.md.field) != null ? rm : {},
    lg: (nm = ae.sizes.lg.field) != null ? nm : {},
  },
  e5 = { size: "md", variant: "outline" },
  t5 = { baseStyle: KC, sizes: JC, variants: ZC, defaultProps: e5 },
  Vs = Ze("tooltip-bg"),
  r5 = Ze("popper-arrow-bg"),
  n5 = function (t) {
    var r,
      n = _("gray.700", "gray.300")(t);
    return (
      (r = {}),
      (r[Vs.variable] = "colors." + n),
      (r.px = "8px"),
      (r.py = "2px"),
      (r.bg = [Vs.reference]),
      (r[r5.variable] = [Vs.reference]),
      (r.color = _("whiteAlpha.900", "gray.900")(t)),
      (r.borderRadius = "sm"),
      (r.fontWeight = "medium"),
      (r.fontSize = "sm"),
      (r.boxShadow = "md"),
      (r.maxW = "320px"),
      (r.zIndex = "tooltip"),
      r
    );
  },
  o5 = { baseStyle: n5 },
  a5 = Object.freeze({
    __proto__: null,
    Accordion: Bk,
    Alert: Vk,
    Avatar: Kk,
    Badge: In,
    Breadcrumb: i2,
    Button: v2,
    Checkbox: al,
    CloseButton: T2,
    Code: A2,
    Container: I2,
    Divider: L2,
    Drawer: q2,
    Editable: tE,
    Form: aE,
    FormError: uE,
    FormLabel: fE,
    Heading: hE,
    Input: ae,
    Kbd: _E,
    Link: TE,
    List: RE,
    Menu: NE,
    Modal: QE,
    NumberInput: a_,
    PinInput: c_,
    Popover: S_,
    Progress: P_,
    Radio: I_,
    Select: N_,
    Skeleton: D_,
    SkipLink: H_,
    Slider: tC,
    Spinner: aC,
    Stat: pC,
    Switch: SC,
    Table: TC,
    Tabs: WC,
    Tag: qC,
    Textarea: t5,
    Tooltip: o5,
  }),
  i5 = {
    none: 0,
    "1px": "1px solid",
    "2px": "2px solid",
    "4px": "4px solid",
    "8px": "8px solid",
  },
  l5 = Zw({ sm: "30em", md: "48em", lg: "62em", xl: "80em", "2xl": "96em" }),
  s5 = {
    transparent: "transparent",
    current: "currentColor",
    black: "#000000",
    white: "#FFFFFF",
    whiteAlpha: {
      50: "rgba(255, 255, 255, 0.04)",
      100: "rgba(255, 255, 255, 0.06)",
      200: "rgba(255, 255, 255, 0.08)",
      300: "rgba(255, 255, 255, 0.16)",
      400: "rgba(255, 255, 255, 0.24)",
      500: "rgba(255, 255, 255, 0.36)",
      600: "rgba(255, 255, 255, 0.48)",
      700: "rgba(255, 255, 255, 0.64)",
      800: "rgba(255, 255, 255, 0.80)",
      900: "rgba(255, 255, 255, 0.92)",
    },
    blackAlpha: {
      50: "rgba(0, 0, 0, 0.04)",
      100: "rgba(0, 0, 0, 0.06)",
      200: "rgba(0, 0, 0, 0.08)",
      300: "rgba(0, 0, 0, 0.16)",
      400: "rgba(0, 0, 0, 0.24)",
      500: "rgba(0, 0, 0, 0.36)",
      600: "rgba(0, 0, 0, 0.48)",
      700: "rgba(0, 0, 0, 0.64)",
      800: "rgba(0, 0, 0, 0.80)",
      900: "rgba(0, 0, 0, 0.92)",
    },
    gray: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#718096",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },
    red: {
      50: "#FFF5F5",
      100: "#FED7D7",
      200: "#FEB2B2",
      300: "#FC8181",
      400: "#F56565",
      500: "#E53E3E",
      600: "#C53030",
      700: "#9B2C2C",
      800: "#822727",
      900: "#63171B",
    },
    orange: {
      50: "#FFFAF0",
      100: "#FEEBC8",
      200: "#FBD38D",
      300: "#F6AD55",
      400: "#ED8936",
      500: "#DD6B20",
      600: "#C05621",
      700: "#9C4221",
      800: "#7B341E",
      900: "#652B19",
    },
    yellow: {
      50: "#FFFFF0",
      100: "#FEFCBF",
      200: "#FAF089",
      300: "#F6E05E",
      400: "#ECC94B",
      500: "#D69E2E",
      600: "#B7791F",
      700: "#975A16",
      800: "#744210",
      900: "#5F370E",
    },
    green: {
      50: "#F0FFF4",
      100: "#C6F6D5",
      200: "#9AE6B4",
      300: "#68D391",
      400: "#48BB78",
      500: "#38A169",
      600: "#2F855A",
      700: "#276749",
      800: "#22543D",
      900: "#1C4532",
    },
    teal: {
      50: "#E6FFFA",
      100: "#B2F5EA",
      200: "#81E6D9",
      300: "#4FD1C5",
      400: "#38B2AC",
      500: "#319795",
      600: "#2C7A7B",
      700: "#285E61",
      800: "#234E52",
      900: "#1D4044",
    },
    blue: {
      50: "#ebf8ff",
      100: "#bee3f8",
      200: "#90cdf4",
      300: "#63b3ed",
      400: "#4299e1",
      500: "#3182ce",
      600: "#2b6cb0",
      700: "#2c5282",
      800: "#2a4365",
      900: "#1A365D",
    },
    cyan: {
      50: "#EDFDFD",
      100: "#C4F1F9",
      200: "#9DECF9",
      300: "#76E4F7",
      400: "#0BC5EA",
      500: "#00B5D8",
      600: "#00A3C4",
      700: "#0987A0",
      800: "#086F83",
      900: "#065666",
    },
    purple: {
      50: "#FAF5FF",
      100: "#E9D8FD",
      200: "#D6BCFA",
      300: "#B794F4",
      400: "#9F7AEA",
      500: "#805AD5",
      600: "#6B46C1",
      700: "#553C9A",
      800: "#44337A",
      900: "#322659",
    },
    pink: {
      50: "#FFF5F7",
      100: "#FED7E2",
      200: "#FBB6CE",
      300: "#F687B3",
      400: "#ED64A6",
      500: "#D53F8C",
      600: "#B83280",
      700: "#97266D",
      800: "#702459",
      900: "#521B41",
    },
    linkedin: {
      50: "#E8F4F9",
      100: "#CFEDFB",
      200: "#9BDAF3",
      300: "#68C7EC",
      400: "#34B3E4",
      500: "#00A0DC",
      600: "#008CC9",
      700: "#0077B5",
      800: "#005E93",
      900: "#004471",
    },
    facebook: {
      50: "#E8F4F9",
      100: "#D9DEE9",
      200: "#B7C2DA",
      300: "#6482C0",
      400: "#4267B2",
      500: "#385898",
      600: "#314E89",
      700: "#29487D",
      800: "#223B67",
      900: "#1E355B",
    },
    messenger: {
      50: "#D0E6FF",
      100: "#B9DAFF",
      200: "#A2CDFF",
      300: "#7AB8FF",
      400: "#2E90FF",
      500: "#0078FF",
      600: "#0063D1",
      700: "#0052AC",
      800: "#003C7E",
      900: "#002C5C",
    },
    whatsapp: {
      50: "#dffeec",
      100: "#b9f5d0",
      200: "#90edb3",
      300: "#65e495",
      400: "#3cdd78",
      500: "#22c35e",
      600: "#179848",
      700: "#0c6c33",
      800: "#01421c",
      900: "#001803",
    },
    twitter: {
      50: "#E5F4FD",
      100: "#C8E9FB",
      200: "#A8DCFA",
      300: "#83CDF7",
      400: "#57BBF5",
      500: "#1DA1F2",
      600: "#1A94DA",
      700: "#1681BF",
      800: "#136B9E",
      900: "#0D4D71",
    },
    telegram: {
      50: "#E3F2F9",
      100: "#C5E4F3",
      200: "#A2D4EC",
      300: "#7AC1E4",
      400: "#47A9DA",
      500: "#0088CC",
      600: "#007AB8",
      700: "#006BA1",
      800: "#005885",
      900: "#003F5E",
    },
  },
  u5 = {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  c5 = {
    xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
    none: "none",
    "dark-lg":
      "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px",
  },
  f5 = {
    common:
      "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
    colors: "background-color, border-color, color, fill, stroke",
    dimensions: "width, height",
    position: "left, right, top, bottom",
    background: "background-color, background-image, background-position",
  },
  d5 = {
    "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
    "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  p5 = {
    "ultra-fast": "50ms",
    faster: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "400ms",
    "ultra-slow": "500ms",
  },
  m5 = { property: f5, easing: d5, duration: p5 },
  h5 = {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1e3,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  v5 = {
    none: 0,
    sm: "4px",
    base: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px",
  },
  g5 = ce(
    { breakpoints: l5, zIndices: h5, radii: u5, blur: v5, colors: s5 },
    mv,
    { sizes: iv, shadows: c5, space: av, borders: i5, transition: m5 }
  ),
  y5 = {
    global: function (t) {
      return {
        body: {
          fontFamily: "body",
          color: _("gray.800", "whiteAlpha.900")(t),
          bg: _("white", "gray.800")(t),
          transitionProperty: "background-color",
          transitionDuration: "normal",
          lineHeight: "base",
        },
        "*::placeholder": { color: _("gray.400", "whiteAlpha.400")(t) },
        "*, *::before, &::after": {
          borderColor: _("gray.200", "whiteAlpha.300")(t),
          wordWrap: "break-word",
        },
      };
    },
  },
  b5 = y5,
  S5 = [
    "borders",
    "breakpoints",
    "colors",
    "components",
    "config",
    "direction",
    "fonts",
    "fontSizes",
    "fontWeights",
    "letterSpacings",
    "lineHeights",
    "radii",
    "shadows",
    "sizes",
    "space",
    "styles",
    "transition",
    "zIndices",
  ];
function x5(e) {
  return je(e)
    ? S5.every(function (t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      })
    : !1;
}
var w5 = "ltr",
  k5 = {
    useSystemColorMode: !1,
    initialColorMode: "light",
    cssVarPrefix: "chakra",
  },
  gv = ce({ direction: w5 }, g5, { components: a5, styles: b5, config: k5 }),
  yv = {
    border: "0px",
    clip: "rect(0px, 0px, 0px, 0px)",
    height: "1px",
    width: "1px",
    margin: "-1px",
    padding: "0px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    position: "absolute",
  },
  E5 = be("span", { baseStyle: yv });
be("input", { baseStyle: yv });
function ll() {
  return (
    (ll =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    ll.apply(this, arguments)
  );
}
function _5(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    o,
    a;
  for (a = 0; a < n.length; a++)
    (o = n[a]), !(t.indexOf(o) >= 0) && (r[o] = e[o]);
  return r;
}
var C5 = ["label", "thickness", "speed", "emptyColor", "className"],
  T5 = M0({
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  }),
  P5 = Lt(function (e, t) {
    var r = Qn("Spinner", e),
      n = Xn(e),
      o = n.label,
      a = o === void 0 ? "Loading..." : o,
      i = n.thickness,
      l = i === void 0 ? "2px" : i,
      s = n.speed,
      u = s === void 0 ? "0.45s" : s,
      p = n.emptyColor,
      g = p === void 0 ? "transparent" : p,
      v = n.className,
      m = _5(n, C5),
      y = $r("chakra-spinner", v),
      w = ll(
        {
          display: "inline-block",
          borderColor: "currentColor",
          borderStyle: "solid",
          borderRadius: "99999px",
          borderWidth: l,
          borderBottomColor: g,
          borderLeftColor: g,
          animation: T5 + " " + u + " linear infinite",
        },
        r
      );
    return C.exports.createElement(
      be.div,
      ll({ ref: t, __css: w, className: y }, m),
      a && C.exports.createElement(E5, null, a)
    );
  });
function wf(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    o,
    a;
  for (a = 0; a < n.length; a++)
    (o = n[a]), !(t.indexOf(o) >= 0) && (r[o] = e[o]);
  return r;
}
function Sr() {
  return (
    (Sr =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    Sr.apply(this, arguments)
  );
}
var $5 = xa({ strict: !1, name: "ButtonGroupContext" }),
  R5 = $5[1],
  A5 = ["label", "placement", "spacing", "children", "className", "__css"],
  om = function (t) {
    var r = t.label,
      n = t.placement,
      o = t.spacing,
      a = o === void 0 ? "0.5rem" : o,
      i = t.children,
      l =
        i === void 0
          ? C.exports.createElement(P5, {
              color: "currentColor",
              width: "1em",
              height: "1em",
            })
          : i,
      s = t.className,
      u = t.__css,
      p = wf(t, A5),
      g = $r("chakra-button__spinner", s),
      v = n === "start" ? "marginEnd" : "marginStart",
      m = C.exports.useMemo(
        function () {
          var y;
          return Sr(
            ((y = {
              display: "flex",
              alignItems: "center",
              position: r ? "relative" : "absolute",
            }),
            (y[v] = r ? a : 0),
            (y.fontSize = "1em"),
            (y.lineHeight = "normal"),
            y),
            u
          );
        },
        [u, r, v, a]
      );
    return C.exports.createElement(
      be.div,
      Sr({ className: g }, p, { __css: m }),
      l
    );
  },
  z5 = ["children", "className"],
  am = function (t) {
    var r = t.children,
      n = t.className,
      o = wf(t, z5),
      a = C.exports.isValidElement(r)
        ? C.exports.cloneElement(r, { "aria-hidden": !0, focusable: !1 })
        : r,
      i = $r("chakra-button__icon", n);
    return C.exports.createElement(
      be.span,
      Sr({ display: "inline-flex", alignSelf: "center", flexShrink: 0 }, o, {
        className: i,
      }),
      a
    );
  };
function I5(e) {
  var t = C.exports.useState(!e),
    r = t[0],
    n = t[1],
    o = C.exports.useCallback(function (i) {
      !i || n(i.tagName === "BUTTON");
    }, []),
    a = r ? "button" : void 0;
  return { ref: o, type: a };
}
var M5 = [
    "isDisabled",
    "isLoading",
    "isActive",
    "isFullWidth",
    "children",
    "leftIcon",
    "rightIcon",
    "loadingText",
    "iconSpacing",
    "type",
    "spinner",
    "spinnerPlacement",
    "className",
    "as",
  ],
  ET = Lt(function (e, t) {
    var r = R5(),
      n = Qn("Button", Sr({}, r, e)),
      o = Xn(e),
      a = o.isDisabled,
      i = a === void 0 ? (r == null ? void 0 : r.isDisabled) : a,
      l = o.isLoading,
      s = o.isActive,
      u = o.isFullWidth,
      p = o.children,
      g = o.leftIcon,
      v = o.rightIcon,
      m = o.loadingText,
      y = o.iconSpacing,
      w = y === void 0 ? "0.5rem" : y,
      h = o.type,
      c = o.spinner,
      d = o.spinnerPlacement,
      x = d === void 0 ? "start" : d,
      k = o.className,
      $ = o.as,
      T = wf(o, M5),
      P = C.exports.useMemo(
        function () {
          var G,
            Q = ot({}, (G = n == null ? void 0 : n._focus) != null ? G : {}, {
              zIndex: 1,
            });
          return Sr(
            {
              display: "inline-flex",
              appearance: "none",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              position: "relative",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
              outline: "none",
              width: u ? "100%" : "auto",
            },
            n,
            !!r && { _focus: Q }
          );
        },
        [n, r, u]
      ),
      O = I5($),
      A = O.ref,
      L = O.type,
      ve = { rightIcon: v, leftIcon: g, iconSpacing: w, children: p };
    return C.exports.createElement(
      be.button,
      Sr(
        {
          disabled: i || l,
          ref: BS(t, A),
          as: $,
          type: h != null ? h : L,
          "data-active": Tp(s),
          "data-loading": Tp(l),
          __css: P,
          className: $r("chakra-button", k),
        },
        T
      ),
      l &&
        x === "start" &&
        C.exports.createElement(
          om,
          {
            className: "chakra-button__spinner--start",
            label: m,
            placement: "start",
            spacing: w,
          },
          c
        ),
      l
        ? m ||
            C.exports.createElement(
              be.span,
              { opacity: 0 },
              C.exports.createElement(im, ve)
            )
        : C.exports.createElement(im, ve),
      l &&
        x === "end" &&
        C.exports.createElement(
          om,
          {
            className: "chakra-button__spinner--end",
            label: m,
            placement: "end",
            spacing: w,
          },
          c
        )
    );
  });
function im(e) {
  var t = e.leftIcon,
    r = e.rightIcon,
    n = e.children,
    o = e.iconSpacing;
  return C.exports.createElement(
    C.exports.Fragment,
    null,
    t && C.exports.createElement(am, { marginEnd: o }, t),
    n,
    r && C.exports.createElement(am, { marginStart: o }, r)
  );
}
function We() {
  return (
    (We =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    We.apply(this, arguments)
  );
}
function qn(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    o,
    a;
  for (a = 0; a < n.length; a++)
    (o = n[a]), !(t.indexOf(o) >= 0) && (r[o] = e[o]);
  return r;
}
var _T = be("div");
be("div", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
var O5 = ["className", "centerContent"],
  CT = Lt(function (e, t) {
    var r = Xn(e),
      n = r.className,
      o = r.centerContent,
      a = qn(r, O5),
      i = Qn("Container", e);
    return C.exports.createElement(
      be.div,
      We({ ref: t, className: $r("chakra-container", n) }, a, {
        __css: We(
          {},
          i,
          o && {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }
        ),
      })
    );
  }),
  B5 = ["direction", "align", "justify", "wrap", "basis", "grow", "shrink"],
  TT = Lt(function (e, t) {
    var r = e.direction,
      n = e.align,
      o = e.justify,
      a = e.wrap,
      i = e.basis,
      l = e.grow,
      s = e.shrink,
      u = qn(e, B5),
      p = {
        display: "flex",
        flexDirection: r,
        alignItems: n,
        justifyContent: o,
        flexWrap: a,
        flexBasis: i,
        flexGrow: l,
        flexShrink: s,
      };
    return C.exports.createElement(be.div, We({ ref: t, __css: p }, u));
  }),
  F5 = ["className"],
  PT = Lt(function (e, t) {
    var r = Qn("Heading", e),
      n = Xn(e);
    n.className;
    var o = qn(n, F5);
    return C.exports.createElement(
      be.h2,
      We({ ref: t, className: $r("chakra-heading", e.className) }, o, {
        __css: r,
      })
    );
  }),
  N5 = ["children", "styleType", "stylePosition", "spacing"],
  bv = xa({
    name: "StylesContext",
    errorMessage:
      "useStyles: `styles` is undefined. Seems you forgot to wrap the components in a `<*List />` ",
  }),
  L5 = bv[0],
  j5 = bv[1],
  $T = Lt(function (e, t) {
    var r,
      n = Ew("List", e),
      o = Xn(e),
      a = o.children,
      i = o.styleType,
      l = i === void 0 ? "none" : i,
      s = o.stylePosition,
      u = o.spacing,
      p = qn(o, N5),
      g = D0(a),
      v = "& > *:not(style) ~ *:not(style)",
      m = u ? ((r = {}), (r[v] = { mt: u }), r) : {};
    return C.exports.createElement(
      L5,
      { value: n },
      C.exports.createElement(
        be.ul,
        We(
          {
            ref: t,
            listStyleType: l,
            listStylePosition: s,
            role: "list",
            __css: We({}, n.container, m),
          },
          p
        ),
        g
      )
    );
  }),
  RT = Lt(function (e, t) {
    var r = j5();
    return C.exports.createElement(be.li, We({ ref: t }, e, { __css: r.item }));
  }),
  AT = be("div", {
    baseStyle: { flex: 1, justifySelf: "stretch", alignSelf: "stretch" },
  }),
  qu = "& > *:not(style) ~ *:not(style)";
function D5(e) {
  var t,
    r = e.spacing,
    n = e.direction,
    o = {
      column: { marginTop: r, marginEnd: 0, marginBottom: 0, marginStart: 0 },
      row: { marginTop: 0, marginEnd: 0, marginBottom: 0, marginStart: r },
      "column-reverse": {
        marginTop: 0,
        marginEnd: 0,
        marginBottom: r,
        marginStart: 0,
      },
      "row-reverse": {
        marginTop: 0,
        marginEnd: r,
        marginBottom: 0,
        marginStart: 0,
      },
    };
  return (
    (t = { flexDirection: n }),
    (t[qu] = j0(n, function (a) {
      return o[a];
    })),
    t
  );
}
function W5(e) {
  var t = e.spacing,
    r = e.direction,
    n = {
      column: { my: t, mx: 0, borderLeftWidth: 0, borderBottomWidth: "1px" },
      "column-reverse": {
        my: t,
        mx: 0,
        borderLeftWidth: 0,
        borderBottomWidth: "1px",
      },
      row: { mx: t, my: 0, borderLeftWidth: "1px", borderBottomWidth: 0 },
      "row-reverse": {
        mx: t,
        my: 0,
        borderLeftWidth: "1px",
        borderBottomWidth: 0,
      },
    };
  return {
    "&": j0(r, function (o) {
      return n[o];
    }),
  };
}
var H5 = [
    "isInline",
    "direction",
    "align",
    "justify",
    "spacing",
    "wrap",
    "children",
    "divider",
    "className",
    "shouldWrapChildren",
  ],
  V5 = function (t) {
    return C.exports.createElement(
      be.div,
      We({ className: "chakra-stack__item" }, t, {
        __css: We(
          { display: "inline-block", flex: "0 0 auto", minWidth: 0 },
          t.__css
        ),
      })
    );
  },
  U5 = Lt(function (e, t) {
    var r,
      n = e.isInline,
      o = e.direction,
      a = e.align,
      i = e.justify,
      l = e.spacing,
      s = l === void 0 ? "0.5rem" : l,
      u = e.wrap,
      p = e.children,
      g = e.divider,
      v = e.className,
      m = e.shouldWrapChildren,
      y = qn(e, H5),
      w = n ? "row" : o != null ? o : "column",
      h = C.exports.useMemo(
        function () {
          return D5({ direction: w, spacing: s });
        },
        [w, s]
      ),
      c = C.exports.useMemo(
        function () {
          return W5({ spacing: s, direction: w });
        },
        [s, w]
      ),
      d = !!g,
      x = !m && !d,
      k = D0(p),
      $ = x
        ? k
        : k.map(function (P, O) {
            var A = typeof P.key != "undefined" ? P.key : O,
              L = O + 1 === k.length,
              ve = C.exports.createElement(V5, { key: A }, P),
              G = m ? ve : P;
            if (!d) return G;
            var Q = C.exports.cloneElement(g, { __css: c }),
              Je = L ? null : Q;
            return C.exports.createElement(
              C.exports.Fragment,
              { key: A },
              G,
              Je
            );
          }),
      T = $r("chakra-stack", v);
    return C.exports.createElement(
      be.div,
      We(
        {
          ref: t,
          display: "flex",
          alignItems: a,
          justifyContent: i,
          flexDirection: h.flexDirection,
          flexWrap: u,
          className: T,
          __css: d ? {} : ((r = {}), (r[qu] = h[qu]), r),
        },
        y
      ),
      $
    );
  }),
  zT = Lt(function (e, t) {
    return C.exports.createElement(
      U5,
      We({ align: "center" }, e, { direction: "column", ref: t })
    );
  }),
  G5 = ["className", "align", "decoration", "casing"],
  IT = Lt(function (e, t) {
    var r = Qn("Text", e),
      n = Xn(e);
    n.className, n.align, n.decoration, n.casing;
    var o = qn(n, G5),
      a = cf({
        textAlign: e.align,
        textDecoration: e.decoration,
        textTransform: e.casing,
      });
    return C.exports.createElement(
      be.p,
      We({ ref: t, className: $r("chakra-text", e.className) }, a, o, {
        __css: r,
      })
    );
  }),
  Y5 = Cw;
Y5.defaultProps = { theme: gv };
function X5() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  var n = [].concat(t),
    o = t[t.length - 1];
  return (
    x5(o) && n.length > 1 ? (n = n.slice(0, n.length - 1)) : (o = gv),
    _S.apply(
      void 0,
      n.map(function (a) {
        return function (i) {
          return Dr(a) ? a(i) : Q5(i, a);
        };
      })
    )(o)
  );
}
function Q5() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return ot.apply(void 0, [{}].concat(t, [Sv]));
}
function Sv(e, t, r, n) {
  if ((Dr(e) || Dr(t)) && Object.prototype.hasOwnProperty.call(n, r))
    return function () {
      var o = Dr(e) ? e.apply(void 0, arguments) : e,
        a = Dr(t) ? t.apply(void 0, arguments) : t;
      return ot({}, o, a, Sv);
    };
}
const xv = xt(),
  MT = Dg(xv, "100"),
  OT = X5({ config: { useSystemColorMode: !1, initialColorMode: "dark" } }),
  q5 = jg(
    (e) =>
      new Promise((t) => {
        chrome.storage.sync.get(e, (r) => t(r));
      })
  );
Us({
  clock: q5.doneData,
  fn: ({ maximumAutoConnectionsPerSession: e }) => e,
  target: xv,
});
export {
  AS as $,
  kT as A,
  _T as B,
  Y5 as C,
  Xn as D,
  Ew as E,
  TT as F,
  wT as G,
  PT as H,
  Qn as I,
  gT as J,
  hT as K,
  $T as L,
  pT as M,
  Tp as N,
  aT as O,
  vf as P,
  dT as Q,
  Qr as R,
  Dg as S,
  IT as T,
  uT as U,
  zT as V,
  cT as W,
  lT as X,
  sT as Y,
  vT as Z,
  yT as _,
  xt as a,
  oT as a0,
  tT as a1,
  iT as a2,
  mT as a3,
  mf as a4,
  nT as a5,
  rT as a6,
  ST as a7,
  bT as a8,
  Sa as a9,
  gv as aa,
  ua as ab,
  ff as ac,
  dw as ad,
  Y0 as ae,
  xT as af,
  fS as ag,
  xv as ah,
  be as b,
  ey as c,
  fT as d,
  eT as e,
  J5 as f,
  MT as g,
  ET as h,
  Dr as i,
  RT as j,
  M0 as k,
  OT as l,
  jg as m,
  AT as n,
  CT as o,
  hy as p,
  Z5 as q,
  C as r,
  sm as s,
  q5 as t,
  Vr as u,
  Us as v,
  K5 as w,
  Lt as x,
  $r as y,
  xa as z,
};
