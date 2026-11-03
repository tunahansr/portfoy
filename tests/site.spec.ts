import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../src/data/projects";
import { profile } from "../src/data/profile";

const widths = [320, 375, 390, 430, 768, 1024, 1440, 1920];
const heightFor = (w: number) => (w < 768 ? 844 : w < 1440 ? 1000 : 1080);

async function noHorizontalOverflow(page: Page) {
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  expect(sw, `scrollWidth ${sw} > innerWidth ${iw}`).toBeLessThanOrEqual(iw);
}

/** Tüm sayfayı kaydırarak lazy içerik ve scroll animasyonlarını tetikler. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
}

for (const w of widths) {
  test.describe(`ana sayfa @${w}px`, () => {
    test.use({ viewport: { width: w, height: heightFor(w) } });

    test("taşma yok, kritik içerik görünür, ekran görüntüsü", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await noHorizontalOverflow(page);
      await page.screenshot({ path: `test-results/screens/home-${w}-hero.png` });
      await scrollThrough(page);
      await noHorizontalOverflow(page);
      for (const id of ["isler", "mobil", "mimari", "arsiv", "iletisim"]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await noHorizontalOverflow(page);
        await page.screenshot({ path: `test-results/screens/home-${w}-${id}.png` });
      }
    });
  });
}

test.describe("işlev", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("iletişim bağlantıları gerçek", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#iletisim");
    await expect(contact.locator(`a[href^="https://wa.me/905421531777"]`).first()).toBeVisible();
    await expect(contact.locator(`a[href="tel:${profile.contact.phoneE164}"]`)).toHaveCount(1);
    await expect(contact.locator(`a[href="mailto:${profile.contact.email}"]`)).toHaveCount(1);
  });

  test("mobil menü açılır, Esc ile kapanır", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Menü", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("arşiv filtresi çalışır", async ({ page }) => {
    await page.goto("/projeler");
    const rows = page.locator("main ul li a[href^='/projeler/']");
    await expect(rows).toHaveCount(projects.length);
    await page.getByRole("button", { name: /^Altyapı/ }).click();
    await expect(rows).toHaveCount(projects.filter((p) => p.categories.includes("altyapi")).length);
  });

  test("iletişim formu doğrulama hatası gösterir", async ({ page }) => {
    await page.goto("/#iletisim", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Gönder", exact: true }).click();
    await expect(page.getByText("Adını yaz.")).toBeVisible();
  });

  test("KARPİN ERP ifadesi hiçbir yerde yok", async ({ page }) => {
    for (const path of ["/", "/projeler", "/projeler/karpin"]) {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      expect(text).not.toMatch(/KARP[İI]N\s+ERP/i);
    }
  });

  test("hareket azaltma tercihi uygulanır", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/reduce-motion/);
    await ctx.close();
  });
});

test.describe("proje detay sayfaları", () => {
  for (const p of projects) {
    test(`/projeler/${p.slug}`, async ({ page }) => {
      const res = await page.goto(`/projeler/${p.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.name);
    });
  }
});

test.describe("SEO", () => {
  test("robots, sitemap, OG", async ({ request, page }) => {
    expect((await request.get("/robots.txt")).status()).toBe(200);
    const sm = await request.get("/sitemap.xml");
    expect(sm.status()).toBe(200);
    expect(await sm.text()).toContain("/projeler/karekod-erp");
    expect((await request.get("/opengraph-image")).status()).toBe(200);
    await page.goto("/");
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });
});

test.describe("erişilebilirlik (axe)", () => {
  for (const path of ["/", "/projeler", "/projeler/karekod-erp"]) {
    test(`${path} kritik/ciddi ihlal yok`, async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      if (serious.length) console.log(JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.slice(0, 3).map((n) => n.target) })), null, 2));
      expect(serious).toEqual([]);
    });
  }
});
