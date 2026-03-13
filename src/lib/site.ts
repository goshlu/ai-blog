export interface SocialProfile {
  label: string;
  href: string;
  description: string;
}

export const siteConfig = {
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || '',
  icpNumber: process.env.NEXT_PUBLIC_ICP_NUMBER?.trim() || '',
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL?.trim() || '',
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() || '',
  xUrl: process.env.NEXT_PUBLIC_X_URL?.trim() || '',
  juejinUrl: process.env.NEXT_PUBLIC_JUEJIN_URL?.trim() || '',
  zhihuUrl: process.env.NEXT_PUBLIC_ZHIHU_URL?.trim() || '',
  leetcodeUrl: process.env.NEXT_PUBLIC_LEETCODE_URL?.trim() || '',
  v2exUrl: process.env.NEXT_PUBLIC_V2EX_URL?.trim() || '',
};

export const socialProfiles: SocialProfile[] = [
  siteConfig.githubUrl
    ? {
        label: 'GitHub',
        href: siteConfig.githubUrl,
        description: 'Repositories, commits, and open source work.',
      }
    : null,
  siteConfig.linkedinUrl
    ? {
        label: 'LinkedIn',
        href: siteConfig.linkedinUrl,
        description: 'Professional profile, experience, and hiring context.',
      }
    : null,
  siteConfig.xUrl
    ? {
        label: 'X',
        href: siteConfig.xUrl,
        description: 'Short-form technical updates and public conversations.',
      }
    : null,
  siteConfig.juejinUrl
    ? {
        label: 'Juejin',
        href: siteConfig.juejinUrl,
        description: 'Long-form Chinese technical writing and community reach.',
      }
    : null,
  siteConfig.zhihuUrl
    ? {
        label: 'Zhihu',
        href: siteConfig.zhihuUrl,
        description: 'Technical answers, essays, and broader audience presence.',
      }
    : null,
  siteConfig.leetcodeUrl
    ? {
        label: 'LeetCode',
        href: siteConfig.leetcodeUrl,
        description: 'Algorithm practice and interview preparation track record.',
      }
    : null,
  siteConfig.v2exUrl
    ? {
        label: 'V2EX',
        href: siteConfig.v2exUrl,
        description: 'Developer community activity and technical discussions.',
      }
    : null,
].filter(Boolean) as SocialProfile[];

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
