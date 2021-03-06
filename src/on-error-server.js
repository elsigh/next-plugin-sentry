import { captureException, flush, Handlers, withScope } from "@sentry/node";
import getConfig from "next/config";

const { parseRequest } = Handlers;

export default async function onErrorServer({ err, req, res }) {
  console.log("on-error-server");

  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
  const sentryTimeout =
    serverRuntimeConfig.sentryTimeout ||
    publicRuntimeConfig.sentryTimeout ||
    2000;

  withScope((scope) => {
    if (req) {
      scope.addEventProcessor((event) =>
        parseRequest(event, req, {
          // 'cookies' and 'query_string' use `dynamicRequire` which has a bug in SSR envs right now — Kamil
          request: ["data", "headers", "method", "url"],
        })
      );
    }
    captureException(err);
  });

  await flush(sentryTimeout);
}
