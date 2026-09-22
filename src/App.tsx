import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminAuthGate from "./components/AdminAuthGate";
import SEO, { siteSchema } from "./components/SEO";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Notes from "./pages/Notes";
import NoteDetail from "./pages/NoteDetail";
import Research from "./pages/Research";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogs from "./pages/AdminBlogs";
import AdminNewBlog from "./pages/AdminNewBlog";
import AdminEditBlog from "./pages/AdminEditBlog";
import AdminNotes from "./pages/AdminNotes";
import AdminNotePages from "./pages/AdminNotePages";
import AdminNewNote from "./pages/AdminNewNote";
import AdminEditNote from "./pages/AdminEditNote";
import AdminResearchPlaceholder from "./pages/AdminResearchPlaceholder";
import AdminProjectsPlaceholder from "./pages/AdminProjectsPlaceholder";
import NotFound from "./pages/NotFound";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "portfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" ? "light" : "dark";
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  return <AdminAuthGate>{children}</AdminAuthGate>;
}

function AppContent({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void; }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <ScrollToTop />
      <SEO
        title="Shehry | Computer Science • Systems • Security"
        description="Computer Science portfolio covering systems, cybersecurity, computer architecture, Linux internals, and hands-on technical learning."
        schema={siteSchema}
      />
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:slug" element={<NoteDetail />} />
          <Route path="/research" element={<Research />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs" element={<ProtectedAdminRoute><AdminBlogs /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs/new" element={<ProtectedAdminRoute><AdminNewBlog /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs/:slug/edit" element={<ProtectedAdminRoute><AdminEditBlog /></ProtectedAdminRoute>} />
          <Route path="/admin/notes" element={<ProtectedAdminRoute><AdminNotes /></ProtectedAdminRoute>} />
          <Route path="/admin/notes/new" element={<ProtectedAdminRoute><AdminNewNote /></ProtectedAdminRoute>} />
          <Route path="/admin/notes/:slug/edit" element={<ProtectedAdminRoute><AdminEditNote /></ProtectedAdminRoute>} />
          <Route path="/admin/notes/:slug/pages" element={<ProtectedAdminRoute><AdminNotePages /></ProtectedAdminRoute>} />
          <Route path="/admin/research" element={<ProtectedAdminRoute><AdminResearchPlaceholder /></ProtectedAdminRoute>} />
          <Route path="/admin/projects" element={<ProtectedAdminRoute><AdminProjectsPlaceholder /></ProtectedAdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "light" ? "#f5f1ea" : "#0a0a0f");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <HashRouter>
      <AppContent theme={theme} onToggleTheme={toggleTheme} />
    </HashRouter>
  );
}
