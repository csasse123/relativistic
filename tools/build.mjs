// Production build: minifies the inline scripts, shaders and styles of the four pages, injects the licence mark and the host check,
// and writes the result to dist/. The readable source stays in the repo; only dist/ is deployed (see .github/workflows/pages.yml).
//   node tools/build.mjs [--assets]     --assets also copies assets/ and the other static files into dist/ (CI does this)
import fs from "fs"; import path from "path"; import { minify } from "terser";
const root = path.resolve(new URL("..", import.meta.url).pathname), dist = path.join(root, "dist");
const ver = (fs.readFileSync(path.join(root, "neutron-star.html"), "utf8").match(/const BUILD = "([^"]+)"/) || [])[1] || "dev";
const ID = "cs-rel-7f3a91";                                                                    // marker repeated in the page, the code and the licence line
const HOSTS = ["csasse123.github.io", "explorables.io", "www.explorables.io", "localhost", "127.0.0.1", "[::1]"];
const MARK = `/*! © 2026 Christian Sasse · CC BY-NC-ND 4.0 · https://csasse123.github.io/relativistic/ · ${ver} · ${ID} */`;
const GUARD = `<script>${MARK}(function(){var h=location.hostname;if(location.protocol==="file:"||${JSON.stringify(HOSTS)}.indexOf(h)>-1||/\\.localhost$/.test(h))return;` +
  `document.open();document.write('<body style="margin:0;background:#050a18;color:#cfe0f5;font:16px system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;text-align:center"><div style="max-width:30em;padding:24px"><h2>This is a copy</h2><p>This simulation is © Christian Sasse (CC BY-NC-ND 4.0). The original is here:</p><p><a style="color:#7fd8ff" href="https://csasse123.github.io/relativistic/">csasse123.github.io/relativistic</a></p></div>');document.close();throw new Error("copy")})();</script>`;
const glsl = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "").split("\n").map((l) => l.trim().replace(/[ \t]+/g, " ")).filter(Boolean)
  .reduce((a, l) => (l.startsWith("#") ? (a && !a.endsWith("\n") ? a + "\n" : a) + l + "\n" : a + (a && !a.endsWith("\n") ? " " : "") + l), "")
  .replace(/ ?([{};,]) ?/g, "$1");                                                       // conservative: operators keep their spaces
const css = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};,])\s*/g, "$1").trim();
async function js(src, mod) {
  const r = await minify(src, { module: !!mod, compress: { passes: 2 }, mangle: { toplevel: !!mod }, format: { comments: false } });
  if (r.error) throw r.error;
  return r.code.replace(/`#version 300 es[\s\S]*?`/g, (m) => "`" + glsl(m.slice(1, -1)) + "`");   // shader sources inside JS template literals
}
async function page(file) {
  let h = fs.readFileSync(path.join(root, file), "utf8"), n = 0;
  const parts = [], re = /<script([^>]*)>([\s\S]*?)<\/script>|<style([^>]*)>([\s\S]*?)<\/style>/g; let last = 0, m;
  while ((m = re.exec(h))) {
    parts.push(h.slice(last, m.index)); last = re.lastIndex; n++;
    if (m[0].startsWith("<style")) parts.push(`<style${m[3]}>${css(m[4])}</style>`);
    else {
      const attrs = m[1], body = m[2];
      if (/src=/.test(attrs) || /importmap/.test(attrs)) parts.push(m[0]);
      else if (/x-shader/.test(attrs)) parts.push(`<script${attrs}>${glsl(body)}</script>`);
      else parts.push(`<script${attrs}>${await js(body, /type="module"/.test(attrs))}</script>`);
    }
  }
  parts.push(h.slice(last)); h = parts.join("");
  h = h.replace(/<!--(?!\[)[\s\S]*?-->/g, "");
  h = h.replace(/<head([^>]*)>/, `<head$1>\n<meta name="copyright" content="© 2026 Christian Sasse, CC BY-NC-ND 4.0 (${ID})">\n${GUARD}`);
  h = h.replace(/<\/body>/, `<a id="cs-credit" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener" style="position:fixed;right:14px;bottom:1px;z-index:1;font:600 9px/1.2 system-ui,sans-serif;color:rgba(150,175,205,.6);text-decoration:none">© Christian Sasse · CC BY-NC-ND 4.0</a>\n</body>`);
  fs.writeFileSync(path.join(dist, file), h);
  console.log(`${file}: ${(fs.statSync(path.join(root, file)).size / 1024).toFixed(0)} KB → ${(h.length / 1024).toFixed(0)} KB`);
}
fs.rmSync(dist, { recursive: true, force: true }); fs.mkdirSync(dist, { recursive: true });
for (const f of ["index.html", "satellites.html", "video.html", "neutron-star.html"]) if (fs.existsSync(path.join(root, f))) await page(f);
if (process.argv.includes("--assets")) for (const f of fs.readdirSync(root)) if (!/^(\.|dist$|node_modules$|tools$|exports$|package|.*\.html$)/.test(f) && f !== "docs") fs.cpSync(path.join(root, f), path.join(dist, f), { recursive: true });
