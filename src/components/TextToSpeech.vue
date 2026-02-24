<template>
  <div class="bg-white/5 backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 md:p-8 hover:border-cyan-400/50 transition-all duration-300">
    <div class="flex items-center gap-4 mb-4">
      <i class='bx bx-volume-full text-4xl md:text-5xl text-cyan-400'></i>
      <div>
        <h3 class="text-xl md:text-2xl font-bold text-white">Text to Speech</h3>
        <p class="text-blue-300 text-xs md:text-sm">For visually impaired students</p>
      </div>
    </div>

    <p class="text-blue-200 mb-6 text-sm md:text-base">
      Converts any text into natural speech, enabling visually impaired students to access educational content independently.
    </p>

    <textarea
      v-model="text"
      class="w-full h-32 md:h-40 p-4 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:border-cyan-400 resize-none text-sm md:text-base"
      placeholder="Type text here... Try: 'The mitochondria is the powerhouse of the cell.'"
    ></textarea>

    <div class="mt-4">
      <label class="block text-blue-200 text-sm font-semibold mb-2">
        <i class='bx bx-user-voice'></i> Voice:
      </label>
      <select
        v-model="selectedVoice"
        class="w-full p-3 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 cursor-pointer text-sm md:text-base"
      >
        <option v-for="(voice, index) in voices" :key="index" :value="index">
          {{ voice.name }} ({{ voice.lang }})
        </option>
      </select>
    </div>

    <div class="flex gap-3 mt-6">
      <button
        @click="speak"
        :disabled="!text || isSpeaking"
        class="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 text-sm md:text-base"
      >
        <i class='bx' :class="isSpeaking ? 'bx-stop' : 'bx-play'"></i>
        {{ isSpeaking ? 'Speaking...' : 'Speak Text' }}
      </button>
      <button
        v-if="isSpeaking"
        @click="stop"
        class="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200"
      >
        <i class='bx bx-stop'></i>
      </button>
    </div>

    <div v-if="success" class="mt-4 flex items-center gap-2 bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl text-sm">
      <i class='bx bx-check-circle'></i>
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const text = ref('')
const isSpeaking = ref(false)
const success = ref('')
const voices = ref([])
const selectedVoice = ref(0)

onMounted(() => {
  if ('speechSynthesis' in window) {
    const loadVoices = () => {
      let allVoices = speechSynthesis.getVoices()
      if (allVoices.length === 0) {
        setTimeout(loadVoices, 100)
        return
      }

      voices.value = allVoices.filter(voice => {
        const name = voice.name.toLowerCase()
        const isPremium = name.includes('neural') || name.includes('natural') ||
                         name.includes('enhanced') || name.includes('samantha') || name.includes('alex')
        const isRobotic = name.includes('espeak')
        return !isRobotic && (isPremium || voice.lang.startsWith('en') || voice.lang.startsWith('ru'))
      })

      if (voices.value.length === 0) voices.value = allVoices

      const bestIndex = voices.value.findIndex(v =>
        v.lang.startsWith('en') && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('samantha'))
      )
      if (bestIndex !== -1) selectedVoice.value = bestIndex
    }

    loadVoices()
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices
    }
  }
})

const speak = () => {
  if (!text.value) return
  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text.value)
  if (voices.value[selectedVoice.value]) {
    utterance.voice = voices.value[selectedVoice.value]
  }
  utterance.rate = 0.9
  utterance.pitch = 1
  utterance.volume = 1

  utterance.onstart = () => {
    isSpeaking.value = true
    success.value = ''
  }

  utterance.onend = () => {
    isSpeaking.value = false
    success.value = 'Text spoken successfully!'
    setTimeout(() => success.value = '', 3000)
  }

  speechSynthesis.speak(utterance)
}

const stop = () => {
  speechSynthesis.cancel()
  isSpeaking.value = false
}
</script>
