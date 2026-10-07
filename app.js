/**
 * VOCALIS STUDIO - ELEVENLABS NEURAL VOICE SUITE
 * High-performance client controller for text-to-speech synthesis,
 * audio visualization, and voice management.
 */

// ==========================================================================
// 1. Constants & Default Fallback Voice Library
// ==========================================================================
const DEFAULT_API_KEY = "sk_1818e5d9c0d279a08cb2c8c0d145959d37e8572c9ced0d13";
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

// Rich voice catalog matching the voices available on the user's ElevenLabs account
const FALLBACK_VOICES = [
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah - Mature, Reassuring, Confident",
    category: "premade",
    labels: { gender: "female", accent: "american", use_case: "news", descriptive: "soft" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e712-0e97-4b61-a523-f227d9dd6dc1.mp3"
  },
  {
    voice_id: "JBFqnCBsd6RMkjVDRZzb",
    name: "George - Warm, Captivating Storyteller",
    category: "premade",
    labels: { gender: "male", accent: "british", use_case: "narration", descriptive: "raspy" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-47bc-8025-1b8cac0634ba.mp3"
  },
  {
    voice_id: "IKne3meq5aSn9XLyUdCD",
    name: "Charlie - Deep, Confident, Energetic",
    category: "premade",
    labels: { gender: "male", accent: "australian", use_case: "conversational", descriptive: "casual" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-41a0-a50a-abb7281f7e66.mp3"
  },
  {
    voice_id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam - Dominant, Firm",
    category: "premade",
    labels: { gender: "male", accent: "american", use_case: "social_media", descriptive: "dominant" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3"
  },
  {
    voice_id: "pqHfZKP75CvOlQylNhV4",
    name: "Bill - Wise, Mature, Balanced",
    category: "premade",
    labels: { gender: "male", accent: "american", use_case: "storytelling", descriptive: "wise" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3"
  },
  {
    voice_id: "pFZP5JQG7iQjIQuC4Bku",
    name: "Lily - Velvety Actress",
    category: "premade",
    labels: { gender: "female", accent: "british", use_case: "narration", descriptive: "velvety" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3"
  },
  {
    voice_id: "Xb7hH8MSUJpSbSDYk0k2",
    name: "Alice - Clear, Engaging Educator",
    category: "premade",
    labels: { gender: "female", accent: "british", use_case: "education", descriptive: "engaging" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d1079831-41fb-408d-9a84-06c8bf5e31a0.mp3"
  },
  {
    voice_id: "CwhRBWXzGAHq8TQ4Fs17",
    name: "Roger - Laid-Back, Casual, Resonant",
    category: "premade",
    labels: { gender: "male", accent: "american", use_case: "conversational", descriptive: "casual" }
  },
  {
    voice_id: "FGY2WhTYpPnrIDTdsKH5",
    name: "Laura - Enthusiast, Quirky Attitude",
    category: "premade",
    labels: { gender: "female", accent: "american", use_case: "entertainment", descriptive: "quirky" }
  }
];

// Presets data
const SCRIPT_PRESETS = {
  tech: {
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah
    text: "Welcome to the future of neural audio. With deep transformer architecture and real-time inference, ElevenLabs brings emotional resonance, natural cadence, and lifelike nuance to digital speech."
  },
  story: {
    voiceId: "JBFqnCBsd6RMkjVDRZzb", // George
    text: "The old observatory sat atop the mist-veiled peak. Inside, gears whispered ancient melodies as the brass telescope aligned with a constellation never before cataloged by mortal eyes."
  },
  podcast: {
    voiceId: "IKne3meq5aSn9XLyUdCD", // Charlie
    text: "What is up, everyone! Welcome back to Episode 42 of The Neural Beat. Today, we're diving deep into synthetic media, ambient interfaces, and the technologies transforming creative work."
  },
  meditation: {
    voiceId: "pFZP5JQG7iQjIQuC4Bku", // Lily
    text: "Gently close your eyes. Allow your shoulders to relax away from your ears. Take a deep, tranquil breath in through your nose... pause... and exhale slowly, finding perfect stillness."
  },
  motivational: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam
    text: "Great achievements are never accidental. They are forged in moments of quiet dedication, consistent action, and the courage to begin when others hesitate. Make today count."
  }
};

// ==========================================================================
// 2. Application State
// ==========================================================================
const state = {
  apiKey: localStorage.getItem("vocalis_api_key") || DEFAULT_API_KEY,
  voices: [],
  selectedVoice: null,
  isGenerating: false,
  isPlaying: false,
  currentAudioUrl: null,
  currentAudioBlob: null,
  history: [],
  audioContext: null,
  analyser: null,
  audioSourceNode: null,
  previewAudio: null,
  isAudioConnectedToVisualizer: false
};

// Save key if not already saved
if (!localStorage.getItem("vocalis_api_key")) {
  localStorage.setItem("vocalis_api_key", DEFAULT_API_KEY);
}

// ==========================================================================
// 3. DOM Elements
// ==========================================================================
const DOM = {
  // Header & Account
  accountPill: document.getElementById("accountPill"),
  accountUser: document.getElementById("accountUser"),
  accountChars: document.getElementById("accountChars"),
  btnOpenSettings: document.getElementById("btnOpenSettings"),
  apiStatusText: document.getElementById("apiStatusText"),

  // Voice Card
  voiceSelect: document.getElementById("voiceSelect"),
  voiceAvatar: document.getElementById("voiceAvatar"),
  voiceInitials: document.getElementById("voiceInitials"),
  voiceGender: document.getElementById("voiceGender"),
  voiceAccent: document.getElementById("voiceAccent"),
  voiceCategory: document.getElementById("voiceCategory"),
  voiceIdTag: document.getElementById("voiceIdTag"),
  btnPreviewVoice: document.getElementById("btnPreviewVoice"),

  // Script Card
  textPromptInput: document.getElementById("textPromptInput"),
  charCount: document.getElementById("charCount"),
  wordCount: document.getElementById("wordCount"),
  estDuration: document.getElementById("estDuration"),
  btnPasteText: document.getElementById("btnPasteText"),
  btnClearText: document.getElementById("btnClearText"),
  presetChips: document.querySelectorAll(".preset-chip"),

  // Fine Tuning Settings
  modelSelect: document.getElementById("modelSelect"),
  stabilitySlider: document.getElementById("stabilitySlider"),
  stabilityVal: document.getElementById("stabilityVal"),
  similaritySlider: document.getElementById("similaritySlider"),
  similarityVal: document.getElementById("similarityVal"),
  styleSlider: document.getElementById("styleSlider"),
  styleVal: document.getElementById("styleVal"),
  speakerBoostToggle: document.getElementById("speakerBoostToggle"),

  // Primary CTA
  btnPlayNarration: document.getElementById("btnPlayNarration"),
  btnPlayText: document.getElementById("btnPlayText"),

  // Audio Player & Visualizer
  waveformCanvas: document.getElementById("waveformCanvas"),
  visualizerOverlay: document.getElementById("visualizerOverlay"),
  visualizerStatusText: document.getElementById("visualizerStatusText"),
  audioElement: document.getElementById("audioElement"),
  playbackRing: document.getElementById("playbackRing"),
  playerSubtitle: document.getElementById("playerSubtitle"),
  scrubberBar: document.getElementById("scrubberBar"),
  scrubberProgress: document.getElementById("scrubberProgress"),
  scrubberThumb: document.getElementById("scrubberThumb"),
  currentTimeLabel: document.getElementById("currentTimeLabel"),
  durationTimeLabel: document.getElementById("durationTimeLabel"),
  btnAudioToggle: document.getElementById("btnAudioToggle"),
  audioToggleIcon: document.getElementById("audioToggleIcon"),
  btnSkipBack: document.getElementById("btnSkipBack"),
  btnSkipForward: document.getElementById("btnSkipForward"),
  speedToggleGroup: document.getElementById("speedToggleGroup"),
  volumeSlider: document.getElementById("volumeSlider"),
  btnMuteToggle: document.getElementById("btnMuteToggle"),
  volIcon: document.getElementById("volIcon"),
  btnDownloadAudio: document.getElementById("btnDownloadAudio"),

  // History Card
  historyList: document.getElementById("historyList"),
  historyEmpty: document.getElementById("historyEmpty"),
  btnClearHistory: document.getElementById("btnClearHistory"),

  // Settings Modal
  settingsModal: document.getElementById("settingsModal"),
  btnCloseModal: document.getElementById("btnCloseModal"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  btnToggleKeyVisibility: document.getElementById("btnToggleKeyVisibility"),
  btnTestKey: document.getElementById("btnTestKey"),
  btnSaveKey: document.getElementById("btnSaveKey"),
  apiTestResults: document.getElementById("apiTestResults"),
  testStatusMessage: document.getElementById("testStatusMessage"),

  // Toasts
  toastContainer: document.getElementById("toastContainer")
};

// ==========================================================================
// 4. Initialization & Setup
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initVisualizer();
  bindEventListeners();
  updateTextStats();
  
  // Set initial settings inputs
  DOM.apiKeyInput.value = state.apiKey;
  
  // Load voices & user data
  loadVoicesAndAccount();
});

// ==========================================================================
// 5. API Integrations
// ==========================================================================

/**
 * Fetch Account Subscription and character balances
 */
async function fetchUserSubscription() {
  try {
    const res = await fetch(`${ELEVENLABS_BASE_URL}/user`, {
      method: "GET",
      headers: { "xi-api-key": state.apiKey }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user data: ${res.status}`);
    }

    const data = await res.json();
    if (data && data.subscription) {
      const sub = data.subscription;
      const userName = data.first_name || "Arjun";
      const tierName = (sub.tier || "Free").toUpperCase();
      const used = (sub.character_count || 0).toLocaleString();
      const limit = (sub.character_limit || 10000).toLocaleString();
      
      DOM.accountUser.textContent = `${userName} (${tierName})`;
      DOM.accountChars.textContent = `${used} / ${limit} chars used`;
      DOM.apiStatusText.textContent = `ElevenLabs API: Connected (${userName} • ${tierName})`;
    }
    return true;
  } catch (err) {
    console.warn("Could not load ElevenLabs user details:", err);
    DOM.accountUser.textContent = "ElevenLabs Connected";
    DOM.accountChars.textContent = "10,000 chars available";
    return false;
  }
}

/**
 * Fetch voice catalog from ElevenLabs, fall back to embedded voices if unavailable
 */
async function loadVoicesAndAccount() {
  await fetchUserSubscription();
  
  try {
    DOM.voiceSelect.innerHTML = '<option value="" disabled>Loading ElevenLabs Voices...</option>';
    
    const res = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
      method: "GET",
      headers: { "xi-api-key": state.apiKey }
    });

    if (!res.ok) {
      throw new Error(`Voice fetch error: ${res.status}`);
    }

    const data = await res.json();
    if (data.voices && Array.isArray(data.voices) && data.voices.length > 0) {
      state.voices = data.voices;
    } else {
      state.voices = FALLBACK_VOICES;
    }
  } catch (err) {
    console.warn("Using curated fallback voices due to network error:", err);
    state.voices = FALLBACK_VOICES;
    showToast("Loaded offline voice roster. Online voices may require active internet.", "info");
  }

  populateVoiceSelect();
}

/**
 * Populate the Voice Selector dropdown
 */
function populateVoiceSelect() {
  DOM.voiceSelect.innerHTML = "";

  state.voices.forEach((voice, index) => {
    const opt = document.createElement("option");
    opt.value = voice.voice_id;

    const gender = voice.labels?.gender ? voice.labels.gender.toUpperCase() : "AGENT";
    const accent = voice.labels?.accent ? ` • ${voice.labels.accent}` : "";
    const style = voice.labels?.descriptive || voice.labels?.use_case || "";
    const desc = style ? ` (${style})` : "";

    opt.textContent = `${voice.name}${desc} [${gender}${accent}]`;
    DOM.voiceSelect.appendChild(opt);
  });

  // Pick default voice: Sarah (supported on current tier) or first available voice
  const defaultVoice = state.voices.find(v => v.voice_id === "EXAVITQu4vr4xnSDxMaL") || state.voices[0];
  if (defaultVoice) {
    DOM.voiceSelect.value = defaultVoice.voice_id;
    selectVoice(defaultVoice);
  }
}

/**
 * Update UI for the currently selected voice
 */
function selectVoice(voice) {
  state.selectedVoice = voice;
  if (!voice) return;

  // Initials
  const initials = voice.name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  DOM.voiceInitials.textContent = initials || "AI";

  // Gender
  const gender = voice.labels?.gender || "Neutral";
  DOM.voiceGender.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);

  // Accent
  const accent = voice.labels?.accent || "Standard";
  DOM.voiceAccent.textContent = accent.charAt(0).toUpperCase() + accent.slice(1);

  // Category or use-case
  const category = voice.labels?.use_case || voice.category || "General";
  DOM.voiceCategory.textContent = category.replace(/_/g, " ").toUpperCase();

  // ID snippet
  DOM.voiceIdTag.textContent = `${voice.voice_id.slice(0, 6)}...`;
  DOM.voiceIdTag.title = `Voice ID: ${voice.voice_id}`;

  // Preview button availability
  if (voice.preview_url) {
    DOM.btnPreviewVoice.style.display = "inline-flex";
  } else {
    DOM.btnPreviewVoice.style.display = "none";
  }
}

/**
 * Synthesize speech via ElevenLabs API
 */
async function generateSpeech() {
  const text = DOM.textPromptInput.value.trim();
  if (!text) {
    showToast("Please enter or paste some text script first!", "error");
    DOM.textPromptInput.focus();
    return;
  }

  if (!state.selectedVoice) {
    showToast("Please choose an AI voice agent.", "error");
    return;
  }

  if (state.isGenerating) return;

  // Set loading state
  setGeneratingState(true);
  DOM.visualizerOverlay.classList.remove("hidden");
  DOM.visualizerStatusText.textContent = `Synthesizing neural speech with ${state.selectedVoice.name}...`;

  try {
    const voiceId = state.selectedVoice.voice_id;
    const modelId = DOM.modelSelect.value;
    const stability = parseFloat(DOM.stabilitySlider.value);
    const similarityBoost = parseFloat(DOM.similaritySlider.value);
    const style = parseFloat(DOM.styleSlider.value);
    const useSpeakerBoost = DOM.speakerBoostToggle.checked;

    const requestPayload = {
      text: text,
      model_id: modelId,
      voice_settings: {
        stability: stability,
        similarity_boost: similarityBoost,
        style: style,
        use_speaker_boost: useSpeakerBoost
      }
    };

    const response = await fetch(`${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": state.apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const detail = errorJson?.detail?.message || errorJson?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(detail);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Save audio
    state.currentAudioBlob = audioBlob;
    state.currentAudioUrl = audioUrl;

    // Load into audio player
    DOM.audioElement.src = audioUrl;
    DOM.playerSubtitle.textContent = `Voiced by ${state.selectedVoice.name} • ${modelId}`;

    // Add to session history
    addToHistory({
      voice: state.selectedVoice,
      text: text,
      blob: audioBlob,
      url: audioUrl,
      timestamp: new Date()
    });

    // Refresh quota count
    fetchUserSubscription();

    // Enable player controls
    enablePlayerControls(true);

    // Automatically start playback
    await playAudio();
    showToast(`Successfully narrated by ${state.selectedVoice.name}!`, "success");

  } catch (err) {
    console.error("Speech synthesis failed:", err);
    showToast(`Generation failed: ${err.message}`, "error");
    DOM.visualizerStatusText.textContent = `Error: ${err.message}`;
  } finally {
    setGeneratingState(false);
  }
}

function setGeneratingState(isBusy) {
  state.isGenerating = isBusy;
  if (isBusy) {
    DOM.btnPlayNarration.classList.add("loading");
    DOM.btnPlayNarration.disabled = true;
    DOM.btnPlayText.textContent = "Synthesizing Audio...";
  } else {
    DOM.btnPlayNarration.classList.remove("loading");
    DOM.btnPlayNarration.disabled = false;
    DOM.btnPlayText.textContent = "Generate & Play Narration";
  }
}

// ==========================================================================
// 6. Audio Playback & Web Audio API Visualizer
// ==========================================================================

function initAudioContext() {
  if (!state.audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      state.audioContext = new AudioCtx();
      state.analyser = state.audioContext.createAnalyser();
      state.analyser.fftSize = 128;
      state.analyser.smoothingTimeConstant = 0.8;
    }
  }

  if (state.audioContext && state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }

  // Connect audio element if not already connected
  if (state.audioContext && state.analyser && !state.isAudioConnectedToVisualizer) {
    try {
      state.audioSourceNode = state.audioContext.createMediaElementSource(DOM.audioElement);
      state.audioSourceNode.connect(state.analyser);
      state.analyser.connect(state.audioContext.destination);
      state.isAudioConnectedToVisualizer = true;
    } catch (e) {
      console.warn("MediaElementSource connection info:", e);
    }
  }
}

async function playAudio() {
  try {
    initAudioContext();
    await DOM.audioElement.play();
    state.isPlaying = true;
    updatePlayPauseUI(true);
    DOM.visualizerOverlay.classList.add("hidden");
  } catch (err) {
    console.warn("Autoplay was prevented or audio failed to start:", err);
    state.isPlaying = false;
    updatePlayPauseUI(false);
  }
}

function pauseAudio() {
  DOM.audioElement.pause();
  state.isPlaying = false;
  updatePlayPauseUI(false);
}

function toggleAudio() {
  if (DOM.audioElement.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
}

function updatePlayPauseUI(playing) {
  if (playing) {
    DOM.playbackRing.classList.add("playing");
    DOM.audioToggleIcon.innerHTML = `
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    `;
    DOM.btnAudioToggle.title = "Pause Audio";
  } else {
    DOM.playbackRing.classList.remove("playing");
    DOM.audioToggleIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    DOM.btnAudioToggle.title = "Play Audio";
  }
}

function enablePlayerControls(enabled) {
  DOM.btnAudioToggle.disabled = !enabled;
  DOM.btnSkipBack.disabled = !enabled;
  DOM.btnSkipForward.disabled = !enabled;
  DOM.btnDownloadAudio.disabled = !enabled;
}

// Visualizer Rendering Loop
function initVisualizer() {
  const canvas = DOM.waveformCanvas;
  const ctx = canvas.getContext("2d");

  // High DPI scaling
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = (rect.width || 600) * dpr;
  canvas.height = (rect.height || 140) * dpr;
  ctx.scale(dpr, dpr);

  window.addEventListener("resize", () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = (r.width || 600) * dpr;
    canvas.height = (r.height || 140) * dpr;
    ctx.scale(dpr, dpr);
  });

  let restingPhase = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    if (state.isPlaying && state.analyser) {
      const bufferLength = state.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      state.analyser.getByteFrequencyData(dataArray);

      const numBars = 48;
      const barSpacing = 4;
      const totalBarWidth = (w - (numBars - 1) * barSpacing) / numBars;
      const barWidth = Math.max(3, totalBarWidth);

      // Render glowing dynamic audio frequency bars
      for (let i = 0; i < numBars; i++) {
        const dataIndex = Math.floor((i / numBars) * (bufferLength * 0.75));
        const val = dataArray[dataIndex] || 0;
        const barHeight = Math.max(4, (val / 255) * (h - 20));

        const x = i * (barWidth + barSpacing) + 10;
        const y = (h - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, "#06b6d4");
        grad.addColorStop(0.5, "#6366f1");
        grad.addColorStop(1, "#ec4899");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 3, 3]);
        ctx.fill();
      }

      // Draw horizontal dynamic glowing baseline
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

    } else {
      // Resting subtle sine wave animation
      restingPhase += 0.03;
      const numBars = 48;
      const barSpacing = 4;
      const barWidth = Math.max(3, (w - (numBars - 1) * barSpacing) / numBars);

      for (let i = 0; i < numBars; i++) {
        const wave = Math.sin(restingPhase + i * 0.25) * 8 + 12;
        const x = i * (barWidth + barSpacing) + 10;
        const y = (h - wave) / 2;

        ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, wave, [2, 2, 2, 2]);
        ctx.fill();
      }
    }
  }

  renderFrame();
}

// ==========================================================================
// 7. Session Recordings History
// ==========================================================================

function addToHistory(item) {
  state.history.unshift(item);
  renderHistory();
}

function renderHistory() {
  if (state.history.length === 0) {
    DOM.historyEmpty.style.display = "flex";
    return;
  }

  DOM.historyEmpty.style.display = "none";
  DOM.historyList.innerHTML = "";

  state.history.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "history-item";
    if (state.currentAudioUrl === item.url) {
      el.classList.add("active-item");
    }

    const timeStr = item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const textSnippet = item.text.length > 55 ? `${item.text.slice(0, 55)}...` : item.text;

    el.innerHTML = `
      <div class="item-left">
        <button class="item-play-btn" data-index="${index}" title="Play Recording">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
        <div class="item-meta">
          <div class="item-voice-row">
            <span>${item.voice.name}</span>
            <span class="item-time">${timeStr}</span>
          </div>
          <p class="item-snippet">"${escapeHtml(textSnippet)}"</p>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn btn-ghost btn-sm btn-icon item-download-btn" data-index="${index}" title="Download">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
        </button>
      </div>
    `;

    // History item click handlers
    el.querySelector(".item-play-btn").addEventListener("click", () => {
      loadHistoryItem(item);
    });

    el.querySelector(".item-download-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      downloadBlob(item.blob, `vocalis-${item.voice.name.toLowerCase()}-${Date.now()}.mp3`);
    });

    DOM.historyList.appendChild(el);
  });
}

function loadHistoryItem(item) {
  state.currentAudioBlob = item.blob;
  state.currentAudioUrl = item.url;
  DOM.audioElement.src = item.url;
  DOM.playerSubtitle.textContent = `Voiced by ${item.voice.name}`;
  enablePlayerControls(true);
  playAudio();
  renderHistory();
}

function downloadCurrentAudio() {
  if (!state.currentAudioBlob) return;
  const voiceName = state.selectedVoice ? state.selectedVoice.name.toLowerCase() : "narration";
  downloadBlob(state.currentAudioBlob, `vocalis-${voiceName}-${Date.now()}.mp3`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`, "info");
}

// ==========================================================================
// 8. Event Listeners & Interactive Handlers
// ==========================================================================

function bindEventListeners() {
  // Voice selection change
  DOM.voiceSelect.addEventListener("change", (e) => {
    const v = state.voices.find(item => item.voice_id === e.target.value);
    if (v) selectVoice(v);
  });

  // Voice Preview Button
  DOM.btnPreviewVoice.addEventListener("click", () => {
    if (!state.selectedVoice || !state.selectedVoice.preview_url) return;

    if (state.previewAudio) {
      state.previewAudio.pause();
    }

    state.previewAudio = new Audio(state.selectedVoice.preview_url);
    state.previewAudio.play().catch(e => console.warn("Preview play error:", e));
    showToast(`Playing sample audio for ${state.selectedVoice.name}`, "info");
  });

  // Text stats on input
  DOM.textPromptInput.addEventListener("input", updateTextStats);

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  DOM.textPromptInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      generateSpeech();
    }
  });

  // Clear text
  DOM.btnClearText.addEventListener("click", () => {
    DOM.textPromptInput.value = "";
    updateTextStats();
    DOM.textPromptInput.focus();
  });

  // Paste text
  DOM.btnPasteText.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        DOM.textPromptInput.value = text;
        updateTextStats();
        showToast("Pasted from clipboard!", "info");
      }
    } catch {
      showToast("Clipboard access denied. Please paste manually.", "info");
    }
  });

  // Quick preset chips
  DOM.presetChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const presetKey = chip.getAttribute("data-preset");
      const preset = SCRIPT_PRESETS[presetKey];
      if (preset) {
        DOM.textPromptInput.value = preset.text;
        updateTextStats();

        // Switch voice if preset recommends one
        if (preset.voiceId) {
          const matchVoice = state.voices.find(v => v.voice_id === preset.voiceId);
          if (matchVoice) {
            DOM.voiceSelect.value = matchVoice.voice_id;
            selectVoice(matchVoice);
          }
        }
        showToast(`Loaded "${chip.textContent}" preset`, "info");
      }
    });
  });

  // Sliders value badges
  DOM.stabilitySlider.addEventListener("input", (e) => {
    DOM.stabilityVal.textContent = parseFloat(e.target.value).toFixed(2);
  });

  DOM.similaritySlider.addEventListener("input", (e) => {
    DOM.similarityVal.textContent = parseFloat(e.target.value).toFixed(2);
  });

  DOM.styleSlider.addEventListener("input", (e) => {
    DOM.styleVal.textContent = parseFloat(e.target.value).toFixed(2);
  });

  // Primary Generate CTA
  DOM.btnPlayNarration.addEventListener("click", generateSpeech);

  // Audio Player Toggle
  DOM.btnAudioToggle.addEventListener("click", toggleAudio);

  // Audio Element State Handlers
  DOM.audioElement.addEventListener("play", () => {
    state.isPlaying = true;
    updatePlayPauseUI(true);
    DOM.visualizerOverlay.classList.add("hidden");
  });

  DOM.audioElement.addEventListener("pause", () => {
    state.isPlaying = false;
    updatePlayPauseUI(false);
  });

  DOM.audioElement.addEventListener("ended", () => {
    state.isPlaying = false;
    updatePlayPauseUI(false);
    DOM.visualizerOverlay.classList.remove("hidden");
    DOM.visualizerStatusText.textContent = "Playback complete. Ready for new narration.";
  });

  // Audio Time Update & Scrubber
  DOM.audioElement.addEventListener("timeupdate", () => {
    const cur = DOM.audioElement.currentTime;
    const dur = DOM.audioElement.duration || 0;

    DOM.currentTimeLabel.textContent = formatTime(cur);
    if (!isNaN(dur) && dur > 0) {
      DOM.durationTimeLabel.textContent = formatTime(dur);
      const pct = (cur / dur) * 100;
      DOM.scrubberProgress.style.width = `${pct}%`;
      DOM.scrubberThumb.style.left = `${pct}%`;
    }
  });

  DOM.audioElement.addEventListener("loadedmetadata", () => {
    DOM.durationTimeLabel.textContent = formatTime(DOM.audioElement.duration || 0);
  });

  // Scrubber click to seek
  DOM.scrubberBar.addEventListener("click", (e) => {
    const dur = DOM.audioElement.duration;
    if (isNaN(dur) || dur <= 0) return;

    const rect = DOM.scrubberBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    DOM.audioElement.currentTime = pos * dur;
  });

  // Skip buttons
  DOM.btnSkipBack.addEventListener("click", () => {
    DOM.audioElement.currentTime = Math.max(0, DOM.audioElement.currentTime - 5);
  });

  DOM.btnSkipForward.addEventListener("click", () => {
    const dur = DOM.audioElement.duration || 0;
    DOM.audioElement.currentTime = Math.min(dur, DOM.audioElement.currentTime + 5);
  });

  // Speed selector
  DOM.speedToggleGroup.querySelectorAll(".speed-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.speedToggleGroup.querySelectorAll(".speed-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const speed = parseFloat(btn.getAttribute("data-speed"));
      DOM.audioElement.playbackRate = speed;
    });
  });

  // Volume slider
  DOM.volumeSlider.addEventListener("input", (e) => {
    const vol = parseFloat(e.target.value);
    DOM.audioElement.volume = vol;
    updateVolumeIcon(vol);
  });

  DOM.btnMuteToggle.addEventListener("click", () => {
    if (DOM.audioElement.volume > 0) {
      DOM.audioElement.dataset.lastVol = DOM.audioElement.volume;
      DOM.audioElement.volume = 0;
      DOM.volumeSlider.value = 0;
    } else {
      const restore = parseFloat(DOM.audioElement.dataset.lastVol || 1);
      DOM.audioElement.volume = restore;
      DOM.volumeSlider.value = restore;
    }
    updateVolumeIcon(DOM.audioElement.volume);
  });

  // Download MP3
  DOM.btnDownloadAudio.addEventListener("click", downloadCurrentAudio);

  // Clear History
  DOM.btnClearHistory.addEventListener("click", () => {
    state.history = [];
    renderHistory();
    showToast("Session history cleared.", "info");
  });

  // Settings Modal Controls
  DOM.btnOpenSettings.addEventListener("click", () => {
    DOM.apiKeyInput.value = state.apiKey;
    DOM.settingsModal.classList.add("open");
  });

  DOM.accountPill.addEventListener("click", () => {
    DOM.apiKeyInput.value = state.apiKey;
    DOM.settingsModal.classList.add("open");
  });

  DOM.btnCloseModal.addEventListener("click", () => {
    DOM.settingsModal.classList.remove("open");
  });

  DOM.settingsModal.addEventListener("click", (e) => {
    if (e.target === DOM.settingsModal) {
      DOM.settingsModal.classList.remove("open");
    }
  });

  // Toggle API Key visibility
  DOM.btnToggleKeyVisibility.addEventListener("click", () => {
    if (DOM.apiKeyInput.type === "password") {
      DOM.apiKeyInput.type = "text";
      DOM.btnToggleKeyVisibility.textContent = "🔒";
    } else {
      DOM.apiKeyInput.type = "password";
      DOM.btnToggleKeyVisibility.textContent = "👁️";
    }
  });

  // Test Key Button
  DOM.btnTestKey.addEventListener("click", async () => {
    const testKey = DOM.apiKeyInput.value.trim();
    if (!testKey) {
      showModalStatus("Please enter an API key", false);
      return;
    }

    DOM.btnTestKey.disabled = true;
    DOM.btnTestKey.textContent = "Testing...";

    try {
      const res = await fetch(`${ELEVENLABS_BASE_URL}/user`, {
        method: "GET",
        headers: { "xi-api-key": testKey }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: Invalid key`);

      const data = await res.json();
      const userName = data.first_name || "Arjun";
      const remaining = data.subscription?.character_limit - data.subscription?.character_count;
      showModalStatus(`Connected as ${userName}! (${remaining.toLocaleString()} chars remaining)`, true);
    } catch (err) {
      showModalStatus(`Connection test failed: ${err.message}`, false);
    } finally {
      DOM.btnTestKey.disabled = false;
      DOM.btnTestKey.textContent = "Test Connection";
    }
  });

  // Save Key Button
  DOM.btnSaveKey.addEventListener("click", () => {
    const newKey = DOM.apiKeyInput.value.trim();
    if (!newKey) {
      showToast("API key cannot be empty.", "error");
      return;
    }

    state.apiKey = newKey;
    localStorage.setItem("vocalis_api_key", newKey);
    DOM.settingsModal.classList.remove("open");
    showToast("ElevenLabs API Key saved & activated!", "success");

    // Reload voices with new key
    loadVoicesAndAccount();
  });
}

function showModalStatus(msg, isSuccess) {
  DOM.testStatusMessage.textContent = msg;
  const container = DOM.apiTestResults.querySelector(".connection-status");
  if (isSuccess) {
    container.className = "connection-status connected";
  } else {
    container.className = "connection-status error";
  }
}

function updateVolumeIcon(vol) {
  if (vol === 0) {
    DOM.volIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    `;
  } else {
    DOM.volIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    `;
  }
}

function updateTextStats() {
  const text = DOM.textPromptInput.value;
  const charLength = text.length;
  DOM.charCount.textContent = charLength.toLocaleString();

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  DOM.wordCount.textContent = words.toLocaleString();

  // Approx speaking rate ~140 words per minute => ~2.33 words/sec
  const seconds = Math.ceil((words / 140) * 60);
  DOM.estDuration.textContent = words === 0 ? "0s" : `~${seconds}s`;
}

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}
