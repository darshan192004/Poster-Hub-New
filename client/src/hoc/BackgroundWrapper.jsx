const BackgroundWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      {/* Floating 3D Style Elements */}
      <div className="absolute top-10 left-16 w-24 h-24 bg-yellow-300 rounded-full opacity-40 blur-md animate-pulse"></div>
      <div className="absolute bottom-14 right-16 w-20 h-20 bg-blue-300 rounded-full opacity-30 blur-md animate-bounce"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-2xl animate-spin"></div>
      <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-pink-300 rounded-full opacity-50 blur-lg animate-pulse"></div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
