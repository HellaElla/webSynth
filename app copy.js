// Create the 4-pole low-pass filter by cascading four Tone.Filters
const filter1 = new Tone.Filter(1000, "lowpass").toDestination();
const filter2 = new Tone.Filter(1000, "lowpass").toDestination();
const filter3 = new Tone.Filter(1000, "lowpass").toDestination();
const filter4 = new Tone.Filter(1000, "lowpass").toDestination();

// Connect the filters in series (cascading)
filter1.connect(filter2);
filter2.connect(filter3);
filter3.connect(filter4);

// Create a gain node to normalize the output
const gain = new Tone.Gain(0.02).toDestination(); // Start with 1 for unity gain
filter4.connect(gain); // Connect the last filter to the gain node

// Create a limiter node to ensure the audio doesn't exceed a threshold
const limiter = new Tone.Limiter(-6.0).toDestination(); // Limit output at -0.5dB
gain.connect(limiter); // Connect the gain node to the limiter

// Create a reverb node and connect it to destination
const reverb = new Tone.Reverb({
    decay: 1.5, // Duration of the reverb tail
    preDelay: 0.01 // Delay before the reverb starts
}).toDestination();
reverb.wet.value = 0.5;

// Create two basic synths using Tone.js and connect them to the reverb
const synth1 = new Tone.Synth({
    oscillator: {
        type: "sine", // Default waveform for synth 1
    },
    envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.0,
        release: 1,
    },
}).connect(filter1);

const synth2 = new Tone.Synth({
    oscillator: {
        type: "sine", // Default waveform for synth 2
    },
    envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.0,
        release: 1,
    },
}).connect(filter1); 

synth1.volume.value = -6;
synth2.volume.value = -6;


const reverbMixGain = new Tone.Gain(0.8).toDestination();
filter4.connect(reverb);
reverb.connect(reverbMixGain);
// Control sliders for frequency and resonance (updated for 4-pole filter)
const filterFrequencySlider = document.getElementById('filterFrequencySlider');
const filterResonanceSlider = document.getElementById('filterResonanceSlider');
const filterFrequencyValue = document.getElementById('filterFrequencyValue');
const filterResonanceValue = document.getElementById('filterResonanceValue');


// Update the filter frequency and resonance based on the slider values
function updateFilter() {
    const frequency = parseFloat(filterFrequencySlider.value);
    const resonance = parseFloat(filterResonanceSlider.value);
    
    // Apply values to all 4 filters in the chain
    filter1.frequency.setValueAtTime(frequency, Tone.now());
    filter2.frequency.setValueAtTime(frequency, Tone.now());
    filter3.frequency.setValueAtTime(frequency, Tone.now());
    filter4.frequency.setValueAtTime(frequency, Tone.now());

    // Apply resonance (Q factor) to all filters
    filter1.Q.setValueAtTime(resonance, Tone.now());
    filter2.Q.setValueAtTime(resonance, Tone.now());
    filter3.Q.setValueAtTime(resonance, Tone.now());
    filter4.Q.setValueAtTime(resonance, Tone.now());

    // Update the displayed values
    filterFrequencyValue.textContent = frequency;
    filterResonanceValue.textContent = resonance;
}

// Event listeners for filter sliders
filterFrequencySlider.addEventListener('input', updateFilter);
filterResonanceSlider.addEventListener('input', updateFilter);

// Function to apply detune (fine pitch + additional detune) for both synths
function updateDetune() {
    const finePitchValue1 = parseFloat(finePitchSlider1.value);
    const additionalDetuneValue1 = parseFloat(additionalDetuneSlider1.value);
    
    synth1.oscillator.detune.setValueAtTime(finePitchValue1 + additionalDetuneValue1, Tone.now());

    const finePitchValue2 = parseFloat(finePitchSlider2.value);
    const additionalDetuneValue2 = parseFloat(additionalDetuneSlider2.value);
    
    synth2.oscillator.detune.setValueAtTime(finePitchValue2 + additionalDetuneValue2, Tone.now());
}

// Function to play notes based on frequency (for both synths)
function playNoteByFrequency(baseFreq) {
    const finePitchValue1 = parseFloat(finePitchSlider1.value);
    const additionalDetuneValue1 = parseFloat(additionalDetuneSlider1.value);
    
    synth1.oscillator.frequency.setValueAtTime(baseFreq, Tone.now());
    updateDetune();
    
    synth1.triggerAttack(baseFreq); // Use triggerAttack without duration
    
    const finePitchValue2 = parseFloat(finePitchSlider2.value);
    const additionalDetuneValue2 = parseFloat(additionalDetuneSlider2.value);
    
    synth2.oscillator.frequency.setValueAtTime(baseFreq, Tone.now());
    updateDetune();
    
    synth2.triggerAttack(baseFreq); // Use triggerAttack without duration
}

// Function to update ADSR envelope for both synths
function updateADSR() {
    const attack = parseFloat(attackSlider.value);
    const decay = parseFloat(decaySlider.value);
    //const sustain = parseFloat(sustainSlider.value);
    const release = parseFloat(releaseSlider.value);

    // Apply ADSR values to both synths
    synth1.envelope.attack = attack;
    synth1.envelope.decay = decay;
    //synth1.envelope.sustain = sustain;
    synth1.envelope.release = release;

    synth2.envelope.attack = attack;
    synth2.envelope.decay = decay;
    //synth2.envelope.sustain = sustain;
    synth2.envelope.release = release;

    // Update the displayed values
    attackValue.textContent = attack;
    decayValue.textContent = decay;
    //sustainValue.textContent = sustain;
    releaseValue.textContent = release;
}

// Event listeners for ADSR sliders (shared for both synths)
const attackSlider = document.getElementById('attackSlider');
const decaySlider = document.getElementById('decaySlider');
const sustainSlider = document.getElementById('sustainSlider');
const releaseSlider = document.getElementById('releaseSlider');
const attackValue = document.getElementById('attackValue');
const decayValue = document.getElementById('decayValue');
//const sustainValue = document.getElementById('sustainValue');
const releaseValue = document.getElementById('releaseValue');

attackSlider.addEventListener('input', updateADSR);
decaySlider.addEventListener('input', updateADSR);
//sustainSlider.addEventListener('input', updateADSR);
releaseSlider.addEventListener('input', updateADSR);

// Event listeners for the controls of synth 1...
const finePitchSlider1 = document.getElementById('finePitchSlider1');
const additionalDetuneSlider1 = document.getElementById('additionalDetuneSlider1');
const waveformSelect1 = document.getElementById('waveformSelect1');
const fineValueLabel1 = document.getElementById('fineValue1');
const additionalDetuneValueLabel1 = document.getElementById('additionalDetuneValue1');

finePitchSlider1.addEventListener('input', () => {
   fineValueLabel1.textContent = finePitchSlider1.value;
   updateDetune();
});

additionalDetuneSlider1.addEventListener('input', () => {
   additionalDetuneValueLabel1.textContent = additionalDetuneSlider1.value;
   updateDetune();
});

waveformSelect1.addEventListener('change', (e) => {
   synth1.oscillator.type = e.target.value;
});

// Event listeners for the controls of synth 2
const finePitchSlider2 = document.getElementById('finePitchSlider2');
const additionalDetuneSlider2 = document.getElementById('additionalDetuneSlider2');
const waveformSelect2 = document.getElementById('waveformSelect2');
const fineValueLabel2 = document.getElementById('fineValue2');
const additionalDetuneValueLabel2 = document.getElementById('additionalDetuneValue2');

finePitchSlider2.addEventListener('input', () => {
   fineValueLabel2.textContent = finePitchSlider2.value;
   updateDetune();
});

additionalDetuneSlider2.addEventListener('input', () => {
   additionalDetuneValueLabel2.textContent = additionalDetuneSlider2.value;
   updateDetune();
});

waveformSelect2.addEventListener('change', (e) => {
   synth2.oscillator.type = e.target.value;
});

// Map HTML key elements to frequencies (for on-screen keyboard)

const noteToFrequency = {
   "C4": 261.63,
   "C#4": 277.18,
   "D4": 293.66,
   "D#4": 311.13,
   "E4": 329.63,
   "F4": 349.23,
   "F#4": 369.99,
   "G4": 392.00,
   "G#4": 415.30,
   "A4": 440.00,
   "A#4": 466.16,
   "B4": 493.88,
   "C5": 523.25 
};

// Event listeners for on-screen keyboard (same as before)
document.getElementById('C4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['C4']));
document.getElementById('C#4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['C#4']));
document.getElementById('D4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['D4']));
document.getElementById('D#4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['D#4']));
document.getElementById('E4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['E4']));
document.getElementById('F4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['F4']));
document.getElementById('F#4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['F#4']));
document.getElementById('G4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['G4']));
document.getElementById('G#4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['G#4']));
document.getElementById('A4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['A4']));
document.getElementById('A#4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['A#4']));
document.getElementById('B4').addEventListener('click', () => playNoteByFrequency(noteToFrequency['B4']));
document.getElementById('C5').addEventListener('click', () => playNoteByFrequency(noteToFrequency['C5']));

// QWERTY key mapping (same as before)
const keyToFrequency = {
   'a': noteToFrequency['C4'],
   'w': noteToFrequency['C#4'],
   's': noteToFrequency['D4'],
   'e': noteToFrequency['D#4'],
   'd': noteToFrequency['E4'],
   'f': noteToFrequency['F4'],
   't': noteToFrequency['F#4'],
   'g': noteToFrequency['G4'],
   'y': noteToFrequency['G#4'],
   'h': noteToFrequency['A4'],
   'u': noteToFrequency['A#4'],
   'j': noteToFrequency['B4'],
   'k': noteToFrequency['C5'],
};

// Get references to reverb control elements
const reverbDecaySlider = document.getElementById('reverbDecaySlider');
const reverbPreDelaySlider = document.getElementById('reverbPreDelaySlider');
const reverbDecayValue = document.getElementById('reverbDecayValue');
const reverbPreDelayValue = document.getElementById('reverbPreDelayValue')
const reverbMixSlider = document.getElementById('reverbMixSlider');;
const reverbMixValue = document.getElementById("reverbMixValue");

// Function to update reverb settings based on slider values
function updateReverb() {
    const decay = parseFloat(reverbDecaySlider.value);
    const preDelay = parseFloat(reverbPreDelaySlider.value);

    // Update reverb parameters
    reverb.decay = decay;
    reverb.preDelay = preDelay;

    // Update displayed values
    reverbDecayValue.textContent = decay.toFixed(1);
    reverbPreDelayValue.textContent = preDelay.toFixed(2);
}

// Event listeners for reverb sliders
reverbDecaySlider.addEventListener('input', updateReverb);
reverbPreDelaySlider.addEventListener('input', updateReverb);

// Initialize with default values
updateReverb();

function updateReverbMix() {
    const wetValue = parseFloat(reverbMixSlider.value);
    
    // Update the wet value of the reverb
    reverb.wet.value = wetValue;

    // Update the displayed value
    reverbMixValue.textContent = `${(wetValue * 100).toFixed(0)}%`;
}
reverbMixSlider.addEventListener('input', updateReverbMix);
updateReverbMix();

window.addEventListener('keydown', (e) => {
    
   const frequency = keyToFrequency[e.key];
   if (frequency) playNoteByFrequency(frequency);
});