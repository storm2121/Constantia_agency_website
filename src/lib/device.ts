const MOBILE_UA_REGEX =
  /iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|IEMobile|Opera Mini|Mobile Safari|Mobile\//i;

export function isMobileUA(userAgent: string): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_REGEX.test(userAgent);
}

export const MOBILE_BREAKPOINT_PX = 1024;
export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX - 0.02}px)`;
