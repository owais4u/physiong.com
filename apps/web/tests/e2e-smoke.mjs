import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(appRoot, "node_modules/next/dist/bin/next");

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => server.once("error", reject).listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

const port = await availablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: appRoot,
  env: { ...process.env, NODE_ENV: "production" },
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
