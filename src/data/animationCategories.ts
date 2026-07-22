export interface AnimationCategory {
  title: string;
  subtitle: string;
  icon: string;
  imageSrc: string;
  slug: string;
  gradient: string;
  accentColor: string;
  badge: string;
}

export const animationCategories: AnimationCategory[] = [
  {
    title: 'Luxury Car',
    subtitle: 'Obsidian & Gold Telemetry HUD',
    icon: '🏎️',
    imageSrc: '/images/categories/luxury-car.jpg',
    slug: 'luxury-car',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(212,175,55,0.35) 50%, rgba(0,0,0,0.95) 100%)',
    accentColor: '#d4af37',
    badge: 'AUTOMOTIVE HUD',
  },
  {
    title: 'Real Estate',
    subtitle: 'Monolithic Architectural Penthouse',
    icon: '🏛️',
    imageSrc: '/images/categories/real-estate.jpg',
    slug: 'real-estate',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(245,158,11,0.3) 50%, rgba(8,8,10,0.95) 100%)',
    accentColor: '#f59e0b',
    badge: 'ARCHITECTURAL',
  },
  {
    title: 'AI Product',
    subtitle: 'Cyber Cyan Quantum Stream',
    icon: '🤖',
    imageSrc: '/images/categories/ai-product.jpg',
    slug: 'ai-product',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(59,130,246,0.35) 50%, rgba(4,4,10,0.95) 100%)',
    accentColor: '#3b82f6',
    badge: 'NEURAL CONSOLE',
  },
  {
    title: 'Nature / Eco',
    subtitle: 'Deep Forest & Bioluminescence',
    icon: '🌿',
    imageSrc: '/images/categories/nature.jpg',
    slug: 'nature',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(16,185,129,0.35) 50%, rgba(4,16,9,0.95) 100%)',
    accentColor: '#10b981',
    badge: 'ECO BIOSPHERE',
  },
  {
    title: 'SaaS Platform',
    subtitle: 'DevOps Node Graph Mesh',
    icon: '⚙️',
    imageSrc: '/images/categories/saas.jpg',
    slug: 'saas',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(99,102,241,0.35) 50%, rgba(8,9,20,0.95) 100%)',
    accentColor: '#6366f1',
    badge: 'CLOUD MESH',
  },
  {
    title: 'Premium Product',
    subtitle: 'Titanium Acoustic Precision',
    icon: '🎧',
    imageSrc: '/images/categories/premium-product.jpg',
    slug: 'premium-product',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(226,232,240,0.3) 50%, rgba(7,7,9,0.95) 100%)',
    accentColor: '#e2e8f0',
    badge: 'ACOUSTIC LAB',
  },
];
