const gNews = (q) =>
  `https://news.google.com/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`

export const INDICATORS = {
  'fed-funds': {
    id: 'fed-funds',
    label: 'Federal Funds Rate',
    category: 'Monetary Policy',
    fredId: 'FEDFUNDS',
    frequency: 'monthly',
    dataType: 'latest',
    unit: '%',
    precision: 2,
    showSign: false,
    chartLimit: 48,
    description: 'The overnight rate banks charge each other to borrow reserves, set by the FOMC at 8 meetings per year.',
    textbook: 'Monetary Policy · Taylor Rule · FOMC',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 4.5) return { label: 'Restrictive', color: 'amber' }
      if (v >= 2) return { label: 'Neutral', color: 'slate' }
      return { label: 'Accommodative', color: 'blue' }
    },
    what: [
      'The Federal Funds Rate is the interest rate at which banks lend their excess reserve balances to other banks overnight. The Federal Open Market Committee (FOMC) meets eight times per year to vote on a target range for this rate.',
      'The Fed achieves its target using open market operations: buying Treasury securities injects reserves (pushing rates down), while selling drains reserves (pushing rates up). Since 2008, the Fed also pays Interest on Reserve Balances (IORB), giving it additional precision.',
      "The Federal Funds Rate is often called the most important interest rate in the world. Changes ripple through the entire economy — influencing mortgage rates, auto loans, corporate bond yields, and the relative attractiveness of stocks vs. bonds.",
    ],
    howCalculated: {
      formula: `Target Rate = FOMC vote, announced 8× per year (e.g., 5.25%–5.50%)

Effective Rate = Volume-weighted median of overnight interbank transactions

Taylor Rule benchmark:
  Rate ≈ 2% + Inflation + 0.5×(Inflation − 2%) + 0.5×Output Gap`,
      example: `Given: Inflation = 3.0%, Output Gap = +1.0%

Taylor Rule:
  Rate ≈ 2% + 3% + 0.5×(3%−2%) + 0.5×(1%)
       = 2% + 3% + 0.5% + 0.5% = 6.0%

If current rate is 5.25%, the Taylor Rule suggests policy is slightly loose.`,
    },
    whyMatters: [
      { heading: 'Borrowing costs across the economy', text: 'Every variable-rate loan — mortgages, credit cards, business lines of credit — is anchored to the Fed Funds Rate. A 1% increase can add hundreds of dollars per month to a typical adjustable mortgage.' },
      { heading: 'Stock and bond valuations', text: 'Higher rates increase the discount rate in DCF models, reducing the present value of future cash flows. Growth stocks (earnings far in the future) are especially sensitive to rate hikes.' },
      { heading: 'Dollar strength and global capital flows', text: 'Higher US rates attract foreign capital seeking yield, strengthening the dollar. A stronger dollar lowers import prices (disinflationary) but hurts US exporters.' },
    ],
    thresholds: [
      { label: 'Accommodative', range: 'Below 2%', color: 'blue', text: 'Policy is stimulating the economy with cheap money. Typical during recessions and crises. Risk: can fuel asset bubbles and inflation.' },
      { label: 'Neutral', range: '2% – 4.5%', color: 'slate', text: 'Policy is neither stimulating nor restricting growth. The Fed is near its estimated long-run neutral rate (r-star).' },
      { label: 'Restrictive', range: 'Above 4.5%', color: 'amber', text: 'Policy is actively cooling the economy. Elevated borrowing costs are designed to reduce demand and bring inflation back to 2%.' },
    ],
    resources: [
      { title: 'Federal Funds Rate — Investopedia', url: 'https://www.investopedia.com/terms/f/federalfundsrate.asp', tag: 'Concept' },
      { title: 'FRED Series: FEDFUNDS', url: 'https://fred.stlouisfed.org/series/FEDFUNDS', tag: 'Data' },
      { title: 'Fed Monetary Policy Overview', url: 'https://www.federalreserve.gov/monetarypolicy.htm', tag: 'Primary Source' },
      { title: 'Taylor Rule — Investopedia', url: 'https://www.investopedia.com/terms/t/taylorsrule.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Latest FOMC Decision', url: gNews('Federal Reserve FOMC interest rate decision') },
      { label: 'Fed Policy Outlook', url: gNews('Federal Reserve monetary policy outlook rate cuts hikes') },
      { label: 'Rate Impact on Markets', url: gNews('interest rate impact stocks bonds economy') },
    ],
  },

  'cpi': {
    id: 'cpi',
    label: 'CPI Inflation',
    category: 'Inflation',
    fredId: 'CPIAUCSL',
    frequency: 'monthly',
    dataType: 'yoy',
    unit: '%',
    precision: 1,
    showSign: false,
    chartLimit: 36,
    description: 'Year-over-year change in the Consumer Price Index — how much more expensive goods and services are vs. 12 months ago.',
    textbook: 'Price Stability · Fisher Effect · Real vs. Nominal',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 4) return { label: 'High', color: 'red' }
      if (v >= 2.5) return { label: 'Elevated', color: 'amber' }
      if (v >= 1.5) return { label: 'Near Target', color: 'emerald' }
      return { label: 'Below Target', color: 'blue' }
    },
    what: [
      'The Consumer Price Index (CPI) measures the average change in prices paid by urban consumers for a representative basket of goods and services — food, housing, apparel, transportation, medical care, and more. Published monthly by the Bureau of Labor Statistics (BLS).',
      'CPI is expressed as an index relative to a base period (1982–1984 = 100). The year-over-year percentage change is the most commonly cited figure — what the news calls "the inflation rate." The Federal Reserve targets 2% inflation.',
      "CPI comes in two flavors: Headline CPI includes all items (food and energy). Core CPI strips out food and energy, which are volatile and driven by supply shocks the Fed can't fix. The Fed watches core more closely when setting policy.",
    ],
    howCalculated: {
      formula: `CPI Index = (Cost of basket in current period / Cost of basket in base period) × 100

YoY Inflation (%) = (CPI_current − CPI_year_ago) / CPI_year_ago × 100`,
      example: `Given: CPI Jan 2024 = 308.4, CPI Jan 2023 = 299.1

YoY = (308.4 − 299.1) / 299.1 × 100
    = 9.3 / 299.1 × 100
    ≈ 3.1%

Consumer prices are 3.1% higher than one year ago.`,
    },
    whyMatters: [
      { heading: "Fed's primary policy trigger", text: "CPI above 2% is the main reason the Fed raises rates. When CPI ran at 9.1% in mid-2022, the Fed hiked aggressively. Bringing inflation down is the stated #1 goal of restrictive monetary policy." },
      { heading: 'Real returns and bond pricing', text: 'The Fisher Effect: real return = nominal return − inflation. If your bond yields 4% and CPI is 3%, your real return is only 1%. Rising CPI expectations push nominal yields higher, crushing existing bond prices.' },
      { heading: 'Wages, contracts, and entitlements', text: 'CPI adjusts Social Security, TIPS, many union contracts, and government entitlements. It directly affects millions of household budgets every year.' },
    ],
    thresholds: [
      { label: 'Below Target', range: 'Below 1.5%', color: 'blue', text: "Inflation is below the Fed's 2% target. Deflation risk; the Fed may cut rates to stimulate demand." },
      { label: 'Near Target', range: '1.5% – 2.5%', color: 'emerald', text: "Price stability — the Fed's sweet spot. Economic conditions are roughly balanced." },
      { label: 'Elevated', range: '2.5% – 4%', color: 'amber', text: 'Running above target. The Fed is likely tightening or considering it.' },
      { label: 'High', range: 'Above 4%', color: 'red', text: 'Significantly above target. The Fed is actively raising rates; real wages are eroding.' },
    ],
    resources: [
      { title: 'Consumer Price Index — Investopedia', url: 'https://www.investopedia.com/terms/c/consumerpriceindex.asp', tag: 'Concept' },
      { title: 'FRED Series: CPIAUCSL', url: 'https://fred.stlouisfed.org/series/CPIAUCSL', tag: 'Data' },
      { title: 'BLS CPI Homepage', url: 'https://www.bls.gov/cpi/', tag: 'Primary Source' },
      { title: 'Core vs. Headline CPI', url: 'https://www.investopedia.com/terms/c/coreinflation.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Latest CPI Report', url: gNews('CPI inflation report consumer price index') },
      { label: 'Fed Inflation Response', url: gNews('Federal Reserve inflation response rate hike') },
      { label: 'Core vs Headline Inflation', url: gNews('core inflation headline CPI') },
    ],
  },

  'unemployment': {
    id: 'unemployment',
    label: 'Unemployment Rate',
    category: 'Labor Market',
    fredId: 'UNRATE',
    frequency: 'monthly',
    dataType: 'latest',
    unit: '%',
    precision: 1,
    showSign: false,
    chartLimit: 48,
    description: "Share of the labor force actively seeking work — one half of the Fed's dual mandate alongside price stability.",
    textbook: 'Dual Mandate · Phillips Curve · NAIRU',
    getStatus: (v) => {
      if (v === null) return null
      if (v < 4) return { label: 'Tight Labor Market', color: 'emerald' }
      if (v < 5) return { label: 'Normal', color: 'slate' }
      if (v < 7) return { label: 'Elevated', color: 'amber' }
      return { label: 'High', color: 'red' }
    },
    what: [
      "The unemployment rate (U-3) measures the percentage of people in the labor force who are without a job and actively looking for one. Published monthly by the Bureau of Labor Statistics from a survey of ~60,000 households.",
      "The Fed has a congressional mandate for 'maximum employment' alongside price stability. This creates constant tension: when unemployment is too low, wages rise and inflation accelerates; when it's too high, workers are idle and the economy underperforms.",
      "The natural rate of unemployment (NAIRU) is the rate consistent with stable inflation — estimated at 4–5%. When unemployment falls below NAIRU, the labor market is 'too tight' and inflationary pressure builds.",
    ],
    howCalculated: {
      formula: `Unemployment Rate = (Unemployed / Labor Force) × 100

Labor Force = Employed + Unemployed
(Excludes: retired, students, stay-at-home parents, discouraged workers)`,
      example: `Given: 162M employed, 6.5M unemployed

Labor Force = 162 + 6.5 = 168.5M
Rate = 6.5 / 168.5 × 100 = 3.86% ≈ 3.9%

Note: The broader U-6 rate includes part-time and marginally attached
workers — it typically runs 3–5% higher than U-3.`,
    },
    whyMatters: [
      { heading: "Half of the Fed's dual mandate", text: "The Federal Reserve is legally required to pursue both price stability and maximum employment. When unemployment rises, the Fed cuts rates to stimulate hiring. This tension with inflation control drives most FOMC decisions." },
      { heading: 'Leading indicator of consumer spending', text: 'Employment drives income, which drives 70% of US GDP. Rising unemployment is both a symptom and cause of recessions — workers spend less, firms earn less and lay off more, creating a negative feedback loop.' },
      { heading: 'Phillips Curve relationship', text: 'The Phillips Curve describes an inverse relationship between unemployment and inflation — tight labor markets push wages and prices higher. This framework, though weakened since the 1990s, still guides Fed policy thinking.' },
    ],
    thresholds: [
      { label: 'Tight Labor Market', range: 'Below 4%', color: 'emerald', text: 'Near full employment. Workers have wage pricing power. Risk: wage-price spiral and inflationary pressure.' },
      { label: 'Normal', range: '4% – 5%', color: 'slate', text: 'Near the estimated NAIRU. Economy at or near full employment without generating excess inflation.' },
      { label: 'Elevated', range: '5% – 7%', color: 'amber', text: 'Above normal. Labor market softening; the Fed may cut rates to support growth.' },
      { label: 'High', range: 'Above 7%', color: 'red', text: 'Recessionary territory. Significant slack in the labor market; the Fed pursues aggressive easing.' },
    ],
    resources: [
      { title: 'Unemployment Rate — Investopedia', url: 'https://www.investopedia.com/terms/u/unemploymentrate.asp', tag: 'Concept' },
      { title: 'FRED Series: UNRATE', url: 'https://fred.stlouisfed.org/series/UNRATE', tag: 'Data' },
      { title: 'BLS Employment Situation', url: 'https://www.bls.gov/news.release/empsit.toc.htm', tag: 'Primary Source' },
      { title: 'Phillips Curve — Investopedia', url: 'https://www.investopedia.com/terms/p/phillipscurve.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Jobs Report', url: gNews('unemployment rate jobs report non-farm payrolls') },
      { label: 'Labor Market Outlook', url: gNews('labor market unemployment Federal Reserve') },
      { label: 'Wage Growth', url: gNews('wage growth inflation employment labor') },
    ],
  },

  'yield-spread': {
    id: 'yield-spread',
    label: '10Y – 2Y Yield Spread',
    category: 'Yield Curve',
    fredId: 'T10Y2Y',
    frequency: 'daily',
    dataType: 'latest',
    unit: '%',
    precision: 2,
    showSign: true,
    chartLimit: 756,
    description: 'Difference between 10-year and 2-year Treasury yields. An inverted spread has preceded every US recession since 1955.',
    textbook: 'Yield Curve · Expectations Theory · Term Premium',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 0.5) return { label: 'Normal', color: 'emerald' }
      if (v >= 0) return { label: 'Flat', color: 'amber' }
      return { label: 'Inverted', color: 'red' }
    },
    what: [
      'The 10Y–2Y spread is the difference between yields on 10-year and 2-year US Treasury bonds. A normal yield curve slopes upward — investors demand higher yields for locking money up longer — so this spread is typically positive.',
      'The 2-year yield closely tracks what markets expect the Fed to do over the next two years. The 10-year yield reflects long-run growth and inflation expectations. When markets expect an economic slowdown, long-term yields fall relative to short-term yields, flattening or inverting the curve.',
      'An inverted yield curve — 2-year yield exceeding the 10-year — is the single most reliable leading indicator of recessions in US history. It has preceded every US recession since 1955, typically by 6 to 18 months.',
    ],
    howCalculated: {
      formula: `10Y–2Y Spread = 10-Year Treasury Yield − 2-Year Treasury Yield

Yields are set daily by Treasury auctions and secondary market trading.
They represent the annualized return on holding a risk-free US government bond.`,
      example: `Given: 10Y Treasury = 4.20%, 2Y Treasury = 4.65%

Spread = 4.20% − 4.65% = −0.45%   ← INVERTED

This means locking money up for 10 years earns LESS than 2 years.
Bond markets are pricing in future rate cuts, consistent with a slowdown.`,
    },
    whyMatters: [
      { heading: 'Most reliable recession predictor in finance', text: "The 10Y–2Y spread has inverted before every US recession since the 1950s. It captures the bond market's collective expectation of future rate cuts — which only happen when the economy needs stimulus." },
      { heading: 'Bank profitability proxy', text: 'Banks borrow short (deposits) and lend long (mortgages, loans). An inverted curve compresses or eliminates bank net interest margins, reducing lending and tightening credit conditions.' },
      { heading: 'Pure Expectations Theory in action', text: 'Under this theory, long-term rates equal the expected average of future short-term rates. Inversion means markets expect the Fed to cut rates — which only happens when the economy needs help.' },
    ],
    thresholds: [
      { label: 'Normal', range: 'Above +0.5%', color: 'emerald', text: 'Healthy upward slope. Long-term rates exceed short-term rates; banks are profitable lenders; markets see stable growth ahead.' },
      { label: 'Flat', range: '0% to +0.5%', color: 'amber', text: 'Narrow spread signals uncertainty. Often a transition between normal and inverted. Worth monitoring closely.' },
      { label: 'Inverted', range: 'Below 0%', color: 'red', text: 'Short-term rates exceed long-term rates. Historically precedes recessions by 6–18 months. The deeper the inversion, the stronger the signal.' },
    ],
    resources: [
      { title: 'Yield Curve — Investopedia', url: 'https://www.investopedia.com/terms/y/yieldcurve.asp', tag: 'Concept' },
      { title: 'FRED Series: T10Y2Y', url: 'https://fred.stlouisfed.org/series/T10Y2Y', tag: 'Data' },
      { title: 'NY Fed Yield Curve Research', url: 'https://www.newyorkfed.org/research/capital_markets/ycfaq', tag: 'Primary Source' },
      { title: 'Inverted Yield Curve', url: 'https://www.investopedia.com/terms/i/invertedyieldcurve.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Yield Curve News', url: gNews('yield curve inverted 10 year 2 year Treasury spread') },
      { label: 'Recession Signals', url: gNews('recession indicator yield curve bond market') },
      { label: 'Treasury Yields', url: gNews('Treasury yields interest rates bond market') },
    ],
  },

  'treasury-10y': {
    id: 'treasury-10y',
    label: '10-Year Treasury Yield',
    category: 'Fixed Income',
    fredId: 'DGS10',
    frequency: 'daily',
    dataType: 'latest',
    unit: '%',
    precision: 2,
    showSign: false,
    chartLimit: 756,
    description: "Yield on 10-year US government bonds — the risk-free rate at the foundation of virtually every finance valuation model.",
    textbook: 'Risk-Free Rate · CAPM · DCF Valuation',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 4.5) return { label: 'High Yield Env.', color: 'amber' }
      if (v >= 2.5) return { label: 'Normal Range', color: 'slate' }
      return { label: 'Low Yield Env.', color: 'blue' }
    },
    what: [
      "The 10-Year Treasury yield is the annualized return on lending money to the US government for 10 years. Since US Treasuries are considered default-free, this yield is used worldwide as the 'risk-free rate' in financial models.",
      "In CAPM, the risk-free rate is the baseline return for bearing zero risk: Expected Return = Rf + β × Market Premium. When the risk-free rate rises, every other asset becomes relatively less attractive.",
      "The 10-year yield is also the most important discount rate input in DCF analysis. Higher yields mean higher discount rates, which lower the present value of all future cash flows — directly reducing fair value estimates for stocks, real estate, and other long-duration assets.",
    ],
    howCalculated: {
      formula: `Yield is determined by supply and demand in Treasury auctions and secondary trading.

Precise yield calculation — solve for r:
  Price = Σ [C / (1+r)^t] + [Face / (1+r)^n]

  C = semi-annual coupon, n = 20 periods, r = semi-annual yield
  Annual yield = 2 × r (bond-equivalent yield convention)`,
      example: `Given: $1,000 face value, 4.25% annual coupon, 10 years, price = $980

Semi-annual coupon C = $21.25, n = 20 periods

Solve: $980 = Σ $21.25/(1+r)^t + $1,000/(1+r)^20
       r ≈ 2.235% semi-annual → Annual yield ≈ 4.47%

Key relationship: Price fell below face value ($980 < $1,000), so yield ROSE above coupon rate (4.47% > 4.25%).
Bond prices and yields always move in opposite directions.`,
    },
    whyMatters: [
      { heading: 'Foundation of every valuation model', text: 'CAPM, DCF, dividend discount models — all use the 10-year yield as the risk-free rate. A 1% rise can cut DCF fair values by 10–20% for long-duration assets, which is why the market watches it obsessively.' },
      { heading: 'Mortgage and borrowing cost benchmark', text: '30-year mortgage rates typically run 1.5–2% above the 10-year Treasury. When the 10-year spikes, so does the cost of homeownership, business loans, and capital investment.' },
      { heading: 'Global safe haven asset', text: 'Foreign governments, central banks, and institutions hold 10-year Treasuries as the world\'s primary reserve asset. Treasury yields set the floor for global borrowing costs.' },
    ],
    thresholds: [
      { label: 'Low Yield Environment', range: 'Below 2.5%', color: 'blue', text: 'Very cheap long-term capital. Equity valuations expand (low discount rates). Seen during crises and periods of aggressive QE.' },
      { label: 'Normal Range', range: '2.5% – 4.5%', color: 'slate', text: 'Historical norm. Balanced environment for stocks and bonds. DCF models work with reasonable assumptions.' },
      { label: 'High Yield Environment', range: 'Above 4.5%', color: 'amber', text: 'Expensive capital. DCF fair values contract. Bonds compete with equities for income. Growth stocks under pressure.' },
    ],
    resources: [
      { title: '10-Year Treasury Note — Investopedia', url: 'https://www.investopedia.com/terms/1/10-year-treasury-note.asp', tag: 'Concept' },
      { title: 'FRED Series: DGS10', url: 'https://fred.stlouisfed.org/series/DGS10', tag: 'Data' },
      { title: 'Treasury Yield Data', url: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates', tag: 'Primary Source' },
      { title: 'CAPM and Risk-Free Rate', url: 'https://www.investopedia.com/terms/c/capm.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Treasury Yield Move', url: gNews('10 year Treasury yield bond market') },
      { label: 'Rate Impact on Stocks', url: gNews('10 year Treasury yield stock valuation') },
      { label: 'Bond Market Outlook', url: gNews('bond market Treasury yields outlook') },
    ],
  },

  'breakeven': {
    id: 'breakeven',
    label: '10Y Breakeven Inflation',
    category: 'Inflation Expectations',
    fredId: 'T10YIE',
    frequency: 'daily',
    dataType: 'latest',
    unit: '%',
    precision: 2,
    showSign: false,
    chartLimit: 756,
    description: "Market-implied 10-year inflation expectation derived from TIPS vs. nominal Treasury spreads — a real-time credibility check on the Fed.",
    textbook: 'Fisher Equation · Real Rates · Inflation Expectations',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 2.7) return { label: 'Above Target', color: 'amber' }
      if (v >= 1.8) return { label: 'Anchored', color: 'emerald' }
      return { label: 'Below Target', color: 'blue' }
    },
    what: [
      "The 10-Year Breakeven Inflation Rate is the bond market's consensus forecast for average annual inflation over the next decade. It is derived from comparing 10-year nominal Treasury yields with 10-year TIPS (Treasury Inflation-Protected Securities) yields.",
      "TIPS bonds adjust their principal with CPI — they always deliver a real return. The difference between what a nominal Treasury pays and what a TIPS pays represents the 'inflation compensation' investors demand, which equals their expected inflation.",
      "When breakeven inflation is near 2%, bond markets believe the Fed will hit its target. When it rises well above 2%, markets are losing confidence in the Fed's ability to control inflation — a critical signal for monetary policymakers.",
    ],
    howCalculated: {
      formula: `Breakeven Inflation = Nominal 10Y Treasury Yield − 10Y TIPS Yield

From the Fisher Equation:
  (1 + Nominal) = (1 + Real) × (1 + Expected Inflation)

Approximation: Nominal ≈ Real Rate + Expected Inflation`,
      example: `Given: 10Y Treasury = 4.50%, 10Y TIPS = 2.10%

Breakeven = 4.50% − 2.10% = 2.40%

Bond markets expect inflation to average 2.40%/year over 10 years.
Real 10Y rate = 10Y Treasury − Breakeven = 4.50% − 2.40% = 2.10%

If actual inflation exceeds 2.40%, TIPS buyers profit.
If actual inflation is lower, nominal Treasury buyers profit.`,
    },
    whyMatters: [
      { heading: "Real-time Fed credibility check", text: "If breakeven stays near 2%, it shows the bond market believes in the Fed's commitment to its target. Breakeven rising well above 2% signals markets are losing confidence — a very serious problem for central bank policy." },
      { heading: 'Real vs. nominal rate distinction', text: 'Real rate ≈ Nominal yield − Breakeven. A 4.5% Treasury with 2.5% breakeven gives only a 2.0% real return. Real rates — not nominal — are what matter for investment and spending decisions.' },
      { heading: 'TIPS portfolio strategy', text: 'When breakeven inflation is high, buying TIPS is a hedge against inflation exceeding expectations. Institutional investors actively compare nominal vs. TIPS breakeven to position their fixed income portfolios.' },
    ],
    thresholds: [
      { label: 'Below Target', range: 'Below 1.8%', color: 'blue', text: "Markets expect inflation below the Fed's 2% target. Deflationary risk; the Fed may ease policy." },
      { label: 'Anchored', range: '1.8% – 2.5%', color: 'emerald', text: "Inflation expectations are well-anchored near the Fed's 2% target — the ideal outcome for monetary credibility." },
      { label: 'Above Target', range: 'Above 2.5%', color: 'amber', text: "Markets expect sustained above-target inflation. The Fed's credibility is being tested." },
    ],
    resources: [
      { title: 'Breakeven Inflation Rate — Investopedia', url: 'https://www.investopedia.com/terms/b/breakeveninflationrate.asp', tag: 'Concept' },
      { title: 'FRED Series: T10YIE', url: 'https://fred.stlouisfed.org/series/T10YIE', tag: 'Data' },
      { title: 'TIPS Explained — TreasuryDirect', url: 'https://www.treasurydirect.gov/marketable-securities/tips/', tag: 'Primary Source' },
      { title: 'Fisher Effect — Investopedia', url: 'https://www.investopedia.com/terms/f/fishereffect.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Inflation Expectations', url: gNews('inflation expectations breakeven TIPS bond market') },
      { label: 'TIPS Market', url: gNews('Treasury Inflation Protected Securities TIPS yield') },
      { label: 'Real Interest Rates', url: gNews('real interest rates inflation Fed policy') },
    ],
  },

  'gdp-growth': {
    id: 'gdp-growth',
    label: 'GDP Growth Rate',
    category: 'Economic Growth',
    fredId: 'A191RL1Q225SBEA',
    frequency: 'quarterly',
    dataType: 'latest',
    unit: '%',
    precision: 1,
    showSign: false,
    chartLimit: 20,
    description: 'Annualized real GDP growth for the most recent quarter — the broadest measure of economic expansion or contraction.',
    textbook: 'National Income Accounting · Business Cycle · Recession',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 3) return { label: 'Strong Growth', color: 'emerald' }
      if (v >= 1) return { label: 'Moderate Growth', color: 'slate' }
      if (v >= 0) return { label: 'Weak Growth', color: 'amber' }
      return { label: 'Contraction', color: 'red' }
    },
    what: [
      'Gross Domestic Product (GDP) is the total market value of all final goods and services produced within a country in a given period. Real GDP growth adjusts for inflation, showing genuine changes in economic output rather than just price increases.',
      'The US Bureau of Economic Analysis (BEA) publishes GDP quarterly, with three releases per quarter: Advance (~30 days after quarter-end), Second Estimate (~60 days), and Third Estimate (~90 days). Data is reported as a Seasonally Adjusted Annual Rate (SAAR).',
      'Two consecutive quarters of negative real GDP growth is the informal definition of a technical recession. However, the NBER uses a broader definition considering depth, breadth, and duration across employment, income, and spending measures.',
    ],
    howCalculated: {
      formula: `Real GDP Growth (SAAR) = [ (GDP_Q / GDP_Q-1)^4 − 1 ] × 100

Using chained 2017 dollars (inflation-adjusted).
SAAR annualizes the quarterly growth rate for easier comparison.

GDP Components (Expenditure Approach):
  GDP = C + I + G + (X − M)
  C = Consumer spending (~70%), I = Private investment (~18%)
  G = Government (~17%), X−M = Net exports (usually negative)`,
      example: `Q3 Real GDP = $22.1T, Q2 Real GDP = $21.9T (chained 2017$)

Quarterly growth = 22.1 / 21.9 − 1 = 0.00913 = 0.913%

Annualized: (1.00913)^4 − 1 = 0.0371 = 3.7%

BEA reports: "Real GDP grew at an annualized rate of 3.7% in Q3."`,
    },
    whyMatters: [
      { heading: "The broadest economic report card", text: "GDP encompasses everything — consumer spending, business investment, government activity, and trade. A slowdown touches every sector. It defines whether the economy is in recession or expansion." },
      { heading: 'Drives earnings expectations', text: "Corporate revenues are ultimately tied to economic activity. Strong GDP growth lifts earnings estimates and stock prices. Weak GDP causes downward revisions — a key driver of market corrections." },
      { heading: 'Central bank policy anchor', text: "The 'output gap' — actual vs. potential GDP — is a key input to the Taylor Rule. A large negative gap (economy below potential) argues strongly for rate cuts." },
    ],
    thresholds: [
      { label: 'Contraction', range: 'Below 0%', color: 'red', text: 'Economy is shrinking. Two consecutive quarters = technical recession. The Fed typically cuts rates aggressively.' },
      { label: 'Weak Growth', range: '0% – 1%', color: 'amber', text: 'Growth is positive but fragile. Historically associated with rising unemployment and softening earnings.' },
      { label: 'Moderate Growth', range: '1% – 3%', color: 'slate', text: 'Solid, sustainable expansion. Roughly in line with US long-run potential growth (~2%).' },
      { label: 'Strong Growth', range: 'Above 3%', color: 'emerald', text: 'Above-trend growth. Can be inflationary if sustained; may prompt the Fed to raise rates to cool demand.' },
    ],
    resources: [
      { title: 'GDP — Investopedia', url: 'https://www.investopedia.com/terms/g/gdp.asp', tag: 'Concept' },
      { title: 'FRED Series: A191RL1Q225SBEA', url: 'https://fred.stlouisfed.org/series/A191RL1Q225SBEA', tag: 'Data' },
      { title: 'BEA GDP Release', url: 'https://www.bea.gov/data/gdp/gross-domestic-product', tag: 'Primary Source' },
      { title: 'Business Cycle — Investopedia', url: 'https://www.investopedia.com/terms/b/businesscycle.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'GDP Report', url: gNews('GDP growth rate economic growth United States quarterly') },
      { label: 'Recession Risk', url: gNews('recession risk GDP growth slowdown economy') },
      { label: 'Economic Outlook', url: gNews('US economic outlook GDP forecast') },
    ],
  },

  'mortgage-rate': {
    id: 'mortgage-rate',
    label: '30-Year Mortgage Rate',
    category: 'Housing / Credit',
    fredId: 'MORTGAGE30US',
    frequency: 'weekly',
    dataType: 'latest',
    unit: '%',
    precision: 2,
    showSign: false,
    chartLimit: 156,
    description: 'Average 30-year fixed mortgage rate — a direct measure of housing affordability and monetary policy transmission to consumers.',
    textbook: 'Bond Pricing · Duration · Monetary Transmission',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 7) return { label: 'Very High', color: 'red' }
      if (v >= 5.5) return { label: 'Elevated', color: 'amber' }
      if (v >= 4) return { label: 'Moderate', color: 'slate' }
      return { label: 'Low', color: 'blue' }
    },
    what: [
      'The 30-year fixed mortgage rate is the interest rate on a 30-year home loan with fixed monthly payments throughout its life. Freddie Mac surveys lenders weekly to produce the Primary Mortgage Market Survey (PMMS) — the most widely cited mortgage rate benchmark.',
      'Mortgage rates are primarily benchmarked to the 10-year Treasury yield, typically running 1.5–2% above it (the "mortgage spread"). This spread reflects credit risk, prepayment risk, and the cost of mortgage-backed securities (MBS) issuance.',
      'The mortgage rate is one of the clearest transmission channels of Fed policy to everyday Americans. When the Fed hikes rates, mortgage rates rise, making homeownership more expensive — slowing housing activity, consumer spending, and residential investment.',
    ],
    howCalculated: {
      formula: `Mortgage Rate ≈ 10-Year Treasury Yield + Mortgage Spread (~1.5–2%)

Monthly Payment = P × [r(1+r)^n] / [(1+r)^n − 1]
  P = loan principal
  r = monthly rate (annual rate ÷ 12)
  n = 360 months (30 years)`,
      example: `$400,000 loan at 7.00% vs. 4.00%

At 7.00%: r = 0.5833%, Payment ≈ $2,661/month
At 4.00%: r = 0.3333%, Payment ≈ $1,910/month

Difference: $751/month — that's how much the 2022–2023 rate hike cycle
added to a typical mortgage payment.

Total interest paid over 30 years:
  At 7%: ~$558,000   At 4%: ~$287,000   Difference: ~$271,000`,
    },
    whyMatters: [
      { heading: 'Housing affordability and the wealth effect', text: "For most Americans, their home is their largest asset. Mortgage rate changes directly affect how much house people can afford. The wealth effect from housing prices feeds consumer confidence and spending." },
      { heading: 'Key Fed policy transmission mechanism', text: "Mortgage rates are among the most direct ways Fed decisions affect the real economy. Rate hikes hit housing first and hardest, which is why housing typically leads other sectors into slowdowns." },
      { heading: 'MBS market and prepayment dynamics', text: "When rates drop, homeowners refinance — generating MBS prepayments. When rates rise, existing low-rate mortgages are 'locked in,' reducing housing supply. This creates unique dynamics in the $12 trillion MBS market." },
    ],
    thresholds: [
      { label: 'Low', range: 'Below 4%', color: 'blue', text: 'Exceptional affordability. Seen during COVID-era QE. Housing demand surges; refinancing peaks.' },
      { label: 'Moderate', range: '4% – 5.5%', color: 'slate', text: 'Historically normal range. Housing market functions with reasonable affordability.' },
      { label: 'Elevated', range: '5.5% – 7%', color: 'amber', text: 'Affordability stressed. First-time buyers priced out; housing activity slows sharply.' },
      { label: 'Very High', range: 'Above 7%', color: 'red', text: 'Seen in early 1980s and post-2022. Housing market freezes; home sales collapse; prices may correct.' },
    ],
    resources: [
      { title: 'Mortgage Rate — Investopedia', url: 'https://www.investopedia.com/mortgage/mortgage-rates/', tag: 'Concept' },
      { title: 'FRED Series: MORTGAGE30US', url: 'https://fred.stlouisfed.org/series/MORTGAGE30US', tag: 'Data' },
      { title: 'Freddie Mac PMMS', url: 'https://www.freddiemac.com/pmms', tag: 'Primary Source' },
      { title: 'Mortgage-Backed Securities', url: 'https://www.investopedia.com/terms/m/mbs.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Mortgage Rate News', url: gNews('mortgage rate 30 year fixed housing market') },
      { label: 'Housing Affordability', url: gNews('housing affordability mortgage rates home prices') },
      { label: 'Fed and Mortgages', url: gNews('Federal Reserve mortgage rates housing impact') },
    ],
  },

  'credit-spread': {
    id: 'credit-spread',
    label: 'HY Credit Spread',
    category: 'Credit Markets',
    fredId: 'BAMLH0A0HYM2',
    frequency: 'daily',
    dataType: 'latest',
    unit: '%',
    precision: 2,
    showSign: false,
    chartLimit: 756,
    description: 'Excess yield of high-yield (junk) bonds over Treasuries — a real-time measure of credit risk and financial market stress.',
    textbook: 'Credit Risk · Risk Premium · Financial Conditions',
    getStatus: (v) => {
      if (v === null) return null
      if (v >= 8) return { label: 'Very Wide', color: 'red' }
      if (v >= 5) return { label: 'Wide', color: 'amber' }
      if (v >= 3) return { label: 'Normal', color: 'slate' }
      return { label: 'Tight', color: 'emerald' }
    },
    what: [
      'The High Yield (HY) credit spread is the additional yield investors demand to hold high-yield bonds (rated BB or below — "junk bonds") instead of risk-free US Treasuries of similar maturity.',
      "This spread compensates for credit risk — the possibility of default. When spreads are narrow, investors are confident in borrowers' ability to repay. When spreads widen, fear rises and borrowing becomes more expensive for leveraged companies.",
      'This series is the ICE BofA US High Yield Index Option-Adjusted Spread (OAS), published by the Federal Reserve. It is one of the most widely watched measures of financial stress and risk appetite in credit markets.',
    ],
    howCalculated: {
      formula: `Credit Spread = High Yield Bond Yield − Treasury Yield (comparable maturity)

OAS (Option-Adjusted Spread) further adjusts for embedded call features
to isolate pure credit risk.

Units: Reported in percent (e.g., 4.5% = 450 basis points above Treasuries)`,
      example: `Given: HY bond portfolio yield = 8.50%, 5Y Treasury = 4.25%

Spread = 8.50% − 4.25% = 4.25% (425 basis points)

Historical reference points:
  2007 pre-crisis (complacency): ~2.5% (250 bps)
  2009 GFC peak:                ~20.0% (2,000 bps)
  2020 COVID shock:             ~11.0% (1,100 bps)
  Normal benign period:         ~3.5–4.5% (350–450 bps)`,
    },
    whyMatters: [
      { heading: 'Real-time fear gauge', text: "Credit spreads widen fast when fear rises — often before the stock market reacts. The 2020 COVID shock saw spreads blow out to 11% in weeks. Watching spreads gives early warning of financial stress." },
      { heading: 'Financial conditions tightening', text: 'Wide spreads tighten financial conditions even without Fed action. If junk bond yields spike, leveraged companies cannot refinance affordably, reducing investment and hiring — a self-reinforcing tightening loop.' },
      { heading: 'Default cycle predictor', text: 'Widening spreads predict rising default rates 6–12 months forward. Narrow spreads signal low expected defaults, consistent with a healthy economy. They price corporate credit quality in real time.' },
    ],
    thresholds: [
      { label: 'Tight', range: 'Below 3%', color: 'emerald', text: 'Complacency zone. Investors confident; lending conditions easy. Risk: spreads may be too tight to compensate for actual default risk.' },
      { label: 'Normal', range: '3% – 5%', color: 'slate', text: 'Historical average range. Credit markets functioning normally; risk appetite balanced.' },
      { label: 'Wide', range: '5% – 8%', color: 'amber', text: 'Credit stress. Borrowing costs for risky companies rising sharply. Associated with late-cycle slowdowns.' },
      { label: 'Very Wide', range: 'Above 8%', color: 'red', text: 'Crisis territory. Seen in 2002, 2008–09, 2020. Default rates spike; leveraged companies face refinancing risk.' },
    ],
    resources: [
      { title: 'Credit Spread — Investopedia', url: 'https://www.investopedia.com/terms/c/creditspread.asp', tag: 'Concept' },
      { title: 'FRED Series: BAMLH0A0HYM2', url: 'https://fred.stlouisfed.org/series/BAMLH0A0HYM2', tag: 'Data' },
      { title: 'High Yield Bonds — Investopedia', url: 'https://www.investopedia.com/terms/h/high_yield_bond.asp', tag: 'Related' },
      { title: 'OAS Explained — Investopedia', url: 'https://www.investopedia.com/terms/o/optionadjustedspread.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'Credit Spread News', url: gNews('high yield credit spread junk bond risk') },
      { label: 'Corporate Bond Market', url: gNews('corporate bond market high yield spreads') },
      { label: 'Default Risk', url: gNews('corporate default rate high yield bonds') },
    ],
  },

  'cape-ratio': {
    id: 'cape-ratio',
    label: 'CAPE Ratio',
    category: 'Equity Valuation',
    fredId: null,
    frequency: 'monthly',
    dataType: 'none',
    unit: 'x',
    precision: 1,
    showSign: false,
    chartLimit: 0,
    description: "Shiller P/E — S&P 500 price divided by 10-year average real earnings. Measures whether equities are historically cheap or expensive.",
    textbook: 'Equity Valuation · P/E Multiples · Mean Reversion',
    getStatus: (_v) => null,
    what: [
      "The Cyclically Adjusted Price-to-Earnings (CAPE) ratio, also called the Shiller P/E, was developed by Nobel laureate Robert Shiller. It divides the current S&P 500 price by the average of the past 10 years of inflation-adjusted (real) earnings per share.",
      "Averaging 10 years of earnings smooths out the business cycle. A single-year P/E looks deceptively cheap during booms (inflated earnings) or expensive during recessions (depressed earnings). CAPE gives a stable long-run valuation picture independent of where we are in the cycle.",
      "CAPE is a long-run valuation signal, not a market timing tool. It can remain elevated for decades before normalizing. Its value is in setting long-term return expectations and answering the question: 'Are equities cheap or expensive relative to history?'",
    ],
    howCalculated: {
      formula: `CAPE =              Current S&P 500 Price
         ─────────────────────────────────────────────────────
         10-Year Average of Real (CPI-adjusted) Earnings per Share

Real EPS_year = Nominal EPS_year × (CPI_today / CPI_that_year)`,
      example: `S&P 500 = 5,000, 10-year average real EPS = $150

CAPE = 5,000 / 150 = 33.3×

Historical average CAPE: ~17×
Current reading of 33× suggests the market is roughly 2× historically expensive.

Data is published monthly by Robert Shiller at:
econ.yale.edu/~shiller/data.htm
Also available at: multpl.com/shiller-pe`,
    },
    whyMatters: [
      { heading: 'Long-run return predictor', text: 'High CAPE correlates with lower 10-year forward stock returns. When CAPE exceeded 40× in 1999, the subsequent 10-year S&P 500 return was negative. A valuable input for long-horizon asset allocation.' },
      { heading: 'Mean reversion tendency', text: 'Extreme valuations tend to normalize over time — through price declines, earnings growth, or both. CAPE quantifies how far current valuations deviate from historical norms.' },
      { heading: 'Interest rate context matters', text: "A given CAPE level is more or less alarming depending on rates. At 5% Treasuries, a CAPE of 30× is expensive. At 1% Treasuries, the same CAPE is more justifiable. Compare earnings yield (1/CAPE) to bond yields." },
    ],
    thresholds: [
      { label: 'Undervalued', range: 'Below 15×', color: 'emerald', text: 'Historically cheap. Associated with strong forward 10-year returns. Last seen during early 1980s or briefly in 2009.' },
      { label: 'Fair Value', range: '15× – 25×', color: 'slate', text: 'Near the historical average of ~17×. Neutral valuation; forward returns roughly in line with long-run averages.' },
      { label: 'Elevated', range: '25× – 35×', color: 'amber', text: 'Above long-run average. Forward 10-year returns statistically below average, though not necessarily negative.' },
      { label: 'Overvalued', range: 'Above 35×', color: 'red', text: 'Extreme territory. Seen in 1929 and late 1990s dot-com bubble. Long-run forward returns from these levels have historically been poor.' },
    ],
    resources: [
      { title: 'Shiller P/E (CAPE) — Investopedia', url: 'https://www.investopedia.com/terms/c/cape-ratio.asp', tag: 'Concept' },
      { title: "Shiller's Data (Yale)", url: 'http://www.econ.yale.edu/~shiller/data.htm', tag: 'Data' },
      { title: 'Live CAPE — Multpl.com', url: 'https://www.multpl.com/shiller-pe', tag: 'Data' },
      { title: 'Mean Reversion — Investopedia', url: 'https://www.investopedia.com/terms/m/meanreversion.asp', tag: 'Related' },
    ],
    newsSearches: [
      { label: 'CAPE Ratio Analysis', url: gNews('Shiller CAPE ratio stock market valuation') },
      { label: 'Stock Market Valuation', url: gNews('S&P 500 valuation PE ratio overvalued undervalued') },
      { label: 'Equity Outlook', url: gNews('stock market long term return valuation outlook') },
    ],
  },
}

export const INDICATOR_LIST = Object.values(INDICATORS)
