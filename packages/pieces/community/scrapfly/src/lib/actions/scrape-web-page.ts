import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { scrapflyAuth } from '../..';
import { DefineAPIParams } from '../common';

export const scrapeWebPage = createAction({
  name: 'scrapeWebPage',
  auth: scrapflyAuth,
  displayName: 'Scrape Web Page',
  description: 'Scrape a web page as HTML, Text, or Markdown given its URL.',
  props: {
    url: Property.LongText({
      displayName: 'URL',
      description: 'Web page URL to scrape.',
      required: true,
      defaultValue: '',
    }),
    asp: Property.Checkbox({
      displayName: 'asp',
      description: 'Anti-Scraping Protection for bypassing antibot protection systems.',
      required: false,
      defaultValue: false,
    }),
    render_js: Property.Checkbox({
      displayName: 'render_js',
      description: 'Whether to enable JavaScript rendering (run a headless browser).',
      required: false,
      defaultValue: false,
    }),
    headers: Property.Object({
      displayName: 'headers',
      description: 'Request HTTP headers as an object of key-value pairs. Standard headers are managed by the asp if enabled.',
      required: false
    }),
    country: Property.ShortText({
      displayName: 'country',
      description: 'Proxy geolocation country code.',
      required: false,
      defaultValue: 'us',
    }),
    proxy_pool: Property.Dropdown({
      displayName: 'proxy_pool',
      description: 'The proxy pool to use, either datacenter or residential.',
      required: false,
      defaultValue: 'public_datacenter_pool',
      refreshers: [],
      options: async () => {
        const options = [
          { label: 'Public Datacenter Pool', value: 'public_datacenter_pool' },
          { label: 'Public Residential Pool', value: 'public_residential_pool' },
        ];
        return {
          disabled: false,
          options: options,
        };
      }
    }),
    auto_scroll: Property.Checkbox({
      displayName: 'auto_scroll',
      description: 'Whether to automatically scroll down the page by the headless browser. Requires render_js to be enabled.',
      required: false,
      defaultValue: false,
    }),
    rendering_wait: Property.Number({
      displayName: 'rendering_wait',
      description: 'Time in milliseconds for the headless browser to wait after requesting the target page.',
      required: false,
      defaultValue: 1000,
    }),
    wait_for_selector: Property.ShortText({
      displayName: 'wait_for_selector',
      description: 'XPath or CSS selector to wait for by the headless browser.',
      required: false,
      defaultValue: '',
    }),
    timeout: Property.Number({
      displayName: 'timeout',
      description: 'Timeout expressed in milliseconds, set to 150000 by default. It represents the maximum time allowed for ScrapFly to try to perform the scrape. It is prone to other settings, such as retry, rendering_wait, and wait_for_selector.',
      required: false,
      defaultValue: 150000,
    }),
    retry: Property.Checkbox({
      displayName: 'retry',
      description: 'Whether to retry the request on failures.',
      required: false,
      defaultValue: true,
    }),
    js_scenario: Property.LongText({
      displayName: 'js_scenario',
      description: 'JavaScript scenarios to execute by the headless browser, such as waits, clicking, or filling elements. It has to be URL-safe base64-encoded.',
      required: false,
      defaultValue: '',
    }),
    js: Property.LongText({
      displayName: 'js',
      description: 'JavaScript injection code for execution by the headless browser. It has to be URL-safe base64-encoded.',
      required: false,
      defaultValue: '',
    }),
    format: Property.Dropdown({
      displayName: 'format',
      description: 'By default, the format is the raw content of the scraped content, e.g: HTML, JSON, or XML, the content is left untouched. Other formats include text, and markdown (accessible by LLMs)',
      required: false,
      defaultValue: 'raw',
      refreshers: [],
      options: async () => {
        const options = [
          { label: 'Raw', value: 'raw' },
          { label: 'JSON', value: 'json' },
          { label: 'Clean HTML', value: 'clean_html' },
          { label: 'Text', value: 'text' },
          { label: 'Markdown', value: 'markdown' },
        ];
        return {
          disabled: false,
          options: options,
        };
      }
    }),
    debug: Property.Checkbox({
      displayName: 'debug',
      description: 'Weather to enable the debug mode.',
      required: false,
      defaultValue: false,
    }),
  },
  async run(context) {
    const params = DefineAPIParams(context)
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.GET,
      url: 'https://api.scrapfly.io/scrape',
      queryParams: params
    });
    return res.body;
  }
});
