export const SOCIAL_PLATFORMS = [
  "Instagram",
  "X",
  "Facebook",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Strava",
  "Threads",
  "Snapchat",
] as const;

const HANDLE = /^[A-Za-z0-9._-]{1,80}$/;

export function cleanHandle(handle: string) {
  return handle.trim().replace(/^@+/, "");
}

export function isValidHandle(handle: string) {
  return HANDLE.test(cleanHandle(handle));
}

export function formatSocial(platform: string, handle: string) {
  return `${platform} @${cleanHandle(handle)}`;
}

export function isKnownSocial(value: string) {
  const platform = SOCIAL_PLATFORMS.find((item) => value.startsWith(`${item} @`));
  if (!platform) return false;
  return isValidHandle(value.slice(platform.length + 2));
}
