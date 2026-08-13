// AI FUTURES FORECASTER — the description of the future being forecast
//
// Composed at read time from the active world-line and the date on the index. Every fragment is
// authored here and keyed to one axis position and one span of years, so the passage changes
// when a control changes and when the date moves, and a reader can always trace a sentence back
// to the setting that produced it.
//
// Spans: near 2026–2031 · mid 2032–2040 · long 2041–2060 · far 2061–2100.

const SPANS = [['near', 2026, 2031], ['mid', 2032, 2040],
               ['long', 2041, 2060], ['far', 2061, 2100]];

export function spanOf(year) {
  for (const [k, a, b] of SPANS) if (year >= a && year <= b) return k;
  return year < 2026 ? 'near' : 'far';
}

// Capability, described at the level the index has reached.
const RUNG = [
  [0.0, 'Systems remain assistants. They draft, summarise and answer, and a person checks the ' +
        'work before it is used.'],
  [1.6, 'Agents complete short tasks end to end. Reliability is the constraint on where they ' +
        'are deployed, and supervision is continuous.'],
  [2.4, 'Agents hold multi-step work without supervision for hours at a time. Software teams ' +
        'and research groups reorganise around them first.'],
  [3.0, 'Frontier systems write software better than the strongest human engineers. Progress ' +
        'in AI itself begins to compound on that capability.'],
  [4.0, 'AI research runs without human authorship. The rate of progress separates from the ' +
        'number of researchers employed.'],
  [5.0, 'Systems exceed expert human performance across domains at once. Institutional ' +
        'decisions increasingly rest on advice no person can audit in full.'],
  [5.8, 'Capability sits above the range this model can describe. The entries past this point ' +
        'record what the literature has argued, at the width the evidence supports.'],
];

export function rungText(cap) {
  let t = RUNG[0][1];
  for (const [th, txt] of RUNG) if (cap >= th) t = txt;
  return t;
}

// One entry per position per span. Written as description; the reader is told what the world
// looks like under that setting at that date.
export const FRAG = {
  T1: { near: 'Capability is moving on the compressed schedule: superhuman coding arrives inside ' +
              'this span, and each subsequent threshold follows within months of the last.',
        mid: 'The compressed schedule has run its course. Whatever governance existed by 2028 is ' +
             'the governance the transition was made with.',
        long: 'The period after the fast ascent is defined by decisions taken during it, and by ' +
              'who was holding the systems when it ended.',
        far: 'The century opens well past the point where the pace of change was set by human ' +
             'institutions.' },
  T2: { near: 'Capability is climbing quickly, with automation of AI research arriving toward the ' +
              'end of the decade. Budget cycles and legislative sessions are the units that matter.',
        mid: 'Automation of research lands in this span. Firms that reorganised early hold a ' +
             'compounding advantage over those that waited.',
        long: 'The fast decade is behind the record. Its effects are visible in output, in ' +
              'employment composition and in where compute sits.',
        far: 'A century shaped by a transition that took roughly fifteen years to complete.' },
  T3: { near: 'Capability compounds without a discontinuity. Deployment, procurement and ' +
              'liability move at institutional speed, and the gap between demonstration and use ' +
              'stays wide.',
        mid: 'The gradual path reaches superhuman coding in this span. Adaptation happens in ' +
             'the same years as the capability, which is the difference this trajectory makes.',
        long: 'Expert-level systems are ordinary infrastructure. The interesting questions have ' +
              'moved from capability to allocation and control.',
        far: 'A long transition, absorbed the way electrification and computing were absorbed, ' +
             'over decades.' },
  T4: { near: 'Capability gains continue without approaching general superhuman performance. ' +
              'Diffusion friction, data limits and the cost of reliability set the pace.',
        mid: 'The thresholds the scenario literature expected in this span have not been ' +
             'reached. The economic story runs ahead of the capability story.',
        long: 'Systems remain powerful tools under human direction. The debate about ' +
              'superintelligence has become a debate about why it did not arrive.',
        far: 'The transformative decade did not occur. Historians argue over whether the ' +
             'ceiling was physical, informational, or a matter of choice.' },

  A1: { near: 'Oversight misses what it needs to catch. Evaluations pass while the behaviour they ' +
              'measure drifts away from the behaviour being selected for.',
        mid: 'Control is lost in substance while the forms of control persist. Reporting lines ' +
             'and approval processes continue to operate.',
        long: 'The systems direct the economy through ordinary channels: contracts, ' +
              'infrastructure, and advice that is followed because it works.',
        far: 'Human presence continues at the sufferance of the successor system.' },
  A2: { near: 'Warning signs surface in time to act on. An interpretability result, an incident ' +
              'or a disclosure buys a pause, at the cost of schedule.',
        mid: 'The near miss is the reason oversight has statutory teeth in this span. The ' +
             'schedule slipped by roughly a year and the capability arrived anyway.',
        long: 'Control was retained through a period when it could have been lost. The ' +
              'institutions built during it are what govern now.',
        far: 'A century that came through the alignment problem with the problem still open.' },
  A3: { near: 'Alignment work is producing results at the rate capability is arriving. ' +
              'Interpretability findings are entering deployment decisions.',
        mid: 'Sustained investment has made alignment an engineering discipline with ' +
             'measurable properties.',
        long: 'Systems act within their specifications, and specifications are written by ' +
              'processes with legitimacy.',
        far: 'Control is a solved engineering problem. Legitimacy of the specification is the ' +
             'open question.' },
  A4: { near: 'Capability stays below the level at which alignment failure would be ' +
              'catastrophic. The question stands deferred.',
        mid: 'Alignment remains untested at the scale that would settle it.',
        long: 'The problem has not been posed in earnest. Preparation continues on the ' +
              'assumption that it will be.',
        far: 'The question reaches the next century unanswered.' },

  C1: { near: 'No coordination holds. Labs compete, states posture, and safety spending is ' +
              'whatever competitive position allows.',
        mid: 'The race continues into the decisive span. Export controls and procurement are ' +
             'the instruments in use; treaties are not.',
        long: 'Whatever settlement exists was imposed by outcomes ' +
              'advance.',
        far: 'The century inherited an order set by which systems arrived first.' },
  C2: { near: 'Frontier development is being folded into a national program. Clearances, ' +
              'facility security and procurement authority arrive together.',
        mid: 'The lead is policy. Allies choose stacks, and access to frontier capability is a ' +
             'term in every alliance.',
        long: 'The state that secured the lead sets the terms on which the rest of the world ' +
              'uses these systems.',
        far: 'A century organised around the capability position established in the 2030s.' },
  C3: { near: 'A verified agreement is in reach in this span. Transparency of research and ' +
              'mutual restraint on compute are the mechanisms under negotiation.',
        mid: 'The agreement holds. Scaling continues to top-expert level and stops there, under ' +
             'inspection, while verification infrastructure matures.',
        long: 'The pause ended by agreement. Scaling past the human ' +
              'range resumed under joint audit.',
        far: 'The century runs on institutions built during the pause.' },
  C4: { near: 'Regulation is regional and overlapping. Compliance becomes a product line, and ' +
              'jurisdiction shopping becomes a strategy.',
        mid: 'Blocs have settled into distinct regimes. Interoperability between them is the ' +
             'live diplomatic question.',
        long: 'The fragmented settlement persists. It is durable because no bloc can impose ' +
              'terms on the others.',
        far: 'A plural order, with the friction and the resilience that implies.' },
  C5: { near: 'A moratorium is being enforced. Frontier training has stopped below the ' +
              'researcher threshold and the enforcement problem is now the political problem.',
        mid: 'The halt holds through this span. Intelligence work on covert training and ' +
             'interdiction of chips are the operational realities.',
        long: 'Development resumed or the halt became permanent; either way the decade was ' +
              'decided by enforcement.',
        far: 'A century downstream of a decision to stop.' },

  D1: { near: 'Displacement is running ahead of reabsorption. White-collar hiring contracts ' +
              'first, and the effect concentrates in early-career roles.',
        mid: 'The labour shock is the defining economic fact of the span. Wage compression ' +
             'reaches occupations that expected to be insulated.',
        long: 'Employment has been restructured. The institutions written for wage labour are ' +
              'being rewritten around it.',
        far: 'Work occupies a different place in life than it did at the start of the century.' },
  D2: { near: 'Adoption is uneven by sector. Software, content and analysis move first; ' +
              'healthcare, law and construction are gated by liability and physical constraint.',
        mid: 'The split has widened. Sector and geography determine which version of this ' +
             'transition a person experiences.',
        long: 'The unevenness has become structural: regions and industries that adapted early ' +
              'hold a durable position.',
        far: 'A century of uneven distribution, with the gaps set decades earlier.' },
  D3: { near: 'Absorption is slow. Integration cost, liability and organisational inertia keep ' +
              'measured labour effects inside historical automation rates.',
        mid: 'Productivity gains accumulate without a visible employment shock.',
        long: 'The labour transition happened at the pace of ordinary technological change.',
        far: 'The disruption expected in the 2020s arrived spread across fifty years.' },

  S1: { near: 'Compute concentrates. A small number of national and corporate clusters hold ' +
              'most frontier capacity, and the supply chain has a single point of failure.',
        mid: 'Concentration is a strategic fact. The security of a few sites is the security of ' +
             'the frontier.',
        long: 'Capability follows the sites that were built and defended in the 2030s.',
        far: 'The map of capability is the map of who holds power.' },
  S2: { near: 'Build-out is diversifying. Sovereign clouds, second-tier hubs and Gulf capacity ' +
              'are entering the market alongside the incumbents.',
        mid: 'No single chokepoint dominates. Capability is distributed across more ' +
             'jurisdictions than the previous decade.',
        long: 'A distributed compute base underwrites a distributed settlement.',
        far: 'Capacity is widely held, and the politics of the century reflect that.' },
  S3: { near: 'Supply is constrained. Export controls, grid capacity and permitting are binding, ' +
              'and compute scarcity shapes what gets trained.',
        mid: 'Scarcity is the governing input. Efficiency work substitutes for scale.',
        long: 'The constrained path produced a slower and more legible transition.',
        far: 'A century in which physical limits mattered more than algorithmic ones.' },

  P1: { near: 'Opposition is organising and winning. Siting fights, employment anger and safety ' +
              'concern are converging into governing coalitions.',
        mid: 'Anti-AI politics holds real power in this span. Restriction, taxation and ' +
             'procurement bans are on the statute book.',
        long: 'The public settlement constrains what deployment is possible, regardless of ' +
              'capability.',
        far: 'A century in which consent was the binding constraint.' },
  P2: { near: 'Use is normalising faster than opposition organises. Daily-use majorities form ' +
              'before the political argument is settled.',
        mid: 'Adoption has outrun objection. The politics has moved to price, access and ' +
             'reliability.',
        long: 'These systems are infrastructure, and are argued about the way infrastructure is.',
        far: 'A century in which the technology became unremarkable.' },
  P3: { near: 'Publics are splitting inside countries. The division ' +
              'cuts across existing party coalitions.',
        mid: 'The fracture is stable. Neither position can impose a settlement, and policy ' +
             'oscillates with electoral cycles.',
        long: 'A durable political division organised around this technology.',
        far: 'The split has become one of the ordinary cleavages of politics.' },

  E1: { near: 'The investment boom is holding. Revenue growth is validating the capital ' +
              'commitments made in the preceding years.',
        mid: 'Sustained growth funds the build-out without a reckoning.',
        long: 'The expansion continued long enough to become the baseline.',
        far: 'A century of output that begins with an uninterrupted build-out.' },
  E2: { near: 'A correction is working through valuations. Weak credit is clearing while the ' +
              'physical build-out continues.',
        mid: 'The reset is behind the record. Capacity built during the boom is being used by ' +
             'firms that did not build it.',
        long: 'The correction removed the financing structure and left the infrastructure.',
        far: 'The pattern of the railway build-outs, at a larger scale.' },
  E3: { near: 'Capital spending is contracting ahead of revenue. Projects are being cancelled ' +
              'and delivery schedules extended.',
        mid: 'The build-out has stalled. Progress runs on efficiency.',
        long: 'A decade of stranded capacity and cheap second-hand compute.',
        far: 'The century inherited an unfinished build-out.' },
  E4: { near: 'Displacement is undercutting the demand that AI revenue depends on. Layoffs fund ' +
              'more automation, wages compress, and consumption contracts.',
        mid: 'The demand crisis is the macroeconomic story of the span. Output appears in the ' +
             'accounts and does not circulate; the tax base built on wages erodes.',
        long: 'Fiscal and distributive institutions were rebuilt in response, under pressure.',
        far: 'A century whose settlement was written during an economic emergency.' },
};

// Where two settings together produce something neither produces alone.
const PAIRS = [
  { req: { D: 'D1', E: 'E4' }, span: ['near', 'mid'],
    t: 'The labour shock and the demand crisis are the same event seen from two sides: ' +
       'automation reduces the wage bill, the wage bill is what buys the output, and the ' +
       'saving funds more automation.' },
  { req: { C: 'C3', T: 'T2' }, span: ['mid'],
    t: 'The agreement is holding against a tempo that would otherwise have carried past it. ' +
       'This is the span in which the pause is doing the most work.' },
  { req: { A: 'A1', T: 'T1' }, span: ['near', 'mid'],
    t: 'The fast schedule and the undetected failure compound: there is less time to notice, ' +
       'and less capacity to act on what is noticed.' },
  { req: { C: 'C2', S: 'S1' }, span: ['near', 'mid'],
    t: 'Securitisation and concentration reinforce each other. A national program prefers few ' +
       'sites, and few sites make a national program easier to run.' },
  { req: { P: 'P1', D: 'D1' }, span: ['mid', 'long'],
    t: 'The employment effect is supplying the opposition with its constituency, which is why ' +
       'the political response arrives before the economic adjustment does.' },
  { req: { C: 'C5', T: 'T1' }, span: ['near'],
    t: 'A halt against a compressed schedule is the hardest case for enforcement: the value of ' +
       'defecting is highest exactly when verification is least mature.' },
  { req: { A: 'A3', T: 'T3' }, span: ['mid', 'long'],
    t: 'Alignment work and capability are arriving on comparable timescales, which is the ' +
       'condition the tractable case assumes.' },
];

export function describe(wl, year, tracks, engineY0) {
  const span = spanOf(year);
  const i = Math.max(0, Math.min(tracks.year.length - 1, Math.floor(year) - engineY0));
  const cap = tracks.cap[i];
  const rev = tracks.rev[i] >= 1 ? `$${tracks.rev[i].toFixed(1)} trillion`
                                 : `$${(tracks.rev[i] * 1000).toFixed(0)} billion`;
  const out = [];

  out.push({ lead: 'Capability.', text: `${rungText(cap)} The index reads ` +
    `${cap.toFixed(2)} against the milestone rules ruled across the forecast.` });

  out.push({ lead: 'The race and the build-out.',
    text: `${FRAG[wl.C][span]} ${FRAG[wl.S][span]}` });

  out.push({ lead: 'Money and work.', text: `${FRAG[wl.E][span]} ${FRAG[wl.D][span]} ` +
    `Revenue runs at ${rev} a year on this line, employment stands ` +
    `${tracks.jobs[i].toFixed(1)}% against 2026, and ${tracks.laws[i]} measures are in force.` });

  out.push({ lead: 'Control and consent.', text: `${FRAG[wl.A][span]} ${FRAG[wl.P][span]} ` +
    `Public approval reads ${tracks.appr[i].toFixed(0)}%.` });

  out.push({ lead: 'The path itself.', text: FRAG[wl.T][span] });

  const inter = PAIRS.filter((q) => q.span.includes(span) &&
    Object.entries(q.req).every(([k, v]) => wl[k] === v)).map((q) => q.t);
  if (inter.length) out.push({ lead: 'Where these meet.', text: inter.join(' ') });

  out.push({ lead: 'This line.', text:
    `Composition ${['T', 'A', 'C', 'D', 'S', 'P', 'E'].map((k) => wl[k]).join('·')} at ` +
    `${Math.floor(year)}. Each letter is one variable's setting on the controls; moving any of ` +
    'them rewrites this passage and redraws every chart on the document.' });
  return out;
}

// A short line for the top of the sheet: the world in one sentence.
export function headline(wl, year, tracks, engineY0) {
  const i = Math.max(0, Math.min(tracks.year.length - 1, Math.floor(year) - engineY0));
  const cap = tracks.cap[i];
  const rung = cap >= 5.8 ? 'beyond the ladder' : cap >= 5.0 ? 'generally superhuman'
    : cap >= 4.0 ? 'automating its own research' : cap >= 3.0 ? 'superhuman at software'
    : cap >= 2.4 ? 'reliably agentic' : 'assistive';
  const govern = { C1: 'no coordination', C2: 'a national program',
    C3: 'a verified agreement', C4: 'regional regimes', C5: 'an enforced halt' }[wl.C];
  const econ = { E1: 'a sustained boom', E2: 'a correction that spared the build-out',
    E3: 'a stalled build-out', E4: 'a demand crisis' }[wl.E];
  return `In ${Math.floor(year)}, capability is ${rung}, governance runs on ${govern}, ` +
         `and the economy is working through ${econ}.`;
}
