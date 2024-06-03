import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient } from '@activepieces/pieces-common';
import { scrapflyAuth } from '../..';
import { DefineAPIParams, MethodToHttpMethod } from '../common';

export const sendWebScrapingApiRequest = createAction({
  name: 'sendWebScrapingApiRequest',
  auth: scrapflyAuth,
  displayName: 'Send Web Scraping API Request',
  description: 'Send an API request with proxies and anti-bot bypass capabilities using ScrapFly.',
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
    method: Property.Dropdown({
      displayName: 'HTTP method',
      description: 'Request HTTP method.',
      required: true,
      defaultValue: 'GET',
      refreshers: [],
      options: async () => {
        const options = [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'HEAD', value: 'HEAD' },
        ];
        return {
          disabled: false,
          options: options,
        };
      }       
    }),
    headers: Property.Object({
      displayName: 'headers',
      description: 'Request HTTP headers as an object of key-value pairs. Standard headers are managed by the asp if enabled.',
      required: false
    }),
    body: Property.LongText({
      displayName: 'body',
      description: 'HTTP request body.',
      required: false,
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
    retry: Property.Checkbox({
      displayName: 'retry',
      description: 'Whether to retry the request on failures.',
      required: false,
      defaultValue: true,
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
    let requestBody;
    if (['POST', 'PUT', 'PATCH'].includes(context.propsValue.method)) {
      requestBody = context.propsValue.body;
    } else {
      requestBody = undefined;
    }
    const res = await httpClient.sendRequest<string[]>({
      method: MethodToHttpMethod(context.propsValue.method),
      url: 'https://api.scrapfly.io/scrape',
      queryParams: params,
      body: requestBody
    });
    return res.body;
  },
});
