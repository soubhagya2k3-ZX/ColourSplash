import React, { useState, useEffect } from "react";
import { m as motion } from "motion/react";
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from "../lib/firebase";
import {
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  project_link: string;
  category: string;
  sketchImage?: string;
  tags?: string;
  challenge?: string;
  solution?: string;
  result?: string;
  created_at?: any;
}


export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"portfolio">("portfolio");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  const [fetching, setFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form state
  const [formDataPortfolio, setFormDataPortfolio] = useState<PortfolioItem>({
    title: "",
    description: "",
    image_url: "",
    project_link: "",
    category: "Branding",
    sketchImage: "",
    tags: "",
    challenge: "",
    solution: "",
    result: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchPortfolioItems();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const code = err?.code || '';
      switch (code) {
        case 'auth/invalid-email':
          setAuthError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setAuthError('No account found with this email.');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setAuthError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          setAuthError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setAuthError('Network error. Please check your connection.');
          break;
        default:
          setAuthError('Login failed. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchPortfolioItems = async () => {
    setFetching(true);
    try {
      const q = query(
        collection(db, "portfolio_items"),
        orderBy("created_at", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const data: PortfolioItem[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as PortfolioItem);
      });
      setPortfolioItems(data);
    } catch (err) {
      // Error fetching handled gracefully
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormDataPortfolio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetching(true);
    setAuthError("");
    try {
      const dataToSave = {
        ...formDataPortfolio,
        tags:
          typeof formDataPortfolio.tags === "string"
            ? formDataPortfolio.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : formDataPortfolio.tags,
      };

      if (isEditing && currentId) {
        const itemRef = doc(db, "portfolio_items", currentId);
        await updateDoc(itemRef, { ...dataToSave, updated_at: serverTimestamp() });
      } else {
        await addDoc(collection(db, "portfolio_items"), {
          ...dataToSave,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }
      resetForm();
      await fetchPortfolioItems();
    } catch (err: unknown) {
      // Surface the failure to the operator so the form isn't silently broken.
      const msg =
        err instanceof Error
          ? err.message
          : "Could not save the project. Please retry.";
      setAuthError(msg);
    } finally {
      setFetching(false);
    }
  };

  const editPortfolioItem = (item: PortfolioItem) => {
    setFormDataPortfolio({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      project_link: item.project_link,
      category: item.category,
      sketchImage: item.sketchImage || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
      challenge: item.challenge || "",
      solution: item.solution || "",
      result: item.result || "",
    });
    setCurrentId(item.id!);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setAuthError("");
    try {
      await deleteDoc(doc(db, "portfolio_items", id));
      await fetchPortfolioItems();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not delete the project. Please retry.";
      setAuthError(msg);
    }
  };

  const resetForm = () => {
    setFormDataPortfolio({
      title: "",
      description: "",
      image_url: "",
      project_link: "",
      category: "Branding",
      sketchImage: "",
      tags: "",
      challenge: "",
      solution: "",
      result: "",
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  useEffect(() => {
    resetForm();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to manage portfolio and services
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500 mt-1">Manage your content</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              if (!window.confirm("Load 5 demo projects into Firebase?")) return;
              setFetching(true);
              const demoProjects = [
                { title: "Urban Fit Studio", category: "Gym Promo & Motion Edits", tags: ["Motion Graphics", "Promo", "Fitness"], sketchImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop", image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop", project_link: "#", challenge: "Needed leads", solution: "Reel challenge campaign", result: "80+ direct inquiries", description: "A high-energy promotional campaign for a local fitness studio." },
                { title: "The Artisan Brew Café", category: "Café Ads & Social Media Campaigns", tags: ["Social Media", "Café", "Ad Campaign"], sketchImage: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&auto=format&fit=crop", image_url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2671&auto=format&fit=crop", project_link: "#", challenge: "Low social presence", solution: "Instagram management", result: "500+ local followers, 30% more footfall", description: "Complete digital transformation for an artisanal coffee shop." },
                { title: "EcoGlow Skincare", category: "Skincare Marketing Strategy", tags: ["Beauty", "Ads", "Influencer"], sketchImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop", image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop", project_link: "#", challenge: "Zero awareness", solution: "Targeted ads + influencer collab", result: "100k+ organic reach", description: "A comprehensive product launch strategy." },
                { title: "TechNova SaaS Platform", category: "Web Design", tags: ["UI/UX", "Web App", "SaaS"], sketchImage: "https://images.unsplash.com/photo-1481481600450-88ae8dc0b4fa?q=80&w=800&auto=format&fit=crop", image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop", project_link: "#", challenge: "Outdated dashboard", solution: "Complete redesign", result: "40% increase in user retention", description: "Modernizing a legacy SaaS interface." },
                { title: "Neon Nights Festival", category: "Marketing", tags: ["Event", "Print", "Digital"], sketchImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop", image_url: "https://images.unsplash.com/photo-1533174000273-e18e6e58f00d?q=80&w=2670&auto=format&fit=crop", project_link: "#", challenge: "Ticket sales stalled", solution: "Omnichannel ad blitz", result: "Sold out 2 weeks early", description: "Event marketing for a massive music festival." }
              ];
              try {
                for (const proj of demoProjects) {
                  await addDoc(collection(db, "portfolio_items"), { ...proj, created_at: serverTimestamp(), updated_at: serverTimestamp() });
                }
                fetchPortfolioItems();
              } catch (e) {
                // Silently skip on error
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors font-medium text-sm"
          >
            <Plus size={16} />
            Load Demo Projects
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors border-orange-500 text-orange-600`}
        >
          <FolderOpen size={16} /> Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              {isEditing ? (
                <Edit2 size={18} className="text-orange-500" />
              ) : (
                <Plus size={18} className="text-emerald-500" />
              )}
              {isEditing ? `Edit Project` : `Add New Project`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formDataPortfolio.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formDataPortfolio.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="Branding">Branding</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  required
                  type="url"
                  name="image_url"
                  value={formDataPortfolio.image_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project Link
                </label>
                <input
                  required
                  type="url"
                  name="project_link"
                  value={formDataPortfolio.project_link}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  value={formDataPortfolio.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Concept Sketch URL
                </label>
                <input
                  type="url"
                  name="sketchImage"
                  value={formDataPortfolio.sketchImage}
                  onChange={handleInputChange}
                  placeholder="https://... (Optional)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formDataPortfolio.tags}
                  onChange={handleInputChange}
                  placeholder="UI, UX, React"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Challenge
                </label>
                <input
                  type="text"
                  name="challenge"
                  value={formDataPortfolio.challenge}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Solution
                </label>
                <input
                  type="text"
                  name="solution"
                  value={formDataPortfolio.solution}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Result
                </label>
                <input
                  type="text"
                  name="result"
                  value={formDataPortfolio.result}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={fetching}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {fetching
                    ? "Saving..."
                    : isEditing
                      ? "Update Item"
                      : "Save Item"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Listing */}
        <div className="lg:col-span-2">
          {
            fetching && portfolioItems.length === 0 ? (
              <div className="flex justify-center py-20 text-slate-400">
                <RefreshCw size={24} className="animate-spin" />
              </div>
            ) : portfolioItems.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-500">
                <ImageIcon size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No portfolio items found. Add your first project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden group"
                  >
                    <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => editPortfolioItem(item)}
                          aria-label={`Edit ${item.title}`}
                          className="p-2 bg-white/90 backdrop-blur text-slate-700 hover:text-orange-500 rounded-lg shadow-sm"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id!)}
                          aria-label={`Delete ${item.title}`}
                          className="p-2 bg-white/90 backdrop-blur text-slate-700 hover:text-red-500 rounded-lg shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">
                        {item.category}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                      <a
                        href={item.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-orange-500"
                      >
                        <LinkIcon size={12} /> View Project
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
