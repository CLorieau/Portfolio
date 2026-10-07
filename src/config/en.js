// Traductions anglaises : seuls les champs traduits sont listés, le reste est hérité du français.
export const en = {
  site: {
    title: 'Clément Lorieau | Fullstack Web & Mobile Developer',
    description:
      'Portfolio of Clément Lorieau, fullstack web and mobile developer. Master\'s student in Computer Science, looking for an end-of-studies internship starting February 2027.',
    role: 'Fullstack Developer',
    location: 'Agen, France',
    availability: 'End-of-studies internship - February 2027 - 5 to 6 months',
    scrollHint: 'Scroll',
    loader: {
      label: 'Loading the globe',
      done: 'Ready',
    },
    navAria: 'Main navigation',
    contactLabel: 'Contact',
    languageSwitchLabel: 'Passer le site en français',
    nav: [
      { label: 'Home' },
      { label: 'Journey' },
      { label: 'Skills' },
      { label: 'Projects' },
    ],
    contact: {
      eyebrow: 'What\'s next?',
      title: 'Let\'s build something together.',
      text: 'I\'m looking for a 5 to 6 month end-of-studies internship starting February 2027. Web, mobile, 3D: let\'s talk about your project.',
      emailLabel: 'Send a message',
    },
    interests: {
      label: 'Away from the keyboard',
      items: ['Sports', 'Music', '3D modeling and printing'],
    },
    footer: 'Designed and developed by Clément Lorieau',
  },
  journey: {
    eyebrow: '02 / The journey',
    title: 'The Journey',
    hint: 'Keep scrolling to follow the route',
    steps: [
      {
        country: 'France',
        title: 'Bachelor in Multimedia and Internet Professions',
        place: 'Paul Sabatier University',
        description:
          'The solid foundations: web development, interface design, audiovisual and communication. The starting point of everything else.',
        tags: ['Web', 'Multimedia', 'UX'],
      },
      {
        country: 'France',
        title: 'From video reporting to web project management',
        place: 'Périvision Studio, then D2COM',
        description:
          'Filming and post-production at Périvision Studio, then a mobile app published on the stores during an internship at D2COM, and a one-year work-study as web project manager: applications, custom WordPress plugins, SEO and SEA.',
        tags: ['Mobile', 'WordPress', 'SEO & SEA', 'Video'],
      },
      {
        country: 'Corsica, France',
        title: 'Master\'s in Computer Science, Full Stack Developer track',
        place: 'University of Corsica Pascal Paoli',
        description:
          'Stepping up: architecture, DevOps and CI/CD, SQL and NoSQL databases, agile project management.',
        tags: ['Full Stack', 'DevOps', 'Agile'],
      },
    ],
    destination: {
      period: 'February 2027',
      title: 'Next destination',
      place: 'End-of-studies internship, 5 to 6 months',
      description:
        'The journey continues. I\'m looking for the team to unpack my bags with for the final leg of my studies.',
      cta: 'Get in touch',
    },
  },
  projects: {
    eyebrow: '04 / Projects',
    title: 'Work',
    intro: 'A selection of projects carried out in companies, during my studies and on my own.',
    linkLabel: 'View project',
    items: [
      {
        title: 'Mobile app for a taxi company',
        context: 'D2COM - Internship, 2024',
        description:
          'Booking system, staff and vehicle schedule management. App published on the App Store and Google Play.',
      },
      {
        title: 'Custom WordPress plugins',
        context: 'D2COM - Work-study, 2024 - 2025',
        description:
          'Design of plugins tailored to clients\' specific needs, and maintenance of the agency\'s web applications.',
      },
      {
        title: 'SEO & SEA',
        context: 'D2COM - Work-study, 2024 - 2025',
        description:
          'Optimization of the organic and paid search ranking of client websites to improve their visibility.',
        tags: ['SEO', 'SEA', 'Performance'],
      },
      {
        title: 'Video reports',
        context: 'Périvision Studio - Internship, 2023',
        description: 'End-to-end production of video reports: filming, then post-production.',
        tags: ['Video', 'Filming', 'Post-production'],
      },
      {
        title: 'This portfolio',
        context: 'Personal project, 2026',
        description:
          'A scroll experience combining a 3D globe, an animated route and micro-interactions, built with Next.js, React Three Fiber and GSAP.',
      },
    ],
  },
  skills: {
    eyebrow: '03 / Skills',
    intro:
      'From the browser to native mobile, from the server to the deployment pipeline: a complete toolkit to ship a product end to end.',
    categories: [
      { name: 'Front-end', summary: 'Fast, accessible and polished interfaces.' },
      { summary: 'Solid APIs and maintainable architectures.', name: 'Back-end' },
      { name: 'Native mobile', summary: 'Apps published on the App Store and Google Play.' },
      { name: 'Data', summary: 'Modeling, querying and choosing the right storage.' },
      {
        name: 'Methods & DevOps',
        summary: 'A controlled delivery cycle, from idea to production.',
        items: ['Agile project management', 'CI/CD', 'WordPress', 'SEO & SEA'],
      },
      {
        name: 'Creation & 3D',
        summary: 'A taste for visuals, from video to 3D printing.',
        items: ['Three.js', 'GSAP', '3D modeling', '3D printing', 'Video editing'],
      },
    ],
    languages: {
      label: 'Languages',
      items: [
        { name: 'French', level: 'Native' },
        { name: 'English', level: 'Fluent' },
        { name: 'Spanish', level: 'Intermediate' },
      ],
    },
  },
}
