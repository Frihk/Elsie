export const settings = {
  color_bg: '#F5EDE8',
  color_primary: '#4A0E0E',
  color_accent: '#6B1A1A',
  font_heading: 'Cormorant Garamond',
  font_body: 'Cormorant Garamond',
  nav_home: 'HOME',
  nav_projects: 'PROJECTS',
  nav_services: 'SERVICES',
  nav_about: 'ABOUT',
  nav_contact: 'CONTACT',
};

export const navLinks = [
  { key: 'nav_home', label: settings.nav_home, href: '/' },
  { key: 'nav_projects', label: settings.nav_projects, href: '/projects' },
  { key: 'nav_services', label: settings.nav_services, href: '/services' },
  { key: 'nav_about', label: settings.nav_about, href: '/about' },
  { key: 'nav_contact', label: settings.nav_contact, href: '/contact' },
];

export const content = {
  home: {
    brand_name: 'EIRA',
    brand_subtitle: 'EXECUTIVE OPERATIONS',
    hero_tagline: 'EIRA EXECUTIVE OPERATION',
    hero_headline: 'Reliable and Strategic Partner to HNW Founders & C-Suite/executives',
    hero_body:
      "We work with founders and executives managing complexity across entities, borders, and time zones - those who've outgrown traditional assistance and need someone who makes decisions, not just takes them.",
    hero_cta_label: 'Book a Discovery Call',
    hero_cta_link: '#contact',
    hero_image: '/portrait.jpg',
  },
  projects: {
    projects_headline: 'RESULTS DELIVERED TO CLIENT',
    projects_cta_label: 'Explore Results',
    projects_bullets: [
      'From Executive Operations Management',
      'Multi-Entity Calendar Coordination',
      'Global Travel & Logistics',
      'Executive Communication Management',
      'Cross-Border Operations',
      'Board & Investor Relations',
      'Strategic Project Management',
      'Executive Operations Consulting',
    ],
    projects_image: '/projects_portrait.jpg',
    testimonials_heading: 'Testimonials from clients',
    testimonials_subtext_1: 'Built on trust.',
    testimonials_subtext_2: 'Measured in outcomes.',
  },
  services: {
    services_label: 'CORE SERVICES',
    services_headline: 'Executive Support Designed for Productivity',
    services_body:
      'Reliable, discreet, and proactive support that keeps executive operations clear, organized, and moving without delays.',
    how_we_work_heading: 'How we work',
    core_services_heading: 'Core services',
  },
  about: {
    about_label: 'ABOUT',
    about_image: '/about_portrait.jpg',
    about_photo_caption: 'CEO AND FOUNDER OF EIRA EXECUTIVE OPERATION',
    about_bio:
      'Eira Executive Operations is a boutique executive operations firm founded by Elsie Njoroge for leaders who need discretion, structure, and strategic follow-through. The firm partners with founders, executives, and high-net-worth operators whose work moves across companies, borders, calendars, and confidential priorities.',
    efficiency_heading: 'Efficiency with discretion.',
    efficiency_body:
      'Our work combines structure, communication, and precision so every operational detail has a clear owner, a trusted process, and a calm path forward.',
    why_choose_heading: 'Why Choose Eira',
  },
  contact: {
    contact_card_heading: 'Contact',
    contact_email: 'founder@eiraexecutiveops.com',
    contact_location: 'San Francisco Bay Area / Remote',
    contact_email_me_url: 'mailto:founder@eiraexecutiveops.com',
    contact_linkedin_url: '#',
    field_label_name: 'FULL NAME',
    field_label_email: 'EMAIL',
    field_label_support: 'SUPPORT NEEDED',
    field_label_message: 'MESSAGE',
    submit_label: 'Send Message',
    footer_text: '© 2026 Eira Executive Operations',
    support_options: [
      'Executive Operations',
      'Calendar Management',
      'Travel & Logistics',
      'Communication Management',
      'Cross-Border Operations',
      'Board & Investor Relations',
      'Other',
    ],
  },
};

export const blocks = {
  projects: {
    testimonial: [
      {
        title: 'Testimonial 1 - Tech Founder & CEO',
        quote:
          'Before Eira, I was carrying too many operational decisions myself. The shift was immediate: cleaner priorities, faster communication, and a partner who could anticipate the next decision before it landed on my desk.',
        attribution: '- Co-Founder & CEO, Technology Company, San Francisco, CA',
      },
      {
        title: 'Testimonial 2 - Finance & Investment Executive',
        quote:
          'I manage portfolios, board conversations, and constant travel. Eira brought a level of structure and discretion that made my weeks feel controlled again without adding more meetings.',
        attribution: '- Managing Director, Private Equity Firm, New York, NY',
      },
      {
        title: 'Testimonial 3 - HNW Entrepreneur & Investor',
        quote:
          "I've worked with executive assistants before, but this is different. Eira understands the commercial context behind the task and protects my time like a strategic asset.",
        attribution: '- Serial Entrepreneur & Angel Investor, Miami, FL',
      },
    ],
  },
  services: {
    step: [
      {
        title: 'Audit the operating rhythm',
        description:
          'We begin by understanding calendars, communication flows, travel patterns, decision bottlenecks, and the standards required around confidentiality.',
      },
      {
        title: 'Build the executive system',
        description:
          'We create practical structures for priorities, inboxes, scheduling, follow-up, documents, and recurring operational decisions.',
      },
      {
        title: 'Run the details proactively',
        description:
          'We manage the moving parts, flag risks early, and keep people aligned across teams, entities, vendors, and time zones.',
      },
      {
        title: 'Refine for scale',
        description:
          'We continuously tighten workflows so support remains calm, discreet, and effective as complexity grows.',
      },
    ],
    service: [
      {
        number: '01',
        name: 'Executive Operations Management',
        description:
          'A trusted operating partner for priorities, follow-through, decision preparation, and daily executive rhythm.',
      },
      {
        number: '02',
        name: 'Multi-Entity Calendar Coordination',
        description:
          'Sophisticated scheduling across companies, households, advisors, boards, investors, and global time zones.',
      },
      {
        number: '03',
        name: 'Global Travel & Logistics',
        description:
          'High-touch itinerary planning, vendor coordination, contingencies, and private movement details.',
      },
      {
        number: '04',
        name: 'Executive Communication Management',
        description:
          'Inbox triage, response drafting, stakeholder follow-up, briefing notes, and communication hygiene.',
      },
      {
        number: '05',
        name: 'Cross-Border Operations',
        description:
          'Operational coordination across jurisdictions, advisors, entities, documents, and location-specific requirements.',
      },
      {
        number: '06',
        name: 'Board & Investor Relations',
        description:
          'Preparation and coordination for board meetings, investor updates, stakeholder materials, and sensitive follow-up.',
      },
      {
        number: '07',
        name: 'Strategic Project Management',
        description:
          'Driving special projects from idea to completion with clear owners, timelines, updates, and decisions.',
      },
      {
        number: '08',
        name: 'Executive Operations Consulting',
        description:
          'Advisory support to design executive workflows, hiring profiles, systems, and operating standards.',
      },
    ],
  },
  about: {
    why_choose: [
      {
        title: 'Strategic judgment',
        description:
          'Eira understands the reason behind the request, not just the task itself, so support is decisive and context-aware.',
      },
      {
        title: 'Discretion by design',
        description:
          'Every workflow is built around privacy, trust, and careful handling of sensitive personal and business information.',
      },
      {
        title: 'Calm execution',
        description:
          'Complexity is translated into ordered next steps, clear communication, and reliable completion without unnecessary noise.',
      },
      {
        title: 'Global operating fluency',
        description:
          'Support adapts to shifting locations, teams, time zones, entities, and high-stakes executive priorities.',
      },
    ],
  },
};

export const blockTypesByPage = {
  home: [],
  projects: ['testimonial'],
  services: ['step', 'service'],
  about: ['why_choose'],
  contact: [],
};

export function parseField(value, fallback) {
  if (Array.isArray(fallback)) {
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return value ?? fallback;
}

export function fallbackBlocks(page, type) {
  return (blocks[page]?.[type] || []).map((data, index) => ({
    id: `fallback-${page}-${type}-${index}`,
    page,
    block_type: type,
    order_index: index,
    data,
  }));
}
