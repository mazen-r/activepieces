import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { scrapflyAuth } from '../..';
import { DefineAPIParams } from '../common';

export const takeScreenshot = createAction({
  name: 'takeScreenshot',
  auth: scrapflyAuth,
  displayName: 'Take Screenshot',
  description: 'Take a screenshot of a web page given its URL.',
  props: {
    url: Property.LongText({
      displayName: 'URL',
      description: 'Web page URL to scrape.',
      required: true,
      defaultValue: '',
    }),
    screenshots: Property.Object({
      displayName: 'screenshots',
      description: 'Take a screenshot. You can take multiple screenshot with different format: fullpage or specific element selected via CSS Selector or XPATH. The key argument is the name of the screenshot and the value is the selector',
      required: true,
      defaultValue: { 'screenshot_one': 'fullpage', 'screenshot_two': '//div[@class="products"]' }
    }),
    screenshot_flags: Property.MultiSelectDropdown({
      displayName: 'screenshot_flags',
      description: 'Screenshot flags to customize the screenshot behavior. You can set the quality, format, and more.',
      required: false,
      refreshers: [],
      options: async () => {
        const options = [

          { label: 'Load images', value: 'load_images' },
          { label: 'Dark mode', value: 'dark_mode' },
          { label: 'Block banners', value: 'block_banners' },
          { label: 'High quality', value: 'high_quality' },
          { label: 'Print media format', value: 'print_media_format' },
        ];
        return {
          disabled: false,
          options: options,
        };
      }
    }),
    asp: Property.Checkbox({
      displayName: 'asp',
      description: 'Anti-Scraping Protection for bypassing antibot protection systems.',
      required: false,
      defaultValue: false,
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
    debug: Property.Checkbox({
      displayName: 'debug',
      description: 'Weather to enable the debug mode.',
      required: false,
      defaultValue: false,
    }),
  },
  async run(context) {
    const params = DefineAPIParams(context)
    params[`render_js`] = 'true'; // Always enable render_js with screenshots
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.GET,
      url: 'https://api.scrapfly.io/scrape',
      queryParams: params
    });
    return res.body;
  },
});
