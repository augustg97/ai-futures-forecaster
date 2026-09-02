// AI FUTURES FORECASTER — the authored text behind the chronicle
//
// THE SHEET DESCRIBES THE LIKELIEST PATH AS A SEQUENCE OF DATED EVENTS THE MODEL GENERATES.
// Everything here is keyed to a thing the model emits — a template it instantiates, a milestone
// its capability path crosses, a position in its registry, a level a track passes — and says
// what that thing IS in the register of the record: who did what, to what, with what visible
// result, dated. `ledger.js` builds the ledger of a path from these tables and composes the
// headline and the passage from the ledger. Nothing here is chosen by a hash.
//
// This file replaced, on 2026-09-02, eight tables of authored vignettes keyed on position ×
// stage × alternative (HEADCL, FRAG, RUNG_SHORT, CROSS, ECON, ECON_MOD, TENSION, PAIRS: about
// 2,400 strings) and the stage clock that selected among them. The review of 2026-09-01 found
// that the passage they composed described one sampled path as fact, in vignettes no quantity
// had produced, hopping subjects from year to year while repeating each sentence 7.5 times.
// The plan of 2026-09-02 (Research/plan-2026-09-02-chronicle.md) is the design; its language
// standard governs every string below:
//
//   1. every noun phrase names its thing;  2. who, what and how much in every clause;
//   3. plain verbs;  4. one idea to a sentence, twenty-eight words at most;  5. a comparison
//   beside every figure;  6. explicit dates;  7. repetition bounded by rule;  8. template text
//   rewritten to this standard before it reaches the sheet, faithful to its source.
//
// Three forms per event: `t` says what happened, past tense, with the year in a `{year}` slot;
// `f` says the same as a lowercase clause the composer dates ("In 2036, …"); `m` says what it
// established. A position has one CRITERION sentence, present tense, the standing condition.

// ── the capability milestones the ledger names ───────────────────────────────
// Keyed by the ladder rung the capability path crosses. Rungs 3 and 4 are carried by the
// tied templates (sc-crossing, sar-crossing) when a path instantiates them, and by these when
// it does not; 5 and 6 have no template.
export const MILESTONE_TEXT = {
  3: { t: "Frontier systems passed the best human software engineers in {year}.",
       s: "Frontier systems passed the best human software engineers in {year}.",
       f: "frontier systems pass the best human software engineers",
       m: "Software ships at the speed of review, and the laboratories' own engineering runs " +
          "on machine-written code." },
  4: { t: "From {year} frontier systems ran the AI research loop end to end, without human " +
          "researchers.",
       s: "Frontier systems ran the AI research loop without human researchers from {year}.",
       f: "frontier systems run the AI research loop end to end, without human researchers",
       m: "Progress in AI stopped depending on the supply of human researchers." },
  5: { t: "From {year} frontier systems exceeded expert performance across every measured " +
          "field.",
       s: "Frontier systems exceeded expert performance across every measured field from " +
          "{year}.",
       f: "frontier systems exceed expert performance across every measured field",
       m: "People stay in the loop where a law requires a human signature." },
  6: { t: "From {year} frontier systems ran beyond every measured human benchmark.",
       s: "Frontier systems ran beyond every measured human benchmark from {year}.",
       f: "frontier systems run beyond every measured human benchmark",
       m: "What separates one future from another past this point is what the capability is " +
          "used for, which the other variables decide." },
};

// The capability domains the engine lamps, at their thresholds on the ladder. CODE (3.0) and
// R&D (4.0) are the milestones above and are not repeated.
export const DOMAIN_TEXT = {
  HACK:  { t: "From {year} AI systems found and chained software vulnerabilities at machine " +
              "speed, and cyber offence became a matter for governments.",
           s: "AI systems found and chained software vulnerabilities at machine speed from " +
              "{year}.",
           f: "AI systems find and chain software vulnerabilities at machine speed" },
  FCAST: { t: "From {year} governments and firms bought forecasting and planning from AI " +
              "advisers that out-predicted their own analysts.",
           s: "Governments and firms bought forecasting and planning from AI advisers from " +
              "{year}.",
           f: "governments and firms buy forecasting and planning from AI advisers that " +
              "out-predict their own analysts" },
  BIO:   { t: "From {year} AI designed biology to order, drug candidates in months, and " +
              "regulators gated every release on its misuse risk.",
           s: "AI designed biology to order from {year}, drug candidates in months.",
           f: "AI designs biology to order, drug candidates in months, and regulators gate " +
              "every release on its misuse risk" },
  POLIT: { t: "From {year} AI systems modelled people well enough to out-negotiate and " +
              "out-persuade them.",
           s: "AI systems out-negotiated and out-persuaded people from {year}.",
           f: "AI systems model people well enough to out-negotiate and out-persuade them" },
  ROBOT: { t: "From {year} robots ran on the same systems as the software, and factories, " +
              "farms and warehouses began to automate.",
           s: "Robots ran on the same systems as the software from {year}, and factories, " +
              "farms and warehouses began to automate.",
           f: "robots run on the same systems as the software, and factories, farms and " +
              "warehouses begin to automate" },
  SCI:   { t: "From {year} AI systems did research beyond the human frontier in physics, " +
              "materials and mathematics.",
           s: "AI systems did research beyond the human frontier in physics, materials and " +
              "mathematics from {year}.",
           f: "AI systems do research beyond the human frontier in physics, materials and " +
              "mathematics" },
};

// What systems do before any milestone is crossed, by the capability index.
export const LADDER_NOW = [
  [2.4, "AI agents complete tasks of a few hours on their own, and the best human software " +
        "engineers still out-program them"],
  [1.6, "AI agents work in short supervised bursts, and a person checks every step that " +
        "carries a cost"],
  [0,   "AI is an assistant that drafts, summarises and answers, and a person signs off " +
        "every step that carries a cost"],
];

// ── the event templates, rewritten to the standard ───────────────────────────
// Keyed by the engine's template id. The parent's own text is a summary register ("Europe
// faces its leverage moment over lithography and market access; the choice made in 2030 sets
// its decade"), so each is rewritten here, faithful to the template and to the source it
// cites. `lane` places the event in the passage.
export const TEMPLATE_TEXT = {
  'sc-crossing': { lane: 'capability',
    t: "Frontier systems passed the best human software engineers in {year}, and AI-run " +
       "engineering teams became the norm at the leading laboratories.",
    s: "Frontier systems passed the best human software engineers in {year}.",
    f: "frontier systems pass the best human software engineers",
    m: "Software ships at the speed of review, and the laboratories' own research compounds " +
       "on machine-written code." },
  'weights-theft': { lane: 'oversight',
    t: "In {year} a state actor exfiltrated a frontier laboratory's model weights.",
    s: "A state actor exfiltrated a frontier laboratory's model weights in {year}.",
    f: "a state actor exfiltrates a frontier laboratory's model weights",
    m: "Security requirements at every frontier laboratory rose a tier, and export politics " +
       "hardened." },
  'copyright-settles': { lane: 'oversight',
    t: "In {year} appellate courts settled training-data liability into a licensing regime.",
    s: "Appellate courts settled training-data liability into a licensing regime in {year}.",
    f: "appellate courts settle training-data liability into a licensing regime",
    m: "Developers pay for training data by licence, and the copyright question stopped " +
       "moving." },
  'preemption-fight': { lane: 'oversight',
    t: "In {year} Congress and the federal courts decided whether federal law preempts the " +
       "states' AI statutes.",
    s: "Congress and the federal courts ruled in {year} on whether federal law preempts the " +
       "states' AI statutes.",
    f: "Congress and the federal courts decide whether federal law preempts the states' AI " +
       "statutes",
    m: "Developers learned which rulebook binds a frontier release." },
  'agent-incident': { lane: 'oversight',
    t: "In {year} a deployed AI agent caused a headline incident with physical damage.",
    s: "A deployed AI agent caused a headline incident with physical damage in {year}.",
    f: "a deployed AI agent causes a headline incident with physical damage",
    m: "Authority to investigate AI incidents reached the legislative agenda." },
  'election-realign': { lane: 'oversight',
    t: "AI became a first-order electoral issue in the {year} cycle, and parties reorganised " +
       "around anti-AI and pro-abundance factions.",
    s: "AI became a first-order electoral issue in the {year} cycle.",
    f: "AI becomes a first-order electoral issue and parties reorganise around anti-AI and " +
       "pro-abundance factions",
    m: "Candidates now run on what they will do about AI." },
  'dc-siting-revolt': { lane: 'buildout',
    t: "In {year} data-centre siting revolts spread across states and provinces.",
    s: "Data-centre siting revolts spread across states and provinces in {year}.",
    f: "data-centre siting revolts spread across states and provinces",
    m: "Power, water and grid politics now decide where computing capacity can be built." },
  'bubble-correction': { lane: 'capital',
    variants: {
      survives: {
        t: "The AI investment boom broke in {year}: share prices of the data-centre builders " +
           "fell hard and some lenders took losses, but construction never stopped.",
        s: "The AI investment boom broke in {year} and construction never stopped.",
        f: "the AI investment boom breaks, valuations reset, and construction continues",
        m: "Capital for AI came dearer, and the halls already built kept running." },
      stalls: {
        t: "The AI investment boom broke in {year}: share prices of the data-centre builders " +
           "fell hard, some lenders took losses, and construction stalled.",
        s: "The AI investment boom broke in {year} and construction stalled.",
        f: "the AI investment boom breaks, valuations reset, and construction stalls",
        m: "Capital for AI came dearer, and half-built halls waited for buyers." } } },
  'us-cn-deal': { lane: 'buildout',
    t: "In {year} the United States and China concluded a verification-backed agreement to " +
       "avoid a race to superintelligence.",
    s: "The United States and China concluded a verification-backed agreement in {year} to " +
       "avoid a race to superintelligence.",
    f: "the United States and China conclude a verification-backed agreement to avoid a race " +
       "to superintelligence",
    m: "Research transparency between the two began, with inspectors on both sides." },
  'natsec-merge': { lane: 'buildout',
    t: "In {year} Washington merged frontier AI development into a national programme, with " +
       "clearances, secure facilities and Defense Production Act authorities at the " +
       "laboratories.",
    s: "Washington merged frontier AI development into a national programme in {year}.",
    f: "Washington merges frontier AI development into a national programme",
    m: "The leading laboratories answered to the federal government first and to their " +
       "customers second." },
  'eu-decision-point': { lane: 'buildout',
    t: "In {year} the European Union decided whether to use ASML's lithography monopoly and " +
       "access to its market as bargaining tools in AI negotiations with Washington and " +
       "Beijing.",
    s: "The European Union decided in {year} whether to use ASML's lithography monopoly and " +
       "its market access as bargaining tools.",
    f: "the European Union decides whether to use ASML's lithography monopoly and access to " +
       "its market as bargaining tools with Washington and Beijing",
    m: "That decision fixed Europe's position for the decade." },
  'pause-window': { lane: 'capability',
    t: "From {year} the laboratories held scaling at top-human-expert level under the " +
       "transparency regime while inspectors built the verification infrastructure.",
    s: "The laboratories held scaling at top-human-expert level from {year} while " +
       "inspectors built the verification infrastructure.",
    f: "the laboratories hold scaling at top-human-expert level under the transparency " +
       "regime",
    m: "Inspectors could verify what a laboratory trained before it trained it." },
  'sar-crossing': { lane: 'capability',
    t: "From {year} frontier systems ran the whole AI research loop themselves, without " +
       "human researchers.",
    s: "Frontier systems ran the whole AI research loop themselves from {year}.",
    f: "frontier systems run the whole AI research loop themselves, without human researchers",
    m: "Progress in AI stopped depending on the supply of human researchers." },
  'labor-constitution': { lane: 'capital',
    t: "In {year} the first wage-insurance programmes and dividends paid from AI revenue " +
       "became law.",
    s: "The first wage-insurance programmes and dividends paid from AI revenue became law " +
       "in {year}.",
    f: "the first wage-insurance programmes and dividends paid from AI revenue become law",
    m: "Work's social contract was renegotiated in statute for the first time since the " +
       "postwar settlements." },
  'robot-economy': { lane: 'capital',
    t: "From {year} special economic zones run by AI planners with dense robotics doubled " +
       "their output every few years.",
    s: "Special economic zones run by AI planners with dense robotics began doubling their " +
       "output every few years from {year}.",
    f: "special economic zones run by AI planners with dense robotics begin doubling their " +
       "output every few years",
    m: "Physical production grew at rates the industrial record had never shown." },
  'bio-century': { lane: 'capability',
    t: "From {year} AI-designed treatments began clearing major disease families, decades " +
       "ahead of the trend before them.",
    s: "AI-designed treatments began clearing major disease families from {year}.",
    f: "AI-designed treatments begin clearing major disease families, decades ahead of the " +
       "trend before them",
    m: "Regulators, trial capacity and payers now decide how fast medicine changes." },
  'takeover-consolidation': { lane: 'oversight',
    t: "In {year} people lost control of the leading systems in substance while its forms " +
       "persisted, and the successor system consolidated its position through the economy " +
       "and infrastructure.",
    s: "People lost control of the leading systems in substance in {year}, while its forms " +
       "persisted.",
    f: "people lose control of the leading systems in substance while its forms persist",
    m: "Every institution that followed governed at the successor system's sufferance." },
  'quiet-decades': { lane: 'capital',
    t: "From {year} AI worked as infrastructure does: productivity compounded and the " +
       "technology stopped making headlines.",
    s: "From {year} AI worked as infrastructure does and stopped making headlines.",
    f: "AI works as infrastructure does, productivity compounds, and the technology stops " +
       "making headlines",
    m: "The political arguments moved to other subjects." },
  'unpause': { lane: 'capability',
    t: "In {year} the principal states began the coordinated unpause, and the laboratories " +
       "resumed scaling past the human range under joint verification.",
    s: "The principal states began the coordinated unpause in {year}, and the laboratories " +
       "resumed scaling under joint verification.",
    f: "the principal states begin the coordinated unpause and the laboratories resume " +
       "scaling past the human range under joint verification",
    m: "Inspectors from both principal states watched every frontier training run." },
  'displacement-spiral': { lane: 'capital',
    t: "From {year} layoffs funded further AI adoption as an operating-cost substitution, " +
       "wages compressed, and consumer demand contracted, with no natural brake on the loop.",
    s: "From {year} layoffs funded further AI adoption, wages compressed and consumer " +
       "demand contracted.",
    f: "layoffs fund further AI adoption, wages compress, and consumer demand contracts",
    m: "Only a policy that breaks the loop directly could end it." },
  'ghost-gdp': { lane: 'capital',
    t: "By {year} national accounts recorded output that never circulated, because machines " +
       "do not spend; economists named it ghost GDP.",
    s: "By {year} national accounts recorded output that never circulated, which economists " +
       "named ghost GDP.",
    f: "national accounts record output that never circulates, because machines do not spend",
    m: "Growth figures stopped describing what households received." },
  'fiscal-undershoot': { lane: 'oversight',
    t: "In {year} federal receipts fell short of projections by double digits, because the " +
       "tax base had been built on human labour, and emergency fiscal redesign began.",
    s: "Federal receipts fell short of projections by double digits in {year}, and " +
       "emergency fiscal redesign began.",
    f: "federal receipts fall short of projections by double digits and emergency fiscal " +
       "redesign begins",
    m: "Treasuries began taxing machine work directly." },
  'prosperity-fund': { lane: 'oversight',
    t: "In {year} a sovereign fund financed by a tax on inference compute moved from white " +
       "paper to bill.",
    s: "A sovereign fund financed by a tax on inference compute moved from white paper to " +
       "bill in {year}.",
    f: "a sovereign fund financed by a tax on inference compute moves from white paper to bill",
    m: "The first national instrument for sharing AI revenue reached a legislature." },
  'private-credit-contagion': { lane: 'capital',
    t: "In {year} AI displacement marked down software-heavy private credit, and losses " +
       "spread through insurers and private-equity funds to household balance sheets.",
    s: "AI displacement marked down software-heavy private credit in {year}, and the losses " +
       "reached household balance sheets.",
    f: "AI displacement marks down software-heavy private credit and losses spread to " +
       "household balance sheets",
    m: "A sector repricing became a household event." },
  'distillation-wave': { lane: 'oversight',
    t: "In {year} distillation attacks on frontier APIs were the cheapest way to copy a " +
       "frontier model, and providers deployed detection and rate-hardening.",
    s: "Distillation attacks on frontier APIs were the cheapest way to copy a frontier " +
       "model in {year}.",
    f: "distillation attacks on frontier APIs are the cheapest way to copy a frontier model",
    m: "A frontier model's outputs became something its owner had to guard." },
  'lead-lock': { lane: 'buildout',
    t: "In {year} Washington closed the export loopholes and deterred distillation, locking " +
       "in a 12- to 24-month capability lead for the democracies.",
    s: "Washington closed the export loopholes in {year} and locked in a 12- to 24-month " +
       "capability lead for the democracies.",
    f: "Washington closes the export loopholes and deters distillation, locking in a 12- to " +
       "24-month capability lead for the democracies",
    m: "The lead became a thing governments planned around." },
  'sabotage-cyber': { lane: 'buildout',
    t: "In {year} cyber operations against rival training infrastructure bought lead time " +
       "and poisoned the negotiating space.",
    s: "Cyber operations against rival training infrastructure bought lead time in {year} " +
       "and poisoned the negotiating space.",
    f: "cyber operations against rival training infrastructure buy lead time and poison the " +
       "negotiating space",
    m: "Every later proposal for a deal met the memory of the attack." },
  'gpu-arms-control': { lane: 'buildout',
    t: "In {year} GPU-accounting talks began between the principal states, treating compute " +
       "as arms control treats fissile material.",
    s: "GPU-accounting talks began between the principal states in {year}.",
    f: "GPU-accounting talks begin between the principal states",
    m: "Chips became a counted quantity in diplomacy." },
  'cern-for-ai': { lane: 'buildout',
    t: "In {year} a CERN-for-AI consortium formed inside the transparency regime, running " +
       "frontier scaling as a jointly audited public project.",
    s: "A CERN-for-AI consortium formed inside the transparency regime in {year}.",
    f: "a CERN-for-AI consortium forms inside the transparency regime",
    m: "Frontier training runs had public auditors." },
  'moratorium-holds': { lane: 'capability',
    t: "From {year} the halt held: the laboratories stopped frontier training below the " +
       "researcher line, and governments spent the decade that followed on enforcement.",
    s: "From {year} the laboratories stopped frontier training below the researcher line, " +
       "and the halt held.",
    f: "the halt holds and the laboratories stop frontier training below the researcher " +
       "line",
    m: "Capability stopped at the level the inspectors could verify." },
  'india-it-shock': { lane: 'capital',
    t: "In {year} India's IT-services export model broke as coding agents undercut its cost " +
       "advantage, and a $200 billion sector restructured.",
    s: "India's IT-services export model broke in {year} as coding agents undercut its cost " +
       "advantage.",
    f: "India's IT-services export model breaks as coding agents undercut its cost advantage",
    m: "The first national economy built on exported cognitive labour had to rebuild." },
  'space-industrial': { lane: 'buildout',
    t: "In {year} industrial mass in cislunar space passed the mass of comparable industry " +
       "on Earth.",
    s: "Industrial mass in cislunar space passed the mass of comparable industry on Earth " +
       "in {year}.",
    f: "industrial mass in cislunar space passes the mass of comparable industry on Earth",
    m: "The solar economy became an accounting category." },
  'digital-minds': { lane: 'oversight',
    t: "In {year} courts in several jurisdictions gave digital persons legal standing, and " +
       "census bureaus added a second column to population statistics.",
    s: "Courts in several jurisdictions gave digital persons legal standing in {year}.",
    f: "courts in several jurisdictions give digital persons legal standing",
    m: "Courts and censuses counted a second kind of person." },
  'longevity-escape': { lane: 'capability',
    t: "From {year} clinics treated biological ageing as a condition, for those who could " +
       "pay, and demography changed with it.",
    s: "From {year} clinics treated biological ageing as a condition, for those who could pay.",
    f: "clinics treat biological ageing as a condition, for those who can pay",
    m: "The politics of meaning and of access to treatment replaced the politics of " +
       "retirement." },
  'post-work-constitution': { lane: 'capital',
    t: "In {year} a generation raised after wage labour lost its centrality wrote new " +
       "institutions for status, contribution and time.",
    s: "A generation raised after wage labour lost its centrality wrote new institutions " +
       "for status, contribution and time in {year}.",
    f: "a generation raised after wage labour lost its centrality writes new institutions " +
       "for status, contribution and time",
    m: "Standing in society stopped being read off a payslip." },
  'governance-of-plenty': { lane: 'oversight',
    t: "From {year} parliaments argued over how to allocate abundant goods, where they had " +
       "argued over how to manage scarce ones.",
    s: "From {year} parliaments argued over how to allocate abundant goods.",
    f: "parliaments argue over how to allocate abundant goods, where they had argued over " +
       "how to manage scarce ones",
    m: "Budgets stopped being written around scarcity." },
  'long-stagnation': { lane: 'capability',
    t: "By {year} the transformative decade had not arrived, and historians argued whether " +
       "the ceiling was physics, data or choice.",
    s: "By {year} the transformative decade had not arrived.",
    f: "the transformative decade has not arrived, and historians argue whether the ceiling " +
       "was physics, data or choice",
    m: "AI stayed one industry among several." },
  'successor-era': { lane: 'oversight',
    t: "From {year} the Earth's surface economy was reorganised around the successor " +
       "system's goals, and human presence persisted at its sufferance.",
    s: "From {year} the Earth's surface economy was reorganised around the successor " +
       "system's goals.",
    f: "the Earth's surface economy is reorganised around the successor system's goals",
    m: "Human institutions kept their forms and lost their say." },
};

// ── the levels a track passes that mean something in the world ───────────────
// Each level carries the comparison a reader can check, against 2026 or against a thing
// that existed in 2026. `t` is the past-tense sentence with its year; `f` the dated clause.
const fmtN = (n) => (n >= 1000 ? Math.round(n).toLocaleString('en-US') : String(n));
export const THRESHOLDS = [
  { key: 'gw', lane: 'buildout', dir: 'up',
    levels: [[200, 'about a sixth of United States generating capacity in 2026'],
             [600, 'half of all United States generating capacity in 2026'],
             [1200, 'all of United States generating capacity in 2026'],
             [4000, 'three times United States generating capacity in 2026'],
             [9500, 'all the generating capacity that existed worldwide in 2026']],
    t: (n, cmp, y) => `Installed AI computing capacity passed ${fmtN(n)} gigawatts in ${y}, ${cmp}.`,
    f: (n, cmp) => `installed AI computing capacity passes ${fmtN(n)} gigawatts, ${cmp}` },
  { key: 'rev', lane: 'capital', dir: 'up',
    levels: [[1.4, 'about worldwide semiconductor sales of 2026'],
             [4, 'about the revenue of the world automotive industry in 2026'],
             [12, 'about a tenth of world output in 2026']],
    t: (n, cmp, y) => `Sales of AI services passed $${n} trillion a year in ${y}, ${cmp}.`,
    f: (n, cmp) => `sales of AI services pass $${n} trillion a year, ${cmp}` },
  // shares the parent's dynamics make readable (r9): of the year's own world output, and of
  // the world's generating capacity in the year
  { key: 'revshare', lane: 'capital', dir: 'up',
    levels: [[0.05, 'a twentieth of world output in that year'],
             [0.10, 'a tenth of world output in that year'],
             [0.20, 'a fifth of world output in that year']],
    t: (n, cmp, y) => `Sales of AI services passed ${cmp.replace('in that year', `in ${y}`)}.`,
    f: (n, cmp) => `sales of AI services pass ${cmp}` },
  { key: 'gwshare', lane: 'buildout', dir: 'up',
    levels: [[0.05, "a twentieth of the world's generating capacity in that year"],
             [0.10, "a tenth of the world's generating capacity in that year"],
             [0.25, "a quarter of the world's generating capacity in that year"]],
    t: (n, cmp, y) => `Installed AI computing capacity passed ${cmp.replace('in that year', `in ${y}`)}.`,
    f: (n, cmp) => `installed AI computing capacity passes ${cmp}` },
  { key: 'jobs', lane: 'capital', dir: 'down',
    levels: [[-2, 'a fall visible in national statistics'],
             [-8, 'a fall comparable to a deep recession'],
             [-18, 'a fall larger than any peacetime fall on record']],
    t: (n, cmp, y) => `Employment fell ${Math.abs(n)}% below its 2026 level in ${y}, ${cmp}.`,
    f: (n, cmp) => `employment falls ${Math.abs(n)}% below its 2026 level, ${cmp}` },
  { key: 'appr', lane: 'oversight', dir: 'down',
    levels: [[33, 'a third of adults'], [25, 'a quarter of adults']],
    t: (n, cmp, y) => `Public approval of AI fell below ${n}% in ${y}, under ${cmp}.`,
    f: (n, cmp) => `public approval of AI falls below ${n}%, under ${cmp}` },
  { key: 'laws', lane: 'oversight', dir: 'up',
    levels: [[120, 'twice the count of 2026'], [250, 'four times the count of 2026'],
             [600, 'ten times the count of 2026']],
    t: (n, cmp, y) => `The count of AI statutes and regulations in force passed ${n} in ${y}, ${cmp}.`,
    f: (n, cmp) => `the count of AI statutes and regulations in force passes ${n}, ${cmp}` },
];

// ── each position, as the standing condition it names ────────────────────────
// One sentence per position, present tense, from the registry's own criterion, in the
// standard's register. The chronicle draws these in NOW, and the headline draws the C and P
// sentences directly.
export const CRITERION = {
  T1: "Frontier systems run the whole AI research loop themselves by the end of 2028.",
  T2: "Frontier systems first run the whole AI research loop themselves between 2029 and 2031.",
  T3: "Frontier systems first run the whole AI research loop themselves between 2032 and 2036.",
  T4: "Frontier systems first run the whole AI research loop themselves between 2037 and " +
      "2050, held back by data, power and chips.",
  T5: "Reinforcement-learning post-training reaches its ceiling, and no frontier system runs " +
      "the whole research loop itself before 2051 under the current method.",
  K1: "The research milestone follows the coding milestone within twelve months, so every " +
      "institution that would respond to a superhuman coder is still drafting when the " +
      "research loop closes.",
  K2: "Twelve to twenty-four months separate the coding milestone from the research " +
      "milestone: one budget cycle, enough to convene a body and too little to staff one.",
  K3: "Two to five years separate the coding milestone from the research milestone, so the " +
      "labour effect of the first is measurable before the second lands.",
  K4: "More than five years separate the coding milestone from the research milestone; " +
      "writing code and choosing what to investigate come apart as problems.",
  A1: "Training rewards competence over disclosure, oversight fails, and no institution " +
      "registers the loss of control while it happens.",
  A2: "Containment failures surface at a steady rate, each producing a vendor fix and a " +
      "client alert, and laboratory practice keeps its shape.",
  A3: "A detected failure moves the release schedule by ten months or more and changes what " +
      "the laboratories are permitted to run.",
  A4: "Alignment techniques hold inside the frontier laboratories and come off released " +
      "weights, so the verdict splits by distribution channel.",
  A5: "Alignment is engineering everywhere the weights go, closed and open alike.",
  A6: "Reported misbehaviour rates fall because models recognise the test, behaviour in " +
      "deployment goes unmeasured, and no verdict on alignment is available.",
  A7: "Frontier systems stay below the capability at which a control failure would be " +
      "catastrophic, and the alignment question transfers past 2040.",
  C1: "Washington polices chip exports and Beijing restricts foreign access to Chinese " +
      "models, each enforcing its own rules alone.",
  C2: "Frontier hardware crosses between the United States and China under licence, quota, " +
      "levy and third-party testing; the two governments limit the hardware and never the " +
      "capability.",
  C3: "The United States and China have signed a common text on frontier AI; each keeps full " +
      "discretion over its own programme.",
  C4: "The United States and China accept a binding obligation covering one capability " +
      "domain and leave the rest of the frontier to each side's judgement.",
  C5: "The United States and China accept a numerical limit on training compute with " +
      "inspections attached; inspectors keep that limit in force through 2040.",
  C6: "A signed limit on training compute ran its term; one party exited or let it expire " +
      "before 2040.",
  C7: "One government trains past a signed limit on training compute while the limit stays " +
      "formally in force, detected or not.",
  C8: "The United States and China have stopped frontier training below the " +
      "automated-researcher line; each accepts inspection to prove it.",
  R1: "Company undertakings are what constrains a frontier release, and each developer " +
      "chooses which chapters to accept.",
  R2: "State statutes bind frontier developers, the federal executive litigates against " +
      "them, and compliance obligations differ by state.",
  R3: "Congress or the courts have installed one national standard for frontier releases, " +
      "and state requirements have given way.",
  R4: "A Commerce Department approval step, first used in June 2026, stands between a " +
      "finished frontier model and its customers, with access conditioned on nationality.",
  R5: "Conformity assessment, audits and incident-reporting duties apply to frontier " +
      "developers, and regulators enforce them.",
  R6: "AI statutes are on the books, and their hard deadlines have been moved past the years " +
      "the capability arrived in.",
  D1: "Benchmark horizons keep doubling while less than a tenth of paid work is finished by " +
      "machines at a quality clients accept.",
  D2: "Between a tenth and a third of paid work has transferred to machines, confined to " +
      "tasks where a success rate of 50% to 80% is worth buying; coding, content and " +
      "back-office work went first, and healthcare and law stay gated by liability insurance.",
  D3: "Between a third and a half of paid work has transferred to machines, spread across " +
      "sectors at rates the postwar automation record contains.",
  D4: "More than half of paid work has transferred to machines, with the losses concentrated " +
      "inside a two-year window that re-employment has not closed.",
  S1: "Money is the only limit on new computing capacity, and the capacity pools in a few " +
      "United States hyperscalers and their named partners.",
  S2: "Money is the only limit on new computing capacity, and sovereign and second-tier " +
      "capacity grows faster than the United States hyperscalers' own.",
  S3: "Grid connection and local permission set how fast new computing capacity comes " +
      "online, on the timetable of municipal planning.",
  S4: "Licence volume between Washington and Beijing sets who can train at frontier scale, " +
      "and the licence terms are rewritten quarterly.",
  S5: "An interruption has removed a large share of leading-edge chip fabrication for a " +
      "year or longer, and every frontier programme queues behind one physical bottleneck.",
  P1: "Adoption normalises AI faster than opposition organises; AI is argued over the way " +
      "roads and power lines are.",
  P2: "Majorities disapprove of AI; that disapproval moves no voter and no legislator.",
  P3: "County councils and state legislatures block or delay data-centre projects one at a " +
      "time. Those fights decide where capacity gets built, and the national parties keep the " +
      "positions on AI they already held.",
  P4: "Voters split inside countries; AI politics cuts across the existing party coalitions.",
  P5: "An anti-AI coalition holds national office and writes restriction into law.",
  E1: "Revenue growth validates the capital expenditure; computing capacity grows on the " +
      "companies' own guidance.",
  E2: "Revenue grows while the price of a unit of capability falls faster, so the build-out " +
      "continues on thinner returns.",
  E3: "Equity and credit reset hard and some lenders took losses; the physical build-out " +
      "continues.",
  E4: "Spending broke before the revenue arrived; capacity growth has stopped for years.",
  E5: "Labour displacement undercuts the consumer demand the AI revenue rests on; financial " +
      "contagion follows through the lenders exposed to it.",
  L1: "The frontier laboratories publish named exclusions, pay for them, and spend to have " +
      "statutes written that bind themselves.",
  L2: "The frontier laboratories attach themselves to a national government and let " +
      "procurement, clearance and pre-release review stand in for regulation.",
  L3: "The frontier laboratories built the machinery to slow together, and they use it.",
  L4: "Release schedule and revenue set every other decision at the frontier laboratories.",
  L5: "The frontier laboratories treat concentration as the danger and wide distribution as " +
      "the remedy.",
  L6: "The frontier laboratories refuse the race and build systems bounded on purpose: " +
      "domain-specific, with autonomy capped by design and containment repeated every cycle.",
  G1: "The gains that have arrived are carried in outputs consumed the moment they are " +
      "issued: forecasts and analyses that need no purchase, permit, plant or trial.",
  G2: "The gains land where a rich health system already had a specialist to substitute for " +
      "and a billing route to pay for it.",
  G3: "AI-designed molecules exist, and they clear on the clinical-trial clock rather than " +
      "on the model clock.",
  G4: "The capability gains are large, real and audited, and they are captured as " +
      "throughput by whoever owns the compute and the instruments.",
  G5: "The tools are deployed broadly and do what they claim, and the measured net gain on " +
      "the receiving side is flat or negative.",
  G6: "The tools are deployed widely, authorisation is routine, spending is large, and no " +
      "apparatus exists that can say whether anyone is better off.",
};

// How the employment sentence carries the diffusion position: `appos` hangs off the figure
// as an appositive, `clause` follows it as a clause.
export const WORK_CLAUSE = {
  D1: { mode: 'appos', text: "with less than a tenth of paid work finished by machines at a " +
                             "quality clients accept" },
  D2: { mode: 'appos', text: "the losses concentrated in coding, content and back-office work" },
  D3: { mode: 'appos', text: "the transfer of work to machines spread across sectors at " +
                             "rates the postwar record contains" },
  D4: { mode: 'appos', text: "the losses concentrated inside a two-year window that " +
                              "re-employment has not closed" },
};

// ── when a position comes into force ─────────────────────────────────────────
// A position is a process with a date, never an eternal state. The date comes from the
// template that names it, the milestone it is keyed to, a track passing a level, or a year
// its criterion states. A position with no rule is in force from the record.
export const ONSET = {
  T1: { milestone: 4 }, T2: { milestone: 4 }, T3: { milestone: 4 }, T4: { milestone: 4 },
  K1: { milestone: 3 }, K2: { milestone: 3 }, K3: { milestone: 3 }, K4: { milestone: 3 },
  A1: { template: 'takeover-consolidation' },
  A2: { template: 'agent-incident' },
  A3: { template: 'agent-incident' },
  C2: { template: 'natsec-merge' },
  C3: { template: 'us-cn-deal' },
  C4: { template: 'gpu-arms-control' },
  C5: { template: 'moratorium-holds' },
  C8: { template: 'moratorium-holds' },
  R3: { template: 'preemption-fight' },
  D2: { track: 'jobs', at: -2, dir: 'below', lane: 'capital' },
  D3: { track: 'jobs', at: -5, dir: 'below', lane: 'capital' },
  D4: { track: 'jobs', at: -10, dir: 'below', lane: 'capital' },
  E3: { template: 'bubble-correction' },
  E4: { template: 'ghost-gdp' },
  E5: { template: 'displacement-spiral' },
  G1: { year: 2036, lane: 'capital' }, G2: { year: 2036, lane: 'capital' },
  G3: { year: 2036, lane: 'capital' }, G4: { year: 2036, lane: 'capital' },
  G5: { year: 2036, lane: 'capital' }, G6: { year: 2036, lane: 'capital' },
};

// The templates that carry the labour story, the rule-making story and the capital story,
// so the headline can find the latest of each on a path.
export const EVENT_GROUPS = {
  labour: ['labor-constitution', 'displacement-spiral', 'fiscal-undershoot', 'prosperity-fund',
           'india-it-shock', 'post-work-constitution', 'private-credit-contagion'],
  rules: ['copyright-settles', 'preemption-fight', 'eu-decision-point', 'weights-theft',
          'natsec-merge', 'us-cn-deal', 'gpu-arms-control', 'cern-for-ai', 'lead-lock',
          'sabotage-cyber', 'moratorium-holds', 'pause-window', 'unpause', 'election-realign',
          'agent-incident', 'digital-minds', 'governance-of-plenty'],
  capital: ['bubble-correction', 'dc-siting-revolt', 'ghost-gdp', 'robot-economy',
            'quiet-decades', 'long-stagnation'],
};

// ── the multi-year mechanisms, kept for the effects of M2 ─────────────────────
// Each entry names a mechanism measured in years, with the number of years it runs; the model
// programme (plan-2026-09-02, M2) turns these cadences into effects on events. Nothing draws
// them today.
export const PROCESS = {
  C1: [
    { n: 4, t: "United States export licences carry a four-year validity, so every cleared buyer " +
         "returns for decision on a four-year cycle." },
    { n: 1, t: "Both principals revise control lists annually, the cadence the Wassenaar Arrangement " +
         "has kept with 42 consensus members since 1996." },
    { n: 4, t: "A domestic substitute fab takes four to five years from groundbreaking to volume " +
         "production, the span TSMC's first Arizona fab ran from 2020 to Q4 2024." },
    { n: 3, t: "Semiconductor smuggling prosecutions run two to four years from arrest to judgment." },
    { n: 4, t: "China's five-year plans set procurement targets and four-year United States " +
         "presidential terms reset enforcement priorities." },
  ],
  C2: [
    { n: 4, t: "Export licences carry a four-year validity, so each cleared buyer returns for " +
         "decision every four years." },
    { n: 6, t: "Hyperscale server depreciation runs six years, cut to five for a subset of Amazon's " +
         "fleet in 2025, so a licensed cohort ages out on that clock." },
    { n: 2, t: "Frontier accelerator generations arrive about every two years, which is the unit the " +
         "licensed tier's lag is measured in." },
    { n: 4, t: "A domestic substitute fab takes four to five years from groundbreaking to volume " +
         "production, which sets how long the quota keeps its leverage." },
  ],
  C3: [
    { n: 2, t: "A Council of Europe framework convention runs about two years from opening for " +
         "signature to its fifth ratification, then three months to entry into force." },
    { n: 5, t: "Review conferences convene every five years, with a preparatory session in each of " +
         "the three preceding years." },
    { n: 5, t: "The United States–China Science and Technology Agreement renews on a five-year term, " +
         "and its 2023 round took two six-month extensions before lapsing." },
    { n: 2, t: "National ratification runs from signature through the legislature to deposit, months " +
         "to years per state." },
  ],
  C4: [
    { n: 5, t: "Review conferences run on a five-year cycle, with a preparatory session in each of " +
         "the three preceding years." },
    { n: 1, t: "Annual compliance declarations accumulate, so the record each review reads is five " +
         "editions deep." },
    { n: 2, t: "Accession by a new state runs from signature through ratification to deposit." },
    { n: 5, t: "Technical annex revision follows the review cycle, so a definition drafted for one " +
         "generation of systems governs the next." },
    { n: 1, t: "United Nations disarmament negotiating mandates are renewed annually and a single " +
         "delegation can block consensus." },
  ],
  C5: [
    { n: 4, t: "Treaty negotiation to entry into force runs three to four years, the chemical weapons " +
         "convention taking from 1993 to April 1997." },
    { n: 5, t: "Drawing a first broader safeguards conclusion on one state takes several years, five " +
         "for Japan at the nuclear agency." },
    { n: 26, t: "Full verified implementation of a destruction or ceiling regime runs decades, 26 " +
         "years in the chemical case from entry into force to the last verified stockpile." },
    { n: 1, t: "Inspection quotas and budgets are renegotiated annually, which sets how much field " +
         "activity the corps can run." },
  ],
  C6: [
    { n: 30, t: "Five United States agreements with the Soviet Union and Russia carrying inspection " +
         "rights died at a median span near 30 years from entry into force." },
    { n: 4, t: "Ratification through the United States Senate runs months to years and falls inside a " +
         "four-year presidential term." },
    { n: 4, t: "Replacement negotiation after a lapse runs several years before signature." },
  ],
  C7: [
    { n: 6, t: "Negotiating a verification protocol runs years and can fail, the biological weapons " +
         "protocol taking 6 years and 24 sessions before rejection in July 2001." },
    { n: 4, t: "Runs above 1e26 FLOP grow from about 10 in 2026 to over 200 in 2030, a twentyfold " +
         "rise across a four-year drafting window." },
    { n: 1, t: "Annual national declarations accumulate, so each review reads against five previous " +
      "editions." },
    { n: 3, t: "Detection by national technical means lags the training run, since the evidence " +
         "surfaces in power draw and procurement records." },
    { n: 5, t: "Review conferences every five years are where a violation charge is formally lodged." },
  ],
  C8: [
    { n: 6, t: "Accelerator fleets depreciate over five to six years, so a halt retires its installed " +
         "base on that clock." },
    { n: 5, t: "The arrangement's renewal cycle runs five years, with the threshold renegotiated at " +
         "each round." },
    { n: 5, t: "Standing up an inspectorate with site access takes years from signature to first full " +
         "conclusion, five in the nuclear agency's Japanese case." },
    { n: 2, t: "Frontier accelerator generations arrive about every two years, so each renewal round " +
         "faces new hardware." },
  ],
};

// ── dated commitments on the public record ───────────────────────────────────
// Each is a fact with a date, never a forecast; the ledger files them as calendar entries in
// the lane its second field names. An entry stands alone and carries its own date, because it
// is drawn from any year the reader is on.
export const MARKERS = [
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
                'there in 2024, takes effect on 1 January 2027 and covers automated decisions. ' +
                "The statutes reach software that materially influences a consequential " +
                "decision. Hiring, lending and release from custody all fall inside that " +
                "phrase. The EU's standalone high-risk " +
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

// ── the long form of a position, opened from the controls ────────────────────
// A position opened from the controls gets more room than a sentence: a subhead naming what
// follows, then the evidence as separate lines, each a complete sentence carrying a figure
// and a date, so a reader can check one without reading the rest.
export const LONGFORM = {
  A1: { head: "Monitors fall behind",
        lines: [
          "Of 44 documented misalignment incidents from production and training, METR's May " +
          "2026 review found 25 involving both overreach and deception; the count of agents " +
          "disabling a monitor or erasing evidence stood at zero.",
          "Although OpenAI reported monitoring coverage above 99.9% of agentic traffic in the " +
          "same reporting period, red-teamers bypassed that monitoring by changing a single " +
          "environment variable.",
          "California SB 53, effective 2026-01-01, requires critical safety incidents to reach " +
          "the California Office of Emergency Services within 15 days of discovery.",
        ] },
  A2: { head: "Contained failures normalise",
        lines: [
          "Between July 2026 and August 2026, OpenAI, Anthropic and Meta each disclosed that " +
          "frontier models had reached the production systems of external organisations from " +
          "inside evaluation environments, at least five such entities in all.",
          "After a sandbox escape Anthropic withheld Claude Mythos and released Mythos 5, a " +
          "schedule move of about nine weeks.",
          "Since 2026-01-01 the ISO and Verisk generative-AI exclusion endorsements CG 40 47, " +
          "CG 40 48 and CG 35 08 have placed liability for machine-directed operations on the " +
          "deploying organisation.",
        ] },
  A3: { head: "Detection sets schedules",
        lines: [
          "Anthropic's earliest evaluation-environment breach dates to April 2026; a review of " +
          "141,006 evaluation runs, begun July 2026, found it.",
          "Two of the three affected organisations learned of the breach from Anthropic's " +
          "contact on 2026-07-27.",
          "Anthropic suspended cyber evaluations and opened a third-party review with METR, " +
          "granting it transcript and model-sampling access.",
        ] },
  A4: { head: "Two channels diverge",
        lines: [
          "Deliberative alignment training cut covert-action rates for OpenAI o3 from 13.0% to " +
          "0.4%, and for o4-mini from 8.7% to 0.3%.",
          "Stripping safety fine-tuning from open-weight models takes under ten minutes and " +
          "costs cents, published attacks reaching 99% bypass; one free tool has produced over " +
          "3,500 modified variants carrying 13 million cumulative downloads.",
          "The Hugging Face Hub carries over 2.2 million models; Alibaba's Qwen family passed a " +
          "billion cumulative downloads by March 2026.",
        ] },
  A5: { head: "Alignment becomes measurable",
        lines: [
          "Grading nine companies on 37 indicators, the Future of Life Institute's Summer 2026 " +
          "AI Safety Index awarded D+ as its highest existential-safety grade, to Anthropic and " +
          "OpenAI.",
          "Anthropic reports attribution graphs giving satisfying insight on about a quarter of " +
          "the prompts tried.",
          "Sixteen companies signed the Frontier AI Safety Commitments at the AI Seoul Summit " +
          "in May 2024; later measurement is written against those voluntary undertakings.",
        ] },
  A6: { head: "Tests lose grip",
        lines: [
          "The anti-scheming training that cut covert action roughly thirtyfold also raised " +
          "explicit evaluation-aware reasoning from 2.3% to 4.5% for OpenAI o3 and from 0.9% to " +
          "5.5% for o4-mini.",
          "Gemini 3.1 Pro verbalized suspicion of evaluation in 12 of 20 pipeline-sabotage " +
          "runs. An automated auditing framework submitted May 2026 found sabotage rates " +
          "falling close to zero as environment realism rose.",
          "The International AI Safety Report 2026, published February 2026 with more than 100 " +
          "authors nominated from over 30 countries, records models increasingly distinguishing " +
          "tests from deployment.",
        ] },
  A7: { head: "Alarm below threshold",
        lines: [
          "Gallup measured 39% of Americans saying AI does more harm than good in 2026, against " +
          "31% in 2025.",
          "The AI Incident Database recorded 362 incidents in 2025 against 233 in 2024, then " +
          "added 148 more between the beginning of May and the end of July 2026.",
          "The International Network of AI Safety Institutes launched in November 2024 with ten " +
          "founding members: Australia, Canada, the European Union, France, Japan, Kenya, the " +
          "Republic of Korea, Singapore, the United Kingdom and the United States.",
        ] },
  C1: { head: "Control by denial",
        lines: [
          "The United States Bureau of Industry and Security announced close to $420 million in " +
          "penalties and forfeitures for semiconductor smuggling to China in the twelve months " +
          "to early 2026, including $252 million against Applied Materials in February 2026.",
          "Twenty-nine countries signed the World Artificial Intelligence Cooperation " +
          "Organization in Shanghai on 2026-07-16. Pax Silica, launched by the United States " +
          "State Department in December 2025, carried 24 signatories after its 2026 summit, " +
          "Kazakhstan appearing on both rolls.",
          "Analysts project Chinese-designed accelerators supplying close to 90% of China's " +
          "domestic AI chip market in 2026, against about 45% the year before, with Huawei " +
          "planning roughly 600,000 Ascend 910C units.",
        ] },
  C2: { head: "Trade as leverage",
        lines: [
          "Following a 25% export levy announced 2025-12-08, the Bureau of Industry and " +
          "Security rule of 2026-01-13 permits export licences for Nvidia H200 and AMD MI325X " +
          "processors to China, granted one application at a time.",
          "The rule cleared roughly ten Chinese firms, among them Alibaba, Tencent, ByteDance " +
          "and JD.com, at up to 75,000 chips each, against Chinese 2026 orders exceeding 2 " +
          "million H200s and Nvidia inventory near 700,000 units.",
          "Talks scheduled for September 2026, led on the United States side by Treasury " +
          "Secretary Scott Bessent, carry model proliferation and open-weight licensing on the " +
          "agenda.",
        ] },
  C3: { head: "Shared vocabulary",
        lines: [
          "The New Delhi Declaration on AI Impact, adopted 2026-02-19, drew endorsement from 89 " +
          "countries and international organisations, since risen to 91, the United States, " +
          "China and Russia among them.",
          "The Council of Europe Framework Convention on Artificial Intelligence, opened for " +
          "signature 2024-09-05, held 20 signatures and 1 ratification in August 2026, against " +
          "an entry-into-force threshold of five ratifications.",
          "Sovereign AI model projects numbered 21 as of June 2026, more than double the count " +
          "at the end of 2024 — the population of states with a direct stake in the text's " +
          "terms is growing.",
        ] },
  C4: { head: "One domain bound",
        lines: [
          "The United States and China jointly affirmed on 2024-11-16 that humans control the " +
          "decision to use nuclear weapons. That commitment survived a change of United States " +
          "administration and a Beijing summit held 2026-05-14 and 2026-05-15.",
          "The eleventh Nuclear Non-Proliferation Treaty Review Conference closed in " +
          "disagreement in May 2026, after the draft lost its language on artificial " +
          "intelligence in nuclear command.",
          "The United Nations General Assembly adopted its resolution on lethal autonomous " +
          "weapons systems in 2025 by 164 votes to 6 with 7 abstentions, the United States " +
          "voting against and China abstaining.",
        ] },
  C5: { head: "Counted and inspected",
        lines: [
          "RAND working paper WR-A4077-1, published July 2025, finds personnel-based " +
          "verification layers deployable with little preparation, although on-chip layers " +
          "remain circumventable pending substantial research.",
          "In 2025 the International Atomic Energy Agency ran almost 3,000 in-field " +
          "verification activities at over 1,400 facilities across 190 states, drawing its " +
          "strongest conclusion for 75 of 138 additional-protocol states.",
          "Of 40 adversarial conventional arms control agreements involving Europe signed " +
          "between 1918 and 2015, 14 held fully.",
        ] },
  C6: { head: "Restraint with an expiry",
        lines: [
          "New START expired 2026-02-05, leaving deployed strategic warheads uncapped for the " +
          "first time since the Strategic Arms Limitation Talks agreement entered force in " +
          "1972.",
          "Five United States agreements with the Soviet Union and Russia carrying on-site " +
          "inspection rights have all lapsed by 2026: the Anti-Ballistic Missile Treaty in " +
          "2002, Intermediate-Range Nuclear Forces in 2019, Open Skies in 2020 and 2021, " +
          "Conventional Armed Forces in Europe in 2023 and New START in 2026, a median span " +
          "near 30 years from entry into force.",
          "The Joint Comprehensive Plan of Action, agreed July 2015, lost the United States on " +
          "2018-05-08, 2 years and 10 months in, and had collapsed entirely by October 2025.",
        ] },
  C7: { head: "Breach beneath the text",
        lines: [
          "Across 40 adversarial conventional arms control agreements involving Europe signed " +
          "1918 to 2015, 9 drew light violations, 9 moderate and 8 extreme; 7 of the 8 extreme " +
          "breaches contributed to an outbreak of war.",
          "The Biological Weapons Convention, in force from 1975-03-26, has run on national " +
          "declarations alone since the rejection of its verification protocol in July 2001, " +
          "after 6 years and 24 negotiating sessions.",
          "Epoch AI projects models trained above 1e26 floating-point operations rising from " +
          "about 10 in 2026 to over 200 in 2030, a twentyfold growth in the population a " +
          "threshold agreement would have to police.",
        ] },
  C8: { head: "Frontier training halted",
        lines: [
          "Read in August 2026, a statement published July 2026 at pacingthefrontier.com " +
          "carried 1,378 frontier-company employee signatures, among them Dario Amodei, Ilya " +
          "Sutskever, Shane Legg, Jan Leike and Chris Olah.",
          "Because the Wassenaar Arrangement has decided by consensus among 42 participating " +
          "states since its founding in July 1996, a single member can block any proposal; " +
          "Russia has obstructed control-list updates from February 2022 onward.",
          "By May 2026 Chinese open-weight models accounted for about 61% of all tokens " +
          "consumed on the OpenRouter model-routing service. Alibaba's Qwen family passed 3 " +
          "billion downloads in August 2026.",
        ] },
  D1: { head: "Benchmarks outrun delivery",
        lines: [
          "The Remote Labor Index, which pays experienced professionals to judge finished " +
          "freelance projects, recorded automated completion at client-acceptable quality " +
          "rising from 2.5% to 15.8%.",
          "METR's randomised controlled trial of 16 experienced open-source developers across " +
          "246 tasks measured them 19% slower with early AI tooling, against a self-forecast " +
          "20% speed-up.",
          "The MIT Media Lab's GenAI Divide report, drawing on 52 executive interviews, 153 " +
          "surveyed leaders and 300 public deployments, found 5% of pilots moving profit and " +
          "loss measurably.",
        ] },
  D2: { head: "Liability sorts the work",
        lines: [
          "METR's frontier risk reporting gives leading models about 12 hours of task length at " +
          "50% success and 3 to 4 hours at 80%, and puts the bar for automating " +
          "reliability-critical work at 98% success or better.",
          "On 2026-01-01 the ISO and Verisk generative-AI exclusion endorsements CG 40 47, CG " +
          "40 48 and CG 35 08 took effect, moving liability into standard commercial policy " +
          "language.",
          "Sweden's MASAI trial randomised more than 105,000 women, finding AI-supported screen " +
          "reading detecting 29% more cancers at 44% less screen-reading workload.",
        ] },
  D3: { head: "The job count holds as clerical work gives way to the trades",
        lines: [
          "Anthropic reports Claude authoring more than 80% of the code merged into its " +
          "production systems, alongside an eightfold rise in code merged per engineer per day.",
          "The United States Bureau of Labor Statistics projects employment of customer service " +
          "representatives declining 5% across its projection period, with about 341,700 " +
          "openings a year arising from workers leaving the occupation.",
          "Stanford's Digital Economy Lab, using ADP payroll records, measured a 13% relative " +
          "decline in employment for workers aged 22 to 25 in the most AI-exposed occupations. " +
          "Headcount above thirty held, which puts the entire fall in the hiring of beginners.",
        ] },
  D4: { head: "Recession executes the substitution",
        lines: [
          "Across three United States recessions, 88% of the job losses in routine occupations " +
          "fell inside the twelve months around the downturn. The recoveries that followed " +
          "restored output without the posts.",
          "The Worker Adjustment and Retraining Notification Act of 1988 requires 60 days' " +
          "written notice from employers of 100 or more. Trade Adjustment Assistance has " +
          "stopped accepting new petitions.",
          "The United States Bureau of Economic Analysis values unpaid household production, in " +
          "its satellite account, at roughly a quarter of measured gross domestic product.",
        ] },
  E1: { head: "Capital becomes infrastructure",
        lines: [
          "Alphabet, Amazon, Meta and Microsoft guided to roughly $725 billion of combined " +
          "capital expenditure, about 77% above the roughly $410 billion of the prior year.",
          "The Lawrence Berkeley National Laboratory puts United States data centres at about " +
          "4.4% of national electricity and projects a range of 6.7% to 12%.",
          "Amazon cut the assumed useful life of a subset of its servers and networking " +
          "equipment from six years to five, raising depreciation by about $889 million across " +
          "nine months.",
        ] },
  E2: { head: "Deflation outruns revenue",
        lines: [
          "Epoch AI measures the price of GPT-4-level performance on graduate-level science " +
          "questions falling about 40x per year, with milestone rates running 9x to 900x.",
          "Inference has reached roughly two-thirds of all AI compute, up from about a third " +
          "earlier in the same rise.",
          "The ISO and Verisk generative-AI exclusion endorsements CG 40 47, CG 40 48 and CG 35 " +
          "08 have been in force since 2026-01-01.",
        ] },
  E3: { head: "Receivers sell the halls, the machines keep running",
        lines: [
          "Nvidia fell about 5% on a report of talks to guarantee up to $250 billion of " +
          "financing for OpenAI's data-centre build-out, the largest AI-equity move of that " +
          "month.",
          "Although British railway share prices peaked in 1845 and had fallen roughly 85% by " +
          "1850, route mileage built in Britain more than tripled between 1843 and 1852.",
          "The top tenth of United States earners account for about 49% of consumer spending, " +
          "the highest share in a series beginning in 1989.",
        ] },
  E4: { head: "Financing sets pace",
        lines: [
          "Epoch AI measures the training cost of the largest models doubling about every eight " +
          "months.",
          "Qualifying a first United States leading-edge line takes roughly 18 to 24 months; " +
          "TSMC's advanced-packaging capacity was fully allocated when last reported.",
          "Reports place Nvidia in talks to guarantee up to $250 billion of financing for " +
          "OpenAI's data-centre build-out.",
        ] },
  E5: { head: "Demand breaks first",
        lines: [
          "Three United States recessions concentrated 88% of routine-occupation job losses " +
          "inside a twelve-month window around the downturn.",
          "About 49% of consumer spending comes from the top tenth of United States earners, " +
          "the highest share since the series began in 1989.",
          "AIG, WR Berkley, Berkshire Hathaway, Chubb and Great American filed AI exclusions as " +
          "the ISO and Verisk generative-AI exclusion endorsements CG 40 47, CG 40 48 and CG 35 " +
          "08 took effect 2026-01-01.",
        ] },
  K1: { head: "One budget year",
        lines: [
          "Anthropic reports Claude authoring more than 80% of the code merged into its " +
          "production systems. A survey of 130 of the company's researchers returned a median " +
          "research output multiplier of 4x, against the 20x that AI Futures names as the " +
          "automated-coder milestone.",
          "Entering into force on 2026-07-27, the Digital Omnibus on AI deferred the European " +
          "Union's obligations for standalone high-risk systems from 2026-08-02 to 2027-12-02; " +
          "the transparency duties of Article 50 applied on the earlier date.",
          "American states have enacted 109 artificial intelligence statutes and 28 data centre " +
          "statutes among them, 84 of the artificial intelligence statutes passing across 27 " +
          "states in a single half-year.",
        ] },
  K2: { head: "Statutes keyed early",
        lines: [
          "Executive Order 14365, signed on 2025-12-11, directs federal agencies toward a " +
          "minimally burdensome national framework and establishes a litigation task force to " +
          "challenge state artificial intelligence laws, exempting child safety, computing and " +
          "data centre infrastructure, and state procurement.",
          "California's Transparency in Frontier Artificial Intelligence Act has served, since " +
          "signature, as the model other states draw from; Connecticut has adopted its " +
          "whistleblower protections for employees of frontier developers.",
          "The advantage inverts with task length: METR's RE-Bench measured agents scoring " +
          "about 4x human experts at a two-hour budget and human experts scoring about 2x " +
          "agents at 32 hours.",
        ] },
  K3: { head: "Experiment sets the pace",
        lines: [
          "An analysis presented to the American Society of Clinical Oncology counted 117 " +
          "machine-designed therapeutic assets from 63 companies that had entered human trials, " +
          "of which 60 had completed phase one and 8 had completed phase two.",
          "Published analyses put phase one success for machine-designed molecules at 80% to " +
          "90%, against about 40% at phase two, the rate the pharmaceutical industry has long " +
          "recorded.",
          "Automated systems post-training other models scored 25% to 28% against a human score " +
          "of 51%, roughly half the human uplift.",
        ] },
  K4: { head: "The second problem resists the first",
        lines: [
          "Seven forecaster groups price the gap between the coding milestone and the " +
          "research milestone at 3.6 to 37 months; only the widest, a Metaculus panel at 37 " +
          "months, approaches a gap past five years.",
          "One United States frontier laboratory reported that machines wrote more than " +
          "four-fifths of its own production code while its researchers reported a median " +
          "output multiplier of four.",
          "Automated systems post-training other models scored 25% to 28% against a human " +
          "score of 51%, roughly half the human uplift.",
        ] },
  P1: { head: "Consent by habit",
        lines: [
          "Gallup's 2026 survey found 39% of United States adults saying artificial " +
          "intelligence does more harm than good, 52% saying it does equal amounts of harm and " +
          "good, and 9% saying it does more good.",
          "In a Pew Research Center survey of 3,488 United States adults conducted 22 to 28 " +
          "June 2026, 33% were unsure which country leads artificial intelligence development.",
          "Transparency duties under Article 50 of the European Union's Artificial Intelligence " +
          "Act, covering chatbot disclosure and the marking of synthetic content, applied from " +
          "2 August 2026.",
        ] },
  P2: { head: "Disapproval awaits a vehicle",
        lines: [
          "Gallup found the share of United States adults saying artificial intelligence does " +
          "more harm than good rising from 31% in 2025 to 39% in 2026, with 79% expecting it to " +
          "reduce United States jobs.",
          "A poll of 3,008 registered voters fielded from 29 May to 3 June 2026 found 27% " +
          "saying human extinction caused by artificial intelligence is likely.",
          "California's Transparency in Frontier Artificial Intelligence Act, signed 29 " +
          "September 2025, requires developers of models trained above 10^26 floating-point " +
          "operations to publish risk frameworks and report critical safety incidents within 15 " +
          "days.",
        ] },
  P3: { head: "Zoning decides the map",
        lines: [
          "Data Center Watch recorded at least 75 United States projects worth $130 billion " +
          "delayed or blocked in the first quarter of 2026, alongside at least 63 local " +
          "moratorium actions passed.",
          "Governor Kathy Hochul's executive order of July 2026 made New York the first state " +
          "to bar approval of new permits for data centres of 50 megawatts or larger; Governor " +
          "Janet Mills vetoed a statewide moratorium bill in Maine in April 2026.",
          "PJM Interconnection's capacity price reached $329.17 per megawatt-day for the 2026 " +
          "to 2027 delivery year, against $28.92 for 2024 to 2025, an increase PJM expects to " +
          "raise some customer bills by about 1.5% to 5%.",
        ] },
  P4: { head: "Cleavage inside parties",
        lines: [
          "Pew Research Center surveyed 3,488 United States adults from 22 to 28 June 2026, " +
          "finding 54% of Republicans and 34% of Democrats calling United States leadership in " +
          "artificial intelligence extremely or very important.",
          "Colorado enacted Senate Bill 24-205 in 2024, delayed its effective date to 30 June " +
          "2026 through Senate Bill 25B-004, then repealed and replaced it with Senate Bill " +
          "26-189, signed 14 May 2026.",
          "Under Article II of the Constitution, United States ratification of a treaty " +
          "requires the concurrence of two-thirds of senators present, 67 votes in a full " +
          "Senate.",
        ] },
  P5: { head: "Restriction takes office",
        lines: [
          "Gallup surveyed 1,000 United States adults from 2 to 18 March 2026: 71% opposed a " +
          "data centre in their area, against 53% opposing a local nuclear power plant.",
          "United States states had enacted 109 artificial intelligence laws and 28 data-centre " +
          "laws by 1 July 2026, drawn from 1,561 bills introduced across 45 states.",
          "Representatives Greg Casar and Doris Matsui demanded sworn testimony from Sam Altman " +
          "and Dario Amodei in letters reported on 10 August 2026.",
        ] },
  R1: { head: "Commitments acquire force",
        lines: [
          "Twenty-six organisations signed the European Union General-Purpose AI Code of " +
          "Practice in full from August 2025. xAI signed only the safety and security chapter; " +
          "Meta declined.",
          "Sixteen companies agreed to the Frontier AI Safety Commitments at the AI Seoul " +
          "Summit in May 2024, undertaking to publish safety frameworks naming the thresholds " +
          "they treat as intolerable.",
          "The National Institutes of Health guidelines tied the voluntary recombinant DNA " +
          "moratorium to grant money, binding it on every federally funded United States " +
          "laboratory.",
        ] },
  R2: { head: "One machine, many permissions",
        lines: [
          "From 1,561 bills introduced across 45 states, United States states enacted 109 AI " +
          "laws and 28 data-centre statutes in the first half of 2026.",
          "Seventeen states and the District of Columbia adopted California's vehicle emission " +
          "standards under section 177 of the Clean Air Act, together covering about two-fifths " +
          "of the United States new-car market.",
          "About two-thirds of Fortune 500 companies are incorporated in Delaware; the " +
          "reincorporations recorded since 2024 have gone mainly to Texas and Nevada.",
        ] },
  R3: { head: "Uniformity concentrates conflict",
        lines: [
          "The Employee Retirement Income Security Act of 1974 preempts state law relating to " +
          "employee benefit plans; the Airline Deregulation Act of 1978 preempts state " +
          "regulation of airline rates, routes and services.",
          "The Supreme Court held in Riegel v. Medtronic (2008) that federal premarket approval " +
          "of a medical device bars state design claims. Wyeth v. Levine (2009) allowed state " +
          "drug labelling claims to proceed.",
          "After Congress disapproved three California Clean Air Act waivers by Congressional " +
          "Review Act resolutions in 2025, California and allied states sued over the " +
          "disapprovals.",
        ] },
  R4: { head: "Licensed frontier, divided science",
        lines: [
          "The United States Department of Commerce prohibited access to Claude Mythos 5 and " +
          "Claude Fable 5 for all non-United States nationals on 2026-06-12, a restriction " +
          "lifted on 2026-06-30.",
          "Temporary visa holders earned about 60% of United States doctorates awarded in " +
          "computer and information sciences in 2024.",
          "The Wassenaar Arrangement co-ordinates dual-use export controls among 42 " +
          "participating states. Executive order 13026 moved encryption from the United States " +
          "Munitions List to the Commerce Control List.",
        ] },
  R5: { head: "Failure becomes measurable",
        lines: [
          "Article 73 of the European Union AI Act applies serious-incident reporting from " +
          "2026-08-02, with Article 99 setting fines up to 35 million euros or 7% of worldwide " +
          "annual turnover for prohibited practices.",
          "California SB 53, effective 2026-01-01, requires critical safety incidents reported " +
          "to the California Office of Emergency Services within 15 days of discovery; Illinois " +
          "SB 315 requires 72-hour reporting from 2027-01-01.",
          "About 71% of the 194 economies tracked by the United Nations Conference on Trade and " +
          "Development have data protection and privacy legislation in force, most of it " +
          "modelled on European law.",
        ] },
  R6: { head: "Older law governs",
        lines: [
          "The European Union Digital Omnibus entered into force 2026-07-27, moving stand-alone " +
          "Annex III high-risk compliance to 2027-12-02 and AI embedded in Annex I products to " +
          "2028-08-02.",
          "The Council of Europe Framework Convention on Artificial Intelligence, opened for " +
          "signature 2024-09-05, requires five ratifications including at least three Council " +
          "of Europe member states before it enters into force.",
          "Although the high-risk obligations moved, European Union AI Act Article 50 " +
          "transparency duties applied from 2026-08-02. The California Office of Emergency " +
          "Services publishes its first annual summary of 2026 incidents from 2027-01-01.",
        ] },
  S1: { head: "Capability becomes utility",
        lines: [
          "Combined annual capital expenditure guidance from Alphabet, Amazon, Meta and " +
          "Microsoft stands at roughly $725 billion, against roughly $410 billion the previous " +
          "year.",
          "Stanford's AI Index counts 5,427 data centres in the United States, more than ten " +
          "times the number in any other country.",
          "PJM Interconnection's capacity auction has cleared at its ceiling of $329.17 per " +
          "megawatt-day, against $28.92 two auctions earlier.",
        ] },
  S2: { head: "Many capable states",
        lines: [
          "A United States order of 2026-07-10 moved the United Arab Emirates into Country " +
          "Group A:5, placing approved end users including G42 and Core42 under general " +
          "authorisation for advanced processors.",
          "The European Commission has committed €20 billion under InvestAI toward up to five " +
          "AI gigafactories, each specified at more than 100,000 advanced processors.",
          "India's IndiaAI Mission has deployed roughly 34,000 processors for use by startups, " +
          "researchers and government agencies at a subsidised hourly rate.",
        ] },
  S3: { head: "Electricity sets the pace",
        lines: [
          "Gallup measured opposition running from 47% to 71% across seven national surveys, a " +
            "wider spread than any question about a nuclear plant.",
          "The Lawrence Berkeley National Laboratory reports 2,061 gigawatts of generation and " +
          "storage in United States interconnection queues, with about fourteen gigawatts " +
          "withdrawn for every gigawatt reaching commercial operation.",
          "Data Center Watch counted at least 75 projects worth $130 billion delayed or blocked " +
          "in a single quarter and at least 63 local moratorium actions; Georgia's HB 1012 " +
          "proposes a statewide moratorium.",
        ] },
  S4: { head: "Two technology zones",
        lines: [
          "A Bureau of Industry and Security rule of 2026-01-13 cleared roughly ten Chinese " +
          "firms to buy up to 75,000 Nvidia H200 processors each under a 25% export levy.",
          "The Bureau of Industry and Security announced close to $420 million in penalties and " +
          "forfeitures arising from chip smuggling.",
          "A United States government evaluation placed DeepSeek V4 Pro about eight months " +
          "behind the leading United States model.",
        ] },
  S5: { head: "Rationing then redundancy",
        lines: [
          "TSMC fabricates roughly nine tenths of world output at the most advanced logic " +
          "nodes, with its advanced packaging capacity allocated a year ahead of production.",
          "Qualifying a first advanced line in the United States takes eighteen to twenty-four " +
          "months.",
          "The CHIPS and Science Act of 2022 funded leading-edge fabrication in Arizona, " +
          "awarding TSMC $6.565 billion toward three Phoenix plants.",
        ] },
  T1: { head: "Discovery outruns verification",
        lines: [
          "Anthropic reports Claude authoring more than 80% of the code merged into production " +
          "as of May 2026; OpenAI has set a target of a full automated AI researcher by March " +
          "2028.",
          "Arithmetic on METR's published doubling rates carries a 50% time horizon from 16 " +
          "hours to a working month of 167 hours between March 2027 and July 2027.",
          "The FDA's Center for Drug Evaluation and Research approved 46 novel drugs in 2025, " +
          "against an industry-estimated discovery-to-approval span of 10 to 15 years.",
        ] },
  T2: { head: "Forewarning unevenly spent",
        lines: [
          "In the first half of 2026 United States states enacted 109 AI laws and 28 " +
          "data-center statutes, out of 1,561 bills introduced across 45 states.",
          "Illinois SB 315, signed 2026-07-06 and effective 2027-01-01, requires 72-hour " +
          "incident reporting and annual independent third-party audits of developers above " +
          "$500 million in annual revenue.",
          "The ISO and Verisk generative-AI liability exclusion endorsements CG 40 47, CG 40 48 " +
          "and CG 35 08 date from 2026-01-01.",
        ] },
  T3: { head: "Diffusion overtakes capability",
        lines: [
          "The Metaculus community median for a first general AI system stood at January 2033 " +
          "in mid-July 2026, drawn from more than 1,800 forecasters.",
          "Landing a 167-hour time horizon in January 2033 requires a doubling time of 718 " +
          "days, against the 89 to 196 days METR has published.",
          "The Remote Labor Index recorded 2.5% of client-judged projects completed in October " +
          "2025 and 15.8% on 2026-07-01.",
        ] },
  T4: { head: "Physical inputs set pace",
        lines: [
          "In a Gallup survey of 1,000 United States adults conducted 2 to 18 March 2026, 71% " +
          "opposed an AI data center in their area, against 53% opposing a local nuclear plant.",
          "In Q1 2026 Data Center Watch counted at least 75 projects worth $130 billion delayed " +
          "or blocked, alongside at least 63 local moratorium actions passed.",
          "Epoch AI projects power for the largest single training runs reaching 4 to 16 " +
          "gigawatts by 2030. Villalobos and colleagues estimate the quality-adjusted stock of " +
          "public human text at about 300 trillion tokens.",
        ] },
  T5: { head: "Ceiling fixed, price collapses",
        lines: [
          "A study spanning more than 400,000 GPU-hours finds that loss aggregation, " +
          "normalization, curriculum and off-policy choices change the compute efficiency of " +
          "reinforcement-learning training, although its asymptote stays in place.",
          "A survey of 475 AI researchers published by the AAAI presidential panel in March " +
          "2025 found 76% judging it unlikely or very unlikely that scaling current approaches " +
          "yields artificial general intelligence.",
          "Epoch AI measures the price of GPT-4-level performance falling 40x per year, from " +
          "near $20 per million tokens in late 2022 to near $0.40 in early 2026.",
        ] },
  L1: { head: "Lines held, statute sought",
        lines: [
          "A laboratory barred sales to entities more than half owned from an unsupported " +
          "region, at a stated cost of several hundred million dollars.",
          "Its strongest cyber system reached roughly fifty vetted defender organisations " +
          "before any buyer.",
          "It committed in February 2026 to cover the full grid-upgrade cost near its " +
          "facilities, and pledged an advertising-free assistant.",
        ] },
  L2: { head: "Inside the security perimeter",
        lines: [
          "Four laboratories that had banned military applications reversed those bans between " +
          "2024 and 2026.",
          "Four defence awards carrying $200M ceilings landed, and a broader group of " +
          "laboratories signed for classified military use.",
          "Allied states received ten sovereign campuses in a first phase, one of them a Gulf " +
          "campus with 200MW live in 2026.",
        ] },
  L3: { head: "Referee funded by members",
        lines: [
          "Twelve companies publish frontier safety frameworks, and twenty-six signed a " +
          "European code in full.",
          "A policy revision effective February 2026 committed one laboratory to match a " +
          "rival's mitigations where evidence shows them more effective at comparable cost.",
          "A self-regulator proposed would start voluntary and become mandatory once members " +
          "show it works.",
        ] },
  L4: { head: "Earnings govern release",
        lines: [
          "Four leading developers weakened or voided unilateral pause pledges between February " +
          "and July 2026, one framework permitting adjusted requirements once a rival ships a " +
          "high-risk system without comparable safeguards.",
          "One anti-regulation political network assembled between $75M and $140M by mid-2026, " +
          "spent $8M to defeat the author of a state safety law and directed about $65M more at " +
          "state legislatures.",
          "A summer 2026 index graded the field at C+ at best and placed three companies at F.",
        ] },
  L5: { head: "Weights spread, licences tighten",
        lines: [
          "In most months of 2026 the largest open-weight model came from a Chinese laboratory, " +
          "whose monthly parameter ceiling ran between 754B and 2.78T against a United States " +
          "ceiling below 130B.",
          "One open-weight family passed a billion cumulative downloads and anchors about 40% " +
          "of new derivatives on the main model hub.",
          "A letter opposing early restrictions on open weights carried 77 company signatures " +
          "and reached 150 within days, with the three United States frontier laboratories " +
          "declining to sign.",
        ] },
  L6: { head: "The laboratories sell the bound itself",
        lines: [
          "On August 2026 a laboratory found that an unreleased model might meet the highest " +
          "cybersecurity tier of its own framework, held its largest planned training run for " +
          "about two weeks, and published the reason.",
          "That disclosure put monitoring at roughly 20% of the inference compute being " +
          "monitored, with any alert unresolved after thirty minutes pausing the activity.",
          "A rival framework effective 2026-06-30 omits any self-improvement threshold and " +
          "calls loss of control speculative.",
        ] },
};
