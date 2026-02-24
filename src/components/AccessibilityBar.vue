<template>
  <div class="bg-slate-900/95 backdrop-blur-lg border-b-2 border-white/10 shadow-xl">
    <div class="container mx-auto px-4 md:px-6 py-3 md:py-4">
      <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-4">
        <span class="text-blue-200 text-xs md:text-sm font-semibold hidden sm:inline">
          <i class='bx bx-universal-access mr-2'></i>
          Accessibility:
        </span>

        <!-- Dyslexic Font Toggle -->
        <button
          @click="toggleDyslexicFont"
          :class="isDyslexicFont ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'"
          class="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-200"
        >
          <i class='bx bx-font text-base md:text-lg'></i>
          <span class="hidden sm:inline">Dyslexic Font</span>
          <span class="sm:hidden">Font</span>
        </button>

        <!-- Color Overlays -->
        <div class="flex items-center gap-1 md:gap-2">
          <span class="text-blue-300 text-xs hidden md:inline">Color:</span>
          <button
            @click="selectOverlay(null)"
            :class="currentOverlay === null ? 'ring-2 ring-white' : ''"
            class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-white/30 hover:scale-110 transition-transform flex items-center justify-center"
            title="No overlay"
          >
            <i class='bx bx-x text-white text-xs'></i>
          </button>
          <button
            @click="selectOverlay('yellow')"
            :class="currentOverlay === 'yellow' ? 'ring-2 ring-white' : ''"
            class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-yellow-100 border-2 border-yellow-300 hover:scale-110 transition-transform"
            title="Yellow overlay"
          ></button>
          <button
            @click="selectOverlay('blue')"
            :class="currentOverlay === 'blue' ? 'ring-2 ring-white' : ''"
            class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 border-2 border-blue-300 hover:scale-110 transition-transform"
            title="Blue overlay"
          ></button>
          <button
            @click="selectOverlay('pink')"
            :class="currentOverlay === 'pink' ? 'ring-2 ring-white' : ''"
            class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-pink-100 border-2 border-pink-300 hover:scale-110 transition-transform"
            title="Pink overlay"
          ></button>
          <button
            @click="selectOverlay('green')"
            :class="currentOverlay === 'green' ? 'ring-2 ring-white' : ''"
            class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-100 border-2 border-green-300 hover:scale-110 transition-transform"
            title="Green overlay"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toggle-dyslexic-font', 'change-overlay'])

const isDyslexicFont = ref(false)
const currentOverlay = ref(null)

const toggleDyslexicFont = () => {
  isDyslexicFont.value = !isDyslexicFont.value
  emit('toggle-dyslexic-font')
}

const selectOverlay = (color) => {
  currentOverlay.value = color
  emit('change-overlay', color)
}
</script>
