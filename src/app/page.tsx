import Scene from '@/components/scene';

const Home = () => {
  return (
    <>
      <Scene/>
      <div className="absolute top-0 left-0">
        <div className="p-2 -space-y-1">
          <h1 className="font-bold">My Board Game</h1>
          <h2 className="font-medium text-gray-500">Lobby Phase</h2>
        </div>
      </div>
    </>
  );
};

export default Home;
