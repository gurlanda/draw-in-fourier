import FourierRing from './components/FourierRing';
import DrawingCanvas from './components/DrawingCanvas';

function App() {
  return (
    <div className="bg-gray-800 h-screen p-4">
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
              >
                <FourierRing
                  angularVelocityMillisec={1100}
                  radiusPx={20}
                  initialAngleDeg={100}
                >
                  <FourierRing
                    angularVelocityMillisec={-900}
                    radiusPx={75}
                    initialAngleDeg={20}
                  >
                    <FourierRing
                      angularVelocityMillisec={-800}
                      radiusPx={50}
                      initialAngleDeg={100}
                    ></FourierRing>
                  </FourierRing>
                </FourierRing>
              </FourierRing>
            </FourierRing>
          </FourierRing>
        </div>
        <DrawingCanvas />
      </div>
    </div>
  );
}

export default App;
