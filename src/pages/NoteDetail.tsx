import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notes } from "../data/content";

export default function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const note = notes.find((item) => item.slug === slug);

  if (!note) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Note Not Found</h1>
          <p className="text-text-muted mb-4">The note you're looking for doesn't exist.</p>
          <Link to="/notes" className="text-accent hover:underline">← Back to Notes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <Link
          to="/notes"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          All Notes
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono text-accent px-2 py-0.5 border border-accent/20 rounded">
              {note.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
              <Calendar size={14} />
              {new Date(note.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 leading-tight">
            {note.title}
          </h1>
          <p className="text-lg text-text-secondary mb-6">{note.description}</p>

          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs text-text-muted">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="border-t border-border mb-10" />

        <article className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
