<template>
	<div
		class="bg-white/5 backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 md:p-8 hover:border-green-400/50 transition-all duration-300"
	>
		<div class="flex items-center gap-4 mb-4">
			<i class="bx bx-book-reader text-4xl md:text-5xl text-green-400"></i>
			<div>
				<h3 class="text-xl md:text-2xl font-bold text-white">Text Simplifier</h3>
				<p class="text-blue-300 text-xs md:text-sm">For cognitive disabilities & dyslexia</p>
			</div>
		</div>

		<p class="text-blue-200 mb-6 text-sm md:text-base">
			Rewrites complex academic text into simple, easy-to-understand language. Helps students with
			cognitive disabilities, dyslexia, or those learning in a second language.
		</p>

		<div class="grid md:grid-cols-2 gap-6">
			<!-- Input Side -->
			<div>
				<label class="block text-blue-200 text-sm font-semibold mb-2">
					<i class="bx bx-text"></i> Complex text:
				</label>
				<textarea
					v-model="complexText"
					class="w-full h-48 p-4 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:border-green-400 resize-none text-sm md:text-base"
					placeholder="Paste complex text here..."
				></textarea>

				<div class="mt-4 space-y-3">
					<button
						@click="simplifyText"
						:disabled="!complexText || isLoading"
						class="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
					>
						<i class="bx" :class="isLoading ? 'bx-loader-circle bx-spin' : 'bx-edit'"></i>
						{{ isLoading ? 'Simplifying...' : 'Simplify Text' }}
					</button>

					<div class="flex gap-2">
						<button
							v-for="example in examples"
							:key="example.label"
							@click="complexText = example.text"
							class="flex-1 bg-white/5 hover:bg-white/10 text-blue-300 text-xs px-3 py-2 rounded-lg transition-all"
						>
							{{ example.label }}
						</button>
					</div>
				</div>
			</div>

			<!-- Output Side -->
			<div>
				<label class="block text-blue-200 text-sm font-semibold mb-2">
					<i class="bx bx-check-circle"></i> Simplified version:
				</label>
				<div
					class="relative bg-slate-900/50 border-2 border-white/20 rounded-xl p-4 overflow-y-auto"
					style="height: 280px"
				>
					<div
						v-if="!simplifiedText && !isLoading"
						class="absolute inset-0 flex flex-col items-center justify-center text-blue-400/50"
					>
						<i class="bx bx-book-open text-6xl mb-2"></i>
						<p class="text-sm text-center px-4">Simplified text will appear here</p>
					</div>

					<div
						v-if="isLoading"
						class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80"
					>
						<i class="bx bx-loader-circle bx-spin text-6xl text-green-400 mb-4"></i>
						<p class="text-green-300">Making it easier to read...</p>
					</div>

					<div v-if="simplifiedText" class="text-white text-sm md:text-base leading-relaxed">
						{{ simplifiedText }}
					</div>
				</div>

				<div v-if="simplifiedText" class="mt-3 flex gap-2">
					<button
						@click="copyToClipboard"
						class="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium py-2 px-4 rounded-lg transition-all text-sm"
					>
						<i class="bx bx-copy"></i>
						{{ copied ? 'Copied!' : 'Copy' }}
					</button>
					<button
						@click="speakSimplified"
						class="flex-1 flex items-center justify-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-medium py-2 px-4 rounded-lg transition-all text-sm"
					>
						<i class="bx bx-volume-full"></i>
						Read Aloud
					</button>
				</div>
			</div>
		</div>

		<div
			v-if="error"
			class="mt-4 flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm"
		>
			<i class="bx bx-error-circle"></i>
			{{ error }}
		</div>

		<div
			v-if="success"
			class="mt-4 flex items-center gap-2 bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl text-sm"
		>
			<i class="bx bx-check-circle"></i>
			{{ success }}
		</div>

		<!-- Info box -->
		<div class="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
			<p class="text-green-200 text-xs md:text-sm">
				<i class="bx bx-info-circle mr-1"></i>
				<strong>How it helps:</strong> Complex academic language is a major barrier for students
				with dyslexia and cognitive disabilities. Simplified text uses shorter sentences, common
				words, and clear structure - making learning accessible to everyone.
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const complexText = ref('');
const simplifiedText = ref('');
const isLoading = ref(false);
const error = ref('');
const success = ref('');
const copied = ref(false);

const examples = [
	{
		label: 'Science',
		text: "The mitochondria, often referred to as the powerhouse of the cell, are organelles that generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
	},
	{
		label: 'History',
		text: 'The Industrial Revolution marked a major turning point in history, characterized by the transition from agrarian and handicraft economies to ones dominated by industry and machine manufacturing.',
	},
	{
		label: 'Math',
		text: 'The Pythagorean theorem establishes a fundamental relationship in Euclidean geometry among the three sides of a right triangle, stating that the square of the hypotenuse is equal to the sum of the squares of the other two sides.',
	},
];

const simplifyText = async () => {
	if (!complexText.value) return;

	isLoading.value = true;
	error.value = '';
	success.value = '';
	simplifiedText.value = '';

	// Simulate processing time for better UX
	await new Promise((resolve) => setTimeout(resolve, 800));

	try {
		simplifiedText.value = simplifyBasic(complexText.value);
		success.value = 'Text simplified successfully! Much easier to read now.';
		setTimeout(() => (success.value = ''), 3000);
	} catch (err) {
		error.value = 'Failed to simplify text. Please try again.';
	} finally {
		isLoading.value = false;
	}
};

const simplifyBasic = (text) => {
	let simplified = text;

	// More comprehensive word replacements
	const replacements = {
		// Academic/formal words
		utilize: 'use',
		utilizes: 'uses',
		utilized: 'used',
		utilizing: 'using',
		endeavor: 'try',
		facilitate: 'help',
		facilitates: 'helps',
		facilitated: 'helped',
		acquire: 'get',
		acquires: 'gets',
		acquired: 'got',
		demonstrate: 'show',
		demonstrates: 'shows',
		demonstrated: 'showed',
		approximately: 'about',
		substantial: 'large',
		consequently: 'so',
		furthermore: 'also',
		moreover: 'also',
		nevertheless: 'but',
		however: 'but',
		therefore: 'so',
		thus: 'so',
		hence: 'so',
		additionally: 'also',
		previously: 'before',
		subsequently: 'after',
		initiate: 'start',
		commence: 'begin',
		conclude: 'end',
		terminate: 'end',
		obtain: 'get',
		procure: 'get',
		purchase: 'buy',
		construct: 'build',
		comprehend: 'understand',
		insufficient: 'not enough',
		adequate: 'enough',
		numerous: 'many',
		frequently: 'often',
		occasionally: 'sometimes',
		immediately: 'right away',
		currently: 'now',
		presently: 'now',
		ultimately: 'in the end',

		// Phrases
		'previously mentioned': 'said before',
		aforementioned: 'mentioned before',
		'in order to': 'to',
		'due to the fact that': 'because',
		'at this point in time': 'now',
		'in the event that': 'if',
		'with regard to': 'about',
		'in close proximity to': 'near',
		'at the present time': 'now',
		'for the purpose of': 'to',
		'in the near future': 'soon',
		'at a later date': 'later',
		'prior to': 'before',
		'subsequent to': 'after',
		'in spite of': 'despite',

		// Scientific terms
		'adenosine triphosphate': 'ATP (cell energy)',
		organelles: 'tiny cell parts',
		mitochondria: 'power makers of the cell',
		photosynthesis: 'how plants make food using sunlight',
		chlorophyll: 'green matter in plants',
		agrarian: 'farming-based',
		'Euclidean geometry': 'basic geometry',
		hypotenuse: 'longest side of a right triangle',

		// Connecting words
		'characterized by': 'has',
		'marked by': 'has',
		fundamental: 'basic',
		essential: 'important',
		establishes: 'shows',
		indicates: 'shows',
		'referred to as': 'called',
		'known as': 'called',
		'consists of': 'has',
		comprises: 'includes',
		contains: 'has',
		'pertaining to': 'about',
		regarding: 'about',
		concerning: 'about',
		'in terms of': 'for',

		// Industrial Revolution specific
		transition: 'change',
		dominated: 'controlled',
		manufacturing: 'making things',
		handicraft: 'handmade',
		'turning point': 'big change',

		// Math specific
		relationship: 'connection',
		'equal to': 'equals',
		sum: 'total',
		square: 'times itself',
	};

	// Apply all replacements
	Object.entries(replacements).forEach(([complex, simple]) => {
		// Use word boundaries to avoid partial matches
		const regex = new RegExp(`\\b${complex}\\b`, 'gi');
		simplified = simplified.replace(regex, simple);
	});

	// Break up very long sentences
	let sentences = simplified.split(/([.!?])\s+/);
	let result = [];

	for (let i = 0; i < sentences.length; i += 2) {
		let sentence = sentences[i];
		let punctuation = sentences[i + 1] || '.';

		if (sentence && sentence.trim()) {
			const words = sentence.split(' ');

			// If sentence is very long (>25 words), try to break it at a comma
			if (words.length > 25 && sentence.includes(',')) {
				// Replace first comma or semicolon with a period
				sentence = sentence.replace(/[,;]/, '.');
			}

			result.push(sentence.trim() + punctuation);
		}
	}

	simplified = result.join(' ');

	// Add spacing for readability
	simplified = simplified.replace(/\.\s+/g, '.\n\n');
	simplified = simplified.replace(/\n\n\n+/g, '\n\n');

	// Clean up any double spaces
	simplified = simplified.replace(/\s+/g, ' ');

	return simplified.trim();
};

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(simplifiedText.value);
		copied.value = true;
		setTimeout(() => (copied.value = false), 2000);
	} catch (err) {
		error.value = 'Could not copy to clipboard';
	}
};

const speakSimplified = () => {
	if (!simplifiedText.value) return;

	speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(simplifiedText.value);
	utterance.rate = 0.85; // Slower for easier comprehension
	utterance.pitch = 1;
	speechSynthesis.speak(utterance);
};
</script>
