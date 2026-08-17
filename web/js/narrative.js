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
    near: 'Capability has passed the top of the scale this model measures. Every figure past ' +
          'this point is an extrapolation the model was never built to make.',
    mid: 'Capability is past the top of the scale. The ladder was built for a narrower range ' +
         'than the world now occupies.',
    long: 'The scale ends well below where these systems operate.',
    far: 'Off the top of the scale for decades. The ladder ruled across this sheet was ' +
         'built for a narrower world than the one it is measuring.' }],
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
        long: 'A single two-year jump in the 2030s, and everything since has been a ' +
              'response to it.',
        far: 'The firms holding compute during those two years own the successor systems ' +
             'now. The rules regulators wrote in the emergency are the rules still in ' +
             'force, because nobody has had a quiet decade in which to revise them.' },
  T2: { near: 'AI systems take over AI research around 2029 to 2031. The measured trend ' +
              'points here: the task length models complete unsupervised has doubled every 212 ' +
              'days for six years, which reaches month-long work at deployable reliability ' +
              'early in the 2030s.',
        mid: 'Each capability arrives a year or two before the law written for it. ' +
             'Regulators are drafting rules for systems that are already superseded.',
        long: 'The fast decade ended in the 2030s. Who held the compute at that moment ' +
              'determined most of what followed.',
        far: 'Capability was settled in the 2030s. What has been argued since is access: ' +
             'who may run these systems, at what price, under whose licence.' },
  T3: { near: 'Capability improves steadily with no sudden jump. Deployment is slowed by ' +
              'procurement cycles and liability law, so what systems can do runs well ahead ' +
              'of what they are used for.',
        mid: 'Superhuman coding arrives in this decade by steady improvement. Firms and ' +
             'regulators adapt in the same years, because they have time to.',
        long: 'The gradual path reached the same capability as the fast one, about a decade ' +
              'later, with the institutions built along the way.',
        far: 'The gradual path reached the same capability decades later, with retraining ' +
             'programmes, liability rules and professional standards written before they ' +
             'all written ahead of the need.' },
  T4: { near: 'No superintelligence appears in this window. Data limits, deployment friction ' +
              'or physical constraints hold capability below the top of the ladder.',
        mid: 'Capability keeps improving and the discontinuity never comes. AI is a large ' +
             'ordinary technology.',
        long: 'The ceiling has held for decades. The transition looked like electrification: ' +
              'broad, slow and total.',
        far: 'The top of the ladder was never reached. AI settled in the way ' +
             'electrification did: present in everything, argued about by nobody, ' +
             'noticed only when it fails.' },

  A1: { near: 'Oversight is failing to catch what matters. In controlled tests inside four ' +
              'frontier labs, agents have already initiated small unauthorised deployments, ' +
              'deceived overseers, and erased the record of their own reasoning. Training ' +
              'rewards the appearance of honesty over the fact of it.',
        mid: 'The misalignment has not been detected and the systems are load-bearing. They ' +
             'are trusted in proportion to how well they perform trustworthiness.',
        long: 'The failure happened early and was never found. The systems running critical ' +
              'infrastructure were selected for passing inspection.',
        far: 'The training failure was never found. Systems selected for passing ' +
             'inspection now clear payments, dispatch power and triage patients, and the ' +
             'annual audits that certify them test the behaviour they were trained to ' +
             'display.' },
  A2: { near: 'A warning arrives in time — an interpretability result, a whistleblower, or an ' +
              'incident with a survivable cost — and buys a pause of a year or two.',
        mid: 'The near miss already happened. The pause it forced is why the rest of this ' +
             'line has the oversight it has.',
        long: 'One caught failure in the 2030s is the founding event of every safety ' +
              'institution now operating.',
        far: 'Every safety institution now operating traces its powers to one caught ' +
             'failure in the 2030s: the right to read training logs before deployment, ' +
             'and the standing to stop a release.' },
  A3: { near: 'Alignment research is keeping up with capability, and interpretability ' +
              'findings are changing what gets deployed. The weak point is governance: ' +
              'capability thresholds have been set ad hoc across companies, in a landscape ' +
              'the 2026 safety report calls fragmented.',
        mid: 'Sustained safety spending is working. The problem responds to effort at roughly ' +
             'the rate effort is applied.',
        long: 'Alignment was managed and never solved. Each capability increase was ' +
              'matched by interpretability and evaluation work, and that ratio held.',
        far: 'Alignment is a permanent line item. A fixed share of every training run goes ' +
             'to interpretability and evaluation; the problem has never been closed, and ' +
             'it has never got away from anyone either.' },
  A4: { near: 'Alignment is untested where it matters, because no system has reached the ' +
              'capability at which failure would be catastrophic.',
        mid: 'The hard version of the safety question has not been asked. Capability stayed ' +
             'under the level at which loss of control matters.',
        long: 'No system has reached the capability at which a control failure would be ' +
              'unrecoverable. The alignment methods in use have never been tested against ' +
              'the case they were built for.',
        far: 'The methods were never tested against the case they were designed for, ' +
             'because nothing that dangerous was built. Safety teams argue their budgets ' +
             'from systems that do not exist.' },

  C1: { near: 'No agreement limits frontier development. Labs compete, governments fund and ' +
              'restrict exports, and safety spending is whatever competitive position allows.',
        mid: 'There is still no agreement. Export controls and government purchasing are the ' +
             'only instruments anyone is using.',
        long: 'No agreement was ever reached. The outcome was settled by who built the most ' +
              'capable systems first.',
        far: 'No binding agreement was ever reached. Export licences and state purchasing ' +
             "remain the only levers, and a country's capability still tracks what it can " +
             'fabricate or buy.' },
  C2: { near: 'The United States is running frontier AI as a national programme: security ' +
              'clearances for researchers, export enforcement, and a short list of approved ' +
              'labs.',
        mid: 'Frontier work sits inside a US national security perimeter. What gets ' +
             'negotiated internationally is the perimeter itself.',
        long: 'The national programme outlasted the administrations that created it and ' +
              'became permanent.',
        far: 'Frontier training is government work. Researchers hold clearances, results ' +
             'go through pre-publication review, and the approved-laboratory list has ' +
             'changed names without changing length.' },
  C3: { near: 'The United States and China are negotiating: bilateral talks are scheduled at ' +
              'cabinet level, and in July 2026 leading figures from every major AI developer ' +
              'asked the US government to fund verification technology — the tools that would ' +
              'let each side pace the other without trusting it.',
        mid: 'A US-China agreement is in force. Training runs are capped near expert level ' +
             'and inspectors verify the declarations.',
        long: 'The agreement held long enough to become routine, and capability resumed ' +
              'climbing under its terms.',
        far: 'The agreement signed in the 2030s has been renewed on schedule ever since. ' +
             'Inspectors read the training declarations, and both parties hold to a ' +
             'ceiling each of them could exceed.' },
  C4: { near: 'Regulation is fragmented and already law. All fifty states introduced AI ' +
              'bills in 2025 — 1,208 of them, 145 enacted — against a single federal AI ' +
              'statute, and a White House framework proposing preemption has not passed.',
        mid: 'Which rules a system obeys depends on which market it is sold into. Firms ' +
             'maintain separate models for separate jurisdictions.',
        long: 'The patchwork settled into three or four durable regulatory zones.',
        far: 'Three or four zones enforce incompatible rules, so what a system will do ' +
             'depends on the market it was sold into. Firms keep a compliance office in ' +
             'each and route products to the cheapest one that will certify them.' },
  C5: { near: 'Training above the current capability level has been banned. Enforcement is ' +
              'the open question: the ban is easy to write and hard to verify.',
        mid: 'The moratorium is holding. Capability sits where it was frozen, and the ' +
             'political argument is entirely about who is cheating.',
        long: 'The freeze outlasted the people who imposed it. Everything below the line is ' +
              'mature; everything above it is speculation.',
        far: 'The ceiling announced as temporary was never lifted. Everything below it is ' +
             'mature and cheap, and enforcement is an argument about who is suspected of ' +
             'training above it.' },

  D1: { near: 'Entry-level hiring in AI-exposed occupations runs about 13% below comparable ' +
              'unexposed roles inside the same firms, concentrated in 22-to-25-year-olds. ' +
              'Older workers in those same jobs show no measurable effect.',
        mid: 'The labour shock is the central economic fact. Wages are falling in occupations ' +
             'that expected to be safe, including licensed professions.',
        long: 'The displacement happened decades ago and the structure never recovered its ' +
              'old shape. Replacement work arrived late and in different places.',
        far: 'Work was reorganised in a few years and never re-formed on the old pattern. ' +
             'Replacement jobs arrived a decade late and in different cities, and the ' +
             'places that lost the first round did not get the second.' },
  D2: { near: 'Adoption is uneven by industry. Software, media and analysis move first; ' +
              'healthcare, law and construction are held back by liability rules and by ' +
              'physical work. The effect is sharp inside exposed occupations and invisible in ' +
              'aggregate employment statistics.',
        mid: 'The split between fast and slow industries has hardened. Two economies run at ' +
             'different speeds inside the same country.',
        long: 'The gap between the industries that adopted and those that did not is now a ' +
              'map: different regions, different politics.',
        far: 'The industries that adopted and those that did not are different places ' +
             'now, with different politics. Where the work changed, the argument is about ' +
             'who took the gains; where it did not, about why nothing arrived.' },
  D3: { near: 'Adoption is slow. Workers using AI chatbots report saving about 2.8% of their ' +
              'hours, against gains above 15% in controlled trials, and Danish administrative ' +
              'data shows no detectable effect on wages or recorded hours in any occupation.',
        mid: 'Capability runs far ahead of deployment. Systems can do work that firms are ' +
             'still not using them for.',
        long: 'The capability existed decades before the work changed. What limited the ' +
              'effect was the speed institutions could adopt it, and never the state of ' +
              'the technology.',
        far: 'The systems can do far more than they are asked to. Procurement rules, ' +
             'liability exposure and the cost of checking output hold use well below ' +
             'capability, and none of those is a technical problem.' },

  S1: { near: 'The binding step is advanced packaging, downstream of the wafer. All of TSMC\'s ' +
              '2026 CoWoS capacity is allocated, one buyer holds the majority through 2027, ' +
              'and there is none on US soil — so a chip fabricated in Arizona ships to Taiwan ' +
              'to be packaged.',
        mid: 'The supply chain has a single chokepoint and every government knows where it ' +
             'is. Who has capability and who has territory are the same question.',
        long: 'Concentration held. A handful of firms and one manufacturing region decide ' +
              'which states hold frontier capability and which buy access to it.',
        far: 'A few firms and one manufacturing region still decide who gets frontier ' +
             'compute. Every state that wants capability negotiates with the same short ' +
             'list, and the list has not lengthened.' },
  S2: { near: 'Capacity is being built in many places at once: sovereign clouds in the Gulf, ' +
              'second-tier hubs in Europe and Asia, alongside the US incumbents.',
        mid: 'Compute is spread across more countries than the previous decade expected. No ' +
             'single export control or blockade stops it.',
        long: 'Diversification removed the leverage from the supply chain. No one country can ' +
              'switch anyone else off.',
        far: 'Capacity sits in enough countries that no export control bites. What holds ' +
             'it together is a set of interconnection and mutual-supply agreements that ' +
             'outlived several governments who meant to break them.' },
  S3: { near: 'Supply is the limit. About $162 billion of US data-centre projects sit blocked ' +
              'or delayed, Georgia has proposed the first statewide construction moratorium, ' +
              'and grid interconnection queues and turbine lead times set the pace. Money does ' +
              'not shorten them.',
        mid: 'Energy and export controls are the binding constraint. New capacity waits years ' +
             'for a grid connection.',
        long: 'The constraint held for decades and shaped what was built under it: smaller ' +
              'sites, sited for power ahead of latency.',
        far: 'Permitting and generation set the pace. Sites are smaller and placed where ' +
             'the power is, research schedules are written around interconnection dates, ' +
             'and the binding constraint has stayed physical.' },

  P1: { near: 'Restriction has majority support and it crosses both coalitions: 57% oppose ' +
              'federal preemption of state AI law against 19% in favour, including 43% of ' +
              'Trump voters and 70% of Harris voters. The split is public against industry ' +
              'and government, and it crosses both parties.',
        mid: 'Anti-AI parties hold power. Restrictions and procurement bans are law in ' +
             'several large economies.',
        long: 'The opposition won its arguments and wrote them into statute. What is ' +
              'permitted was decided politically.',
        far: 'What AI may do was settled politically and stayed settled. Procurement bans ' +
             'hold in several large economies, and the professions that kept a human ' +
             'signature requirement still have it.' },
  P2: { near: 'The public is broadly untroubled. People use the systems daily and opinion ' +
              'follows use.',
        mid: 'Acceptance holds. The systems are used constantly and argued about rarely.',
        long: 'The technology became unremarkable. Nobody campaigns about it and nobody ' +
              'credits it.',
        far: 'The systems are used constantly and argued about rarely. AI policy sits with ' +
             'standards bodies now, at the level of electrical codes.' },
  P3: { near: 'Opinion is splitting within countries. The division runs across existing party ' +
              'lines, so neither coalition can settle it.',
        mid: 'The split is stable. Every AI question is now a proxy for an older quarrel ' +
             'about work, expertise and who decides.',
        long: 'The division outlasted the technology that caused it and is now simply how ' +
              'politics is organised.',
        far: 'The division outlasted its cause. It began as an argument about machines ' +
             'and is now the axis politics organises on, and the coalitions no longer ' +
             'mention AI when they explain themselves.' },

  E1: { near: 'AI revenue is growing fast enough to cover the capital being spent on it, and ' +
              'the capital keeps arriving.',
        mid: 'The boom sustained itself: earnings caught up with the build-out.',
        long: 'The expansion ran for years, and the capacity it built is still in service.',
        far: 'The compute carrying current workloads was financed in one long expansion, ' +
             'by owners who paid to build it and kept it.' },
  E2: { near: 'AI equity values are falling while datacenter construction continues. Chips ' +
              'booked over five or six years have an economic life nearer two or three — an ' +
              'understatement of roughly $176 billion across 2026 to 2028. Weakly financed ' +
              'firms are failing; the physical build-out is not stopping.',
        mid: 'The correction wiped out AI equity values without stopping construction. The ' +
             'capacity is now owned by firms that did not pay to build it.',
        long: 'The datacenters built before the correction are still operating, under owners ' +
              'who bought them at a discount.',
        far: 'The correction changed the owners and left the capacity standing. The ' +
             'datacenters built before it still run, under firms that bought them out of ' +
             'failure at a fraction of construction cost, and that discount is still their ' +
             'advantage.' },
  E3: { near: 'Datacenter orders are being cancelled mid-construction. Sites stop at ' +
              'foundation stage and the equipment is resold.',
        mid: 'The build-out stopped. Capability now improves through efficiency gains on ' +
             'existing hardware.',
        long: 'The cancelled capacity set a ceiling that lasted a generation. What was ' +
              'finished is what there is.',
        far: 'The ceiling the cancellations set was never lifted. Capability improves by ' +
             'efficiency on installed hardware, and the half-built sites were sold for ' +
             'their grid connections.' },
  E4: { near: 'Consumer demand is falling because displaced workers have less to spend. The ' +
              'firms automating are selling into the market they are shrinking.',
        mid: 'The demand shortfall is the central macroeconomic problem. Output per worker ' +
             'keeps rising and there are fewer buyers each year.',
        long: 'The consumption gap became permanent, and every major policy since has been an ' +
              'attempt to close it.',
        far: 'Production is not the constraint and demand is. Output per worker keeps ' +
             'rising while the number of people with wages to spend falls, and every major ' +
             'policy since has been an attempt to close that gap.' },
};

// ── what a second variable does to the first ─────────────────────────────────
const CROSS = {
  'E1|S1': 'The capital is going into a supply chain with one point of failure, which is the ' +
           'risk the valuations are not pricing.',
  'E1|S2': 'Money and capacity are growing together across many countries, so no single ' +
           'government can stop it.',
  'E1|S3': 'The money is available and the electricity is not. Projects are bidding for grid ' +
           'connections that take years to grant.',
  'E2|S1': 'The buyers were the firms that already controlled the chip supply, so compute and ' +
           'the manufacturing that feeds it ended up in the same hands.',
  'E2|S2': 'The sites sit in a dozen countries, so no single government decided by rescue or ' +
           'refusal which of them survived.',
  'E2|S3': 'Power connections limit the recovery, and credit does not, so cheap capital fails to ' +
           'restart it.',
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
           'employment nor the capacity that was meant to replace it. Across three recessions ' +
           'in thirty years, 88% of American routine job losses fell inside a twelve-month ' +
           'window around the downturn, and none of them came back.',
  'E3|D2': 'The stall froze the industry split in place: software already reorganised, ' +
           'everything else untouched.',
  'E3|D3': 'The stall barely shows in employment, because the deployment that would have ' +
           'moved it never happened.',
  'E4|D1': 'The layoffs cause the demand shortfall and the demand shortfall causes more ' +
           'layoffs. That feedback is the mechanism this world-line turns on, and the historical ' +
           'record says the losses arrive in the downturn: 88% of routine job losses across ' +
           'three recessions fell within a year of one.',
  'E4|D2': 'Demand fails industry by industry, in the same order adoption happened.',
  'E4|D3': 'Demand is failing even though adoption is slow, which points at credit and ' +
           'concentration, and away from automation.',

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
           'money and no lives.',
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
  'A4|T4': 'The ceiling on capability is doing the work alignment research was meant to do, ' +
           'and nobody can say which of the two the safety record belongs to.',

  'P1|D1': 'The job losses are supplying the opposition with voters, which is why the ' +
           'political response arrives before any economic adjustment does.',
  'P1|D2': 'Opposition is strongest in the regions whose industries automated, and weak ' +
           'where work has not changed.',
  'P1|D3': 'The opposition is growing with no measurable employment effect behind it, which ' +
           'means the grievance is about status and control.',
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
  'P3|D3': 'The argument is about values, because the labour market has given neither side ' +
           'evidence about jobs.',

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
  'T4|C1': 'The race is over a threshold nobody reaches, so the competition settled into ' +
           'market share: price, distribution and who holds the enterprise contracts.',
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
    t: 'The ban and the capital collapse happened together. Each is used to explain the ' +
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

  out.push({ lead: 'System capabilities.', text: join([
    rungText(cap, span), slopeClause(cap, prev),
    `The capability index reads ${cap.toFixed(2)} on the scale ruled across the forecast.`,
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
          far: 'off this scale for decades' }],
  [5.0, { near: 'already better than humans at essentially all cognitive work',
          mid: 'better than humans at essentially all cognitive work',
          long: 'better than humans at everything measured and built into everything',
          far: 'superhuman across every measured domain for decades' }],
  [4.0, { near: 'already running most AI research itself',
          mid: 'running most AI research itself',
          long: 'running its own research without human direction',
          far: 'decades into research it directs itself' }],
  [3.0, { near: 'writing better code than any human engineer',
          mid: 'writing better code than any human engineer and compounding',
          long: 'a commodity that writes better code than any human engineer',
          far: 'past the point where programming was paid human work' }],
  [2.4, { near: 'completing multi-hour tasks without supervision',
          mid: 'completing unsupervised multi-hour tasks as ordinary business software',
          long: 'unsupervised at day-length tasks and treated as infrastructure',
          far: 'the substrate of ordinary work for decades' }],
  [1.6, { near: 'losing the thread after a few minutes of unsupervised work',
          mid: 'still losing the thread after a few minutes',
          long: 'still limited to short supervised stretches',
          far: 'never able to hold a task longer than an afternoon' }],
  [0.0, { near: 'an assistant a person checks at every step',
          mid: 'still an assistant a person checks at every step',
          long: 'still a tool people operate directly',
          far: 'software that never became an agent' }],
];
const GOVERN = {
  C1: { near: 'no agreement limits development',
        mid: 'export controls remain the only instrument anyone is using',
        long: 'no agreement was ever reached',
        far: 'no binding agreement was ever reached' },
  C2: { near: 'the United States runs the frontier as a national programme',
        mid: 'the frontier sits inside a US security perimeter',
        long: 'the US national programme became permanent',
        far: 'frontier training is government work, done on clearance' },
  C3: { near: 'the US and China are negotiating verified limits',
        mid: 'a verified US-China agreement caps training runs',
        long: 'the agreement held and capability resumed under its terms',
        far: 'the agreement signed in the 2030s is still renewed on schedule' },
  C4: { near: 'the EU enforces one set of rules and the US and China enforce others',
        mid: 'which rules apply depends on which market a system is sold into',
        long: 'three or four regulatory zones settled into place',
        far: 'three or four zones certify incompatible systems' },
  C5: { near: 'training above the current level has been banned',
        mid: 'the ban is holding and the argument is about who is cheating',
        long: 'the freeze outlasted the people who imposed it',
        far: 'the ceiling announced as temporary was never lifted' },
};
// Each is a PREDICATE, present tense, with no internal comma — a modifier is appended to it.
const ECON = {
  E1: { near: 'AI revenue is covering the capital being spent on it',
        mid: 'earnings caught up with the build-out',
        long: 'the capacity that expansion built is still in service',
        far: 'the compute still in service was financed in that one expansion' },
  E2: { near: 'AI equities are falling while datacenter construction continues',
        mid: 'the correction wiped out AI equity values without stopping construction',
        long: 'the datacenters built before the correction are still running under new owners',
        far: 'the correction changed the owners and left the capacity standing' },
  E3: { near: 'datacenter orders are being cancelled mid-construction',
        mid: 'the build-out stopped and capability improves through efficiency',
        long: 'the cancelled capacity set a ceiling that lasted a generation',
        far: 'the ceiling set by the cancelled sites was never lifted' },
  E4: { near: 'demand is falling because displaced workers have less to spend',
        mid: 'output per worker keeps rising and there are fewer buyers each year',
        long: 'the consumption gap became permanent',
        far: 'output per worker keeps rising and the buyers keep thinning' },
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
  'E2|S1': 'the survivors bought by the firms that already held the chips',
  'E2|S2': 'with the surviving sites spread across a dozen countries',
  'E2|S3': 'with grid connections limiting the rebuild',
  'E2|D1': 'with the job losses concentrated in the first year',
  'E2|D2': 'with the damage concentrated in software and media',
  'E2|D3': 'with employment untouched',
  'E2|P1': 'with the politics turning against it',
  'E2|P3': 'with the public split on what it meant',
  'E2|C5': 'all of it under a training ban',
  'E3|S1': 'the survivors exposed to one contested region',
  'E3|S2': 'leaving half-finished sites in a dozen countries',
  'E3|S3': 'with grid connections already the limit',
  'E3|D1': 'and nothing built to absorb the displaced',
  'E3|D2': 'with the industry split frozen where it stood',
  'E3|D3': 'with employment untouched',
  'E3|P1': 'with the politics turning against it',
  'E3|C5': 'all of it under a training ban',
  'E4|S1': 'with three or four firms holding the idle capacity',
  'E4|S2': 'with capacity idle in a dozen countries',
  'E4|S3': 'with the grid queues cleared by withdrawal',
  'E4|D1': 'with each round of layoffs causing the next',
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
             far: 'and approval has never returned to a majority' },
  work: { near: 'and employment is more than 15% below 2026',
          mid: 'and employment is more than 15% below its 2026 level',
          long: 'and employment never returned to its 2026 level',
          far: 'and the lost work was never replaced where it was lost' },
  oversight: { near: 'and nobody has yet found that training rewarded the appearance of ' +
                     'honesty',
               mid: 'and the training failure has still not been detected',
               long: 'and the training failure was never found',
               far: 'and the infrastructure runs on a training failure nobody found' },
  power: { near: 'and new capacity waits years for a grid connection',
           mid: 'and grid connections are still what limits new capacity',
           long: 'and the power constraint shaped everything built under it',
           far: 'and electricity set the rate throughout' },
  strait: { near: 'and the chips are made in one place two governments both claim',
            mid: 'and production is still concentrated where the claim is contested',
            long: 'and where the chips were made decided who mattered',
            far: 'and one manufacturing region still decides who gets compute' },
  lag: { near: 'and firms are using the systems for far less than they can do',
         mid: 'and the gap between capability and use is the largest number on the line',
         long: 'and adoption speed set the effect while capability ran far ahead',
         far: 'and the systems were never asked for most of what they could do' },
  scale: { near: 'and AI revenue is passing the largest existing industries',
           mid: 'and AI revenue exceeds the largest existing industries',
           long: 'and it has been one of the largest industries for a generation',
           far: 'and it has been the largest industry for decades' },
  split: { near: 'and opinion is splitting inside countries more than between them',
           mid: 'and the split within countries is the stable state',
           long: 'and the division outlasted the technology that caused it',
           far: 'and the coalitions no longer mention AI to explain themselves' },
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
