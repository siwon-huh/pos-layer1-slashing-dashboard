import type {
  ConsensusFamily,
  Severity,
  SlashingStatus,
  TokenDestination,
} from './chains';
import type { ClientDiversityStatus, Permissioning } from './decentralization';

export type Locale = 'ko' | 'en';

export const LOCALES: readonly Locale[] = ['ko', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'ko';

export interface LocalizedText {
  readonly ko: string;
  readonly en: string;
}

export function isLocale(value: string): value is Locale {
  return value === 'ko' || value === 'en';
}

export function pick(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export const UI: Record<string, LocalizedText> = {
  title_prefix: { ko: 'PoS L1 ', en: 'PoS L1 ' },
  title_main: { ko: '슬래싱', en: 'Slashing' },
  title_suffix: { ko: ' 대시보드', en: ' Dashboard' },
  subtitle: {
    ko: '시가총액 상위 100 L1 블록체인 중 Proof-of-Stake 체인을 대상으로, 합의 메커니즘, 슬래싱 발동 조건, 슬래싱된 토큰의 처리 방식을 정리합니다. PoW 체인과 L2/사이드체인은 제외되며, PoS지만 슬래싱이 없는 체인도 비교를 위해 포함되어 있습니다.',
    en: 'Consensus mechanisms, slashable conditions, and handling of slashed tokens for Proof-of-Stake L1 blockchains among the top 100 by market cap. PoW chains and L2s/sidechains are excluded; PoS chains without slashing are included for comparison.',
  },
  stat_total: { ko: '조사 대상', en: 'Surveyed' },
  stat_active: { ko: '슬래싱 활성', en: 'Slashing active' },
  stat_inactive: { ko: '비활성 (구현됨)', en: 'Inactive (implemented)' },
  stat_none: { ko: '미도입', en: 'Not adopted' },
  stat_suffix: { ko: '체인', en: ' chains' },
  legend_title: { ko: '토큰 처리 방식 한눈에 보기', en: 'Token handling at a glance' },
  legend_burn_title: { ko: '소각 (Burn)', en: 'Burn' },
  legend_burn_desc: {
    ko: '슬래싱된 토큰이 영구 소각되어 총 공급량 감소. 예: ETH, NEAR, ATOM, XTZ, FIL, INJ',
    en: 'Slashed tokens are permanently burned, reducing total supply. E.g., ETH, NEAR, ATOM, XTZ, FIL, INJ',
  },
  legend_treasury_title: { ko: '트레저리 / 커뮤니티 풀', en: 'Treasury / Community Pool' },
  legend_treasury_desc: {
    ko: '거버넌스가 통제하는 풀로 이동. 예: DOT, KSM (Treasury), TIA, SEI, DYDX, OSMO (Community Pool)',
    en: 'Moved to a governance-controlled pool. E.g., DOT, KSM (Treasury); TIA, SEI, DYDX, OSMO (Community Pool)',
  },
  legend_validator_title: { ko: '검증자 재분배', en: 'Validator redistribution' },
  legend_validator_desc: {
    ko: '다른 정직한 검증자에게 보상으로 재분배. 예: BNB, TON',
    en: 'Redistributed to honest validators as rewards. E.g., BNB, TON',
  },
  filter_all: { ko: '전체', en: 'All' },
  filter_active: { ko: '슬래싱 활성', en: 'Active' },
  filter_inactive: { ko: '비활성 / 미도입', en: 'Inactive / None' },
  filter_tendermint: { ko: 'Tendermint 계열', en: 'Tendermint family' },
  filter_substrate: { ko: 'NPoS (Substrate)', en: 'NPoS (Substrate)' },
  filter_evm: { ko: 'EVM 관련', en: 'EVM related' },
  filter_other: { ko: '기타', en: 'Other' },
  search_placeholder: {
    ko: '체인 이름 또는 심볼 검색…',
    en: 'Search chain name or symbol…',
  },
  footer: {
    ko: '각 체인의 슬래싱 파라미터는 거버넌스/업그레이드에 따라 변동될 수 있으며, 상세 수치는 공식 문서를 기준으로 삼아야 합니다. TVL은 DefiLlama 스냅샷이며, L2 및 스테이블코인은 본 대시보드 기준 상위 100 L1 선정에서 제외했습니다.',
    en: 'Slashing parameters may vary with governance and protocol upgrades; refer to official docs for precise values. TVL figures are DefiLlama snapshots; L2s and stablecoins are excluded from the top-100 L1 selection.',
  },
  credits_prefix: { ko: '제작: ', en: 'Built by ' },
  credits_author: { ko: 'c4lvin', en: 'c4lvin' },
  credits_role: { ko: ' (Four Pillars 리서처)', en: ', Four Pillars Researcher' },
  table_header_rank: { ko: '#', en: '#' },
  table_header_chain: { ko: '체인', en: 'Chain' },
  table_header_tvl: { ko: 'TVL', en: 'TVL' },
  table_header_consensus: { ko: '합의', en: 'Consensus' },
  table_header_slashing: { ko: '슬래싱', en: 'Slashing' },
  table_header_token: { ko: '토큰 처리', en: 'Token handling' },
  table_count_prefix: { ko: '', en: '' },
  table_count_suffix: {
    ko: '개 체인, 행을 클릭해 세부 정보 펼치기',
    en: ' chains, click a row to expand details',
  },
  expand_all: { ko: '모두 펼치기', en: 'Expand all' },
  collapse_all: { ko: '모두 접기', en: 'Collapse all' },
  empty: { ko: '일치하는 체인이 없습니다.', en: 'No matching chains.' },
  detail_consensus: { ko: '합의 메커니즘', en: 'Consensus' },
  detail_offenses: { ko: '슬래싱 조건', en: 'Slashable conditions' },
  detail_no_offenses: {
    ko: '프로토콜 레벨에서 정의된 슬래싱 조건 없음.',
    en: 'No slashable conditions defined at the protocol level.',
  },
  detail_token: { ko: '토큰 처리', en: 'Token handling' },
  detail_docs: { ko: '공식 문서', en: 'Official docs' },
  slashing_label_prefix: { ko: '슬래싱 ', en: '' },

  nav_slashing: { ko: '슬래싱', en: 'Slashing' },
  nav_decentralization: { ko: '노드 탈중앙화', en: 'Node decentralization' },

  decentralization_title_main: { ko: '노드 탈중앙화', en: 'Node decentralization' },
  decentralization_subtitle: {
    ko: '각 PoS L1의 검증자 탈중앙화 수준을 Nakamoto Coefficient, 검증자 수, 진입 장벽, 상위 스테이크 점유율, 퍼미션 모델, 클라이언트 다양성 기준으로 비교합니다. L2 및 permissioned 체인은 해당되는 항목만 표시합니다.',
    en: 'Compare validator decentralization across PoS L1s using Nakamoto Coefficient, validator count, entry barrier, top-stake concentration, permissioning model, and client diversity. L2s and permissioned chains show only applicable metrics.',
  },

  dec_stat_median_nc: { ko: 'Nakamoto 중앙값', en: 'Median Nakamoto' },
  dec_stat_permissionless: { ko: '퍼미션리스', en: 'Permissionless' },
  dec_stat_hybrid: { ko: '하이브리드', en: 'Hybrid' },
  dec_stat_permissioned: { ko: '퍼미션드', en: 'Permissioned' },

  dec_col_nakamoto: { ko: '나카모토 계수', en: 'Nakamoto Coefficient' },
  dec_legend_title: { ko: '나카모토 계수란?', en: 'What is the Nakamoto Coefficient?' },
  dec_legend_body: {
    ko: '체인의 컨센서스를 정지(halt)시키기 위해 담합이 필요한 최소 검증자 수입니다. 지분 합계가 ⅓을 초과하는 최소 상위 검증자 집합의 크기로 정의되며, 숫자가 낮을수록 소수 주체에 의한 중앙화 리스크가 큽니다. 본 대시보드는 검증자(노드) 수 기준을 사용합니다. 예를 들어 모든 validator가 동일 가중치를 갖는 Ethereum은 활성 validator 수(~1.05M)의 ⅓인 약 350K에 달하고, Cosmos Hub처럼 validator마다 스테이크가 불균형하면 상위 7개만으로 ⅓을 넘어 NC=7로 낮아집니다.',
    en: "The minimum number of validators whose combined stake exceeds ⅓, enough to halt the chain's consensus through collusion. Lower numbers indicate higher centralization risk from a small group. This dashboard uses a validator-count basis. For example, on Ethereum where every validator carries an equal weight, NC reaches around 350K (one-third of ~1.05M active validators), while on Cosmos Hub where stake is uneven, the top 7 validators alone cross ⅓, giving NC=7.",
  },
  dec_legend_color_low: { ko: '≤ 5 (심각)', en: '≤ 5 (severe)' },
  dec_legend_color_mid: { ko: '6 ~ 15 (중간)', en: '6 to 15 (moderate)' },
  dec_legend_color_high: { ko: '≥ 16 (양호)', en: '≥ 16 (healthy)' },
  dec_col_validators: { ko: '검증자', en: 'Validators' },
  dec_col_entry: { ko: '진입 장벽', en: 'Entry barrier' },
  dec_col_permission: { ko: '퍼미션', en: 'Permission' },
  dec_col_top33: { ko: '상위 ⅓', en: 'Top ⅓' },
  dec_col_client: { ko: '클라이언트', en: 'Client' },

  dec_detail_nakamoto: { ko: 'Nakamoto Coefficient', en: 'Nakamoto Coefficient' },
  dec_detail_nakamoto_desc: {
    ko: '컨센서스를 halt 시키려면 담합이 필요한 최소 검증자 수 (스테이크 합계가 ⅓을 넘는 최소 집합). 낮을수록 중앙화.',
    en: 'Minimum number of validators whose combined stake exceeds ⅓ and could halt consensus. Lower = more centralized.',
  },
  dec_detail_validators: { ko: '검증자 세트', en: 'Validator set' },
  dec_detail_entry: { ko: '진입 장벽', en: 'Entry barrier' },
  dec_detail_permission: { ko: '퍼미션 모델', en: 'Permissioning model' },
  dec_detail_top33: { ko: '상위 ⅓ 점유', en: 'Top ⅓ stake share' },
  dec_detail_client: { ko: '클라이언트 다양성', en: 'Client diversity' },
  dec_detail_sources: { ko: '데이터 출처', en: 'Sources' },
  dec_detail_last_updated: { ko: '업데이트 기준', en: 'Last updated' },

  permission_permissionless: { ko: '퍼미션리스', en: 'Permissionless' },
  permission_hybrid: { ko: '하이브리드', en: 'Hybrid' },
  permission_permissioned: { ko: '퍼미션드', en: 'Permissioned' },
  permission_na: { ko: '해당 없음', en: 'N/A' },

  client_single: { ko: '단일 구현', en: 'Single implementation' },
  client_multi: { ko: '다중 구현', en: 'Multiple implementations' },
  client_na: { ko: '해당 없음', en: 'N/A' },

  no_data: { ko: '데이터 없음', en: 'No data' },
  uncapped: { ko: '상한 없음', en: 'Uncapped' },
};

export const CONSENSUS_FAMILY_LABEL: Record<ConsensusFamily, LocalizedText> = {
  Gasper: { ko: 'Gasper', en: 'Gasper' },
  Tendermint: { ko: 'CometBFT / Tendermint', en: 'CometBFT / Tendermint' },
  NPoS: { ko: 'NPoS', en: 'NPoS' },
  PoSA: { ko: 'PoSA', en: 'PoSA' },
  Nightshade: { ko: 'Nightshade', en: 'Nightshade' },
  'PoS-Other': { ko: 'PoS (기타)', en: 'PoS (other)' },
  'DAG-BFT': { ko: 'DAG-BFT', en: 'DAG-BFT' },
  Snowman: { ko: 'Snowman', en: 'Snowman' },
  Ouroboros: { ko: 'Ouroboros', en: 'Ouroboros' },
  PPoS: { ko: 'Pure PoS', en: 'Pure PoS' },
  LPoS: { ko: 'Liquid PoS', en: 'Liquid PoS' },
  DPoS: { ko: 'Delegated PoS', en: 'Delegated PoS' },
  TowerBFT: { ko: 'Tower BFT', en: 'Tower BFT' },
  AptosBFT: { ko: 'AptosBFT', en: 'AptosBFT' },
  Hashgraph: { ko: 'Hashgraph', en: 'Hashgraph' },
  'Catchain-BFT': { ko: 'Catchain BFT', en: 'Catchain BFT' },
  FBA: { ko: 'Federated BFT', en: 'Federated BFT' },
  HotStuff: { ko: 'HotStuff', en: 'HotStuff' },
  Lachesis: { ko: 'Lachesis aBFT', en: 'Lachesis aBFT' },
  'Nakamoto-PoX': { ko: 'Nakamoto + PoX', en: 'Nakamoto + PoX' },
  ChainKey: { ko: 'Chain Key Cryptography', en: 'Chain Key Cryptography' },
};

export const TOKEN_DESTINATION_LABEL: Record<TokenDestination, LocalizedText> = {
  burn: { ko: '소각 (Burn)', en: 'Burn' },
  treasury: { ko: '트레저리', en: 'Treasury' },
  community_pool: { ko: '커뮤니티 풀', en: 'Community Pool' },
  whistleblower_and_burn: {
    ko: '소각 + 고발자 보상',
    en: 'Burn + Whistleblower reward',
  },
  validator_pool: { ko: '검증자 재분배', en: 'Validator redistribution' },
  shared_security: { ko: '공유 보안 (Cosmos Hub)', en: 'Shared security (Cosmos Hub)' },
  reward_forfeiture: { ko: '보상만 차감 (원금 보존)', en: 'Reward forfeiture (stake preserved)' },
  none: { ko: '해당 없음', en: 'N/A' },
};

export const SLASHING_STATUS_LABEL: Record<SlashingStatus, LocalizedText> = {
  active: { ko: '활성', en: 'Active' },
  inactive: { ko: '비활성', en: 'Inactive' },
  none: { ko: '미도입', en: 'None' },
};

export const SEVERITY_LABEL: Record<Severity, LocalizedText> = {
  severe: { ko: '심각', en: 'Severe' },
  moderate: { ko: '중간', en: 'Moderate' },
  mild: { ko: '경미', en: 'Mild' },
};

export const PERMISSIONING_LABEL: Record<Permissioning, LocalizedText> = {
  permissionless: { ko: '퍼미션리스', en: 'Permissionless' },
  hybrid: { ko: '하이브리드', en: 'Hybrid' },
  permissioned: { ko: '퍼미션드', en: 'Permissioned' },
  'n/a': { ko: '해당 없음', en: 'N/A' },
};

export const CLIENT_DIVERSITY_LABEL: Record<ClientDiversityStatus, LocalizedText> = {
  single: { ko: '단일 구현', en: 'Single' },
  multi: { ko: '다중 구현', en: 'Multiple' },
  'n/a': { ko: '해당 없음', en: 'N/A' },
};
