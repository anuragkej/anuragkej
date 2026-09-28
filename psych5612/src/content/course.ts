export type PartId = "mind" | "machines" | "ai"

export type QuestionId = number

export type ChapterMeta = {
  slug: string
  number: number
  title: string
  shortTitle: string
  part: PartId
  lectures: string
  questions: QuestionId[]
}

export const parts: { id: PartId; title: string; lectures: string }[] = [
  { id: "mind", title: "Mind, brain, and culture", lectures: "L02-L05" },
  { id: "machines", title: "From behaviorism to machines", lectures: "L06-L09" },
  { id: "ai", title: "Intelligence and AI", lectures: "L10-L11" },
]

export const chapters: ChapterMeta[] = [
  { slug: "minds-and-dualism", number: 2, title: "Minds, perspectives, and Cartesian dualism", shortTitle: "Minds & Cartesian dualism", part: "mind", lectures: "L02", questions: [1] },
  { slug: "naturalism-and-damaged-brains", number: 3, title: "Naturalism, physicalism, and evidence from damaged brains", shortTitle: "Naturalism & damaged brains", part: "mind", lectures: "L03-L04", questions: [2, 3, 5, 6] },
  { slug: "cognitive-science", number: 4, title: "What cognitive science is", shortTitle: "What cognitive science is", part: "mind", lectures: "L04", questions: [4] },
  { slug: "culture-and-shared-intentionality", number: 5, title: "Human distinctiveness, culture, and shared intentionality", shortTitle: "Culture & shared intentionality", part: "mind", lectures: "L05", questions: [7, 8] },
  { slug: "behaviorism-to-computation", number: 6, title: "From behaviorism to computational explanations", shortTitle: "Behaviorism to computation", part: "machines", lectures: "L06", questions: [] },
  { slug: "digital-abstraction", number: 7, title: "Digital abstraction: how physical voltages become dependable symbols", shortTitle: "Digital abstraction", part: "machines", lectures: "L06-L07", questions: [9] },
  { slug: "combinatorial-circuits", number: 8, title: "Combinatorial circuits and Boolean construction", shortTitle: "Combinatorial circuits", part: "machines", lectures: "L07", questions: [10, 19] },
  { slug: "sequential-circuits", number: 9, title: "Sequential circuits, FSMs, registers, and clocks", shortTitle: "Sequential circuits & FSMs", part: "machines", lectures: "L08", questions: [10, 11, 12, 13, 19] },
  { slug: "turing-machines", number: 10, title: "Turing machines, universal computation, and physical implementation", shortTitle: "Turing machines & universality", part: "machines", lectures: "L09", questions: [14, 15, 16, 17, 18, 19] },
  { slug: "church-turing-and-ai", number: 11, title: "Church-Turing, intelligence, and the AI framework", shortTitle: "Church-Turing & AI", part: "ai", lectures: "L10", questions: [20, 23] },
  { slug: "turing-test", number: 12, title: "Turing's 1950 article and the Turing Test", shortTitle: "Turing 1950 & the Turing Test", part: "ai", lectures: "L10", questions: [21] },
  { slug: "chinese-room", number: 13, title: "Chinese Room, strong AI, and symbol grounding", shortTitle: "Chinese Room & grounding", part: "ai", lectures: "L10", questions: [22] },
  { slug: "protein-circuits", number: 14, title: "Biological computation: Bray's protein circuits", shortTitle: "Bray's protein circuits", part: "ai", lectures: "L11", questions: [] },
]

export function chapterBySlug(slug: string) {
  return chapters.find((c) => c.slug === slug)
}

export function chapterByNumber(n: number) {
  return chapters.find((c) => c.number === n)
}

export type QuestionGroup = { title: string; ids: QuestionId[] }

export const questionGroups: QuestionGroup[] = [
  { title: "Lectures 2-4", ids: [1, 2, 3, 4, 5, 6] },
  { title: "Lecture 5, Human Distinctiveness", ids: [7, 8] },
  { title: "Lectures 6-9, Digital Computation", ids: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
  { title: "Lecture 10, Turing Test", ids: [20, 21, 22, 23] },
]

export const questionPrompts: Record<QuestionId, string> = {
  1: "The French philosopher René Descartes formulated an influential form of dualism that bears his name: Cartesian Dualism. At the broadest outline, Cartesian Dualism is committed to two philosophical claims about the nature of minds. What are those claims. To answer this quiz question, please write two sentences. Preface the first sentence with “Claim 1:” and then articulate succinctly the first Cartesian claim. Then move to a new line, write “Claim 2:” and articulate succinctly the second Cartesian claim. For the purposes of this exercise, we can take for granted that there are bodies in addition to minds. This question is about the Cartesian view about the nature of minds.",
  2: "Articulate the philosophical thesis of Methodological Naturalism. That is, write a few sentences, the first of which begins: “Methodological Naturalism is the philosophical thesis that …”",
  3: "Articulate the philosophical thesis of Ontological Naturalism. That is, write a few sentences, the first of which begins: “Ontological Naturalism is the philosophical thesis that …”",
  4: "As a point of departure in our course, we gave a working definition of Cognitive Science according to the philosopher and cognitive-science pioneer Margaret Boden. In chapter 1 of her 2006 book (which is required reading), she defined cognitive science in a single sentence. Please reproduce Boden’s definition here. That is, complete the following sentence: “According to Margaret Boden (2006), cognitive science is …” Boden also described cognitive science as “a catholic field, in three ways.” (As we discussed in class, the term “catholic” in this context means “all encompassing” rather than “associated with the Roman Catholic church.”) To finish this assignment, write down at least two of the three ways that Boden lists in her description.",
  5: "“Naturalism” is widely regarded as a positive term in philosophical circles. By contrast, “scientism” is universally regarded as a negative term. Articulate the meaning of the term “scientism” – that is, write a few sentences, the first of which begins: “Scientism is a philosophical thesis that …” Are there differences between (ontological) naturalism and scientism? (Caveat: There are conflicting opinions on this score.) If there are differences, please specify at least one such difference.",
  6: "The method of double dissociation plays a key role in neuropsychology. This method was defined in one of the questions in CarmenCanvas quiz CQ02 and was illustrated in the comparison of Phineas Gage and Lev Zasetsky in discussion D02. Outline the essential features of a double dissociation. When does a double dissociation occur? What kind of conclusion(s) can be inferred on the basis of a double dissociation?",
  7: "In his essay on Human nature, the evolutionary biologist Francisco Ayala (1998) gave a provisional definition of “culture” and listed a few paradigmatic examples of cultural creations. What is culture according to Ayala (1998)? (As a reminder, this is one of the “required readings” for Lecture 5 on Human Distinctiveness.) Write one sentence that reproduces Ayala’s definition as best you can remember it, and draw a circle around it. Then list a few things that belong mostly to culture (as opposed to nature). You are free to list some of Ayala’s examples and/or come up with your own.",
  8: "The concept of shared intentionality plays a pivotal role in the theory of Michael Tomasello that was discussed briefly in class and explained in more detail in a video lecture by Tomasello himself that is a “required reading” for Lecture 5 on Human Distinctiveness. The human capacity for joint attention is an important component of shared intentionality. Tomasello’s talk included excerpts from two videos that illustrated joint attention in a human toddler and its lack in an adult chimpanzee. Please summarize briefly the key observations in these two cases. Make sure to relate the observations to the theoretical notion of joint attention. (Clarification: This question is about joint attention only. Shared intentionality is mentioned to provide context, but you are not expected to provide a definition of shared intentionality. Just focus on joint attention.)",
  9: "Give the definition of the concept Finite Boolean Function. That is, begin your answer with the following sentence: “A finite Boolean function is a mathematical function with the following properties: …” Then list the properties that set Finite functions apart from mathematical functions generally. Then list the properties that set finite Boolean functions apart from Finite functions generally.",
  10: "The distinction between combinatorial and sequential circuits is of fundamental importance in digital circuit design. Please summarize briefly the defining properties of combinatorial circuits. Next, summarize briefly the defining properties of sequential circuits. Finally, answer these two true-false questions: TF1: Can a combinatorial circuit include a sequential one as a component? TF2: Can a sequential circuit include a combinatorial one as a component?",
  11: "What is a Finite State Machine (FSM)? Outline briefly its components and principles of operation. Please draw a (simple) example of a state transition diagram. It is OK to reproduce (a possibly modified version of) some of the examples from your readings and/or lecture slides. How many states does the FSM on your diagram have?",
  12: "Sequential digital circuits can be synchronous or asynchronous. The former satisfy four conditions that collectively were labeled synchronous discipline in the textbook by Harris & Harris (2012), which was a required reading for an earlier lecture. Please formulate these four conditions. Concretely, write a few sentences organized as a list with four bullet points. Begin the header of the list with: “A circuit is a synchronous sequential circuit if …”",
  13: "Registers play a pivotal role in sequential digital circuits. What is a register? Formulate the defining property of a register. Please use precise technical language. (Hand-wavy metaphors will receive few points here.)",
  14: "What is a Turing Machine (TM)? Outline its components and principles of operation. What is the main difference between a TM and a Finite-State Machine (FSM)? What kind of inputs does an FSM take? How does an Operator supply inputs to an FSM? What kind of outputs does an FSM produce? How does an Operator receive the outputs from an FSM? What kind of inputs does a TM take? How does an Operator supply inputs to a TM? What kind of outputs does a TM produce? How does an Operator receive the outputs from an TM? (In your answer, use the abbreviations FSM and TM liberally. Do not waste time spelling out the long phrase F-i-n-i-t-e S-t-a-t-e M-a-c-h-i-n-e.)",
  15: "What does it mean to say that a Turing Machine (TM) implements a mathematical function? For concreteness, let M denote the machine and F the function in question. Assume that F takes a single argument, x, which is a natural number. (That is, a non-negative integer: 0, 1, 2, 3…) Assume that F produces a natural number y = F(x). Use the notation above in your answer. What does it mean so say that M implements F?",
  16: "The concept of functional equivalence plays a central role in the theory of Turing machines (TMs). Please write the precise, technical definition of this concept. (Hand-wavy metaphors will receive few points here. Use precise language such as “if and only if.”) When are two Turing machines – let’s call them M1 and M2 for concreteness – functionally equivalent?",
  17: "What is a Universal Turing Machine (UTM)? The input for the UTM consists of two parts – what are they? Please write the precise, technical definition of the concept of UTM. (Hand-wavy metaphors will receive few points here. Use technical terminology such as “functionally equivalent.”) Is UTM one unique machine or an entire class of machines?",
  18: "Most modern computers (though not all) are organized according to the so-called von Neumann architecture. Let’s call them von Neumann Machines (VNMs). How is a VNM similar to a Turing machine (TM)? How is it different? The class of functions that can be computed on a VNM is called the von-Neumann-computable functions; the class of functions that can be computed on a TM are called the Turing-computable functions. What is the relationship between these two classes? (Please state the precise mathematical relationship. Hand-wavy metaphors will receive few points here.)",
  19: "We had a sequence of three lectures on digital computation. Dr. Petrov’s presentation for each lecture includes a series of slides titled “Important Fact about Computation.” There are three such slides – one per lecture. Each of them begins with, “Technologies exist such that …”. Reproduce these three statements here. What is the first important fact about computation? What is the second? The third? Make sure to use precise technical language. (Hand-wavy metaphors and will receive few points here.) Organize your answer as a numbered list with three items – one per important fact.",
  20: "Formulate the Church-Turing Thesis. Please use precise technical language. (Hand-wavy metaphors will receive few points here.) What evidence supports this thesis? Why is it called a thesis rather than a (mathematical) theorem?",
  21: "What is the Turing Test? Outline the overall setup as proposed by Alan Turing in his influential 1950 paper titled, “Computing Machinery and Intelligence.” (This paper is required reading for all students in our course, undergraduate and graduate alike.) What is the theoretical significance of the Turing Test? Suppose a computer system passes the Test. What can be concluded about this system? Has any system on Earth passed the test as of today?",
  22: "Outline John Searle’s Chinese Room Argument (CRA). How is it related to the Turing Test? Formulate Searle’s distinction between weak and strong AI. Is the CRA an attack on weak AI? Does it support the project of building weak AI? Is the CRA an attack on strong AI? Does it support the project of building strong AI? List at least three objections to the CRA.",
  23: "The AI pioneer John McCarthy formulated influential definitions of the technical terms “intelligence” and “artificial intelligence (AI)”. Note that the technical meaning of a term does not have to agree closely with its commonsense meaning in everyday speech. What is McCarthy’s technical definition of “intelligence”? Of “artificial intelligence”? (Grading note: To score full points for this question, make sure to write McCarthy’s definition of both terms and clearly indicate which definition corresponds to each term.)",
}

export function chapterForQuestion(id: QuestionId) {
  return chapters.find((c) => c.questions.includes(id))
}

export const exam = {
  when: "Tuesday, September 29, 2026 · 9:35-11:00 a.m.",
  startsAt: "2026-09-29T09:35:00-04:00",
  where: "University Hall 047",
  format: "In person, closed book, 100 points. Multiple choice and short answer (7-10 short-answer questions).",
  bring: "Photo ID, #2 pencils, and an eraser. No electronic devices, including smart watches.",
}
