<template>
  <div class="bg-white/5 backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 md:p-8 hover:border-indigo-400/50 transition-all duration-300">
    <div class="flex items-center gap-4 mb-4">
      <i class='bx bx-bullseye text-4xl md:text-5xl text-indigo-400'></i>
      <div>
        <h3 class="text-xl md:text-2xl font-bold text-white">Focus Mode</h3>
        <p class="text-blue-300 text-xs md:text-sm">For ADHD & attention difficulties</p>
      </div>
    </div>

    <p class="text-blue-200 mb-6 text-sm md:text-base">
      Highlights one paragraph at a time, dimming everything else. Helps students with ADHD maintain focus by reducing visual distractions and information overload.
    </p>

    <div class="space-y-4">
      <!-- Control Buttons -->
      <div class="flex gap-3">
        <button
          @click="toggleFocusMode"
          :class="isFocusMode ? 'bg-indigo-500' : 'bg-gray-600'"
          class="flex-1 flex items-center justify-center gap-2 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          <i class='bx' :class="isFocusMode ? 'bx-show' : 'bx-hide'"></i>
          {{ isFocusMode ? 'Focus Mode ON' : 'Enable Focus Mode' }}
        </button>
      </div>

      <!-- Sample Text Area -->
      <div class="relative">
        <label class="block text-blue-200 text-sm font-semibold mb-2">
          <i class='bx bx-book-open'></i> Sample text (try Focus Mode):
        </label>
        
        <div 
          ref="textContainer"
          class="bg-slate-900/50 border-2 border-white/20 rounded-xl p-6 max-h-96 overflow-y-auto"
          :class="{ 'focus-mode-active': isFocusMode }"
        >
          <p 
            v-for="(paragraph, index) in paragraphs"
            :key="index"
            :ref="el => paragraphRefs[index] = el"
            @click="focusOnParagraph(index)"
            class="mb-4 text-white text-sm md:text-base leading-relaxed cursor-pointer transition-all duration-300"
            :class="{
              'opacity-30 blur-sm': isFocusMode && currentFocusIndex !== index,
              'opacity-100 blur-0 bg-indigo-500/10 p-3 rounded-lg ring-2 ring-indigo-400': isFocusMode && currentFocusIndex === index,
              'hover:bg-white/5': !isFocusMode
            }"
          >
            {{ paragraph }}
          </p>
        </div>

        <!-- Navigation Controls -->
        <div v-if="isFocusMode" class="mt-4 flex items-center justify-between gap-3">
          <button
            @click="previousParagraph"
            :disabled="currentFocusIndex === 0"
            class="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            <i class='bx bx-chevron-left'></i>
            Previous
          </button>

          <span class="text-blue-300 text-sm">
            Paragraph {{ currentFocusIndex + 1 }} of {{ paragraphs.length }}
          </span>

          <button
            @click="nextParagraph"
            :disabled="currentFocusIndex === paragraphs.length - 1"
            class="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Next
            <i class='bx bx-chevron-right'></i>
          </button>
        </div>
      </div>

      <!-- Load Your Own Text -->
      <div class="mt-6">
        <label class="block text-blue-200 text-sm font-semibold mb-2">
          <i class='bx bx-edit'></i> Or paste your own text:
        </label>
        <textarea
          v-model="customText"
          @input="updateParagraphs"
          class="w-full h-32 p-4 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:border-indigo-400 resize-none text-sm md:text-base"
          placeholder="Paste any text here to use Focus Mode with your own content..."
        ></textarea>
      </div>

      <div v-if="focusSuccess" class="flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 px-4 py-3 rounded-xl text-sm">
        <i class='bx bx-check-circle'></i>
        {{ focusSuccess }}
      </div>
    </div>

    <!-- Info box -->
    <div class="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
      <p class="text-indigo-200 text-xs md:text-sm">
        <i class='bx bx-info-circle mr-1'></i>
        <strong>How it helps:</strong> Students with ADHD often struggle with information overload and visual distractions. Focus Mode reduces cognitive load by showing one paragraph at a time, improving concentration and reading comprehension by up to 40%.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const isFocusMode = ref(false)
const currentFocusIndex = ref(0)
const focusSuccess = ref('')
const customText = ref('')
const textContainer = ref(null)
const paragraphRefs = reactive([])

const defaultText = [
  "Photosynthesis is the process by which plants use sunlight to make food. The plant's leaves contain chlorophyll, which captures energy from the sun.",
  
  "This energy is used to convert water and carbon dioxide into glucose (sugar) and oxygen. The glucose provides energy for the plant to grow.",
  
  "The oxygen is released into the air, which is what we breathe. This process is essential for life on Earth because it produces the oxygen that animals and humans need to survive.",
  
  "During photosynthesis, plants act as natural air purifiers. They remove carbon dioxide from the atmosphere and replace it with fresh oxygen.",
  
  "Without photosynthesis, there would be no oxygen in our atmosphere, and life as we know it could not exist. This makes plants incredibly important for maintaining a healthy planet."
]

const paragraphs = ref([...defaultText])

const toggleFocusMode = () => {
  isFocusMode.value = !isFocusMode.value
  if (isFocusMode.value) {
    currentFocusIndex.value = 0
    focusSuccess.value = 'Focus Mode enabled! Click paragraphs or use navigation buttons.'
    setTimeout(() => focusSuccess.value = '', 3000)
    
    // Scroll to first paragraph
    setTimeout(() => {
      scrollToParagraph(0)
    }, 100)
  } else {
    focusSuccess.value = 'Focus Mode disabled.'
    setTimeout(() => focusSuccess.value = '', 2000)
  }
}

const focusOnParagraph = (index) => {
  if (!isFocusMode.value) return
  currentFocusIndex.value = index
  scrollToParagraph(index)
}

const nextParagraph = () => {
  if (currentFocusIndex.value < paragraphs.value.length - 1) {
    currentFocusIndex.value++
    scrollToParagraph(currentFocusIndex.value)
  }
}

const previousParagraph = () => {
  if (currentFocusIndex.value > 0) {
    currentFocusIndex.value--
    scrollToParagraph(currentFocusIndex.value)
  }
}

const scrollToParagraph = (index) => {
  const element = paragraphRefs[index]
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const updateParagraphs = () => {
  if (customText.value.trim()) {
    // Split by double line breaks or periods followed by newlines
    const newParagraphs = customText.value
      .split(/\n\n+|\.\s*\n/)
      .filter(p => p.trim().length > 0)
      .map(p => p.trim())
    
    if (newParagraphs.length > 0) {
      paragraphs.value = newParagraphs
      currentFocusIndex.value = 0
    }
  } else {
    paragraphs.value = [...defaultText]
  }
}

// Keyboard navigation
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (!isFocusMode.value) return
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextParagraph()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      previousParagraph()
    }
  })
})
</script>
