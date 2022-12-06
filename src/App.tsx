import Circle from './components/Circle';

function App() {
  return (
    <div className="bg-gray-800 h-screen p-4">
      <h1 className="text-3xl text-white font-bold underline">Hello world!</h1>
      <div className="flex justify-center items-center h-full">
        <Circle
          angularVelocityMillisec={7000}
          radiusPx={100}
          initialAngleDeg={270}
        >
          <Circle
            angularVelocityMillisec={-2000}
            radiusPx={80}
            initialAngleDeg={90}
          >
            <Circle
              angularVelocityMillisec={3000}
              radiusPx={50}
              initialAngleDeg={100}
            ></Circle>
          </Circle>
        </Circle>
      </div>
    </div>
  );
}

export default App;
