/**
 * Whitelist URL validation utilities
 */

/**
 * Check if an origin URL matches any whitelist URL
 * Whitelist URLs can be subpaths with wildcard matching implied
 *
 * Examples:
 * - Whitelist: "https://example.com/jobs" matches "https://example.com/jobs/123"
 * - Whitelist: "https://example.com" matches "https://example.com/any/path"
 * - Whitelist: "https://example.com/careers" matches "https://example.com/careers/apply"
 */
export function isOriginWhitelisted(
  origin: string,
  whitelistUrls: string[]
): boolean {
  if (!whitelistUrls || whitelistUrls.length === 0) {
    return false; // Require at least one entry
  }

  if (!origin) {
    return false;
  }

  try {
    const originUrl = new URL(origin);

    // Check each whitelist URL
    for (const whitelistUrl of whitelistUrls) {
      if (!whitelistUrl || whitelistUrl.trim() === "") {
        continue;
      }

      try {
        const whitelistUrlObj = new URL(whitelistUrl.trim());

        // Check protocol and hostname match
        if (
          originUrl.protocol !== whitelistUrlObj.protocol ||
          originUrl.hostname !== whitelistUrlObj.hostname
        ) {
          continue;
        }

        // Check if origin path starts with whitelist path (subpath matching)
        const whitelistPath = whitelistUrlObj.pathname.endsWith("/")
          ? whitelistUrlObj.pathname.slice(0, -1)
          : whitelistUrlObj.pathname;
        const originPath = originUrl.pathname;

        // If whitelist path is root, it matches all paths
        if (whitelistPath === "" || whitelistPath === "/") {
          return true;
        }

        // Check if origin path starts with whitelist path
        if (
          originPath === whitelistPath ||
          originPath.startsWith(whitelistPath + "/")
        ) {
          return true;
        }
      } catch (e) {
        // Invalid whitelist URL, skip it
        continue;
      }
    }

    return false;
  } catch (e) {
    // Invalid origin URL
    return false;
  }
}

