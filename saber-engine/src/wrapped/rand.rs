use js_sys::Math;

pub fn random() -> f32 {
  unsafe {
    Math::random() as f32
  }
}