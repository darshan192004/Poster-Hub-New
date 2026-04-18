import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-10 space-y-6">
      <h1 className="text-3xl font-bold">Choose a Poster Category</h1>

      <div className="grid grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/customize/business")}
          className="cursor-pointer p-5 bg-blue-500 text-white rounded-lg"
        >
          Business Poster
        </div>

        <div
          onClick={() => navigate("/customize/birthday")}
          className="cursor-pointer p-5 bg-pink-500 text-white rounded-lg"
        >
          Birthday Poster
        </div>

        <div
          onClick={() => navigate("/customize/event")}
          className="cursor-pointer p-5 bg-green-500 text-white rounded-lg"
        >
          Event Poster
        </div>
      </div>
    </div>
  );
};

export default Home;
