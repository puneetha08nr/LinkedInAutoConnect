function e(e2, t2, r, a2) {
  ((V(e2) || J(e2)) && ("family" in e2 || "graphite" in e2)) ||
    B(`${t2}: expect ${r} to be a unit (store, event or effect)${a2}`);
}
function t(t2, r, a2) {
  if (Array.isArray(t2))
    for (let n2 = 0; n2 < t2.length; n2++)
      e(t2[n2], r, `${n2} item of ${a2}`, "");
  else e(t2, r, a2, " or array of units");
}
function a({
  node: e2 = [],
  from: t2,
  source: r,
  parent: a2 = t2 || r,
  to: n2,
  target: o2,
  child: s = n2 || o2,
  scope: l2 = {},
  meta: i2 = {},
  family: f2 = { type: "regular" },
  regional: c2,
} = {}) {
  let u2 = Fe(a2),
    p2 = Fe(f2.links),
    d2 = Fe(f2.owners),
    m2 = [],
    h2 = {};
  for (let t3 = 0; t3 < e2.length; t3++) {
    let r2 = e2[t3];
    r2 && (m2.push(r2), Re(r2, h2));
  }
  let g = {
    id: Y(),
    seq: m2,
    next: Fe(s),
    meta: i2,
    scope: l2,
    family: { type: f2.type || "crosslink", links: p2, owners: d2 },
    reg: h2,
  };
  for (let e3 = 0; e3 < p2.length; e3++) ye(p2[e3]).push(g);
  for (let e3 = 0; e3 < d2.length; e3++) ke(d2[e3]).push(g);
  for (let e3 = 0; e3 < u2.length; e3++) u2[e3].next.push(g);
  return c2 && Ce && Ae(Se(Ce), [g]), g;
}
function n(e2, t2, r) {
  let a2 = Be,
    n2 = null,
    o2 = He;
  if (
    (e2.target &&
      ((t2 = e2.params),
      (r = e2.defer),
      (a2 = "page" in e2 ? e2.page : a2),
      e2.stack && (n2 = e2.stack),
      (o2 = Ne(e2) || o2),
      (e2 = e2.target)),
    o2 && He && o2 !== He && (He = null),
    Array.isArray(e2))
  )
    for (let r2 = 0; r2 < e2.length; r2++)
      Ee("pure", a2, ge(e2[r2]), n2, t2[r2], o2);
  else Ee("pure", a2, ge(e2), n2, t2, o2);
  if (r && !Ge) return;
  let s,
    l2,
    i2,
    f2,
    c2,
    u2,
    p2 = { isRoot: Ge, currentPage: Be, forkPage: He, isWatch: Ue };
  Ge = 0;
  e: for (; (f2 = $e()); ) {
    let { idx: e3, stack: t3, type: r2 } = f2;
    (i2 = t3.node), (Be = c2 = t3.page), (He = Ne(t3)), (u2 = (c2 || i2).reg);
    let a3 = { fail: 0, scope: i2.scope };
    s = l2 = 0;
    for (let n3 = e3; n3 < i2.seq.length && !s; n3++) {
      let o3 = i2.seq[n3],
        f3 = o3.data;
      switch (o3.type) {
        case "barrier": {
          let a4 = f3.barrierID;
          c2 && (a4 = `${c2.fullID}_${a4}`);
          let o4 = f3.priority;
          if (n3 !== e3 || r2 !== o4) {
            Te.has(a4) || (Te.add(a4), ze(n3, t3, o4, a4));
            continue e;
          }
          Te.delete(a4);
          break;
        }
        case "mov": {
          let e4;
          switch (f3.from) {
            case "stack":
              e4 = Se(t3);
              break;
            case "a":
            case "b":
              e4 = t3[f3.from];
              break;
            case "value":
              e4 = f3.store;
              break;
            case I:
              u2[f3.store.id] ||
                ((t3.page = c2 = Ke(c2, f3.store.id)),
                (u2 = c2 ? c2.reg : i2.reg)),
                (e4 = pe(u2[f3.store.id]));
          }
          switch (f3.to) {
            case "stack":
              t3.value = e4;
              break;
            case "a":
            case "b":
              t3[f3.to] = e4;
              break;
            case I:
              Le(c2, i2, f3.target.id).current = e4;
          }
          break;
        }
        case "check":
          switch (f3.type) {
            case "defined":
              l2 = void 0 === Se(t3);
              break;
            case "changed":
              l2 = Se(t3) === pe(Le(c2, i2, f3.store.id));
          }
          break;
        case "filter":
          l2 = !Qe(a3, f3, t3);
          break;
        case "run":
          if (n3 !== e3 || "effect" !== r2) {
            ze(n3, t3, "effect");
            continue e;
          }
        case "compute":
          (Ue = "watch" === i2.meta.op),
            (t3.value = Qe(a3, f3, t3)),
            (Ue = p2.isWatch);
      }
      s = a3.fail || l2;
    }
    if (!s)
      for (let e4 = 0; e4 < i2.next.length; e4++)
        Ee("child", c2, i2.next[e4], t3, Se(t3), Ne(t3));
  }
  (Ge = p2.isRoot), (Be = p2.currentPage), (He = Ne(p2));
}
function o(e2, t2 = "combine") {
  let r = t2 + "(",
    a2 = "",
    n2 = 0;
  for (let t3 in e2) {
    let o2 = e2[t3];
    if (
      (null != o2 &&
        ((r += a2), (r += E(o2) ? o2.compositeName.fullName : o2.toString())),
      (n2 += 1),
      25 === n2)
    )
      break;
    a2 = ", ";
  }
  return (r += ")"), r;
}
function l(e2, t2) {
  let r,
    a2,
    n2,
    o2 = e2;
  return (
    t2
      ? ((n2 = t2.compositeName),
        0 === e2.length
          ? ((r = n2.path), (a2 = n2.fullName))
          : ((r = n2.path.concat([e2])),
            (a2 = 0 === n2.fullName.length ? e2 : n2.fullName + "/" + e2)))
      : ((r = 0 === e2.length ? [] : [e2]), (a2 = e2)),
    { shortName: o2, fullName: a2, path: r }
  );
}
function i(e2, t2) {
  for (let r in e2) t2(e2[r], r);
}
function f(e2, t2) {
  e2.forEach(t2);
}
function c(e2, t2) {
  let r = (e3, ...t3) =>
    Be
      ? ((e4, t4, r2, a2) => {
          let n2 = Be,
            o3 = null;
          if (t4) for (o3 = Be; o3 && o3.template !== t4; ) o3 = xe(o3);
          Je(o3);
          let s = e4.create(r2, a2);
          return Je(n2), s;
        })(r, o2, e3, t3)
      : r.create(e3, t3);
  (r.graphite = a({ meta: ht("event", r, t2, e2), regional: 1 })),
    (r.create = (e3) => (n(He ? He.find(r) : r, e3), e3)),
    (r.watch = Z(ut, r)),
    (r.map = (e3) => {
      let t3, a2;
      V(e3) && ((t3 = e3), (a2 = e3.name), (e3 = e3.fn));
      let n2 = c(Ye(r, a2), t3);
      return yt(r, n2, $, e3), n2;
    }),
    (r.filter = (e3) => kt(r, "filter", e3.fn ? e3 : e3.fn, [le({ fn: he })])),
    (r.filterMap = (e3) =>
      kt(r, "filterMap", e3, [se({ fn: he }), oe.defined()])),
    (r.prepend = (e3) => {
      let t3 = c("* \u2192 " + r.shortName, { parent: xe(r) }),
        a2 = je();
      return (
        a2 && ge(t3).seq.push(a2.upward),
        yt(t3, r, "prepend", e3),
        mt(r, t3),
        t3
      );
    });
  let o2 = je();
  return r;
}
function u(e2, r) {
  function o2(e3, t2) {
    p2.off(e3), qe(p2).set(e3, lt(bt(e3, p2, "on", 1, t2, m2)));
  }
  let s = ue(e2),
    l2 = ue(e2),
    i2 = gt("updates"),
    f2 = je();
  (s.after = [{ type: "copy", to: l2 }]), f2 && f2.plain.push(s, l2);
  let c2 = s.id,
    p2 = {
      subscribers: /* @__PURE__ */ new Map(),
      updates: i2,
      defaultState: e2,
      stateRef: s,
      getState() {
        let e3,
          t2 = s;
        if (Be) {
          let t3 = Be;
          for (; t3 && !t3.reg[c2]; ) t3 = xe(t3);
          t3 && (e3 = t3);
        }
        return (
          !e3 && He && He.reg[c2] && (e3 = He), e3 && (t2 = e3.reg[c2]), pe(t2)
        );
      },
      setState(e3) {
        let t2;
        He && (t2 = He.nodeMap[ge(p2).id]),
          t2 || (t2 = p2),
          n({ target: t2, params: e3, defer: 1 });
      },
      reset(...e3) {
        for (let t2 of e3) p2.on(t2, () => p2.defaultState);
        return p2;
      },
      on(e3, r2) {
        if ((t(e3, ".on", "first argument"), Array.isArray(e3)))
          for (let t2 of e3) o2(t2, r2);
        else o2(e3, r2);
        return p2;
      },
      off(e3) {
        let t2 = qe(p2).get(e3);
        return t2 && (t2(), qe(p2).delete(e3)), p2;
      },
      map(e3, t2) {
        let r2, a2, n2;
        V(e3) &&
          ((r2 = e3), (a2 = e3.name), (t2 = e3.firstState), (e3 = e3.fn));
        let o3 = p2.getState();
        void 0 !== o3 && (n2 = e3(o3, t2));
        let i3 = u(n2, { name: Ye(p2, a2), config: r2, strict: 0 });
        bt(p2, i3, $, 0, e3);
        return (be(i3).before = [{ type: $, fn: e3, from: s }]), i3;
      },
      watch(e3, t2) {
        if (!t2 || !E(e3)) {
          let t3 = ut(p2, e3);
          return e3(p2.getState()), t3;
        }
        return (
          J(t2) || B("second argument should be a function"),
          e3.watch((e4) => t2(p2.getState(), e4))
        );
      },
    },
    d2 = ht(I, p2, r),
    m2 = p2.defaultConfig.updateFilter;
  return (
    (p2.graphite = a({
      scope: { state: s },
      node: [
        oe.defined(),
        oe.changed({ store: l2 }),
        m2 && ne({ store: l2, to: "a" }),
        m2 && le({ fn: (e3, t2, { a: r2 }) => m2(e3, r2) }),
        fe({ store: s }),
        fe({ store: l2 }),
      ],
      child: i2,
      meta: d2,
      regional: 1,
    })),
    dt &&
      void 0 === e2 &&
      B("current state can't be undefined, use null instead"),
    Ae(p2, [i2]),
    p2
  );
}
function p(...e2) {
  let t2, r, a2;
  Ze(e2[0], (t3, r2) => {
    (a2 = t3), (e2 = r2);
  });
  let n2,
    o2,
    s = e2[e2.length - 1];
  if ((J(s) ? ((r = e2.slice(0, -1)), (t2 = s)) : (r = e2), 1 === r.length)) {
    let e3 = r[0];
    W(e3) || ((n2 = e3), (o2 = 1));
  }
  return (
    o2 || ((n2 = r), t2 && (t2 = vt(t2))),
    V(n2) || B("shape should be an object"),
    wt(Array.isArray(n2), n2, a2, t2)
  );
}
function d() {
  let e2 = {};
  return (
    (e2.req = new Promise((t2, r) => {
      (e2.rs = t2), (e2.rj = r);
    })),
    e2.req.catch(() => {}),
    e2
  );
}
function m(e2, t2) {
  let r = c(e2, t2),
    o2 =
      r.defaultConfig.handler || (() => B(`no handler used in ${r.getType()}`)),
    s = ge(r);
  (s.meta.onCopy = ["runner"]),
    (s.meta.unit = r.kind = "effect"),
    (r.use = (e3) => (
      J(e3) || B(".use argument should be a function"), (o2 = e3), r
    ));
  let l2 = (r.finally = gt("finally")),
    i2 = (r.done = l2.filterMap({
      named: "done",
      fn({ status: e3, params: t3, result: r2 }) {
        if ("done" === e3) return { params: t3, result: r2 };
      },
    })),
    f2 = (r.fail = l2.filterMap({
      named: "fail",
      fn({ status: e3, params: t3, error: r2 }) {
        if ("fail" === e3) return { params: t3, error: r2 };
      },
    })),
    p2 = (r.doneData = i2.map({
      named: "doneData",
      fn: ({ result: e3 }) => e3,
    })),
    m2 = (r.failData = f2.map({
      named: "failData",
      fn: ({ error: e3 }) => e3,
    })),
    h2 = a({
      scope: { getHandler: (r.use.getCurrent = () => o2), finally: l2 },
      node: [
        ie({
          fn({ params: e3, req: t3 }, { finally: r2, getHandler: a2 }, n2) {
            let o3,
              s2 = St({ params: e3, req: t3, ok: 1, anyway: r2, stack: n2 }),
              l3 = St({ params: e3, req: t3, ok: 0, anyway: r2, stack: n2 });
            try {
              o3 = a2()(e3);
            } catch (e4) {
              return void l3(e4);
            }
            V(o3) && J(o3.then) ? o3.then(s2, l3) : s2(o3);
          },
        }),
      ],
      meta: { op: "fx", fx: "runner", onCopy: ["finally"] },
    });
  (s.scope.runner = h2),
    s.seq.push(
      se({
        fn: (e3, t3, r2) =>
          xe(r2) ? { params: e3, req: { rs(e4) {}, rj(e4) {} } } : e3,
      }),
      ie({
        fn: (e3, { runner: t3 }, r2) => (
          n({ target: t3, params: e3, defer: 1, forkPage: Ne(r2) }), e3.params
        ),
      })
    ),
    (r.create = (e3) => {
      let t3 = d(),
        a2 = { params: e3, req: t3 };
      if (He) {
        if (!Ue) {
          let e4 = He;
          t3.req
            .finally(() => {
              Ve(e4);
            })
            .catch(() => {});
        }
        n(He.find(r), a2);
      } else n(r, a2);
      return t3.req;
    });
  let g = (r.inFlight = u(0, { named: "inFlight" })
      .on(r, (e3) => e3 + 1)
      .on(l2, (e3) => e3 - 1)),
    y = (r.pending = g.map({ fn: (e3) => e3 > 0, named: "pending" }));
  return Ae(r, [l2, i2, f2, p2, m2, y, g, h2]), r;
}
function h(e2) {
  let t2;
  Ze(e2, (r2, a3) => {
    (t2 = r2), (e2 = a3);
  });
  let { source: r, effect: a2, mapParams: o2 } = e2;
  o2 || (o2 = r ? (e3, t3) => t3 : (e3) => e3);
  let s,
    l2 = m(e2, t2),
    { runner: i2 } = ge(l2).scope,
    f2 = ({ params: e3, req: t3 }, { finally: r2, effect: a3 }, s2) => {
      let l3,
        i3 = St({ params: e3, req: t3, ok: 0, anyway: r2, stack: s2 });
      try {
        l3 = o2(e3, s2.a);
      } catch (e4) {
        return i3(e4);
      }
      n({
        target: a3,
        params: {
          params: l3,
          req: {
            rs: St({ params: e3, req: t3, ok: 1, anyway: r2, stack: s2 }),
            rj: i3,
          },
        },
        page: s2.page,
        defer: 1,
      });
    };
  if (r) {
    let e3;
    W(r) ? ((e3 = r), Ae(r, [l2])) : ((e3 = p(r)), Ae(l2, [e3]));
    let t3 = ne({ from: I, store: be(e3), to: "a" });
    (s = [ie({ fn: (e4) => e4 }), t3, se({ fn: f2 })]), Re(t3, i2.reg);
  } else s = [ie({ fn: f2 })];
  return (
    Ae(a2, [l2]),
    (i2.scope.effect = a2),
    i2.meta.onCopy.push("effect"),
    i2.seq.splice(0, 1, ...s),
    mt(a2, l2, "effect"),
    l2
  );
}
function b(e2, r) {
  let a2 = c(r || o(e2, "merge"));
  return (
    t(e2, "merge", "first argument"),
    ct({ from: e2, to: a2, meta: { op: "merge" } }),
    a2
  );
}
function v(...e2) {
  let r,
    n2,
    o2,
    s,
    [[l2, i2, d2], m2] = et(e2);
  void 0 === i2 &&
    V(l2) &&
    ((e3) => {
      let t2 = 0;
      return (
        f(Nt, (r2) => {
          r2 in e3 &&
            (null == e3[r2] && B(`sample: ${r2} should be defined`), (t2 = 1));
        }),
        t2
      );
    })(l2) &&
    ((i2 = l2.clock),
    (d2 = l2.fn),
    (s = l2.greedy),
    (r = l2.target),
    (n2 = l2.name),
    (o2 = l2.sid),
    (l2 = l2.source));
  let h2 = 1;
  void 0 === l2 &&
    (t(i2, "sample", "clock"),
    Array.isArray(i2) && (i2 = b(i2)),
    (l2 = i2),
    (h2 = 0)),
    h2 && !E(l2) && (l2 = p(l2)),
    void 0 === i2 && (i2 = l2),
    t(i2, "sample", "clock"),
    (n2 = m2 || n2 || l2.shortName);
  let g = je(),
    y = !!r;
  r ||
    (W(l2) && W(i2)
      ? (r = u(d2 ? d2(pe(be(l2)), pe(be(i2))) : pe(be(l2)), {
          name: n2,
          sid: o2,
        }))
      : ((r = c(n2)), g && ge(r).seq.push(g.loader)));
  let k = y && E(r) && ge(r).meta.nativeTemplate;
  if (W(l2)) {
    let e3 = be(l2);
    Ae(l2, [
      ft(i2, r, {
        scope: { fn: d2, targetTemplate: k },
        node: [
          g && g.loader,
          !s && ae({ priority: "sampler" }),
          ne({ store: e3, to: d2 ? "a" : "stack" }),
          d2 && se({ fn: me }),
          g && y && g.upward,
        ],
        meta: { op: "sample", sample: I },
      }),
    ]),
      g && (tt(g.plain, e3) || tt(g.closure, e3) || g.closure.push(e3));
  } else {
    let e3 = ue(0),
      t2 = ue(),
      n3 = ue();
    g && g.plain.push(e3, t2, n3),
      a({
        parent: l2,
        node: [fe({ store: t2 }), ne({ from: "value", store: 1, target: e3 })],
        family: { owners: [l2, r, i2], links: r },
        meta: { op: "sample", sample: "source" },
        regional: 1,
      }),
      Ae(l2, [
        ft(i2, r, {
          scope: { fn: d2, targetTemplate: k },
          node: [
            g && g.loader,
            fe({ store: n3 }),
            ne({ store: e3 }),
            le({ fn: (e4) => e4 }),
            !s && ae({ priority: "sampler" }),
            ne({ store: t2 }),
            ne({ store: n3, to: "a" }),
            d2 && se({ fn: de }),
            g && y && g.upward,
          ],
          meta: { op: "sample", sample: "clock" },
        }),
      ]);
  }
  return r;
}
function w(...e2) {
  let r = { op: "guard" },
    n2 = "guard",
    [[o2, s], l2] = et(e2);
  l2 && ((r.config = l2), l2.name && (n2 = l2.name)),
    s || ((s = o2), (o2 = s.source));
  let { filter: i2, greedy: f2, clock: u2, name: d2 = n2 } = s,
    m2 = s.target || c(d2, r.config),
    h2 = E(i2),
    g = 1;
  return (
    void 0 === o2 &&
      (t(u2, "guard", "clock"),
      Array.isArray(u2) && (u2 = b(u2)),
      (o2 = u2),
      (g = 0)),
    g && !E(o2) && (o2 = p(o2)),
    u2 &&
      (t(u2, "guard", "clock"),
      (o2 = v({
        source: o2,
        clock: u2,
        greedy: f2,
        fn: h2 ? null : (e3, t2) => ({ source: e3, clock: t2 }),
      }))),
    t(m2, "guard", "target"),
    h2
      ? v({
          source: i2,
          clock: o2,
          target: a({
            node: [
              le({ fn: ({ guard: e3 }) => e3 }),
              se({ fn: ({ data: e3 }) => e3 }),
            ],
            child: m2,
            meta: r,
            family: { owners: [o2, i2, m2, ...[].concat(u2 || [])], links: m2 },
            regional: 1,
          }),
          fn: (e3, t2) => ({ guard: e3, data: t2 }),
          greedy: f2,
          name: d2,
        })
      : (J(i2) || B("`filter` should be function or unit"),
        ft(o2, m2, {
          scope: { fn: i2 },
          node: u2
            ? [
                le({
                  fn: ({ source: e3, clock: t2 }, { fn: r2 }) => r2(e3, t2),
                }),
                se({ fn: ({ source: e3 }) => e3 }),
              ]
            : [le({ fn: he })],
          meta: r,
        })),
    m2
  );
}
function S(e2, t2, r) {
  if (W(e2)) return e2;
  if (E(e2)) {
    let a3,
      n2 = xe(e2);
    return (
      T(e2) &&
        (a3 = u(t2, { parent: n2, name: e2.shortName, ɔ: r }).on(
          e2,
          (e3, t3) => t3
        )),
      H(e2) &&
        (a3 = u(t2, { parent: n2, name: e2.shortName, ɔ: r }).on(
          e2.done,
          (e3, { result: t3 }) => t3
        )),
      n2 && n2.hooks.store(a3),
      a3
    );
  }
  let a2 = Array.isArray(e2) ? [] : {};
  return (
    i(e2, (e3, t3) => {
      a2[t3] = W(e3) ? e3 : u(e3, { name: t3 });
    }),
    a2
  );
}
function q(...e2) {
  let t2,
    [[r, n2], o2] = et(e2),
    s = !n2;
  s && ((t2 = r.cases), (n2 = r.match), (r = r.source));
  let l2 = W(n2),
    f2 = !E(n2) && J(n2),
    u2 = !l2 && !f2 && V(n2);
  t2 || (t2 = {}),
    s ||
      (u2 || B("match should be an object"),
      i(n2, (e3, r2) => {
        t2[r2] = c(o2);
      }),
      (t2.__ = c(o2)));
  let p2,
    d2 = je(),
    m2 = new Set([].concat(r, Object.values(t2))),
    h2 = Object.keys(l2 || f2 ? t2 : n2);
  if (l2 || f2)
    l2 && m2.add(n2),
      (p2 = [
        l2 && ae({ priority: "sampler" }),
        l2 && ne({ store: be(n2), to: "a" }),
        le({
          fn(e3, t3, r2) {
            let a2 = String(l2 ? r2.a : n2(e3));
            At(t3, tt(h2, a2) ? a2 : "__", e3, r2);
          },
        }),
      ]);
  else if (u2) {
    let e3 = ue({});
    e3.type = "shape";
    let t3,
      r2 = (e3.before = []),
      a2 = [
        ne({ store: e3, to: "a" }),
        se({
          fn(e4, { key: t4 }, { a: r3 }) {
            r3[t4] = e4;
          },
        }),
      ],
      o3 = [];
    i(n2, (n3, s2) => {
      if (E(n3)) {
        (t3 = 1), o3.push(s2), m2.add(n3);
        let l3 = ft(n3, [], { node: a2, scope: { key: s2 } });
        if (W(n3)) {
          e3.current[s2] = n3.getState();
          let t4 = be(n3);
          r2.push({ type: "field", field: s2, from: t4 }),
            d2 && (tt(d2.plain, t4) || l3.seq.unshift(d2.loader));
        }
      }
    }),
      t3 && d2 && d2.plain.push(e3),
      (p2 = [
        t3 && ae({ priority: "sampler" }),
        t3 && ne({ store: e3, to: "a" }),
        le({
          fn(e4, t4, r3) {
            for (let a3 = 0; a3 < h2.length; a3++) {
              let s2 = h2[a3];
              if (tt(o3, s2) ? r3.a[s2] : n2[s2](e4))
                return void At(t4, s2, e4, r3);
            }
            At(t4, "__", e4, r3);
          },
        }),
      ]);
  } else B("expect match to be unit, function or object");
  if (
    (a({
      meta: { onCopy: Object.keys(t2), op: "split" },
      parent: r,
      scope: t2,
      node: p2,
      family: { type: "crosslink", owners: Array.from(m2) },
      regional: 1,
    }),
    !s)
  )
    return t2;
}
let _ = ("undefined" != typeof Symbol && Symbol.observable) || "@@observable",
  I = "store",
  M = "effect",
  $ = "map",
  E = (e2) => (J(e2) || V(e2)) && "kind" in e2;
const z = (e2) => (t2) => E(t2) && t2.kind === e2;
let W = z(I),
  T = z("event"),
  H = z(M),
  G = z("domain");
let B = (e2) => {
    throw Error(e2);
  },
  V = (e2) => "object" == typeof e2 && null !== e2,
  J = (e2) => "function" == typeof e2,
  K = (e2) => {
    V(e2) || J(e2) || B("expect first argument be an object");
  };
const L = () => {
  let e2 = 0;
  return () => (++e2).toString(36);
};
let Q = L(),
  X = L(),
  Y = L(),
  Z = (e2, t2) => e2.bind(null, t2),
  ee = (e2, t2, r) => e2.bind(null, t2, r);
const te = (e2, t2, r) => ({ id: X(), type: e2, data: r, hasRef: t2 });
let re = 0,
  ae = ({ priority: e2 = "barrier" }) =>
    te("barrier", 0, { barrierID: ++re, priority: e2 }),
  ne = ({ from: e2 = I, store: t2, target: r, to: a2 = r ? I : "stack" }) =>
    te("mov", e2 === I, { from: e2, store: t2, to: a2, target: r }),
  oe = {
    defined: () => te("check", 0, { type: "defined" }),
    changed: ({ store: e2 }) => te("check", 1, { type: "changed", store: e2 }),
  },
  se = ee(te, "compute", 0),
  le = ee(te, "filter", 0),
  ie = ee(te, "run", 0),
  fe = ({ store: e2 }) => ne({ from: "stack", target: e2 });
let ue = (e2) => ({ id: X(), current: e2 }),
  pe = ({ current: e2 }) => e2,
  de = (e2, { fn: t2 }, { a: r }) => t2(e2, r),
  me = (e2, { fn: t2 }, { a: r }) => t2(r, e2),
  he = (e2, { fn: t2 }) => t2(e2),
  ge = (e2) => e2.graphite || e2,
  ye = (e2) => e2.family.owners,
  ke = (e2) => e2.family.links,
  be = (e2) => e2.stateRef,
  ve = (e2) => e2.config,
  we = (e2) => e2.ɔ,
  Se = (e2) => e2.value,
  qe = (e2) => e2.subscribers,
  xe = (e2) => e2.parent,
  Ne = (e2) => e2.forkPage,
  Ae = (e2, t2) => {
    let r = ge(e2);
    for (let e3 = 0; e3 < t2.length; e3++) {
      let a2 = ge(t2[e3]);
      "domain" !== r.family.type && (a2.family.type = "crosslink"),
        ye(a2).push(r),
        ke(r).push(a2);
    }
  },
  Ce = null,
  je = () => Ce,
  Oe = (e2) => (
    e2 && Ce && Ce.sidRoot && (e2 = `${Ce.sidRoot}\u0254${e2}`), e2
  );
const Fe = (e2 = []) => {
  let t2 = [];
  if (Array.isArray(e2))
    for (let r = 0; r < e2.length; r++)
      Array.isArray(e2[r]) ? t2.push(...e2[r]) : t2.push(e2[r]);
  else t2.push(e2);
  return t2.map(ge);
};
let Re = ({ hasRef: e2, type: t2, data: r }, a2) => {
    let n2;
    e2 && ((n2 = r.store), (a2[n2.id] = n2)),
      "mov" === t2 && r.to === I && ((n2 = r.target), (a2[n2.id] = n2));
  },
  De = null;
const _e = (e2, t2) => {
    if (!e2) return t2;
    if (!t2) return e2;
    let r,
      a2 = e2.v.type === t2.v.type;
    return (
      ((a2 && e2.v.id > t2.v.id) || (!a2 && "sampler" === e2.v.type)) &&
        ((r = e2), (e2 = t2), (t2 = r)),
      (r = _e(e2.r, t2)),
      (e2.r = e2.l),
      (e2.l = r),
      e2
    );
  },
  Ie = [];
let Me = 0;
for (; Me < 5; ) Ie.push({ first: null, last: null, size: 0 }), (Me += 1);
const $e = () => {
    for (let e2 = 0; e2 < 5; e2++) {
      let t2 = Ie[e2];
      if (t2.size > 0) {
        if (2 === e2 || 3 === e2) {
          t2.size -= 1;
          let e3 = De.v;
          return (De = _e(De.l, De.r)), e3;
        }
        1 === t2.size && (t2.last = null);
        let r = t2.first;
        return (t2.first = r.r), (t2.size -= 1), r.v;
      }
    }
  },
  Ee = (e2, t2, r, a2, n2, o2) =>
    ze(
      0,
      {
        a: null,
        b: null,
        node: r,
        parent: a2,
        value: n2,
        page: t2,
        forkPage: o2,
      },
      e2
    ),
  ze = (e2, t2, r, a2 = 0) => {
    let n2 = We(r),
      o2 = Ie[n2],
      s = { v: { idx: e2, stack: t2, type: r, id: a2 }, l: 0, r: 0 };
    2 === n2 || 3 === n2
      ? (De = _e(De, s))
      : (0 === o2.size ? (o2.first = s) : (o2.last.r = s), (o2.last = s)),
      (o2.size += 1);
  },
  We = (e2) => {
    switch (e2) {
      case "child":
        return 0;
      case "pure":
        return 1;
      case "barrier":
        return 2;
      case "sampler":
        return 3;
      case M:
        return 4;
      default:
        return -1;
    }
  },
  Te = /* @__PURE__ */ new Set();
let He,
  Ge = 1,
  Ue = 0,
  Be = null,
  Ve = (e2) => {
    He = e2;
  },
  Je = (e2) => {
    Be = e2;
  };
const Ke = (e2, t2) => {
    if (e2) {
      for (; e2 && !e2.reg[t2]; ) e2 = xe(e2);
      if (e2) return e2;
    }
    return null;
  },
  Le = (e2, t2, r) => (Ke(e2, r) || t2).reg[r],
  Qe = (e2, { fn: t2 }, r) => {
    try {
      return t2(Se(r), e2.scope, r);
    } catch (t3) {
      console.error(t3), (e2.fail = 1);
    }
  };
let Xe = (e2, t2) => "" + e2.shortName + t2,
  Ye = (e2, t2) => (null == t2 ? Xe(e2, " \u2192 *") : t2),
  Ze = (e2, t2) => {
    K(e2), we(e2) && t2(ve(e2), we(e2));
  },
  et = (e2) => {
    let t2;
    return (
      Ze(e2[0], (r, a2) => {
        (t2 = r), (e2 = a2);
      }),
      [e2, t2]
    );
  },
  tt = (e2, t2) => e2.includes(t2),
  rt = (e2, t2) => {
    let r = e2.indexOf(t2);
    -1 !== r && e2.splice(r, 1);
  };
const at = (e2, t2) => {
    rt(e2.next, t2), rt(ye(e2), t2), rt(ke(e2), t2);
  },
  nt = (e2, t2, r) => {
    let a2;
    (e2.next.length = 0), (e2.seq.length = 0), (e2.scope = null);
    let n2 = ke(e2);
    for (; (a2 = n2.pop()); )
      at(a2, e2),
        (t2 || (r && !e2.meta.sample) || "crosslink" === a2.family.type) &&
          nt(a2, t2, "on" !== a2.meta.op && r);
    for (n2 = ye(e2); (a2 = n2.pop()); )
      at(a2, e2),
        r &&
          "crosslink" === a2.family.type &&
          nt(a2, t2, "on" !== a2.meta.op && r);
  },
  ot = (e2) => e2.clear();
let st = (e2, { deep: t2 } = {}) => {
    let r = 0;
    if ((e2.ownerSet && e2.ownerSet.delete(e2), W(e2))) ot(qe(e2));
    else if (G(e2)) {
      r = 1;
      let t3 = e2.history;
      ot(t3.events), ot(t3.effects), ot(t3.stores), ot(t3.domains);
    }
    nt(ge(e2), !!t2, r);
  },
  lt = (e2) => {
    let t2 = ee(st, e2, void 0);
    return (t2.unsubscribe = t2), t2;
  },
  ft = (e2, t2, { node: r, scope: n2, meta: o2 }) =>
    a({
      node: r,
      parent: e2,
      child: t2,
      scope: n2,
      meta: o2,
      family: { owners: [e2, t2], links: t2 },
      regional: 1,
    }),
  ct = (e2) => {
    let r;
    Ze(e2, (t2, a2) => {
      (r = t2), (e2 = a2);
    });
    let { from: n2, to: o2, meta: s = { op: "forward" } } = e2;
    return (
      t(n2, "forward", '"from"'),
      t(o2, "forward", '"to"'),
      r && (s.config = r),
      lt(a({ parent: n2, child: o2, meta: s, family: {}, regional: 1 }))
    );
  },
  ut = (e2, t2) => {
    if ((J(t2) || B(".watch argument should be a function"), He)) {
      let t3 = He.nodeMap[ge(e2).id];
      t3 && (e2 = t3);
    }
    return lt(
      a({
        scope: { fn: t2 },
        node: [ie({ fn: he })],
        parent: e2,
        meta: { op: "watch" },
        family: { owners: e2 },
        regional: 1,
      })
    );
  };
const pt = (e2, t2) => (
  V(e2) &&
    (pt(ve(e2), t2),
    null != e2.name &&
      (V(e2.name)
        ? pt(e2.name, t2)
        : J(e2.name)
        ? (t2.handler = e2.name)
        : (t2.name = e2.name)),
    e2.loc && (t2.loc = e2.loc),
    (e2.sid || null === e2.sid) && (t2.sid = e2.sid),
    e2.handler && (t2.handler = e2.handler),
    e2.updateFilter && (t2.updateFilter = e2.updateFilter),
    xe(e2) && (t2.parent = xe(e2)),
    "strict" in e2 && (t2.strict = e2.strict),
    e2.named && (t2.named = e2.named),
    pt(we(e2), t2)),
  t2
);
let dt,
  mt = (e2, t2, r = "event") => {
    xe(e2) && xe(e2).hooks[r](t2);
  },
  ht = (e2, t2, r, a2) => {
    let n2 = pt({ name: a2, config: r }, {}),
      o2 = "domain" === e2,
      s = Q(),
      {
        parent: i2 = null,
        sid: f2 = null,
        strict: c2 = 1,
        named: u2 = null,
      } = n2,
      p2 = u2 || n2.name || (o2 ? "" : s),
      d2 = l(p2, i2),
      m2 = {
        unit: (t2.kind = e2),
        name: (t2.shortName = p2),
        sid: (t2.sid = Oe(f2)),
        named: u2,
        unitId: (t2.id = s),
      };
    if (
      ((t2.parent = i2),
      (t2.compositeName = d2),
      (t2.defaultConfig = n2),
      (t2.thru = (e3) => e3(t2)),
      (t2.getType = () => d2.fullName),
      !o2)
    ) {
      (t2.subscribe = (e3) => (
        K(e3),
        t2.watch(
          J(e3)
            ? e3
            : (t3) => {
                e3.next && e3.next(t3);
              }
        )
      )),
        (t2[_] = () => t2);
    }
    return (dt = c2), m2;
  },
  gt = (e2) => c({ named: e2 });
const yt = (e2, t2, r, a2) =>
    ft(e2, t2, { scope: { fn: a2 }, node: [se({ fn: he })], meta: { op: r } }),
  kt = (e2, t2, r, a2) => {
    let n2;
    V(r) && ((n2 = r), (r = r.fn));
    let o2 = c(Xe(e2, " \u2192? *"), n2);
    return ft(e2, o2, { scope: { fn: r }, node: a2, meta: { op: t2 } }), o2;
  },
  bt = (e2, t2, r, a2, n2, o2) => {
    let s = be(t2),
      l2 = [
        ne({ store: s, to: "a" }),
        se({ fn: a2 ? me : de }),
        oe.defined(),
        oe.changed({ store: s }),
        o2 && le({ fn: (e3, t3, { a: r2 }) => o2(e3, r2) }),
        fe({ store: s }),
      ];
    return ft(e2, t2, { scope: { fn: n2 }, node: l2, meta: { op: r } });
  },
  vt = (e2) => (t2) => e2(...t2),
  wt = (e2, t2, r, a2) => {
    let n2 = e2 ? (e3) => e3.slice() : (e3) => ({ ...e3 }),
      s = e2 ? [] : {},
      f2 = n2(s),
      c2 = ue(f2),
      p2 = ue(1);
    c2.type = e2 ? "list" : "shape";
    let d2 = u(f2, { name: r || o(t2) });
    ge(d2).meta.isCombine = 1;
    let m2 = [
        oe.defined(),
        ne({ store: c2, to: "a" }),
        le({ fn: (e3, { key: t3 }, { a: r2 }) => e3 !== r2[t3] }),
        ne({ store: p2, to: "b" }),
        se({
          fn(e3, { clone: t3, key: r2 }, a3) {
            a3.b && (a3.a = t3(a3.a)), (a3.a[r2] = e3);
          },
        }),
        ne({ from: "a", target: c2 }),
        ne({ from: "value", store: 0, target: p2 }),
        ae({ priority: "barrier" }),
        ne({ from: "value", store: 1, target: p2 }),
        ne({ store: c2 }),
        a2 && se({ fn: a2 }),
        oe.changed({ store: be(d2) }),
      ],
      h2 = (c2.before = []);
    return (
      i(t2, (e3, t3) => {
        if (!W(e3)) return void (f2[t3] = s[t3] = e3);
        (s[t3] = e3.defaultState), (f2[t3] = e3.getState());
        ft(e3, d2, {
          scope: { key: t3, clone: n2 },
          node: m2,
          meta: { op: "combine" },
        });
        let a3 = be(e3);
        h2.push({ type: "field", field: t3, from: a3 });
      }),
      (d2.defaultShape = t2),
      (c2.after = [
        a2 ? { type: $, to: be(d2), fn: a2 } : { type: "copy", to: be(d2) },
      ]),
      (d2.defaultState = a2 ? (be(d2).current = a2(f2)) : s),
      d2
    );
  };
let St =
    ({ params: e2, req: t2, ok: r, anyway: a2, stack: o2 }) =>
    (s) =>
      n({
        target: [a2, qt],
        params: [
          r
            ? { status: "done", params: e2, result: s }
            : { status: "fail", params: e2, error: s },
          { fn: r ? t2.rs : t2.rj, value: s },
        ],
        defer: 1,
        page: o2.page,
        forkPage: Ne(o2),
      }),
  qt = a({
    node: [
      ie({
        fn({ fn: e2, value: t2 }) {
          e2(t2);
        },
      }),
    ],
    meta: { op: "fx", fx: "sidechain" },
  });
const Nt = ["source", "clock", "target"],
  At = (e2, t2, r, a2) => {
    let o2 = e2[t2];
    o2 &&
      n({
        target: o2,
        params: Array.isArray(o2) ? o2.map(() => r) : r,
        defer: 1,
        stack: a2,
      });
  };
var LinkedInPage = /* @__PURE__ */ ((LinkedInPage2) => {
  LinkedInPage2[(LinkedInPage2["Unidentified"] = 0)] = "Unidentified";
  LinkedInPage2[(LinkedInPage2["SearchPeople"] = 1)] = "SearchPeople";
  LinkedInPage2[(LinkedInPage2["MyNetwork"] = 2)] = "MyNetwork";
  return LinkedInPage2;
})(LinkedInPage || {});
var LinkedInCssSelector = /* @__PURE__ */ ((LinkedInCssSelector2) => {
  LinkedInCssSelector2["NextPageButton"] =
    "button.artdeco-pagination__button--next";
  LinkedInCssSelector2["ConnectButtonFromMyNetworkPage"] =
    "div.discover-entity-type-card__bottom-container button.ember-view:enabled:not(.artdeco-button--muted):not(.artdeco-button--full)";
  LinkedInCssSelector2["ConnectButtonFromSearchPage"] =
    "li.reusable-search__result-container div.entity-result__actions > div > button.ember-view:enabled:not(.artdeco-button--muted)";
  LinkedInCssSelector2["SendButtonFromSendInviteModal"] =
    "div.send-invite button.artdeco-button--primary";
  return LinkedInCssSelector2;
})(LinkedInCssSelector || {});
const buttonClickRequested = c();
var LinkedInUrl = /* @__PURE__ */ ((LinkedInUrl2) => {
  LinkedInUrl2["SearchPeoplePage"] =
    "https://www.linkedin.com/search/results/people/";
  LinkedInUrl2["MyNetworkPage"] = "https://www.linkedin.com/mynetwork/";
  LinkedInUrl2["PatternOfSearchPage"] = "linkedin.com/search/results/people";
  LinkedInUrl2["PatternOfMyNetworkPage"] = "linkedin.com/mynetwork";
  return LinkedInUrl2;
})(LinkedInUrl || {});
const windowLocationUpdated = c();
const {
  searchPageLoaded,
  myNetworkPageLoaded,
  __: unidentifiedPageLoaded,
} = q(windowLocationUpdated, {
  searchPageLoaded: (windowLocation) =>
    windowLocation.includes(LinkedInUrl.PatternOfSearchPage),
  myNetworkPageLoaded: (windowLocation) =>
    windowLocation.includes(LinkedInUrl.PatternOfMyNetworkPage),
});
const started = c();
const stopped = c();
const isRunningStore = u(false)
  .on(started, () => true)
  .reset([stopped, unidentifiedPageLoaded]);
const currentLinkedInPageStore = u(LinkedInPage.Unidentified)
  .on(searchPageLoaded, () => LinkedInPage.SearchPeople)
  .on(myNetworkPageLoaded, () => LinkedInPage.MyNetwork);
const findNextAvailableConnectButton = m(
  (selector) =>
    new Promise((resolve) => {
      let attempts = 0;
      const interval = setInterval(() => {
        window.scrollTo(0, document.body.scrollHeight);
        const nextAvailableConnectButton = document.querySelector(selector);
        if (nextAvailableConnectButton) {
          clearInterval(interval);
          resolve(nextAvailableConnectButton);
        } else if (++attempts > 5) {
          clearInterval(interval);
          resolve(null);
        }
      }, 500);
    })
);
v({
  clock: w({
    clock: buttonClickRequested,
    source: p({
      isRunning: isRunningStore,
      currentLinkedInPage: currentLinkedInPageStore,
    }),
    filter: ({ isRunning, currentLinkedInPage }) =>
      isRunning &&
      [LinkedInPage.MyNetwork, LinkedInPage.SearchPeople].includes(
        currentLinkedInPage
      ),
  }),
  fn: ({ currentLinkedInPage }) =>
    currentLinkedInPage === LinkedInPage.MyNetwork
      ? LinkedInCssSelector.ConnectButtonFromMyNetworkPage
      : LinkedInCssSelector.ConnectButtonFromSearchPage,
  target: findNextAvailableConnectButton,
});
function randomInteger(minimum, maximum) {
  if (maximum === void 0) {
    maximum = minimum;
    minimum = 0;
  }
  if (typeof minimum !== "number" || typeof maximum !== "number") {
    throw new TypeError("Expected all arguments to be numbers");
  }
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}
const clickButton = m((button) => {
  button.focus();
  button.click();
  button.setAttribute("disabled", "disabled");
});
const buttonClicked = clickButton.done;
const confirmSendInviteDialog = m(
  () =>
    new Promise((resolve) => {
      let attempts = 0;
      const interval = setInterval(() => {
        const sendButton = document.querySelector(
          LinkedInCssSelector.SendButtonFromSendInviteModal
        );
        sendButton == null ? void 0 : sendButton.click();
        if (sendButton || ++attempts > 5) {
          clearInterval(interval);
          resolve(null);
        }
      }, 500);
    })
);
const delay = m(
  (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
);
const delayNextClick = h({ effect: delay });
const buttonClicksCountStore = u(0).on(buttonClicked, (state) => state + 1);
const maximumAutoConnectionsPerSessionChanged = c();
const maximumAutoConnectionsPerSessionStore = S(
  maximumAutoConnectionsPerSessionChanged,
  "100"
);
v({ clock: buttonClicked, target: confirmSendInviteDialog });
v({
  clock: buttonClicked,
  fn: () => randomInteger(1500, 3e3),
  target: delayNextClick,
});
w({
  clock: buttonClicked,
  source: p({
    buttonClicksCount: buttonClicksCountStore,
    maximumAutoConnectionsPerSession: maximumAutoConnectionsPerSessionStore,
  }),
  filter: ({ buttonClicksCount, maximumAutoConnectionsPerSession }) =>
    buttonClicksCount >= Number(maximumAutoConnectionsPerSession),
  target: stopped,
});
const postChromePortMessage = m((chromePortMessage) => {
  const { message, port } = chromePortMessage;
  port.postMessage(message);
});
var MessageId = /* @__PURE__ */ ((MessageId2) => {
  MessageId2[(MessageId2["ConnectionEstablished"] = 0)] =
    "ConnectionEstablished";
  MessageId2[(MessageId2["RunningStateUpdated"] = 1)] = "RunningStateUpdated";
  MessageId2[(MessageId2["ButtonClicksCountUpdated"] = 2)] =
    "ButtonClicksCountUpdated";
  MessageId2[(MessageId2["StartAutoConnect"] = 3)] = "StartAutoConnect";
  MessageId2[(MessageId2["StopAutoConnect"] = 4)] = "StopAutoConnect";
  return MessageId2;
})(MessageId || {});
const chromePortConnected = c();
const chromePortStore = S(chromePortConnected, null);
w({
  clock: v({
    clock: buttonClicksCountStore.updates,
    source: chromePortStore,
    fn: (chromePort, buttonClicksCount) => ({
      message: {
        id: MessageId.ButtonClicksCountUpdated,
        content: buttonClicksCount,
      },
      port: chromePort,
    }),
  }),
  filter: (payload) => payload.port !== null,
  target: postChromePortMessage,
});
const chromePortMessageReceived = c();
const startListeningToChromePortMessages = m((port) => {
  port.onMessage.addListener((message) => {
    chromePortMessageReceived({ message, port });
  });
});
ct({ from: chromePortConnected, to: startListeningToChromePortMessages });
ct({
  from: chromePortConnected.map((port) => ({
    message: { id: MessageId.ConnectionEstablished },
    port,
  })),
  to: postChromePortMessage,
});
v({
  clock: chromePortConnected,
  source: isRunningStore,
  fn: (isRunning, port) => ({
    message: { id: MessageId.RunningStateUpdated, content: isRunning },
    port,
  }),
  target: postChromePortMessage,
});
v({
  clock: chromePortConnected,
  source: buttonClicksCountStore,
  fn: (buttonClicksCount, port) => ({
    message: {
      id: MessageId.ButtonClicksCountUpdated,
      content: buttonClicksCount,
    },
    port,
  }),
  target: postChromePortMessage,
});
ct({ from: delayNextClick.doneData, to: buttonClickRequested });
const extensionMessageReceived = q(chromePortMessageReceived, {
  [MessageId.ConnectionEstablished]: ({ message }) =>
    message.id === MessageId.ConnectionEstablished,
  [MessageId.RunningStateUpdated]: ({ message }) =>
    message.id === MessageId.RunningStateUpdated,
  [MessageId.ButtonClicksCountUpdated]: ({ message }) =>
    message.id === MessageId.ButtonClicksCountUpdated,
  [MessageId.StartAutoConnect]: ({ message }) =>
    message.id === MessageId.StartAutoConnect,
  [MessageId.StopAutoConnect]: ({ message }) =>
    message.id === MessageId.StopAutoConnect,
});
v({
  clock: extensionMessageReceived[MessageId.StartAutoConnect],
  target: started,
});
v({
  clock: extensionMessageReceived[MessageId.StopAutoConnect],
  target: stopped,
});
w({
  clock: isRunningStore.updates,
  filter: (isRunning) => isRunning,
  target: buttonClickRequested,
});
w({
  clock: v({
    clock: isRunningStore.updates,
    source: chromePortStore,
    fn: (chromePort, isRunning) => ({
      message: { id: MessageId.RunningStateUpdated, content: isRunning },
      port: chromePort,
    }),
  }),
  filter: (payload) => payload.port !== null,
  target: postChromePortMessage,
});
w({
  clock: myNetworkPageLoaded,
  filter: isRunningStore,
  target: buttonClickRequested,
});
const { nextAvailableConnectButtonFound, nextAvailableConnectButtonNotFound } =
  q(findNextAvailableConnectButton.doneData, {
    nextAvailableConnectButtonFound: (button) => button !== null,
    nextAvailableConnectButtonNotFound: (button) => button === null,
  });
ct({
  from: nextAvailableConnectButtonFound,
  to: clickButton,
});
const goToNextPage = m(() => {
  var _a;
  (_a = document.querySelector(LinkedInCssSelector.NextPageButton)) == null
    ? void 0
    : _a.click();
});
v({ clock: nextAvailableConnectButtonNotFound, target: goToNextPage });
const oneSecondIntervalTicked = c();
const lastWindowLocationStore = S(windowLocationUpdated, "");
w({
  clock: oneSecondIntervalTicked,
  source: lastWindowLocationStore,
  filter: (lastWindowLocation) => window.location.href !== lastWindowLocation,
  target: windowLocationUpdated.prepend(() => window.location.href),
});
w({
  clock: searchPageLoaded,
  filter: isRunningStore,
  target: buttonClickRequested,
});
const tabScriptInjected = c();
const startListeningToChromePortConnections = m(() =>
  chrome.runtime.onConnect.addListener(chromePortConnected)
);
const startOneSecondIntervalTicker = m(() =>
  setInterval(oneSecondIntervalTicked, 1e3)
);
const loadOptions = m(
  (options) =>
    new Promise((resolve) => {
      chrome.storage.sync.get(options, (items) => resolve(items));
    })
);
ct({
  from: tabScriptInjected,
  to: [startListeningToChromePortConnections, startOneSecondIntervalTicker],
});
v({
  clock: tabScriptInjected,
  source: p({
    maximumAutoConnectionsPerSession: maximumAutoConnectionsPerSessionStore,
  }),
  target: loadOptions,
});
v({
  clock: loadOptions.doneData,
  fn: ({ maximumAutoConnectionsPerSession }) =>
    maximumAutoConnectionsPerSession,
  target: maximumAutoConnectionsPerSessionChanged,
});
tabScriptInjected();
