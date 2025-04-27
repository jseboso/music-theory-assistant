// Manual mock for the 'tone' package.
//
// jest-environment-jsdom has no real Web Audio API, so importing the real
// Tone.js library in a test would throw. This mock is picked up
// automatically by Jest for any test that imports 'tone' (directly or via
// AudioContext.tsx) without needing an explicit jest.mock('tone') call.
class MockSynth {
  toDestination() {
    return this;
  }
  triggerAttackRelease() {}
  dispose() {}
}

class MockPolySynth {
  constructor() {}
  toDestination() {
    return this;
  }
  triggerAttackRelease() {}
  dispose() {}
}

module.exports = {
  start: jest.fn(() => Promise.resolve()),
  now: jest.fn(() => 0),
  Synth: MockSynth,
  PolySynth: MockPolySynth,
};
