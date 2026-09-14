import { useState } from "react";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { profile } from "../data/content";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend/email service
    // For now, we'll open the user's email client
    const mailtoLink = `mailto:${profile.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Get in Touch
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Have a question, opportunity, or just want to talk about systems, security, or architecture? 
            I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-colors group"
            >
              <div className="p-2 rounded-md bg-accent-glow text-accent">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">Email</p>
                <p className="text-xs text-text-muted">{profile.email}</p>
              </div>
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-colors group"
            >
              <div className="p-2 rounded-md bg-accent-glow text-accent">
                <Github size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">GitHub</p>
                <p className="text-xs text-text-muted">@shehry</p>
              </div>
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-colors group"
            >
              <div className="p-2 rounded-md bg-accent-glow text-accent">
                <Linkedin size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">LinkedIn</p>
                <p className="text-xs text-text-muted">Connect with me</p>
              </div>
            </a>

            <div className="p-4 rounded-lg border border-border bg-bg-secondary mt-6">
              <p className="text-xs text-text-muted leading-relaxed">
                I'm currently open to internships, collaborations, and opportunities in 
                cybersecurity, systems engineering, and security research.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="p-8 rounded-lg border border-green/20 bg-green/5 text-center">
                <p className="text-green font-medium mb-2">Message prepared!</p>
                <p className="text-sm text-text-muted">
                  Your email client should have opened. If not, you can email me directly at{" "}
                  <a href={`mailto:${profile.email}`} className="text-accent hover:underline">
                    {profile.email}
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono text-text-muted mb-1.5">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-bg-card border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-mono text-text-muted mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-bg-card border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-mono text-text-muted mb-1.5">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-bg-card border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-text-muted mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-bg-card border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-bg-primary bg-accent hover:bg-accent/90 rounded-md transition-colors"
                >
                  <Send size={14} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
