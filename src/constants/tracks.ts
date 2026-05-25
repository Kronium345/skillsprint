export type TrackSlug =
  | 'generative-ai'
  | 'data-analytics'
  | 'cybersecurity'
  | 'software-development'
  | 'digital-marketing'
  | 'career-development'
  | 'productivity';

export type Track = {
  slug: TrackSlug;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  moduleOrder: string[];
};

export const TRACKS: Track[] = [
  {
    slug: 'generative-ai',
    title: 'Generative AI & Prompt Engineering',
    subtitle: 'ChatGPT, prompts, agents, and AI workflows',
    icon: 'sparkles',
    color: '#8B5CF6',
    moduleOrder: ['basics', 'prompt-engineering', 'workflows', 'agents-apis'],
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics',
    subtitle: 'Excel, SQL, dashboards, and Python for data',
    icon: 'bar-chart',
    color: '#4F8CFF',
    moduleOrder: ['excel', 'sql', 'visualization', 'python-analytics'],
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    subtitle: 'Privacy, phishing, and security hygiene',
    icon: 'shield',
    color: '#EF4444',
    moduleOrder: ['fundamentals', 'networks', 'threats', 'ethical-basics'],
  },
  {
    slug: 'software-development',
    title: 'Software Development',
    subtitle: 'HTML, JS, React, APIs, and Git',
    icon: 'code-slash',
    color: '#22D3EE',
    moduleOrder: ['web-basics', 'javascript', 'react', 'apis-git'],
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    subtitle: 'SEO, content, social, and AI for marketing',
    icon: 'megaphone',
    color: '#F97316',
    moduleOrder: ['seo', 'content', 'social', 'analytics'],
  },
  {
    slug: 'career-development',
    title: 'Career Development',
    subtitle: 'CV, LinkedIn, interviews, and portfolios',
    icon: 'briefcase',
    color: '#10B981',
    moduleOrder: ['cv-linkedin', 'interviews', 'networking', 'branding'],
  },
  {
    slug: 'productivity',
    title: 'Productivity & Business',
    subtitle: 'Notion, AI systems, agile, and leadership',
    icon: 'rocket',
    color: '#A78BFA',
    moduleOrder: ['tools', 'ai-productivity', 'communication', 'agile'],
  },
];

export function getTrackBySlug(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}
