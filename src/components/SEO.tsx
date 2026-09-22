import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://shehry-portfolio.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

type SchemaValue = Record<string, unknown> | Array<Record<string, unknown>>;

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterCard?: string;
  schema?: SchemaValue;
}

function ensureMetaTag(selector: string, attributes: Record<string, string>) {
  const element = document.head.querySelector(selector) as HTMLMetaElement | null;
  const meta = element ?? document.createElement("meta");

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      meta.setAttribute(key, value);
    }
  });

  if (!element) {
    document.head.appendChild(meta);
  }
}

function ensureLinkTag(selector: string, attributes: Record<string, string>) {
  const element = document.head.querySelector(selector) as HTMLLinkElement | null;
  const link = element ?? document.createElement("link");

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      link.setAttribute(key, value);
    }
  });

  if (!element) {
    document.head.appendChild(link);
  }
}

function removeMetaTags(selectors: string[]) {
  selectors.forEach((selector) => {
    document.head.querySelectorAll(selector).forEach((element) => element.remove());
  });
}

function setJsonLd(schema: SchemaValue) {
  const scriptSelector = "script[data-seo-jsonld='true']";
  document.head.querySelectorAll(scriptSelector).forEach((element) => element.remove());

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-seo-jsonld", "true");
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export default function SEO({
  title,
  description,
  canonical = `${SITE_URL}/`,
  image = DEFAULT_IMAGE,
  ogTitle = title,
  ogDescription = description,
  twitterTitle = title,
  twitterDescription = description,
  twitterCard = "summary_large_image",
  schema,
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    removeMetaTags([
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:type"]',
      'meta[property="og:url"]',
      'meta[property="og:image"]',
      'meta[name="twitter:card"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:image"]',
    ]);

    ensureMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });

    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: ogTitle,
    });

    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: ogDescription,
    });

    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });

    ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });

    ensureMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });

    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: twitterCard,
    });

    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: twitterTitle,
    });

    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: twitterDescription,
    });

    ensureMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });

    ensureLinkTag('link[rel="canonical"]', {
      rel: "canonical",
      href: canonical,
    });

    if (schema) {
      setJsonLd(schema);
    }

    const hashRoute = location.hash || "";
    const isHashRoute = hashRoute.length > 0 && !location.pathname.startsWith("/admin");
    if (isHashRoute) {
      document.documentElement.scrollTop = 0;
    }
  }, [
    title,
    description,
    canonical,
    image,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    twitterCard,
    schema,
    location.hash,
    location.pathname,
  ]);

  return null;
}

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Shehry",
      url: SITE_URL,
      description:
        "Computer Science portfolio focused on systems, cybersecurity, computer architecture, and technical learning.",
      inLanguage: "en",
    },
    {
      "@type": "Person",
      name: "Shehry",
      url: SITE_URL,
      description:
        "Computer Science student exploring systems, security, architecture, and low-level computing.",
      sameAs: [
        "https://github.com/shehry-code",
        "https://www.linkedin.com/in/muhammad-shehriyar-94a966422/",
      ],
    },
  ],
};
