export const siteConfig = {
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || '',
  icpNumber: process.env.NEXT_PUBLIC_ICP_NUMBER?.trim() || '',
};

export function getMailtoHref(email: string) {
  return `mailto:${email}`;
}
