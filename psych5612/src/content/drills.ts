export type Distinction = { pair: string; contrast: string; chapter: number }

export const distinctions: Distinction[] = [
  { pair: "Methodological / ontological naturalism", contrast: "Method of inquiry / what exists", chapter: 3 },
  { pair: "Naturalism / scientism", contrast: "Natural reality / stronger scientific-exclusivity claim", chapter: 3 },
  { pair: "Physicalism / epiphenomenalism", contrast: "Physical constitution/dependence / mental effects without causal return", chapter: 2 },
  { pair: "Single / double dissociation", contrast: "One selective impairment / crossed selective impairments", chapter: 3 },
  { pair: "Biological / cultural inheritance", contrast: "Genetic transmission / learning and communication", chapter: 5 },
  { pair: "Co-attention / joint attention", contrast: "Same object / coordinated sharing with another", chapter: 5 },
  { pair: "Vehicle / content", contrast: "Representing item / what it represents", chapter: 6 },
  { pair: "Syntax / semantics", contrast: "Formal relations / meaning", chapter: 13 },
  { pair: "Combinatorial / sequential", contrast: "Current inputs / current inputs plus state", chapter: 8 },
  { pair: "Latch / rising-edge register", contrast: "Level-sensitive transparency / edge capture and retention", chapter: 9 },
  { pair: "TM / UTM", contrast: "A specified machine / a machine able to simulate specified machines", chapter: 10 },
  { pair: "Weak / strong AI", contrast: "Useful model/tool / literal mentality from the right program", chapter: 13 },
]

export type PracticeTask = { task: string; check: string; chapter: number }

export const practiceTasks: PracticeTask[] = [
  { task: "Your lab partner believes in a supernatural realm but tests only natural hypotheses in the lab. Which naturalism describes the method, and which worldview need not follow?", check: "Methodological naturalism; ontological naturalism need not follow.", chapter: 3 },
  { task: "Two patients have opposite patterns on naming and recognizing objects. Draw the evidence pattern and give one warranted inference and one unwarranted inference.", check: "One impaired naming/spared recognition, the other the reverse; partial separability, not complete independence or a guaranteed one-region map.", chapter: 3 },
  { task: "Explain why a culturally isolated inventive individual would not possess a whole civilization's technology.", check: "Cumulative culture pools and preserves innovations beyond an individual's discoveries.", chapter: 5 },
  { task: "A signal is 0.76 V with VIH = 0.70 V and guaranteed HIGH output VOH = 0.90 V. Explain how a buffer can help without changing the bit.", check: "The input is valid HIGH, and regeneration restores a stronger HIGH and margin.", chapter: 7 },
  { task: "Fill all four rows of Y = (NOT A AND B) OR (A AND B). Simplify the function.", check: "Y = B; rows 0,1,0,1.", chapter: 8 },
  { task: "In the L08 traffic-light machine, start S0 with TA = 0; at the next two steps TB = 1. Trace states and outputs. Identify when an input is irrelevant.", check: "First update S0 → S1 (A yellow/B red), second S1 → S2 (A red/B green), third stays S2 while TB = 1; sensors do not affect S1's next state.", chapter: 9 },
  { task: "A data input changes while the clock stays HIGH, well after the rising edge. Does the lecture's register immediately copy it? Explain.", check: "No; it holds until the next designated edge, subject to timing requirements.", chapter: 9 },
  { task: "Two TMs agree whenever both halt, but one halts on an additional input. Are they equivalent?", check: "No; halting domains differ.", chapter: 10 },
  { task: "A UTM simulates a program for a million steps without halting. Does that establish the program never halts?", check: "No; it could halt later or never halt.", chapter: 11 },
  { task: "State the inference the systems reply challenges, then contrast it with the robot reply.", check: "A component's lack of understanding does not settle the whole system's; the robot reply proposes a larger embodied system with world connections.", chapter: 13 },
]

export type Mistake = { mistake: string; correction: string; chapter: number | null }

export const mistakes: Mistake[] = [
  { mistake: "Saying dualism forbids interaction by definition.", correction: "Interactionist dualism proposes it and owes an explanation. Descartes' interactionist dualism accepts interaction; the challenge is explaining it consistently with the proposed natures of the substances.", chapter: 2 },
  { mistake: "Equating naturalism with scientism, or methodology with an investigator's religion.", correction: "Methodological naturalism is about how inquiry proceeds, and a religious researcher can follow it. Scientism adds an expansive claim about the reach and authority of scientific expression.", chapter: 3 },
  { mistake: "Defining physicalism only as a denial that mental causation happens.", correction: "Physicalism is the family of views according to which the mental is ultimately physically constituted or determined. Physicalists can regard mental causes as physically realized causes.", chapter: 3 },
  { mistake: "Treating a double dissociation as complete modular independence.", correction: "It supports at least partial functional separability. It does not show complete independence, exclude interacting networks, or establish a perfect one-function/one-region map.", chapter: 3 },
  { mistake: "Giving Ayala the other reading's definition of culture.", correction: "Ayala: culture is the set of nonstrictly biological human activities and creations. “Learned and shared ways of living and thinking” is Miller & Wood.", chapter: 5 },
  { mistake: "Claiming a chimp's interest in a book is automatically joint attention, or that chimps cannot cooperate at all.", correction: "Interest in the object is present; the triadic “me-you-object” relation is the disputed difference. Chimpanzees can coordinate pulling a rope and recruit a partner.", chapter: 5 },
  { mistake: "Calling a HIGH voltage exactly one fixed number or treating the forbidden interval as logical 0.", correction: "A digital system uses intervals of voltage to stand for discrete values. Inputs between VIL and VIH are in the undefined/forbidden region and have no guaranteed Boolean interpretation.", chapter: 7 },
  { mistake: "Saying a buffer changes nothing physically because Y = A.", correction: "Physically it can regenerate a valid but degraded input into a stronger valid output level, restoring the voltage margin for the next stage.", chapter: 7 },
  { mistake: "Confusing tcd, the earliest possible output change, with tpd, the latest settling guarantee.", correction: "tcd is the minimum time after an input change before an output may leave its old logical region. tpd is the maximum time needed for outputs to reach their final logical regions.", chapter: 7 },
  { mistake: "Saying a register follows its input throughout HIGH, or that a common clock alone ensures correctness.", correction: "On the rising clock edge the register captures its data input; between rising edges it retains that state, provided setup/hold timing is met. Following the input during a whole phase describes a transparent latch.", chapter: 9 },
  { mistake: "Leaving out a register on every cycle or the setup/hold aperture.", correction: "Every cyclic path contains at least one register, and register inputs must remain stable throughout the setup/hold aperture around the active clock edge.", chapter: 9 },
  { mistake: "Saying any feedback loop is a well-behaved synchronous machine.", correction: "Feedback circuits can also be astable, as with a ring oscillator, or enter an indeterminate/metastable condition. Not every loop is useful, well-behaved memory.", chapter: 9 },
  { mistake: "Describing TM equivalence without the halting-domain condition.", correction: "M1 and M2 must halt on exactly the same input words and, for every input on which they halt, produce the same output word.", chapter: 10 },
  { mistake: "Confusing universal simulation with solving every mathematical problem.", correction: "A universal machine can simulate a nonhalting computation forever without telling you, in finite time, that it will never halt. There is no total algorithm that solves every instance of HALT-CHECK.", chapter: 11 },
  { mistake: "Treating equal computability as equal speed.", correction: "Equality of computable-function classes is not equality of time, hardware, or resource limits.", chapter: 10 },
  { mistake: "Using “strong AI” to mean only broad task coverage instead of Searle's mental-state claim.", correction: "Strong AI claims that the appropriately programmed computer literally has understanding or mental states. This is not today's distinction between narrow task-specific AI and AGI.", chapter: 13 },
  { mistake: "Listing names of Chinese Room replies without their arguments.", correction: "Explain the logic of each: the Churchlands reject the intuition, the systems reply offers a system-level account, and the robot reply augments the room with perception and action.", chapter: 13 },
  { mistake: "Memorizing only Q1-23 and skipping the readings without dedicated bank questions.", correction: "Required reading and video material is examinable even if not discussed in class. A bank-only cram can miss required multiple-choice material.", chapter: null },
]

export const uncoveredTopics: { topic: string; chapter: number | null }[] = [
  { topic: "First/third person", chapter: 2 },
  { topic: "Manifest/scientific images", chapter: 2 },
  { topic: "Physicalism and causal closure", chapter: 3 },
  { topic: "Tolman, Lashley, Chomsky, SHRDLU", chapter: 6 },
  { topic: "Digital discipline, buffer/noise margins", chapter: 7 },
  { topic: "Gates and arithmetic", chapter: 8 },
  { topic: "Turing's nine objections/learning machines", chapter: 12 },
  { topic: "Bray", chapter: 14 },
  { topic: "The required people", chapter: null },
]

export const sampleMultipleChoice = {
  source: "Sample multiple-choice question from the Midterm #1 announcement",
  stem: "Which of the following is NOT standardly listed among the constituent disciplines of cognitive science?",
  options: ["Biology", "Psychology", "Neuroscience", "Linguistics"],
  answer: 0,
  explanation: "The conventional six are psychology, neuroscience, linguistics, philosophy, anthropology, and artificial intelligence/computer science. Biology and chemistry can contribute, but they are not substitutes in the conventional six-field list.",
  chapter: 4,
}
