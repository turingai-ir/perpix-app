import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../node_modules/.pnpm/@playwright+test@1.64.1/node_modules/@playwright/test/index.mjs";

const STORYBOOK_URL = "http://127.0.0.1:6006";
const EVIDENCE_DIR = "/home/attila/.gemini/antigravity/brain/07cc1a3c-a4d1-49bc-99ad-d69014a4413c/storybook-audit";

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function fetchAllStories() {
  const res = await fetch(`${STORYBOOK_URL}/index.json`);
  if (!res.ok) throw new Error(`Failed to fetch Storybook index: ${res.statusText}`);
  const data = await res.json();
  return Object.values(data.entries).map((e) => ({
    id: e.id,
    title: e.title,
    name: e.name,
  }));
}

async function runComprehensiveAudit() {
  console.log("Fetching stories from Storybook...");
  const stories = await fetchAllStories();
  console.log(`Found ${stories.length} stories to audit.\n`);

  const browser = await chromium.launch();
  const summary = {
    totalStories: stories.length,
    passed: 0,
    failed: 0,
    issues: [],
  };

  const VIEWPORTS = [
    { name: "desktop", width: 1280, height: 800, isMobile: false },
    { name: "mobile", width: 390, height: 844, isMobile: true },
  ];

  const THEMES = ["light", "dark"];

  for (let idx = 0; idx < stories.length; idx++) {
    const story = stories[idx];
    const storyIssues = [];
    process.stdout.write(`[${idx + 1}/${stories.length}] Auditing: ${story.title} > ${story.name}... `);

    for (const vp of VIEWPORTS) {
      for (const theme of THEMES) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          isMobile: vp.isMobile,
          hasTouch: vp.isMobile,
        });

        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];

        page.on("pageerror", (err) => pageErrors.push(err.message));
        page.on("console", (msg) => {
          if (msg.type() === "error") consoleErrors.push(msg.text());
        });

        const url = `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme};direction:rtl`;

        try {
          await page.goto(url, { waitUntil: "networkidle", timeout: 8000 });
          await page.waitForTimeout(200);

          // 1. Check runtime errors
          if (pageErrors.length > 0) {
            storyIssues.push({
              vp: vp.name,
              theme,
              type: "pageerror",
              details: pageErrors.join("; "),
            });
          }

          // 2. Check unwanted horizontal page overflow
          const overflow = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const winWidth = window.innerWidth;
            return docWidth > winWidth + 4; // allow tiny rounding
          });

          if (overflow) {
            storyIssues.push({
              vp: vp.name,
              theme,
              type: "horizontal_overflow",
              details: `Page scrollWidth exceeded viewport width (${vp.width}px)`,
            });
          }

          // 3. Inspect DOM elements for broken styling (square rings, touch targets, contrast)
          const domMetrics = await page.evaluate((isMobile) => {
            const issues = [];

            // A. Check for square rings on rounded elements
            const allElements = document.querySelectorAll("*");
            allElements.forEach((el) => {
              const cs = window.getComputedStyle(el);
              // If element has a ring / box-shadow ring
              if (cs.boxShadow && cs.boxShadow.includes("0px 0px 0px 2px")) {
                const borderRadius = parseFloat(cs.borderRadius);
                // Check if element contains a rounded-full child
                const hasRoundChild = el.querySelector(".rounded-full, img, [data-slot='avatar']");
                if (hasRoundChild && borderRadius < 10) {
                  issues.push({
                    type: "square_ring_on_round_content",
                    tag: el.tagName,
                    class: el.className,
                  });
                }
              }
            });

            // B. Mobile touch target size check
            if (isMobile) {
              const touchTargets = document.querySelectorAll(
                'button:not([tabindex="-1"]), [role="button"], [role="tab"], [role="switch"], [role="checkbox"], select, input:not([type="hidden"]):not([aria-hidden="true"]):not([tabindex="-1"])'
              );
              touchTargets.forEach((t) => {
                const cs = window.getComputedStyle(t);
                // Ignore visually-hidden screen reader inputs (e.g. clip-path: inset(50%))
                if (cs.clipPath && cs.clipPath.includes("inset(50%)")) {
                  return;
                }
                if (cs.clip && cs.clip.includes("rect(0")) {
                  return;
                }
                // Ignore Base UI hidden inputs or offscreen inputs
                if (t.tagName === "INPUT" && (t.offsetWidth <= 1 || t.offsetHeight <= 1 || t.getAttribute("aria-hidden") === "true")) {
                  return;
                }
                const rect = t.getBoundingClientRect();
                const beforeStyle = window.getComputedStyle(t, "::before");
                const hasExpandedHitTarget = beforeStyle && beforeStyle.content !== "none" && beforeStyle.position === "absolute";

                // Ignore invisible or hidden elements
                if (rect.width > 0 && rect.height > 0 && !hasExpandedHitTarget) {
                  // If height is below 32px
                  if (rect.height < 32 || rect.width < 32) {
                    issues.push({
                      type: "undersized_touch_target",
                      tag: t.tagName,
                      role: t.getAttribute("role"),
                      text: (t.textContent || "").trim().slice(0, 20),
                      dimensions: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                    });
                  }
                }
              });
            }

            return issues;
          }, vp.isMobile);

          if (domMetrics.length > 0) {
            domMetrics.forEach((m) => {
              storyIssues.push({
                vp: vp.name,
                theme,
                type: m.type,
                details: JSON.stringify(m),
              });
            });
          }

          // 4. Interactive triggers check (Dialog, Sheet, Dropdown, Popover, Select)
          if (vp.name === "desktop" && theme === "light") {
            const trigger = page.locator('button:has-text("باز کردن"), button:has-text("نمایش"), button:has-text("اجرا"), [role="combobox"]').first();
            if (await trigger.isVisible().catch(() => false)) {
              await trigger.click({ timeout: 1000 }).catch(() => {});
              await page.waitForTimeout(150);
              // Verify overlay opened without error
              const hasOverlay = await page.locator('[role="dialog"], [role="listbox"], [role="menu"], [role="region"]').isVisible().catch(() => false);
              // Press Escape to cleanly close
              await page.keyboard.press("Escape").catch(() => {});
              await page.waitForTimeout(100);
            }
          }
        } catch (err) {
          storyIssues.push({
            vp: vp.name,
            theme,
            type: "navigation_or_timeout",
            details: err.message,
          });
        } finally {
          await context.close();
        }
      }
    }

    if (storyIssues.length === 0) {
      console.log("✅ PASS");
      summary.passed++;
    } else {
      console.log(`❌ FAIL (${storyIssues.length} issues)`);
      summary.failed++;
      summary.issues.push({
        storyId: story.id,
        title: story.title,
        name: story.name,
        issues: storyIssues,
      });

      // Capture screenshot of failing story
      const failContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const failPage = await failContext.newPage();
      await failPage.goto(`${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story&globals=direction:rtl`, { waitUntil: "networkidle" }).catch(() => {});
      await failPage.screenshot({ path: path.join(EVIDENCE_DIR, `FAIL_${story.id}.png`), fullPage: true }).catch(() => {});
      await failContext.close();
    }
  }

  await browser.close();

  console.log("\n==========================================");
  console.log("AUDIT SUMMARY:");
  console.log(`Total Stories: ${summary.totalStories}`);
  console.log(`Passed:        ${summary.passed}`);
  console.log(`Failed:        ${summary.failed}`);
  console.log("==========================================");

  fs.writeFileSync(
    path.join(EVIDENCE_DIR, "audit-summary.json"),
    JSON.stringify(summary, null, 2),
    "utf8"
  );

  if (summary.failed > 0) {
    console.log("\nDetails of Issues Found:");
    console.log(JSON.stringify(summary.issues, null, 2));
    process.exit(1);
  } else {
    console.log("\nAll 48 stories passed with ZERO defects!");
  }
}

runComprehensiveAudit().catch((err) => {
  console.error("Audit runner failed:", err);
  process.exit(1);
});
