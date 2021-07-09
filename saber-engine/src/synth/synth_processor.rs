use wasm_bindgen::prelude::*;
use super::{config::Config, nodes::{Node, saw::SawTooth}};

#[wasm_bindgen]
pub struct SynthProcessor {
    /// The number of samples per second.
    sample_rate: i32,
    /// The position in the playback buffer. Used to prevent the buffer from resetting incorrectly.
    position: i32,

    /// The configuration of the synth.
    config: Config,

    /// The node which produces the synth output.
    output_node: Option<Box<dyn Node>>,
}

#[wasm_bindgen]
impl SynthProcessor {
    pub fn new(sample_rate: i32) -> SynthProcessor {
        SynthProcessor {
            sample_rate,
            position: 0,
            output_node: Some(SawTooth::new(sample_rate, 500)),
            config: Config::default(),
        }
    }

    pub fn process_frame(&mut self, left: &mut [f32], right: &mut [f32]) {
        // calls process_frame on output_node
        if let Some(output_node) = self.output_node.as_mut() {
            let node = output_node.as_mut();
            node.process(left, right, self.position);
        }
    }
}