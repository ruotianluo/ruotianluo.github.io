/*
 * Math Garden sherpa-onnx worker adapter.
 * Runtime: sherpa-onnx v1.12.20, Apache-2.0.
 * The official single-thread browser runtime is kept in a Worker so model
 * initialization and synthesis do not block the learning interface.
 */
let tts = null;
let ready = false;

self.Module = {
  locateFile(path) {
    if (path.endsWith(".wasm")) {
      return new URL("../runtime/sherpa-onnx-wasm-main-tts.wasm", self.location.href).href;
    }
    return new URL(path, self.location.href).href;
  },
  setStatus(status) {
    const match = String(status).match(/Downloading data\.\.\. \((\d+)\/(\d+)\)/);
    self.postMessage({
      type: "progress",
      status: String(status),
      loaded: match ? Number(match[1]) : undefined,
      total: match ? Number(match[2]) : undefined,
    });
  },
  onRuntimeInitialized() {
    try {
      tts = createOfflineTts(self.Module, {
        offlineTtsModelConfig: {
          offlineTtsVitsModelConfig: {"model":"./model.onnx","lexicon":"","tokens":"./tokens.txt","dataDir":"./espeak-ng-data","noiseScale":0.667,"noiseScaleW":0.8,"lengthScale":1},
          numThreads: 1,
          debug: 0,
          provider: "cpu",
        },
        ruleFsts: "",
        ruleFars: "",
        maxNumSentences: 1,
      });
      ready = true;
      self.postMessage({
        type: "ready",
        language: "en",
        sampleRate: tts.sampleRate,
        numSpeakers: tts.numSpeakers,
      });
    } catch (error) {
      self.postMessage({ type: "error", stage: "initialize", message: error instanceof Error ? error.message : String(error) });
    }
  },
};

importScripts("../runtime/sherpa-onnx-tts.js");
importScripts("./sherpa-onnx-wasm-main-tts.js");

self.onmessage = (event) => {
  if (event.data?.type !== "generate" || !ready || !tts) return;
  const requestId = event.data.requestId;
  try {
    const audio = tts.generate({
      text: String(event.data.text || ""),
      sid: 0,
      speed: Number(event.data.speed) || 1,
    });
    self.postMessage(
      { type: "result", requestId, samples: audio.samples, sampleRate: audio.sampleRate },
      [audio.samples.buffer],
    );
  } catch (error) {
    self.postMessage({
      type: "error",
      stage: "generate",
      requestId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
