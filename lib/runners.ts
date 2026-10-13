export type AdminRunner = {
  id: string;
  email: string;
  name: string;
  country: string;
  contact: string;
  socials: string;
  platform: string;
  handle: string;
  registered: string;
};

export type AdminStats = {
  total: number;
  countries: number;
  week: number;
  today: number;
};

function splitSocial(value: string) {
  const marker = value.lastIndexOf(" @");
  if (marker === -1) return { platform: "Social", handle: value };
  return {
    platform: value.slice(0, marker),
    handle: `@${value.slice(marker + 2)}`,
  };
}

export function toAdminRunner(runner: {
  id: string;
  email: string;
  name: string;
  country: string;
  contact: string;
  socials: string;
  createdAt: Date;
}): AdminRunner {
  const social = splitSocial(runner.socials);
  return {
    id: runner.id,
    email: runner.email,
    name: runner.name,
    country: runner.country,
    contact: runner.contact,
    socials: runner.socials,
    platform: social.platform,
    handle: social.handle,
    registered: new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(runner.createdAt),
  };
}
