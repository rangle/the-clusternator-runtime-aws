/**
 * @returns {string}
 */
export function buildNumber() {
  return process.env.CIRCLE_BUILD_NUM || '0';
}

/**
 * @returns {string}
 */
export function prNumber() {
  return process.env.CIRCLE_PR_NUMBER || '0';
}

/**
 * @returns {string}
 */
export function sharedKey() {
  return process.env.CLUSTERNATOR_SHARED_KEY || '';
}
