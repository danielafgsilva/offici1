import { expect, test, type Page } from "@playwright/test";

const widths = [375, 430, 768, 1024, 1440, 1920];
const routes = [
  "/",
  "/servicos",
  "/servicos/contabilidade",
  "/sobre-nos",
  "/equipa",
  "/carreiras",
  "/contactos",
  "/politica-de-privacidade",
  "/obrigado",
];

// Collects anything that should not happen during a normal visit.
function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`exception: ${error.message}`));
  page.on("requestfailed", (request) => {
    // Next cancels in-flight prefetches when the visitor navigates away; that is not a failure.
    if (request.failure()?.errorText !== "net::ERR_ABORTED") problems.push(`failed: ${request.url()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`);
  });
  return problems;
}

// The bar arrives once the page is scrolled a little; on arrival at the top only the menu button is there
const reveal = async (page: Page) => {
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(page.getByRole("banner")).toBeInViewport();
};

// Opens a dropdown (a Base UI select) and picks an option, the way a visitor does
const choose = async (page: Page, label: string, option: string) => {
  await page.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: option }).click();
};

const overflows = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

for (const width of widths) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of routes) {
      test(`${route} renders cleanly`, async ({ page }) => {
        const problems = watch(page);
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.getByRole("banner")).toBeVisible();
        await expect(page.getByRole("contentinfo")).toBeVisible();
        expect(await overflows(page)).toBe(false);

        // A direct refresh gives the same page
        await page.reload();
        await expect(page.locator("h1")).toBeVisible();
        expect(problems).toEqual([]);
      });
    }

    test("unknown address shows the 404 page", async ({ page }) => {
      const response = await page.goto("/pagina-que-nao-existe");
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Não encontrámos esta página.");
      const main = page.locator("main");
      await expect(main.getByRole("link", { name: "Página inicial" })).toBeVisible();
      await expect(main.getByRole("link", { name: "Serviços" })).toBeVisible();
      await expect(main.getByRole("link", { name: "Contactos" })).toBeVisible();
      expect(await overflows(page)).toBe(false);
    });
  });
}

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("header links and active state", async ({ page }) => {
    const problems = watch(page);
    await page.goto("/");
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Principal" });
    await reveal(page);

    for (const [name, path] of [
      ["Serviços", "/servicos"],
      ["Sobre nós", "/sobre-nos"],
      ["Equipa", "/equipa"],
      ["Carreiras", "/carreiras"],
      ["Contactos", "/contactos"],
    ]) {
      await nav.getByRole("link", { name }).click();
      await expect(page).toHaveURL(path);
      await reveal(page);
      await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
    }

    // "Início" is current on the homepage only
    await nav.getByRole("link", { name: "Início" }).click();
    await expect(page).toHaveURL("/");
    await reveal(page);
    await expect(nav.getByRole("link", { name: "Início" })).toHaveAttribute("aria-current", "page");
    await expect(nav.locator("[aria-current=page]")).toHaveCount(1);
    expect(problems).toEqual([]);
  });

  test("service journey: home → service → related → breadcrumb → back and forward", async ({ page }) => {
    const problems = watch(page);
    await page.goto("/");
    // The services drift sideways; focusing a card stops the row, then Enter follows it
    await page.locator("main").getByRole("link", { name: /^Fiscalidade/ }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/servicos/fiscalidade");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fiscalidade");

    const breadcrumbs = page.getByRole("navigation", { name: "Localização" });
    await expect(breadcrumbs.locator("[aria-current=page]")).toHaveText("Fiscalidade");

    await page.locator("main").getByRole("link", { name: /^Contabilidade/ }).click();
    await expect(page).toHaveURL("/servicos/contabilidade");

    await page.getByRole("navigation", { name: "Localização" }).getByRole("link", { name: "Serviços" }).click();
    await expect(page).toHaveURL("/servicos");

    await page.goBack();
    await expect(page).toHaveURL("/servicos/contabilidade");
    await page.goBack();
    await expect(page).toHaveURL("/servicos/fiscalidade");
    await page.goForward();
    await expect(page).toHaveURL("/servicos/contabilidade");

    await page.getByRole("link", { name: "Fale connosco sobre este serviço" }).click();
    await expect(page).toHaveURL("/contactos");
    expect(problems).toEqual([]);
  });

  test("privacy policy is linked from the footer and the form", async ({ page }) => {
    await page.goto("/contactos");
    await page.locator("form").getByRole("link", { name: "política de privacidade" }).click();
    await expect(page).toHaveURL("/politica-de-privacidade");
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Política de privacidade" }).click();
    await expect(page).toHaveURL("/politica-de-privacidade");
  });

  test("thank-you page is kept out of search results", async ({ page }) => {
    await page.goto("/obrigado");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    const sitemap = await (await page.request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("obrigado");
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("menu opens, traps focus, closes with Escape and navigates", async ({ page }) => {
    const problems = watch(page);
    await page.goto("/");
    const open = page.getByRole("button", { name: "Abrir menu" });
    const dialog = page.getByRole("dialog", { name: "Menu" });

    await open.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Fechar menu" })).toBeFocused();

    // Focus stays inside the open menu
    for (let step = 0; step < 12; step++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        return active === document.body || !!active?.closest("dialog");
      });
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();

    await open.click();
    await dialog.getByRole("link", { name: "Equipa" }).click();
    await expect(page).toHaveURL("/equipa");
    await expect(dialog).toBeHidden();

    await open.click();
    await dialog.getByRole("link", { name: "Marque uma reunião" }).click();
    await expect(page).toHaveURL("/contactos");
    expect(problems).toEqual([]);
  });
});

test.describe("contact form", () => {
  test.use({ viewport: { width: 1024, height: 900 } });

  test("empty required fields are stopped by the browser", async ({ page }) => {
    await page.goto("/contactos");
    await page.getByRole("button", { name: "Quero ser contactado" }).click();
    await expect(page).toHaveURL("/contactos");
    expect(await page.locator("#name").evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  });

  test("server validation shows accessible errors and keeps what was typed", async ({ page }) => {
    await page.goto("/contactos");
    await choose(page, "Fala em nome de", "Particular");
    await page.getByLabel("Nome", { exact: true }).fill("Teste Automático");
    await page.getByLabel("Email").fill("teste@example.com");
    await page.getByLabel("Telefone").fill("abc");
    await page.getByLabel("Sobre o que quer falar?").fill("curto");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Quero ser contactado" }).click();

    // Scoped to the form: Next.js adds its own empty role="alert" route announcer to every page
    await expect(page.locator("form").getByRole("alert")).toHaveText("Verifique os campos assinalados.");
    const phone = page.getByLabel("Telefone");
    await expect(phone).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(`#${await phone.getAttribute("aria-describedby")}`)).toHaveText(
      "Verifique o número de telefone.",
    );
    await expect(page.getByLabel("Sobre o que quer falar?")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Teste Automático");
    await expect(page.getByLabel("Email")).toHaveValue("teste@example.com");
  });

  test("a telephone or an email is required, and a telephone alone is enough", async ({ page }) => {
    await page.goto("/contactos");
    await choose(page, "Fala em nome de", "Particular");
    await page.getByLabel("Nome", { exact: true }).fill("Teste Automático");
    await page.getByLabel("Sobre o que quer falar?").fill("Mensagem de teste automático do formulário.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Quero ser contactado" }).click();
    await expect(page.locator("#phone-error")).toHaveText("Indique um telefone ou um email para o podermos contactar.");

    await page.getByLabel("Telefone").fill("912 345 678");
    await choose(page, "Melhor horário", "À tarde");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Quero ser contactado" }).click();
    // Validation passed: the send itself is refused by the test key, so the fallback shows
    await expect(page.locator("form").getByRole("alert")).toContainText("Não foi possível enviar o seu pedido");
    await expect(page.getByRole("combobox", { name: "Melhor horário" })).toContainText("À tarde");
  });

  test("a refused send shows the fallback and never the thank-you page", async ({ page }) => {
    await page.goto("/contactos");
    await choose(page, "Fala em nome de", "Particular");
    await page.getByLabel("Nome", { exact: true }).fill("Teste Automático");
    await page.getByLabel("Email").fill("teste@example.com");
    await page.getByLabel("Sobre o que quer falar?").fill("Mensagem de teste automático do formulário.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Quero ser contactado" }).click();

    await expect(page.locator("form").getByRole("alert")).toContainText("Não foi possível enviar o seu pedido");
    await expect(page).toHaveURL("/contactos");
    await expect(page.getByLabel("Sobre o que quer falar?")).toHaveValue("Mensagem de teste automático do formulário.");
  });

  test("an accepted submission lands on the thank-you page", async ({ page }) => {
    // The honeypot takes the same redirect as a real accepted send, without sending anything.
    await page.goto("/contactos");
    await page.locator("#website").evaluate((input: HTMLInputElement) => (input.value = "http://spam.example"));
    await page.locator("form").evaluate((form: HTMLFormElement) => {
      form.noValidate = true;
      form.requestSubmit();
    });
    await expect(page).toHaveURL("/obrigado");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Obrigado. Recebemos o seu pedido.");
    await page.locator("main").getByRole("link", { name: "Ver serviços" }).click();
    await expect(page).toHaveURL("/servicos");
  });
});

test.describe("keyboard", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("skip link is first and moves focus to the content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Saltar para o conteúdo" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
    await page.keyboard.press("Tab");
    // The hero button: the first link inside the content
    await expect(page.locator("main").getByRole("link", { name: "Marque uma reunião" }).first()).toBeFocused();
  });

  test("every focusable element shows a focus ring and Tab never gets stuck", async ({ page }) => {
    await page.goto("/");
    const seen: string[] = [];
    for (let step = 0; step < 60; step++) {
      await page.keyboard.press("Tab");
      const current = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active || active === document.body) return null;
        const style = getComputedStyle(active);
        // Two buttons share the name "Marque uma reunião", so compare the elements themselves
        const state = window as unknown as { previousFocus?: Element };
        const stuck = state.previousFocus === active;
        state.previousFocus = active;
        return {
          label: `${active.tagName}:${active.textContent?.trim().slice(0, 30)}`,
          ring: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2,
          stuck,
        };
      });
      if (!current) break; // focus left the page: no trap
      expect(current.ring, `focus ring on ${current.label}`).toBe(true);
      expect(current.stuck, `focus stuck on ${current.label}`).toBe(false);
      seen.push(current.label);
    }
    expect(seen.length).toBeGreaterThan(20);
    expect(seen.at(-1)).toContain("Daniela Silva");
  });

  test("the contact form can be completed and sent with the keyboard alone", async ({ page }) => {
    await page.goto("/contactos", { waitUntil: "networkidle" }); // keys need the page's scripts to have started
    // The dropdown opens with Enter, typing a letter jumps to an option and Enter chooses it
    await page.getByRole("combobox", { name: "Fala em nome de" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeVisible(); // typing before the list is open would be lost
    await page.keyboard.type("P");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("combobox", { name: "Fala em nome de" })).toContainText("Particular");
    // Focus returns to the dropdown once its list has closed; Tab before that would start from the page's top
    await expect(page.getByRole("combobox", { name: "Fala em nome de" })).toBeFocused();
    await page.keyboard.press("Tab"); // services: left empty
    await page.keyboard.press("Tab");
    await page.keyboard.type("Teste Teclado");
    await page.keyboard.press("Tab");
    await page.keyboard.type("abc"); // telephone
    await page.keyboard.press("Tab");
    await page.keyboard.type("teclado@example.com");
    await page.keyboard.press("Tab"); // best time to call: left as it is
    await page.keyboard.press("Tab");
    await page.keyboard.type("Mensagem escrita apenas com o teclado.");
    // Tab on to each control in turn (documents, then the consent box, then the privacy link, then the button)
    const reach = async (control: ReturnType<Page["locator"]>) => {
      for (let step = 0; step < 4 && !(await control.evaluate((element) => element === document.activeElement)); step++) {
        await page.keyboard.press("Tab");
      }
      await expect(control).toBeFocused();
    };
    await reach(page.getByRole("checkbox"));
    await page.keyboard.press("Space");
    await expect(page.getByRole("checkbox")).toBeChecked();
    const submit = page.getByRole("button", { name: "Quero ser contactado" });
    await reach(submit);
    await page.keyboard.press("Enter");
    await expect(page.locator("form").getByRole("alert")).toHaveText("Verifique os campos assinalados.");
    await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Teste Teclado");
  });

  test("FAQ answers open with the keyboard", async ({ page }) => {
    await page.goto("/contactos");
    const first = page.locator("details").first();
    await first.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("open", "");
    await expect(first.locator("p")).toBeVisible();
  });
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`homepage answers its promise and shows the team (motion: ${reducedMotion})`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion });
    await page.goto("/");
    const hero = page.locator("main section").first();

    await expect(hero.locator("h1")).toBeVisible();
    await expect(hero.getByRole("link", { name: "Marque uma reunião" })).toBeVisible();
    await expect(hero.locator("h1")).toBeInViewport();

    // The team: five cards, each a link to the team page (the copies for the endless loop are hidden from assistive technology)
    const team = page.getByRole("region", { name: "Equipa", exact: true });
    await expect(team.getByRole("link")).toHaveCount(5);
    await expect(team).toContainText("Isabel");
    await page.close();
  });
}

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });

  test("nothing rises or opens, and everything is still shown", async ({ page }) => {
    await page.goto("/");
    const milliseconds = (value: string) => parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);

    // The names are in place immediately instead of rising into view
    const name = page.locator("main .rise").first();
    await expect(name).toBeVisible();
    expect(await name.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");

    // The row of services does not drift, and the first-visit intro never shows
    const track = page.locator(".marquee-track").first();
    expect(await track.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
    expect(await page.locator(".intro").evaluate((element) => getComputedStyle(element).display)).toBe("none");

    const button = await page.locator("main .btn-primary").first().evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(milliseconds(button.split(",")[0])).toBeLessThan(1);

    await page.getByRole("button", { name: "Abrir menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  });
});

test.describe("careers application form", () => {
  test.use({ viewport: { width: 1024, height: 900 } });

  const pdf = { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n% teste automático\n%%EOF\n") };
  const fill = async (page: Page) => {
    await page.goto("/carreiras");
    await page.getByLabel("Nome", { exact: true }).fill("Teste Automático");
    await page.getByLabel("Email").fill("teste@example.com");
  };
  const alert = (page: Page) => page.locator("form").getByRole("alert");

  test("a spontaneous application is always possible and links to the privacy policy", async ({ page }) => {
    await page.goto("/carreiras");
    await expect(page.getByRole("heading", { name: "Vagas em aberto" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Vaga" })).toContainText("Candidatura espontânea");
    await expect(page.locator("form").getByRole("link", { name: "política de privacidade" })).toHaveAttribute(
      "href",
      "/politica-de-privacidade",
    );
  });

  test("vacancies: the empty state, or each open vacancy with a way to apply for it", async ({ page }) => {
    await page.goto("/carreiras");
    const apply = page.getByRole("link", { name: /Ver vaga e candidatar-me/ });
    const count = await apply.count();
    if (count === 0) {
      await expect(page.getByText("Neste momento não temos vagas em aberto.")).toBeVisible();
      await expect(page.locator("script[type='application/ld+json']", { hasText: "JobPosting" })).toHaveCount(0);
      return;
    }
    // Every vacancy card leads to its own page, which carries the form for it
    await apply.first().click();
    await expect(page).toHaveURL(/\/carreiras\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
  });

  test("a file that only claims to be a PDF is refused by the server", async ({ page }) => {
    await fill(page);
    await page.locator("#cv").setInputFiles({ ...pdf, buffer: Buffer.from("MZ this is not a pdf") });
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Enviar candidatura" }).click();

    await expect(alert(page)).toHaveText("Verifique os campos assinalados.");
    const cv = page.locator("#cv");
    await expect(cv).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#cv-error")).toHaveText("O currículo tem de ser um ficheiro PDF.");
    await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Teste Automático");
  });

  test("other file types, a missing consent and a closed vacancy are refused by the server", async ({ page }) => {
    await fill(page);
    await page.locator("#cv").evaluate((input: HTMLInputElement) => input.removeAttribute("accept"));
    await page.locator("#cv").setInputFiles({ name: "cv.docx", mimeType: "application/msword", buffer: pdf.buffer });
    await page.locator('input[name="vaga"]').evaluate((input: HTMLInputElement) => {
      input.value = "vaga-que-nao-existe";
    });
    await page.locator("form").evaluate((form: HTMLFormElement) => {
      form.noValidate = true;
      form.requestSubmit();
    });

    await expect(page.locator("#cv-error")).toHaveText("O currículo tem de ser um ficheiro PDF.");
    await expect(page.locator("#consent-error")).toHaveText("Precisamos da sua autorização para tratar a candidatura.");
    await expect(page.locator("#vaga-error")).toContainText("Esta vaga já não está aberta.");
  });

  test("an oversized CV is stopped in the browser before upload", async ({ page }) => {
    await fill(page);
    await page.locator("#cv").setInputFiles({ ...pdf, buffer: Buffer.concat([pdf.buffer, Buffer.alloc(3 * 1024 * 1024)]) });
    expect(await page.locator("#cv").evaluate((input: HTMLInputElement) => input.validationMessage)).toContain("3 MB");
  });

  test("a refused send shows the fallback and never a confirmation", async ({ page }) => {
    await fill(page);
    await page.locator("#cv").setInputFiles(pdf);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Enviar candidatura" }).click();

    await expect(alert(page)).toContainText("Não foi possível enviar a sua candidatura");
    await expect(page.getByText("Candidatura enviada.")).toHaveCount(0);
  });

  test("a bot that fills the hidden field gets the confirmation and nothing is sent", async ({ page }) => {
    await page.goto("/carreiras");
    await page.locator("#website").evaluate((input: HTMLInputElement) => (input.value = "http://spam.example"));
    await page.locator("form").evaluate((form: HTMLFormElement) => {
      form.noValidate = true;
      form.requestSubmit();
    });
    await expect(page.getByRole("status")).toContainText("Candidatura enviada.");
  });
});

test.describe("cookies", () => {
  // A first visit: no stored choice
  test.use({ viewport: { width: 1024, height: 900 }, storageState: { cookies: [], origins: [] } });

  test("nothing from Google loads until the visitor accepts, and refusing is remembered", async ({ page }) => {
    const google: string[] = [];
    page.on("request", (request) => /google|gstatic/.test(request.url()) && google.push(request.url()));

    await page.goto("/contactos");
    const banner = page.getByRole("region", { name: "Cookies" });
    await expect(banner).toBeVisible();
    await expect(page.locator("iframe")).toHaveCount(0);

    await banner.getByRole("button", { name: "Recusar" }).click();
    await expect(banner).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("button", { name: "Aceitar e mostrar o mapa" })).toBeVisible();
    await expect(banner).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Abrir no Google Maps/ })).toBeVisible();
    expect(google).toEqual([]);
    expect(await page.context().cookies()).toEqual([]);
  });

  test("accepting shows the map, and the footer link brings the choice back", async ({ page }) => {
    await page.goto("/contactos");
    await page.getByRole("region", { name: "Cookies" }).getByRole("button", { name: "Aceitar" }).click();
    await expect(page.locator("iframe")).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\?q=/);

    await page.getByRole("contentinfo").getByRole("button", { name: "Cookies" }).click();
    await expect(page.getByRole("region", { name: "Cookies" })).toBeVisible();
    await expect(page.locator("iframe")).toHaveCount(0);
  });

  test("the map can be accepted from its own placeholder", async ({ page }) => {
    await page.goto("/contactos");
    await page.getByRole("button", { name: "Aceitar e mostrar o mapa" }).click();
    await expect(page.locator("iframe")).toBeVisible();
    await expect(page.getByRole("region", { name: "Cookies" })).toHaveCount(0);
  });
});
