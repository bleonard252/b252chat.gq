/*
 Copyright 2015 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

'use strict';

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
const CACHE_VERSION = 1;
let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};
const OFFLINE_URL = 'data:text/html;charset=utf-8;base64,PCFkb2N0eXBlIGh0bWw+DQo8IS0tDQpDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLg0KDQpMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgIkxpY2Vuc2UiKTsNCnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4NCllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdA0KDQogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMA0KDQpVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlDQpkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAiQVMgSVMiIEJBU0lTLA0KV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuDQpTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kDQpsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS4NCi0tPg0KPGh0bWwgbGFuZz0iZW4iPg0KICA8aGVhZD4NCiAgICA8bWV0YSBjaGFyc2V0PSJ1dGYtOCI+DQogICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4NCiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEiPg0KICAgIDx0aXRsZT5Tb3JyeSE8L3RpdGxlPg0KICAgIDxzdHlsZT4NCiAgICAgIGJvZHkgew0KICAgICAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjsNCiAgICAgICAgZm9udC1zaXplOiAxLjI1ZW07DQogICAgICAgIG1hcmdpbjogM2VtIDNlbSAwIDNlbTsNCiAgICAgIH0NCiAgICAgIA0KICAgICAgI29mZmxpbmUtaWNvbiB7DQogICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICAgICAgdG9wOjA7DQogICAgICAgIGxlZnQ6IDA7DQogICAgICAgIG1heC13aWR0aDogMTAwdnc7DQogICAgICAgIG1heC1oZWlnaHQ6IDEwMHZoOw0KICAgICAgICBvcGFjaXR5OiAwLjA1Ow0KICAgICAgfQ0KICAgIDwvc3R5bGU+DQogIDwvaGVhZD4NCg0KICA8Ym9keT4NCiAgICA8aDE+U29ycnkhPC9oMT4NCiAgICA8cD5XZSB3ZXJlIHVuYWJsZSB0byBsb2FkIHRoZSBwYWdlIHlvdSByZXF1ZXN0ZWQuPC9wPg0KICAgIDxwPlBsZWFzZSBjaGVjayB5b3VyIG5ldHdvcmsgY29ubmVjdGlvbiBhbmQgdHJ5IGFnYWluLjwvcD4NCg0KICAgIDxzdmcgaWQ9Im9mZmxpbmUtaWNvbiIgdmlld0JveD0iMCwgMCwgMjQsIDI0Ij4NCiAgICAgIDxnPg0KICAgICAgICA8cGF0aCBkPSJNMjMuNjQgN2MtLjQ1LS4zNC00LjkzLTQtMTEuNjQtNC0xLjUgMC0yLjg5LjE5LTQuMTUuNDhMMTguMTggMTMuOCAyMy42NCA3em0tNi42IDguMjJMMy4yNyAxLjQ0IDIgMi43MmwyLjA1IDIuMDZDMS45MSA1Ljc2LjU5IDYuODIuMzYgN2wxMS42MyAxNC40OS4wMS4wMS4wMS0uMDEgMy45LTQuODYgMy4zMiAzLjMyIDEuMjctMS4yNy0zLjQ2LTMuNDZ6Ij48L3BhdGg+DQogICAgICA8L2c+DQogICAgPC9zdmc+DQogIDwvYm9keT4NCjwvaHRtbD4=';

function createCacheBustedRequest(url) {
  let request = new Request(url, {cache: 'reload'});
  // See https://fetch.spec.whatwg.org/#concept-request-mode
  // This is not yet supported in Chrome as of M48, so we need to explicitly check to see
  // if the cache: 'reload' option had any effect.
  if ('cache' in request) {
    return request;
  }

  // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
  let bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(bustedUrl);
}

self.addEventListener('install', event => {
  event.waitUntil(
    // We can't use cache.add() here, since we want OFFLINE_URL to be the cache key, but
    // the actual URL we end up requesting might include a cache-busting parameter.
    fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
      return caches.open(CURRENT_CACHES.offline).then(function(cache) {
        return cache.put(OFFLINE_URL, response);
      });
    })
  );
});

self.addEventListener('activate', event => {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names,
            // then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  // request.mode of 'navigate' is unfortunately not supported in Chrome
  // versions older than 49, so we need to include a less precise fallback,
  // which checks for a GET request with an Accept: text/html header.
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch(error => {
        // The catch is only triggered if fetch() throws an exception, which will most likely
        // happen due to the server being unreachable.
        // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
        // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
        // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(OFFLINE_URL);
      })
    );
  }

  // If our if() condition is false, then this fetch handler won't intercept the request.
  // If there are any other fetch handlers registered, they will get a chance to call
  // event.respondWith(). If no fetch handlers call event.respondWith(), the request will be
  // handled by the browser as if there were no service worker involvement.
});
