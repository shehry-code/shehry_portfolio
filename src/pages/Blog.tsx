import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Clock } from "lucide-react";
import { blogPosts } from "../data/content";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const categories = ["All", ...new Set(blogPosts.map((p) => p.category))];
  const allTags = [...new Set(blogPosts.flatMap((p) => p.tags))];
  const showFeaturedSection = !searchQuery && activeCategory === "All" && !activeTag;
  const featured = blogPosts.filter((p) => p.featured && !p.draft).slice(0, 2);
  const featuredSlugs = new Set(featured.map((p) => p.slug));

  const filtered = useMemo(() => {
    return blogPosts
      .filter((p) => !p.draft)
      .filter((p) => !(showFeaturedSection && featuredSlugs.has(p.slug)))
      .filter((p) => {
        if (activeCategory !== "All" && p.category !== activeCategory) return false;
        if (activeTag && !p.tags.includes(activeTag)) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, activeCategory, activeTag, showFeaturedSection, featuredSlugs]);

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Technical Writing
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Notes on computer architecture, systems programming, cybersecurity, and what I'm learning 
            about how computers work under the hood.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveTag(null); }}
                className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                  activeCategory === cat
                    ? "border-accent/30 text-accent bg-accent-glow"
                    : "border-border text-text-muted hover:text-text-primary hover:border-border-hover"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  activeTag === tag
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featured.length > 0 && showFeaturedSection && (
          <div className="mb-10">
            <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-4">Featured</h2>
            <div className="space-y-3">
              {featured.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group block p-5 rounded-lg border border-accent/10 bg-accent-glow/30 hover:border-accent/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-accent">{post.category}</span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock size={10} />
                      {post.readingTime} min
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-muted">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block p-5 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <span className="text-xs text-text-muted font-mono whitespace-nowrap">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm text-text-muted mb-3">{post.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-accent font-mono">{post.category}</span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock size={10} />
                  {post.readingTime} min read
                </span>
                <div className="flex gap-1.5 ml-auto">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs text-text-muted">#{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No posts match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
