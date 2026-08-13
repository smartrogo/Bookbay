const routes = ["/", "/exchange", "/wallet", "/messages", "/borrow"];
const base = process.env.VERIFY_BASE || "http://localhost:5173";
/* eslint-disable */
import http from "http";

function check() {
  let pending = routes.length;
  routes.forEach((r) => {
    const url = new URL(r, base);
    const opts = { hostname: url.hostname, port: url.port, path: url.pathname, method: 'GET' };
    const req = http.request(opts, (res) => {
      if (res.statusCode !== 200) {
        console.error(`FAIL ${url.href} -> ${res.statusCode}`);
        process.exitCode = 2;
      } else {
        console.log(`OK ${url.href} -> ${res.statusCode}`);
      }
      res.on('data', ()=>{});
      res.on('end', ()=>{ if (--pending === 0) process.exit(process.exitCode || 0); });
    });
    req.on('error', (err) => {
      console.error(`ERR ${url.href} -> ${err.message}`);
      process.exitCode = 2;
      if (--pending === 0) process.exit(process.exitCode || 0);
    });
    req.end();
  });
}

check();
