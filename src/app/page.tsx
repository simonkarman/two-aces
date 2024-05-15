import Scene from '@/components/scene';

const Home = () => {
  return (
    <>
      <div className="p-2 absolute top-0 left-0 right-0 w-full h-full">
        <div className="p-1 bg-[rgba(1, 1, 1, 0.4)]">
          <h1>My Board Game</h1>
        </div>
      </div>
      <Scene/>
    </>
  );
};

export default Home;
