import { expect, test } from "@playwright/test";

function tomorrowDateInputValue() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

test("public and role portal previews are reachable and cross-linked", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /care that helps you/i })).toBeVisible();
  await expect(page.locator(".site-header .brand-mark")).toHaveCSS("width", "192px");

  await page.goto("/clinic");
  await expect(page.getByRole("heading", { name: /good morning, dr\. khushnoor/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Hospital portal" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Platform admin" })).toBeVisible();

  for (const [path, heading, navLabel] of [
    ["/hospital", "CRIBS Hospital", "Hospital"],
    ["/patient", "Your care, made easier.", "Patient"],
    ["/admin", "PhysioNG control centre", "Platform admin"],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    if (path !== "/patient") {
      await expect(page.getByRole("navigation", { name: "Portal previews" }).getByRole("link", { name: navLabel })).toHaveAttribute("aria-current", "page");
      await expect(page.locator(".preview-portal-logo")).toHaveCSS("width", "192px");
      await expect(page.getByText("Demonstration only.")).toBeVisible();
    } else {
      await expect(page.locator(".patient-header .brand-mark")).toHaveCSS("width", "192px");
    }
  }
});

test("clinic workflow registers a patient, books a visit, and records an encounter", async ({ page }) => {
  const patient = `Maya Demo ${Date.now()}`;
  const phone = `+91 90000${String(Date.now()).slice(-5)}`;

  await page.goto("/clinic/patients/new");
  await page.getByRole("textbox", { name: /patient name/i }).fill(patient);
  await page.getByRole("textbox", { name: /phone number/i }).fill(phone);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Save demo patient" }).click();
  await expect(page.getByRole("heading", { name: "Patient added to this demo" })).toBeVisible();
  await page.getByRole("button", { name: "Book appointment" }).click();

  await page.getByRole("textbox", { name: /patient name/i }).fill(patient);
  await page.getByRole("textbox", { name: /phone number/i }).fill(phone);
  await page.getByLabel("Visit type").selectOption({ label: "Initial assessment" });
  await page.locator("#booking-date").fill(tomorrowDateInputValue());
  await page.getByRole("button", { name: /4:00 pm/i }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Add to demo schedule" }).click();
  await expect(page.getByRole("heading", { name: "Your visit is on the demo schedule" })).toBeVisible();

  await page.goto("/clinic/encounters/new");
  await page.locator("#encounter-patient").selectOption({ label: patient });
  await page.locator("#encounter-appointment").selectOption({ index: 1 });
  await page.locator("#encounter-concern").fill("Fictional shoulder stiffness");
  await page.locator("#encounter-assessment").fill("Demo assessment");
  await page.locator("#encounter-treatment").fill("Demo treatment");
  await page.locator("#encounter-plan").fill("Demo follow-up");
  await page.getByRole("button", { name: "Save demo note" }).click();
  await expect(page.getByRole("heading", { name: "Clinical notes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: patient })).toBeVisible();

  await page.goto("/clinic/appointments");
  await expect(page.getByLabel(`Update ${patient} appointment status`)).toHaveValue("Completed");
});

test("public booking confirms a browser-only demo request", async ({ page }) => {
  await page.goto("/book");
  await page.getByRole("textbox", { name: /patient name/i }).fill("Taylor Browser Test");
  await page.getByRole("textbox", { name: /phone number/i }).fill("+91 91111 22222");
  await page.getByLabel("Visit type").selectOption({ label: "Follow-up session" });
  await page.locator("#booking-date").fill(tomorrowDateInputValue());
  await page.getByRole("button", { name: /3:00 pm/i }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Request a demo visit" }).click();
  await expect(page.getByRole("heading", { name: "Your visit is on the demo schedule" })).toBeVisible();
  await expect(page.getByText(/not a live clinic booking/i)).toBeVisible();
});

test("portal headers and content fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/hospital", "/patient", "/admin"]) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content, `${path} should not overflow horizontally`).toBeLessThanOrEqual(dimensions.viewport);
  }
});
