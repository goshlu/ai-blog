export const siteConfig = {
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || '',
  icpNumber: process.env.NEXT_PUBLIC_ICP_NUMBER?.trim() || '',
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL?.trim() || '',
};

export function getMailtoHref(email: string) {
  return `mailto:${email}`;
}

export function getHireMeMailtoHref(email: string) {
  const subject = encodeURIComponent('Hiring inquiry from your website');
  const body = encodeURIComponent([
    'Hi YSKM,',
    '',
    'I found your website and would like to discuss a role or project.',
    '',
    'Company / Team:',
    'Project scope:',
    'Timeline:',
    'Budget or compensation range:',
    '',
    'Best,',
  ].join('\n'));

  return `mailto:${email}?subject=${subject}&body=${body}`;
}
