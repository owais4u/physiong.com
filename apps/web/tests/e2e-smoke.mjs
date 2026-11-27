import assert from "node:assert/strict";
import { cp, mkdir } from "node:fs/promises";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standaloneRoot = path.join(appRoot, ".next/standalone");
const standaloneApp = path.join(standaloneRoot, "apps/web");

await mkdir(path.join(standaloneApp, "public"), { recursive: true });
await mkdir(path.join(standaloneApp, ".next/static"), { recursive: true });
await cp(path.join(appRoot, "public"), path.join(standaloneApp, "public"), { recursive: true });
await cp(path.join(appRoot, ".next/static"), path.join(standaloneApp, ".next/static"), { recursive: true });

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => server.once("error", reject).listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

const port = await availablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [path.join(standaloneApp, "server.js")], {
  cwd: standaloneRoot,
  env: { ...process.env, NODE_ENV: "production", PORT: String(port), HOSTNAME: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk; });
server.stderr.on("data", (chunk) => { serverOutput += chunk; });

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next.js server exited early:\n${serverOutput}`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) { ready = true; break; }
    } catch { /* The server is still starting. */ }
    await delay(250);
  }
  assert.equal(ready, true, `Next.js server did not become ready:\n${serverOutput}`);

  const routes = [
    ["/", "Care that helps you"],
    ["/clinic", "Dr. Khushnoor"],
    ["/clinic/patients", "Patient directory"],
    ["/clinic/appointments", "Appointments"],
    ["/clinic/encounters", "Clinical notes"],
    ["/hospital", "CRIBS Hospital"],
    ["/admin", "control centre"],
    ["/book", "Request a visit"],
    ["/patient", "Patient portal"],
  ];
  for (const [route, expectedText] of routes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} should return HTTP 200`);
    const html = await response.text();
    assert.ok(html.includes(expectedText), `${route} should include “${expectedText}”`);
    console.log(`✓ ${route} responds with expected page content`);
  }

  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok", service: "physiong-web" });
  console.log("✓ /api/health reports a healthy web process");

  const home = await fetch(baseUrl);
  assert.equal(home.headers.get("x-content-type-options"), "nosniff");
  assert.equal(home.headers.get("x-frame-options"), "DENY");
  console.log("✓ security response headers are present");

  for (const asset of ["/images/physiong-logo.jpeg", "/images/physiotherapy-assessment.jpg", "/images/clinic-treatment-room.jpg"]) {
    const response = await fetch(`${baseUrl}${asset}`);
    assert.equal(response.status, 200, `${asset} should be served`);
    assert.match(response.headers.get("content-type") ?? "", /^image\//, `${asset} should have an image content type`);
    console.log(`✓ ${asset} is served as an image`);
  }
  console.log("PhysioNG MVP HTTP smoke checks passed.");
} finally {
  server.kill("SIGTERM");
}
