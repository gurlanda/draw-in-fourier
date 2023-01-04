// A utility that generates test cases
const signalLength = 128;
console.log('[');

function randomNumber() {
  return Math.random() * 10000;
}

for (let i = 0; i < signalLength - 1; i++) {
  const realVal = randomNumber();
  const imagVal = randomNumber();
  console.log(`new Complex(${realVal}, ${imagVal}),`);
}

const realVal = randomNumber();
const imagVal = randomNumber();
console.log(`new Complex(${realVal}, ${imagVal})`);
console.log(']');
