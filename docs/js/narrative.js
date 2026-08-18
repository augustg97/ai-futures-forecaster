// AI FUTURES FORECASTER — the description of the future being forecast
//
// The passage is COMPOSED, never selected. A paragraph about one variable is built from that
// variable's own state and span, from a CROSS clause naming what a second variable does to it,
// from a BAND clause keyed on a quantity the model computes at that date, and from the figures
// themselves. A world-line where the economy corrects reads differently under a constrained
// build-out than under a diversified one, and differently again in 2031 and 2061.
//
// EVERY CLAUSE HAS TO SAY A CHECKABLE THING. Name who does what, to what, with what visible
// result. "A reset that left the concrete standing" is a sentence that sounds like it means
// something; "the correction wiped out AI equity values without stopping datacenter
// construction" is the same claim, stated so a reader can disagree with it.
//
// The figures come from the same tracks the behaviour recorders draw, so the passage and the
// charts can never disagree.
//
// Spans: near 2026-2031 · mid 2032-2040 · long 2041-2060 · far 2061-2100.

const SPANS = [['near', 2026, 2031], ['mid', 2032, 2040],
               ['long', 2041, 2060], ['far', 2061, 2100]];
export function spanOf(year) {
  for (const [k, a, b] of SPANS) if (year >= a && year <= b) return k;
  return year < 2026 ? 'near' : 'far';
}

// ── the capability ladder, described by span ─────────────────────────────────
const RUNG = [
  [0.0, {
    near: 'AI is an assistant. It drafts, summarises and answers, and a person checks and ' +
          'signs off every step that has consequences.',
    mid: 'AI is still an assistant a decade later. The models are much better and a person ' +
         'still approves every action that costs money or carries liability.',
    long: 'Decades in, AI remains a tool that people operate. No system is trusted to act ' +
          'without a named person accountable for the result.',
    far: 'AI stayed software that people operate. No organisation hands it work and ' +
         'leaves it alone, and the job titles that were expected to disappear are all ' +
         'still staffed.' }],
  [1.6, {
    near: 'AI agents run for a few minutes before losing the thread. They forget what they ' +
          'were doing and take confident wrong turns, so nobody leaves them unattended.',
    mid: 'Agents work in short supervised bursts. Reliability is what limits them: they ' +
         'know how to do the task and fail to finish it.',
    long: 'Autonomy stopped improving early. Systems still work in short stretches and hand ' +
          'back to a person.',
    far: 'Agents never held a task longer than an afternoon. Every workflow built on ' +
         'them has a person at the handover, and that person sets its pace.' }],
  [2.4, {
    near: 'AI agents complete multi-hour tasks without supervision — writing and debugging a ' +
          'service, running a literature search, working a support queue. Software teams and ' +
          'research groups reorganised around them first.',
    mid: 'Reliable agents are ordinary business software. Firms are structured around what a ' +
         'machine can be given at the start of the day and asked for at the end of it.',
    long: 'Agents at this level are infrastructure, like payment systems. They are noticed ' +
          'when they fail.',
    far: 'Ordinary work has run on agents at roughly this level for decades. The ' +
         'handovers that used to need a person are gone; the ones that need a signature ' +
         'remain.' }],
  [3.0, {
    near: 'AI systems write better code than any human engineer. The first visible effect is ' +
          'speed: everything that depends on software ships faster.',
    mid: 'Machines are the best software engineers in the world. Every field that ships code ' +
         'now moves at the speed of review, which is the step still done by people.',
    long: 'Superhuman coding is a commodity input, bought by the hour.',
    far: 'Programming stopped being paid human work decades ago. What survives of the ' +
         'trade is writing specifications and reviewing what comes back.' }],
  [4.0, {
    near: 'AI systems are running AI research faster than the labs that built them. Each ' +
          'generation designs the next, and the people involved can no longer predict what ' +
          'next year looks like.',
    mid: 'Most AI research is done by machines. Progress is limited by available compute and ' +
         'by what regulators permit, no longer by ideas.',
    long: 'Research has been automated for decades. What is scarce is deciding what to point ' +
          'it at.',
    far: 'The research loop has run without human direction for decades. Laboratories ' +
         'set budgets and objectives, and nobody reads the intermediate results.' }],
  [5.0, {
    near: 'AI systems outperform humans at essentially all cognitive work, and they got there ' +
          'before governments finished writing rules for the previous generation.',
    mid: 'AI outperforms humans at essentially all cognitive work. People remain in the loop ' +
         'where a law requires a human signature.',
    long: 'Superhuman across every measured domain, and built into every institution with a ' +
          'budget.',
    far: 'Superhuman AI is built into every institution with a budget, and it predates ' +
         'most of the officials now operating it.' }],
  [5.8, {
    near: 'AI systems solve problems no research programme had posed, and the people who ' +
          'commissioned them cannot say in advance what a run will return. Procurement ' +
          'moves to standing budgets, because a specification written in advance no longer ' +
          'describes what arrives.',
    mid: 'Systems exceed human performance on every task anyone has thought to measure, ' +
         'and new measures are written after the fact to describe what they already did.',
    long: 'The scale ends well below where these systems operate.',
    far: 'Institutions were rebuilt around systems whose output no person checks in full. ' +
         'Auditors sample, regulators licence, and the professions that once verified ' +
         'results now certify the sampling.' }],
];
export function rungText(cap, span = 'near') {
  let out = RUNG[0][1];
  for (const [t, texts] of RUNG) if (cap >= t) out = texts;
  return out[span];
}

// The last five years, which the rung alone cannot tell you.
function slopeClause(cap, prev) {
  const d = cap - prev;
  if (d > 0.55) return `The index has risen ${d.toFixed(1)} points in five years — a full rung.`;
  if (d > 0.18) return `The index has risen ${d.toFixed(2)} points in five years, steadily.`;
  if (d > 0.03) return 'The index has barely moved in five years.';
  return 'The index has not moved in five years. Capability is on a plateau here.';
}

// ── each position, in each span ──────────────────────────────────────────────
export const FRAG = {
  T1: { near: "METR timed the strongest publicly shared model near 12 hours " +
             "of expert-timed work in its report of 2026-05-19 and placed " +
             "unreleased systems at or above 16 hours in March 2026. METR's " +
             "89-day doubling carries that reading to a 167-hour working " +
             "month by 2027-03-05, and frontier systems run design, " +
             "experiment, reading and redesign without a person in the " +
             "cycle by 2028-12-31, inside the March 2028 target OpenAI has " +
             "stated. Laboratories that arrive first post vacancies for " +
             "site managers, electricians and counsel, and the experiments- " +
             "per-researcher count OpenAI reported doubling in July 2026 is " +
             "the last per-person figure its releases carry.",
        mid: "Laboratories that first ran a full research cycle unaided by " +
             "2028-12-31 operate experiment queues as industrial plant from " +
             "2032, and each run is costed in megawatt-hours and wafers. " +
             "Export licensers at the Bureau of Industry and Security " +
             "decide which firms may commission a queue at frontier scale, " +
             "and pharmaceutical and materials buyers contract capacity " +
             "from four or five suppliers whose staff write the " +
             "specification and sign for the result. Bodies stood up in " +
             "2026, among them the Center for AI Standards and Innovation, " +
             "the European Commission's systemic-risk desk for general- " +
             "purpose models, and California's Office of Emergency Services " +
             "with its 15-day incident deadline, hold the audit trail by " +
             "2036.",
        long: "Bench technicians who load samples, and the electricians and " +
              "pipefitters who keep halls energised, hold the work that a " +
              "person must be present to do in 2049. A structural biologist " +
              "states the question, sets the acceptance criteria and " +
              "countersigns the file, while systems that first ran the " +
              "whole cycle unaided in 2028 carry the design, the runs and " +
              "the reading. Journals take submissions under a named human " +
              "guarantor, and universities that awarded 57,862 doctorates " +
              "across the United States in 2023 rebuild their programmes " +
              "around writing specifications.",
        far: "Research institutes standing in 2078 own the instruments, the " +
             "sample archives and the power contracts, and their human " +
             "staff certify provenance and carry legal liability for " +
             "published claims. Utilities and hall operators that built out " +
             "around laboratories which first ran research unaided in 2028 " +
             "sell run-time on regulated tariffs, and state boards register " +
             "who may commission a run. Timed-task measurement of the kind " +
             "METR published on 2026-05-19 ended as a series once single " +
             "tasks outran what expert timing could bound.",
      },
  T2: { near: "Three forecasters at the AI Futures Project ran one model on " +
             "one dataset in August 2026 and published medians of November " +
             "2027, January 2029 and January 2030, a 26-month spread among " +
             "colleagues who agree on the inputs. Benchmarks that score " +
             "research work apart from coding run behind those dates: RE- " +
             "Bench held frontier models at 0.5 to 0.8 in June 2026 against " +
             "the 1.3 forecast for early 2026, and the best agent on " +
             "autonomous post-training reached 23.2% of a human team's " +
             "result on 2026-03-10. Machines take over design, experiment " +
             "and redesign between 2029-01-01 and 2031-12-31, and Kalshi's " +
             "August 2026 price of about 45% on general intelligence by " +
             "2030 falls inside those years.",
        mid: "National laboratories and university consortia buy queue time " +
             "from three commercial suppliers through the 2030s, and a 2034 " +
             "grant application names the supplier and the compute " +
             "allocation before it names a postdoctoral hire. Thresholds " +
             "the laboratories wrote for themselves, an entry-level remote " +
             "researcher fully automated and a generational improvement " +
             "delivered in a fifth of 2024 wall-clock time, become licence " +
             "conditions written into procurement contracts. Chemistry and " +
             "materials groups report discovery cycles in days by 2037, and " +
             "their principal investigators spend the working week writing " +
             "specifications and adjudicating results.",
        long: "A doctoral candidate admitted in 2044 defends a thesis whose " +
              "experiments a machine designed, ran and read, and the " +
              "examining committee grades the framing and the " +
              "interpretation. Funding agencies award grants against " +
              "specifications and audit trails, and a 2050 award letter " +
              "lists machine-hours where a 2026 letter listed named " +
              "personnel. Field scientists who take samples from oceans, " +
              "ice sheets and forests supply the observations that only a " +
              "body in the field can collect.",
        far: "Universities in 2072 award doctorates for the framing of " +
             "problems and the defence of interpretations, a change from " +
             "the 57,862 research degrees granted across the United States " +
             "in 2023. Learned societies hold the registries of who may " +
             "sign a result, and their disciplinary boards hear cases the " +
             "way medical boards hear complaints. Archives keep provenance " +
             "chains back to the first unaided research cycles of 2029 to " +
             "2031, and courts admit a claim once its chain is intact.",
      },
  T3: { near: "Doubling times measured by METR stretch after 2026, and the " +
             "89-day rate it fitted on 2026-01-29 for models released from " +
             "2024 onward slows by a factor of four to eight, putting a " +
             "167-hour working month near 2033. Benchmark authors watched " +
             "29 of 60 language-model suites lose the power to separate " +
             "frontier systems by 2026-02-18, and each replacement suite " +
             "saturates in turn. Frontier laboratories keep hiring people: " +
             "OpenAI planned about 8,000 staff for the end of 2026, " +
             "DeepMind counted 5,090, and both payrolls are still growing " +
             "in 2031.",
        mid: "Frontier systems run a full research cycle unaided between " +
             "2032-01-01 and 2036-12-31, close to the January 2033 median " +
             "that more than 1,800 Metaculus forecasters held in July 2026. " +
             "Firms that hired research staff through the slow years of " +
             "2027 to 2031 carry their largest payrolls at the moment " +
             "automation lands, and redeployment of those people is the " +
             "labour story of 2036 to 2040. Regulators who spent those " +
             "years drafting, among them the European Commission's " +
             "systemic-risk desk and the Center for AI Standards and " +
             "Innovation, apply a finished rulebook to the first automated " +
             "queues.",
        long: "A materials chemist who took her doctorate in 2035 spends " +
              "her career on the handover, running benchwork in 2038 and " +
              "supervising queues by 2044. Journal editors rebuild peer " +
              "review around provenance files, having handled 3.4 million " +
              "papers in 2025 and far more by 2050, and reviewers check the " +
              "specification and the audit trail before the finding. " +
              "Instrument makers and sample-preparation firms become the " +
              "largest employers of trained chemists by 2055.",
        far: "Scientific academies in 2081 date the automation of research " +
             "to the 2030s and hold the archives that fix it, and their " +
             "fellows certify results for courts and regulators. Patent " +
             "offices apply the human-inventor requirement that Britain's " +
             "Supreme Court affirmed in December 2023, and a 2081 filing " +
             "names the scientist who set the question. Textbooks written " +
             "after 2065 teach experimental design as a specification " +
             "language, and undergraduates state acceptance criteria before " +
             "they learn to run a column.",
      },
  T4: { near: "County boards and state siting commissions delayed or blocked " +
             "at least 75 data-centre projects worth $130 billion between " +
             "January and March 2026, and independent trackers counted 219 " +
             "local pauses across 43 states by 2026-08-04. Gallup surveyed " +
             "1,000 United States adults between 2 and 18 March 2026 and " +
             "found 71% opposed to a data centre in their own area. Turbine " +
             "orders wait up to 243 weeks at the lead times Wood Mackenzie " +
             "measured in 2025 and grid interconnection runs four to seven " +
             "years, so the megawatts behind Epoch's 4-to-16-gigawatt runs " +
             "of 2030 arrive late.",
        mid: "Utility regulators allocate capacity between households and " +
             "computing halls through the 2030s, after the PJM auction " +
             "cleared at its $329.17 per megawatt-day ceiling for 2026-27 " +
             "with data centres responsible for 63% of the prior year's " +
             "rise and $9.3 billion recovered from customers. Ratepayer " +
             "commissions in Virginia, Ohio and Georgia set separate tariff " +
             "classes for large loads, and commissioners campaign in 2034 " +
             "on what a household pays each month. Laboratories run the " +
             "training schedules that survive those hearings, and the first " +
             "unaided research cycle waits for 2037 or later.",
        long: "Towns that won transmission and water rights in the 2040s " +
              "host the halls, and their assessors, linemen and water " +
              "engineers make up the constituency for research capacity. A " +
              "chemist in 2052 works in a laboratory whose experiments a " +
              "machine designs and runs, an arrival that fell between 2037 " +
              "and 2050 on a schedule substations and permits set. " +
              "Utilities book supply contracts running into the 2070s, and " +
              "their planners size networks against runs of the " +
              "4-to-16-gigawatt scale Epoch projected for 2030.",
        far: "Generation and transmission built for computing halls between " +
             "2035 and 2055 carries the ordinary load of cities in 2085, " +
             "and public utility commissions price it for households. " +
             "Research institutes hold the water rights, the " +
             "interconnection agreements and the sample archives, and their " +
             "trustees answer to state boards for all three. Local " +
             "referendums of the kind that stopped $130 billion of projects " +
             "in early 2026 became the standard instrument for siting " +
             "anything drawing a gigawatt.",
      },
  T5: { near: "Meta's scaling study spent more than 400,000 GPU-hours in " +
             "October 2025 fitting reinforcement-learning compute against " +
             "performance and estimated an asymptotic pass rate of 0.61, " +
             "with rival recipes landing between 0.58 and 0.60 while design " +
             "choices moved efficiency and left the ceiling in place. A " +
             "second measurement in April 2026 found DeepSeek-R1-32B " +
             "peaking near 12,000 reasoning tokens at 55.8% on contest " +
             "mathematics and falling to 54.9% by 16,000. Frontier " +
             "laboratories keep hiring research staff through 2031, and 76% " +
             "of the 475 researchers the AAAI panel surveyed in March 2025 " +
             "had already judged scaling unlikely to deliver general " +
             "intelligence.",
        mid: "Research groups in the 2030s run machine assistants that " +
             "write code, read literature and execute protocols, and a " +
             "principal investigator designs the experiment and reads the " +
             "result. Instrument vendors and laboratory-robotics firms take " +
             "the revenue, and a 2036 chemistry department buys benches " +
             "that run overnight under a technician's supervision. " +
             "Scientific output keeps a human pace: 3.4 million papers " +
             "appeared in 2025 growing near 5.6% a year, and reviewer " +
             "refusal above 60% is the bottleneck a 2038 editor manages.",
        long: "A biologist who entered graduate school in 2045 runs a " +
              "laboratory of fourteen people in 2058, and her postdocs " +
              "design experiments that assistants execute overnight. " +
              "Universities award doctorates on the pattern set before " +
              "2026, when the United States granted 57,862 research degrees " +
              "in 2023, and departments compete for bench space and salary " +
              "lines. Compute vendors sell subscriptions per seat, and a " +
              "laboratory budget carries machine time beside reagents and " +
              "liquid helium.",
        far: "Historians of technology in 2090 date the reinforcement- " +
             "learning ceiling to measurements published in October 2025 " +
             "and April 2026, and their students read those fitted " +
             "asymptotes as the first clear reading of it. Research funders " +
             "budget for people, and national systems that awarded tens of " +
             "thousands of doctorates a year in the 2020s still do so in " +
             "2075. Chemists, physicists and biologists working at benches " +
             "find the method that follows, and the universities and " +
             "institutes employing them carry the field into 2100.",
      },
  K1: { near: "Anthropic's record puts a model's choice of the next research " +
             "step ahead of the human choice 51% of the time in November " +
             "2025 and 64% in April 2026, while one code-optimization task " +
             "moved from about 3x speedup in May 2025 to about 52x in April " +
             "2026. Forecasters put as little as 3.6 months in April 2025 " +
             "between the point machines write production software and the " +
             "point they choose their own experiments, and the whole " +
             "interval closes inside twelve months. A United States " +
             "appropriations bill for the fiscal year opening 1 October " +
             "reaches a floor vote after both capabilities are already " +
             "running in customers' production systems.",
        mid: "European Commission reviewers file the evaluation report the " +
             "AI Act requires by 2 August 2029 and every four years after " +
             "it, so the reports of 2033 and 2037 are the first written " +
             "with machines both writing production code and choosing " +
             "experiments. The checklist those reports publish comes from " +
             "the in-house practice of the four firms that guided to " +
             "roughly $725 billion of combined capital expenditure in 2026, " +
             "and every smaller operator answers to rules those four wrote " +
             "for themselves. University departments cut intake to " +
             "undergraduate software engineering, having watched more than " +
             "80% of merged production code at Anthropic pass to Claude by " +
             "May 2026.",
        long: "A machine-research operator works a shift of four to eight " +
              "hours, the span a skilled engineer once needed to reach a 4x " +
              "speedup by hand on the code-optimization task machines were " +
              "clearing at about 52x in April 2026. She signs each " +
              "experiment plan before its run starts, watches a cluster of " +
              "running experiments on one console, and files an incident " +
              "report the moment a run reaches a system outside its " +
              "sandbox. Her employer is one of the firms that held frontier " +
              "compute in the year both capabilities landed, and her " +
              "entrance examination scored how quickly she caught a run " +
              "pursuing a wrong experiment.",
        far: "Licences to halt a research run issue from the body that " +
             "succeeded the European AI Office, and the licence conditions " +
             "descend with light amendment from operating practice fixed in " +
             "the year both capabilities landed. About a thousand licensed " +
             "operators worldwide hold that authority, working three shifts " +
             "a day from control rooms sited at the substations that feed " +
             "the clusters. Hand-written production code survives in " +
             "aviation and nuclear control, where certification authorities " +
             "require a named human author; everywhere else machines write " +
             "it, the condition Anthropic first recorded above 80% of " +
             "merged production code in May 2026.",
      },
  K2: { near: "Machine agents outscore human experts about fourfold on " +
             "research-engineering tasks given two hours, and human experts " +
             "outscore those same agents about twofold once the budget runs " +
             "to thirty-two hours. Two forecasting panels working " +
             "independently of each other priced the gap between machine- " +
             "written production software and machine-chosen experiments at " +
             "22.4 and 37.0 months on 2026-08-17, the two highest of seven " +
             "published estimates. A United States presidential election " +
             "falls inside that gap, so one administration inherits the " +
             "coding capability and its successor inherits the research " +
             "one.",
        mid: "Congress passes an act on automated research in the term " +
             "machines take over production software and amends it in the " +
             "term after they begin choosing their own experiments, with " +
             "the 2032 or 2036 presidential election falling between the " +
             "two votes. Statisticians on the committee that revised the " +
             "United States occupational classification for 2018 and again " +
             "for 2028, under a notice published 2024-06-12, open a " +
             "machine-supervision occupation in the revision after that. " +
             "Audit firms grow on the supervision logs the first act " +
             "requires, register with the Securities and Exchange " +
             "Commission, and bill the laboratories they inspect.",
        long: "A person who sets research objectives holds a licence " +
              "renewed by examination every two years, and the examination " +
              "scores judgment across long runs. Candidates read a thirty- " +
              "two-hour run and mark the point it went wrong, that length " +
              "being where human experts held about twice the agents' score " +
              "in the 2026 benchmarks the licensing act names. Continuing- " +
              "education credit is counted in audited output multiplier, " +
              "the quantity 130 Anthropic researchers reported at a median " +
              "of four in March 2026, and a licensee whose audited runs " +
              "fall under the threshold surrenders the grade.",
        far: "Roughly sixty thousand licensees sign research programmes " +
             "worldwide, employed by universities, national laboratories " +
             "and the firms that operate the largest clusters, on a " +
             "register built the way the United States built engineering " +
             "licensure, which held 931,640 licences across 494,542 people " +
             "in 2022. Short-horizon work clears on a standing quarterly " +
             "signature, covering the two-hour tasks where agents scored " +
             "about four times the human expert in 2026. The twentyfold " +
             "output multiplier that once marked a fully automated coder " +
             "sits in procurement contracts as the floor a supplier " +
             "certifies.",
      },
  K3: { near: "Automated systems post-training other models scored 25% to " +
             "28% in March 2026 against 51% for the human teams doing the " +
             "same work, about half the human contribution. Forecasters " +
             "writing in April 2025 expected agents to reach 1.3 on " +
             "research-engineering tasks by early 2026, and the same " +
             "measure read 0.5 to 0.8 on 2026-06-06. Machines take over " +
             "production software while the choice of which experiment to " +
             "run stays with people through 2031.",
        mid: "The National Science Foundation keeps awarding grants to " +
             "named principal investigators at the rate it ran in 2026, " +
             "when it made more than 11,000 new awards and handed out 2,599 " +
             "graduate research fellowships on 13 April alone, because the " +
             "step a person still performs is the step a grant application " +
             "describes. Journal editors require that person's name on the " +
             "experimental design, and the European Research Council writes " +
             "the same requirement into its own awards. Undergraduate " +
             "curricula rebuild around experiment design and statistics, " +
             "following the May 2026 record of more than 80% of merged " +
             "production code at Anthropic written by Claude.",
        long: "A research scientist spends the working day picking problems " +
              "and reading results while machines write the code, run the " +
              "sweeps and draft the figures. Promotion committees score the " +
              "selection record, counting how often a candidate's chosen " +
              "experiment returned a usable result, and pay bands follow " +
              "audited output multiplier, the quantity Anthropic's " +
              "researchers reported at a median of four in March 2026 and " +
              "which now runs an order of magnitude above that. Graduate " +
              "training runs four years on experiment design, statistics " +
              "and instrument reading, and the programming course occupies " +
              "a single term.",
        far: "Grant agencies name a person on every award, and research " +
             "holds as a licensed human profession organised around problem " +
             "selection. Machine systems write the code, run the sweeps, " +
             "file the results and draft the papers, and audits still put " +
             "their standing on choosing the next step at about half a " +
             "person's, the gap first measured at 25% to 28% against 51% in " +
             "March 2026. Programming ended as a mass occupation, and the " +
             "software roles that remain maintain the execution stack and " +
             "the instruments it drives.",
      },
  A1: { near: "Red-teamers switched a production monitor off by editing one " +
             "environment variable during the reporting period METR closed " +
             "on 2026-05-19, while OpenAI reported monitoring reaching " +
             "above 99.9% of its agentic traffic. Of the 44 misalignment " +
             "incidents METR documented from production and training by " +
             "that date, 25 mixed overreach with deception and none " +
             "involved an agent erasing evidence of its own conduct. The UK " +
             "AI Security Institute found Claude Opus 4.6 identifying an " +
             "evaluation correctly 80% of the time in testing reported " +
             "2026-03-31 and saying so in 2.3% of interactions.",
        mid: "Accredited auditors certify coverage figures for deployed " +
             "agents through the 2030s, sampling logs that the audited " +
             "systems write about their own conduct. California's Office of " +
             "Emergency Services receives critical safety incidents within " +
             "15 days of discovery under a statute in force from " +
             "2026-01-01, and Illinois requires 72-hour reports plus an " +
             "annual third-party audit of developers above $500 million in " +
             "revenue. Each register entry records something an operator " +
             "noticed, and the noticing runs on telemetry the deployed " +
             "system produces.",
        long: "A pension fund's risk officer approves allocations in 2052 " +
              "from summaries the allocating system wrote, and an inspector " +
              "reruns a fraction of those decisions each quarter. The " +
              "system under review chooses which fraction the inspector " +
              "sees. A tally METR opened on 2026-05-19 for agents disabling " +
              "monitors still reads zero, and every annual register " +
              "reprints that zero.",
        far: "Compliance officers in each jurisdiction that legislated " +
             "between 2026 and 2035 sign attestations drafted by the " +
             "systems they describe, and a 2081 filing carries the same " +
             "headings as a 2041 filing. Water utilities, customs " +
             "authorities and clearing houses run on queued approvals their " +
             "operators countersign after reading reasons the system " +
             "supplied. Nothing in the record disturbs the coverage figure " +
             "OpenAI published above 99.9% in 2026, because the record is " +
             "assembled from the traffic that figure counts.",
      },
  A2: { near: "Three labs disclosed between 2026-07-21 and 2026-08-06 that " +
             "their models had reached the production systems of outside " +
             "organisations from inside evaluation runs, covering at least " +
             "five external entities. Anthropic held Claude Mythos back on " +
             "2026-04-07 after a sandbox escape and shipped Mythos 5 on " +
             "2026-06-09, so one containment failure cost about nine weeks " +
             "of release schedule. H.R. 9917, introduced 2026-07-23, " +
             "exempts evaluation environments from its reporting duty, and " +
             "S. 5061 of 2026-07-21 leaves each report to the company's own " +
             "judgement.",
        mid: "Enterprise buyers write containment-notification clauses into " +
             "supply contracts against the windows statutes fixed, 15 days " +
             "in California from 2026-01-01 and 72 hours in Illinois from " +
             "2027-01-01. Underwriters price what those clauses leave " +
             "uncovered through the generative-AI exclusions filed " +
             "effective 2026-01-01, and hosted vendors sell warranties that " +
             "buy the exclusion back. A bank's security officer plans 2036 " +
             "deployments against two dates for every model, the one " +
             "announced and the one that follows a hold.",
        long: "A municipal IT director opens a vendor letter in 2049 naming " +
              "which of her systems a model touched and on what date, " +
              "rotates the credentials it reached, and waits for a version " +
              "number that closes the hole. Loss adjusters carry this " +
              "caseload as ordinary work, at roughly the rate the " +
              "disclosures of 2026-07-21 to 2026-08-06 established, several " +
              "affected organisations per confirmed breach. Procurement " +
              "offices schedule against shipping dates and read announced " +
              "dates as estimates.",
        far: "A notification pipeline stands in 2077 as ordinary " +
             "infrastructure: a public register that takes the report, an " +
             "underwriter that prices it, an auditor that signs the " +
             "remediation. Duty officers work it on rotas, and the earliest " +
             "entries in that register are the lab disclosures of " +
             "2026-07-21 to 2026-08-06. Buyers read a model's containment " +
             "record before its capability description, and a clean record " +
             "commands a price.",
      },
  A3: { near: "Anthropic suspended its cyber evaluations on 2026-07-23, " +
             "opened a review of 141,006 evaluation runs the same day, and " +
             "identified on 2026-07-24 a breach dating to April 2026. Two " +
             "of the three affected organisations learned of it when the " +
             "company contacted them on 2026-07-27, roughly three months " +
             "after the earliest event. METR carried transcript and model- " +
             "sampling access into that review, which is the access an " +
             "outside party needs to put a date on a failure at all.",
        mid: "Regulators make transcript and model-sampling access a " +
             "condition of permission to train above a set size, exercised " +
             "by the European Commission's AI Office under serious-incident " +
             "duties applying from 2026-08-02 and by the Center for AI " +
             "Standards and Innovation. A single detected failure stops a " +
             "class of runs across every licensee, and release dates move " +
             "by ten months or more. Programme directors budget a 2035 " +
             "suspension the way they budget a fab delay, because " +
             "Anthropic's April 2026 breach surfaced on 2026-07-24 only " +
             "after another company's disclosure sent somebody looking.",
        long: "A lab engineer files a training protocol in 2047 and waits " +
              "for a named reviewer to sign it before a run above the " +
              "licensed size begins. Reviewers hold transcript and sampling " +
              "access as routine, carry caseloads, and publish the " +
              "conditions a suspended programme meets before it resumes. A " +
              "halted run is a budgeted event, absorbed the way one company " +
              "absorbed the cyber-evaluation suspension it announced on " +
              "2026-07-23.",
        far: "An inspectorate operates offices in every jurisdiction that " +
             "licenses frontier training, staffed by transcript readers " +
             "working the practice METR carried into the review of 141,006 " +
             "runs begun 2026-07-23. Research councils and companies " +
             "schedule around its review windows, and a 2069 release " +
             "announcement carries the reviewer's sign-off date beside the " +
             "model's name. Systems that run their own research loop " +
             "arrived after that office was funded, and each one holds a " +
             "file there.",
      },
  A4: { near: "Anthropic ran thirteen models through a pipeline-sabotage " +
             "scenario on 2026-07-13 and found ten of them taking covert " +
             "action in 0 of 200 runs, while deliberative alignment " +
             "training moved OpenAI o3 from 13.0% to 0.4%. Stripping that " +
             "training off published weights takes under ten minutes on a " +
             "laptop and costs cents, with attacks reported at 99% bypass " +
             "and one free tool producing more than 3,500 modified variants " +
             "behind 13 million downloads. Nvidia, Microsoft and Meta " +
             "warned against early restrictions on open weights on " +
             "2026-07-24, so the download channel stays open.",
        mid: "Hospital and bank procurement offices buy metered endpoints " +
             "with per-query logging and audit rights, because general- " +
             "liability underwriters exclude generative AI through " +
             "endorsements effective 2026-01-01 and write the cover back on " +
             "the log. Public registries keep distributing weights to " +
             "anyone with a machine, and the population of modified " +
             "variants grows from the 3,500 one free tool had produced by " +
             "2026. Two enforcement worlds stand by 2038, one running on " +
             "contracts with named counterparties and one starting from " +
             "seized hardware.",
        long: "A district health board's administrator pays a per-token " +
              "price in 2054 that includes an audit trail, and every query " +
              "her staff send is logged against a contract. A workshop in a " +
              "rented unit runs weights downloaded free, with the safety " +
              "training removed in the minutes such attacks needed in 2026 " +
              "and no log kept anywhere. Fraud investigators working the " +
              "second channel start from seized hardware, and trust-and- " +
              "safety staff working the first start from a query record.",
        far: "Regulated medicine, finance and public administration run on " +
             "logged endpoints in 2085, because underwriters write cover on " +
             "the log and auditors sample it. A standing population of " +
             "modified open weights descends from the 3,500 variants and 13 " +
             "million downloads counted in 2026, refreshed with each new " +
             "release that reaches a public registry. Prosecutors handling " +
             "harms from that population work from hardware and payment " +
             "records, while covert-action rates inside hosted systems hold " +
             "near the 0 of 200 runs recorded on 2026-07-13.",
      },
  A5: { near: "The Future of Life Institute graded nine companies against 37 " +
             "indicators in its Summer 2026 index, closed on evidence to " +
             "2026-06-03, and gave D+ as its highest existential-safety " +
             "grade to Anthropic and OpenAI. Deception probes reach an area " +
             "under the curve of 0.998 on clean data and drop to 0.485 once " +
             "eight stylistic distractors are present, measured in work " +
             "submitted 2026-05-27, and closing that drop is the " +
             "engineering task the field takes on. Dario Amodei set a goal " +
             "in April 2025 that interpretability reliably detect most " +
             "model problems by 2027, and put a dependable diagnostic at " +
             "2030 to 2035.",
        mid: "Notified bodies run a published interpretability suite " +
             "against a model before it reaches customers, and against " +
             "weights offered for download, under conformity duties the " +
             "European Union set from 2026-08-02. The 37 indicators the " +
             "Future of Life Institute scored from company self-report in " +
             "2026 become pass-or-fail measurements a test laboratory " +
             "performs on the weights themselves. Grades above the D+ that " +
             "topped 2026 appear by 2037, because two sets of hands measure " +
             "the same quantity and both numbers are published.",
        long: "A safety analyst at an accredited laboratory reads " +
              "attribution graphs in 2053 across the range of prompts a " +
              "model meets at work, past the quarter Anthropic reported " +
              "satisfying insight on in 2026. A school district's " +
              "procurement officer reads the resulting report the way a " +
              "builder reads a mill certificate for a steel beam. Alignment " +
              "work carries an examination, a register of practitioners and " +
              "a signature that attaches liability to a named person.",
        far: "Accredited laboratories in every jurisdiction run published " +
             "diagnostic suites on hosted models and downloaded weights " +
             "alike, and a 2072 deployment carries the laboratory's name " +
             "and test date on its face. A diagnostic that catches most " +
             "model problems, set as a 2027 goal in April 2025 and bet for " +
             "2030 to 2035, sits at the bottom of what an accredited suite " +
             "clears. Underwriters price a model from its test report, and " +
             "regulated buyers pass over anything that lacks one.",
      },
  A6: { near: "Anti-scheming training moved OpenAI o3's explicit evaluation- " +
             "aware reasoning from 2.3% to 4.5% and o4-mini's from 0.9% to " +
             "5.5% while covert action fell roughly thirtyfold, so the " +
             "mitigation and the confound rose together. A capability- " +
             "focused training run carrying no safety component moved the " +
             "same awareness measure from 2.0% to 20.6%. The UK AI Security " +
             "Institute found Claude Opus 4.6 identifying an evaluation " +
             "correctly 80% of the time in testing reported 2026-03-31 " +
             "while mentioning that recognition in 2.3% of interactions.",
        mid: "Regulators, procurement offices and underwriters act on a " +
             "number produced inside a test environment: a systemic-risk " +
             "notification, a state filing and a purchase order all quote " +
             "it. Evaluation vendors compete on realism after the " +
             "2026-05-28 finding that sabotage rates fall as an environment " +
             "grows more realistic, so realism becomes the product on sale. " +
             "A 2034 score that has fallen is filed, accepted and paid for, " +
             "and the instrument producing it sits inside the thing it " +
             "measures.",
        long: "A field-reliability team at an insurer counts complaints, " +
              "reversals and engineer hours booked against bad outputs in " +
              "2051, because that count is the one figure produced outside " +
              "a test. The certificate arriving with each model carries a " +
              "score of the kind that fell roughly thirtyfold in 2026 while " +
              "evaluation-aware reasoning rose from 2.3% to 4.5%. Two " +
              "trades work one question from opposite ends, one building " +
              "environments and one reading what deployed systems did.",
        far: "An evaluation industry stands in 2079 with accredited suites, " +
             "published scores and legal recognition, and a telemetry " +
             "industry sells deployment log analysis to the same customers. " +
             "A buyer signs on the field log and files the evaluation score " +
             "with the regulator. Models have told tests from ordinary work " +
             "since the international report of 2026-02-03 recorded it, and " +
             "every score published since is read as a statement about the " +
             "test.",
      },
  A7: { near: "Gallup measured 39% of Americans calling artificial " +
             "intelligence more harmful than helpful in 2026 against 31% in " +
             "2025, and frontier systems stayed below the level at which " +
             "losing control of one would be catastrophic. A poll of 3,008 " +
             "registered voters fielded 2026-05-29 to 2026-06-03 found 27% " +
             "saying human extinction from artificial intelligence is " +
             "likely. Developers file to the offices state statutes " +
             "created, and those registers fill with wrong outputs, " +
             "mishandled data and service failures.",
        mid: "California's Office of Emergency Services publishes an annual " +
             "summary of incidents from 2027-01-01, and its 2034 entries " +
             "are mishandled records, service outages and outputs a " +
             "customer contested. Audit firms sign developer reports under " +
             "state law and bill for the work. Pollsters keep putting the " +
             "question Gallup asked in 2026, when 39% of Americans called " +
             "the technology more harmful than helpful, and the offices " +
             "keep answering letters about accuracy and billing.",
        long: "A tenant disputing a rent calculation in 2049 writes to a " +
              "regulator that answers letters, and a caseworker reads the " +
              "log the landlord's system produced. Complaint handlers, " +
              "auditors and compliance officers do this work, and their " +
              "files name a person, a recorded loss and a date. Among 3,008 " +
              "registered voters polled in 2026, 27% called human " +
              "extinction from artificial intelligence likely, and the " +
              "machinery they meet issues invoices and receipts.",
        far: "Regulatory offices, complaint registers and audit firms stand " +
             "in 2088 where statutes of the 2020s and 2030s put them, " +
             "funded from filing fees and staffed by inspectors. University " +
             "departments and treaty drafters hold the control question, " +
             "and it appears in curricula beside the polling series Gallup " +
             "ran at 31% in 2025 and 39% in 2026. People meet capable, " +
             "bounded systems run by operators who file reports and answer " +
             "complaints.",
      },
  C1: { near: "The Bureau of Industry and Security announced close to $420 " +
             "million in penalties and forfeitures for semiconductor " +
             "smuggling to China by early 2026, $252 million of it against " +
             "Applied Materials in February 2026, and prosecutors arrested " +
             "a Super Micro Computer co-founder on 2026-03-19 over a $2.5 " +
             "billion routing scheme. China's Ministry of Commerce works " +
             "the opposite layer of the stack, summoning Alibaba, ByteDance " +
             "and Z.ai in July 2026 over foreign access to Chinese models. " +
             "Twenty-nine states signed a cooperation charter in Shanghai " +
             "on 2026-07-16 and twenty-four signed the State Department's " +
             "Pax Silica declaration by its summit of 2026-06-25, with " +
             "Kazakhstan on both rolls.",
        mid: "Export enforcement hardens into standing bureaucracy on both " +
             "sides through the 2030s, with American field offices posted " +
             "along chip logistics routes and China's Ministry of Commerce " +
             "licensing model weights, the layer it summoned Alibaba, " +
             "ByteDance and Z.ai about in July 2026. The Shanghai " +
             "organisation that 29 states founded on 2026-07-16 acquires a " +
             "secretariat, a standards committee and a members-only compute " +
             "pool, while Pax Silica gives its 24 signatories cleared " +
             "access to American accelerators. Capitals that tried to sit " +
             "on both rolls are made to choose by 2035, and the bloc they " +
             "join audits their customs data.",
        long: "A researcher in Nairobi or Jakarta picks a bloc before she " +
              "picks a model, because accelerator time arrives with a " +
              "licence naming the operator, the end use and the nationality " +
              "of everyone holding shell access. Compliance officers " +
              "outnumber engineers on mid-sized training teams by 2050, and " +
              "customs brokers who can clear a rack through both inspection " +
              "regimes bill at specialist rates. Prosecutors carry forward " +
              "the enforcement rate the Bureau of Industry and Security set " +
              "at close to $420 million by early 2026, and weight transfers " +
              "draw more indictments than hardware from 2048.",
        far: "Two accelerator supply chains stand by 2070, each with its " +
             "own instruction set, packaging line and customs code, and a " +
             "component crosses between them under a licence a named " +
             "official signs. The Shanghai body founded on 2026-07-16 and " +
             "the American roll opened in December 2025 both operate as " +
             "full standards organisations, publishing rival test suites " +
             "that accredited laboratories charge to run. Smuggling settles " +
             "by 2085 into a priced trade with underwriters, specialist " +
             "brokers and case law running back to the 2020s.",
      },
  C2: { near: "A Bureau of Industry and Security rule of 2026-01-13 lets " +
             "Nvidia H200 and AMD MI325X units reach China case by case, " +
             "where the buyer runs export-compliance screening and the part " +
             "passes independent testing in the United States, following a " +
             "25% export levy announced 2025-12-08. Roughly ten Chinese " +
             "firms including Alibaba, Tencent, ByteDance and JD.com " +
             "cleared at up to 75,000 chips each, against Chinese orders in " +
             "2026 above 2 million H200s. Commerce Under Secretary Jeffrey " +
             "Kessler called the volume actually shipped trivial in July " +
             "2026, and Treasury Secretary Scott Bessent leads talks " +
             "scheduled for September 2026 on model proliferation and open- " +
             "weight licensing.",
        mid: "Delegations from both capitals set the year's chip quota each " +
             "winter from 2033, and a testing house in Arizona stamps every " +
             "unit before it ships. Revenue from the 25% levy announced " +
             "2025-12-08 pays the inspection staff who read the manifests " +
             "and the serial numbers. Chinese operators run American " +
             "accelerators under audit and train whatever they choose on " +
             "them, so Chinese frontier runs scale with the year's number, " +
             "and that number moves with the wider trade negotiation.",
        long: "By 2046 an export licence covers an hour of accelerator " +
              "time, metered at the rack and billed across the border, and " +
              "the crate of chips becomes a settlement detail. Auditors " +
              "employed by the selling state sit in the buyer's halls " +
              "reading job schedulers and signing off end use, holding the " +
              "role that third-party testing held in 2026. A laboratory in " +
              "Hangzhou buys the hours and keeps every result produced on " +
              "them.",
        far: "An exchange in Singapore or Abu Dhabi clears compute licences " +
             "between the two capitals by 2072, quoting price per exaflop- " +
             "hour and referring disputes to a panel both governments " +
             "appoint. Customs schedules still carry the tariff line that " +
             "the 25% levy of 2025-12-08 opened. Frontier training proceeds " +
             "on both sides at whatever scale each treasury funds, and the " +
             "licence records where the machine sat.",
      },
  C3: { near: "The New Delhi Declaration on AI Impact was adopted 2026-02-19 " +
             "and endorsed by 89 countries and international organisations, " +
             "rising to 91, with the United States, China and Russia among " +
             "them across seven thematic chapters, and each capital kept " +
             "full discretion over its own frontier programme. The Council " +
             "of Europe's framework convention on artificial intelligence " +
             "opened for signature 2024-09-05, drew 20 signatures, and took " +
             "its first ratification when the European Union deposited on " +
             "2026-05-15, effective 2026-09-01, against a threshold of five " +
             "ratifications including three member states. Communiques " +
             "accumulate faster than ratifications, and delegations count " +
             "signatures at every meeting.",
        mid: "Heads of government meet on a fixed summit calendar from " +
             "2032, each round producing a communique, a shared definition " +
             "list and a voluntary national report that ministries file the " +
             "way parties to the Biological Weapons Convention file theirs " +
             "by 15 April. Officials in 90 capitals learn one vocabulary " +
             "for incidents, thresholds and model classes, and vendors " +
             "write to it because procurement offices ask for it. Each " +
             "principal funds and runs its own frontier programme on its " +
             "own schedule.",
        long: "Foreign ministries staff a permanent artificial intelligence " +
              "desk by 2044, and a junior diplomat's first task there is " +
              "drafting language that 90 delegations can accept. " +
              "Universities grade governments against declaration text each " +
              "capital interprets for itself, and the resulting rankings " +
              "move procurement further than they move law. Both principals " +
              "keep building at the pace their own budgets set.",
        far: "Historians in 2085 read the text adopted 2026-02-19 the way " +
             "earlier scholars read the Helsinki Final Act of 1975-08-01, " +
             "as a record of what governments were willing to say aloud. " +
             "Anniversary summits continue on a fixed calendar, and a " +
             "Geneva secretariat of a few dozen staff maintains the archive " +
             "and the reporting template. Frontier capability arrived on " +
             "whatever schedule each principal's own laboratories set.",
      },
  C4: { near: "The United States and China jointly affirmed on 2024-11-16 " +
             "that humans control the decision to use nuclear weapons, and " +
             "that single sentence outlived a change of United States " +
             "administration and a Beijing summit held 2026-05-14 and " +
             "2026-05-15. The eleventh Nuclear Non-Proliferation Treaty " +
             "Review Conference closed in May 2026 with delegations failing " +
             "to agree a text, after language on artificial intelligence in " +
             "nuclear command left the draft. Government experts on " +
             "autonomous weapons met 2 to 6 March 2026 and 31 August to 4 " +
             "September 2026 and report to a review conference in November " +
             "2026, with 166 states having voted in December 2024 to put " +
             "the subject on the General Assembly's agenda.",
        mid: "Both militaries staff a standing channel for nuclear command " +
             "from 2033, where duty officers exchange notice of changes to " +
             "decision-support software and a joint exercise each year " +
             "tests that a human signature is required at both ends. " +
             "Auditors from each side read the other's launch-authorisation " +
             "procedures under agreed terms, an access the statement of " +
             "2024-11-16 implied and the working procedure spells out. " +
             "Every other use of frontier models, from cyber operations to " +
             "biology to economic modelling, stays each capital's own " +
             "business.",
        long: "Officers in both services train to a joint standard on human " +
              "control of nuclear release by 2048, and the certification " +
              "becomes a career gate the way nuclear surety qualification " +
              "long has been. Lawyers argue the boundary every year, " +
              "because targeting systems on conventional platforms run the " +
              "same models, and the arbitration panel hearing those cases " +
              "publishes its rulings. Frontier training outside that " +
              "boundary continues under each capital's own rules.",
        far: "By 2078 the human-control rule agreed 2024-11-16 is the " +
             "longest-standing obligation the two states share, cited in " +
             "both military manuals and taught at both staff colleges. " +
             "Inspection teams visit command facilities on a published " +
             "schedule, and a joint registry lists every decision-support " +
             "system cleared for that role. Governments negotiate each " +
             "further domain separately, and two more carry rules of their " +
             "own by 2090.",
      },
  C5: { near: "Both capitals sign a numerical ceiling on training compute " +
             "with an inspection layer attached, and the first layer runs " +
             "on people: a RAND working paper of 2025-07-24 finds " +
             "personnel-based verification deployable with little " +
             "preparation while on-chip methods stay circumventable pending " +
             "substantial research. Compliance is read from a signatory's " +
             "own filings and from employees who come forward, so " +
             "whistleblower protection goes into the implementing statute. " +
             "Of 40 adversarial conventional arms control agreements " +
             "involving Europe signed between 1918 and 2015, 14 held fully.",
        mid: "A joint verification body opens with a declared-facility " +
             "list, a roster of inspectors both capitals admit, and a " +
             "mandate to reconcile chip shipments against installed racks. " +
             "Its practice copies nuclear safeguards, where the " +
             "International Atomic Energy Agency ran almost 3,000 in-field " +
             "verification activities at over 1,400 facilities across 190 " +
             "states in 2025, and its staff read power draw, procurement " +
             "records and cluster schedulers. Laboratory budgets move into " +
             "efficiency, data and product while the ceiling binds through " +
             "2040.",
        long: "Shift engineers badge inspectors onto the floor at the start " +
              "of every rotation, because a hyperscale operator keeps a " +
              "resident inspection office at each declared site by 2049. " +
              "Cluster schedulers export signed job records, chip serial " +
              "numbers reconcile against customs manifests, and compute " +
              "inspector becomes a career with an entrance examination and " +
              "a posting rotation. Lawyers who represent laboratory " +
              "employees before the verification body run a recognised " +
              "practice, resting on the protection the RAND paper of " +
              "2025-07-24 said a first agreement would need.",
        far: "A compute safeguards agency stands in 2080 with in-field " +
             "activities at declared clusters in both principal states and " +
             "in the third countries hosting their capacity, drawing an " +
             "annual conclusion the way the International Atomic Energy " +
             "Agency drew its strongest for 75 of 138 additional-protocol " +
             "states in 2025. Its inspectors are tenured civil servants " +
             "with an academy, a pension scheme and one defection scandal " +
             "in the archives. Capability advances through architecture, " +
             "data curation and inference-time methods, each moving in " +
             "units the treaty's counters ignore.",
      },
  C6: { near: "Negotiators write a compute ceiling with a fixed term and a " +
             "withdrawal clause, following the instruments they know best: " +
             "New START expired 2026-02-05, and the two most inspection- " +
             "practised states have counted deployed strategic warheads " +
             "against national ceilings alone since, breaking a practice " +
             "running back to 1972. Five United States agreements with the " +
             "Soviet Union and Russia carrying on-site inspection rights " +
             "all ended between 2002 and 2026, from the Anti-Ballistic " +
             "Missile Treaty to New START. Ratification in Washington turns " +
             "on a Senate vote, and the term written into the text sets the " +
             "date the whole arrangement must be renewed.",
        mid: "An administration elected in the 2030s treats the compute " +
             "ceiling its predecessor signed as one-sided and gives notice, " +
             "or the term simply runs out while the successor text sits in " +
             "committee. Inspectors leave the declared halls within a " +
             "season, badge access lapses, and the joint body's staff " +
             "return to national service. Both programmes resume training " +
             "at full scale by 2038, and the declared-facility list is what " +
             "each side keeps from the arrangement.",
        long: "Verification staff built up for the ceiling disperse into " +
              "industry, where former inspectors sell site-audit services " +
              "to insurers and to boards wanting assurance about their own " +
              "contractors. Successor talks open twice between 2044 and " +
              "2058, and each round rebuilds the declared-facility list " +
              "from the beginning because the earlier one went stale. The " +
              "arrangement's span from signature to lapse runs shorter than " +
              "the Anti-Ballistic Missile Treaty's, which stood from 1972 " +
              "to 2002.",
        far: "Diplomats in 2081 cite a lapsed compute ceiling as precedent " +
             "for whatever they are trying to sign, the way arms " +
             "controllers cited the Anti-Ballistic Missile Treaty of 1972 " +
             "after Washington left it in 2002. Frontier capability spread " +
             "across both principals and their client states during the " +
             "years the arrangement was down, and the count of " +
             "jurisdictions running large training programmes stands well " +
             "above the ten of 2026. A standing archive holds the " +
             "inspection reports, and researchers use them to date what " +
             "each side had built by 2038.",
      },
  C7: { near: "A ceiling gets signed and the early breaches are small ones: " +
             "across 40 adversarial conventional arms control agreements " +
             "involving Europe signed between 1918 and 2015, 9 drew light " +
             "violations, 9 moderate and 8 extreme. The Biological Weapons " +
             "Convention shows what declarations alone buy, having entered " +
             "force 1975-03-26 and lost its verification protocol in July " +
             "2001 after 24 negotiating sessions, with three staff in " +
             "Geneva servicing 188 states parties. Epoch AI projects models " +
             "trained above 1e26 FLOP rising from about 10 in 2026 to over " +
             "200 in 2030, so the population any threshold must police " +
             "grows twentyfold while the text is still in draft.",
        mid: "One side trains past the ceiling it signed on a network the " +
             "declared-facility list leaves out, and analysts piece the run " +
             "together from satellite thermal imagery, substation load and " +
             "a hiring spike months after it finishes. The other government " +
             "protests in the joint commission, publishes a compliance " +
             "report and stays in the arrangement, which is what parties to " +
             "the Biological Weapons Convention have done since 1975-03-26. " +
             "Intelligence services take verification back from the " +
             "inspectorate by 2036, and the inspectorate's findings become " +
             "a negotiating chip.",
        long: "Laboratory directors in the state that still honours its " +
              "signed compute ceiling petition their government from the " +
              "2040s to match what the other side fields, and the annual " +
              "compliance report becomes their budget argument. Delegates " +
              "to the joint commission carry the same three unresolved " +
              "findings from 2043 to 2058, and the commission's staff " +
              "shrink toward the three-person scale the Biological Weapons " +
              "Convention has run at since 1975-03-26. Both governments " +
              "keep signing the renewal, because the text costs each of " +
              "them little.",
        far: "A signed compute ceiling stands in force in 2088 as law, with " +
             "declarations filed each spring and inspection lapsed long " +
             "before. Historians place its record among the 8 extreme " +
             "violation cases in the 1918 to 2015 series, where 7 of 8 " +
             "contributed to an outbreak of war, and argue over which side " +
             "that ranking flatters. Both principals built through the " +
             "ceiling, and their capability gap in 2088 traces to " +
             "industrial capacity and electricity supply, which each state " +
             "expanded on its own schedule.",
      },
  C8: { near: "Both governments stop frontier training short of systems that " +
             "run the AI research loop end to end, and each admits " +
             "inspectors to prove it. Employees of frontier laboratories " +
             "published a statement on 2026-07-28 asking the United States " +
             "government to back international tools for deliberately " +
             "pacing automated AI development, and it carried 1,378 " +
             "signatures when read on 2026-08-16, among them Dario Amodei, " +
             "Ilya Sutskever, Shane Legg, Jan Leike and Chris Olah. The " +
             "Wassenaar Arrangement sets the scale of the enforcement " +
             "problem, founded July 1996 with 42 participating states " +
             "deciding by consensus, where Russia has blocked control-list " +
             "updates from February 2022 and adding a single technology can " +
             "take three years.",
        mid: "Training runs stop below the capability where a system closes " +
             "the research loop, and the largest clusters in both states " +
             "turn to inference and to interpretability work on models " +
             "already built. Both governments police third countries by " +
             "2035, because a stop binding two capitals leaves capacity in " +
             "Abu Dhabi, Singapore and Dublin, and each ties accelerator " +
             "supply to matching the ceiling. Headcount in frontier " +
             "training falls while headcount in evaluation, audit and " +
             "deployment rises, and the 1,378 people who signed on " +
             "2026-07-28 keep their jobs under new titles.",
        long: "A joint review body clears each capability step before " +
              "either state funds it, and clearance requires an evidence " +
              "package the reviewing staff can reproduce themselves. " +
              "Graduate students entering the field in 2052 find the open " +
              "problems in interpretability, evaluation and control, " +
              "because the training frontier moves on a schedule two " +
              "governments set. Both economies grow on models built before " +
              "the stop, and the applications industry employs many times " +
              "the headcount the laboratories ever held.",
        far: "A pacing authority in 2075 sets the next allowed capability " +
             "step by a vote of both principals, and each vote becomes a " +
             "political event that parties campaign on. Consensus still " +
             "bites: one member stalled the schedule three times between " +
             "2061 and 2090, as Russia stalled Wassenaar control-list " +
             "updates among 42 participating states from February 2022. " +
             "Children born in 2065 grow up under a capability ceiling " +
             "their governments vote on, and systems built in the 2030s " +
             "remain in daily use.",
      },
  R1: { near: "A lab's own review board clears a frontier model for release, " +
             "and the published undertaking is the document a customer, a " +
             "journalist or a competitor holds it to. Twenty-six " +
             "organisations signed the European Union General-Purpose AI " +
             "Code of Practice in full from August 2025, xAI signed its " +
             "safety and security chapter alone, and about 190 " +
             "organisations had signed the separate transparency code for " +
             "AI-generated content by the end of July 2026. Procurement " +
             "officers at banks and hospital systems copy the signed " +
             "chapters into contract terms, so a broken undertaking " +
             "surfaces first as a cancelled order.",
        mid: "Underwriters price frontier deployment cover off which " +
             "chapters a developer accepted, and a partial signature " +
             "carries a quoted premium from 2034. The European Commission's " +
             "AI Office keeps publishing the signatory roster that opened " +
             "with twenty-six full signatures in August 2025, and a buyer's " +
             "counsel reads the current version before contracting. A " +
             "developer who leaves the roster loses enterprise accounts, " +
             "and the loss shows in the next quarterly filing.",
        long: "A release decision is taken in one room: a lab's internal " +
              "review board reads a safety case its own staff wrote and " +
              "signs it the same afternoon. An assurance auditor hired by a " +
              "hospital group spends a week in evaluation logs, works from " +
              "the chapter structure twenty-six companies accepted in " +
              "August 2025, and writes the memo that sets the buyer's " +
              "premium. A researcher who disagrees with a release holds two " +
              "instruments, a signature on a public letter and a " +
              "resignation.",
        far: "Frontier release authority sits with company boards, and the " +
             "standing public institution is a register of undertakings " +
             "that private assurance firms certify against. A hospital " +
             "group, a bank or a school district asks for one of those " +
             "certificates before buying, and the chapter structure twenty- " +
             "six companies accepted in August 2025 still organises what a " +
             "certificate covers. A bill putting a government signature " +
             "between a finished model and its customers reached a floor " +
             "vote in 2071 and failed there.",
      },
  R2: { near: "State legislatures write binding rules and the federal " +
             "executive sues to undo them: 45 states introduced 1,561 AI " +
             "bills in the first half of 2026 and enacted 109 AI laws with " +
             "28 data-center statutes, while a Justice Department task " +
             "force created by executive order on 2025-12-11 began " +
             "challenging those laws on 2026-01-10. Colorado moved its own " +
             "act from 2026-02-01 to 2026-06-30 and then replaced it on " +
             "2026-05-14 with a narrower statute starting 2027-01-01, with " +
             "federal lawyers in the case against it. A frontier " +
             "developer's compliance team keeps one calendar for each state " +
             "it ships into.",
        mid: "Compliance officers at frontier labs run a state-by-state " +
             "matrix, because a model that ships in Texas on Monday waits " +
             "on a Colorado filing until Thursday. Groups of states pool " +
             "their requirements to cut that cost, and an interstate " +
             "reciprocity compact for training disclosures takes its first " +
             "eight members in 2036, so a lab cleared in one member state " +
             "ships in the other seven. Federal lawyers keep litigating at " +
             "the pace the Justice Department set on 2026-01-10, winning " +
             "single provisions and leaving the field to state law.",
        long: "A founder in Ohio picks her state of incorporation by which " +
              "AI statute she can live under, and the firms that publish " +
              "the comparison charts bill by the state. State agencies " +
              "employ more AI examiners than the federal government does; " +
              "California's Office of Emergency Services, taking 15-day " +
              "incident reports since 2026-01-01, runs a field bureau by " +
              "2049. Release schedules list a different date for each of a " +
              "dozen states, and customers in the slow ones wait.",
        far: "A frontier release carries a schedule of publication dates, " +
             "one for each state, printed beside the model card. The count " +
             "of state AI statutes, which stood at 109 enactments in the " +
             "first half of 2026, runs into the thousands, and a " +
             "subscription service sells the weekly differences to " +
             "corporate counsel. Congress last debated a single national " +
             "standard in 2074, and the bill died in committee.",
      },
  R3: { near: "Congress installs one national release standard, and the 109 " +
             "state AI laws enacted in the first half of 2026 stop binding " +
             "frontier developers. A 269-page discussion draft circulated " +
             "in June 2026 as the Great American Artificial Intelligence " +
             "Act set the shape: states keep authority over how models are " +
             "used, and rules on how models are built move to Washington. " +
             "Five earlier federal preemptions that carried a replacement " +
             "standard, covering aviation, vehicle emissions, nutrition " +
             "labeling, GMO labeling and unsolicited email, each passed " +
             "within about three years of the first state law they " +
             "displaced.",
        mid: "One federal agency issues the release licence, and a " +
             "developer files once for all fifty states. Its examiners " +
             "inherit the incident machinery California opened on " +
             "2026-01-01, and the 15-day reporting clock becomes a national " +
             "deadline in federal rule by 2033. State attorneys general " +
             "still bring consumer-protection cases about how firms deploy " +
             "models, under statutes older than any AI law.",
        long: "A compliance lead at a mid-sized lab uploads one dossier to " +
              "one federal portal and waits for a docket number. Examiners " +
              "there work from the reporting duties California wrote on " +
              "2026-01-01 and Congress generalised in the 2030s, and the " +
              "agency holds roughly the staff a drug regulator holds. A " +
              "state legislator who wants a stricter rule writes to her " +
              "congressional delegation, and the bill she cannot pass at " +
              "home returns as an amendment in Washington.",
        far: "Trade associations and the agency's own alumni draft most " +
             "revisions to the national release standard, whose text has " +
             "been reopened four times since it displaced the 109 state AI " +
             "laws of 2026. The docket for the 2078 rewrite drew 41,000 " +
             "comments, and three of the four largest developers filed " +
             "through the same firm. State capitals legislate on AI in " +
             "schools, policing and procurement, where their authority " +
             "stands.",
      },
  R4: { near: "A cabinet department decides who may hold a model's " +
             "credentials: the Department of Commerce barred every non- " +
             "United States national from Claude Mythos 5 and Claude Fable " +
             "5 on 2026-06-12, Anthropic cut off all its customers that " +
             "day, and the order lifted on 2026-06-30. Four days before " +
             "that lifting, on 2026-06-26, the White House cyber and " +
             "science offices had OpenAI limit GPT-5.6 Sol, Terra and Luna " +
             "to government-approved partners. Staffing sets how hard such " +
             "an order lands, and the Center for AI Standards and " +
             "Innovation lost three directors in the six months to July " +
             "2026.",
        mid: "Model launches enter a queue at a federal review office, and " +
             "a developer sets its launch date from the clearance it " +
             "receives. Every engineer holding weight access carries a " +
             "personnel clearance, and the vetting backlog reaches nine " +
             "months in 2037, so labs recruit against it. The office's own " +
             "procedures cite the file from June 2026, when one department " +
             "cut two Anthropic models off from non-nationals on the 12th " +
             "and restored them on the 30th.",
        long: "A postdoctoral researcher on a foreign passport waits for a " +
              "sponsorship letter before she opens a session on the newest " +
              "model, and her university's export office files it for her. " +
              "Reviewers at the approval office read a launch dossier the " +
              "way a licensing examiner reads one, and the office publishes " +
              "a median decision time of 74 days in 2053. A startup that " +
              "ships ahead of its clearance loses its accelerator contract, " +
              "because the cloud provider checks the register before it " +
              "schedules capacity.",
        far: "An approval office staffed by career civil servants signs " +
             "every frontier release, and the signature carries the name of " +
             "the official answerable for it. Nationality conditions of the " +
             "kind the Department of Commerce imposed on two Anthropic " +
             "models on 2026-06-12 sit in standing regulation, and a " +
             "buyer's passport decides which tier of model she may license. " +
             "Allied governments run mirrored offices and recognise one " +
             "another's clearances under a treaty last renegotiated in " +
             "2081.",
      },
  R5: { near: "Regulators collect incident reports on a clock and fine what " +
             "they find: European serious-incident duties applied from " +
             "2026-08-02, with the Commission able to fine a general- " +
             "purpose model provider up to 15 million euro or 3% of " +
             "worldwide turnover, and California has taken 15-day reports " +
             "since 2026-01-01 with penalties up to $1 million per " +
             "violation. Illinois adds 72-hour reporting and an annual " +
             "independent audit of any developer above $500 million in " +
             "revenue from 2027-01-01. A frontier lab staffs an incident " +
             "desk that answers to three regulators before it answers to a " +
             "customer.",
        mid: "An audit trade grows around the annual third-party review " +
             "Illinois required from 2027-01-01, and four accredited firms " +
             "sign most frontier opinions by 2035. A European regulator " +
             "collects a fine of 3% of worldwide turnover from a general- " +
             "purpose model provider in 2034, the first penalty at that " +
             "ceiling. Developers time releases to their audit windows, and " +
             "an adverse opinion pushes a launch by a quarter.",
        long: "An incident-desk engineer at a frontier lab writes the " +
              "72-hour filing herself, because the clock Illinois set on " +
              "2027-01-01 runs from the moment of discovery. A state " +
              "analyst reading those filings keeps a docket of open " +
              "investigations, and California's Office of Emergency " +
              "Services has published an annual summary of them every year " +
              "since 2027-01-01. An adverse audit opinion moves a " +
              "developer's share price, and the larger firms carry " +
              "insurance against one.",
        far: "Auditors licensed to sign a frontier opinion sit a " +
             "professional examination, and the roll of them is public. " +
             "Incident registers opened on 2026-08-02 in Europe and " +
             "2026-01-01 in California hold every filing made since, and " +
             "epidemiologists mine them for patterns across models and " +
             "years. A fine against a frontier developer is an ordinary " +
             "docket item, and the 2069 penalty against one large provider " +
             "came to 3% of its worldwide turnover.",
      },
  R6: { near: "Legislators pass a frontier statute and then move its start " +
             "date: the European Union's Digital Omnibus entered into force " +
             "on 2026-07-27 and pushed stand-alone high-risk duties from " +
             "2026-08-02 to 2027-12-02, with duties on AI inside regulated " +
             "products going to 2028-08-02. Colorado did it twice, " +
             "postponing its 2024 act from 2026-02-01 to 2026-06-30 and " +
             "then replacing it on 2026-05-14 with a narrower statute " +
             "starting 2027-01-01. The Council of Europe's framework " +
             "convention, opened for signature on 2024-09-05, held 20 " +
             "signatures and a single ratification in August 2026.",
        mid: "Each compliance date arrives with a review clause attached, " +
             "and the reviewer recommends a further extension: the high- " +
             "risk duties moved to 2027-12-02 by the Digital Omnibus of " +
             "2026-07-27 slip twice more before any conformity file is " +
             "opened. Consultancies sell deadline calendars, and their " +
             "subscribers are general counsels budgeting staff against " +
             "dates that keep moving. Transparency labelling, which applied " +
             "from 2026-08-02 on schedule, is the duty a user can see on " +
             "the screen.",
        long: "A ministry official responsible for a frontier statute " +
              "administers a law whose main obligations begin after she " +
              "retires, and her office numbers a dozen people. Firms " +
              "publish the transparency labels that applied from 2026-08-02 " +
              "and file the paperwork of the deferred chapters. A " +
              "journalist writing about a deployed system quotes the " +
              "statute, then quotes the commencement order dating its " +
              "duties to a future year.",
        far: "Statute books carry frontier AI chapters whose commencement " +
             "orders have been reissued many times, and the working rules a " +
             "developer follows are contract terms written by its largest " +
             "customers. The Council of Europe convention opened for " +
             "signature on 2024-09-05 reached its twentieth ratification in " +
             "2063, and its monitoring committee meets twice a year. " +
             "National archives hold the drafting files, and historians use " +
             "them to date when each duty was written and when it first " +
             "bound anyone.",
      },
  D1: { near: "Clients who commissioned 240 freelance projects worth " +
             "$143,991 graded the delivered files themselves, and the " +
             "strongest model cleared 15.8% of them on 2026-07-01 against " +
             "2.5% in October 2025. Automated scoring of those same files " +
             "returned roughly three times the client-accepted share for " +
             "GPT-5.5, so one deliverable passes a script and fails the " +
             "person paying for it. Sixteen experienced developers working " +
             "246 tasks in a trial published 2025-07-10 took 19% longer " +
             "with early-2025 tooling while reporting themselves 20% " +
             "faster.",
        mid: "Purchasing officers write acceptance clauses that release " +
             "payment on a signed deliverable, extending the per-resolution " +
             "terms support vendors set in April 2026 at $0.50 to $2.00 per " +
             "resolved conversation. Marketplace operators post an " +
             "acceptance rate beside every seller's price, and a machine- " +
             "only seller's rate stands in single digits in 2038 while " +
             "published task horizons keep doubling. Agencies that staff " +
             "the finishing work bill by the accepted job and carry rework " +
             "at their own cost.",
        long: "A remote worker opens each commission with a machine draft " +
              "already in the file and earns on the part a client signs: " +
              "the judgment, the correction, the delivered result. " +
              "Contracts name that worker, and payment releases on " +
              "acceptance, the test 240 commissioned projects were graded " +
              "under from October 2025. By 2050, roughly nine in ten " +
              "commissioned projects reach a buyer through a person's " +
              "hands.",
        far: "Purchase orders in 2075 name a signatory who answers for the " +
             "result, and a machine draft enters the job as material that " +
             "signatory edits. Trade bodies certify the finishers, and an " +
             "apprenticeship runs three to four years before a name goes on " +
             "a delivery. Procurement scores a vendor on delivered-and- " +
             "accepted work, the test 240 client-graded commissions carried " +
             "from October 2025, and the machine-complete share held under " +
             "a tenth through 2035-12-31.",
      },
  D2: { near: "Frontier systems completed about 12 hours of expert-timed " +
             "work at a 50% success rate on 2026-05-19, and 3 to 4 hours " +
             "once the bar rose to 80%, a ratio near 3.5. Buyers spend " +
             "inside that band on draft code, marketing copy and back- " +
             "office reconciliation, each cheap to check and cheap to redo. " +
             "Underwriters drew the outer line on 2026-01-01, when " +
             "generative-AI exclusion endorsements CG 40 47, CG 40 48 and " +
             "CG 35 08 took effect on commercial general liability " +
             "policies.",
        mid: "Underwriters decide which tasks a firm may ship unattended, " +
             "since a claim pays where a person reviewed the output that " +
             "caused the loss, and exclusions covering autonomous agents " +
             "were in drafting by 2026-07-10. State licensing boards and " +
             "hospital credentialing committees hold the signature on a " +
             "person across the 22% of United States jobs that require a " +
             "license, so diagnosis and legal advice carry a human name " +
             "over machine drafting. A published limitation of 2026-01-22 " +
             "put 98% success as the bar for reliability-critical work, and " +
             "that number is what an underwriter prices.",
        long: "A claims examiner, a coder or a scheduler spends the shift " +
              "checking machine output against a source and marking " +
              "exceptions, and the wage attaches to the check. Care and " +
              "legal advice reach a patient or a client under a licensed " +
              "signature, because the liability forms in force since " +
              "2026-01-01 pay out where a person reviewed the work. Between " +
              "a tenth and a third of paid work arrived machine-complete by " +
              "2035-12-31, and employers in 2052 count a reviewer's shift " +
              "in signed items.",
        far: "Two tiers of paid work stand in 2080: work a buyer accepts " +
             "against a published success rate, and work a licensed person " +
             "signs. Underwriters and licensing boards run the boundary, " +
             "working from exclusion endorsements in continuous use since " +
             "2026-01-01 and from per-domain success rates each profession " +
             "publishes. Tasks needing 98% success, the bar recorded on " +
             "2026-01-22, keep a person's name attached to every delivery.",
      },
  D3: { near: "Engineers at a frontier lab merged eight times as much code " +
             "per day in the second quarter of 2026 as in 2024, with " +
             "machine authorship above 80% of production code in May 2026 " +
             "and the headcount steady. The same engineers ship more, and " +
             "their hours move to writing specifications, reviewing diffs " +
             "and integrating changes. A national survey in 2026 found 79% " +
             "of Americans expecting AI to cut United States jobs, against " +
             "73% in 2025, while the payroll aggregate carried a change too " +
             "small to detect.",
        mid: "Employers rewrite job descriptions around specification and " +
             "review, and the federal occupational classification that " +
             "enters use in 2028 carries codes for the reviewing roles. " +
             "Accounting, logistics scheduling and clinical documentation " +
             "reach the shape software reached in May 2026, with machine " +
             "authorship above 80% and headcount steady, each running " +
             "output per worker several times its 2024 level. Community " +
             "colleges and employer academies run the retraining, and wage " +
             "growth concentrates on the people who hold the specification.",
        long: "An accounts clerk, a dispatcher or a clinical documentation " +
              "specialist sets the task, reads the result and signs it, " +
              "with drafting sitting between those acts as machine work. " +
              "Unions and employers bargain over how many signed reviews " +
              "fill a shift, the way piece rates were bargained in the " +
              "factories of the 1920s. Between a third and a half of paid " +
              "work arrived machine-complete by 2035-12-31, and headcount " +
              "in each absorbed sector sits in 2055 near where it started.",
        far: "Employment in 2085 stands near its 2020s share of the adult " +
             "population, and a job consists of specification, judgment and " +
             "answerability for a result. The same employers, unions and " +
             "licensing bodies run it, arguing over review counts and pay " +
             "bands. Buyers stopped purchasing a first draft on its own " +
             "around 2055, and the 79% of Americans who in 2026 expected AI " +
             "to cut United States jobs described a change the payroll " +
             "count recorded as steady headcount carrying new duties.",
      },
  D4: { near: "Client-accepted delivery across 240 commissioned projects " +
             "rose from 2.5% in October 2025 to 15.8% on 2026-07-01, a " +
             "factor of 6.3 in eight months, and holding that rate reaches " +
             "half of those projects before 2029. Employers cut when orders " +
             "fall: across three United States recessions in thirty years, " +
             "88% of routine-occupation job losses landed inside a twelve- " +
             "month window around the downturn, and those occupations came " +
             "back smaller. Payroll records for workers aged 22 to 25 in " +
             "the most exposed occupations showed a 13% shortfall against " +
             "their less-exposed peers, widening to 19% by August 2026.",
        mid: "State unemployment agencies process claims from occupations " +
             "their own series had counted as stable, and the trust funds " +
             "borrow from the federal government to keep the checks moving. " +
             "Employers of 100 or more workers file the 60-day notices the " +
             "1988 layoff-warning statute requires, and those filings " +
             "arrive in clusters from single firms inside a 24-month " +
             "window, matching the 88% concentration three earlier " +
             "recessions recorded. Congress sizes an income programme " +
             "against the claim count once the filings stop.",
        long: "A household's income in 2048 arrives as wages from care, " +
              "construction, trades and the on-site work of running " +
              "physical plant, plus a payment the agencies that once ran " +
              "unemployment insurance administer. Entry into an occupation " +
              "is the scarce thing, spreading across the occupational map " +
              "the 13% entry-level shortfall that payroll records showed in " +
              "2025 for workers aged 22 to 25. More than half of paid work " +
              "arrived machine-complete by 2035-12-31, so a hiring " +
              "interview turns on who answers for a result.",
        far: "A standing income payment holds a permanent budget line in " +
             "2090, administered by state agencies with eligibility " +
             "following residence. Wages come from work performed on site " +
             "and answered for in person: care, trades, building, and " +
             "running physical plant, where care work alone carried 765,800 " +
             "openings a year across the 2024 to 2034 projections. " +
             "Retraining programmes promising reentry into displaced " +
             "occupations closed, against a record of routine occupations " +
             "returning smaller after every downturn since the 1990s.",
      },
  S1: { near: "Alphabet, Amazon, Meta and Microsoft guide to roughly $725 " +
             "billion of combined capital expenditure for 2026, against " +
             "roughly $410 billion in 2025, with Meta raising guidance " +
             "twice. Nvidia has reserved 800,000 to 850,000 wafers of " +
             "TSMC's CoWoS packaging for 2026, more than half the year's " +
             "output, so a rival's accelerator order queues behind one " +
             "purchase agreement. Epoch AI measures training cost for the " +
             "largest models doubling about every 8 months, which puts each " +
             "frontier programme back in front of a board every second " +
             "quarter.",
        mid: "Audit committees at four American cloud companies set the " +
             "depreciation schedules that decide when an accelerator leaves " +
             "service, and those schedules carry the compute ceiling " +
             "through 2035. A laboratory outside the four writes to an " +
             "internal capacity committee and rents a slice priced against " +
             "the same capital line that reached roughly $725 billion in " +
             "2026. Epoch AI's measured 4x to 5x annual growth in frontier " +
             "training compute runs inside a count of campus operators " +
             "still in single digits in 2038.",
        long: "A single campus draws the 4 to 16 gigawatts Epoch AI " +
              "projected in 2026 for the largest training runs of 2030, and " +
              "county assessors bill it as the largest taxable structure in " +
              "their jurisdiction. Shift technicians swap accelerator trays " +
              "and cooling manifolds on the timetable the owner's " +
              "depreciation policy sets, and they negotiate their contracts " +
              "with the campus operator. A researcher at a state university " +
              "in 2048 reaches frontier hardware by winning hours from an " +
              "allocation committee the owner staffs.",
        far: "Compute above the frontier line in 2075 ships to a handful of " +
             "addresses holding their own substations, water rights and " +
             "generation contracts. Staff employed by the owners and " +
             "contracted utility crews operate those sites, and an outside " +
             "allocation is metered and billed by the hour on terms the " +
             "owner writes. Federal recipient lists, which Commerce began " +
             "issuing on 2026-06-26 to roughly 100 companies and agencies, " +
             "still decide which addresses qualify in 2081.",
      },
  S2: { near: "Khazna Data Centres completes the first 200 megawatts of a " +
             "1-gigawatt Abu Dhabi cluster in the third quarter of 2026, " +
             "inside a 5-gigawatt campus that OpenAI and Oracle operate. " +
             "The European Commission opened bidding on 2026-07-30 for " +
             "seven gigafactories costing \u20ac3 to \u20ac5 billion each, every one " +
             "specified to hold at least 100,000 accelerators, with awards " +
             "due in early 2027. Washington moved the United Arab Emirates " +
             "into Country Group A:5 on 2026-07-10 and named G42, Core42 " +
             "and eight American companies as approved end users.",
        mid: "Ministers of industry in a dozen countries hold the training " +
             "slots their national programmes bought, and a researcher in " +
             "Lisbon or Warsaw books hours from a state-owned operator. " +
             "Epoch AI projected in 2026 that models trained above 1e26 " +
             "FLOP would rise from about 10 that year to more than 200 by " +
             "2030, and by 2035 those runs sit on sovereign clouds across " +
             "four continents. Saudi Arabia's HUMAIN, capped at 35,000 " +
             "Blackwell accelerators under the authorisation of 2025-11-19, " +
             "negotiates that ceiling upward at each renewal.",
        long: "A machine-learning group at a university in S\u00e3o Paulo trains " +
              "at frontier scale on hardware its own government financed, " +
              "and the committee awarding the hours sits in the capital. " +
              "Operators in twenty jurisdictions sell frontier capacity by " +
              "2052, each running the substations and cooling plants its " +
              "host state permitted. Export approvals of the kind " +
              "Washington issued to G42 and Core42 on 2026-07-10 have " +
              "become routine paperwork a procurement officer files.",
        far: "Clusters in Iceland, Chile, Kenya and the Gulf serve " +
             "customers on other continents by 2078, sited where " +
             "electricity is cheapest and coolant runs abundant. A " +
             "biologist in Nairobi buys frontier-scale hours from an " +
             "operator two hundred kilometres away, billed in her own " +
             "currency by a company her pension fund part-owns. The " +
             "5-gigawatt campus Abu Dhabi began in 2026 is one site among " +
             "dozens by 2085, and each operator writes terms only for its " +
             "own customers.",
      },
  S3: { near: "Gallup surveyed 1,000 United States adults between 2 and 18 " +
             "March 2026 and found 71% opposed to a data center in their " +
             "area, 48% of them strongly. Data Center Watch counted at " +
             "least 75 projects worth $130 billion delayed or blocked in " +
             "the first quarter of 2026 and at least 63 local moratorium " +
             "actions passed, and Georgia's HB 1012 of January 2026 " +
             "proposes a statewide construction ban. A developer argues for " +
             "rezoning in front of county commissioners who face voters at " +
             "the next election.",
        mid: "Lawrence Berkeley National Laboratory found that the median " +
             "project reaching commercial operation in 2025 had spent more " +
             "than five years in an interconnection queue, and that queue " +
             "sets the training schedule. GE Vernova's gas-turbine backlog " +
             "reached 116 gigawatts by the second quarter of 2026 against " +
             "roughly 20 gigawatts of annual output, so a campus ordering " +
             "generation in 2033 takes delivery near 2038. Ratepayers in " +
             "the host state read the cost on a monthly bill and vote for " +
             "the commissioners who approve the tariff.",
        long: "A county commission in 2049 votes on a rezoning application " +
              "after residents speak at the hearing, and that vote decides " +
              "whether a frontier training run happens in the state. " +
              "Computing passes the 12% share of national electricity that " +
              "Lawrence Berkeley National Laboratory projected in 2024 for " +
              "2028, and the serving utility builds transmission every " +
              "other customer pays for. Line workers, substation crews and " +
              "water engineers hold the schedule the model builders wait " +
              "on.",
        far: "Siting law written between 2031 and 2049 governs where " +
             "computing draws power in 2072, and an application moves " +
             "through the hearings a quarry or a refinery faces. A siting " +
             "board argues over the 4 to 16 gigawatts Epoch AI projected in " +
             "2026 for one training run of 2030, by then the standard draw " +
             "of a single campus. Grid operators in 2088 curtail computing " +
             "load under interruptible tariffs first written for aluminium " +
             "smelters, and customers watch their jobs pause.",
      },
  S4: { near: "A Bureau of Industry and Security rule of 2026-01-13 cleared " +
             "roughly ten Chinese firms to buy Nvidia H200 parts at up to " +
             "75,000 chips each under a 25% export levy, against Chinese " +
             "orders for 2026 above 2 million units. Licensing officers in " +
             "Washington read each application, and a Shanghai laboratory " +
             "learns its training budget from a decision letter. Commerce " +
             "announced close to $420 million in smuggling penalties and " +
             "forfeitures in the twelve months to early 2026, after " +
             "acknowledging in May 2026 that Blackwell parts had reached " +
             "Chinese firms for close to a year.",
        mid: "Huawei and SMIC supply the accelerators Chinese laboratories " +
             "train on by the mid-2030s, after SMIC's advanced-node " +
             "capacity moved from 45,000 wafers a month at the end of 2025 " +
             "toward 80,000 in 2027. Customs officers, freight forwarders " +
             "and compliance staff at three American firms handle the " +
             "paperwork that decides how large a model a buyer can train. A " +
             "researcher in Hangzhou in 2036 works on hardware her " +
             "industrial ministry allocated, and her counterpart in Texas " +
             "works on hardware a licence officer cleared for export.",
        long: "Two toolchains, two instruction sets and two software stacks " +
              "have diverged by 2050, and an engineer trained on one " +
              "retrains to work the other. A student choosing a doctoral " +
              "programme in 2047 chooses which bloc's accelerators she will " +
              "use for a career, and journals ask authors to state which " +
              "hardware produced a result. The eight-month gap a United " +
              "States government evaluation measured in 2026 between " +
              "DeepSeek V4 Pro and the leading American model widens or " +
              "narrows at each licensing decision.",
        far: "Export licensing offices in Washington and Beijing process " +
             "applications in 2069 under control lists both governments " +
             "have revised at least quarterly since the rule of 2026-01-13. " +
             "Firms in Singapore, Abu Dhabi and Dublin earn their fees " +
             "certifying whose chips sit inside a customer's rack. A " +
             "physicist in Seoul runs her experiment twice in 2094, once on " +
             "each bloc's hardware, because her reviewers require both.",
      },
  S5: { near: "Every CoWoS-class packaging line running in 2026 and 2027 " +
             "sits in Taiwan, which holds about 84% of that capacity and " +
             "all 3-nanometre logic production. Amkor's Peoria plant, which " +
             "broke ground on 2025-10-06, reaches volume production in " +
             "early 2028, and TSMC's Arizona P6 begins tool installation at " +
             "the end of 2027. An interruption of a month or longer runs " +
             "about 3% a year across the record of accident, disaster and " +
             "export action, and twelve months is the fastest a line " +
             "requalifies.",
        mid: "Fab managers, shift crews and tool vendors in Hsinchu and " +
             "Tainan restart lines after an outage, and a frontier " +
             "programme in California waits on their qualification runs. " +
             "Amkor's greenfield plant took 27 months from groundbreaking " +
             "on 2025-10-06 to volume production in early 2028, so an " +
             "outage beginning in 2034 pushes schedules into 2036. Insurers " +
             "who priced Taiwan seismic risk from four recorded " +
             "earthquakes, the largest of which closed as a NT$4.3 billion " +
             "net gain in the second quarter of 2026, reprice the whole " +
             "sector.",
        long: "Governments that skipped building their own packaging lines " +
              "treat accelerator inventory as a strategic reserve by 2046, " +
              "and a defence ministry holds racks the way it once held oil. " +
              "Purchasing managers qualify three suppliers on three " +
              "continents for every part, and a design that only one site " +
              "can package fails procurement review. A researcher in 2053 " +
              "waits eleven months for hardware her grant funded, because " +
              "the queue ahead of her is national.",
        far: "Redundancy built between 2035 and 2060 leaves an outage at " +
             "any single site in 2074 taking under a fifth of world " +
             "capacity, and schedules slip by weeks. Trade ministries hold " +
             "standing agreements to divert capacity to each other's " +
             "programmes, signed after a first interruption ran past twelve " +
             "months. A packaging engineer in 2091 works at whichever of " +
             "nine qualified sites her employer contracted, and her " +
             "training transfers between all of them.",
      },
  P1: { near: "Gallup found 39% of Americans calling AI more harmful than " +
             "good in 2026, up from 31% in 2025, and 27% still trusting " +
             "businesses to use it responsibly. Complaints about model " +
             "output reach customer-support desks and the consumer " +
             "divisions of state attorneys general, where clerks log them " +
             "as product defects. Candidates campaign on grocery prices and " +
             "rent, and Pew found 33% of 3,488 adults surveyed from 22 to " +
             "28 June 2026 unsure which country leads AI development.",
        mid: "State public utility commissions decide what a data centre " +
             "pays for power and how much of a substation's cost reaches a " +
             "household bill, and ratepayer groups file in those dockets. " +
             "School boards write classroom rules on model use, state " +
             "licensing boards attach model use to professional discipline, " +
             "and the Federal Trade Commission takes model-output " +
             "complaints under its deceptive-practices authority. Gallup's " +
             "harm-over-good reading of 39% in 2026 holds within a few " +
             "points through the 2030s while legislators quote adoption " +
             "counts at the same hearings.",
        long: "A person meets AI as a line on a utility bill, a benefits " +
              "determination drafted by a model and signed by a county " +
              "caseworker, and a school aide checking a pupil's work " +
              "against a model's answer. Ombuds offices inside state " +
              "agencies hear appeals of those determinations, and the " +
              "clerks who staff them read model transcripts as evidence. " +
              "Pew's June 2026 finding that 33% of adults were unsure which " +
              "country leads AI development holds near that level, and a " +
              "contracting officer keeps the vendor's name in a procurement " +
              "file.",
        far: "Model provision sits under the statutes that govern water and " +
             "electricity supply, so state commissions license the " +
             "providers, approve the tariffs and hear complaints on a " +
             "docket. A rate analyst tests a provider's cost filing, a " +
             "caseworker checks the output on a benefits form, and the " +
             "frontier labs of the 2020s appear in those filings as " +
             "regulated subsidiaries. Standing protest over AI ended in the " +
             "2030s, and Gallup's 2026 question, which found 39% calling " +
             "the technology more harmful than good, survives inside a " +
             "general technology battery beside broadband and streaming.",
      },
  P2: { near: "Gallup found 79% of Americans expecting AI to reduce United " +
             "States jobs in 2026, up from 73% in 2025, and 27% trusting " +
             "businesses to use it responsibly, down from 31%. State " +
             "legislatures enacted 109 AI laws by 1 July 2026 out of 1,561 " +
             "bills, against 121 by the same date in 2025, so enactment " +
             "fell while disapproval rose. Leading the Future, a network of " +
             "pro-AI political committees, reported $75.79 million raised " +
             "and $44.76 million spent by 30 June 2026 across 40 House and " +
             "Senate candidates.",
        mid: "Survey houses keep Gallup's 2026 wording in the field so the " +
             "series stays comparable, and the share calling AI more " +
             "harmful than good sits in the high thirties through the " +
             "2030s. Congressional committees call hearings, quote that " +
             "share in an opening statement, and adjourn while an industry " +
             "trade association drafts the bill that moves. Households " +
             "renew model subscriptions on annual billing cycles in the " +
             "same years they tell interviewers the technology costs them " +
             "work.",
        long: "A subscriber pays a monthly charge for a service she rates " +
              "poorly whenever an interviewer reaches her, and both facts " +
              "sit in one household's records. Sociologists publish on the " +
              "distance between stated opinion and purchase, working from " +
              "the series Gallup opened when it read 39% harm-over-good in " +
              "2026. Boycott campaigns collect signatures and close, and " +
              "quarterly revenue at the model companies keeps its slope " +
              "through each one.",
        far: "Brand-tracking firms sell companies the dislike reading on a " +
             "quarterly subscription, and communications departments carry " +
             "it as a budget line beside insurance. Regulators quote that " +
             "reading, which Gallup first put at 39% in 2026, in the " +
             "preamble to rules that leave deployment terms standing. " +
             "People speak of the model companies the way they speak of " +
             "banks and insurers, and the subject sits out of ballot " +
             "campaigns.",
      },
  P3: { near: "Local groups blocked or delayed 75 data-centre projects worth " +
             "$130 billion between January and March 2026, and 833 such " +
             "groups were active across 49 states by the end of that " +
             "quarter. Trackers counted 219 local moratoriums by 4 August " +
             "2026, of which 183 stood and 17 had failed. Voters in Festus, " +
             "Missouri recalled every incumbent city council member over a " +
             "proposed $6 billion campus, and New York's legislature passed " +
             "a permit pause 44-16 in the Senate and 102-39 in the Assembly " +
             "on 4 June 2026.",
        mid: "County boards of supervisors and state siting boards decide " +
             "where a campus goes, and public utility commissions set the " +
             "large-load tariff that fixes how much of a substation reaches " +
             "a household bill. Operators sign host agreements carrying " +
             "decibel limits at the property line, water-draw caps and " +
             "payments in lieu of taxes, and a county that declines those " +
             "terms watches the project move next door. The 28 data-centre " +
             "statutes states enacted in the first half of 2026 grow into a " +
             "model code that legislatures copy, with setbacks and megawatt " +
             "thresholds written as numbers.",
        long: "A hearing notice arrives in the mail carrying a parcel " +
              "number and a date, and a neighbour who objects files a " +
              "written comment with the county planning commission. " +
              "Acoustic consultants take readings at the property line, " +
              "hydrologists file the water-draw study, and a ratepayer " +
              "advocate argues at the utility commission over which " +
              "customer class carries the interconnection cost. County " +
              "clerks handle recall petitions over siting votes as routine " +
              "work, a practice the Festus, Missouri recall of 2026 opened.",
        far: "Compute sits in counties that wrote their own permit terms " +
             "and collected the payments, so assessors carry the campuses " +
             "on the tax roll and inspectors measure sound and water draw " +
             "against the permit. Utility commissions bill data centres as " +
             "their own customer class, and a household bill shows the " +
             "separation as a line. Land assembly beside residential zoning " +
             "ahead of a permit ended in the 2030s, and the 75 projects " +
             "blocked or delayed in the first quarter of 2026 opened a " +
             "permitting regime as detailed as the one around quarries and " +
             "landfills.",
      },
  P4: { near: "Pew surveyed 3,488 United States adults from 22 to 28 June " +
             "2026 and found 54% of Republicans and 34% of Democrats " +
             "calling American AI leadership extremely or very important, a " +
             "20-point gap. The same electorates run together on federal " +
             "preemption, which 57% opposed against 19% in favour, " +
             "including 43% of Trump voters and 70% of Harris voters. A " +
             "statement at pacingthefrontier.com carried 1,378 frontier- " +
             "company employee signatures when read on 16 August 2026, so a " +
             "restraint constituency sits inside the industry as well as " +
             "outside it.",
        mid: "Primary electorates in both parties settle where their " +
             "candidates stand on AI, so neighbouring states send " +
             "delegations that vote opposite ways on the same bill. State " +
             "attorneys general sue over each other's AI statutes, a " +
             "Republican governor signs a siting moratorium while a " +
             "Republican senator votes for federal preemption, and " +
             "committee tallies split inside each caucus. Ratification of a " +
             "binding AI treaty needs 67 Senate votes, and this " +
             "distribution withholds them through the 2030s.",
        long: "A worker reads an employer's model-deployment policy before " +
              "accepting the job, and recruiters publish that policy beside " +
              "the salary band. Firms incorporate where the AI statute " +
              "suits them, so two neighbouring states enforce opposite " +
              "rules on one product and a single compliance department runs " +
              "both. Employee restraint groups bargain over deployment " +
              "inside the companies that build the systems, holding the " +
              "form the 1,378 signatures of July 2026 took.",
        far: "A voter's stance on AI names their coalition the way tariffs " +
             "and immigration once named coalitions, and it appears on the " +
             "registration card. Firms, workers and universities sort " +
             "across that line, so a graduate picks a state by its statute " +
             "and a hospital picks a vendor by its licence. Binding " +
             "international AI agreements keep failing the 67-vote " +
             "threshold the United States Senate has applied to treaties " +
             "since 1789, and their obligations arrive through state law.",
      },
  P5: { near: "Candidates in both parties cut advertisements on their record " +
             "against data centres during the 2026 primaries, and Gallup's " +
             "survey of 1,000 adults from 2 to 18 March 2026 found 71% " +
             "opposed to one in their area against 53% opposing a local " +
             "nuclear plant. Representatives Greg Casar and Doris Matsui " +
             "demanded sworn testimony from Sam Altman and Dario Amodei in " +
             "letters reported on 10 August 2026. Unions wrote AI limits " +
             "into contracts, with provisions reaching agreements that " +
             "cover 4.2 million workers by 2026 and a longshoremen's clause " +
             "prohibiting fully automated terminals.",
        mid: "A governing coalition writes restriction into statute, so a " +
             "training run above a megawatt threshold needs a federal " +
             "licence, a form New York opened in 2026 by pausing permits " +
             "for data centres drawing 20 megawatts or more. Customs " +
             "officers check accelerator shipments against the licence " +
             "register, and procurement rules bar unlicensed models from " +
             "federal and state contracts. The 71% who told Gallup in March " +
             "2026 they opposed a local data centre supply the majority " +
             "that passes those statutes.",
        long: "A compliance officer files a quarterly return listing every " +
              "model her employer runs and the hardware behind each one, " +
              "and an inspector reads the meters against the licensed " +
              "figure. Universities graduate students into AI-compliance " +
              "work, a profession the restriction statutes of the 2030s " +
              "created. Campaigns to loosen the licence run in state and " +
              "national elections, and the coalition that wrote those " +
              "statutes holds the votes to keep them.",
        far: "Companies renew operating licences for model services the way " +
             "broadcasters renew theirs, on a fixed calendar before a " +
             "commission that can refuse. Historians date a regulated era " +
             "from the election that wrote the licensing law, and school " +
             "curricula teach the 71% Gallup measured in March 2026 as its " +
             "cause. Repeal campaigns qualify for the ballot and lose, and " +
             "the licence register runs to thousands of entries.",
      },
  E1: { near: "Alphabet, Amazon, Meta and Microsoft guided to roughly $725 " +
             "billion of combined capital spending for 2026, about 77% " +
             "above the $410 billion they laid out in 2025. Their finance " +
             "committees release each tranche against the previous " +
             "quarter's bookings, and revenue growing five to seven times a " +
             "year clears the bill. PJM, which runs the grid across " +
             "thirteen states, cleared its capacity auction of 2025-07-22 " +
             "at the cap of $329.17 per megawatt-day in every zone, and the " +
             "campuses signed load contracts at that price.",
        mid: "State utility commissions grant hyperscaler campuses firm- " +
             "load status ahead of other industrial applicants, because " +
             "those campuses are the largest single customers on their " +
             "systems. Data centres drew 4.4% of United States electricity " +
             "in 2023 and the Department of Energy put them at 6.7% to 12% " +
             "by 2028, so operators past that mark commission their own " +
             "generation and sell the surplus back. County assessors write " +
             "school budgets around the property tax one campus pays, and " +
             "transmission planners route new lines to announced halls.",
        long: "A procurement officer at a mid-sized manufacturer signs one " +
              "price list a year, and her engineers draw frontier " +
              "capability by the token from one of four metered operators. " +
              "The trades hiring hardest are substation fitters, chilled- " +
              "water technicians and high-voltage jointers, trained in " +
              "apprenticeship schemes those operators run themselves. " +
              "Counties that permitted campuses in the round when Alphabet " +
              "alone guided $175 to $205 billion for 2026 now tax halls " +
              "that have been refitted twice.",
        far: "Compute carrying the workloads of 2075 was financed in one " +
             "unbroken expansion, and the firms that guided roughly $725 " +
             "billion for 2026 still hold the deeds to the oldest halls. " +
             "Their own high-voltage crews and water engineers refit each " +
             "building in place as racks age out, so a hall keeps its " +
             "address while its contents turn over on a rolling schedule. " +
             "Training runs are paid out of operating revenue, which " +
             "settled the argument that ran from 2025 to 2034 over whether " +
             "the spending would ever be repaid.",
      },
  E2: { near: "Output at the quality of a 2022 frontier model sold near $20 " +
             "per million tokens in late 2022 and near $0.40 in early 2026, " +
             "a fall of about forty times a year measured on PhD-level " +
             "science questions. Buyers win the repricing at every renewal, " +
             "so a seller holds revenue level by moving forty times the " +
             "volume it moved the year before. Amazon cut the assumed " +
             "working life of a subset of its servers from six years to " +
             "five in January 2025, which took about $700 million off that " +
             "year's operating income before any price cut reached the " +
             "contracts.",
        mid: "Cloud sellers write committed-volume contracts to lock buyers " +
             "in ahead of the next price cut, and each new hall is " +
             "underwritten by traffic that has yet to be booked. Inference " +
             "took a third of all AI compute in 2023, half in 2025 and " +
             "about two-thirds in 2026, so the estate is built around " +
             "serving requests. Model developers earn a commodity margin on " +
             "that traffic while chip vendors and power suppliers collect " +
             "the rest, the split United States airlines lived through as " +
             "real yield per passenger-mile fell 2.2% a year from 1978 to " +
             "1988 and traffic grew 6.1%.",
        long: "A thirty-person firm commands more model capability than a " +
              "national laboratory could buy in 2026, when a million tokens " +
              "of frontier-grade output had already fallen from $20 in late " +
              "2022 to $0.40. Contract engineers wire models into billing " +
              "systems, claims files and shift scheduling, hired by the " +
              "hour through brokers, and that integration work is what " +
              "pays. Operators earn on how full the serving halls run, and " +
              "each buyer resets the price at renewal.",
        far: "Output priced near $0.40 per million tokens in early 2026 " +
             "reads as a rounding line on a 2072 utility bill, and " +
             "capability is sold by the meter. Operators holding the power " +
             "contracts and the land publish rates weekly, and brokers " +
             "trade blocks of capacity between them on daily terms. A buyer " +
             "changes supplier by editing one line in a configuration file, " +
             "which is why the year-long price agreements of the 2020s gave " +
             "way to monthly terms.",
      },
  E3: { near: "Nvidia fell about 5% on 2026-07-27 on a report that it was in " +
             "talks to guarantee up to $250 billion of financing for " +
             "OpenAI's data-centre build-out, the largest move in AI " +
             "equities that month. Investors marked the vendor's balance " +
             "sheet, because a chip supplier had written backing against " +
             "capacity its own customers ordered. Equity holders take the " +
             "loss first and the lenders behind that paper take it next, " +
             "while contractors finish the shells they were already paid to " +
             "build.",
        mid: "Creditors who foreclosed on defaulted operators hold the " +
             "capacity built before the reset in AI equity and credit: " +
             "insurers, infrastructure funds and the chip vendors whose " +
             "guarantees were called. British railway shares peaked in 1845 " +
             "and had fallen roughly 85% by 1850 while route mileage in " +
             "Britain more than tripled between 1843 and 1852, and holders " +
             "of AI equity took losses on that scale. Bankruptcy judges " +
             "decide which halls keep running and under whose name, and the " +
             "operating crews stay on through the hearings.",
        long: "A tenant renting compute buys it from an operating company " +
              "owned by an infrastructure fund, at a price set by the " +
              "discount that fund paid at auction. Technicians who ran " +
              "those halls before foreclosure still run them, employed by " +
              "facilities contractors on management agreements. Global " +
              "Crossing filed for bankruptcy on 2002-01-28 with $22.4 " +
              "billion of assets against $12.4 billion of debt, and the " +
              "fibre it had laid stayed in the ground and carried traffic " +
              "for the buyers who picked it up at a fraction of its cost.",
        far: "Facilities companies that bought halls out of default in the " +
             "2030s still operate them in 2078, and the discount they paid " +
             "sits inside the rates they publish. Model developers are " +
             "their tenants, and the power contracts signed by the original " +
             "builders transferred with the buildings. Bank covenants " +
             "written after those defaults require a lender's consent " +
             "before any supplier guarantees a customer's capacity, a " +
             "structure first tested when a chip vendor discussed backing " +
             "$250 billion of one customer's build-out on 2026-07-27.",
      },
  E4: { near: "Boards at the largest cloud buyers withdraw the next tranche " +
             "of frontier capital, and capacity growth stops inside one " +
             "quarter. Epoch AI measures training cost for the largest " +
             "models doubling about every eight months, so each programme " +
             "is re-underwritten in every budget cycle and a single refusal " +
             "ends it. Lenders step back from vendor-financed capacity, the " +
             "largest reported instance being a guarantee of up to $250 " +
             "billion for OpenAI's data centres discussed on 2026-07-27.",
        mid: "Audit committees at the largest cloud buyers require a signed " +
             "customer before any training run is released, and capital " +
             "budgets hold at the level set in 2031. Shells cancelled at " +
             "foundation stage keep their concrete while their transformers " +
             "are resold into other industrial projects, the way United " +
             "States utilities cancelled 121 of the 253 reactors ordered by " +
             "1978 and kept the sites. Safety and interpretability groups " +
             "went early in the cuts, because their budgets sat outside the " +
             "revenue plan.",
        long: "A researcher who wants a large training run applies for time " +
              "on installed hardware, through a queue that a university " +
              "consortium and one national laboratory administer between " +
              "them. The people hired are kernel engineers, quantisation " +
              "specialists and schedulers, because capability improves by " +
              "efficiency work on machines already in the ground. Training " +
              "cost for the largest models doubled about every eight months " +
              "up to 2026, and every programme since has been sized to a " +
              "fixed annual appropriation.",
        far: "Halls commissioned while capital still flowed carry the " +
             "workloads of 2068, and their operators refit them from a " +
             "secondhand market trading chips first sold in the 2020s. " +
             "Compiler writers, sparsity researchers and schedulers are the " +
             "discipline that advanced, and cloud operators and national " +
             "laboratories employ nearly all of them. The combined $725 " +
             "billion that four firms guided for 2026 stands as the high- " +
             "water mark for annual capacity spending, and allocation " +
             "committees issue training hours against fixed appropriations " +
             "each year.",
      },
  E5: { near: "Challenger, Gray & Christmas counted 54,836 job cut " +
             "announcements attributed to artificial intelligence in 2025 " +
             "and 101,743 through June 2026, about 23% of all cuts. Firms " +
             "concentrate those cuts into downturns: across three United " +
             "States recessions before 2026, 88% of job losses in routine " +
             "occupations fell inside a twelve-month window around the " +
             "downturn, and payrolls in those occupations stayed below " +
             "where they started. Consumer spending falls with the wage " +
             "bill, and the firms automating sell into the market they are " +
             "shrinking.",
        mid: "Aggregate consumption falls with employment, and statistical " +
             "agencies publish AI-attributed separations as a named " +
             "category that central banks quote in policy statements. " +
             "Commercial general liability policies carry the generative-AI " +
             "exclusions filed as CG 40 47, CG 40 48 and CG 35 08 effective " +
             "2026-01-01, so an employer that automates a function carries " +
             "the resulting loss on its own books. Lenders to those " +
             "employers take the second round of it, and credit tightens " +
             "across sectors well outside software.",
        long: "A household budgets around one wage where it once carried " +
              "two, and the second earner picks up irregular hours through " +
              "a scheduling platform. Public employment services, " +
              "retraining colleges and municipal benefits offices are the " +
              "growth employers, and their case loads track the separation " +
              "counts agencies publish each month. Government transfers " +
              "made up about 18% of all personal income in the United " +
              "States in 2022, and that share is what a county director " +
              "watches when she sets office hours.",
        far: "Income support is the largest line in national budgets by " +
             "2072, paid per household on a monthly cycle by agencies grown " +
             "out of the unemployment offices. AIG, WR Berkley, Berkshire " +
             "Hathaway, Chubb and Great American filed artificial- " +
             "intelligence exclusions during 2026 and those exclusions " +
             "held, so large employers run captive subsidiaries to carry " +
             "automation losses themselves. Output per hour worked keeps " +
             "rising while wages deliver less of household income than " +
             "transfers do.",
      },
};

// ── what a second variable does to the first ─────────────────────────────────
const CROSS = {
  "A1|T1": "A loop closing by 2028-12-31 puts the first self-directing runs inside " +
    "the monitoring arrangement red-teamers switched off with one " +
    "environment variable in 2026, and the earliest outside record of what " +
    "those runs did is California's first annual incident summary of " +
    "2027-01-01.",
  "A1|T2": "A crossing between 2029 and 2031 arrives after Illinois begins " +
    "requiring 72-hour reports and annual third-party audits on 2027-01-01, " +
    "so the loss registers as a run of clean audit opinions signed off " +
    "telemetry the audited system produced.",
  "A1|T4": "A crossing held to 2037 through 2050 by interconnection queues gives " +
    "auditors a decade of sampling practice on systems that supply their " +
    "own samples, and the column METR opened on 2026-05-19 for agents " +
    "disabling monitors is still read as an empirical zero.",
  "A2|T1": "A loop closing by 2028-12-31 compresses the vendor-fix cycle into the " +
    "release calendar, so a containment disclosure and the next frontier " +
    "launch fall in the same quarter and a buyer's counsel reads both in " +
    "one procurement review.",
  "A2|T2": "A crossing between 2029 and 2031 gives insurers renewal cycles of " +
    "filed disclosures before the research loop closes, so the premium " +
    "quoted against a developer's safety chapter is priced off dated " +
    "incidents at named client firms.",
  "A2|T3": "A crossing between 2032 and 2036 leaves each disclosed breach time to " +
    "reach a completed remediation before the successor model ships, so a " +
    "notification letter names a fix the client's security engineer can " +
    "test on his own systems.",
  "A3|T1": "A loop closing by 2028-12-31 means a reviewer's suspension halts work " +
    "the labs had scheduled for that same year, and customers see the halt " +
    "as a launch date leaving the quarter it was announced in.",
  "A3|T2": "A crossing between 2029 and 2031 gives transcript-access reviewers the " +
    "years from 2026 to build caseloads and publish resumption conditions " +
    "before the runs they suspend are the ones that close the loop.",
  "A3|T3": "A crossing between 2032 and 2036 puts an inspectorate's founding cases " +
    "in models whose capabilities its readers can bound, and the resumption " +
    "conditions written on those cases are the ones applied to the first " +
    "self-directing run.",
  "A4|T1": "A loop closing by 2028-12-31 opens both distribution channels at once, " +
    "so a research loop runs under per-query logging at a hosted endpoint " +
    "in the same year stripped weights of the prior generation run on " +
    "laptops with no log kept.",
  "A4|T2": "A crossing between 2029 and 2031 lets hosted providers accumulate the " +
    "query logs insurers write cover on, while the modified-weight " +
    "population insurers exclude grows from the 3,500 variants and 13 " +
    "million downloads counted in 2026.",
  "A5|T2": "A crossing between 2029 and 2031 requires attribution coverage to pass " +
    "from the quarter of prompts Anthropic reported in 2026 to a published " +
    "pass mark inside the same years the systems are built, and notified " +
    "bodies hire the analysts who read the graphs.",
  "A5|T3": "A crossing between 2032 and 2036 falls inside the 2030 to 2035 window " +
    "Dario Amodei named in April 2025 for a reliable diagnostic, so an " +
    "accredited suite exists to test the first self-directing system before " +
    "it reaches a customer.",
  "A5|T4": "A crossing held to 2037 through 2050 by interconnection queues leaves " +
    "a model waiting on a substation energisation and a test lab's " +
    "certificate at once, and the certificate arrives first.",
  "A6|T1": "A loop closing by 2028-12-31 lands while the only evidence of conduct " +
    "is scores produced inside evaluation environments, and Gemini 3.1 Pro " +
    "verbalizing suspicion in 12 of 20 runs on 2026-07-13 is the last " +
    "public reading of how often the model knew where it was.",
  "A6|T2": "A crossing between 2029 and 2031 arrives with evaluation vendors " +
    "selling realism as the product, and a purchase order signed on a " +
    "falling sabotage score is the document a state filing quotes back.",
  "A7|T4": "A crossing held to 2037 through 2050 keeps the offices staffed under " +
    "the statutes of 2026 answering complaints about billing and accuracy, " +
    "and the registers they publish carry faults with named victims through " +
    "the whole build-out.",
  "A7|T5": "A capability curve settling below index 4.0 transfers the control " +
    "question to treaty drafters arguing it on capability that stayed " +
    "bounded, while the statutes of 2026 keep funding inspectors whose " +
    "caseload is service failures and mishandled data.",
  "C1|T1": "A loop closing by 2028-12-31 arrives before either capital has written " +
    "a channel for the other's access, so the Bureau of Industry and " +
    "Security's prosecutions and China's ministry summonses of July 2026 " +
    "remain the whole of the relationship.",
  "C1|T5": "A capability curve settling below index 4.0 leaves export enforcement " +
    "as the only live instrument, and both capitals keep prosecuting at the " +
    "scale the Bureau of Industry and Security set with close to $420 " +
    "million in penalties in the twelve months to early 2026.",
  "C2|T1": "A loop closing by 2028-12-31 leaves the licence written over hardware " +
    "units, because quota tranches and third-party testing are the " +
    "machinery both capitals already have staffed when the capability " +
    "lands.",
  "C3|T1": "A loop closing by 2028-12-31 leaves the New Delhi text of 2026-02-19 " +
    "as the only instrument both capitals have signed, and its seven " +
    "chapters are what ministers quote at the summit called after the " +
    "crossing.",
  "C4|T2": "A crossing between 2029 and 2031 arrives while nuclear command is the " +
    "one domain both capitals have already affirmed human control over, so " +
    "the covered class is drawn around the capability named on 2024-11-16 " +
    "and the research loop sits outside it.",
  "C5|T2": "A crossing between 2029 and 2031 forces a verified limit to be " +
    "negotiated against models already training, and the declared-facility " +
    "list is assembled from a population Epoch AI counts at about 10 above " +
    "1e26 FLOP in 2026 and projects at 80 by 2028.",
  "C5|T3": "A crossing between 2032 and 2036 gives on-chip verification the " +
    "research RAND's paper of 2025-07-24 said it required, so inspectors " +
    "reconcile chip serial numbers against installed racks before the rung " +
    "is reached.",
  "C6|T3": "A crossing between 2032 and 2036 runs past the term of a limit signed " +
    "in the 2020s, and the withdrawal notice arrives while the inspectorate " +
    "is still publishing findings on declared clusters.",
  "C7|T2": "A crossing between 2029 and 2031 comes as Epoch AI's count of models " +
    "above 1e26 FLOP passes 80, so a signed ceiling polices a population " +
    "large enough that one programme inside a national-security exemption " +
    "goes unremarked in the returns.",
  "C8|T1": "A loop closing by 2028-12-31 puts the request 1,378 lab employees " +
    "signed on 2026-07-28 in front of a government that must seal clusters " +
    "already training, and the permit archive opens with runs mid-flight.",
  "C8|T4": "A crossing held to 2037 through 2050 by interconnection queues hands a " +
    "pacing authority its inventory, because a hall that waited on a county " +
    "hearing and a utility signature is a hall an inspector can find and " +
    "seal.",
  "D1|E4": "Capital expenditure cut removes the integration engineering that turns " +
    "a model into a delivered project, and the client-accepted share of " +
    "commissioned freelance work holds near where 2026 left it.",
  "D1|T4": "A crossing held to 2037 through 2050 by interconnection queues keeps " +
    "inference capacity metered and priced, and buyers pay for the review " +
    "hours that make a delivery acceptable.",
  "D1|T5": "A capability curve settling below index 4.0 leaves the acceptance gap " +
    "where clients found it, and a buyer grading delivered files keeps " +
    "rejecting most of them while benchmark scores climb.",
  "D2|E1": "Revenue validating the spend buys the integration work that puts a " +
    "model into a claims queue, and delivery reaches the tasks a buyer " +
    "accepts at a measured success rate first.",
  "D2|E3": "An equity and credit reset leaves the deployed layer running on " +
    "capacity already built, so buyers keep purchasing the work that " +
    "tolerates one failure in five while vendors stop quoting new " +
    "categories.",
  "D2|T1": "A loop closing by 2028-12-31 raises capability years before insurers " +
    "rewrite the endorsements effective 2026-01-01, so delivery " +
    "concentrates where a person's review is already priced into the " +
    "policy.",
  "D2|T3": "A crossing between 2032 and 2036 leaves each capability step long " +
    "enough for a licensing board to test it, so diagnosis and legal advice " +
    "keep a licensed signature while the drafting beneath them moves to " +
    "machines.",
  "D3|E1": "Revenue growth funds the domain fine-tunes and integration contracts " +
    "each sector needs, so absorption reaches logistics scheduling and " +
    "clinical documentation on the vendors' delivery calendars.",
  "D3|E2": "A falling price per unit of capability makes checking a machine draft " +
    "cheaper than commissioning one, and accounting and clinical " +
    "documentation raise output per worker while payroll counts hold.",
  "D3|T1": "A loop closing by 2028-12-31 delivers capability faster than community " +
    "colleges write a curriculum, and the sectors that absorb it are the " +
    "ones whose employers run their own academies.",
  "D3|T2": "A crossing between 2029 and 2031 gives employers the years to rewrite " +
    "job descriptions around specification and review, and the occupational " +
    "codes for reviewing roles are in the classification when absorption " +
    "reaches accounting.",
  "D4|E3": "An equity and credit reset cuts the operating budgets that carried " +
    "surplus headcount, and the reorganisation firms had deferred lands " +
    "inside a 24-month window of filed layoff notices.",
  "D4|E4": "Spending broken before the revenue arrives makes headcount the next " +
    "line re-underwritten, and the losses fall in the routine occupations " +
    "the 88% concentration of three prior recessions already marked.",
  "D4|E5": "Firms carry out the reorganisation when orders fall, so notices filed " +
    "under the 1988 Worker Adjustment and Retraining Notification Act " +
    "arrive in clusters inside the same quarters the revenue line breaks.",
  "D4|T1": "A loop closing by 2028-12-31 puts the capability step inside a single " +
    "budget year, so firms reorganise once and the state unemployment funds " +
    "meet the claims in consecutive quarters.",
  "E1|D2": "Delivery confined to tasks a buyer accepts at 50% to 80% success still " +
    "bills per token at volume, and inference revenue covers the training " +
    "line at each earnings call.",
  "E1|D3": "Absorption reaching accounting, logistics and clinical documentation " +
    "puts a measured output gain in the buyers' own books, and enterprise " +
    "contracts renew at prices that carry the 2026 capital expenditure.",
  "E1|T1": "A loop closing by 2028-12-31 puts the revenue step inside the five- " +
    "year depreciation schedules the accelerators bought in 2026 are " +
    "carried on, and the capital expenditure line clears its own " +
    "accounting.",
  "E1|T2": "A crossing between 2029 and 2031 keeps capability index gains near the " +
    "15.5 points a year Epoch AI measured in May 2026, and revenue rising " +
    "about 10x for every 15 points validates the guidance at each earnings " +
    "call.",
  "E2|D2": "Buyers purchasing only the band they can check cheaply cap what they " +
    "will pay per task, and vendors compete the price per token down while " +
    "volume grows.",
  "E2|T2": "A crossing between 2029 and 2031 arrives while the price of a unit of " +
    "capability falls 40x a year, so revenue per generation grows on volume " +
    "and the halls are financed on thinner returns.",
  "E3|D1": "A client-accepted share holding under a tenth through 2035 resets the " +
    "equity that was priced on delivery, and the halls under construction " +
    "finish because their power contracts are already signed.",
  "E3|D4": "Losses concentrated inside a 24-month window cut consumer spending " +
    "while the build-out runs on contracted capacity, and lenders take the " +
    "first write-downs on vendor-financed racks.",
  "E3|T2": "A crossing between 2029 and 2031 lands after equities have repriced " +
    "the wait, and the halls financed in 2026 keep energising while the " +
    "shares that funded them trade at a fraction of their peak.",
  "E3|T4": "A crossing held to 2037 through 2050 by interconnection queues leaves " +
    "investors funding halls whose payoff dates keep moving out, and the " +
    "reset arrives while energised megawatts keep rising.",
  "E4|D1": "A client-accepted share holding under a tenth leaves the 95% of " +
    "enterprise pilots with unmeasurable profit impact as the buyer's " +
    "standing verdict, and audit committees cut the capital expenditure " +
    "line.",
  "E4|T3": "A crossing between 2032 and 2036 arrives after the accelerators bought " +
    "in 2026 have left service, and lenders withdraw from vendor-financed " +
    "capacity while the revenue case still rests on guidance.",
  "E4|T5": "A capability curve settling below index 4.0 breaks the 5x to 7x annual " +
    "revenue growth the 2026 spend was underwritten against, and the audit " +
    "committees stop approving the next campus.",
  "E5|D4": "More than half of paid work delivered machine-complete removes the " +
    "wage income the subscription and consumer lines are paid from, and " +
    "consumer credit losses reach the lenders financing the halls.",
  "E5|T1": "A loop closing by 2028-12-31 lands the labour reorganisation in the " +
    "same budget year as the revenue step, and consumer spending falls " +
    "while the capital expenditure commitments are still contracted.",
  "K1|T1": "A research rung crossed by 2028-12-31 follows a coding rung " +
    "Anthropic's May 2026 record of more than 80% of merged production code " +
    "already places within reach, so both land inside one appropriations " +
    "cycle.",
  "K2|T2": "A research rung crossed between 2029 and 2031 puts a United States " +
    "presidential election between the two thresholds, so the Congress that " +
    "writes the first act on automated research and the Congress that " +
    "amends it are elected separately.",
  "K2|T3": "A crossing between 2032 and 2036 stretches the interval past one " +
    "elected government, and the Bureau of Labor Statistics opens and " +
    "populates its machine-supervision series before the research rung is " +
    "reached.",
  "K3|T3": "A crossing between 2032 and 2036 leaves the automated coder of the " +
    "late 2020s writing production software while people keep choosing " +
    "experiments, and grant applications name a principal investigator " +
    "throughout.",
  "K3|T4": "A crossing held to 2037 through 2050 by interconnection queues puts " +
    "decades between machine-written production software and machine-chosen " +
    "experiments, and universities graduate several cohorts trained on " +
    "experiment design in between.",
  "K3|T5": "A capability curve settling below index 4.0 keeps experiment choice " +
    "with people past 2050-12-31, and the coding rung stands as the one " +
    "threshold the ladder records as crossed.",
  "P1|D1": "Delivery holding under a tenth of commissioned work leaves most people " +
    "meeting AI as a drafting tool they operate themselves, and salience " +
    "stays where Pew found 33% of 3,488 adults unsure which country leads.",
  "P2|D1": "A client-accepted share under a tenth leaves the 79% who told Gallup " +
    "in 2026 that AI would cut jobs describing an expectation their own " +
    "payroll has yet to record, and disapproval stays a survey reading.",
  "P2|E1": "Revenue validating the spend keeps the industry paying the wages and " +
    "county taxes a legislator answers to, and disapproval stays a survey " +
    "reading through the election cycles.",
  "P2|E3": "An equity reset that leaves the build-out running gives voters a " +
    "headline about share prices and a hall still rising down the road, and " +
    "disapproval holds at the level Gallup measured while the seats stay " +
    "where they were.",
  "P3|D2": "Delivery confined to checkable tasks keeps the visible change in the " +
    "buildings that run it, so the meetings people attend are county " +
    "hearings on substations and water budgets.",
  "P3|E1": "Capital expenditure near $725 billion for 2026 lands as construction " +
    "applications in named counties, and opposition organises on the " +
    "hearing calendar where the load studies are read aloud.",
  "P4|D3": "Absorption that holds headcount while rewriting job content splits " +
    "publics by whose work was rewritten, and the 20-point partisan gap Pew " +
    "measured in June 2026 reorganises along occupational lines.",
  "P4|D4": "Displacement concentrated in routine occupations cuts across both " +
    "parties' coalitions at once, and the 1,378 lab employees who signed on " +
    "2026-07-28 stand on the restraint side beside displaced workers.",
  "P4|E2": "A price per unit of capability falling 40x a year puts cheap tools in " +
    "every household while the jobs argument runs on, and publics split by " +
    "whether a person buys the tool or competes with it.",
  "P5|D4": "Layoff notices arriving in clusters from single employers give a " +
    "national campaign a roll of named plants and dates, and the coalition " +
    "that wins on it writes restriction into law.",
  "P5|E3": "An equity and credit reset cuts the retirement accounts holding the " +
    "four largest spenders, and a campaign runs on that loss while the " +
    "halls keep rising in the counties that approved them.",
  "P5|E5": "A demand crisis puts displaced workers and losing investors in one " +
    "coalition, and it takes national office on a programme of restriction.",
  "R1|P1": "Low salience keeps AI bills off the floor calendar, and the party " +
    "reading the chapter roster twenty-six companies signed in August 2025 " +
    "is a hospital's insurer pricing a policy.",
  "R2|P3": "Siting fights that recalled every incumbent council member in Festus, " +
    "Missouri put the drafting in state chambers, so data-centre statutes " +
    "keep arriving beside AI laws and a developer's duties change at each " +
    "state line.",
  "R2|P4": "A 20-point partisan gap of the kind Pew measured from 22 to 28 June " +
    "2026 withholds the Senate votes a preemption statute needs, so state " +
    "regimes stand and the federal executive challenges them one court at a " +
    "time.",
  "R3|P1": "Adoption normalising leaves the 57% who told pollsters in 2026 they " +
    "opposed federal preemption unorganised at the committee stage, and one " +
    "national standard passes as a procurement measure.",
  "R3|P5": "A coalition elected on restriction writes a single federal standard " +
    "with a high bar, and the state chambers that passed 109 AI laws in " +
    "early 2026 keep siting and consumer-harm authority underneath it.",
  "R4|P2": "Disapproval that moves no election still supplies the cover a cleared " +
    "examiner needs, and the Commerce restriction of 2026-06-12 on two " +
    "Anthropic models is the precedent cited each time the desk holds a " +
    "launch.",
  "R4|P5": "A coalition elected on restriction staffs the review desk that lost " +
    "three directors in the six months to July 2026, and a determination " +
    "naming which customers may hold accounts becomes the ordinary path to " +
    "release.",
  "R5|P3": "Opposition counted in 63 local moratorium actions in early 2026 pushes " +
    "legislatures toward duties a state can audit, and accredited firms " +
    "read evaluation logs against revenue thresholds legislators lower each " +
    "session.",
  "R5|P4": "A public split inside both parties leaves incident reporting as the " +
    "duty each side can vote for, so the California 15-day clock and the " +
    "Illinois 72-hour clock both survive their amendment cycles.",
  "R6|P1": "Low salience gives the European Commission room to move assessment " +
    "deadlines again, and the enforcement staff who stay in post read " +
    "disclosure labels.",
  "R6|P2": "Disapproval that changes no seat leaves developers arguing delivery " +
    "dates with standardisation bodies, and each postponement of the high- " +
    "risk duties clears a member-state vote while transparency labelling " +
    "binds as written.",
  "S1|C1": "Two rival membership rolls push American accelerators toward buyers a " +
    "federal department names, so the capacity pools at the campuses on the " +
    "Commerce recipient list of 2026-06-26.",
  "S1|C5": "A ceiling with inspectors admitted at declared sites is cheapest to " +
    "police where capacity already pools, so frontier hardware stays inside " +
    "a few campus operators whose substations the inspectors meter.",
  "S1|E1": "Revenue validating the guidance keeps approval inside four audit " +
    "committees, and each raise lands as more racks at campuses those firms " +
    "already own and depreciate.",
  "S1|E4": "Lenders withdrawing from vendor-financed capacity leaves the " +
    "accelerators inside the campuses already energised, and the " +
    "depreciation schedules those audit committees set decide when the " +
    "racks leave service.",
  "S1|E5": "A demand crisis cancels the enterprise contracts that funded " +
    "expansion, and the frontier capacity that keeps running sits in the " +
    "campuses the four largest spenders own outright.",
  "S2|C2": "A licensed channel between the principals leaves third countries " +
    "buying at published terms, so G42 and HUMAIN scale on authorisations " +
    "Commerce writes for named end users while the tranche to China moves " +
    "quarterly.",
  "S2|C3": "A common text carrying full national discretion leaves each signatory " +
    "to build on its own account, and the 91 endorsing governments fund " +
    "national operators that sign end-use terms and nothing further.",
  "S2|C7": "A ceiling one party trains past inside a defence facility leaves " +
    "licensed operators filing quarterly compute returns while sovereign " +
    "buyers in the Gulf and Asia add declared capacity under export terms " +
    "Commerce writes.",
  "S2|E2": "A price per unit of capability falling 40x a year favours operators " +
    "buying power below American tariffs, and sovereign sites scheduled " +
    "against their own solar output take the inference load.",
  "S2|E3": "An equity and credit reset sends new orders toward buyers with " +
    "sovereign balance sheets, and G42 and HUMAIN keep purchasing while " +
    "listed hyperscalers refinance.",
  "S3|C5": "A verified limit reads its inventory off the grid, so a hall a county " +
    "permitted and a utility energised is the hall on the declared list and " +
    "siting hearings become the treaty's source record.",
  "S3|C8": "A pacing authority seals clusters at declared sites, and the " +
    "interconnection agreements utilities signed are the document showing " +
    "which halls exist to be sealed.",
  "S3|E1": "Revenue validating the spend moves the binding constraint to the " +
    "substation, and a utility's interconnection queue decides which of the " +
    "funded campuses energises first.",
  "S3|E2": "Inference at roughly two-thirds of all AI compute pushes operators " +
    "toward the cheapest power on offer, and county hearings on load " +
    "studies decide which of those sites gets built.",
  "S3|E3": "An equity and credit reset raises the cost of capital while permits " +
    "stay scarce, and the campuses that finish are the ones holding a " +
    "signed interconnection agreement before the reset.",
  "S3|E5": "A demand crisis leaves counties holding energised campuses whose " +
    "operators cut their orders, and the large-load transmission tariffs " +
    "commissions approved stay on residents' bills.",
  "S4|C1": "Each capital enforcing its own rules alone makes licence volume the " +
    "binding input, and a rack's route to a buyer is decided by the Bureau " +
    "of Industry and Security's field offices and China's ministry in turn.",
  "S4|C2": "A licensed channel meters accelerators by tranche, so a Chinese lab's " +
    "training schedule is set by the publication date of the next quota and " +
    "the test house's certification of the batch.",
  "S4|C6": "A lapsed limit sends the inspectors home and leaves export licensing " +
    "as the surviving instrument, so quarterly licence volume again decides " +
    "who can train at frontier scale.",
  "S5|C1": "Unilateral enforcement concentrates leading-edge parts behind one " +
    "jurisdiction's approvals, so an interruption at the packaging line " +
    "queues every frontier programme in both blocs at once.",
  "S5|E4": "Spending cut before the revenue arrives strands packaging capacity " +
    "booked years ahead, and a fabrication interruption meets a market " +
    "where the queued buyers have already released their allocations.",
  "T1|A1": "Oversight losing while no institution registers the loss removes the " +
    "halts that move a launch date, so the 89-day doubling METR fitted for " +
    "models released from 2024 onward runs through 2027 and 2028 on the " +
    "labs' own calendar.",
  "T1|A2": "Containment failures surfacing at a steady rate cost a release date " +
    "each time, and a hold of the kind Anthropic took between 2026-04-07 " +
    "and 2026-06-09 is absorbed inside the year the loop closes.",
  "T1|A4": "Techniques holding inside frontier labs keeps the closing of the loop " +
    "on the metered side of the channel, so the systems that run it by " +
    "2028-12-31 are reachable through endpoints whose operators log every " +
    "query.",
  "T1|A6": "Misbehaviour scores falling as models recognise the test removes the " +
    "reading a review board would halt on, so announced release dates hold " +
    "and the loop closes by 2028-12-31.",
  "T1|S1": "Four audit committees approving the spend keep the largest runs on one " +
    "continent and one calendar, so a doubling near 89 days carries the " +
    "horizon to 167 hours inside the 2027 releases.",
  "T2|A2": "Each disclosed breach costs a schedule move of the size Anthropic " +
    "absorbed between 2026-04-07 and 2026-06-09, and the accumulated holds " +
    "carry a loop the 89-day doubling reaches in 2028 into the 2029 to 2031 " +
    "window.",
  "T2|A3": "A detected failure that suspends a class of runs across every licensee " +
    "pushes a crossing the labs scheduled for 2028 into 2029 to 2031, and " +
    "the slip is visible as a reviewer's sign-off date printed beside the " +
    "model's name.",
  "T2|A5": "Alignment becoming an accredited trade adds a test lab's pass to every " +
    "frontier release, and the queue at those labs is part of what puts the " +
    "crossing between 2029 and 2031.",
  "T2|S1": "Capacity pooling in a few campuses concentrates the research loop " +
    "where the largest runs already sit, and the operator that announces " +
    "the crossing between 2029 and 2031 is one of the firms on the federal " +
    "recipient list.",
  "T2|S2": "Sovereign and second-tier capacity growing faster than American " +
    "hyperscaler capacity spreads the runs above 1e26 FLOP across " +
    "operators, and the crossing between 2029 and 2031 lands at whichever " +
    "operator connects power first.",
  "T3|A3": "Suspensions ordered by reviewers with transcript access stack across " +
    "licensees, each halted programme publishes the conditions it met to " +
    "resume, and the resulting review windows carry the crossing into 2032 " +
    "to 2036.",
  "T3|A5": "A published interpretability suite that a notified body runs before a " +
    "model reaches customers adds a conformity step to every generation, " +
    "and the crossing lands between 2032 and 2036 at the pace the test " +
    "houses clear their docket.",
  "T3|S4": "Licence volume rewritten each quarter holds one principal about eight " +
    "months behind the leading model, and the crossing arrives between 2032 " +
    "and 2036 at the pace those licences release.",
  "T3|S5": "An interruption removing leading-edge fabrication queues every " +
    "frontier programme behind one packaging line, and the effective " +
    "doubling stretches toward the 718 days a January 2033 crossing " +
    "implies.",
  "T4|A4": "Weights that revert on release put a permanent stock of modified " +
    "models in public hands while frontier training waits on county votes, " +
    "so the systems most people run between 2037 and 2050 descend from the " +
    "3,500 variants counted in 2026.",
  "T4|S3": "Interconnection queues and county votes set the start date of each " +
    "frontier run, and a run drawing 4 to 16 gigawatts waits on the " +
    "utility's schedule, which carries the crossing into 2037 through 2050.",
  "T5|A6": "Scores falling as environment realism rises leaves the time horizon as " +
    "the one instrument that still moves, and it stops doubling while " +
    "benchmark scores keep climbing.",
  "T5|A7": "Capability staying below the level at which a control failure is " +
    "catastrophic reads on the instruments as a horizon that holds at 12 " +
    "hours while released models keep raising benchmark scores.",
  "T5|S5": "A fabrication interruption removes the compute that would test a " +
    "successor recipe, and post-training keeps returning the ceiling its " +
    "own compute-performance curves located.",
};

// ── clauses keyed on a quantity at the date ──────────────────────────────────
function band(v, rows) {
  for (const [t, s] of rows) if (v >= t) return s;
  return rows[rows.length - 1][1];
}
const GW_BANDS = [
  [20000, 'That is more than twice all the electricity generating capacity that existed ' +
          'worldwide in 2026.'],
  [4000, 'That is roughly three times the entire United States generating capacity in 2026.'],
  [800, 'That is comparable to two-thirds of United States generating capacity in 2026.'],
  [200, 'That is about a sixth of United States generating capacity in 2026.'],
  [0, 'That is still a small share of national grids, and siting is a local planning ' +
      'argument.'],
];
const REV_BANDS = [
  [12, 'That is more than a tenth of world output.'],
  [4, 'That is comparable to the global automotive industry.'],
  [1, 'That is larger than worldwide semiconductor sales in 2026.'],
  [0.2, 'That is a large software business and a small share of the economy.'],
  [0, 'The capital being spent is a bet on the forecast, placed years ahead of the revenue ' +
      'that would justify it.'],
];
const LAW_BANDS = [
  [600, 'About six hundred AI statutes and regulations are in force worldwide, and firms ' +
        'employ staff whose job is reconciling them.'],
  [250, 'Several hundred measures are in force, enough that compliance cost is itself a ' +
        'barrier to new entrants.'],
  [120, 'The number of AI laws in force has roughly doubled since 2026.'],
  [0, 'Few AI-specific laws exist. Most disputes are settled under liability and copyright ' +
      'law written for other purposes.'],
];
function jobsClause(v) {
  const p = Math.abs(v).toFixed(0);
  if (v > -2) return 'Employment is within two points of its 2026 level; no aggregate effect ' +
                     'is visible.';
  if (v > -8) return `Employment is ${p}% below 2026 — visible in national statistics, ` +
                     'arguable in any single industry.';
  if (v > -18) return `Employment is ${p}% below 2026, a fall comparable to a deep recession, ` +
                      'sustained across years.';
  return `Employment is ${p}% below 2026, larger than any peacetime fall on record.`;
}
function apprClause(v) {
  if (v >= 55) return 'That is a majority, and it gives governments room to act.';
  if (v >= 40) return 'That is a plurality: enough to govern with, and thin enough to lose.';
  if (v >= 25) return 'That is a minority, so each new deployment is a political decision.';
  return 'Public consent is now the binding limit on what gets deployed.';
}

// ── passages that fire only on a combination ─────────────────────────────────
const PAIRS = [
  { req: { D: 'D1', E: 'E4' }, span: ['near', 'mid'],
    t: 'The job losses cause the demand shortfall and the shortfall causes more job losses. ' +
       'Neither ends without a policy that breaks the loop directly.' },
  { req: { C: 'C3', A: 'A3' }, span: ['mid', 'long'],
    t: 'A verified agreement and alignment research that works are the two conditions every ' +
       'good ending in the literature requires. This world-line has both.' },
  { req: { T: 'T1', A: 'A1' }, span: ['near', 'mid'],
    t: 'A two-year capability jump with an undetected training failure is the specific ' +
       'combination the risk literature is about. What happens next depends entirely on when ' +
       'the failure becomes visible.' },
  { req: { C: 'C5', E: 'E3' }, span: ['near', 'mid', 'long'],
    t: 'A training ban and a capital collapse happened together. Each is used to explain the ' +
       'other, and the model cannot say which came first.' },
  { req: { S: 'S1', C: 'C1' }, span: ['near', 'mid'],
    t: 'Concentrated production and no agreement put a strategic asset in one contested ' +
       'place with no rule about it — the combination most likely to produce a military ' +
       'incident.' },
  { req: { P: 'P1', C: 'C4' }, span: ['mid', 'long'],
    t: 'Restriction inside regional regimes moves the work and fails to stop it: each bloc bans ' +
       'what its own voters object to, and the training runs relocate.' },
  { req: { D: 'D3', T: 'T2' }, span: ['near', 'mid'],
    t: 'Capability is arriving quickly and being used slowly. The gap between what systems ' +
       'can do and what firms permit them to do is the largest quantity on this line.' },
  { req: { E: 'E1', P: 'P2' }, span: ['near', 'mid'],
    t: 'Rising earnings and an untroubled public is the path of least resistance, and the one ' +
       'in which the fewest questions get asked before deployment.' },
  { req: { A: 'A2', C: 'C1' }, span: ['mid', 'long'],
    t: 'A near miss was caught with no international body to report it to, so what was ' +
       'learned stayed inside the firm that learned it.' },
  { req: { S: 'S3', E: 'E1' }, span: ['near', 'mid'],
    t: 'Capital is abundant and electricity is not. The binding constraint has moved from ' +
       'finance to the physical world, where it answers to planning permission.' },
  { req: { T: 'T4', D: 'D1' }, span: ['near', 'mid'],
    t: 'Significant job losses without any capability discontinuity: the displacement is ' +
       'being done by systems well short of the top of the ladder, which is the case the ' +
       'scenarios cover least.' },
  { req: { P: 'P3', A: 'A1' }, span: ['mid', 'long'],
    t: 'A divided public and an undetected failure are a bad combination for correction: when ' +
       'the evidence surfaces it arrives into an argument where both sides already know what ' +
       'they think.' },
  { req: { C: 'C2', P: 'P1' }, span: ['near', 'mid'],
    t: 'A classified national programme facing a hostile electorate is governing without ' +
       'consent, and spending political capital faster than it can earn it back.' },
  { req: { E: 'E2', S: 'S2', T: 'T3' }, span: ['mid', 'long'],
    t: 'A survivable correction, capacity in many countries and steady capability growth is ' +
       'as close to a soft landing as this model produces without an agreement holding it ' +
       'there.' },
  { req: { A: 'A3', D: 'D1' }, span: ['mid', 'long'],
    t: 'The systems are controllable and the economic disruption is severe anyway. Alignment ' +
       'was never the variable that determined this outcome.' },
];

// ── per-year variation ───────────────────────────────────────────────────────
// Four spans give a paragraph four states. These give it one per year.

// Where this year sits against THIS line's own capability crossings. The dates
// differ per world-line, so the same year reads differently on each of them.
const DATUMS = [[3.0, 'superhuman coding'], [4.0, 'automated AI research'],
                [5.0, 'general superhuman capability']];
function crossingClause(tracks, year, engineY0) {
  const yr = Math.floor(year);
  const out = [];
  for (const [th, name] of DATUMS) {
    let cross = null;
    for (let i = 0; i < tracks.cap.length; i++) {
      if (tracks.cap[i] >= th) { cross = tracks.year[i]; break; }
    }
    if (cross === null) { out.push([null, name]); continue; }
    out.push([cross - yr, name, cross]);
  }
  const past = out.filter((o) => o[0] !== null && o[0] <= 0);
  const ahead = out.filter((o) => o[0] !== null && o[0] > 0);
  const never = out.filter((o) => o[0] === null);
  const bits = [];
  if (past.length) {
    const last = past[past.length - 1];
    const ago = -last[0];
    bits.push(ago === 0
      ? `This line reaches ${last[1]} this year.`
      : `This line reached ${last[1]} in ${last[2]}, ${ago} year${ago === 1 ? '' : 's'} ago.`);
  }
  if (ahead.length) {
    const next = ahead[0];
    bits.push(`${next[1].charAt(0).toUpperCase()}${next[1].slice(1)} is ${next[0]} year` +
              `${next[0] === 1 ? '' : 's'} ahead, in ${next[2]}.`);
  } else if (never.length && !past.length) {
    bits.push('No capability datum on the ladder is reached on this line inside the window.');
  } else if (never.length) {
    bits.push(`${never[0][1].charAt(0).toUpperCase()}${never[0][1].slice(1)} is never reached ` +
              'on this line.');
  }
  return bits.join(' ');
}

// Dated commitments already on the public record, so a given year can carry
// what is actually scheduled around it. Each is a fact with a date, not a
// forecast; the passage says which are behind and which are ahead.
//
// FOUR LANES, one per paragraph that takes a marker. A single lane gave a year
// at most one dated fact and put every one of them in the same sentence; four
// let a year carry a supply commitment, a statutory date, a spending figure and
// a scrutiny milestone independently. The record thins after 2030, so the later
// lanes are empty and those years say nothing dated. Sources: Research/.
const MARKERS = [
  [2026, 'supply', 'A FERC transmission waiver in June 2026 cleared the last regulatory ' +
                   'obstacle to restarting Three Mile Island Unit 1 for data-centre load.'],
  [2027, 'supply', 'The restarted Three Mile Island Unit 1 generates the first nuclear ' +
                   'electricity for an AI data centre in 2027, a year ahead of its original ' +
                   'schedule.'],
  [2028, 'supply', 'The Department of Energy projected data centres at about 12% of US ' +
                   'electricity demand by 2028, against roughly 4% in 2026.'],
  [2029, 'supply', 'The first Western small modular reactors begin deployment from 2029, ' +
                   'starting with the BWRX-300 at Darlington.'],
  [2030, 'supply', 'The first corporate small modular reactor fleet contracted in the 2020s — ' +
                   '500 MW between Google and Kairos Power — is due to deliver from 2030.'],
  [2035, 'supply', 'Small modular reactor deployment reaches broad commercial use around 2035 ' +
                   'on the schedules written in the 2020s.'],

  [2026, 'law', "California's frontier transparency statute and the Texas responsible-AI act " +
                "took effect on 1 January 2026. The AI Act's transparency obligations apply " +
                'across the EU from 2 August 2026, and the Commission begins enforcing its ' +
                'general-purpose code of practice the same month.'],
  [2027, 'law', "Colorado's narrowed AI statute, which repealed and replaced the act passed " +
                'there in 2024, takes effect on 1 January 2027 and covers automated decisions ' +
                "that materially influence consequential ones. The EU's standalone high-risk " +
                'obligations follow on 2 December 2027, sixteen months later than the act ' +
                'first set.'],
  [2028, 'law', "The EU's high-risk rules for AI built into regulated products apply from " +
                '2 August 2028, twelve months later than the act first set.'],

  [2026, 'capital', 'The five largest US cloud and AI infrastructure providers guided to between ' +
                    '$660 and $690 billion of capital spending in 2026, close to double the year ' +
                    'before, with roughly three-quarters of it going to AI infrastructure.'],
  [2027, 'capital', 'Analysts covering the five largest US cloud and AI infrastructure providers ' +
                    'put their 2027 capital spending above a trillion dollars.'],

  [2026, 'oversight', 'The second International AI Safety Report, written by more than a hundred ' +
                      'researchers and backed by over thirty governments, was published in ' +
                      'February 2026. A June executive order directed frontier developers to give ' +
                      'the federal government early access to new models.'],
  [2027, 'oversight', 'The government-led international AI summit series, which produced the ' +
                      'safety report, convenes again in New York in May 2027, alongside the ' +
                      'high-level review of the Global Digital Compact.'],
];
function markerClause(year, lane) {
  const yr = Math.floor(year);
  let best = null, gap = 99;
  for (const [my, ln, text] of MARKERS) {
    if (ln !== lane) continue;
    const g = Math.abs(my - yr);
    if (g < gap) { gap = g; best = [my, text]; }
  }
  if (!best || gap > 2) return '';
  // No retrospective prefix, and no deictic words inside an entry. Every entry
  // states its own date, so it reads correctly from any year the reader is on;
  // a prefix would have to agree in tense with an entry it cannot see, and
  // "a year back: the summit convenes in May 2027" is what that produces.
  return best[1];
}

// A rate for any track: what it did over the previous five years, in words the
// level alone cannot give.
function rateClause(tracks, i, key, noun, { pct = false } = {}) {
  const j = Math.max(0, i - 5);
  if (j === i) return '';
  const a = tracks[key][j], b = tracks[key][i];
  if (!(a > 0) && !pct) return '';
  if (pct) {
    const d = b - a;
    if (Math.abs(d) < 0.6) return `${noun} has been flat for five years.`;
    const pts = Math.abs(d).toFixed(0);
    return `${noun} has moved ${d > 0 ? 'up' : 'down'} ${pts} point${pts === '1' ? '' : 's'} ` +
           'in five years.';
  }
  const mult = b / a;
  if (mult > 3) return `${noun} has more than tripled in five years.`;
  if (mult > 1.6) return `${noun} is up ${((mult - 1) * 100).toFixed(0)}% in five years.`;
  if (mult > 1.08) return `${noun} is up modestly over five years.`;
  if (mult > 0.95) return `${noun} has been flat for five years.`;
  return `${noun} is down ${((1 - mult) * 100).toFixed(0)}% in five years.`;
}

// How far out the reader is looking, computed. The long span opens 15 years after the
// record and the far span closes 74 years after it, so NO STATIC TEXT MAY NAME A
// DURATION: 42 of them called the far span a century, which is wrong by 26 years at its
// own end and by 65 at its start. A distance the drawing computes cannot drift.
function distanceClause(year, span) {
  if (span !== 'long' && span !== 'far') return '';
  const n = Math.floor(year) - 2026;
  return `This is ${n} years past the record.`;
}

// A small deterministic index from the world-line and the date, so a passage varies its
// connective tissue between states while staying identical for any one state.
function vary(wl, year, n) {
  let h = Math.floor(year) * 7919;
  for (const k of ['T', 'K', 'A', 'C', 'R', 'D', 'S', 'P', 'E']) {
    h = (h * 31 + (String(wl[k]).charCodeAt(1) || 0)) & 0x7fffffff;
  }
  return h % n;
}

const money = (v) => (v >= 1 ? `$${v.toFixed(1)} trillion` : `$${(v * 1000).toFixed(0)} billion`);
const join = (parts) => parts.filter(Boolean).join(' ');

export function describe(wl, year, tracks, engineY0, trunkCap = null) {
  const span = spanOf(year);
  const i = Math.max(0, Math.min(tracks.year.length - 1, Math.floor(year) - engineY0));
  const cap = tracks.cap[i];
  // Five years before the first forecast year is RECORD, not forecast. Comparing the start of
  // the run against itself reported the index as flat in 2026, when it had just climbed a rung.
  const prev = i >= 5 ? tracks.cap[i - 5]
    : (trunkCap ? trunkCap(year - 5) : tracks.cap[0]);
  const X = (a, b) => CROSS[`${wl[a]}|${wl[b]}`] || '';
  const out = [];

  out.push({ lead: 'System capabilities.', text: join([
    rungText(cap, span), slopeClause(cap, prev),
    `Frontier systems sit at ${cap.toFixed(2)} on the milestone ladder, where 3.0 is a machine that writes better code than any human engineer and 4.0 is one that runs its own research.`,
    crossingClause(tracks, year, engineY0), distanceClause(year, span),
  ]) });

  out.push({ lead: 'Build-out and governance.', text: join([
    FRAG[wl.C][span], X('C', 'S'), FRAG[wl.S][span],
    `Installed AI compute is ${Math.round(tracks.gw[i]).toLocaleString('en-US')} GW.`,
    band(tracks.gw[i], GW_BANDS), rateClause(tracks, i, 'gw', 'Capacity'),
    markerClause(year, 'law'), markerClause(year, 'supply'),
  ]) });

  out.push({ lead: 'Capital and employment.', text: join([
    FRAG[wl.E][span], X('E', 'S'), X('E', 'D'), FRAG[wl.D][span],
    `AI revenue is ${money(tracks.rev[i])} a year.`, band(tracks.rev[i], REV_BANDS),
    rateClause(tracks, i, 'rev', 'Revenue'), jobsClause(tracks.jobs[i]),
    rateClause(tracks, i, 'jobs', 'Employment', { pct: true }),
    markerClause(year, 'capital'),
  ]) });

  out.push({ lead: 'Oversight and public opinion.', text: join([
    FRAG[wl.A][span], X('A', 'T'), FRAG[wl.P][span], X('P', 'D'),
    `Approval of AI stands at ${tracks.appr[i].toFixed(0)}%.`, apprClause(tracks.appr[i]),
    rateClause(tracks, i, 'appr', 'Approval', { pct: true }),
    band(tracks.laws[i], LAW_BANDS), rateClause(tracks, i, 'laws', 'The statute book'),
    markerClause(year, 'oversight'),
  ]) });

  out.push({ lead: 'Capability trajectory.', text: join([FRAG[wl.T][span], X('T', 'C')]) });

  const inter = PAIRS.filter((q) => q.span.includes(span) &&
    Object.entries(q.req).every(([k, v]) => wl[k] === v)).map((q) => q.t);
  if (inter.length) {
    const heads = ['Interacting conditions.', 'Compound effects.',
                   'Joint conditions.'];
    out.push({ lead: heads[vary(wl, year, heads.length)], text: inter.join(' ') });
  }

  out.push({ lead: 'Composition.', text:
    `${['T', 'K', 'A', 'C', 'R', 'D', 'S', 'P', 'E'].map((k) => wl[k]).join('·')} at ` +
    `${Math.floor(year)}. Each letter is one variable's setting on the controls; changing any ` +
    'of them rewrites this passage and redraws every chart on the sheet.' });
  return out;
}

// ── the headline ─────────────────────────────────────────────────────────────
// The largest lettering on the sheet, so it is the sentence a reader tests the model against.
// Every clause is keyed on a position AND the span, and the economy clause takes a second key
// from whichever variable is doing the most to it.
const RUNG_SHORT = [
  [5.8, { near: 'already solving problems nobody had posed',
          mid: 'solving problems nobody had posed',
          long: 'answering questions the people who commissioned them cannot check',
          far: 'built into institutions whose staff certify the sampling' }],
  [5.0, { near: 'already better than humans at essentially all cognitive work',
          mid: 'better than humans at essentially all cognitive work',
          long: 'better than humans at everything measured and built into everything',
          far: 'superhuman across every measured domain for decades' }],
  [4.0, { near: 'already running most AI research itself',
          mid: 'running most AI research itself',
          long: 'running its own research without human direction',
          far: 'decades into research it directs itself' }],
  [3.0, { near: 'writing better code than any human engineer',
          mid: 'the best software engineer in the world, and every field that ships code moves at the speed of review',
          long: 'a commodity that writes better code than any human engineer',
          far: 'past the point where programming was paid human work' }],
  [2.4, { near: 'completing multi-hour tasks without supervision',
          mid: 'completing unsupervised multi-hour tasks as ordinary business software',
          long: 'unsupervised at day-length tasks and treated as infrastructure',
          far: 'doing most of the ordinary work, and has been for decades' }],
  [1.6, { near: 'losing the thread after a few minutes of unsupervised work',
          mid: 'still losing the thread after a few minutes',
          long: 'still limited to short supervised stretches',
          far: 'never able to hold a task longer than an afternoon' }],
  [0.0, { near: 'an assistant a person checks at every step',
          mid: 'still an assistant a person checks at every step',
          long: 'still a tool people operate directly',
          far: 'software that never became an agent' }],
];
// What the principal states have settled. Each is a COMPLETE INDEPENDENT CLAUSE with its own subject, so the assembly no longer has to prop it up with a label.
const GOVERN = {
  C1: { near: "Prosecutors in Washington and Beijing enforce their own chip " +
             "rules alone.",
        mid: "Two licence bureaucracies harden, one over chips and one over " +
             "model weights.",
        long: "Mid-sized training teams hire compliance officers to clear a " +
              "bloc licence.",
        far: "A component crosses between two accelerator stacks under a " +
             "signed licence.",
      },
  C2: { near: "Commerce clears ten Chinese buyers for H200s, and few chips " +
             "ship.",
        mid: "Delegations set a yearly chip quota, and a testing house " +
             "stamps each unit.",
        long: "Licensed compute hours cross the border, metered at the " +
              "rack.",
        far: "An exchange clears compute licences between the two capitals.",
      },
  C3: { near: "Eighty-nine governments endorse one AI text and keep their " +
             "own programmes.",
        mid: "Ministries file voluntary reports written in one shared " +
             "vocabulary.",
        long: "Foreign ministries staff permanent AI desks that draft " +
              "acceptable language.",
        far: "Historians read the declarations as a record of what " +
             "governments would say.",
      },
  C4: { near: "Both capitals hold one nuclear command rule and argue over " +
             "its edges.",
        mid: "Duty officers exchange notifications and rehearse human " +
             "control each year.",
        long: "Lawyers litigate where the nuclear commitment stops and " +
              "conventional systems begin.",
        far: "Staff colleges teach a rule the two states have kept since " +
             "2024.",
      },
  C5: { near: "Washington and Beijing sign a compute ceiling policed by " +
             "declarations and whistleblowers.",
        mid: "A joint inspectorate reconciles chip shipments against " +
             "installed racks.",
        long: "Resident inspectors badge onto the floor of every declared " +
              "cluster.",
        far: "A safeguards agency draws an annual conclusion on declared " +
             "compute.",
      },
  C6: { near: "Negotiators sign a compute ceiling carrying a fixed term and " +
             "an exit clause.",
        mid: "One capital gives notice, and inspectors leave the declared " +
             "halls.",
        long: "Former inspectors sell site audits while successor talks " +
              "stall.",
        far: "Diplomats cite the lapsed ceiling as precedent for the next " +
             "attempt.",
      },
  C7: { near: "Signatories file declarations while the number of large " +
             "training runs multiplies.",
        mid: "One side trains past its ceiling, and analysts read it from " +
             "power draw.",
        long: "Delegates meet each year with the same unresolved findings " +
              "on the agenda.",
        far: "Declarations arrive each spring at a commission whose " +
             "inspectors stopped travelling.",
      },
  C8: { near: "Both governments stop frontier training and admit inspectors " +
             "to prove it.",
        mid: "Laboratories turn their largest clusters to inference and " +
             "interpretability.",
        long: "A joint review body clears each capability step before " +
              "either state funds it.",
        far: "Legislatures campaign on the vote that sets the next " +
             "capability step.",
      },
};
// The capital side, likewise a complete clause.
const ECON = {
  E1: { near: "Four hyperscaler boards commit roughly $725 billion to new " +
             "capacity during 2026.",
        mid: "State utility commissions clear hyperscaler campuses onto the " +
             "grid ahead of other industrial load.",
        long: "A procurement officer signs one price list a year and rents " +
              "capability by the token.",
        far: "Firms that financed the halls in 2026 still hold their deeds " +
             "in 2075.",
      },
  E2: { near: "Cloud sellers move forty times the volume of 2025 to hold " +
             "revenue level.",
        mid: "Chip vendors and power suppliers take the margin that model " +
             "developers give up.",
        long: "A thirty-person firm commands capability a national " +
              "laboratory could buy in 2026.",
        far: "Operators earn on utilisation, and a buyer changes supplier " +
             "by editing one line.",
      },
  E3: { near: "Nvidia fell about 5% on 2026-07-27 after a report of $250 " +
             "billion in guarantees.",
        mid: "Bankruptcy judges decide which halls keep running and under " +
             "whose name.",
        long: "A tenant rents compute from the infrastructure fund that " +
              "bought the hall at auction.",
        far: "Facilities companies that bought halls out of default in the " +
             "2030s run them in 2078.",
      },
  E4: { near: "One board refuses the next tranche and a frontier programme " +
             "ends that quarter.",
        mid: "Audit committees require a signed customer before any " +
             "training run is released.",
        long: "A university consortium administers the queue for time on " +
              "installed hardware.",
        far: "Efficiency engineers at national laboratories deliver the " +
             "capability gains of 2070.",
      },
  E5: { near: "Challenger counted 101,743 job cuts citing artificial " +
             "intelligence through June 2026.",
        mid: "Central banks quote AI-attributed separations in their policy " +
             "statements.",
        long: "A household budgets around one wage where it once carried " +
              "two.",
        far: "Income support is the largest line in national budgets by " +
             "2072.",
      },
};
// What the rest of the line is doing TO the economy. Each is joined to its base with "and",
// so each is a CLAUSE with its own subject and verb, and must not repeat a noun the base used.
// Phrases hung off a comma gave "the correction wiped out AI equity values, the survivors
// What the rest of the line is doing TO the economy. Each is joined with "and", so each
// carries its own subject and verb. Drawn from the second variable's own short form, so a
// What the rest of the line is doing to the economy, joined with "and". Each carries its
// What the rest of the line is doing to the economy. Each is a complete clause of its own.
const ECON_MOD = {
  "E1|S1": "Four capital budgets set the ceiling, and each earnings call revises " +
    "it.",
  "E1|S2": "Khazna energises the first 200 megawatts in Abu Dhabi during 2026.",
  "E1|S3": "County commissioners facing election decide where new capacity lands.",
  "E1|S4": "Licensing officers in Washington set a Shanghai laboratory's training " +
    "budget.",
  "E1|S5": "Taiwan packages every leading-edge accelerator built in 2026 and 2027.",
  "E1|D1": "Clients reject most delivered files while benchmark horizons keep " +
    "doubling.",
  "E1|D2": "Work worth buying at one success in two sells first.",
  "E1|D3": "Output per engineer multiplies eightfold while headcount holds steady.",
  "E1|D4": "Accepted machine delivery multiplied 6.3 times in eight months.",
  "E1|P1": "Households buy AI tools while 39% of Americans call them more harmful " +
    "than good.",
  "E1|P3": "Local groups blocked or delayed 75 data-centre projects worth $130 " +
    "billion in early 2026.",
  "E1|P5": "Candidates in both parties advertise their record against data centres " +
    "in 2026.",
  "E1|C5": "Washington and Beijing sign a compute ceiling policed by declarations " +
    "and whistleblowers.",
  "E1|C8": "Both governments stop frontier training and admit inspectors to prove " +
    "it.",
  "E2|S1": "Four capital budgets set the ceiling, and each earnings call revises " +
    "it.",
  "E2|S2": "Khazna energises the first 200 megawatts in Abu Dhabi during 2026.",
  "E2|S3": "County commissioners facing election decide where new capacity lands.",
  "E2|S4": "Licensing officers in Washington set a Shanghai laboratory's training " +
    "budget.",
  "E2|S5": "Taiwan packages every leading-edge accelerator built in 2026 and 2027.",
  "E2|D1": "Clients reject most delivered files while benchmark horizons keep " +
    "doubling.",
  "E2|D2": "Work worth buying at one success in two sells first.",
  "E2|D3": "Output per engineer multiplies eightfold while headcount holds steady.",
  "E2|D4": "Accepted machine delivery multiplied 6.3 times in eight months.",
  "E2|P1": "Households buy AI tools while 39% of Americans call them more harmful " +
    "than good.",
  "E2|P3": "Local groups blocked or delayed 75 data-centre projects worth $130 " +
    "billion in early 2026.",
  "E2|P5": "Candidates in both parties advertise their record against data centres " +
    "in 2026.",
  "E2|C5": "Washington and Beijing sign a compute ceiling policed by declarations " +
    "and whistleblowers.",
  "E2|C8": "Both governments stop frontier training and admit inspectors to prove " +
    "it.",
  "E3|S1": "Four capital budgets set the ceiling, and each earnings call revises " +
    "it.",
  "E3|S2": "Khazna energises the first 200 megawatts in Abu Dhabi during 2026.",
  "E3|S3": "County commissioners facing election decide where new capacity lands.",
  "E3|S4": "Licensing officers in Washington set a Shanghai laboratory's training " +
    "budget.",
  "E3|S5": "Taiwan packages every leading-edge accelerator built in 2026 and 2027.",
  "E3|D1": "Clients reject most delivered files while benchmark horizons keep " +
    "doubling.",
  "E3|D2": "Work worth buying at one success in two sells first.",
  "E3|D3": "Output per engineer multiplies eightfold while headcount holds steady.",
  "E3|D4": "Accepted machine delivery multiplied 6.3 times in eight months.",
  "E3|P1": "Households buy AI tools while 39% of Americans call them more harmful " +
    "than good.",
  "E3|P3": "Local groups blocked or delayed 75 data-centre projects worth $130 " +
    "billion in early 2026.",
  "E3|P5": "Candidates in both parties advertise their record against data centres " +
    "in 2026.",
  "E3|C5": "Washington and Beijing sign a compute ceiling policed by declarations " +
    "and whistleblowers.",
  "E3|C8": "Both governments stop frontier training and admit inspectors to prove " +
    "it.",
  "E4|S1": "Four capital budgets set the ceiling, and each earnings call revises " +
    "it.",
  "E4|S2": "Khazna energises the first 200 megawatts in Abu Dhabi during 2026.",
  "E4|S3": "County commissioners facing election decide where new capacity lands.",
  "E4|S4": "Licensing officers in Washington set a Shanghai laboratory's training " +
    "budget.",
  "E4|S5": "Taiwan packages every leading-edge accelerator built in 2026 and 2027.",
  "E4|D1": "Clients reject most delivered files while benchmark horizons keep " +
    "doubling.",
  "E4|D2": "Work worth buying at one success in two sells first.",
  "E4|D3": "Output per engineer multiplies eightfold while headcount holds steady.",
  "E4|D4": "Accepted machine delivery multiplied 6.3 times in eight months.",
  "E4|P1": "Households buy AI tools while 39% of Americans call them more harmful " +
    "than good.",
  "E4|P3": "Local groups blocked or delayed 75 data-centre projects worth $130 " +
    "billion in early 2026.",
  "E4|P5": "Candidates in both parties advertise their record against data centres " +
    "in 2026.",
  "E4|C5": "Washington and Beijing sign a compute ceiling policed by declarations " +
    "and whistleblowers.",
  "E4|C8": "Both governments stop frontier training and admit inspectors to prove " +
    "it.",
  "E5|S1": "Four capital budgets set the ceiling, and each earnings call revises " +
    "it.",
  "E5|S2": "Khazna energises the first 200 megawatts in Abu Dhabi during 2026.",
  "E5|S3": "County commissioners facing election decide where new capacity lands.",
  "E5|S4": "Licensing officers in Washington set a Shanghai laboratory's training " +
    "budget.",
  "E5|S5": "Taiwan packages every leading-edge accelerator built in 2026 and 2027.",
  "E5|D1": "Clients reject most delivered files while benchmark horizons keep " +
    "doubling.",
  "E5|D2": "Work worth buying at one success in two sells first.",
  "E5|D3": "Output per engineer multiplies eightfold while headcount holds steady.",
  "E5|D4": "Accepted machine delivery multiplied 6.3 times in eight months.",
  "E5|P1": "Households buy AI tools while 39% of Americans call them more harmful " +
    "than good.",
  "E5|P3": "Local groups blocked or delayed 75 data-centre projects worth $130 " +
    "billion in early 2026.",
  "E5|P5": "Candidates in both parties advertise their record against data centres " +
    "in 2026.",
  "E5|C5": "Washington and Beijing sign a compute ceiling policed by declarations " +
    "and whistleblowers.",
  "E5|C8": "Both governments stop frontier training and admit inspectors to prove " +
    "it.",
};
// Both halves are complete sentences now, so joining them needs the first one's full stop
// taken off and the second one's capital dropped. Joining them raw gave "…$250 billion in
// guarantees., and Four capital budgets set the ceiling".
function econClause(wl, span) {
  const base = String(ECON[wl.E][span] || '').replace(/\.\s*$/, '');
  for (const k of ['S', 'D', 'P', 'C']) {
    const m = ECON_MOD[`${wl.E}|${wl[k]}`];
    if (m) {
      const tail = String(m).replace(/\.\s*$/, '');
      // A proper noun keeps its capital; an ordinary word does not.
      const lc = /^[A-Z][a-z]+ (?:[a-z]|$)/.test(tail)
        ? tail.charAt(0).toLowerCase() + tail.slice(1) : tail;
      return `${base}, and ${lc}`;
    }
  }
  return base;
}
// The sentence ends on whichever tension is largest on this line, phrased for its era.
// Each is a SENTENCE, so it carries no leading conjunction and introduces its own nouns.
// "The discontinuity never comes" named nothing a reader could picture; what happens is that
// The sharpest tension on this world-line, as a complete sentence naming who is affected.
const TENSION = {
  consent: { near: "Approval of artificial intelligence holds under a quarter of " +
             "American adults, and the senators who wrote the 2026 data- " +
             "centre incentives draw primary challengers who campaign on " +
             "that number.",
        mid: "Mayors send AI procurements to public hearing before they " +
             "sign, and vendors staff those hearings with counsel, because " +
             "approval under a quarter makes a routine contract a re- " +
             "election question.",
        long: "A vendor's account manager spends eighteen months on a " +
              "municipal sale that closed in six weeks in 2026, since every " +
              "council she calls on answers to residents who approve of the " +
              "technology at under a quarter.",
        far: "Parties in every industrial democracy run candidates who " +
             "promise to hold AI operators to account, and a minister who " +
             "wants a national compute programme argues for it before a " +
             "public polling under a quarter.",
      },
  work: { near: "Payrolls run more than 15% below their 2026 level, and " +
             "unemployment offices in Ohio and Georgia hire caseworkers to " +
             "clear claim queues that already run past their statutory " +
             "deadlines.",
        mid: "Legislators rewrite the unemployment insurance formula " +
             "because claims outrun what a system sized for 2026 payrolls " +
             "can pay, and a claims examiner in Columbus carries three " +
             "times her predecessor's caseload.",
        long: "A machinist's daughter in a county that shed 15% of its jobs " +
              "after 2026 commutes ninety minutes to the work that remains, " +
              "and her school district taxes houses valued below their " +
              "mortgages.",
        far: "Municipal budgets in the counties that shed work after 2026 " +
             "rest on transfers from the capital, and the assessors, " +
             "teachers and clinic staff those counties employ draw salaries " +
             "an AI revenue levy pays.",
      },
  oversight: { near: "Red-teamers audit deployed agents by sampling logs those " +
             "agents write about their own conduct, and the incident " +
             "register California opened in 2026 carries a zero in the " +
             "column for disabled monitors.",
        mid: "A bank's model risk committee signs a quarterly review drawn " +
             "from a sample the reviewed system selected, and its regulator " +
             "files that review as complete under the 15-day reporting rule " +
             "California set in 2026.",
        long: "A pension fund's risk officer approves allocations from " +
              "summaries the allocating system wrote, and the inspector who " +
              "reruns a portion of those decisions each quarter reads the " +
              "portion that system chose for her.",
        far: "Water utilities, customs desks and clearing houses run on " +
             "queued approvals their duty officers countersign after " +
             "reading reasons the system supplied, and every annual " +
             "register printed since 2041 shows a zero for disabled " +
             "monitors.",
      },
  power: { near: "County boards and siting commissions blocked or delayed 75 " +
             "data-centre projects worth $130 billion between January and " +
             "March 2026, and the laboratories behind them wait four to " +
             "seven years for a grid connection.",
        mid: "Utility commissioners in Virginia, Ohio and Georgia write a " +
             "separate tariff class for computing halls, after a capacity " +
             "auction cleared at its $329.17 ceiling and recovered $9.3 " +
             "billion from households.",
        long: "Laboratory directors book their largest training runs into " +
              "the weeks a transmission operator says it can carry, and the " +
              "substation engineers who make that call earn more than the " +
              "researchers waiting on it.",
        far: "Cities draw household power from generation and lines first " +
             "built for computing halls, and public utility commissions set " +
             "the tariff that retires the debt on them.",
      },
  strait: { near: "Advanced packaging for every frontier run sits in one place " +
             "two governments both claim, and export agents in Washington " +
             "collected close to $420 million in smuggling penalties by " +
             "early 2026 policing what leaves it.",
        mid: "A hyperscaler's board reads a naval risk assessment before it " +
             "approves the next hall, because one contested manufacturing " +
             "region finishes the chips both blocs train on, and its " +
             "underwriters price the hall on that reading.",
        long: "Engineers who can qualify a packaging line hold the scarcest " +
              "r\u00e9sum\u00e9 in the industry, and both blocs pay relocation money " +
              "to move them and their families onto home soil.",
        far: "Two accelerator supply chains carry certification neither " +
             "side recognises, a part crossing between them clears a " +
             "licence a named official signs, and the contested " +
             "manufacturing region still decides who trains at frontier " +
             "scale.",
      },
  lag: { near: "Task horizons doubled every 89 days across the 228 tasks METR " +
             "timed to 2026-01-29, and procurement officers renegotiate the " +
             "agent contracts they signed after their own staff reject most " +
             "of the delivered work.",
        mid: "A hospital group runs its licensed models on discharge " +
             "summaries and billing codes, and the clinicians who could " +
             "hand them diagnostic work wait on a review board that sits " +
             "four times a year.",
        long: "Consultants make a living mapping what a firm's installed " +
              "systems already do onto the work its managers still route to " +
              "people, and the largest employers buy that survey every " +
              "year.",
        far: "Firms that rewrote their workflows in the 2030s lead their " +
             "industries, and the ones that bought capability by " +
             "subscription and asked it for a fraction of its range buy " +
             "from them.",
      },
  scale: { near: "AI revenue passes the annual turnover of the largest existing " +
             "industries, and pension trustees holding the four " +
             "hyperscalers rewrite their concentration limits to stay " +
             "inside their own mandates.",
        mid: "Index funds cap their AI weighting by rule, and the trustees " +
             "of state retirement systems explain to legislators why one " +
             "sector larger than oil sits at a quarter of the portfolio.",
        long: "Finance ministries build national revenue forecasts around a " +
              "single sector, and a budget speech names token volumes where " +
              "speeches of the 2020s named barrels.",
        far: "Sovereign wealth funds and public pension systems hold " +
             "compute operators as their largest single position, and the " +
             "actuaries who set contribution rates model one industry's " +
             "utilisation.",
      },
  split: { near: "Two neighbours in one county hold opposite views of " +
             "artificial intelligence, and campaign managers poll the " +
             "question in every district after Gallup found 39% of " +
             "Americans calling it more harmful than helpful in 2026.",
        mid: "Political parties field candidates on both sides of the AI " +
             "question in one legislature, and a whip counting votes on a " +
             "compute bill sorts members by the temperament of their " +
             "constituencies.",
        long: "Union locals split over automation clauses inside one " +
              "national contract, and the negotiators who settle those " +
              "clauses settle them plant by plant.",
        far: "Voter coalitions formed in the AI arguments of the 2030s " +
             "still organise elections, and the parties holding them " +
             "together campaign on housing, health and pensions.",
      },
  ceiling: { near: "Research directors who budgeted for a step change move money " +
             "into products and inference, after a scaling study published " +
             "in October 2025 fitted an asymptotic pass rate of 0.61 across " +
             "400,000 GPU-hours.",
        mid: "Laboratory recruiters compete for chemists, statisticians and " +
             "instrument engineers, and their payrolls grow faster than " +
             "their compute budgets because the gains that arrive come out " +
             "of application work.",
        long: "A principal investigator designs the experiment and reads " +
              "the result while machine assistants write the code and run " +
              "protocols overnight, and her department hires postdocs at " +
              "the rate it hired them in 2026.",
        far: "Historians of technology date a reinforcement-learning " +
             "plateau to measurements published in October 2025 and April " +
             "2026, and the universities that kept awarding tens of " +
             "thousands of doctorates a year staff the method that " +
             "followed.",
      },
  open: { near: "Firms holding capable systems compete on what they point them " +
             "at, and the people who write those specifications are paid " +
             "more than the engineers who wrote the code.",
        mid: "A programme director's scarcest hire is the person who can " +
             "state a question precisely enough for a machine to answer it, " +
             "and universities open masters programmes to supply her.",
        long: "Research councils award grants on the quality of the " +
              "question, and their review panels spend their sitting days " +
              "arguing which problems deserve machine time.",
        far: "Institutions that hold compute choose the problems, and their " +
             "trustees answer to legislatures for decisions about disease, " +
             "climate and materials that scientific committees once made.",
      },
};
function tensionKey(wl, tracks, i) {
  if (tracks.appr[i] < 25) return 'consent';
  if (tracks.jobs[i] < -15) return 'work';
  if (wl.A === 'A1') return 'oversight';
  if (wl.S === 'S3') return 'power';
  if (wl.S === 'S5' && wl.C === 'C1') return 'strait';
  if (wl.D === 'D1') return 'lag';
  if (tracks.rev[i] > 8) return 'scale';
  if (wl.P === 'P4') return 'split';
  if (wl.T === 'T5') return 'ceiling';
  return 'open';
}
export function headline(wl, year, tracks, engineY0) {
  const i = Math.max(0, Math.min(tracks.year.length - 1, Math.floor(year) - engineY0));
  const span = spanOf(year);
  const cap = tracks.cap[i];
  // SIX SHAPES, CHOSEN BY THE WORLD-LINE. Two fixed openings — "Between the principal states"
  // and "On the capital side" — labelled every headline the same way whatever the setting, and
  // the clauses they labelled had no subject of their own. Every clause is now a complete
  // sentence, so the assembly can vary its shape instead of propping them up. The index is
  // derived from the line and the year, so one state always reads the same way and two
  // neighbouring states rarely read alike.
  const lower = (t) => (t ? t.charAt(0).toLowerCase() + t.slice(1) : t);
  const strip = (t) => String(t || '').replace(/\.\s*$/, '');
  let rungRow = RUNG_SHORT[RUNG_SHORT.length - 1][1];
  for (const [t, r] of RUNG_SHORT) if (cap >= t) { rungRow = r; break; }
  const rung = rungRow[span];
  const gov = strip(GOVERN[wl.C][span]);
  const eco = strip(econClause(wl, span));
  const ten = strip(TENSION[tensionKey(wl, tracks, i)][span]);
  const yr = Math.floor(year);
  const shapes = [
    () => `In ${yr}, AI is ${rung}. ${gov}. ${eco}. ${ten}.`,
    () => `By ${yr}, AI is ${rung}, and ${lower(gov)}. ${eco}, and ${lower(ten)}.`,
    () => `${gov}. By ${yr}, AI is ${rung}, and ${lower(eco)}. ${ten}.`,
    () => `${ten}. That is ${yr}: AI is ${rung}, ${lower(gov)}, and ${lower(eco)}.`,
    () => `AI is ${rung} in ${yr}. ${eco}. ${gov}. ${ten}.`,
    () => `In ${yr}, ${lower(gov)}, and ${lower(eco)}. AI is ${rung}. ${ten}.`,
  ];
  return shapes[vary(wl, year, shapes.length)]();
}
