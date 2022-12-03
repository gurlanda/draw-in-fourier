import Circle from './components/Circle';

function App() {
  return (
    <div className="bg-gray-800 h-screen p-4">
      <h1 className="text-3xl text-white font-bold underline">Hello world!</h1>
      <div className="flex justify-center items-center h-full">
        <Circle speedMs={7000} magnitude={100} argumentDeg={270}>
          <Circle speedMs={-2000} magnitude={80} argumentDeg={90}>
            <Circle speedMs={3000} magnitude={50} argumentDeg={100}></Circle>
          </Circle>
        </Circle>
      </div>
    </div>
  );
}

export default App;
