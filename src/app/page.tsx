import Scene from '@/components/scene';

const Home = () => {
  return (
    <>
      <Scene/>
      <div className="absolute top-0 left-0">
        <div className="px-3 py-2 -space-y-1">
          <h1 className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold text-2xl">My Board Game</h1>
          <h2 className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-medium text-lg text-gray-300">Lobby Phase</h2>
        </div>
      </div>
    </>
  );
};

export default Home;
