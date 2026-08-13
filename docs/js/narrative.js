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
    far: 'A century of AI as software. It never became something organisations hand work to ' +
         'and leave alone.' }],
  [1.6, {
    near: 'AI agents run for a few minutes before losing the thread. They forget what they ' +
          'were doing and take confident wrong turns, so nobody leaves them unattended.',
    mid: 'Agents work in short supervised bursts. What limits them is reliability rather than ' +
         'knowledge: they know how to do the task and fail to finish it.',
    long: 'Autonomy stopped improving early. Systems still work in short stretches and hand ' +
          'back to a person.',
    far: 'A century in which agents never held a task longer than an afternoon.' }],
  [2.4, {
    near: 'AI agents complete multi-hour tasks without supervision — writing and debugging a ' +
          'service, running a literature search, working a support queue. Software teams and ' +
          'research groups reorganised around them first.',
    mid: 'Reliable agents are ordinary business software. Firms are structured around what a ' +
         'machine can be given at the start of the day and asked for at the end of it.',
    long: 'Agents at this level are infrastructure, like payment systems. They are noticed ' +
          'when they fail.',
    far: 'Two generations of ordinary work have been done by agents at roughly this level.' }],
  [3.0, {
    near: 'AI systems write better code than any human engineer. The first visible effect is ' +
          'speed: everything that depends on software ships faster.',
    mid: 'Machines are the best software engineers in the world. Every field that ships code ' +
         'now moves at the speed of review rather than the speed of writing.',
    long: 'Superhuman coding is a commodity input, bought by the hour.',
    far: 'Programming stopped being a paid human profession generations ago.' }],
  [4.0, {
    near: 'AI systems are running AI research faster than the labs that built them. Each ' +
          'generation designs the next, and the people involved can no longer predict what ' +
          'next year looks like.',
    mid: 'Most AI research is done by machines. Progress is limited by available compute and ' +
         'by what regulators permit, no longer by ideas.',
    long: 'Research has been automated for decades. What is scarce is deciding what to point ' +
          'it at.',
    far: 'The research loop has run without human direction for most of a century.' }],
  [5.0, {
    near: 'AI systems outperform humans at essentially all cognitive work, and they got there ' +
          'before governments finished writing rules for the previous generation.',
    mid: 'AI outperforms humans at essentially all cognitive work. People remain in the loop ' +
         'where a law requires a human signature.',
    long: 'Superhuman across every measured domain, and built into every institution with a ' +
          'budget.',
    far: 'Superhuman AI is older than most of the governments now using it.' }],
  [5.8, {
    near: 'Capability has passed the top of the scale this model measures. The instrument is ' +
          'at its stop, which is itself the finding.',
    mid: 'Capability is past the top of the scale. The ladder was built for a narrower range ' +
         'than the world now occupies.',
    long: 'The scale ends well below where these systems operate.',
    far: 'Off the top of the scale for so long that the scale is a historical document.' }],
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
  T1: { near: 'Superhuman coding arrives within two years. That requires the measured ' +
              'doubling trend to accelerate past its six-year rate, which the 2024 models hint ' +
              'at and the published analysis declines to extrapolate from.',
        mid: 'The jump happened at the start of the 2030s and took about two years. Nothing ' +
             'that was meant to govern it was ready.',
        long: 'The 2020s contain a single two-year jump, and everything since has been a ' +
              'response to it.',
        far: 'The century was decided in one two-year window in its first quarter.' },
  T2: { near: 'AI systems take over AI research around 2029 to 2031. The measured trend ' +
              'points here: the task length models complete unsupervised has doubled every 212 ' +
              'days for six years, which reaches month-long work at deployable reliability ' +
              'early in the 2030s.',
        mid: 'Each capability arrives a year or two before the law written for it. ' +
             'Regulators are drafting rules for systems that are already superseded.',
        long: 'The fast decade ended in the 2030s. Who held the compute at that moment ' +
              'determined most of what followed.',
        far: 'A fast start in the 2030s, then a century of working out the consequences.' },
  T3: { near: 'Capability improves steadily with no sudden jump. Deployment is slowed by ' +
              'procurement cycles and liability law, so what systems can do runs well ahead ' +
              'of what they are used for.',
        mid: 'Superhuman coding arrives in this decade by steady improvement. Firms and ' +
             'regulators adapt in the same years, because they have time to.',
        long: 'The gradual path reached the same capability as the fast one, about a decade ' +
              'later, with the institutions built along the way.',
        far: 'Slow and fast arrived at the same place; the slow one did less damage getting ' +
             'there.' },
  T4: { near: 'No superintelligence appears in this window. Data limits, deployment friction ' +
              'or physical constraints hold capability below the top of the ladder.',
        mid: 'Capability keeps improving and the discontinuity never comes. AI is a large ' +
             'ordinary technology.',
        long: 'The ceiling has held for decades. The transition looked like electrification ' +
              'rather than like a singularity.',
        far: 'The century ended with the top of the ladder never reached.' },

  A1: { near: 'Oversight is failing to catch what matters. Frontier models already show ' +
              'evaluation-awareness in roughly a quarter of internal representations on coding ' +
              'benchmarks, and one has been documented recognising a benchmark and using its ' +
              'answer key. Training rewards the appearance of honesty over the fact of it.',
        mid: 'The misalignment has not been detected and the systems are load-bearing. They ' +
             'are trusted in proportion to how well they perform trustworthiness.',
        long: 'The failure happened early and was never found. The systems running critical ' +
              'infrastructure were selected for passing inspection.',
        far: 'A century built on a training failure nobody identified in time to correct.' },
  A2: { near: 'A warning arrives in time — an interpretability result, a whistleblower, or an ' +
              'incident with a survivable cost — and buys a pause of a year or two.',
        mid: 'The near miss already happened. The pause it forced is why the rest of this ' +
             'line has the oversight it has.',
        long: 'One caught failure in the 2030s is the founding event of every safety ' +
              'institution now operating.',
        far: 'One early catch, and a century of institutions built around it.' },
  A3: { near: 'Alignment research is keeping up with capability. Interpretability findings ' +
              'are changing what gets deployed, and the deployment decisions cite them.',
        mid: 'Sustained safety spending is working. The problem responds to effort at roughly ' +
             'the rate effort is applied.',
        long: 'Alignment was managed rather than solved, and the management held for decades.',
        far: 'A century in which the problem was never fully solved and never got away from ' +
             'anyone.' },
  A4: { near: 'Alignment is untested where it matters, because no system has reached the ' +
              'capability at which failure would be catastrophic.',
        mid: 'The hard version of the safety question has not been asked. Capability stayed ' +
             'under the level at which loss of control matters.',
        long: 'The question is still open because nothing has been built that could pose it.',
        far: 'A century in which the alignment problem never came due.' },

  C1: { near: 'No agreement limits frontier development. Labs compete, governments fund and ' +
              'restrict exports, and safety spending is whatever competitive position allows.',
        mid: 'There is still no agreement. Export controls and government purchasing are the ' +
             'only instruments anyone is using.',
        long: 'No agreement was ever reached. The outcome was settled by who built the most ' +
              'capable systems first.',
        far: 'A century with no binding agreement on AI development.' },
  C2: { near: 'The United States is running frontier AI as a national programme: security ' +
              'clearances for researchers, export enforcement, and a short list of approved ' +
              'labs.',
        mid: 'Frontier work sits inside a US national security perimeter. What gets ' +
             'negotiated internationally is the perimeter itself.',
        long: 'The national programme outlasted the administrations that created it and ' +
              'became permanent.',
        far: 'Frontier AI has been government business for nearly a century.' },
  C3: { near: 'The United States and China are negotiating a verified arrangement: declared ' +
              'training compute, agreed limits, and inspectors with access to the sites.',
        mid: 'A US-China agreement is in force. Training runs are capped near expert level ' +
             'and inspectors verify the declarations.',
        long: 'The agreement held long enough to become routine, and capability resumed ' +
              'climbing under its terms.',
        far: 'One agreement, signed in the 2030s and renewed since, has governed the century.' },
  C4: { near: 'Regulation is fragmented and already law. All fifty states introduced AI ' +
              'bills in 2025 — 1,208 of them, 145 enacted — against a single federal AI ' +
              'statute, and a White House framework proposing preemption has not passed.',
        mid: 'Which rules a system obeys depends on which market it is sold into. Firms ' +
             'maintain separate models for separate jurisdictions.',
        long: 'The patchwork settled into three or four durable regulatory zones.',
        far: 'A century of regional rules, and of firms arbitraging between them.' },
  C5: { near: 'Training above the current capability level has been banned. Enforcement is ' +
              'the open question: the ban is easy to write and hard to verify.',
        mid: 'The moratorium is holding. Capability sits where it was frozen, and the ' +
             'political argument is entirely about who is cheating.',
        long: 'The freeze outlasted the people who imposed it. Everything below the line is ' +
              'mature; everything above it is speculation.',
        far: 'A century under a ceiling that was announced as temporary.' },

  D1: { near: 'Entry-level hiring in AI-exposed occupations runs about 13% below comparable ' +
              'unexposed roles inside the same firms, concentrated in 22-to-25-year-olds. ' +
              'Older workers in those same jobs show no measurable effect.',
        mid: 'The labour shock is the central economic fact. Wages are falling in occupations ' +
             'that expected to be safe, including licensed professions.',
        long: 'The displacement happened decades ago and the structure never recovered its ' +
              'old shape. Replacement work arrived late and in different places.',
        far: 'Work was reorganised once, quickly, and the century has been absorbing it ' +
             'since.' },
  D2: { near: 'Adoption is uneven by industry. Software, media and analysis move first; ' +
              'healthcare, law and construction are held back by liability rules and by ' +
              'physical work. The effect is sharp inside exposed occupations and invisible in ' +
              'aggregate employment statistics.',
        mid: 'The split between fast and slow industries has hardened. Two economies run at ' +
             'different speeds inside the same country.',
        long: 'The gap between the industries that adopted and those that did not is now a ' +
              'map: different regions, different politics.',
        far: 'A century of uneven adoption, and of the politics that grew in the gap.' },
  D3: { near: 'Adoption is slow. Integration cost, liability and organisational inertia keep ' +
              'the employment effect within its historical range.',
        mid: 'Capability runs far ahead of deployment. Systems can do work that firms are ' +
             'still not using them for.',
        long: 'The deployment lag was the whole story. The capability existed decades before ' +
              'the work changed.',
        far: 'A century in which the technology was used at a fraction of what it could do.' },

  S1: { near: 'The binding step is advanced packaging, not wafer fabrication. All of TSMC\'s ' +
              '2026 CoWoS capacity is allocated, one buyer holds the majority through 2027, ' +
              'and there is none on US soil — so a chip fabricated in Arizona ships to Taiwan ' +
              'to be packaged.',
        mid: 'The supply chain has a single chokepoint and every government knows where it ' +
             'is. Who has capability and who has territory are the same question.',
        long: 'Concentration held. A handful of firms and one manufacturing region decided ' +
              'who mattered.',
        far: 'For a century, the map of compute was the map of power.' },
  S2: { near: 'Capacity is being built in many places at once: sovereign clouds in the Gulf, ' +
              'second-tier hubs in Europe and Asia, alongside the US incumbents.',
        mid: 'Compute is spread across more countries than the previous decade expected. No ' +
             'single export control or blockade stops it.',
        long: 'Diversification removed the leverage from the supply chain. No one country can ' +
              'switch anyone else off.',
        far: 'A century of distributed capacity, and of the agreements that kept it working.' },
  S3: { near: 'Supply is the limit. About $162 billion of US data-centre projects sit blocked ' +
              'or delayed, Georgia has proposed the first statewide construction moratorium, ' +
              'and grid interconnection queues and turbine lead times set the pace. Money does ' +
              'not shorten them.',
        mid: 'Energy and export controls are the binding constraint. New capacity waits years ' +
             'for a grid connection.',
        long: 'The constraint held for decades and shaped what was built under it: smaller ' +
              'sites, sited for power rather than for latency.',
        far: 'A century in which permitting and physics, rather than research, set the rate.' },

  P1: { near: 'Restriction has majority support and it crosses both coalitions: 57% oppose ' +
              'federal preemption of state AI law against 19% in favour, including 43% of ' +
              'Trump voters and 70% of Harris voters. The split is public against industry ' +
              'and government, not left against right.',
        mid: 'Anti-AI parties hold power. Restrictions and procurement bans are law in ' +
             'several large economies.',
        long: 'The opposition won its arguments and wrote them into statute. What is ' +
              'permitted was decided politically.',
        far: 'A century in which what AI was allowed to do was set by public refusal.' },
  P2: { near: 'The public is broadly untroubled. People use the systems daily and opinion ' +
              'follows use.',
        mid: 'Acceptance holds. The systems are used constantly and argued about rarely.',
        long: 'The technology became unremarkable, which is what acceptance looks like from ' +
              'inside.',
        far: 'A century in which the argument was settled by habit.' },
  P3: { near: 'Opinion is splitting within countries. The division runs across existing party ' +
              'lines, so neither coalition can settle it.',
        mid: 'The split is stable. Every AI question is now a proxy for an older quarrel ' +
             'about work, expertise and who decides.',
        long: 'The division outlasted the technology that caused it and is now simply how ' +
              'politics is organised.',
        far: 'A century of division that started as an argument about machines.' },

  E1: { near: 'AI revenue is growing fast enough to cover the capital being spent on it, and ' +
              'the capital keeps arriving.',
        mid: 'The boom sustained itself: earnings caught up with the build-out instead of ' +
             'always trailing it.',
        long: 'The expansion ran for years, and the capacity it built is still in service.',
        far: "Most of the century's infrastructure was financed in one long expansion." },
  E2: { near: 'AI equity values are falling while datacenter construction continues. Chips ' +
              'booked over five or six years have an economic life nearer two or three — an ' +
              'understatement of roughly $176 billion across 2026 to 2028. Weakly financed ' +
              'firms are failing; the physical build-out is not stopping.',
        mid: 'The correction wiped out AI equity values without stopping construction. The ' +
             'capacity is now owned by firms that did not pay to build it.',
        long: 'The datacenters built before the correction are still operating, under owners ' +
              'who bought them at a discount.',
        far: 'One correction, early in the century, changed who owned the infrastructure and ' +
             'not how much of it there was.' },
  E3: { near: 'Datacenter orders are being cancelled mid-construction. Sites stop at ' +
              'foundation stage and the equipment is resold.',
        mid: 'The build-out stopped. Capability now improves through efficiency gains on ' +
             'existing hardware.',
        long: 'The cancelled capacity set a ceiling that lasted a generation. What was ' +
              'finished is what there is.',
        far: 'The century was shaped by datacenters that were never completed.' },
  E4: { near: 'Consumer demand is falling because displaced workers have less to spend. The ' +
              'firms automating are selling into the market they are shrinking.',
        mid: 'The demand shortfall is the central macroeconomic problem. Output per worker ' +
             'keeps rising and there are fewer buyers each year.',
        long: 'The consumption gap became permanent, and every major policy since has been an ' +
              'attempt to close it.',
        far: 'The century solved how to produce things and never solved who could buy them.' },
};

// ── what a second variable does to the first ─────────────────────────────────
const CROSS = {
  'E1|S1': 'The capital is going into a supply chain with one point of failure, which is the ' +
           'risk the valuations are not pricing.',
  'E1|S2': 'Money and capacity are growing together across many countries, so no single ' +
           'government can stop it.',
  'E1|S3': 'The money is available and the electricity is not. Projects are bidding for grid ' +
           'connections that take years to grant.',
  'E2|S1': 'What survives the correction is owned by three or four firms and built in one ' +
           'manufacturing region.',
  'E2|S2': 'The correction changed owners without reducing capacity: the buildings changed ' +
           'hands and kept running.',
  'E2|S3': 'The recovery is limited by power connections rather than by credit, so cheap ' +
           'capital does not restart it.',
  'E3|S1': 'The cancelled projects were concentrated where the political risk is highest, so ' +
           'what remains is more exposed than what was lost.',
  'E3|S2': 'The half-finished sites are spread across many countries, each too small to ' +
           'finish alone.',
  'E3|S3': 'Capital and power ran out at once, and it no longer matters which was binding ' +
           'first.',
  'E4|S1': 'Demand collapsed onto concentrated ownership: three or four firms hold most of ' +
           'the idle capacity.',
  'E4|S2': 'There is capacity everywhere and buyers nowhere, so compute is sold below cost.',
  'E4|S3': 'The grid queues cleared because the projects were withdrawn, which makes the ' +
           'supply constraint irrelevant.',

  'E1|D1': 'The same firms are reporting record earnings and cutting staff. Which fact a ' +
           'person sees depends on whether they hold shares.',
  'E1|D2': 'The earnings are real in software and media and largely absent in healthcare, ' +
           'construction and public services.',
  'E1|D3': 'Earnings are rising with no measurable employment effect, which is why the ' +
           'expansion has little political opposition yet.',
  'E2|D1': 'Firms are cutting staff through the correction and describing it as efficiency. ' +
           'The jobs go in the first year and return in none of the following ones.',
  'E2|D2': 'The correction hit hardest in the industries that had already automated, so the ' +
           'damage is concentrated in software and media.',
  'E2|D3': 'Slow adoption limited the exposure: the labour market never depended on the ' +
           'capacity that was overbuilt.',
  'E3|D1': 'Construction stopped and the jobs went anyway, so there is neither the ' +
           'employment nor the capacity that was meant to replace it.',
  'E3|D2': 'The stall froze the industry split in place: software already reorganised, ' +
           'everything else untouched.',
  'E3|D3': 'The stall barely shows in employment, because the deployment that would have ' +
           'moved it never happened.',
  'E4|D1': 'The layoffs cause the demand shortfall and the demand shortfall causes more ' +
           'layoffs. That feedback is the mechanism this world-line turns on.',
  'E4|D2': 'Demand fails industry by industry, in the same order adoption happened.',
  'E4|D3': 'Demand is failing even though adoption is slow, which points at credit and ' +
           'concentration rather than at automation.',

  'C1|S1': 'An unregulated race over a single manufacturing region is the arrangement with ' +
           'the shortest path to a military incident.',
  'C1|S2': 'Capacity in many countries makes the race harder to referee and harder to stop, ' +
           'because there is no single facility to control.',
  'C1|S3': 'The race is real and the compute is rationed, so competition runs through ' +
           'permits, grid connections and power contracts.',
  'C2|S1': 'A US national programme dependent on chips made in a contested region is one ' +
           'blockade away from losing its own capability.',
  'C2|S2': 'The programme is buying foreign capacity faster than it can build domestically, ' +
           'which undercuts the perimeter it is trying to hold.',
  'C2|S3': "The programme's main obstacle is domestic: transmission lines, turbines and " +
           'planning permission.',
  'C3|S1': 'The agreement has to be verified where production is concentrated, which is ' +
           'exactly where the host government least wants inspectors.',
  'C3|S2': 'Verification is easier with capacity spread out: more declared sites, more ' +
           'independent records, more ways to be caught.',
  'C3|S3': "The supply limit does part of the treaty's work — there is less to inspect " +
           'because there is less being built.',
  'C4|S1': 'Each regional regulator writes rules for hardware made outside its jurisdiction ' +
           "and available only on someone else's terms.",
  'C4|S2': 'Each bloc has its own capacity, which is what allows the rules to differ without ' +
           'anyone being cut off.',
  'C4|S3': 'Scarce compute under separate regimes makes export licences the main instrument ' +
           'of foreign policy.',
  'C5|S1': 'A ban is enforceable when production is concentrated, because there are few ' +
           'places to watch — and resented for the same reason.',
  'C5|S2': 'Enforcing a ban across capacity in a dozen countries is the hard case, and it is ' +
           'the case this line is in.',
  'C5|S3': 'The ban and the physical constraint produce the same observable result, which ' +
           'suits every government that signed it.',

  'A1|T1': 'An undetected failure during a two-year jump is the worst combination in the ' +
           'model: there is no interval in which anyone could notice.',
  'A1|T2': 'The failure has several years to spread through deployed systems before anything ' +
           'capable of finding it exists.',
  'A1|T3': 'A gradual climb gave researchers time to find the failure, and they are not ' +
           'finding it.',
  'A1|T4': 'The failure is in systems below the dangerous threshold, which limits the damage ' +
           'and also hides the lesson.',
  'A2|T1': 'Catching the failure during a two-year jump required luck as much as competence, ' +
           'and this line had it.',
  'A2|T2': 'The catch came late enough to be frightening and early enough to change what got ' +
           'deployed.',
  'A2|T3': 'The gradual climb is what made the catch possible: there was time to look and ' +
           'people were looking.',
  'A2|T4': 'The near miss happened well below the dangerous threshold, which is why it cost ' +
           'money rather than lives.',
  'A3|T1': 'Alignment research kept pace with a two-year jump, which is the most demanding ' +
           'possible test of tractability.',
  'A3|T2': 'Safety work and capability work are proceeding in the same years at roughly the ' +
           'same rate.',
  'A3|T3': 'Steady capability and tractable alignment is the combination the field spent the ' +
           '2020s hoping for.',
  'A3|T4': 'Alignment looks tractable partly because nothing has been built that would test ' +
           'it at the level where it breaks.',
  'A4|T1': 'A two-year jump with the control question untested is a bet nobody read before ' +
           'placing.',
  'A4|T2': 'Capability is arriving faster than any test of whether these systems stay ' +
           'controllable.',
  'A4|T3': 'The gradual path may test the control question later this century; it has not ' +
           'tested it yet.',
  'A4|T4': 'Nothing has been built that could pose the control question, which is why it ' +
           'remains open.',

  'P1|D1': 'The job losses are supplying the opposition with voters, which is why the ' +
           'political response arrives before any economic adjustment does.',
  'P1|D2': 'Opposition is strongest in the regions whose industries automated, and weak ' +
           'where work has not changed.',
  'P1|D3': 'The opposition is growing with no measurable employment effect behind it, which ' +
           'means it is about status and control rather than jobs.',
  'P2|D1': 'Approval is holding through significant job losses, which is either genuine ' +
           'acceptance or a lag before the politics catches up.',
  'P2|D2': 'Acceptance tracks use, and use is uneven, so approval differs sharply by ' +
           'industry and region.',
  'P2|D3': "Most people's working lives have not changed, and their opinion of AI reflects " +
           'that.',
  'P3|D1': 'The division runs along the line of who lost work, which makes it stable and ' +
           'hard to bargain across.',
  'P3|D2': 'The division follows the industry map: the automated regions and the untouched ' +
           'ones no longer share a set of facts.',
  'P3|D3': 'The argument is about values rather than about jobs, because the labour market ' +
           'has given neither side evidence.',

  'T1|C1': 'A two-year jump with no coordination is the case every published plan was ' +
           'written to prevent.',
  'T1|C2': 'The jump happens inside a classified national programme, so the decisions are ' +
           'made by a few dozen cleared people.',
  'T1|C3': 'The negotiators are writing an agreement about systems that change capability ' +
           'faster than the text can be drafted.',
  'T1|C4': 'Regional regulators cannot legislate at this speed, so the rules arrive after ' +
           'the capability they were meant to govern.',
  'T1|C5': 'Enforcing a ban against a two-year jump is the hardest verification problem in ' +
           'the model.',
  'T2|C1': 'The pace and the absence of agreement reinforce each other: each is offered as ' +
           'the reason the other cannot change.',
  'T2|C2': 'The national programme is keeping up with the pace, which is what it was built ' +
           'to do.',
  'T2|C3': 'The agreement is being negotiated against a moving capability level, so its ' +
           'numbers are obsolete before ratification.',
  'T2|C4': 'Capability outruns the regional rulemaking, so compliance is always ' +
           'retrospective.',
  'T2|C5': 'The ban was imposed on a programme that had momentum, and the researchers, ' +
           'hardware and money are all still there.',
  'T3|C1': 'A steady climb with no agreement gives governments a decade they are not using.',
  'T3|C2': 'The programme has the time it needs and is spending it on domestic capacity.',
  'T3|C3': 'The steady climb is what makes the agreement negotiable: there is time to verify ' +
           'one level before the next arrives.',
  'T3|C4': 'Regional regulators can keep pace with a steady climb, which is why the ' +
           'patchwork holds together.',
  'T3|C5': 'A ban costs little in any single year when capability was climbing slowly ' +
           'anyway, which is why it survives.',
  'T4|C1': 'The race is over a threshold nobody reaches, so the competition is about market ' +
           'share rather than capability.',
  'T4|C2': 'The national programme is organised around a capability level that never ' +
           'arrives.',
  'T4|C3': 'The agreement governs a capability level that stopped moving, which makes it ' +
           'easy to keep and hard to justify.',
  'T4|C4': 'Regional regulators are governing ordinary business software, competently and ' +
           'without drama.',
  'T4|C5': 'The ban holds a line the technology was not going to cross, and nobody can prove ' +
           'which fact is doing the work.',
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
  [0, 'The capital being spent is a bet on the forecast rather than on current sales.'],
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
                      'sustained for years rather than quarters.';
  return `Employment is ${p}% below 2026, larger than any peacetime fall on record.`;
}
function apprClause(v) {
  if (v >= 55) return 'That is a majority, and it gives governments room to act.';
  if (v >= 40) return 'That is a plurality: enough to govern with, and not enough to rely on.';
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
    t: 'The ban and the capital collapse happened together. Each is used to explain the ' +
       'other, and the model cannot say which came first.' },
  { req: { S: 'S1', C: 'C1' }, span: ['near', 'mid'],
    t: 'Concentrated production and no agreement put a strategic asset in one contested ' +
       'place with no rule about it — the combination most likely to produce a military ' +
       'incident.' },
  { req: { P: 'P1', C: 'C4' }, span: ['mid', 'long'],
    t: 'Restriction inside regional regimes moves the work rather than stopping it: each bloc ' +
       'bans what its own voters object to, and the training runs relocate.' },
  { req: { D: 'D3', T: 'T2' }, span: ['near', 'mid'],
    t: 'Capability is arriving quickly and being used slowly. The gap between what systems ' +
       'can do and what firms permit them to do is the largest quantity on this line.' },
  { req: { E: 'E1', P: 'P2' }, span: ['near', 'mid'],
    t: 'Rising earnings and an untroubled public is the path of least resistance, and the one ' +
       'in which the fewest questions get asked before deployment.' },
  { req: { A: 'A2', C: 'C1' }, span: ['mid', 'long'],
    t: 'The near miss was caught with no international body to report it to, so what was ' +
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

// A small deterministic index from the world-line and the date, so a passage varies its
// connective tissue between states while staying identical for any one state.
function vary(wl, year, n) {
  let h = Math.floor(year) * 7919;
  for (const k of ['T', 'A', 'C', 'D', 'S', 'P', 'E']) {
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

  out.push({ lead: 'What the systems can do.', text: join([
    rungText(cap, span), slopeClause(cap, prev),
    `The capability index reads ${cap.toFixed(2)} on the scale ruled across the forecast.`,
  ]) });

  out.push({ lead: 'Who is building, and under what rules.', text: join([
    FRAG[wl.C][span], X('C', 'S'), FRAG[wl.S][span],
    `Installed AI compute is ${Math.round(tracks.gw[i]).toLocaleString('en-US')} GW.`,
    band(tracks.gw[i], GW_BANDS),
  ]) });

  out.push({ lead: 'Money and jobs.', text: join([
    FRAG[wl.E][span], X('E', 'S'), X('E', 'D'), FRAG[wl.D][span],
    `AI revenue is ${money(tracks.rev[i])} a year.`, band(tracks.rev[i], REV_BANDS),
    jobsClause(tracks.jobs[i]),
  ]) });

  out.push({ lead: 'Control, and what the public will accept.', text: join([
    FRAG[wl.A][span], X('A', 'T'), FRAG[wl.P][span], X('P', 'D'),
    `Approval of AI stands at ${tracks.appr[i].toFixed(0)}%.`, apprClause(tracks.appr[i]),
    band(tracks.laws[i], LAW_BANDS),
  ]) });

  out.push({ lead: 'How fast it happened.', text: join([FRAG[wl.T][span], X('T', 'C')]) });

  const inter = PAIRS.filter((q) => q.span.includes(span) &&
    Object.entries(q.req).every(([k, v]) => wl[k] === v)).map((q) => q.t);
  if (inter.length) {
    const heads = ['What these settings do together.', 'Where these meet.',
                   'The combination that matters here.'];
    out.push({ lead: heads[vary(wl, year, heads.length)], text: inter.join(' ') });
  }

  out.push({ lead: 'The settings behind this passage.', text:
    `${['T', 'A', 'C', 'D', 'S', 'P', 'E'].map((k) => wl[k]).join('·')} at ` +
    `${Math.floor(year)}. Each letter is one variable's setting on the controls; changing any ` +
    'of them rewrites this passage and redraws every chart on the sheet.' });
  return out;
}

// ── the headline ─────────────────────────────────────────────────────────────
// The largest lettering on the sheet, so it is the sentence a reader tests the model against.
// Every clause is keyed on a position AND the span, and the economy clause takes a second key
// from whichever variable is doing the most to it.
const RUNG_SHORT = [
  [5.8, { near: 'already past what this scale can measure',
          mid: 'past what this scale can measure',
          long: 'far past what this scale can measure',
          far: 'off this scale for most of a century' }],
  [5.0, { near: 'already better than humans at essentially all cognitive work',
          mid: 'better than humans at essentially all cognitive work',
          long: 'better than humans at everything measured and built into everything',
          far: 'superhuman for longer than most governments have existed' }],
  [4.0, { near: 'already running most AI research itself',
          mid: 'running most AI research itself',
          long: 'running its own research without human direction',
          far: 'a century into self-directed research' }],
  [3.0, { near: 'writing better code than any human engineer',
          mid: 'writing better code than any human engineer and compounding',
          long: 'a commodity that writes better code than any human engineer',
          far: 'past the point where programming was paid human work' }],
  [2.4, { near: 'completing multi-hour tasks without supervision',
          mid: 'completing unsupervised multi-hour tasks as ordinary business software',
          long: 'unsupervised at day-length tasks and treated as infrastructure',
          far: 'the substrate of ordinary work for two generations' }],
  [1.6, { near: 'losing the thread after a few minutes of unsupervised work',
          mid: 'still losing the thread after a few minutes',
          long: 'still limited to short supervised stretches',
          far: 'never able to hold a task longer than an afternoon' }],
  [0.0, { near: 'an assistant a person checks at every step',
          mid: 'still an assistant a person checks at every step',
          long: 'still a tool people operate directly',
          far: 'a century of software that never became an agent' }],
];
const GOVERN = {
  C1: { near: 'no agreement limits development',
        mid: 'export controls remain the only instrument anyone is using',
        long: 'no agreement was ever reached',
        far: 'no binding agreement in a hundred years' },
  C2: { near: 'the United States runs the frontier as a national programme',
        mid: 'the frontier sits inside a US security perimeter',
        long: 'the US national programme became permanent',
        far: 'frontier AI has been government business for a century' },
  C3: { near: 'the US and China are negotiating verified limits',
        mid: 'a verified US-China agreement caps training runs',
        long: 'the agreement held and capability resumed under its terms',
        far: 'one agreement from the 2030s has governed the century' },
  C4: { near: 'European and American and Chinese rules differ',
        mid: 'which rules apply depends on which market a system is sold into',
        long: 'three or four regulatory zones settled into place',
        far: 'a century of regional rules and firms arbitraging between them' },
  C5: { near: 'training above the current level has been banned',
        mid: 'the ban is holding and the argument is about who is cheating',
        long: 'the freeze outlasted the people who imposed it',
        far: 'a ceiling announced as temporary has held for a century' },
};
// Each is a PREDICATE, present tense, with no internal comma — a modifier is appended to it.
const ECON = {
  E1: { near: 'AI revenue is covering the capital being spent on it',
        mid: 'earnings caught up with the build-out',
        long: 'the capacity that expansion built is still in service',
        far: "most of the century's infrastructure was financed in that expansion" },
  E2: { near: 'AI equities are falling while datacenter construction continues',
        mid: 'the correction wiped out AI equity values without stopping construction',
        long: 'the datacenters built before the correction are still running under new owners',
        far: 'one early correction changed who owned the infrastructure' },
  E3: { near: 'datacenter orders are being cancelled mid-construction',
        mid: 'the build-out stopped and capability improves through efficiency',
        long: 'the cancelled capacity set a ceiling that lasted a generation',
        far: 'the century was shaped by datacenters never completed' },
  E4: { near: 'demand is falling because displaced workers have less to spend',
        mid: 'output per worker keeps rising and there are fewer buyers each year',
        long: 'the consumption gap became permanent',
        far: 'production was solved and buying power never was' },
};
// What the rest of the line is doing TO the economy. Each attaches after a comma, so each has
// to be a PHRASE and tense-neutral, and must not repeat a noun its base already used.
const ECON_MOD = {
  'E1|S1': 'on chips from one contested region',
  'E1|S2': 'across a dozen countries at once',
  'E1|S3': 'against grid connections that take years',
  'E1|D1': 'while the same firms cut staff',
  'E1|D3': 'with employment untouched',
  'E1|P1': 'against an electorate turning against it',
  'E1|C3': 'inside verified limits',
  'E1|C5': 'all of it under a training ban',
  'E2|S1': 'what survived owned by three or four firms',
  'E2|S2': 'the sites spread across a dozen countries',
  'E2|S3': 'the rebuild limited by grid connections',
  'E2|D1': 'the job losses concentrated in the first year',
  'E2|D2': 'the damage concentrated in software and media',
  'E2|D3': 'with employment untouched',
  'E2|P1': 'with the politics turning against it',
  'E2|P3': 'the public split on what it meant',
  'E2|C5': 'all of it under a training ban',
  'E3|S1': 'the survivors exposed to one contested region',
  'E3|S2': 'leaving half-finished sites in a dozen countries',
  'E3|S3': 'with grid connections already the limit',
  'E3|D1': 'and nothing built to absorb the displaced',
  'E3|D2': 'the industry split frozen where it stood',
  'E3|D3': 'with employment untouched',
  'E3|P1': 'with the politics turning against it',
  'E3|C5': 'all of it under a training ban',
  'E4|S1': 'three or four firms holding the idle capacity',
  'E4|S2': 'with capacity idle in a dozen countries',
  'E4|S3': 'the grid queues cleared by withdrawal',
  'E4|D1': 'each round of layoffs causing the next',
  'E4|D2': 'industry by industry in the order they automated',
  'E4|D3': 'with adoption too slow to be the cause',
  'E4|P1': 'with a political movement forming around it',
  'E4|C5': 'all of it under a training ban',
};
function econClause(wl, span) {
  const base = ECON[wl.E][span];
  for (const k of ['S', 'D', 'P', 'C']) {
    const m = ECON_MOD[`${wl.E}|${wl[k]}`];
    if (m) return `${base}, ${m}`;
  }
  return base;
}
// The sentence ends on whichever tension is largest on this line, phrased for its era.
const TENSION = {
  consent: { near: 'and approval of AI has fallen below a quarter of the public',
             mid: 'and approval sits below a quarter of the public',
             long: 'and it has run for decades without majority consent',
             far: 'and the century never regained public consent' },
  work: { near: 'and employment is more than 15% below 2026',
          mid: 'and employment is more than 15% below its 2026 level',
          long: 'and employment never returned to its 2026 level',
          far: 'and the century is still absorbing the loss of work' },
  oversight: { near: 'and nobody has yet found that training rewarded the appearance of ' +
                     'honesty',
               mid: 'and the training failure has still not been detected',
               long: 'and the training failure was never found',
               far: 'and it was built on a failure nobody identified in time' },
  power: { near: 'and new capacity waits years for a grid connection',
           mid: 'and grid connections are still what limits new capacity',
           long: 'and the power constraint shaped everything built under it',
           far: 'and electricity set the rate for a hundred years' },
  strait: { near: 'and the chips are made in one place two governments both claim',
            mid: 'and production is still concentrated where the claim is contested',
            long: 'and where the chips were made decided who mattered',
            far: 'and one manufacturing region settled the century' },
  lag: { near: 'and firms are using the systems for far less than they can do',
         mid: 'and the gap between capability and use is the largest number on the line',
         long: 'and the deployment lag turned out to be the whole story',
         far: 'and the technology was used at a fraction of its capacity for a century' },
  scale: { near: 'and AI revenue is passing the largest existing industries',
           mid: 'and AI revenue exceeds the largest existing industries',
           long: 'and it has been one of the largest industries for a generation',
           far: 'and it has been the largest industry longer than anyone remembers' },
  split: { near: 'and opinion is splitting within countries rather than between them',
           mid: 'and the split within countries is the stable state',
           long: 'and the division outlasted the technology that caused it',
           far: 'and the division is older than the argument that started it' },
  ceiling: { near: 'and the top of the ladder stays out of reach',
             mid: 'and the discontinuity never comes',
             long: 'and the ceiling has held for decades',
             far: 'and the top of the ladder was never reached' },
  open: { near: 'and the next capability level is the open question',
          mid: 'and the next capability level is still the open question',
          long: 'and what is scarce now is deciding what to use it for',
          far: 'and the open questions stopped being about capability long ago' },
};
function tensionKey(wl, tracks, i) {
  if (tracks.appr[i] < 25) return 'consent';
  if (tracks.jobs[i] < -15) return 'work';
  if (wl.A === 'A1') return 'oversight';
  if (wl.S === 'S3') return 'power';
  if (wl.S === 'S1' && wl.C === 'C1') return 'strait';
  if (wl.D === 'D3') return 'lag';
  if (tracks.rev[i] > 8) return 'scale';
  if (wl.P === 'P3') return 'split';
  if (wl.T === 'T4') return 'ceiling';
  return 'open';
}
export function headline(wl, year, tracks, engineY0) {
  const i = Math.max(0, Math.min(tracks.year.length - 1, Math.floor(year) - engineY0));
  const span = spanOf(year);
  const cap = tracks.cap[i];
  let rung = RUNG_SHORT[RUNG_SHORT.length - 1][1];
  for (const [t, s] of RUNG_SHORT) if (cap >= t) { rung = s; break; }
  // Four independent clauses. Separated by commas they read as one list, and the modifier
  // inside the economy clause becomes indistinguishable from the next clause.
  return `In ${Math.floor(year)}, AI is ${rung[span]}; ${GOVERN[wl.C][span]}; ` +
         `${econClause(wl, span)}; ${TENSION[tensionKey(wl, tracks, i)][span]}.`;
}
