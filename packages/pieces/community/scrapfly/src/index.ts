import { PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { scrapeWebPage } from './lib/actions/scrape-web-page';
import { sendWebScrapingApiRequest } from './lib/actions/send-web-scraping-api-request';
import { takeScreenshot } from './lib/actions/take-screenshot';

export const scrapflyAuth = PieceAuth.SecretText({
  displayName: 'Your Scrapfly API key',
  required: true,
  description: 'Use the Scrapfly API key from your profile dashboard: scrapfly.io/dashboard',
});

export const scrapfly = createPiece({
  displayName: 'Scrapfly',
  logoUrl: 'https://cdn.activepieces.com/pieces/scrapfly.png',
  auth: scrapflyAuth,
  authors: [],
  actions: [scrapeWebPage, sendWebScrapingApiRequest, takeScreenshot],
  triggers: [],
});
