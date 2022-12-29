import FourierRingStack from './components/FourierRingStack';
import DrawingCanvas from './components/DrawingCanvas';
import CursorContextProvider from './context/Cursor/CursorContextProvider';
import RingParams from './util/RingParams';

function App() {
  const ringParams: RingParams[] = [
    new RingParams(5000, 200, 270),
    new RingParams(-1300, 100, 90),
  ];

  return (
    <div className="bg-gray-800 h-screen p-4 relative">
      <CursorContextProvider>
        <div className="flex justify-center items-center h-full">
          <FourierRingStack ringParams={ringParams} />
          <DrawingCanvas />
        </div>
      </CursorContextProvider>
    </div>
  );
}

export default App;
