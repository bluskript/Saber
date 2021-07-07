
/* eslint-disable import/no-duplicates */

interface AudioWorkletProcessor {
  readonly port: MessagePort
  prototype: AudioWorkletProcessor

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare let AudioWorkletProcessor: {
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor
}

declare interface Window {

}

declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options?: AudioWorkletNodeOptions
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: AudioParamDescriptor[]
  }
)
