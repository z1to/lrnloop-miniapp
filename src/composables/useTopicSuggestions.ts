// src/composables/useTopicSuggestions.ts

export const TOPIC_LIST: string[] = [
  // Science & Nature
  'Quantum physics',
  'Black holes and cosmology',
  'Evolution and natural selection',
  'Climate science',
  'Neuroscience basics',
  'Human anatomy',
  'Genetics and DNA',
  'Particle physics',
  'Astronomy and the solar system',
  'Oceanography',
  'Ecology and ecosystems',
  'Thermodynamics',
  'Electromagnetism',
  'Cell biology',
  'Microbiology',
  'Immunology',
  'Plate tectonics',
  'Chaos theory',
  'String theory',
  'The theory of relativity',

  // Technology & Computing
  'Python programming',
  'Machine learning fundamentals',
  'Deep learning and neural networks',
  'Data structures and algorithms',
  'System design',
  'Distributed systems',
  'Cryptography',
  'Blockchain and Web3',
  'Linux and the command line',
  'Computer networking',
  'Operating systems',
  'Cloud computing',
  'DevOps and CI/CD',
  'Cybersecurity basics',
  'Database design',
  'Functional programming',
  'Rust programming language',
  'TypeScript',
  'React and frontend development',
  'API design',
  'Compiler design',
  'Computer vision',
  'Natural language processing',
  'Reinforcement learning',
  'Kubernetes and containers',

  // Mathematics
  'Calculus',
  'Linear algebra',
  'Statistics and probability',
  'Number theory',
  'Graph theory',
  'Game theory',
  'Topology',
  'Abstract algebra',
  'Information theory',
  'Bayesian reasoning',
  'Combinatorics',
  'Differential equations',

  // History
  'Ancient Rome',
  'Ancient Greece',
  'The Roman Empire',
  'World War II',
  'World War I',
  'The Cold War',
  'The Renaissance',
  'The French Revolution',
  'The Ottoman Empire',
  'Ancient Egypt',
  'The Mongol Empire',
  'The British Empire',
  'The American Civil War',
  'The Industrial Revolution',
  'The Byzantine Empire',
  'Medieval Europe',
  'The Age of Exploration',
  'The Viking Age',
  'Japanese history',
  'Chinese history',

  // Philosophy
  'Stoicism',
  'Existentialism',
  'Ethics and moral philosophy',
  'Epistemology',
  'Philosophy of mind',
  'Political philosophy',
  'Logic and critical thinking',
  'Ancient Greek philosophy',
  'Eastern philosophy',
  'Philosophy of science',
  'Metaphysics',
  'Nietzsche and nihilism',
  'Kant and the categorical imperative',

  // Psychology & Behaviour
  'Cognitive psychology',
  'Behavioral economics',
  'Sleep science',
  'Habit formation',
  'Memory and learning',
  'Emotional intelligence',
  'Cognitive biases',
  'Motivation and self-determination',
  'Social psychology',
  'Positive psychology',
  'Trauma and resilience',
  'Decision making',

  // Health & Biology
  'Nutrition science',
  'Exercise physiology',
  'Gut microbiome',
  'Hormones and the endocrine system',
  'Longevity and aging',
  'Mental health',
  'Pharmacology basics',
  'Epidemiology',

  // Economics & Finance
  'Macroeconomics',
  'Microeconomics',
  'Personal finance',
  'Investing fundamentals',
  'Monetary policy',
  'Behavioral finance',
  'Cryptocurrency',
  'Supply chain economics',
  'Game theory in economics',
  'The history of money',

  // Arts & Culture
  'Music theory',
  'The history of jazz',
  'Classical music',
  'Film history',
  'Architecture history',
  'Art history',
  'The history of photography',
  'Literary theory',
  'Shakespeare',
  'Mythology',
  'Greek mythology',
  'Norse mythology',

  // Society & Politics
  'Political science',
  'International relations',
  'Democracy and governance',
  'Sociology',
  'Anthropology',
  'Linguistics',
  'Media literacy',
  'Urban planning',
  'Environmental policy',

  // Self-improvement & Productivity
  'Speed reading',
  'Memory techniques',
  'Productivity systems',
  'Public speaking',
  'Negotiation skills',
  'Writing clearly',
  'Mental models',
]

export function searchTopics(query: string): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const exact: string[] = []
  const startsWith: string[] = []
  const contains: string[] = []

  for (const topic of TOPIC_LIST) {
    const t = topic.toLowerCase()
    if (t === q) exact.push(topic)
    else if (t.startsWith(q)) startsWith.push(topic)
    else if (t.includes(q)) contains.push(topic)
  }

  return [...exact, ...startsWith, ...contains].slice(0, 3)
}
