import type {
  AuthoritySnapshot,
  Bilingual,
  CountryRef,
  DataAltruismOrganisation,
  DgaMatter,
  DgaOverview,
  IntermediaryRecord,
  MatterEvent,
  NonPersonalTransferWatch,
  OfficialSource,
  ProcedureFollowUp,
  SourceRef,
  TimelineEvent,
} from './types'

export const DATA_AS_OF = '2026-11-20'

const sourceUrls = {
  law: 'https://eur-lex.europa.eu/eli/reg/2022/868/oj',
  lawSummary: 'https://eur-lex.europa.eu/EN/legal-content/summary/european-data-governance.html',
  explained: 'https://digital-strategy.ec.europa.eu/en/policies/data-governance-act-explained',
  authorities: 'https://digital-strategy.ec.europa.eu/en/library/national-competent-bodies-and-authorities-under-data-governance-act',
  register: 'https://digital-strategy.ec.europa.eu/en/policies/data-intermediary-services',
  altruismRegister: 'https://digital-strategy.ec.europa.eu/en/policies/data-altruism-organisations',
  formalNotice18: 'https://digital-strategy.ec.europa.eu/en/news/commission-calls-18-member-states-comply-eu-data-governance-act',
  reasonedOpinion10: 'https://digital-strategy.ec.europa.eu/en/news/commission-calls-10-member-states-comply-data-governance-act',
  ireland: 'https://digital-strategy.ec.europa.eu/en/news/commission-calls-ireland-comply-eu-data-governance-act',
  evaluation: 'https://digital-strategy.ec.europa.eu/en/consultations/commission-launches-consultations-future-eu-data-legislation',
} as const

const sourceLabels: Record<keyof typeof sourceUrls, Bilingual> = {
  law: { zh: 'EUR-Lex：DGA 法规正文', en: 'EUR-Lex: DGA regulation text' },
  lawSummary: { zh: 'EUR-Lex：欧洲数据治理概要', en: 'EUR-Lex: European data governance summary' },
  explained: { zh: '欧委会：Data Governance Act explained', en: 'Commission: Data Governance Act explained' },
  authorities: { zh: '欧委会：DGA 国家主管机关清单', en: 'Commission: national DGA authorities' },
  register: { zh: '欧委会：数据中介服务登记册', en: 'Commission: EU register of data intermediation services' },
  altruismRegister: { zh: '欧委会：数据利他组织登记册', en: 'Commission: EU register of recognised data altruism organisations' },
  formalNotice18: { zh: '欧委会：18 个成员国 formal notice', en: 'Commission: formal notice to 18 Member States' },
  reasonedOpinion10: { zh: '欧委会：10 个成员国 reasoned opinion', en: 'Commission: reasoned opinion to 10 Member States' },
  ireland: { zh: '欧委会：爱尔兰 DGA formal notice', en: 'Commission: Ireland DGA formal notice' },
  evaluation: { zh: '欧委会：DGA 评估咨询', en: 'Commission: DGA evaluation consultation' },
}

const sourceSnapshots: Record<keyof typeof sourceUrls, Bilingual> = {
  law: {
    zh: 'Regulation (EU) 2022/868，包含数据中介、数据利他和第 31 条国际访问/转移保障。',
    en: 'Regulation (EU) 2022/868, including data intermediation, data altruism and Article 31 safeguards for international access/transfer.',
  },
  lawSummary: {
    zh: 'EUR-Lex 对 DGA 的官方摘要，说明其适用范围和主要机制。',
    en: 'Official EUR-Lex summary of the DGA scope and mechanisms.',
  },
  explained: {
    zh: '欧委会政策页面，解释数据中介通知、数据利他和 EDIB。',
    en: 'Commission policy page explaining data-intermediary notifications, data altruism and the EDIB.',
  },
  authorities: {
    zh: '欧委会公开的各成员国 DGA 主管机关清单入口。',
    en: 'Commission entry point for national DGA competent bodies and authorities.',
  },
  register: {
    zh: '欧委会公开数据中介服务登记册及成员国通知名单。',
    en: 'Commission public register and Member State notifications for data intermediation services.',
  },
  altruismRegister: {
    zh: '欧委会公开的已获认可数据利他组织登记册；页面按成员国列出通知记录。',
    en: 'Commission public register of recognised data altruism organisations, listing Member State notifications.',
  },
  formalNotice18: {
    zh: '2024-05-23：18 个成员国因主管机关指定/授权问题收到 formal notice。',
    en: '23 May 2024: 18 Member States received formal notices over authority designation/empowerment.',
  },
  reasonedOpinion10: {
    zh: '2024-12-16：10 个成员国进入 reasoned opinion 阶段。',
    en: '16 December 2024: 10 Member States moved to the reasoned-opinion stage.',
  },
  ireland: {
    zh: '2024-07-25：爱尔兰因未指定 DGA 主管机关收到 formal notice。',
    en: '25 July 2024: Ireland received a formal notice for not designating DGA authorities.',
  },
  evaluation: {
    zh: '2025-07-08：欧委会启动对 DGA 等数据法规的评估咨询。',
    en: '8 July 2025: the Commission launched an evaluation consultation covering the DGA and related data laws.',
  },
}

function sourceRef(id: keyof typeof sourceUrls): SourceRef {
  return {
    id,
    label: sourceLabels[id],
    url: sourceUrls[id],
    sourceType: {
      zh: id === 'law' || id === 'lawSummary' ? 'EUR-Lex' : '欧盟委员会官方页面',
      en: id === 'law' || id === 'lawSummary' ? 'EUR-Lex' : 'Official Commission page',
    },
    evidenceSnapshot: sourceSnapshots[id],
    lastVerifiedAt: DATA_AS_OF,
  }
}

const sourceRefs = Object.fromEntries(
  (Object.keys(sourceUrls) as Array<keyof typeof sourceUrls>).map((id) => [id, sourceRef(id)]),
) as Record<keyof typeof sourceUrls, SourceRef>

export const OFFICIAL_SOURCES: OfficialSource[] = [
  ...(['law', 'lawSummary', 'explained', 'authorities', 'register', 'altruismRegister', 'formalNotice18', 'reasonedOpinion10', 'ireland', 'evaluation'] as const).map((id) => ({
    id,
    label: sourceLabels[id],
    url: sourceUrls[id],
    sourceType: sourceRefs[id].sourceType,
    description: sourceSnapshots[id],
  })),
]

function country(code: string, flag: string, zh: string, en: string): CountryRef {
  return { code, flag, name: { zh, en } }
}

const countries: Record<string, CountryRef> = {
  AT: country('AT', '🇦🇹', '奥地利', 'Austria'),
  BE: country('BE', '🇧🇪', '比利时', 'Belgium'),
  BG: country('BG', '🇧🇬', '保加利亚', 'Bulgaria'),
  CY: country('CY', '🇨🇾', '塞浦路斯', 'Cyprus'),
  CZ: country('CZ', '🇨🇿', '捷克', 'Czechia'),
  DE: country('DE', '🇩🇪', '德国', 'Germany'),
  DK: country('DK', '🇩🇰', '丹麦', 'Denmark'),
  EE: country('EE', '🇪🇪', '爱沙尼亚', 'Estonia'),
  EL: country('EL', '🇬🇷', '希腊', 'Greece'),
  ES: country('ES', '🇪🇸', '西班牙', 'Spain'),
  FI: country('FI', '🇫🇮', '芬兰', 'Finland'),
  FR: country('FR', '🇫🇷', '法国', 'France'),
  HU: country('HU', '🇭🇺', '匈牙利', 'Hungary'),
  IE: country('IE', '🇮🇪', '爱尔兰', 'Ireland'),
  IT: country('IT', '🇮🇹', '意大利', 'Italy'),
  LT: country('LT', '🇱🇹', '立陶宛', 'Lithuania'),
  LU: country('LU', '🇱🇺', '卢森堡', 'Luxembourg'),
  LV: country('LV', '🇱🇻', '拉脱维亚', 'Latvia'),
  MT: country('MT', '🇲🇹', '马耳他', 'Malta'),
  NL: country('NL', '🇳🇱', '荷兰', 'Netherlands'),
  PL: country('PL', '🇵🇱', '波兰', 'Poland'),
  PT: country('PT', '🇵🇹', '葡萄牙', 'Portugal'),
  RO: country('RO', '🇷🇴', '罗马尼亚', 'Romania'),
  SE: country('SE', '🇸🇪', '瑞典', 'Sweden'),
  SI: country('SI', '🇸🇮', '斯洛文尼亚', 'Slovenia'),
  SK: country('SK', '🇸🇰', '斯洛伐克', 'Slovakia'),
  HR: country('HR', '🇭🇷', '克罗地亚', 'Croatia'),
}

const reasonedOpinionCodes = new Set(['CZ', 'DE', 'EE', 'EL', 'CY', 'LU', 'AT', 'PL', 'PT', 'SI'])

const formalNoticeMatters: Array<{ code: string; infr: string }> = [
  { code: 'BE', infr: 'INFR(2024)2055' },
  { code: 'CZ', infr: 'INFR(2024)2057' },
  { code: 'DE', infr: 'INFR(2024)2060' },
  { code: 'EE', infr: 'INFR(2024)2058' },
  { code: 'EL', infr: 'INFR(2024)2061' },
  { code: 'FR', infr: 'INFR(2024)2059' },
  { code: 'IT', infr: 'INFR(2024)2062' },
  { code: 'CY', infr: 'INFR(2024)2056' },
  { code: 'LV', infr: 'INFR(2024)2064' },
  { code: 'LU', infr: 'INFR(2024)2063' },
  { code: 'MT', infr: 'INFR(2024)2065' },
  { code: 'AT', infr: 'INFR(2024)2054' },
  { code: 'PL', infr: 'INFR(2024)2066' },
  { code: 'PT', infr: 'INFR(2024)2067' },
  { code: 'RO', infr: 'INFR(2024)2068' },
  { code: 'SI', infr: 'INFR(2024)2070' },
  { code: 'SK', infr: 'INFR(2024)2071' },
  { code: 'SE', infr: 'INFR(2024)2069' },
  { code: 'IE', infr: 'INFR(2024)2189' },
]

function matterEvent(
  code: string,
  phase: 'formal_notice' | 'reasoned_opinion',
  date: string,
  sourceId: 'formalNotice18' | 'reasonedOpinion10' | 'ireland',
): MatterEvent {
  const current = countries[code]
  const isIreland = code === 'IE'
  const labels = phase === 'reasoned_opinion'
    ? { zh: '发出 reasoned opinion', en: 'Reasoned opinion issued' }
    : { zh: '发出 formal notice', en: 'Formal notice issued' }
  const descriptions = phase === 'reasoned_opinion'
    ? {
        zh: `欧委会就${current.name.zh}未指定或未充分授权 DGA 主管机关发出 reasoned opinion。`,
        en: `The Commission issued a reasoned opinion because ${current.name.en} had not designated or fully empowered DGA authorities.`,
      }
    : {
        zh: isIreland
          ? '欧委会因爱尔兰未指定 DGA 主管机关发出 formal notice。'
          : `欧委会因${current.name.zh}未指定或未充分授权 DGA 主管机关发出 formal notice。`,
        en: isIreland
          ? 'The Commission sent Ireland a formal notice for not designating DGA authorities.'
          : `The Commission sent ${current.name.en} a formal notice for not designating or fully empowering DGA authorities.`,
      }
  return {
    id: `${code}-${phase}`,
    date,
    label: labels,
    description: descriptions,
    phase,
    sourceIds: [sourceId],
  }
}

function makeMatter({ code, infr }: { code: string; infr: string }): DgaMatter {
  const current = countries[code]
  const isIreland = code === 'IE'
  const currentPhase = reasonedOpinionCodes.has(code) ? 'reasoned_opinion' : 'formal_notice'
  const firstDate = isIreland ? '2024-07-25' : '2024-05-23'
  const latestDate = currentPhase === 'reasoned_opinion' ? '2024-12-16' : firstDate
  const sources = isIreland ? [sourceRefs.ireland] : [sourceRefs.formalNotice18]
  const events = [matterEvent(code, 'formal_notice', firstDate, isIreland ? 'ireland' : 'formalNotice18')]
  if (currentPhase === 'reasoned_opinion') {
    events.push(matterEvent(code, 'reasoned_opinion', latestDate, 'reasonedOpinion10'))
    sources.push(sourceRefs.reasonedOpinion10)
  }
  return {
    matter_id: `dga-${code.toLowerCase()}-authority-2024`,
    title: {
      zh: `${current.name.zh}：DGA 主管机关实施程序`,
      en: `${current.name.en}: DGA competent-authority implementation matter`,
    },
    track: 'implementation',
    country: current,
    infr_number: infr,
    phase: currentPhase,
    first_date: firstDate,
    latest_date: latestDate,
    status: currentPhase === 'reasoned_opinion'
      ? { zh: '已进入 reasoned opinion 阶段', en: 'Reasoned-opinion stage reached' }
      : { zh: '已公开 formal notice', en: 'Formal notice publicly recorded' },
    statusNote: {
      zh: '本登记保存当前 reviewed source set 中最后定位到的公开阶段，不能据此推断程序已结案或仍在进行。',
      en: 'This register preserves the latest public phase located in the reviewed source set; it does not infer closure or current continuation.',
    },
    summary: {
      zh: `欧委会指出${current.name.zh}尚未指定负责实施 DGA 的主管机关，或未证明主管机关已获充分授权。`,
      en: `The Commission said ${current.name.en} had not designated the authorities responsible for implementing the DGA or had not shown that they were fully empowered.`,
    },
    businessImpact: {
      zh: '影响数据中介服务通知、数据利他组织登记及跨部门数据治理的监管路径。',
      en: 'Affects the regulatory path for data-intermediation notifications, data-altruism registration and cross-sector data governance.',
    },
    nextAction: {
      zh: '复核该成员国后续官方实施页面和欧委会 infringement register；不要将缺少后续新闻视为结案。',
      en: 'Review later national implementation pages and the Commission infringement register; absence of later news is not closure.',
    },
    legalBasis: ['Regulation (EU) 2022/868', 'Articles 10–15', 'Articles 16–25', 'Article 31'],
    events,
    sources,
    last_verified_at: DATA_AS_OF,
  }
}

export const MATTERS: DgaMatter[] = formalNoticeMatters.map(makeMatter)

const registryProviderNames: Array<{ code: string; providers: string[] }> = [
  { code: 'AT', providers: ['DID Daten-Intermediär-Dienste FlexCo'] },
  { code: 'BE', providers: ['Athumi', 'Datajoy', 'Publiq'] },
  { code: 'FI', providers: ['Dataspace Europe OY', 'Smarter Contracts'] },
  {
    code: 'FR',
    providers: ['ADH', 'EkologgIA', 'Farm Connect Services', 'Health DataTrust', 'Hub One DataTrust', 'Legal Data Space', 'Linxo', 'M-ITRUST', 'NOTO', 'Powens', 'THEMIS-X', 'Real Data 4 Real Estate', 'Space Data Marketplace', 'VISIONS'],
  },
  { code: 'DE', providers: ['Law & Innovation Technology GmbH (Consenter)', 'Cardian UG'] },
  { code: 'HU', providers: ['NIDHAS Adatközvetítő Korlátolt Felelősségű Társaság'] },
  { code: 'IE', providers: ['Shannova Limited'] },
  {
    code: 'NL',
    providers: ['Datakeeper B.V', 'Dexes', 'Fairsfair.io', 'Future Insight Group B.V.', 'Luminis Technologies', 'Stichting Health-RI', 'Stichting Ontwikkeling Schluss', 'Stichting Nederlandse Datakluis', 'Poort8', 'WeCity', 'Yivi'],
  },
  { code: 'ES', providers: ['Beyond the Scope', 'Vialine Gestión SL', 'Wealthabout SL', 'Weber Economía y Salud'] },
  { code: 'SE', providers: ['Biner Data AB', 'iGrant.io'] },
]

export const INTERMEDIARIES: IntermediaryRecord[] = registryProviderNames.flatMap(({ code, providers }) => providers.map((provider, index) => ({
  id: `intermediary-${code.toLowerCase()}-${index + 1}`,
  track: 'intermediation' as const,
  country: countries[code],
  provider,
  registrationStatus: 'registered' as const,
  sources: [sourceRefs.register],
  last_verified_at: DATA_AS_OF,
})))

const authoritySource = sourceRefs.authorities
const altruismSource = sourceRefs.altruismRegister
const authoritySnapshotDate = '2026-09-15'

function authoritySnapshot(
  code: string,
  competentBody: string[],
  dataIntermediation: string[],
  dataAltruism: string[],
  note?: Bilingual,
): AuthoritySnapshot {
  return {
    id: `authority-${code.toLowerCase()}-${authoritySnapshotDate}`,
    country: countries[code],
    competentBody,
    dataIntermediation,
    dataAltruism,
    sourceUpdatedAt: authoritySnapshotDate,
    note,
    sources: [authoritySource],
    last_verified_at: DATA_AS_OF,
  }
}

export const AUTHORITY_SNAPSHOTS: AuthoritySnapshot[] = [
  authoritySnapshot('AT', ['National statistics office'], ['the Chancellor'], []),
  authoritySnapshot('BE', [
    'The Federal Service Integrator, under the competence of the Federal Public Service Policy and Support',
  ], ['Federal Public Service of Economy, SMEs, Self-Employed and Energy'], []),
  authoritySnapshot('BG', [
    'Minister of e-Government',
    'President of the National Statistical Institute (for reuse of statistical data)',
  ], ['Minister of e-Government'], []),
  authoritySnapshot('HR', ['Croatian Bureau of Statistics'], ['Ministry of Justice, Public Administration and Digital Transformation'], []),
  authoritySnapshot('CY', [], [], [], {
    zh: '欧委会 2026-09-15 清单中未列出该成员国的主管机关名称。',
    en: 'The Commission list updated on 15 September 2026 does not name authorities for this Member State.',
  }),
  authoritySnapshot('CZ', [
    'Ministry of Labour and Social Affairs (for data on social security, employment and social policy)',
    'Czech Statistical Office (for statistical data)',
    'Directorate-General of Finance (for tax data)',
    'Institute of Health Information and Statistics of the Czech Republic (for health data and statistics)',
  ], [], []),
  authoritySnapshot('DK', ['Statistics Denmark'], ['Agency for Digital Government'], []),
  authoritySnapshot('EE', ['Estonian public sector information holders'], ['Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)'], [], {
    zh: '爱沙尼亚说明：各公共部门机构就其相关领域提供咨询。',
    en: 'Estonia notes that each public-sector body provides advice for its respective area.',
  }),
  authoritySnapshot('FI', [
    'Statistics Finland',
    'Finnish Social and Health Data Permit Authority Findata (for secondary use of Finnish transport and health-care data)',
  ], ['Finnish Transport and Communications Agency Traficom'], []),
  authoritySnapshot('FR', [
    'DINUM - Direction interministérielle du numérique, placée sous l’autorité du ministre de la Transformation et de la Fonction publique',
  ], ['ARCEP - L’Autorité de régulation des communications électroniques, des postes et de la distribution de la presse'], [
    'CNIL - La Commission Nationale de l’Informatique et des Libertés',
  ]),
  authoritySnapshot('DE', ['Statistisches Bundesamt (Destatis)'], ['Bundesnetzagentur (BNetzA)'], []),
  authoritySnapshot('EL', ['Hellenic Ministry of Digital Governance'], [], []),
  authoritySnapshot('HU', ['The National Data Asset Agency'], ['The National Data Protection and Freedom of Information Authority'], []),
  authoritySnapshot('IE', ['Central Statistics Office'], ['Competition and Consumer Protection Commission'], []),
  authoritySnapshot('IT', ['l’Agenzia per l’Italia digitale (AgID)'], ['l’Agenzia per l’Italia digitale (AgID)'], []),
  authoritySnapshot('LV', ['Ministry of Environmental Protection and Regional Development Republic of Latvia'], [], []),
  authoritySnapshot('LT', ['The State Data Agency'], ['The State Data Protection Inspectorate'], []),
  authoritySnapshot('LU', ['Commissariat du Gouvernement à la souveraineté des données'], ['la Commission nationale pour la protection des données (CNPD)'], []),
  authoritySnapshot('MT', ['The Data Governance Council'], ['Malta Digital Innovation Authority'], []),
  authoritySnapshot('NL', ['Statistics Netherlands'], ['The Authority for Consumers and Markets'], []),
  authoritySnapshot('PL', ['the President of the Central Statistical Office'], ['the President of the Personal Data Protection Office'], []),
  authoritySnapshot('PT', ['Agency for Administrative Modernisation'], [
    'ANACOM - National Communications Authority',
    'General Secretariat of the Ministry of Finance (for data in the government area of finance)',
    'General Inspection of Agriculture, the Sea, the Environment and Spatial Planning (for data in agriculture and fisheries)',
    'Autoridade de Segurança Alimentar e Económica (for data in the government area of the economy, within the scope of ASAE’s mission and attributions)',
    'General Secretariat of the Ministry of the Environment (for data from the environmental government area)',
    'Serviços Partilhados do Ministério da Saúde, SPMS (for data from the health government area, within the scope of SPMS’s mission and attributions)',
  ], []),
  authoritySnapshot('RO', ['The Authority for the Digitisation of Romania (ADR)'], [], []),
  authoritySnapshot('SK', ['Ministry of Investment, Regional Development and Informatization of the Slovak Republic'], [
    'Ministry of Investment, Regional Development and Informatization of the Slovak Republic',
  ], [
    'Ministry of Investment, Regional Development and Informatization of the Slovak Republic (jointly with the Office for Personal Data Protection of the Slovak Republic)',
  ]),
  authoritySnapshot('SI', ['Inspector for the Information Society, Ministry of Digital Transformation'], [
    'Inspector for the Information Society, Ministry of Digital Transformation',
  ], ['Ministry of Public Administration']),
  authoritySnapshot('ES', [
    'Deputy Directorate General for Planning and Governance of Digital Administration',
    'General Secretariat for Digital Administration',
    'State Secretariat for Digitization and Artificial Intelligence',
    'Ministry of Economic Affairs and Digital Transformation',
    'National Statistics Institute (for statistical data)',
  ], [
    'Deputy Directorate General for Digital Society',
    'Directorate General for Digitization and Artificial Intelligence',
    'State Secretariat for Digitization and Artificial Intelligence',
    'Ministry of Economic Affairs and Digital Transformation',
  ], []),
  authoritySnapshot('SE', ['National Agency for Digital Government (Digg) and Statistics Sweden (SCB)'], ['Swedish Post and Telecom Agency (PTS)'], []),
]

const altruismRecord = (code: string, id: string, organisation: string): DataAltruismOrganisation => ({
  id,
  country: countries[code],
  organisation,
  status: 'recognised',
  sources: [altruismSource],
  last_verified_at: DATA_AS_OF,
})

export const DATA_ALTRUISM_ORGANISATIONS: DataAltruismOrganisation[] = [
  altruismRecord('AT', 'altruism-at-hinterland-systems', 'Hinterland Systems'),
  altruismRecord('BE', 'altruism-be-101-genomes', '101 Genomes'),
  altruismRecord('BE', 'altruism-be-ebdh', 'European Brain Data Hub (EBDH)'),
  altruismRecord('ES', 'altruism-es-datalog', 'Associació Dades pel Benestar Planetari - Datalog'),
  altruismRecord('IE', 'altruism-ie-elec-tariffs', 'Elec-tariffs.ie'),
  altruismRecord('IT', 'altruism-it-aida', 'Associazione Italiana Data e Analytics'),
  altruismRecord('IT', 'altruism-it-sustainable-development-foundation', 'Sustainable Development Foundation'),
]

export const TRANSFER_WATCH: NonPersonalTransferWatch[] = [
  {
    watch_id: 'dga-article-31-public-cases',
    track: 'non_personal_transfer',
    article: 'Article 31',
    title: { zh: '非个人数据国际访问与转移', en: 'International access and transfer of non-personal data' },
    rule: {
      zh: '在欧盟持有的非个人数据如面临第三国政府访问或转移，相关主体应采取合理技术、法律和组织措施，避免与欧盟或成员国法律冲突；第三国决定通常需要国际协议，或满足特定的理由、比例性和司法复核条件。',
      en: 'For non-personal data held in the Union, relevant actors must take reasonable technical, legal and organisational measures to prevent international transfer or governmental access that would conflict with Union or Member State law; third-country orders generally require an international agreement or specific reasoned, proportionate and reviewable conditions.',
    },
    status: 'not_located',
    publicCaseCount: null,
    cases: [],
    scopeNote: {
      zh: '监测范围：2023-09-24 至 2026-11-20 的欧委会 DGA 页面、EUR-Lex DGA 文本/摘要、官方侵权程序新闻、官方登记册和主管机关清单。当前未定位到明确指向 DGA Article 31 的具体公开执法决定；这不是“没有案件”。',
      en: 'Scope: Commission DGA pages, EUR-Lex DGA text/summary, official infringement releases, the public register and authority list from 24 September 2023 through 20 November 2026. No specific public enforcement decision expressly tied to DGA Article 31 was located; this is not a finding that no case exists.',
    },
    nextAction: {
      zh: '继续检索欧委会 infringement register、成员国主管机关页面和法院材料；新增个案时独立建档。',
      en: 'Continue checking the Commission infringement register, national authority pages and court materials; add any located matter as a separate record.',
    },
    sources: [sourceRefs.law, sourceRefs.lawSummary],
    last_verified_at: DATA_AS_OF,
  },
]

export const FOLLOW_UP_REVIEWS: ProcedureFollowUp[] = MATTERS.map((matter) => ({
  id: `${matter.matter_id}-follow-up`,
  matter_id: matter.matter_id,
  country: matter.country,
  status: 'not_located',
  summary: {
    zh: '在本次复核的官方来源范围内，未定位到该事项在当前公开阶段之后的结案、升级或法院进展信号。',
    en: 'No closure, escalation or court signal after the current public phase was located in the reviewed official source set.',
  },
  nextAction: {
    zh: '继续复核欧委会后续公告、成员国主管机关页面及法院材料；未见新公告不等于程序已结案。',
    en: 'Review later Commission releases, national authority pages and court materials; absence of a new release is not closure.',
  },
  sources: matter.sources,
  last_verified_at: DATA_AS_OF,
}))

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'dga-adopted',
    date: '2022-06-30',
    label: { zh: 'DGA 发布', en: 'DGA published' },
    description: { zh: 'Regulation (EU) 2022/868 在欧盟官方公报发布。', en: 'Regulation (EU) 2022/868 was published in the Official Journal.' },
    kind: 'law',
    sourceIds: ['law'],
  },
  {
    id: 'dga-applies',
    date: '2023-09-24',
    label: { zh: 'DGA 开始适用', en: 'DGA applies' },
    description: { zh: 'DGA 的主要数据治理机制开始适用。', en: 'The DGA’s main data-governance mechanisms became applicable.' },
    kind: 'law',
    sourceIds: ['lawSummary', 'explained'],
  },
  {
    id: 'dga-formal-notices-18',
    date: '2024-05-23',
    label: { zh: '18 个成员国 formal notice', en: 'Formal notices to 18 Member States' },
    description: { zh: '欧委会就主管机关指定或授权问题启动 18 个成员国的 infringement procedure。', en: 'The Commission opened infringement procedures against 18 Member States over authority designation or empowerment.' },
    kind: 'procedure',
    sourceIds: ['formalNotice18'],
  },
  {
    id: 'dga-formal-notice-ireland',
    date: '2024-07-25',
    label: { zh: '爱尔兰 formal notice', en: 'Ireland formal notice' },
    description: { zh: '爱尔兰因未指定 DGA 主管机关收到 formal notice。', en: 'Ireland received a formal notice for not designating DGA authorities.' },
    kind: 'procedure',
    sourceIds: ['ireland'],
  },
  {
    id: 'dga-reasoned-opinions-10',
    date: '2024-12-16',
    label: { zh: '10 个成员国 reasoned opinion', en: 'Reasoned opinions to 10 Member States' },
    description: { zh: '10 个成员国的公开程序进入 reasoned opinion 阶段。', en: 'The public procedures for 10 Member States moved to the reasoned-opinion stage.' },
    kind: 'procedure',
    sourceIds: ['reasonedOpinion10'],
  },
  {
    id: 'dga-evaluation-consultation',
    date: '2025-07-08',
    label: { zh: 'DGA 评估咨询', en: 'DGA evaluation consultation' },
    description: { zh: '欧委会启动对 DGA 等数据法规的评估咨询。', en: 'The Commission launched an evaluation consultation covering the DGA and related data laws.' },
    kind: 'review',
    sourceIds: ['evaluation'],
  },
  {
    id: 'dga-intermediary-transition',
    date: '2025-09-24',
    label: { zh: '既有数据中介过渡节点', en: 'Existing intermediary transition point' },
    description: { zh: 'DGA 第 37 条所涉既有数据中介服务应完成 Chapter III 合规过渡。', en: 'Existing data intermediation services covered by Article 37 were due to complete the Chapter III transition.' },
    kind: 'registry',
    sourceIds: ['law'],
  },
  {
    id: 'dga-last-reviewed',
    date: DATA_AS_OF,
    label: { zh: '本次数据复核', en: 'Current data review' },
    description: { zh: '复核官方 DGA 法规、程序公告、主管机关清单和数据中介登记册。', en: 'Reviewed official DGA text, procedure notices, authority list and data-intermediation register.' },
    kind: 'review',
    sourceIds: ['law', 'authorities', 'register', 'formalNotice18', 'reasonedOpinion10', 'ireland'],
  },
]

export const DGA_OVERVIEW: DgaOverview = {
  title: { zh: 'DGA 是什么？', en: 'What is the DGA?' },
  fullName: { zh: '《数据治理法》· Regulation (EU) 2022/868', en: 'Data Governance Act · Regulation (EU) 2022/868' },
  applicableFrom: '2023-09-24',
  summary: {
    zh: 'DGA 建立可信的数据共享治理框架：公共部门受保护数据的有条件复用、数据中介服务的中立与通知、数据利他，以及非个人数据国际访问/转移的保障。它不是 DMA/DSA 式的大型平台或内容治理法规。',
    en: 'The DGA creates a trusted data-sharing governance framework: conditional reuse of protected public-sector data, neutral and notified data intermediation, data altruism, and safeguards for international access or transfer of non-personal data. It is not a DMA/DSA-style large-platform or content-governance law.',
  },
  sections: [
    {
      label: { zh: '公共部门数据复用', en: 'Public-sector data reuse' },
      body: { zh: '为受保护公共部门数据的复用设置条件和支持路径。', en: 'Sets conditions and support paths for reusing protected data held by public-sector bodies.' },
    },
    {
      label: { zh: '数据中介服务', en: 'Data intermediation' },
      body: { zh: '要求中介保持中立、与其他服务结构性分离，并向主管机关通知。', en: 'Requires neutrality, structural separation from other services and notification to competent authorities.' },
    },
    {
      label: { zh: '数据利他', en: 'Data altruism' },
      body: { zh: '支持为公共利益自愿共享数据，并设置认可组织的透明度和保障。', en: 'Supports voluntary sharing for the public interest with transparency and safeguards for recognised organisations.' },
    },
    {
      label: { zh: '非个人数据国际访问', en: 'International access' },
      body: { zh: '第 31 条针对第三国政府访问/转移可能与欧盟或成员国法律冲突的情形提供保障。', en: 'Article 31 safeguards against third-country governmental access or transfer that could conflict with Union or Member State law.' },
    },
  ],
  boundaryRows: [
    {
      regulation: { zh: 'DMA', en: 'DMA' },
      subject: { zh: '守门人和核心平台服务', en: 'Gatekeepers and core platform services' },
      signal: { zh: '调查、不合规决定、罚款、整改', en: 'Investigations, non-compliance decisions, fines and remedies' },
    },
    {
      regulation: { zh: 'DSA', en: 'DSA' },
      subject: { zh: '在线中介、平台、VLOP/VLOSE', en: 'Online intermediaries, platforms and VLOPs/VLOSEs' },
      signal: { zh: '欧委会/DSC 程序、决定、罚款、整改', en: 'Commission/DSC procedures, decisions, fines and remedies' },
    },
    {
      regulation: { zh: 'DGA', en: 'DGA' },
      subject: { zh: '数据共享治理、数据中介、数据利他', en: 'Data-sharing governance, intermediation and altruism' },
      signal: { zh: '实施程序、服务通知/登记、Article 31 监测', en: 'Implementation procedures, service notifications/registrations and Article 31 monitoring' },
    },
  ],
}
