import FourierRing from './components/FourierRing';

function App() {
  return (
    <div className="bg-gray-800 h-screen p-4">
      <h1 className="text-3xl text-white font-bold underline">Hello world!</h1>
      <div className="flex justify-center items-center h-full">
        <div className="relative">
          <FourierRing
            angularVelocityMillisec={7000}
            radiusPx={100}
            initialAngleDeg={270}
          >
            <FourierRing
              angularVelocityMillisec={-2000}
              radiusPx={80}
              initialAngleDeg={90}
            >
              <FourierRing
                angularVelocityMillisec={3000}
                radiusPx={50}
                initialAngleDeg={100}
              ></FourierRing>
            </FourierRing>
          </FourierRing>
        </div>
      </div>
    </div>
  );
}

export default App;
