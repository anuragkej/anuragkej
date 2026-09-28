// Usage: node scripts/e2e.mjs [baseUrl] [screenshotDir]
// Needs puppeteer-core and a Chrome binary (CHROME_PATH, default /usr/local/bin/google-chrome).
import fs from "node:fs"
import puppeteer from "puppeteer-core"

const base = process.argv[2] ?? "http://localhost:3000"
const shots = process.argv[3] ?? "/tmp/psych5612-e2e"
fs.mkdirSync(shots, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1440, height: 900 },
})
const page = await browser.newPage()
const errors = []
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`))
page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`))

let failures = 0
function check(ok, label) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`)
  if (!ok) failures++
}
const text = () => page.evaluate(() => document.body.innerText)
const shot = (name) => page.screenshot({ path: `${shots}/${name}.png` })
async function clickText(selector, label) {
  const handles = await page.$$(selector)
  for (const h of handles) {
    if ((await h.evaluate((el) => el.textContent?.trim())) === label) return h.click()
  }
  throw new Error(`no ${selector} with text ${label}`)
}
const pause = (ms = 250) => new Promise((r) => setTimeout(r, ms))

await page.goto(base, { waitUntil: "networkidle0" })
check((await page.$$eval('a[href^="/learn/"]', (a) => new Set(a.map((x) => x.getAttribute("href"))).size)) === 13, "home links all 13 chapters")
check((await text()).includes("University Hall 047"), "home shows exam room")
await shot("01-home")

await page.goto(`${base}/learn/sequential-circuits`, { waitUntil: "networkidle0" })
check((await page.$$("figure")).length === 4, "chapter 9 renders 4 widgets")
await clickText("button", "Clock tick")
await page.click('button[aria-label="Sensor TB"]')
await clickText("button", "Clock tick")
await clickText("button", "Clock tick")
const fsm = await page.$eval('svg[aria-label^="Traffic-light state diagram"]', (s) => s.getAttribute("aria-label"))
check(fsm.includes("Current state S2"), `practice task 6 trace ends in S2 (${fsm})`)
const traffic = await page.$('svg[aria-label^="Traffic-light state diagram"]')
await traffic.evaluate((el) => el.closest("figure").scrollIntoView({ block: "center" }))
await pause()
await shot("02-traffic-fsm")
const regBefore = await page.$eval('[aria-label^="Register Q"]', (el) => el.getAttribute("aria-label"))
await page.click('[aria-label^="D at step 2 "]')
const regAfter = await page.$eval('[aria-label^="Register Q"]', (el) => el.getAttribute("aria-label"))
check(regBefore !== regAfter, "flipping D at the rising edge changes register Q")
await clickText("button", "Mark chapter as studied")
await pause()
check((await text()).includes("Studied"), "chapter marked as studied")

await page.goto(`${base}/learn/digital-abstraction`, { waitUntil: "networkidle0" })
const noise = await page.$('svg[aria-label^="Voltage axis"]')
await noise.evaluate((el) => el.closest("figure").scrollIntoView({ block: "center" }))
await clickText("button", "0.5 V")
check((await text()).includes("no guaranteed Boolean interpretation"), "0.5 V reads as undefined")
await shot("03-noise-margins")

await page.goto(`${base}/questions`, { waitUntil: "networkidle0" })
check((await page.$$("article[id^=q]")).length === 23, "question bank lists 23 questions")
await page.type("#q1 textarea", "Claim 1: minds are distinct from bodies")
await clickText("#q1 button", "Reveal model answer")
await pause()
check((await page.$eval("#q1", (el) => el.innerText)).includes("immaterial mental substance"), "Q1 model answer revealed")
await clickText("#q1 button", "Shaky")
await clickText("button", "Shaky or missed")
await pause()
check((await page.$$("article[id^=q]")).length === 1, "shaky filter shows only Q1")
await page.evaluate(() => window.scrollTo(0, 0))
await shot("04-question-bank")
await clickText("button", "Mock set of 8")
await pause()
check((await page.$$("article[id^=q]")).length === 8, "mock set shows 8 questions")
await page.reload({ waitUntil: "networkidle0" })
check((await page.$eval("#q1 textarea", (el) => el.value)).startsWith("Claim 1"), "Q1 draft persists across reload")

await page.goto(`${base}/drill?tab=mistakes`, { waitUntil: "networkidle0" })
await clickText("button", "A.Biology")
await pause()
check((await text()).includes("The conventional six are psychology"), "sample MC gives feedback")
await shot("05-drills-mistakes")
for (const tab of ["12 distinctions", "10 practice tasks", "Chapter recall"]) {
  await clickText('[role="tab"]', tab)
  await pause(400)
}
check((await text()).includes("State both Cartesian claims"), "recall tab lists chapter prompts")

await page.goto(`${base}/`, { waitUntil: "networkidle0" })
await page.keyboard.down("Control")
await page.keyboard.press("k")
await page.keyboard.up("Control")
await pause(400)
await page.keyboard.type("functional equivalence")
await pause(400)
await shot("06-search")
await page.keyboard.press("Enter")
await page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {})
check(page.url().includes("/learn/turing-machines#functional-equivalence"), `search navigates (${page.url()})`)

await page.click('button[aria-label="Toggle dark mode"]')
await page.goto(`${base}/learn/combinatorial-circuits`, { waitUntil: "networkidle0" })
check(await page.evaluate(() => document.documentElement.classList.contains("dark")), "dark mode persists")
const gates = await page.$('button[aria-label="Input A"]')
await gates.evaluate((el) => el.closest("figure").scrollIntoView({ block: "center" }))
await gates.click()
await page.click('button[aria-label="Input B"]')
await pause()
check((await text()).includes("1 + 1 = 2·1 + 0"), "half-adder shows 1 + 1 = 2·1 + 0")
await shot("07-gates-dark")

await page.goto(`${base}/people`, { waitUntil: "networkidle0" })
await clickText("li button", "René Descartes")
await pause()
check((await text()).includes("systematic doubt"), "Descartes paragraph revealed")
await shot("08-people-dark")

await page.goto(`${base}/scope`, { waitUntil: "networkidle0" })
check((await text()).includes("736-753"), "scope page includes source appendix index")

for (const path of ["/learn/minds-and-dualism", "/learn/naturalism-and-damaged-brains", "/learn/turing-test", "/learn/chinese-room"]) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle0" })
}
await page.setViewport({ width: 390, height: 844 })
await page.goto(`${base}/learn/minds-and-dualism`, { waitUntil: "networkidle0" })
await shot("09-mobile-chapter")

check(errors.length === 0, `no page or console errors${errors.length ? `: ${errors.join(" | ")}` : ""}`)
await browser.close()
console.log(failures ? `${failures} failed` : "all checks passed")
process.exit(failures ? 1 : 0)
