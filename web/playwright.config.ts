import { defineConfig } from "@playwright/test";

const port = 3200;

// Runs against the production build: `npm run test:e2e` builds first.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    locale: "pt-PT",
    // Tests start as a visitor who already refused cookies, so the banner is not in the way.
    // The cookie tests clear this and start from a first visit.
    storageState: {
      cookies: [],
      origins: [{ origin: `http://localhost:${port}`, localStorage: [{ name: "cookies", value: "refused" }] }],
    },
  },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    env: {
      // Deliberately invalid: the form reaches Resend, is refused, and no email is ever sent.
      RESEND_API_KEY: "re_invalid_key_for_tests",
      CONTACT_FROM_EMAIL: "Teste <teste@example.com>",
    },
  },
});
