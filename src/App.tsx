import FourierRingStack from './components/FourierRingStack';
import DrawingCanvas from './components/DrawingCanvas';
import CursorContextProvider from './context/Cursor/CursorContextProvider';
import RingParams, { signalToRingParams } from './util/RingParams';
import * as testCases from './tests/fftTestCases';
import fft from './util/fft';
import Complex from './util/Complex';

function App() {
  const ringParams: RingParams[] = [
    new RingParams(5000, 200, 270),
    new RingParams(-1300, 100, 90),
  ];
  const cornerPoints: Complex[] = [
    new Complex(1, 0),
    new Complex(0, 1),
    new Complex(-1, 0),
    new Complex(0, -1),
  ];
  const squareShapeFFT = fft(cornerPoints);
  const squareRingParams: RingParams[] = signalToRingParams(squareShapeFFT);
  // console.log(squareRingParams);
  // const ringParams = [new RingParams(10, 100, 0)];
  // const ringParams = squareRingParams;

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
