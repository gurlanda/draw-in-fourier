// A utility that generates test cases
const signalLength = 10;
console.log('[');

function randomNumber() {
  return Math.floor(Math.random() * 11);
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
