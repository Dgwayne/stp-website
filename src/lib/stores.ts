/**
 * The three store listings, in one place. The hero, the closing download
 * section, the nav and the reviews section all link to these, and a typo in
 * one copy of a store URL is a dead purchase link nobody notices.
 */
export const STORE_LINKS = {
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.dustin.spottertools",
  appStore: "https://apps.apple.com/us/app/spotter-tools-pro/id6775985245",
  microsoft: "https://apps.microsoft.com/detail/9NFQK1X16KZS",
} as const;

export const PLAY_PACKAGE = "com.dustin.spottertools";
export const APPLE_APP_ID = "6775985245";

export const PRICE = "$19.99";
