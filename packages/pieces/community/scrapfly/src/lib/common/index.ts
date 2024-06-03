import { HttpMethod } from '@activepieces/pieces-common';

type Headers = {
  [key: string]: string;
};

type Screenshots = {
  [key: string]: string;
};

type Param = {
  [key: string]: string;
};

export function DefineAPIParams(context: any) {
  const propsValue = context.propsValue;
  const key = context.auth as string;
  const url = propsValue.url as string;
  const asp = propsValue.asp as boolean;
  const render_js = propsValue.render_js as boolean;
  let headers = propsValue.headers as Headers;
  const body = propsValue.body as string;
  const country = propsValue.country as string;
  const proxy_pool = propsValue.proxy_pool as string;
  const auto_scroll = propsValue.auto_scroll as boolean;
  const rendering_wait = propsValue.rendering_wait as string;
  const wait_for_selector = propsValue.wait_for_selector as string;
  const timeout = propsValue.timeout as string;
  const retry = propsValue.retry as boolean;
  const js_scenario = propsValue.js_scenario as string;
  const js = propsValue.js as string;
  const format = propsValue.format as string;
  const debug = propsValue.debug as boolean;
  let screenshots = propsValue.screenshots as Screenshots;
  const screenshot_flags = propsValue.screenshot_flags as Array<string>;

  const params: Param = {
    key: key,
    url: url,
    asp: asp ? 'true' : 'false',
    render_js: render_js ? 'true' : 'false',
    proxy_pool: proxy_pool ? proxy_pool : 'public_datacenter_pool',
    auto_scroll: (render_js && auto_scroll) ? 'true' : 'false',
    retry: retry ? 'true' : 'false',
    format: format ? format : 'raw',
    debug: debug ? 'true' : 'false',
  };

  if (headers) {
    if (typeof headers === 'string') {
      headers = JSON.parse(headers) as Headers;
    }
    for (const key in headers) {
      params[`headers[${key}]`] = headers[key];
    }
  }

  if (country) {
    params[`country`] = country;
  }

  if (screenshots) {
    if (typeof screenshots === 'string') {
      screenshots = JSON.parse(screenshots) as Screenshots;
    }
    for (const key in screenshots) {
      params[`screenshots[${key}]`] = screenshots[key];
    }
  }

  if (screenshot_flags) {
    params[`screenshot_flags`] = screenshot_flags.join(', ');
  }

  if (body) {
    params[`body`] = body;
  }

  if (render_js && rendering_wait) {
    params[`rendering_wait`] = rendering_wait;
  }

  if (render_js && wait_for_selector) {
    params[`wait_for_selector`] = wait_for_selector;
  }

  if (render_js && timeout) {
    params[`timeout`] = timeout;
  }

  if (render_js && js_scenario) {
    params[`js_scenario`] = js_scenario;
  }

  if (render_js && js) {
    params[`js`] = js;
  }

  return params;
}

export function MethodToHttpMethod(method: string) {
  switch (method) {
    case 'GET':
      return HttpMethod.GET;
    case 'POST':
      return HttpMethod.POST;
    case 'PUT':
      return HttpMethod.PUT;
    case 'PATCH':
      return HttpMethod.PATCH;
    case 'DELETE':
      return HttpMethod.DELETE;
    case 'HEAD':
      return HttpMethod.HEAD;
    default:
      throw new Error('Unsupported HTTP method');
  }
}