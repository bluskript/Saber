use super::{Node, SynthNode};

pub struct SawTooth {
    osc_size: f32
}

impl SynthNode for SawTooth {
    fn new(sample_rate: i32, frequency: f32) -> Self {
        SawTooth {
            osc_size: sample_rate as f32 / frequency
        }
    }
}

impl Node for SawTooth {
    fn process(&mut self, left: &mut [f32], right: &mut [f32], position: i32) {
        for (i, (l, r)) in left.iter_mut().zip(right.iter_mut()).enumerate() {
            let osc_pos = 
                (position + i as i32) as f32 % self.osc_size;
            let val = osc_pos % 1.0 * 2.0 - 1.0;
            *r = val;
            *l = val;
        }
    }
}
