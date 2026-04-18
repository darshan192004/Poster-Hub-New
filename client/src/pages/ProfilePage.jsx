import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paintbrush, User, Mail, LogOut, Download, Trash2, Image, Calendar, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posters");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileAndPosters = async () => {
      try {
        const [profileRes, postersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/posters/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [profileData, postersData] = await Promise.all([
          profileRes.json(),
          postersRes.json(),
        ]);

        if (profileRes.ok) {
          setUser(profileData);
          localStorage.setItem("user", JSON.stringify(profileData));
        } else {
          localStorage.removeItem("user");
          logout();
          navigate("/login");
        }

        if (postersRes.ok) {
          setPosters(postersData.posters || []);
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosters();
  }, [navigate, logout]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    logout();
    navigate("/login");
  };

  const handleDownloadPoster = async (posterUrl) => {
    try {
      const response = await fetch(posterUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `poster-${Date.now()}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleDeletePoster = async (posterId) => {
    if (!confirm("Are you sure you want to delete this poster?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posters/${posterId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setPosters(posters.filter(p => p._id !== posterId));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 max-w-md w-full border border-slate-700">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-700 rounded-xl" />
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">No user found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500" />
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center border-4 border-slate-800">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("posters")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "posters"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Image className="w-4 h-4" />
            My Posters ({posters.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Posters Grid */}
        {activeTab === "posters" && (
          <>
            {posters.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-12 text-center">
                <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Posters Yet</h3>
                <p className="text-gray-400 mb-6">Create your first poster and save it here!</p>
                <button
                  onClick={() => navigate("/templates")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Start Creating
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posters.map((poster) => (
                  <div
                    key={poster._id}
                    className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden group"
                  >
                    <div className="aspect-[4/5] bg-slate-700 relative overflow-hidden">
                      {poster.generatedPosterUrl ? (
                        <img
                          src={poster.generatedPosterUrl}
                          alt="Poster"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Image className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleDownloadPoster(poster.generatedPosterUrl)}
                          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDeletePoster(poser._id)}
                          className="p-3 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white truncate">{poster.category || "Poster"}</h4>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(poster.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive updates about new features</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Marketing Emails</p>
                  <p className="text-gray-400 text-sm">Receive promotional offers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <button className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
