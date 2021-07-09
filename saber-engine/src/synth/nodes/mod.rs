pub mod saw;

pub trait Node {
  /// process mutates left and right channels for the output.
  fn process(&mut self, left: &mut [f32], right: &mut [f32], position: i32);
}

pub trait ProcessNode {
  fn new(sample_rate: i32) -> Self;
}

pub trait SynthNode {
  fn new(sample_rate: i32, frequency: f32) -> Self;
}
