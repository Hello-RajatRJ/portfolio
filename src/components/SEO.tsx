import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Rajat Ambedkar | Senior Full-Stack Developer & UI Architect Portfolio',
  description = 'Official portfolio of Rajat Ambedkar, Senior Full-Stack Developer & UI Architect specializing in React, TypeScript, Node.js, Three.js 3D WebGL, CereTax, and high-performance web applications.',
  keywords = 'Rajat Ambedkar, Rajat Ambedkar Portfolio, Rajat Ambedkar Developer, Rajat Ambedkar Full Stack Engineer, React Developer, Three.js Developer, TypeScript Architect, CereTax Developer',
  author = 'Rajat Ambedkar',
  url = 'https://github.com/Hello-RajatRJ/portfolio',
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

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'Rajat Ambedkar Portfolio', true);
    setMeta('og:url', url, true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

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
          jobTitle: 'Senior Full-Stack Developer & UI Architect',
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
            'Three.js / 3D WebGL',
            'Spring Boot',
            'Golang',
            'Java',
            'CereTax Platform',
            'UI Architecture',
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
