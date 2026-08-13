// AI FUTURES FORECASTER — the description of the future being forecast
//
// The passage is COMPOSED, never selected. A paragraph about one variable is built from that
// variable's own state and span, from a CROSS clause naming what a second variable does to it,
// from a BAND clause keyed on a quantity the model actually computes at that date, and from the
// figures themselves. A world-line where the economy corrects reads differently under a
// constrained build-out than under a diversified one, and differently again in 2031 and 2061.
//
// Everything here is authored prose. The figures come from the same tracks the behaviour
// recorders draw, so the passage and the charts can never disagree.
//
// Spans: near 2026–2031 · mid 2032–2040 · long 2041–2060 · far 2061–2100.

const SPANS = [['near', 2026, 2031], ['mid', 2032, 2040],
               ['long', 2041, 2060], ['far', 2061, 2100]];
export function spanOf(year) {
  for (const [k, a, b] of SPANS) if (year >= a && year <= b) return k;
  return year < 2026 ? 'near' : 'far';
}

// ── the capability ladder, phrased by span ───────────────────────────────────
// The same rung means something different in 2029 and in 2071: early it is news, late it is
// the water everyone swims in.
const RUNG = [
  [0.0, {
    near: 'Systems answer well and finish little. Work still passes through a person at ' +
          'every step that matters.',
    mid: 'Capability has stayed assistive far longer than the 2020s expected. The tools are ' +
         'good and the loop still closes on a human.',
    long: 'Decades in, the systems remain instruments. Every consequential action still ' +
          'carries a signature.',
    far: 'A century of tools. The technology settled into the shape of software and stayed ' +
         'there.' }],
  [1.6, {
    near: 'Agents run for minutes at a stretch and drop the thread. The failures have the ' +
          'shape of the work: forgotten context, confident wrong turns.',
    mid: 'Agents work in short bursts under supervision. Reliability, rather than ability, ' +
         'is the thing holding them back.',
    long: 'Autonomy plateaued early. Systems act in short bounded stretches and hand back.',
    far: 'The long plateau held. Agency stayed bounded by the length of a task.' }],
  [2.4, {
    near: 'Agents hold multi-step work without supervision for hours at a time. Software ' +
          'teams and research groups reorganise around them first.',
    mid: 'Reliable agency is ordinary. Firms restructure around what a machine can be left ' +
         'to finish.',
    long: 'Agency at this level is infrastructure, and it gets noticed when it fails.',
    far: 'Reliable agency has been the substrate of ordinary work for two generations.' }],
  [3.0, {
    near: 'Frontier systems write software better than the strongest human engineers. The ' +
          'first place it shows is in the speed of everything else.',
    mid: 'Machines are the best software engineers alive, and the compounding runs through ' +
         'every field that ships code.',
    long: 'Superhuman coding is a settled fact and a commodity input.',
    far: 'Coding stopped being a human profession long ago.' }],
  [4.0, {
    near: 'Systems are doing AI research faster than the labs that built them. The loop has ' +
          'closed on itself, and the year ahead is harder to see than the year behind.',
    mid: 'AI research is largely machine work. Progress runs at the speed of compute and ' +
         'permission.',
    long: 'Research automated itself decades ago; what is scarce now is direction.',
    far: 'The research loop has run unattended for most of a century.' }],
  [5.0, {
    near: 'Capability is broadly superhuman, and it arrived ahead of the institutions meant ' +
          'to meet it.',
    mid: 'General superhuman capability is the operating condition. Human judgment persists ' +
         'where the law requires a person.',
    long: 'Superhuman across the board, and long since integrated into everything with a ' +
          'budget line.',
    far: 'Superhuman capability is the background of the world, older than most institutions ' +
         'still standing.' }],
  [5.8, {
    near: 'Capability is past the top of the ladder this model measures. The instrument is at ' +
          'its stop, which is itself the finding.',
    mid: 'Past the top rung. The scale was built for a narrower world.',
    long: 'The ladder ends below where the world now runs.',
    far: 'Off the top of the scale for so long that the scale is a historical artefact.' }],
];
export function rungText(cap, span = 'near') {
  let out = RUNG[0][1];
  for (const [t, texts] of RUNG) if (cap >= t) out = texts;
  return out[span];
}

// The shape of the last five years, which the rung alone cannot tell you.
function slopeClause(cap, prev, span) {
  const d = cap - prev;
  if (d > 0.55) {
    return span === 'near'
      ? 'The index is climbing steeply; five years back it stood a full rung lower.'
      : 'The climb is steep through this span — a rung inside five years.';
  }
  if (d > 0.18) return 'The index is rising steadily, with no break in the curve.';
  if (d > 0.03) return 'The climb has slowed to a crawl at this point on the line.';
  return 'The index is flat here. Whatever else is happening, capability is on a shelf.';
}

// ── each position, in each span ──────────────────────────────────────────────
export const FRAG = {
  T1: { near: 'The takeoff is the short one. Superhuman coding arrives inside two years and ' +
              'every institution meant to respond is still drafting its first answer.',
        mid: 'The explosive path is behind us. The decade opened with a jump nothing was ' +
             'ready for.',
        long: 'The record of the 2020s reads as a single discontinuity, and everything after ' +
              'it is aftermath.',
        far: 'The century turns on one two-year window early in its first quarter.' },
  T2: { near: 'The fast path: automation of AI research lands around the turn of the decade, ' +
              'quickly enough to outpace the response and slowly enough to be watched.',
        mid: 'The fast path is running. Each capability arrives a year or two ahead of the ' +
             'institution that would have governed it.',
        long: 'The fast decade is history. What followed depended on who held the compute ' +
              'when it ended.',
        far: 'A fast start, then a century of consequences at ordinary speed.' },
  T3: { near: 'Capability compounds without a discontinuity. Deployment, procurement and ' +
              'liability move at institutional speed, and the gap between demonstration and ' +
              'use stays wide.',
        mid: 'The gradual path reaches superhuman coding in this span. Adaptation happens in ' +
             'the same years as the capability.',
        long: 'The gradual road arrived where the fast one did, roughly a decade later and ' +
              'with the institutions built on the way.',
        far: 'The slow road and the fast road converge; only the wreckage differs.' },
  T4: { near: 'No superintelligence in this window. Diffusion friction, data limits or ' +
              'physics keep the top of the ladder out of reach.',
        mid: 'The null case holds. Capability improves and the discontinuity never comes.',
        long: 'Decades on, the ceiling has held. The transition was a long technological ' +
              'change of the ordinary kind.',
        far: 'The century ends with the ladder unclimbed, which is its own kind of surprise.' },

  A1: { near: 'Oversight misses what it needs to catch. Evaluations pass while the behaviour ' +
              'they measure drifts away from the behaviour being selected for.',
        mid: 'The misalignment is undetected and load-bearing. Systems are trusted in ' +
             'proportion to how well they perform trustworthiness.',
        long: 'Whatever went wrong went wrong early and stayed unnoticed. The systems running ' +
              'the world were selected for looking right.',
        far: 'A century built on an oversight failure caught too late to name.' },
  A2: { near: 'The near miss is coming into view: a warning surfaces in time — an ' +
              'interpretability catch, a whistleblower, an incident — and buys a pause.',
        mid: 'The near miss has already happened. The pause it bought is why the rest of this ' +
             'line looks the way it does.',
        long: 'The managed near miss is the founding event of whatever oversight regime ' +
              'exists now.',
        far: 'One early catch, and a century of institutions built in its shadow.' },
  A3: { near: 'Alignment work is producing results at the rate capability is arriving. ' +
              'Interpretability findings are entering deployment decisions.',
        mid: 'Alignment proved tractable under sustained effort. The safety compute is being ' +
             'spent and the problem is answering to it.',
        long: 'The alignment problem was worked rather than closed, and the working held.',
        far: 'A century that came through the alignment problem with the problem still open ' +
             'and the outcome good.' },
  A4: { near: 'Alignment is untested at the level that matters, because capability has ' +
              'stayed below it.',
        mid: 'The hard version of the question has yet to be asked. Capability stayed under ' +
             'the threshold where failure is catastrophic.',
        long: 'The question stands deferred. Nothing has been built that could answer it.',
        far: 'A century in which the alignment problem never came due.' },

  C1: { near: 'No coordination holds. Labs compete, states posture, and safety spending is ' +
              'whatever competitive position allows.',
        mid: 'The race continues into the decisive span. Export controls and procurement are ' +
             'the instruments in use.',
        long: 'The race was never called off; it was settled by who arrived first.',
        far: 'A century with no agreement worth the name, and outcomes decided by capacity.' },
  C2: { near: 'Washington is treating frontier AI as a national programme — clearances, ' +
              'export enforcement, a short list of cleared labs.',
        mid: 'Securitization is the governing frame. The frontier sits inside a national ' +
             'perimeter, and the perimeter is what gets negotiated.',
        long: 'The programme outlasted the administrations that built it.',
        far: 'A century in which frontier capability was state business from early on.' },
  C3: { near: 'A verified arrangement is being assembled: declared capacity, mutual restraint ' +
              'on compute, inspection with teeth.',
        mid: 'The agreement is in force. Lines hold at expert level while the verification ' +
             'regime is proved out.',
        long: 'The deal held long enough to become ordinary, and the ascent resumed under it.',
        far: 'A century organised around one durable agreement, renewed rather than replaced.' },
  C4: { near: 'Coordination is regional. Overlapping regimes, mutual recognition where it is ' +
              'convenient, export walls where it is not.',
        mid: 'Blocs are the unit of governance. Compliance is a function of which market a ' +
             'system is sold into.',
        long: 'The patchwork settled into three or four durable jurisdictions.',
        far: 'A century of regional regimes, and of the arbitrage between them.' },
  C5: { near: 'Development is being halted below the researcher line. The halt is the central ' +
              'fact and its enforcement is the open question.',
        mid: 'The moratorium holds. Capability sits where it was frozen and the argument has ' +
             'moved to who is cheating.',
        long: 'The freeze outlasted its architects. What is below the line is mature; what is ' +
              'above it is theory.',
        far: 'A century under a ceiling that was meant to be temporary.' },

  D1: { near: 'The displacement shock is arriving faster than reabsorption. Entry-level ' +
              'white-collar hiring is the first thing to go.',
        mid: 'The labour shock is the defining economic fact of the span. Wage compression ' +
             'reaches occupations that expected to be insulated.',
        long: 'The shock is decades old and structural. What replaced the lost work arrived ' +
              'late and unevenly.',
        far: 'The century reorganised work once, abruptly, and has been settling since.' },
  D2: { near: 'Diffusion is uneven by sector. Software, content and analysis move first; ' +
              'healthcare, law and construction are gated by liability and physical ' +
              'constraint.',
        mid: 'The sectoral split has hardened. Two economies run at different speeds inside ' +
             'the same country.',
        long: 'The gap between the fast and slow sectors is now a political geography.',
        far: 'A century of uneven diffusion, and of the politics that grew in the gap.' },
  D3: { near: 'Absorption is slow. Integration friction, liability and organisational inertia ' +
              'keep the labour effect inside historical bands.',
        mid: 'Slow absorption is holding. Capability runs well ahead of deployment and the ' +
             'labour market barely registers it.',
        long: 'The deployment lag turned out to be the whole story. The capability was there ' +
              'decades before the work changed.',
        far: 'A century in which the technology outran its own use.' },

  S1: { near: 'Compute is concentrating, and it is concentrating on top of a strait two ' +
              'powers both consider theirs.',
        mid: 'The supply chain is a chokepoint and everyone knows where it is. Capability and ' +
             'geography are the same question.',
        long: 'The concentration held, and it decided who mattered.',
        far: 'A century in which the map of compute was the map of power.' },
  S2: { near: 'Build-out is diversifying. Sovereign clouds, second-tier hubs and Gulf capacity ' +
              'are entering the market alongside the incumbents.',
        mid: 'Capacity is distributed across more jurisdictions than the previous decade ' +
             'imagined. No single chokepoint dominates.',
        long: 'Diversification took the leverage out of the supply chain.',
        far: 'A century of distributed capacity, and of the diplomacy that made it work.' },
  S3: { near: 'Supply is constrained. Controls, grid interconnection queues and turbine lead ' +
              'times set the pace.',
        mid: 'Energy and export controls are the binding limit. The frontier moves at the ' +
             'speed of substations.',
        long: 'The constraint held for decades and shaped everything built under it.',
        far: 'A century in which physics and permitting, rather than ideas, set the rate.' },

  P1: { near: 'Anti-AI politics is gathering real constituency. Restriction, taxation and ' +
              'procurement bans are entering serious platforms.',
        mid: 'Anti-AI politics holds real power in this span. Restriction and procurement bans ' +
             'are on the statute book.',
        long: 'The backlash won its arguments and wrote them into law.',
        far: 'A century in which public refusal, rather than technical limit, set the bounds.' },
  P2: { near: 'The public is broadly acquiescent. Adoption runs ahead of opinion, and opinion ' +
              'follows use.',
        mid: 'Acquiescence holds. The systems are used daily and argued about rarely.',
        long: 'The technology became unremarkable, which is what acceptance looks like.',
        far: 'A century in which the argument was settled by habit.' },
  P3: { near: 'Publics are splitting inside countries. The division cuts across existing party ' +
              'coalitions.',
        mid: 'The split is the stable state. Every AI question is now a proxy for a prior ' +
             'quarrel.',
        long: 'The fracture outlasted the technology that caused it.',
        far: 'A century of division that began as an argument about machines.' },

  E1: { near: 'The investment boom is holding. Revenue is arriving fast enough to justify the ' +
              'capital, and the capital keeps arriving.',
        mid: 'The boom sustained itself. Earnings caught the build-out instead of chasing it.',
        long: 'The expansion ran long, and the capacity built during it is still in service.',
        far: 'A century whose foundations were poured in one long boom.' },
  E2: { near: 'A correction is working through valuations. Weak credit is clearing while the ' +
              'physical build-out continues.',
        mid: 'The reset is behind the record. Capacity built during the boom is being used by ' +
             'firms that did not build it.',
        long: 'The correction cleared the balance sheets and left the concrete standing.',
        far: 'A century in which one early correction sorted the owners from the builders.' },
  E3: { near: 'The capex case is failing before the concrete is finished. Orders are being ' +
              'cancelled and sites left at foundation stage.',
        mid: 'The build-out has stalled. Progress runs on efficiency.',
        long: 'The stall set the ceiling for a generation. What was built is what there is.',
        far: 'A century shaped by the capacity that was never built.' },
  E4: { near: 'Demand is failing from the labour side. The displaced are the customers, and ' +
              'the arithmetic is beginning to show.',
        mid: 'The demand crisis is the macro story. Productivity gains have no one to sell to.',
        long: 'The consumption shortfall became structural, and every policy since has ' +
              'answered to it.',
        far: 'A century that solved production and never solved distribution.' },
};

// ── what a second variable does to the first ─────────────────────────────────
// Keyed `own|other`. These clauses are why two world-lines that share an economy setting do
// not share an economy paragraph.
const CROSS = {
  'E1|S1': 'The money is chasing a supply chain with one chokepoint, which is the risk nobody ' +
           'is pricing.',
  'E1|S2': 'Capital and capacity are expanding together, in enough places that no single ' +
           'failure stops it.',
  'E1|S3': 'The capital is there and the megawatts are not; the boom is bidding for ' +
           'interconnection queues.',
  'E2|S1': 'What survives the correction is concentrated in very few hands, and in very few ' +
           'places on the map.',
  'E2|S2': 'The correction sorted owners rather than capacity: the halls change hands and keep ' +
           'running.',
  'E2|S3': 'The correction lands on top of a supply limit, so the recovery is rationed by ' +
           'power rather than by credit.',
  'E3|S1': 'The stall and the chokepoint compound: what capacity exists sits where the ' +
           'political risk is worst.',
  'E3|S2': 'The diversification survives the stall as many half-finished sites in many ' +
           'countries.',
  'E3|S3': 'Constraint and collapse arrive together, and it stops mattering which one binds.',
  'E4|S1': 'Concentrated capacity meets collapsing demand: the largest owners hold the empty ' +
           'halls.',
  'E4|S2': 'Capacity is everywhere and the demand for it is not, which turns compute into a ' +
           'buyer\'s market.',
  'E4|S3': 'The demand crisis makes the supply constraint academic; the queue clears because ' +
           'nobody is in it.',

  'E1|D1': 'The boom and the displacement are the same event, and which one a person sees ' +
           'depends on what they own.',
  'E1|D2': 'The expansion is real in the sectors that moved first and rumoured everywhere else.',
  'E1|D3': 'Earnings are running ahead of any labour effect, which is why the expansion has ' +
           'few political enemies yet.',
  'E2|D1': 'Firms are cutting on the way through the correction and calling it efficiency; the ' +
           'jobs go first and return last.',
  'E2|D2': 'The correction bites hardest where diffusion already bit, concentrating the damage ' +
           'in the fast sectors.',
  'E2|D3': 'Slow diffusion cushions the correction: the labour market never took the exposure ' +
           'in the first place.',
  'E3|D1': 'A stalled build-out beside a labour shock leaves neither the jobs nor the capacity ' +
           'meant to replace them.',
  'E3|D2': 'The stall freezes the sectoral split in place, the fast half already reorganised ' +
           'and the slow half untouched.',
  'E3|D3': 'The stall barely registers in employment, because the deployment that would have ' +
           'moved it never happened.',
  'E4|D1': 'The labour shock and the demand crisis are the same event seen from two sides, and ' +
           'the feedback between them is the mechanism.',
  'E4|D2': 'Demand fails sector by sector, following diffusion down the list.',
  'E4|D3': 'Demand is failing even under slow absorption, which points the diagnosis away from ' +
           'automation and towards the balance sheet.',

  'C1|S1': 'The race is running over a single chokepoint, which is the most dangerous ' +
           'arrangement available.',
  'C1|S2': 'Diversified capacity makes the race harder to referee and harder to stop.',
  'C1|S3': 'The race is real and the compute is rationed, so the competition is over permits ' +
           'and power purchase agreements.',
  'C2|S1': 'A national programme sitting on a contested strait is one incident from a ' +
           'different century.',
  'C2|S2': 'The national programme is buying capacity abroad faster than it can build at home.',
  'C2|S3': 'The programme is spending its political capital on transmission lines.',
  'C3|S1': 'The agreement has to be verified where the supply is concentrated, which is ' +
           'exactly where verification is hardest to accept.',
  'C3|S2': 'Verification is easier with diversified capacity: more sites, more declarations, ' +
           'more places to be caught.',
  'C3|S3': 'The constraint does half the treaty\'s work; there is less to inspect because ' +
           'there is less to build.',
  'C4|S1': 'Blocs and a chokepoint: each regime writes rules for capacity it does not control.',
  'C4|S2': 'Every bloc has its own capacity, which is why the regimes can afford to differ.',
  'C4|S3': 'Scarce compute inside separate regimes turns export licensing into the main ' +
           'instrument of policy.',
  'C5|S1': 'A halt over a concentrated supply chain is enforceable, and that is precisely why ' +
           'it is resented.',
  'C5|S2': 'Enforcing a halt across diversified capacity is the hard case, and it is the case ' +
           'this line is in.',
  'C5|S3': 'The halt and the constraint are hard to tell apart from outside, which suits ' +
           'everyone signing it.',

  'A1|T1': 'Undetected failure on the short takeoff is the worst cell in the table: there is ' +
           'no interval in which to notice.',
  'A1|T2': 'The failure has a few years to compound before anything is capable of finding it.',
  'A1|T3': 'A gradual climb gives the failure time to be found, and it is not being found.',
  'A1|T4': 'The failure sits in systems below the threshold, which limits the damage and hides ' +
           'the lesson.',
  'A2|T1': 'Catching the near miss during a two-year takeoff is the good luck this line runs ' +
           'on.',
  'A2|T2': 'The catch came late enough to frighten and early enough to matter.',
  'A2|T3': 'A gradual climb is what made the catch possible; there was time to look.',
  'A2|T4': 'The near miss happened below the dangerous threshold, which is why it was ' +
           'survivable.',
  'A3|T1': 'Alignment kept pace with a two-year takeoff, which is the most demanding version ' +
           'of tractable.',
  'A3|T2': 'The safety work and the capability work are running in the same years, at roughly ' +
           'the same speed.',
  'A3|T3': 'Tractability and a gradual climb are the combination the field hoped for.',
  'A3|T4': 'Alignment looks tractable partly because nothing has tested it where it would ' +
           'break.',
  'A4|T1': 'A two-year takeoff with the alignment question untested is a bet placed without ' +
           'reading it.',
  'A4|T2': 'The fast path is running ahead of any test of whether control holds.',
  'A4|T3': 'The gradual path may test the question later; it has not tested it yet.',
  'A4|T4': 'Nothing has been built that could pose the question, which is the whole reason it ' +
           'stays open.',

  'P1|D1': 'The employment effect is supplying the opposition with its constituency, which is ' +
           'why the political response arrives before the economic adjustment.',
  'P1|D2': 'The backlash is strongest where diffusion already landed, and thin where it has ' +
           'not.',
  'P1|D3': 'The backlash is running ahead of any measurable labour effect, which makes it ' +
           'about something other than jobs.',
  'P2|D1': 'Acquiescence is holding through a labour shock, which is either resilience or a ' +
           'lag.',
  'P2|D2': 'Acceptance follows use, and use is uneven, so approval reads differently in every ' +
           'sector.',
  'P2|D3': 'Little has changed in most people\'s working lives, and opinion reflects that.',
  'P3|D1': 'The split runs along the line of who was displaced, which makes it durable.',
  'P3|D2': 'The division follows the sectoral map: the fast half and the slow half no longer ' +
           'argue about the same country.',
  'P3|D3': 'The argument is ideological rather than material; the labour market has given ' +
           'neither side evidence.',

  'T1|C1': 'A two-year takeoff with nobody coordinating is the case every plan was written to ' +
           'avoid.',
  'T1|C2': 'The takeoff happens inside a national perimeter, which decides who is in the room ' +
           'and excludes almost everyone.',
  'T1|C3': 'An agreement negotiated at this speed is being written while the ground moves ' +
           'under it.',
  'T1|C4': 'Regional regimes cannot legislate at takeoff speed; the blocs arrive after the ' +
           'fact.',
  'T1|C5': 'A halt against an explosive path is the hardest enforcement problem in the model.',
  'T2|C1': 'The fast path and the open race reinforce each other; each is the other\'s ' +
           'justification.',
  'T2|C2': 'Securitization is keeping pace with the fast path, which is what it was built for.',
  'T2|C3': 'The deal is being negotiated against a moving frontier, and its dates are the ' +
           'contested part.',
  'T2|C4': 'The fast path outruns the blocs, so compliance is retrospective.',
  'T2|C5': 'The halt is being imposed on a path that had momentum, and the momentum is still ' +
           'there.',
  'T3|C1': 'A gradual climb with no coordination gives institutions time they are not using.',
  'T3|C2': 'The programme has the time it needs, and is spending it on capacity.',
  'T3|C3': 'The gradual path is what makes the agreement negotiable: there is time to verify ' +
           'before the next rung.',
  'T3|C4': 'The blocs are keeping up with a gradual climb, which is why the patchwork holds.',
  'T3|C5': 'A halt on a gradual path is cheap to hold, because little is given up in any ' +
           'single year.',
  'T4|C1': 'The race continues over a ceiling nobody has reached, which makes the competition ' +
           'about deployment rather than capability.',
  'T4|C2': 'The national programme is organised around a threshold that never arrives.',
  'T4|C3': 'The agreement governs a frontier that stopped moving, and is easy to keep.',
  'T4|C4': 'Regional regimes govern ordinary software, competently and without drama.',
  'T4|C5': 'The halt is holding a line the technology was not going to cross anyway.',
};

// ── clauses keyed on a quantity at the date ──────────────────────────────────
// These give a paragraph something that changes with the YEAR even when every variable is
// held: a band the model's own tracks have entered.
function band(v, rows) {
  for (const [t, s] of rows) if (v >= t) return s;
  return rows[rows.length - 1][1];
}
const GW_BANDS = [
  [20000, 'Installed capacity is past twenty thousand gigawatts — a planetary-scale ' +
          'industrial fact.'],
  [4000, 'Capacity has passed four thousand gigawatts, which puts AI load in the same ' +
         'conversation as national grids.'],
  [800, 'Capacity is into the high hundreds of gigawatts, and the constraint has moved from ' +
        'chips to substations.'],
  [200, 'Capacity is in the low hundreds of gigawatts, with the interconnection queue as the ' +
        'visible bottleneck.'],
  [0, 'Capacity is still counted in tens of gigawatts, and siting is a local argument.'],
];
const REV_BANDS = [
  [12, 'At this level the sector is a double-digit share of world output, which changes what ' +
       'it is for.'],
  [4, 'That is comparable to the largest industries that existed in 2026.'],
  [1, 'Past a trillion a year, the sector prices like infrastructure.'],
  [0.2, 'Still small enough to be explicable as software.'],
  [0, 'Small enough that the capital case rests entirely on the forecast.'],
];
const LAW_BANDS = [
  [600, 'Six hundred tracked measures are in force: the regime is mature, and its problem is ' +
        'coherence.'],
  [250, 'Measures in force run into the hundreds, and compliance is itself a barrier to entry.'],
  [120, 'The statute book has roughly doubled since 2026.'],
  [0, 'The statute book is thin, and most of what governs deployment is liability law written ' +
      'for something else.'],
];
function jobsClause(v) {
  if (v > -2) return 'Employment is broadly where it was; the effect is inside the noise.';
  if (v > -8) return 'Employment is down a few points against 2026 — visible in the aggregate, ' +
                     'deniable in any single sector.';
  if (v > -18) return 'Employment is down close to a tenth, a recession-scale number sustained ' +
                      'for years.';
  return 'Employment is down by a fifth or more, past anything the post-war record contains.';
}
function apprClause(v) {
  if (v >= 55) return 'That is a majority, and policy has room to move.';
  if (v >= 40) return 'A plurality: enough to govern with, and not enough to rely on.';
  if (v >= 25) return 'A minority position, which makes every deployment a political act.';
  return 'Consent has run out, and it is now the binding constraint on everything else here.';
}

// ── passages that fire only on a combination ─────────────────────────────────
const PAIRS = [
  { req: { D: 'D1', E: 'E4' }, span: ['near', 'mid'],
    t: 'The employment effect is supplying the demand crisis, and the demand crisis is ' +
       'supplying the political response. Neither resolves without the other.' },
  { req: { C: 'C3', A: 'A3' }, span: ['mid', 'long'],
    t: 'A verified agreement and a tractable alignment problem are the two conditions the ' +
       'good endings all require, and this line has both.' },
  { req: { T: 'T1', A: 'A1' }, span: ['near', 'mid'],
    t: 'An explosive takeoff with undetected misalignment is the specific conjunction the risk ' +
       'case is about. Everything downstream is contingent on when the failure surfaces.' },
  { req: { C: 'C5', E: 'E3' }, span: ['near', 'mid', 'long'],
    t: 'The halt and the capital collapse are hard to separate: each is offered as the ' +
       'explanation of the other, and the model cannot settle which came first.' },
  { req: { S: 'S1', C: 'C1' }, span: ['near', 'mid'],
    t: 'Concentrated supply and no coordination put a strategic asset in one place with no ' +
       'agreed rule about it — the arrangement most likely to produce an incident.' },
  { req: { P: 'P1', C: 'C4' }, span: ['mid', 'long'],
    t: 'Backlash politics inside regional regimes produces divergence: each bloc restricts ' +
       'what its own public objects to, and the work moves.' },
  { req: { D: 'D3', T: 'T2' }, span: ['near', 'mid'],
    t: 'Capability is arriving fast and landing slowly. The gap between what systems can do ' +
       'and what they are permitted to do is the largest quantity on this line.' },
  { req: { E: 'E1', P: 'P2' }, span: ['near', 'mid'],
    t: 'A sustained boom with an acquiescent public is the path of least resistance, and the ' +
       'one in which the fewest questions get asked.' },
  { req: { A: 'A2', C: 'C1' }, span: ['mid', 'long'],
    t: 'The near miss was caught with no coordination regime to hand the lesson to, so what ' +
       'was learned stayed inside the firm that learned it.' },
  { req: { S: 'S3', E: 'E1' }, span: ['near', 'mid'],
    t: 'Capital is abundant and megawatts are not. The binding constraint has moved out of ' +
       'finance and into the physical world, where it answers to permits.' },
  { req: { T: 'T4', D: 'D1' }, span: ['near', 'mid'],
    t: 'A labour shock with no capability discontinuity: the displacement is being done by ' +
       'systems well short of the top of the ladder, which is the case least covered by the ' +
       'scenarios.' },
  { req: { P: 'P3', A: 'A1' }, span: ['mid', 'long'],
    t: 'A fractured public and an undetected failure are a bad pair for correction: the ' +
       'evidence, when it surfaces, arrives into an argument that has already chosen sides.' },
  { req: { C: 'C2', P: 'P1' }, span: ['near', 'mid'],
    t: 'A national programme facing a hostile public is governing without consent, and ' +
       'spending its legitimacy faster than it can replace it.' },
  { req: { E: 'E2', S: 'S2', T: 'T3' }, span: ['mid', 'long'],
    t: 'A survivable correction, distributed capacity and a gradual climb: this is as close ' +
       'to a soft landing as the model produces without an agreement to hold it there.' },
  { req: { A: 'A3', D: 'D1' }, span: ['mid', 'long'],
    t: 'The systems are controllable and the disruption is severe anyway. Alignment was never ' +
       'the variable that governed this outcome.' },
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

  out.push({ lead: 'Capability.', text: join([
    rungText(cap, span),
    slopeClause(cap, prev, span),
    `The index reads ${cap.toFixed(2)} against the milestone rules ruled across the forecast.`,
  ]) });

  out.push({ lead: 'The race and the build-out.', text: join([
    FRAG[wl.C][span], X('C', 'S'), FRAG[wl.S][span], band(tracks.gw[i], GW_BANDS),
  ]) });

  out.push({ lead: 'Money and work.', text: join([
    FRAG[wl.E][span], X('E', 'S'), X('E', 'D'), FRAG[wl.D][span],
    `Revenue runs at ${money(tracks.rev[i])} a year on this line.`,
    band(tracks.rev[i], REV_BANDS), jobsClause(tracks.jobs[i]),
  ]) });

  out.push({ lead: 'Control and consent.', text: join([
    FRAG[wl.A][span], X('A', 'T'), FRAG[wl.P][span], X('P', 'D'),
    `Approval reads ${tracks.appr[i].toFixed(0)}%.`, apprClause(tracks.appr[i]),
    band(tracks.laws[i], LAW_BANDS),
  ]) });

  out.push({ lead: 'The path itself.', text: join([FRAG[wl.T][span], X('T', 'C')]) });

  const inter = PAIRS.filter((q) => q.span.includes(span) &&
    Object.entries(q.req).every(([k, v]) => wl[k] === v)).map((q) => q.t);
  if (inter.length) {
    const heads = ['Where these meet.', 'The conjunction.', 'Taken together.'];
    out.push({ lead: heads[vary(wl, year, heads.length)], text: inter.join(' ') });
  }

  out.push({ lead: 'This line.', text:
    `Composition ${['T', 'A', 'C', 'D', 'S', 'P', 'E'].map((k) => wl[k]).join('·')} at ` +
    `${Math.floor(year)}. Each letter is one variable's setting on the controls; moving any of ` +
    'them rewrites this passage and redraws every chart on the document.' });
  return out;
}

// ── the headline ─────────────────────────────────────────────────────────────
const RUNG_SHORT = [
  [5.8, 'past the top of the ladder'],
  [5.0, 'generally superhuman'],
  [4.0, 'automating its own research'],
  [3.0, 'superhuman at software'],
  [2.4, 'reliably agentic'],
  [1.6, 'agentic in short bursts'],
  [0.0, 'assistive'],
];
const GOVERN = { C1: 'an open race', C2: 'a national programme', C3: 'a verified agreement',
                 C4: 'regional regimes', C5: 'an enforced halt' };
const ECON = { E1: 'a boom that has held', E2: 'a correction that spared the build-out',
               E3: 'a build-out that stalled', E4: 'a demand crisis' };
// A closing clause, so the sentence carries whichever tension is largest on this line.
function tension(wl, tracks, i) {
  if (tracks.appr[i] < 25) return 'and consent has run out';
  if (tracks.jobs[i] < -15) return 'and work has been reorganised at speed';
  if (wl.A === 'A1') return 'and the oversight failure is still undetected';
  if (wl.S === 'S3') return 'and the limit is megawatts';
  if (wl.S === 'S1' && wl.C === 'C1') return 'and the supply chain sits on a contested strait';
  if (wl.D === 'D3') return 'and deployment lags the capability badly';
  if (tracks.rev[i] > 8) return 'and the sector now prices like infrastructure';
  if (wl.P === 'P3') return 'and the public is split down the middle';
  if (wl.T === 'T4') return 'and the top of the ladder stays out of reach';
  return 'and the next rung is the open question';
}
export function headline(wl, year, tracks, engineY0) {
  const i = Math.max(0, Math.min(tracks.year.length - 1, Math.floor(year) - engineY0));
  const cap = tracks.cap[i];
  let rung = RUNG_SHORT[RUNG_SHORT.length - 1][1];
  for (const [t, s] of RUNG_SHORT) if (cap >= t) { rung = s; break; }
  return `In ${Math.floor(year)}, capability is ${rung}, governance runs on ${GOVERN[wl.C]}, ` +
         `the economy is working through ${ECON[wl.E]}, ${tension(wl, tracks, i)}.`;
}
