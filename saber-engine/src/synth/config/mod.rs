use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Default, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Config {
    oscillators: Vec<OscillatorConfig>
}

#[wasm_bindgen]
impl Config {
    pub fn from_json(val: &JsValue) -> Self {
        return val.into_serde().unwrap()
    }

    pub fn to_json(&mut self) -> JsValue {
        return JsValue::from_serde(self).unwrap()
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub enum OscillatorKind {
    Square,
    Sawtooth,
    Triangle,
    Sine,
    Noise,
}

impl Default for OscillatorKind {
    fn default() -> Self { OscillatorKind::Sawtooth }
}

#[derive(Default, Serialize, Deserialize)]
pub struct OscillatorConfig {
    /// The shape of the waveform.
    kind: OscillatorKind,

    /// The loudness of the oscillator.
    volume: f32,

    /// The octave the oscillator is in.
    octave: i32,

    /// Semitone offset of the oscillator.
    semitones: i32,

    /// A more granular control over the frequency of the oscillator.
    tune: f32,

    /// The detune of the oscillator.
    detune: f32,

    /// The number of voices the oscillator has.
    unison: i32,
}