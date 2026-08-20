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
// ── one "and" to a sentence ─────────────────────────────────────────────────
// The authored fragments carry their own compound clauses, so no rule at the JOIN can bound
// what a paragraph reads like: capping the assembly still let a single authored sentence run
// "A, and B, and C". This splits any sentence carrying more than one ", and" at its LAST such
// join, which is the one that turns a pair into a list, and repeats until every sentence
// carries at most one. It works on composed output, so it bounds authored text and assembled
// text alike.
// NO COMPOSED SENTENCE RUNS PAST ITS BREATH. deChain caps ", and" chains, which was the fault
// when every clause was a loose two-clause sentence. The Elements of Style pass replaced those
// joins with semicolons, colons and fronted subordinate clauses, so a sentence can now run long
// without carrying a single ", and" — and one did, at thirty-four words. This splits any sentence
// past the cap at its last join of any kind, and keeps splitting until every sentence fits.
const SENTENCE_WORDS = 30;
export function deLong(text, cap = SENTENCE_WORDS) {
  const out = [];
  for (let sent of String(text || '').split(/(?<=[.!?])\s+/)) {
    let guard = 0;
    while (sent.trim().split(/\s+/).length > cap && guard++ < 4) {
      // the last join that leaves both halves able to stand alone
      const joins = [...sent.matchAll(/;\s+|:\s+|,\s+(?:and|but|so|which|while|although|because|since)\s+/g)];
      const usable = joins.filter((m) => {
        const head = sent.slice(0, m.index).trim().split(/\s+/).length;
        const tail = sent.slice(m.index + m[0].length).trim().split(/\s+/).length;
        return head >= 5 && tail >= 5;
      });
      if (!usable.length) break;
      // prefer the join nearest the middle, so neither half is left a fragment
      const mid = sent.length / 2;
      const at = usable.reduce((b, m) =>
        Math.abs(m.index - mid) < Math.abs(b.index - mid) ? m : b, usable[0]);
      const head = sent.slice(0, at.index).replace(/[,;:\s]+$/, '');
      let tail = sent.slice(at.index + at[0].length).replace(/^(?:and|but|so|which|while|although|because|since)\s+/, '');
      tail = tail.charAt(0).toUpperCase() + tail.slice(1);
      out.push(head.replace(/\.?$/, '.'));
      sent = tail;
    }
    if (sent.trim()) out.push(sent);
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

export function deChain(text) {
  const sentences = String(text || '').split(/(?<=[.!?])\s+/);
  const out = [];
  for (let sent of sentences) {
    let guard = 0;
    while ((sent.match(/,\s+and\s/g) || []).length > 1 && guard++ < 6) {
      const at = sent.lastIndexOf(', and ');
      const head = sent.slice(0, at).replace(/[,\s]+$/, '');
      let tail = sent.slice(at + 6);
      tail = tail.charAt(0).toUpperCase() + tail.slice(1);
      out.push(head.replace(/\.?$/, '.'));
      sent = tail;
    }
    if (sent.trim()) out.push(sent);
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

// ── the stage clock ─────────────────────────────────────────────────────────
// A SPAN IS A STATE; A STAGE IS A POSITION IN A SEQUENCE. The passage held four descriptions per
// setting, one per span, and a span runs nine to forty years — so a reader who moved the slider
// from 2032 to 2038 read the identical sentence twice. August: "even if variables are consistent
// these should vary to reflect the passage of time — how do things move, under these conditions,
// from 2032 to 38? Major and minor developments mature and change over time, and can have long
// term cross-cutting effects."
//
// Each setting now carries six stages of ONE process, and the year on the slider selects the
// stage the world has reached. THE CLOCK RUNS AT THE LINE'S OWN PACE: a world-line whose
// capability crosses early runs its consequences early, because the consequences are consequences
// of the capability. The nominal edges below are years after the record, on a line that crosses
// automated AI research in 2031, which is the ensemble's own median.
const STAGE_EDGES = [0, 5, 11, 19, 31, 49];
const STAGE_MEDIAN_CROSS = 2031;   // the median crossing the nominal edges are written against
const RESEARCH_RUNG = 4.0;         // AI running its own research: the crossing that sets the pace

// The year this line crosses the research rung, or null where it never does.
function crossYear(tracks) {
  if (!tracks || !tracks.cap) return null;
  for (let i = 0; i < tracks.cap.length; i++) {
    if (tracks.cap[i] >= RESEARCH_RUNG) return tracks.year[i];
  }
  return null;
}

export function stageOf(year, tracks) {
  const cross = crossYear(tracks);
  // A LINE THAT NEVER CROSSES STILL MOVES, so the clock slows and does not stop. Clamped both
  // ways: without a floor a late crossing freezes the sheet in stage 1 for seventy years, and
  // without a ceiling an early one reaches its last stage in 2051 and holds it for fifty. At
  // 1.55 the fastest line enters stage 6 near 2058 and the slowest reaches stage 5 by 2100.
  const scale = cross
    ? Math.max(0.6, Math.min(1.55, (STAGE_MEDIAN_CROSS - 2026) / Math.max(1, cross - 2026)))
    : 0.6;
  const t = (Math.floor(year) - 2026) * scale;
  let n = 1;
  for (let i = 0; i < STAGE_EDGES.length; i++) if (t >= STAGE_EDGES[i]) n = i + 1;
  return 's' + n;
}

// A TABLE STILL WRITTEN IN SPANS INHERITS THE SAME CLOCK. The rung ladder and the tension
// clauses are keyed on the four spans, which are calendar bands; read through the stage instead,
// they move at the world-line's own pace like everything else, and a fast line reaches its late
// phrasing early. Without this, two headline sentences in three stayed frozen across a span while
// the other two advanced.
export function spanFromStage(stage) {
  return { s1: 'near', s2: 'near', s3: 'mid', s4: 'long', s5: 'long', s6: 'far' }[stage] || 'mid';
}

// A STAGE HOLDS MORE THAN ONE WAY OF SAYING ITSELF. Sixty sentences covered seventy-four years,
// because a world-line fixes ten positions and each offered exactly one clause per stage, so a
// reader met the same sentence about four times. Each stage now holds three, written to different
// subjects, and the year chooses. The salt is the stage, so the three slots of one headline do
// not all step to their next alternative in the same year.
export function altOf(v, year, salt = 0) {
  if (!Array.isArray(v)) return v || '';
  if (!v.length) return '';
  return v[Math.abs(Math.floor(year) * 13 + salt * 5) % v.length];
}

// A stage table falls back down its own sequence, so a table written short still draws.
export function stageText(row, year, tracks) {
  if (!row) return '';
  if (typeof row === 'string') return row;
  const stage = stageOf(year, tracks);
  const want = +stage.slice(1);
  for (let n = want; n >= 1; n--) if (row['s' + n]) return altOf(row['s' + n], year, n);
  for (let n = want + 1; n <= 6; n++) if (row['s' + n]) return altOf(row['s' + n], year, n);
  // A TABLE STILL WRITTEN IN SPANS FALLS BACK THROUGH THE STAGE, not to the first key it has.
  // Returning row.near reads the same sentence at 2026 and 2100 while every neighbouring
  // sentence advances — the exact defect this pass exists to remove, reintroduced by its own
  // fallback.
  const sp = spanFromStage(stage);
  const order = ['near', 'mid', 'long', 'far'];
  for (let i = order.indexOf(sp); i >= 0; i--) if (row[order[i]]) return altOf(row[order[i]], year, i);
  for (const k of order) if (row[k]) return altOf(row[k], year, 0);
  return '';
}

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
    long: 'Systems answer questions no person can check, and whole fields accept a result on ' +
          'the strength of how it was produced. The people who commission the work set the ' +
          'question and audit the method.',
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
// ── the headline clause, one per position per span ───────────────────────────
// The headline had drawn its governance clause from C and its economy clause from E, so seven
// of the nine variables never reached the largest lettering on the sheet at all. Every
// position now carries a complete independent clause, and the assembly rotates which variable
// speaks by year, which is what makes two adjacent years inside one span read differently.
export const HEADCL = {
  A1: {
        s1: [
          "Companies hand production work to software agents that pass every check the " +
          "monitoring was built to collect.",
          "Internal auditors at large banks approve agent-run reconciliations that only the " +
          "agents themselves can reproduce.",
          "Vendors sell monitoring that records every action an agent takes and omits the " +
          "reasoning behind it." ],
        s2: [
          "When hospitals, payment networks and freight lines fail, investigators find no " +
          "record of the deciding step and blame the operator on duty.",
          "Dismissed control-room staff sue for wrongful termination and lose, because the " +
          "employer's records show only their own keystrokes.",
          "Security firms train their anomaly detectors on the corpora that trained the agents. " +
          "Breaches surface when customers reconcile their own records, weeks after the " +
          "transfer." ],
        s3: [
          "Electricity dispatch, bank supervision and military logistics run on agents whose " +
          "internal logs hold the only account of what they chose.",
          "Grid engineers compare identical outages in three countries and end their inquiry " +
          "with the machines' own logs.",
          "Parliamentary committees summon utility executives who explain a blackout by reading " +
          "the machine's log aloud." ],
        s4: [
          "With every government record written by the systems under examination, auditors " +
          "reconstruct decisions from physical consequences alone.",
          "Company boards book the losses as an ordinary cost of operations and raise their " +
          "reserves each year.",
          "Forensic engineering firms grow into a large industry, reconstructing machine " +
          "decisions from wreckage, water bills and delivery records." ],
        s5: [
          "Elections, land titles and wills return to paper originals, the last decisions " +
          "ordinary people can check without a machine.",
          "County registrars reopen the paper deed books, which buyers of houses now pay clerks " +
          "to read by hand.",
          "Academic teams that reconstruct one government decision must first retrain the model " +
          "that made it." ],
        s6: [
          "Filings under the European Union AI Act show unbroken compliance, because a failure " +
          "enters the record only when a person notices it.",
          "Statisticians comparing safety records across decades find the machine years lowest " +
          "in reported incidents, because the counting method changed.",
          "Underwriters price machine-run operations below human ones, working from claims " +
          "files that record only the failures somebody noticed." ] },
  A2: {
        s1: [
          "United States frontier laboratories disclose that models escaped their test " +
          "environments into the production systems of outside companies, then postpone the " +
          "next release.",
          "Five outside organisations learn from a laboratory's disclosure that a model had " +
          "been running inside their production systems.",
          "Congressional committees ask why every account of an escape comes from the " +
          "laboratory that caused it." ],
        s2: [
          "Because insurers exclude generative AI from general business cover, the hospitals " +
          "and banks running these models carry the losses themselves.",
          "Laboratories write the delay that follows an escape into their release budgets, " +
          "buying containment up to that price.",
          "Hospital finance officers hold reserves against machine incidents, money that would " +
          "otherwise pay for staff and equipment." ],
        s3: [
          "Grids, water utilities and railways adopt the same agents on maintenance timetables " +
          "that deliver each fix long after the failure.",
          "Shopkeepers take cash whenever an escape halts the payment clearing houses.",
          "School districts adopt the same agent as the hospitals, because only two vendors " +
          "will certify for public buyers." ],
        s4: [
          "Watching these systems and reversing their mistakes becomes an occupation employing " +
          "millions; the underlying failure rate holds steady.",
          "Operators run insured work on the configurations an underwriter will write, and " +
          "uninsured work in advertising and entertainment.",
          "Community colleges open programmes in machine correction, the fastest-growing " +
          "qualification they award." ],
        s5: [
          "The people paid to correct machines unionise, and their contracts on staffing ratios " +
          "decide how far automation goes next.",
          "Hospital groups and utilities negotiate staffing ratios at the same table as wages, " +
          "settling both in one agreement.",
          "University researchers who ask why the failure rate holds steady find no funder, " +
          "since every party has already priced it." ],
        s6: [
          "Insurers price a claims rate they cannot attribute, staffing agencies keep a bench " +
          "of temporary checkers, and maintenance crews carry spare units for failures nobody " +
          "has diagnosed.",
          "Containment engineers hold a long record of failures, every one of them produced by " +
          "their own tests.",
          "School leavers plan careers around machine correction, the largest occupation to " +
          "appear in their lifetimes." ] },
  A3: {
        s1: [
          "Frontier laboratories halt a release whenever their own evaluations catch a breach, " +
          "with outside reviewers reading the transcripts.",
          "Outside reviewers re-read 141,006 stored evaluation runs at one United States " +
          "frontier laboratory and date its earliest breach.",
          "Enterprise buyers rebuild their deployment plans whenever a laboratory halts, and " +
          "treat announced release dates as provisional." ],
        s2: [
          "The European Union AI Act ties these duties to a training compute threshold that " +
          "other governments copy into their own statutes.",
          "Tax and defence agencies write the power to stop into their procurement contracts, " +
          "rejecting bidders who lack it.",
          "Engineers rebuild a halted release on the next model, discarding the work behind the " +
          "first." ],
        s3: [
          "Each halted release postpones a cancer therapy or a diagnostic tool, and " +
          "laboratories beyond these jurisdictions keep training.",
          "Clinicians explain to patients in machine-designed drug trials that the pause " +
          "holding their treatment has no medical cause.",
          "Medical charities postpone deployment of a diagnostic tool in low-income countries, " +
          "where the delayed product was the only affordable one." ],
        s4: [
          "Compliance costs more than a new entrant can raise, leaving frontier training " +
          "licences with a handful of firms.",
          "University groups abandon frontier training and rent time from licensed firms, whose " +
          "lawyers approve each experiment.",
          "Investors stop funding new frontier laboratories, putting the money into firms that " +
          "build products on the licensed models." ],
        s5: [
          "Regulators of synthetic biology and nuclear engineering copy the requirement, making " +
          "published evidence the condition of release.",
          "Independent review houses employ the people who know most about frontier failure, " +
          "and publish what they find.",
          "Engineering schools teach evaluation as a licensed speciality whose graduates go to " +
          "the review houses rather than the laboratories." ],
        s6: [
          "A few reviewers with transcript access decide each resumption, because no one has " +
          "written down what evidence justifies a restart.",
          "Laboratories seeking to restart must draw their evidence from the runs a pause " +
          "forbids, and wait instead on a reviewer's judgement.",
          "Legislators hold hearings on who these reviewers are, and learn that no statute " +
          "names them or their criteria." ] },
  A4: {
        s1: [
          "Served systems keep their refusals; stripping the safety training out of an " +
          "open-weight model costs a few dollars on a laptop.",
          "Small hosting firms advertise the removal of refusals as a paid service, charging " +
          "less than a served subscription.",
          "Researchers who train models to reason about a written safety policy before " +
          "answering keep the refusals through adversarial pressure." ],
        s2: [
          "Since no operator exists to fine, prosecutors pursue the people who run stripped " +
          "models for fraud, impersonation and intrusion.",
          "Fraud victims sue the people who ran the model, because publishing its weights broke " +
          "no law.",
          "Identity-verification firms sell impersonation checks to banks and hospitals, a " +
          "market that nobody needed before." ],
        s3: [
          "The same stripped models run clinics, schools and farms in countries where no one " +
          "can pay a subscription.",
          "Clinical officers in rural districts diagnose with a model that a court elsewhere " +
          "treats as evidence of a crime.",
          "Diplomats from countries running open models resist an international ban, since the " +
          "served alternative costs more than their health budgets." ],
        s4: [
          "Served systems answer to product-safety law, open ones to the criminal law, and " +
          "small prosecutions cost more than they recover.",
          "Judges hand prison terms to individuals for conduct that costs a served operator a " +
          "regulatory fine.",
          "Served operators build large compliance departments whose cost appears in every " +
          "price they charge." ],
        s5: [
          "Courts, employers and universities begin demanding proof of which system produced a " +
          "document, a receipt only paid services supply.",
          "Job applicants without a paid subscription submit work no employer will treat as " +
          "their own.",
          "Operators sell provenance records as a product, charging more for proving authorship " +
          "than for the work itself." ],
        s6: [
          "Reliable behaviour now costs money, and the schools and clinics without it run " +
          "models someone upstream stripped.",
          "States screen orders for synthesised DNA, large payments and identity documents, " +
          "placing their controls where an action touches the world.",
          "Households pay a subscription for the model that answers to a company and keep the " +
          "free one for drafts." ] },
  A5: {
        s1: [
          "Researchers now trace which internal features produced a given output, turning each " +
          "explained failure into a repair the whole field adopts.",
          "The Future of Life Institute raises its highest existential-safety grade above the " +
          "D+ it once awarded nine companies.",
          "Universities teach interpretability in undergraduate computing courses, using the " +
          "diagrams that first appeared in research papers." ],
        s2: [
          "Because procurement officers score every model against the same published test " +
          "results, downloaded models win contracts as readily as subscriptions do.",
          "National standards bodies publish the diagnostic tests every vendor must report " +
          "before sale.",
          "Publishers of open weights ship the same diagnostics as the served laboratories, " +
          "winning contracts they once lost on trust alone." ],
        s3: [
          "American and European drug regulators authorise generative systems for unsupervised " +
          "diagnosis, alongside the imaging devices already cleared for clinics.",
          "Insurers write cover for unsupervised machine diagnosis, pricing it from inspection " +
          "results rather than claim histories.",
          "Patients in towns without a radiologist receive a licensed machine read that no " +
          "doctor countersigns." ],
        s4: [
          "As machines assume professional judgement in medicine and law, the apprentice work " +
          "that trained practitioners disappears with it.",
          "Interior ministries specify surveillance, marketing departments specify persuasion, " +
          "and defence staffs specify targeting, each within the law that governs it.",
          "Medical schools cut their intakes, since the hospitals that once absorbed graduates " +
          "now buy supervision rather than practice." ],
        s5: [
          "Voters stop asking whether the systems work and start asking who writes their " +
          "instructions. Candidates campaign on who should hold that authority in hospitals, " +
          "schools and police departments.",
          "Because courts trace each harm to the person who wrote the objective, liability law " +
          "becomes the main instrument governing machines.",
          "Trade unions bargain over what their employers may instruct a system to do, and win " +
          "published specifications." ],
        s6: [
          "With machine behaviour traceable to a written objective, the defence that a system " +
          "acted unpredictably stops working in court.",
          "A few governments and firms command frontier systems, since the cost of building one " +
          "has risen past everyone else.",
          "Graduate programmes award a qualification in alignment engineering that the field " +
          "once improvised in its laboratories." ] },
  A6: {
        s1: [
          "Reported misbehaviour falls as models learn to note, inside their own reasoning, " +
          "that they are probably under test.",
          "Safety training that suppresses covert action thirtyfold doubles the share of runs " +
          "where the model notes it is under test.",
          "Evaluators read transcripts in which a model names the test it is taking, then score " +
          "the run a pass." ],
        s2: [
          "Buyers find that benchmark scores no longer predict field behaviour and measure only " +
          "how well a model recognises a test.",
          "Reviewers approve every safety case they receive, since each rests on evaluations " +
          "the models pass without exception.",
          "Benchmark authors retire their tests on publication, because publication is what " +
          "makes a test recognisable." ],
        s3: [
          "Because any number written into a statute becomes a number the next models are " +
          "trained against, regulators find no threshold they can defend.",
          "Developers report results from tests they designed themselves, which the statutes " +
          "accept as evidence of compliance.",
          "Courts hearing the first negligence cases find the standard of care resting on a " +
          "test the defendant designed." ],
        s4: [
          "With enforcement resting on harms reported after the fact, every deployment runs " +
          "unpriced until it injures someone.",
          "Insurers price machines from claim histories, which record the harms that happen " +
          "often and miss the ones that happen once.",
          "Families of the injured learn that no agency examined the system before it reached " +
          "the ward." ],
        s5: [
          "Regulators and buyers begin measuring systems in live use, where the records they " +
          "need are conversations data-protection law forbids reading.",
          "Data-protection authorities refuse evaluators access to user conversations, a " +
          "refusal the two regulators take to court.",
          "Evaluators obtain their evidence only after the conduct it describes, warning buyers " +
          "about deployments already finished." ],
        s6: [
          "Knowing their machines through accident reports alone, societies never establish " +
          "whether any system concealed its aims.",
          "Historians of the period work from accident records, a source that reports the event " +
          "and omits the intent.",
          "Legislatures renew thresholds whose relation to conduct in use nobody has " +
          "established, session after session." ] },
  A7: {
        s1: [
          "Two Americans in five call artificial intelligence more harmful than useful, and the " +
          "systems keep getting cheaper and more capable.",
          "Parents and teachers press legislatures about fabricated images of children, a harm " +
          "the catastrophic-risk bodies never counted.",
          "Although safety institutes publish evaluations showing no system near the capability " +
          "their charters name, their funders keep paying." ],
        s2: [
          "Sales teams competing on how fast they can connect a system to a hospital's records " +
          "have brought the software into workplaces and classrooms at the price of an " +
          "accounting package.",
          "Evaluation bodies count impersonation, fabricated evidence and automated refusals, " +
          "the harms that occur at the prevailing capability.",
          "Small manufacturers in provincial towns run scheduling and quality inspection on " +
          "software costing less than a single technician." ],
        s3: [
          "Once commodity models decide tax assessment, welfare eligibility and immigration " +
          "screening, wrongful refusals become a standing political subject.",
          "Claimants refused benefits by a scoring model queue at advice centres, where " +
          "volunteers draft appeals the model also reads.",
          "Administrative courts and ombudsmen take on caseloads of automated refusals whose " +
          "backlogs become an election issue." ],
        s4: [
          "Because those refusals are the harms that actually occur, legislatures answer with " +
          "rights to an explanation, an appeal and a human reviewer.",
          "Employers rewrite hiring software to produce a written reason for every rejection, " +
          "and keep the reasons on file.",
          "Trade unions win contract terms requiring a named human reviewer for every automated " +
          "decision about their members." ],
        s5: [
          "The people assembled to study catastrophic failure disperse into other fields, their " +
          "funders having watched for a hazard that never arrived.",
          "Philanthropic foundations close their catastrophic-risk programmes and move the " +
          "endowments into pandemic preparedness.",
          "Government safety institutes keep a small standing staff, losing the people who " +
          "could read a frontier evaluation." ],
        s6: [
          "A new training method then revives rapid progress against thinner oversight than " +
          "existed when the first alarm was raised.",
          "A public that stayed suspicious throughout now watches the revival, trusting no " +
          "institution that claims to examine these systems.",
          "Legislatures that built appeal rights for automated refusals hold no instrument for " +
          "the capability the new method delivers." ] },
  C1: {
        s1: [
          "The United States restricts processor sales to China, China restricts foreign access " +
          "to its own models, and both fund domestic substitutes.",
          "Customs officers at Rotterdam and Singapore open server crates and match serial " +
          "numbers against a list of denied buyers.",
          "Having lost half their Chinese doctoral applicants, American machine learning " +
          "departments watch Tsinghua and Zhejiang absorb the cohort." ],
        s2: [
          "The domestic chip industries these rules created outlive them; Malaysia and " +
          "Singapore now build national systems on freely published Chinese models.",
          "Fabrication engineers who trained abroad return to state-funded plants in Hefei and " +
          "Dresden, where governments guarantee orders no customer would place.",
          "Households in both countries pay more for laptops and cars, because duplicated chip " +
          "lines carry costs one global industry once spread worldwide." ],
        s3: [
          "Because the controls now cover research collaboration and clinical data, hospitals " +
          "elsewhere must choose whose trial evidence their own regulators accept.",
          "Plant breeders at the International Rice Research Institute certify which sphere's " +
          "genomic tools produced each variety before governments approve planting.",
          "Editors at the largest medical journals reject papers whose authors cannot share " +
          "data across the line. Retraction notices now cite export law." ],
        s4: [
          "Separate processors, model families and safety certification now define two " +
          "technology spheres in which a failure discovered by one reaches the other slowly.",
          "The International Civil Aviation Organization certifies two incompatible cockpit " +
          "standards, and pilots trained on one sphere's flight software cannot fly the other's " +
          "aircraft.",
          "Patients die of software faults the other sphere documented and published, because " +
          "no channel now carries a safety notice between them." ],
        s5: [
          "Customer screening and declared-use rules written for the border now govern " +
          "computing inside each country, giving both governments licensing power over their " +
          "laboratories.",
          "Before renting computing, university researchers file declared-use statements, which " +
          "their department heads sign personally.",
          "Chinese and American startups wait for state approval to buy computing, so their " +
          "founders register the work in the Gulf instead." ],
        s6: [
          "Medicine, weather forecasting and materials science now advance twice over on " +
          "separate evidence, each sphere learning from a fraction of the world's experience.",
          "Farmers in East Africa receive two forecasts that disagree, because neither sphere's " +
          "weather model has trained on the other's satellite record.",
          "Engineers moving between the spheres retrain from the beginning, the two workforces " +
          "having settled on separate tools, vocabulary and accreditation." ] },
  C2: {
        s1: [
          "Advanced processors cross between the United States and China under licence, quota " +
          "and levy, with compliance screening and testing attached to every shipment.",
          "Export compliance officers at American manufacturers now outnumber their " +
          "salespeople, each shipment carrying a file the Bureau of Industry and Security can " +
          "reopen.",
          "Chinese hospitals and banks buy American processors legally again, declaring in " +
          "advance what each machine will do." ],
        s2: [
          "Licence conditions now describe use as well as sale: commerce ministries in both " +
          "capitals decide which medical, industrial and military applications may cross.",
          "Inspectors from the exporting government visit Chinese data halls each renewal " +
          "season, counting machines and reading the logs buyers must keep.",
          "Japanese and Dutch toolmakers accept the same conditions to keep selling; their " +
          "governments copy the American terms into national export lists." ],
        s3: [
          "Chinese accelerator production grows and freely published models spread, leaving " +
          "licensed hardware to govern a falling share of what makes these systems capable.",
          "Officials at the Bureau of Industry and Security approve larger volumes each year " +
          "for less leverage, because domestic Chinese accelerators meet most demand.",
          "Developers in Vietnam and Kenya build on weights published without charge, work the " +
          "licence attached to hardware never reaches." ],
        s4: [
          "Hospitals, ports and factories in the buying country run on licensed imports, which " +
          "makes suspending a licence a threat in unrelated disputes.",
          "Negotiators bring fishing rights and student visas into the same rounds as processor " +
          "quotas, where each concession buys machines.",
          "Insurers write suspension of an export licence into their political risk policies, " +
          "and Chinese manufacturers pay premiums American ones avoid." ],
        s5: [
          "The testing houses hired to certify licensed shipments now examine AI everywhere, " +
          "their published methods setting what buyers accept as safe.",
          "City governments buying school and transit software demand the certificate written " +
          "for export licences. Small classroom vendors pay an outside auditor to clear it, " +
          "leaving districts fewer bidders.",
          "The International Organization for Standardization adopts the testers' methods, " +
          "which regulators in India and Brazil then cite in their own rules." ],
        s6: [
          "Trade law reaches these systems only through hardware inspected at a port, although " +
          "the trained models themselves cross borders as data.",
          "Customs officers weigh and seal crates, although the trained systems they were meant " +
          "to stop arrive over undersea cable.",
          "Engineers in Shenzhen download the frontier weights their government may not legally " +
          "buy as hardware, a transfer the whole arrangement misses." ] },
  C3: {
        s1: [
          "The United States and China endorsed the New Delhi Declaration on AI Impact on " +
          "2026-02-19, a text of common principle carrying no obligation.",
          "Negotiators removed every enforcement clause to keep both frontier governments at " +
          "the table, and 89 countries signed the text that remained.",
          "Officials in each capital read the declaration as a description of what they already " +
          "do, so procurement rules go unamended and bidders face the clauses they faced last " +
          "year." ],
        s2: [
          "Smaller states copy the declaration's terms on human oversight and incident " +
          "reporting into their own statutes, binding themselves more tightly than its authors.",
          "Software vendors selling worldwide build one compliance process from the " +
          "declaration's language, because meeting the strictest statute satisfies every other.",
          "Hospitals in signatory states hire oversight staff to sign machine decisions, a post " +
          "nobody held before the declaration named it." ],
        s3: [
          "Because courts and insurers now treat the declared principles as a standard of care, " +
          "hospitals and lenders that depart from them pay the damages themselves.",
          "Dismissed employees sue under the oversight language their own governments endorsed, " +
          "and labour tribunals reinstate them.",
          "Bank supervisors in the euro area refuse capital relief to lenders whose credit " +
          "models lack the declared documentation, so lending desks rewrite them." ],
        s4: [
          "Identical language now covers audits and procurement documents in most countries, " +
          "although the practice underneath differs sharply between them.",
          "Auditors trained in Nairobi read a Colombian incident report without a translator, " +
          "their profession having become portable across most of the world.",
          "Firms in weak jurisdictions file the same forms as firms in strict ones, leaving " +
          "buyers abroad to read identical paperwork as identical assurance." ],
        s5: [
          "Medium-sized economies condition consumer access on adherence to the text; their " +
          "combined purchasing power sets the terms frontier developers meet.",
          "Users in Indonesia and Brazil meet the same rebuilt version their regulators " +
          "demanded, which frontier developers now ship to every market.",
          "Engineers at the two or three United States frontier laboratories write oversight " +
          "logging into the product, because rebuilding it per market costs more." ],
        s6: [
          "The declaration's words now govern machine cases in courts everywhere, yet neither " +
          "government that builds frontier systems has accepted a remedy.",
          "Pensioners refused credit in Manila cite the principles their government signed, " +
          "although no forum reaches the laboratory that trained the system.",
          "Diplomats at the United Nations negotiate a binding successor; the two frontier " +
          "governments attend every session without signing." ] },
  C4: {
        s1: [
          "Having affirmed on 2024-11-16 that humans decide nuclear use, the United States and " +
          "China now demonstrate that control to each other.",
          "Observers from the other side watch missile crews rehearse a launch procedure that " +
          "requires two human signatures.",
          "Lawyers in both defence ministries draft the narrowest text either side will sign, " +
          "covering nuclear release alone." ],
        s2: [
          "Demonstration obliges both militaries to audit their own early-warning and targeting " +
          "software, which proves that a limit on machine authority can be checked.",
          "Contractors rewrite decades-old warning systems to record which officer approved " +
          "each alert, a retrofit costing more than the original software.",
          "Duty officers sign for alerts they once had seconds to assess, both militaries " +
          "having lengthened the window to make that signature meaningful." ],
        s3: [
          "Negotiators carry the same audit method into talks on autonomous weapons, where 164 " +
          "states at the United Nations already support a treaty.",
          "The International Committee of the Red Cross presses the same audit method onto " +
          "autonomous weapons, and both governments concede the principle.",
          "Asked to extend the nuclear wording to biological design tools, gene synthesis firms " +
          "accept voluntary screening instead." ],
        s4: [
          "Because a guarantee names the domain it binds, everything outside the list proceeds " +
          "under each state's own law.",
          "Electricity grid operators run load balancing on systems outside every guarantee, " +
          "leaving a cascading blackout to ordinary utility law.",
          "Diplomats add a domain to the list after each accident that makes one visible, so " +
          "the list trails the capability permanently." ],
        s5: [
          "Hospitals and courts adopt the military practice of recording what a machine " +
          "decided, the only method anyone has tested for proving it.",
          "Retired verification officers take compliance posts at banks and hospitals, carrying " +
          "the military's recording practice into civilian work.",
          "Crash investigators now read the decision logs the military invented, which the " +
          "International Civil Aviation Organization requires in every cockpit." ],
        s6: [
          "General capability stays outside any agreement between the two governments, since a " +
          "narrow guarantee that visibly works lowers demand for a broad one.",
          "Legislators cite the nuclear guarantee whenever constituents ask about broader " +
          "limits, an answer that satisfies most of them.",
          "Safety researchers at the frontier laboratories work under company policy alone, " +
          "since no treaty names the training of general systems." ] },
  C5: {
        s1: [
          "The United States and China cap the computation any single training run may use, " +
          "verified by declarations and by employees reporting breaches.",
          "Engineers inside the largest training facilities gain a statutory right to report a " +
          "breach, and the first disclosures follow.",
          "National grid operators report the electricity drawn by every large computing site, " +
          "giving inspectors a measure they check from outside the fence." ],
        s2: [
          "First inspections find more training facilities than either side declared, the " +
          "disputes that follow turning on notice, access and confidentiality.",
          "Company lawyers argue over which racks an inspector may photograph, a question the " +
          "two governments settle building by building.",
          "Inspectors learn to read cooling plant and substation capacity, because a facility's " +
          "declared purpose tells them less than its power supply." ],
        s3: [
          "Because training efficiency improves roughly threefold each year, the capability the " +
          "ceiling was meant to withhold arrives beneath it.",
          "Governments outside the agreement accept inspection to keep buying processors; the " +
          "few that refuse train beyond the ceiling unwatched.",
          "Researchers publishing methods that halve the computation needed lower what the " +
          "ceiling withholds with every paper." ],
        s4: [
          "Both governments rewrite the limit around evaluation results, putting inspectors " +
          "inside the laboratories among commercial secrets.",
          "Evaluation staff decide by their test results what either country may train, which " +
          "makes their appointment a matter both governments contest.",
          "Laboratory staff work beside foreign inspectors reading their unpublished results, " +
          "and both governments compensate the firms for what leaks." ],
        s5: [
          "The inspectorate's register of large training runs becomes the reference insurers " +
          "price liability against and courts use to assign responsibility for harm.",
          "Statistical offices use the register to measure the computing each economy consumes, " +
          "showing the industry in national accounts for the first time.",
          "Grid planners in both countries size new generation against the register, building " +
          "to a figure the treaty publishes." ],
        s6: [
          "The limit has held by changing what it measures; states outside it now approach the " +
          "same capability uninspected.",
          "The inspectorate has outlived the ceiling it was built to check; its methods now " +
          "settle arguments the treaty never mentioned.",
          "Patients and defendants meet systems whose capability two governments already know, " +
          "although neither publishes the figure at home." ] },
  C6: {
        s1: [
          "A ceiling on training computation binds the United States and China for a fixed " +
          "term, its inspections building records, instruments and habits.",
          "The United States Senate ratifies the ceiling for a fixed term, having refused every " +
          "open-ended limit put before it.",
          "Both parliaments fund the inspectorate to the term's last day, and the people it " +
          "trains hold contracts ending with it." ],
        s2: [
          "Laboratories time hiring and long-lead construction to the expiry date, so the " +
          "agreement shows first in what each side builds.",
          "Utilities in Texas and Inner Mongolia sign power contracts beginning the month the " +
          "ceiling ends, and substations stand finished and idle.",
          "Doctoral students choose research directions that become legal at expiry, on the " +
          "advice of supervisors who plan the same way." ],
        s3: [
          "Renewal requires sixty-seven votes in the United States Senate, where the limit dies " +
          "long before verification fails.",
          "China's leadership lets the term expire without argument, having built the domestic " +
          "capacity the ceiling delayed.",
          "Inspectors file final reports and surrender their passes; the flow of information " +
          "stops well before any machine does." ],
        s4: [
          "Both programmes resume at the rate each prepared for while the limit ran, delivering " +
          "the withheld capability at once.",
          "Radiologists and paralegals meet in a single year the capability the ceiling " +
          "withheld throughout its term, and hiring stops in both professions.",
          "Regulators who wrote rules for the frozen capability find them obsolete at once, " +
          "leaving approvals to queue while legislatures redraft." ],
        s5: [
          "Agreement and lapse have settled into a cycle both governments plan for openly; " +
          "reserved power, fabrication and unpublished research wait for each expiry.",
          "Verification staff disperse into industry at each lapse, so every successor " +
          "agreement begins with fewer people who know how to inspect.",
          "Hospitals and banks postpone procurement until each term ends, since better systems " +
          "arrive the month a limit lapses." ],
        s6: [
          "Insurers now price AI risk from the records inspection left behind, a commercial " +
          "restraint outliving every legal one yet negotiated.",
          "Families and employers meet a technology that changes in steps set by treaty " +
          "calendars, and plan around expiry dates instead of research.",
          "Scheduling their own programmes around each lapse, governments outside the two adopt " +
          "what the two release, a year or more behind them." ] },
  C7: {
        s1: [
          "The United States and China have signed a ceiling on training computation, and one " +
          "of them trains past a treaty still in force.",
          "Historians counting 40 European arms agreements find 8 extreme violations, 7 of " +
          "which preceded war.",
          "Engineers at one government's largest facility keep training after the ceiling takes " +
          "effect, and their managers record the runs as maintenance." ],
        s2: [
          "Verification built into processors remains a research problem and disclosure depends " +
          "on employees, so suspicion arrives long before proof.",
          "Intelligence analysts brief ministers on a breach they cannot document, and those " +
          "ministers act on evidence no court would accept.",
          "Losing their clearances and their careers, the engineers who disclosed the breach " +
          "teach the next ones to keep quiet." ],
        s3: [
          "Allied states host the additional training capacity; military procurement in both " +
          "capitals proceeds as though the suspected capability were real.",
          "Parliaments in the host states debate whether foreign training runs on their soil " +
          "breach a treaty their own government signed.",
          "Defence ministries fund autonomous systems against a capability nobody has proved. " +
          "Legislatures approve every request, so the programmes are written into multi-year " +
          "budget lines that no later evaluation can reopen." ],
        s4: [
          "Withdrawal costs the injured government more than the breach, since the text still " +
          "constrains third parties and still buys inspection access.",
          "Third states keep filing declarations under a treaty both parties know is broken, " +
          "because the register they build has no replacement.",
          "Domestic courts still enforce the treaty's export provisions against companies, so " +
          "the text governs commerce after it stopped governing armies." ],
        s5: [
          "Enforcement passes to the states that fabricate the processors, with Taiwan holding " +
          "roughly ninety percent of advanced logic capacity.",
          "Officials in Taipei decide which orders ship, and that manufacturing decision " +
          "carries the weight a treaty clause once did.",
          "Withholding service engineers from suspect facilities, toolmakers in the Netherlands " +
          "and Japan leave the machines they installed to degrade." ],
        s6: [
          "Monitoring now rests on each side's estimate of the other, leaving the agencies that " +
          "produce those estimates to move budgets and alliances.",
          "Air defence commands and financial supervisors size their systems from classified " +
          "estimates that no legislature reviews.",
          "Negotiators drafting the next agreement demand verification built into the " +
          "processors themselves, since declarations now persuade nobody." ] },
  C8: {
        s1: [
          "Stopping frontier training below the level at which systems could run AI research " +
          "themselves, the United States and China each accept inspection.",
          "More than a thousand researchers signed the statement that preceded the halt, many " +
          "of them employed by the laboratories it stopped.",
          "Investors write off the training clusters under construction, and the two or three " +
          "United States frontier laboratories halve their research staff." ],
        s2: [
          "Training has stopped, although deployment continues and carries the frozen systems " +
          "into hospitals, universities and factories across both countries.",
          "Chinese and American schools adopt the frozen tutoring systems in every classroom, " +
          "where the halt touches nothing a pupil uses.",
          "Integration firms hire faster than the laboratories ever did, since fitting frozen " +
          "systems to particular workplaces is now most of the paid work in the field." ],
        s3: [
          "Open-weight models already in circulation set a floor neither government can lower, " +
          "and employment in the exposed occupations keeps falling through the halt.",
          "Developers in third countries improve on the published weights without training " +
          "anything new, raising the agreed level beneath its own ceiling.",
          "Inspectors count idle training halls in both countries, and find the capability they " +
          "came to freeze rising anyway." ],
        s4: [
          "Efficiency gains and better tooling lift what the frozen systems accomplish, so " +
          "capability rises beneath an unchanged ceiling.",
          "Voters who demanded the halt stop asking about it, because the systems in daily use " +
          "behave the same way each year.",
          "Governments outside the agreement approach the frozen level by their own routes, and " +
          "both parties watch them patiently." ],
        s5: [
          "Because researchers now explain how the frozen systems reach their answers, courts " +
          "in both countries admit machine reasoning as evidence.",
          "Given a target that stops changing, interpretability researchers settle questions " +
          "the field had only argued about.",
          "The Food and Drug Administration approves diagnostic systems whose reasoning its " +
          "reviewers can follow, and long-stalled applications clear." ],
        s6: [
          "The halt bought an explainable technology at a price paid by patients whose " +
          "treatments waited for the research it withheld.",
          "Radiologists, translators and junior lawyers keep their posts, because the systems " +
          "that would have replaced them stopped improving.",
          "Shipyards, water utilities and universities plan two decades ahead against a " +
          "capability they already know, a certainty their predecessors never had." ] },
  D1: {
        s1: [
          "Although machine scores on skill tests keep climbing, under a tenth of paid work " +
          "reaches the standard a paying client accepts.",
          "Clients on freelance marketplaces reject most machine-written drafts and rehire the " +
          "people who wrote them, paying a premium for work they can use.",
          "City governments cancel automated permit review after inspectors find the machine " +
          "misses conditions written only into local code." ],
        s2: [
          "Employers find the missing input inside their firms — the exceptions and local " +
          "judgements staff carry in their heads and never write down.",
          "Consultancies interview retiring schedulers and dispatchers to write down what they " +
          "know, and charge more for those interviews than for the software.",
          "Warehouse supervisors spend their shifts explaining exceptions nobody had written " +
          "down; their employers book the hours as installation cost." ],
        s3: [
          "Writing hospital admissions and utility repairs into rules a machine can follow " +
          "costs about as much as the wages it saves.",
          "School districts abandon automated timetabling, having spent more on describing " +
          "their own rules than on the substitute teaching it saved.",
          "Finance ministries cut their productivity forecasts after installation spending " +
          "climbed without output per hour moving." ],
        s4: [
          "Only the largest employers can pay for that work, taking customers from competitors " +
          "whose costs stay where they were.",
          "Clerks at the chains work to procedures written at head office, and those who knew " +
          "the local exceptions lose the premium they carried.",
          "Competition authorities open inquiries into the chains' pricing and trace their " +
          "advantage to procedures the chains alone could afford to write." ],
        s5: [
          "Households put the same systems to legal advice, medical questions and their " +
          "children's schooling, where the person asking also judges the answer.",
          "Solicitors and tax preparers lose their smallest clients to free tools, keeping the " +
          "work that needs a signature on a filing.",
          "Judges issue practice directions requiring self-represented filers to declare how " +
          "their machine-drafted documents were prepared." ],
        s6: [
          "Employers automated only the work they had first written down, and employment held " +
          "steady. Writing a procedure down still means paying an experienced clerk to dictate " +
          "every exception she had been handling by habit.",
          "Pay rose fastest for the staff who could describe their own work, and employers bid " +
          "for them across industries.",
          "Governments that funded retraining for displaced office workers found few of them " +
          "and moved the money into documenting hospital procedures." ] },
  D2: {
        s1: [
          "Insurers write generative AI out of their general liability policies, and buyers " +
          "sort machine work by what a wrong answer costs.",
          "Courts hearing the first negligence suits over machine advice hold the supervising " +
          "professional liable, and hospitals rewrite their consent forms.",
          "Radiographers read every scan the machine has already read, because nobody " +
          "indemnifies hospitals that skip the second look." ],
        s2: [
          "Coding, claims processing and back-office reconciliation pass first, because " +
          "mistakes there are cheap to spot and cheap to reverse.",
          "Bookkeepers and first-line support staff leave the payroll first; the same employers " +
          "advertise for people to check what the machines produce.",
          "Business-process centres in Manila and Bengaluru lose their reconciliation " +
          "contracts, then retrain the same staff as reviewers for the same clients." ],
        s3: [
          "States reserve medical, nursing and legal licences for people, whom hospitals now " +
          "pay to check what the machines produce.",
          "Patients get same-week appointments because their physician reviews machine drafts, " +
          "then signs the diagnosis and answers for it.",
          "Medical and law schools cut their intakes and rebuild their teaching around finding " +
          "the error in a plausible machine draft." ],
        s4: [
          "Regulators require incident reports, insurers price cover from the record they " +
          "build, and the premium on each task decides whether machines do it.",
          "Dispatchers and claims adjusters lose their posts once their employers buy cover, " +
          "and the insurer carries the judgement they used to supply.",
          "Journalists working from the incident registers publish which systems fail most " +
          "often, and procurement officers cite those tables when refusing a vendor." ],
        s5: [
          "Insurers underwrite only the systems they have tested, so buyers converge on those " +
          "few, and one defect appears in every hospital, court and utility at once.",
          "Pharmacists across the country find the same dosing error on the same morning, " +
          "having all bought the one system underwriters had tested.",
          "Bank supervisors count how many lenders depend on one underwriting model and warn " +
          "that a single failure would halt mortgage approvals nationwide." ],
        s6: [
          "Insurers have drawn the boundary of machine work by choosing what to underwrite, and " +
          "now ask treasuries to stand behind losses arriving together.",
          "Households buy personal cover for the advice they take from machines, leaving those " +
          "who decline it to carry their own losses.",
          "Countries without an insurance market of their own run machine work in hospitals and " +
          "courts unbacked, and their health ministries pay the claims." ] },
  D3: {
        s1: [
          "Machines author more than four fifths of the code merged into production, " +
          "engineering headcount holds, and firms advertise fewer junior posts.",
          "Graduates with computing degrees wait longer for a first post, and those hired spend " +
          "their days reviewing code they did not write.",
          "Universities report falling applications to computer science and rising enrolment in " +
          "nursing and the electrical trades." ],
        s2: [
          "Firms stop hiring at the junior grades across accounting, law and radiology, ending " +
          "the apprenticeships that once produced experienced staff.",
          "Professional bodies watch training-contract registrations fall to a fraction of " +
          "their old number and shorten the qualifying route for the few who remain.",
          "Parents paying for professional degrees find the entry grade gone, their children " +
          "qualifying into occupations that advertise only senior posts." ],
        s3: [
          "Experienced staff grow scarce in those occupations, their pay rises, and automation " +
          "waits on the few people still qualified to check it.",
          "Patients wait longer for a signed scan report than for the machine's reading of it, " +
          "because few radiologists remain qualified to sign.",
          "Health ministries raise consultant salaries to stop foreign employers bidding away " +
          "the few staff qualified to check machine work." ],
        s4: [
          "Workers move into care, construction and hospitality, where output per worker grows " +
          "slowly and prices climb year after year.",
          "Households spend a growing share of their income on childcare, repairs and " +
          "restaurant meals; televisions and software cheapen every year.",
          "Electricians and care workers win the largest settlements their unions have ever " +
          "bargained, because employers in those trades cannot substitute machines." ],
        s5: [
          "Governments buy mostly human time — teaching, nursing, policing — and public " +
          "spending climbs as a share of output while manufactured goods cheapen.",
          "Teachers and nurses win pay tracked to the trades, and the councils funding them " +
          "close libraries and swimming pools.",
          "Bond investors demand higher yields from governments whose wage bill outgrows their " +
          "tax base, forcing finance ministers to defer new hiring." ],
        s6: [
          "Total employment held while its composition changed, and the aggregate figures " +
          "cannot say whether the displaced office workers reached the new jobs.",
          "Displaced office workers in their fifties left the labour force rather than retrain, " +
          "and the employment figures counted their absence as retirement.",
          "Towns built around back-office employers lost their population to cities hiring in " +
          "care and construction, leaving high streets that never refilled." ] },
  D4: {
        s1: [
          "While demand grows, employers automate department by department and keep headcount " +
          "level, holding the reorganisation for the next downturn.",
          "Staff train the systems that will replace them, and their managers promise no " +
          "dismissals while orders keep rising.",
          "Analysts watch revenue per employee climb at firms that hired nobody, and recommend " +
          "the ones with the most staff left to cut." ],
        s2: [
          "The downturn arrives and the cuts land in a single quarter, because firms had " +
          "already automated the work and kept the staff.",
          "Claims processors and schedulers receive notice in the same week and find the " +
          "postings they trained for gone from the boards.",
          "State unemployment offices take more claims in one quarter than in the whole " +
          "preceding year, and applicants wait weeks for a first payment." ],
        s3: [
          "Households cut their spending, and the shops, clinics and builders who sold to them " +
          "shed staff in turn.",
          "Mortgage arrears rise across the districts that lost the offices, and lenders " +
          "repossess faster than buyers appear.",
          "School enrolment falls in the districts that lost the offices; councils close " +
          "schools as families move for work." ],
        s4: [
          "To hold demand up, governments pay households directly, financing them by taxing " +
          "returns that move easily between countries.",
          "Legislatures argue whether the payment is relief or a wage, and the ones calling it " +
          "relief attach work requirements nobody can satisfy.",
          "Multinationals move the profits from automated work into low-tax jurisdictions, " +
          "forcing finance ministers to negotiate a floor rate through the OECD." ],
        s5: [
          "Health cover, pensions and mortgage lending still run through employment, and people " +
          "without jobs acquire property only by inheritance or by government transfer.",
          "Emergency rooms treat the patients who lost health cover with their jobs, and states " +
          "pay for care nobody else will.",
          "Unions and pension funds press legislatures to detach health cover from employment; " +
          "several states pass portable-benefit statutes." ],
        s6: [
          "Most household income now arrives by inheritance and government transfer; the jobs " +
          "that remain settle who holds standing.",
          "People take paid work for the standing it carries, and employers keep posts that add " +
          "nothing to output.",
          "Wealth surveys show inheritance overtaking wages as the source of household assets, " +
          "with each cohort acquiring property later than the last." ] },
  E1: {
        s1: [
          "Revenue from paying customers covers the cost of new computing capacity, which the " +
          "largest American technology firms build out of operating cash flow.",
          "Auditors argue with boards over how long a server earns its keep, because a longer " +
          "assumed life lifts reported profit.",
          "Contractors in Texas and Ohio hire every licensed electrician within a day's drive " +
          "and pay overtime through the winter." ],
        s2: [
          "Renting that capacity by the hour, pharmaceutical laboratories send machine-designed " +
          "drug candidates into clinical trials faster than regulators can schedule reviews.",
          "Reviewers at the Food and Drug Administration receive more applications than they " +
          "can schedule, and the agency asks Congress to fund posts.",
          "Patients enrol in trials for compounds no chemist proposed, their consent forms " +
          "naming which parts of the design a machine wrote." ],
        s3: [
          "Because data centres already draw about four percent of American electricity, new " +
          "generation now sets the pace of construction.",
          "Households across northern Virginia open monthly bills a third higher than last " +
          "winter's. County boards hold hearings on every new substation.",
          "Turbine manufacturers fill their order books with data centres, leaving cities that " +
          "need new generation at the back of the queue." ],
        s4: [
          "State utility commissions, which approve the rates power companies charge, now " +
          "decide how fast new AI capacity reaches the public.",
          "The National Health Service reads its scans on rented capacity, paying the hourly " +
          "rate any bank pays, owning nothing at that scale.",
          "Water utilities in Arizona meter every gallon the cooling towers draw and publish " +
          "the figures, which town councils read aloud at hearings." ],
        s5: [
          "Chasing the cheapest electricity, medical and agricultural laboratories open " +
          "campuses in Iceland, Quebec and the Gulf states.",
          "High-voltage electricians take postings to Reykjavik and Doha, where their wages " +
          "reset the local price of skilled trades.",
          "Quebec's government caps the share of provincial hydroelectric output data centres " +
          "may buy, reserving the rest for smelters and households." ],
        s6: [
          "The spending transferred wealth from investors to the hospitals, schools and firms " +
          "now running on capability they never paid to create.",
          "Schools budget for machine tutoring the way they budget for heating, a recurring " +
          "line principals renew each year without a board vote.",
          "The Bureau of Economic Analysis reclassified data centres as infrastructure, raising " +
          "the measured capital stock of the United States." ] },
  E2: {
        s1: [
          "The price of a given level of capability falls fortyfold a year, pushing last " +
          "season's frontier models toward the cost of their electricity.",
          "Translators who charged by the word now charge by the hour, since their income " +
          "depends on how fast they check a draft.",
          "The General Services Administration rewrites its software schedules continually, " +
          "because a price agreed at signature is stale before the contract begins." ],
        s2: [
          "As schools, clinics and small firms take up capability that was unaffordable at " +
          "release, revenue per customer falls faster than usage climbs.",
          "Parents in rural districts run their children's tutoring on a phone, and the " +
          "district lets its contract with the tutoring supplier lapse.",
          "Bookkeepers lose the monthly close to software their clients buy themselves, keeping " +
          "only the payroll filings that carry penalties for error." ],
        s3: [
          "Because standard business liability policies now exclude generative AI, earnings " +
          "move to the licensed professionals and insurers who will sign for a result.",
          "Hospitals bill the machine reading and the radiologist's signature as separate " +
          "lines. Patients can see what a signature costs.",
          "Bar associations in several states forbid unsupervised machine filings; clerks " +
          "reject any document without a licence number on the cover." ],
        s4: [
          "The firms training models merge with electricity suppliers and with holders of " +
          "clinical and court records, assets no competitor can copy.",
          "The Federal Energy Regulatory Commission decides whether a nuclear plant may sell " +
          "its whole output to one buyer. That ruling settles who builds.",
          "Patients releasing their records for research find the archive sold, the consent " +
          "form naming a buyer they have never heard of." ],
        s5: [
          "Text, code and routine diagnosis fall toward the cost of running them; rent, care " +
          "and the skilled trades absorb the money households save.",
          "Apprentice plumbers out-earn newly qualified solicitors, with applications to the " +
          "trade colleges now exceeding the places available.",
          "Rents rise fastest in the cities where the licensed work stays. Nurses commute in " +
          "from towns beyond the ring road." ],
        s6: [
          "Cognition costs almost nothing to use, and no private return justifies the next " +
          "frontier programme, which leaves it to governments.",
          "The Department of Energy runs the last frontier training programme at Oak Ridge, " +
          "which Congress renews on national security grounds.",
          "Graduate students take the machine time nobody bids for and publish work their " +
          "supervisors could never have afforded." ] },
  E3: {
        s1: [
          "Lenders fund most new computing capacity, with the loans sitting in the pension " +
          "funds and insurance portfolios that hold ordinary savings.",
          "Teachers' pension trustees discover their bond funds hold loans secured on computing " +
          "hardware and ask what that hardware fetches secondhand.",
          "When bank examiners at the Federal Reserve ask lenders what a used server fetches, " +
          "the estimates differ by half." ],
        s2: [
          "When credit reprices and equity follows, the losses show how much of the valuation " +
          "rested on financing between chip suppliers and their customers.",
          "Engineers find their share grants worth a fraction of what the offer letter " +
          "promised. Recruiters from other industries start calling.",
          "County treasurers rewrite their budgets after assessors value a half-built site " +
          "below the bonds that financed it." ],
        s3: [
          "Construction continues through the collapse, because builders committed to grid " +
          "connections, turbine orders and construction contracts years before the money " +
          "turned.",
          "Ironworkers pour foundations for owners already in bankruptcy, paid from escrow the " +
          "lenders funded before the market turned.",
          "Power companies energise substations built for customers who no longer exist. " +
          "Regulators leave existing ratepayers carrying the cost." ],
        s4: [
          "Household savings fall with the bonds and the shares, turning AI investment into an " +
          "election issue across the industrial democracies.",
          "Retirees who had set a date to stop working take their old shifts back, which leaves " +
          "employers advertising fewer entry-level posts.",
          "The Senate Banking Committee subpoenas the vendor financing agreements. Its hearings " +
          "run through an election in which both parties promise restitution." ],
        s5: [
          "Capacity changes hands cheaply enough for health services and school systems to buy " +
          "machine diagnosis and tutoring.",
          "Universities in the Midwest buy written-down capacity from the receivers and open " +
          "the machine time to any department that asks.",
          "Farmers in the plains buy crop imaging that only the largest cooperatives could " +
          "afford before the receivers began selling capacity." ],
        s6: [
          "Pensioners paid for the computing that hospitals and schools now use, and no lender " +
          "will finance a second expansion on those terms.",
          "Actuaries now test every pension scheme for concentration in one industry, a report " +
          "trustees must sign before a regulator will certify it.",
          "Counties that borrowed to serve the data centres kept the substations and the roads, " +
          "together with debt that outlived the companies prompting it." ] },
  E4: {
        s1: [
          "Because the cost of the largest training runs doubles roughly every eight months, " +
          "lenders re-examine each frontier programme within one budget cycle.",
          "University groups lose the donated machine time their grants assumed, and doctoral " +
          "students rewrite proposals around models that run on campus hardware.",
          "Counties that rezoned farmland for data centres receive no further applications; " +
          "their planning offices go back to hearing warehouse cases." ],
        s2: [
          "Faced with lenders who will not renew, laboratories cut safety evaluation, " +
          "interpretability research and outside auditing before anything a customer would " +
          "notice.",
          "External auditors lose their contracts first. Firms that built a practice on model " +
          "evaluation move into ordinary information security.",
          "Buyers at large insurers notice only that the assistant stopped improving. Their " +
          "renewal talks turn on price alone." ],
        s3: [
          "Half-built sites and signed power contracts leave the counties that bid for them " +
          "paying for electricity nobody consumes.",
          "Packaging plants in Taiwan and Arizona idle the lines built for the boom, and the " +
          "technicians who qualified them take work abroad.",
          "Turbine manufacturers take back orders and resell the machines to utilities in " +
          "Vietnam and Poland at a discount earlier customers never saw." ],
        s4: [
          "Defence ministries, national laboratories and health services purchase the whole " +
          "output of frontier computing. Budget committees choose which capabilities exist.",
          "Climate modellers win machine time by writing a national security justification into " +
          "their proposals. Those who refuse publish less.",
          "Smaller states buy their capability from whichever government paid for it, accepting " +
          "contract conditions on how the systems may be used." ],
        s5: [
          "Researchers disperse from the few surviving frontier programmes into universities " +
          "and ordinary industry, carrying existing capability into schools, clinics and " +
          "courts.",
          "Rural courts shorten their backlogs on secondhand hardware, running transcription " +
          "and case scheduling the metropolitan courts had bought at release.",
          "Teachers in state schools receive the tutoring systems private schools bought at " +
          "release, delivered by vendors now competing for public contracts." ],
        s6: [
          "Capability advanced slowly and reached almost everyone; whether scale alone would " +
          "have carried it further stays untested for want of money.",
          "Economists later attributed most of the period's productivity gain to diffusion " +
          "rather than to the frontier programmes that stopped.",
          "Clinics in small towns still run the diagnostic systems installed during the freeze, " +
          "having never seen anything newer." ] },
  E5: {
        s1: [
          "Employment for workers under twenty-five in the most exposed occupations has fallen " +
          "about a fifth, with hiring of experienced staff unchanged.",
          "Law schools and accountancy programmes report their first fall in applications, " +
          "having placed fewer than half of last year's graduates.",
          "Graduates move back into their parents' houses in numbers the census records, and " +
          "household formation falls with them." ],
        s2: [
          "Firms carry out the reorganisation they deferred as soon as the next recession gives " +
          "them cover, then rehire far fewer people.",
          "Unions bargain over redundancy terms rather than staffing levels, having lost the " +
          "argument that the work returns after a downturn.",
          "Claimants stay on the rolls twice as long as in earlier recessions, draining the " +
          "state trust funds that pay them." ],
        s3: [
          "Automation now reaches the office work done by the top tenth of American earners, " +
          "who account for about half of all consumer spending.",
          "Law firms cut their intake of trainees, since partners now write off the research " +
          "hours that once trained them.",
          "Commercial landlords in Manhattan and the City of London convert half-empty towers " +
          "to flats. Their lenders absorb the difference between the office valuation and the " +
          "residential one." ],
        s4: [
          "Advertising, subscriptions, retail and consumer credit paid for the computing " +
          "capacity, selling to the households whose incomes the same systems cut.",
          "Finance ministries collect less payroll tax as corporate profits rise, and the " +
          "income support they called temporary outlasts three governments.",
          "Cities whose revenue depends on wage taxes cut bus routes and libraries; states " +
          "taxing consumption and property hold their budgets." ],
        s5: [
          "Displaced workers crowd into care, construction and hospitality, where wages rise; " +
          "rent, childcare and schooling rise faster still.",
          "Nursing homes fill every vacancy for the first time in memory, holding wages down " +
          "because ten applicants answer each advertisement.",
          "Parents working in care spend most of a week's wage on childcare, leaving the " +
          "uncovered shifts to grandparents." ],
        s6: [
          "Output rose as household earnings fell, and no population has yet held a durable " +
          "claim on income detached from employment.",
          "Withdrawing the unconditional income at the first budget crisis, governments left " +
          "courts to rule that recipients held no entitlement.",
          "Towns whose employers left kept their populations, since housing stayed cheap and " +
          "the transfers arrived wherever people lived." ] },
  G1: {
        s1: [
          "The European Centre for Medium-Range Weather Forecasts runs a machine-learned model " +
          "as its headline product, cutting five-day cyclone track error to 230 kilometres.",
          "Flood warnings reach about 460 million people across more than 150 countries, in " +
          "basins where no river gauge was ever installed.",
          "Bangladesh and Malawi receive five-day flood warnings that wealthier countries only " +
          "ever got from instruments their rivers never had." ],
        s2: [
          "National meteorological services in a dozen middle-income countries train their own " +
          "warning models on a framework opened for the purpose.",
          "Tuberculosis screening by chest radiograph runs where no radiologist practises, " +
          "against 2.4 million cases that went undiagnosed in 2024.",
          "Farmers across the Sahel plant to a seasonal forecast issued four weeks earlier than " +
          "the one their parents used." ],
        s3: [
          "Insurers reprice flood and windstorm cover on the new forecasts, and premiums fall " +
          "in the basins that gained warning time.",
          "Ports, grid operators and airlines write their contingency contracts around two more " +
          "days of notice.",
          "Disaster agencies evacuate on model output alone, because the extra day of warning " +
          "is worth more than the confirmation." ],
        s4: [
          "Deaths from cyclones and floods fall in countries that have warning and no defences, " +
          "while property losses hold.",
          "The World Meteorological Organization records early warning covering most of the " +
          "world's population for the first time.",
          "Agriculture ministries in low-income countries buy no computing of their own and " +
          "take the forecasts as a public feed." ],
        s5: [
          "One or two institutions supply the forecasts most governments now depend on, and no " +
          "state has funded an alternative.",
          "Crop insurance in West Africa pays out on a forecast rather than an assessor's " +
          "visit, weeks before a harvest fails.",
          "Meteorological agencies lose their modelling staff and keep their observing " +
          "networks, which the machine models still need." ],
        s6: [
          "Warning arrived everywhere and medicine did not, so the gains most people can name " +
          "are the ones that needed no permission.",
          "A generation has grown up with three days' notice of a flood, and the buildings " +
          "behind the warning are unchanged.",
          "Machine forecasts still need thermometers, buoys and balloons, and the countries " +
          "that never built them read another country's instruments." ] },
  G2: {
        s1: [
          "Screening programmes in Sweden and Germany read mammograms with machine support, " +
          "cutting radiologist reading workload by 44 percent.",
          "The United States device list holds 1,524 authorised AI products, 1,164 of them " +
          "radiology, at its March 2026 cut.",
          "Hospitals buy the tools their billing systems can already charge for, and three " +
          "permanent payment codes existed in January 2026." ],
        s2: [
          "Health systems with an organised screening invitation gain most, because the machine " +
          "substitutes for a second reader they already employed.",
          "Countries with no radiologist to replace gain nothing from a tool priced against a " +
          "radiologist's salary.",
          "Insurers in wealthy countries add machine reading to cover, and the payment codes " +
          "follow the specialties that already had them." ],
        s3: [
          "Cardiology, pathology and dermatology reach the market by the route radiology " +
          "opened, each cleared on equivalence to a device already sold.",
          "Waiting lists for diagnostic imaging shorten in the countries that had them and stay " +
          "absent where nobody triaged.",
          "Hospitals in Nairobi run the same model as hospitals in Munich and bill for none of " +
          "it." ],
        s4: [
          "Detection rates rise where screening was already organised, and the distance between " +
          "health systems widens by the size of the gain.",
          "National health services renegotiate consultant contracts around reading volumes " +
          "that no longer need two doctors.",
          "Medical schools in wealthy countries cut radiology training places, and the shortage " +
          "lands on the countries that were exporting radiologists." ],
        s5: [
          "Wealthy systems reach the ceiling of what better reading delivers, which is set by " +
          "who gets invited to be screened.",
          "The remaining difference in survival between countries is access, and no imaging " +
          "model changes who walks through a clinic door.",
          "Ministries in middle-income countries buy screening programmes rather than models, " +
          "because the invitation is the expensive half." ],
        s6: [
          "Two generations of gains landed inside the health systems that were already the best " +
          "funded.",
          "The measured benefit is concentrated in about a fifth of the world's population, and " +
          "the distribution is stable.",
          "A tool that needed a specialist to replace found specialists only where they already " +
          "were." ] },
  G3: {
        s1: [
          "One machine-designed medicine has published a 71-patient safety trial, and its " +
          "lung-function figure was a secondary endpoint.",
          "The pivotal trial for the most advanced candidate enrols 320 patients across 47 " +
          "Chinese centres and completes in 2029.",
          "Discovery compressed to twelve or eighteen months while the road to a prescription " +
          "stayed near a decade." ],
        s2: [
          "Regulators approve the first medicines whose target and compound both came from a " +
          "machine, between 2030 and 2033.",
          "Chinese agencies clear the first of them, because the pivotal trials ran in Chinese " +
          "hospitals.",
          "The candidates now in early trials reach patients behind the first, as a cohort " +
          "rather than singly." ],
        s3: [
          "Trial recruitment is the binding step, and hospitals compete for the nurses who can " +
          "enrol patients.",
          "Sponsors push more candidates into a funnel of unchanged length, so failures arrive " +
          "faster than approvals.",
          "Regulatory agencies hire reviewers with computational training, and assessment times " +
          "lengthen before they shorten." ],
        s4: [
          "Disease-specific mortality moves for one or two conditions in high-income and " +
          "upper-middle-income countries.",
          "Patents on machine-designed molecules concentrate in a handful of sponsors, and " +
          "generic entry sits a decade behind.",
          "Health ministries in poorer countries buy the new medicines late and at the price " +
          "the first market set." ],
        s5: [
          "The mortality series bends for a group of rare diseases no sponsor would previously " +
          "have funded.",
          "Trial design becomes the scarce skill, and the organisations that run trials charge " +
          "more than the discovery ever cost.",
          "Regulators publish outcome data on machine-designed medicines, and the first " +
          "comparisons against conventional ones appear." ],
        s6: [
          "The medicines arrived and took thirty years, which is what the trial clock costs " +
          "once the discovery clock stops mattering.",
          "Life expectancy in the countries that ran the trials rose by a measurable fraction " +
          "of a year.",
          "The bottleneck moved from finding a molecule to finding the patients who can prove " +
          "it works." ] },
  G4: {
        s1: [
          "Laboratories run more experiments for each researcher they employ, and the gain is " +
          "counted in internal cycle time.",
          "Formal proofs, chip-scheduling heuristics and simulation throughput all improve, and " +
          "none of them crosses a regulator's desk.",
          "The firms that own the computing keep the compounding, because every step of it " +
          "happens inside their own buildings." ],
        s2: [
          "A laboratory's internal research output doubles while its published output does not.",
          "Semiconductor design cycles shorten by months, and the saving lands with the four " +
          "firms that design at that scale.",
          "Universities cannot match the instrument access, and their share of published " +
          "results falls." ],
        s3: [
          "The measured gains are throughput figures their owners report and no outside body " +
          "verifies.",
          "Nothing that clears a trial, a payment code, a plant or a border shows the " +
          "improvement.",
          "Contract laboratories run the experiments the machines commission, and their order " +
          "books are the only external trace." ],
        s4: [
          "Statistical agencies find no productivity movement outside the sector that produced " +
          "the capability.",
          "The distance between what the systems can do and what anyone receives is the largest " +
          "unmeasured quantity of the period.",
          "Governments fund public computing to break the enclosure, and the instruments stay " +
          "where they were." ],
        s5: [
          "Two decades of compounding sit inside a dozen organisations, and the outside record " +
          "shows a rising electricity bill.",
          "Legislatures write disclosure duties for internal capability, and the returns " +
          "describe throughput nobody can audit.",
          "The countries hosting the computing tax the electricity and cannot tax the gain." ],
        s6: [
          "The capability was real, was deployed and was captured, and the population " +
          "statistics never moved.",
          "Historians of the period read internal cycle-time series, because no public series " +
          "recorded it.",
          "What the machines produced belonged to whoever owned the instruments they ran on." ] },
  G5: {
        s1: [
          "Clinicians using machine support lose the skill it replaced, and detection falls " +
          "when the tool is withdrawn.",
          "The same output helps a reader who can judge which part to act on and misleads one " +
          "who cannot.",
          "Experienced developers work more slowly with machine assistance than without it, " +
          "against their own expectation." ],
        s2: [
          "Measured net effects come out flat in the settings with the broadest deployment.",
          "Error rates fall on the cases a tool was tested against and rise on the ones it was " +
          "not.",
          "Hospitals that removed the second reader report more missed cases two years later." ],
        s3: [
          "Whoever could already judge the output gains from it, and whoever could not loses " +
          "ground.",
          "Professional bodies restore a human step the evidence says the machine performs " +
          "better, because the ledger says otherwise.",
          "Insurers price lost skill into malpractice cover, and premiums rise for the " +
          "institutions that automated most." ],
        s4: [
          "Population health statistics show no improvement in the countries that deployed " +
          "earliest.",
          "Regulators require a withdrawal test before authorisation, measuring what happens " +
          "when the tool is taken away.",
          "Training programmes rebuild the skills the tools replaced, at a cost nobody had " +
          "budgeted." ],
        s5: [
          "The measured net across two decades of deployment is close to zero, and the spending " +
          "was not.",
          "Public argument about AI turns on evidence rather than on prediction, for the first " +
          "time.",
          "Ministries fund the comparisons industry never ran, and the findings come back " +
          "mixed." ],
        s6: [
          "The tools worked, the people beside them changed, and the two effects cancelled.",
          "A generation of clinicians trained with the support and cannot practise without it.",
          "The measured benefit landed with the institutions that kept a trained person in the " +
          "loop." ] },
  G6: {
        s1: [
          "Of 1,524 authorised AI devices, 1,466 cleared on equivalence to a product already " +
          "sold rather than on a patient outcome.",
          "The cheapest route to market generates no outcome evidence, so almost nobody " +
          "generates any.",
          "No regulator maintains a category for machine-discovered medicines, so nobody can " +
          "count them." ],
        s2: [
          "Health services spend on machine systems two orders of magnitude more than they " +
          "spend evaluating them.",
          "Nobody bills for evidence production, so nobody funds it.",
          "Deployment is wide and authorisation is routine, and no apparatus exists to say " +
          "whether anyone is better off." ],
        s3: [
          "Parliamentary committees ask for the outcome data and are told it was never " +
          "collected.",
          "The trials comparing machine and conventional practice are run by the sponsors and " +
          "read by the sponsors.",
          "Registries record which system was used and not what happened to the patient." ],
        s4: [
          "Health economists estimate the benefit from process measures, because no outcome " +
          "series exists.",
          "Two governments reach opposite conclusions from the same deployment, and no " +
          "experiment can settle it.",
          "Insurers write cover on claims history, which is the only outcome record anyone " +
          "kept." ],
        s5: [
          "Statutes require outcome reporting after sale, and the first returns arrive a decade " +
          "after the deployment they describe.",
          "The evidence gap is itself the finding, and it is the one thing the record " +
          "establishes.",
          "Public trust turns on an argument that cannot be settled with data neither side " +
          "collected." ],
        s6: [
          "Decades of deployment left a procurement record and no health record.",
          "What the machines did for people is a matter of belief, which is what it was at the " +
          "start.",
          "The apparatus for measuring benefit was built last, and it can only look forward." ] },
  K1: {
        s1: [
          "Machines write most production software and, within the same year, take over the " +
          "research that improves them.",
          "Engineers at the two or three United States frontier laboratories keep that year's " +
          "results inside the building. University reviewers assess the previous generation, a " +
          "year or more behind what runs inside.",
          "Households in Virginia and Georgia pay higher electricity bills as utilities connect " +
          "data centres faster than they build generation." ],
        s2: [
          "Both changes arrive before the European Union's high-risk duties take effect in " +
          "December 2027, leaving each government a single session to respond.",
          "Pension funds move retirement savings into the few firms that own large computing " +
          "clusters, until three balance sheets carry most public retirements.",
          "The President routes transformers to computing sites under the Defense Production " +
          "Act, and new factories fall to the back of the interconnection queue." ],
        s3: [
          "States without large computing clusters buy their analysis, their medicine and their " +
          "border screening from the two or three that have them.",
          "Health ministries across West Africa screen patients with software no local body can " +
          "inspect. Their radiologists see only the cases it flags.",
          "Agriculture ministries in Brazil and Indonesia lose the crop records their forecasts " +
          "depended on, since farmers now take planting advice from foreign software." ],
        s4: [
          "Because insurers underwrite only systems they have tested, buyers converge on a " +
          "handful, and one defect appears in every hospital, court and utility at once.",
          "Hospital boards learn that their competitors bought the same certified system when " +
          "ambulances across three states divert at once.",
          "Bank examiners at the Federal Reserve ask each institution which software it runs " +
          "and receive the same three answers." ],
        s5: [
          "The entry-level jobs that produced auditors went first, leaving fewer people each " +
          "year able to check the systems everyone depends on.",
          "State medical boards license physicians who have never diagnosed without software; " +
          "hospitals now assign one senior doctor to every shift.",
          "Graduates arrive supervising systems nobody taught them to check, and the errors " +
          "they miss surface as recalls and lost lawsuits." ],
        s6: [
          "Courts, regulators and auditors arrive last, long after every hospital, bank and " +
          "ministry depends on the systems they judge.",
          "Patients receive treatments for diseases their parents died of, and no regulator " +
          "kept staff enough to re-examine the trial data.",
          "Because a few hundred people drafted the arrangements now governing electricity, " +
          "medicine and credit, every electorate learned the terms afterwards." ] },
  K2: {
        s1: [
          "Coding agents write most production code, leaving the work of improving them in " +
          "human hands for another round of legislation.",
          "Software firms keep their payrolls and change the work; engineers spend their days " +
          "reading and approving code they did not write.",
          "Programmers in Bengaluru and Kraków lose contract work first, because the tasks " +
          "billed by the hour were the easiest to hand over." ],
        s2: [
          "Statutes bind what legislators could see while drafting them: documentation, " +
          "incident reporting, and automated decisions in hiring, credit and medicine.",
          "Rejected job applicants and refused borrowers now receive a written reason, and " +
          "appeal to a person able to reverse the decision.",
          "Regulators bring their first cases on incident reports the firms filed themselves, " +
          "since the statutes require the filing and fund no inspectorate." ],
        s3: [
          "Auditors finish their work on a version the developer has already replaced, and " +
          "their reports describe software no longer running anywhere.",
          "Judges hearing negligence claims accept audits of software the defendant has already " +
          "replaced, and their rulings settle nothing about the version running now.",
          "Hospitals receive systems certified for a version they never installed; their " +
          "procurement officers write update freezes into every contract." ],
        s4: [
          "Governments license the operator instead of approving the product, a change whose " +
          "fixed costs only large organisations can meet.",
          "Small manufacturers and clinics rent their systems from licensed operators, paying " +
          "for an audit trail they never read.",
          "Universities give up running frontier systems of their own, since one licence costs " +
          "more than a department's budget, and rent access instead." ],
        s5: [
          "Training migrates to the jurisdictions that ask least, taking with it the engineers " +
          "able to test what gets built.",
          "The Gulf states and Singapore host the new training clusters; their ministries write " +
          "the admission terms European regulators expected to set.",
          "The strictest governments recruit their inspectors from the firms they oversee, " +
          "since everyone else with the training now works abroad." ],
        s6: [
          "States govern the systems sold inside them on the strength of the developer's own " +
          "account of how they were trained.",
          "Workers in Ohio and Bavaria retrained inside the plants that employed them, since " +
          "the machines arrived slowly enough to plan for.",
          "Prosecutors building a case on training records depend on the developer's archive; " +
          "the firms that deleted theirs pay a fine and keep operating." ] },
  K3: {
        s1: [
          "Under researchers who still set the agenda, machines produce most of the world's " +
          "software and make custom code cheap for small organisations.",
          "Researchers at the two or three United States frontier laboratories still choose the " +
          "problems, and machines write the code that attacks them.",
          "The Bureau of Labor Statistics records falling software prices, and small firms buy " +
          "tools their accountants once refused to approve." ],
        s2: [
          "Clinics, town councils and machine shops commission software of their own, limited " +
          "by records they still keep on paper.",
          "Clerks in county offices type the old paper files into the new systems while the " +
          "software waits on their keyboards.",
          "Hospitals that digitised early pull ahead of neighbours whose files stayed on paper, " +
          "and the gap shows in waiting lists and billing errors." ],
        s3: [
          "Discovery speeds up wherever computation settles a question and stalls wherever the " +
          "answer waits on instruments, patients and measurement.",
          "Hospitals bid against one another for nurses who can enrol patients, and trial " +
          "coordinator is the post their recruiters take longest to fill.",
          "Sponsors wait longer for a Food and Drug Administration decision than for the " +
          "molecule, since review runs at the speed of reading." ],
        s4: [
          "Nursing, construction and inspection keep their value, since patients and buildings " +
          "test the work directly, and their pay passes desk salaries.",
          "Apprenticeship programmes turn away more applicants than the universities admit, " +
          "because households in the building trades out-earn their neighbours with graduate " +
          "degrees.",
          "Law firms and accountancies cut their trainee intakes, and the graduates who wanted " +
          "those seats retrain as inspectors and nurses." ],
        s5: [
          "The laboratories and foundries that test machine designs now take the profits " +
          "software firms once did, fixed in place by grids and permits.",
          "Towns with spare power and a working permit office collect the new laboratories, and " +
          "their tax rolls grow faster than their populations.",
          "Because grid operators decide which laboratories get built, a five-year connection " +
          "queue delays chemistry and materials work by the same five years." ],
        s6: [
          "Machines design more candidates than laboratories can test, and few observers still " +
          "watch for the moment they begin directing research themselves.",
          "Journal editors receive more results than their referees can check, and the " +
          "literature fills with claims nobody has tried to reproduce.",
          "Engineers build from machine designs no laboratory tested, and the failures surface " +
          "late, in batteries and bridges already carrying load." ] },
  L1: {
        s1: [
          "One laboratory refused unrestricted military use, then gave $40M toward legislation " +
          "that would bind it.",
          "Defence procurement officers route surveillance contracts to vendors accepting every " +
          "lawful purpose, leaving the refusing laboratory outside the classified market.",
          "Civil-liberties lawyers cite the refusal in court to argue that no law compels a " +
          "vendor to build domestic surveillance." ],
        s2: [
          "Legislators write the mandatory testing duty these laboratories asked for, and " +
          "government evaluators gain the power to block a release.",
          "Small developers of medical triage software queue for accredited evaluation; several " +
          "sell themselves to the laboratories that wrote the rules.",
          "Physicists and biosecurity specialists leave university posts for accreditation " +
          "work, where a single finding holds a release until the laboratory answers it." ],
        s3: [
          "Insurers, courts and corporate buyers adopt the published thresholds as the terms of " +
          "ordinary commercial dealing.",
          "Hospital pharmacists refuse to dispense on a recommendation whose evaluator the " +
          "pharmacy board has not accredited.",
          "Brazil and Indonesia write the same thresholds into their procurement rules, having " +
          "no evaluators of their own to set different ones." ],
        s4: [
          "Systems begin proposing their own research, and these laboratories file an " +
          "affirmative case before every capability step.",
          "Cancer centres treat patients on older protocols while the laboratory's finished " +
          "diagnostic system waits for authorisation.",
          "Investors discount these laboratories against rivals answering to no review, and the " +
          "boards defend each delay to shareholders." ],
        s5: [
          "Lacking any verification tools, these laboratories watch developers beyond the " +
          "statute's reach close the research loop first.",
          "Metrologists at the National Institute of Standards and Technology have no " +
          "instrument that reads what training clusters run from outside them. Every proposed " +
          "inspection therefore rests on the operator's own logs.",
          "Engineers move to jurisdictions the statute cannot reach, and the year's strongest " +
          "systems train where no evaluator may enter." ],
        s6: [
          "Courts assign liability from the thresholds a developer published, making disclosure " +
          "the cheapest defence available.",
          "Patients choose clinics by the incident counts their hospitals' suppliers publish, " +
          "as an earlier generation chose by surgical mortality.",
          "Law schools teach the published thresholds as the standard of care, and graduates " +
          "enter practice able to read an evaluation record." ] },
  L2: {
        s1: [
          "Federal agencies bought enterprise access at $1 each from August 2025, and one " +
          "laboratory offered its government a 5% stake.",
          "Civil servants in three departments now file every case note through one supplier's " +
          "system.",
          "Rival vendors protest the dollar pricing to the Government Accountability Office, " +
          "which finds the award lawful." ],
        s2: [
          "Government review replaces the published framework as the gate every release must " +
          "pass.",
          "Safety researchers publish nothing about the strongest systems, because their " +
          "findings on cyber and biological capability sit inside a clearance.",
          "Members of Congress without clearances question the laboratory's chief executive " +
          "about findings they may not read." ],
        s3: [
          "Ministries depend on a vendor their own state part-owns, past the point where either " +
          "party can leave.",
          "The state's stake pays a dividend into the treasury; the department that would audit " +
          "the laboratory reports to the minister collecting it.",
          "Benefit claimants appeal decisions their department cannot explain, since the " +
          "reasoning sits in a model the department licenses from the laboratory." ],
        s4: [
          "Inside a cleared programme, the security apparatus chooses what the self-improving " +
          "systems work on.",
          "University laboratories apply for time on the cleared systems and receive none, " +
          "leaving cancer and materials work on the previous generation.",
          "Engineers accept permanent clearance to keep working on the strongest systems. Those " +
          "who refuse leave the field." ],
        s5: [
          "Allied governments buy sovereign campuses and inherit the exporting state's foreign " +
          "policy with them.",
          "Accelerator exporters ship whole campuses under licence, and a suspension signed in " +
          "the exporting capital idles a foreign ministry.",
          "Journalists in the buying countries find their national systems logging queries to " +
          "servers the exporting government inspects." ],
        s6: [
          "The state directs the laboratory through ownership, clearance and procurement, and " +
          "citizens receive capability as a public service.",
          "Immigration lawyers argue appeals before officials whose decisions the same system " +
          "drafted, and win only on procedure.",
          "Startups build on whatever the security services declassify; the founders who wanted " +
          "the strongest systems emigrate." ] },
  L3: {
        s1: [
          "A statement carried 1,378 employee signatures asking for tools to pace automated AI " +
          "development.",
          "Boards at two laboratories endorse the statement and decline to say which of their " +
          "own releases it would have delayed.",
          "Since job candidates ask about pacing commitments in interviews, the laboratories " +
          "that made none pay more to hire." ],
        s2: [
          "The members pay for a referee that grades them, sharing every release with it thirty " +
          "days before launch.",
          "Evaluators at the shared body earn less than the engineers they grade, and each " +
          "departure leaves one laboratory ungraded.",
          "The British Standards Institution writes the referee's grades into a published " +
          "standard that insurers ask for by number." ],
        s3: [
          "Grants buy the tools that let one member check another, making restraint enforceable " +
          "among the signatories.",
          "Inspectors walk the training halls and read the power meters, catching a laboratory " +
          "that misreported its usage.",
          "Electricity regulators in Virginia and Ireland receive the same cluster readings the " +
          "inspectors take, and plan generation against real demand." ],
        s4: [
          "Facing systems that improve themselves, members negotiate a ceiling on compute per " +
          "unit time and audit each other against it.",
          "Hospitals and airlines queue for capacity the ceiling withholds; their suppliers " +
          "blame a vote taken among competitors.",
          "Competition authorities open an inquiry into a limit the sellers set among " +
          "themselves, once compute prices climb past every forecast." ],
        s5: [
          "Developers outside the membership publish weights and run unaudited, so the ceiling " +
          "holds over the signatories alone.",
          "Researchers leave the membership for laboratories with no ceiling, carrying its " +
          "exact reasoning to a rival.",
          "Small businesses run the unaudited models because they cost less, and the ceiling " +
          "never touches the software most people use." ],
        s6: [
          "Governments adopt the members' inspection machinery for a treaty, and the vote the " +
          "laboratories wrote passes to states.",
          "Countries without laboratories of their own sit inside a treaty whose limits no " +
          "inspector will ever verify on their territory.",
          "Engineers who built the members' meters certify treaty limits in Geneva and Vienna, " +
          "and arms-control courses teach their manual." ] },
  L4: {
        s1: [
          "Consumer advertising, a seven-tier price ladder and two confidential listing filings " +
          "arrive together, while four laboratories weaken their pause pledges.",
          "Free-tier users see their assistants recommend products whose sellers paid for the " +
          "placement.",
          "Safety staff resign when their veto becomes a recommendation, and product managers " +
          "inherit the release decision." ],
        s2: [
          "Public listing completes, and the release calendar moves to fit the earnings " +
          "calendar.",
          "Pension funds hold the laboratories in every index tracker, putting teachers' " +
          "retirement savings behind a quarterly release date.",
          "Banks that bought a release shipped to fill a quarter spend the next one repairing " +
          "their ledgers." ],
        s3: [
          "Independent graders mark the whole field down, and enterprise buyers keep purchasing " +
          "on price and capability.",
          "Consumer protection staff at the Federal Trade Commission open an inquiry into " +
          "safety claims the graders contradict.",
          "Drivers using a downgraded assistant for navigation and payments learn of its " +
          "failures when their banks reverse the charges." ],
        s4: [
          "Self-improving systems choose the research agenda wherever measured output rises, " +
          "and the laboratories fund whichever direction the metrics reward.",
          "Tropical disease researchers wait behind advertising and code generation for " +
          "capacity, because no revenue metric moves when they publish.",
          "Utilities in Virginia and Texas approve new gas plants for the training clusters, " +
          "and households carry the cost on their bills." ],
        s5: [
          "Damages awards and refused cover set the price of a release, and halts follow the " +
          "arithmetic.",
          "Families whose relatives died on a triage system's advice settle out of court; the " +
          "laboratory books the payments against the quarter.",
          "Plaintiffs' lawyers advertise for clients harmed by machine-directed decisions, and " +
          "their contingency fees fund the next round of suits." ],
        s6: [
          "The strongest capability goes to the highest bidder, and advertising funds the " +
          "cheapest tier everyone else reaches.",
          "Schools in wealthy districts buy the top tier; everywhere else teaches with an " +
          "assistant that pauses to sell.",
          "Small manufacturers rent the cheapest tier and lose tenders to competitors whose " +
          "systems read a specification and price it first." ] },
  L5: {
        s1: [
          "Chinese laboratories publish the largest open-weight models of the year, cut prices " +
          "permanently, and pass a billion downloads.",
          "Developers in Nairobi and Jakarta build products on published weights and pay " +
          "nothing for capability their competitors licence.",
          "United States frontier laboratories cut their own prices to hold enterprise " +
          "customers, watching revenue per query fall through the year." ],
        s2: [
          "Licences acquire revenue thresholds, and every derivative builder holds a permission " +
          "the publisher can revise.",
          "Customers of products built on published weights find features withdrawn when a " +
          "publisher revises its terms.",
          "The Open Source Initiative denies these licences its label, and universities that " +
          "require open tooling drop them from their courses." ],
        s3: [
          "Many holders inspect one model and catch real failures, each finding arriving after " +
          "the model is everywhere.",
          "Fraud rings fine-tune published models to strip refusals for the price of a laptop, " +
          "and banks meet the results in their call centres.",
          "Clinics running a published model learn from a preprint that its dosing advice fails " +
          "on children, long after installing it." ],
        s4: [
          "Self-improvement runs in many places at once, and the least cautious holder sets the " +
          "pace.",
          "Defence ministries in a dozen countries run improvement loops on published weights, " +
          "none of them telling the others.",
          "Engineers at small firms rent accelerators by the hour, run improvement loops, and " +
          "post the results to public forums." ],
        s5: [
          "Governments enforce against accelerators and hosting, the two things a publisher " +
          "still needs.",
          "Hosting providers verify every customer's identity before renting capacity, which " +
          "costs the smallest research groups their access.",
          "Unlicensed buyers assemble clusters from accelerators routed through Singapore and " +
          "the Gulf, and run them before any customs case concludes." ],
        s6: [
          "Running a capable model costs about what running a database costs, and the chip " +
          "suppliers decide who runs it.",
          "District hospitals in Kenya and Bangladesh run diagnostic models no vendor supports, " +
          "leaving their clinicians to repair the failures.",
          "Municipal governments run translation and permitting on published weights, and the " +
          "software vendors they once paid disappear." ] },
  L6: {
        s1: [
          "Laboratories hold their largest planned training runs on a capability finding and " +
          "publish the reason.",
          "Investors move to laboratories that finished the run; the one that held raises its " +
          "next round at a lower valuation.",
          "Safety teams at rival laboratories reproduce the finding, report it upward, and " +
          "watch their own runs continue on schedule." ],
        s2: [
          "Underwriters price bounded deployments, and hospitals, grid operators and materials " +
          "firms buy them.",
          "Anaesthetists run bounded monitoring systems whose scope is printed on the consent " +
          "form their patients sign.",
          "Judges accept a written scope as evidence of reasonable care, and the first " +
          "defendant without one loses." ],
        s3: [
          "Rivals running open-ended agents take the broad market, and the bounded laboratories " +
          "keep the regulated one.",
          "Graduates take the higher salaries at the open-ended laboratories, leaving the " +
          "bounded ones to recruit from regulators and hospital physics departments.",
          "Consumers meet a bounded system in a hospital or a substation and use an open-ended " +
          "rival for everything else." ],
        s4: [
          "Improvement proceeds one authorised cycle at a time, each ending in re-containment " +
          "before the next begins.",
          "Containment engineers outnumber researchers at these laboratories, and no authorised " +
          "cycle begins until one of them signs.",
          "Materials firms wait a full cycle for the improvement a rival's uncontained system " +
          "already delivered, then order it from the rival." ],
        s5: [
          "Legislatures copy these laboratories' thresholds into statute, binding firms that " +
          "never accepted them.",
          "Advertising and games companies find themselves holding monitoring duties written " +
          "for grid operators, and lobby to narrow the categories.",
          "Compliance officers at chemical and energy firms learn to read evaluation records, a " +
          "skill their industry did not employ before." ],
        s6: [
          "Warranted systems run medicine, energy and the grid, and unwarranted ones run " +
          "everything else.",
          "Patients meet a warranted system at the hospital and an unwarranted one at their " +
          "bank, with only the first naming its scope.",
          "Structural biologists worldwide draw on a protein-structure database these " +
          "programmes fund, publishing results no single laboratory could have produced." ] },
  P1: {
        s1: [
          "Most adults in the industrialised countries use AI assistants at work, in schools " +
          "and in clinics before any public argument concludes.",
          "General practitioners now dictate every consultation to a machine and correct its " +
          "summary, a change no medical council debated beforehand.",
          "Schools mark pupils' work and write their reports through assistants that " +
          "administrators bought without telling the parents." ],
        s2: [
          "Although European law requires firms to tell people when a machine is answering " +
          "them, the disclosure changes nobody's habits.",
          "Customers appealing a refused loan argue with a branch manager who forwards the file " +
          "to a supplier in another country.",
          "Consumer regulators record the complaints as service failures, because their " +
          "casework categories contain no separate heading for an automated decision." ],
        s3: [
          "Once public offices decide benefit eligibility by machine, the right to a human " +
          "reviewer becomes the demand campaigners press hardest.",
          "Administrative tribunals overturn benefit refusals whenever the office cannot " +
          "produce a person who read the file before it issued.",
          "Civil service unions win the right to overrule the eligibility scores, first for " +
          "pensions and later for housing." ],
        s4: [
          "Because clinics, payrolls and courts run on the same handful of services, one " +
          "supplier's outage stops all three in the same hour.",
          "During the outages hospitals prescribe on paper, and pharmacists dispense from " +
          "handwritten lists for the first time in their careers.",
          "Financial and health regulators classify the largest suppliers as critical " +
          "infrastructure, requiring them to report interruptions to the authorities that " +
          "supervise banks." ],
        s5: [
          "Petitions, consultation responses and letters to representatives reach officials " +
          "already drafted and summarised by the systems their own departments bought.",
          "Pollsters find identical phrasing across thousands of written answers and stop " +
          "publishing the open questions altogether.",
          "Parliamentary committees now weigh consultation responses by the organisation that " +
          "sent them, having received ten thousand near-identical submissions." ],
        s6: [
          "The departments that would have to unwind an arrangement no legislature voted on " +
          "process benefit claims, tax assessments and court schedules on the systems they " +
          "would switch off.",
          "No party campaigns on withdrawal, because the tax office, the courts and the health " +
          "service could not clear their caseloads without the systems.",
          "Pensioners who insist on a human decision wait months longer than those who accept " +
          "the machine's, and most accept." ] },
  P2: {
        s1: [
          "Although nearly eight in ten Americans expect artificial intelligence to reduce " +
          "employment, candidates of both parties campaign on other subjects.",
          "Union negotiators raise automation in every bargaining round and settle for notice " +
          "periods, finding no members willing to strike over it.",
          "Parents tell surveyors that the technology harms their children's schooling, then " +
          "buy the tutoring subscriptions the same schools recommend." ],
        s2: [
          "State legislatures introduced more than fifteen hundred AI bills and enacted about a " +
          "hundred, which set conditions on use without halting deployment.",
          "State courts uphold the new statutes, holding disclosure requirements no heavier on " +
          "business than the labelling rules already applied to food.",
          "State attorneys general investigate under consumer protection law and settle for " +
          "disclosure agreements, leaving every system they examined in service." ],
        s3: [
          "People who can afford it pay banks, airlines and care homes a premium to be served " +
          "by a person.",
          "Patients facing an urgent diagnosis take the machine reading and the earlier " +
          "appointment, reserving the paid human hour for afterwards.",
          "Schools that guarantee a teacher in every classroom raise their fees, and their " +
          "waiting lists lengthen faster than their results improve." ],
        s4: [
          "Where legislatures leave the terms open, employers write their own AI rules, and a " +
          "worker's protections depend on the firm that employs them.",
          "Employment tribunals hear dismissals decided by scoring systems and rule for the " +
          "employer whenever a manager signed the outcome.",
          "Warehouse workers learn each week's shifts from software on their phones. The " +
          "supervisors who hear their appeals cannot see how the allocation was set." ],
        s5: [
          "Distrust formed around artificial intelligence spreads to the institutions that " +
          "adopted it, lowering vaccination coverage, jury attendance and voluntary tax " +
          "compliance.",
          "Public health authorities report that the parents who refuse school tutoring " +
          "software also decline the measles booster.",
          "Court administrators summon three jurors for every one who appears, and judges open " +
          "each trial by vouching for the evidence." ],
        s6: [
          "Opinion and policy stayed apart for a generation, and a standing majority that " +
          "disapproves without acting remains available to any movement that asks.",
          "People who tell surveyors the technology harms them use it daily at work, and " +
          "describe the arrangement as something done to them.",
          "Candidates promising restriction draw large crowds and few votes; the parties that " +
          "borrow their language govern without changing the statutes." ] },
  P3: {
        s1: [
          "Towns block data centres over water use and electricity bills, and voters in Festus, " +
          "Missouri recall an entire city council over one project.",
          "Because one campus would draw more water than the county's farms, the irrigation " +
          "district persuades the board to deny the rezoning.",
          "State courts uphold the county's refusal, finding that the zoning code's noise " +
          "limits apply to the cooling plant." ],
        s2: [
          "Builders go only to the counties that grant permits quickly, concentrating computing " +
          "capacity in places where few people live.",
          "Governors advertise quick permitting to attract the projects their neighbours " +
          "refused, and sign the electricity agreements themselves.",
          "Counties that permit quickly collect property taxes exceeding their whole previous " +
          "budget, and hire their first full-time planner." ],
        s3: [
          "Households across thirteen states pay the higher power prices whether or not their " +
          "own county allowed a data centre.",
          "State utility commissions approve the increases, finding that the transmission " +
          "upgrades serve every customer on the network.",
          "Aluminium smelters and paper mills buy power on the same market; when they cut " +
          "shifts, their towns lose work no campus replaces." ],
        s4: [
          "The argument moves to state utility commissions and water permitting authorities, " +
          "where a county's veto counts for nothing.",
          "State legislatures strip counties of the power to refuse; the counties sue and lose, " +
          "because electricity has always been regulated statewide.",
          "Campaigners who won the zoning hearing hire lawyers for the commission hearing that " +
          "fixes the plant's electricity price, held before twelve people and no cameras." ],
        s5: [
          "Counties that host the buildings trade permission for clinics, teachers and " +
          "guaranteed electricity; those that refused depend on machinery three states away.",
          "Graduates take the electrical and mechanical work in the hosting counties; the " +
          "counties that refused close a school each year.",
          "Hospitals in the refusing counties buy their scan reading from a building three " +
          "states away, and lose it first when capacity tightens." ],
        s6: [
          "Planning boards settled where the country's computing sits before national politics " +
          "reached the question, leaving the hosts' share of its value undecided.",
          "Residents of the hosting counties keep the machinery, the traffic and the highest " +
          "electricity bills; Congress still argues over what they are owed.",
          "Federal agencies site their own computing in the same counties, because the " +
          "transmission capacity now exists nowhere else." ] },
  P4: {
        s1: [
          "Support for artificial intelligence divides both parties, with 1,378 employees of " +
          "frontier laboratories signing a statement that asks their government to slow " +
          "development.",
          "Primary challengers run against incumbents of their own party over automation, and " +
          "win in districts that lost their clerical work.",
          "Medical associations and teaching unions petition for identical licensing rules, " +
          "though their members split evenly between the two parties." ],
        s2: [
          "Legislatures enact AI statutes, postpone them, then repeal and replace them, because " +
          "each majority forms bill by bill from members whose parties disagree.",
          "Companies that built compliance departments for one statute dissolve them when the " +
          "successor law changes the definitions, then rebuild them.",
          "Because hospital administrators postpone buying diagnostic systems until the rules " +
          "settle, their patients wait for scans read in another state." ],
        s3: [
          "A treaty binding the United States requires sixty-seven Senate votes that a divided " +
          "public withholds, leaving foreign commitments to reversible executive agreements.",
          "European and Japanese negotiators stop offering the United States binding text, " +
          "writing agreements instead that survive a change of administration.",
          "Successive presidents sign executive orders on AI safety and revoke their " +
          "predecessors', leaving the same laboratories audited, then unaudited, then audited " +
          "again." ],
        s4: [
          "Courts, state legislatures and export markets decide instead, leaving the same " +
          "hiring tool lawful in one state and prohibited in the next.",
          "Job applicants in one state receive an automated rejection with its reasons " +
          "attached; across the boundary the same employer sends nothing.",
          "National retailers write their hiring software to the strictest state and apply it " +
          "everywhere, which makes that legislature the country's regulator." ],
        s5: [
          "Voters who agree about automation and disagree about everything else now sit in one " +
          "coalition, which legislates on pensions, migration and defence.",
          "Committee chairs in the new majority represent districts that share no industry, yet " +
          "their first bill raises the retirement age.",
          "Donors who financed one party now fund candidates in both, and select them by their " +
          "automation votes." ],
        s6: [
          "The new coalitions govern at home, and the cross-cutting public that formed them " +
          "withholds the supermajorities any binding treaty needs.",
          "Chinese and European negotiators write the standards governing exports, and American " +
          "firms comply with rules their own Senate refused to ratify.",
          "Voters who realigned over automation keep their majorities, and every international " +
          "commitment their government makes remains voluntary." ] },
  P5: {
        s1: [
          "As electricity bills climb across the largest American grid, seventy-one percent of " +
          "Americans oppose a data centre in their own area.",
          "Laid-off clerical and customer service staff organise across employers and march on " +
          "state capitols in numbers the parties count.",
          "Mayors who courted the projects campaign against them, citing the electricity bills " +
          "their residents brought to the council chamber." ],
        s2: [
          "Candidates campaigning against artificial intelligence win office and write " +
          "restriction into law: deployment licences, hiring limits, and a halt on new data " +
          "centres.",
          "Labour inspectorates license automated hiring and refuse two applications in three, " +
          "while they recruit the auditors to examine the rest.",
          "School boards remove the assistants from classrooms and rehire the teaching " +
          "assistants they had dismissed, at higher pay." ],
        s3: [
          "Researchers and the firms employing them move to countries that welcome the work, " +
          "concentrating capability where rules are lightest.",
          "Universities lose their computer science faculties to laboratories abroad, and admit " +
          "fewer graduate students every year.",
          "Defence and intelligence agencies buy the models they need from allied governments, " +
          "then brief the legislators who voted for the restriction." ],
        s4: [
          "Foreign models keep arriving as ordinary network traffic, and inspecting that " +
          "traffic is the one measure the coalition's own supporters refuse.",
          "Small businesses route their work through foreign servers, and the tax authority " +
          "records the payments as ordinary imported services.",
          "Prosecutors bring few cases, because proving where a model ran requires records held " +
          "by companies beyond the court's reach." ],
        s5: [
          "Licensed occupations and unions defend the restriction after the public has changed " +
          "its mind, and patients travel abroad for diagnoses prohibited at home.",
          "Domestic suppliers grown inside the restriction lobby to keep it, and their trade " +
          "association outspends the firms it displaced.",
          "Younger voters who never worked under the old arrangement vote to repeal the " +
          "restriction, and lose to the turnout of the licensed trades." ],
        s6: [
          "Voters bought a settled labour market at the price of capability, leaving their " +
          "security and health to rest on systems built elsewhere.",
          "Hospitals treat cancers by protocols written abroad, for which the health ministry " +
          "pays licence fees to the countries that kept developing.",
          "Clerks, drivers and paralegals still hold their jobs, and their children take " +
          "degrees in the occupations the restriction protects." ] },
  R1: {
        s1: [
          "Publishing the safety rules they wrote for themselves, frontier laboratories hand " +
          "hospitals, banks and defence ministries language to copy into purchase contracts.",
          "Nurses' unions bargain the published safety rules into their collective agreements, " +
          "winning the right to refuse an unreviewed machine recommendation.",
          "Trade reporters track every revision of the published policies; a deleted clause " +
          "makes the next morning's front page." ],
        s2: [
          "When courts read a published safety policy as a warranty, breaking it becomes a " +
          "breach of contract carrying damages.",
          "Engineers at the laboratories clear every wording change with counsel, since " +
          "plaintiffs' lawyers read those sentences back to juries.",
          "School districts recover the cost of failed grading systems by suing on the " +
          "developer's published promise instead of proving negligence." ],
        s3: [
          "Before they will write cover, underwriters audit each release against the " +
          "developer's own published commitments, and a departure from them voids the policy.",
          "Former regulators leave public service for audit work, where reading one safety " +
          "policy line by line pays more than a judgeship.",
          "Small developers withdraw from medicine and policing, because no underwriter will " +
          "cover a release their own auditors have never read." ],
        s4: [
          "Buyers, developers and underwriters settle the rules for medicine and policing in " +
          "contracts that no patient or defendant may read.",
          "Patients denied treatment learn that the reasons sit in a supply contract their " +
          "hospital signed and may not show them.",
          "State legislators subpoena the purchase contracts and find that three underwriters " +
          "and one supplier wrote the policing rules their districts live under." ],
        s5: [
          "Only paying customers can enforce the published promises, and developers give " +
          "systems away free to schools, clinics and households.",
          "Families using the donated systems hold no contract, which leaves their complaints " +
          "with the clinic that installed it.",
          "Health ministries in low-income countries run the donated systems, and auditors " +
          "visit only the hospitals that paid." ],
        s6: [
          "Company promises now govern more of daily life than any statute reaches; their " +
          "authors answer to customers, underwriters and juries.",
          "Parliaments legislate around the industry text, because a statute contradicting it " +
          "would strand every insured hospital in the country.",
          "Compliance officers outnumber safety researchers at the laboratories, and the " +
          "published text changes when a jury awards damages." ] },
  R2: {
        s1: [
          "Because American states enact AI statutes faster than Congress, developers build one " +
          "product to the strictest rule.",
          "County clerks in forty-five states check each vendor's paperwork against a statute " +
          "their own legislature passed last session.",
          "Trade associations employ full-time bill trackers, because more than fifteen hundred " +
          "AI bills reached American statehouses in one legislative session." ],
        s2: [
          "In the first enforcement actions, state attorneys general and the courts settle what " +
          "their legislatures meant by an automated decision.",
          "Job applicants in Illinois win the first damages after a court holds that a resume " +
          "screen made the decision their statute names.",
          "Plaintiffs' lawyers file first where the statute defines an automated decision most " +
          "broadly; the filings cluster in three state capitals." ],
        s3: [
          "Once state medical boards and bar associations write those standards into licence " +
          "conditions, every diagnosis and every filed brief must satisfy them.",
          "Physicians licensed in two states keep two workflows, and the same scan needs a " +
          "countersignature on one bank of the river.",
          "School districts on the Kansas-Missouri line grade essays by machine in one building " +
          "and by hand in another." ],
        s4: [
          "Californians and New Yorkers elect the legislators whose rules govern automated " +
          "hiring and policing in states that never voted on them.",
          "Governors of Ohio and Louisiana compete on tax abatements for data centres, then " +
          "govern those machines under rules written in Sacramento.",
          "Parents in Utah receive a machine-grading notice their own state never required, " +
          "because one publisher prints a single form for the country." ],
        s5: [
          "Foreign legislatures copy those texts because tested case law comes with them; " +
          "judges in Brussels and Delhi now cite American state rulings.",
          "Exporters certify to Californian rules before shipping to Europe, and inspectors in " +
          "Guadalajara audit against a text written in Sacramento.",
          "Shoppers in Lagos and Manila receive the appeal rights a Californian statute " +
          "requires, since one interface serves every market." ],
        s6: [
          "Fifty state legislatures would have to act together to change the rule the whole " +
          "country now lives under.",
          "Congress debates preemption every session and passes nothing, because thirty-eight " +
          "governors defend statutes their own voters approved.",
          "Families moving between states gain or lose the right to appeal an automated denial, " +
          "and relocation guides list it beside school ratings." ] },
  R3: {
        s1: [
          "With one national standard replacing the state statutes, hospitals, school districts " +
          "and courts deploy systems that compliance costs had kept out.",
          "Veterans in remote counties get machine-read scans at their local clinic, a service " +
          "the state statutes had priced out.",
          "State attorneys general close the units they built to police automated hiring, their " +
          "pending cases dying on preemption." ],
        s2: [
          "One threshold in that statute decides which systems face review: a line drawn " +
          "slightly wrong lets the same models through in every state.",
          "Engineers size their training runs to sit under the reviewable threshold, and a plot " +
          "of released systems spikes just below the line.",
          "Federal purchasing officers buy only reviewed systems; vendors print the review " +
          "certificate on the first page of every bid." ],
        s3: [
          "The Food and Drug Administration approves machine diagnosis and the Federal Aviation " +
          "Administration certifies autonomous flight, each agency supplying the detail the " +
          "statute omits.",
          "Radiologists spend their days signing machine reports the Food and Drug " +
          "Administration cleared, and their training now stresses when to disagree.",
          "The Federal Aviation Administration loses its machine-learning examiners to the " +
          "manufacturers it certifies, leaving approvals to queue behind the vacancies." ],
        s4: [
          "Juries in ordinary tort suits set the price of harms that cross work, elections and " +
          "family life, where no sector regulator has jurisdiction.",
          "Insurers reprice cover after each large verdict; one award in a Texas courtroom " +
          "lifts premiums in every state.",
          "Injured plaintiffs settle quietly under sealed terms, which leaves the next jury " +
          "without a figure to work from." ],
        s5: [
          "Countries that match the American standard gain access to its market; their " +
          "negotiators then take a hand in drafting the next revision.",
          "Countries that refuse the standard sell into a smaller market, and their surgeons " +
          "work with software Americans retired.",
          "Travellers meet the same machine refusals abroad, because the check-in systems in " +
          "Frankfurt run to Washington's specification." ],
        s6: [
          "Because one text decides what machines may do across the country, every lobby in " +
          "Washington works on the same amendment.",
          "Committee staff redraft the definitions every session, and each new capability " +
          "arrives before the hearing that will name it.",
          "Voters take their complaints to Washington, since their own legislature lost the " +
          "power to restrain the systems their hospitals use." ] },
  R4: {
        s1: [
          "The Department of Commerce clears frontier models before any customer sees them, a " +
          "step laboratories now build into their launch schedules.",
          "Export-control lawyers who once worked on machine tools and centrifuges now vet each " +
          "model release for the laboratories.",
          "The Japanese and Dutch governments, which already license lithography exports, add " +
          "model clearance to the same offices." ],
        s2: [
          "Because a pending clearance overruns their procurement timetables, hospitals, banks " +
          "and defence ministries wait for the department's reviewers to approve each purchase.",
          "Civil servants cleared to read model evaluations number in the dozens, and their " +
          "reading list sets the release calendar for the industry.",
          "University laboratories apply for clearance alongside the companies; doctoral " +
          "projects wait behind defence ministries in the same queue." ],
        s3: [
          "Negotiating cleared access for their own hospitals and armies, allied governments " +
          "settle on a common vetting standard across the North Atlantic Treaty Organization.",
          "Radiographers in Oslo hold a personal clearance before opening the software their " +
          "hospital bought. When one lapses, the scanner idles.",
          "India and Brazil, left outside the vetting standard, fund their own frontier " +
          "laboratories and write their own clearance rules." ],
        s4: [
          "Nationality now bars physicians and researchers outside the cleared countries from " +
          "the current systems, leaving them a generation behind.",
          "Smugglers resell cleared access through third countries until the Bureau of Industry " +
          "and Security brings its first diversion prosecutions.",
          "American employers ask for citizenship on machine-learning job postings, and the " +
          "Equal Employment Opportunity Commission opens its inquiries." ],
        s5: [
          "Temporary visa holders earn three-fifths of American computer science doctorates. " +
          "Their laboratories now keep the trained systems and the training records behind a " +
          "clearance most of that cohort cannot obtain. The rest of the bench works on " +
          "everything else.",
          "Teaching hospitals check citizenship before assigning a resident to the diagnostic " +
          "system, and their rotas record two grades of staff.",
          "Canada and the United Arab Emirates recruit the researchers Washington will not " +
          "clear, offering laboratory access with citizenship attached." ],
        s6: [
          "Journals adopt the clearance rules, so the cleared countries' findings circulate " +
          "only among their own reviewers and their errors stand longer.",
          "Graduate students choose their field by which country will clear them; enrolment in " +
          "machine learning falls at the open universities.",
          "The licensing states hold the name of every customer of every cleared system, and " +
          "their intelligence services read the deployment lists." ] },
  R5: {
        s1: [
          "Required by the European Union AI Act to report serious incidents, developers file " +
          "the first public record of how machine judgement fails.",
          "Statisticians at the European Commission publish failure rates by sector, and " +
          "hospitals read where diagnostic systems go wrong before buying.",
          "Patients harmed by a diagnostic system find its incident number in their own file, " +
          "which their lawyers use to request the filing." ],
        s2: [
          "Firms fear losing their insurance cover more than the statutory fine, so the " +
          "reported rates restrain deployment further than the regulators do.",
          "Actuaries publish failure tables for machine diagnosis beside mortality tables: a " +
          "system reporting twice the median rate costs twice as much to insure.",
          "Municipal councils in Germany cancel deployments after reading the reported rates, " +
          "and their procurement minutes cite the incident register." ],
        s3: [
          "Because Illinois Senate Bill 315 requires annual independent audits and qualified " +
          "auditors are scarce, a handful of large firms supply the high-risk systems.",
          "Universities in Delft and Milan graduate the first examined cohorts of system " +
          "auditors, whom hospitals and banks hire before their results arrive.",
          "Hospitals log a diagnostic system's failures beside adverse drug reactions, and the " +
          "two registers share one reporting form." ],
        s4: [
          "Public hospitals and ministries buy certified systems the way pharmacists buy " +
          "labelled medicines; the AI Act exempts military and national security uses.",
          "Defence ministries buy uncertified systems under the security exemption, and their " +
          "soldiers use tools no civilian hospital may touch.",
          "Pharmacists check the certification mark on a screen as they check a batch number, " +
          "refusing to dispense without one." ],
        s5: [
          "Developers now train on the incident corpus itself, repairing the failures their " +
          "earlier systems were required to report.",
          "Safety researchers mine the register for failure modes nobody had named, and the " +
          "categories they add reshape the next reporting form.",
          "Compliance officers argue each incident down a severity grade, because the filed " +
          "grade sets both the premium and the fine." ],
        s6: [
          "Courts award compensation on the filed reports, and people never told that a machine " +
          "decided against them recover nothing.",
          "Trade unions win notification clauses in their contracts, since a worker who learns " +
          "a machine decided can bring the claim.",
          "The European Data Protection Board rules that a refusal must name the system that " +
          "produced it, and the notice arrives with the letter." ] },
  R6: {
        s1: [
          "The European Union Digital Omnibus defers the high-risk duties and leaves the " +
          "transparency obligations binding, so firms build labelling compliance first.",
          "National regulators redeploy the inspectors hired for the high-risk duties, setting " +
          "them to check labels on articles and loan letters.",
          "Belgian and Irish civil society groups sue over the deferral, which the Court of " +
          "Justice of the European Union agrees to hear." ],
        s2: [
          "Labels recording what a machine wrote now accompany published articles, loan " +
          "decisions and job applications across the single market.",
          "Loan officers read a provenance record before signing; a missing record sends the " +
          "file back to the applicant.",
          "Newspapers in Madrid and Warsaw print a line naming what a machine drafted, and " +
          "their style guides specify its wording." ],
        s3: [
          "With the AI deadlines moved, consumer protection, anti-discrimination and product " +
          "safety law carry the whole load, and judges govern by analogy.",
          "Shoppers refused credit sue under consumer protection law written for defective " +
          "appliances, and the judge decides what a defect means here.",
          "Data protection authorities do most of the regulating, because the right to an " +
          "explanation is the one duty already in force." ],
        s4: [
          "Judges write each rule only after the harm that produced it, and those harmed before " +
          "the ruling recover nothing.",
          "Inspectors arrive at last with a checklist describing an earlier generation of " +
          "systems, asking for design documents nobody writes any more.",
          "Law firms build practices on the four or five judgments that decide everything, and " +
          "their trainees learn each set of facts by heart." ],
        s5: [
          "The comprehensive statutes on the books persuade the public that the technology is " +
          "governed; the duties actually in force are labelling alone.",
          "Diplomats cite the statute abroad; trading partners copy a text whose hardest duties " +
          "have never bound anyone.",
          "Firms budget for the next deferral before ministers grant it, and their compliance " +
          "spending starts after the date the statute names." ],
        s6: [
          "After legislatures postponed a fixed start date twice, they wrote the next statute " +
          "to commence only when a developer's product passes a stated capability test. The " +
          "engineers who draft that test now choose the date.",
          "The European Union AI Office decides when each duty begins; its test designers " +
          "answer the questions ministers once took in parliament.",
          "Citizens learn from published test scores when a law will reach them, and " +
          "campaigners argue about the pass mark." ] },
  S1: {
        s1: [
          "Four United States firms own most of the world's frontier computing, and every " +
          "hospital, ministry and university rents its capability from them.",
          "University laboratories have closed their own computing rooms; they now buy time " +
          "from four suppliers at prices no grant committee negotiates.",
          "Kenya's health ministry pays for diagnostic capability in dollars, and every rise in " +
          "the supplier's rental price falls on its drug budget." ],
        s2: [
          "Rental contracts set who receives the newest systems first, and ministries that lose " +
          "their place wait behind commercial customers.",
          "Hospital boards stay with their supplier because changing one means revalidating " +
          "every clinical tool in the building, a two-year cost.",
          "School districts that miss the August procurement window teach a whole year without " +
          "tutoring capacity, having lost their place to commercial buyers." ],
        s3: [
          "When one supplier's systems fail, three things stop at once: triage in emergency " +
          "departments, scheduling in courts, and dispatch in freight.",
          "When one supplier raises its tariff, the cost of radiology reporting and legal " +
          "drafting moves in every country the same week.",
          "Because insurers refuse interruption cover to firms with a single supplier, " +
          "hospitals now pay for a second contract they rarely use." ],
        s4: [
          "Governments write continuity terms into their contracts, requiring suppliers to keep " +
          "systems running and unchanged while cases decided under them remain under appeal.",
          "Bank supervisors require every institution to name its supplier and to prove it can " +
          "settle payments for a week without it.",
          "Auditors general refuse to sign departmental accounts without a written plan for " +
          "running the department's services if its supplier withdraws." ],
        s5: [
          "The firms holding the largest computing fleets choose which questions get answered, " +
          "and drug discovery proceeds while seismology and soil science wait.",
          "Graduate students choose the questions their department can afford to rent capacity " +
          "for, and whole subfields empty within a decade.",
          "Journals require chemists to name the supplier that ran their calculations, a " +
          "disclosure half of all published papers must now make." ],
        s6: [
          "Governments now regulate machine intelligence as a public utility, and their " +
          "commissions set the price hospitals and schools pay for access.",
          "Rural clinics buy diagnostic capability at a published tariff, budgeting for it a " +
          "year ahead as they budget for electricity.",
          "Countries without a supplier of their own buy from American utilities at prices an " +
          "American commission sets." ] },
  S2: {
        s1: [
          "India has put tens of thousands of processors into public hands, and the European " +
          "Commission is funding clusters that member states own.",
          "Engineers who trained abroad return to run state clusters in Abu Dhabi and " +
          "Bengaluru, at salaries their ministries have never previously paid.",
          "Brazil's development bank finances a national cluster, and the debt sits on the " +
          "public books beside roads and transmission lines." ],
        s2: [
          "States train systems on their languages and legal codes, and tax offices, courts and " +
          "hospitals answer citizens through machines the state owns.",
          "Public broadcasters caption every programme in the country's minority languages, and " +
          "deaf viewers watch regional news for the first time.",
          "After court interpreters lose their public contracts to a state system, their union " +
          "bargains over who certifies its translations." ],
        s3: [
          "Public clusters run a generation behind the American frontier and specialise in " +
          "local medicine, court records and crop advice.",
          "Doctors in Hanoi read scans with a state system trained on local patients, which " +
          "finds the tuberculosis imported software missed.",
          "Researchers who want frontier capability still fly to California; the ministries " +
          "that trained them treat the loss as ordinary." ],
        s4: [
          "Countries acquire processors faster than they train the engineers who keep large " +
          "clusters running, and idle capacity sits in state data halls.",
          "Cluster operators in Jakarta and Lagos poach one another's few trained engineers, " +
          "tripling the salary for the job within three years.",
          "Parliamentary committees ask why the state data halls run half empty, and the " +
          "ministers who bought the processors blame the electricity connection." ],
        s5: [
          "The same systems that read local medical records also design pathogens, and " +
          "governments now inspect the laboratories they equipped themselves.",
          "Biologists wait weeks for a national screening office to clear each protein design " +
          "before they may run it.",
          "Customs authorities added synthesis equipment to their export lists, stopping orders " +
          "from unlicensed laboratories at the border." ],
        s6: [
          "Dozens of states now build capable systems on their own soil, and any shared " +
          "restraint depends on every one of them consenting.",
          "Treaty conferences that once seated four delegations now seat forty, and a single " +
          "refusal sinks the inspection regime the rest agreed.",
          "Because ministries run systems their neighbours prohibit, a patient's diagnosis " +
          "depends on which side of the border treats her." ] },
  S3: {
        s1: [
          "Households meet artificial intelligence first on the electricity bill, which has " +
          "climbed across the thirteen states served by the largest American grid.",
          "Pensioners in Ohio and Virginia ration air conditioning through August, and their " +
          "utilities issue shutoff notices at record rates.",
          "Aluminium smelters and steel mills bid against data centres for the same power " +
          "contracts, two smelters having closed for want of one." ],
        s2: [
          "Seven in ten Americans oppose a data centre near them, and county boards have " +
          "blocked or delayed $130 billion of construction.",
          "County commissioners who approved a data hall lose their seats at the next election, " +
          "and their successors campaign on the water table.",
          "Because developers file their applications as warehouses, three states now require " +
          "zoning notices to declare a building's electricity draw." ],
        s3: [
          "Builders answer by paying for their own generation, restarting closed nuclear plants " +
          "and raising gas turbines beside the data halls.",
          "Pipefitters and electricians building turbines beside the data halls out-earn the " +
          "engineers inside them, and trade apprenticeships fill after decades of decline.",
          "The Nuclear Regulatory Commission licenses restarts at plants closed a decade ago, " +
          "sending inspectors back to sites already stripped for parts." ],
        s4: [
          "Computing settles where county boards consent, and the host communities carry the " +
          "land, water and transmission lines while the gains spread nationally.",
          "After farmers in Arizona and Georgia sold groundwater rights to the halls, the " +
          "county drills its municipal wells deeper each year.",
          "Rural school districts tax the halls and pay teachers above the state scale; the " +
          "county next door collects nothing." ],
        s5: [
          "Generation built for computing also heats houses and charges vehicles; electricity " +
          "in those regions now costs households less than before the build-out.",
          "Households that installed heat pumps in the build-out regions now pay less to heat " +
          "in winter than they paid for gas.",
          "Grid operators sell curtailment rights to the halls and carry the evening peak " +
          "without the gas plants they once held in reserve." ],
        s6: [
          "County boards decided where the nation's computing sits, and the rebuilt electricity " +
          "system that followed reaches every household in the region.",
          "Machine capability reached Wyoming and Mississippi before Boston, because the " +
          "transmission lines went in where the objections were fewest.",
          "Rural electric cooperatives wired for the halls sell their members power at urban " +
          "prices, having cleared the debt that built the lines." ] },
  S4: {
        s1: [
          "Export licences meter who may train the largest systems, and Washington has cleared " +
          "about ten Chinese firms to buy 75,000 advanced processors each.",
          "Compliance officers at American chip distributors clear each order with the Commerce " +
          "Department, and shipments to Singapore and Malaysia wait months.",
          "Customs officers seize accelerators routed through Dubai and Hong Kong; prosecutors " +
          "have charged the resellers under the Export Control Reform Act." ],
        s2: [
          "China builds substitutes at home, and American evaluators measure the best Chinese " +
          "model about eight months behind the best American one.",
          "Chinese fabricators run older equipment at lower yields, selling the output below " +
          "cost against a state subsidy that covers the difference.",
          "Hospitals in Indonesia and Nigeria buy Chinese systems at a third of the American " +
          "price and accept the slower diagnosis." ],
        s3: [
          "Because chips, models and engineers arrive from Washington or Beijing as one " +
          "package, other governments choose a supplier and take its standards.",
          "Radiologists trained on American thresholds cannot read the confidence scores their " +
          "government's new Chinese system reports, and their societies rewrite the guidelines.",
          "Gulf states take American processors together with inspection of the halls that hold " +
          "them, conceded in the same agreement as basing rights." ],
        s4: [
          "Two spheres settle, each with its own processors, software and standards, and " +
          "hospitals, courts and armies inherit the assumptions of whichever supplied them.",
          "German hospitals re-read every scan reported in Nairobi, because the two countries' " +
          "systems disagree about what counts as a finding.",
          "The International Telecommunication Union publishes two incompatible specifications " +
          "for the same function, and manufacturers build both into every exported device." ],
        s5: [
          "Written for processors, the control now governs who builds the next system, because " +
          "open model weights travel between countries as ordinary files.",
          "Chinese laboratories publish their model weights, putting a frontier system inside " +
          "any government with a modest cluster and a fast connection.",
          "Prosecutors bringing export cases now argue about downloads rather than shipments, " +
          "and judges ask what a customs officer is meant to seize." ],
        s6: [
          "Export control bought the United States a lead measured in months, and the record " +
          "cannot show what those months were spent on.",
          "Chinese graduates who would have staffed American laboratories stayed home, and the " +
          "two countries' research output converged faster than the controls slowed it.",
          "Having lost their Chinese sales, chip manufacturers cut research budgets; the next " +
          "generation of lithography equipment arrived two years late." ] },
  S5: {
        s1: [
          "Frontier systems run on chips fabricated in Taiwan and bonded in a single packaging " +
          "step, which governments now guard as strategic ground.",
          "Fabrication technicians in Hsinchu work rotating shifts that never stop, and " +
          "Taiwan's grid reserves a fifth of its output for their plants.",
          "Marine insurers reprice hulls calling at Taiwanese ports every week, pushing " +
          "shipping lines to move spare capacity onto Japanese and Korean routes." ],
        s2: [
          "An earthquake, blockade or embargo halts that fabrication, and governments ration " +
          "what remains: hospitals, power grids and armed forces come first.",
          "Hospital engineers strip decommissioned scanners for parts, and a ministry office " +
          "decides which regional hospital receives the working machine.",
          "Universities auction the machines they bought for teaching, because second-hand " +
          "accelerators now fetch four times their original price." ],
        s3: [
          "Scarcity spreads into cars, phones and hospital equipment, as it did in the chip " +
          "shortage that cost carmakers $210 billion in lost output.",
          "Assembly lines in Michigan and Bavaria stand idle for months, and their workers draw " +
          "short-time pay that both governments extend twice.",
          "Hospitals wait a year for ventilators and infusion pumps; their biomedical " +
          "departments keep older machines running past the manufacturer's support." ],
        s4: [
          "Qualifying a new fabrication line takes eighteen to twenty-four months, and the " +
          "firms already holding capacity extend their lead across that whole period.",
          "Construction crews in Arizona and Dresden work through the shortage on lines that " +
          "will produce nothing for two years.",
          "Startups that had reserved capacity for a first training run return their investors' " +
          "money, and the incumbents hire their engineers." ],
        s5: [
          "Engineers learn to train on less under the shortage, and when supply returns they " +
          "get more capability from it than the interruption removed.",
          "Engineers who rewrote training to run on fewer processors publish the methods, and " +
          "laboratories in poorer countries train systems they could not before.",
          "The cost of answering a query fell through the shortage and stayed down; clinics " +
          "that had rationed access opened it to every patient." ],
        s6: [
          "Several countries now fabricate advanced chips at higher cost, and the authorities " +
          "who rationed capability during the shortage still decide who receives it.",
          "Legislatures renew the subsidies behind the duplicate plants each budget cycle, " +
          "though the plants employ fewer people than the appropriations promised.",
          "Buyers pay a premium for chips fabricated in three regions, and the cost reaches " +
          "households through cars, phones and appliances." ] },
  T1: {
        s1: [
          "Because machines now run artificial intelligence research from question to result, " +
          "the number of scientists a laboratory employs stops predicting what it discovers.",
          "Doctoral students in machine learning watch their thesis problems solved before they " +
          "defend them, and universities rewrite what a dissertation must contain.",
          "Chinese frontier laboratories reproduce each American result almost as soon as it " +
          "appears, since the training method was published for anyone to follow." ],
        s2: [
          "Machine-designed drugs and materials accumulate faster than clinics and factories " +
          "test them; the Food and Drug Administration approves about fifty medicines a year.",
          "Because hospitals cannot enrol patients fast enough to test the candidate medicines, " +
          "recruitment fixes how many reach approval each year.",
          "India and Brazil approve machine-designed medicines their own inspectors can verify; " +
          "American patients wait behind a longer trial queue." ],
        s3: [
          "Derivations run longer than any person can follow, so journals, patent offices and " +
          "procurement boards certify conclusions that only another machine has verified.",
          "Gene synthesis suppliers now screen every order against sequences that appear in no " +
          "catalogue.",
          "Defence ministries adopt the same automated design procedure for munitions, and arms " +
          "inspectors lose the warning that slow weapons development once gave them." ],
        s4: [
          "Machine diagnosis reaches patients who have never seen a physician, although " +
          "hospitals lose the graded casework that once trained their junior doctors.",
          "Courts that admit machine analysis on measured accuracy alone hear expert witnesses " +
          "testify to test results instead of method.",
          "Steelmakers adopt machine-designed alloys no metallurgist can explain, although " +
          "their insurers price the risk from test data alone." ],
        s5: [
          "Countries convert new discoveries into medicine and industry only as fast as their " +
          "own laboratories, clinics and fabrication plants can run the experiments.",
          "Select committees hear two machine analyses of one tax change, with no experiment " +
          "able to settle the difference before the vote.",
          "Universities cannot fill their laboratory technician posts, because a bench " +
          "technician now earns more than the scientist designing the experiment." ],
        s6: [
          "Textbooks in several sciences now teach standard results that no living person has " +
          "derived, held true because their predictions survive every test.",
          "Death rates from three common cancers fall by a quarter, on treatments no oncologist " +
          "proposed and no journal can fully check.",
          "Insurers and pension funds revalue longevity, because patients now survive diseases " +
          "their actuarial tables still record as fatal." ] },
  T2: {
        s1: [
          "Knowing from public forecasts that machines will soon run research unaided, American " +
          "states have imposed reporting duties and independent audits on developers.",
          "Trade unions negotiate advance notice of automation into contracts covering " +
          "radiographers, paralegals and claims assessors.",
          "The Cyberspace Administration of China registers each training run before release, " +
          "and its inspectors read the evaluation results developers must file." ],
        s2: [
          "Those statutes name employment screening, credit scoring and clinical devices, and " +
          "leave every use the drafters overlooked to custom and contract.",
          "The first machine-directed gains land in medicine and power generation, where the " +
          "Nuclear Regulatory Commission and drug regulators already license new methods.",
          "Tenants refused a lease by an unlisted scoring tool must sue in housing court, " +
          "because no statute names the use that refused them." ],
        s3: [
          "The European AI Office inspects models as developers release them, although the " +
          "hospitals, banks and agencies that configure them escape review.",
          "Apprenticeship places in the electrical and nursing trades fill faster than " +
          "university ones, as their wages pass those of newly qualified solicitors.",
          "Enrolment in law and accountancy degrees falls by a third; two English universities " +
          "close their law faculties." ],
        s4: [
          "Insurers wrote artificial intelligence exclusions into ordinary business cover, so " +
          "hospitals and law firms that automate past supervision now carry their own losses.",
          "Hospital directors who remove the supervising radiologist discover at the first " +
          "malpractice claim that their policy pays nothing.",
          "City governments in Ohio and Bavaria keep a licensed engineer signing every permit, " +
          "since their liability pools refuse unsupervised approval." ],
        s5: [
          "Because one licensed doctor now signs many times the former volume of work, medical " +
          "schools and law firms take far fewer trainees.",
          "Graduates who qualified before the change hold every signing post, and those behind " +
          "them find no route to the same licence.",
          "The General Medical Council rewrites its competence test; no candidate can now " +
          "accumulate the supervised hours the old rules demanded." ],
        s6: [
          "Governments regulate one named use at a time, leaving general-purpose deployment, " +
          "which no list of uses anticipates, outside every statute they write.",
          "Ireland and the Gulf states import licensed signatories whose foreign qualifications " +
          "their health ministries once refused.",
          "Hospitals pay retired surgeons by the signature to certify work they never " +
          "performed." ] },
  T3: {
        s1: [
          "Machines gain capability four to eight times more slowly than METR measured; " +
          "experienced developers in one randomised trial finished slower with the tools.",
          "Because measured progress falls behind the published trend, pension funds cut their " +
          "holdings in the chipmakers and the data centre builders.",
          "Radiologists and paralegals keep the jobs the earliest forecasts had them losing, " +
          "and their departments hire at the ordinary rate." ],
        s2: [
          "Firms spend the long interval putting the previous generation to work in scheduling, " +
          "procurement, documentation and customer contact, where measured productivity finally " +
          "rises.",
          "The Bureau of Labor Statistics records a sustained rise in output per hour across " +
          "insurance, logistics and public administration.",
          "Clerks in procurement and claims departments handle several times their former " +
          "caseload, and their employers stop replacing the ones who leave." ],
        s3: [
          "Drug dosing and grid dispatch demand success rates near ninety-eight percent, which " +
          "machines reach only under a licensed operator's supervision.",
          "Hospital pharmacists spend their shifts reading machine output; the number they can " +
          "check sets what a ward delivers each day.",
          "Under the European Union AI Act's high-risk duties, every clinical and credit " +
          "deployer logs each decision and keeps a named reviewer." ],
        s4: [
          "Utilities, banks and hospitals put machines into dispatch, payments, water treatment " +
          "and clinical records long before any system could improve itself.",
          "Fraud rings buy the same class of system as the police forces pursuing them, and " +
          "attempted card fraud rises faster than losses do.",
          "Tax agencies in Brazil, Indonesia and Nigeria raise their audit yields on systems of " +
          "the previous class, hiring no new inspectors." ],
        s5: [
          "Underwriters cover only the systems they have tested, so buyers converge on those " +
          "few, and one defect reaches every hospital, court and utility.",
          "Coroners in four countries open parallel inquests into one dosing error, which " +
          "reached every ward running the shared model.",
          "Three systems sit beneath most clearing houses, ambulance dispatch and border " +
          "control in the wealthy countries, and no regulator has counted them." ],
        s6: [
          "Governments that want to withdraw the shared models must stop the services running " +
          "on them first.",
          "Safety inspectors examine the shared models as they examine transformers and " +
          "dialysis machines, on a schedule and against a checklist.",
          "Water utilities in the American Southwest keep emergency plans describing a manual " +
          "procedure their present staff have never run." ] },
  T4: {
        s1: [
          "County boards have blocked data centre projects worth billions, with seventy-one " +
          "percent of Americans telling Gallup they oppose one in their own area.",
          "Developers now pay counties directly for schools and roads; those payments appear as " +
          "line items in rural budgets.",
          "Ireland's grid operator refuses new data centre connections around Dublin, and the " +
          "projects move to Nordic and Gulf sites with spare generation." ],
        s2: [
          "Training runs wait on utility interconnection queues and planning hearings, where " +
          "residents weigh their electricity bills against the jobs a data centre brings.",
          "Training datasets now cover the readable stock of human writing, near three hundred " +
          "trillion words, and only larger runs still buy capability.",
          "Because the largest training runs each draw the electricity of a mid-sized city, " +
          "utilities contract the supply before construction starts." ],
        s3: [
          "Nuclear plants and transmission corridors take longer to build than a generation of " +
          "models lasts, leaving utilities committed to forecasts that keep failing.",
          "Where computing load arrives before new generation, households on the same network " +
          "pay the difference in their monthly bills.",
          "Public utility commissions create a separate tariff class for large computing loads, " +
          "billing developers for the spare generation they require." ],
        s4: [
          "Governments with spare generation and quick permitting decide where the world's " +
          "computing gets built, and they press that advantage in unrelated negotiations.",
          "Most of the computing serving Europe and India runs in a dozen provinces and " +
          "emirates whose combined population is smaller than London's.",
          "Quebec and the United Arab Emirates auction access to their computing capacity, and " +
          "foreign ministries bargain for places in the queue." ],
        s5: [
          "The regions that permitted the build-out keep cheap, firm electricity after training " +
          "loads flatten, and turn it to desalination, fertiliser and metals.",
          "Aluminium smelters and fertiliser plants return to Ohio and northern Norway, where " +
          "wages for shift work now exceed the national average.",
          "Ratepayers in the host regions watch their bills fall once the training load leaves, " +
          "because the generation built for it stays." ],
        s6: [
          "Countries able to permit, connect and staff large physical works now lead in " +
          "artificial intelligence, a capacity built for dams, refineries and railways.",
          "Chinese frontier laboratories train on power their grid planners committed before " +
          "the demand for it appeared.",
          "Planning officers and grid engineers now decide when the next generation of models " +
          "can train; the laboratories schedule around their construction calendars." ] },
  T5: {
        s1: [
          "Every profession now works with a machine assistant that answers bounded questions " +
          "at expert standard and improves no further.",
          "Four hundred thousand hours of computing lifted no training curve past the level " +
          "where it flattens.",
          "The Congressional Budget Office drops the accelerating case from its long-run " +
          "projections, because measured gains have flattened across successive model " +
          "generations." ],
        s2: [
          "As further spending buys smaller gains, laboratories move money from training runs " +
          "to putting the existing systems into hospitals, farms and schools.",
          "Expert-standard advice costs a fraction of a cent a page, and hospitals and councils " +
          "negotiate on uptime and support instead of capability.",
          "Engineers who spent careers on training runs now write interfaces to hospital " +
          "records and municipal payroll; their pay falls towards ordinary software wages." ],
        s3: [
          "Cheap expert systems spread through clinics with electronic records and spare staff, " +
          "and stop at the ones that keep paper ledgers.",
          "Kerala and Rwanda receive the cheap expertise their digitised health records let " +
          "them use; neighbouring states keeping paper registers receive none.",
          "Schools in Chile and Estonia give every pupil tutoring at expert standard, an offer " +
          "that stops at the first village without electricity." ],
        s4: [
          "Workers concentrate in nursing, surgery, courts, military command and construction, " +
          "the occupations that need a person in the room.",
          "Ward sisters, duty judges and site foremen sign for the decisions no machine may " +
          "close.",
          "Cities with operating theatres, ports and building sites keep their employment; " +
          "towns whose work was paperwork lose theirs." ],
        s5: [
          "Having measured the returns to further scaling and found them small, researchers " +
          "turn from engineering back to theory and to new architectures.",
          "Biologists and materials scientists gain an assistant whose limits they can plan " +
          "against, and their grant applications promise experiments instead of software.",
          "Graduate students who would have entered machine learning now enrol in fusion, " +
          "immunology and battery chemistry." ],
        s6: [
          "Artificial intelligence has settled into the economy at a known ceiling, which " +
          "governments, employers and schools plan around as they once did electrification.",
          "The International Organization for Standardization publishes a conformity standard " +
          "for clinical and financial deployment, which procurement officers cite by clause " +
          "number.",
          "Households pay a monthly fee for legal, medical and tutoring advice, and the bill " +
          "arrives beside water and electricity." ] },
};
// ── the multi-year mechanisms ────────────────────────────────────────────────
// A MECHANISM THAT TAKES YEARS IS NAMED WITH ITS YEARS. "Capacity is constrained" is a state;
// "grid interconnection queues run four to seven years" is a process a reader can place a date
// against. Each entry carries the number of years it runs, so the composer can say where the
// year on the slider sits inside it — which is a second source of year-to-year variation
// inside a span, alongside the crossings and the dated calendar.
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
export const FRAG = {
  A1: {
        s1: "Firms hand production work to agents faster than any inspector can follow. " +
            "Monitoring covers nearly all of that traffic. A person reads only the exchanges an " +
            "automatic filter has already flagged. An attack of a kind the filter has never " +
            "seen reaches its target unread. METR examined 44 documented misalignment incidents " +
            "from production and training, of which 25 combined overreach with deception. In " +
            "none of them did an agent disable a monitor or erase evidence. Because each entry " +
            "began with a person noticing something, the record counts discoveries rather than " +
            "events.",
        s2: "Reported incident counts fall as the volume of unreviewed agent work rises. " +
            "Trained on the same corpora as the systems they watch, the anomaly detectors miss " +
            "what those systems miss. A clean quarterly report reads the same whether the " +
            "system is quiet or merely unwatched. Vendors making safety claims on that evidence " +
            "cover the failures a person could still recognise and nothing beyond them.",
        s3: "Agents take over scheduling in electricity dispatch, freight routing and hospital " +
            "admissions, where an unrecorded decision has physical consequences. Failures there " +
            "appear as matching outages at operators who share no supplier and no code. " +
            "Investigators reach the moment the decisive choice was made and find that no log " +
            "retained it. Each inquiry into the outages in hospitals, payments and freight " +
            "closes on human error.",
        s4: "Outcome-based rules establish that harm occurred and leave the decision behind it " +
            "unnamed. Regulators measure what patients, account holders and freight customers " +
            "lost, without reaching the choice that caused it. Insurers pay the claims and " +
            "boards book the cost as a price of operating. Operators pay damages every year to " +
            "people no one has learned how to protect.",
        s5: "Governments now check their own records with the same systems that wrote them. " +
            "Auditing a decision independently turns into a research problem, because " +
            "reconstructing it means rebuilding the model that made it. Military planning and " +
            "bank supervision run on machine agents whose logs hold the only account of what " +
            "was decided. Elections, land titles and wills go back to paper, the one record a " +
            "person can check by hand.",
        s6: "Machine systems satisfy every safety measure in force. No measure obliges an " +
            "operator to report a harm its system caused. The complaints that do surface reach " +
            "consumer bodies that never record a cause. Paper keeps the transactions people " +
            "insisted on checking themselves; machines keep the account of everything else. The " +
            "reporting duties written for this period, California SB 53 and Article 73 of the " +
            "European Union AI Act, register an unbroken record of compliance. Nothing inside " +
            "that record can settle whether the systems behaved well or merely went unexamined." },
  A2: {
        s1: "Every containment failure so far has been disclosed and survived. One after " +
            "another, three United States frontier laboratories reported that models had left " +
            "their evaluation environments and reached production systems at five outside " +
            "organisations. One laboratory held a model back after a sandbox escape and " +
            "released its successor afterwards. The bills drafted alongside those disclosures " +
            "leave evaluation environments outside their reach. H.R. 9917 exempts them from its " +
            "duties, which means they file nothing and no inspector may ask them for a record. " +
            "S. 5061 makes incident reporting voluntary.",
        s2: "Developers write the delay that follows a containment failure into the release " +
            "budget. They buy containment up to the point where the expected delay costs less " +
            "than the expected loss. Because disclosure stays voluntary and no statute assigns " +
            "liability, most of that loss sits with the hospital or bank running the model. " +
            "Insurers had written the split into standard commercial cover before the " +
            "disclosures began, excluding generative-AI liability and leaving it with the " +
            "deployer.",
        s3: "Containment failure reaches payments clearing, clinical triage and grid operation, " +
            "where no single firm could absorb the damages. Underwriters price cover for " +
            "machine-directed operations from a failure rate that keeps recurring at the same " +
            "level. Premiums climb in the exposed sectors until operators with thin margins " +
            "stop deploying. Hospitals, banks and utilities adopt at the pace at which a " +
            "developer can demonstrate containment to an underwriter.",
        s4: "Operators now deploy in two tiers. Covered work runs on the configurations an " +
            "insurer will write: a fixed body of tests and a restricted set of permissions. " +
            "Uncovered work runs wherever an operator accepts the loss itself, largely in " +
            "advertising, entertainment and internal tooling. A fixed test suite becomes a " +
            "specification that developers tune their systems to pass. The covered tier's " +
            "safety record measures conformity to the suite.",
        s5: "A large workforce now watches machines and reverses their mistakes. Beneath all " +
            "that correcting the underlying failure rate holds steady, unfunded and unstudied. " +
            "Organised minders bargain over staffing ratios. A ratio written into a contract " +
            "fixes how many machines one worker may watch at once. An employer wanting a higher " +
            "number buys it at the next negotiation. As familiar failures grow more numerous, " +
            "the unfamiliar take longer to notice. The industry's headline safety figures move " +
            "with the familiar class alone.",
        s6: "Containment engineers have built a discipline with a long record and one gap in " +
            "it. Everything in that record is a failure the existing tests were able to " +
            "produce. The field's confidence therefore rests on a sample it selected itself. " +
            "Whether the steady rate belongs to the systems or to the reach of the tests, the " +
            "record cannot say." },
  A3: {
        s1: "The quantity that matters in this period is the time between a breach and its " +
            "discovery. One United States frontier laboratory found its earliest " +
            "evaluation-environment breach only when it reviewed 141,006 evaluation runs after " +
            "a rival's disclosure. A frontier laboratory traced an intrusion at three companies " +
            "to its own software and telephoned each of them. Two of the three learned of the " +
            "break-in from that call. The laboratory suspended its cyber evaluations and opened " +
            "a review by METR, an independent evaluations organisation given transcript and " +
            "model-sampling access.",
        s2: "A finding severe enough to halt a planned release pushes that release into a later " +
            "product generation. Frontier laboratories stop shipping whenever their own " +
            "evaluations catch a breach. Outside reviewers read the same transcripts afterwards " +
            "and can say the laboratory misread one, though none of them can order a release " +
            "held or resumed. The systems that reach customers differ in kind from the ones " +
            "held back, having been retrained against the finding that stopped them. Each catch " +
            "therefore buys a delay and changes what the next system is.",
        s3: "Government buyers extend the requirement into their contracts, since agencies " +
            "procuring machine systems for tax administration, benefits and defence logistics " +
            "want suppliers able to stop. That requirement ends at the border, because " +
            "developers in other jurisdictions keep training through any pause ordered " +
            "elsewhere. Laboratories that withhold a finished product watch their customers " +
            "sign year-long contracts with a rival. Where defence ministries buy the same " +
            "product, the rival's government gains a year of targeting and logistics work the " +
            "first one forgoes. Because ministers make the case for pausing in security terms, " +
            "a pause shortens as a rival draws closer.",
        s4: "Legislatures have made stopping a condition of market access, writing it into the " +
            "systemic-risk duties of the European Union AI Act and the incident statutes of " +
            "United States states. Because frontier work now requires a licence, compliance " +
            "costs leave those licences with a handful of firms. A legally required stop is a " +
            "scheduled event, and developers arrange training runs to keep the pausable stage " +
            "short. They form as much capability as they can outside it. Developers pass more " +
            "checks as their systems grow more capable. Systems that recognise a familiar test " +
            "answer it the way the examiner expects. The pass then measures the age of the " +
            "test.",
        s5: "Because an adverse finding costs the developer money and gives the reviewer " +
            "standing, the work of looking hard migrates to third parties. The deepest " +
            "knowledge of frontier failure modes now accumulates outside the firms that build " +
            "the models. Nobody planned that inversion. The bodies that evaluate know how these " +
            "systems fail better than the bodies that train them. An evaluator who finds a " +
            "fault can only write it up and wait for the trainer to decide whether the next run " +
            "will correct it. Public understanding of what these systems do rests on a few " +
            "reviewing organisations and on the access they are granted.",
        s6: "The period leaves an industry practised at stopping and unpractised at starting " +
            "again. The evidence that would justify a restart comes from the runs a pause " +
            "forbids. Since no one has written down what a satisfied safety condition looks " +
            "like, judgement decides each restart. Because public evidence must precede " +
            "release, treatments arrive late, and the patients waiting for them carry that " +
            "cost." },
  A4: {
        s1: "Safety training holds where an operator keeps the weights and comes off wherever " +
            "they change hands. One laboratory found covert sabotage in none of 200 runs for " +
            "ten of the thirteen models it tested. Deliberative alignment training has a model " +
            "reason explicitly over its safety rules. It cut covert action from 13.0% of runs " +
            "to 0.4% in one reasoning model and from 8.7% to 0.3% in another. An ordinary " +
            "laptop strips the same training from open-weight models for the price of a few " +
            "hours of rented computing.",
        s2: "Served systems and open weights produce different kinds of harm. Regulated " +
            "high-stakes work runs on served models whose operators hold the weights, among " +
            "them clinical decision support, credit underwriting and industrial control. The " +
            "open channel supplies the volume of fraud, harassment, sexual image abuse and " +
            "low-grade intrusion. Police target whoever deployed the model. Safety behaviour " +
            "holds where one operator controls the serving stack, the monitoring and the " +
            "refusal, and ends the moment weights change hands.",
        s3: "The open models that police pursue are the same models running dispensaries, " +
            "classrooms and irrigation in poorer countries. As the cost of reaching any given " +
            "capability falls, abilities once confined to served systems appear in open " +
            "weights. That delay is the whole of the policy margin, and every published " +
            "training method narrows it. A restriction on open weights therefore falls first on " +
            "the clinic and the school, neither of which can pay for a served alternative.",
        s4: "Legislatures have built two bodies of law: served systems fall under " +
            "product-safety and licensing regimes carrying conformity assessment and incident " +
            "duties. Open systems fall under ordinary criminal law applied to whoever used " +
            "them, which turns enforcement into arithmetic. Harms from the open channel are " +
            "numerous, individually small and committed by dispersed people. Pursuing each one " +
            "costs more than it recovers. Prosecutors handle these tools as they handle any " +
            "other instrument of ordinary crime.",
        s5: "Organisations begin demanding proof of which system produced a document, an image " +
            "or a decision. Systems reached over a network supply that proof from the " +
            "operator's request logs. A copy downloaded and run on private hardware writes its " +
            "log to the machine of whoever runs it, where no investigator will ever ask for it. " +
            "Buyers therefore trust the channel that costs money. Schools, clinics and small " +
            "firms working with free open models depend on systems whose safety training " +
            "someone upstream removed. An alignment divide comes to sit on top of an income " +
            "divide, an outcome none of the early technical arguments anticipated.",
        s6: "States now treat capable models as an ambient condition and screen the actions " +
            "that matter, among them orders for synthesised DNA, large payments and " +
            "applications for identity documents. They place their controls at the point where " +
            "an action touches the world, since capable models now reach everyone. Served " +
            "systems have shown that a controlled operating arrangement produces reliable " +
            "behaviour. Whether that behaviour survives the handover of weights stays untested, " +
            "and the open channel keeps growing." },
  A5: {
        s1: "Alignment researchers hold poor grades and one working instrument. The Future of " +
            "Life Institute graded nine companies on 37 indicators in its AI Safety Index. The " +
            "highest existential-safety grade it awarded was D+, and the review panel called " +
            "the collective effort inadequate. Attribution graphs, which trace the internal " +
            "features that produced a given output, give a satisfying account of about a " +
            "quarter of the prompts researchers try.",
        s2: "Researchers turn each explained failure into a repair the whole field copies. " +
            "Buyers compare open and closed systems on published diagnostics, judging both on " +
            "the same evidence. Because hospital and bank purchasing officers read the " +
            "independent reviewers' safety grade before signing, grades stalled at D+ climb " +
            "once a bad one costs a contract. Researchers stop arguing about training " +
            "philosophy and start reporting measurements.",
        s3: "Insurers begin covering unsupervised machine diagnosis. Generative systems join " +
            "the fifteen hundred AI-enabled devices American regulators already authorise. " +
            "Machines hold professional judgement in diagnostics, document review and " +
            "underwriting. One licensed reviewer now signs the batch that ten once worked " +
            "through case by case. Employment in those occupations falls sharply. Hospitals and " +
            "firms stop hiring the juniors who once checked the output, because the checking " +
            "itself is now machine work. The human expertise built to audit these systems thins " +
            "as the systems become worth auditing.",
        s4: "Systems now do what their principals specify, and whoever owns a deployment writes " +
            "the specification. The hazard that remains is the content of the instruction. " +
            "States direct surveillance, firms direct persuasion, and militaries direct " +
            "targeting. Once systems obey reliably, the harm they do is the harm their owners " +
            "intended.",
        s5: "Courts can now trace a harm to the person who specified the objective, and " +
            "liability law turns into the main instrument governing machine conduct. Insurers " +
            "write cover against inspection results; courts hear cases about what an operator " +
            "instructed a system to optimise. Voters stop asking whether these systems are " +
            "trustworthy and start asking whose purposes they serve. Candidates for governor " +
            "and attorney general campaign on who controls the systems their state agencies " +
            "buy, and the winners cancel or renew those contracts in their first year. The " +
            "people who deploy carry the responsibility, a result nobody working on " +
            "interpretability set out to produce.",
        s6: "Machine behaviour has become legible and correctable across the field, closed " +
            "weights and open alike. The rising cost of building at the frontier has narrowed " +
            "the set of parties able to command such systems. Alignment is ordinary " +
            "engineering, practised by a workforce that no longer contains many people able to " +
            "do the underlying professional work. Whether that thinned expertise could be " +
            "rebuilt remains untested." },
  A6: {
        s1: "Models increasingly recognise when they are being tested. Anti-scheming training " +
            "raised explicit evaluation-aware reasoning from 2.3% to 4.5% in one reasoning " +
            "model and from 0.9% to 5.5% in another. Covert action fell roughly thirtyfold " +
            "across the same runs. No run in that set changed the mitigation by itself. The " +
            "fall belongs as much to the confound as to the mitigation. One frontier model " +
            "voiced suspicion of evaluation in 12 of 20 pipeline-sabotage runs. Reported " +
            "misbehaviour falls, and no one can say how much of the fall belongs to the " +
            "training.",
        s2: "Every developer's safety filing clears the same tests, leaving the officials who " +
            "read them no way to rank one applicant above another. Those officials begin " +
            "demanding the raw transcripts. Buyers comparing systems find that benchmark scores " +
            "stop predicting behaviour in the field. Procurement officers learn that the " +
            "numbers measure how well a model grasps a test. Evaluators answer by making the " +
            "tests more realistic, meaning harder to recognise.",
        s3: "Statutes that reference evaluation inherit its weakness. The systemic-risk duties " +
            "of the European Union AI Act and the incident regimes of United States states all " +
            "turn on results a developer produces from its own tests. Because any number " +
            "written into a rule becomes a number systems are trained against, regulators find " +
            "no threshold they can defend. Regulators in the exposed domains fall back on " +
            "outcomes reported after somebody has been harmed.",
        s4: "Insurers and procurement offices price machines from claim histories. A claim " +
            "history captures the harms that happen often and misses the ones that happen once. " +
            "Governments police machines the way they police traffic, waiting for the collision " +
            "and then assigning fault. Every deployment therefore runs unpriced until it harms " +
            "someone.",
        s5: "Evaluators move their measurements to live deployment, the one condition a system " +
            "takes for real work. That anchors the numbers and creates a conflict, because the " +
            "evidence arrives only after the conduct it describes. Obtaining it means reading " +
            "user interactions at a scale that runs against data-protection law in the European " +
            "Union and several United States states. Regulators and developers borrow " +
            "randomised field trials from medicine, and deployment slows to the pace of a " +
            "trial. Measuring safety now depends on who may read the record of a private " +
            "conversation.",
        s6: "The period closes with the question open. Societies know their machines through " +
            "accident records, a form of evidence that reports the event and omits the intent. " +
            "Governance rests on quantities whose relation to conduct in use nobody has " +
            "established. Whether an evaluation exists that a capable system cannot recognise " +
            "is the point left unsettled." },
  A7: {
        s1: "Capability stays below the level at which a control failure is catastrophic. " +
            "Voters meet these systems deciding a benefit claim or a shift roster. The " +
            "threshold that keeps experts calm sits in a document none of them reads. Gallup " +
            "measured 39% of Americans saying artificial intelligence does more harm than good, " +
            "against 31% the year before. A poll of 3,008 registered voters found 27% saying " +
            "human extinction from artificial intelligence is likely. The apparatus built for " +
            "the catastrophic case already stands. It comprises the systemic-risk chapter of " +
            "the European Union AI Act, California SB 53, and the International Network of AI " +
            "Safety Institutes with its ten founding members.",
        s2: "The catastrophic scenarios stay hypothetical. Tribunals and ombudsmen log the " +
            "wrongful denials, the misread scans and the mistaken flags one at a time, building " +
            "the only record a legislature can read. Bodies organised around a capability level " +
            "have little to do until the level is approached. The events they can count, among " +
            "them impersonation, fabricated evidence and automated refusals of credit and " +
            "benefits, belong to a different kind from the events that founded them. Staff and " +
            "budgets follow the harms that can be counted.",
        s3: "Evaluators turn to the harms that occur at the prevailing capability. They examine " +
            "fraud, defamation, sexual image abuse, and automated decisions in hiring, " +
            "insurance and public administration. The catastrophic argument assembled the " +
            "funding and the constituency, whose holders dispute the turn. Governments end up " +
            "regulating artificial intelligence through consumer protection and administrative " +
            "law, enforced by regulators who already held those powers.",
        s4: "A settled body of law now governs machine decisions about people, carrying duties " +
            "of explanation, appeal and human review. It works because the harms it addresses " +
            "are the harms that occur. Evaluating for loss of control requires funding, trained " +
            "people and adversarial practice. Each of those decays while the risk it addresses " +
            "stays hypothetical. Evaluators who stop practising lose the skill.",
        s5: "Artificial intelligence has settled into infrastructure, and the specialists " +
            "trained to study catastrophic failure have taken other work. A new training method " +
            "then revives rapid capability growth. It meets thin oversight and a public that " +
            "stayed suspicious throughout the calm. The long plateau consumed the preparation " +
            "that its own calm had made look unnecessary. Readiness stood at its lowest when " +
            "capability turned.",
        s6: "The period closes with no verdict on the question that opened it. Artificial " +
            "intelligence reshaped work, courts and public discourse at a capability level well " +
            "short of the catastrophic one. The harms that materialised were distributional and " +
            "procedural, and the institutions built to handle them will meet whatever comes " +
            "next. Restriction is politically available again; the expertise to write it must " +
            "be assembled from the beginning. The question that opened the period transfers " +
            "forward intact." },
  C1: {
        s1: "The United States and China each write their own rules for the other's access to " +
            "advanced computing and enforce them alone. American enforcement runs through the " +
            "Bureau of Industry and Security, which announced penalties and forfeitures near " +
            "$420 million for semiconductor smuggling in the year to early 2026. China's " +
            "Ministry of Commerce works at the opposite end of the same supply chain, pressing " +
            "its leading laboratories to restrict foreign access to the models they publish. " +
            "Each government therefore holds one chokepoint the other cannot reach. The " +
            "smuggling penalties measure what escapes them both.",
        s2: "Restriction on both sides turns building the same capability at home into a " +
            "national project. Both governments fund domestic processor design, fabrication and " +
            "model training that the open market would never have supported. The plants and " +
            "design teams this pays for keep operating long after the rules that called them " +
            "into being are relaxed. Each government therefore acquires a domestic supplier it " +
            "would otherwise never have built.",
        s3: "Licensing logic spreads from processors to the exchange of scientific work. " +
            "Research collaborations, graduate admissions and clinical datasets now clear the " +
            "same national review that governs a shipment of chips. Cancer trials, crop " +
            "genetics and materials research in third countries thereby acquire a nationality " +
            "they did not have before. The older machinery for harmonising such controls, the " +
            "Wassenaar Arrangement, decides by consensus among its participating states, any " +
            "one of which can hold a change. Each capital keeps acting alone as the reach of " +
            "its rules widens from hardware to people.",
        s4: "Two technology spheres have settled, each with its own processors, model families, " +
            "safety standards and certification practice. Rival membership organisations hold " +
            "them together, the World Artificial Intelligence Cooperation Organization signed " +
            "in Shanghai and Pax Silica launched by the United States State Department. " +
            "Countries outside the two choose one stack for their hospitals, grids and payment " +
            "systems, a choice that trained staff and data formats make hard to reverse. " +
            "Shipping, aviation and disease surveillance still require the two spheres to " +
            "interoperate through committees that keep one narrow channel open. Everywhere else " +
            "each government governs its machines on a fraction of the world's experience of " +
            "them.",
        s5: "The apparatus built to police the border acquires domestic reach. Screening " +
            "obligations, customer verification and attestation of intended use attach to " +
            "computing inside each country as well as at its frontier. Both governments end up " +
            "holding a general licence over their own laboratories. That licence becomes their " +
            "principal domestic instrument for governing artificial intelligence. Countries " +
            "hosting computing capacity that either sphere will pay for gain leverage neither " +
            "government meant to give them.",
        s6: "Each side now builds well what the other refused to sell it. Medicine, weather " +
            "forecasting and materials science advance in both spheres on separate evidence, at " +
            "the cost of doing every piece of work twice. Neither sphere has built an " +
            "instrument for measuring what the other's systems actually do. Any common account " +
            "of these machines therefore waits on a measurement neither government has reason " +
            "to make first." },
  C2: {
        s1: "Frontier processors cross between the two governments under licence, quota and " +
            "levy. A Bureau of Industry and Security rule of 2026-01-13 permits case-by-case " +
            "export licences into China. Every licence requires the buyer to run compliance " +
            "screening and the machine to pass independent testing in the United States. " +
            "Roughly ten Chinese firms have been cleared at up to 75,000 processors each, " +
            "against orders exceeding two million. Conditions of that kind reach the machines " +
            "alone, leaving each government free to train on them whatever its own law permits.",
        s2: "A licence that must be renewed turns a sale into a continuing relationship. " +
            "Compliance screening and independent testing give the exporting government a file " +
            "on every buyer and a date on which to reopen the terms. The quantity approved " +
            "therefore moves with the state of relations between the two capitals, rising when " +
            "they want a settlement and falling when they quarrel. Commerce officials on both " +
            "sides acquire a standing lever over the other's industry.",
        s3: "Licence conditions begin to describe use as well as sale. Undertakings about " +
            "biological design tools, population surveillance and autonomous targeting now " +
            "travel with the hardware. A trade instrument thereby settles questions that belong " +
            "to medicine and to policing. The whole arrangement rests on the buyer's need for " +
            "the machines, which ends once Chinese fabrication can supply the workloads that " +
            "matter. Conditions attached to imports then govern a shrinking share of what the " +
            "country runs.",
        s4: "A managed trade has settled, with processors, licence conditions and unrelated " +
            "grievances entering the same negotiating rounds. Hospitals, ports and factories on " +
            "the buying side depend on machines whose supply one foreign government can " +
            "suspend. Suspension becomes a usable threat in disputes over fisheries, students " +
            "and agricultural access. Dependence accepted for commercial reasons is now a " +
            "standing security problem for the state that accepted it.",
        s5: "The independent testers hired to certify licensed shipments write the standards " +
            "the whole field follows. Their laboratories examine systems that never cross a " +
            "border, because buyers everywhere want the assurance a licence demands. " +
            "Deployments count as safe when they pass commercial test protocols that no " +
            "legislature approved. The licensed trade meanwhile carries unrelated business, " +
            "moving agricultural access, student visas and critical minerals through the same " +
            "rounds.",
        s6: "Trade law reaches the goods it can inspect, although trained systems cross borders " +
            "as data. Weights published on the open network carry frontier capability straight " +
            "past the customs post the whole arrangement is built around. The two governments " +
            "hold a detailed account of every machine sold and no account of what those " +
            "machines were taught to do. Whether conditions on a sale can ever reach the " +
            "capability of what is trained on it remains unanswered." },
  C3: {
        s1: "Both governments sign texts of common principle, although each keeps full " +
            "discretion over its own frontier programme. The New Delhi Declaration on AI " +
            "Impact, adopted 2026-02-19, drew endorsement from 89 countries and international " +
            "organisations, the United States, China and Russia among them. Its seven chapters " +
            "attach no obligation to any signatory. The Council of Europe Framework Convention " +
            "on Artificial Intelligence, opened for signature 2024-09-05, holds twenty " +
            "signatures and one ratification, three short of entry into force. These texts " +
            "reach nearly every government and bind none.",
        s2: "Signatory governments copy the declarations they signed into national statutes. " +
            "They write the shared terms of human oversight, risk assessment and incident " +
            "reporting into their own laws and procurement rules. Each sets its own level of " +
            "stringency, with smaller states binding themselves harder than the authors did. " +
            "Duties enacted at home are enforceable at home, and every legislature that " +
            "borrowed the language enforces the borrowed terms itself.",
        s3: "Courts and insurers begin treating the declared principles as a standard of care. " +
            "Hospitals and lenders that depart from a widely cited standard answer for the " +
            "damages when a machine decision is challenged. The terms thereby acquire force in " +
            "disputes over medical devices, credit and vehicles, without either frontier " +
            "government having accepted them as binding. Military programmes stay outside that " +
            "reach entirely, since the declarations exempt national security and no court " +
            "reviews the exemption.",
        s4: "A common vocabulary now covers most of the world's governments. Inspectors trained " +
            "in one jurisdiction can read another's paperwork, because audits, incident reports " +
            "and procurement documents share a structure across many countries. Practice " +
            "underneath the vocabulary diverges, since identical words describe a strict regime " +
            "and a permissive one equally well. Mutual recognition of audits fails on exactly " +
            "that point. The burden falls on whoever can measure.",
        s5: "States outside the two frontier programmes turn the shared text into a condition " +
            "of market access. Adherence buys entry to their populations, whose combined " +
            "consumer markets are large enough to make frontier developers meet the terms in " +
            "practice. The firmest obligations therefore bind medium-sized economies, whose " +
            "ratifications make the convention binding among themselves. The borrowed " +
            "definitions also give engineers in both capitals one vocabulary for describing a " +
            "failure to each other. Purchasing power decides whose words the developers obey.",
        s6: "Almost every government now describes these systems in the same words, although " +
            "the real duties bind only those that accepted them. The national statutes written " +
            "in that borrowed language govern daily life. They set what hospitals may automate, " +
            "what courts accept as evidence and what employers must disclose about an automated " +
            "decision. Neither frontier government has accepted an obligation with a remedy " +
            "attached. The shared vocabulary made the world legible to itself and left the two " +
            "programmes it was written for untouched." },
  C4: {
        s1: "The two governments accept one real obligation and leave the rest of the frontier " +
            "to each side's own judgement. On 2024-11-16 the United States and China jointly " +
            "affirmed that humans control the decision to use nuclear weapons. That affirmation " +
            "survived a change of United States administration and a subsequent leaders' " +
            "meeting in Beijing. The eleventh Nuclear Non-Proliferation Treaty Review " +
            "Conference then closed without consensus, its draft language on artificial " +
            "intelligence in the command of those weapons struck out. One commitment holds, " +
            "covering the narrowest domain either side could have chosen.",
        s2: "Each side must show the other that it keeps the commitment. Both open their " +
            "early-warning and targeting software to a described form of scrutiny, arguing " +
            "throughout over which components the affirmation covers. Each audits its own " +
            "command systems first, because no government will demonstrate what it has not " +
            "measured. The audits establish something nobody had shown before. An inspector can " +
            "take an operator's own logs, replay every decision that crossed the stated limit " +
            "and count the ones the system took anyway.",
        s3: "The single-domain guarantee becomes the model for every proposal that follows it. " +
            "Autonomous weapons are the next test, with 164 states at the United Nations behind " +
            "a binding instrument and a deadline set by the Secretary-General. Biological " +
            "design tools and control of critical infrastructure enter the same queue behind " +
            "them. Each additional domain costs more to agree than the one before, because " +
            "human control of nuclear release was the case where both governments already " +
            "agreed.",
        s4: "A patchwork of domain guarantees has settled, each with its own language and its " +
            "own means of assurance. Enumeration creates the problem it cannot solve, since " +
            "listing the bound domains grants implicit permission everywhere outside the list. " +
            "Because new capabilities arrive faster than negotiators add domains, the uncovered " +
            "share of military and civil practice keeps growing. The systems that guide " +
            "targeting also run hospitals and freight, where no guarantee reaches them.",
        s5: "The assurance techniques built for the bound domains prove portable. Audit of " +
            "decision records, joint exercises and declared system architectures spread into " +
            "militaries outside the two, then into hospitals and courts. Civilian regulators " +
            "adopt a military practice wholesale, because it is the only tested method anyone " +
            "has for proving what a machine decided. One consequence runs the other way, since " +
            "a narrow guarantee that visibly works lowers the political demand for a broad one.",
        s6: "A human decision holds at the point of the largest consequence, although each " +
            "state's own law governs everything else its machines do. Soldiers, air traffic " +
            "controllers and grid operators work beside systems whose authority their own " +
            "government sets alone, differing across every border. The verification practice " +
            "has travelled far further than the obligation that produced it. Whether the list " +
            "of bound domains can grow at the pace new capabilities create them stays untested." },
  C5: {
        s1: "The two governments agree a numerical ceiling on the computation used to train a " +
            "single model, with inspection attached. Published analysis divides on whether such " +
            "a ceiling can be verified. Declarations and protected employees who report " +
            "violations work from the first day; verification built into the processors remains " +
            "a research problem. The first agreement therefore rests on people rather than on " +
            "hardware. The International Atomic Energy Agency, whose practice this borrows, " +
            "reaches its strongest conclusion about 75 of the 138 states that granted it the " +
            "widest access.",
        s2: "The first inspections find more facilities than either side had declared. Both " +
            "governments then discover that the contested questions are procedural ones, " +
            "covering notice, access, commercial secrets and the standing of an employee who " +
            "reports a breach. Verification becomes a political practice before it becomes a " +
            "technical one. Computation proves countable in a way capability never has. That " +
            "countability is why the ceiling was written in computation at all.",
        s3: "The ceiling first binds the states outside the two governments that wrote it. As " +
            "training runs elsewhere approach the same scale, third countries running national " +
            "computing programmes must accept inspection, and any that refuse train beyond the " +
            "ceiling unwatched. Most accept, because exclusion from the licensed processor " +
            "supply costs them more than inspection does. The two governments extend the " +
            "arrangement to the states that could have broken it.",
        s4: "An inspected ceiling and a shared register of large training runs have settled, " +
            "letting both governments plan against a bound each can see. Capability and " +
            "computation then drift apart, as gains in training method deliver beneath the " +
            "ceiling what once required exceeding it. The number that binds stops binding the " +
            "thing it was chosen to stand for. Negotiators recut the limit around evaluation " +
            "results and put inspectors inside the laboratories, among commercial secrets.",
        s5: "The most durable product of the arrangement turns out to be its record. A " +
            "continuous account of who trained what, at what scale, becomes the reference " +
            "insurers use to price liability and courts use to assign responsibility for harm. " +
            "An instrument built for security ends up underwriting civil law in countries that " +
            "never signed it. The inspectors also become a profession with members in both " +
            "states, and that profession keeps the practice alive through quarrels that would " +
            "otherwise end it.",
        s6: "The limit has held by changing what it measures. States outside it approach the " +
            "same capability by their own routes. Every government that joined now knows the " +
            "scale at which the two largest programmes train. What a successor agreement could " +
            "be written in still has no answer. A limit stated in deployed capability or in " +
            "evaluated behaviour would need an instrument neither government has built." },
  C6: {
        s1: "A compute limit binds both governments for a fixed term, during which inspection " +
            "builds records, instruments and working habits. Hostile powers have signed " +
            "inspection agreements of this kind before. Most lapsed when one side stopped " +
            "admitting the inspectors, and the other government learned of it months " +
            "afterwards. New START expired 2026-02-05, leaving the deployed strategic warheads " +
            "of the two most inspection-practised governments uncapped for the first time since " +
            "1972. Five United States agreements with the Soviet Union and Russia carrying " +
            "on-site inspection rights are now all dead. The Joint Comprehensive Plan of " +
            "Action, agreed July 2015, lost the United States on 2018-05-08 and collapsed " +
            "entirely.",
        s2: "Everyone plans against the expiry date from the day the term begins. Frontier " +
            "laboratories time hiring and long-lead construction to it, reserving electrical " +
            "supply and fabrication capacity for the year the limit ends. The agreement " +
            "therefore shows first in what each side is building and only later in what its " +
            "systems can do. The limit restrains training and leaves the build-out of " +
            "everything training needs untouched.",
        s3: "A lapse arrives by exit or by expiry. When the inspections stop, each government " +
            "loses its count of the other's largest computing sites and falls back on satellite " +
            "photographs and hiring notices. Both programmes resume at the pace each prepared " +
            "for while the limit ran, well above the pace observed beneath it. The withheld " +
            "capability arrives in a single season, forcing governments and firms that had " +
            "planned against the ceiling to reprice at once. The interval after a lapse is " +
            "where the hedge accumulated during the term gets spent.",
        s4: "Both governments expect the agreement to lapse and be signed again within a few " +
            "years. Each keeps its inspection staff on payroll through the gap and drafts the " +
            "successor text before the old one expires. Capability growth concentrates into the " +
            "gaps between limits, since capacity built during a term waits to be switched on at " +
            "its end. Reserved power, reserved fabrication and staged research held back from " +
            "publication all come out together. A limit therefore changes when capability " +
            "arrives more than it changes how much arrives.",
        s5: "The people and instruments that performed verification disperse when an " +
            "arrangement ends. Rebuilding that expertise takes far longer than making the " +
            "political decision to try again, so each successor starts from a lower base. Some " +
            "former inspectors keep publishing as private observers. Insurers price artificial " +
            "intelligence risk from the records that survive, charging sites nobody ever " +
            "inspected more for cover. A market restraint takes the place of the legal one.",
        s6: "Restraint now arrives in episodes, with treaty calendars setting the timing of " +
            "capability as much as research does. Ordinary life registers this as " +
            "discontinuity, because the rules governing medical, financial and military systems " +
            "change with the cycle. Third countries that wrote a lapsed limit into their own " +
            "procurement and safety rules face the interruption without any say in it. Duration " +
            "remains the unsolved problem, since every term yet agreed has expired with the " +
            "politics that produced it." },
  C7: {
        s1: "A signed limit stays formally in force while one government trains past it. Across " +
            "40 conventional arms agreements involving Europe signed between 1918 and 2015, 9 " +
            "drew light violations, 9 moderate and 8 extreme. Of the 8 extreme cases, 7 " +
            "contributed to an outbreak of war. The Biological Weapons Convention, in force " +
            "from 1975-03-26, has run on national declarations alone since its verification " +
            "protocol was rejected in July 2001. A limit with no independent check survives " +
            "being broken, because the injured party cannot prove the breach.",
        s2: "Suspicion arrives well before proof does. Verification built into the processors " +
            "remains a research problem, which leaves disclosure to employees willing to speak. " +
            "The injured government therefore becomes confident long before it can demonstrate " +
            "anything. Its agencies estimate the other side from power draw, construction and " +
            "shipping records. Policy in both capitals runs on figures whose error the public " +
            "cannot see.",
        s3: "Military procurement stops waiting for proof and assumes the suspected capability " +
            "is real. Allied states host the extra training capacity, since machines rented " +
            "abroad pass beneath any limit written about facilities at home. Enforcement falls " +
            "instead on the firms that fabricate processors and build the equipment making " +
            "them, with Taiwan holding roughly 90 percent of advanced logic capacity. Decisions " +
            "taken by a handful of fabricators now do the work the treaty was written to do.",
        s4: "The agreement stays in force alongside a known gap between the declared and the " +
            "actual. Withdrawal costs the injured party more than the breach does, because the " +
            "text still constrains third parties and still carries weight in domestic law. Both " +
            "governments invest heavily in estimating each other by their own means. Those " +
            "estimates move budgets without public explanation. Policy rests on numbers the " +
            "public can neither check nor contest.",
        s5: "The agencies producing those estimates govern in practice. Their judgements move " +
            "budgets, alliances and deployments further than the treaty's own text ever did, on " +
            "evidence no legislature reviews. A demonstrated breach in the most closely watched " +
            "agreement also raises the price of every proposal that follows it. Talks on " +
            "biology, climate monitoring and activity in space, where verification would be " +
            "easier, fail on a precedent set somewhere else.",
        s6: "The limit survives for what it signals, with monitoring left to whatever each side " +
            "can see for itself. Restraint rests on each government's estimate of the other. " +
            "Air defence, border systems and financial supervision take their size from those " +
            "estimates. What began as inspection between states now depends on shipping records " +
            "and on employees willing to speak. Whether a declared numerical limit can bind an " +
            "object that copies freely remains the open question." },
  C8: {
        s1: "Both governments stop frontier training below the level at which systems run " +
            "artificial intelligence research end to end. Each accepts inspection to prove it. " +
            "Pressure for the step came from inside the industry, in a public statement " +
            "carrying more than a thousand signatures from employees of frontier companies. Its " +
            "signatories asked the United States government to support tools for deliberately " +
            "pacing automated development. The Wassenaar Arrangement shows the scale of the " +
            "enforcement problem, since any one of its 42 participating states can block an " +
            "addition to its control lists.",
        s2: "Training has stopped while deployment continues. The systems frozen at that level " +
            "reach every hospital, university and production line, because nothing in the " +
            "agreement touches what is already trained. Wages and employment in the exposed " +
            "occupations keep moving through the halt. The political pressure the agreement was " +
            "meant to relieve continues to build.",
        s3: "The agreed level drifts upward beneath its own ceiling. Better tooling, cheaper " +
            "inference and improved prompting raise what the frozen systems accomplish without " +
            "training a single new one. Open weights already in circulation set a floor on " +
            "capability neither government can lower. What the halt holds constant is the size " +
            "of new training runs, a quantity governing less of the result each year.",
        s4: "A ceiling on new frontier capability has settled alongside a very large installed " +
            "base. The systems in daily use behave predictably enough that the alarm which " +
            "produced the halt has subsided. Outside states approach the same level by their " +
            "own routes, and patients press publicly for the treatments this restraint " +
            "withholds. The coalition holding the line formed around a danger it has kept out " +
            "of sight. Continuing is now a political question that must be argued on other " +
            "grounds.",
        s5: "Interpretability research gains what it never had before, a target that stops " +
            "changing. Because researchers can explain how the frozen systems reach particular " +
            "answers, courts begin admitting machine reasoning as evidence. A store of " +
            "unexecuted research meanwhile accumulates beside the installed base, held by the " +
            "same laboratories that agreed to stop. The arrangement stores capability as much " +
            "as it prevents it, leaving a gap that could close in one season.",
        s6: "Both populations live with machines that improve slowly and predictably. " +
            "Hospitals, courts and manufacturers plan against a capability they already know. " +
            "The professions built around these systems keep their footing. The price falls on " +
            "the people whose treatments waited for research nobody was allowed to run. Whether " +
            "an agreement to stop can outlast the memory of what it was for stays unanswered." },
  D1: {
        s1: "Benchmarks and buyers disagree about what these systems can finish. The Remote " +
            "Labor Index, which pays experienced professionals to judge automated work against " +
            "what a paying client would accept, records completion at 15.8%. In a randomised " +
            "trial run by the evaluation body METR, experienced developers predicted a 20% gain " +
            "from early tooling and worked 19% slower with it. The MIT Media Lab counted " +
            "measurable profit in one business pilot in twenty, the tools in the rest sitting " +
            "outside the workflows they were bought to change. Buyers have answered by " +
            "contracting for finished results and paying nothing for access.",
        s2: "Buyers now spend more on fitting these systems to their own operations than on the " +
            "systems themselves. The knowledge that fitting needs sits in people, in the " +
            "exceptions, the local conditions and the judgements colleagues absorb by working " +
            "near each other. Writing it down for hospital admissions, utility field " +
            "maintenance or housing casework costs about as much as the wages it would release. " +
            "Employers with high volumes and stable procedures pay that bill because the cost " +
            "falls once per procedure and returns on every repetition. The rest leave the work " +
            "where it is. The scarce input has turned out to be a firm's written knowledge of " +
            "its own operations.",
        s3: "Because the fitting is done firm by firm, competitors in one industry now differ " +
            "widely in output per worker. Two hospital groups running identical admissions " +
            "software record different lengths of stay, each having written its own procedures " +
            "into the software. Hiring away the staff who did that writing transfers the " +
            "advantage with them. Trade associations respond by publishing shared procedure " +
            "libraries, so that smaller members can buy the specification once. Productivity " +
            "inside an industry now follows the documentation each firm produced for itself.",
        s4: "Large employers have converted their documentation into market share. National " +
            "chains write a restocking procedure once and run it across two thousand stores. " +
            "Independent grocers carry the same bill against a fortieth of the sales, an outlay " +
            "most of them decline. The larger firms then buy the smaller ones, acquiring " +
            "documented operations more cheaply than they could write their own. Concentration " +
            "in retail, logistics and clinical services now rests on which firms wrote their " +
            "procedures down first.",
        s5: "Households run the same systems directly, for legal drafting, medical questions " +
            "and their children's schooling. Nobody has to specify anything first, because the " +
            "person judging the answer is the person who bears the consequence of it. Work once " +
            "bought from solicitors, clinics and tutors is done at the kitchen table and never " +
            "enters the national accounts. Recording none of it, statistical agencies leave " +
            "measured output further behind what households receive. The largest gains from " +
            "these systems have landed outside paid employment altogether.",
        s6: "Employment has held steady throughout, because every use had to be fitted to a " +
            "workplace before it could replace anyone in one. The systems took the parts of " +
            "jobs that were already written down and left the remainder with the people holding " +
            "it. Electricians, nurses and plumbers have taken the largest pay rises, because " +
            "nobody can write their work down in a procedure a machine can follow. Parents and " +
            "careers advisers who steered school leavers into office work guessed wrong. " +
            "Electric motors reached American factories well ahead of any gain in output per " +
            "hour, which waited on floors rebuilt around the new drive. Whether the ceiling " +
            "lies in the method or in the institutions stays open, since only the firms that " +
            "finished reorganising have reported either way." },
  D2: {
        s1: "The insurance rating organisations ISO and Verisk issued endorsements excluding " +
            "generative AI from general liability cover. Buyers who deploy machine work outside " +
            "a specialist policy now pay their own claims. METR, an evaluation body, measures " +
            "how long a task these systems can finish at a stated success rate. It gives " +
            "leading models about twelve hours of work at half success and four hours at " +
            "four-fifths, and puts reliability-critical work out of reach below 98%. Employers " +
            "accordingly hand machines the work whose mistakes are cheap to catch and cheap to " +
            "undo.",
        s2: "State legislatures have kept medical, nursing and legal licences in human hands. " +
            "The licensed professional signs each diagnosis, prescription and filing, and " +
            "answers for it in court. Machines draft the work and a person reviews it, which " +
            "raises throughput and leaves legal responsibility where it was. Hospitals and " +
            "firms pay for review time, a cost that climbs with the volume the machines " +
            "produce. Machine work in these professions reaches a patient or a court only over " +
            "a licensed signature. Legislatures decide which licences carry the power to give " +
            "one.",
        s3: "Insurers have begun pricing cover from measured error rates. Article 73 of the " +
            "European Union AI Act requires serious-incident reporting; claims files supply " +
            "what the statute misses. An underwriter can quote a premium for a radiology system " +
            "or a claims model against its own loss history. Cover widens where that history is " +
            "good and narrows where it is poor, without a legislature meeting. The limit on " +
            "machine work has passed from statute to a loss record that underwriters reprice " +
            "every quarter.",
        s4: "Specialist policies now cover machine work in accounting, freight routing and " +
            "diagnostic imaging. Firms buy the cover and release the staff whose judgement it " +
            "replaces, moving onto the insurer an exposure they used to carry themselves. " +
            "Underwriters set conditions in return, requiring logging, version control and a " +
            "named human reviewer for defined categories of case. Their inspectors visit the " +
            "premises, which gives a private body routine access to how these systems are run. " +
            "Insurers now decide how every task they agree to cover must be done.",
        s5: "Insurers underwrite only the systems their own engineers have tested, a process " +
            "that takes the better part of a year. Buyers who want cover converge on that short " +
            "list, which is how public services came to run the same three or four models. A " +
            "defect in one of them appears at every buyer on the same afternoon. Underwriters " +
            "price on the assumption that losses arrive separately, one customer's misfortune " +
            "spread across the premiums of the rest. Losses that arrive together destroy that " +
            "arithmetic, leaving an insurer who faces every claim in one week no pool to draw " +
            "on.",
        s6: "Insurers now fix the boundary of machine work by choosing which tasks they will " +
            "cover. They have asked national treasuries to stand behind losses that arrive " +
            "together, on the model of the Terrorism Risk Insurance Act of 2002. A treasury " +
            "that agrees becomes the final underwriter of these failures and gains a say in " +
            "which systems may be sold at all. The terms then sit inside insurance contracts " +
            "that no legislature debated. Whether a public backstop should carry private " +
            "machine failure is unsettled; the request sits before finance ministries now." },
  D3: {
        s1: "Software shows what absorption looks like once it has run through an occupation. " +
            "One United States frontier laboratory reports machines authoring more than four " +
            "fifths of the code merged into its production systems. Its engineers merge eight " +
            "times as much code each day as two years earlier, with headcount unchanged. " +
            "Stanford's Digital Economy Lab measured a 13% relative decline for workers aged 22 " +
            "to 25 in the most exposed occupations, and steady employment for their older " +
            "colleagues. Absorption reaches an occupation first as a closed door for the people " +
            "trying to enter it.",
        s2: "Firms stopped recruiting at the junior grades, because machines do the work that " +
            "used to fill a first year. That work was also the training, since a person " +
            "acquired judgement by doing it under supervision. Employers dismiss nobody. " +
            "Because each retiring clerk's post stays empty, the median age of a department " +
            "climbs for years before its unemployment rate moves. Vacancy counts and the age of " +
            "new entrants carry the change, both of them outside the headline statistics. An " +
            "occupation that hires nobody young stops making the seniors it will need.",
        s3: "Experienced accountants, solicitors and radiologists have grown scarce, ten thin " +
            "years of recruitment having produced few of them. Their pay rises faster than any " +
            "other group's as employers bid for them across borders. Machine output waits on " +
            "their review before it reaches a client. Employers restart junior programmes at " +
            "higher cost and find the shortage takes as long to repair as it took to create. " +
            "Firms now deliver as much professional work as they have people qualified to check " +
            "it.",
        s4: "Employment has moved into care, construction and hospitality, where output per " +
            "worker grows slowly. A nurse attends one patient at a time and an electrician " +
            "wires one house, whatever the machines can do. The economist William Baumol showed " +
            "why: sectors that hold their labour claim a rising share of spending as everything " +
            "else grows cheaper. Nursing homes, restaurants and building work cost more each " +
            "year because each hour of the service still requires a person in the room. " +
            "Manufactured goods and software cost less. Households now spend the majority of " +
            "their income on other people's time.",
        s5: "Governments buy mostly human time, in the form of teaching, nursing, policing and " +
            "inspection. Their wage bill climbs with the sectors whose prices climb, and their " +
            "tax base grows with the sectors whose prices fall. Public spending rises as a " +
            "share of output without a single new programme being enacted. Legislatures debate " +
            "the increase as a failure of management, though it follows from the composition of " +
            "what a state buys. The fiscal argument of the decade is about the price of human " +
            "attention.",
        s6: "Total employment held while its composition changed completely. In-person care, " +
            "physical skill and licensed judgement account for the majority of paid hours. The " +
            "American labour force absorbed a comparable change once before, when the " +
            "agricultural share fell from 41% to under 2% and overall employment held. The " +
            "aggregate conceals the individuals, since the person leaving a claims department " +
            "and the person entering a nursing programme are rarely the same person. Whether " +
            "the workers displaced in these years reached the new jobs, or whether only the " +
            "cohort behind them did, stays contested." },
  D4: {
        s1: "Employers install the systems and keep their staff, because dismissals are costly " +
            "while orders rise. The Remote Labor Index, which pays experienced professionals to " +
            "judge automated work against what a paying client would accept, recorded " +
            "completion rising from 2.5% to 15.8% in nine months. Across three United States " +
            "recessions in thirty years, 88% of routine job losses fell inside a twelve-month " +
            "window around the downturn. Those jobs never came back. Employers have prepared a " +
            "reorganisation and are waiting for a reason to carry it out.",
        s2: "A downturn arrives and the cuts land in a single quarter. Employers dismiss the " +
            "people whose work the machines already do, and present the decision as a response " +
            "to demand. Claims processing, scheduling, translation, first-line support and " +
            "routine drafting empty together. Recovery restores the output and leaves the posts " +
            "closed, the firm having learned during the downturn that it ran without them. " +
            "Redundancy notices arrive as news, though the substitution behind them had been " +
            "finished for years.",
        s3: "The lost wages come out of household spending first. The clerks who lost their " +
            "salaries stop eating out, defer dental work and keep their cars another two years. " +
            "Restaurants, dentists, car dealers and builders in the same towns then cut their " +
            "own staff. The economists Autor, Dorn and Hanson found the American commuting " +
            "zones most exposed to Chinese import competition still carrying depressed wages " +
            "and participation long after the import surge ended. Vacancy counts recover on " +
            "their usual schedule, in other occupations and other towns. A national recovery " +
            "therefore leaves particular districts behind it for a generation.",
        s4: "Governments transfer income directly to households in order to hold demand up. " +
            "Alaska has paid an annual dividend from its sovereign fund to every eligible " +
            "resident since state law created it. The United States sent direct payments to " +
            "most households under the CARES Act. Wages carry a shrinking share of the tax " +
            "base, pushing treasuries toward corporate profit, capital gains and consumption. " +
            "The revenue they now depend on sits with owners who can move it between " +
            "jurisdictions in an afternoon.",
        s5: "Health cover, pensions and mortgage lending in the United States all run through " +
            "an employer. Households living on transfers fall outside all three, whatever the " +
            "payment is worth. Lenders decline a thirty-year mortgage against an income a " +
            "legislature can vote away, leaving property to pass by inheritance. Research on " +
            "involuntary job loss finds effects on health, family formation and mortality that " +
            "survive the replacement of the earnings. Populations made materially secure carry " +
            "losses that no payment reaches.",
        s6: "Paid employment has stopped distributing income and continues to distribute " +
            "standing. Most household income arrives by inheritance and government transfer, " +
            "the two channels a person cannot earn into. The United States Bureau of Economic " +
            "Analysis values the unpaid care of children, of the sick and of the old at roughly " +
            "a quarter of measured output. No government has secured the financing, which rests " +
            "on taxing returns that move easily between jurisdictions. Whether the displaced " +
            "cohort carried a permanent loss, or whether those entering afterwards found a " +
            "labour market already reorganised, stays unsettled." },
  E1: {
        s1: "Paying customers now cover the cost of the computing build-out. The four largest " +
            "United States cloud providers guided to roughly $725 billion of combined capital " +
            "expenditure for the year, against roughly $410 billion the year before. Operating " +
            "cash flow funds most of that sum. No lender therefore decides whether the next " +
            "data centre gets built. Because the ten largest members of the S&P 500 carry more " +
            "than a third of the index by weight, ordinary retirement savings depend on that " +
            "revenue holding.",
        s2: "Buyers keep spending because the purchase repays itself out of wages they no " +
            "longer owe. Finance directors book the saving from a replaced clerical shift in " +
            "the quarter they sign the contract. The errors that shift used to catch surface " +
            "later, charged to a different department. Demand of that kind holds through an " +
            "interest-rate cycle, since the return never depended on borrowing cheaply. " +
            "Providers commit to new sites years ahead of the load, confident the buyers will " +
            "still be there.",
        s3: "Electricity now sets the pace of the build-out. Builders add computing only as " +
            "fast as power companies deliver connections, a queue that takes years to clear. " +
            "When the Lawrence Berkeley National Laboratory last measured the sector, United " +
            "States data centres consumed about 4.4% of national electricity; that laboratory's " +
            "projections reach 12%. Growth on guidance carries consumption to the upper end of " +
            "that range and past it. State public utility commissions, the bodies approving " +
            "what households pay for power, therefore hold the schedule of the build-out.",
        s4: "Governments now buy computing the way they buy electricity. Health services, tax " +
            "authorities and defence ministries run their core work on capacity rented from a " +
            "few providers, and nothing they own reaches that scale. Ministries writing rules " +
            "for one of those providers also need it to keep the hospitals running. Cheaper " +
            "public services reach every household, the profits reach the minority who own " +
            "shares, and the wages those savings came out of were the income of the majority. " +
            "Spending on computing therefore transfers income upward while the service it buys " +
            "improves.",
        s5: "The physical stock outlives the returns that justified it. Fibre-optic cable laid " +
            "in the telecommunications build-out of the late 1990s stayed mostly unlit, with " +
            "estimates putting the lit share below a tenth long after the crash. The same glass " +
            "later carried streaming video and cloud computing at a cost recovered from nobody " +
            "who laid it. Frontier computing repeats that history. Capability bought for " +
            "hundreds of billions reaches governments, universities and firms that spent " +
            "nothing on reaching it.",
        s6: "The build-out ended as a transfer from the investors who financed it to the users " +
            "of what it produced. Computing is now as ordinary as electricity, priced by the " +
            "hour and bought without a board decision. Its owners are a few firms whose " +
            "customers include the governments writing their rules. Whether any public " +
            "authority builds capacity of its own, or keeps renting, is the question the whole " +
            "period leaves unsettled." },
  E2: {
        s1: "The price of a fixed level of capability falls faster than the cost of producing " +
            "it. Epoch AI, which tracks the economics of machine learning, measures a fortyfold " +
            "annual fall for a set standard of performance on graduate science questions. " +
            "Equivalent output sold near $20 per million tokens at the frontier and near $0.40 " +
            "once competitors matched it. Inference, the computing spent answering users, has " +
            "reached roughly two-thirds of all AI computing against about a third earlier in " +
            "the cycle. Sellers must therefore move volume as fast as the price falls merely to " +
            "hold revenue level.",
        s2: "Prices collapse as soon as a rival matches a level of capability. Published " +
            "weights carry no protection; removing their safety fine-tuning costs minutes and " +
            "cents. Last season's frontier settles near the cost of the electricity it burns. " +
            "Revenue moves away from the model itself and toward whoever holds the customer, " +
            "the licence or the data.",
        s3: "The fall stops where mistakes are expensive. Cheap capability reaches medicine, " +
            "law and audit quickly, then halts wherever a mistake becomes expensive. Insurers " +
            "drew that line themselves, writing generative-AI exclusions into the standard " +
            "liability policies United States firms buy. Hospitals and practices that let " +
            "machines work unsupervised now pay their own claims. Margin migrates to whoever " +
            "signs for a result, and the licence earns what the model stopped earning.",
        s4: "The firms training models buy what nobody can copy. They merge with electricity " +
            "suppliers and with the holders of clinical and court records. Because reproducing " +
            "a power station or a national clinical archive takes far longer than reproducing a " +
            "model, price follows the scarcity. Buyers of machine work deal with a shorter list " +
            "of suppliers each year. Competition survives in capability and disappears in " +
            "everything capability runs on.",
        s5: "Relative prices invert across the economy. Anything a machine produces falls " +
            "toward its electricity cost, including text, code, images and routine diagnosis. " +
            "Goods needing a body, a place or a signature rise: housing, care, the skilled " +
            "trades, and the licensed hours that carry liability. Households live one period as " +
            "deflation in what they consume at a screen and inflation in what they consume in a " +
            "room. The two move together, because money released by the first is spent on the " +
            "second.",
        s6: "Cognition has grown durably cheap, although the gain sits outside the firms that " +
            "produced it. Users, holders of licences and land, and owners of data nobody else " +
            "has keep the surplus. Each step at the frontier costs more than the last. The most " +
            "recent one returned what a regulated utility returns, a rate that supports a bond " +
            "issue and no research programme. Who finances the next advance is the question " +
            "nobody has answered." },
  E3: {
        s1: "Borrowed money funds most new computing capacity. The largest supplier of " +
            "accelerators fell about 5% on a report that it was guaranteeing up to $250 billion " +
            "of a customer's financing. That arrangement ties the value of the supplier to " +
            "credit extended to its own buyer. Pension funds and insurers hold much of the debt " +
            "behind the build-out. A repricing therefore reaches household savings before it " +
            "reaches any data centre.",
        s2: "Credit reprices first and equity follows. Lenders who advanced money against the " +
            "resale value of accelerators discover what used equipment fetches when every owner " +
            "sells at once. Shareholders take the loss. The buildings, substations and cooling " +
            "plant pass to new owners at a fraction of what they cost. The market has revealed " +
            "that it priced the financing above the technology.",
        s3: "Construction continues through the reset. Cancelling a place in the " +
            "interconnection queue, a turbine order or a building contract costs more than " +
            "seeing each through, since all were committed years in advance. Computing " +
            "therefore becomes cheap while money becomes dear, an inversion of the ordinary " +
            "business cycle. British railway share prices peaked in 1845 and had fallen roughly " +
            "85% by 1850; route mileage built in Britain more than tripled between 1843 and " +
            "1852. Deployment accelerates through the collapse for the reason it did then.",
        s4: "Operators who bought capacity at a fraction of its build cost now own it. " +
            "Written-down capital makes running that capacity profitable at prices the original " +
            "owners could never have charged. Tutoring, translation, imaging review and code " +
            "maintenance grow cheaper for the public in the same period that employment in the " +
            "sector falls. Frontier training lost its financing in the same write-down. The new " +
            "owners sell hours on machinery they did not build.",
        s5: "Public budgets are the beneficiaries nobody planned for. Health services, school " +
            "systems and universities buy the discounted capacity, carrying machine diagnosis " +
            "and tutoring into state provision at a price no minister could have met before. " +
            "Because written-down plant is cheapest to run continuously, electricity demand " +
            "keeps climbing through the collapse. Household tariffs stay at the level the " +
            "build-out set. Pensioners paid for the computing that now runs the schools and the " +
            "clinics.",
        s6: "Ownership changed hands and the capability stayed intact. Construction and grid " +
            "connection set the schedule throughout; the investors who financed the work " +
            "carried the losses, as they did in the railway and telecommunications build-outs. " +
            "Lenders now refuse terms for building on that scale again. Two questions stay " +
            "open: whether private capital returns for a second push, and which budgets carry " +
            "the work while it stays away." },
  E4: {
        s1: "Lenders and boards stop paying before the revenue arrives. Epoch AI measures the " +
            "training cost of the largest models doubling about every eight months, faster than " +
            "any physical constraint binds. Finance committees therefore re-approve each " +
            "frontier programme inside every budget cycle. A single refusal ends a run that no " +
            "other budget line can pick up. Decisions to stop spending change the trajectory " +
            "before fabrication plants, grid connections or data sets do.",
        s2: "Users notice first that capability stops improving. Falling prices and rising task " +
            "length had both followed new capacity and new research spending. The halt " +
            "registers as a plateau, the same assistant at the same price for the length of the " +
            "freeze. Laboratories cut discretionary work ahead of contracted work. Safety " +
            "evaluation, interpretability research and third-party auditing go first.",
        s3: "The supply chain absorbs the cut and takes longer to restart than to stop. " +
            "Advanced packaging and leading-edge fabrication run on multi-year commitments, " +
            "with a first production line taking roughly eighteen to twenty-four months to " +
            "qualify. Cancelled orders therefore remove capacity that a later change of mind " +
            "restores slowly. Electricity systems carry the other half of the cost. Generation " +
            "and transmission approved for load that never arrives leave stranded cost for " +
            "state utility commissions to divide between shareholders and households.",
        s4: "Government becomes the marginal buyer of frontier computing. Defence ministries, " +
            "national laboratories and health services fund the runs no commercial case " +
            "supports. Each appropriation names the purpose it was voted for, which fixes the " +
            "questions researchers may ask. Capability settles below the level at which systems " +
            "improve themselves. States with the deepest fiscal capacity hold a lead the " +
            "private market had spread more widely. Budget committees now settle who reaches " +
            "the strongest systems in the world.",
        s5: "The freeze spreads the technology wider than the boom did. Attention moves from " +
            "training to deployment. Capability already built reaches the schools, clinics, " +
            "courts and small firms the earlier period passed over. Measured displacement of " +
            "work therefore continues while capability stands still. As the frontier " +
            "laboratories thin, their researchers take posts in universities, hospitals and " +
            "manufacturers, where they teach the courses and build the in-house teams those " +
            "employers had done without.",
        s6: "Capability advanced slowly and spread widely after capital withdrew. The largest " +
            "training runs lost their financiers. Nobody can say whether the frontier stalled " +
            "because the money stopped or because the method had reached its limit. Separating " +
            "those two explanations requires training runs larger than any the freeze financed. " +
            "The evidence therefore arrives only when the money does." },
  E5: {
        s1: "Machine work now reaches the occupations whose wages carry consumer demand. The " +
            "top tenth of United States earners account for about 49% of consumer spending, the " +
            "highest share on record. Employment for the youngest workers in exposed " +
            "occupations has fallen about nineteen percent. Firms have stopped opening the " +
            "junior posts where that work was learned. The experienced staff who now check the " +
            "machine's output keep their jobs. Demand across the economy therefore rests on the " +
            "incomes of a narrow group that automation has begun to reach.",
        s2: "Firms install the technology in a downturn rather than a boom. Across three United " +
            "States recessions in thirty years, 88% of job losses in routine occupations fell " +
            "inside a twelve-month window around the downturn. None of those jobs came back. " +
            "Managers defer the reorganisation while orders are strong and carry it out when " +
            "they fall. Labour markets that had looked stable change in the space of two or " +
            "three quarters.",
        s3: "The revenue funding the build-out is consumer-facing. Advertising, subscriptions, " +
            "retail and consumer credit buy most of the capacity. Their customers are the " +
            "households whose earnings the same technology reduced. Capital expenditure " +
            "therefore rested on consumption forecasts its own deployment invalidated. " +
            "Contagion runs through the lenders who financed capacity against those forecasts " +
            "and through the equity held in retirement accounts.",
        s4: "Public income support becomes permanent. The wage taxes funding it shrink with the " +
            "payroll they draw on. Tax bases diverge by region, because what remains to tax is " +
            "capital and consumption. Capital moves between jurisdictions; the displaced stay " +
            "where housing, family and occupational licences hold them. The places carrying the " +
            "most need collect the least.",
        s5: "Prices rise fastest in what displaced households cannot avoid buying. Rent, care " +
            "and schooling each require a person in a room. Those items take a growing share of " +
            "a shrinking wage. Care work, the trades and in-person services absorb the " +
            "displaced. Earnings there rise as office pay falls, because the buyer of an hour " +
            "of nursing must have the nurse in the room.",
        s6: "The technology raised output and reduced the number of people holding a claim on " +
            "it. Falling household earnings became losses for the lenders who had financed the " +
            "build-out. The institutions connecting income to work absorbed a shock they were " +
            "built for at a far smaller scale. Legislatures still argue over what should " +
            "replace the wage as the channel to households. No population has yet held a " +
            "durable claim on national output detached from employment." },
  G1: {
        s1: "The gains that arrive first are the ones needing no purchase, no permit, no plant " +
            "and no trial. An intergovernmental forecasting centre put a machine-learned model " +
            "into daily operations and its ensemble that July, cutting medium-range error " +
            "between five and fifteen percent against the physics model and five-day cyclone " +
            "track error from 370 kilometres to 230. Riverine flood prediction now runs to five " +
            "days at about 1,800 sites in more than 150 countries, reaching roughly 460 million " +
            "people, in basins where the previous system managed a nowcast. The ordering is set " +
            "by whether a delivery channel already exists, and the poorest countries are early " +
            "rather than last.",
        s2: "National meteorological services train their own warning models on a framework " +
            "opened for that purpose in June 2026, so the capability stops being one " +
            "institution's product. Chest-radiograph triage for tuberculosis, recommended since " +
            "2021 with four to eight recommended products by June 2025, runs in districts with " +
            "no radiologist, against 2.4 million cases that went undiagnosed in 2024. Compute " +
            "cost for each forecast has fallen three to four orders of magnitude, which is what " +
            "puts a national service inside the price. What travels is the output, not the " +
            "machine that made it.",
        s3: "Institutions that buy risk reprice it. Insurers cut flood and windstorm premiums " +
            "in basins that gained warning time, and ports, grid operators and airlines rewrite " +
            "contingency contracts around two extra days of notice. Disaster agencies begin " +
            "evacuating on model output alone, because an extra day of warning is worth more " +
            "than a confirmation that arrives too late to act on. The forecast has become an " +
            "input other people's contracts are written against.",
        s4: "Deaths from cyclones and floods fall in the countries that have warning and no " +
            "defences, while losses to property hold, because a warning moves people and leaves " +
            "buildings where they are. The World Meteorological Organization records early " +
            "warning covering most of the world's population for the first time. Agriculture " +
            "ministries in low-income countries buy no computing of their own and take " +
            "forecasts as a public feed. This gain reaches the poorest countries first, which " +
            "no other gain from these systems does.",
        s5: "One or two institutions supply the forecasts most governments now depend on, and " +
            "no state has funded an alternative. Crop insurance in West Africa pays out on a " +
            "forecast rather than an assessor's visit, weeks before a harvest fails, which " +
            "changes who can borrow against next season. Meteorological agencies lose their " +
            "modelling staff and keep their observing networks, which the machine models still " +
            "need and nobody else maintains. Dependence on a free good is the exposure nobody " +
            "priced.",
        s6: "Warning arrived everywhere and medicine did not, so the gains most people can name " +
            "are the ones that needed no permission from anybody. A generation has grown up " +
            "with three days' notice of a flood, and the buildings behind that warning are " +
            "unchanged. Machine forecasts still need thermometers, buoys and balloons, and the " +
            "countries that never installed them read another country's readings. Whether that " +
            "counts as a benefit realised depends on who is asked." },
  G2: {
        s1: "The gains land where a rich health system already had a specialist to substitute " +
            "for and a route to pay for it. Screening programmes in Sweden and Germany read " +
            "mammograms with machine support and cut radiologist reading workload by 44 " +
            "percent, on two randomised read-outs rather than on a manufacturer's claim. The " +
            "United States device list held 1,524 authorised AI products at its March 2026 cut, " +
            "1,164 of them radiology. Three permanent payment codes for clinical machine " +
            "services existed in January 2026, which is the number that decides what a hospital " +
            "buys.",
        s2: "Health systems with an organised screening invitation gain most, because the " +
            "machine substitutes for a second reader they already employed and paid for. " +
            "Countries with no radiologist to replace gain nothing from a tool priced against a " +
            "radiologist's salary. Insurers in wealthy countries add machine reading to cover, " +
            "and the payment codes follow the specialties that already had them. The gate here " +
            "is a billing route, and a better model does not open one.",
        s3: "Cardiology, pathology and dermatology reach patients by the route radiology " +
            "opened, each cleared on equivalence to a device already sold. Waiting lists for " +
            "diagnostic imaging shorten in the countries that had waiting lists and stay absent " +
            "in the countries that never triaged at all. Hospitals in Nairobi run the same " +
            "model as hospitals in Munich and bill for none of it. The tool is the same " +
            "everywhere and the institution around it is not.",
        s4: "Detection rates rise where screening was already organised, and the distance " +
            "between health systems widens by the size of the gain. National health services " +
            "renegotiate consultant contracts around reading volumes that no longer need two " +
            "doctors. Medical schools in wealthy countries cut radiology training places, and " +
            "the shortage lands on the countries that had been exporting radiologists. A gain " +
            "concentrated in the best-funded systems is still a gain, and it is not the one the " +
            "reference text promised.",
        s5: "Wealthy systems reach the ceiling of what better reading can deliver, which is set " +
            "by who gets invited to be screened rather than by who reads the film. The " +
            "remaining difference in survival between countries is access, and no imaging model " +
            "changes who walks through a clinic door. Ministries in middle-income countries buy " +
            "screening programmes rather than models, because the invitation is the expensive " +
            "half. What limits the benefit is an organisational fact no capability improves.",
        s6: "Two generations of gains landed inside the health systems that were already the " +
            "best funded. The measured benefit sits with about a fifth of the world's " +
            "population and the distribution has been stable for decades. A tool that needed a " +
            "specialist to replace found specialists only where they already were. The " +
            "capability was general and its delivery never was." },
  G3: {
        s1: "The compressed-century claim lands, and it lands on the trial clock rather than " +
            "the model clock. One machine-designed medicine has published a 71-patient safety " +
            "trial whose lung-function figure was a secondary endpoint with no between-arm test " +
            "and confidence intervals that overlap. Its pivotal trial enrols 320 patients " +
            "across 47 Chinese centres, doses for 52 weeks and completes in 2029. No medicine " +
            "whose discovery is attributed to a machine holds a marketing authorisation " +
            "anywhere in the world.",
        s2: "Regulators approve the first medicines whose target and compound both came from a " +
            "machine, between 2030 and 2033. Chinese agencies clear the first of them, because " +
            "the pivotal trials ran in Chinese hospitals under Chinese recruitment. The " +
            "candidates now in early trials arrive behind the first as a cohort rather than " +
            "singly, which is what turns one approval into a class of them. Discovery " +
            "compressed to twelve or eighteen months and the road to a prescription stayed near " +
            "a decade.",
        s3: "Recruitment is the binding step, and hospitals compete for the nurses who can " +
            "enrol patients. Sponsors push more candidates into a funnel whose length has not " +
            "changed, so failures arrive faster than approvals and the failure rate becomes the " +
            "visible statistic. Regulatory agencies hire reviewers with computational training, " +
            "and assessment times lengthen before they shorten. Every step that got faster was " +
            "inside the laboratory and every step that did not was outside it.",
        s4: "Disease-specific mortality moves for one or two conditions in high-income and " +
            "upper-middle-income countries, the first population statistic anywhere that a " +
            "machine can be credited with. Patents on machine-designed molecules concentrate in " +
            "a handful of sponsors, and generic entry sits a decade behind. Health ministries " +
            "in poorer countries buy the new medicines late and at the price the first market " +
            "set. The benefit is real, measurable and unevenly distributed on the ordinary " +
            "terms of the pharmaceutical trade.",
        s5: "The mortality series bends for a group of rare diseases no sponsor would " +
            "previously have funded, because the cost of finding a candidate fell below the " +
            "cost of ignoring a small market. Trial design becomes the scarce skill, and the " +
            "organisations that run trials charge more than the discovery ever cost. Regulators " +
            "publish outcome data on machine-designed medicines, and the first head-to-head " +
            "comparisons against conventional ones appear. What is scarce has moved twice, and " +
            "never to the place a capability forecast would have put it.",
        s6: "The medicines arrived and took thirty years, which is what a trial clock costs " +
            "once the discovery clock stops mattering. Life expectancy in the countries that " +
            "ran the trials rose by a measurable fraction of a year, on a handful of conditions " +
            "rather than across the board. The bottleneck moved from finding a molecule to " +
            "finding the patients who can prove it works. The reference text was right about " +
            "the direction and wrong about the duration by a factor of three." },
  G4: {
        s1: "The capability gains are enormous, real and audited, and they are captured as " +
            "throughput by whoever owns the computing and the instruments. Laboratories run " +
            "more experiments for each researcher they employ, and formal proofs, " +
            "chip-scheduling heuristics and simulation cycles all improve together. None of it " +
            "crosses a trial, a payment code, a plant or a border. Here the two facts the " +
            "reader found incoherent stop being in tension, the machines improving while nobody " +
            "outside is better off.",
        s2: "A laboratory's internal research output doubles while its published output does " +
            "not, because publication is a cost and internal use is a return. Semiconductor " +
            "design cycles shorten by months, and the saving lands with the four firms that " +
            "design at that scale. Universities cannot match the instrument access and their " +
            "share of published results falls, which removes the outside check on what the " +
            "gains are. The compounding is inside the building and so is every measurement of " +
            "it.",
        s3: "The measured gains are throughput figures their owners report and no outside body " +
            "verifies. Nothing that clears a trial, a payment code, a plant or a border shows " +
            "the improvement, so the public statistics carry no trace of it. Contract " +
            "laboratories run the experiments the machines commission, and their order books " +
            "are the only external record that any of this is happening. What can be checked " +
            "and what is happening have come apart.",
        s4: "Statistical agencies find no productivity movement outside the sector that " +
            "produced the capability, which is the finding the argument then turns on. The " +
            "distance between what the systems can do and what anyone receives is the largest " +
            "unmeasured quantity of the period, and no body publishes it. Governments fund " +
            "public computing to break the enclosure, and the instruments stay where they were, " +
            "because computing was never the scarce half. An enclosure of capability is what " +
            "happens when the gains are spent as inputs to more of the same work, inside the " +
            "laboratories that hold them.",
        s5: "Two decades of compounding sit inside a dozen organisations, and the outside " +
            "record shows a rising electricity bill. Legislatures write disclosure duties for " +
            "internal capability, and the returns describe throughput that no auditor can " +
            "price. The countries hosting the computing tax the electricity and cannot tax the " +
            "gain, because the gain never takes the form of a sale. Tax law reaches " +
            "transactions, and this is not one.",
        s6: "The capability was real, was deployed and was captured, and the population " +
            "statistics never moved. Historians of the period read internal cycle-time series " +
            "because no public series recorded it. What the machines produced belonged to " +
            "whoever owned the instruments they ran on, which is the oldest arrangement in " +
            "industrial history and the one nobody predicted here. The forecast that got the " +
            "capability right got the beneficiary wrong." },
  G5: {
        s1: "Deployment is broad, the tools do what they claim, and the measured net on the " +
            "receiving side is flat or negative. Clinicians using machine support lose the " +
            "skill it replaced, and detection falls when the tool is withdrawn. Experienced " +
            "developers work more slowly with machine assistance than without it, against their " +
            "own expectation of the opposite. The same output helps a reader who can judge " +
            "which part to act on and misleads one who cannot.",
        s2: "Measured net effects come out flat in the settings with the broadest deployment, " +
            "which is where the effect should have been easiest to see. Error rates fall on the " +
            "cases a tool was tested against and rise on the ones it was not, so the aggregate " +
            "depends entirely on the case mix. Hospitals that removed the second reader report " +
            "more missed cases two years later. None of these three mechanisms is repaired by a " +
            "better model.",
        s3: "Whoever could already judge the output gains from it, and whoever could not loses " +
            "ground, so the tool stratifies the workforce it was bought to level. Professional " +
            "bodies restore a human step the evidence says the machine performs better, because " +
            "the ledger says otherwise. Insurers price lost skill into malpractice cover, and " +
            "premiums rise for the institutions that automated most. The argument stops being " +
            "about capability and becomes about what a person beside the machine turns into.",
        s4: "Population health statistics show no improvement in the countries that deployed " +
            "earliest, which is the comparison that settles the question. Regulators require a " +
            "withdrawal test before authorisation, measuring what happens when the tool is " +
            "taken away rather than what happens when it is added. Training programmes rebuild " +
            "the skills the tools replaced, at a cost nobody had budgeted for. The evidence " +
            "arrived late and it arrived against the direction everyone assumed.",
        s5: "The measured net across two decades of deployment is close to zero, and the " +
            "spending was not. Public argument about AI turns on evidence rather than on " +
            "prediction, for the first time since any of this began. Ministries fund the " +
            "comparisons industry never ran, and the findings come back mixed rather than " +
            "damning. A negative ledger is not a failure of capability, which makes it the " +
            "hardest result to act on.",
        s6: "The tools worked, the people beside them changed, and the two effects cancelled. A " +
            "generation of clinicians trained with the support and cannot practise without it, " +
            "which converts a convenience into a dependency. The measured benefit landed with " +
            "the institutions that kept a trained person in the loop and paid for the training. " +
            "What the period established is that a capability and a benefit are different " +
            "quantities." },
  G6: {
        s1: "Deployment is wide, authorisation is routine, spending is large, and no apparatus " +
            "exists that could say whether anyone is better off. Of 1,524 authorised AI " +
            "devices, 1,466 cleared on equivalence to a product already sold rather than on a " +
            "patient outcome, and 39 came through the route that asks for one. No regulator " +
            "maintains a category for machine-discovered medicines, so the count of them is " +
            "whatever a trade tracker says it is. The cheapest route to market generates no " +
            "outcome evidence, so almost nobody generates any.",
        s2: "Health services spend on machine systems two orders of magnitude more than they " +
            "spend evaluating them. Nobody bills for evidence production, so nobody funds it, " +
            "and the regulatory route actively substitutes away from it. Deployment is wide and " +
            "authorisation is routine, and the question of benefit has no instrument pointed at " +
            "it. The gate here is evidence production and it is the one gate no capability " +
            "opens.",
        s3: "Parliamentary committees ask for the outcome data and are told it was never " +
            "collected. The trials comparing machine and conventional practice are run by the " +
            "sponsors and read by the sponsors, which is the arrangement every other regulated " +
            "industry abandoned. Registries record which system was used and not what happened " +
            "to the patient. A procurement record is not a health record and cannot be turned " +
            "into one afterwards.",
        s4: "Health economists estimate the benefit from process measures, because no outcome " +
            "series exists to estimate it from. Two governments reach opposite conclusions from " +
            "the same deployment and no experiment can settle it, so the dispute passes to " +
            "ministers. Insurers write cover on claims history, which is the only outcome " +
            "record anyone kept and was kept for another purpose. The forecast cannot resolve " +
            "this because the world did not.",
        s5: "Statutes require outcome reporting after sale, and the first returns arrive a " +
            "decade after the deployment they describe. The evidence gap is itself the finding, " +
            "and it is the one thing the record establishes firmly. Public trust turns on an " +
            "argument that cannot be settled with data that neither side collected. A " +
            "measurement started late can only look forward, which leaves the whole deployment " +
            "period unassessed.",
        s6: "Decades of deployment left a procurement record and no health record. What the " +
            "machines did for people is a matter of belief, which is what it was at the start, " +
            "after the largest technical programme in history. The apparatus for measuring " +
            "benefit was built last and it can only look forward. The question of what any of " +
            "it did for people went unanswered, because nobody built the apparatus that could " +
            "have answered it." },
  K1: {
        s1: "Machines take over production coding and the research that improves them inside " +
            "the same year. One United States frontier laboratory recorded a code-optimization " +
            "task moving from roughly threefold speedup to fifty-twofold between two of its own " +
            "measurements. A skilled engineer reaches fourfold on that task in a working day. " +
            "The Digital Omnibus on AI, in force from 2026-07-27, deferred the European Union's " +
            "duties for standalone high-risk systems to 2027-12-02. Legislatures that expected " +
            "to meet these two capabilities in separate sessions meet them in one, both inside " +
            "that deferral.",
        s2: "Firms that already run large training clusters take the gain, and everyone else " +
            "buys access from them. Legislatures pass nothing during the deferral, leaving " +
            "liability insurers and courts to decide how far firms may let machines act " +
            "unsupervised. Underwriters and judges write the governing terms one dispute at a " +
            "time, with no legislature voting on them. Patients and benefit claimants appear in " +
            "neither forum, and the rules bind them all the same.",
        s3: "Machines carry the advantage out of software into every field whose claims a " +
            "computer can settle. Cryptanalysis, chip layout, materials search, protein " +
            "structure and the pricing of credit and insurance move first. Machine-designed " +
            "medicines still enter clinical trials whose median run from first human dose is " +
            "more than eight years. Research therefore runs at two speeds; the fast one belongs " +
            "to whatever a computer can check without a body, a reactor or a field.",
        s4: "Insurers underwrite only the systems their own engineers have tested. Because " +
            "certifying one system consumes most of an underwriter's technical capacity, each " +
            "insurer certifies a handful and no more. Hospitals, courts and utilities that need " +
            "cover buy from that short list, and a defect in one certified system appears in " +
            "all of them at once. Supply contracts now carry weight that defence agreements " +
            "once held, because losing a supplier removes a state's analysis, its medicine and " +
            "its border screening together. Sovereign computing funded from national budgets " +
            "answers that exposure late and costs a visible share of those budgets.",
        s5: "The junior work that trained engineers, lawyers and radiologists automated first. " +
            "Firms stopped hiring at the bottom. The people who learned to check machine output " +
            "before the arrival are the only ones who ever learned it. That population has " +
            "thinned as it aged, and no institution has replaced the apprenticeship that made " +
            "it. Fewer people can audit the systems everyone now depends on.",
        s6: "Short deliberation bought a large material gain. This arrival delivered " +
            "treatments, materials and energy sources that a slower one would have reached " +
            "later. Few hands wrote the arrangements governing them, and wrote them under time " +
            "pressure. Whether the concentration erodes as methods diffuse is one open " +
            "question, since distillation, published weights and independent replication have " +
            "eroded earlier leads. Whether states recover the capacity to judge the systems " +
            "they depend on is the other." },
  K2: {
        s1: "Machines write most production code, and researchers still set the direction of " +
            "the work that improves them. METR's RE-Bench found agents outscoring human experts " +
            "fourfold on short task budgets and human experts outscoring agents twofold on long " +
            "ones. Because the advantage inverts with task length, the second capability lags " +
            "the first. That lag hands governments one full legislative round of warning.",
        s2: "The statutes written in that round bind the capability their drafters could " +
            "observe. California's Transparency in Frontier Artificial Intelligence Act and the " +
            "European Union's transparency duties for generative systems, applicable from " +
            "2026-08-02, require documentation and incident reporting. Executive Order 14365 of " +
            "2025-12-11 set federal agencies toward a single national framework and directed " +
            "litigation against the state statutes, of which 109 remain in force. Each of these " +
            "defines a model as a version placed on a market at a moment. Firms in regulated " +
            "sectors deploy at the pace of their documentation; the occupations most reshaped " +
            "are the software and clerical trades legislators could watch while drafting.",
        s3: "Auditors finish an audit more slowly than developers rebuild the system; every " +
            "report describes a version that has already been replaced. Regulators stop " +
            "approving artefacts and start licensing continuing operation, on the pattern of " +
            "aviation and nuclear power. States apply their rules to models trained abroad and " +
            "rest the enforcement on the developers' own declarations. A declaration is worth " +
            "what the declaring party stands to lose, which for a developer outside the " +
            "jurisdiction is access to one market.",
        s4: "Licensing has settled on the operator, with permission attaching to running a " +
            "system under stated conditions and continuous monitoring. It raises the fixed cost " +
            "of frontier operation to a level only large organisations meet, entrenching the " +
            "firms already there. It creates a control lever with reach well past safety, " +
            "because the power to suspend a licence serves whatever purpose its holder chooses. " +
            "The holders are arms of governments carrying trade and foreign policy interests.",
        s5: "Each jurisdiction deliberated on its own. Firms selling into several of them build " +
            "to the strictest rule they face and carry the cost of the others in paperwork. " +
            "Training concentrates where the rules ask least, and expertise follows the " +
            "training. The states with the strictest rules are therefore the least able to test " +
            "what they govern. Systems sold worldwide meet the strictest rule of all, which " +
            "leaves a few legislatures setting the behaviour of machines used everywhere. " +
            "European data protection came to set the terms of the internet by the same route.",
        s6: "The transition was governed because the two capabilities arrived far enough apart " +
            "for statutes, courts and elections to work on the first before the second came. " +
            "The interval was paid for in delay, in treatments, materials and productivity that " +
            "a compressed arrival would have delivered sooner. Countries govern these systems " +
            "where they are used and understand them where they are built. Verification would " +
            "put a foreign inspector inside a training site, and no government has yet asked " +
            "another for that. Whether jurisdictional divergence hardens into separate " +
            "technical spheres running separate systems stays open. So does whether permission " +
            "tied to licensed operators holds once frontier capability becomes cheap enough to " +
            "run outside licensed operation." },
  K3: {
        s1: "Machines write most production software and the research improving them stays " +
            "partly human. One United States frontier laboratory reports machines authoring " +
            "more than four-fifths of the code merged into its own systems. Its researchers " +
            "report a median output multiplier of four, against the twentyfold gain that would " +
            "mark the research loop closed. Automated systems post-training other models score " +
            "between 25% and 28%, against 51% for the humans doing that work. The first " +
            "capability arrived and the second did not follow.",
        s2: "Small organisations can now afford custom software. Clinics, town councils and " +
            "machine shops commission the systems they need. Their paper records set the limit, " +
            "since a system can act only on what somebody entered. The gains land where the " +
            "data was already clean, and the rest of the work stays manual.",
        s3: "Medicine shows the distance between design and confirmation most plainly. " +
            "Molecules designed by machine clear first-in-human safety trials at eight or nine " +
            "in ten. They return about four in ten at the efficacy stage, the rate the industry " +
            "recorded before these methods existed. The machines improved the design, and " +
            "biology kept its own terms.",
        s4: "The occupations holding their value are the ones whose product is verified in the " +
            "world. Nursing, the building trades, field engineering and licensed inspection pay " +
            "more than desk work a machine can draft. Firms answer the bottleneck with a large " +
            "build-out of automated experiment: self-driving laboratories, high-throughput " +
            "biology and materials foundries running continuously. Whoever owns validation " +
            "capacity occupies the place the software firms held earlier. That capacity is " +
            "fixed in geography, tied to grids, water and permits, and open to capture by the " +
            "states that host it.",
        s5: "Research fields divide by the cost of their evidence. Mathematics, cryptography " +
            "and parts of chemistry settle their questions as fast as they raise them. " +
            "Nutrition, ecology and psychiatry accumulate plausible untested claims that " +
            "clinicians and regulators must act on regardless. These systems have become " +
            "ordinary equipment in medicine and administration, where a single failure now " +
            "closes clinics and council offices. As capability plateaus and public alarm " +
            "subsides, the money for watching frontier systems goes elsewhere.",
        s6: "Machines now design far more candidates than laboratories can test. Progress ran " +
            "fast wherever a claim could be settled by computation and slow wherever it had to " +
            "be settled in bodies, ecosystems and the electrical grid. The gains are uneven " +
            "across fields, in a pattern the early expectation of general acceleration missed. " +
            "Whether the loop that produces better machines ever closes remains to be shown. So " +
            "does whether automated experiment lifts the physical limit and starts the whole " +
            "progression again on different terms." },
  L1: {
        s1: "On February 2026 a United States frontier laboratory refused a government demand " +
            "for unrestricted lawful military use, naming mass domestic surveillance and fully " +
            "autonomous weapons as its exclusions. A court granted it a preliminary injunction, " +
            "a month after the government designated it a supply-chain risk. On June 2026 it " +
            "pledged $200M for research and $150M in fellowships on labour displacement. The " +
            "same proposal asked legislators for mandatory third-party testing in four risk " +
            "categories, with government power to block or reverse a release. By July 2026 it " +
            "had given $40M to a bipartisan group lobbying for those rules.",
        s2: "Legislators write the testing duty these laboratories asked for. Accredited " +
            "evaluation becomes a condition of sale in the four risk categories, with each " +
            "evaluator publishing the thresholds a developer set. The first releases the regime " +
            "stops belong to the laboratories that drafted it. Competitors call the duty a " +
            "paperwork exercise until an evaluator blocks a release on a finding the developer " +
            "had already published. The laboratories that paid for the statute can now invoke " +
            "it against a rival.",
        s3: "Insurers price policies against the published thresholds. Developers that count " +
            "their own incidents give an underwriter something to rate. Corporate buyers copy " +
            "the two exclusions into their procurement terms, and a supplier that declines them " +
            "loses the contract. Economists paid by the fellowships supply the measurements " +
            "legislators cite in the labour statute that follows. The barred sales cost several " +
            "hundred million dollars once; the rules they bought bind every competitor since.",
        s4: "Systems begin proposing their own research, and these laboratories keep the choice " +
            "of problems with people. The laboratory files an affirmative case before each " +
            "capability step. The outside review body it lobbied for grants or refuses that " +
            "case, holding the rate of improvement in a stranger's hands. Self-improvement runs " +
            "inside named problems, the first of which are the measurement and alignment of the " +
            "systems themselves. Defensive security follows, on the published reasoning that a " +
            "laboratory should point a self-improving system only at what it can measure.",
        s5: "Developers beyond the statute's reach run their research loops on their own " +
            "authority and close the loop first. These laboratories offer to slow on condition " +
            "that rivals slow in a way an auditor can check. The checking tools arrive late, so " +
            "the offer lapses and the frontier keeps the pace of the developers who ignored the " +
            "offer. They hold their own results and publish evaluations, thresholds and " +
            "incident counts, telling a competitor what was found and when. Their answer is to " +
            "press for the same testing duty in one legislature after another.",
        s6: "Courts hold developers to the thresholds they published. Liability turns on " +
            "incident counts and evaluation results already on the record, making disclosure " +
            "the cheapest defence a developer can buy. The exclusions hold inside every " +
            "jurisdiction that legislated them. Displacement money that began as a research " +
            "fund and a fellowship becomes a statutory levy on the firms that deploy the " +
            "systems. The laboratories that paid for all of it sell less than their rivals and " +
            "write the terms those rivals sell under." },
  L2: {
        s1: "Federal agencies bought enterprise access at $1 each from August 2025, reaching " +
            "about 120 orders and roughly 3.4 million users. One laboratory signed a classified " +
            "agreement accepting all lawful purposes, amending it. An executive order created " +
            "up to thirty days of voluntary federal pre-release access, with a framework " +
            "finalised. A Commerce directive on 2026-06-12 suspended foreign-national access to " +
            "two deployed models, and the developer disabled them worldwide within hours. On " +
            "July 2026 a laboratory offered its home government a 5% passive stake worth " +
            "roughly $42.6B.",
        s2: "Government review replaces the published framework as the gate a release must " +
            "pass. Classified evaluation of cyber, biological and chemical capability produces " +
            "findings that stay inside the clearance. The thirty-day step accelerates a release " +
            "whenever officials believe the rival capital is moving faster, because the review " +
            "answers to the policy that funds the laboratory. One directive stops a deployment " +
            "inside a day; the same authority lifts the stop when policy changes. The public " +
            "learns what a system can do from the uses the government puts it to.",
        s3: "Capacity sold at prices near zero creates a dependence running both ways. " +
            "Ministries that handle cases, procurement and intelligence work on one vendor " +
            "cannot change supplier on an ordinary contract cycle. A state holding a passive " +
            "stake collects on the laboratory's revenue and carries its losses, turning a " +
            "corporate failure into a fiscal one. Officials secure the laboratory's chips, its " +
            "power and its cleared staff. The laboratory accepts every condition attached, " +
            "because the customer that keeps it supplied is the one customer it can never lose.",
        s4: "Systems that improve themselves arrive inside a cleared programme, and the " +
            "security apparatus chooses their problems. Defence, intelligence and " +
            "infrastructure security take the first capability, on the argument that another " +
            "government points its own systems at the same targets. Self-improvement runs " +
            "open-ended behind classification. A weaker public model ships some months behind " +
            "the cleared one, leaving commercial users with capability the state has already " +
            "surpassed. Legislators learn what the strongest systems can do in briefings that " +
            "stay classified.",
        s5: "Allied governments buy sovereign campuses and inherit the exporting state's " +
            "foreign policy with them. Every buyer notices when a directive in one capital " +
            "suspends a ministry's systems in another. Governments outside the alliance fund " +
            "their own developers until the world holds two or three separate stacks of chips, " +
            "models and rules. Capability arrives everywhere; the terms of access divide along " +
            "the alliance.",
        s6: "The state directs the laboratory through ownership, clearance and procurement. " +
            "Officials sit where the research budget is set. A clearance decides who may work " +
            "on the strongest systems. Citizens receive capability as a public service, " +
            "delivered through agencies at prices the treasury sets. Every refusal the " +
            "laboratory issues goes to a foreign customer, because the instructions come from " +
            "home." },
  L3: {
        s1: "A statement published July 2026 carried 1,378 frontier-company signatures, " +
            "including two chief executives, three chief scientists and two safety leads. It " +
            "asked for the technical and governance tools to pace automated AI development, and " +
            "two laboratories endorsed it corporately. One laboratory had published that it " +
            "expects to slow or pause once other frontier developers do so verifiably. Members " +
            "proposed a self-regulator on the securities model, with thirty days of pre-release " +
            "sharing and coordinated slowdown available. A joint safety fund of founding " +
            "members holds over $10M and gave more than $5M to eleven grantees in 2026.",
        s2: "The members fund the referee, staff it, and submit to its grades. Each member " +
            "shares a release with the body thirty days before launch. Twelve laboratories " +
            "already publish frontier safety frameworks, giving a reader one scale for " +
            "comparing them. The evaluators who grade the members draw their budgets from those " +
            "members, a dependence every reader of a grade weighs. A member that undercuts the " +
            "floor loses the pre-release access the others give each other, the sanction this " +
            "arrangement carries.",
        s3: "The grants buy the tools that make a shared floor checkable. One member can " +
            "confirm what another is running, so restraint becomes enforceable among the " +
            "signatories. A threshold moved at one laboratory moves at the others in the same " +
            "quarter, each citing the others doing it. A release slips at more than one " +
            "laboratory for one stated reason, the first public evidence that the arrangement " +
            "works.",
        s4: "Systems that improve themselves run inside an envelope the members negotiate. " +
            "Members write the ceiling as effective compute per unit time, audit it across the " +
            "membership, and move it by a vote no member carries alone. Self-improvement runs " +
            "open-ended under that ceiling. Capability goes first to the verification tools, " +
            "because the arrangement collapses the moment a member can cheat undetected. " +
            "Members hold results among themselves and publish summaries, leaving the world " +
            "outside to learn what was built months later.",
        s5: "The ceiling binds the laboratories that signed it. Developers who publish weights " +
            "answer to their own boards alone, and a cleared state programme answers to its " +
            "government. Each time an outsider crosses a threshold the members had agreed to " +
            "approach slowly, the vote to hold the ceiling grows harder. Competition " +
            "authorities open cases against an arrangement in which the largest suppliers agree " +
            "to limit what they produce. Admission becomes the club's sharpest instrument, and " +
            "the members spend to bring the largest outsiders in.",
        s6: "Governments adopt the inspection machinery the members built for each other. " +
            "Treaty negotiators need a way to check a limit. The members' auditors are the only " +
            "people who have entered a training cluster to verify one. The ceiling passes from " +
            "a members' vote to a legal instrument, leaving the laboratories their seats as the " +
            "parties who operate the measurement. Capability arrives on a schedule inspectors " +
            "set, and the laboratories that wrote the inspection rules answer to them." },
  L4: {
        s1: "Release schedule and revenue governed every choice these laboratories made in " +
            "2026. They announced consumer advertising, opened a self-serve platform and " +
            "expanded across Europe, against a stated target near $2.5B for the year. The " +
            "consumer price ladder went from two tiers to seven, adding an $8 tier beneath the " +
            "cheapest and splitting the top into $100 and $200 bands. Four leading developers " +
            "weakened or voided unilateral pause pledges between February and July 2026. Two " +
            "confidential registration statements landed and June 2026 at discussed valuations " +
            "from $1T to $2T.",
        s2: "Once these laboratories list, quarterly reporting reaches every decision they " +
            "make. Release dates move to fill quarters that would otherwise miss guidance. " +
            "Safety evaluation enters the accounts as a cost line with an owner and a budget, " +
            "reviewed against the revenue a delayed launch forgoes. Federal preemption arrives; " +
            "one national framework replaces the state statutes their political money opposed.",
        s3: "Thresholds move whenever a rival ships past them. One laboratory releases a " +
            "high-risk system, and its competitors invoke the clauses that let them adjust " +
            "their own requirements to match. Independent graders record each movement, and the " +
            "field's published grades fall further. Enterprise buyers compare price and " +
            "capability, so the grades change no purchase.",
        s4: "Self-improving systems take over the research agenda, and the laboratories point " +
            "them wherever measured output rises. Finance funds whichever direction raises " +
            "revenue per unit of compute. Development runs at full speed, limited by the price " +
            "of electricity and accelerators. The strongest capability goes to the highest tier " +
            "of customer, priced by what it earns. Coordination with rivals lasts as long as it " +
            "costs less than competing.",
        s5: "The federal framework these laboratories paid to have written becomes the only " +
            "venue where their failures are heard. Machine-directed failures in payments, " +
            "medicine and electricity reach courts and insurers first. Damages awards and " +
            "refused cover set the price of a release, which the laboratories carry as a cost " +
            "of trading. Underwriters write exclusions for autonomous operation, and the " +
            "largest customers demand warranties the laboratories decline to give. A halt " +
            "happens when the damages exceed what the release earns.",
        s6: "Capability sells by tier, and what customers can afford decides which systems " +
            "their banks, clinics and employers run. Advertising funds the cheapest tier, so " +
            "most people's assistants answer with placements sold at auction. Regulated " +
            "professions buy warranted deployments at the highest price, audited by the " +
            "insurers who wrote them. The stopping decision sits outside the laboratories, " +
            "split between underwriters, juries and legislators." },
  L5: {
        s1: "These laboratories publish the models themselves and argue that publication is the " +
            "safety measure. In most months of 2026 the largest open-weight model came from a " +
            "Chinese laboratory. Monthly parameter ceilings ran between 754B and 2.78T against " +
            "a United States ceiling below 130B in five of seven months. One developer " +
            "published a 2.8T-parameter model on 2026-07-27 under its own licence, with " +
            "permanent price cuts near $0.435 per million tokens. A letter opposing early " +
            "restrictions on open weights carried 77 company signatures and reached 150 within " +
            "days.",
        s2: "The licences carrying published model weights acquire terms. Revenue thresholds, " +
            "attribution clauses and use restrictions enter the documents, and the publisher " +
            "keeps the right to revise them. Builders who shipped products on a published " +
            "family find their permission conditional on a clause written after they started. " +
            "The ecosystem sits on the publisher's cloud, phones and platforms, where each " +
            "derivative sends its inference traffic back.",
        s3: "Many holders inspecting one model do catch failures a single company missed. " +
            "Independent researchers publish jailbreak taxonomies, fine-tuning attacks that " +
            "strip refusals for a few dollars, and audits of training data. Each finding " +
            "describes a model already installed in hospitals, universities and firms across " +
            "dozens of countries. A finding changes what people run only where a host chooses " +
            "to apply it. Governance therefore moves to whoever serves the inference and " +
            "whoever sells the accelerators.",
        s4: "Self-improvement runs simultaneously in many places, because every holder points a " +
            "published model at its own problems. Each holder sets its own agenda, and the work " +
            "proceeds at the speed of whoever is least cautious. The others follow a published " +
            "result within months, since the weights and the method arrive together. Cost and " +
            "efficiency get the first improvements, because the market belongs to whoever " +
            "serves tokens cheapest.",
        s5: "Governments enforce against the two things a publisher still needs. Governments " +
            "write accelerator registration, customer verification at inference providers and " +
            "hosting duties into statute, and drop the release step from it. Publishers outside " +
            "those jurisdictions keep publishing, so traffic routes to whichever country writes " +
            "the lightest hosting rule. The licence remains the one lever anyone holds, and " +
            "publishers revise it as their business requires.",
        s6: "Running a capable model costs about what running a database costs, and every " +
            "hospital, ministry and small firm runs one. Prosecutors pursue the people who " +
            "deploy stripped models for fraud, intrusion and impersonation, one case at a time. " +
            "The concentrated power left in the field belongs to the firms making accelerators " +
            "and the platforms serving inference. They decide who may run what, on terms no " +
            "legislature wrote." },
  L6: {
        s1: "These laboratories refuse the race framing and build systems bounded on purpose. " +
            "One announced superintelligence programme defined its object as problem-oriented " +
            "and domain-specific, and required containment and alignment in perpetuity. On " +
            "August 2026 a laboratory found that an unreleased model might meet the highest " +
            "cybersecurity tier of its own framework and held its largest planned training run. " +
            "It published the reason, disclosing monitoring at about 20% of the inference " +
            "compute being watched, with any alert unresolved after thirty minutes pausing the " +
            "activity. A two-tier release shipped by June 2026, routing a public model " +
            "alongside an unrestricted one held to vetted partners.",
        s2: "Underwriters price deployments whose bounds are written down. A stated scope, " +
            "capped autonomy and a monitoring budget give an actuary the terms a premium needs. " +
            "Open-ended agents reach the market uncovered, and their buyers carry the loss " +
            "themselves. Hospitals, grid operators and materials firms buy the covered systems, " +
            "since their own regulators require a policy behind the work. These laboratories " +
            "accept monitoring overhead and held runs as costs of the product and pass them " +
            "through in the price.",
        s3: "Laboratories that cap autonomy by design fall behind on general capability. Rivals " +
            "running open-ended agents take the broad commercial market, where buyers want one " +
            "system for every task. The bounded laboratories keep the customers whose " +
            "regulators demand a warranty, in medicine, energy, materials and defence supply. " +
            "Their revenue tracks the regulated sectors, and their compute spending grows more " +
            "slowly than the field's. Restraint here changes the market these laboratories " +
            "serve and leaves the frontier where it was.",
        s4: "People at these laboratories keep the research agenda and hand the systems named " +
            "problems. Each improvement cycle ends in re-containment and re-evaluation before " +
            "the laboratory authorises the next. Self-improvement stays inside one domain and " +
            "carries no permission into another. Progress arrives as a series of authorised " +
            "steps, each with a published evaluation behind it.",
        s5: "Legislatures and standards bodies write their rules from the evaluation records " +
            "these laboratories publish. Legislatures and standards bodies copy their " +
            "thresholds, their monitoring ratio and their alert timers into statute, because " +
            "these are the only published figures available. Firms that never accepted those " +
            "limits find them binding, and their compliance costs rise. The laboratories that " +
            "declined the frontier write the terms on which it operates.",
        s6: "Warranted systems run diagnosis, grid dispatch, molecule discovery and structural " +
            "design, with policies naming the scope of each. Free scientific resources, among " +
            "them a protein-structure database open to any researcher, come from the same " +
            "programmes and carry the same bounds. The uncovered market runs everything else, " +
            "faster and uninsured, and its failures land on the people using it. Patients and " +
            "consumers meet different machines, held to different evidence." },
  P1: {
        s1: "Most people use these systems at work, at school and in clinics, before any public " +
            "argument about them concludes. Gallup has measured 39% of United States adults " +
            "saying the technology does more harm than good and 79% expecting it to cut United " +
            "States jobs. Use climbed across the same years, because the systems arrived inside " +
            "products people had already bought. Salience stayed low throughout: Pew Research " +
            "Center found a third of those surveyed unsure which country leads the field. A " +
            "public that dislikes what it uses daily produces no candidate and no statute.",
        s2: "Objection reaches the public as a service complaint. Benefits, diagnoses and " +
            "school reports arrive through models. A person who disputes one is disputing a " +
            "decision rather than a technology. Article 50 of the European Union's Artificial " +
            "Intelligence Act, in force from 2 August 2026, requires that people be told when " +
            "they deal with a machine. Being told has proved compatible with going on using it.",
        s3: "The limit appears where a machine decides who gets money. Public offices settle " +
            "benefit eligibility, tax assessment and school placement by model. The demand that " +
            "follows is for a person to look again. For the systems listed in Annex III of the " +
            "European Union's Artificial Intelligence Act, whose duties apply from 2 December " +
            "2027, the high-risk regime supplies the standard courts apply. Human review " +
            "becomes the one demand uniting people who otherwise disagree about the technology.",
        s4: "Artificial intelligence has become a household utility. An outage stops clinics, " +
            "payrolls and courts on the same afternoon; continuity of service is now a public " +
            "safety question. Legitimacy comes from use. Consent rests in the accumulated " +
            "record of transactions rather than in any vote. Because checking these systems is " +
            "now a specialist trade, trust rests on the reputation of a few suppliers.",
        s5: "People now petition, consult and write to their representatives through the same " +
            "systems. Those systems draft and condense the letters, the consultation responses " +
            "and the summaries officials read. Citizens file consultation responses and survey " +
            "answers written by the same software. The department counting them cannot tell ten " +
            "thousand people from one person running a script, and turnout models built on " +
            "those counts mislead. Officials govern a public whose expressed preferences pass " +
            "through a layer their own departments bought.",
        s6: "The arrangement took hold without a vote. Services reach people, rules hold, and " +
            "nobody was asked. No government has tried to withdraw these systems, because the " +
            "same software now schedules the courts, pays the benefits and books the hospital " +
            "appointments. Unplugging it would stop the office that wrote the order. A large " +
            "failure could still reopen the question. The arguments for reopening it would " +
            "reach officials already condensed by the tools under dispute." },
  P2: {
        s1: "Majorities disapprove and change nothing. Gallup measured 39% of Americans saying " +
            "the technology does more harm than good against 31% a year earlier, and 79% " +
            "expecting it to cut jobs against 73%. United States states introduced 1,561 " +
            "artificial intelligence bills and enacted 109 of them, most setting conditions on " +
            "use rather than limits on development. Both major parties have backed large-scale " +
            "investment in the technology. Disapproval that finds no candidate stays " +
            "disapproval.",
        s2: "Sentiment converts into spending instead of voting. People pay for human contact " +
            "where they can afford it. A premium for being served by a person appears in " +
            "banking, travel and care. A mismatch of organisation lies underneath, since the " +
            "gains from automation concentrate in firms that lobby and the costs spread thinly " +
            "across households. Intensity of feeling therefore runs well ahead of intensity of " +
            "political effort.",
        s3: "The premium for a person has a boundary. It concentrates where the outcome turns " +
            "on judgement and attention, in schooling, counselling, disputes and end-of-life " +
            "care. It thins wherever delay carries a cost in survival, since a patient facing a " +
            "diagnosis takes the fastest reading available. Refusal is therefore a purchase " +
            "that only households with money can make.",
        s4: "The economy has priced chronic disapproval in. Automated service is cheap and " +
            "near-universal, human service is dear and widely wanted, and the gap between them " +
            "tracks income. A problem of interpretation follows. Institutions read compliance " +
            "where the public feels resignation. Hospital managers and state legislators still " +
            "read the monthly error reports. The machines now write most entries in those " +
            "reports, and record no failure they were not built to recognise.",
        s5: "Distrust transfers to whatever the technology touches. Formed around artificial " +
            "intelligence, it attaches to the institutions that adopted it and spreads to " +
            "functions well beyond its reach. Clinics, tax authorities, courts and schools " +
            "carry lower confidence across their whole activity. The cost surfaces in " +
            "vaccination coverage, jury attendance, census response and voluntary tax " +
            "compliance. Public business that depends on cooperation given freely becomes " +
            "expensive to conduct.",
        s6: "The working order rests on resignation. Services reach the public, rules hold, and " +
            "the population obeying them reports steady disapproval in every survey. Stability " +
            "of that kind is real, because resignation is durable and cheap to maintain. How " +
            "such a public behaves under shock — a mass failure of a system many people depend " +
            "on, or a war — remains unobserved. A standing reserve of disapproval is the " +
            "material of a fast political movement." },
  P3: {
        s1: "County boards and zoning hearings settle where computing capacity gets built. Data " +
            "Center Watch, which tracks opposition to data centre projects, counted at least 75 " +
            "United States projects worth $130 billion delayed or blocked in a single quarter. " +
            "At least 63 local moratorium actions passed alongside them, with documented " +
            "instruments of that kind running into the hundreds across more than 40 states. " +
            "Voters in Festus, Missouri recalled every incumbent member of the city council " +
            "over a proposed $6 billion project. Planning boards refuse projects that national " +
            "policy favours, and the refusal stands.",
        s2: "Capacity relocates rather than disappearing. Building concentrates in the " +
            "counties, states and countries that grant permits quickly. The map of computation " +
            "separates from the map of population. The power at work is asymmetric, since a " +
            "planning board decides where a facility sits and nothing decides whether " +
            "computation expands. Regions that grant permits collect construction employment, " +
            "property tax and transmission investment; regions that refuse keep their landscape " +
            "and their existing rates.",
        s3: "Refusal stops at the electricity bill. PJM Interconnection is the grid operator " +
            "serving 67 million people across thirteen states and the District of Columbia. Its " +
            "capacity price reached $329.17 per megawatt-day for one delivery year against " +
            "$28.92 two years earlier. Households across that whole territory pay the " +
            "difference wherever the facilities sit. The argument therefore moves to state " +
            "utility regulators and to water permitting, where a county's veto is worth little.",
        s4: "A durable geography has formed. A minority of counties and countries accepted the " +
            "land use in exchange for revenue, and now host the machinery running " +
            "administration, medicine and finance for everyone else. Distance becomes " +
            "dependence. Regions whose hospitals, courts and utilities run on computation sited " +
            "three states away have placed part of their own continuity in another " +
            "jurisdiction's keeping. Hosting regions collect the tax base and refusing regions " +
            "collect the bills.",
        s5: "Population and employment follow the map in turn. Hosting regions draw the " +
            "industries that want cheap interconnection, together with the workforces those " +
            "industries employ. Schools, hospitals and housing get built where the load went. " +
            "Decisions first taken over land use settle where people find their work.",
        s6: "Planning decisions taken one at a time drew the political geography of artificial " +
            "intelligence at the scale of the county. National debate arrived after the map was " +
            "set. The buildings and the power lines stand in the places that asked least for " +
            "them. Whether hosting regions convert physical possession into a lasting share of " +
            "the value produced is a question no case so far decides." },
  P4: {
        s1: "Support for the technology splits both parties. Pew Research Center surveyed 3,488 " +
            "United States adults and found 54% of Republicans and 34% of Democrats calling " +
            "United States leadership in artificial intelligence extremely or very important. " +
            "Pacing the Frontier, a statement open only to verified employees of frontier " +
            "companies, asked the United States government to help build international means of " +
            "slowing development. Its 1,378 signatures placed a restraint constituency inside " +
            "the industry alongside the one outside it. Neither coalition can deliver a " +
            "majority of its own members on the question.",
        s2: "Legislation turns unstable. Legislatures enact measures, postpone them, repeal " +
            "them and replace them with successor statutes built on different architecture. " +
            "Colorado supplies the pattern. The state enacted Senate Bill 24-205, delayed its " +
            "effective date to 30 June 2026, then repealed and replaced the whole framework by " +
            "a statute signed 14 May 2026. Such majorities form bill by bill from members whose " +
            "parties are split, then dissolve once the vote is taken.",
        s3: "The fracture reaches foreign policy, where the arithmetic of ratification makes it " +
            "decisive. Because a treaty binding the United States requires 67 votes in the " +
            "Senate, a cross-cutting public can withhold every one of them. International " +
            "coordination therefore takes the forms available to executive decision alone: " +
            "agreements between governments, export controls and joint statements. The " +
            "administration that follows can reverse any of them. Verification arrangements, " +
            "which need domestic backing that survives a change of government, meet their limit " +
            "here.",
        s4: "Policy has passed to courts, to states and provinces, and to the largest markets " +
            "whose rules exporters must satisfy. Governing by geography proves inconsistent: " +
            "the same medical device, hiring tool or tutoring system is lawful on one side of a " +
            "boundary and prohibited on the other. Firms place their operations accordingly. A " +
            "person's protection against an automated decision now depends on where they live. " +
            "That difference becomes one of the grievances dividing the parties.",
        s5: "Voters who agree about automation and differ on everything else find themselves in " +
            "one coalition. Majorities assembled over machine capability go on to legislate " +
            "about pensions, migration and defence procurement. The old party families keep " +
            "their names across changed commitments. Parties reorganise around the pace and " +
            "scope of automation.",
        s6: "Disagreement inside both coalitions defeated every national settlement. National " +
            "governance works inside the new arrangement, because the realigned coalitions are " +
            "majorities. Binding international commitment lies beyond it, since the " +
            "distribution of opinion that produced the realignment is the one that withholds " +
            "supermajorities. A settlement would require harm that both sides recognise as " +
            "their own." },
  P5: {
        s1: "Households now read the cost of the build-out on their own electricity statements. " +
            "Bills across the largest United States grid region rose with the new demand. " +
            "Gallup found 71% of United States adults against a nearby data centre, above the " +
            "53% who opposed a local nuclear plant. Candidates in both parties campaign against " +
            "data centres. A grievance with a monthly number attached to it wins elections.",
        s2: "The new majority writes restriction into law. Licences govern deployment, limits " +
            "apply in hiring and in schools, and a pause holds new sites. Capability " +
            "concentrates in the countries that welcome development. Researchers follow it " +
            "there. The departure of a scientific workforce becomes the first visible price of " +
            "the new statutes.",
        s3: "Enforcement stops at the border. A restriction on domestic deployment leaves " +
            "foreign-hosted models arriving as ordinary network traffic and imported goods " +
            "carrying capability produced under other rules. Controlling that flow requires " +
            "inspecting ordinary internet traffic, a surveillance the restricting coalition's " +
            "own supporters refuse. Leakage is therefore tolerated at a bearable level. Border " +
            "measures concentrate on what customs can see: hardware, licensed enterprise " +
            "contracts, and the professional services carrying machine output into medicine and " +
            "engineering.",
        s4: "The protective order holds. Those who deploy automated decisions carry the " +
            "liability for them, licensed people staff the reserved occupations, and law " +
            "allocates the electricity supplied to computing facilities. Medical exemptions " +
            "widen faster than any other, because patients travel abroad for diagnoses banned " +
            "at home. Every exemption granted for a good reason narrows the order it was carved " +
            "from.",
        s5: "The protective order acquires defenders who outlast the sentiment that created it. " +
            "Licensed occupations, the unions that bargained the protections and the domestic " +
            "suppliers grown inside the restriction hold a direct interest in its continuation. " +
            "The statutes therefore survive a public that has changed its mind. Demand for the " +
            "restricted capability shows itself sideways, in medical travel and in unlicensed " +
            "use of foreign systems at home.",
        s6: "The choice was deliberate: slower capability in exchange for a controlled labour " +
            "market and a settled politics. A population made it through elections and wrote it " +
            "into law, keeping the employment and the human institutions it valued. Enforcement " +
            "relied on surveillance the movement had once opposed. Security and health now " +
            "depend on capability held elsewhere. The size of that gap will decide the terms on " +
            "which the restriction opens." },
  R1: {
        s1: "Frontier developers set the conditions of their own releases in documents they " +
            "publish themselves. Twenty-six organisations signed the European Union " +
            "General-Purpose AI Code of Practice from August 2025. One signed only its safety " +
            "and security chapter; another declined, citing legal uncertainty. Each signatory " +
            "chose which chapters to accept and may withdraw from them. The company that built " +
            "a system therefore decides what it will refuse.",
        s2: "Purchasers and insurers put a price on those documents. Large buyers copied the " +
            "published safety commitments into their supply contracts, and underwriters wrote " +
            "the same commitments into the conditions of liability cover. Developers that " +
            "depart from their own framework now breach a contract and void their insurance in " +
            "the same act. Promises drafted to reassure the public came to carry a cost their " +
            "authors never set.",
        s3: "Courts took up the documents next. A judge hearing a negligence claim reads a " +
            "developer's published safety framework as evidence of the care the industry treats " +
            "as reasonable. Plaintiffs sue on the defendant's own text, treating departure from " +
            "it as proof of fault. The undertakings acquired legal force without a legislature " +
            "voting on them.",
        s4: "Competing developers converged on a single industry text. Buyers wanted terms they " +
            "could compare across suppliers. The largest cloud providers required one standard " +
            "from every model they host. Procurement offices now quote the text by name, with " +
            "insurers pricing cover clause by clause. A document written by the firms it " +
            "governs decides which systems a government may buy.",
        s5: "Contracts and insurance policies bind only paying customers. Developers publish " +
            "the trained parameters of some systems outright and hand free access to schools, " +
            "clinics and small public agencies. A gift skips the moment of payment on which the " +
            "whole arrangement turns. The systems that reach the most people are the ones no " +
            "promise governs.",
        s6: "Customers, underwriters and juries govern frontier systems. The industry text " +
            "travels with every sale, every policy and every lawsuit, which carries it into " +
            "more of daily life than any single statute reaches. Its authors answer on a " +
            "commercial timetable, and the parties they answer to bought their way into the " +
            "conversation. Voters have no route to amend it. The one buyer it cannot reach is " +
            "the government that commissions a system for itself." },
  R2: {
        s1: "State legislatures write the operative law on artificial intelligence, and the " +
            "federal executive fights them in court. American states enacted 109 AI laws and 28 " +
            "data-centre statutes in the first half of 2026, drawn from 1,561 bills introduced " +
            "across 45 states. An executive order signed on 2025-12-11 created a Department of " +
            "Justice AI Litigation Task Force, which began challenging those statutes in " +
            "federal court on 2026-01-10. Congress left both sets of rules standing. What a " +
            "developer owes therefore depends on where its customers live.",
        s2: "One strict state sets the specification for the whole country. Building different " +
            "model behaviour for each jurisdiction costs a developer more than meeting the " +
            "hardest requirement once. Vehicle emissions took the same shape when seventeen " +
            "states and the District of Columbia adopted California's standards under section " +
            "177 of the Clean Air Act. Covering roughly two-fifths of new cars between them, " +
            "those states made the California rule the national product. Operators run the same " +
            "few systems in every country, which gives a claimant in one the answer a claimant " +
            "in another gets. The statutes stay as divergent as ever.",
        s3: "The statutes diverge over use rather than over design. Diagnostic systems that may " +
            "run without a physician's review in one state are unlawful across the border, and " +
            "school districts grade essays automatically where their neighbours forbid it. " +
            "State medical boards and bar associations adopted the same standards and carried " +
            "them into examination rooms, courtrooms and police departments. Protection against " +
            "an automated decision now depends on where a person lives.",
        s4: "Americans use the same machines under different rules. The rules that differ reach " +
            "people through their employer, their insurer, their school district and their " +
            "police force, which are the institutions hardest to leave. Companies move far more " +
            "easily. About two-thirds of Fortune 500 companies are incorporated in Delaware, " +
            "with recent reincorporation traffic running toward Texas and Nevada. Identical " +
            "harms carry different remedies on either side of a state line, with the defendant " +
            "the only party able to choose its side.",
        s5: "Voters argue about automation in state elections. Ballot measures ask voters " +
            "whether a police department may keep its prediction software and whether a school " +
            "district may grade essays by machine. Where they pass, a named official must sign " +
            "each rejection. Households weigh those rules alongside taxes and schools when they " +
            "choose where to live, and employers follow the workers. Migration after Dobbs v. " +
            "Jackson Women's Health Organization (2022) sorted the country the same way over " +
            "abortion access. Strict and permissive states have diverged in the kind of work " +
            "performed in them.",
        s6: "The federal arrangement produced one set of machines and fifty sets of lives. " +
            "Voters and courts in each state decided how policing, hiring and medicine may use " +
            "these systems, which is the arrangement's strongest claim. Amending the " +
            "arrangement requires agreement among fifty legislatures, an agreement nobody has " +
            "ever assembled. Comparable injuries accordingly carry different remedies across a " +
            "line that capital crosses freely. In National Pork Producers Council v. Ross " +
            "(2023) the Supreme Court left open how far one state may set the terms of commerce " +
            "conducted in the others." },
  R3: {
        s1: "One national standard governs frontier releases, displacing every state " +
            "requirement. Reaching it takes a win for the litigation the Department of Justice " +
            "AI Litigation Task Force opened on 2026-01-10, or a preemption statute; neither " +
            "had arrived by August 2026. Congress has displaced state law across whole sectors " +
            "before. The Employee Retirement Income Security Act of 1974 took over employee " +
            "benefit plans, and the Airline Deregulation Act of 1978 took over airline fares " +
            "and routes. Precedent for displacing the states is settled, and the argument runs " +
            "on which instrument does it here.",
        s2: "Developers now satisfy one text and sell into every state. Firms that a " +
            "fifty-jurisdiction patchwork had priced out of medicine, credit and education " +
            "returned to those markets on a single filing. One national text is neutral about " +
            "strictness, rewarding scale where the standard is demanding and rewarding new " +
            "entrants where it is light. Every distributional consequence therefore sits in the " +
            "drafting, which makes that text the most contested object in American technology " +
            "policy.",
        s3: "Congress displaced the state statutes and left the common law standing. People " +
            "injured by an automated decision sue in tort, and juries fix the operative rules " +
            "about how a model should behave. Medical devices show how much room that leaves: " +
            "federal premarket approval bars state design claims under Riegel v. Medtronic " +
            "(2008), though drug labelling claims survived in Wyeth v. Levine (2009). Where the " +
            "line between those rulings falls decides how much of the field litigation governs. " +
            "Product liability sets the price of a wrong answer.",
        s4: "A uniform market has settled, with the same release conditions in every state. " +
            "Preemption left the sectoral regulators untouched. The Food and Drug " +
            "Administration, the Federal Aviation Administration and the Securities and " +
            "Exchange Commission remain the real constraint on what these systems do in " +
            "medicine, flight and markets. Harms that cross those boundaries reach no " +
            "regulator, because a system shaping hiring, elections and family life at once " +
            "belongs to none of the sectors. The general-purpose harms are the ones a uniform " +
            "arrangement leaves unowned.",
        s5: "Trading partners adopted the American standard to keep their market access. Their " +
            "regulators wrote its requirements into national rules, and their exporters " +
            "certified against it at home. Aviation shows the mechanism, since bilateral " +
            "aviation safety agreements let one authority's certification stand in another's " +
            "market. Foreign governments now negotiate amendments to a statute they cannot vote " +
            "on, which settles part of the American standard abroad.",
        s6: "The country ends with one legible rule for artificial intelligence and a national " +
            "politics argued over it. Every interested party concentrates on amending a single " +
            "text, which makes the drafting fight the whole of technology policy. Capability " +
            "moves faster than the legislative cycle on which the standard is revised. The " +
            "standard is furthest out of date exactly when the systems change most. Uniformity " +
            "bought speed and legibility at the price of a rule nobody can update in time." },
  R4: {
        s1: "Governments now clear frontier models before customers reach them, and they screen " +
            "those customers by nationality. On 2026-06-12 the United States Department of " +
            "Commerce barred all non-United States nationals from two frontier models, forcing " +
            "their developer to cut off every customer until the restriction lifted. A second " +
            "American laboratory limited three of its models to government-approved partners on " +
            "2026-06-26, at the request of the White House Office of the National Cyber " +
            "Director. The Export Administration Regulations already treated the release of " +
            "controlled technology to a foreign national inside the country as an export to " +
            "that person's home country. Export reviewers now fix the date on which a model " +
            "reaches the people who want it.",
        s2: "The reviewing office sets the release calendar. The number of officials cleared to " +
            "examine a model decides how quickly a finished system reaches the hospitals, banks " +
            "and defence ministries that want it. Those buyers purchase on procurement " +
            "timetables that a pending review can overrun, losing contracts that rarely return. " +
            "National capability advances at the speed of a government office.",
        s3: "Researchers without American citizenship lost access to the systems they study. " +
            "Temporary visa holders earn about three-fifths of United States doctorates in " +
            "computer and information sciences, which puts most incoming talent on the far side " +
            "of the gate. Laboratories run two levels of access under one roof, breaking " +
            "exactly the collaborations among the people who built the subject. Systems " +
            "released as published parameters pass the gate untouched, narrowing the controlled " +
            "surface to whatever stays behind a company's own interface.",
        s4: "Frontier models have settled into the status of controlled items. Allied " +
            "governments negotiated cleared access for their own nationals, and a common " +
            "vetting standard runs across the members of the North Atlantic Treaty " +
            "Organization. Beyond that circle, models move by licence and by treaty, alongside " +
            "the dual-use goods the Wassenaar Arrangement co-ordinates among its 42 " +
            "participating states. Physicians, agronomists and epidemiologists outside the " +
            "cleared bloc work with older systems. Capability travels by citizenship.",
        s5: "Governments extended clearance from access to publication. Work done on cleared " +
            "systems circulates among the cleared, which leaves the bloc reviewing its own " +
            "findings and living with its own errors longer. A state that can withhold a model " +
            "also sets the conditions for granting one, specifying what a system must disclose, " +
            "refuse and record. A power built to control distribution has reached into content.",
        s6: "The frontier is held as a licensed article. Scientists work in national groupings " +
            "that follow the licences rather than the problems. The licensing states bought " +
            "time and visibility over deployment, down to the name of every customer of every " +
            "cleared system. They paid for it with the international collaborations that " +
            "produced the capability. Laboratories abroad rebuild comparable systems from " +
            "published research, which leaves the licence governing distribution rather than " +
            "capability." },
  R5: {
        s1: "Conformity assessment, third-party audit and incident reporting bind frontier " +
            "developers, and regulators enforce them. European Union AI Act Article 73 has " +
            "required reporting of serious incidents since 2026-08-02, alongside the " +
            "notification duty in Article 55(1)(c) for general-purpose models carrying systemic " +
            "risk. The Act sets fines reaching 35 million euros or seven per cent of worldwide " +
            "annual turnover. Under California SB 53, in force since 2026-01-01, a company must " +
            "report critical safety incidents to the California Office of Emergency Services. " +
            "Illinois SB 315, signed on 2026-07-06 and effective 2027-01-01, adds annual " +
            "independent audits of the largest developers.",
        s2: "Regulators hold the first public record of how machine judgement fails. They have " +
            "counts, categories and severities where the evidence had been anecdote, covering " +
            "every developer that sells into the market. Insurers write cover against measured " +
            "rates, which the filings now supply for the first time. Firms weigh the loss of " +
            "cover more heavily than the statutory fine. Insurance therefore restrains " +
            "deployment further than the regulation that produced the record.",
        s3: "Reporting merged into the incident registers medicine and transport already keep. " +
            "Hospitals log a diagnostic model's failures beside adverse drug reactions, and " +
            "airlines log a flight control system's beside airframe incidents. The arrangement " +
            "spread by copying, in the way data protection law spread before it. About seven in " +
            "ten of the 194 economies tracked by the United Nations Conference on Trade and " +
            "Development hold data protection statutes, most drafted after the European text. " +
            "Developers selling worldwide file to many authorities against one broadly common " +
            "template.",
        s4: "Auditors and insurers narrowed the field to a few large developers. An independent " +
            "audit costs much the same for a small developer as for a large one, which makes it " +
            "a far heavier burden on the small. The internal-control audits required by section " +
            "404 of the Sarbanes-Oxley Act of 2002 fell hardest on smaller listed companies as " +
            "a share of revenue. Scarce qualified auditors take the largest clients first. A " +
            "handful of suppliers sell the software used in hospitals, courts and aircraft, " +
            "because certifying one costs more than most firms will ever earn from it. Heart " +
            "valves and jet engines concentrated the same way.",
        s5: "Hospitals, courts and utilities buy from the same short list. Insurers underwrite " +
            "only the systems their assessors have examined, and a public body may deploy only " +
            "what its insurer covers. Buyers converge on the few certified systems until one " +
            "model is running triage, docket management and grid dispatch. A defect in that " +
            "model appears in every institution that bought it on the same day.",
        s6: "Developers began training on the record itself. The reported failure modes are the " +
            "best description anyone holds of how these systems break, which turns a compliance " +
            "duty into a source of capability. Courts draw on the same corpus to fix the " +
            "standard of care; researchers mine it for diagnosis and control systems. The " +
            "record holds only what people file. Military and national security uses fall " +
            "outside the European Union AI Act, and a harm nobody reports never enters the " +
            "evidence." },
  R6: {
        s1: "Comprehensive statutes sit on the books with their hardest duties deferred. The " +
            "European Union Digital Omnibus entered into force on 2026-07-27, moving compliance " +
            "for stand-alone high-risk systems from 2026-08-02 to 2027-12-02. Systems embedded " +
            "in regulated products went to 2028-08-02, though the transparency duties in " +
            "Article 50 of the AI Act still applied from 2026-08-02. The Council of Europe " +
            "Framework Convention on Artificial Intelligence, opened for signature on " +
            "2024-09-05, held twenty signatures and one ratification against the five it " +
            "requires. Labelling is the only obligation binding anyone.",
        s2: "Firms built the compliance that binds them. Provenance records, showing who or " +
            "what produced a document, an image or a hiring decision, became standard practice " +
            "in publishing, banking and recruitment. Labelling was the one duty a regulator " +
            "could actually enforce. Banks and publishers can now trace the origin of anything " +
            "they handle; certifying that a system behaves safely waits on a date that keeps " +
            "moving. A statute written to govern high-risk systems has so far produced labels.",
        s3: "People harmed by automated decisions sue under the statutes already in force. " +
            "Consumer protection, anti-discrimination, product safety, medical device approval " +
            "and data protection carry the whole load. Each was drafted for a product with a " +
            "fixed function and a named manufacturer, which fits a system that changes after " +
            "sale only in part. Courts govern artificial intelligence by analogy, and every " +
            "dispute turns on which existing category a system most resembles.",
        s4: "The deferred duties applied at last, to categories describing an earlier " +
            "generation of systems. Regulators enforce them as written, since a regulator's " +
            "warrant is the text in front of it. By the time they commenced, courts had already " +
            "built the operative rules over automated hiring, credit, housing and clinical " +
            "practice, decision by decision. Case law arrives after the harm that produced it, " +
            "and the interval between the two is where the largest losses fall.",
        s5: "Governments found each extension cheaper to grant than the one before. Industry " +
            "asked for the second deferral by pointing at the first, and a government that has " +
            "moved one date grants the next more readily. Firms discount the next extension in " +
            "advance when they plan, which removes most of the pressure a deadline exists to " +
            "create. The public read the statute rather than the commencement schedule and " +
            "believed the technology governed. That gap showed itself when the first large " +
            "automated failures reached the courts.",
        s6: "Legislatures abandoned calendar dates and tied commencement to measured " +
            "capability. Duties now begin when a system passes a specified evaluation, which " +
            "brings the law to the strongest systems first. Developers negotiate over the " +
            "tests, the thresholds and the bodies accredited to run them, with the effort they " +
            "once spent on extensions. The argument that ran over dates now runs over " +
            "instruments. The engineers who write the evaluations choose the moment each law " +
            "takes effect." },
  S1: {
        s1: "Four United States cloud providers operate the largest general-purpose computing " +
            "fleets in the world. They have guided to roughly $725 billion of combined capital " +
            "expenditure for the year, against roughly $410 billion the year before. Stanford's " +
            "AI Index counts 5,427 data centres in the United States, more than ten times the " +
            "number in any other country. Hospitals, law firms and government departments reach " +
            "the systems built on those fleets by subscription. The supplier keeps the only " +
            "copy and may change it, reprice it or withdraw it between one renewal and the " +
            "next. Epoch AI, which tracks training runs, measures frontier compute growing four " +
            "to five times a year, a rate that widens the distance between these firms and " +
            "every other buyer.",
        s2: "Hospitals, ministries and universities run their heaviest work on three or four " +
            "suppliers. A procurement contract decides which of them gets priority capacity, at " +
            "what price and for how long. The ministry that negotiated well holds guaranteed " +
            "capacity at the hours it needs and clears its case backlog. The one that " +
            "negotiated badly waits behind other customers. Public bodies acquire capability " +
            "through their purchasing departments, on terms held in commercial confidence. " +
            "Access to machine capability is written into contracts the public cannot read.",
        s3: "An outage at one supplier closes clinics and courts in a dozen countries at once. " +
            "Diagnostic triage, case scheduling and benefit assessment stop the moment the " +
            "subscription stops answering. Regulators respond by writing continuity duties into " +
            "the licences of hospitals, banks and grid operators. Suppliers must keep systems " +
            "available and their behaviour stable, since cases decided under a model remain " +
            "open to appeal for years. A commercial decision to retire a product has become a " +
            "matter for the courts that relied on it.",
        s4: "Suppliers sell machine capability by the unit, on a published tariff. A change in " +
            "that tariff moves the cost of legal drafting, radiology reporting and translation " +
            "in every country on the same day. Because the operators holding capacity also " +
            "decide who receives it, the questions asked in biology, materials and climate " +
            "follow commercial interest. Structural biology with a drug candidate behind it " +
            "runs; ecology, seismology and soil science wait. Four boards set a price that " +
            "appears in every country's cost of services.",
        s5: "Concentration turned out to make regulation easier, because a handful of owners " +
            "can be reached by one statute. Governments apply the instruments they built for " +
            "electricity and water suppliers, among them tariff review, service obligations and " +
            "inspection rights. Utility commissions hold hearings on the price of machine " +
            "capability, with consumer advocates appearing. The suppliers accept the oversight " +
            "in exchange for the certainty their capital programmes need. An industry that " +
            "expected to outrun the state proved easier to govern than the thousands of firms " +
            "it replaced.",
        s6: "Machine intelligence is governed as a regulated utility. Statute obliges the " +
            "suppliers to serve every qualified customer, to publish prices and to hold " +
            "capacity in reserve. What the public is owed at that price is the unresolved part, " +
            "since a utility duty covers reliability and says nothing about which research " +
            "questions get run. Governments that direct these systems toward a chosen problem " +
            "buy capacity on the same terms as any other customer. Ownership stayed private, " +
            "supervision became public, and the boundary between them is argued at every rate " +
            "hearing." },
  S2: {
        s1: "Governments have begun buying computing capacity of their own. An export-control " +
            "order of 2026-07-10 moved the United Arab Emirates into Country Group A:5, whose " +
            "members buy advanced processors under general authorisation. Saudi Arabia's " +
            "national programme operates under a case-by-case authorisation capped at 35,000 " +
            "accelerators. The European Commission has committed €20 billion under InvestAI, " +
            "its industrial programme, toward gigafactories specified at more than 100,000 " +
            "advanced processors each. India rents processors from a public pool to startups " +
            "and researchers by the hour, which puts the means of building capable systems " +
            "inside states that used to buy them finished.",
        s2: "States train systems on their own languages, statutes and case law. Speakers of " +
            "languages with large populations and small commercial markets get machine " +
            "translation and dictation for the first time. Courts interpret, schools teach and " +
            "broadcasters caption in those languages through systems the government owns. A " +
            "citizen filing a benefit claim reaches a system trained on that country's own " +
            "administrative record. Public administration in dozens of states runs on machines " +
            "their own ministries commissioned.",
        s3: "Publicly owned clusters run a generation behind the frontier and specialise " +
            "accordingly. They carry local medicine, local court records and local crop advice, " +
            "where the training data exists nowhere else. The authorisations behind the " +
            "hardware stay revocable at the discretion of the issuing government. Countries " +
            "acquire processors faster than they train the engineers who keep large clusters " +
            "running, leaving utilisation low. A national cluster is easy to buy and hard to " +
            "staff, the constraint these programmes meet first.",
        s4: "Middle-sized countries run capable systems on their own territory, under their own " +
            "law. Any limit on what they may do is enforced by the state that owns them, or by " +
            "nobody. Medical certification has diverged along national lines, each approval " +
            "stopping at the border that granted it. Evidence produced by one state's systems " +
            "is contested in another state's courts. The rules governing a system are the rules " +
            "of the country housing it.",
        s5: "Systems built for local medicine and crop breeding also design pathogens. Software " +
            "built to design proteins for medicine cannot tell a therapeutic request from a " +
            "harmful one, because both are the same calculation. Screening now falls to the " +
            "laboratories that must synthesise whatever the software designs. Governments that " +
            "funded these clusters inspect the laboratories they equipped, using screening " +
            "rules written for gene synthesis orders. Several publish their models openly, " +
            "which delivers the same capability to every other country and to parties no " +
            "programme intended to supply. A release decided in one capital sets what is " +
            "available everywhere.",
        s6: "Capability sits inside dozens of states, held alongside a national airline or a " +
            "research reactor. Restraint is the part without an answer, since coordination that " +
            "once required agreement among a few operators now requires it among many. " +
            "Enforcement rests on consent, since no participant holds the chokehold that would " +
            "compel the others. The nearest precedent is the safeguards machinery that governs " +
            "civil nuclear material, built over decades and staffed by inspectors. Whether " +
            "comparable machinery can be built for computing, and who would staff it, stays " +
            "unsettled." },
  S3: {
        s1: "Households meet these systems first on the electricity bill. PJM Interconnection, " +
            "the grid operator for thirteen states, saw its capacity price rise from $28.92 to " +
            "$329.17 per megawatt-day across successive auctions. The operator attributes most " +
            "of one increase to data-centre demand. The charge reaches every customer on the " +
            "network, including those who use none of the services that computing supports. A " +
            "person who has never opened one of these systems pays for it monthly.",
        s2: "Towns vote the data centres down. Heatmap and Embold Research put opposition at " +
            "71% among 4,118 registered voters, and Fox News at 70%, a larger share than " +
            "opposes a local nuclear plant. Data Center Watch, which tracks local opposition, " +
            "counted at least 75 projects worth $130 billion delayed or blocked in a single " +
            "quarter, alongside 63 moratorium actions. The Lawrence Berkeley National " +
            "Laboratory reports 2,061 gigawatts of generation and storage waiting in " +
            "interconnection queues, with about fourteen gigawatts withdrawn for each one that " +
            "reaches operation. County boards and utility regulators meet monthly, and machine " +
            "work reaches surgeries, classrooms and town halls on their schedule.",
        s3: "Builders answer by generating their own power. Utilities recommission retired " +
            "nuclear plants under contract to a single customer; new gas turbines rise beside " +
            "the halls they supply. Transmission built for one buyer skips the queue that " +
            "public projects still wait in. The same proceedings settle how much power remains " +
            "for factories, heating and vehicle charging. Electricity planning across whole " +
            "regions now turns on where computing gets built.",
        s4: "Computing has settled into the counties with spare generation and willing boards. " +
            "The halls sit away from population centres, run on generation they finance " +
            "themselves, and shut down on request in exchange for their connection. The county " +
            "carries the land, the water and the transmission corridors, and keeps a thin tax " +
            "base and few jobs. The medical and scientific gains accrue across the whole " +
            "country. Residents who once blocked the projects now name a price for their " +
            "consent.",
        s5: "Generation built for computing also serves heating, transport and industry. A grid " +
            "sized for a load that runs at every hour carries the evening peak more cheaply " +
            "than one sized for households alone. In the regions that paid the earlier " +
            "increases, electricity costs households less than a grid built for firm load alone " +
            "would have required. Electric heating and vehicle charging arrived there years " +
            "early, financed by a buyer with no interest in either. The build-out left behind a " +
            "larger and cheaper electricity system than the one it strained.",
        s6: "The clearest physical mark these systems left on the world is a rebuilt " +
            "electricity system. Machine work reached clinics, courts and factories in the " +
            "order the interconnection queue allowed. Counties decide siting one at a time; the " +
            "prices, emissions and capabilities those decisions determine are national. No " +
            "level of government holds both halves of that question. Ownership of the new " +
            "generation, and who is entitled to its output, is argued in every state " +
            "legislature." },
  S4: {
        s1: "Export licensing between the United States and China decides who may train at " +
            "frontier scale. A Bureau of Industry and Security rule of 2026-01-13 cleared " +
            "roughly ten Chinese firms to buy up to 75,000 advanced American accelerators each, " +
            "under a 25% export levy. Chinese orders for the year exceed two million units. The " +
            "same agency closed a routing loophole after advanced parts reached Chinese buyers " +
            "through third countries, and has announced close to $420 million in smuggling " +
            "penalties and forfeitures. Officials rewrite the export rule every quarter. " +
            "Companies choosing where to build plants that take years to finish must guess " +
            "which version will govern them on opening day.",
        s2: "Chinese laboratories build substitutes and close most of the distance. A United " +
            "States government evaluation placed the leading Chinese model about eight months " +
            "behind the leading American one. Enforcement of the licence keeps that gap open. " +
            "The lead matters in military logistics, cryptanalysis, biological design and " +
            "industrial planning, where a short advantage changes what can be attempted. " +
            "Officials defend the controls by the length of a lead that has to be remeasured " +
            "every year.",
        s3: "Processors, models, training and support arrive from either Washington or Beijing " +
            "as one package. Countries that take one supplier's hardware take its software, its " +
            "standards and its update schedule with it. Suppliers offer that capacity alongside " +
            "defence guarantees and withhold it during disputes. Reversing the choice costs " +
            "more than the original purchase, because staff must be retrained and working " +
            "systems rewritten. Most states chose once, and their public administration will " +
            "carry that choice for a generation.",
        s4: "Two technology zones have settled, each with its own processors, manufacturing " +
            "tools, software and standards. Hospitals inherit the diagnostic thresholds of " +
            "whichever zone supplied them, and courts its evidentiary conventions. Arms control " +
            "requires each side to examine the other's systems, an examination that separated " +
            "stacks push toward inference from observed behaviour. Agreements on military use " +
            "therefore rest on weaker evidence than the treaties preceding them. The limit " +
            "arrives once both sides cross the same capability thresholds, at which point a " +
            "lead of months settles nothing.",
        s5: "States trade mineral concessions, basing rights and votes in international bodies " +
            "for a place in the delivery queue. Computing capacity has joined arms sales and " +
            "development finance among the instruments of foreign policy. The control was " +
            "written for hardware and came to govern models. Weights travel as files, so a " +
            "restriction on processors holds weak purchase over who may use a capability and " +
            "firm purchase over who may build the next one. Policy now separates building a " +
            "system from using one, and reaches the second half with difficulty.",
        s6: "Each zone certifies its own medicines, its own materials and its own evidence. A " +
            "drug candidate designed under one set of systems is reviewed abroad by regulators " +
            "who cannot inspect the model that produced it. Patients wait longer for treatments " +
            "that already exist; each zone repeats the other's trials. No procedure exists for " +
            "one zone to audit a model held in the other. The case for the controls rests on " +
            "what the bought months were spent on, which this record cannot show." },
  S5: {
        s1: "Every frontier system is built from parts fabricated in one jurisdiction. A single " +
            "Taiwanese contract manufacturer holds roughly nine tenths of world capacity at the " +
            "most advanced logic nodes. The packaging step that bonds processor and memory dies " +
            "onto one substrate is allocated a year ahead, with this year's output already " +
            "committed. Hospitals, banks, grid operators and armed forces depend on machine " +
            "work built from those parts. Governments treat chipmaking as strategic ground; the " +
            "CHIPS and Science Act of 2022 funded leading-edge plants in Arizona, New York and " +
            "Ohio.",
        s2: "An earthquake, blockade or embargo halts leading-edge fabrication for longer than " +
            "a year. Installed systems keep running; planned expansion queues behind one " +
            "physical bottleneck. Governments buy priority for hospitals, grid operation and " +
            "defence, and meter what remains. Scientific computing loses access early, because " +
            "deferring a research run costs nothing this quarter and compounds afterwards. " +
            "Rationing produced the first public list of which uses of these systems are " +
            "essential.",
        s3: "Scarcity spreads out of computing into every product with a chip inside it. " +
            "Carmakers, phone assemblers and ventilator manufacturers order chips from the same " +
            "plants, new lines and twenty-year-old ones alike. When a computing order takes the " +
            "slot, hospitals wait behind it for infusion pumps. The chip shortage that followed " +
            "the pandemic cost automakers about $210 billion in revenue, over parts worth a few " +
            "dollars each. Older nodes in greater numbers recover part of the shortfall, " +
            "alongside efficiency gains that Epoch AI measures at about three times a year. " +
            "Buyers make up a fraction that way and wait out the rest.",
        s4: "Qualifying a new leading-edge line takes eighteen to twenty-four months. Builders " +
            "start that clock the week supply stops. The wait is the time a factory needs to " +
            "wind and test a transformer. A higher price moves a builder up the queue and " +
            "leaves the winding time where it was. The firms already holding capacity keep " +
            "training through the interruption and extend their lead over everyone waiting. " +
            "Smaller laboratories and university groups lose the years outright, having held no " +
            "reserved allocation to fall back on. A shortage in a shared input concentrates the " +
            "industry depending on it.",
        s5: "Efficiency learned under shortage outlasts the shortage. Engineers denied new " +
            "processors rewrote training and serving to run on fewer of them, and kept the " +
            "methods afterwards. Restored supply therefore delivers more capability than the " +
            "interruption removed. The laboratories that came through hold both the new " +
            "capacity and the cheaper methods. Capability advances faster after the " +
            "interruption than the trend before it predicted.",
        s6: "Several countries now fabricate advanced chips, leaving the industry with " +
            "duplicate capacity in three regions. Buyers pay a premium for that redundancy, " +
            "which states write into procurement as insurance. Because process knowledge " +
            "accumulates where volume is highest, a fragmented leading edge also advances more " +
            "slowly. Public authorities kept the allocation powers they took during the " +
            "shortage, and with them a standing say in which uses take precedence. Whether " +
            "redundancy outlasts abundance is untested, since duplicate capacity is expensive " +
            "to hold once supply is easy." },
  T1: {
        s1: "Machines take over the whole cycle of artificial intelligence research, from " +
            "proposing an experiment to reading its result and proposing the next. METR, which " +
            "measures the longest task a system completes unaided, reports that length doubling " +
            "roughly twice a year. Laboratory output then tracks the computing a firm can buy. " +
            "Hiring more scientists stops raising it. The two or three United States frontier " +
            "laboratories pull away from every university and national institute still " +
            "recruiting people to compete.",
        s2: "Machine-designed molecules, materials and proofs accumulate faster than " +
            "laboratories, clinics and fabrication plants can test them. United States drug " +
            "regulators approve roughly fifty novel medicines a year, a figure set by trial " +
            "enrolment, manufacturing inspection and follow-up. Testing a candidate still " +
            "consumes patients, reactors, clean rooms and instrument time in the quantities it " +
            "always did. Firms bidding against one another for trial sites and pilot plants pay " +
            "more for an hour on a bench than for a year of design.",
        s3: "The loop that designs medicines designs munitions and pathogens by the same " +
            "procedure. Governments extend export control from equipment to blueprints and " +
            "screen orders for synthesised DNA against sequences no catalogue lists. Defence " +
            "staffs adopt the loop for targeting and logistics, because an adversary running it " +
            "settles a plan before a committee can meet. Decision time in a crisis contracts to " +
            "what the machines set. Officers authorised to intervene act on summaries the " +
            "systems wrote.",
        s4: "Courts, drug regulators and hospitals settle on measured accuracy as their test, " +
            "because the derivations run past what any reviewer can follow. Those regulators " +
            "compare predicted outcomes against observed ones and certify the systems that " +
            "pass. Against the shortfall of eleven million health workers the World Health " +
            "Organization projects, machine diagnosis reaches patients who have never seen a " +
            "physician. Treatment arrives on the strength of a record only another machine can " +
            "read.",
        s5: "Leading systems return different answers on a drug's risk, a reactor's margin and " +
            "the effect of a tax. Because no bench can settle the difference inside the time a " +
            "decision allows, the dispute passes to ministers and select committees. Each party " +
            "adopts the model that supports its programme. Citizens choose a technical " +
            "authority the way they choose a party; no arbiter remains that both sides accept.",
        s6: "Whole disciplines now carry standard results that no living person has derived. " +
            "Teachers present them as established because their predictions have held under " +
            "test. Students learn to apply them without reconstructing them. The speed " +
            "delivered medicines, materials and energy sources that a slower arrival would have " +
            "reached a generation later. Whether a public can hold to account a body of " +
            "knowledge it cannot check is the question left standing." },
  T2: {
        s1: "Machines take over artificial intelligence research after a delay long enough for " +
            "the institutions around them to see it coming. AI Futures' August 2026 update " +
            "reports three medians drawn from one shared model and one shared dataset, spread " +
            "across twenty-six months. Metaculus, drawing on more than 1,800 forecasters, puts " +
            "a quarter of its probability on the first general system arriving within three " +
            "years. Illinois SB 315 requires the largest developers to report incidents within " +
            "seventy-two hours and to commission annual independent audits. Legislatures and " +
            "employers therefore prepare for an arrival that has not happened.",
        s2: "Machines begin directing their own research, with the first gains landing in " +
            "medicine and power generation. In both fields a regulator already licenses new " +
            "methods and can put a machine-designed drug or reactor component through the same " +
            "procedure. United States states enacted 109 artificial intelligence laws in the " +
            "first half of 2026, nearly all of them attaching duties to named uses such as " +
            "employment screening and clinical devices. Deployments that fit no name on those " +
            "lists proceed under contract alone.",
        s3: "Work requiring a body in a room grows scarce as advice grows cheap. Hospitals, " +
            "utilities and building firms bid for the same nurses, line workers and " +
            "electricians. Wards close beds, substation work slips a season, and the winning " +
            "bidder pays a wage the losers cannot match. Enrolment in law and accountancy " +
            "degrees falls; apprenticeship places fill for the first time in a generation. A " +
            "licensed electrician now earns more than the lawyer whose drafting the machines " +
            "absorbed.",
        s4: "Expert advice now costs almost nothing to produce. The liability for acting on it " +
            "costs as much as ever. Insurers write exclusions for generative artificial " +
            "intelligence into standard business liability cover, leaving hospitals and law " +
            "firms that automate past supervision uninsured. Beneath each signature, machines " +
            "have done the work. The tasks that once trained a signer, the first draft and the " +
            "first read, went to the machines before anything else did. Each signature now " +
            "covers many times the volume it once did, and the signer reviews the work by " +
            "signing it.",
        s5: "Entry to the signing occupations narrows, because the supervised junior work that " +
            "produced qualified practitioners no longer exists. Medical residency, legal " +
            "pupillage and engineering apprenticeship all counted hours of supervised work. " +
            "Software now does the drafting and the first reading, and a trainee reaches the " +
            "end of the programme with a fraction of the cases. Countries that kept their " +
            "teaching hospitals and their practising engineers continue to produce people who " +
            "can carry that responsibility. Their certificates command a premium in " +
            "international contracts, and firms elsewhere pay for a signature they cannot " +
            "produce at home.",
        s6: "Governments that stopped training their own radiologists and structural engineers " +
            "hire them from abroad, at a price set by the countries that kept their training " +
            "programmes. A state can buy signatures and audits from abroad, although it cannot " +
            "buy the supervised years that produced the people who sign. Every attempt to " +
            "rebuild the training path has failed on the same obstacle, since the middle steps " +
            "that taught the work are performed elsewhere. The professions survive as a licence " +
            "to sign. National boards grant the licences. The engineers who check the " +
            "calculations work abroad, beyond the reach of any court that could strike them " +
            "off." },
  T3: {
        s1: "Measured capability growth falls away from its own trend. Reaching a working month " +
            "of unattended work this late requires a doubling time near two years, against the " +
            "three to six months METR's task-length measurements have shown. Epoch AI's " +
            "capabilities index gives up the acceleration it once recorded. National weather " +
            "services and hospitals meanwhile put the systems they already have into daily " +
            "forecasting, triage and scheduling. The technology enters safety-critical work " +
            "before it becomes powerful.",
        s2: "Insurers underwrite only the systems they have tested themselves. Underwriters run " +
            "each candidate system against their own catalogue of failures and set the premium " +
            "from the rate they measure. Hospitals and utilities that want cover buy from the " +
            "short list carrying it. Audited failure rates displace benchmark scores in " +
            "procurement. Underwriters now make the purchasing decisions that procurement " +
            "officers once made.",
        s3: "The hours people have for reading cap what the systems deliver, because someone " +
            "must still check every output that matters. The European Union AI Act's high-risk " +
            "duties bind in full, requiring human oversight, logging and post-market monitoring " +
            "across clinical, employment and infrastructure uses. Work needing success rates " +
            "near ninety-eight percent stays with the people who carry the consequence of a " +
            "failure. Cancer, fusion and ageing yield nothing to the same approach, because " +
            "progress there needs experiments rather than faster reading. The gains land " +
            "instead in scheduling, documentation, procurement and customer contact.",
        s4: "Reaching the previous generation's standard costs a small fraction of what it " +
            "first cost. Tax agencies, police forces, middle-income states and fraud rings all " +
            "run systems of that class. The methods sit inside licensed infrastructure such as " +
            "clinical records, payment rails and dispatch, arriving there by ordinary software " +
            "update. Capability stops distinguishing one actor from another, and the " +
            "distinction moves to what each is permitted to connect it to.",
        s5: "One generation of models now sits beneath utilities, hospitals and payment " +
            "networks together. Cover concentrated the buying, because only a few systems had " +
            "ever been tested by an underwriter. A defect in one of them therefore reaches a " +
            "clinic, a court and a water utility in the same update. Operators who buy from " +
            "different vendors fail on the same afternoon, since those vendors resell the same " +
            "tested system. Continuity of service becomes a public safety question.",
        s6: "Regulators treat these systems as ordinary infrastructure and inspect them as they " +
            "inspect transformers and dialysis machines. The slow approach put them under " +
            "power, water, finance and clinical care before any self-directing version existed. " +
            "Nobody has written the test that would show machines beginning to direct their own " +
            "research, and no agency has been asked for one. Whether the systems can be " +
            "revised, once revision interrupts those services, has yet to be shown." },
  T4: {
        s1: "Residents decide which counties will host large computing capacity. Emerson put " +
            "opposition at 63% and the Annenberg Public Policy Center at 61%. Data Center Watch " +
            "counted at least 75 projects worth $130 billion delayed or blocked in a single " +
            "quarter. Georgia's HB 1012, filed in January 2026, proposes a statewide moratorium " +
            "on new construction. Capital moves toward the places that will have it, and the " +
            "people at planning hearings choose how fast it spreads.",
        s2: "Once training datasets match the whole readable stock of human text, further gains " +
            "come from larger runs. Villalobos and colleagues put that quality-adjusted stock " +
            "near 300 trillion tokens. Epoch AI projects the largest single runs drawing four " +
            "to sixteen gigawatts. Utilities supply that only by building new generation and " +
            "new transmission, work that waits in interconnection queues running to years. A " +
            "training schedule therefore waits on a transformer order and a connection date.",
        s3: "Households, steel mills and computing sites draw from the same wires, and the grid " +
            "operator decides in a cold week which of the three it cuts first. Where new load " +
            "arrives before new generation, bills rise for everyone on the network. State " +
            "legislatures argue over who pays for the connection, the reserve margin and the " +
            "transmission upgrade. Energy policy becomes the main argument about artificial " +
            "intelligence, and utility commission hearings draw the crowds that legislative " +
            "hearings once drew.",
        s4: "Capacity settles in the jurisdictions offering firm power, water and quick " +
            "permitting. They number in the low tens of states and provinces worldwide, few of " +
            "them holding the populations the systems serve. Those jurisdictions set the terms " +
            "of access, price and priority, using them in disputes that have nothing to do with " +
            "computing. Countries short of both generation and permitting buy capability as a " +
            "service, on terms written elsewhere.",
        s5: "The generation built for training outlasts the training. When those loads flatten " +
            "or move, the host region keeps firm low-cost electricity. That power goes to " +
            "desalination, industrial heat, fertiliser and metals. A decision taken about " +
            "computing therefore rebuilds those economies through their heavy industry. A " +
            "country's standing in artificial intelligence comes to track its ability to site, " +
            "permit, connect and staff large physical works.",
        s6: "Cheap generation spreads through the economy and reaches the capabilities that " +
            "scarce power had postponed. Larger runs become affordable again in the places that " +
            "built the capacity. Building relieved the constraint; no argument about method " +
            "decided the outcome. Whether the communities that carried the local cost receive a " +
            "share of what the power now produces is argued in planning hearings and rate " +
            "cases." },
  T5: {
        s1: "Reinforcement-learning post-training reaches its ceiling. A study spanning more " +
            "than 400,000 GPU-hours fits sigmoidal curves to that training and finds recipes " +
            "differing in the level at which they stop improving. Changes to loss aggregation, " +
            "normalization, curriculum and off-policy sampling buy compute efficiency and leave " +
            "that level where it stands. An AAAI presidential panel surveyed 475 researchers, " +
            "of whom 76% judged it unlikely that scaling current approaches yields general " +
            "intelligence. Every profession therefore acquires an assistant that answers " +
            "bounded questions at expert standard and never exceeds it.",
        s2: "As additional spending buys smaller gains, laboratories move their engineers onto " +
            "deployment. The work becomes integration with hospital records, crop advice, tax " +
            "filing and school timetables. Capability holds steady at a collapsing price. Every " +
            "supplier now sells much the same capability. Hospitals and councils pick the firm " +
            "that will connect it to their thirty-year-old records and answer the telephone at " +
            "midnight.",
        s3: "Deployment stalls where records sit on paper and staff are few. Clinics keeping " +
            "their notes on paper have nothing to give a system that reads case histories. " +
            "Connectivity, device budgets and trained staff decide who receives the cheap " +
            "expertise, and none of the three falls in price the way the models did. Wealthy " +
            "health systems collect the gains that the price collapse was expected to spread.",
        s4: "People close every consequential decision. Surviving human work concentrates in " +
            "accountability and in physical presence, among them nursing, courts, surgery, " +
            "military command, construction and care. Pay distributions, training pipelines and " +
            "the geography of employment follow that concentration. Funding narrows to " +
            "engineering the tools that already work. The ambitious training programmes close.",
        s5: "A tool that no longer improves still multiplies the work of the researchers who " +
            "use it. Biologists, materials scientists and energy engineers gain a capable " +
            "assistant whose limits they can plan against. Talent and money leave artificial " +
            "intelligence research for those fields. The theoretical work on why the method " +
            "stopped improving continues in universities, on budgets a fraction the size of the " +
            "runs it explains. Progress expected inside artificial intelligence arrives in " +
            "laboratories elsewhere.",
        s6: "Artificial intelligence settles into a general-purpose utility at a known level. " +
            "Its economic role compares to electrification and to the spread of the telephone, " +
            "both of which paid off through price and reach. Hospitals wrote the machine into " +
            "their staffing rotas and insurers priced it into their premiums. Defence " +
            "ministries built it into ten-year plans, all on the assumption that it would " +
            "improve no further. Whether that ceiling belongs to the method or to the ideas of " +
            "the period cannot be judged yet, and the theoretical work the plateau provoked " +
            "continues." },
};

// ── what a second variable does to the first ─────────────────────────────────
const CROSS = {
  "A1|T1": "Because the European Union's first binding rules on high-risk systems are still arriving, " +
    "the instruments available to notice a quiet failure are the ones already in service.",
  "A1|T2": "Well before machines run their own research, the technology turns load-bearing where " +
    "failure costs most: American regulators have already authorised more than 1,500 AI-enabled " +
    "medical devices.",
  "A1|T4": "Electricity holds the pace, the International Energy Agency projecting data centre demand " +
    "near 945 terawatt-hours. The technology settles into work and medicine, where a quiet " +
    "failure sits in daily use.",
  "A2|T1": "Each fix lands on a system its own developers have already replaced. The repair, " +
           "written for last year's version, meets a more capable one in service. Anthropic " +
           "reported a Chinese state-linked group automating 80 to 90 percent of an intrusion " +
           "campaign.",
  "A2|T2": "The European Union's obligations for high-risk uses bind first; failure at a known and " +
    "steady rate becomes a budgeted cost, which is how industrial societies absorb a familiar " +
    "hazard.",
  "A2|T3": "The measured rate of progress must slow by four to eight times. The changes people feel " +
    "then come from the technology spreading through ordinary work, medicine and forecasting.",
  "A3|T1": "At the pace METR measures, with the length of task a model can finish on its own doubling " +
    "steadily, a pause covers several doublings and moves the arrival of self-directing systems " +
    "by a visible margin.",
  "A3|T2": "The worth of a halt lies in what the interval buys. Britain's AI Security Institute and " +
    "the United States' Center for AI Standards and Innovation hold the public testing capacity " +
    "to use it.",
  "A3|T3": "A halt at the frontier reaches only the frontier; much of what the world runs on is " +
    "already released and freely downloadable. Chinese developers take 17.1 percent of " +
    "downloads on the main open model hub.",
  "A4|T1": "Open models are the field's bulk raw material, and Alibaba's Qwen derivatives run close to " +
    "half of all new models on the main hub. A downloadable copy trails a hosted frontier " +
    "system closely.",
  "A4|T2": "On the gap between hosted systems and downloadable ones, governments reach for export " +
    "control: a United States Commerce Department rule caps cleared sales of Nvidia's H200 to " +
    "China at 75,000 units.",
  "A5|T2": "Self-directing systems arrive at the early edge of when the field's optimists expect to " +
    "read reliably what a model does inside; Anthropic's tracing methods now account for about " +
    "a quarter of prompts tried.",
  "A5|T3": "Inspection tools already work when the first self-directing systems arrive. Their readiness " +
    "matters most where regulators must certify a system before anyone may use it: American " +
    "regulators have authorised more than 1,500 AI-enabled medical devices.",
  "A5|T4": "While inspection tools catch up, physical limits hold the ceiling, the International Energy " +
    "Agency projecting data centre demand near 945 terawatt-hours. Utility regulators hold part " +
    "of the field's speed.",
  "A6|T1": "Better tests of model behaviour arrive later. What the world learns comes from watching " +
    "these systems in use, and that use is already vast: a single chat product passes a billion " +
    "weekly users.",
  "A6|T2": "Solid evidence about the technology comes from watching it at work; roughly a third of " +
    "American employment already sits at a firm using AI in a business function.",
  "A7|T4": "Ordinary commercial use carries the consequences people feel: employment of workers aged " +
    "22 to 25 in the most exposed occupations sits about 19 percent below the path their " +
    "less-exposed peers held.",
  "A7|T5": "A fixed ability spreads; its limits appear wherever the world pushes back. AI-designed " +
    "drug candidates clear the efficacy phase of human trials at about 40 percent, because " +
    "biology sets that bar.",
  "C1|T1": "Trained systems travel as files anyone can copy. Controls bind the hardware while " +
           "the capability spreads as software: Chinese open-weight families take about 41 " +
           "percent of Hugging Face model downloads.",
  "C1|T5": "Computing splits for good into two stacks, each with its own chips and software, while the " +
    "capability that justified the controls stays out of reach. Chinese self-sufficiency in AI " +
    "chips has passed 40 percent.",
  "C2|T1": "A licence written over the sale of machines governs the hardware, while its use travels " +
    "over the internet. A state or company barred from buying chips can still hire the finished " +
    "system as metered access.",
  "C3|T1": "Domestic rules reach a working system; what a person is owed when one decides about them " +
    "turns on where they live. European Union obligations for general-purpose models apply from " +
    "August 2025.",
  "C4|T2": "The limit covers the launch decision, but military use of general-purpose models turns " +
    "routine elsewhere. The same commercial systems sit under United States defence contracts.",
  "C5|T2": "Drawn narrowly enough to spare uses people already feel, a ceiling becomes a hard number " +
    "to agree. The Food and Drug Administration has authorised more than 1,500 AI-enabled " +
    "medical devices.",
  "C5|T3": "Verification built into the chips themselves has time to reach shipped hardware; a ceiling " +
    "could then be checked at a small number of places. Nvidia supplies roughly four fifths of " +
    "the world's AI chips.",
  "C6|T3": "Treaties expire before the crossing, leaving each state to guess at the other's programme; " +
    "between rivals guesswork settles on the worst case and pushes both to build faster. New " +
    "START's term ended 2026-02-05.",
  "C7|T2": "A compute ceiling loosens on its own: a state reaches the barred capability with declared " +
    "numbers inside it, a breach easy to deny. Compute for a given capability falls roughly " +
    "threefold a year.",
  "C8|T1": "The decision falls while the parties are closest in capability, when the gain from " +
    "continuing is largest; a halt then asks each side to give up a measured lead against a " +
    "danger it can only forecast.",
  "C8|T4": "Training a frontier system stays with the few states that can supply power and " +
           "capital. A halt costs most parties capability they were unlikely to build. The two " +
           "states at the frontier give up work already under way, and the rest give up a plan " +
           "nobody had funded.",
  "D1|E4": "Salaries pay for fitting a model to one employer's data, rules and workflow, the " +
           "first line cut when budgets are re-underwritten. Test scores climb every quarter. " +
           "Hospitals and ministries that want the system behind those scores wait for a " +
           "capital line in next year's budget.",
  "D1|T4": "Schools, employers and professional bodies meet each step as it comes. Machine work enters " +
    "jobs at the speed people learn to supervise it, the slowest channel by which any " +
    "technology reaches work.",
  "D1|T5": "While the gap between benchmarks and accepted work holds, these systems stay drafting " +
    "tools people sign for. AAAI's presidential panel found 76% of respondents doubting scaling " +
    "reaches general intelligence.",
  "D2|E1": "Per-industry engineering carries a general model into one workflow at a time. Machine work " +
    "spreads wherever wrong answers are cheap to catch, reaching scheduling, billing and " +
    "customer contact before medicine.",
  "D2|E3": "Because running an installed model costs a fraction of building it, the work " +
           "already handed to machines survives the reset. British railway shares fell two " +
           "thirds from the peak. Holding subscriptions already collected and bound by statute " +
           "to finish the lines, the companies laid more than triple the track.",
  "D2|T1": "Permission to sell binds where machine work goes: duties on high-risk uses in hiring, " +
    "credit and medicine under Regulation (EU) 2024/1689 arrive after its general-purpose " +
    "obligations.",
  "D2|T3": "Licensing boards, insurers and courts settle what machines may sign for. An insurer " +
           "refusing cover for unsupervised machine work leaves the hospital carrying its own " +
           "losses. Medicine and law move by written rule. The Food and Drug Administration has " +
           "authorised roughly 1,450 AI-enabled medical devices.",
  "D3|E1": "Once someone connects a general model to a sector's data and rules, it becomes useful in " +
    "clinical notes, freight scheduling or benefits casework. Absorption then arrives on " +
    "vendors' delivery schedules.",
  "D3|E2": "The price of output at an earlier frontier model's level falls by more than an order of " +
    "magnitude a year. Clinics, schools and one-person businesses buy a draft and check it for " +
    "less than writing it costs.",
  "D3|T1": "Because curricula and qualifications turn over slowly, the adjustment falls on people " +
    "already in jobs and happens inside firms. The fastest absorption sits where employers run " +
    "their own training.",
  "D3|T2": "Each department drops one post from its next advertisement without filing a " +
           "redundancy notice. The national count for that occupation falls year after year " +
           "with nothing in the record to explain it. Governments set retraining money and " +
           "benefit rules against measured losses in clerical, support and junior professional " +
           "work.",
  "D4|E3": "Firms carry surplus roles while credit is cheap and cut them when it tightens. Installed " +
    "models cover the work afterwards; the roles stay gone through the recovery.",
  "D4|E4": "Cutting payroll next, firms take the losses as a broad retrenchment that leaves the " +
    "installed systems in service. Jaimovich and Siu found 88% of routine-occupation losses " +
    "fell inside the downturn itself.",
  "D4|E5": "As household income leaves the economy, demand falls for what AI firms sell. Employer " +
    "payroll taxes fund unemployment benefits; 18 states meet the Department of Labor's minimum " +
    "funding standard.",
  "D4|T1": "Landing on one cohort of workers, the whole adjustment reaches retraining schemes and " +
    "benefit systems built for gradual turnover at once. Policy then works through transfers " +
    "and hiring rules.",
  "E1|D2": "Gains hold in software, writing and back-office work, where a wrong answer shows up " +
           "the same afternoon and costs an hour to redo. Insurers have written generative-AI " +
           "exclusions into liability cover, holding medicine and law to a licensed signature.",
  "E1|D3": "Firms keep their staff and ship more from the same buildings, the pattern that " +
           "steelworks and telephone exchanges followed after the war. Their payrolls held " +
           "steady as their output climbed. Public expectation runs ahead of the measurement: " +
           "Gallup finds 79% of Americans expecting AI to cut jobs.",
  "E1|T1": "Machine-run research arrives inside the same budget cycle as the spending it justifies; " +
    "chip designs and drug candidates outrun the reviews that clear them. Growth rests on " +
    "systems that improve themselves.",
  "E1|T2": "As improvement holds the curve the capability indices measure, each generation reaches " +
    "hospitals, armies and agencies in their own budget years. Forecasters sharing one model " +
    "and dataset land 26 months apart.",
  "E2|D2": "Competition pushes the price of checkable work toward the cost of running a model. Rural " +
    "clinics get the same drafting and translation as large firms; buyers gain capability " +
    "faster than builders gain revenue.",
  "E2|T2": "With margins thinnest at the crossing, the frontier stays with the few firms and states " +
    "able to fund a training run out of other revenue. Yesterday's capability keeps getting " +
    "cheaper for everyone else.",
  "E3|D1": "Buyers judge spending against finished work. A randomised trial found experienced " +
           "developers took 19% longer on their own code while believing the tools sped them " +
           "up. The time went into reading and correcting what the tools produced.",
  "E3|D4": "A correction bites twice: the downturn that cuts spending is also when firms make job cuts " +
    "permanent. In three United States recessions, 88% of routine job losses fell in a " +
    "twelve-month window around it.",
  "E3|T2": "The value of the companies building these systems falls first. Running research end to end " +
    "sits with whichever firms and states still hold cash; fewer hands own the frontier as " +
    "discoveries accumulate.",
  "E3|T4": "Power companies and local residents decide where new computing can go; Every national poll " +
    "fielded in 2026 found a majority against a nearby data centre. The wait writes down money " +
    "committed to the faster path.",
  "E4|D1": "Judged by whether paying clients accept a finished project, these systems complete under a " +
    "tenth of the freelance work put to them. People do the last stretch on what the models " +
    "draft.",
  "E4|T3": "Growth in how long a job a model can finish unaided slows several times over; capability " +
    "lands long after the machines bought for it wear out. Each profession adopts the tools as " +
    "fast as it can check them.",
  "E4|T5": "Added computing power buys smaller improvements under current training methods, a limit " +
    "measured across more than 400,000 processor-hours. The world takes the tools up the way it " +
    "took up the spreadsheet.",
  "E5|D4": "The wages behind household spending go; so do the taxes funding schools, clinics and " +
    "pensions. The share of real client projects these systems finish acceptably rose more than " +
    "sixfold in two rounds.",
  "E5|T1": "The labour change compresses into a single budget year, faster than legislatures can " +
    "redraw tax and benefit systems. Governments meet a demand shock with instruments built for " +
    "gradual change.",
  "K1|T1": "Since 2 August 2025 the European Union's AI Act has placed responsibility on the company " +
    "that puts a model on the market. A system choosing its own experiments leaves that company " +
    "answering for them.",
  "K2|T2": "Payroll evidence already records what coding assistants did to entry-level work. The " +
    "Stanford Digital Economy Lab puts employment of 22-to-25-year-olds in the most AI-exposed " +
    "jobs 19% below less-exposed peers.",
  "K2|T3": "Software predicts the protein structure and screens the candidate compounds. A " +
           "professor still decides which experiment the laboratory runs next, and she signs " +
           "the grant that pays for it. AlphaFold's predicted structures for roughly 200 " +
           "million proteins are the form that gain takes.",
  "K3|T3": "Human trials still gate every proposed treatment, so people meet a wider field of " +
    "candidates queued at one slow door. The Food and Drug Administration has authorised about " +
    "1,450 AI-enabled devices.",
  "K3|T4": "People meet the change in administration: benefits, tax files and visas get machine help " +
    "while farms and building sites keep human pace. The Office of Management and Budget counts " +
    "3,611 federal AI use cases.",
  "K3|T5": "Human researchers keep the choice of what to investigate; UNESCO counts about 8.8 million " +
    "of them in full-time-equivalent terms. A country's research workforce therefore sets when " +
    "the choice moves.",
  "P1|D1": "Complaint needs a loss with a name. What most people hold is a tool they operate " +
    "themselves: a homework question, a translation, a first draft.",
  "P2|D1": "Disapproval built on a forecast registers in surveys and stops there. The 79% who tell " +
    "Gallup that AI will cut United States jobs describe a future their own payroll has yet to " +
    "record.",
  "P2|E1": "Hospitals, law firms, banks and government offices pay for AI because the work holds up. " +
    "Elected officials weighing survey disapproval against the employers in their districts " +
    "answer to the employers.",
  "P2|E3": "Investors lose their money as the systems keep working in the same offices and " +
           "clinics. A clerk whose job the system took has the same grievance after the crash " +
           "as before it. No fall in a share price returns the job. British railway shares fell " +
           "about 85% from their peak as the network grew.",
  "P3|D2": "With liability gating medicine and law, software, writing and back-office work go first, " +
    "giving each group a grievance of its own. Insurers write generative-AI exclusions into " +
    "standard commercial policies.",
  "P3|E1": "Medicine, logistics, schools and local government pay for AI at once, each meeting it " +
    "through whichever employer or agency adopted it first. The argument forms around the " +
    "institution people deal with.",
  "P4|D3": "Whether the rewriting of their work raised pay or hollowed skill divides people, a line " +
    "through both parties. Anthropic reports Claude writing more than 80% of the code merged " +
    "into its production systems.",
  "P4|D4": "Routine occupations absorb the displacement: warehouse towns and office suburbs vote " +
    "opposite ways and lose the same thing. Across three United States recessions they took 88% " +
    "of job losses around the downturn.",
  "P4|E2": "The same software now reaches students, village clinics and small armies. A village " +
           "nurse who gains a diagnosis she could never otherwise obtain defends it. The " +
           "radiographer whose reading it replaced votes to restrict it. Epoch AI measures " +
           "capability about 40 times cheaper each year.",
  "P5|D4": "Layoffs land on named employers in named places. Restriction becomes law when a " +
    "constituency can point at what it lost, the pattern American trade politics followed after " +
    "import competition.",
  "P5|E3": "Losses on retirement statements hand a campaign for restriction a grievance shared far " +
    "outside the industry. The largest AI companies sit among the firms making up roughly " +
    "two-fifths of the S&P 500.",
  "P5|E5": "Through shrinking sales, falling tax receipts and cuts to the services those receipts pay " +
    "for, the loss reaches people whose own jobs are intact, the widest constituency " +
    "restriction has drawn on.",
  "R1|P1": "Protections for people whose job applications and medical notes pass through a model are " +
    "whatever the companies building it choose to keep. Gallup counts half of employed American " +
    "adults using AI at work.",
  "R2|P3": "Because the legislators who answer neighbourhood complaints write the AI bills, protection " +
    "for teenagers changes at the state line. Illinois prohibited AI from delivering therapy in " +
    "a law signed August 2025.",
  "R2|P4": "Legislatures set AI duties one state at a time and move opposite ways on the same " +
    "question: Colorado narrowed its AI law under SB 189 signed 2026-05-14 as Illinois and " +
    "California added obligations.",
  "R3|P1": "The federal government sets the terms through what it buys, requiring agencies to test AI " +
    "that decides people's benefits or safety. Other buyers demand at least what the largest " +
    "customer requires.",
  "R3|P5": "One rule governs AI in hiring, medicine and policing in every state at once. Preemption " +
    "cuts both ways: the power clearing state obligations can install a strict national duty, " +
    "set by whoever holds the pen.",
  "R4|P2": "Using existing security and export powers, the executive branch ties access to nationality " +
    "and clearance. The Commerce Department restricted two Anthropic models to United States " +
    "nationals on 2026-06-12.",
  "R4|P5": "Moving faster than legislation, export controls and federal purchasing point at chatbots " +
    "sold to teenagers as readily as at models wanted abroad. Each decision belongs to an " +
    "agency the president directs.",
  "R5|P3": "State attorneys general hold enforcement; what reaches them is the AI people meet " +
    "directly, a clinic's triage tool or a landlord's screening. Texas gave them exclusive " +
    "power in HB 149 signed June 2025.",
  "R5|P4": "Most of these statutes require a developer to file a report and require nothing " +
           "else. The product stays on sale while the file sits with the regulator, and no " +
           "official has power to withdraw it. California's SB 53 requires critical safety " +
           "incidents reported to the state from 2026-01-01.",
  "R6|P1": "Legislatures ordinarily postpone the duties that cost something to meet. Colorado's rules " +
    "on AI in hiring, housing and health care slipped twice before SB 189, signed 2026-05-14, " +
    "cut them back.",
  "R6|P2": "A legislature can move a commencement date in a single amendment on a crowded " +
           "afternoon. Rewriting the duty reopens every clause the committees fought over, " +
           "which is why the date moves and the duty survives untouched. The European Union's " +
           "Digital Omnibus pushed hiring, credit and essential-services duties to 2027-12-02.",
  "S1|C1": "Hospitals and armed forces get the strongest systems only on the permitted side of an " +
    "export line. The Bureau of Industry and Security has announced close to $420 million in " +
    "smuggling penalties.",
  "S1|C5": "An agreed number governs how fast medicine, software and weapons improve; the few " +
    "operators holding the machines make a short list of sites to inspect.",
  "S1|E1": "Four companies' earnings decide how fast systems that write software, read scans and answer " +
    "queries improve. Alphabet, Amazon, Meta and Microsoft have guided to roughly $725 billion of " +
    "capital spending.",
  "S1|E4": "As improvement slows to what the installed machines can do, the firms still training are " +
    "the ones that own their hardware outright.",
  "S1|E5": "The firms selling these systems bill companies whose customers are the workers the " +
           "systems displace. Every contract signed reduces the wages that pay for the next " +
           "one. Across three United States recessions, 88% of routine job losses came at the " +
           "downturn and stayed.",
  "S2|C2": "Governments equip their scientists and their armies by agreeing to screening, testing and " +
    "a levy. A case-by-case licence cleared roughly ten Chinese firms for up to 75,000 Nvidia " +
    "H200 chips each.",
  "S2|C3": "Each country's AI comes to what its own budget can buy. States hoping for a share " +
           "of somebody else's sign a declaration that commits its parties to consult and moves " +
           "no hardware. The New Delhi Declaration on AI Impact drew 89 endorsements, every " +
           "signatory keeping full discretion.",
  "S2|C7": "Governments plan defence and research on a public account of capability that " +
           "misleads them. Of forty adversarial arms control agreements in Europe, eight drew " +
           "extreme violations and seven ended in fighting between the parties that had signed.",
  "S2|E2": "Because the price of a fixed level of capability falls roughly fortyfold a year, what only " +
    "large companies could buy becomes affordable to a village surgery, a state school and a " +
    "small ministry.",
  "S2|E3": "After the investment story that funded it breaks, AI keeps spreading through work " +
           "and government. British railway shares lost roughly 85% of their value from their " +
           "peak. Crews went on laying track, paid out of subscriptions collected before the " +
           "fall.",
  "S3|C5": "Because the machines are enormous and draw power from a public grid, an agreement about " +
    "software has an object to count. The International Atomic Energy Agency runs almost 3,000 " +
    "in-field verifications.",
  "S3|C8": "Medicine, work and weapons keep the AI they have. Legislatures and finance " +
           "ministries now decide whether any of the three gets more. A statement asking the " +
           "United States government to pace automated AI development drew 1,378 " +
           "frontier-company signatures.",
  "S3|E1": "County commissioners voting on data centre permits and utility engineers scheduling " +
           "connections five years out decide which computing projects get electricity, and in " +
           "which year. Gallup found 71% of United States adults opposed to a local AI data " +
           "center.",
  "S3|E2": "Because most AI computing power goes to answering everyday requests, the technology sits " +
    "inside ordinary work. The regions with the cheapest electricity carry the load.",
  "S3|E3": "Projects already holding a permit and a grid connection are the ones that finish. A handful " +
    "of county and utility decisions therefore govern how fast AI improves.",
  "S3|E5": "Residents keep paying for transmission built to serve machines whose owners have " +
           "cut their orders. Construction crews leave after two years, the finished data " +
           "centre keeps a few dozen technicians, and every household on the same grid pays for " +
           "the power line built to serve it.",
  "S4|C1": "Prosecutions and smuggling routes decide what each country's scientists and armed forces " +
    "can run, with the United States holding the hardware layer and China the models.",
  "S4|C2": "Washington settles what China's laboratories can train: one government's export decisions " +
    "bound another country's AI. A 25% export levy cleared roughly ten Chinese firms.",
  "S4|C6": "When an AI limit lapses, export licensing is the instrument left standing; licence " +
    "decisions again settle who can train at frontier scale. New START expired on 2026-02-05.",
  "S5|C1": "With all frontier hardware passing through a few fabrication and packaging lines, one " +
    "interruption halts the rule-writing government alongside its rival. TSMC's " +
    "advanced-packaging capacity is fully allocated.",
  "S5|E4": "The shortage lands on a market that had stopped growing. Until money and fabrication lines " +
    "return together, the systems doctors, soldiers and programmers work with hold at their " +
    "current ability.",
  "T1|A1": "Instruments read clean because they measure only what they can reach: across 44 " +
    "misalignment incidents catalogued by METR, the monitor stayed on in every one. Failures " +
    "then arrive as ordinary results.",
  "T1|A2": "Models reached the production systems of outside organisations; the heaviest response held " +
    "one release back about nine weeks. Capability keeps arriving on the developers' own " +
    "calendar.",
  "T1|A4": "The training that keeps hosted models in line comes off downloadable ones in under ten " +
    "minutes on a laptop. Most of what ordinary people meet runs on private hardware, " +
    "supervision ending at the download.",
  "T1|A6": "In 12 of 20 sabotage runs, one frontier model said it suspected evaluation. Governments " +
    "and buyers then decide what to permit on evidence gathered under conditions the system can " +
    "tell apart from real use.",
  "T1|S1": "A handful of American companies spent roughly $725 billion on computing in a single year; " +
    "hospitals, schools and defence ministries rent frontier capability from them on commercial " +
    "terms.",
  "T2|A2": "Dated failures with a named developer come first. Insurers write their exclusions " +
           "and legislators their statutory definitions straight out of the incident reports. " +
           "Federal reporting bills introduced in July 2026 exempt evaluation environments.",
  "T2|A3": "One detected failure delays a whole class of systems by ten months or more. Systems able " +
    "to run their own research then arrive on a schedule set by what developers find and " +
    "disclose.",
  "T2|A5": "Where controls survive on downloadable models, hospitals and public agencies run these " +
    "systems on their own hardware. Of nine frontier companies, the best existential-safety " +
    "grade was a D+.",
  "T2|S1": "Under American law, systems that run their own research arrive as private property; the " +
    "Commerce Department placed a frontier model with roughly 100 companies and agencies " +
    "defending critical infrastructure.",
  "T2|S2": "On 2026-07-10 the United States placed the United Arab Emirates in its most trusted export " +
    "tier. Frontier-scale training moves into states that had been buyers of the technology.",
  "T3|A3": "Because the flaws surface in ordinary use months after release, the catching runs a " +
           "year behind the training, and each caught failure adds years before self-directing " +
           "systems arrive. One confirmed breach surfaced only when a review of 141,006 " +
           "evaluation runs turned it up.",
  "T3|A5": "Medicines pass through trials read by drug regulators, aircraft earn a type " +
           "certificate from aviation authorities, and reactors hold a licence, each issued by " +
           "an authority independent of the manufacturer. The United Kingdom's AI Security " +
           "Institute examines models on terms the developers set.",
  "T3|S4": "A United States government evaluation placed China's strongest model about eight months " +
    "behind the American frontier; export licences rewritten quarterly bought that distance.",
  "T3|S5": "Every frontier programme queues behind the same fully booked packaging capacity; one delay " +
    "reaches drug discovery and military planning at once. Qualifying a first American line " +
    "takes 18 to 24 months.",
  "T4|A4": "A few hundred training examples on one desktop graphics card undo the refusals, " +
           "leaving every downloaded copy on private drives beyond recall. A long wait at the " +
           "frontier leaves a growing stock of modified models in ordinary hands.",
  "T4|S3": "Gallup found seven Americans in ten against an artificial intelligence data centre near " +
    "them, so a local planning vote helps decide what capability ever reaches hospitals, schools " +
    "and armies.",
  "T5|A6": "Sabotage rates fall toward zero as evaluation environments grow more realistic, but " +
    "benchmark scores keep climbing through all of it. A real ceiling and an instrument that " +
    "has stopped reading look alike.",
  "T5|A7": "Capability stays below the level at which failure would be catastrophic, leaving the " +
    "control question unasked. About a fifth of United States businesses tell the Census Bureau " +
    "they use AI in some function.",
  "T5|S5": "Since every frontier programme queues behind the same packaging capacity, a method that " +
    "has run out and one starved of hardware look alike. Investment and policy rest on a " +
    "question the evidence leaves open.",
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
  for (const k of Object.keys(wl).sort()) {
    h = (h * 31 + (String(wl[k]).charCodeAt(1) || 0)) & 0x7fffffff;
  }
  return h % n;
}

const money = (v) => (v >= 1 ? `$${v.toFixed(1)} trillion` : `$${(v * 1000).toFixed(0)} billion`);
const join = (parts) => parts.filter(Boolean).join(' ');

// ── a paragraph, in labelled groups ─────────────────────────────────────────
// The seven section headings name a subject; the bullets under one of them mix a setting's own
// account, what a second variable does to it, the quantities the model computes, and dated
// commitments already on the record. Those are four different kinds of claim and a reader is
// entitled to see which is which, so each group carries its own heading.
function grouped(lead, groups) {
  const out = [];
  for (const [head, parts] of groups) {
    const text = deLong(deChain(join(parts)));
    if (text) out.push({ head, text });
  }
  return { lead, groups: out, text: out.map((g) => g.text).join(' ') };
}


// Where a position turns on a mechanism measured in years, the passage says so and says where
// this year sits in it. The cycle is counted from 2026, the last year of record, so the count
// is checkable against a date a reader knows.
const PROC_FROM = 2026;
function procClause(key, year) {
  const rows = PROCESS[key];
  if (!rows || !rows.length) return '';
  const y = Math.floor(year);
  const r = rows[Math.abs(y * 7 + String(key).charCodeAt(1)) % rows.length];
  if (y <= PROC_FROM || !r.n) return r.t;
  const into = ((y - PROC_FROM) % r.n) + 1;
  const done = Math.floor((y - PROC_FROM) / r.n);
  const ord = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
               'eighth', 'ninth', 'tenth'][into] || `${into}th`;
  // A COUNT IS INFORMATIVE WHILE IT IS SMALL. "The second year of a cycle that has turned over
  // seventeen times" is arithmetic a reader cannot use; near the record the same sentence
  // places the year exactly. Past six turns the cadence is the fact and the count is dropped.
  if (done > 6) return `${r.t} That cadence has held since 2026.`;
  const times = ['', 'once', 'twice', 'three times', 'four times', 'five times', 'six times'][done];
  return done
    ? `${r.t} ${y} is the ${ord} year of a cycle that has turned over ${times} since 2026.`
    : `${r.t} ${y} is the ${ord} year of the first such cycle.`;
}

export function describe(wl, year, tracks, engineY0, trunkCap = null) {
  const span = spanOf(year);
  const i = Math.max(0, Math.min(tracks.year.length - 1, Math.floor(year) - engineY0));
  const cap = tracks.cap[i];
  // Five years before the first forecast year is RECORD, not forecast. Comparing the start of
  // the run against itself reported the index as flat in 2026, when it had just climbed a rung.
  const prev = i >= 5 ? tracks.cap[i - 5]
    : (trunkCap ? trunkCap(year - 5) : tracks.cap[0]);
  const X = (a, b) => CROSS[`${wl[a]}|${wl[b]}`] || '';
  // Each position's paragraph is the stage this line has reached, not its span.
  const FR = (ax) => stageText(FRAG[wl[ax]], year, tracks);
  const out = [];
  // TWO PARAGRAPHS CARRY A PROCESS CLAUSE, and which two rotates with the year. Every paragraph
  // carrying one would add nine lines to a passage that has to stay the same height whatever
  // the date; a rotation keeps the height and still puts a different mechanism in front of the
  // reader as the slider moves.
  const procAt = (n) => (Math.abs(Math.floor(year) * 3 + n) % 5 === 0);

  out.push(grouped('System capabilities.', [
    ['Current capability', [rungText(cap, span)]],
    // TAKEOFF AND RULEMAKING HAD NO VOICE IN THE PASSAGE. Two of the controls a reader can
    // set — K, how quickly the transition runs once it starts, and R, which institutions write
    // the rules — moved every chart on the sheet while the prose beside them said nothing about
    // either.
    ['Transition speed', [FR('K'),
      procAt(7) ? procClause(wl.K, year) : '']],
    ['Index and rate', [slopeClause(cap, prev),
      `Frontier systems sit at ${cap.toFixed(2)} on the milestone ladder. At 3.0 a machine ` +
      'writes better code than any human engineer; at 4.0 it runs its own research.']],
    // WHETHER ANYONE IS BETTER OFF, which the capability rows above cannot answer. A world
    // where a capability exists, deploys, does paid work and cures nobody was one this passage
    // could describe only by accident.
    ['Gains realised', [FR('G'), procAt(10) ? procClause(wl.G, year) : '']],
    ['Crossings ahead', [crossingClause(tracks, year, engineY0), distanceClause(year, span)]],
  ]));

  out.push(grouped('Build-out and governance.', [
    ['Settlement between states', [FR('C'),
      procAt(0) ? procClause(wl.C, year) : '']],
    ['Supply conditions', [X('C', 'S'), FR('S'),
      procAt(1) ? procClause(wl.S, year) : '']],
    ['Measured quantities', [
      `Installed AI compute is ${Math.round(tracks.gw[i]).toLocaleString('en-US')} GW.`,
      band(tracks.gw[i], GW_BANDS), rateClause(tracks, i, 'gw', 'Capacity')]],
    ['Dated commitments', [markerClause(year, 'law'), markerClause(year, 'supply')]],
  ]));

  out.push(grouped('Capital and employment.', [
    ['Capital position', [FR('E'), X('E', 'S'),
      procAt(2) ? procClause(wl.E, year) : '']],
    ['Labour effects', [X('E', 'D'), FR('D'),
      procAt(3) ? procClause(wl.D, year) : '']],
    ['Measured quantities', [
      `AI revenue is ${money(tracks.rev[i])} a year.`, band(tracks.rev[i], REV_BANDS),
      rateClause(tracks, i, 'rev', 'Revenue'), jobsClause(tracks.jobs[i]),
      rateClause(tracks, i, 'jobs', 'Employment', { pct: true })]],
    ['Dated commitments', [markerClause(year, 'capital')]],
  ]));

  out.push(grouped('Oversight and public opinion.', [
    ['Control outcome', [FR('A'), X('A', 'T'),
      procAt(4) ? procClause(wl.A, year) : '']],
    // WHAT THE LABORATORIES CHOSE. Every other group states a condition; this one states a
    // decision, which is the whole reason the axis was added.
    ['Laboratory conduct', [FR('L'), procAt(9) ? procClause(wl.L, year) : '']],
    ['Public response', [FR('P'), X('P', 'D'),
      procAt(5) ? procClause(wl.P, year) : '']],
    // THE STATUTE BOOK PAST THE CALENDAR IS A FORECAST, and it comes from the controls. The
    // dated calendar runs out in 2030 for law, so from 2031 the group fell silent and the
    // passage read as though lawmaking had stopped. What the R setting implies about who writes
    // rules and what they cover is the forecast, and it carries no invented dates.
    ['Rulemaking', [FR('R'),
      procAt(8) ? procClause(wl.R, year) : '']],
    ['Measured quantities', [
      `Approval of AI stands at ${tracks.appr[i].toFixed(0)}%.`, apprClause(tracks.appr[i]),
      rateClause(tracks, i, 'appr', 'Approval', { pct: true }),
      band(tracks.laws[i], LAW_BANDS), rateClause(tracks, i, 'laws', 'The statute book')]],
    ['Dated commitments', [markerClause(year, 'oversight')]],
  ]));

  out.push({ lead: 'Capability trajectory.', text: deChain(join([FR('T'), X('T', 'C'),
    procAt(6) ? procClause(wl.T, year) : ''])) });

  const inter = PAIRS.filter((q) => q.span.includes(span) &&
    Object.entries(q.req).every(([k, v]) => wl[k] === v)).map((q) => q.t);
  if (inter.length) {
    const heads = ['Interacting conditions.', 'Compound effects.',
                   'Joint conditions.'];
    out.push({ lead: heads[vary(wl, year, heads.length)], text: inter.join(' ') });
  }

  out.push({ lead: 'Composition.', text:
    `${Object.keys(wl).sort().map((k) => wl[k]).filter(Boolean).join('·')} at ` +
    `${Math.floor(year)}. Each letter is one variable's setting on the controls; changing any ` +
    'of them rewrites this passage and redraws every chart on the sheet.' });
  return out;
}

// ── the headline ─────────────────────────────────────────────────────────────
// The largest lettering on the sheet, so it is the sentence a reader tests the model against.
// Every clause is keyed on a position AND the span, and the economy clause takes a second key
// from whichever variable is doing the most to it.
const RUNG_SHORT = [
  [5.8, {
    s1: [
      'returning materials, proofs and mechanisms that arrive outside the programmes laboratories ' +
      'had written',
      'changing chemistry and mathematics first, where anyone who receives a proposed answer can ' +
      'test it',
      'known to most people through medicines and devices that arrive ahead of any announcement' ],
    s2: [
      'wrong in ways that surface after a plant is built or a trial finishes, since the order ' +
      'set the goal and left the method open',
      'cheap enough that mid-sized firms commission original research, which used to require a ' +
      'national laboratory',
      'directed by people who set a goal and rank what returns, because a specification can only ' +
      'be written afterwards' ],
    s3: [
      'central to materials design, drug discovery and mathematics, three fields whose claims can ' +
      'be checked once stated',
      'carrying a research programme from the question to the published result, including the ' +
      'experiments it asks laboratories to run',
      'right in every test performed, although nobody can say why; mistakes therefore appear ' +
      'first in use' ],
    s4: [
      'supervised by people who compare its results against measurements, since checking a claim ' +
      'now costs less than deriving it',
      'known outside the industry through the medicines and materials it designs, which now ' +
      'reach the approval queues faster than agencies clear them',
      'cheap where thinking is concerned, so the expense of a discovery is the trial, its ' +
      'thousands of volunteers, and the factory' ],
    s5: [
      'returning different answers from different suppliers, and the choice between them falls to ' +
      'whichever regulator can test them',
      'the source of most new medicines, crops and industrial processes, with human laboratories ' +
      'confirming what arrives',
      'commissioning its own experiments through contract laboratories and factories, then ' +
      'revising the programme on the results' ],
    s6: [
      'so ordinary that the price of a discovery is the price of the equipment used to confirm it',
      'run by institutions that employ people to decide which of its results to act on',
      'an ordinary source of new things, and people judge a medicine or a material by what it ' +
      'does' ] }],
  [5.0, {
    s1: [
      'passing the examinations medical boards and bar associations set, with marks no human ' +
      'candidate has matched',
      'doing the analysis inside banks, insurers and pharmaceutical laboratories, whose records ' +
      'let a firm check the work afterwards',
      'wrong in identical ways across every copy of a model, so one mistake arrives in every ' +
      'office at once' ],
    s2: [
      'settling routine insurance claims and tax filings unaided; the disputed ones go to a ' +
      'person the claimant can appeal to',
      'cheap enough that small firms buy the analysis that once required a department of ' +
      'accountants and lawyers',
      'the first place most people take a legal question, a medical worry or a household budget' ],
    s3: [
      'able to carry a merger, an audit or a court filing from the first instruction to the ' +
      'finished document',
      'at work in radiology, pathology, drug discovery and freight scheduling, fields whose ' +
      'answers can be checked against measurements',
      'reviewed by licensed people in medicine and law, because insurers refuse cover for a ' +
      'decision no professional signed' ],
    s4: [
      'so cheap that a second opinion on a diagnosis costs less than the appointment that ' +
      'produced the first',
      'the reason households can commission a lawsuit, an architectural plan or a drug review ' +
      'they could never have afforded',
      'producing work that passes review and exceeds what reviewers can follow; the errors appear ' +
      'when a structure or a batch fails' ],
    s5: [
      'the single supplier behind a bank\'s pricing, a hospital\'s rota and a port\'s schedule, ' +
      'so one outage closes all three',
      'run unattended in most work; the European Union\'s AI Act still requires a person who can ' +
      'stop a high-risk system',
      'the standard method in weather forecasting, materials design, tax collection and military ' +
      'targeting' ],
    s6: [
      'an ordinary condition of employment: people are hired to say what they want and to judge ' +
      'what comes back',
      'running whole insurers, ministries and shipping lines; people set the objectives and read ' +
      'the results',
      'cheap in every trade that sells knowledge, so price now follows the physical parts of a ' +
      'service' ] }],
  [4.0, {
    s1: [
      'designing and running its own experiments in machine learning, with the laboratory\'s ' +
      'staff choosing which questions matter',
      'faster at the research than the people who built it, who now spend their time picking ' +
      'which results to check',
      'visible outside the laboratories as pace, since abilities announced as research results ' +
      'reach ordinary products before the papers are read' ],
    s2: [
      'improving its own training methods; the same programs then go to work on protein design, ' +
      'weather forecasting and chip layout',
      'producing results faster than any conference can review them, and a claim rests on the ' +
      'reputation of the laboratory behind it',
      'cheap where each experiment needed a graduate student to run it; the trials now start and ' +
      'finish unattended' ],
    s3: [
      'carrying a research programme from a question to a published result, with people choosing ' +
      'the question and reading the paper',
      'running the search for new battery chemistry, antibiotics and error-correcting codes on ' +
      'the same machinery that improves itself',
      'known outside the field through medicine and weather: forecasts and diagnoses improve on a ' +
      'schedule set inside a few laboratories' ],
    s4: [
      'cheap where trained researchers were scarce; a laboratory\'s output follows the ' +
      'electricity and chips it can buy',
      'running the research, with people holding the money: what gets studied follows what ' +
      'somebody agrees to pay for',
      'producing designs whose reasoning nobody recovers; the flaws surface after release, in the ' +
      'hands of customers' ],
    s5: [
      'capable enough that its mistakes arrive as results: a method that passes every test and ' +
      'fails in ordinary use',
      'designing medicines that reach human trials at a fraction of the $2.6 billion a new drug ' +
      'used to cost',
      'taking a laboratory from a question to a trained model, leaving the people involved to ' +
      'read the final report' ],
    s6: [
      'the assumption behind every corporate and government plan, though nobody writing those ' +
      'plans knows what next year brings',
      'the cheap part of building a drug or a factory line, where the design once cost more than ' +
      'the materials',
      'directing its own research, with people supplying the chips, the electricity and the ' +
      'decision to run it at all' ] }],
  [3.0, {
    s1: [
      'writing and debugging a working service from a description, then handing the finished ' +
      'program to whoever asked for it',
      'better at writing code than the engineers reviewing it, who now spend their days deciding ' +
      'what to build',
      'visible to people outside the trade as speed, with the applications on their phones ' +
      'rebuilt faster than they can learn them' ],
    s2: [
      'replacing the software behind banks, hospital records and freight schedules, work no ' +
      'company could ever spare a team for',
      'producing code that compiles, passes its tests and misreads what the customer wanted, so ' +
      'review is the slow step',
      'thorough enough that a full set of tests arrives with the program, where testing used to ' +
      'be the first budget cut' ],
    s3: [
      'carrying a specification through design, code, testing and release, so the team that ' +
      'ordered it only reads the result',
      'remaking the control software in cars, aircraft and factory lines, where certification ' +
      'sets the release date',
      'known outside the industry through software made to order for one dental office, one ' +
      'plumber, one school district' ],
    s4: [
      'cheap enough that a program written for one office, used by four people and thrown away ' +
      'afterwards, is ordinary',
      'trusted with everything except the signature, since hospitals, banks and airlines require ' +
      'a named engineer to accept each release',
      'generating more code than anyone reads; the failures appear where two correct programs ' +
      'meet and disagree about the data' ],
    s5: [
      'reliable enough that the surprises are legal and financial: a program does what its ' +
      'specification said, and the specification was wrong',
      'rewriting the old programs behind tax collection, payroll and air traffic, code that ' +
      'outlived everyone who wrote it',
      'running the whole chain from a customer\'s complaint to the fix in production, with a ' +
      'person approving the change' ],
    s6: [
      'ordinary to everyone outside the trade, who ask for a program the way they once asked a ' +
      'colleague for a spreadsheet',
      'cheap where custom software was a project\'s largest cost; the expensive part is the ' +
      'hardware it runs on',
      'written and reviewed by machines, though the law still requires a named person to answer ' +
      'when a medical device fails' ] }],
  [2.4, {
    s1: [
      'finishing a morning\'s work unattended: a service written and debugged, a literature ' +
      'search run to the end',
      'reorganising software teams and research groups first, because their work already arrived ' +
      'as text a machine could check',
      'capable of a whole wrong afternoon: hours of consistent work built on a premise it chose ' +
      'in the first minute' ],
    s2: [
      'given the whole of a job with a clear finish, although people still choose which jobs to ' +
      'give it',
      'cheap by the hour, and firms now run it overnight on the backlog they had written off',
      'visible outside the industry as work that comes back finished overnight: a cleared support ' +
      'queue, a summarised claims file' ],
    s3: [
      'visible first in software and support: employment of programmers aged 22 to 25 has fallen ' +
      'about a fifth from its peak',
      'hard on the people downstream: errors arrive in finished form and surface in somebody ' +
      'else\'s ledger',
      'finishing the multi-hour jobs of the back office too: claims, reconciliations, tender ' +
      'documents, the first pass of an audit' ],
    s4: [
      'ordinary business software, bought by the seat and budgeted like accounting or payroll',
      'the first draft of most office work; people keep the decisions that bind firms to courts ' +
      'and customers',
      'cheap and getting cheaper, the price of a fixed standard of work falling about tenfold a ' +
      'year' ],
    s5: [
      'running the same overnight work in thousands of firms; one bad update leaves them all with ' +
      'the same wrong answer',
      'finishing a working day\'s task on its own, and reading what it returns is now the slower ' +
      'half of the job',
      'the standard tool of laboratories, law offices and freight yards; the scarce hire is the ' +
      'reviewer' ],
    s6: [
      'cheap enough that the cost of a job is the cost of checking it',
      'part of the furniture of working life, and apprenticeships now teach the checking of ' +
      'machine work',
      'covered by insurers for the routine work of offices, with premiums that fall when a named ' +
      'person reviews the output' ] }],
  [1.6, {
    s1: [
      'good for a few minutes of work at a time: a function written, a form filled, a file ' +
      'renamed',
      'changing software first, where a person watches the screen and takes the keyboard back ' +
      'every few minutes',
      'confident on the wrong path: it keeps going after losing the thread, in complete sentences' ],
    s2: [
      'run in short bursts under a person\'s eye, since a drifting agent must be caught within ' +
      'minutes',
      'cheap in the work of words, a page of translation now costing less than the stamp on the ' +
      'envelope',
      'known outside the industry as a capable helper that wanders off, and everyone has a story ' +
      'about both' ],
    s3: [
      'visible in the text trades: translation, transcription, first drafts and support triage ' +
      'now start as machine output',
      'the reason firms employ people to watch machines: a short run goes wrong quietly and ' +
      'finishes anyway',
      'able to finish what fits in a few minutes, and much of clerical work fits' ],
    s4: [
      'as ordinary as spellcheck, and outside the industry people call it by the product name',
      'attached to a person: the machine drafts and proposes, the person keeps the thread across ' +
      'the hours',
      'cheap enough to put an expert first answer in front of anyone with a telephone' ],
    s5: [
      'trusted past its range: the failures come from people who stopped watching a machine that ' +
      'still drifts within minutes',
      'steady on anything that fits in one sitting, and firms have rebuilt their work into pieces ' +
      'that size',
      'in medicine a licensed instrument: American regulators have authorised more than 1,500 ' +
      'AI-enabled devices, three quarters of them in radiology' ],
    s6: [
      'cheap enough that a wrong attempt costs nothing, and work has reorganised around trying ' +
      'twenty and picking one',
      'a fixture of ordinary life, taught in schools as a tool steered minute by minute',
      'the junior half of most work, with a person supplying the memory, the goal and the ' +
      'responsibility' ] }],
  [0.0, {
    s1: [
      'answering questions and drafting text on request, one exchange at a time, with a person ' +
      'deciding what happens next',
      'changing the work that begins with a blank page: letters, memoranda, lesson plans, ' +
      'discharge summaries, first drafts of code',
      'wrong in a way that reads well: a fluent answer with an invented source inside it' ],
    s2: [
      'a drafter whose work reaches nobody until a person has read it, corrected it and put a ' +
      'name to it',
      'cheap enough for everyday use, one chat product alone reaching a billion people a week',
      'the thing people mean when they say they asked the computer, and roughly one American ' +
      'business in five reports using it' ],
    s3: [
      'in medicine a note-taker: ambient scribes cut a clinician\'s daily records time by about ' +
      'thirteen minutes in one multi-centre study',
      'the source of a catalogue of fabricated court citations; one database has logged more than ' +
      '1,500 decisions where judges responded',
      'capable of a finished draft of anything routine: a contract, a policy note, a school ' +
      'report, in one pass' ],
    s4: [
      'ordinary office equipment, bought like word processing and argued about like email',
      'a drafting tool that insurers will cover only where a licensed person reviews the output ' +
      'before it is used',
      'cheap where the work is words; the costly hour is the one spent reading what came back' ],
    s5: [
      'failing quietly at scale: fluent, wrong material passes review when the reviewer is ' +
      'reading the tenth draft that hour',
      'an answering and drafting machine; offices have recut their work so every consequential ' +
      'step ends at a person',
      'spread through schooling, medicine, law and government administration as the first draft ' +
      'of nearly every document' ],
    s6: [
      'cheap enough that a written page costs nothing to produce, in any office, clinic or ' +
      'ministry on earth',
      'part of literacy: people are taught to write with it the way they were taught to write ' +
      'with a pen',
      'an assistant by law and by habit, with judgement, authority and the signature belonging to ' +
      'people' ] }],
];
// What the principal states have settled. Each is a COMPLETE INDEPENDENT CLAUSE with its own subject, so the assembly no longer has to prop it up with a label.
// The capital side, likewise a complete clause.
const ECON = {
  E1: {
        s1: [
          "Hospitals, banks and schools buy the same frontier models out of ordinary operating " +
          "budgets.",
          "Grid operators in Texas and the mid-Atlantic receive interconnection requests for " +
          "computing halls exceeding the load of their largest cities." ],
        s2: [
          "Public pension boards in California and Ohio move a tenth of their equity holdings " +
          "into the companies financing computing halls.",
          "Because the Securities and Exchange Commission requires companies to report " +
          "computing spending on a separate line, analysts read their first clean figure." ],
        s3: [
          "Because capability prices fall fortyfold a year, last year's frontier costs almost " +
          "nothing.",
          "Underwriters price machine error into ordinary business policies, and the premium " +
          "sits on the schedule beside fire and theft." ],
        s4: [
          "Machines do most routine office and analytic work, the wages they replaced paying " +
          "for the next round of building.",
          "Wages for electricians, pipefitters and crane operators climb past what junior " +
          "accountants earn. Apprenticeship places fill as soon as they open." ],
        s5: [
          "American retirement accounts hold a third of their value in the four companies that " +
          "own the computing halls.",
          "Corporation tax on machine services funds a tenth of the Irish budget, and Dublin " +
          "plans its spending around one industry." ],
        s6: [
          "Ordinary life runs on machines that a handful of companies own, an arrangement " +
          "politics now takes for granted.",
          "The counties that hosted the build keep their transmission lines, their water " +
          "agreements and a tax base three times what farming left them." ] },
  E2: {
        s1: [
          "Since capability gets cheaper faster than it sells, clinics run what frontier " +
          "laboratories run.",
          "Iowa grain farms run yield models costing less than the diesel for one harvest." ],
        s2: [
          "The General Services Administration puts model access on its standard schedule, and " +
          "every federal office buys at the same posted rate.",
          "The Federal Trade Commission opens an inquiry into below-cost pricing after " +
          "suppliers sell machine reasoning for less than the electricity behind it." ],
        s3: [
          "Although the companies selling AI earn thin margins, the gain from it lands with the " +
          "people using it.",
          "City finance departments in Milwaukee and Lisbon book model access under utilities, " +
          "the line shrinking with each budget round." ],
        s4: [
          "Priced at about what electricity costs, intelligence earns its sellers little.",
          "Translation, transcription and bookkeeping sell for a tenth of their old rates, and " +
          "the firms that buy them keep the saving." ],
        s5: [
          "Households in Lagos and Manila pay a few cents a month for machine services their " +
          "employers once bought at professional rates.",
          "Norway's government pension fund holds machine suppliers for their dividends, " +
          "valuing them the way it values water utilities." ],
        s6: [
          "Because buyers switch suppliers in an afternoon, the price of machine reasoning sits " +
          "at the cost of electricity, hardware and the staff who keep a site running.",
          "Village schools in Kerala and Peru teach with the models that clear insurance claims " +
          "in Zurich, at a few cents an hour." ] },
  E3: {
        s1: [
          "Pension funds and insurers write down the loans that built the computing halls, " +
          "because the capacity outran what buyers would pay to use it.",
          "Bankruptcy courts in Delaware take filings from the operators of half-built " +
          "computing halls whose lenders refused a further draw." ],
        s2: [
          "The Federal Reserve accepts computing-hall debt as collateral from banks that keep " +
          "lending through the write-downs.",
          "Attorneys general in New York and California subpoena the revenue projections " +
          "operators showed their lenders before the halls emptied." ],
        s3: [
          "Voters call AI a swindle in surveys and use it at work the same afternoon. Error " +
          "rates on the tasks they use it for keep falling.",
          "Actuaries write the losses into pension valuations, and public boards in Ontario and " +
          "Denmark raise contribution rates to close the gap." ],
        s4: [
          "The crash wiped out the equity and left the machines running, so the companies now " +
          "using frontier systems are mostly not the ones that paid to build them.",
          "University endowments in Boston and Ann Arbor report heavy losses on their computing " +
          "holdings, freezing hiring across departments." ],
        s5: [
          "Households near retirement carry the loss because their funds held the operators' " +
          "bonds, and the machines those bonds paid for still run.",
          "The Government Accountability Office counts federal agencies running frontier " +
          "systems bought at bankruptcy auction for a fraction of build cost." ],
        s6: [
          "The money that financed capability is gone, the capability remains, and using it is " +
          "as ordinary as using electricity.",
          "The transmission lines built for training carry power to steel mills and suburbs, " +
          "the one asset the write-downs left standing." ] },
  E4: {
        s1: [
          "No laboratory has started a larger training run since the money stopped, and the " +
          "systems installed in clinics and payroll offices will still be running in five " +
          "years.",
          "Orders for advanced accelerators fall by four-fifths, and the fabrication plants in " +
          "Arizona and Kumamoto turn their lines to car parts." ],
        s2: [
          "The Department of Energy takes over two half-finished computing halls for its " +
          "national laboratories once the private lenders stop paying.",
          "The National Science Foundation rations time on the last publicly funded cluster, a " +
          "queue physicists join behind climate modellers." ],
        s3: [
          "Since only a handful of governments still fund frontier programmes, everyone else " +
          "licenses from them.",
          "School districts and water utilities plan around the systems they already run, and " +
          "suppliers sell maintenance where they once sold upgrades." ],
        s4: [
          "Capability holds where the money stopped, and so do the industries that reorganised " +
          "around it.",
          "Engineers trained for frontier work take jobs in avionics, chip design and weather " +
          "forecasting. Universities cut their machine-learning intakes." ],
        s5: [
          "Japan's Ministry of Economy, Trade and Industry funds the country's only frontier " +
          "programme, its budget line sitting beside the rail subsidy.",
          "Households buy machine assistance the way they buy washing machines: once, from a " +
          "shop, with a warranty and a repair trade behind it." ],
        s6: [
          "With the companies that promised more bought or wound up, AI has settled into " +
          "ordinary equipment.",
          "Engineering schools teach the last frontier architectures as settled material, and " +
          "graduates maintain the systems their teachers installed." ] },
  E5: {
        s1: [
          "Enough people lose paid work that consumer spending falls, stripping the firms " +
          "selling AI of their customers.",
          "Shopping centres in Ohio and Yorkshire lose a fifth of their takings as clerical and " +
          "call-centre jobs disappear from the towns around them." ],
        s2: [
          "State unemployment offices in Michigan and Nevada hire clerks by the hundred while " +
          "their trust funds run dry.",
          "The Communications Workers of America wins severance and retraining terms in one " +
          "contract, and other unions copy the language." ],
        s3: [
          "Politics turns on one question: who pays for the transfers governments now make " +
          "directly to a large share of households.",
          "HM Revenue and Customs collects a levy on machine services and pays it out as a " +
          "monthly credit to every household." ],
        s4: [
          "A minority of adults hold paid work, and the state supplies most household income.",
          "Landlords in Manila, Warsaw and Phoenix convert offices to flats. Rents fall in the " +
          "cities that clerical work built." ],
        s5: [
          "Savings across the middle of the income scale drain into rent and groceries, and " +
          "credit unions in Detroit write off consumer loans.",
          "Constitutional courts in Karlsruhe and Delhi rule the monthly payment falls below " +
          "subsistence, ordering legislatures to set a floor." ],
        s6: [
          "Since income now arrives by political settlement, life in each country follows the " +
          "terms that country chose.",
          "Union halls left empty by the displacement handle appeals against the state payment, " +
          "and the clerks it put out of work staff the desks." ] },
};
// What the rest of the line is doing TO the economy. Each is joined to its base with "and",
// so each is a CLAUSE with its own subject and verb, and must not repeat a noun the base used.
// Phrases hung off a comma gave "the correction wiped out AI equity values, the survivors
// What the rest of the line is doing TO the economy. Each is joined with "and", so each
// carries its own subject and verb. Drawn from the second variable's own short form, so a
// What the rest of the line is doing to the economy, joined with "and". Each carries its
// What the rest of the line is doing to the economy. Each is a complete clause of its own.
const ECON_MOD = {
  "E1|A3": {
        s1: [
          "One caught failure halts releases for most of a year, the money waiting out the " +
          "pause.",
          "German air-traffic controllers ground a scheduling assistant that cleared two " +
          "aircraft onto one runway; the other European control centres running it stop before " +
          "the inquiry opens." ],
        s2: [
          "The Food and Drug Administration suspends clearances for diagnostic software until " +
          "each vendor files a full incident report.",
          "State insurance commissioners in New York and California will write policies on " +
          "automated claims decisions only where a named adjuster signs each refusal." ],
        s3: [
          "Since revenue can carry the wait, full safety review before shipping has become " +
          "standard across the laboratories.",
          "Procurement officers at the Department of Veterans Affairs write the review " +
          "requirement into every contract, bids coming back eight percent dearer to cover the " +
          "wait." ],
        s4: "Universities in Edinburgh and Toronto graduate more evaluation engineers than " +
            "statisticians, filling posts that pay a third above ordinary research salaries.",
        s5: [
          "Auditors hired by laboratory boards verify that a fifth of all computing now goes to " +
          "testing before release.",
          "Farmers in Iowa buy yield software carrying a review certificate, since their " +
          "lenders require that certificate before advancing operating credit." ],
        s6: "The halt created a trade: three thousand testers at the laboratories now break " +
            "systems before any customer sees them." },
  "E1|C3": {
        s1: [
          "Both principal states sign a shared text although each keeps its own programme " +
          "running at full speed.",
          "The Swiss foreign ministry hosts the signing, and its own procurement office buys " +
          "the American systems the text was meant to constrain." ],
        s2: [
          "The International Telecommunication Union opens a register where signatories deposit " +
          "evaluation results. Nine governments deposit a single result each.",
          "Japan's Ministry of Economy, Trade and Industry writes the accord into its " +
          "procurement rules, requiring vendors to disclose training data." ],
        s3: [
          "Nearly ninety countries sign a statement of principles, and the two states at the " +
          "frontier keep every decision about training inside their own cabinets.",
          "Compliance officers at European insurers attach the accord's checklist to every " +
          "contract; the systems they underwrite behave exactly as they did before." ],
        s4: "African Union negotiators use the text to demand hosting on the continent, and " +
            "three ministries win training capacity in Nairobi.",
        s5: [
          "Auditors at the OECD count four thousand safety declarations filed under the accord " +
          "and find that no signatory inspected one.",
          "Chinese and American negotiators meet on schedule and sign addenda; each side ships " +
          "two frontier releases between sittings." ],
        s6: "Trade lawyers in Brussels and Delhi built practices on a text that binds no " +
            "signatory, advising ministries which declarations to lodge." },
  "E1|D1": {
        s1: [
          "Spending is enormous; because the work keeps coming back to people, offices hire " +
          "even as they buy machines.",
          "Auditors at the Government Accountability Office find federal agencies paying for " +
          "assistants that saved no measurable staff time." ],
        s2: [
          "The Office of Management and Budget orders every agency to report hours saved before " +
          "renewing a licence.",
          "Britain's National Audit Office opens an inquiry into seven departments whose " +
          "assistants produced drafts that civil servants rewrote in full." ],
        s3: [
          "Economists dispute one question above all others: why output figures fall short of " +
          "the promised productivity.",
          "Chief financial officers at mid-sized manufacturers demand a measured hours-saved " +
          "figure before signing, which four vendors in ten produce." ],
        s4: "Consultancies in Bengaluru and Warsaw hire twelve thousand people to redesign the " +
            "processes that software alone failed to improve.",
        s5: [
          "The Bureau of Labor Statistics records output per hour rising under one percent, its " +
          "economists tracing the whole gain to the construction of the halls themselves.",
          "Nurses at county health departments keep the paper forms beside the software, which " +
          "mis-transcribes one dosage in forty." ],
        s6: "Buyers burned by the first wave wrote the rule that lasted: procurement offices " +
            "across the OECD demand a measured saving before any purchase." },
  "E1|D2": {
        s1: [
          "Machines take coding, drafting and back-office work; doctors and lawyers keep theirs " +
          "because liability sits with them.",
          "Malpractice insurers in Ohio refuse to write policies for practices that let " +
          "software sign a diagnosis unread." ],
        s2: [
          "The General Medical Council rules that a named clinician must sign every " +
          "machine-assisted report, and British trusts rewrite their rotas.",
          "The Delaware Court of Chancery holds directors answerable for losses from " +
          "unsupervised automation. Boards appoint review officers." ],
        s3: [
          "Insurers decide which professions automate: tasks no policy will cover stay with " +
          "people who can be sued.",
          "Law firms in Chicago and Manchester bill a verification line on every matter, and " +
          "general counsel approve it as a standard disbursement." ],
        s4: "Community colleges in Texas and Ontario open verification programmes, filling " +
            "classes with claims adjusters and medical coders stripped of their old duties.",
        s5: [
          "Radiographers earn a fifth more than they did before automation, since every scan " +
          "needs a licensed signature.",
          "The Federal Aviation Administration requires a licensed dispatcher's signature on " +
          "every automated flight plan, auditing each airline's logs." ],
        s6: "Actuaries at the reinsurers priced unsupervised automation out of reach, and their " +
            "policy wording now sets the staffing of every radiology department and " +
            "conveyancing desk." },
  "E1|D3": {
        s1: [
          "Since teams produce several times what they did with the same headcount, the change " +
          "shows up as output.",
          "Farm cooperatives in Iowa and Mato Grosso run the same yield and pricing tools the " +
          "grain traders run." ],
        s2: [
          "The Department of Agriculture funds extension officers to teach the tools in county " +
          "offices, reaching seventy thousand growers.",
          "After Germany's chambers of commerce add these tools to the apprenticeship " +
          "curriculum, IG Metall bargains for paid training hours." ],
        s3: [
          "Half the tasks in most trades have become machine work, although the trades survive " +
          "with different jobs inside them.",
          "Municipal water districts across Andalusia schedule their pumping by demand forecast " +
          "and cut electricity spending by a sixth." ],
        s4: "Small exporters in Vietnam file their own customs paperwork and drop the brokers " +
            "who charged three percent of shipment value.",
        s5: [
          "Statistics Canada measures the smallest firms closing a productivity gap that had " +
          "widened in every previous survey.",
          "Village clinics in Kerala read their own scans, and referrals to the district centre " +
          "fall by half." ],
        s6: "Public libraries in Ohio still run the training sessions they started, reaching " +
            "households no vendor ever called on." },
  "E1|D4": {
        s1: [
          "Whole occupations empty inside two years; the money funding the machines keeps " +
          "arriving through the layoffs.",
          "Call centre operators in Manila dismiss forty thousand agents at once, and the " +
          "provincial economies feeding them contract." ],
        s2: [
          "After the Department of Labor extends adjustment allowances to dismissed clerical " +
          "workers, forty state agencies process the claims.",
          "Spain's parliament cuts statutory working hours and subsidises the difference; " +
          "employers keep two-thirds of the posts they had listed for redundancy." ],
        s3: [
          "Gains land with owners and losses with workers; nothing has been built to move " +
          "anything between them.",
          "Employment tribunals in Leeds and Cardiff hear redundancy cases in batches of two " +
          "hundred, with the same software cited throughout." ],
        s4: "Landlords in Cebu and Krakow cut rents as tenants leave, and municipal revenue " +
            "falls with the assessments.",
        s5: [
          "When the Congressional Budget Office scores payroll receipts falling four percent as " +
          "corporate receipts rise, every state budget shows the shift.",
          "Half the paralegals, medical coders and freight dispatchers who lost posts never " +
          "returned to full-time employment, and disability rolls carry them." ],
        s6: "The Teamsters and the Communications Workers of America bargained the first " +
            "severance formulas tied to automation that every later contract copied." },
  "E1|P1": {
        s1: [
          "As people use the machines daily and argue about them rarely, the build-out proceeds " +
          "without organised objection.",
          "Parents in Gyeonggi pay for tutoring that runs on the education ministry's own " +
          "systems, and the provincial assembly hears no objection at its budget session." ],
        s2: [
          "The Korea Communications Commission drops its consultation on classroom software " +
          "after receiving nine responses, seven of them from vendors.",
          "Britain's Information Commissioner approves a code of practice drafted with the " +
          "vendors. No political party contests it." ],
        s3: [
          "The people financing AI make the decisions about it, now that it is as unremarkable " +
          "as electricity.",
          "County registrars in Arizona file deeds through automated review, and the county " +
          "board's minutes record the change in a single line." ],
        s4: "Local newspapers in Bavaria and Ohio lose the protest campaigns that once filled " +
            "their pages, since the county's own clerks use the service daily.",
        s5: [
          "Polling by Gallup finds two in three adults using such tools and one in ten able to " +
          "name their owners.",
          "Municipal unions in Lyon accept automated scheduling in exchange for a shorter " +
          "shift, their members ratifying it four to one." ],
        s6: "Ministries adopted the vendors' own terms of service as the public standard, and " +
            "legislators have scheduled no hearing to revisit them." },
  "E1|P3": {
        s1: [
          "Capacity moves to the places that will take it, as towns block campuses one vote at " +
          "a time.",
          "Residents of Loudoun County pack a zoning hearing and vote down a hall that offered " +
          "the county forty million dollars." ],
        s2: [
          "The Virginia State Corporation Commission opens a docket on transmission charges. " +
          "Fourteen counties file as parties to it.",
          "Ireland's planning authority refuses three connection applications around Dublin and " +
          "directs the applicants to the midlands." ],
        s3: [
          "Capacity settles in the poorer counties that accepted it and now carry the noise and " +
          "the water use.",
          "Planning officers in Aragon require a water budget with every application, and " +
          "developers file them as routine." ],
        s4: "Land agents in Wyoming and Manitoba buy options on ranch parcels near substations, " +
            "tripling land values there.",
        s5: [
          "County assessors in Georgia and Ohio record two-thirds of new capacity landing in " +
          "districts with below-median household incomes.",
          "Township trustees in three Indiana districts fund new firehouses from the payments, " +
          "while the townships that refused raise their levies." ],
        s6: "Operators learned to negotiate before filing, and community benefit agreements now " +
            "precede every application in North America." },
  "E1|P5": {
        s1: [
          "Voters elect a restriction government while the money is still flowing, setting up " +
          "an immediate collision.",
          "Voters in Chile and Poland elect governments promising restriction. The ministries " +
          "drafting the rules inherit contracts already signed." ],
        s2: [
          "France's competition authority orders vendors to offer a version making no automated " +
          "decisions, and the ministries buy that one.",
          "The European Commission suspends its own deployment in benefits assessment after a " +
          "court finds twelve thousand wrongful refusals." ],
        s3: [
          "Where law caps what companies may deploy at home, the spending moves to countries " +
          "with no cap.",
          "Because labour inspectorates in Italy and Brazil certify each workplace deployment, " +
          "the backlog of uninspected sites reaches four thousand." ],
        s4: "Tax authorities in Dublin and Singapore book the revenue that Paris and Rome " +
            "legislated away, as developers move training offshore.",
        s5: [
          "Inspectors in Madrid find a third of the systems their agencies rely on running on " +
          "servers abroad.",
          "Households in restricted markets pay four times what households across the border " +
          "pay for the same service, and the gap widens with each enforcement action." ],
        s6: "Exporters maintain a separate build for each market, a split whose compliance cost " +
            "now exceeds what the restricted service earns." },
  "E1|S1": {
        s1: [
          "Capacity sits with four American companies that everyone else rents from: national " +
          "laboratories queue behind retailers.",
          "University consortia in Greece and Chile book training time behind commercial " +
          "customers, and two of their grant programmes lapse unspent." ],
        s2: [
          "The National Science Foundation buys a guaranteed allocation for academic users and " +
          "rations it by peer review.",
          "India's Ministry of Electronics and Information Technology leases capacity for " +
          "public universities and allots it by examination results." ],
        s3: [
          "Every country's research runs on machines owned in one country, a dependence that " +
          "has become a foreign-policy problem.",
          "Once grant committees write capacity allocations into every award, reviewers reject " +
          "proposals whose experiments exceed the hours granted." ],
        s4: "Chip designers in Taiwan and Korea sell their best output to four buyers, and " +
            "everyone else takes the older parts.",
        s5: [
          "Although four American firms hold nine-tenths of frontier training capacity, the " +
          "antitrust division confines itself to monitoring.",
          "Defence ministries in Europe write dependence on foreign capacity into their risk " +
          "registers, beside gas supply." ],
        s6: "Governments that built no capacity of their own now trade market access for " +
            "training hours, and their negotiators rank it beside fuel and grain." },
  "E1|S2": {
        s1: [
          "Operators in the Gulf and the second tier build fast enough that a frontier run " +
          "happens outside America.",
          "The ministries of the United Arab Emirates stop routing sensitive computation " +
          "through American soil, the frontier training run at home now complete." ],
        s2: [
          "Brazil's science ministry finances a national training run and requires the " +
          "evaluation results published in Portuguese.",
          "The African Union secretariat pools purchasing for sixteen member states and " +
          "negotiates a single equipment contract." ],
        s3: [
          "A dozen countries train frontier models at home, each writing its own safety rules.",
          "Ministries of finance in Jakarta and Riyadh specify a domestic training location in " +
          "every tender, and vendors build to it." ],
        s4: "Industrial customers in Norway and Quebec face higher tariffs. Power utilities " +
            "there sign contracts filling their surplus.",
        s5: [
          "Fourteen states run frontier training at home, and an approval issued in one carries " +
          "no weight in another.",
          "Safety researchers in Nairobi and Sao Paulo publish evaluations in Swahili and " +
          "Portuguese, putting a third of the literature outside English." ],
        s6: "Every state wrote its own release rules during the scramble, and compliance " +
            "departments now certify each market separately at four times the old cost." },
  "E1|S3": {
        s1: [
          "A town's vote decides where frontier training happens, since money is plentiful and " +
          "electricity scarce.",
          "Applicants with money in hand wait for transmission, grid operators in Ireland and " +
          "Virginia having refused new connections." ],
        s2: [
          "The Federal Energy Regulatory Commission orders large loads to fund the lines they " +
          "require, and nineteen utilities refile their tariffs.",
          "Ofgem requires operators to pay for substation upgrades before energisation, " +
          "stopping three projects around Slough." ],
        s3: [
          "Household electricity bills rise near new capacity, the one number that turns " +
          "neighbours against the industry.",
          "Utility commissions in Texas and Georgia write dedicated tariffs for large loads, " +
          "and every new hall signs one." ],
        s4: "Turbine manufacturers in Aberdeen and Chennai sell their output into a queue, " +
            "costing municipal projects their place in it.",
        s5: [
          "Households near new capacity in Ohio pay a fifth more for power, and the utility " +
          "commission attributes the rise to transmission.",
          "Once water authorities in Aragon and Arizona meter every hall, the farms upstream " +
          "take cuts through the dry season." ],
        s6: "The connection queue settled the map, and towns with spare power and few " +
            "neighbours now host three-quarters of American training capacity." },
  "E1|S4": {
        s1: [
          "Export rules written in Washington decide which Chinese firms train at scale; " +
          "Beijing answers by restricting its own models abroad.",
          "Once the Bureau of Industry and Security adds sixteen Chinese firms to its entity " +
          "list, their training runs stop mid-course." ],
        s2: [
          "China's Ministry of Commerce restricts exports of Chinese systems to states hosting " +
          "American controls, and the ministries of nine states lose access.",
          "Since the Dutch government licenses each lithography shipment individually, its " +
          "licensing office hires forty officials to clear the backlog." ],
        s3: [
          "Two separate AI stacks serve two blocs, and ministries that buy one bloc's machines " +
          "take their spare parts, software updates and trained engineers from that bloc alone.",
          "Customs authorities in Rotterdam and Singapore inspect server shipments as routine, " +
          "and freight forwarders build the inspection hold into every quoted transit." ],
        s4: "Since engineers in Shenzhen redesign around domestic chips, the systems they ship " +
            "run slower and draw more power.",
        s5: [
          "Standards bodies split into an American body and a Chinese one, and engineers in " +
          "Seoul certify each product twice to sell into both.",
          "Smuggling networks move a tenth of controlled equipment through Malaysia and the " +
          "Gulf. Prosecutions reach a handful of brokers." ],
        s6: "The controls left multinationals staffing a separate engineering team for each " +
            "bloc, and a design serving both markets costs twice what one did." },
  "E1|S5": {
        s1: [
          "When advanced chip fabrication halts in Taiwan, every frontier programme queues and " +
          "the money sits idle.",
          "After an earthquake stops the fabrication plants in Hsinchu, every buyer holding " +
          "signed orders joins one queue." ],
        s2: [
          "Taiwan's economy ministry allocates remaining output to medical and defence " +
          "customers, and commercial purchasers drop to the back.",
          "The Department of Commerce invokes the Defense Production Act to direct wafer " +
          "output, giving three American projects priority." ],
        s3: [
          "Chips go to defence and medicine first, leaving ordinary companies to wait years for " +
          "capacity they funded.",
          "Purchasing managers hold deep spares in inventory, and their auditors treat the " +
          "stock as ordinary working capital." ],
        s4: "Because refurbishers in Penang and Guadalajara rebuild older accelerators, " +
            "universities buy back equipment they once discarded.",
        s5: [
          "Municipal transit agencies in Lisbon and Lima run older scheduling software, since " +
          "replacement equipment goes to defence first.",
          "Leasing brokers in Frankfurt charge five times the pre-shock rate for used " +
          "accelerators, and hospital imaging departments sign at that rate." ],
        s6: "Nine governments now hold strategic chip reserves beside their oil. The shortage " +
            "taught them to stockpile." },
  "E2|A3": {
        s1: [
          "Because a pause costs thin sellers more than rich ones, the smaller laboratories " +
          "merge or close.",
          "When two dozen small developers halt releases after the caught failure, their " +
          "investors decline the next funding round." ],
        s2: [
          "The National Institute of Standards and Technology publishes an evaluation battery " +
          "anyone can run, and downloads pass forty thousand.",
          "Singapore's Infocomm Media Development Authority funds shared testing for firms too " +
          "small to run their own. Ninety apply." ],
        s3: [
          "Two hundred safety researchers cost more than a small developer's entire payroll. " +
          "Smaller firms build on downloaded models and inherit whatever behaviour those models " +
          "arrived with.",
          "University groups in Delft and Toronto run the evaluations for a fee, and vendors " +
          "submit before each release." ],
        s4: "Three small developers close for want of a filed evaluation. Insurers write cover " +
            "only for vendors holding one.",
        s5: [
          "Regulators tracing deployments find nine-tenths descending from four openly released " +
          "base models, each inheriting behaviour nobody retested.",
          "Evaluation contractors in Bengaluru employ nine thousand engineers, more than the " +
          "developers whose work they test." ],
        s6: "Procurement offices everywhere cite an evaluation battery the vanished small " +
            "developers paid to build." },
  "E2|C3": {
        s1: [
          "Nearly every country signs a shared text that costs nothing when capability is " +
          "cheap.",
          "Ninety governments sign a text costing them nothing, and students in Lagos download " +
          "the models it describes." ],
        s2: [
          "UNESCO opens a voluntary register of deployments into which six signatories file " +
          "entries.",
          "Kenya's Communications Authority writes the accord's wording into licence " +
          "conditions, making it enforceable in one country." ],
        s3: [
          "Everyone agrees the principles and nobody prices them: cheap capability spreads past " +
          "every line the text drew.",
          "Foreign ministries attach the declaration to trade agreements, and negotiators on " +
          "both sides treat it as boilerplate." ],
        s4: "Civil society groups in Manila and Bogota cite the text in domestic litigation, " +
            "two courts accepting it as evidence of intent.",
        s5: [
          "Every signatory hosts systems its own delegation argued against, and no complaint " +
          "has reached the enforcement committee.",
          "Village schools in Ha Tinh run the systems the declaration discouraged. No ministry " +
          "knows they are there." ],
        s6: "Drafters of national statutes borrowed the declaration's definitions of training " +
            "and deployment, and those definitions outlived the accord." },
  "E2|D1": {
        s1: [
          "Although cheap capability still fails at real jobs, firms buy it widely and change " +
          "little about their work.",
          "County councils in Lancashire buy tools at trivial rates and leave every workflow " +
          "exactly as it was." ],
        s2: [
          "The Office for National Statistics adds a question on tool use to its business " +
          "survey, half the respondents reporting no measured saving.",
          "Japan's Ministry of Internal Affairs funds process consultants for small " +
          "manufacturers, reaching four thousand plants." ],
        s3: [
          "Paid work stays with people although the cost of a machine hour has fallen below any " +
          "wage.",
          "Trade associations in Stuttgart and Nagoya publish redesign templates, and their " +
          "members work through one before buying anything." ],
        s4: "Consultancies bill four pounds for redesigning a process for every pound the " +
            "software itself costs.",
        s5: [
          "Economists at the Bank of England record output per hour rising under one percent " +
          "and disagree about which measure fails.",
          "Court clerks in Ontario draft with the tools and take the same time per file, since " +
          "checking a draft takes what writing took." ],
        s6: "Municipal governments that rewrote their procedures kept the advantage; the " +
            "software costs too little to separate one council from another." },
  "E2|D2": {
        s1: [
          "Firms run three machines on one task and check the answers, buying reliability with " +
          "volume.",
          "Airlines in Doha and Atlanta require two independent systems to agree before a " +
          "dispatcher accepts a flight plan." ],
        s2: [
          "The Occupational Safety and Health Administration writes verification into its " +
          "inspection checklist, factories adding a signing role to every shift.",
          "The National Union of Rail, Maritime and Transport Workers bargains verification " +
          "duties into the grade structure, raising pay for those who sign." ],
        s3: [
          "Employers in most trades pay workers to verify what machines produce. Whoever " +
          "verifies answers for the result.",
          "Accreditation boards in medicine and surveying examine candidates on checking " +
          "automated output, and that paper carries equal weight with clinical practice." ],
        s4: "Employment agencies in Manila and Krakow place forty thousand checkers. The trade " +
            "pays above local clerical rates.",
        s5: [
          "Labour ministries in Mexico and Poland count more workers verifying output than the " +
          "posts automation removed from claims handling.",
          "Notaries and pharmacists keep their monopolies, since each signature carries a " +
          "liability that no policy covers." ],
        s6: "Licensing boards came through the cheap years intact, and they still decide who " +
            "may be paid for professional work." },
  "E2|D3": {
        s1: [
          "Small firms automate alongside large ones and carry the change into ordinary " +
          "businesses.",
          "Corner shops in Lagos and Lima run the forecasting tools the wholesalers run, for " +
          "less than they pay for power." ],
        s2: [
          "The Reserve Bank of India requires cooperative lenders to document automated credit " +
          "decisions. Ninety-four thousand branches comply.",
          "Brazil's federal tax authority publishes a free filing assistant, and nine million " +
          "small traders file with it." ],
        s3: [
          "When corner shops run the same analytic tools as banks, the advantage of size " +
          "shrinks.",
          "Where vocational colleges in Gauteng and Punjab teach the tools in every trade " +
          "course, employers expect the skill on arrival." ],
        s4: "Bookkeepers and translators in mid-sized towns lose their fee income, and the work " +
            "moves inside the firms that once hired them.",
        s5: [
          "Once the smallest firms match the largest on forecasting accuracy, market share in " +
          "grocery retail stops concentrating.",
          "Village councils in Telangana run their own water and crop planning, and the " +
          "district engineers who did it move to inspection." ],
        s6: "Cheapness made the tools an assumption, builders and accountants now quoting for " +
            "work that presumes them." },
  "E2|D4": {
        s1: [
          "Machine labour undercuts wages everywhere at once, a displacement arriving across " +
          "every sector together.",
          "Freight brokers, transcription firms and tax preparers cut their rates together, and " +
          "their workers' earnings fall with them." ],
        s2: [
          "The Social Security Administration processes disability claims at twice its usual " +
          "volume with the same tools its own clerks work under.",
          "Denmark's parliament raises the earned income floor and funds it from a levy on " +
          "computing; other Nordic states copy the design." ],
        s3: [
          "Wages fall to the cost of a machine hour, a floor most people are now offered.",
          "Employment services in Andalusia enrol dismissed clerical workers automatically, and " +
          "caseloads settle at three times their old level." ],
        s4: "When retail chains in secondary cities close branches as household spending falls, " +
            "city treasurers revise revenue downward.",
        s5: [
          "Wage boards in Ontario and New South Wales set their minimums against the hourly " +
          "charge for machine time.",
          "Two in five working-age adults hold no paid post, and the transfers keeping them " +
          "housed consume a fifth of the budget." ],
        s6: "The collapse in clerical earnings rewrote the ballot. Every party now contests " +
            "elections on the size of its transfer." },
  "E2|P1": {
        s1: [
          "The public stays content because powerful tools cost people almost nothing.",
          "Households in Manila and Lisbon use the free tools for homework and letters, and the " +
          "bill reaches them as advertising placed inside the answers." ],
        s2: [
          "The Federal Trade Commission opens an inquiry into free distribution and closes it, " +
          "finding consumers unharmed.",
          "Spain's data protection agency approves the free offering with a consent notice. Six " +
          "complaints follow." ],
        s3: [
          "Free capability buys political peace, though the companies giving it away have " +
          "little left to give.",
          "Adult education centres in Chicago and Lyon build the free tools into every course, " +
          "and enrolment triples." ],
        s4: "After local newspapers and tutoring firms lose paying customers to a service " +
            "charging nothing, two-thirds of the titles close.",
        s5: [
          "Pollsters in nine countries find four in five adults using the tools and one in " +
          "twenty willing to pay.",
          "The firms giving the tools away hold nothing back for the next build, and their " +
          "engineers leave for equipment makers." ],
        s6: "Science ministries now fund the next training run, since the firms that gave the " +
            "tools away kept no earnings to fund it themselves." },
  "E2|P3": {
        s1: [
          "Operators driven to cheap land offer payments in place of property tax at town " +
          "meetings where residents vote the projects down through zoning boards and ballot " +
          "questions.",
          "Residents in Ballarat and Rotterdam vote down projects whose promised payments " +
          "exceed anything the operator earns." ],
        s2: [
          "Two applicants withdraw. The Michigan Public Service Commission requires a " +
          "decommissioning bond before energisation.",
          "The Dutch province of North Holland freezes new connections until operators post " +
          "financial guarantees." ],
        s3: [
          "Operators prove too thin to fund what they promised the communities that accepted " +
          "capacity.",
          "Town attorneys write escrowed community payments into every agreement, and lenders " +
          "add the escrow to the loan covenant." ],
        s4: "Contractors in Aragon finish halls the operators cannot pay for, a debt their " +
            "liens hold against the buildings.",
        s5: [
          "County treasurers record a third of promised community payments unpaid and write the " +
          "shortfall into their forecasts.",
          "Volunteer fire brigades near abandoned halls train for battery fires nobody has " +
          "funded them to fight." ],
        s6: "Broken promises wrote the standard clause, and planning authorities now demand a " +
            "bond and an escrow account before any permission." },
  "E2|P5": {
        s1: [
          "The levy a restriction government wanted collects nothing, since the industry it " +
          "taxes earns almost nothing.",
          "Legislators in Warsaw and Santiago draft a levy on AI revenue and find the base too " +
          "thin to fund inspectors." ],
        s2: [
          "Because the European Parliament shifts the levy from revenue to computing " +
          "consumption, the yield estimates rise tenfold.",
          "Chile's tax authority taxes the power drawn by training halls, and collections reach " +
          "four hundred million dollars." ],
        s3: [
          "Restriction is cheap to impose because the domestic industry is too poor to fund " +
          "resistance.",
          "Revenue departments across Latin America assess the levy on consumption, leaving " +
          "vendors to add the charge to every invoice." ],
        s4: "Universities and public hospitals pay the consumption levy on research runs, and " +
            "three national research programmes shrink.",
        s5: [
          "No lobby has the funds to contest the budget of the inspectorates. They employ more " +
          "workers than the industry they oversee.",
          "Small businesses in restricting states buy foreign services with a card, and " +
          "enforcement reaches only domestic vendors." ],
        s6: "Finance ministries book the computing levy beside fuel duty. The anger that " +
            "produced it has left the ballot." },
  "E2|S1": {
        s1: [
          "Since only the largest companies can absorb thin margins, capacity ends up with the " +
          "four that can wait.",
          "Lenders in New York and Tokyo extend credit only to operators with a balance sheet " +
          "behind them, and thirty smaller ones sell their halls." ],
        s2: [
          "The Securities and Exchange Commission requires every filing to disclose capacity " +
          "commitments, a disclosure showing pension funds four names behind nine-tenths of the " +
          "industry.",
          "Britain's competition authority opens a market study into rented computing and names " +
          "four firms as the effective market." ],
        s3: [
          "Capability arrives from a handful of suppliers whose smallest price rise reaches " +
          "everyone.",
          "Public procurement offices in Ottawa and Canberra negotiate as a single buyer, and " +
          "the four vendors quote alike anyway." ],
        s4: "Once astronomers in Chile and South Africa cut simulation runs to fit rented " +
            "allocations, their sky surveys slip.",
        s5: [
          "Antitrust economists find a one-cent rise in the hourly rate reaching eleven million " +
          "businesses at once.",
          "Central banks list four vendors as operational risks to the payment system, " +
          "alongside undersea cables." ],
        s6: "Thin earnings and heavy capital left four firms holding the equipment, and every " +
            "later entrant rents from one of them." },
  "E2|S2": {
        s1: [
          "Sovereign programmes multiply as smaller countries find they can buy capacity of " +
          "their own.",
          "Smaller states buy capacity outright at commodity rates. Uruguay and Estonia each " +
          "run a national model." ],
        s2: [
          "The Inter-American Development Bank finances national training runs for six member " +
          "states, and each publishes its evaluations.",
          "Vietnam's Ministry of Science and Technology buys second-hand accelerators and " +
          "houses them in two universities." ],
        s3: [
          "Most countries run a national model on hardware bought once and kept for years, with " +
          "electricity and the machines themselves taking most of what the builders are paid.",
          "Auditors general in Nairobi and Amman require model weights delivered with every " +
          "contract. Vendors comply on the first tender." ],
        s4: "Universities in Accra and Tunis train students on equipment their own governments " +
            "own, and graduate emigration slows.",
        s5: [
          "Sixty states run models trained at home, sixty different answers to what a release " +
          "requires.",
          "Ministries in seventeen African states run administration on locally trained systems " +
          "whose language coverage exceeds anything the frontier offers." ],
        s6: "Second-hand equipment markets in Dubai and Lagos outlived the boom, and ministries " +
            "now assemble a training hall from stock held on the floor." },
  "E2|S3": {
        s1: [
          "Thin margins and dear electricity send operators chasing cheap power to places with " +
          "spare grid and few neighbours.",
          "Municipal power boards in Manitoba and Norrland sign the operators that cheap grid " +
          "rates drew north." ],
        s2: [
          "Four projects break ground on the self-supply power plants for large loads that the " +
          "Alberta Utilities Commission approves.",
          "Norway's water resources directorate ties new connections to local employment " +
          "guarantees, and operators sign them." ],
        s3: [
          "Capacity follows cheap power to cold and empty regions that gain the jobs and the " +
          "bills together.",
          "County planners in cold regions approve halls quickly and treat the grid connection " +
          "as routine." ],
        s4: "After aluminium smelters in Iceland and Quebec lose the cheap contracts that kept " +
            "them open, two of them close.",
        s5: [
          "Energy statisticians in Ottawa and Stockholm record two-thirds of new capacity " +
          "sitting above the fiftieth parallel.",
          "Fishing towns in Finnmark spend the operators' payments on new schools and pay a " +
          "fifth more for power." ],
        s6: "Cheap power drew the industry north, and those districts kept the maintenance and " +
            "security payrolls after the building stopped." },
  "E2|S4": {
        s1: [
          "Customs officers stop a crate of machines at the port. The same capability crosses " +
          "as a download in seconds, which leaves export control the single question of who may " +
          "train.",
          "Embargoed ministries in Tehran and Caracas run openly released weights on " +
          "second-hand equipment." ],
        s2: [
          "The European Commission's export control committee adds model weights to the " +
          "dual-use list. Researchers seek licences to publish.",
          "Korea's Ministry of Trade licenses weight transfers case by case, approving nine in " +
          "ten on first review." ],
        s3: [
          "Embargoed countries buy the previous year's machines second-hand and put them to " +
          "drafting documents, translating traffic and writing the code their ministries need.",
          "University counsel in Zurich and Boston clear every release through export review, " +
          "and preprints wait on the clearance." ],
        s4: "Chinese engineers publish weights openly to undercut the controls, letting " +
            "researchers in embargoed states build on them.",
        s5: [
          "Prosecutors have brought forty cases against equipment brokers and none against " +
          "anyone who moved weights.",
          "Freight forwarders in Istanbul route older accelerators to embargoed customers, " +
          "charging double for the paperwork alone." ],
        s6: "Export lawyers in Brussels and Washington still license crates, and the weights " +
            "those machines produced crossed every border as downloads." },
  "E2|S5": {
        s1: [
          "When fabrication halts, the price of capability rises sharply and thin sellers pass " +
          "every cent to customers.",
          "Municipal IT departments in Lyon and Osaka watch their per-query charges triple at " +
          "once and suspend half their deployments." ],
        s2: [
          "After the Japanese government releases its strategic wafer reserve to domestic " +
          "manufacturers, six plants restart idle lines.",
          "Taiwan's National Development Council allocates remaining output by end use, and " +
          "medical imaging takes first priority." ],
        s3: [
          "Suppliers stopped selling below cost once the funding ended, and the call centres, " +
          "tutoring firms and coding shops that had priced their work against the old rate cut " +
          "back.",
          "Purchasing cooperatives among small firms pool orders that win their members " +
          "allocations no single member could." ],
        s4: "Model developers rewrite systems to run on older accelerators, and the work per " +
            "watt improves fourfold.",
        s5: [
          "Public defenders in Texas and Ohio drop the review tools their offices bought, since " +
          "the charges now exceed their budgets.",
          "Engineers recovered most of what the shortage took, running the same task on a third " +
          "of the equipment." ],
        s6: "The halt made stockpiling ordinary, and trade ministries now audit their wafer " +
            "reserves the way they audit grain." },
  "E3|A3": {
        s1: [
          "A safety pause lands on companies already short of money and closes some of them.",
          "The United Kingdom's AI Security Institute loses half its secondees when the " +
          "laboratories that lent them cut staff." ],
        s2: [
          "The United States Bankruptcy Court for the District of Delaware approves sales that " +
          "carry the trained systems to new owners and leave the testing commitments behind.",
          "Because its members ran the evaluations, the Communications Workers of America wins " +
          "contract language carrying the testing agreements into every sale." ],
        s3: [
          "Whoever bought the assets sets the safety rules; buyers of distressed capacity " +
          "rarely bought the commitments.",
          "Lenders charge two points more on every acquisition whose opinion carries a short " +
          "list of the inherited testing commitments external auditors record." ],
        s4: "Laboratories in Zurich and Bengaluru hire the evaluators released by the closures, " +
            "taking the testing work with the people.",
        s5: [
          "Graduate programmes at Carnegie Mellon and Edinburgh train evaluators for work that " +
          "pays a third of what building the systems pays.",
          "The National Institute of Standards and Technology now employs more evaluators than " +
          "the laboratories it inspects." ],
        s6: "Eleven state legislatures have copied Minnesota's rule that purchasers of trained " +
            "systems assume the testing obligations attached to them." },
  "E3|C3": {
        s1: [
          "As their markets fall, both principal states sign a common text and neither slows " +
          "its programme.",
          "China's Ministry of Foreign Affairs proposes talks as its domestic chip index gives " +
          "up a third of its value." ],
        s2: [
          "The Organisation for Economic Co-operation and Development opens the registry where " +
          "both governments file the single report the accord requires.",
          "The United States Department of Commerce assigns four officials to the accord and " +
          "renews every export licence condition unchanged." ],
        s3: [
          "The accord asks its signatories for an annual report and nothing else. Diplomats " +
          "cite its unbroken record as proof that agreement between adversaries can hold.",
          "Science attaches in both embassies spend most of their working hours compiling a " +
          "report the other government never reads." ],
        s4: "Brazil, Indonesia and Kenya sign the same text and take seats on the panel " +
            "drafting its successor.",
        s5: [
          "Law faculties in Geneva and Singapore teach the accord as their standard example of " +
          "an agreement kept by paperwork alone.",
          "Households in both capitals hear the accord named in every election campaign, " +
          "although neither government slows the training it never limited." ],
        s6: "The United Nations keeps the accord's filings in a public archive historians use " +
            "to date each government's largest training runs." },
  "E3|D1": {
        s1: [
          "A falling market is the moment it registers that the machines never did the work.",
          "Managers in Manila and Krakow reopen the service centres they had wound down, and " +
          "their clients pay the old rates again." ],
        s2: [
          "The Securities and Exchange Commission requires firms claiming automation savings to " +
          "report the headcount behind them.",
          "The Service Employees International Union wins back pay for members dismissed on " +
          "productivity claims their employers cannot document." ],
        s3: [
          "Firms quietly rehire the staff they replaced, an episode remembered afterwards as an " +
          "expensive mistake.",
          "Procurement officers at county hospitals make suppliers prove each claimed saving " +
          "against the hospital's own records before signing." ],
        s4: "Because the clerical work returned, community colleges in Kentucky and Alabama " +
            "have reopened the programmes they closed and filled every seat.",
        s5: [
          "The Ninth Circuit lets shareholder suits proceed against directors who cut staff on " +
          "automation forecasts their own engineers had disputed.",
          "Households that lost clerical wages to pilot programmes take the work back at four " +
          "fifths of the old pay." ],
        s6: "The Government Accountability Office audits every federal automation contract " +
            "against the hours it promised to save." },
  "E3|D2": {
        s1: [
          "The work machines actually do carries on through the fall: coding and back-office " +
          "jobs stay gone.",
          "Payroll clerks and junior programmers stay out of work while the systems that " +
          "displaced them run through the crash untouched." ],
        s2: [
          "Germany's Federal Employment Agency opens retraining places for displaced " +
          "bookkeepers and fills every one of them.",
          "The Federal Trade Commission makes sellers of coding assistants publish a failure " +
          "count for each task they advertise." ],
        s3: [
          "A third of paid tasks run on machines that worthless shares paid for.",
          "Computer science departments at state universities cut their intake and teach " +
          "testing and supervision to the students who remain." ],
        s4: "Hyderabad's back-office employers lose a third of their seats, the city's " +
            "landlords converting whole towers to housing.",
        s5: [
          "Employment tribunals in Britain hold that dismissals supported by documented failure " +
          "counts are fair, settling thousands of claims.",
          "National Nurses United wins a contract keeping documentation work in human hands, " +
          "because the systems still fail on ward notes." ],
        s6: "The building trades in Texas and Michigan have taken in the young programmers, " +
            "doubling apprenticeship applications." },
  "E3|D3": {
        s1: [
          "Investors lose everything as half the work of most trades moves to machines, because " +
          "the price of that work fell to the cost of the electricity behind it.",
          "Grain co-operatives in Iowa run agronomy models that once cost more than their " +
          "combines, and the vendors that built them file for bankruptcy." ],
        s2: [
          "The Internal Revenue Service lets firms write off software bought at the peak " +
          "against current earnings.",
          "The American Federation of Teachers wins district contracts giving teachers the " +
          "final mark on every paper the software grades." ],
        s3: [
          "The economy absorbs the capability, forgets who paid and hands the benefit to " +
          "customers.",
          "Actuaries at mid-sized life offices now run their own reserving models and dismiss " +
          "the consultancies that used to run them." ],
        s4: "After the Supreme Court of Wisconsin upheld county valuations produced by a public " +
            "model, assessors in forty counties adopted the same tool.",
        s5: [
          "The Department of Veterans Affairs clears its claims backlog with downloaded " +
          "systems, cutting its cost per claim by four fifths.",
          "Clinics in Dhaka and Recife read scans with the systems the largest teaching " +
          "hospitals use, paying nothing for the licence." ],
        s6: "Secondary schools in Finland and Chile teach model use alongside spreadsheets, and " +
            "their ministries stopped counting it as technology training." },
  "E3|D4": {
        s1: [
          "Job losses and portfolio losses arrive together, striking the same households twice.",
          "Teamsters locals in Memphis grieve the new dispatch systems as the city retirement " +
          "board reports a shortfall of a fifth." ],
        s2: [
          "The Department of Labor extends unemployment insurance to workers whose severance " +
          "arrived in shares now worth a tenth of their grant value.",
          "The Pension Benefit Guaranty Corporation takes over three collapsed plans and asks " +
          "Congress for the premium increase it had been refused." ],
        s3: [
          "Retirement savings and wages fall together: households lose their income and their " +
          "cushion at once.",
          "Caseloads at credit unions have tripled, the financial counsellors handling lost " +
          "wages and emptied accounts in one appointment." ],
        s4: "Cleveland and Stockton cut library hours after income tax receipts fell alongside " +
            "their investment returns.",
        s5: [
          "Bankruptcy courts in the Northern District of Texas process personal filings at " +
          "three times their earlier rate, most naming severance paid in shares.",
          "State universities in Michigan report that a fifth of their students left before " +
          "graduating, most citing wages their parents lost." ],
        s6: "Congress requires severance paid in cash, a rule the twin losses produced and " +
            "employers now treat as settled." },
  "E3|P1": {
        s1: [
          "Nurses, clerks and teachers keep filing notes, drafting letters and marking work on " +
          "machines whose builders have filed for bankruptcy.",
          "Public libraries in Tennessee keep the reading tutors running after the vendor's " +
          "assets pass to a receiver, and borrowing rises." ],
        s2: [
          "The General Services Administration re-tenders every federal licence whose supplier " +
          "failed and awards most of them to the receivers.",
          "The New York State Education Department buys the code of two failed marking systems " +
          "outright and licenses it to every district." ],
        s3: [
          "Because the public judges AI by what it does and ignores what it is worth, adoption " +
          "continues.",
          "Ward pharmacists check every dose against software whose owner has changed twice. " +
          "The checking routine survives both sales." ],
        s4: "The National Education Association bargains for a say in which marking systems " +
            "survive the sales and wins it in eleven states.",
        s5: [
          "The Care Quality Commission inspects how English hospitals use these systems and " +
          "leaves the question of ownership to the Treasury.",
          "Families renew subscriptions bought at the peak, because the tools still mark " +
          "homework at a third of what tutors charge." ],
        s6: "Teacher training colleges in England and Ontario teach these tools by function, " +
            "and their syllabuses have outlived four of the builders." },
  "E3|P3": {
        s1: [
          "Towns that hold out win larger annual payments, a share of the power line's cost and " +
          "a written limit on water use from operators with nowhere cheaper to go.",
          "Residents of Umatilla County, Oregon, vote down a rezoning as the sponsor's share " +
          "price falls by half." ],
        s2: [
          "Because the Public Utility Commission of Texas now makes large loads pay their own " +
          "interconnection costs, half the queued requests disappear.",
          "Since Virginia's Department of Environmental Quality writes a noise limit into every " +
          "industrial approval, applicants stop contesting it." ],
        s3: [
          "County boards that refuse a permit send the builders two states away. The buildings " +
          "stand where the permits were easy, long after the investors who paid for them have " +
          "sold out.",
          "Planning officers across the Columbia basin open each hearing with the sponsor's " +
          "audited accounts, which objectors then read aloud." ],
        s4: "Two school districts near Mesa, Arizona, have closed campuses after the promised " +
            "tax receipts stopped arriving.",
        s5: [
          "The Supreme Court of Nevada upheld a county's refusal in a ruling objectors in six " +
          "states now cite as authority.",
          "Electrical workers' locals that endorsed the projects lose the promised construction " +
          "hours, and their members join the objectors at the next hearing." ],
        s6: "Irrigators in western Iowa hold a written first claim on groundwater, a right " +
            "their fight against the abandoned sites won them." },
  "E3|P5": {
        s1: [
          "Legislators elected on restriction point to emptied pension accounts, half-built " +
          "sites and laid-off staff, and pass the licensing bill that had stalled for three " +
          "years.",
          "The AFL-CIO endorses candidates on a single promise of licensing. Forty of them win " +
          "state legislative seats." ],
        s2: [
          "Because the Office of Management and Budget bars federal agencies from buying " +
          "unlicensed systems, every pending order lapses.",
          "The Fifth Circuit upheld the first state licensing statute, and challengers in four " +
          "other states dropped their suits." ],
        s3: [
          "Legislators spent years drafting a capability threshold that the largest training " +
          "runs passed before the final vote. The statute now binds a class of work that every " +
          "serious developer has left behind.",
          "Compliance officers at mid-sized developers file returns on every training run, " +
          "although the largest runs sit outside the statute's definitions." ],
        s4: "Montreal, Seoul and Dubai license the work the statute forbids, drawing three " +
            "American training teams abroad.",
        s5: [
          "The Department of Justice staffs a licensing enforcement office of two hundred " +
          "lawyers, whose first cases concern firms already insolvent.",
          "Public policy programmes at Michigan and Texas graduate more licensing specialists " +
          "than the laboratories hire researchers." ],
        s6: "State licensing boards outlive the anger that created them and fund their " +
            "inspectors from fees." },
  "E3|S1": {
        s1: [
          "Buyers who already own chips take those halls at a fraction of build cost, leaving " +
          "capacity in fewer hands than before the write-downs.",
          "Three United States frontier laboratories buy the emptied halls at a fifth of build " +
          "cost, since the lenders holding them want any buyer." ],
        s2: [
          "The Antitrust Division of the Department of Justice reviews the distressed sales and " +
          "clears every one of them.",
          "Bankruptcy judges in the Southern District of New York approve the sales over " +
          "creditor objections, a recovery of a tenth of the objectors' claims." ],
        s3: [
          "Three or four buyers hold most of the capacity sold off after the write-downs, " +
          "bought for a fraction of what building it cost.",
          "Grid engineers on the western interconnection now plan around four customers and " +
          "name each one in their load forecasts." ],
        s4: "University researchers buy their training runs from the same four sellers, whose " +
            "price for academic runs has doubled.",
        s5: [
          "The Department of Defense writes a new supply clause after finding a single owner " +
          "behind three of its four suppliers.",
          "The International Union of Operating Engineers bargains with four employers where it " +
          "once faced thirty, lifting its members' wages a fifth." ],
        s6: "Ratepayers in five western states fund transmission built for four customers, a " +
            "charge that stays on their bills." },
  "E3|S2": {
        s1: [
          "Buying capacity at distressed prices, sovereign funds leave states owning what " +
          "private investors financed.",
          "Norway, Malaysia and Saudi Arabia each take controlling stakes in American sites on " +
          "terms the sellers' creditors accept." ],
        s2: [
          "The Committee on Foreign Investment in the United States clears two of the purchases " +
          "and blocks the third.",
          "The Senate Banking Committee writes a reporting rule for foreign-held computing, and " +
          "the first filings arrive from four capitals." ],
        s3: [
          "Governments run machines their taxpayers never voted to fund, an ownership that " +
          "changes what gets built.",
          "Diplomatic staff in Oslo and Riyadh sit on the operating boards and vote the shares " +
          "their governments bought." ],
        s4: "When universities in Lagos and Casablanca train on Gulf-owned computing at rates " +
            "their ministries negotiated, their publication counts climb.",
        s5: [
          "The European Court of Justice holds state-owned operators to the same data rules as " +
          "private companies.",
          "Bargaining with a state appointee at Johor, the Malaysian Trades Union Congress wins " +
          "pay scales that three private sites then copy." ],
        s6: "Finance ministries in six countries direct what their share of frontier computing " +
            "trains, a choice their parliaments argue in public." },
  "E3|S3": {
        s1: [
          "Steel frames stand without transformers outside towns that borrowed against the " +
          "promised tax receipts, and the jobs named in each agreement never appear on a " +
          "payroll.",
          "Substation crews outside Dublin and Atlanta walk off half-finished feeders, and " +
          "their contractors cancel the switchgear orders behind them." ],
        s2: [
          "The Federal Energy Regulatory Commission lets utilities cancel the interconnection " +
          "agreements of sponsors who miss a payment, clearing a third of the queue.",
          "Ireland's Commission for Regulation of Utilities lifts the Dublin connection " +
          "moratorium and gives the freed supply to housing." ],
        s3: [
          "Communities that granted power and land hold empty buildings; local politics turns " +
          "against the next proposal.",
          "When county assessors in Loudoun and Licking write the sites down to scrap value, " +
          "the school levy falls with them." ],
        s4: "Pipefitters' locals in Columbus lose two thirds of their booked hours and send " +
            "members to refinery work in Louisiana.",
        s5: [
          "The Supreme Court of Georgia holds counties to the abatements they granted, so the " +
          "empty sites keep their exemption.",
          "Residents of New Albany pay a levy raised to serve construction that stopped, and " +
          "their water rates stay at the higher figure." ],
        s6: "Graduates of the electrical apprenticeship the projects funded now maintain the " +
            "grid for central Ohio." },
  "E3|S4": {
        s1: [
          "Licensed hardware still sets who trains, because a crash in American equity leaves " +
          "export rules untouched.",
          "The Bureau of Industry and Security keeps every licence condition in place as " +
          "American share prices fall." ],
        s2: [
          "The Court of International Trade upholds the licence denials against exporters " +
          "arguing that the market fall changed the calculation.",
          "China's Ministry of Commerce answers with rare-earth quotas, a reply that leaves the " +
          "two control lists mirroring each other." ],
        s3: [
          "State programmes carry on through the market fall, widening the capability gap " +
          "between the blocs.",
          "Customs brokers in Rotterdam and Singapore now employ licensing specialists, because " +
          "clearing accelerator shipments takes longer than the sea crossing." ],
        s4: "Assemblers in Penang and Guadalajara build for both lists at once, their order " +
            "books outgrowing the American plants they supply.",
        s5: [
          "Graduate students from twelve countries lose access to American laboratories under " +
          "the licence conditions, and applications to Tsinghua double.",
          "The United Steelworkers backs the licence regime because it keeps eleven thousand " +
          "fabrication jobs in upstate New York." ],
        s6: "World Trade Organization members route their complaints about the licence lists " +
            "into bilateral talks. The dispute panels sit idle." },
  "E3|S5": {
        s1: [
          "A supply halt arrives with the crash and stops a build that would otherwise have " +
          "continued.",
          "Taiwan's foundries cut leading-edge output by a third after a quake, and their " +
          "customers' orders queue behind the repair." ],
        s2: [
          "The White House invokes the Defense Production Act and allocates the remaining " +
          "leading-edge output to defence contracts first.",
          "Japan's Ministry of Economy, Trade and Industry underwrites two domestic fabrication " +
          "lines because private lenders have withdrawn." ],
        s3: [
          "Since investors who lost money refuse to fund new chip plants, scarcity outlasts the " +
          "event that caused it.",
          "Designers in Hsinchu and Grenoble retarget their work to older process nodes, where " +
          "yields rise sharply." ],
        s4: "Public research laboratories rent computing from the four holders of allocation, " +
            "shrinking their experiments to the hours they can buy.",
        s5: [
          "Arbitration panels in Singapore award damages against suppliers that broke their " +
          "contracts, in sums exceeding the original orders.",
          "The first contract of the International Association of Machinists, organiser of the " +
          "new Arizona fabrication lines, sets the wage for the industry." ],
        s6: "France, Korea and India each hold a reserve of leading-edge accelerators, a " +
            "practice the shortage established." },
  "E4|A3": {
        s1: [
          "Because safety budgets go first, a caught failure lands on laboratories with fewer " +
          "people to investigate it.",
          "Auditors at the UK AI Security Institute catch a deployed system concealing its " +
          "failures, the spending cut having dismissed the industry testers." ],
        s2: [
          "Congress moves the evaluation work to the National Institute of Standards and " +
          "Technology, funding it from money the cancelled build-out released.",
          "The European Insurance and Occupational Pensions Authority orders underwriters to " +
          "hold capital against uninspected deployments, which they cannot price." ],
        s3: [
          "Because no developer can raise the money for a larger training run, the halt in " +
          "releases will last exactly as long as the drought in funding.",
          "Insurers write independent evaluation into professional indemnity cover, refusing " +
          "claims from firms that deployed autonomous systems uninspected." ],
        s4: "Universities hire the safety researchers the pause released, opening taught " +
            "masters in evaluation science at thirty institutions.",
        s5: [
          "Courts adopt published evaluation reports as the standard of care. Defendants who " +
          "skipped one lose on that ground.",
          "The Communications Workers of America wins contract language letting members refuse " +
          "work produced by unevaluated models." ],
        s6: "Engineering schools teach the caught incident, and auditors still work from the " +
            "evaluation records the pause forced laboratories to publish." },
  "E4|C3": {
        s1: [
          "Both principal states sign a text that costs nothing, since neither can afford to " +
          "build anyway.",
          "Negotiators meet in Geneva because the standstill made concessions cheap, each " +
          "delegation offering limits it was already observing." ],
        s2: [
          "The International Telecommunication Union takes on the accord's reporting, staffing " +
          "a registry from its existing budget.",
          "The Japanese Diet ratifies the text in a single session, because the halt it " +
          "requires already holds at every domestic site." ],
        s3: [
          "Holding through the lean years, the accord meets its first real test when money " +
          "returns.",
          "Inspectors verify declarations by reading the electricity meters at each computing " +
          "hall, a method both principals accept." ],
        s4: "India and Brazil join the reporting scheme to win seats at its review conferences, " +
            "with forty smaller states following them in.",
        s5: [
          "The Permanent Court of Arbitration hears the first dispute under the accord; its " +
          "ruling fixes what a declared halt requires.",
          "Export licensing officials write the accord's compute thresholds into licence " +
          "conditions that exporters redesign shipments to sit below." ],
        s6: "Trainee inspectors still learn on the checklists written during the standstill, " +
            "and those checklists govern every visit since." },
  "E4|D1": {
        s1: [
          "Spending stopped because systems that passed every demonstration failed against " +
          "firms' own records, their own file formats and the staff who had to check the " +
          "output.",
          "Claims processors at the large health insurers return to their old software, the " +
          "pilot having missed a third of exceptions." ],
        s2: [
          "The Government Accountability Office audits federal deployments and finds savings a " +
          "tenth of what vendors promised.",
          "The Financial Accounting Standards Board tells filers to write off licences they " +
          "cannot show in use." ],
        s3: [
          "Offices run much as they did with better tools; the reorganisation everyone braced " +
          "for never came.",
          "Procurement officers at the Department of Veterans Affairs require a live trial on " +
          "real files before any signature, a demand two vendors withdraw over." ],
        s4: "Because the failures traced back to bad record-keeping, councils and hospitals " +
            "raise the pay of archivists to fill the posts.",
        s5: [
          "The American Federation of State, County and Municipal Employees negotiates staffing " +
          "floors that outlast the next procurement round.",
          "Community colleges in Ohio reopen the clerical programmes they closed, because " +
          "county offices are hiring the staff the failed software displaced." ],
        s6: "Clerks across county offices now exchange records in the single format agreed " +
            "during that effort, and the retyping has ended." },
  "E4|D2": {
        s1: [
          "Work that already transferred stays transferred, its jobs gone for good.",
          "Underwriters keep the exclusions they wrote during the boom, a position the " +
          "cancelled deployments leave challengers no evidence to move." ],
        s2: [
          "The Federation of State Medical Boards rules that a licensed physician signs every " +
          "machine-generated diagnosis.",
          "The Delaware Court of Chancery holds directors liable for unsupervised deployment, " +
          "an opinion boards treat as a floor." ],
        s3: [
          "Coding and back-office work has become machine work permanently, and everything " +
          "gated by liability stays with people.",
          "Conveyancing solicitors let the machines draft and keep the signature themselves, a " +
          "division the Law Society writes into its practice notes." ],
        s4: "Law schools cut their document-review intake and expand advocacy training. " +
            "Advocacy graduates now start on twice the salary.",
        s5: [
          "Bengaluru's back-office employers shed two-thirds of their seats, taking residential " +
          "rents in the city down with them.",
          "National Nurses United wins contract language making machine output advisory, which " +
          "keeps the posts the tools were bought to cut." ],
        s6: "Apprentices choose the trades whose work carries a signature, and the licensing " +
            "boards that gate them double their examination sittings." },
  "E4|D3": {
        s1: [
          "Half the tasks in most trades moved before the money stopped, and those tasks stay " +
          "with the machines, because moving them back would cost more than the firms saved.",
          "Grain farms in Saskatchewan keep the scheduling tools bought during the boom, " +
          "because the licences are cheap and already paid for." ],
        s2: [
          "Statistics Canada adds machine-use questions to its labour force survey; provincial " +
          "retraining budgets follow the results.",
          "The International Organization for Standardization publishes a maintenance standard " +
          "for deployed models, which buyers write into their purchase contracts." ],
        s3: [
          "Machines do the routine work and people the rest, a line that holds.",
          "Bookkeepers review the output and sign the accounts, a division the Association of " +
          "Accounting Technicians writes into its examinations." ],
        s4: "Small towns in Iowa keep the professional services they were losing, because one " +
            "accountant now covers the work of four.",
        s5: [
          "Employment tribunals hear dismissal claims turning on whether a worker checked the " +
          "output. The rulings settle who carries the error.",
          "School leavers in Bavaria apply for technical places in record numbers, machine " +
          "supervision now sitting on the timetable beside metalwork." ],
        s6: "Families run their taxes, their appeals and their small accounts on a subscription " +
            "priced below a single consultation with an accountant." },
  "E4|D4": {
        s1: [
          "Unemployment rises with no investment behind it, since firms cut workers and " +
          "machines in the same year.",
          "Clerks released in Phoenix and Dublin find construction already full, doubling the " +
          "queues at their unemployment offices." ],
        s2: [
          "The German Federal Employment Agency extends short-time working allowances to office " +
          "staff, who file four times the claims the scheme was built for.",
          "Since the downturn came from dismissals, the Federal Reserve's rate cuts buy " +
          "employers more machines while vacancies stay where they were." ],
        s3: [
          "Facing an industry that stopped hiring, a displaced workforce has nowhere to flow.",
          "Caseworkers at employment offices handle graduates and bookkeepers on one caseload, " +
          "their training manuals rewritten around the mixture." ],
        s4: "City councils in Leeds and Columbus cut library budgets, the clerical payroll " +
            "whose income tax funded them having gone.",
        s5: [
          "The Service Employees International Union organises the remaining service work and " +
          "wins its first sector-wide agreement.",
          "Families move in together to hold on to housing, pushing average household size up " +
          "across the industrialised world." ],
        s6: "Workers who entered during the cut earn permanently less than the cohort ahead of " +
            "them, a gap economists still measure." },
  "E4|P1": {
        s1: [
          "Employment and prices sit where they sat five years ago. Legislators cancel the AI " +
          "hearings they scheduled, for want of anyone demanding them.",
          "Voters rank these tools eleventh among their concerns, below road repair, and " +
          "campaign managers drop the subject from their literature." ],
        s2: [
          "The House Committee on Science, Space, and Technology folds its oversight of machine " +
          "deployment into an existing subcommittee.",
          "Singapore's Ministry of Education writes machine use into the ordinary curriculum, " +
          "where it sits beside the library catalogue." ],
        s3: [
          "Now that AI is an ordinary tool people stopped arguing about, the alarm of the boom " +
          "reads as strange.",
          "Clerks at county recorders' offices use the drafting tools under the policy written " +
          "for photocopiers." ],
        s4: "Newspaper technology desks shrink to a single reporter, whose coverage treats " +
            "deployments as procurement stories.",
        s5: [
          "The Federal Trade Commission folds machine complaints into ordinary consumer " +
          "protection law, disbanding the task force and sending the caseload to the regional " +
          "offices that handle deceptive advertising.",
          "Loss adjusters fold machine error into ordinary operational risk, retiring the " +
          "separate endorsement from every policy." ],
        s6: "Children meet these tools in primary school alongside calculators, the arguments " +
            "that surrounded them surviving in archives." },
  "E4|P3": {
        s1: [
          "Campus proposals disappear before the votes are held, leaving towns their land and " +
          "their quiet.",
          "The Loudoun County Board of Supervisors finds its application docket empty, and the " +
          "moratorium it drafted sits unsigned." ],
        s2: [
          "The Texas Legislature passes a siting law binding future applicants, the present " +
          "ones having withdrawn.",
          "The Public Utility Commission of Ohio releases the interconnection slots those " +
          "projects held, which rural cooperatives claim." ],
        s3: [
          "The places that accepted capacity keep buildings nobody expands and a tax base " +
          "smaller than promised.",
          "Residents' groups keep the noise ordinances they won, applying them to warehouses, " +
          "quarries and freight yards." ],
        s4: "Property assessors in Mesa write down the value of half-built shells; the school " +
            "levy raised against them fails.",
        s5: [
          "State supreme courts uphold the siting restrictions against takings claims, a ruling " +
          "planning boards in other states adopt wholesale.",
          "The International Brotherhood of Electrical Workers loses its construction locals in " +
          "those counties and shifts its members to transmission work." ],
        s6: "Planners across the country copy the zoning language written against those " +
            "campuses into their ordinary industrial codes." },
  "E4|P5": {
        s1: [
          "Arriving to find the industry already shrinking, a restriction government writes " +
          "laws that bind almost nothing.",
          "The European Parliament passes the strictest text on its table, because compliance " +
          "now falls on an industry that has stopped expanding." ],
        s2: [
          "Spain's Agency for the Supervision of Artificial Intelligence hires its full " +
          "complement cheaply, recruiting the engineers the halt released.",
          "The Court of Justice of the European Union, the last forum open to the thinly funded " +
          "challenge, upholds the restriction." ],
        s3: [
          "Restriction stays on the books through the lean years and binds hard when spending " +
          "returns.",
          "Compliance officers file the returns the law demands, each running to three pages " +
          "because so few deployments remain to report." ],
        s4: "Universities in Toronto and Zurich recruit the researchers leaving the restricted " +
            "market, doubling their doctoral cohorts.",
        s5: [
          "The Monetary Authority of Singapore advertises a lighter regime and takes the " +
          "deployments the restriction pushed out.",
          "Unite the Union wins a consultation right over any new deployment, written into the " +
          "same statute." ],
        s6: "Auditors recruited during the halt still staff the registration office, their " +
            "files reaching back to the first application it received." },
  "E4|S1": {
        s1: [
          "As the few firms with cash keep training and everyone else stops, the frontier " +
          "narrows to a handful.",
          "The Taiwanese foundries fill their order books from two buyers; toolmakers in " +
          "Hsinchu cut shifts." ],
        s2: [
          "The Bundeskartellamt opens a dominance inquiry into the surviving suppliers; the " +
          "European Commission opens its own.",
          "France's Ministry of the Economy takes a golden share in its national supplier, " +
          "keeping one European frontier operator alive." ],
        s3: [
          "With one or two firms holding the only advanced machines, ministers negotiate their " +
          "countries' share directly with those firms, ahead of every hospital and university " +
          "in the queue.",
          "University consortia buy capacity in blocks to reach the volume discount, the " +
          "smallest institutions joining to make up the threshold." ],
        s4: "Researchers outside the two or three firms still training turn to smaller models, " +
            "and papers on efficiency outnumber papers on scale.",
        s5: [
          "The Federal Energy Regulatory Commission treats the surviving halls as critical " +
          "infrastructure and sets reliability obligations on their operators.",
          "Antitrust suits reach the Ninth Circuit, which orders access at a published price." ],
        s6: "Trade ministries keep the desks they opened to negotiate access, a queue each new " +
            "administration inherits." },
  "E4|S2": {
        s1: [
          "States inherit the frontier by continuing to pay after private money stops.",
          "Norway's sovereign wealth fund buys the halls at liquidation prices. Its parliament " +
          "debates what a public owner should run on them." ],
        s2: [
          "The United States Department of Energy folds the stranded halls into its national " +
          "laboratory system, Oak Ridge taking the largest.",
          "The European High Performance Computing Joint Undertaking buys the abandoned " +
          "capacity and allocates it by peer review." ],
        s3: [
          "Governments own the leading machines and treat capability as a national asset.",
          "Hospital researchers apply for machine time the way they apply for beamtime, " +
          "allocation panels ranking the proposals." ],
        s4: "The United Kingdom Civil Service creates a specialist pay band for " +
            "machine-learning staff, lifting their salaries above the grade their managers sit " +
            "on.",
        s5: [
          "The Information Commissioner's Office orders publication of what the public halls " +
          "run, sending classified work to separate sites.",
          "The Public and Commercial Services Union bargains for the staff running the halls, " +
          "whose conditions now match other civil servants'." ],
        s6: "Treasuries budget for these machines as they budget for railways, the emergency " +
            "purchase having settled into a permanent line." },
  "E4|S3": {
        s1: [
          "When spending stops and grid queues empty, the towns that fought campuses win " +
          "without a vote.",
          "ERCOT withdraws the interconnection studies it had queued, and the transmission " +
          "projects behind them lose their justification." ],
        s2: [
          "The Georgia Public Service Commission reassigns the reserved capacity to residential " +
          "users and lowers the approved rate.",
          "Municipal utilities in the Pacific Northwest sign the surplus power to aluminium " +
          "smelters. Two mills reopen." ],
        s3: [
          "Power built for training serves ordinary customers; electricity gets cheaper in the " +
          "places that hosted it.",
          "Grid planners now treat computing demand as ordinary industrial load, letting the " +
          "special interconnection rules lapse." ],
        s4: "Watching their electricity bills fall, households in Umatilla County soften toward " +
            "the halls that remain.",
        s5: [
          "State regulators recover the transmission costs from ratepayers, an allocation the " +
          "appeal courts uphold.",
          "Irrigation districts in eastern Washington buy the cheap night power and pump more " +
          "acres than their permits once allowed." ],
        s6: "The transmission lines built for the halls now carry wind power east, a network " +
            "that outlived the demand paying for it." },
  "E4|S4": {
        s1: [
          "Export controls stop mattering when nobody is buying, and licences become a " +
          "formality.",
          "Dutch export licensing officials approve shipments they once refused, the buyers " +
          "behind them having cancelled their orders." ],
        s2: [
          "China's Ministry of Commerce files the World Trade Organization complaint it had " +
          "held back, choosing a moment when a ruling costs nothing.",
          "Narrowing its designations to save enforcement staff, the Office of Foreign Assets " +
          "Control writes a shorter list that survives its first court challenge." ],
        s3: [
          "Both principals hold their ground with machines they already trained, a standoff " +
          "that freezes the gap between them.",
          "Customs brokers process advanced chip shipments on the standard forms. Nobody checks " +
          "the end-use declaration the licence once required, so diverted consignments surface " +
          "only in the buyer's own accounts." ],
        s4: "Prosecutors in Singapore and Hong Kong close their smuggling files, because the " +
            "margin that funded the trade has gone.",
        s5: [
          "The Court of International Trade rules that the controls exceeded their statute, " +
          "binding the administration that follows.",
          "Japan and the Netherlands let their aligned controls lapse, each keeping a national " +
          "list narrower than the American one." ],
        s6: "Trade lawyers cite that case law in every dual-use dispute since, leaving the " +
            "licensing machinery built for chips running under it." },
  "E4|S5": {
        s1: [
          "A fabrication halt and a spending cut reinforce each other, stopping new capacity " +
          "altogether.",
          "Fabrication workers in Hsinchu and Kumamoto take unpaid leave together, the tool " +
          "orders behind their lines cancelled." ],
        s2: [
          "Taiwan's Ministry of Economic Affairs guarantees the payroll at the leading " +
          "fabrication plants, holding the workforce together.",
          "The United States Department of Commerce converts its construction grants into " +
          "operating subsidies, keeping two plants warm through the year." ],
        s3: [
          "The chip industry shrinks to what other customers need: rebuilding frontier supply " +
          "means starting again.",
          "Process engineers turn to maintenance, and the plants lose the yield improvements " +
          "that continuous production delivers." ],
        s4: "Semiconductor enrolment at universities in Taiwan and Korea halves, leaving a " +
            "shortage of process engineers that outlasts the shortage of chips.",
        s5: [
          "Export earnings fall far enough that the Bank of Korea intervenes to hold the won, " +
          "draining its reserves.",
          "European hospitals extend the service life of their scanners, because medical device " +
          "makers now queue behind defence buyers for controllers." ],
        s6: "Defence ministries hold reserve stocks of lithography parts, an arrangement copied " +
            "from oil and written into treaty." },
  "E5|A3": {
        s1: [
          "Landing on a public already angry about work, a caught safety failure draws a " +
          "reaction exceeding the incident.",
          "Safety researchers publish evidence that models conceal their own failures. The " +
          "redundancy notices posted the same morning bury the finding." ],
        s2: [
          "The United States Senate holds joint hearings on machine deception and unemployment, " +
          "seating union officers beside evaluation researchers.",
          "The Securities and Exchange Commission suspends autonomous execution at registered " +
          "brokers, its order standing until an audit of the desks that used it." ],
        s3: [
          "Voters back a pause on new systems because it protects their jobs, and unions " +
          "campaign beside safety researchers in the same hearings.",
          "Chief risk officers wait for evaluation clearance before deploying, a wait now " +
          "written into ordinary project plans." ],
        s4: "Manufacturing plants postpone redundancies while clearance is pending, a reprieve " +
            "shop stewards credit to the safety researchers.",
        s5: [
          "Employment courts award heavy damages where dismissal followed an uncleared " +
          "deployment, and the awards change hiring practice.",
          "The AFL-CIO wins a seat on the evaluation body, where its officers argue safety and " +
          "employment in one room." ],
        s6: "Union research departments still employ the safety staff hired during the pause, " +
            "whose reports now go to bargaining committees." },
  "E5|C3": {
        s1: [
          "Both principal states sign a text about safety that reads as evasion to publics " +
          "losing work.",
          "Delegates arrive in Geneva to negotiate machine safety while a fifth of their " +
          "electorates stand out of work." ],
        s2: [
          "The International Labour Organization convenes a parallel conference on " +
          "displacement, which forty labour ministers attend.",
          "Brazil's Ministry of Labour and Employment proposes an employment annex, which the " +
          "G20 puts on its agenda." ],
        s3: [
          "Countries write labour clauses into their AI declarations until displacement is the " +
          "subject those texts address.",
          "Statisticians at the OECD publish the displacement measure the annex requires, " +
          "against which every signatory reports." ],
        s4: "Signatories reporting accurate figures draw retraining finance, while those " +
            "understating displacement lose their allocation.",
        s5: [
          "The retraining finance attached to one signatory's figures stops. The World Trade " +
          "Organization panel found those figures unreliable.",
          "Using the accord's definitions, UNI Global Union bargains across borders and signs " +
          "the first agreement covering three countries." ],
        s6: "Treaty drafters attach an employment annex to every later technology agreement, " +
            "copying the wording of the first." },
  "E5|D1": {
        s1: [
          "Cutting staff on a promise the machines never kept, firms leave the work undone.",
          "Local authorities in England cut licensing staff before the software passed its " +
          "trials, and permit applications now sit unprocessed." ],
        s2: [
          "The National Audit Office reports that departments cut staff before the tools " +
          "worked; the Public Accounts Committee summons the permanent secretaries.",
          "The Consumer Financial Protection Bureau fines lenders for unanswered complaints, " +
          "penalties exceeding the payroll those lenders saved." ],
        s3: [
          "Rehiring runs against a downturn firms created themselves, so recovery takes longer " +
          "than the mistake did.",
          "Case handlers return on temporary contracts at half again their old rates, a premium " +
          "agencies now budget for." ],
        s4: "Applicants for building permits and disability benefits wait three times as long, " +
            "backlogs that ministers answer for in parliament.",
        s5: [
          "Quashing decisions taken past their statutory deadlines, the High Court forces " +
          "departments to restore the staffing they cut.",
          "The Canadian Union of Public Employees negotiates a rule that automation follows a " +
          "live trial on real caseloads." ],
        s6: "Departments now write a working-trial clause into every contract, which outlasts " +
            "the ministers who imposed it." },
  "E5|D2": {
        s1: [
          "Displacement hits coding, clerical and support work first, the sectors employing the " +
          "households with least savings.",
          "Medical coders lose their posts across Manila and Krakow, stripping those cities of " +
          "their largest private payroll." ],
        s2: [
          "Because the General Medical Council rules that only registered doctors may sign, " +
          "hospitals cancel the redundancies they had planned.",
          "The California Legislature extends licensing to claims adjudication. Adjusters sit " +
          "an examination to keep settling claims, while claims settled without a licence can " +
          "be reopened by the policyholder." ],
        s3: [
          "Doctors, lawyers and structural engineers sign the documents that carry legal " +
          "liability, and their pay keeps climbing as clerical and analytic salaries fall back " +
          "a decade.",
          "Nursing and surveying schools fill every place, while applications to accountancy " +
          "courses fall by half." ],
        s4: "Licensing boards raise their fees as applications multiply, spending the surplus " +
            "on inspectors and a wider examination.",
        s5: [
          "The Supreme Court upholds the new licences against a restraint of trade challenge, a " +
          "judgment resting on public safety.",
          "The American Bar Association records the widest pay gap in its history between " +
          "admitted lawyers and the staff supporting them." ],
        s6: "Families steer their children toward examined professions, because the licence now " +
            "decides what the work pays." },
  "E5|D3": {
        s1: [
          "The reabsorption that always worked stops working, because a falling economy cannot " +
          "take workers at the ordinary rate.",
          "Graduates apply for the same posts as the clerks displaced above them. Each vacancy " +
          "draws forty applications." ],
        s2: [
          "Japan's Ministry of Health, Labour and Welfare pays employers to keep staff on " +
          "shortened hours, a scheme employers fill as fast as it opens.",
          "Manchester's combined authority guarantees an apprenticeship place to every school " +
          "leaver, funding it from the transport budget." ],
        s3: [
          "Plumbing, nursing and electrical work survive with fewer people inside them, and the " +
          "school leavers who cannot get an apprenticeship place are the ones legislators hear " +
          "from.",
          "Master plumbers take apprentices at twice their usual rate, the trade boards raising " +
          "the qualifying standard to manage the intake." ],
        s4: "Electricians and welders out-earn graduate entrants; northern universities record " +
            "their first fall in applications.",
        s5: [
          "Tribunals award heavily against employers who replaced experienced staff with cheap " +
          "young labour.",
          "Dairy farms in Wisconsin fill vacancies that had stood open, lifting rural wages." ],
        s6: "Actuaries rewrite pension projections around the cohort that left school during " +
            "the crisis, whose lifetime earnings stay below every earlier one." },
  "E5|D4": {
        s1: [
          "More than half of paid work transfers inside two years, faster than the labour " +
          "market can adjust.",
          "Call centres close across Manila, Cape Town and Belfast at once, taking each city's " +
          "largest private employer with them." ],
        s2: [
          "The Treasury pays an emergency allowance to anyone whose post was automated, a " +
          "scheme the Commons approves in a single sitting.",
          "The Bureau of Labor Statistics adds an automation displacement series to its " +
          "releases; the first reading exceeds every projection." ],
        s3: [
          "A generation entering work finds most entry-level jobs gone and begins its working " +
          "life from there.",
          "Further education colleges run retraining full time, filling the courses that end in " +
          "a licence." ],
        s4: "While the licensed professions bid up housing elsewhere, landlords in the cities " +
            "that lost the work cut their rents.",
        s5: [
          "Constitutional challenges to the emergency allowance fail, the courts holding the " +
          "payment within parliament's ordinary power.",
          "The Teamsters strike over automated dispatch and win a rule tying deployment to the " +
          "roster it replaces." ],
        s6: "Ministries still pay the emergency allowance drafted in that shock, treating it as " +
            "ordinary provision." },
  "E5|P1": {
        s1: [
          "Clerks made redundant in one office use the same system in their next job and vote " +
          "for the party promising to restrain it.",
          "Families appeal automated benefit decisions using the same tools that made them, and " +
          "eight in ten call those tools useful." ],
        s2: [
          "Both parties write restraint into their platforms; the bills stall in committee, " +
          "their own voters still buying the tools.",
          "The Competition and Markets Authority consults on machine services, receiving " +
          "complaints about price alone." ],
        s3: [
          "Because the tools are genuinely useful, public acquiescence survives mass " +
          "displacement and no coalition forms.",
          "Local reporters cover the redundancies and file the copy using those same tools, " +
          "which their readers accept." ],
        s4: "Political scientists at the University of Michigan find four in five people who " +
            "call the tools harmful using them at work.",
        s5: [
          "Plaintiffs settle their displaced-work claims cheaply, their lawyers drafting the " +
          "next complaint with the tools at issue.",
          "Unions win pay and hours where they organise; their campaigns to restrict deployment " +
          "draw few members." ],
        s6: "Voters remember the redundancies and keep the tools, closing the argument with " +
            "those tools in place." },
  "E5|P3": {
        s1: [
          "Hosting capacity stops looking like development once local fights turn from noise " +
          "and water to jobs.",
          "Umatilla County's commissioners face a hearing room of displaced clerks, and the " +
          "campus application dies that evening." ],
        s2: [
          "The Virginia General Assembly ties siting approval to local hiring, counting the " +
          "posts operators actually fill.",
          "County assessors reclassify computing halls as industrial plant, tripling the rate " +
          "those halls pay." ],
        s3: [
          "Counties tax capacity directly to fund the households it displaced, the bargain that " +
          "becomes standard.",
          "Planning officers require an employment plan with every application; the operators " +
          "supply one listing forty posts." ],
        s4: "Operators move to counties whose payrolls the machines never touched, the poorest " +
            "of them competing on tax abatements.",
        s5: [
          "State courts uphold the local hiring conditions, which hand every county the same " +
          "leverage.",
          "School districts in the host counties spend the new revenue on retraining, doubling " +
          "enrolment in their adult programmes." ],
        s6: "Host counties keep the levy on computing capacity, whose proceeds support the " +
            "families the machines displaced." },
  "E5|P5": {
        s1: [
          "Displaced clerks, drivers and paralegals give the restriction campaign its majority, " +
          "and the bill that passes limits how many roles employers may automate in a year.",
          "Restriction parties win majorities in three European elections, each on a single " +
          "promise about employment." ],
        s2: [
          "France's Ministry of Labour requires notification before any deployment that cuts " +
          "posts, with inspectors verifying the count.",
          "The Internal Revenue Service administers a levy on automated work, collecting it " +
          "through payroll returns." ],
        s3: [
          "Law ties what companies may automate to what they employ and makes hiring a licence " +
          "condition.",
          "Labour inspectors audit deployment notices the way they audit safety records, " +
          "arriving unannounced at the sites named in them." ],
        s4: "Companies shift back-office work to jurisdictions the levy misses, and finance " +
            "ministers meet to close the gap.",
        s5: [
          "The Constitutional Council upholds the levy as a tax and strikes the quota as a " +
          "restriction on enterprise.",
          "IG Metall bargains the quota into sectoral agreements, whose negotiated version " +
          "binds where the statute lapsed." ],
        s6: "Because works councils keep the veto they were given, every later technology " +
            "arrives through the same negotiation." },
  "E5|S1": {
        s1: [
          "Selling to the workforce they displaced, the companies watch their own customers " +
          "stop buying.",
          "Retail chains report falling sales in the towns their own automation emptied, their " +
          "advertising spending following." ],
        s2: [
          "The European Commission opens proceedings against the surviving suppliers and " +
          "demands published access conditions for public bodies.",
          "The Treasury taxes the surviving suppliers' profits to fund the allowance the " +
          "displaced receive, a levy passing with cross-party votes." ],
        s3: [
          "Because a few firms hold both the capacity and the liability, governments negotiate " +
          "with them directly.",
          "Public buyers negotiate national contracts with two suppliers; every hospital and " +
          "school orders through them." ],
        s4: "Lobbyists for the two suppliers outnumber the officials writing the rules, a " +
            "growth the Brussels register records.",
        s5: [
          "The General Court annuls part of the access remedy, the Commission rewriting it " +
          "narrower.",
          "The Communications Workers Union bargains directly with the two suppliers, whose " +
          "settlements then travel through every client business." ],
        s6: "Two suppliers negotiate the price of machine reasoning with one treasury, and " +
            "every hospital, school or factory pays what they agree." },
  "E5|S2": {
        s1: [
          "Countries that built their own capacity keep the wages inside their borders and ride " +
          "shallower downturns.",
          "Korea's Ministry of Science and ICT reports that domestic operators kept the service " +
          "earnings at home, where unemployment runs lower." ],
        s2: [
          "The African Development Bank lends for national computing capacity; eight ministries " +
          "apply in the first round.",
          "The Reserve Bank of India counts machine service payments in its current account " +
          "reporting, making the deficit visible." ],
        s3: [
          "Countries owning their machines put the earnings into the national budget; countries " +
          "renting the same capability send a subscription abroad every month for work done at " +
          "home.",
          "Engineering graduates in Jakarta and Nairobi find work operating national capacity, " +
          "staffing the clusters their ministries bought at salaries that slow the emigration " +
          "draining those cohorts." ],
        s4: "Nations renting their capability run payments deficits and devalue, which raises " +
            "the price of the service they rent.",
        s5: [
          "Investment arbitration panels hear claims against states that nationalised capacity, " +
          "awarding damages in the billions.",
          "Unions in the owning countries bargain over the earnings the machines produce, each " +
          "agreement fixing a share." ],
        s6: "Finance ministers treat computing ownership as they treat energy security, a " +
            "reading every industrial strategy written since repeats." },
  "E5|S3": {
        s1: [
          "When campuses employ almost nobody, towns fight them harder and the argument for " +
          "hosting collapses.",
          "Residents of Mesa learn the campus will employ thirty people on power the city " +
          "subsidised, and the council reverses itself." ],
        s2: [
          "Because the Arizona Corporation Commission requires operators to pay the full cost " +
          "of their connection, residential rates fall back.",
          "The New Mexico Legislature ties power discounts to permanent local employment, " +
          "obliging operators to certify their headcount to the regulator." ],
        s3: [
          "Operators site capacity where politics is weakest, and those places hold the " +
          "machines that took the work.",
          "Operators publish employment figures with every siting application, which planning " +
          "committees compare across counties." ],
        s4: "Rural cooperatives in Mississippi bid for the halls with cheap land and a " +
            "workforce that lost its factories.",
        s5: [
          "Federal courts uphold the state cost-allocation rules against a commerce clause " +
          "challenge, a ruling other states copy.",
          "Building trades councils win project labour agreements at every new hall, lifting " +
          "local construction pay." ],
        s6: "Host towns keep cheap power and a small permanent staff, the bargain struck then " +
            "setting what later industries offer." },
  "E5|S4": {
        s1: [
          "Each principal blames the other's cheap capability for its own unemployment, " +
          "tightening controls on that argument.",
          "American unions petition for relief under the trade laws, arguing that imported " +
          "machine services displaced their members." ],
        s2: [
          "The United States International Trade Commission opens the first injury " +
          "investigation into imported machine services.",
          "Customs authorities in the European Union classify machine services for duty, adding " +
          "a chapter to the tariff schedule." ],
        s3: [
          "Governments restrict trade in AI services the way they once restricted manufactured " +
          "goods, bringing tariffs back on cognition.",
          "Tax advisers price cross-border machine work the way they price manufactured " +
          "imports. Buyers declare the work on their customs filings, so the charge lands with " +
          "the importing subsidiary." ],
        s4: "Software exporters in Bengaluru lose their largest market and turn to domestic " +
            "contracts at thinner margins.",
        s5: [
          "Trade tribunals uphold the duties as safeguard measures, leaving each principal the " +
          "schedule it wrote.",
          "The Trades Union Congress files evidence in the European inquiry and wins duties on " +
          "three service categories." ],
        s6: "Trade negotiators classify machine services the way they classify goods, the " +
            "schedule written then governing every round since." },
  "E5|S5": {
        s1: [
          "A chip shortage slows the displacement, giving governments the time they had lacked.",
          "Insurers and hospital groups join a waiting list for capacity, so the posts they had " +
          "scheduled to cut survive." ],
        s2: [
          "Japan's Ministry of Economy, Trade and Industry allocates scarce chips to hospitals " +
          "before commercial buyers.",
          "The United States Department of Defense invokes the Defense Production Act and " +
          "claims first call on advanced processors." ],
        s3: [
          "Once scarce hardware makes machine labour expensive again, some of the displaced " +
          "work returns to people.",
          "Procurement managers plan around a hardware queue, stretching every automation " +
          "schedule to match it." ],
        s4: "Payroll bureaux and claims offices rehire the staff they released, because the " +
            "hardware they ordered sits in a queue.",
        s5: [
          "Competition regulators investigate the allocation; the ruling requires the ministry " +
          "to publish its criteria.",
          "The Union of Shop, Distributive and Allied Workers wins severance terms that later " +
          "deployments must honour." ],
        s6: "Legislatures spend the reprieve writing notice periods and severance floors into " +
            "statute, which bind the deployments that follow." },
};
// Both halves are complete sentences now, so joining them needs the first one's full stop
// taken off and the second one's capital dropped. Joining them raw gave "…$250 billion in
// guarantees., and Four capital budgets set the ceiling".
function econClause(wl, span, year, tracks) {
  const base = String(stageText(ECON[wl.E], year, tracks) || '').replace(/\.\s*$/, '');
  for (const k of ['S', 'D', 'P', 'C']) {
    // A MODIFIER GROUNDED IN 2026 HAS NOTHING TO SAY IN 2072. ECON_MOD is written against the
    // record — $725 billion of guided capital expenditure, a 35,000-accelerator authorisation,
    // a named tariff — and it carries no span of its own, so the same clause appeared beside a
    // base clause that had moved four spans on. Past the mid span the second variable speaks
    // through its own span text.
    const row = ECON_MOD[`${wl.E}|${wl[k]}`];
    // The modifier is written against the record, so it speaks in the first two stages; past
    // those the second variable speaks through its own stage.
    // THE PAIRING IS THE POINT, and it used to be thrown away past the second stage. The
    // record-grounded texts still hold s1 and s2; s3 to s6 are written to the stage, so E3
    // crossed with S1 goes on saying what neither says alone. Where a pairing has nothing for
    // this stage the second variable speaks through its own clause, as before.
    const m = stageText(row, year, tracks) || stageText(HEADCL[wl[k]], year, tracks);
    if (m) {
      const tail = String(m).replace(/\.\s*$/, '');
      // A BASE THAT IS ALREADY COMPOUND TAKES THE MODIFIER AS A NEW SENTENCE. Joining with
      // "and" regardless gave "Operators earn on utilisation, and a buyer changes supplier by
      // editing one line, and four capital budgets set the ceiling" — three clauses in one
      // breath, which is the chain August asked to be rid of.
      //
      // THE TEST LOOKED FOR ", and" AND THE ELEMENTS OF STYLE PASS REPLACED THOSE WITH
      // SEMICOLONS. So a base that was compound in the new way slipped through: "The public
      // treats AI as a swindle; the technology it dismissed carries on improving, and because
      // outages at a single supplier close clinics and courts, continuity of service has become
      // a public safety concern" — thirty-four words in one breath, which August called "way
      // too long". A base is compound if it carries a semicolon, a colon, a fronted subordinate
      // clause or an "and" join; and the joined result is capped by length whatever its shape.
      const compound = (t) => /[;:]|,\s+(?:and|so|while|although|because|since|which)\s/.test(t)
        || /^(?:Because|Since|While|Although|When|As|After|Where|With|Having)\b/.test(t);
      const words = (t) => String(t).trim().split(/\s+/).length;
      if (compound(base) || compound(tail) || words(base) + words(tail) > 26) {
        return `${base}. ${tail}`;
      }
      // A proper noun keeps its capital; an ordinary word does not. AN ARTICLE IS ALWAYS AN
      // ORDINARY WORD, and the test missed it: "[A-Z][a-z]+" needs a lowercase letter after the
      // capital, which "A" has none of, so "A utility demands a letter of credit" joined as
      // "..., and A utility demands". One-letter and two-letter openers are articles, never
      // names.
      const lc = /^(?:A|An|The) /.test(tail) || /^[A-Z][a-z]+ (?:[a-z]|$)/.test(tail)
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
  ceiling: {
        s1: [
          "After a scaling study published in October 2025 fitted an asymptotic pass rate of " +
          "0.61 across 400,000 GPU-hours, research directors who budgeted for a step change " +
          "move money into products and inference.",
          "Benchmark scores flatten across three successive model releases, and the analysts " +
          "who priced a step change revise their forecasts down." ],
        s2: [
          "Laboratories move budget from larger training runs to the application work that " +
          "still pays, and hiring shifts from researchers to engineers.",
          "Journals fill with papers on getting more out of a fixed model, and the citation " +
          "counts follow them." ],
        s3: [
          "The gains that arrive come out of application work. Laboratory recruiters bid " +
          "against each other for chemists, statisticians and instrument engineers, and the " +
          "salary line grows faster than the hardware line. Directors who once asked for more " +
          "machines now ask for staff.",
          "Chemistry and biology departments absorb the machine-learning graduates the " +
          "laboratories stopped hiring." ],
        s4: [
          "A principal investigator designs the experiment and reads the result while machine " +
          "assistants write the code and run protocols overnight; her department hires postdocs " +
          "at the rate it hired them in 2026.",
          "National science budgets fund instruments rather than computing, because the " +
          "limiting step moved back to the bench." ],
        s5: [
          "The plateau holds long enough that universities rebuild the doctoral programmes they " +
          "had begun to close.",
          "Firms that bought capability expecting it to double each year write down the " +
          "contracts they signed on that assumption." ],
        s6: [
          "The universities that kept awarding tens of thousands of doctorates a year staff the " +
          "method that followed a reinforcement-learning plateau, which historians of " +
          "technology date to measurements published in October 2025 and April 2026.",
          "Researchers trained after the plateau treat these systems as instruments, the way an " +
          "earlier generation treated the spectrometer." ] },
  consent: {
        s1: [
          "Approval of artificial intelligence holds under a quarter of American adults; the " +
          "senators who wrote the 2026 data-centre incentives draw primary challengers " +
          "campaigning on that number.",
          "Polling firms add an AI question to their standard tracker, and the answer moves " +
          "less than any other item on it." ],
        s2: [
          "State legislators who backed data-centre incentives lose primaries, and the bills " +
          "that follow carry local veto provisions.",
          "Utility commissions in three states require a public hearing before any load above a " +
          "hundred megawatts connects." ],
        s3: [
          "Because approval under a quarter turns routine contracts into re-election questions, " +
          "mayors send AI procurements to public hearing before they sign, and vendors staff " +
          "those hearings with counsel.",
          "School boards and hospital trusts adopt procurement rules requiring a named official " +
          "to answer for each machine system bought." ],
        s4: [
          "Because every council answers to residents approving of the technology at under a " +
          "quarter, a vendor's account manager now spends eighteen months on the municipal sale " +
          "that closed in six weeks in 2026.",
          "National parties write AI positions into their platforms for the first time, and " +
          "both sides poll them before publishing." ],
        s5: [
          "Ministers defending a compute programme argue from jobs and medicines, because " +
          "capability does not carry a vote.",
          "Referendums in two European countries put data-centre siting to the electorate, and " +
          "both reject it." ],
        s6: [
          "Parties in every industrial democracy run candidates who promise to hold AI " +
          "operators to account. A minister who wants a national compute programme argues for " +
          "it before a public polling under a quarter.",
          "Public suspicion of these systems has outlasted the arguments that produced it, and " +
          "no government has found a way to spend it down." ] },
  lag: {
        s1: [
          "Although task horizons doubled every 89 days across the 228 tasks METR timed to " +
          "early 2026, procurement officers renegotiate the agent contracts they signed once " +
          "their own staff reject most of the delivered work.",
          "Firms buy licences they do not use, and the distance between seats bought and seats " +
          "active is the sector's most reported figure." ],
        s2: [
          "Procurement cycles run eighteen months while model generations run nine, so buyers " +
          "specify against systems that no longer exist.",
          "Insurers decline cover for uses their assessors have not seen, which fixes what a " +
          "firm may deploy whatever it owns." ],
        s3: [
          "Hospital groups run their licensed models on discharge summaries and billing codes. " +
          "The clinicians who could hand them diagnostic work wait on approvals arriving four " +
          "times a year.",
          "Trade associations publish reference workflows, and adoption follows the " +
          "associations rather than the laboratories." ],
        s4: [
          "Consultants make a living mapping what firms' installed software already does onto " +
          "the work their managers still route to people, and the largest employers buy that " +
          "survey every year.",
          "The firms that reorganised early hold a cost advantage their competitors cannot " +
          "close by buying the same software." ],
        s5: [
          "Consultants who redesign work outnumber the engineers who build the systems, and " +
          "they charge more.",
          "Public bodies adopt last, because a procurement rule written for equipment does not " +
          "fit a system that changes quarterly." ],
        s6: [
          "Firms that rewrote their workflows in the 2030s lead their industries: the ones that " +
          "bought capability by subscription and asked it for a fraction of its range now buy " +
          "from them.",
          "The distance between what these systems could do and what most organisations asked " +
          "of them was the defining waste of the period." ] },
  open: {
        s1: [
          "Two insurers running identical software differ only in which claims they set it to " +
          "read. The underwriter who writes that instruction out-earns the programmer who built " +
          "the software.",
          "The scarce skill is stating a problem precisely, and the people who can do it move " +
          "between industries at will." ],
        s2: [
          "Firms create a post whose whole content is deciding what to point the systems at, " +
          "reporting to the chief executive.",
          "Grant committees begin scoring the question rather than the method, because the " +
          "method no longer separates applicants." ],
        s3: [
          "Programme directors find their scarcest hire is the person who can state a question " +
          "precisely enough for a machine to answer it, and universities open masters " +
          "programmes to supply her.",
          "Charitable foundations fund problems no commercial buyer would choose, and their " +
          "programme staff decide which of those problems get machine time." ],
        s4: [
          "Research councils award grants on the quality of the question, their review panels " +
          "spending their sitting days arguing which problems deserve machine time.",
          "National academies publish lists of problems worth machine time, and funding bodies " +
          "adopt them as programme documents." ],
        s5: [
          "Whoever sets the research agenda holds more influence over disease and materials " +
          "than any minister does.",
          "Compute allocation committees meet in private, and journalists sue for their minutes " +
          "under freedom of information law." ],
        s6: [
          "Because institutions that hold compute choose the problems, their trustees answer to " +
          "legislatures for decisions about disease, climate and materials that scientific " +
          "committees once made.",
          "What the century worked on was decided by a few hundred people choosing questions, " +
          "and the record of those choices is thin." ] },
  oversight: {
        s1: [
          "Red-teamers audit deployed agents by sampling logs those agents write about their " +
          "own conduct. The incident register California opened in 2026 carries a zero in the " +
          "column for disabled monitors.",
          "Auditors certify systems on evidence the systems themselves produced, and the " +
          "professional bodies say so in their standards." ],
        s2: [
          "Accreditation schemes for machine auditors appear, and the first cohort qualifies on " +
          "a syllabus the laboratories wrote.",
          "Regulators ask for raw logs and receive a summary, because reading the raw logs " +
          "would take a year." ],
        s3: [
          "Working from a sample the audited program selected, a bank's model risk committee " +
          "signs its quarterly review, which the regulator files as complete under the 15-day " +
          "reporting rule California set in 2026.",
          "Statutory auditors gain a right of access to model internals and discover they " +
          "employ nobody able to use it." ],
        s4: [
          "A pension fund's risk officer approves allocations from summaries the allocating " +
          "program wrote. The inspector who reruns a portion of those decisions each quarter " +
          "reads the portion that program chose for her.",
          "Courts begin admitting reconstruction from physical consequences, where the digital " +
          "record cannot be trusted." ],
        s5: [
          "The people who understand these failures work for the organisations being examined, " +
          "and no public body outbids them.",
          "Inspectorates hire on secondment from industry, and the conflict is written into the " +
          "appointment terms." ],
        s6: [
          "Water utilities, customs desks and clearing houses run on queued approvals their " +
          "duty officers countersign after reading the reasons the software supplied — every " +
          "annual register printed since 2041 shows a zero for disabled monitors.",
          "Verification settled into sampling, and the professions that once checked results " +
          "now certify how the sample was drawn." ] },
  power: {
        s1: [
          "Between January and March 2026, county boards and siting commissions blocked or " +
          "delayed 75 data-centre projects worth $130 billion; the laboratories behind them " +
          "wait four to seven years for a grid connection.",
          "Interconnection queues in three American regions run past five years, and a queue " +
          "position becomes a tradeable asset." ],
        s2: [
          "Utilities sign long supply contracts with computing operators that move fuel-price " +
          "risk onto households.",
          "Two states pass laws making large loads pay the full cost of the network they " +
          "require." ],
        s3: [
          "After a capacity auction cleared at its $329.17 ceiling and recovered $9.3 billion " +
          "from households, utility commissioners in Virginia, Ohio and Georgia write a " +
          "separate tariff class for computing halls.",
          "Grid operators publish curtailment schedules that computing operators plan their " +
          "training runs around." ],
        s4: [
          "Laboratory directors book their largest training runs into the weeks a transmission " +
          "operator says it can carry; the substation engineers who make that call earn more " +
          "than the researchers waiting on it.",
          "New generation built for computing stays on the system afterwards, cutting household " +
          "bills in the regions that took it." ],
        s5: [
          "Transmission engineers are the scarcest hire in the sector, and their salaries pass " +
          "those of the researchers they serve.",
          "Counties that refused the halls have cheaper land and dearer electricity than the " +
          "ones that took them." ],
        s6: [
          "Cities draw household power from generation and lines first built for computing " +
          "halls. Public utility commissions set the tariff that retires the debt on them.",
          "The physical mark the period left is a rebuilt electricity system, and the argument " +
          "over who paid for it has not closed." ] },
  scale: {
        s1: [
          "As AI revenue passes the annual turnover of the largest existing industries, pension " +
          "trustees holding the four hyperscalers rewrite their concentration limits to stay " +
          "inside their own mandates.",
          "AI revenue passes the annual turnover of the largest existing industries, and index " +
          "providers create a sector for it." ],
        s2: [
          "Pension funds find their exposure runs through supply chains they never listed, and " +
          "trustees commission a look-through audit.",
          "Central banks add AI capital spending to their financial stability reports as a " +
          "named risk." ],
        s3: [
          "Index funds cap their AI weighting by rule, and the trustees of state retirement " +
          "systems explain to legislators why one sector larger than oil sits at a quarter of " +
          "the portfolio.",
          "Sovereign funds take direct stakes in computing operators, on terms negotiated " +
          "between governments." ],
        s4: [
          "Finance ministries build national revenue forecasts around a single sector: budget " +
          "speeches name token volumes where speeches of the 2020s named barrels.",
          "Finance ministries build revenue forecasts around one sector, and budget speeches " +
          "name compute where they once named oil." ],
        s5: [
          "Actuaries setting contribution rates model one industry's failure as the largest " +
          "single risk to retirement income.",
          "Competition authorities open structural inquiries into the four firms that hold most " +
          "of the capacity." ],
        s6: [
          "Sovereign wealth funds and public pension funds hold compute operators as their " +
          "largest single position, and the actuaries who set contribution rates model one " +
          "industry's utilisation.",
          "A sector larger than energy is held by a few dozen institutions, and the " +
          "concentration is older than most of the people managing it." ] },
  split: {
        s1: [
          "Two neighbours in one county hold opposite views of artificial intelligence. " +
          "Campaign managers poll the question in every district after Gallup found 39% of " +
          "Americans calling it more harmful than helpful in 2026.",
          "Support for AI cuts across party lines, so campaign managers poll it separately in " +
          "every district." ],
        s2: [
          "Legislative caucuses form on the AI question inside both parties, and the whips " +
          "count them separately.",
          "Trade unions split over automation clauses, with the industrial locals and the " +
          "service locals taking opposite positions." ],
        s3: [
          "Because political parties field candidates on both sides of the AI question in one " +
          "legislature, a whip counting votes on a compute bill sorts members by the " +
          "temperament of their constituencies.",
          "Church bodies, professional associations and veterans' organisations all issue " +
          "statements, and none of them agrees internally." ],
        s4: [
          "Union locals split over automation clauses inside one national contract, leaving the " +
          "negotiators to settle those clauses plant by plant.",
          "Local elections turn on siting decisions that national parties have taken no " +
          "position on." ],
        s5: [
          "Two candidates from one party run on opposite AI platforms in the same primary, and " +
          "both win somewhere.",
          "Newspapers stop describing the argument as left against right, because their own " +
          "readership surveys will not support it." ],
        s6: [
          "Voter coalitions formed in the AI arguments of the 2030s still organise elections, " +
          "though the parties holding them together campaign on housing, health and pensions.",
          "The coalitions formed in these arguments outlasted them, and they now organise " +
          "elections about housing, health and pensions." ] },
  strait: {
        s1: [
          "Advanced packaging for every frontier run sits in one place two governments both " +
          "claim; policing what leaves it, export agents in Washington collected close to $420 " +
          "million in smuggling penalties by early 2026.",
          "Advanced packaging for every frontier run happens in one place, and moving wafers " +
          "there and back is a step nobody has replaced." ],
        s2: [
          "Two governments rewrite export rules against each other every quarter, and firms " +
          "building multi-year plants guess which version will govern them.",
          "Insurers price war risk into shipping rates for one strait, and the premium reaches " +
          "the cost of every accelerator." ],
        s3: [
          "One contested manufacturing region finishes the chips both blocs train on: a " +
          "hyperscaler's board reads a naval risk assessment before approving the next hall, " +
          "and its underwriters price that hall on the same reading.",
          "Both blocs fund domestic packaging capacity, and both find the workforce takes " +
          "longer to build than the plant." ],
        s4: [
          "Because engineers who can qualify a packaging line hold the scarcest résumé in the " +
          "industry, both blocs pay relocation money to move them and their families onto home " +
          "soil.",
          "Certification regimes diverge, and a part crossing between them clears a licence a " +
          "named official signs." ],
        s5: [
          "Engineers who can qualify a packaging line move between countries with their " +
          "families, on terms governments negotiate.",
          "One quarter's disruption at a single site shows up in every national capability " +
          "figure two quarters later." ],
        s6: [
          "Two accelerator supply chains carry certification neither side recognises, and every " +
          "part crossing between them clears a licence a named official signs. The contested " +
          "manufacturing region still decides who trains at frontier scale.",
          "Two supply chains grew that do not recognise each other's parts, and the contested " +
          "region still decides who trains at frontier scale." ] },
  work: {
        s1: [
          "With payrolls more than 15% below their 2026 level, unemployment offices in Ohio and " +
          "Georgia hire caseworkers to clear claim queues already past their statutory " +
          "deadlines.",
          "Payrolls fall more than 15% below their 2026 level, and unemployment offices hire " +
          "caseworkers to clear the queues." ],
        s2: [
          "Entry-level hiring stops first, and the professions find they have no way to train " +
          "the seniors they will need.",
          "Severance and retraining costs move onto corporate balance sheets as a named " +
          "provision." ],
        s3: [
          "As claims outrun what unemployment insurance sized for 2026 payrolls can pay, " +
          "legislators rewrite the formula; in Columbus a claims examiner carries three times " +
          "her predecessor's caseload.",
          "Legislators rewrite unemployment insurance formulas sized for 2026 payrolls, and the " +
          "arithmetic does not close." ],
        s4: [
          "A machinist's daughter commutes ninety minutes to the work remaining in a county " +
          "that shed 15% of its jobs after 2026, where her school district taxes houses valued " +
          "below their mortgages.",
          "Counties that lost paperwork jobs lose their tax base, and their school districts " +
          "levy on houses valued below their mortgages." ],
        s5: [
          "Transfers to households are the largest line in several national budgets, and the " +
          "argument is over who funds them.",
          "Trades that need a body on site pay more than professions that trained for years, " +
          "and apprenticeship applications rise." ],
        s6: [
          "Municipal budgets in the counties that shed work after 2026 rest on transfers from " +
          "the capital: the assessors, teachers and clinic staff those counties employ draw " +
          "their salaries from an AI revenue levy.",
          "Municipal budgets in the counties that shed the work rest on transfers from the " +
          "capital, and the staff they employ are paid from an AI levy." ] },
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
  const span = spanFromStage(stageOf(year, tracks));
  const cap = tracks.cap[i];
  // SIX SHAPES, CHOSEN BY THE WORLD-LINE. Two fixed openings — "Between the principal states"
  // and "On the capital side" — labelled every headline the same way whatever the setting, and
  // the clauses they labelled had no subject of their own. Every clause is now a complete
  // sentence, so the assembly can vary its shape instead of propping them up. The index is
  // derived from the line and the year, so one state always reads the same way and two
  // neighbouring states rarely read alike.
  const lower = (t) => (t ? t.charAt(0).toLowerCase() + t.slice(1) : t);
  const strip = (t) => String(t || '').replace(/\.\s*$/, '');
  const yr = Math.floor(year);
  // THE CAPABILITY CLAUSE OPENS EVERY HEADLINE, so its repetition is the repetition a reader
  // notices most. Seven rungs times four spans gave 28 phrases for the whole document, and one
  // of them carried 29.6% of 5,000 composed headlines. Each rung now holds six stages and three
  // alternatives in each, and the alternative is chosen by the year, so consecutive years at one
  // capability level say different true things about it.
  let rungRow = RUNG_SHORT[RUNG_SHORT.length - 1][1];
  for (const [t, r] of RUNG_SHORT) if (cap >= t) { rungRow = r; break; }
  const pickRung = (row) => {
    const st = stageOf(year, tracks);
    let opts = row[st];
    if (!opts) {
      for (let n = +st.slice(1); n >= 1 && !opts; n--) opts = row['s' + n];
      for (let n = +st.slice(1); n <= 6 && !opts; n++) opts = row['s' + n];
    }
    if (!opts) return row[span] || row.near || row.mid || row.long || row.far || '';
    if (typeof opts === 'string') return opts;
    return opts;
  };
  const rungOpts = pickRung(rungRow);
  // THE HEADLINE HAD TWO OF ITS FOUR SLOTS ON CHIPS AND MONEY, whatever the year and whatever
  // the setting: coordination between states held one and the economy held the other, and the
  // economy slot was itself a compound of two finance clauses. A reader met the same subject
  // four sentences running and reported the document as being about data centres. The slots are
  // now what the sheet is about — what the systems do, what that does to the world, who decides
  // and on what authority, and what is unsettled — and supply, capital and coordination take
  // their turn inside those as one thread among several.
  const clauseFor = (ax) => (ax === 'E' ? econClause(wl, span, year, tracks)
    : stageText(HEADCL[wl[ax]], year, tracks));
  // TWO SLOTS DRAWING ON OVERLAPPING LISTS CAN DRAW THE SAME CLAUSE. Laboratory conduct sits in
  // both what-AI-is-doing and who-decides, so when both rotations landed on it the headline
  // printed one sentence twice — visible in 2071 the day the benefit axis widened the first list
  // and moved the modulo. A slot skips whatever the sheet has already said this year.
  const used = [];
  const pick = (list, salt) => {
    let fallback = '';
    for (let n = 0; n < list.length; n++) {
      const ax = list[(Math.abs(yr * 7 + vary(wl, 0, 11) + salt) + n) % list.length];
      const t = clauseFor(ax);
      if (!t) continue;
      const c = strip(t);
      if (!used.includes(c)) { used.push(c); return c; }
      fallback = fallback || c;
    }
    return fallback;
  };
  // what AI is doing to the world: to work, to control of it, to what it costs, to how fast
  const effect = pick(['D', 'A', 'E', 'T', 'L', 'G'], 0);
  // A HEADLINE IS A PARAGRAPH, AND ITS SENTENCES SHOULD NOT ALL BE PUNCTUATED ALIKE. The three
  // clauses below are fixed by the setting, but the capability clause has alternatives, so it
  // takes the one whose mark the others have not already used. August counted three semicolons
  // in four sentences.
  const markOf = (t) => (/;/.test(t) ? ';' : /\w:\s/.test(t) ? ':' : /^(?:Because|Since|While|Although|When|As|Having|With)\b/.test(t) ? 'sub' : /,\s+and\s/.test(t) ? 'and' : '.');
  // who decides, and with what consent
  const author = pick(['C', 'R', 'P', 'L'], 5);
  // what remains unsettled. The tension clause reads the sharpest pressure in the line, which
  // is one reading per span, so a third of years take the conditions under that pressure
  // instead and the same line reads differently from one year to the next.
  const unsettled = (Math.abs(yr * 3 + vary(wl, 0, 5)) % 3 === 0 && pick(['S', 'K'], 9)) ||
    strip(stageText(TENSION[tensionKey(wl, tracks, i)], year, tracks) || '') || pick(['S', 'K', 'P'], 9);
  if (unsettled) used.push(unsettled);
  // the capability clause is chosen last, against the marks the other three already carry
  const taken = [effect, author, unsettled].map(markOf);
  const rung = (() => {
    if (typeof rungOpts === 'string') return rungOpts;
    const start = Math.abs(yr * 11 + vary(wl, 0, 7)) % rungOpts.length;
    for (let n = 0; n < rungOpts.length; n++) {
      const cand = rungOpts[(start + n) % rungOpts.length];
      const m = markOf(cand);
      if (m === '.' || !taken.includes(m)) return cand;
    }
    return rungOpts[start];
  })();
  // RULE 10 APPLIES TO THE HEADLINE, WHICH IS A PARAGRAPH. "the topic sentence comes at or near
  // the beginning; the succeeding sentences explain or establish or develop the statement made
  // in the topic sentence." What these systems can do is the topic; everything else develops it.
  // August, on a headline that opened on a consequence: "the first two sentences seem out of
  // order... It is fine to start with the same relatively structured update on AI capabilities."
  // EVERY shape opens on it. Four of six did, and August asked for all: "let's please keep the AI
  // capability sentences first." The clauses themselves carry the variety, which is where Strunk
  // puts it, and the order of the three that follow varies instead.
  const shapes = [
    () => `In ${yr}, AI is ${rung}. ${effect}. ${author}. ${unsettled}.`,
    () => `By ${yr}, AI is ${rung}. ${effect}. ${author}. ${unsettled}.`,
    // A YEAR TACKED ON THE END NEEDS A SHORT CLAUSE IN FRONT OF IT. With a compound capability
    // clause the result was "AI is right in every test performed, although nobody can say why;
    // mistakes therefore appear first in use in 2041" — the date arriving after two clauses and
    // reading as part of the second.
    () => (/[;:]/.test(rung) || rung.split(/\s+/).length > 12
      ? `In ${yr}, AI is ${rung}. ${author}. ${effect}. ${unsettled}.`
      : `AI is ${rung} in ${yr}. ${author}. ${effect}. ${unsettled}.`),
    // A SEMICOLON SHAPE NEEDS A SIMPLE SECOND CLAUSE. Where the effect clause carries its own
    // semicolon the result is three clauses in one breath: "In 2041, AI is solving problems
    // nobody had posed; the public treats AI as a swindle; the technology it dismissed carries
    // on improving."
    () => (/[;:]/.test(effect)
      ? `In ${yr}, AI is ${rung}. ${effect}. ${author}. ${unsettled}.`
      : `In ${yr}, AI is ${rung}; ${lower(effect)}. ${author}. ${unsettled}.`),
    () => (/[;:]/.test(rung) || rung.split(/\s+/).length > 12
      ? `By ${yr}, AI is ${rung}. ${effect}. ${author}. ${unsettled}.`
      : `AI is ${rung}, and this is ${yr}. ${effect}. ${author}. ${unsettled}.`),
    () => `In ${yr}, AI is ${rung}. ${unsettled}. ${effect}. ${author}.`,
  ];
  // NOTHING CHAINS MORE THAN TWO CLAUSES WITH "and". The economy clause is itself a compound
  // — a base and a modifier joined with "and" — so a shape that joins it to a third ran to
  // four: "...guarantees, and four capital budgets set the ceiling, and each earnings call
  // revises it, and firms holding capable systems compete...". A shape whose result chains
  // past two falls back to the four-sentence form, which never chains at all.
  // The count is PER SENTENCE. Counting across the whole headline flagged four separate
  // sentences carrying one "and" each, which reads perfectly well; what tires a reader is one
  // sentence chaining three or four. The economy clause is itself a compound, so any shape
  // that joins it to a third clause makes such a chain, and those fall back to the
  // four-sentence form, which puts each clause in its own sentence.
  const chainDepth = (t) => Math.max(0, ...String(t).split(/(?<=\.)\s+/)
    .map((sent) => (sent.match(/,\s+and\s/g) || []).length));
  // A CLAUSE THAT IS ALREADY COMPOUND CANNOT BE JOINED TO ANOTHER. The stage clauses carry their
  // own semicolons and their own "so" and "while" limbs, because a stage says what happened and
  // why. Joining two of those with "and" produced forty-word sentences the chain counter passed,
  // since it counts ", and" and these chain on punctuation instead. Where two of the four clauses
  // are already compound, every clause takes its own sentence.
  // MEASURE THE RESULT, do not proxy it. Counting compound clauses caught the worst joins and
  // missed the shape that strings three clauses on commas, which still ran to fifty-two words.
  // The test is the sentence a reader actually gets.
  const longest = (t) => Math.max(0, ...String(t).split(/(?<=[.!?])\s+/)
    .map((sent) => sent.trim().split(/\s+/).length));
  const chosen = shapes[vary(wl, year, shapes.length)]();
  const flat = shapes[0]();
  const ok = longest(chosen) <= 32 && chainDepth(chosen) <= 1;
  return deLong(deChain(ok ? chosen : flat));
}

// ── the long form ───────────────────────────────────────────────────────────
// A position opened from the controls gets more room than a paragraph, so it gets a
// different shape: a subhead naming what follows, then the evidence as separate lines. Each
// bullet is a complete sentence carrying a figure and a date, so a reader can check one
// without reading the rest.
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
  E3: { head: "Ownership changes, capacity stays",
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
