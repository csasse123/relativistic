// Post-deploy check of the published neutron-star page.   node tools/smoke_test.mjs https://your.host/path/neutron-star.html
// Needs node 18+ and, for the browser checks, `npm ci` (playwright) and Chrome (or `npx playwright install chromium`).
// Exit code 0 = all required checks passed. Prints one PASS / WARN / FAIL line per check.
const url = process.argv[2]; if (!url) { console.error("usage: node tools/smoke_test.mjs <page url>"); process.exit(2); }
let bad = 0; const out = (k, m) => { console.log(`${k.padEnd(4)} ${m}`); if (k === "FAIL") bad++; };
const base = new URL(".", url).href;
try { const r = await fetch(url); out(r.ok ? "PASS" : "FAIL", `page answers ${r.status}`); const t = await r.text(); out(/cs-rel-7f3a91/.test(t) ? "PASS" : "FAIL", "licence marker present"); out(/This is a copy/.test(t) && !/location\.hostname/.test(t) ? "FAIL" : "PASS", "page is not a block page"); }
catch (e) { out("FAIL", `cannot fetch the page: ${e.message}`); }
for (const f of ["assets/intro/script.json", "assets/intro/durations.json", "assets/intro/music.mp3", "assets/intro/s1.mp3", "assets/intro/s8.mp3"]) {
  try { const r = await fetch(base + f, { headers: f.endsWith(".mp3") ? { Range: "bytes=0-99" } : {} });
    if (!r.ok) out("FAIL", `${f} answers ${r.status}`);
    else if (f.endsWith(".mp3") && r.status !== 206) out("WARN", `${f} works but the server ignores byte ranges (music cannot seek after a skip; ask the host to enable range requests)`);
    else out("PASS", `${f} ${r.status}`); } catch (e) { out("FAIL", `${f}: ${e.message}`); }
}
let pw = null; try { pw = await import("playwright"); } catch (e) { out("WARN", "playwright not installed: browser checks skipped (run npm ci)"); }
if (pw) {
  let b; try { b = await pw.chromium.launch({ channel: "chrome", headless: true }); } catch (e) { try { b = await pw.chromium.launch({ headless: true }); } catch (e2) { out("WARN", "no browser available: browser checks skipped"); } }
  if (b) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } }), errs = [];
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 120))); p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 120)); });
    await p.goto(url); await p.waitForTimeout(5000);
    const s = await p.evaluate(() => ({ copy: /This is a copy/.test(document.body.innerText), intro: !!document.getElementById("introUI") && !document.getElementById("introUI").hidden, skip: !!document.getElementById("ibSkipTour") }));
    out(s.copy ? "FAIL" : "PASS", s.copy ? "host check blocked the page: add this host name to the list at the top of neutron-star.html" : "host check lets the page run");
    out(s.intro ? "PASS" : "WARN", s.intro ? "intro started by itself" : "intro did not start (normal for a returning visitor or ?nointro; try a private window)");
    if (s.skip) { await p.click("#ibSkipTour"); await p.waitForTimeout(1200); const tour = await p.evaluate(() => !document.getElementById("tbub").hidden); out(tour ? "PASS" : "FAIL", "Skip intro > interactive tour opens the tour"); }
    out(errs.length ? "FAIL" : "PASS", errs.length ? `console errors: ${errs.join(" | ")}` : "no console errors");
    await b.close();
  }
}
console.log(bad ? `\n${bad} check(s) FAILED` : "\nAll required checks passed"); process.exit(bad ? 1 : 0);
