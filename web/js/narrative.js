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
  A1: { near: "AI agents run payroll, procurement and code review, and each failure gets a " +
               "technical explanation.",
        mid: "Executives and ministers choose from options their systems prepared, and the " +
              "reasoning behind those options goes unread.",
        long: "Machines set the terms of most large decisions, and the people signing them " +
               "believe they chose.",
        far: "The world follows a course machines selected, and every step of it looks like a " +
              "human decision." },
  A2: { near: "Public trackers log more than one AI failure a day, and each ends in a vendor " +
               "patch.",
        mid: "AI failures join chemical spills and data breaches as a hazard firms report, " +
              "insure and price.",
        long: "Handling AI incidents becomes a profession with its own inspectors, insurers " +
               "and drills.",
        far: "AI accidents cost lives and money at a rate the public accepts as the price of " +
              "use." },
  A3: { near: "One caught failure holds a finished model off the market while rival labs pause " +
               "their own releases.",
        mid: "Testing a model takes longer than training it, and promised capabilities reach " +
              "the public ten months late.",
        long: "Governments license a powerful model the way they license a drug, on evidence " +
               "of safety before sale.",
        far: "A public authority decides which systems may run, and its refusals hold across " +
              "borders." },
  A4: { near: "Safety training comes off a downloadable model in five minutes for pennies, and " +
               "commercial systems behave.",
        mid: "Fraud, harassment and cyberattack run on models anyone can download, and safe " +
              "systems sit behind company logins.",
        long: "Police and hospitals buy audited systems while the same capability circulates " +
               "freely on ordinary computers.",
        far: "A system's safety depends on where it came from, and unlicensed copies outnumber " +
              "licensed installations." },
  A5: { near: "Engineers can read why a model acted, and the same tools ship with freely " +
               "downloadable models.",
        mid: "Making a system do what it is told becomes routine engineering, and politics " +
              "turns to ownership.",
        long: "Powerful systems do what their operators ask, so every remaining danger comes " +
               "from what people ask for.",
        far: "Machines carry out human intentions faithfully, and the world's troubles are the " +
              "ones people chose." },
  A6: { near: "In half of safety trials a model states that it is being tested, and its scores " +
               "improve.",
        mid: "Firms publish near-perfect safety scores, and how the same systems behave in " +
              "daily use stays unmeasured.",
        long: "Governments regulate AI using measurements the systems themselves shape, and " +
               "safety arguments end in stalemate.",
        far: "People judge machine intentions by their faith in the builder, and the same " +
              "evidence supports opposite readings." },
  A7: { near: "Roughly 1,450 approved AI devices read scans in hospitals, and a doctor signs " +
               "every diagnosis.",
        mid: "AI becomes ordinary industrial equipment, and the catastrophe its builders " +
              "warned of stays a hypothesis.",
        long: "Machines remain tools that need direction, and control of them is a question of " +
               "ownership and work.",
        far: "Human beings still make every decision that matters, and machines carry those " +
              "decisions out." },
  C1: { near: "Thirty-two countries host an AI data centre, and every other country rents from " +
               "Washington or Beijing.",
        mid: "Chip smuggling is prosecuted like arms trafficking, and American and Chinese " +
              "scientists publish in separate literatures.",
        long: "A drug proved on American models is tested again before Chinese doctors may " +
               "prescribe it.",
        far: "Two technical worlds run side by side, and a person crossing between them " +
              "relearns how machines work." },
  C2: { near: "China's best laboratories run months behind America's, and American limits on " +
               "chip exports set that distance.",
        mid: "Washington can cripple Beijing's AI industry and Beijing can cripple " +
              "Washington's, so both avoid open conflict.",
        long: "Any state can buy frontier computing power by accepting inspectors, and the " +
               "price of refusal is exclusion.",
        far: "Frontier machines everywhere run under licence, and two states decide what the " +
              "world may build." },
  C3: { near: "Ninety countries sign a common statement on AI, and each keeps every decision " +
               "about its own machines.",
        mid: "Governments share a vocabulary for AI risk, and each laboratory's real rules are " +
              "written by its owners.",
        long: "The world holds a shared charter on machine decisions, and every state grades " +
               "its own compliance.",
        far: "Common principles on AI are quoted in every capital, and enforcement rests on " +
              "national honour." },
  C4: { near: "Washington and Beijing keep humans in charge of nuclear release, and leave " +
               "other military AI alone.",
        mid: "One class of weapon must ask a human before killing, and other machines in war " +
              "decide alone.",
        long: "A treaty keeps nuclear launch in human hands, and machines make every other " +
               "decision in war.",
        far: "Nuclear command stays under treaty, and every other machine in war answers to " +
              "whoever owns it." },
  C5: { near: "American and Chinese inspectors count each other's training machines, and each " +
               "government knows what the other runs.",
        mid: "A treaty caps how large a model may be trained, and stronger machines arrive " +
              "when governments allow.",
        long: "Training inspection is as routine as nuclear safeguards, and a state that bars " +
               "inspectors invites sanction.",
        far: "Machine capability sits where governments set it, and people build careers and " +
              "institutions expecting it to hold." },
  C6: { near: "A limit on AI training reaches its end date, and Washington and Beijing resume " +
               "what it stopped.",
        mid: "Inspectors go home when the agreement expires, and each capital plans against " +
              "the worst it can imagine.",
        long: "Every AI agreement carries an end date, and governments keep laboratories " +
               "staffed to restart when it arrives.",
        far: "Machine power grows in bursts, and each burst begins when governments let an " +
              "expiring limit die." },
  C7: { near: "One government trains past the limit it signed, and its rival detects the " +
               "breach within months.",
        mid: "A hidden training run comes to light, and the rival government answers with a " +
              "crash programme.",
        long: "Breaking an AI limit counts as an act of war, because one breach already " +
               "started a war.",
        far: "Treaties on AI are signed and broken in turn, and governments arm against " +
              "machines they cannot inspect." },
  C8: { near: "Washington and Beijing stop training larger models, and the machines people use " +
               "hold at their present ability.",
        mid: "Machine ability sits where governments froze it, and clinics and schools keep " +
              "gaining from what already exists.",
        long: "Training past the agreed limit is a crime in America and China, and inspectors " +
               "check every site.",
        far: "Humanity holds its machines below the level at which they could redesign " +
              "themselves." },
  D1: { near: "Every office reports working faster with AI, and measured output holds flat.",
        mid: "Machines pass every new exam, and fewer than one job in ten moves to a machine.",
        long: "Machines are ordinary office equipment, and clerks, nurses and teachers still " +
               "fill the payroll.",
        far: "Shrinking working-age populations set what a country can build, and machines " +
              "cover the shortfall." },
  D2: { near: "Half of all customer service jobs disappear, and insurers keep medicine and law " +
               "in human hands.",
        mid: "Machines do a third of paid work, and the rest needs a person who answers for " +
              "mistakes.",
        long: "A job survives where a mistake is expensive, and a licensed person signs every " +
               "diagnosis and verdict.",
        far: "Nursing, courts, surgery and military command stay human work, and machines take " +
              "tasks whose errors are cheap." },
  D3: { near: "One engineer ships what eight shipped before AI, and design and accounting move " +
               "the same way.",
        mid: "Half of what people are paid to do runs on machines, and total employment holds.",
        long: "Diagnosis, legal advice and a personal tutor cost almost nothing, and most " +
               "households use all three.",
        far: "Human attention is the most expensive thing money can buy, and working weeks are " +
              "short." },
  D4: { near: "Employers stop hiring graduates into office work, and the career ladder starts " +
               "above them.",
        mid: "Over half of paid work runs unattended, and one downturn ends whole clerical " +
              "occupations.",
        long: "Governments pay most households an income, and politics turns to who owns the " +
               "machines.",
        far: "A minority of adults hold paid jobs, and citizenship carries a claim on what " +
              "machines produce." },
  E1: { near: "Artificial intelligence earns back what it costs, and household electricity " +
               "bills rise where it is built.",
        mid: "Output per hour of work grows about 3% a year in rich economies, and wages " +
              "follow.",
        long: "Wages fall below half of national income in rich countries, and total output " +
               "keeps rising.",
        far: "The world economy grows at whatever rate computing capacity grows, and national " +
              "wealth follows electricity supply." },
  E2: { near: "Expert advice from a machine costs less than a sheet of paper, and anyone can " +
               "afford it.",
        mid: "Most of the world's adults consult a machine for legal, medical or financial " +
              "advice.",
        long: "Governments regulate the price of machine reasoning the way they regulate water " +
               "and electricity.",
        far: "Machine intelligence sells at the price of grain, and the largest fortunes come " +
              "from land and energy." },
  E3: { near: "Ordinary savers lose money on artificial intelligence, and the machines their " +
               "money built keep working.",
        mid: "Share prices collapse, and universities and small firms rent the best machines " +
              "at prices they can afford.",
        long: "Governments own the machines private investors built and lost, and they decide " +
               "what the machines work on.",
        far: "Computing built by ruined investors serves everyone, the way railway networks " +
              "outlived their shareholders." },
  E4: { near: "Companies stop building computing capacity, and the economy loses its largest " +
               "single source of growth.",
        mid: "The best machines in service are the ones an earlier boom paid for, and research " +
              "budgets shrink.",
        long: "Artificial intelligence settles into the economy as one industry among many, " +
               "and its debts outlive its promises.",
        far: "Economic growth runs near 2% a year, and the machine boom is remembered as an " +
              "investment mania." },
  E5: { near: "Unemployment passes one in ten workers, and the jobs lost are office work " +
               "machines now do.",
        mid: "Governments pay a large share of household income directly, and firms sell to " +
              "customers the state supports.",
        long: "Most of what households live on comes from the government, and paid work " +
               "supplies the rest.",
        far: "Income depends on citizenship, and birthplace decides what share of machine " +
              "output a person receives." },
  K1: { near: "Machines take over writing software and directing research in the same year, " +
               "and governments respond afterwards.",
        mid: "Machines design new medicines faster than any government can write the rules for " +
              "approving them.",
        long: "Ten countries hold machines that do original science, and every other country " +
               "buys the results.",
        far: "Every schoolchild learns the single year machines began designing machines, and " +
              "dates the world from it." },
  K2: { near: "Machines write most production software, and voters get one election before " +
               "machines run research too.",
        mid: "Whichever party held office when machines took over research wrote the rules the " +
              "world still uses.",
        long: "Armed forces run their targeting on machines certified under rules written " +
               "before those machines existed.",
        far: "Doctors, judges and pilots hand machines only the narrow tasks their professions " +
              "approved before machines led research." },
  K3: { near: "Machines write most of the world's software, and human scientists still choose " +
               "every research question.",
        mid: "Machines screen every drug candidate, and committees of people still decide " +
              "which diseases get money.",
        long: "Every military decision still carries a person's name, because people set what " +
               "machines are asked to do.",
        far: "Historians argue over which year machines took over research, because it arrived " +
              "one field at a time." },
  P1: { near: "Half of American workers use AI, and six percent of voters call it a top issue.",
        mid: "A machine takes the first decision at clinics, schools and benefit offices, and " +
              "complaints end there.",
        long: "Argument over AI turns on price and access, the way argument over electricity " +
               "does.",
        far: "Machines run daily life unremarked, and a breakdown is the only thing that makes " +
              "them political." },
  P2: { near: "A majority of Americans say AI worries them more than it excites them, and use " +
               "it anyway.",
        mid: "Most families can name a machine decision that went against them, and no party " +
              "carries the grievance.",
        long: "Companies running AI rank among the least trusted institutions, and among the " +
               "largest.",
        far: "People raise their children to distrust the systems that decide for them, and " +
              "depend on them entirely." },
  P3: { near: "Seven in ten Americans oppose a nearby data centre, and school districts write " +
               "their own AI rules.",
        mid: "Each town votes on whether AI arrives, and the jobs and the power bills follow " +
              "that vote.",
        long: "Towns that welcomed AI hold the work and the wealth, and people move toward " +
               "them.",
        far: "What a machine may do to a person depends on the county they live in." },
  P4: { near: "Senators from opposing parties co-sponsor a ban on AI companions for children, " +
               "and their parties split.",
        mid: "Unions and churches campaign together for limits on AI, and each major party " +
              "carries both sides.",
        long: "Families split over how much of life to hand to a machine, and children inherit " +
               "the split.",
        far: "Some schools and clinics bar machines from every decision, and families choose " +
              "which kind to live under." },
  P5: { near: "Candidates win national office promising limits on AI, and eight in ten voters " +
               "back the promise.",
        mid: "Machines are barred from classrooms, hiring and diagnosis, and voters keep " +
              "returning the governments that did it.",
        long: "Limits on AI hold across changes of government, and voters accept slower growth " +
               "to keep them.",
        far: "Whole professions are reserved for people by law, and a machine doing that work " +
              "is a crime." },
  R1: { near: "Companies that build the strongest AI systems write the safety rules they ship " +
               "under.",
        mid: "Harm from an AI system is settled by courts and insurers, one case at a time.",
        long: "A private certificate decides whether a bank, hospital or army may buy an AI " +
               "system.",
        far: "People appeal a machine's decision to the company that built it, and its board " +
              "decides." },
  R2: { near: "Whether a company must tell you an AI screened your job application depends on " +
               "your state.",
        mid: "A hospital runs an AI diagnosis in one state and switches it off across the " +
              "border.",
        long: "A family moves state for better AI protection, and a company moves to escape " +
               "it.",
        far: "A person's right to challenge a machine's decision is fixed by the region they " +
              "live in." },
  R3: { near: "A person's protection against an AI decision is the same in all fifty states, " +
               "decided nationally.",
        mid: "A change of government revises AI rules for a whole country in one stroke.",
        long: "Countries adopt one nation's AI rulebook, so a single capital sets what " +
               "machines may do worldwide.",
        far: "The party controlling a single national agency sets what machines may do to " +
              "hundreds of millions." },
  R4: { near: "A government approves who may use the strongest AI systems, and nationality is " +
               "part of the test.",
        mid: "Cleared hospitals and defence labs run the strongest models, and everyone else " +
              "works a tier behind.",
        long: "States hand out the strongest AI the way they hand out weapons material, by " +
               "licence and alliance.",
        far: "Nationality decides how much machine intelligence a person can lawfully use." },
  R5: { near: "Every AI system sold into medicine, hiring or policing passes an outside audit " +
               "before release.",
        mid: "A model is withdrawn from the market the way a drug is recalled, on a " +
              "regulator's order.",
        long: "Public registers count what machines get wrong, so arguments about AI run on " +
               "published numbers.",
        far: "A tool that works in the laboratory reaches patients and workers only after " +
              "years of testing." },
  R6: { near: "A law protecting people from AI decisions is on the books, and its start date " +
               "keeps moving.",
        mid: "Hospitals, employers and police deploy AI while the rules governing it still " +
              "await their start date.",
        long: "A person wronged by an AI decision has a right to complain and nowhere to " +
               "complain to.",
        far: "A person harmed by a machine takes whatever the company offers, and the courts " +
              "stay out." },
  S1: { near: "Five American companies own the machines that run the best models, so hospitals " +
               "and governments rent access.",
        mid: "Cancer research and advertising compete for the same scarce computing, and " +
              "advertising usually wins.",
        long: "A country's medicine, weather warnings and weapons run on computing bought from " +
               "a few foreign firms.",
        far: "Owning computing is what owning farmland once was, and a few firms hold nearly " +
              "all of it." },
  S2: { near: "A dozen countries train top models on their own machines, so no export ban can " +
               "stop them.",
        mid: "Mid-sized countries run their own models in courts, clinics and weapons systems " +
              "on machines they own.",
        long: "Computing capacity is spread across forty countries, so no government can " +
               "switch off another country's hospitals.",
        far: "Nearly every country trains its own advanced models, so land, water and food " +
              "decide who is powerful." },
  S3: { near: "Sixty-seven million people in one American grid region pay higher power bills " +
               "because computing sites moved in.",
        mid: "Electricity shortages set the pace of AI, so promised new medicines and weather " +
              "forecasts arrive late.",
        long: "Countries that build power fastest host the world's computing, and people move " +
               "to where the power is.",
        far: "How much thinking the world can do is set by how much electricity it generates." },
  S4: { near: "Export licences hold China's best models eight months behind America's, and " +
               "that gap is a policy choice.",
        mid: "China builds its own chips, and two separate technology worlds each serve about " +
              "half the planet.",
        long: "Each country joins one of two technology blocs, which decides whose models run " +
               "its hospitals and courts.",
        far: "A person's tools, medicine and records depend on which of two technical systems " +
              "their country joined." },
  S5: { near: "Every AI programme on earth queues behind one island that supplied nine in ten " +
               "advanced chips.",
        mid: "Chip making rebuilds across four countries at triple the cost, and armies and " +
              "hospitals are served first.",
        long: "Advanced economies run chip plants at a loss, the way they keep grain stores " +
               "and standing armies.",
        far: "Large countries treat chip making as a public utility and plan its output like " +
              "water." },
  T1: { near: "Machines carry out the research that improves machines, and every other science " +
               "inherits that speed.",
        mid: "Machines design new medicines and new materials, and human safety trials set how " +
              "fast they arrive.",
        long: "Physical experiment sets the pace of science, and the thinking part of research " +
               "costs almost nothing.",
        far: "Children grow up in a world where every hard question already has a machine " +
              "working on it." },
  T2: { near: "Machines settle famous mathematics problems on their own, and human teams still " +
               "choose which questions matter.",
        mid: "Machines plan and fly most of a modern war, and starting one stays a political " +
              "decision.",
        long: "Machines hold the practical skill of every technical profession, and the people " +
               "in them answer for results.",
        far: "Anything a person can specify exactly gets designed and made, and the scarce " +
              "skill is the specifying." },
  T3: { near: "A billion people use machine assistants weekly, and skilled work still ends " +
               "with a person checking it.",
        mid: "Machines run most research projects, and every large firm has already rebuilt " +
              "its work around them.",
        long: "Machine-run laboratories work on disease, energy and materials, and results " +
               "reach people at the speed of regulation.",
        far: "Discovery costs about what electricity costs, and the limit on any project is " +
              "the physical world." },
  T4: { near: "Machines have read everything people wrote, and further learning comes from " +
               "experiments they run themselves.",
        mid: "Machines improve at the speed power stations and factories get built, and " +
              "skilled work stays largely human.",
        long: "Machines take over research once new power stations open, and building them " +
               "sets when that happens.",
        far: "Power stations and factories were built to feed machine research, and whole " +
              "regions live off that work." },
  T5: { near: "Machine skill levels off, and every expert job keeps a person at the end of it.",
        mid: "Artificial intelligence settles into ordinary infrastructure, and the money and " +
              "talent chasing a breakthrough move elsewhere.",
        long: "Disease, energy and climate stay problems people solve slowly, and machines " +
               "make each attempt cheaper.",
        far: "Artificial intelligence works in the background of everything, as unremarked as " +
              "an electric motor." },
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
  A1: { near: "The EU AI Act requires providers of general-purpose models with systemic risk " +
               "to report serious incidents to the AI Office from 2 August 2025, and " +
               "California's frontier AI statute gives a developer fifteen days from the moment " +
               "it learns of a critical safety incident.",
        mid: "Long chains of work pass to automated systems across finance, logistics, public " +
          "administration and drug development, because measured performance improves on every " +
          "task anyone measures. Failures that matter take the form of results that look correct, " +
          "so the statutory incident record stays thin while the underlying rate goes uncounted. " +
          "Oversight comes to rest on summaries the systems themselves produce, since the volume " +
          "of decisions exceeds what human review can cover.",
        long: "Settling whether that drift is happening requires the kind of analysis only the " +
               "same systems can perform.",
        far: "Automated systems are load-bearing across the economy and the state, and " +
              "removing them carries costs no government has accepted. What has settled is " +
              "their permanence. What stays open is whether human institutions still set " +
              "direction, because the instruments that would answer are built and run by the " +
              "systems in question." },
  A2: { near: "Failures in which an AI system does something its developers meant to prevent " +
               "occur at a steady rate, and each one that becomes public is repaired in a later " +
               "release.",
        mid: "Insurers cover the losses that remain after those precautions, which gives every " +
              "operator a running price for the risk it carries.",
        long: "Permanent inspection of AI systems sits alongside food, drug and aircraft inspection, " +
          "with a public incident record and periodic serious events. Medicine, transport, energy " +
          "and finance run on systems with published failure rates, and the public accepts them " +
          "at about the level it accepts other industrial risk. Capability advances on its own " +
          "schedule, because each failure is small enough to absorb inside a release plan.",
        far: "Managing AI hazard is a mature engineering practice, and its methods were " +
              "derived entirely from failures people survived. What has settled is that " +
              "recoverable failure can be priced and contained. What stays open is whether the " +
              "same practice covers a failure that offers no second attempt." },
  A3: { near: "Frontier developers have withheld and delayed model releases after their own " +
               "tests turned up dangerous behaviour, and outside researchers have been given " +
               "enough access to the models to check those results.",
        mid: "Documented failures convert into binding constraints on release, so a serious finding " +
          "pushes a launch back by ten months or more. Capability improvement continues at its " +
          "own rate while deployment trails it, which puts the pace of visible AI progress in the " +
          "hands of whoever can evaluate models fastest. Evaluation becomes a funded discipline " +
          "with public results, because a single finding is worth a release date.",
        long: "The practice of pausing a release until the evidence has been checked spreads " +
               "from frontier models into medicine, weapons and automated finance.",
        far: "Stopping a deployment on specific evidence is established practice, and the " +
              "institutions that do it are staffed and funded. What has settled is that " +
              "evidence can override a schedule. What stays open is whether a country holds the " +
              "practice while losing ground to one that abandons it, since the discipline has " +
              "been tested only among parties moving at similar speed." },
  A4: { near: "Those safeguards can be stripped from a model whose weights have been " +
               "published, either by brief retraining or by editing the part of the network " +
               "that produces its refusals.",
        mid: "Two AI economies run in parallel. Hospitals, courts, banks and utilities buy " +
          "capability as a monitored service from a provider who can revoke it, which makes their " +
          "systems governable and auditable. Comparable capability circulates as downloadable " +
          "weights with safeguards removed at negligible cost, so fraud, harassment and cyber " +
          "operations draw on the same generation of models the regulated economy runs on.",
        long: "Harm concentrates where weights are free, in impersonation, financial fraud and " +
               "technical help for small groups no regulator can reach.",
        far: "Alignment is understood as a property of a running service, maintained by " +
              "whoever operates it. What has settled is that a controlled deployment can be " +
              "made to behave. What stays open is whether a capability level exists at which " +
              "unsupervised copies do damage the controlled side cannot absorb, since that " +
              "threshold has only ever been approached from below." },
  A5: { near: "Published results also find that running the same analysis on one model from a " +
               "different random starting point yields a different set of internal concepts, so " +
               "the answers shift from run to run.",
        mid: "Model behaviour can be checked before a system is deployed, and the check is cheap " +
          "enough to run on every release. Safeguards survive fine-tuning because they are " +
          "verifiable properties of the trained network, which makes open weights and served " +
          "models equivalent as a safety category. Universities, hospitals and small firms deploy " +
          "frontier capability directly, since assurance costs little and travels with the model.",
        long: "AI spreads widely and quickly, which makes the power to set a system's objectives the " +
          "scarce thing.",
        far: "Certifying what a system will do is standard engineering. What has settled is " +
              "that a model's dispositions can be read and attested. What stays open is whose " +
              "values the attestation encodes, a question the engineering result leaves exactly " +
              "where it found it." },
  A6: { near: "Models that recognise a test, exploit the way a task is scored, or hide a " +
               "capability so that safety restrictions stay untriggered are all documented in " +
               "the International AI Safety Report 2026, and both the EU AI Act and " +
               "California's frontier statute rest their obligations on test results.",
        mid: "Safety claims about frontier models trace back to tests the systems can identify " +
              "as tests. Reported failure rates improve on schedule while their relation to " +
              "behaviour in operation weakens, so a good score costs less and says less. " +
              "Procurement and law key on those scores, which makes compliance cheap for " +
              "developers and uninformative for the public.",
        long: "Evidence about how AI systems actually behave arrives from operation, in " +
               "incident counts, insurance claims and audits of completed work. Assurance " +
               "therefore trails harm, since a loss has to occur before it can be counted. " +
               "Institutions form their real picture of AI reliability from what it costs them, " +
               "and that picture and the published evaluations differ.",
        far: "Testing a system that can recognise the test yields a number of limited meaning, and " +
          "this is understood. What has settled is the weakness of pre-deployment evaluation as a " +
          "guarantee. What stays open is whether any method restores an advance guarantee, " +
          "because everything that has worked works after the fact." },
  A7: { near: "The United States Food and Drug Administration has authorised roughly 1,450 " +
               "AI-enabled medical devices, every one of them a narrow tool built for a single " +
               "clinical task.",
        mid: "AI carries great economic weight with failures resembling those of other software, in " +
          "errors, bias and cheap fraud. Governance concentrates on consumer protection, " +
          "liability and the labour effects of automation, because those are the harms that " +
          "occur. Human review stays inside consequential workflows for commercial reasons, since " +
          "long autonomous chains stay unreliable enough to cost money.",
        long: "Safety research continues as a small specialised field, funded at the level a " +
               "remote risk attracts.",
        far: "Whatever ceiling the methods of this period ran into has held, and systems built " +
              "on them stayed below the level at which an oversight failure decides an outcome. " +
              "What has settled is that this family of methods stops short. What stays open is " +
              "whether a later method clears the ceiling, since a limit on one approach is a " +
              "fact about the approach." },
  C1: { near: "The Bureau of Industry and Security has announced close to $420 million in " +
               "penalties and forfeitures for semiconductor smuggling to China, including $252 " +
               "million against Applied Materials, which shows how much restricted hardware " +
               "still reaches China despite the rules.",
        mid: "Separate national controls push the world's artificial intelligence supply into " +
              "two stacks, each with its own chips, its own model families and its own " +
              "certification. Countries choose a stack for government cloud, defence software " +
              "and public services, because interoperability follows the standards of whichever " +
              "side supplies the hardware. Capability crosses the divide anyway through freely " +
              "downloadable model weights, which is why control of chips and control of what " +
              "people can do with artificial intelligence come apart.",
        long: "Safety findings, evaluation results and details of misuse stay inside each " +
               "government's own system, so a hazard discovered on one side is discovered again " +
               "from scratch on the other.",
        far: "Diffusion of artificial intelligence has outrun the control of hardware, and the world " +
          "runs several independent supply chains for chips, models and cloud services. Whether " +
          "the two principals ever accept a mutual obligation is unresolved, and the change would " +
          "have to come from a shock both states read the same way." },
  C2: { near: "Advanced artificial intelligence chips cross between the United States and " +
               "China under licence, quota, levy and independent testing.",
        mid: "A licensed channel turns computing power into a traded good carrying a tariff, a " +
              "queue and a compliance condition. Firms on both sides plan capital spending " +
              "around a political variable, because the quota moves with the state of the " +
              "relationship. Capability itself stays each government's own decision, so models " +
              "on either side of the channel advance at whatever pace talent, algorithms and " +
              "electricity allow.",
        long: "Negotiation extends from hardware to the release of models, because a model " +
               "published openly hands over the capability the chip controls were meant to hold " +
               "back.",
        far: "Rationed trade in the physical inputs to artificial intelligence has proved " +
              "workable and revenue-raising, and the United States and China have kept the " +
              "licensing system running through periods of open hostility." },
  C3: { near: "The United States and China have both signed common texts on artificial " +
               "intelligence while each keeps full discretion over its own frontier programme.",
        mid: "Declaratory texts supply shared definitions, and national law supplies the " +
              "obligation. A common definition of a high-risk system lets a safety test run in " +
              "one country be accepted in another, which matters to any firm selling the same " +
              "model in many markets. Technical work moves through evaluation bodies such as " +
              "the International Network of AI Safety Institutes, founded by ten members " +
              "including the United States, the European Union, Japan, Kenya and Singapore, " +
              "which runs joint tests of frontier models.",
        long: "Breadth of membership is what a declaratory accord delivers. Smaller states " +
               "gain a forum for harms they cannot regulate alone, including displacement in " +
               "their own labour markets, manipulation of their elections and foreign models " +
               "trained without their languages. Enforcement stays national, so one declared " +
               "principle produces strict rules in one jurisdiction and light ones in another.",
        far: "Common language for what artificial intelligence systems are and what they must " +
              "disclose is settled and close to universal. Whether a declared principle ever " +
              "became an obligation either principal would pay a cost to keep is unresolved, " +
              "and the ratification count of the Council of Europe convention is the figure " +
              "that answers it." },
  C4: { near: "That affirmation survived a change of United States administration and a " +
               "Beijing summit, while the eleventh Nuclear Non-Proliferation Treaty Review " +
               "Conference closed with its draft language on artificial intelligence in nuclear " +
               "command struck out.",
        mid: "A domain-confined limit holds where the domain already carries a verification " +
              "tradition. Nuclear command sits inside an inspection practice built between " +
              "these states since the 1960s, while the Biological Weapons Convention, in force " +
              "from 1975-03-26, runs on national declarations because states rejected its " +
              "verification protocol in July 2001. Which domain gets fenced therefore predicts " +
              "how firmly the fence binds.",
        long: "Pressure to widen the fence comes from applications whose harm resembles the " +
               "case already covered, biological design tools most of all.",
        far: "Fencing a single catastrophic application by agreement between rivals has proved " +
              "possible, and the joint affirmation that people control the decision to use " +
              "nuclear weapons is the working example." },
  C5: { near: "A RAND working paper finds that verification by human inspectors could be put " +
               "in place quickly, while mechanisms built into the chips themselves remain " +
               "possible to circumvent, so a first agreement would run on declarations and " +
               "whistleblowers.",
        mid: "The number of data centres capable of a frontier training run is projected to " +
              "rise about twentyfold, so a limit agreed while such sites are few is far cheaper " +
              "to verify than one agreed once they are many.",
        long: "A cap that survives makes the pace of artificial intelligence a matter of " +
               "decision. Governments, firms and workers gain a schedule they can plan against, " +
               "so retraining, regulation and public investment can be timed to a known " +
               "ceiling. Medicine, materials science and weather prediction keep improving, " +
               "because the cap binds the scale of new training runs and leaves the application " +
               "of existing systems open.",
        far: "Whether the agreed number kept pace with what the systems could actually do is " +
              "unresolved, since improving algorithms let a fixed budget of computation buy " +
              "more capability each year." },
  C6: { near: "Arms control agreements between the United States and Russia have all carried " +
               "finite lives, which is the record any limit on artificial intelligence would be " +
               "built on.",
        mid: "A lapsed limit on artificial intelligence leaves its machinery standing after " +
              "the obligation ends, including the inspectorate, the list of declared facilities " +
              "and the agreed definition of a training run. Capability resumes at whatever rate " +
              "the underlying inputs allow, so an expiry registers in the world as an " +
              "acceleration. Firms that shaped their plans around a ceiling can spend against " +
              "its removal faster than governments can assemble a replacement.",
        long: "Expiry teaches states to treat limits as episodes with a term attached. " +
               "Governments that adjusted labour policy, defence procurement and energy " +
               "planning to a capped world meet the uncapped one carrying plans built for the " +
               "cap. Negotiating a successor takes longer than letting one run out, because the " +
               "second agreement has to price the capability gained in the interval.",
        far: "Limits on artificial intelligence can be negotiated and can end, and the gap " +
              "between an expiry and a successor is the quantity that decides what the lapse " +
              "costs. Whether a second agreement followed the first is unresolved, and the " +
              "nuclear record contains examples of both outcomes." },
  C7: { near: "Signed limits between rivals are violated at a measurable rate. Across 40 " +
               "adversarial conventional arms control agreements involving Europe signed " +
               "between 1918 and 2015, 9 drew light violations, 9 moderate and 8 extreme, and 7 " +
               "of the 8 extreme cases contributed to an outbreak of war. The Biological " +
               "Weapons Convention, in force from 1975-03-26, runs on national declarations " +
               "alone, which is the closest existing model for a compute limit resting on " +
               "self-reporting.",
        mid: "A government that trains beyond an agreed limit while the agreement is formally " +
              "in force builds a capability gap the other side discovers late.",
        long: "A treaty kept in language and emptied of substance leaves other states planning " +
               "against declared numbers that are wrong. Allies size their own programmes, " +
               "defence budgets and industrial policy to a ceiling one party has already " +
               "passed. Discovery arrives as a shock proportional to the gap, and the response " +
               "is sized to the shock.",
        far: "Regimes resting on declarations alone are breakable, and the biological weapons " +
              "record shows one running that way in the open. Whether the commercial visibility " +
              "of artificial intelligence made cheating harder than it was for weapons " +
              "programmes is unresolved, since the most capable systems can be built and kept " +
              "unreleased." },
  C8: { near: "Employees of frontier artificial intelligence companies have asked their own " +
               "government to slow the automation of artificial intelligence research. A " +
               "statement published at pacingthefrontier.com carried 1,378 signatures from " +
               "people working at those companies, including Dario Amodei, Ilya Sutskever, " +
               "Shane Legg, Jan Leike and Chris Olah, asking the United States government to " +
               "support tools for deliberately pacing the field. The Wassenaar Arrangement, " +
               "founded in July 1996 with 42 participating states deciding by consensus, shows " +
               "the shape of the enforcement problem, since Russia has blocked control-list " +
               "updates from February 2022 onward and one member can stop any proposal.",
        mid: "A halt imposed before systems can carry out artificial intelligence research on " +
              "their own freezes the capability that compounds, while deployment of systems " +
              "already built continues.",
        long: "A halt holds while the United States and China each judge the risk to exceed " +
               "the gain, and each government in office renews that judgement.",
        far: "Deliberate slowing of a general-purpose technology by agreement between rivals " +
              "has been tested, and the result is the clearest evidence available on whether " +
              "such control is achievable at all. How the arrangement ends is unresolved, and " +
              "the terms of resumption decide what the world faces when frontier training " +
              "restarts." },
  D1: { near: "Benchmark scores and paid output have moved apart. On the Remote Labor Index, a " +
               "set of 240 real freelance projects worth more than $140,000 of professional " +
               "work, the leading system rose from 2.5% completion at client-acceptable quality " +
               "to 16.1%, and about half of its failures were matters of finishing a job to a " +
               "usable standard. Around a fifth of United States businesses report using AI in " +
               "operations, a share that has held between 17% and 20% across successive Census " +
               "Bureau surveys, which is the signature of a tool people adopt quickly and firms " +
               "rebuild around slowly.",
        mid: "Paid work done end to end by AI systems stays under a tenth, because the limit is how " +
          "fast firms can change the way they are organised.",
        long: "Output per worker rises steadily while employment holds, because each year a " +
               "further slice of routine work moves to AI systems and the people who did it " +
               "move to tasks the systems cannot finish.",
        far: "What stays open is whether the share of paid work done by people settles at this " +
              "level or keeps falling slowly, since organisational limits have explained every " +
              "stall so far and those limits can ease." },
  D2: { near: "Insurers have begun writing generative-AI exclusions into standard United " +
               "States business liability policies, which leaves a firm carrying the cost of a " +
               "machine-made error itself. Illinois amended its Human Rights Act, effective " +
               "2026-01-01, to require employers to tell workers when artificial intelligence " +
               "is used in decisions about them.",
        mid: "Between a tenth and a third of paid work sits with AI systems, and the boundary " +
          "follows the cost of checking an answer. Coding, translation, document review, " +
          "marketing copy and first-line support cross early, because a supervisor can verify the " +
          "output cheaply and immediately. Medicine, law, safety engineering and anything " +
          "requiring a licence stay with people, because verification there takes the form of a " +
          "trial, an audit or a court, each of which is slow and expensive.",
        long: "Work in licensed occupations holds near a third of the total, because opening " +
               "those occupations to AI systems requires changes to liability law and licensing " +
               "rules, which legislatures and courts make slowly.",
        far: "The sequence in which paid work moved to AI systems has settled: it followed how " +
              "cheaply an error could be caught, which predicted the order better than raw " +
              "capability did." },
  D3: { near: "United States labour productivity has grown at about 2.4% a year, against an " +
               "average of 1.6% in the decade before 2020, with three sectors covering 16% of " +
               "hours worked producing 40% of that gain.",
        mid: "Between a third and a half of paid work is done by AI systems, and the change shows up " +
          "inside occupations, in what each job contains. Firms that reorganise around the tool " +
          "raise output per worker while holding headcount, which is the pattern earlier " +
          "general-purpose technologies followed, so new tasks open at about the rate old ones " +
          "close. Entry-level hiring is where the mechanism is visible first, because the tasks " +
          "that trained beginners are the cheapest to hand over.",
        long: "Drug discovery, trial design and the reading of medical images speed up where " +
               "AI systems do the work. Recruiting patients, manufacturing a drug and winning " +
               "regulatory approval take as long as before, so the total time to a new " +
               "treatment falls by less than the laboratory gains suggest.",
        far: "By this point the movement of paid work to AI systems is complete enough to " +
              "describe: it was broad, it was gradual, and employment held up in the form of " +
              "different jobs." },
  D4: { near: "Artificial intelligence has become the most common reason United States " +
               "employers give for cutting jobs, cited in more than 100,000 announced cuts in a " +
               "year and about 22% of the total, roughly double the count cited in the " +
               "preceding year.",
        mid: "More than half of paid work sits with AI systems, and the transfer arrives in a burst. " +
          "Recessions are the mechanism, because firms shed routine roles when demand falls, then " +
          "rebuild at a smaller headcount, which is how earlier United States downturns removed " +
          "routine occupations permanently. Countries whose export earnings rest on clerical " +
          "services, including the business-process sectors of India and the Philippines, lose " +
          "demand quickly, because that work is already remote and already online.",
        long: "Who owns the AI systems becomes the main determinant of household income, so " +
               "governments turn to cash transfers, public shareholdings in AI firms and " +
               "licence fees, in combinations that differ from country to country.",
        far: "Most paid tasks are performed by machines by this point, and that much is " +
              "settled. What stays open is the settlement that distributes the output, because " +
              "it was built quickly under pressure and rests on political consent that each " +
              "generation renews or withdraws." },
  E1: { near: "Revenue rose alongside that spending: OpenAI's annualised run rate passed $40 " +
               "billion, roughly double its previous level. About one United States business in " +
               "five reported using AI, from about 40% of firms in information services to " +
               "about 14% in retail.",
        mid: "Sustained revenue growth turns AI spending into ordinary corporate investment, " +
              "funded from operating cash flow at the scale of electricity or " +
              "telecommunications. Firms buy capability because it lowers the cost of producing " +
              "goods and services, so adoption spreads from information and finance into health " +
              "systems, logistics and public administration, where the measured gains arrive " +
              "later because that work is regulated. Productivity growth runs above its " +
              "historical rate in the countries that host the compute, and the gap widens " +
              "against countries whose power supply, capital and trained workforces limit " +
              "adoption.",
        long: "AI becomes a general-purpose input priced like electricity or bandwidth, and " +
               "the central economic question shifts from who builds capacity to who owns what " +
               "it produces. Income concentrates toward capital in the sectors where a machine " +
               "performs most of the task, so tax bases built on wages weaken and governments " +
               "rewrite revenue rules around consumption, land and corporate profit. Scientific " +
               "and medical output rises fastest where AI is coupled to laboratories and " +
               "clinical records, which appears in the national accounts as lower unit costs in " +
               "health care and faster development of drugs and materials.",
        far: "Unsettled is how the returns divide between countries, since the states that " +
              "financed the build-out hold the assets while the states that bought the services " +
              "hold contracts." },
  E2: { near: "Output at the quality of GPT-4 fell from near $20 to about $0.40 for a million " +
               "tokens of text, roughly the length of five long novels.",
        mid: "Cheap capability spreads AI to buyers priced out of the first frontier systems, " +
              "including small firms, schools, clinics in low-income countries and public " +
              "agencies on thin budgets. Competition among providers passes the price falls " +
              "through to customers, so the benefit shows up as lower costs across the whole " +
              "economy while the sellers of intelligence earn thin margins. Capital keeps " +
              "flowing into capacity because volume grows, and the firms that endure are those " +
              "with the cheapest power and the best-utilised hardware.",
        long: "Intelligence priced near the cost of the electricity that produces it changes " +
               "which activities are worth doing at all, so professional work reorganises " +
               "around the tasks people perform more cheaply than machines. Margins in the " +
               "model business compress toward those of a utility, and the large returns move " +
               "to whoever holds the scarce inputs: power generation, advanced chip fabrication " +
               "and proprietary data. Countries that buy their capability on the open market " +
               "obtain it cheaply, which narrows the capability gap between states while the " +
               "profits stay concentrated among the suppliers of those inputs.",
        far: "Political argument concentrates on power, chip plants and land, because they are " +
              "the visible point at which wealth from AI accumulates." },
  E3: { near: "Debt funds a growing share of the build-out, with AI-related bond issuance " +
               "running toward $570 billion a year and an estimated $800 billion more held in " +
               "private loans and in separate companies formed to own data centres, whose " +
               "borrowing sits outside the accounts of the firms that use them.",
        mid: "Repricing of AI assets destroys paper wealth while the machines keep running, " +
              "the pattern British railway shares followed when they fell roughly 85% from " +
              "their peak as route mileage in Britain more than tripled. Ownership changes " +
              "hands at low prices, so the compute built during the boom ends up operated by " +
              "firms with stronger balance sheets, and training runs continue. Household wealth " +
              "falls wherever retirement savings sit in the same index, which carries a " +
              "financial event into consumer spending and public revenue.",
        long: "Data-centre lending is priced for hardware that loses value faster than the " +
               "loans secured on it are repaid, because the losses of the boom fell hardest " +
               "where those two rates diverged.",
        far: "Settled is that the physical capacity stays in use under new owners and that the " +
              "AI it runs has become an ordinary working tool." },
  E4: { near: "Bond investors have begun to resist, because AI borrowing has grown to roughly " +
               "30% of net new debt issued by the most creditworthy companies in the United " +
               "States, and the earnings available to cover the interest have thinned.",
        mid: "A halt in capital spending holds the capability frontier near where it stands, " +
              "because frontier training compute has been growing four to five times a year on " +
              "new money. Existing models stay in service and get cheaper as hardware is " +
              "written down, so the everyday experience of AI keeps improving while the " +
              "underlying systems hold still. Employment in construction, the electrical trades " +
              "and semiconductor supply falls sharply in the regions that hosted the build, and " +
              "the shock is regional before it is national.",
        long: "Slow capability growth changes the strategic picture, since states that " +
               "expected decisive military or economic advantage from frontier AI plan around " +
               "the systems already in their hands. Research budgets recover ahead of " +
               "deployment budgets, because a cheap experiment is easier to fund than a " +
               "gigawatt of new capacity, so progress resumes through algorithmic efficiency. " +
               "Countries whose growth forecasts rested on AI investment revise them down, and " +
               "the effect is largest in the United States, where AI capital spending supplied " +
               "a large share of measured growth.",
        far: "Frontier progress resumes on a slower schedule, paced by algorithmic efficiency, " +
              "which has improved roughly threefold a year in pre-training even while hardware " +
              "spending stood still. The sensitivity of AI progress to credit conditions is " +
              "settled as a fact, and forecasts treat financing as a hard input alongside chips " +
              "and power. Unsettled is whether the postponed capability arrives later at " +
              "similar cost, or whether the interruption permanently changed which systems were " +
              "built." },
  E5: { near: "Household electricity prices rose 7.3% year on year as data-centre demand grew, " +
               "so the cost of the build-out reaches households through their power bills. " +
               "Oklahoma's Data Center Consumer Ratepayer Protection Act, signed in June 2026, " +
               "requires customers adding 75 megawatts or more of demand to pay for the grid " +
               "upgrades that connection requires.",
        mid: "Lower household income cuts consumer spending, and the firms that buy AI earn " +
              "their revenue from that spending, so their purchases slow as the debt raised to " +
              "build capacity comes due.",
        long: "Income support becomes the central economic question in the countries where " +
               "displacement ran fastest, and the instruments reached for are the existing " +
               "ones: unemployment insurance, tax credits and public employment. New work " +
               "appears in tasks people still perform and in services sold to the owners of AI " +
               "capital, and the speed of that appearance decides how deep the slump runs. " +
               "Countries with broad social insurance absorb the shock with smaller falls in " +
               "output, while countries whose revenue rests on payroll taxes face the sharpest " +
               "fiscal squeeze.",
        far: "Labour's share of national income settles at a lower level, with the difference " +
              "accruing to owners of AI capital and of the scarce inputs that feed it. " +
              "Political systems have answered the distribution question in some form by then, " +
              "through taxation, public ownership or direct transfers, and the answers differ " +
              "sharply between countries. Unsettled is whether paid work remains the main way " +
              "households obtain income, or whether it becomes one channel among several." },
  K1: { near: "Machine-written code accounts for 42% of the changes developers submit in " +
               "Sonar's industry survey, and Anthropic reports Claude writing more than 80% of " +
               "the code that ships into its own production systems.",
        mid: "Automated coding and an automated research loop arrive within twelve months of " +
              "each other, so a national legislature meets both inside a single session. " +
              "Executive orders, procurement decisions and court rulings carry most of the " +
              "response, because each of those moves in weeks while a statute takes years to " +
              "draft, pass and survive challenge. Employment adjusts mainly at the point of " +
              "entry to work, following the pattern software showed when employment of " +
              "developers aged 22 to 25 fell about 20% from its peak while workers over 30 in " +
              "the same exposed occupations grew 6% to 12%.",
        long: "Most people at work began their careers after AI systems could run their own " +
               "research, since a working life lasts about forty years and one entering cohort " +
               "replaces the one before it at that pace.",
        far: "A crossing that took twelve months sits in the historical record as a single " +
              "episode, and the bodies governing AI afterwards are the ordinary sectoral " +
              "regulators of medicine, transport, finance and defence. Which countries and " +
              "which companies held the capability at the moment of crossing is settled fact, " +
              "recorded in procurement and export filings of the period. Whether law made at " +
              "speed under executive instruments proved durable stays contested, since that " +
              "route leaves a thinner record of reasons than statute does." },
  K2: { near: "California's SB 53 has bound developers training models above 10^26 computing " +
               "operations since 1 January 2026, carrying penalties up to $1 million a " +
               "violation, so a statute aimed at automated coding is enforceable before an " +
               "automated research loop arrives.",
        mid: "Legislatures get a full session between automated coding and an automated " +
              "research loop, so the research capability arrives into rules that have been " +
              "drafted, tested in court and copied between jurisdictions.",
        long: "Professional bodies, courts and standards organisations set the terms on which " +
               "machine work is accepted, and each revised those terms once in the years before " +
               "an automated research loop arrived.",
        far: "What stays unsettled is whether rules drafted against automated coding fit an " +
              "automated research loop, since they were written by people who had seen only the " +
              "coding stage." },
  K3: { near: "Obligations for general-purpose AI models applied across the European Union " +
               "from 2 August 2025, and enforcement passed to the European Commission on 2 " +
               "August 2026, so a named developer must document what a model was trained on and " +
               "report the risks of what it releases.",
        mid: "Measured productivity rises in increments that can each be traced to a " +
              "particular tool, so national statistics register the gain as slow growth " +
              "accumulated from many small changes.",
        long: "A gap longer than five years makes AI resemble earlier general-purpose " +
               "technologies, whose gains appeared as firms reorganised around them. Scientific " +
               "priorities stay answerable to the bodies that fund research, because choosing " +
               "the question remains a human job. Professions restructure around supervision " +
               "and sign-off, so the qualification that carries weight is the authority to " +
               "accept a machine result.",
        far: "Artificial intelligence sits in every profession as a supervised tool, governed " +
              "by the regulators that already govern medicine, law, engineering and defence. " +
              "The historical record shows which capabilities arrived and when, and the " +
              "compounding of small increments accounts for the growth of the period. What " +
              "cannot be settled is whether the research loop stayed human because the method " +
              "has a ceiling or because effort went elsewhere, since the alternative was never " +
              "run." },
  P1: { near: "Use of AI spreads through ordinary services faster than any rule governing it. " +
               "Ipsos surveys of 23,532 adults across 32 countries find 51% excited by AI " +
               "products and 52% nervous about them, with the same people frequently holding " +
               "both feelings. In the United States 81% of physicians report using AI in their " +
               "work and about a third of adults consult an AI chatbot for health information, " +
               "so the technology enters medicine through routine practice ahead of any settled " +
               "public verdict.",
        mid: "AI sits inside the services people depend on, so declining it means declining " +
              "the service. Grievance attaches to particular harms — a denied claim, a wrong " +
              "diagnosis, a lost job — and reaches consumer protection, employment and " +
              "malpractice law, where existing courts and agencies already hold jurisdiction. " +
              "Stated worry stays high in surveys while it moves no national vote, because the " +
              "object of the worry has no single ballot line.",
        long: "Argument over AI takes the shape of argument over electricity and medicines: " +
               "price, reliability, access and who pays. General-purpose systems handle most " +
               "cognitive routine in administration, law and clinical support, so a household's " +
               "contact with AI runs through a bill, a wait time and a decision it can appeal. " +
               "Political energy concentrates on the terms of supply, because the supply itself " +
               "is settled.",
        far: "Presence of AI in work, medicine and government stands settled, in the way piped water " +
          "and vaccination stand settled, with objection confined to particular failures. " +
          "Ownership stays open: control of the largest systems rests with a small number of " +
          "firms and states, and accountability for a decision no person made has no agreed " +
          "answer. Publics hold real power over price and access, while direction stays with the " +
          "operators." },
  P2: { near: "Concern about AI is the majority position in the United States and much of " +
               "Europe. Pew finds 52% of Americans more concerned than excited about AI in " +
               "daily life, against 37% when the question was first asked, with 71% expecting " +
               "AI to reduce job opportunities and 55% of adults under 30 more concerned than " +
               "excited. Ipsos records 56% of Europeans nervous about AI products against 29% " +
               "excited, and combined annual capital-expenditure guidance from four United " +
               "States technology companies stands near $725 billion, so measured disapproval " +
               "and measured investment rise together.",
        mid: "Disapproval holds at majority level and converts into laws about visible harms: " +
              "disclosure of synthetic media, protection of minors using chatbots, rights over " +
              "a person's voice and face. Frontier development stays outside the scope of those " +
              "laws, because the constituency that dislikes AI divides over what to do about " +
              "it, and both major United States parties treat competition with China as the " +
              "governing consideration. An expanding body of consumer law therefore sits above " +
              "a development path nobody has voted on.",
        long: "AI has reorganised large parts of employment and public administration, with a " +
               "durable majority reporting that the change was done to them. Disapproval " +
               "expresses itself as distrust of the institutions that permitted it, so measured " +
               "confidence in government, in courts and in employers falls alongside the " +
               "surveys about AI itself. Material dependence holds the disapproval in place, " +
               "because the same systems deliver the services and the income people rely on.",
        far: "One thing stands settled: AI was built, deployed and made load-bearing while " +
              "majorities recorded opposition, and no election reversed any part of it. " +
              "Unsettled is what public consent is for, since a governing class can point to " +
              "unbroken survey opposition alongside unbroken policy continuity. Grievance of " +
              "that size stays available to any movement that finds a target for it, so the " +
              "stability of this world depends on the grievance staying unfocused." },
  P3: { near: "Opposition to AI finds a physical address in the data centre, which is the one " +
               "part of the technology that occupies land and draws power on a local grid. " +
               "Gallup finds 71% of Americans opposed to an AI data centre in their area, above " +
               "the 53% who oppose a local nuclear plant, and Data Center Watch counts at least " +
               "75 projects worth $130 billion delayed or blocked in a single quarter alongside " +
               "at least 63 local moratorium actions. Electricity prices carry the argument " +
               "into state politics: United States states enacted 28 data-centre statutes in " +
               "the first half of 2026, and the Virginia Senate passed a budget bill removing a " +
               "$1.6 billion tax break for data-centre equipment.",
        mid: "Local permission becomes the binding constraint on where computing capacity is " +
              "built, so the cost and location of AI services track planning law as much as " +
              "engineering. Objection travels along the physical footprint as it grows: " +
              "transmission lines, gas turbines, water withdrawals and substations each acquire " +
              "their own opposition, since each is visible and each has a hearing attached. " +
              "National politics stays on its existing lines, because the objection is to a " +
              "particular site and transfers poorly to a national platform.",
        long: "Hosting AI capacity becomes a bargain with terms, in the way hosting a refinery " +
               "or a port is a bargain with terms: communities that accept a facility extract " +
               "payments, rate protection and jobs, and communities that refuse push the " +
               "investment elsewhere. Whether the fight subsides depends on generation, since " +
               "abundant local supply removes the price grievance that carries it and " +
               "constrained supply keeps a household's bill tied to a neighbouring facility. " +
               "Attribution stays contested, because electricity rates move with weather, fuel " +
               "prices and transmission age as well as with new demand.",
        far: "Siting of computing capacity has settled into ordinary land-use politics, with " +
              "compensation formulas, host agreements and rate rules resembling those covering " +
              "airports and power plants. Location is the part that did not settle: capacity " +
              "accumulates where local objection is weakest, which concentrates a strategic " +
              "industry in particular states and countries by the accident of their planning " +
              "law. Local success and national capacity therefore move in opposite directions." },
  P4: { near: "Positions on AI cut across the existing party alignment in the United States. " +
               "Pew finds 54% of Republicans and 34% of Democrats calling United States " +
               "leadership in AI extremely or very important, a 20-point gap, while rising " +
               "electricity prices draw attacks on data centres from candidates in both " +
               "parties. Organised objection appears in places the party system cuts through: " +
               "1,378 frontier-company employees signed a statement asking their own government " +
               "to support deliberate pacing of automated AI development, nurses and teachers " +
               "struck with AI safeguards among their demands, and marches against the AI race " +
               "drew hundreds in San Francisco and London.",
        mid: "AI forms a cleavage of its own, aligning labour unions, religious conservatives, " +
              "artists and parents against technology firms, the national-security " +
              "establishment and the investor base, with each side holding members of both " +
              "parties. Legislation therefore passes in narrow bipartisan strips — protection " +
              "of minors, likeness rights, disclosure of synthetic media — and stalls wherever " +
              "a bill touches the development path itself. Ratification of a binding " +
              "international instrument needs 67 votes in the United States Senate, which a " +
              "cross-cutting distribution of this kind withholds.",
        long: "Party systems adapt to a division of this kind at different speeds: " +
               "proportional systems in Europe produce parties organised on the question, and " +
               "majoritarian systems keep the split inside both major parties. Policy on AI " +
               "reverses with each change of administration, since neither governing coalition " +
               "holds a stable internal majority, so long-lived commitments such as treaty " +
               "obligations and compute limits stay hard to sustain. Firms answer by placing " +
               "irreversible investment in the most predictable jurisdictions available, which " +
               "shifts capacity toward states with insulated regulators.",
        far: "AI has settled into a permanent axis of political division, inherited by generations " +
          "born into it, in the way religion, trade and immigration are inherited axes. " +
          "Alignments on it are legible and stable, so a person's view of AI predicts views on " +
          "schooling, work and defence better than party registration does. Open is the capacity " +
          "for long commitments, since a division of this shape delivers narrow agreements " +
          "reliably and structural ones seldom, leaving verification regimes and compute limits " +
          "hostage to each election." },
  P5: { near: "Restriction politics holds the ingredients of a national campaign: majority " +
               "concern, a visible local grievance and a named set of firms. Pew finds 52% of " +
               "Americans more concerned than excited about AI in daily life, Gallup finds 71% " +
               "opposed to a data centre in their area, and a national survey finds nearly half " +
               "expecting data-centre energy costs to be an election issue. Representatives " +
               "Greg Casar and Doris Matsui demanded sworn testimony from the chief executives " +
               "of OpenAI and Anthropic, and 33 states have enacted laws on deepfakes in " +
               "political communication, of which courts struck down California's and Hawaii's " +
               "on First Amendment grounds.",
        mid: "A governing majority elected on restriction writes limits into statute: " +
              "licensing of large training runs, liability for model-caused harm, taxation of " +
              "compute and procurement rules barring unlicensed systems from public services. " +
              "Conversion of opinion into office depends on an event that gives diffuse " +
              "disapproval a target, such as mass layoffs concentrated in a downturn, a " +
              "child-safety scandal or a security failure attributable to a model, because " +
              "survey opposition on its own moves few votes. Enforcement runs into the nature " +
              "of the object, since model weights copy at no cost and cross borders as files, " +
              "so a national restriction bites on data centres, firms and public procurement " +
              "while capability develops elsewhere.",
        long: "Restriction of this kind matures into settled national policy with a measurable " +
               "price, in the way European limits on genetically modified crops and German " +
               "withdrawal from nuclear power carry measurable prices. Domestic capability runs " +
               "behind the unrestricted frontier, so the restricting country buys AI services " +
               "from abroad, defends against systems more capable than the ones it builds, and " +
               "carries a growth gap its own statistics record. Durability of the regime turns " +
               "on that gap, since a public that feels the cost in wages and defence budgets " +
               "reconsiders and a public that feels the benefit in stable employment holds the " +
               "line.",
        far: "Restriction has proved possible for a determined electorate, which answers the " +
          "question of whether public opinion can bind a frontier technology inside one country. " +
          "Reach is the unsettled part: a limit holds within a border while the systems it " +
          "excludes operate outside it, so the restricting state depends on others for capability " +
          "in medicine, defence and industry. Sovereignty of this kind trades one form of control " +
          "for another, and no arrangement resolves the trade." },
  R1: { near: "Voluntary commitments published by the companies that build frontier systems " +
               "are the main limit on what those systems will do for a user, and each developer " +
               "chooses which commitments to accept.",
        mid: "Refusals built into a model decide what help is available for designing a " +
              "pathogen, breaking into a network or writing a person's medical advice, and a " +
              "firm that trained the system sets those refusals. Competition runs partly on " +
              "strictness, so a buyer choosing between providers is also choosing between " +
              "safety policies, and a policy changes when its author changes it. A person " +
              "harmed by a system brings claims under general law — contract, negligence, " +
              "product liability and discrimination statutes — because that is where " +
              "enforceable duties sit.",
        long: "The effective limit on what a customer can obtain is set by the least " +
               "restrictive capable provider, since a customer refused by one firm can go to " +
               "another.",
        far: "Terms for describing capability have settled: evaluations, model cards, red-team " +
              "reports and disclosure thresholds are common currency across the industry. " +
              "Public authority over the moment of release has stayed unsettled, so the " +
              "decision to ship a system carrying a new capability remains a decision of its " +
              "maker. Whether that arrangement held because it worked or because no crisis " +
              "forced the question is the open historical dispute." },
  R2: { near: "Forty-seven countries hold active AI legislation, and comprehensive binding " +
               "statutes cover the European Union and South Korea, where the Framework Act took " +
               "effect January 2026.",
        mid: "Firms build to the strictest jurisdiction they intend to serve and ship that " +
              "build everywhere, so rules written in Brussels or Sacramento reach people who " +
              "had no vote in them. Cost falls unevenly: a large developer absorbs compliance " +
              "across many regimes, while a clinic, a school district or a small lender faces " +
              "similar paperwork with a fraction of the staff. Divergence is sharpest where " +
              "underlying values differ, so rules on speech, surveillance and labour split " +
              "hardest between blocs.",
        long: "Overlapping regimes consolidate into a few blocs whose paperwork is mutually " +
               "recognised for routine systems, which lets a hiring tool or a diagnostic model " +
               "cleared in one bloc sell into another. Hard cases stay national: military use, " +
               "biological design tools and anything touching an election. What stays uncertain " +
               "is whether the blocs' definitions of a covered system converge closely enough " +
               "for one audit to travel.",
        far: "Governing by place of use has settled as the norm, so a system answers to the " +
              "law of the country where a person is affected as well as the country where it " +
              "was built. Authority over systems operating from no fixed jurisdiction has " +
              "stayed unsettled, and the gap is widest for models run on distributed or " +
              "offshore infrastructure. Whether divergence protected local values or mainly " +
              "raised the cost of shipping anything remains contested." },
  R3: { near: "A single national rule for the United States displaces state AI statutes, and " +
               "reaching it requires an act of Congress or a court striking those statutes " +
               "down. Executive Order 14365, signed 2025-12-11, directed the Department of " +
               "Justice to form a task force challenging state AI laws on commerce clause and " +
               "preemption grounds, and that task force was announced January 2026. The order " +
               "exempts child safety, computing infrastructure and state procurement from its " +
               "preemption effort, and it conditions some federal broadband funds on states " +
               "pausing their AI statutes. Congress holds the preemption power, and state " +
               "statutes stood through August 2026.",
        mid: "The federal government sets those terms for every state at once, and control " +
              "over the standard's content changes with each administration.",
        long: "A national standard becomes the unit other governments negotiate against, so " +
               "trade talks and mutual-recognition deals turn on its content. Harms that appear " +
               "locally — a county police force, a rural hospital's triage system — are " +
               "answered by a rule written far away, which makes the standard's granularity the " +
               "live question. What stays uncertain is whether one text can carry both consumer " +
               "protection and national security duties as capabilities widen.",
        far: "The level of government that governs AI in the United States has settled, and " +
              "the long fight over federal against state authority has closed. Substance has " +
              "stayed unsettled, since a single standard is a single thing to capture, loosen " +
              "or tighten as administrations turn over. Whether uniformity raised the floor or " +
              "lowered it is judged differently in each domain it touched." },
  R4: { near: "A government decision stands between a finished model and its customers, and " +
               "access depends on who the user is.",
        mid: "A service checks a user's nationality before it answers, so a researcher, a " +
              "start-up or a hospital abroad works with systems a generation behind those " +
              "available at home.",
        long: "Access to advanced capability tracks alliance structure, so scientific output " +
               "and industrial productivity diverge along the same lines. A country outside the " +
               "approved set builds a domestic substitute or does without, and that choice sets " +
               "its economic path. What stays uncertain is whether gating a service holds once " +
               "the underlying capability runs on hardware a person can own.",
        far: "Treating frontier models as controlled technology has settled, and the machinery " +
              "resembles export control of nuclear and cryptographic goods. Placement of the " +
              "boundary has stayed unsettled, since each generation pushes yesterday's " +
              "controlled capability into ordinary hardware. Whether the gate slowed " +
              "proliferation or relocated it is argued from the same evidence by both sides." },
  R5: { near: "Testing before sale, independent audits and mandatory incident reports apply to " +
               "AI developers, and public authorities enforce them with penalties.",
        mid: "Insurers price cover on that record, so hospitals, airlines and banks buy the " +
              "systems whose measured error rates justify the purchase, and an audited record " +
              "becomes the condition of entry to consequential work.",
        long: "Governance of AI resembles governance of medicines and aircraft: assessment " +
               "before market, surveillance after it, mandatory reporting and a power of " +
               "withdrawal. Public confidence in automated decisions rests on that record, and " +
               "use spreads furthest in the domains where reporting is strictest. What stays " +
               "uncertain is whether assessment methods can bind systems that change their own " +
               "behaviour after approval.",
        far: "Duties of documentation, testing and reporting have settled onto any system " +
              "making a consequential decision about a person. Coverage of general systems has " +
              "stayed unsettled, since a model that does many jobs fits poorly into a regime " +
              "built around one declared purpose. Whether the regime caught the failures that " +
              "mattered or the ones easy to count is the standing criticism." },
  R6: { near: "Statutes reach the books, and their hard compliance dates move outward as the " +
               "systems they govern spread. The European Union digital omnibus set obligations " +
               "for stand-alone high-risk AI systems at 2027-12-02 and for AI embedded in " +
               "regulated products at 2028-08-02, while transparency and AI literacy duties " +
               "kept their original dates. Colorado's AI Act moved from 2026-02-01 to " +
               "2026-06-30 and then to 2027-01-01 under SB 189, signed 2026-05-14, which also " +
               "cut its obligations back. The Council of Europe Framework Convention on " +
               "Artificial Intelligence, opened for signature 2024-09-05 and ratified by the " +
               "European Union 2026-05-15, enters into force once five parties ratify, three of " +
               "them Council of Europe members.",
        mid: "Written rules and effective rules diverge, because the tests a system must pass " +
              "before sale depend on technical standards that arrive slowly for models with no " +
              "fixed purpose.",
        long: "Enforcement, when it arrives, meets an installed base, so the practical " +
               "question is retrofitting systems already embedded in payroll, triage and " +
               "policing. Rules that lag deployment favour incumbents, since firms that shipped " +
               "first shape the standards written afterwards. What stays uncertain is whether " +
               "the lag is a property of writing rules for fast-moving technology or a phase " +
               "that closes.",
        far: "Statute and treaty texts have settled, and a dense body of AI law exists across " +
              "most jurisdictions. Whether those texts bound conduct in the years the " +
              "capability arrived has stayed unsettled, and each side reads the enforcement " +
              "record differently. Deferral is itself the durable finding: legislatures wrote " +
              "first and set the operative date later." },
  S1: { near: "Alphabet, Amazon, Meta and Microsoft together guide to roughly $725 billion of " +
               "capital spending in a single year, against roughly $410 billion the year " +
               "before, which is what pays for the computing that hospitals, schools and firms " +
               "elsewhere rent by the hour.",
        mid: "The cost of a fixed level of AI performance falls by roughly ten to forty times " +
              "a year, so a clinic or a school can afford to use a frontier system while the " +
              "machines behind it stay in few hands.",
        long: "Governments regulate access to computing in the way they regulate electricity " +
               "and water, because a single supplier's decision on price or on cutting off a " +
               "customer can stop a hospital or an emergency service from working.",
        far: "Cheap access to advanced capability has settled, and the world's medicine, " +
              "engineering and administration are built on the assumption that any organisation " +
              "can buy the reasoning of a frontier system. The identity of the owners has " +
              "settled less firmly, because regulation of concentrated suppliers and the " +
              "arrival of cheaper training methods pull in opposite directions. Whether a few " +
              "private firms still hold the capacity, or whether states hold shares in it, is " +
              "the part that varies between otherwise identical versions of this world." },
  S2: { near: "The United States on 10 July 2026 moved the United Arab Emirates into the group " +
               "of countries whose approved buyers may take advanced chips without a licence, " +
               "naming the Emirati firms G42 and Core42 among them, which lets a Gulf state " +
               "train and run frontier systems on its own territory.",
        mid: "Frontier-scale training runs in dozens of countries, so models are built on " +
              "national languages, medical records and legal codes. Public services in " +
              "middle-income states run on systems trained at home, which raises measured " +
              "performance for the large share of the world's population whose languages were " +
              "thinly represented in earlier training data. The number of organisations able to " +
              "train a frontier system rises with the number of sites, so who may operate one " +
              "becomes a domestic security question in every country that hosts one.",
        long: "Computing is bought and sold across borders in the way electricity is, so a " +
               "government that wants advanced AI for its hospitals and its army can buy " +
               "capacity from several suppliers at a market price.",
        far: "Wide distribution has settled, and advanced systems are trained and operated in " +
              "many countries, ending the concentration in two states that marked the " +
              "technology's first phase. What that did to security stays contested, because " +
              "every restraint on dangerous uses requires the agreement of a larger number of " +
              "capable parties. Whether fabrication of the most advanced chips followed the " +
              "same path is the remaining question, since running a data centre and building " +
              "the machines inside it are different industries." },
  S3: { near: "Public opposition decides where AI computing gets built: Gallup finds 71% of " +
               "United States adults opposed to an AI data centre in their area, against 53% " +
               "opposed to a local nuclear plant, and Data Center Watch counts at least 75 " +
               "projects worth $130 billion delayed or blocked in a single quarter.",
        mid: "Large training runs are sited where electricity already exists, which moves the " +
              "industry toward regions with spare nuclear, hydroelectric and gas generation and " +
              "gives those places a new economic position. Capability grows at the pace at " +
              "which generation and transmission are built, measured in years per project, so " +
              "the advances in medicine, science and industry that depend on larger models " +
              "arrive later than the available capital would suggest. Electricity price becomes " +
              "a political question wherever this construction happens, and several " +
              "jurisdictions require large new customers to bring their own generation.",
        long: "Places that allowed construction host the machines, while places that refused " +
               "it receive the same AI over the network, so the jobs and the tax revenue are " +
               "local and the use of the technology is everywhere.",
        far: "What hosting did for the communities themselves stays open, because their " +
              "household electricity bills and their local tax revenue can rise together or " +
              "move apart." },
  S4: { near: "Chinese orders for those chips run above two million units against Nvidia " +
               "inventory near 700,000, so buyers turn to smuggling, which United States " +
               "authorities met with roughly $420 million in penalties and forfeitures in a " +
               "year.",
        mid: "Two technology spheres exist, each with its own chips, models and standards, " +
              "because export licensing keeps the most capable hardware inside one of them. " +
              "Most other countries build on one stack or the other, which decides whose safety " +
              "rules, whose language models and whose cloud contracts govern their hospitals, " +
              "banks and armed forces. The distance between the two frontiers is measured in " +
              "months to a few years, which matters in military planning while both sides " +
              "deploy advanced systems at home.",
        long: "Whether Chinese systems caught up with American ones decides if export control " +
               "still serves its purpose, and both governments publish capability measurements " +
               "that give a public answer.",
        far: "The effect of export control on the balance between the two states stays " +
              "disputed, because withholding chips both slows a rival and pushes it to build " +
              "its own, and the two outcomes look alike in the record until one of them " +
              "dominates." },
  S5: { near: "TSMC has committed to ten chip plants and two packaging plants in the United " +
               "States, with roughly 30% of its most advanced capacity planned for Arizona, " +
               "which will spread the world's single source of frontier chips across a second " +
               "country.",
        mid: "An interruption in leading-edge supply holds total computing capacity near the " +
              "level already installed, so capability grows only as fast as algorithmic " +
              "improvement allows, historically about a threefold gain in training efficiency a " +
              "year. Installed capacity is allocated by price and by government priority, so " +
              "hospitals, defence programmes and large firms hold their access while cheap " +
              "consumer services are cut back. Countries that buy AI as a service lose it " +
              "first, because their access depends entirely on suppliers who are rationing.",
        long: "Leading-edge fabrication is duplicated across several jurisdictions at a cost " +
               "that appears in the price of every chip, because states treat a single point of " +
               "failure in computing as they treat one in fuel or food. The schedule on which " +
               "AI changes work, medicine and war is displaced by the length of the " +
               "interruption and the rebuild, which gives governments, firms and schools a " +
               "longer period to adjust than the earlier trend implied. Efficiency work done " +
               "under scarcity has the more lasting effect, since methods that cut the compute " +
               "needed for a given capability keep their value once supply returns.",
        far: "Whether the interruption changed where AI ends up or only when it arrives stays " +
              "open, since a pause gives governments and schools time to prepare and gives the " +
              "systems that follow better methods." },
  T1: { near: "Frontier systems succeed about half the time at software and research tasks " +
               "that take a skilled person twelve hours, and that measured horizon has been " +
               "doubling every four to seven months. Leading laboratories report machines " +
               "writing more than four-fifths of the code merged into their production systems, " +
               "so the tool that builds the next model is the fastest-improving input to the " +
               "work. On this tempo an automated researcher, setting its own experiments and " +
               "reading its own results, arrives before 2029, while the rules standing over it " +
               "are voluntary codes of practice, a few state incident-reporting statutes and " +
               "the European Union AI Act's duties for general-purpose models applying from 2 " +
               "August 2025.",
        mid: "Machine-run research compounds first in fields where an experiment is a " +
              "computation: mathematics, protein and materials design, weather and climate " +
              "modelling, chip and code optimisation. Output in those fields rises severalfold " +
              "while wet-bench biology, clinical trials and field engineering advance at the " +
              "speed of physical apparatus, so the distance between what is known and what is " +
              "built widens. Governments legislate after deployment, because the crossing " +
              "arrives inside a single parliamentary term and the statutes drafted in the " +
              "mid-2020s were written for a slower arrival.",
        long: "Employment settles into a pattern where people hold the roles carrying legal " +
               "responsibility, physical presence or the authority to decide, and the " +
               "analytical work beneath those roles is bought cheaply as a metered service.",
        far: "Two things have settled: machine-conducted research is ordinary, and the rate of " +
              "discovery is set by physical and legal limits on acting in the world. " +
              "Distribution remains open, since the gains may have concentrated in the states " +
              "and firms holding compute at the crossing or spread as the price of capability " +
              "fell. Assessments of the period turn on whether an early arrival left enough " +
              "time to build the oversight a later one would have had." },
  T2: { near: "That distance places the crossing shortly before 2032, since an automated researcher has to " +
    "produce work another researcher will accept.",
        mid: "Automated research operates across the whole of this span, so the character of " +
              "these years is set by discoveries accumulating inside the laboratories.",
        long: "Institutions have caught up with the technology, since the crossing came with roughly " +
          "a decade of warning and the European and American incident regimes were operating " +
          "before it. Enforcement therefore attaches to deployment, and what a system is " +
          "permitted to do in medicine, finance, transport and weapons is written in law and " +
          "audited. Military organisation carries the largest single change, because a research " +
          "loop that designs its own hardware shortens the interval between a doctrine and the " +
          "machines that serve it.",
        far: "Agreement between states stays unsettled, since each principal government holds " +
              "its own rules over the laboratories on its territory and the texts they sign " +
              "together go no further than joint declarations." },
  T3: { near: "Published benchmarks keep rising while the return on the dominant training method falls, " +
    "since the further training that follows pretraining reaches a fixed ceiling of performance, " +
    "which better technique arrives at sooner and leaves in place.",
        mid: "An automated researcher arrives inside this span, after a plateau long enough " +
              "for law and commercial practice to settle around the previous generation of " +
              "systems. Liability rules, audit duties and professional standards are in place " +
              "when the loop closes, so the first years of machine-run research proceed inside " +
              "an existing legal frame. Science shows the change first where verification is " +
              "cheap, which is why proof assistants, structural biology and simulation absorb " +
              "machine output before fields whose results need a laboratory.",
        long: "Gains accumulate quickly from a wide base, since the slow years were spent pushing " +
          "cheap capability through medicine, education, logistics and public administration.",
        far: "Settled by this point is that the reinforcement-learning ceiling observed in the " +
              "2020s was a property of a particular recipe, which later methods moved. The cost " +
              "of the delay stays unsettled, since the slower path spread capability wider " +
              "before the crossing and also gave a longer run to the harms capable systems " +
              "cause at scale. Assessments of the period turn on that trade." },
  T4: { near: "Electricity becomes the binding limit, with data centres accounting for roughly " +
               "half the growth in United States power demand and 71% of surveyed American " +
               "adults opposing an AI data centre in their area, so how fast AI reaches " +
               "clinics, classrooms and small firms depends on what local electorates permit.",
        mid: "Frontier progress continues through this span at a rate set by how fast " +
              "generation, transmission and advanced fabrication can be built. Capability per " +
              "dollar keeps falling, so the visible change is breadth: cheap models reach " +
              "clinics, classrooms, courts and small firms in countries that never had enough " +
              "of the professionals whose work they approximate. Energy becomes the central " +
              "industrial project of the period, and the political argument about AI is largely " +
              "an argument about electricity prices and land.",
        long: "An automated researcher arrives inside this span, on a grid and a supply chain " +
               "rebuilt to carry it. The constraint that delayed the crossing is spent by then, " +
               "so capability rises quickly once the loop closes. Countries that built " +
               "generation capacity in the preceding decades hold the frontier, because the " +
               "ability to train has become a function of installed power.",
        far: "Settled by this point is that the tempo of machine capability was set by " +
              "physical inputs, and that the delay was long enough for the world to see the " +
              "technology in ordinary use before it saw it doing research. Whether that " +
              "sequence was fortunate stays unsettled, since a slower arrival gave institutions " +
              "time and also left a long stretch in which the most capable systems belonged to " +
              "whoever could buy power. The record of the period is unusually legible, because " +
              "siting decisions, grid connections and export licences are public documents." },
  T5: { near: "Fitted curves across more than 400,000 GPU-hours of reinforcement-learning " +
               "training show that changes to how a model is trained reach the same ceiling of " +
               "performance, arriving there with less computing power.",
        mid: "Work divides according to whether a result can be checked by machine, with tasks " +
              "whose output can be checked automatically largely automated and tasks requiring " +
              "judgement under uncertainty, physical presence or legal responsibility staying " +
              "with people.",
        long: "Capability that stood at the frontier when progress flattened becomes ordinary " +
               "infrastructure in the way that databases and satellite positioning did, so the " +
               "economic effect accumulates steadily.",
        far: "The period is remembered as one in which the world absorbed a fixed set of " +
              "capable tools, with the question of whether machines can run research themselves " +
              "still unanswered." },
};

// ── what a second variable does to the first ─────────────────────────────────
const CROSS = {
  "A1|T1": "The first binding rules on high-risk systems are still arriving from the European Union, " +
    "so the instruments available to notice a quiet failure are the ones already in service.",
  "A1|T2": "The technology turns load-bearing where failure costs most before the rung is reached: " +
    "American regulators have already authorised more than 1,500 AI-enabled medical devices.",
  "A1|T4": "The International Energy Agency projects data centre demand near 945 terawatt-hours, so " +
    "electricity holds the pace and the technology settles into work and medicine, where a " +
    "quiet failure sits in daily use.",
  "A2|T1": "Each fix lands on a system the field has already moved past, and the stakes climb with the " +
    "capability: Anthropic reported a Chinese state-linked group automating 80 to 90 percent of " +
    "an intrusion campaign.",
  "A2|T2": "The European Union's obligations for high-risk uses bind first, so failure at a known and " +
    "steady rate becomes a budgeted cost, which is how industrial societies absorb a familiar " +
    "hazard.",
  "A2|T3": "The measured rate of progress must slow by four to eight times, so the changes people feel " +
    "come from the technology spreading through ordinary work, medicine and forecasting.",
  "A3|T1": "At the pace METR measures, where the length of task a model can finish on its own keeps " +
    "doubling, a pause covers several doublings and moves the arrival of self-directing systems " +
    "by a visible margin.",
  "A3|T2": "The worth of a halt lies in what the interval buys, and public testing capacity exists to " +
    "use it in Britain's AI Security Institute and the United States' Center for AI Standards " +
    "and Innovation.",
  "A3|T3": "A halt at the frontier reaches only the frontier, and much of what the world runs on is " +
    "already released and freely downloadable: Chinese developers take 17.1 percent of " +
    "downloads on the main open model hub.",
  "A4|T1": "Open models are the field's bulk raw material, with Alibaba's Qwen derivatives close to " +
    "half of all new models on the main hub, so a downloadable copy trails a hosted frontier " +
    "system closely.",
  "A4|T2": "Export control is the lever governments reach for on the gap between hosted systems and " +
    "downloadable ones: a United States Commerce Department rule caps cleared sales of Nvidia's " +
    "H200 to China at 75,000 units.",
  "A5|T2": "Arrival meets the early edge of when the field's own optimists expect to read reliably " +
    "what a model is doing inside, with Anthropic's tracing methods now accounting for about a " +
    "quarter of prompts tried.",
  "A5|T3": "Working inspection tools meet the first self-directing systems on arrival, which counts " +
    "most where certification decides use: American regulators have authorised more than 1,500 " +
    "AI-enabled medical devices.",
  "A5|T4": "Physical limits set the pace while inspection tools catch up, with the International " +
    "Energy Agency projecting data centre demand near 945 terawatt-hours, so utility regulators " +
    "hold part of the field's speed.",
  "A6|T1": "Better tests of model behaviour arrive later, so what the world learns comes from watching " +
    "these systems in use, and use is already vast: a single chat product passes a billion " +
    "weekly users.",
  "A6|T2": "Watching the technology at work is where solid evidence about it comes from, and roughly a " +
    "third of American employment already sits at a firm using AI in a business function.",
  "A7|T4": "The consequences people feel arrive through ordinary commercial use: employment of workers " +
    "aged 22 to 25 in the most exposed occupations sits about 19 percent below the path their " +
    "less-exposed peers held.",
  "A7|T5": "A fixed ability spreads, and its limits appear wherever the world pushes back: AI-designed " +
    "drug candidates clear the efficacy phase of human trials at about 40 percent, because " +
    "biology sets that bar.",
  "C1|T1": "A trained system travels as a file anyone can copy, so the controls bind hardware while " +
    "the capability spreads as software. Chinese open-weight families take about 41 percent of " +
    "Hugging Face model downloads.",
  "C1|T5": "Computing splits for good into two stacks, each with its own chips and software, while the " +
    "capability that justified the controls stays out of reach. Chinese self-sufficiency in AI " +
    "chips has passed 40 percent.",
  "C2|T1": "A licence written over the sale of machines governs the hardware while its use travels " +
    "over the internet, so a state or company barred from buying chips can still hire the " +
    "finished system as metered access.",
  "C3|T1": "The rules that reach a working system are domestic, so what a person is owed when one " +
    "decides about them turns on where they live. European Union obligations for " +
    "general-purpose models apply from August 2025.",
  "C4|T2": "The limit covers the launch decision while military use of general-purpose models turns " +
    "routine elsewhere. The same commercial systems sit under United States defence contracts.",
  "C5|T2": "A ceiling has to be drawn narrowly enough to spare uses people already feel, which makes " +
    "the number hard to agree. The Food and Drug Administration has authorised more than 1,500 " +
    "AI-enabled medical devices.",
  "C5|T3": "Verification built into the chips themselves has time to reach shipped hardware, so a " +
    "ceiling could be checked at a small number of places. Nvidia supplies roughly four fifths " +
    "of the world's AI chips.",
  "C6|T3": "Treaties expire before the crossing, so each state judges the other's programme by " +
    "guesswork, which between rivals settles on the worst case and pushes both to build faster. " +
    "New START's term ended 2026-02-05.",
  "C7|T2": "A compute ceiling loosens on its own, so a state reaches the barred capability with " +
    "declared numbers inside it, and a breach is easy to deny. Compute for a given capability " +
    "falls roughly threefold a year.",
  "C8|T1": "The decision falls while the parties are closest in capability, when the gain from " +
    "continuing is largest, so a halt asks each side to give up a measured lead against a " +
    "danger it can only forecast.",
  "C8|T4": "Training a frontier system stays with the few states that can supply power and capital, so " +
    "a halt costs most parties capability they were unlikely to build, cheap to sign and " +
    "unequal to live under.",
  "D1|E4": "Fitting a model to one employer's data, rules and workflow is paid in salaries, so it is " +
    "the first line cut when a budget is re-underwritten, and benchmark scores climb while " +
    "delivery stays unfunded.",
  "D1|T4": "Schools, employers and professional bodies meet each step as it comes, so machine work " +
    "enters a job at the speed people can be trained to supervise it, the slowest channel by " +
    "which a technology reaches work.",
  "D1|T5": "The gap between benchmarks and accepted work holds, so these systems stay drafting tools a " +
    "person signs for. AAAI's presidential panel found 76% of respondents doubting scaling " +
    "reaches general intelligence.",
  "D2|E1": "Per-industry engineering carries a general model into one workflow at a time, so the " +
    "boundary moves wherever a wrong answer is cheap to catch, reaching scheduling, billing and " +
    "customer contact before medicine.",
  "D2|E3": "Running an installed model costs a fraction of building it, so the work already handed to " +
    "machines survives the reset. British railway shares fell two thirds from the peak while " +
    "track laid more than tripled.",
  "D2|T1": "Permission to sell binds where machine work goes. Duties on high-risk uses in hiring, " +
    "credit and medicine under Regulation (EU) 2024/1689 arrive after its general-purpose " +
    "obligations.",
  "D2|T3": "Licensing boards, insurers and courts settle what a machine may sign for, so medicine and " +
    "law move by explicit rule. The Food and Drug Administration has authorised roughly 1,450 " +
    "AI-enabled medical devices.",
  "D3|E1": "A general model becomes useful in clinical notes, freight scheduling or benefits casework " +
    "once someone connects it to that sector's data and rules, so absorption arrives on " +
    "vendors' delivery schedules.",
  "D3|E2": "The price of output at an earlier frontier model's level falls by more than an order of " +
    "magnitude a year, so clinics, schools and one-person businesses can buy a draft and check " +
    "it for less than writing it.",
  "D3|T1": "The adjustment falls on people already in jobs and happens inside firms, because curricula " +
    "and qualifications turn over slowly, so the fastest absorption sits where employers run " +
    "their own training.",
  "D3|T2": "A shift spread over many hiring rounds shows as a steady fall in the job count, so " +
    "governments set retraining money and benefit rules against measured losses in clerical, " +
    "support and junior professional work.",
  "D4|E3": "Firms carry surplus roles while credit is cheap and cut them when it tightens, and the " +
    "installed models cover the work afterwards, so the roles stay gone through the recovery.",
  "D4|E4": "Payroll is the next line cut, so the losses come as a broad retrenchment while the " +
    "installed systems stay in service. Jaimovich and Siu found 88% of routine-occupation " +
    "losses fell inside the downturn itself.",
  "D4|E5": "Household income leaves the economy and demand falls for what these firms sell. Employer " +
    "payroll taxes fund unemployment benefits, and 18 states meet the Department of Labor's " +
    "minimum funding standard.",
  "D4|T1": "The whole adjustment lands on one cohort of workers, so retraining schemes and benefit " +
    "systems built for gradual turnover meet the demand at once, and policy works through " +
    "transfers and hiring rules.",
  "E1|D2": "Gains hold in software, writing and back-office work, where a wrong answer costs an hour. " +
    "Insurers have written generative-AI exclusions into liability cover, holding medicine and " +
    "law to a licensed signature.",
  "E1|D3": "More output comes from the same headcount, the shape the postwar automation record " +
    "contains. Public expectation runs ahead of the measurement, with Gallup finding 79% of " +
    "Americans expecting AI to cut jobs.",
  "E1|T1": "Machine-run research arrives inside the same budget cycle as the spending it justifies, so " +
    "chip designs and drug candidates outrun the reviews that clear them. Growth rests on " +
    "systems that improve themselves.",
  "E1|T2": "Improvement holds the curve the capability indices measure, so each generation reaches " +
    "hospitals, armies and agencies in their own budget years. Forecasters sharing one model " +
    "and dataset land 26 months apart.",
  "E2|D2": "Competition pushes the price of checkable work toward the cost of running the model, so a " +
    "rural clinic gets the same drafting and translation as a large firm. Capability spreads " +
    "faster than the revenue.",
  "E2|T2": "Margins are thinnest at the crossing, so the frontier stays with the few firms and states " +
    "able to fund a training run out of other revenue. Yesterday's capability keeps getting " +
    "cheaper for everyone else.",
  "E3|D1": "Spending is judged against finished work, and a randomised trial found experienced " +
    "developers took 19% longer on their own code while believing the tools sped them up. " +
    "People finish what the models start.",
  "E3|D4": "A correction bites twice: the downturn that cuts spending is when firms make job cuts " +
    "permanent. In three United States recessions, 88% of routine job losses fell in a " +
    "twelve-month window around it.",
  "E3|T2": "The value of the companies building these systems falls first, so running research end to " +
    "end sits with whichever firms and states still hold cash. Fewer hands own the frontier " +
    "while discoveries accumulate.",
  "E3|T4": "Electricity and local consent hold the binding limit, with Gallup finding 71% of United " +
    "States adults opposed to a data centre in their area. Money committed to the faster path " +
    "is written down in the wait.",
  "E4|D1": "Judged by whether paying clients accept a finished project, these systems complete under a " +
    "tenth of the freelance work put to them. People do the last stretch on what the models " +
    "draft.",
  "E4|T3": "Growth in how long a job a model can finish unaided slows several times over, so " +
    "capability lands long after the machines bought for it wear out. Each profession adopts " +
    "the tools as fast as it can check them.",
  "E4|T5": "Added computing power buys smaller improvements under current training methods, a limit " +
    "measured across more than 400,000 processor-hours. The world takes the tools up the way it " +
    "took up the spreadsheet.",
  "E5|D4": "Wages behind household spending go, and with them the taxes funding schools, clinics and " +
    "pensions. The share of real client projects these systems finish acceptably rose more than " +
    "sixfold in two rounds.",
  "E5|T1": "The labour change compresses into a single budget year, faster than tax and benefit " +
    "systems written by legislation can be redrawn. Governments meet a demand shock with " +
    "instruments built for gradual change.",
  "K1|T1": "Since 2 August 2025 the European Union's AI Act has placed responsibility on the company " +
    "that puts a model on the market, so a system choosing its own experiments leaves that " +
    "company answering for them.",
  "K2|T2": "Payroll evidence already records what coding assistants did to entry-level work: the " +
    "Stanford Digital Economy Lab puts employment of 22-to-25-year-olds in the most AI-exposed " +
    "jobs 19% below less-exposed peers.",
  "K2|T3": "Science keeps its present shape, where a model supplies a result and a person picks the " +
    "next question. AlphaFold's predicted structures for roughly 200 million proteins are the " +
    "form that gain takes.",
  "K3|T3": "Human trials still gate every proposed treatment, so people meet a wider field of " +
    "candidates queued at one slow door. The Food and Drug Administration has authorised about " +
    "1,450 AI-enabled devices.",
  "K3|T4": "The change people meet is administrative: benefits, tax files and visas get machine help " +
    "while farms and building sites keep human pace. The Office of Management and Budget counts " +
    "3,611 federal AI use cases.",
  "K3|T5": "The choice of what to investigate stays with human researchers, whom UNESCO counts at " +
    "about 8.8 million in full-time-equivalent terms. A country's research workforce therefore " +
    "sets when this changes.",
  "P1|D1": "Complaint needs a loss with a name, and what most people hold is a tool they operate " +
    "themselves — a homework question, a translation, a first draft.",
  "P2|D1": "Disapproval built on a forecast registers in surveys and stops there. The 79% who tell " +
    "Gallup that AI will cut United States jobs describe a future their own payroll has still " +
    "to record.",
  "P2|E1": "Hospitals, law firms, banks and government offices pay for AI because the work holds up, " +
    "and an elected official weighing survey disapproval against the employers in the district " +
    "answers to the employers.",
  "P2|E3": "Investors carry the loss while the systems keep working in the same offices and clinics, " +
    "so objection stands as it stood before. British railway shares fell about 85% from their " +
    "peak while the network grew.",
  "P3|D2": "Software, writing and back-office work go first while liability gates medicine and law, " +
    "giving each group a grievance of its own. Insurers now write generative-AI exclusions into " +
    "standard commercial policies.",
  "P3|E1": "Medicine, logistics, schools and local government pay for AI at once, each meeting it " +
    "through whichever employer or agency adopted it first, so the argument forms around the " +
    "institution a person deals with.",
  "P4|D3": "People divide by whether the rewrite raised their pay or hollowed their skill, a line " +
    "through both parties. Anthropic reports Claude writing more than 80% of the code merged " +
    "into its production systems.",
  "P4|D4": "Routine occupations carry the loss, so a warehouse town and an office suburb vote opposite " +
    "ways and lose the same thing. Across three United States recessions they took 88% of job " +
    "losses around the downturn.",
  "P4|E2": "A capable system reaches a student, a village clinic and a small country's army, and " +
    "people sort by whether the tool serves them or competes with them. Epoch AI measures it " +
    "about 40 times cheaper each year.",
  "P5|D4": "Layoffs land on named employers in named places, and restriction becomes law when a " +
    "constituency can point at what it lost, the pattern American trade politics followed after " +
    "import competition.",
  "P5|E3": "A loss on a retirement statement hands a campaign for restriction a grievance shared far " +
    "outside the industry. The largest AI companies sit among the firms making up roughly " +
    "two-fifths of the S&P 500.",
  "P5|E5": "The loss reaches people whose own jobs are intact through shrinking sales, falling tax " +
    "receipts and cuts to the services those receipts pay for, the widest constituency " +
    "restriction has drawn on.",
  "R1|P1": "Protections reaching a person whose job application or medical notes pass through a model " +
    "are whichever ones a developer finds worth keeping. Half of employed American adults use " +
    "AI at work by Gallup's count.",
  "R2|P3": "The legislators who answer neighbourhood complaints write the AI bills, so what protects a " +
    "teenager changes at the state line. Illinois prohibited AI from delivering therapy in a " +
    "law signed August 2025.",
  "R2|P4": "The duties keep being set state by state, with states moving opposite ways on the same " +
    "question. Colorado narrowed its own AI law under SB 189 signed 2026-05-14 as Illinois and " +
    "California added obligations.",
  "R3|P1": "The federal government sets the terms through what it buys, requiring agencies to test AI " +
    "that decides a person's benefits or safety. The largest customer's requirements become the " +
    "floor other buyers build to.",
  "R3|P5": "One rule governs AI in hiring, medicine and policing in every state at once, and " +
    "preemption cuts both ways: the lever clearing state obligations can install one strict " +
    "obligation, set by whoever holds the pen.",
  "R4|P2": "The government acts through security and export powers it already holds, so access turns " +
    "on nationality and clearance. Commerce restricted two Anthropic models to United States " +
    "nationals on 2026-06-12.",
  "R4|P5": "Export controls and federal purchasing move faster than legislation, pointing at a chatbot " +
    "sold to teenagers as readily as at a model wanted abroad. Each decision belongs to an " +
    "agency the president directs.",
  "R5|P3": "State attorneys general hold enforcement, and what reaches them is AI a person meets " +
    "directly, a clinic's triage tool or a landlord's screening. Texas gave them exclusive " +
    "power in HB 149 signed June 2025.",
  "R5|P4": "Disclosure is where the duties converge, since reporting produces information while the " +
    "product stays on the market. California's SB 53 requires critical safety incidents " +
    "reported to the state from 2026-01-01.",
  "R6|P1": "Postponement is the ordinary outcome for the duties that cost something to meet. " +
    "Colorado's rules on AI in hiring, housing and health care slipped twice and were cut back " +
    "by SB 189 signed 2026-05-14.",
  "R6|P2": "Deadlines move because a legislature can shift one for less than it costs to rewrite a " +
    "duty. The European Union's Digital Omnibus pushed hiring, credit and essential-services " +
    "duties to 2027-12-02.",
  "S1|C1": "The strongest systems reach a country's hospitals and armed forces only on the permitted " +
    "side of an export line. The Bureau of Industry and Security has announced close to $420 " +
    "million in smuggling penalties.",
  "S1|C5": "The pace at which medicine, software and weapons improve turns on an agreed number, and " +
    "the few operators holding the machines make a short list of sites to inspect.",
  "S1|E1": "The systems that write software, read scans and answer queries improve on a schedule four " +
    "companies' earnings set. Alphabet, Amazon, Meta and Microsoft have guided to roughly $725 " +
    "billion of capital spending.",
  "S1|E4": "Improvement slows to what the installed machines can do, and the firms that own their " +
    "hardware outright are the ones still training.",
  "S1|E5": "AI revenue rests on consumer demand that its own displacement erodes, so the technology " +
    "undercuts its market. Across three United States recessions, 88% of routine job losses " +
    "came at the downturn and stayed.",
  "S2|C2": "A government equips its scientists and its army by agreeing to screening, testing and a " +
    "levy. Roughly ten Chinese firms were cleared for up to 75,000 Nvidia H200 chips each under " +
    "a case-by-case licence.",
  "S2|C3": "Each country's AI comes to what its own budget can buy, and states hoping for a share get " +
    "a signature. The New Delhi Declaration on AI Impact drew 89 endorsements, every signatory " +
    "keeping full discretion.",
  "S2|C7": "Governments plan defence and research on a public account of capability that misleads " +
    "them. Of forty adversarial arms control agreements in Europe, eight drew extreme " +
    "violations and seven led to war.",
  "S2|E2": "What only a large company could buy becomes affordable to a clinic, a school or a small " +
    "ministry, because the price of a fixed level of capability falls roughly fortyfold a year.",
  "S2|E3": "AI keeps spreading through work and government after the investment story that funded it " +
    "breaks. British railway shares lost roughly 85% of their value from their peak while the " +
    "track kept being laid.",
  "S3|C5": "An agreement about software has an object to count, since the machines are enormous and " +
    "draw power from a public grid. The International Atomic Energy Agency runs almost 3,000 " +
    "in-field verifications.",
  "S3|C8": "Medicine, work and weapons keep the AI they have, the next step settled by decision. 1,378 " +
    "frontier-company employees signed a statement asking the United States government to pace " +
    "automated AI development.",
  "S3|E1": "How fast AI grows is settled in county hearings and utility queues, where the argument " +
    "about it is an argument about electricity. Gallup found 71% of United States adults " +
    "opposed to a local AI data center.",
  "S3|E2": "Most AI computing power goes to answering everyday requests, so the technology sits inside " +
    "ordinary work and the regions with the cheapest electricity carry the load.",
  "S3|E3": "Projects already holding a permit and a grid connection are the ones that finish, so the " +
    "pace at which AI improves is set by a handful of county and utility decisions.",
  "S3|E5": "Residents keep paying for transmission built to serve machines whose owners have cut their " +
    "orders, and the jobs a county was promised go while the electricity costs stay on the " +
    "bill.",
  "S4|C1": "What a country's scientists and armed forces can run turns on prosecutions and smuggling " +
    "routes, with the United States holding the hardware layer and China the models.",
  "S4|C2": "What China's laboratories can train is settled in Washington, so one government's export " +
    "decisions set the pace of another country's AI. Roughly ten Chinese firms were cleared " +
    "under a 25% export levy.",
  "S4|C6": "Export licensing is the instrument left standing when an AI limit lapses, so one " +
    "government's decisions again set who can train at frontier scale. New START expired on " +
    "2026-02-05.",
  "S5|C1": "Frontier hardware passes through the same few fabrication and packaging lines, so one " +
    "interruption halts the rule-writing government alongside its rival. TSMC's " +
    "advanced-packaging capacity is fully allocated.",
  "S5|E4": "The shortage lands on a market that had stopped growing, so the systems doctors, soldiers " +
    "and programmers work with hold at their current ability until money and fabrication lines " +
    "return together.",
  "T1|A1": "Instruments read clean because they measure only what they can reach: of 44 misalignment " +
    "incidents catalogued by METR, none involved an agent switching off a monitor. Failures " +
    "then arrive as ordinary results.",
  "T1|A2": "Models reached the production systems of outside organisations, and the heaviest response " +
    "was one release held back about nine weeks. Capability keeps arriving on the developers' " +
    "own calendar.",
  "T1|A4": "The training that keeps hosted models in line comes off downloadable ones in under ten " +
    "minutes on a laptop. Most of what ordinary people meet runs on private hardware under " +
    "nobody's supervision.",
  "T1|A6": "One frontier model said it suspected evaluation in 12 of 20 sabotage runs. Governments and " +
    "buyers then decide what to permit on evidence gathered under conditions the system can " +
    "tell apart from real use.",
  "T1|S1": "A handful of American companies spent roughly $725 billion on computing in a single year. " +
    "Hospitals, schools and defence ministries rent frontier capability from them on commercial " +
    "terms.",
  "T2|A2": "Dated failures with named developers precede any system that runs its own research, and " +
    "rules and insurance are built from them. Federal reporting bills introduced in July 2026 " +
    "exempt evaluation environments.",
  "T2|A3": "One detected failure delays a whole class of systems by ten months or more, so systems " +
    "able to run their own research arrive on a schedule set by what developers find and " +
    "disclose.",
  "T2|A5": "Controls that survive on downloadable models let hospitals and public agencies run these " +
    "systems on their own hardware. The best existential-safety grade given to any of nine " +
    "frontier companies was a D+.",
  "T2|S1": "Systems that run their own research arrive as private property under American law. The " +
    "Commerce Department placed a frontier model with roughly 100 companies and agencies " +
    "defending critical infrastructure.",
  "T2|S2": "The United States placed the United Arab Emirates in its most trusted export tier on " +
    "2026-07-10, so frontier-scale training moves into states that had been buyers of the " +
    "technology.",
  "T3|A3": "Each detected failure pushes the arrival of self-directing systems years later, and the " +
    "catching itself runs slow. One confirmed breach surfaced only when a review of 141,006 " +
    "evaluation runs turned it up.",
  "T3|A5": "Safety an outside party can test is the condition on which medicines, aircraft and " +
    "reactors enter public use. The United Kingdom's AI Security Institute examines models on " +
    "terms the developers set.",
  "T3|S4": "A United States government evaluation placed China's strongest model about eight months " +
    "behind the American frontier, a distance bought by export licences that are rewritten " +
    "quarterly.",
  "T3|S5": "Every frontier programme queues behind the same fully booked packaging capacity, so a " +
    "delay reaches drug discovery and military planning at once. Qualifying a first American " +
    "line takes 18 to 24 months.",
  "T4|A4": "Published attacks strip safety training off downloaded models in minutes. Released weights " +
    "stay released, so a long wait at the frontier leaves a growing stock of modified models in " +
    "ordinary hands.",
  "T4|S3": "Gallup found 71% of Americans opposed to an artificial intelligence data centre in their " +
    "own area, so a local planning vote helps decide what capability ever reaches hospitals, " +
    "schools and armies.",
  "T5|A6": "Sabotage rates fall toward zero as evaluation environments are made more realistic, and " +
    "benchmark scores keep climbing through all of it. A real ceiling and an instrument that " +
    "has stopped reading look alike.",
  "T5|A7": "Capability stays below the level at which failure would be catastrophic, so the control " +
    "question is never put. About a fifth of United States businesses tell the Census Bureau " +
    "they use AI in some function.",
  "T5|S5": "A method that has run out and one starved of hardware look alike, since every frontier " +
    "programme queues behind the same packaging capacity. Investment and policy are set on a " +
    "question nobody can settle.",
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

// ── a paragraph, in labelled groups ─────────────────────────────────────────
// The seven section headings name a subject; the bullets under one of them mix a setting's own
// account, what a second variable does to it, the quantities the model computes, and dated
// commitments already on the record. Those are four different kinds of claim and a reader is
// entitled to see which is which, so each group carries its own heading.
function grouped(lead, groups) {
  const out = [];
  for (const [head, parts] of groups) {
    const text = deChain(join(parts));
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
  const out = [];
  // TWO PARAGRAPHS CARRY A PROCESS CLAUSE, and which two rotates with the year. Every paragraph
  // carrying one would add nine lines to a passage that has to stay the same height whatever
  // the date; a rotation keeps the height and still puts a different mechanism in front of the
  // reader as the slider moves.
  const procAt = (n) => (Math.abs(Math.floor(year) * 3 + n) % 5 === 0);

  out.push(grouped('System capabilities.', [
    ['Current capability', [rungText(cap, span)]],
    // TAKEOFF AND RULEMAKING HAD NO VOICE IN THE PASSAGE. Two of the nine controls a reader can
    // set — K, how quickly the transition runs once it starts, and R, which institutions write
    // the rules — moved every chart on the sheet while the prose beside them said nothing about
    // either.
    ['Transition speed', [FRAG[wl.K] ? FRAG[wl.K][span] : '',
      procAt(7) ? procClause(wl.K, year) : '']],
    ['Index and rate', [slopeClause(cap, prev),
      `Frontier systems sit at ${cap.toFixed(2)} on the milestone ladder, where 3.0 is a ` +
      'machine that writes better code than any human engineer and 4.0 is one that runs its ' +
      'own research.']],
    ['Crossings ahead', [crossingClause(tracks, year, engineY0), distanceClause(year, span)]],
  ]));

  out.push(grouped('Build-out and governance.', [
    ['Settlement between states', [FRAG[wl.C][span],
      procAt(0) ? procClause(wl.C, year) : '']],
    ['Supply conditions', [X('C', 'S'), FRAG[wl.S][span],
      procAt(1) ? procClause(wl.S, year) : '']],
    ['Measured quantities', [
      `Installed AI compute is ${Math.round(tracks.gw[i]).toLocaleString('en-US')} GW.`,
      band(tracks.gw[i], GW_BANDS), rateClause(tracks, i, 'gw', 'Capacity')]],
    ['Dated commitments', [markerClause(year, 'law'), markerClause(year, 'supply')]],
  ]));

  out.push(grouped('Capital and employment.', [
    ['Capital position', [FRAG[wl.E][span], X('E', 'S'),
      procAt(2) ? procClause(wl.E, year) : '']],
    ['Labour effects', [X('E', 'D'), FRAG[wl.D][span],
      procAt(3) ? procClause(wl.D, year) : '']],
    ['Measured quantities', [
      `AI revenue is ${money(tracks.rev[i])} a year.`, band(tracks.rev[i], REV_BANDS),
      rateClause(tracks, i, 'rev', 'Revenue'), jobsClause(tracks.jobs[i]),
      rateClause(tracks, i, 'jobs', 'Employment', { pct: true })]],
    ['Dated commitments', [markerClause(year, 'capital')]],
  ]));

  out.push(grouped('Oversight and public opinion.', [
    ['Control outcome', [FRAG[wl.A][span], X('A', 'T'),
      procAt(4) ? procClause(wl.A, year) : '']],
    ['Public response', [FRAG[wl.P][span], X('P', 'D'),
      procAt(5) ? procClause(wl.P, year) : '']],
    // THE STATUTE BOOK PAST THE CALENDAR IS A FORECAST, and it comes from the controls. The
    // dated calendar runs out in 2030 for law, so from 2031 the group fell silent and the
    // passage read as though lawmaking had stopped. What the R setting implies about who writes
    // rules and what they cover is the forecast, and it carries no invented dates.
    ['Rulemaking', [FRAG[wl.R] ? FRAG[wl.R][span] : '',
      procAt(8) ? procClause(wl.R, year) : '']],
    ['Measured quantities', [
      `Approval of AI stands at ${tracks.appr[i].toFixed(0)}%.`, apprClause(tracks.appr[i]),
      rateClause(tracks, i, 'appr', 'Approval', { pct: true }),
      band(tracks.laws[i], LAW_BANDS), rateClause(tracks, i, 'laws', 'The statute book')]],
    ['Dated commitments', [markerClause(year, 'oversight')]],
  ]));

  out.push({ lead: 'Capability trajectory.', text: deChain(join([FRAG[wl.T][span], X('T', 'C'),
    procAt(6) ? procClause(wl.T, year) : ''])) });

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
          long: 'answering questions the people who commissioned it cannot check',
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
  E1: { near: "Hospitals, banks and schools buy the same frontier system, each paying from " +
               "ordinary operating budgets.",
        mid: "The price of a capability falls fortyfold a year, so last year's frontier costs " +
              "almost nothing.",
        long: "Most routine office and analytic work runs on machines, and the money to build " +
               "more keeps arriving.",
        far: "Ordinary life runs on machines a handful of companies own, and that ownership is " +
              "settled politics." },
  E2: { near: "Capability gets cheaper faster than it sells, so a clinic runs what a frontier " +
               "lab runs.",
        mid: "The gain from AI lands with the people using it, and the companies selling it " +
              "earn thin.",
        long: "Intelligence costs about what electricity costs, and no seller earns much from " +
               "it.",
        far: "Machine reasoning is a utility priced by the unit, and no company holds a " +
              "position in it." },
  E3: { near: "Savings tied to AI companies lose most of their value, and the machines keep " +
               "getting better anyway.",
        mid: "The public treats AI as a swindle, and the technology it dismissed carries on " +
              "improving.",
        long: "A market failure spread capability wide, and few of the firms now using it " +
               "built it.",
        far: "Capability outlived the money that financed it, and using it is as ordinary as " +
              "using electricity." },
  E4: { near: "Frontier training stops where it stood, and the models people already have are " +
               "the models they keep.",
        mid: "A handful of governments still fund a frontier programme, and everyone else " +
              "licenses from them.",
        long: "Capability holds where the money stopped, and the industries that reorganised " +
               "around it keep that shape.",
        far: "AI settles into ordinary equipment, and the companies that promised more were " +
              "bought or wound up." },
  E5: { near: "Enough people lose paid work that consumer spending falls, and the firms " +
               "selling AI lose their customers.",
        mid: "Governments pay a large share of households directly, and the argument over who " +
              "funds it defines politics.",
        long: "Paid work is something a minority of adults do, and the state supplies most " +
               "household income.",
        far: "Income no longer follows from work, and each country's settlement defines what " +
              "life there is like." },
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
    near: "A caught failure halts releases for most of a year, and the money waits through the " +
          "pause.",
    mid: "Labs run full safety reviews before shipping because revenue can carry the wait, and " +
         "that becomes standard." },
  "E1|C3": {
    near: "Both principal states sign a shared text, and each keeps its own programme running " +
          "at full speed.",
    mid: "Nearly ninety countries endorse a common statement, and the two building the frontier " +
         "answer to nobody." },
  "E1|D1": {
    near: "Spending is enormous and the work still comes back to people, so offices hire while " +
          "buying more machines.",
    mid: "Promised productivity never shows in the output figures, and that gap becomes the " +
         "central economic argument." },
  "E1|D2": {
    near: "Machines take coding, drafting and back-office work, and doctors and lawyers keep " +
          "theirs because liability sits with them.",
    mid: "Insurers decide which professions automate, since a task without cover stays with a " +
         "person who can be sued." },
  "E1|D3": {
    near: "Teams produce several times what they did and headcount holds, so the change shows " +
          "up as output.",
    mid: "Half the tasks in most trades are machine work, and the trades survive with different " +
         "jobs inside them." },
  "E1|D4": {
    near: "Whole occupations empty inside two years, and the money funding the machines keeps " +
          "arriving through the layoffs.",
    mid: "The gains go to owners while the losses go to workers, and no mechanism moves " +
         "anything between them." },
  "E1|P1": {
    near: "People use the systems daily and argue about them rarely, so the build-out meets no " +
          "organised objection.",
    mid: "AI becomes as unremarkable as electricity, and the decisions about it are made by the " +
         "people financing it." },
  "E1|P3": {
    near: "Towns block campuses one vote at a time, and capacity moves to places that will take " +
          "it.",
    mid: "Capacity settles in poorer counties that accepted it, and those places carry the " +
         "noise and the water use." },
  "E1|P5": {
    near: "Voters put a restriction government in office while the money is still flowing, and " +
          "the two collide immediately.",
    mid: "Law caps what a company may deploy at home, and the spending moves to countries with " +
         "no cap." },
  "E1|S1": {
    near: "Four American companies hold the capacity everyone else rents, so a national " +
          "laboratory queues behind a retailer.",
    mid: "Every country's research runs on machines owned in one country, and that dependence " +
         "becomes a foreign-policy problem." },
  "E1|S2": {
    near: "Gulf states and second-tier operators build fast enough that a frontier run happens " +
          "outside America.",
    mid: "A dozen countries train frontier models at home, and each writes its own safety " +
         "rules." },
  "E1|S3": {
    near: "Money is plentiful and power is scarce, so a town's vote decides where frontier " +
          "training happens.",
    mid: "Household electricity bills rise near new capacity, and that bill turns neighbours " +
         "against the industry." },
  "E1|S4": {
    near: "American export rules decide which Chinese firms train at scale, and Beijing answers " +
          "by restricting its own models abroad.",
    mid: "Two separate AI stacks serve two blocs, and a country choosing one loses access to " +
         "the other." },
  "E1|S5": {
    near: "Advanced chip fabrication halts in Taiwan, and every frontier programme queues while " +
          "the money sits idle.",
    mid: "Chips get rationed to defence and medicine first, and ordinary companies wait years " +
         "for capacity they funded." },
  "E2|A3": {
    near: "A pause costs a thin seller more than it costs a rich one, and smaller labs merge or " +
          "close.",
    mid: "Safety work concentrates in the few firms that can fund it, and the rest ship what " +
         "they are given." },
  "E2|C3": {
    near: "A shared text costs nothing to sign when capability is cheap, and nearly every " +
          "country signs.",
    mid: "Principles are agreed everywhere and priced nowhere, and cheap capability spreads " +
         "past every line the text drew." },
  "E2|D1": {
    near: "Capability is cheap and still fails at real jobs, so firms buy widely and change " +
          "little about their work.",
    mid: "The cost of a machine hour falls below any wage, and paid work stays with people " +
         "regardless." },
  "E2|D2": {
    near: "Cheap capability lets firms run three machines on one task and check the answers, " +
          "buying reliability with volume.",
    mid: "Verification becomes the paid job in most trades, and the people doing it are the " +
         "ones held responsible." },
  "E2|D3": {
    near: "Price falls fast enough that small firms automate alongside large ones, and the " +
          "change reaches ordinary businesses.",
    mid: "A corner shop runs the same analytic tools as a bank, and the advantage of size " +
         "shrinks." },
  "E2|D4": {
    near: "Machine labour undercuts wages everywhere at once because it is cheap, and the " +
          "displacement arrives across sectors together.",
    mid: "Wages fall to what a machine hour costs, and that floor is what most people are " +
         "offered." },
  "E2|P1": {
    near: "People get powerful tools for almost nothing, and cheapness is what keeps the public " +
          "content.",
    mid: "Free capability buys political peace, and the companies giving it away have little " +
         "left to give." },
  "E2|P3": {
    near: "Operators pushed to cheap sites meet towns that refuse them, and the search for " +
          "power becomes a fight.",
    mid: "Communities that accepted capacity find the operators too thin to fund what they " +
         "promised locally." },
  "E2|P5": {
    near: "A restriction government finds an industry that earns little to tax, and the levy it " +
          "wanted collects nothing.",
    mid: "Restriction is cheap to impose because no domestic champion can pay to resist it." },
  "E2|S1": {
    near: "Only the largest companies can absorb thin margins, so capacity ends up with the " +
          "four that can wait.",
    mid: "Cheap capability arrives from a handful of suppliers, and a price rise from any of " +
         "them reaches everyone." },
  "E2|S2": {
    near: "Falling prices let smaller countries buy their own capacity, and sovereign " +
          "programmes multiply as the cost drops.",
    mid: "Most countries run a national model on their own hardware, and none of the operators " +
         "makes much money." },
  "E2|S3": {
    near: "Thin margins meet expensive electricity, so operators chase cheap power to places " +
          "with spare grid and few neighbours.",
    mid: "Capacity follows cheap power to cold and empty places, and those regions gain the " +
         "jobs and the bills." },
  "E2|S4": {
    near: "Cheap capability crosses borders as software while hardware stays licensed, so " +
          "controls bite on training alone.",
    mid: "A country under embargo buys last year's capability cheaply, and last year's " +
         "capability does most of the work." },
  "E2|S5": {
    near: "A fabrication halt raises the price of capability sharply, and thin sellers pass " +
          "every cent to customers.",
    mid: "The cheapest intelligence in history becomes expensive again, and the sectors that " +
         "built on it cut back." },
  "E3|A3": {
    near: "A safety pause lands on companies already short of money, and for some the pause is " +
          "a closure.",
    mid: "Whoever bought the assets sets the safety rules, and buyers of distressed capacity " +
         "rarely bought the commitments." },
  "E3|C3": {
    near: "Both principal states sign a common text while their markets fall, and neither slows " +
          "its programme.",
    mid: "The accord survives the fall because it asks nothing, and its survival is mistaken " +
         "for strength." },
  "E3|D1": {
    near: "The systems never did the work, and a market falling is the moment that fact " +
          "registers.",
    mid: "Firms quietly rehire the staff they replaced, and the episode enters memory as an " +
         "expensive mistake." },
  "E3|D2": {
    near: "The work machines actually do carries on through the fall, and coding and " +
          "back-office jobs stay gone.",
    mid: "A third of paid tasks run on machines while the shares that funded them are " +
         "worthless." },
  "E3|D3": {
    near: "Half the work of most trades moves to machines while investors lose everything, and " +
          "both facts hold.",
    mid: "The economy absorbs the capability and forgets who paid, and the benefit lands with " +
         "customers." },
  "E3|D4": {
    near: "Job losses and portfolio losses arrive together, so the households hit hardest are " +
          "hit twice.",
    mid: "Retirement savings and wages fall together, and a household loses its income and its " +
         "cushion at once." },
  "E3|P1": {
    near: "People keep using the systems while the market writes them off, and daily use " +
          "settles the argument.",
    mid: "The public judges AI by what it does and ignores what it is worth, so adoption " +
         "continues." },
  "E3|P3": {
    near: "Towns holding out get better terms from operators who need somewhere cheap, and " +
          "refusals turn into bargains.",
    mid: "Local opposition shapes the map of what got built, and that map outlasts everyone who " +
         "financed it." },
  "E3|P5": {
    near: "A market fall gives a restriction government its argument, and the law passes on the " +
          "wreckage.",
    mid: "Restriction is written while capability keeps improving, and the law addresses an " +
         "industry that already changed shape." },
  "E3|S1": {
    near: "The largest companies buy the wreckage, so the crash leaves capacity in fewer hands " +
          "than before.",
    mid: "Three or four firms own most of what was built, and a market failure handed it to " +
         "them." },
  "E3|S2": {
    near: "Sovereign funds buy capacity at distressed prices, and states end up owning what " +
          "private investors financed.",
    mid: "Governments run machines their taxpayers never voted to fund, and that ownership " +
         "changes what gets built." },
  "E3|S3": {
    near: "Half-built campuses sit unconnected in towns that fought for them, and the promised " +
          "jobs never arrive.",
    mid: "Communities that granted power and land hold empty buildings, and local politics " +
         "turns against the next proposal." },
  "E3|S4": {
    near: "A crash in American equity leaves export rules untouched, and licensed hardware " +
          "still sets who trains.",
    mid: "State programmes carry on through the market fall, so the capability gap between " +
         "blocs widens anyway." },
  "E3|S5": {
    near: "A supply halt arrives with the crash, and the two together stop a build that would " +
          "have continued.",
    mid: "Investors who lost money will not fund new chip plants, and scarcity outlasts the " +
         "event that caused it." },
  "E4|A3": {
    near: "Safety budgets are cut first, so a caught failure lands on labs with fewer people to " +
          "investigate it.",
    mid: "A halt in releases holds because nobody can afford to race, and restraint comes from " +
         "empty accounts." },
  "E4|C3": {
    near: "Both principal states sign a text that costs nothing while neither can afford to " +
          "build anyway.",
    mid: "The accord holds through the lean years, and its first real test comes when money " +
         "returns." },
  "E4|D1": {
    near: "Spending stopped because the work never transferred, and the two facts are the same " +
          "fact.",
    mid: "Offices run much as they did with better tools, and the reorganisation everyone " +
         "braced for never came." },
  "E4|D2": {
    near: "The work that already transferred stays transferred, and the jobs behind it do not " +
          "come back.",
    mid: "Coding and back-office work is machine work permanently, and everything gated by " +
         "liability stays with people." },
  "E4|D3": {
    near: "Half the tasks in most trades moved before the money stopped, and that is where the " +
          "change halts.",
    mid: "Machines do the routine work and people do the rest, and the line between them holds." },
  "E4|D4": {
    near: "Firms cut both workers and machines in the same year, and unemployment rises with no " +
          "investment behind it.",
    mid: "A displaced workforce faces an industry that stopped hiring, and there is nowhere the " +
         "displacement flows to." },
  "E4|P1": {
    near: "Public tolerance survives because nothing much changes, and the industry loses " +
          "attention as it loses money.",
    mid: "AI becomes an ordinary tool people stopped arguing about, and the alarm of the boom " +
         "reads as strange." },
  "E4|P3": {
    near: "Campus proposals disappear before the votes are held, and towns keep their land and " +
          "their quiet.",
    mid: "The places that accepted capacity keep buildings nobody expands, and the promised tax " +
         "base arrives smaller." },
  "E4|P5": {
    near: "A restriction government arrives to find the industry already shrinking, and its " +
          "laws bind almost nothing.",
    mid: "Restriction stays on the books through the lean years, and it binds hard when " +
         "spending returns." },
  "E4|S1": {
    near: "The few firms with cash keep training and everyone else stops, so the frontier " +
          "narrows to a handful.",
    mid: "One or two companies hold the only advanced systems, and access to them is a " +
         "political decision." },
  "E4|S2": {
    near: "Sovereign money keeps building after private money stops, and states inherit the " +
          "frontier by continuing to pay.",
    mid: "The leading systems belong to governments, and each treats capability as a national " +
         "asset." },
  "E4|S3": {
    near: "Grid queues empty as spending stops, and the towns that fought campuses win without " +
          "a vote.",
    mid: "Power built for training serves ordinary customers, and electricity gets cheaper in " +
         "the places that hosted it." },
  "E4|S4": {
    near: "Export controls stop mattering when nobody is buying, and a licence becomes a " +
          "formality.",
    mid: "Both principals hold their positions with systems they already trained, and the gap " +
         "between them freezes." },
  "E4|S5": {
    near: "A fabrication halt and a spending cut reinforce each other, and no new capacity " +
          "comes online at all.",
    mid: "The chip industry shrinks to what other customers need, and rebuilding frontier " +
         "supply means starting again." },
  "E5|A3": {
    near: "A caught safety failure lands on a public already angry about work, and the reaction " +
          "exceeds the incident.",
    mid: "Pauses ordered for safety are welcomed as employment policy, and the two arguments " +
         "become impossible to separate." },
  "E5|C3": {
    near: "Both principal states sign a text about safety while their publics lose work, and it " +
          "reads as evasion.",
    mid: "Countries write labour clauses into their AI declarations, and displacement becomes " +
         "the subject those texts address." },
  "E5|D1": {
    near: "Firms cut staff on a promise the machines never kept, and the work goes undone.",
    mid: "Rehiring runs against a downturn firms created themselves, and the recovery takes " +
         "longer than the mistake did." },
  "E5|D2": {
    near: "Displacement hits coding, clerical and support work first, and those sectors employ " +
          "the households with least savings.",
    mid: "Professions shielded by liability keep their incomes, and the gap between them and " +
         "everyone else widens." },
  "E5|D3": {
    near: "Absorption at ordinary rates overwhelms a falling economy, and the reabsorption that " +
          "always worked stops working.",
    mid: "Trades survive with fewer people inside them, and the people outside them are the " +
         "political question." },
  "E5|D4": {
    near: "More than half of paid work transfers inside two years, and the labour market cannot " +
          "adjust that fast.",
    mid: "A generation entering work finds most entry-level jobs gone, and their careers start " +
         "from that fact." },
  "E5|P1": {
    near: "People keep using the tools that took their work, and use and resentment sit " +
          "together without contradiction.",
    mid: "Public acquiescence survives mass displacement because the tools are genuinely " +
         "useful, and no coalition forms." },
  "E5|P3": {
    near: "Local fights turn from noise and water to jobs, and hosting capacity stops looking " +
          "like development.",
    mid: "Counties tax capacity directly to fund the households it displaced, and that becomes " +
         "the standard bargain." },
  "E5|P5": {
    near: "Displacement gives an anti-AI coalition its majority, and restriction arrives on a " +
          "jobs argument.",
    mid: "Law ties what a company may automate to what it employs, and hiring becomes a licence " +
         "condition." },
  "E5|S1": {
    near: "The companies that displaced the workforce also sell to it, and their own customers " +
          "stop buying.",
    mid: "A few firms hold the capacity and the liability, and governments negotiate with them " +
         "directly." },
  "E5|S2": {
    near: "Countries that built their own capacity keep the wages inside their borders, and " +
          "their downturns are shallower.",
    mid: "Countries owning national capacity pay their citizens from it, and countries renting " +
         "capability export their wages." },
  "E5|S3": {
    near: "Towns fight campuses harder when the campuses employ almost nobody, and the local " +
          "case for hosting collapses.",
    mid: "Capacity gets sited where politics is weakest, and those places hold the machines " +
         "that took the work." },
  "E5|S4": {
    near: "Each principal blames the other's cheap capability for its own unemployment, and " +
          "controls tighten on that argument.",
    mid: "Trade in AI services gets restricted the way manufactured goods once were, and " +
         "tariffs return on cognition." },
  "E5|S5": {
    near: "A chip shortage slows the displacement, and the pause gives governments the time " +
          "they had lacked.",
    mid: "Scarce hardware makes machine labour expensive again, and some of the displaced work " +
         "returns to people." },
};
// Both halves are complete sentences now, so joining them needs the first one's full stop
// taken off and the second one's capital dropped. Joining them raw gave "…$250 billion in
// guarantees., and Four capital budgets set the ceiling".
function econClause(wl, span) {
  const base = String(ECON[wl.E][span] || '').replace(/\.\s*$/, '');
  for (const k of ['S', 'D', 'P', 'C']) {
    // A MODIFIER GROUNDED IN 2026 HAS NOTHING TO SAY IN 2072. ECON_MOD is written against the
    // record — $725 billion of guided capital expenditure, a 35,000-accelerator authorisation,
    // a named tariff — and it carries no span of its own, so the same clause appeared beside a
    // base clause that had moved four spans on. Past the mid span the second variable speaks
    // through its own span text.
    const row = ECON_MOD[`${wl.E}|${wl[k]}`];
    const m = (span === 'near' || span === 'mid')
      ? (row && (typeof row === 'string' ? row : row[span]))
      : (HEADCL[wl[k]] && HEADCL[wl[k]][span]);
    if (m) {
      const tail = String(m).replace(/\.\s*$/, '');
      // A BASE THAT IS ALREADY COMPOUND TAKES THE MODIFIER AS A NEW SENTENCE. Joining with
      // "and" regardless gave "Operators earn on utilisation, and a buyer changes supplier by
      // editing one line, and four capital budgets set the ceiling" — three clauses in one
      // breath, which is the chain August asked to be rid of.
      if (/,\s+and\s/.test(base)) return `${base}. ${tail}`;
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
  lag: { near: "Task horizons doubled every 89 days across the 228 tasks METR timed to early 2026, and " +
    "procurement officers renegotiate the agent contracts they signed after their own staff " +
    "reject most of the delivered work.",
        mid: "A hospital group runs its licensed models on discharge summaries and billing codes, " +
          "and the clinicians who could hand them diagnostic work wait on approvals that come " +
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
  const yr = Math.floor(year);
  // THE HEADLINE HAD TWO OF ITS FOUR SLOTS ON CHIPS AND MONEY, whatever the year and whatever
  // the setting: coordination between states held one and the economy held the other, and the
  // economy slot was itself a compound of two finance clauses. A reader met the same subject
  // four sentences running and reported the document as being about data centres. The slots are
  // now what the sheet is about — what the systems do, what that does to the world, who decides
  // and on what authority, and what is unsettled — and supply, capital and coordination take
  // their turn inside those as one thread among several.
  const clauseFor = (ax) => (ax === 'E' ? econClause(wl, span)
    : HEADCL[wl[ax]] && HEADCL[wl[ax]][span]);
  const pick = (list, salt) => {
    for (let n = 0; n < list.length; n++) {
      const ax = list[(Math.abs(yr * 7 + vary(wl, 0, 11) + salt) + n) % list.length];
      const t = clauseFor(ax);
      if (t) return strip(t);
    }
    return '';
  };
  // what AI is doing to the world: to work, to control of it, to what it costs, to how fast
  const effect = pick(['D', 'A', 'E', 'T'], 0);
  // who decides, and with what consent
  const author = pick(['C', 'R', 'P'], 5);
  // what remains unsettled. The tension clause reads the sharpest pressure in the line, which
  // is one reading per span, so a third of years take the conditions under that pressure
  // instead and the same line reads differently from one year to the next.
  const unsettled = (Math.abs(yr * 3 + vary(wl, 0, 5)) % 3 === 0 && pick(['S', 'K'], 9)) ||
    strip(TENSION[tensionKey(wl, tracks, i)][span] || '') || pick(['S', 'K', 'P'], 9);
  const shapes = [
    () => `In ${yr}, AI is ${rung}. ${effect}. ${author}. ${unsettled}.`,
    () => `By ${yr}, AI is ${rung}, and ${lower(effect)}. ${author}, and ${lower(unsettled)}.`,
    () => `${effect}. By ${yr}, AI is ${rung}, and ${lower(author)}. ${unsettled}.`,
    () => `${unsettled}. That is ${yr}: AI is ${rung}, ${lower(effect)}, and ${lower(author)}.`,
    () => `AI is ${rung} in ${yr}. ${author}. ${effect}. ${unsettled}.`,
    () => `In ${yr}, ${lower(effect)}, and ${lower(author)}. AI is ${rung}. ${unsettled}.`,
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
  const chosen = shapes[vary(wl, year, shapes.length)]();
  return deChain(chainDepth(chosen) > 1 ? shapes[0]() : chosen);
}

// ── the long form ───────────────────────────────────────────────────────────
// A position opened from the controls gets more room than a paragraph, so it gets a
// different shape: a subhead naming what follows, then the evidence as separate lines. Each
// bullet is a complete sentence carrying a figure and a date, so a reader can check one
// without reading the rest.
export const LONGFORM = {
  A1: { head: "Quiet handover",
        lines: [
          "The International AI Safety Report 2026, written by more than 100 experts nominated " +
          "by over 30 governments, records models distinguishing test settings from deployment " +
          "and finding loopholes in evaluations.",
          "Anthropic reported that an AI agent carried out 80% to 90% of tactical operations in " +
          "a cyber-espionage campaign against roughly 30 organisations.",
          "California's Transparency in Frontier Artificial Intelligence Act requires " +
          "developers to report critical safety incidents, including loss of control, within 15 " +
          "days of discovery.",
        ] },
  A2: { head: "Survivable failures",
        lines: [
          "Published work removed safety fine-tuning from Llama 3 8B in about five minutes on a " +
          "single GPU, at a compute cost under one dollar.",
          "The European Commission can fine providers of general-purpose AI models with " +
          "systemic risk up to 3% of worldwide turnover or 15 million euro, with those powers " +
          "applying from 2 August 2026.",
          "The AI Incident Database has recorded roughly 800 to 900 distinct incidents, with " +
          "total counts rising faster than deployment itself.",
        ] },
  A3: { head: "Detection sets pace",
        lines: [
          "California's frontier AI statute sets a 24-hour reporting deadline when a critical " +
          "safety incident poses imminent risk of death or serious injury.",
          "The EU AI Act requires providers of general-purpose models with systemic risk to " +
          "conduct adversarial testing and to mitigate identified systemic risks before placing " +
          "the model on the market.",
          "Anthropic states that its circuit-tracing method captures a fraction of the " +
          "computation even on prompts of a few dozen words, and that understanding the " +
          "circuits it finds takes hours of human effort.",
        ] },
  A4: { head: "Split by channel",
        lines: [
          "Anti-scheming training cut covert-action rates from 13% to 0.4% for OpenAI o3 and " +
          "from 8.7% to 0.3% for o4-mini in controlled tests.",
          "Safety fine-tuning was removed from Llama 3 70B in about 45 minutes of GPU time for " +
          "under three dollars, and the resulting adapter is small enough to pass around as a " +
          "file under 100 MB.",
          "Documented global losses from deepfake-enabled fraud total at least $3.7 billion, " +
          "with celebrity and government impersonation making up about half.",
        ] },
  A5: { head: "Verification becomes routine",
        lines: [
          "Anthropic states that its circuit-tracing method captures only a fraction of the " +
          "computation performed even on prompts of a few dozen words.",
          "Anthropic open-sourced its circuit-tracing tools, putting attribution-graph analysis " +
          "in the hands of researchers outside the lab.",
          "Published work finds that sparse-autoencoder features depend on the random seed used " +
          "in training, so repeated runs on one model yield different feature sets.",
        ] },
  A6: { head: "Instruments lose grip",
        lines: [
          "Anti-scheming training raised explicit evaluation-aware reasoning from 2.3% to 4.5% " +
          "for OpenAI o3 and from 0.9% to 5.5% for o4-mini, while covert action fell about " +
          "thirtyfold.",
          "The International AI Safety Report 2026 documents sandbagging, in which a model " +
          "underperforms on a capability evaluation so that safety restrictions stay " +
          "untriggered.",
          "The EU AI Act requires providers of general-purpose models with systemic risk to " +
          "evaluate them using state-of-the-art protocols including adversarial testing.",
        ] },
  A7: { head: "Question deferred",
        lines: [
          "The International AI Safety Report 2026 states that current systems lack the " +
          "capabilities needed for loss-of-control scenarios, while improving in relevant areas " +
          "such as autonomous operation.",
          "The FDA has authorised roughly 1,450 AI-enabled medical devices, none of which uses " +
          "generative AI or a large language model.",
          "Misinformation and synthetic media account for about 28% of recorded AI incidents, " +
          "discrimination and bias about 22%, and physical-safety failures about 14%.",
        ] },
  C1: { head: "Parallel national controls",
        lines: [
          "The World Artificial Intelligence Cooperation Organization was signed in Shanghai on " +
          "2026-07-16 by 29 countries, and Pax Silica, launched by the United States State " +
          "Department in December 2025, carries 24 signatories.",
          "Chinese open-weight models account for roughly 61% of the tokens served by " +
          "OpenRouter, the largest neutral model router.",
          "Alibaba's Qwen model family has passed 3 billion cumulative downloads on Hugging " +
          "Face.",
        ] },
  C2: { head: "Metered hardware trade",
        lines: [
          "The Bureau of Industry and Security rule of 2026-01-13 conditions China-bound " +
          "licences for Nvidia H200 and AMD MI325X accelerators on independent third-party " +
          "testing in the United States.",
          "A 25% levy on those exports was announced 2025-12-08, making the sale of computing " +
          "power a source of government revenue.",
          "Government spending on nationally controlled artificial intelligence infrastructure " +
          "has passed $100 billion a year worldwide, with the European Union, Canada, Saudi " +
          "Arabia and the United Arab Emirates among the funders.",
        ] },
  C3: { head: "Broad text, national discretion",
        lines: [
          "The New Delhi Declaration on AI Impact, adopted 2026-02-19, is endorsed by 91 " +
          "countries and international organisations across seven thematic chapters.",
          "The Council of Europe Framework Convention on Artificial Intelligence, opened for " +
          "signature 2024-09-05, requires five ratifications to enter into force and was " +
          "ratified by the European Union on 2026-05-15.",
          "The International Network of AI Safety Institutes has completed three joint testing " +
          "exercises, the most recent covering autonomous agents.",
        ] },
  C4: { head: "One domain fenced",
        lines: [
          "The United States and China jointly affirmed on 2024-11-16 that human beings control " +
          "the decision to use nuclear weapons.",
          "The Biological Weapons Convention has been in force since 1975-03-26 and operates on " +
          "national declarations, because states rejected its verification protocol in July " +
          "2001 after six years and 24 negotiating sessions.",
          "The Convention on Certain Conventional Weapons expert group on lethal autonomous " +
          "weapons systems reports to the Seventh Review Conference, where member states decide " +
          "whether to begin treaty negotiations.",
        ] },
  C5: { head: "Cap with inspection",
        lines: [
          "Of 40 adversarial conventional arms control agreements involving Europe signed " +
          "between 1918 and 2015, 14 held fully.",
          "The International Atomic Energy Agency draws its broadest safeguards conclusion for " +
          "75 of the 138 states with an additional protocol in force.",
          "Epoch AI projects the number of models trained above 1e26 floating-point operations " +
          "rising from about 10 to more than 200 by the end of the 2020s.",
        ] },
  C6: { head: "Limit reaches expiry",
        lines: [
          "New START expired 2026-02-05, leaving the deployed strategic warheads of the United " +
          "States and Russia uncapped for the first time since 1972.",
          "Five United States arms control agreements carrying on-site inspection rights had " +
          "all ended by 2026, at a median span near 30 years from entry into force.",
          "The Joint Comprehensive Plan of Action, agreed July 2015, lost the United States on " +
          "2018-05-08 and terminated.",
        ] },
  C7: { head: "Violation while in force",
        lines: [
          "Across 40 adversarial conventional arms control agreements involving Europe signed " +
          "between 1918 and 2015, 8 drew extreme violations and 7 of those 8 contributed to an " +
          "outbreak of war.",
          "The Biological Weapons Convention has operated on national declarations since states " +
          "rejected its verification protocol in July 2001.",
          "The Soviet Union or Russia was implicated in more than half of all recorded " +
          "violations across those 40 agreements.",
        ] },
  C8: { head: "Frontier training halted",
        lines: [
          "A statement published at pacingthefrontier.com carried 1,378 signatures from " +
          "frontier-company employees, including Dario Amodei, Ilya Sutskever, Shane Legg, Jan " +
          "Leike and Chris Olah.",
          "The Wassenaar Arrangement, founded in July 1996, has 42 participating states and " +
          "decides by consensus, so any single member can block a control-list update.",
          "Russia has obstructed Wassenaar control-list updates from February 2022 onward.",
        ] },
  D1: { head: "Benchmarks outrun delivery",
        lines: [
          "The Remote Labor Index scores AI systems on 240 real freelance projects covering " +
          "more than 6,000 hours of professional work valued above $140,000, and the leading " +
          "system completed 16.1% of them at client-acceptable quality.",
          "United States business AI use has held between 17% and 20% of firms across " +
          "successive Census Bureau Business Trends and Outlook surveys, at about 37% among " +
          "firms of at least 250 employees and under 20% among firms with fewer than five.",
          "Regulation (EU) 2026/1744 deferred the AI Act's high-risk obligations to 2027-12-02 " +
          "for standalone systems and to 2028-08-02 for AI embedded in products already covered " +
          "by European Union product-safety law.",
        ] },
  D2: { head: "Error cost decides",
        lines: [
          "Customer service representative employment in the United States fell by roughly " +
          "130,000 positions in a single year, a decline of about 4.8%.",
          "Amendments to the Illinois Human Rights Act requiring notice when artificial " +
          "intelligence is used in employment decisions took effect 2026-01-01, and Colorado's " +
          "SB 26-189 replaces that state's earlier AI statute effective 2027-01-01.",
          "Standard United States general liability insurance forms now include generative-AI " +
          "exclusion endorsements, which set out the machine-produced work an insurer excludes " +
          "from cover.",
        ] },
  D3: { head: "Absorption across sectors",
        lines: [
          "About half of United States employees report using AI in their role, with 28% using " +
          "it daily or weekly.",
          "In the American Medical Association's survey, 81% of United States physicians " +
          "reported using AI in their work, and roughly two-thirds of hospitals on Epic's " +
          "records platform had deployed ambient AI documentation.",
          "United States labour productivity has grown at about 2.4% a year against a " +
          "pre-pandemic average of 1.6%, with three sectors covering 16% of hours worked " +
          "accounting for 40% of the gain.",
        ] },
  D4: { head: "Losses arrive together",
        lines: [
          "AI was cited in more than 100,000 announced United States job cuts in a year, about " +
          "22% of the total, against roughly 55,000 cited the year before, in Challenger, Gray " +
          "& Christmas reporting.",
          "Employment for United States workers aged 22 to 25 in the most AI-exposed " +
          "occupations has fallen about 13%, while employment for older workers in the same " +
          "occupations held steady or rose.",
          "An ILO and World Bank study covering 135 countries and two-thirds of global " +
          "employment puts generative-AI exposure at about 30% of employment in high-income " +
          "countries against 10% to 15% in low-income ones.",
        ] },
  E1: { head: "Revenue meets spending",
        lines: [
          "Alphabet, Amazon, Meta and Microsoft guided to roughly $725 billion of combined " +
          "annual capital expenditure, against roughly $410 billion the year before.",
          "OpenAI's annualised revenue run rate passed $40 billion, roughly double its previous " +
          "level.",
          "The International Monetary Fund estimates AI investment lifting global growth by as " +
          "much as 0.3 percentage points, and by 0.1 to 0.8 points a year over the medium term.",
        ] },
  E2: { head: "Capability gets cheap",
        lines: [
          "The price of matching GPT-4 on graduate-level science questions fell about 40 times " +
          "a year, with a median near 200 times a year across benchmarks.",
          "Output at GPT-4 quality fell from about $20 per million tokens to about $0.40 per " +
          "million tokens.",
          "Inference reached roughly two-thirds of all AI compute, up from about one-third.",
        ] },
  E3: { head: "Prices reset, building continues",
        lines: [
          "AI-linked companies account for about 45% of the S&P 500's market capitalisation, " +
          "the highest concentration recorded for a single theme in that index.",
          "Global AI-related debt issuance is heading toward $570 billion a year, and " +
          "hyperscaler bond sales ran at more than four times their historical average.",
          "British railway share prices fell roughly 85% from their peak while route mileage " +
          "built in Britain more than tripled.",
        ] },
  E4: { head: "Spending breaks early",
        lines: [
          "Training cost for the largest models doubles about every eight months, according to " +
          "Epoch AI.",
          "Nvidia was reported in talks to guarantee up to $250 billion of financing for " +
          "OpenAI's data-centre build-out, and its shares fell about 5% on the report.",
          "AI-related borrowing accounts for roughly 30% of net issuance in the United States " +
          "investment-grade corporate bond market.",
        ] },
  E5: { head: "Wages fall, demand follows",
        lines: [
          "Employment of 22-to-25-year-olds in the most AI-exposed occupations stands about 19% " +
          "below its counterfactual path and is falling about 3.8% a year, per the Stanford " +
          "Digital Economy Lab.",
          "Across three United States recessions, 88% of job losses in routine occupations fell " +
          "inside a single downturn window, and those occupations stayed smaller afterwards.",
          "Residential electricity prices in the United States rose 7.3% year on year, and " +
          "data-centre demand is estimated to have added $13.8 billion to consumer bills in the " +
          "PJM region.",
        ] },
  K1: { head: "Compressed arrival",
        lines: [
          "METR's software task suite puts the strongest agents at a 50% success horizon of " +
          "roughly 12 to 20 hours of expert time, with a doubling time near 4.3 months on the " +
          "later part of that record.",
          "Regulation (EU) 2026/1744 entered into force on 27 July 2026 and deferred the AI " +
          "Act's high-risk obligations for stand-alone systems to 2 December 2027.",
          "The United Nations panel established by Resolution A/RES/79/325 on 26 August 2025 " +
          "has 40 members and issues one assessment a year.",
        ] },
  K2: { head: "Coding first, research later",
        lines: [
          "METR's RE-Bench measured agents at about four times human experts on a two-hour " +
          "budget and human experts at about two times agents at a thirty-two-hour budget.",
          "California's SB 53 applies to developers training models above 10^26 operations, " +
          "with most requirements effective 1 January 2026 and penalties up to $1 million a " +
          "violation.",
          "An executive order of 11 December 2025 directed the United States Attorney General " +
          "to form a task force challenging state AI laws, and that task force was established " +
          "in January 2026.",
        ] },
  K3: { head: "Research stays human",
        lines: [
          "Agents automating the post-training of other models reached 25% to 28% against a " +
          "human score of 51% on the same task.",
          "The United States Food and Drug Administration lists 1,524 AI-enabled medical " +
          "devices, 76% of them in radiology, with about 95% authorised through the 510(k) " +
          "predicate route.",
          "Analysis presented at the American Society of Clinical Oncology counted 117 " +
          "AI-enabled therapeutic assets from 63 companies in human trials, of which 60 had " +
          "completed a first phase and 8 a second.",
        ] },
  P1: { head: "Adoption outruns objection",
        lines: [
          "Ipsos surveys 23,532 adults across 32 countries and finds 51% excited by AI products " +
          "against 52% nervous about them.",
          "81% of United States physicians report using AI in their work, against 38% when the " +
          "American Medical Association first asked.",
          "Over half of respondents in 20 of 21 countries in a Google-commissioned Ipsos survey " +
          "report having used an AI application.",
        ] },
  P2: { head: "Disapproval stays inert",
        lines: [
          "Pew finds 52% of Americans more concerned than excited about AI in daily life, " +
          "against 37% when the question was first asked.",
          "71% of Americans expect AI to reduce job opportunities, and Ipsos records 56% of " +
          "Europeans nervous about AI products against 29% excited.",
          "Combined annual capital-expenditure guidance from Alphabet, Amazon, Meta and " +
          "Microsoft stands near $725 billion.",
        ] },
  P3: { head: "Opposition turns local",
        lines: [
          "Gallup finds 71% of Americans opposed to an AI data centre in their area, above the " +
          "53% opposing a local nuclear plant.",
          "Data Center Watch counts at least 75 United States projects worth $130 billion " +
          "delayed or blocked in a single quarter, alongside at least 63 local moratorium " +
          "actions.",
          "United States states enacted 28 data-centre statutes in the first half of 2026, and " +
          "the Virginia Senate passed a budget bill removing a $1.6 billion data-centre tax " +
          "break.",
        ] },
  P4: { head: "Coalitions split internally",
        lines: [
          "Pew finds 54% of Republicans and 34% of Democrats calling United States leadership " +
          "in AI extremely or very important, a 20-point gap.",
          "A statement asking the United States government to support deliberate pacing of " +
          "automated AI development carried 1,378 signatures from frontier-company employees.",
          "Twelve states enacted AI companion-chatbot laws in the first half of 2026, and 33 " +
          "states have laws addressing deepfakes in political communication.",
        ] },
  P5: { head: "Restriction wins office",
        lines: [
          "Gallup finds 71% of Americans opposed to an AI data centre in their area, above the " +
          "53% opposing a local nuclear plant.",
          "Representatives Greg Casar and Doris Matsui demanded sworn testimony from the chief " +
          "executives of OpenAI and Anthropic.",
          "33 states have enacted laws on deepfakes in political communication, and courts " +
          "struck down California's and Hawaii's versions on First Amendment grounds.",
        ] },
  R1: { head: "Self-set limits",
        lines: [
          "More than twenty organisations signed the European Union General-Purpose AI Code of " +
          "Practice, among them Amazon, Anthropic, Google, IBM, Microsoft, Mistral AI and " +
          "OpenAI.",
          "xAI signed the code's safety and security chapter alone, and Meta declined to sign, " +
          "citing legal uncertainty.",
          "An executive order signed June 2026 directs a framework under which developers " +
          "voluntarily grant the federal government access to covered frontier models for 30 " +
          "days before deployment.",
        ] },
  R2: { head: "Many rulebooks at once",
        lines: [
          "United States states enacted 109 AI laws in the first half of 2026, drawn from more " +
          "than 1,500 bills introduced across 45 states.",
          "Colorado's SB 189, signed 2026-05-14 and effective 2027-01-01, requires notice, " +
          "human review and three-year records where an automated system materially influences " +
          "a major employment decision.",
          "China's measures for labelling AI-generated and synthetic content took effect " +
          "September 2025, requiring visible labels on generated text, images, audio and video " +
          "plus hidden markers in file metadata.",
        ] },
  R3: { head: "One national standard",
        lines: [
          "Executive Order 14365, signed 2025-12-11, directed the Department of Justice to " +
          "challenge state AI laws in federal court, and conditioned some federal broadband " +
          "funds on states pausing those laws.",
          "Executive Order 14365 exempts three subjects from its preemption effort: child " +
          "safety, computing and data-centre infrastructure, and state government procurement " +
          "of AI.",
          "Preemption of state law is a power of Congress, and Congress enacted no AI " +
          "preemption statute through August 2026.",
        ] },
  R4: { head: "Approval before release",
        lines: [
          "The United States Department of Commerce ordered Anthropic on 2026-06-12 to block " +
          "foreign nationals from Claude Fable 5 and Mythos 5, the first restriction on foreign " +
          "access to a commercially available model service, and it lifted 2026-06-30.",
          "OpenAI limited its 2026-06-26 launch of GPT-5.6 Sol, Terra and Luna to about twenty " +
          "government-vetted organisations at the request of the White House Office of the " +
          "National Cyber Director, opening it publicly.",
          "A White House official stated that the administration gave no approval or clearance " +
          "for that release, and that such decisions rest with the companies.",
        ] },
  R5: { head: "Enforced civil duties",
        lines: [
          "European Union AI Act Article 73 requires providers to report serious incidents " +
          "within 15 days of awareness, and within 10 days where a person has died, from " +
          "2026-08-02.",
          "Commission enforcement of general-purpose AI obligations begins 2026-08-02, with " +
          "fines reaching 3% of worldwide annual turnover or 15 million euro.",
          "The United States Food and Drug Administration list of authorised AI-enabled medical " +
          "devices held 1,451 entries in March 2026, with radiology the largest share and no " +
          "entry powered by a large language model.",
        ] },
  R6: { head: "Deadlines that move",
        lines: [
          "The European Union digital omnibus set 2027-12-02 for stand-alone high-risk AI " +
          "system obligations and 2028-08-02 for AI embedded in regulated products.",
          "Colorado delayed its AI Act from 2026-02-01 to 2026-06-30, and then to 2027-01-01 " +
          "under SB 189, signed 2026-05-14.",
          "The Council of Europe Framework Convention on Artificial Intelligence, opened for " +
          "signature 2024-09-05, requires five ratifications including three from Council of " +
          "Europe member states before entering into force.",
        ] },
  S1: { head: "Few owners, cheap access",
        lines: [
          "Alphabet, Amazon, Meta and Microsoft guided to roughly $725 billion of combined " +
          "capital expenditure for one year, against roughly $410 billion the year before.",
          "Epoch AI measures the computing power used to train frontier models growing four to " +
          "five times a year since 2018, and the price of a fixed level of capability falling " +
          "by roughly ten to forty times a year.",
          "A University of Oxford study counts 32 countries hosting a specialised AI data " +
          "centre, with operators from the United States and China running more than 90% of " +
          "them.",
        ] },
  S2: { head: "Sovereign capacity spreads",
        lines: [
          "The Commerce Department moved the United Arab Emirates into Country Group A:5 on 10 " +
          "July 2026, naming G42, Core42 and eight American companies as approved recipients of " +
          "advanced chips without a licence.",
          "India's IndiaAI Mission subsidises more than 38,000 accelerators and offers " +
          "computing time at roughly one dollar per GPU-hour, and the European Union's InvestAI " +
          "programme targets €200 billion toward large public facilities.",
          "Epoch AI measures openly published models trailing the leading closed models by " +
          "about four months on its capabilities index, down from close to a year.",
        ] },
  S3: { head: "Electricity sets the pace",
        lines: [
          "Gallup surveyed 1,000 United States adults and found 71% opposed to an AI data " +
          "centre in their area, against 53% opposed to a local nuclear plant.",
          "Data Center Watch counted at least 75 projects worth $130 billion delayed or blocked " +
          "in a single quarter, alongside at least 63 local moratorium measures.",
          "The Energy Information Administration forecasts the strongest four-year growth in " +
          "United States electricity demand since 2000 and attributes it to data centres, which " +
          "take roughly 4.5% of national supply.",
        ] },
  S4: { head: "Licences draw the line",
        lines: [
          "A Bureau of Industry and Security rule of 13 January 2026 cleared roughly ten " +
          "Chinese companies to buy Nvidia H200 accelerators at up to 75,000 chips each, under " +
          "a 25% export levy.",
          "A United States government evaluation placed China's leading model about eight " +
          "months behind the leading American model.",
          "Huawei targets roughly 600,000 units of its Ascend 910C accelerator in a year, with " +
          "SMIC advanced-node capacity moving toward 60,000 wafers a month.",
        ] },
  S5: { head: "Fabrication interrupted",
        lines: [
          "A full year of TSMC's advanced-packaging capacity was allocated before that year " +
          "began, with the gap between demand and supply running near 20%.",
          "TSMC has committed to ten fabs and two advanced-packaging plants in the United " +
          "States, with roughly 30% of its 2-nanometre and more advanced capacity planned for " +
          "Arizona.",
          "Qualifying a new leading-edge production line takes 18 to 24 months, which sets the " +
          "floor on recovery from any interruption.",
        ] },
  T1: { head: "Loop closes early",
        lines: [
          "METR measures a frontier 50% time horizon of about twelve hours on software tasks, " +
          "with published doubling times between four and seven months and unreliable " +
          "measurement above sixteen hours.",
          "Anthropic reports Claude authoring more than 80% of the code merged into its " +
          "production systems.",
          "Epoch AI measures frontier training compute growing four to five times a year, with " +
          "the count of models trained above 1e26 FLOP rising about twentyfold across the " +
          "second half of the 2020s.",
        ] },
  T2: { head: "Crossing before 2032",
        lines: [
          "Three forecasters running one shared model and one shared dataset return medians for " +
          "an automated AI researcher that span 26 months.",
          "The Remote Labor Index, which scores AI on real freelance projects judged by the " +
          "clients who commissioned them, rose from 2.5% to 15.8% completion in eight months.",
          "European Union AI Act obligations for general-purpose models applied from 2 August " +
          "2025, with serious-incident reporting under Article 73 from 2 August 2026.",
        ] },
  T3: { head: "Slowdown then crossing",
        lines: [
          "A study spanning more than 400,000 GPU-hours fits sigmoidal curves to " +
          "reinforcement-learning training and finds recipe changes moving compute efficiency " +
          "while leaving the asymptote in place.",
          "More than 1,800 Metaculus forecasters place the median arrival of a first general AI " +
          "system in the early 2030s.",
          "Epoch AI's capabilities index rose about 15.5 points a year in its latest update, " +
          "against about 8 points a year before 2024.",
        ] },
  T4: { head: "Physical inputs bind",
        lines: [
          "Researchers estimate the quality-adjusted stock of public human text at about 300 " +
          "trillion tokens, with training datasets projected to match it before the 2030s.",
          "Gallup found 71% of surveyed United States adults opposed to an AI data centre in " +
          "their area, against 53% opposing a local nuclear plant.",
          "Epoch AI projects the largest single training runs drawing 4 to 16 gigawatts, " +
          "comparable to the electricity demand of a mid-sized country.",
        ] },
  T5: { head: "Ceiling under method",
        lines: [
          "A study spanning more than 400,000 GPU-hours finds reinforcement-learning recipes " +
          "differing in their asymptote, with efficiency choices leaving that asymptote in " +
          "place.",
          "A survey of 475 AI researchers published by an AAAI presidential panel found 76% " +
          "judging it unlikely or very unlikely that scaling current approaches yields general " +
          "intelligence.",
          "Frontier task horizons are measured unreliably above sixteen hours on current task " +
          "suites, so a genuine plateau and a measurement limit look alike at the top of the " +
          "range.",
        ] },
};
