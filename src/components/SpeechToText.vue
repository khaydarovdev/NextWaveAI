<template>
  <div class="bg-white/5 backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 md:p-8 hover:border-orange-400/50 transition-all duration-300">
    <div class="flex items-center gap-4 mb-4">
      <i class='bx bx-microphone text-4xl md:text-5xl text-orange-400'></i>
      <div>
        <h3 class="text-xl md:text-2xl font-bold text-white">Speech to Text</h3>
        <p class="text-blue-300 text-xs md:text-sm">For hearing & motor-impaired students</p>
      </div>
    </div>

    <p class="text-blue-200 mb-6 text-sm md:text-base">
      Converts speech into text in real-time, helping students who cannot type or need visual transcription of audio content.
    </p>

    <div class="mb-4">
      <label class="block text-blue-200 text-sm font-semibold mb-2">
        <i class='bx bx-globe'></i> Language:
      </label>
      <select
        v-model="selectedLanguage"
        class="w-full p-3 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 cursor-pointer text-sm md:text-base"
      >
        <option value="en-US">🇬🇧 English (US)</option>
        <option value="en-GB">🇬🇧 English (UK)</option>
        <option value="ru-RU">🇷🇺 Русский</option>
        <option value="es-ES">🇪🇸 Español</option>
        <option value="fr-FR">🇫🇷 Français</option>
        <option value="de-DE">🇩🇪 Deutsch</option>
      </select>
    </div>

    <textarea
      v-model="transcript"
      readonly
      class="w-full h-32 md:h-40 p-4 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white placeholder-blue-400/50 focus:outline-none resize-none text-sm md:text-base"
      :placeholder="getPlaceholder()"
    ></textarea>

    <div class="flex gap-3 mt-6">
      <button
        @click="toggleListening"
        :disabled="!browserSupport"
        :class="isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'"
        class="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 text-sm md:text-base"
      >
        <i class='bx' :class="isListening ? 'bx-stop-circle' : 'bx-microphone'"></i>
        {{ isListening ? 'Stop Listening' : 'Start Listening' }}
      </button>
      <button
        v-if="transcript"
        @click="clear"
        class="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200"
      >
        <i class='bx bx-trash'></i>
      </button>
    </div>

    <div v-if="isListening" class="mt-4 flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-4 py-3 rounded-xl text-sm">
      <i class='bx bx-loader-circle bx-spin'></i>
      Listening... Speak now!
    </div>

    <div v-if="error" class="mt-4 flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
      <i class='bx bx-error-circle'></i>
      {{ error }}
    </div>

    <div v-if="success && !isListening" class="mt-4 flex items-center gap-2 bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl text-sm">
      <i class='bx bx-check-circle'></i>
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const transcript = ref('')
const isListening = ref(false)
const error = ref('')
const success = ref('')
const browserSupport = ref(false)
const selectedLanguage = ref('en-US')
let recognition = null

onMounted(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (SpeechRecognition) {
    browserSupport.value = true
    recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        }
      }
      if (finalTranscript) {
        transcript.value = (transcript.value + finalTranscript).trim()
      }
      error.value = ''
    }

    recognition.onerror = (event) => {
      isListening.value = false
      if (event.error === 'no-speech') {
        error.value = 'No speech detected. Please try again.'
      } else if (event.error === 'not-allowed') {
        error.value = 'Microphone access denied. Please enable permissions.'
      } else if (event.error === 'service-not-allowed') {
        error.value = 'Language not supported. Try English or Russian.'
      } else if (event.error !== 'aborted') {
        error.value = `Error: ${event.error}`
      }
    }

    recognition.onend = () => {
      if (isListening.value) {
        try {
          recognition.start()
        } catch (e) {
          isListening.value = false
        }
      }
    }
  }
})

const toggleListening = () => {
  if (!recognition) return

  if (isListening.value) {
    recognition.stop()
    isListening.value = false
    if (transcript.value) {
      success.value = 'Speech captured successfully!'
      setTimeout(() => success.value = '', 3000)
    }
  } else {
    transcript.value = ''
    error.value = ''
    success.value = ''
    recognition.lang = selectedLanguage.value
    isListening.value = true
    try {
      recognition.start()
    } catch (e) {
      error.value = 'Could not start. Try again.'
      isListening.value = false
    }
  }
}

const clear = () => {
  transcript.value = ''
  success.value = ''
}

const getPlaceholder = () => {
  const placeholders = {
    'en-US': "Click 'Start Listening' and speak...",
    'en-GB': "Click 'Start Listening' and speak...",
    'ru-RU': "Нажмите 'Start Listening' и говорите...",
    'es-ES': "Haz clic en 'Start Listening' y habla...",
    'fr-FR': "Cliquez sur 'Start Listening' et parlez...",
    'de-DE': "Klicken Sie auf 'Start Listening'..."
  }
  return placeholders[selectedLanguage.value] || placeholders['en-US']
}
</script>
