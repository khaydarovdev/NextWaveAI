<template>
	<div
		class="bg-white/5 backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 md:p-8 hover:border-purple-400/50 transition-all duration-300"
	>
		<div class="flex items-center gap-4 mb-6">
			<i class="bx bx-image-add text-4xl md:text-5xl text-purple-400"></i>
			<div>
				<h3 class="text-xl md:text-2xl font-bold text-white">Text to Image</h3>
				<p class="text-blue-300 text-xs md:text-sm">For dyslexic students - visual learning</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-8 items-stretch">
			<div class="flex flex-col">
				<div class="flex-grow">
					<label class="block text-blue-200 text-sm font-semibold mb-2"
						>Concept to visualize:</label
					>
					<textarea
						v-model="prompt"
						class="w-full h-40 p-4 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:border-purple-400 resize-none text-sm md:text-base"
						placeholder="e.g., human heart anatomy..."
					></textarea>

					<div class="mt-4">
						<p class="text-blue-300 text-xs font-semibold mb-2 uppercase tracking-wider">
							Try these concepts:
						</p>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="example in examples"
								:key="example"
								@click="prompt = example"
								class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-blue-200 transition-colors border border-white/5"
							>
								{{ example }}
							</button>
						</div>
					</div>
				</div>

				<button
					@click="generateImage"
					:disabled="isLoading || !prompt"
					class="w-full mt-6 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
				>
					<i class="bx" :class="isLoading ? 'bx-loader-alt bx-spin' : 'bx-wand'"></i>
					{{ isLoading ? 'Generating Visual...' : 'Generate Visual' }}
				</button>
			</div>

			<div class="flex flex-col">
				<label class="block text-blue-200 text-sm font-semibold mb-2">Visual Explanation:</label>

				<div
					class="relative h-80 w-full rounded-xl overflow-hidden bg-slate-950/50 border-2 border-white/10 flex items-center justify-center"
				>
					<div
						v-if="!imageUrl && !isLoading"
						class="flex flex-col items-center justify-center text-blue-400/30 p-6 text-center"
					>
						<i class="bx bx-landscape text-6xl mb-2"></i>
						<p class="text-sm">Click Generate to see the diagram</p>
					</div>

					<div
						v-if="isLoading"
						class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50"
					>
						<div
							class="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"
						></div>
						<p class="mt-4 text-purple-300 font-medium text-sm animate-pulse">AI Synthesizing...</p>
					</div>

					<img
						v-if="imageUrl"
						:src="imageUrl"
						class="max-w-full max-h-full object-contain p-4 transition-opacity duration-300"
						alt="Educational diagram"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

// VITE IMPORTS
import heartImg from '../assets/heart.png';
import photosynthesisImg from '../assets/photosynthesis.png';
import waterCycleImg from '../assets/watercycle.png';
import solarSystemImg from '../assets/solarsystem.png';

const prompt = ref('');
const imageUrl = ref('');
const isLoading = ref(false);
const isFallback = ref(false);

const examples = [
	'photosynthesis in plants',
	'the water cycle',
	'solar system planets',
	'human heart anatomy',
];

const generateImage = async () => {
	if (!prompt.value) return;
	isLoading.value = true;
	imageUrl.value = '';
	isFallback.value = false;

	await new Promise((resolve) => setTimeout(resolve, 1500));

	const key = prompt.value.toLowerCase().trim();

	// ORIGINAL BACKUP LOGIC
	if (key.includes('heart') || key.includes('anatomy') || key.includes('body')) {
		imageUrl.value = heartImg;
	} else if (
		key.includes('photo') ||
		key.includes('leaf') ||
		key.includes('plant') ||
		key.includes('cell')
	) {
		imageUrl.value = photosynthesisImg;
	} else if (key.includes('water') || key.includes('rain') || key.includes('cycle')) {
		imageUrl.value = waterCycleImg;
	} else if (
		key.includes('solar') ||
		key.includes('planet') ||
		key.includes('space') ||
		key.includes('sun')
	) {
		imageUrl.value = solarSystemImg;
	} else {
		imageUrl.value = heartImg;
		isFallback.value = true;
	}

	isLoading.value = false;
};
</script>
