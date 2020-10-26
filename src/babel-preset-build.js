/*
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const withSourceMaps = require("@zeit/next-source-maps");

const { env } = process;

const withSentry = (opts = {}) => {
  const pluginOptions = {
    org: env.SENTRY_ORG,
    project: env.SENTRY_PROJECT,
    release:
      env.SENTRY_RELEASE ||
      env.NEXT_PUBLIC_SENTRY_RELEASE ||
      env.VERCEL_GITHUB_COMMIT_SHA ||
      env.VERCEL_GITLAB_COMMIT_SHA ||
      env.VERCEL_BITBUCKET_COMMIT_SHA,
    authToken: env.SENTRY_AUTH_TOKEN,
    ...opts,
  };

  return (nextConfig = {}) => {
    return {
      ...nextConfig,
      webpack(config, options) {
        if (!options.defaultLoaders) {
          throw new Error(
            "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
          );
        }

        const { dev } = options;

        if (!dev) {
          if (!pluginOptions.org)
            throw new Error(
              "Missing required `SENTRY_ORG` environment variable or `org` plugin option."
            );
          if (!pluginOptions.project)
            throw new Error(
              "Missing required `SENTRY_PROJECT` environment variable or `project` plugin option."
            );
          if (!pluginOptions.release)
            throw new Error(
              "Missing required `SENTRY_RELEASE` environment variable or `release` plugin option."
            );
          if (!pluginOptions.authToken)
            throw new Error(
              "Missing required `SENTRY_AUTH_TOKEN` environment variable or `authToken` plugin option."
            );

          config.plugins.push(
            new SentryWebpackPlugin({
              include: ".next",
              ignore: ["node_modules"],
              stripPrefix: ["webpack://_N_E/"], // Is it necessary? — Kamil
              urlPrefix: `~/_next`,
              ...pluginOptions,
            })
          );
        }

        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, options);
        }
        return config;
      },
    };
  };
};

const withSentrySourceMaps = (config) =>
  withSentry()(
    withSourceMaps({
      devtool: "hidden-source-map",
    })(config)
  );
*/

const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = function babelPreset(obj) {
  console.log("BABEL-PRESET-BUILD obj", JSON.stringify(obj));
  const { plugins } = obj;
  // When all the Sentry configuration env variables are available/configured
  // The Sentry webpack plugin gets pushed to the webpack plugins to build
  // and upload the source maps to sentry.
  // This is an alternative to manually uploading the source maps
  // Note: This is disabled unless the VERCEL_URL environment variable is
  // present, which is usually only during a Vercel build
  if (
    process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT &&
    process.env.SENTRY_AUTH_TOKEN &&
    process.env.VERCEL_URL
  ) {
    console.log("IN");
    // Set the SENTRY_DSN environment variable so that SentryWebpackPlugin can
    // use it
    process.env.SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

    // Use the VERCEL_URL for the release, but conform to their naming
    // restrictions: https://docs.sentry.io/product/releases/
    console.log(`VERCEL_URL: ${process.env.VERCEL_URL}`);
    const release = process.env.VERCEL_URL.replace(/\./g, "_");

    /*
    plugins.push(
      new SentryWebpackPlugin({
        include: ".next",
        stripPrefix: ["webpack://_N_E/"],
        urlPrefix: "~/_next",
        release,
      })
    );
    */
    return plugins;
  }
};
