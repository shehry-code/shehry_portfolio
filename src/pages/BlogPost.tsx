import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../components/SEO";
import { blogPosts } from "../data/content";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <SEO
          title="Blog Post Not Found | Shehry"
          description="The blog post could not be found."
        />
        <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Post Not Found</h1>
          <p className="text-text-muted mb-4">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-accent hover:underline">← Back to Blog</Link>
        </div>
        </div>
      </>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && !p.draft && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <>
      <SEO
        title={`${post.title} | Shehry`}
        description={post.description}
      />
      <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          All Posts
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-accent px-2 py-0.5 border border-accent/20 rounded">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-text-secondary mb-6">{post.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime} min read
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs text-text-muted">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Divider */}
        <div className="border-t border-border mb-10" />

        {/* Content */}
        <article className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Divider */}
        <div className="border-t border-border mt-12 mb-10" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group p-4 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-all"
                >
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors mb-1">
                    {related.title}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      </div>
    </>
  );
}
