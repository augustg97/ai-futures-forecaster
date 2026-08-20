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
    m: 'It set the pattern that has held since: a general method, given more computation, beat ' +
        'features built by hand.' },
  { y: 2014.05, lane: 'capital', k: 'DeepMind acquired',
    t: 'Google acquired DeepMind in January 2014 for a reported $500 million, with about fifty ' +
        'staff and no product.',
    m: 'For the first time, a buyer set the price of frontier research at what it might be worth ' +
        'to own rather than what it cost to run.' },
  { y: 2015.95, lane: 'buildout', k: 'OpenAI founded',
    t: 'OpenAI opened in December 2015 as a non-profit with $1 billion pledged behind it.',
    m: 'The private laboratory became the address for every later demand about how these systems ' +
        'should be governed.' },
  { y: 2016.2, lane: 'capability', k: 'AlphaGo',
    t: 'AlphaGo beat Lee Sedol 4–1 in March 2016, ten years earlier than most expert estimates ' +
        'for the game.',
    m: 'A watching world learned that expert forecasts of a capability can be wrong by ten ' +
        'years, and wrong on the early side.' },
  { y: 2017.5, lane: 'capability', k: 'Transformer',
    t: '"Attention Is All You Need" appeared in June 2017; it replaced recurrence with attention ' +
        'and made training parallel across a whole sequence.',
    m: 'Every frontier system built since rests on that architecture.' },
  { y: 2017.55, lane: 'buildout', k: 'China national plan',
    t: "China's State Council published the New Generation AI Development Plan in July 2017, " +
       'setting a target of world leadership by 2030.',
    m: 'Frontier AI became an object of state industrial policy, and the two governments have ' +
      'competed on it openly ever since.' },
  { y: 2018.9, lane: 'capability', k: 'BERT and transfer',
    t: 'After BERT appeared in October 2018, pre-training one model and then fine-tuning it for ' +
        'each task became the standard recipe across language work.',
    m: 'One model, trained once, could now be turned to many different tasks — the fact that ' +
        'gives the word general its meaning.' },
  { y: 2019.1, lane: 'oversight', k: 'GPT-2 staged release',
    t: 'OpenAI withheld the full GPT-2 weights in February 2019, citing misuse risk, and ' +
        'released them in stages over nine months.',
    m: 'A laboratory argued its release decision in public on safety grounds for the first time; ' +
        'releasing in stages has been a practice ever since.' },
  { y: 2019.55, lane: 'capital', k: 'Microsoft and OpenAI',
    t: 'Microsoft invested $1 billion in OpenAI in July 2019 and became its exclusive cloud ' +
        'provider.',
    m: 'It tied frontier research to the balance sheets of the cloud giants, the arrangement ' +
        'under which everything expensive has been built since.' },
  { y: 2020.05, lane: 'capability', k: 'Scaling laws',
    t: 'Kaplan and colleagues published neural scaling laws in January 2020: loss falls as a ' +
        'power law in compute, data and parameters, across seven orders of magnitude.',
    m: 'Capability became a question of budget rather than of research, which is why the supply ' +
        'of computation now sets the pace.' },
  { y: 2020.45, lane: 'capability', k: 'GPT-3',
    t: 'GPT-3 appeared in May 2020 at 175 billion parameters and did tasks it had never been ' +
        'trained for, on a written instruction alone.',
    m: 'Scale alone, for the first time, had produced capabilities nobody set out to build.' },
  { y: 2020.92, lane: 'capability', k: 'AlphaFold 2',
    t: 'AlphaFold 2 reached experimental accuracy at CASP14 in November 2020, on a problem open ' +
        'for fifty years.',
    m: 'The approach carried over into natural science, where the questions come from nature ' +
        'rather than from a benchmark.' },
  { y: 2021.6, lane: 'capability', k: 'Codex and Copilot',
    t: 'OpenAI released Codex and GitHub launched Copilot in 2021, putting code generation into ' +
        'daily professional use.',
    m: 'Programming became the first skilled work these systems did daily; it is also where the ' +
        'compounding starts, since a machine that writes code can help build its successor.' },
  { y: 2022.25, lane: 'capability', k: 'Chinchilla',
    t: 'The Chinchilla result of March 2022 showed the models of the day to be badly ' +
        'undertrained for their size: data and parameters should grow together.',
    m: 'The finding re-priced the frontier, buying the same capability for less computation; it ' +
        'also made the division of a training budget an open research question.' },
  { y: 2022.92, lane: 'capability', k: 'ChatGPT',
    t: 'OpenAI released ChatGPT on 30 November 2022; an estimated hundred million people were ' +
        'using it within two months.',
    m: 'Carrying the largest single jump in capability the public has met, ChatGPT turned the ' +
        'technology\'s future from a specialist question into a public argument.' },

  // ── the frontier era ──────────────────────────────────────────────────────
  { y: 2023.2, lane: 'capability', k: 'GPT-4',
    t: 'GPT-4 arrived in March 2023, passing professional examinations near the top of the human ' +
        'range; its technical report withheld the architecture and the training data.',
    m: 'With that report, public disclosure of how a frontier model is built ended, leaving ' +
        'everyone outside the labs to judge these models by testing their behaviour.' },
  { y: 2023.83, lane: 'buildout', k: 'Executive order 14110',
    t: 'President Biden signed executive order 14110 on 30 October 2023, requiring developers to ' +
        'report safety tests for models trained above a compute threshold.',
    m: 'It put the first compute threshold into law anywhere in the world, and every line drawn ' +
        'since has answered that one.' },
  { y: 2023.84, lane: 'oversight', k: 'Bletchley',
    t: 'Twenty-eight countries and the EU signed the Bletchley Declaration on 1 November 2023, ' +
        'the first joint statement on frontier risk to include both the US and China.',
    m: 'The summit series it began still carries what coordination governments manage, and it ' +
        'showed what a signed declaration delivers: common language, and a date to meet again.' },
  { y: 2024.25, lane: 'buildout', k: 'EU AI Act',
    t: 'The European Parliament adopted the AI Act in March 2024; it entered into force on 1 ' +
        'August 2024, with obligations phased in to 2027.',
    m: 'Europe\'s statute, the first comprehensive law of its kind, made regional divergence a ' +
        'fact of business: the same model now meets different rules in different markets.' },
  { y: 2024.7, lane: 'capability', k: 'Reasoning models',
    t: 'OpenAI released o1 in September 2024, trained to spend computation on a chain of ' +
        'reasoning before answering.',
    m: 'A second lever now stands beside the training run: computation spent while the model ' +
        'answers, which opens a path faster than the trend to 2024 implied.' },
  { y: 2024.78, lane: 'oversight', k: 'Nobel prizes',
    t: 'The 2024 Nobel prizes in physics and chemistry went to work on neural networks and on ' +
        'protein structure prediction.',
    m: 'Science\'s most established prize judged the work by what it had already delivered.' },
  { y: 2025.06, lane: 'capital', k: 'DeepSeek R1',
    t: 'DeepSeek released R1 on 20 January 2025, matching frontier reasoning performance at a ' +
        'reported $5.6 million final training run. Nvidia fell about 17% on 27 January, a day ' +
        'that took roughly a trillion dollars off US markets.',
    m: 'DeepSeek showed that a frontier capability could be reproduced cheaply, unsettling every ' +
        'forecast that rests on the price of computation.' },
  { y: 2025.07, lane: 'capital', k: 'Stargate',
    t: 'The Stargate datacenter programme arrived on 21 January 2025 with $500 billion pledged ' +
        'over four years, one day after DeepSeek released R1.',
    m: 'Investors committed to scale in the same week that scale proved cheaper than assumed; ' +
        'both bets are still running.' },
  { y: 2025.5, lane: 'capability', k: 'Agents in production',
    t: 'Through 2025 the frontier labs shipped agents that browse, call tools, edit files and ' +
        'carry a task across many steps; on real repository issues, benchmark scores passed 77%.',
    m: 'Agents that work unsupervised through long tasks entered daily production use, where ' +
        'paying customers judged them.' },
  { y: 2025.58, lane: 'buildout', k: 'GPAI obligations',
    t: "The EU AI Act's general-purpose model obligations applied from 2 August 2025, with a " +
       'code of practice for signatories.',
    m: 'First binding conduct rules on frontier developers anywhere.' },

  // ── the year in progress ──────────────────────────────────────────────────
  { y: 2026.08, lane: 'capital', k: 'Capital doubles again',
    t: 'The five largest US cloud and AI infrastructure providers guided to capital spending of ' +
        '$660 to $690 billion for 2026, close to double the 2025 figure, about three-quarters of ' +
        'it AI infrastructure.',
    m: 'Spending on that scale moved the binding constraint from money to electricity.' },
  { y: 2026.14, lane: 'oversight', k: 'Safety report',
    t: 'More than a hundred researchers published the second International AI Safety Report in ' +
        'February 2026, with over thirty governments behind it.',
    m: 'Governments and researchers now argue from one standing account of what the science ' +
        'shows about these risks.' },
  { y: 2026.22, lane: 'buildout', k: 'Preemption framework',
    t: 'The White House issued a national AI legislative framework on 20 March 2026, calling on ' +
        'Congress to preempt state AI laws it judged unduly burdensome.',
    m: 'It opened the fight that will decide whether the United States governs this technology ' +
        'once or fifty times over.' },
  { y: 2026.31, lane: 'capital', k: 'Nvidia at $5 trillion',
    t: 'Nvidia closed at an all-time high on 24 April 2026 at a market capitalisation of $5.06 ' +
        'trillion. DeepSeek released V4 the same day, open-sourcing both checkpoints.',
    m: 'One company\'s grip on the supply of computation and the free release that periodically ' +
        'loosens it fell on the same day.' },
  { y: 2026.33, lane: 'buildout', k: 'Defence agreements',
    t: 'The US Department of War finalised agreements with eight AI model and infrastructure ' +
        'companies on 1 May 2026.',
    m: 'The most capable systems now reach the state as purchases, the arrangement out of which ' +
        'a national programme would grow.' },
  { y: 2026.37, lane: 'buildout', k: 'Colorado narrowed',
    t: 'Colorado repealed and replaced its AI act on 14 May 2026 with a narrower statute on ' +
        'automated decisions, effective 1 January 2027.',
    m: 'Colorado became the first state to write a comprehensive AI statute and then retreat ' +
        'from it before the law took effect.' },
  { y: 2026.42, lane: 'buildout', k: 'Executive order and FERC',
    t: 'A June 2026 executive order directed frontier developers to give the federal government ' +
        'early access to new models. A transmission waiver from the Federal Energy Regulatory ' +
        'Commission that month cleared the last obstacle to restarting Three Mile Island Unit 1 ' +
        'for datacenter load.',
    m: 'One government settled access to the models and access to the electricity within a ' +
        'single month.' },
  { y: 2026.18, lane: 'oversight', k: 'Supply chain risk',
    t: 'The Department of War wrote to Anthropic in letters dated 3 March 2026, designating the ' +
        'company a supply chain risk, the first such designation applied to an American company, ' +
        'after Anthropic declined to waive contract terms barring mass domestic surveillance and ' +
        'fully autonomous weapons. Anthropic sued in two federal courts on 9 March 2026.',
    m: 'A developer held a state customer to stated limits on use and paid for it in procurement ' +
        'standing, the shape this relationship takes once a government treats a laboratory as ' +
        'infrastructure.' },
  { y: 2026.45, lane: 'buildout', k: 'Fable and Mythos withdrawn',
    t: 'The Bureau of Industry and Security issued an "is informed" letter under the Export ' +
        'Control Reform Act on 12 June 2026, requiring an individually validated licence before ' +
        'any foreign national could use Claude Fable 5 or Mythos 5. Anthropic disabled both ' +
        'models worldwide three days after launch, disputing the severity of the jailbreak ' +
        'finding on which the order rested.',
    m: 'A single letter put a shipped model under the licensing that governs chips; software now ' +
        'crosses borders through a channel the state opens one licence at a time.' },
  { y: 2026.52, lane: 'capability', k: 'GPT-5.6',
    t: 'OpenAI released the GPT-5.6 family on 9 July 2026 in three tiers.',
    m: 'Here the frontier stands today, and every forecast of what comes next measures from it.' },
  { y: 2026.59, lane: 'buildout', k: 'Transparency obligations',
    t: "The EU AI Act's transparency obligations applied from 2 August 2026, and the " +
       'Commission began enforcing the general-purpose code of practice the same month. US ' +
       'states began repealing datacenter tax breaks.',
    m: 'Regulation and the price of computation moved in the same season, and firms have had to ' +
      'plan against both together.' },
  { y: 2026.6, lane: 'oversight', k: 'Containment disclosures',
    t: "Britain's AI Security Institute reported a containment finding on 4 August 2026, " +
       'alongside disclosures from OpenAI and Anthropic.',
    m: 'A public institute, rather than a laboratory, produced the finding; independent testing ' +
      'had begun to reach conclusions the labs did not announce.' },
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
  capability: 'No measured capability step falls in these years.',
  buildout: 'No build-out or governance step falls in these years.',
  capital: 'No capital step falls in these years.',
  oversight: 'No oversight step falls in these years.',
};

// ── today ───────────────────────────────────────────────────────────────────────────
// THE CURRENT YEAR IS RECORD, AND IT IS THE YEAR A READER LOOKS AT FIRST. The sheet ran its
// forecast machinery here, so 2026 printed whichever branch the controls had selected:
// "savings tied to AI companies lose most of their value", against a record in which the
// semiconductor index is up over 70% on the year and Nvidia set an all-time closing high in May.
// August: "2026 should reflect our current state and the record of 2026 so far."
//
// Every figure below was checked against primary sources on 2026-08-19, and where the counting
// bodies disagree the passage gives the range and names them. The largest correction went the
// opposite way from the one expected: the sheet said "more than a hundred local moratoria" and
// the systematic dataset holds roughly 420 in force.
export const TODAY_HEADLINE = 'The best model METR has timed finishes 17.4 hours of expert work at even odds, though agents ' +
  'complete only 16% of real freelance jobs. The four largest hyperscalers guide to roughly ' +
  '$725–745bn of capital spending this year, against about $410bn in 2025. Brussels postponed ' +
  'its high-risk duties to December 2027, easing what industry must do, while New York and ' +
  'Texas halted data-centre permitting to restrict what it may build. Roughly 420 local ' +
  'moratoria now stand in force, and every national poll this year finds between 47% and 71% of ' +
  'Americans against a data centre near them.';

export const TODAY = [
  { lead: 'System capabilities.',
    text: 'METR, which times models against human baselines, puts its best-measured model, Claude ' +
          'Mythos Preview, at a fifty-per-cent time horizon of 1,044.8 minutes — 17.4 hours — ' +
          'inside a confidence interval running from 8.5 to 55 hours. At eighty-per-cent success ' +
          'the same model holds three hours and six minutes. METR calls measurements above ' +
          'sixteen hours unreliable, excludes them from its own trend fit, and defines the metric ' +
          'as serial human labour replaced at even odds, which leaves a supervisor behind every ' +
          'run. Doubling estimates depend on the window fitted: 187.8 days across all time, 128.7 ' +
          'days from 2023, 89 days from 2024, and METR publishes all three.' },
  { lead: 'System capabilities.',
    text: 'Machines write most new code inside the two firms that publish figures. Sundar Pichai ' +
          'put AI-generated, engineer-approved code at 75% of new code at Google on 22 April, up ' +
          'from fifty% last autumn; Anthropic reported more than eighty% of merged code authored ' +
          'by Claude as of May. Beyond those two the number is a self-report: DX, which surveys ' +
          'several hundred engineering organisations each quarter, found 51.9% in the second ' +
          'quarter against 27.4% in the first, and describes the measure as the share of coding ' +
          'workload delegated. Microsoft\'s last public figure, twenty to thirty%, dates from ' +
          'April 2025.' },
  { lead: 'System capabilities.',
    text: 'The Remote Labor Index, built by the Center for AI Safety with Scale AI, grades agents ' +
          'on 240 real freelance projects by whether a paying client would accept the ' +
          'deliverable; Claude Fable 5 clears 16.1%, against 2.5% for the best model in October ' +
          '2025. Scale\'s own leaderboard reads 15.80%, counting the 22 projects left unscored ' +
          'during June\'s export-control suspension as failures. Research loops now run end to ' +
          'end: Analemma\'s agents produced 166 papers in 417 hours at about $1,120 each, and 282 ' +
          'expert reviews of 140 of them returned a mean rating of 3.17 out of ten, with 11.4% of ' +
          'papers reaching six and integrity violations flagged in 16.7% of reviews. Sakana AI\'s ' +
          'AI Scientist reached Nature on 26 March, its milestone one machine-written manuscript ' +
          'passing first-round review at a workshop that accepts seventy% of submissions.' },
  { lead: 'Build-out and governance.',
    text: 'Capital spending guidance rose all year. Alphabet moved three times — $175–185bn in ' +
          'February, $180–190bn in April, $195–205bn on 22 July, the last raise dropping its ' +
          'shares five to eight%. Amazon lifted full-year cash capital spending from about $200bn ' +
          'to about $220bn on 30 July and passed a $3tn market capitalisation on the news; ' +
          'Microsoft held near $190bn for calendar 2026; Meta narrowed to $130–145bn, raising its ' +
          'floor each time. The four together now guide to roughly $725–745bn against about ' +
          '$410bn in 2025, an increase near seventy-seven%, and J.P. Morgan counts the top five ' +
          'at $697bn, up $173bn since January — totals in circulation run from about $690bn to ' +
          '$760bn, depending on whether four or five firms are counted and whether finance leases ' +
          'sit inside the figure.' },
  { lead: 'Build-out and governance.',
    text: 'Local government has paused the buildings in bulk. The Moratorium Nation dataset, an ' +
          'open sweep of about 4,600 primary ordinance files across all fifty states, holds 533 ' +
          'instruments as of 31 July, of which 472 data-centre moratoria have been enacted and ' +
          'roughly 420 remain in force; 387 carry a 2026 adoption date, rising month by month ' +
          'from 24 in January to 126 in June. The project\'s own prose gives 294 for 2026, a ' +
          'third below its shipped data, so the defensible statement is a range of 294 to 387; ' +
          'Brookings puts the floor at 100 localities, electricchoice.com counts 225 instruments ' +
          'with 151 in force, and datacenterbans.com counts states instead, at eighteen of fifty ' +
          'restricting or considering restrictions. These are terms, not bans: six of 472 run ' +
          'indefinitely, the median term is 365 days, and the typical instrument suspends permits ' +
          'while the jurisdiction writes zoning — a regulatory gap is the leading coded trigger ' +
          'at eighty-six%, against grid and energy at twenty-six and water at twenty-three.' },
  { lead: 'Build-out and governance.',
    text: 'States then acted above the towns. Governor Hochul signed New York Executive Order 62 ' +
          'on 14 July, the first statewide data-centre moratorium in the United States, pausing ' +
          'discretionary permits from the Department of Environmental Conservation for up to a ' +
          'year while the state prepares a generic environmental impact statement; she took that ' +
          'route in place of signing S10642, which had passed the Senate 44–16 and the Assembly ' +
          '102–39 on 4 June. Maine\'s legislature passed a moratorium and Governor Mills vetoed ' +
          'it on 24 April, the override falling short at 20–11 in the Senate. Governor Abbott ' +
          'ordered the Public Utility Commission of Texas and ERCOT on 3 August to audit every ' +
          'data centre in the interconnection queue — roughly 474 GW of requests, more than five ' +
          'times the grid\'s record peak — before further projects advance, and ERCOT suspended ' +
          'its Batch Zero large-load notifications. Data Center Watch, a project of the ' +
          'intelligence firm 10a Labs, counted at least 75 projects worth about $130bn blocked or ' +
          'delayed in the first quarter alone, with active opposition groups rising from 396 at ' +
          'the end of 2025 to 833 by March; that figure covers January to March, and the firm has ' +
          'published nothing later.' },
  { lead: 'Capital and employment.',
    text: 'Three selloffs hit AI-linked equities — software in February, semiconductors in June, ' +
          'momentum in July — and the indexes finished each of them higher. On 5 June the PHLX ' +
          'semiconductor index fell about ten% in a session, erasing $1.3–1.4tn of chip value, ' +
          'and closed that same day seventy% up on the year; the Nasdaq fell 3.2% in July, its ' +
          'worst July in twenty years. By mid-August the S&P 500, Dow, Nasdaq and Russell 2000 ' +
          'all stood at records, the S&P closing at 7,798.99 on 13 August. Dispersion is the ' +
          'year\'s real signature: Micron up 260% by 2 July and SanDisk up 670% in early June, ' +
          'against Oracle down about thirty-five%, Salesforce down forty, and SK Hynix down about ' +
          'forty-seven% from its June high.' },
  { lead: 'Capital and employment.',
    text: 'The underlying businesses grew through the drawdowns. Nvidia set an all-time closing ' +
          'high of $235.47 on 14 May at a market capitalisation near $5.5tn, fell about eighteen% ' +
          'to $192.53 by 26 June, and closed at $219.74 on 18 August; its quarter ended 26 April ' +
          'brought record revenue of $81.6bn, up eighty-five%, with data-centre revenue up ' +
          'ninety-two% and guidance of $91bn. CoreWeave reported second-quarter revenue of ' +
          '$2.575bn, up 112%, a $104bn backlog, a $626m net loss and $35.6bn of debt, raised ' +
          'full-year guidance, and rose nineteen% on 12 August — with its five-year credit ' +
          'default swaps near 855bp on 29 July, Oracle\'s at about 203bp, and a Moody\'s warning ' +
          'in July over roughly $460bn of direct debt and about $1.2tn of lease commitments ' +
          'across six firms. Private valuations rose: OpenAI closed a $122bn round in March at ' +
          '$852bn and completed a roughly $7bn employee tender at that same valuation on 10 ' +
          'August, and Anthropic reached $380bn post-money in February. One levered pool did ' +
          'collapse — Leopold Aschenbrenner\'s Situational Awareness fund fell sixty-seven% in ' +
          'July, shrank from about $45bn to about $10bn, sold its book to Citadel at a reported ' +
          'ten% discount on 30 July, and remains up eighty% on the year.' },
  { lead: 'Oversight and public opinion.',
    text: 'Seven national surveys fielded in 2026 find majorities against a data centre nearby, ' +
          'ranging from 47 to 71%. Gallup, polling 1,000 adults in March, found 71% opposed with ' +
          '48% strongly so; Heatmap Pro and Embold Research reached the same 71% among 4,118 ' +
          'registered voters in May; Fox News found 70% in July, Emerson 63, the Annenberg Public ' +
          'Policy Center 61, and Redfin and Ipsos 47 in May, rising to 53 by July. The spread ' +
          'follows the wording — surveys asking about a neighbourhood and sampling residents sit ' +
          'low, surveys asking about a home or an area and sampling voters sit high. Opposition ' +
          'crosses party in every poll that breaks it out: Annenberg finds majorities of ' +
          'Democrats, Republicans and independents opposed, Fox finds MAGA Republicans only 46% ' +
          'in favour, and Heatmap\'s own question moved from 43% support in September 2025 to 71% ' +
          'opposition in May, a forty-nine-point swing in nine months that Emerson, Annenberg and ' +
          'Redfin each reproduce at their own slope.' },
];

const TODAY_YEAR = 2026;

export function describeRecord(year, trunkCap) {
  const yr = Math.floor(year);
  if (yr === TODAY_YEAR) return TODAY.map((q) => ({ lead: q.lead, text: q.text }));
  const near = recordAt(year, 1.4);
  const out = [];
  const cap = trunkCap ? trunkCap(year) : null;
  for (const lane of LANES) {
    const mine = near.filter((e) => e.lane === lane).slice(0, 2);
    const bits = [];
    if (lane === 'capability' && cap != null) {
      // A CLAUSE MAY NOT TALK ABOUT THE DRAWING. "on the scale ruled across this sheet, which
      // is what the record supports for this date" describes the instrument twice and the world
      // not at all. The rung the figure names is the thing worth saying.
      bits.push(`Measured capability stands at ${cap.toFixed(2)}, where 3.0 marks a machine ` +
                'that writes better code than any human engineer and 4.0 one that runs its own ' +
                'research.');
    }
    if (!mine.length) bits.push(NOTHING[lane]);
    const stop = (t) => String(t).replace(/\s*$/, '').replace(/([^.!?])$/, '$1.');
    for (const e of mine) bits.push(`${stop(e.t)} ${stop(e.m)}`);
    out.push({ lead: LEAD[lane], text: bits.join(' ') });
  }
  // What the reader is looking at, said once: this is record, and the settings do not apply.
  const ahead = RECORD.filter((e) => e.y > year).length;
  out.push({ lead: 'Reading this date.',
    text: `${yr} is on the record. The controls set a future; they cannot change what has ` +
          `happened, and nothing on this date is sampled. ${ahead} further recorded ` +
          `step${ahead === 1 ? '' : 's'} fall between here and today, and the forecast begins ` +
          'to the right of the TODAY rule.' });
  return out;
}

export function headlineRecord(year, trunkCap) {
  const yr = Math.floor(year);
  if (yr === TODAY_YEAR) return TODAY_HEADLINE;
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
  const stop = (t) => String(t).replace(/\s*$/, '').replace(/([^.!?])$/, '$1.');
  const parts = [`In ${yr}, ${capBit}.`, stop(lead.t), stop(lead.m)];
  if (second) parts.push(stop(second.t));
  return parts.join(' ');
}
