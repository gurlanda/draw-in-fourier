import FourierRing from './components/FourierRing';
import DrawingCanvas from './components/DrawingCanvas';
import CursorContextProvider from './context/Cursor/CursorContextProvider';
import PositionBroadcaster from './components/PositionBroadcaster';

function App() {
  return (
    <div className="bg-gray-800 h-screen p-4 relative">
      <CursorContextProvider>
        <div className="flex justify-center items-center h-full">
          <div className="relative">
            <FourierRing
              angularVelocityMillisec={5000}
              radiusPx={200}
              initialAngleDeg={270}
            >
              <FourierRing
                angularVelocityMillisec={-1300}
                radiusPx={100}
                initialAngleDeg={90}
              >
                <PositionBroadcaster />
              </FourierRing>
            </FourierRing>
          </div>
          <DrawingCanvas />
        </div>
      </CursorContextProvider>
    </div>
  );
}

export default App;
