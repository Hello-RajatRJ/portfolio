import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Rajat Ambedkar | Full-Stack Developer Portfolio',
  description = 'Full-stack developer building React/Node products for FinTech, Healthcare, and EdTech teams. 4 years of experience delivering high-performance web applications, interactive 3D WebGL, and scalable APIs.',
  keywords = 'Rajat Ambedkar, Rajat Ambedkar Portfolio, Rajat Ambedkar Developer, Full Stack Developer, React Developer, Node.js Developer, TypeScript Developer, CereTax Developer, FinTech Developer, Healthcare Web Development',
  author = 'Rajat Ambedkar',
  url = 'https://rj-ambedkar-portfolio.netlify.app/',
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Helper to set/update meta elements
    const setMeta = (nameOrProp: string, content: string, isProp = false) => {
      const attr = isProp ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProp);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('author', author);

    const ogImage = 'https://rj-ambedkar-portfolio.netlify.app/og-image.png';

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'Rajat Ambedkar Portfolio', true);
    setMeta('og:url', url, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // 3. Structured Data JSON-LD
    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schemaObj = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${url}#person`,
          name: 'Rajat Ambedkar',
          alternateName: ['Rajat', 'Rajat Ambedkar Developer'],
          jobTitle: 'Full-Stack Developer',
          description,
          url,
          sameAs: [
            'https://github.com/Hello-RajatRJ',
            'https://www.linkedin.com/in/rajat-ambedker-961974231',
          ],
          knowsAbout: [
            'Full-Stack Development',
            'React.js',
            'TypeScript',
            'Node.js',
            'PostgreSQL',
            'Three.js / 3D WebGL',
            'Spring Boot',
            'Golang',
            'Java',
            'CereTax Platform',
            'API Architecture',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${url}#website`,
          url,
          name: 'Rajat Ambedkar Portfolio',
          description,
          author: {
            '@id': `${url}#person`,
          },
        },
        {
          '@type': 'ProfilePage',
          '@id': `${url}#profilepage`,
          url,
          name: 'Rajat Ambedkar Official Developer Portfolio',
          mainEntity: {
            '@id': `${url}#person`,
          },
        },
      ],
    };

    scriptTag.textContent = JSON.stringify(schemaObj);
  }, [title, description, keywords, author, url]);

  return null;
};
