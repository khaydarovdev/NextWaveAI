<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <!-- Header -->
    <header class="container mx-auto px-4 md:px-6 py-8 md:py-12 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <i class='bx bx-brain text-5xl md:text-6xl text-cyan-400 hidden md:block'></i>
        <h1 class="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
          NextWave AI
        </h1>
      </div>
      <p class="text-lg md:text-xl lg:text-2xl text-blue-200 mb-3">Breaking Barriers in Education</p>
      <p class="text-sm md:text-base lg:text-lg text-blue-300 max-w-2xl mx-auto px-4">
        Empowering disabled students through AI-powered assistive technologies
      </p>
    </header>

    <!-- Accessibility Controls Bar -->
    <AccessibilityBar
      @toggle-dyslexic-font="toggleDyslexicFont"
      @change-overlay="changeOverlay"
    />

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 pb-20">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">Assistive Technology Demos</h2>
        <p class="text-sm md:text-base text-blue-300 px-4">Real-world tools helping disabled students learn better</p>
      </div>

      <!-- Feature Grid -->
      <div class="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
        <!-- Text to Speech -->
        <TextToSpeech />

        <!-- Speech to Text -->
        <SpeechToText />

        <!-- Text to Image (Full Width) -->
        <div class="lg:col-span-2">
          <TextToImage />
        </div>

        <!-- Text Simplifier (Full Width) -->
        <div class="lg:col-span-2">
          <TextSimplifier />
        </div>

        <!-- Focus Mode (Full Width) -->
        <div class="lg:col-span-2">
          <FocusMode />
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
        <div class="text-center p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
          <div class="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">1.3B</div>
          <div class="text-blue-300 text-xs md:text-sm">People with disabilities</div>
        </div>
        <div class="text-center p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
          <div class="text-3xl md:text-4xl font-bold text-orange-400 mb-2">20%</div>
          <div class="text-blue-300 text-xs md:text-sm">Performance boost with tech</div>
        </div>
        <div class="text-center p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
          <div class="text-3xl md:text-4xl font-bold text-orange-400 mb-2">24/7</div>
          <div class="text-blue-300 text-xs md:text-sm">Always available</div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center py-8 text-blue-300 border-t border-white/10 px-6">
      <p class="mb-2 text-sm md:text-base">&copy; 2025 Nextwave AI - ELO Research Competition</p>
      <p class="text-xs md:text-sm text-blue-400">Bridging the Gap in Inclusive Education</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AccessibilityBar from './components/AccessibilityBar.vue'
import TextToSpeech from './components/TextToSpeech.vue'
import SpeechToText from './components/SpeechToText.vue'
import TextToImage from './components/TextToImage.vue'
import TextSimplifier from './components/TextSimplifier.vue'
import FocusMode from './components/FocusMode.vue'

const toggleDyslexicFont = () => {
  document.body.classList.toggle('dyslexic-font')
}

const changeOverlay = (color) => {
  document.body.classList.remove('overlay-yellow', 'overlay-blue', 'overlay-pink', 'overlay-green')
  if (color) {
    document.body.classList.add(`overlay-${color}`)
  }
}
</script>
