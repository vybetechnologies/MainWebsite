import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

export function SEO({ title, description = "VYBE Technologies provides trusted, approachable tech support for individuals, seniors, and small businesses in Fargo, North Dakota." }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | VYBE Technologies`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${title} | VYBE Technologies`);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
