// AI FUTURES FORECASTER — THE RECORD, 2012 to today
//
// Everything left of TODAY on the chart is history, and until now the document described it
// with the same machinery it uses for futures: a forecast paragraph keyed on a world-line that
// had not yet been decided. Dragging the index to 2017 produced a sentence about what the
// settings imply, in the present tense, for a year whose outcome is on the record.
//
// A past year is not a distribution. It gets what actually happened, at the same level of
// detail the forecast years get: dated events, what each established, and the capability index
// the trunk records for that year.
//
// EVERY ENTRY IS A FACT WITH A DATE. Where the month is known it is stated. `y` is the decimal
// year the event is plotted at; `lane` decides which paragraph it lands in, matching the four
// paragraphs the forecast passage uses; `t` is what happened; `m` is what it established for
// the forecast — the reason the entry is in a forecasting document rather than a chronology.

export const LANES = ['capability', 'buildout', 'capital', 'oversight'];

export const RECORD = [
  // ── the deep-learning turn ────────────────────────────────────────────────
  { y: 2012.75, lane: 'capability', k: 'AlexNet',
    t: 'AlexNet won the ImageNet competition in October 2012 with a top-five error of 15.3% ' +
       'against 26.2% for the runner-up, trained on two consumer graphics cards.',
    m: 'Set the pattern the ladder measures: a general method plus more compute beating ' +
       'hand-built features.' },
  { y: 2014.05, lane: 'capital', k: 'DeepMind acquired',
    t: 'Google acquired DeepMind in January 2014 for a reported $500 million, with about ' +
       'fifty staff and no product.',
    m: 'The first time frontier research was priced as a strategic asset rather than a cost.' },
  { y: 2015.95, lane: 'buildout', k: 'OpenAI founded',
    t: 'OpenAI was founded in December 2015 as a non-profit, with $1 billion pledged.',
    m: 'Established the lab-as-institution model that every later governance question is ' +
       'addressed to.' },
  { y: 2016.2, lane: 'capability', k: 'AlphaGo',
    t: 'AlphaGo beat Lee Sedol 4–1 in March 2016, ten years earlier than most expert ' +
       'estimates for the game.',
    m: 'The first widely-registered case of expert forecasts about a capability being wrong ' +
       'by a decade in the fast direction.' },
  { y: 2017.5, lane: 'capability', k: 'Transformer',
    t: '"Attention Is All You Need" was published in June 2017, replacing recurrence with ' +
       'attention and making training parallel across a sequence.',
    m: 'The architecture every frontier system on this chart is still built from.' },
  { y: 2017.55, lane: 'buildout', k: 'China national plan',
    t: "China's State Council published the New Generation AI Development Plan in July 2017, " +
       'setting a target of world leadership by 2030.',
    m: 'Made frontier AI an explicit object of state industrial policy, which is the ' +
       'condition the coordination axis describes.' },
  { y: 2018.9, lane: 'capability', k: 'BERT and transfer',
    t: 'BERT was published in October 2018 and pre-training then fine-tuning became the ' +
       'standard recipe across language tasks.',
    m: 'Established that one pre-trained model could be adapted to many tasks, which is what ' +
       'makes a general capability index meaningful.' },
  { y: 2019.1, lane: 'oversight', k: 'GPT-2 staged release',
    t: 'OpenAI withheld the full GPT-2 weights in February 2019, citing misuse risk, and ' +
       'released them in stages over nine months.',
    m: 'The first release decision argued in public on safety grounds, and the origin of the ' +
       'staged-release norm.' },
  { y: 2019.55, lane: 'capital', k: 'Microsoft and OpenAI',
    t: 'Microsoft invested $1 billion in OpenAI in July 2019 and became its exclusive cloud ' +
       'provider.',
    m: 'Bound frontier research to hyperscaler balance sheets, the arrangement the economy ' +
       'axis is about.' },
  { y: 2020.05, lane: 'capability', k: 'Scaling laws',
    t: 'Kaplan and colleagues published neural scaling laws in January 2020: loss falls as a ' +
       'power law in compute, data and parameters, across seven orders of magnitude.',
    m: 'Turned capability from a research question into a budgeting one, which is why compute ' +
       'is the supply variable on this sheet.' },
  { y: 2020.45, lane: 'capability', k: 'GPT-3',
    t: 'GPT-3 was published in May 2020 at 175 billion parameters and performed tasks from ' +
       'instructions alone, without task-specific training.',
    m: 'First demonstration that scale alone produced capabilities nobody had trained for.' },
  { y: 2020.92, lane: 'capability', k: 'AlphaFold 2',
    t: 'AlphaFold 2 reached experimental accuracy at CASP14 in November 2020, on a problem ' +
       'open for fifty years.',
    m: 'Evidence that the method transfers to natural science, which the novel-science domain ' +
       'on the ladder tracks.' },
  { y: 2021.6, lane: 'capability', k: 'Codex and Copilot',
    t: 'OpenAI released Codex and GitHub launched Copilot in 2021, putting code generation ' +
       'into daily professional use.',
    m: 'Opened the coding domain, which is the hinge rung: once it is passed, AI research ' +
       'itself compounds.' },
  { y: 2022.25, lane: 'capability', k: 'Chinchilla',
    t: 'The Chinchilla result in March 2022 showed the models of the day were badly ' +
       'undertrained for their size, and that data and parameters should scale together.',
    m: 'Re-priced the whole frontier: the same capability for less compute, and the first ' +
       'sign that the scaling budget itself was an open research question.' },
  { y: 2022.92, lane: 'capability', k: 'ChatGPT',
    t: 'ChatGPT was released on 30 November 2022 and reached an estimated hundred million ' +
       'users within two months.',
    m: 'The step the trunk records as the largest single jump in the index, and the reason ' +
       'every other axis on this sheet has a public dimension.' },

  // ── the frontier era ──────────────────────────────────────────────────────
  { y: 2023.2, lane: 'capability', k: 'GPT-4',
    t: 'GPT-4 was released in March 2023, passing professional examinations near the top of ' +
       'the human range, and its technical report withheld architecture and training data.',
    m: 'Where capability disclosure stopped, which is why later governance is argued over ' +
       'evaluations rather than papers.' },
  { y: 2023.83, lane: 'buildout', k: 'Executive order 14110',
    t: 'US executive order 14110 was signed on 30 October 2023, requiring safety-test ' +
       'reporting for models above a compute threshold.',
    m: 'The first compute threshold written into law anywhere, and the template later ' +
       'thresholds argue with.' },
  { y: 2023.84, lane: 'oversight', k: 'Bletchley',
    t: 'Twenty-eight countries and the EU signed the Bletchley Declaration on 1 November ' +
       '2023, the first joint statement on frontier risk to include both the US and China.',
    m: 'Established the summit series that still carries international coordination, and the ' +
       'base rate for what such agreements do and do not bind.' },
  { y: 2024.25, lane: 'buildout', k: 'EU AI Act',
    t: 'The European Parliament adopted the AI Act in March 2024 and it entered into force on ' +
       '1 August 2024, with obligations phased to 2027.',
    m: 'The first comprehensive statute, and the reason regional divergence is a live axis ' +
       'rather than a hypothetical.' },
  { y: 2024.7, lane: 'capability', k: 'Reasoning models',
    t: 'OpenAI released o1 in September 2024, trained to spend inference-time compute on a ' +
       'chain of reasoning before answering.',
    m: 'A second scaling axis independent of training compute, which is why the tempo axis ' +
       'has a fast branch the pre-2024 trend does not support.' },
  { y: 2024.78, lane: 'oversight', k: 'Nobel prizes',
    t: 'The 2024 Nobel prizes in physics and chemistry went to work on neural networks and on ' +
       'protein structure prediction.',
    m: 'Marks the point at which the field stopped being judged on promise.' },
  { y: 2025.06, lane: 'capital', k: 'DeepSeek R1',
    t: 'DeepSeek released R1 on 20 January 2025, matching frontier reasoning performance at a ' +
       'reported $5.6 million final training run. Nvidia fell about 17% on 27 January and US ' +
       'markets lost roughly a trillion dollars of value in a day.',
    m: 'The first demonstration that a frontier capability could be reproduced cheaply, which ' +
       'is the central uncertainty in every compute-based forecast including this one.' },
  { y: 2025.07, lane: 'capital', k: 'Stargate',
    t: 'The Stargate datacenter programme was announced on 21 January 2025 at $500 billion ' +
       'over four years, the day after R1.',
    m: 'Capital committed to scale in the same week scale was shown to be cheaper than ' +
       'assumed. Both bets are still running.' },
  { y: 2025.5, lane: 'capability', k: 'Agents in production',
    t: 'Through 2025 frontier labs shipped agents that browse, call tools, edit files and ' +
       'hold multi-step tasks, and coding benchmarks passed 77% on real repository issues.',
    m: 'The rung this document calls the reliable agent, reached in production rather than ' +
       'in a demonstration.' },
  { y: 2025.58, lane: 'buildout', k: 'GPAI obligations',
    t: "The EU AI Act's general-purpose model obligations applied from 2 August 2025, with a " +
       'code of practice for signatories.',
    m: 'First binding conduct rules on frontier developers anywhere.' },

  // ── the year in progress ──────────────────────────────────────────────────
  { y: 2026.08, lane: 'capital', k: 'Capital doubles again',
    t: 'The five largest US cloud and AI infrastructure providers guided to between $660 and ' +
       '$690 billion of capital spending for 2026, close to double 2025, about ' +
       'three-quarters of it AI infrastructure.',
    m: 'The build-out the supply axis is about, at a scale where electricity rather than ' +
       'money is the constraint.' },
  { y: 2026.14, lane: 'oversight', k: 'Safety report',
    t: 'The second International AI Safety Report was published in February 2026, written by ' +
       'more than a hundred researchers and backed by over thirty governments.',
    m: 'The standing scientific summary the alignment axis is scored against.' },
  { y: 2026.22, lane: 'buildout', k: 'Preemption framework',
    t: 'The White House issued a national AI legislative framework on 20 March 2026 calling ' +
       'on Congress to preempt state AI laws judged unduly burdensome.',
    m: 'The opening of the fight that decides whether the US has one AI regime or fifty.' },
  { y: 2026.31, lane: 'capital', k: 'Nvidia at $5 trillion',
    t: 'Nvidia closed at an all-time high on 24 April 2026 at a market capitalisation of ' +
       '$5.06 trillion. DeepSeek released V4 the same day, open-sourcing both checkpoints.',
    m: 'The concentration the supply axis measures, and the open-weight release that ' +
       'periodically threatens it, on one day.' },
  { y: 2026.33, lane: 'buildout', k: 'Defence agreements',
    t: 'The US Department of War finalised agreements with eight AI model and infrastructure ' +
       'companies on 1 May 2026.',
    m: 'Moves frontier capability inside a procurement relationship with the state, which is ' +
       'what the national-programme position describes.' },
  { y: 2026.37, lane: 'buildout', k: 'Colorado narrowed',
    t: 'Colorado repealed and replaced its AI act on 14 May 2026 with a narrower statute on ' +
       'automated decisions, effective 1 January 2027.',
    m: 'The first state to test a comprehensive AI statute and retreat from it before it ' +
       'took effect.' },
  { y: 2026.42, lane: 'buildout', k: 'Executive order and FERC',
    t: 'A June 2026 executive order directed frontier developers to give the federal ' +
       'government early access to new models. A FERC transmission waiver the same month ' +
       'cleared the last obstacle to restarting Three Mile Island Unit 1 for datacenter load.',
    m: 'Access to models and access to power, decided in the same month by the same ' +
       'government.' },
  { y: 2026.52, lane: 'capability', k: 'GPT-5.6',
    t: 'OpenAI released the GPT-5.6 family on 9 July 2026 in three tiers.',
    m: 'The current frontier the index reads at 2.6, and the reference point for every ' +
       'forecast to its right.' },
  { y: 2026.59, lane: 'buildout', k: 'Transparency obligations',
    t: "The EU AI Act's transparency obligations applied from 2 August 2026, and the " +
       'Commission began enforcing the general-purpose code of practice the same month. US ' +
       'states began repealing datacenter tax breaks.',
    m: 'Rules and costs arriving together, on the two axes this document keeps separate.' },
  { y: 2026.6, lane: 'oversight', k: 'Containment disclosures',
    t: "Britain's AI Security Institute reported a containment finding on 4 August 2026, " +
       'alongside disclosures from OpenAI and Anthropic.',
    m: 'The kind of finding the alignment axis is scored on, arriving through an institute ' +
       'rather than through a lab.' },
];

// ── what the record says at a given year ────────────────────────────────────
// A window rather than an exact match: a reader on 2018 should be told what 2018 settled,
// and given the run-up that produced it. The window is stated in the prose so the reader
// knows what span the paragraph covers.
export function recordAt(year, span = 1.2) {
  const y = Number(year);
  return RECORD.filter((e) => Math.abs(e.y - y) <= span)
    .sort((a, b) => Math.abs(a.y - y) - Math.abs(b.y - y));
}
export function recordBefore(year) {
  return RECORD.filter((e) => e.y <= Number(year)).sort((a, b) => b.y - a.y);
}
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
               'August', 'September', 'October', 'November', 'December'];
export function whenOf(e) {
  const m = Math.min(11, Math.max(0, Math.floor((e.y % 1) * 12)));
  return `${MONTH[m]} ${Math.floor(e.y)}`;
}

// ── the passage for a recorded year ─────────────────────────────────────────
// Composed from the record, in the same four paragraphs the forecast uses, so the document
// reads the same way on both sides of TODAY. What differs is the tense and the source: a
// forecast paragraph states what a sampled world-line implies, and a record paragraph states
// what happened, with dates.
const LEAD = {
  capability: 'System capabilities.',
  buildout: 'Build-out and governance.',
  capital: 'Capital and employment.',
  oversight: 'Oversight and public opinion.',
};
const NOTHING = {
  capability: 'No capability step this document tracks falls in these years.',
  buildout: 'No build-out or governance step this document tracks falls in these years.',
  capital: 'No capital step this document tracks falls in these years.',
  oversight: 'No oversight step this document tracks falls in these years.',
};

export function describeRecord(year, trunkCap) {
  const yr = Math.floor(year);
  const near = recordAt(year, 1.4);
  const out = [];
  const cap = trunkCap ? trunkCap(year) : null;
  for (const lane of LANES) {
    const mine = near.filter((e) => e.lane === lane).slice(0, 2);
    const bits = [];
    if (lane === 'capability' && cap != null) {
      bits.push(`The capability index stands at ${cap.toFixed(2)} on the scale ruled across ` +
                'this sheet, which is what the record supports for this date.');
    }
    if (!mine.length) bits.push(NOTHING[lane]);
    for (const e of mine) bits.push(`${e.t} ${e.m}`);
    out.push({ lead: LEAD[lane], text: bits.join(' ') });
  }
  // What the reader is looking at, said once: this is record, and the settings do not apply.
  const ahead = RECORD.filter((e) => e.y > year).length;
  out.push({ lead: 'Reading this date.',
    text: `${yr} is on the record, so nothing here is sampled and the controls do not ` +
          `change it. ${ahead} further recorded step${ahead === 1 ? '' : 's'} fall between ` +
          'this date and today; the forecast begins to the right of the TODAY rule.' });
  return out;
}

export function headlineRecord(year, trunkCap) {
  const yr = Math.floor(year);
  const near = recordAt(year, 1.0);
  const cap = trunkCap ? trunkCap(year) : null;
  const lead = near[0];
  const capBit = cap != null
    ? `the capability index reads ${cap.toFixed(2)}` : 'the record is thin here';
  if (!lead) {
    return `In ${yr}, ${capBit}, and no step this document tracks falls in the year.`;
  }
  // The headline names the event and what it established, because a date alone is a fact
  // without a consequence, and this sheet is about consequences.
  const second = near.find((e) => e.lane !== lead.lane);
  const parts = [`In ${yr}, ${capBit}.`, `${lead.t}`, `${lead.m}`];
  if (second) parts.push(`${second.t}`);
  return parts.join(' ');
}
