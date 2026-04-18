import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import TemplatesPage from "./pages/TemplatesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import PosterGenerator from "./pages/PosterGenerator";
import CustomizePoster from "./pages/CustomizePoster";
import FabricEditor from "./pages/FabricEditor";
import CanvaEditor from "./pages/CanvaEditor";
import AdminTemplateEditor from "./pages/AdminTemplateEditor";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./hoc/PrivateRoute";
import ErrorBoundary from "./hoc/ErrorBoundary";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const hideNavbarRoutes = ["/customize-poster", "/fabric-editor", "/admin-template-editor", "/editor"];
  const hideFooterRoutes = ["/templates", "/customize-poster", "/profile", "/generate-poster", "/admin-template-editor", "/editor"];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleOpenRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar onLoginClick={handleOpenLogin} />}
      
      <main className="flex-1">
        <Routes key={location.key}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/generate-poster" element={<PosterGenerator />} />
          <Route path="/customize-poster" element={<CustomizePoster />} />
          <Route path="/fabric-editor" element={<FabricEditor />} />
          <Route path="/editor" element={<CanvaEditor />} />
          <Route path="/editor/:id" element={<CanvaEditor />} />
          <Route path="/admin-template-editor" element={<AdminTemplateEditor />} />
          <Route path="/admin-template-editor/:id" element={<AdminTemplateEditor />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </main>
      
      {showFooter && <Footer />}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50">
          <LoginPage onClose={handleCloseModals} onOpenRegister={handleOpenRegister} />
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50">
          <RegisterPage onClose={handleCloseModals} onOpenLogin={handleOpenLogin} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
