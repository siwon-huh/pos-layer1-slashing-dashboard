import type { LocalizedText } from './i18n';

export type ConsensusFamily =
  | 'Gasper'
  | 'Tendermint'
  | 'NPoS'
  | 'PoSA'
  | 'Nightshade'
  | 'PoS-Other'
  | 'DAG-BFT'
  | 'Snowman'
  | 'Ouroboros'
  | 'PPoS'
  | 'LPoS'
  | 'DPoS'
  | 'TowerBFT'
  | 'AptosBFT'
  | 'Hashgraph'
  | 'Catchain-BFT'
  | 'FBA'
  | 'HotStuff'
  | 'Lachesis'
  | 'Nakamoto-PoX'
  | 'ChainKey';

export type SlashingStatus = 'active' | 'inactive' | 'none';

export type TokenDestination =
  | 'burn'
  | 'treasury'
  | 'community_pool'
  | 'whistleblower_and_burn'
  | 'validator_pool'
  | 'shared_security'
  | 'reward_forfeiture'
  | 'none';

export type Severity = 'severe' | 'moderate' | 'mild';

export interface SlashingOffense {
  readonly name: LocalizedText;
  readonly description: LocalizedText;
  readonly penalty: LocalizedText;
  readonly severity: Severity;
}

export interface Chain {
  readonly id: string;
  readonly name: string;
  readonly nameKo: string;
  readonly symbol: string;
  readonly tvlRank: number;
  readonly tvlUsd: number;
  readonly consensus: LocalizedText;
  readonly consensusFamily: ConsensusFamily;
  readonly slashingStatus: SlashingStatus;
  readonly slashingNote?: LocalizedText;
  readonly offenses: readonly SlashingOffense[];
  readonly tokenDestination: TokenDestination;
  readonly tokenHandlingDescription: LocalizedText;
  readonly color: string;
  readonly docsUrl?: string;
}

export function formatTvlUsd(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(tvl >= 100_000_000 ? 0 : 1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(0)}K`;
  return `$${tvl.toFixed(0)}`;
}

type RawChain = Omit<Chain, 'tvlRank'>;

const RAW_CHAINS: readonly RawChain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    nameKo: '이더리움',
    symbol: 'ETH',
    tvlUsd: 45_757_863_186,
    consensus: {
      ko: 'Gasper (Casper FFG finality + LMD GHOST fork choice)',
      en: 'Gasper (Casper FFG finality + LMD GHOST fork choice)',
    },
    consensusFamily: 'Gasper',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '제안자 이중 서명', en: 'Proposer Equivocation' },
        description: {
          ko: '동일 슬롯에 대해 서로 다른 두 블록을 제안하는 행위.',
          en: 'Proposing two different blocks for the same slot.',
        },
        penalty: {
          ko: '초기 1/4096 EB (Electra 기준) + 상관 페널티 최대 100%',
          en: 'Initial 1/4096 EB (Electra spec) + correlation penalty up to 100%',
        },
        severity: 'severe',
      },
      {
        name: { ko: '증인 이중 투표', en: 'Attester Double Vote' },
        description: {
          ko: '동일 타겟 에폭에 대해 서로 다른 두 증언(attestation)을 생성.',
          en: 'Producing two conflicting attestations for the same target epoch.',
        },
        penalty: {
          ko: '초기 페널티 + ~18일 윈도우 내 상관 페널티',
          en: 'Initial penalty + correlation penalty within a ~18-day window',
        },
        severity: 'severe',
      },
      {
        name: { ko: '증인 Surround 투표', en: 'Attester Surround Vote' },
        description: {
          ko: '한 증언의 source-target 범위가 다른 증언을 포위하거나 그 반대인 경우.',
          en: "An attestation's source-target range surrounds (or is surrounded by) another.",
        },
        penalty: {
          ko: '초기 페널티 + 상관 페널티 최대 100%',
          en: 'Initial penalty + correlation penalty up to 100%',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'whistleblower_and_burn',
    tokenHandlingDescription: {
      ko: '슬래싱된 ETH 중 1/512 EB는 블록 제안자와 고발자에게 보상으로 지급되고, 나머지는 소각되어 총 공급량이 감소합니다. 상관 페널티는 8,192 에폭(~36일) 윈도우 내 다른 슬래싱 총량에 비례하여 ~18일 중간 지점에서 평가되며, 이론상 최대 100%까지 도달할 수 있습니다. 슬래싱된 검증자는 약 36일 후 강제 종료(exit)됩니다.',
      en: '1/512 EB of slashed ETH is paid to the block proposer and whistleblower; the remainder is burned, reducing total supply. The correlation penalty scales with the sum of all slashings across an 8,192-epoch (~36-day) window, assessed at the ~18-day midpoint, and can reach up to 100% in the worst case. Slashed validators are force-exited after ~36 days.',
    },
    color: '#627EEA',
    docsUrl: 'https://eth2book.info/latest/part2/incentives/slashing/',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    nameKo: '비엔비 체인',
    symbol: 'BNB',
    tvlUsd: 5_589_025_328,
    consensus: {
      ko: 'PoSA (Proof of Staked Authority) + Fast Finality',
      en: 'PoSA (Proof of Staked Authority) + Fast Finality',
    },
    consensusFamily: 'PoSA',
    slashingStatus: 'active',
    offenses: [
      {
        name: {
          ko: '악의적 Fast Finality 투표',
          en: 'Malicious Vote (BEP-319)',
        },
        description: {
          ko: '충돌하는 fast finality 투표를 제출하는 행위.',
          en: 'Submitting conflicting fast-finality votes.',
        },
        penalty: {
          ko: '약 200 BNB + 30일 Jail + Felon 처리',
          en: '~200 BNB + 30-day Jail + Felon status',
        },
        severity: 'severe',
      },
      {
        name: { ko: '이중 서명', en: 'Double Sign' },
        description: {
          ko: '동일 블록 높이에서 서로 다른 블록에 서명.',
          en: 'Signing different blocks at the same height.',
        },
        penalty: { ko: '약 200 BNB + 30일 Jail', en: '~200 BNB + 30-day Jail' },
        severity: 'severe',
      },
      {
        name: { ko: '블록 누락 (Tier 1)', en: 'Unavailability (Tier 1)' },
        description: {
          ko: '24시간 동안 50블록 이상 누락.',
          en: 'Missing 50+ blocks in a 24-hour window.',
        },
        penalty: {
          ko: '해당 라운드 블록 보상 몰수',
          en: 'Forfeit block rewards for that round',
        },
        severity: 'mild',
      },
      {
        name: { ko: '블록 누락 (Tier 2)', en: 'Unavailability (Tier 2)' },
        description: {
          ko: '24시간 동안 150블록 이상 누락(지속적 오프라인).',
          en: 'Missing 150+ blocks in a 24-hour window (persistent offline).',
        },
        penalty: {
          ko: '10 BNB (거버넌스 조정 가능) + 2일 Jail',
          en: '10 BNB (governance-adjustable) + 2-day Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'validator_pool',
    tokenHandlingDescription: {
      ko: '슬래싱된 BNB는 소각되지 않고 다음 분배에 참여하는 validator들의 credit 주소로 전달되어 재분배됩니다. Malicious Vote의 경우, 증거를 제출한 submitter에게 SystemReward 컨트랙트에서 5 BNB가 별도 보상으로 지급됩니다. BNB Beacon Chain 셧다운(2024.4) 이후 BSC의 StakeHub 컨트랙트가 모든 슬래싱을 관장합니다.',
      en: 'Slashed BNB is not burned but transferred to the credit addresses of validators participating in the next distribution (redistribution). For Malicious Vote, the submitter of the evidence receives a separate 5 BNB reward from the SystemReward contract. Since the BNB Beacon Chain shutdown (Apr 2024), BSC\'s StakeHub contract manages all slashing.',
    },
    color: '#F3BA2F',
    docsUrl: 'https://docs.bnbchain.org/bnb-smart-chain/slashing/slash-rules/',
  },
  {
    id: 'solana',
    name: 'Solana',
    nameKo: '솔라나',
    symbol: 'SOL',
    tvlUsd: 5_557_039_120,
    consensus: {
      ko: 'Proof of History (PoH) + Tower BFT',
      en: 'Proof of History (PoH) + Tower BFT',
    },
    consensusFamily: 'TowerBFT',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: '프로토콜에 슬래싱 코드는 존재하나 현재 실제 슬래싱은 실행되지 않습니다. SIMD-0204 제안을 통해 이중 서명 슬래싱 도입이 진행 중입니다.',
      en: 'Slashing code exists in the protocol but is not currently enforced. SIMD-0204 proposes introducing double-sign slashing.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '현재 실질적 슬래싱 미시행 상태입니다. 악의적 행동은 델리게이터의 수동 언스테이킹으로만 대응되며, 다운타임은 보상 포기 형태로만 반영됩니다.',
      en: 'Slashing is not currently enforced in practice. Malicious behavior is addressed only through voluntary delegator unstaking, and downtime is reflected only as forgone rewards.',
    },
    color: '#14F195',
    docsUrl: 'https://github.com/solana-foundation/solana-improvement-documents',
  },
  {
    id: 'tron',
    name: 'Tron',
    nameKo: '트론',
    symbol: 'TRX',
    tvlUsd: 5_054_885_394,
    consensus: {
      ko: 'DPoS, 27 Super Representatives',
      en: 'DPoS, 27 Super Representatives',
    },
    consensusFamily: 'DPoS',
    slashingStatus: 'none',
    slashingNote: {
      ko: 'DPoS 구조상 슬래싱이 없습니다. 부정행위 SR은 투표로 교체되는 방식으로만 제재됩니다.',
      en: 'No slashing by DPoS design. Misbehaving SRs are disciplined only through voting replacement.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '슬래싱 없음. 블록을 생성하지 않거나 악의적인 SR은 단순히 블록 보상을 받지 못하고, TRX 보유자의 투표로 교체될 수 있습니다.',
      en: 'No slashing. SRs that fail to produce blocks or act maliciously simply miss block rewards and can be replaced by TRX-holder votes.',
    },
    color: '#FF060A',
    docsUrl: 'https://developers.tron.network/docs/super-representatives',
  },
  {
    id: 'provenance',
    name: 'Provenance',
    nameKo: '프로비넌스',
    symbol: 'HASH',
    tvlUsd: 1_626_166_015,
    consensus: {
      ko: 'CometBFT (Cosmos SDK, 금융 서비스 특화 L1)',
      en: 'CometBFT (Cosmos SDK, financial-services-focused L1)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Equivocation' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 prevote/precommit 서명.',
          en: 'Conflicting prevote/precommit signatures at the same height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + 영구 Tombstone',
          en: '5% of bonded stake + permanent Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Liveness Fault' },
        description: {
          ko: '서명 윈도우 내 과도한 블록 누락.',
          en: 'Excessive missed blocks within the signing window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.01% + Jail',
          en: '0.01% of bonded stake + Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '표준 Cosmos SDK 슬래싱 모델. 슬래싱된 HASH는 bonded pool에서 차감되어 소각됩니다. 금융 기관(Figure 계열) 사용 비중이 높아 검증자 집단이 상대적으로 제한적입니다.',
      en: 'Standard Cosmos SDK slashing model. Slashed HASH is deducted from the bonded pool and burned. The validator set is relatively limited given heavy usage by financial institutions (Figure ecosystem).',
    },
    color: '#413567',
    docsUrl: 'https://docs.provenance.io/',
  },
  {
    id: 'hyperliquid',
    name: 'Hyperliquid L1',
    nameKo: '하이퍼리퀴드',
    symbol: 'HYPE',
    tvlUsd: 1_457_413_756,
    consensus: {
      ko: 'HyperBFT (HotStuff 파생, Rust 구현)',
      en: 'HyperBFT (HotStuff-derived, Rust implementation)',
    },
    consensusFamily: 'HotStuff',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: '공식 문서 기준 자동 슬래싱은 현재 구현되어 있지 않으며, 저성능/비응답 validator에 대한 peer 투표 jail만 운영됩니다. 이중 서명 등 입증 가능한 악의적 행위에 대한 슬래싱은 향후 도입 예정으로 명시되어 있습니다.',
      en: 'Per official docs, no automatic slashing is currently implemented — only peer-vote jailing for underperforming/unresponsive validators. Slashing for provable malicious behavior (e.g., double-signing) is documented as a planned future feature.',
    },
    offenses: [
      {
        name: { ko: '낮은 성능 / 비응답', en: 'Low Performance / Unresponsiveness' },
        description: {
          ko: '다른 validator 투표로 jail되어 활성 세트에서 제외.',
          en: 'Jailed via peer vote and removed from the active set.',
        },
        penalty: {
          ko: '스테이크 슬래시 없음, Jail (unjail 가능)',
          en: 'No stake slash, Jail (unjail possible)',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: 'Hyperliquid L1은 주문서 기반 DEX를 합의 레벨에 통합한 HyperBFT(HotStuff 파생)를 사용합니다. 현재는 peer 투표로 validator를 jail할 수는 있으나 자동 스테이크 슬래싱은 구현되지 않았으며, 악의적 행위에 대한 슬래싱은 향후 도입이 예정되어 있습니다.',
      en: 'Hyperliquid L1 runs HyperBFT (HotStuff-derived) with an order-book DEX integrated at the consensus layer. Validators can be jailed via peer vote, but automatic stake slashing is not yet implemented; slashing for malicious behavior is a planned future feature.',
    },
    color: '#97FCE4',
    docsUrl: 'https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking',
  },
  {
    id: 'polygon',
    name: 'Polygon PoS',
    nameKo: '폴리곤 PoS',
    symbol: 'POL',
    tvlUsd: 1_190_878_188,
    consensus: {
      ko: 'Heimdall (Tendermint) + Bor (EVM), Ethereum L1 staking',
      en: 'Heimdall (Tendermint) + Bor (EVM), Ethereum L1 staking',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: 'Heimdall 레이어에서의 충돌 서명.',
          en: 'Conflicting signatures at the Heimdall layer.',
        },
        penalty: { ko: '스테이크의 약 2–5% + Jail (StakeManager 파라미터 기반)', en: '~2–5% of stake + Jail (StakeManager parameter)' },
        severity: 'moderate',
      },
      {
        name: { ko: '체크포인트 미서명', en: 'Missed Checkpoint' },
        description: { ko: '체크포인트 제출 실패.', en: 'Failing to submit a checkpoint.' },
        penalty: { ko: '스테이크의 약 0.03%', en: '~0.03% of stake' },
        severity: 'mild',
      },
      {
        name: { ko: '유효하지 않은 체크포인트', en: 'Invalid Checkpoint' },
        description: {
          ko: '잘못된 체크포인트를 L1에 제출.',
          en: 'Submitting an invalid checkpoint to L1.',
        },
        penalty: { ko: '고정 금액 + Jail', en: 'Fixed amount + Jail' },
        severity: 'severe',
      },
    ],
    tokenDestination: 'whistleblower_and_burn',
    tokenHandlingDescription: {
      ko: '슬래싱은 이더리움 L1의 StakeManager 컨트랙트에서 실행됩니다. 슬래싱된 POL의 일부는 고발자(Proposer)에게 보상으로 지급되고 나머지는 컨트랙트에 보관됩니다. POL 마이그레이션 이후에도 동일한 로직이 유지됩니다.',
      en: 'Slashing is executed in the StakeManager contract on Ethereum L1. A portion of slashed POL is paid to the proposer (whistleblower), with the rest retained by the contract. The same logic is preserved after the POL migration.',
    },
    color: '#8247E5',
    docsUrl: 'https://docs.polygon.technology/pos/architecture/heimdall_v2/introduction',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    nameKo: '아발란체',
    symbol: 'AVAX',
    tvlUsd: 652_114_258,
    consensus: {
      ko: 'Snowman / Avalanche Consensus (Metastable BFT)',
      en: 'Snowman / Avalanche Consensus (Metastable BFT)',
    },
    consensusFamily: 'Snowman',
    slashingStatus: 'none',
    slashingNote: {
      ko: '프로토콜 레벨 슬래싱이 없습니다. 80% 업타임 미달 시 스테이킹 보상이 0이 되는 업타임 기반 모델을 사용합니다.',
      en: 'No protocol-level slashing. Uses an uptime-based reward model where staking rewards drop to zero if uptime falls below 80%.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '슬래싱 없음. 검증자는 스테이크 전액을 보장받지만 업타임이 기준 미달이면 보상을 받지 못합니다. 서브넷(L1) 운영자는 서브넷별 슬래싱 정책을 별도로 설계할 수 있습니다.',
      en: 'No slashing. Validators retain their full stake but forfeit rewards when uptime falls below the threshold. Subnet (L1) operators can design their own slashing policies.',
    },
    color: '#E84142',
    docsUrl: 'https://build.avax.network/docs/nodes/validate/how-to-stake',
  },
  {
    id: 'sui',
    name: 'Sui',
    nameKo: '수이',
    symbol: 'SUI',
    tvlUsd: 572_609_103,
    consensus: { ko: 'Mysticeti (DAG 기반 BFT)', en: 'Mysticeti (DAG-based BFT)' },
    consensusFamily: 'DAG-BFT',
    slashingStatus: 'none',
    slashingNote: {
      ko: '암호학적 슬래싱 없음. Tallying Rule 기반 평판 시스템을 사용합니다.',
      en: 'No cryptographic slashing. Uses a Tallying Rule-based reputation system.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '검증자들이 상호 성능 평가를 통해 부정행위자를 보고(tallying)하고, 해당 검증자는 에폭 종료 시 스테이킹 보상만 받지 못합니다. 원금(principal) 스테이크는 보존됩니다.',
      en: "Validators mutually rate each other's performance (tallying); underperformers forfeit only their staking rewards for the epoch. Principal stake is preserved.",
    },
    color: '#4CA2FF',
    docsUrl: 'https://docs.sui.io/concepts/tokenomics',
  },
  {
    id: 'monad',
    name: 'Monad',
    nameKo: '모나드',
    symbol: 'MON',
    tvlUsd: 316_221_613,
    consensus: {
      ko: 'MonadBFT (파이프라인 HotStuff 변종)',
      en: 'MonadBFT (pipelined HotStuff variant)',
    },
    consensusFamily: 'HotStuff',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 투표', en: 'Double Vote' },
        description: {
          ko: '동일 라운드에서 충돌하는 투표 제출.',
          en: 'Submitting conflicting votes in the same round.',
        },
        penalty: {
          ko: '스테이크 슬래싱 + 검증자 제외',
          en: 'Stake slashing + removal from the validator set',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Monad는 파이프라인 HotStuff 기반 BFT로 검증자가 MON을 스테이킹합니다. 이중 서명 등 비잔틴 행위 시 스테이크 일부가 슬래싱되고 소각됩니다. 메인넷 초기이므로 세부 파라미터는 거버넌스로 조정될 수 있습니다.',
      en: 'Monad uses a pipelined HotStuff BFT where validators stake MON. Byzantine behavior such as double-signing results in partial stake slashing and burning. As the mainnet is early, detailed parameters may be adjusted via governance.',
    },
    color: '#836EF9',
    docsUrl: 'https://docs.monad.xyz/',
  },
  {
    id: 'cronos',
    name: 'Cronos',
    nameKo: '크로노스',
    symbol: 'CRO',
    tvlUsd: 299_590_840,
    consensus: {
      ko: 'CometBFT (Cosmos SDK). Cronos EVM은 별도 Ethermint 기반 체인.',
      en: 'CometBFT (Cosmos SDK). Cronos EVM is a separate Ethermint-based chain.',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이 충돌 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '서명 윈도우 내 과도한 블록 누락.',
          en: 'Excessive missed blocks within the signing window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.0001% + Jail',
          en: '0.0001% of bonded stake + Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Cronos POS Chain은 Cosmos SDK 기반으로 슬래싱된 CRO가 소각됩니다. Cronos POS Chain(chain-main)은 EVM 모듈을 포함하지 않으며, EVM 호환 체인인 Cronos EVM은 별도입니다.',
      en: 'Cronos POS Chain is Cosmos SDK-based and burns slashed CRO. The Cronos POS Chain (chain-main) does not include an EVM module; Cronos EVM is a separate chain.',
    },
    color: '#103F68',
    docsUrl: 'https://docs.cronos.org/',
  },
  {
    id: 'aptos',
    name: 'Aptos',
    nameKo: '앱토스',
    symbol: 'APT',
    tvlUsd: 286_333_406,
    consensus: { ko: 'AptosBFT v4 (DiemBFT 파생)', en: 'AptosBFT v4 (DiemBFT derivative)' },
    consensusFamily: 'AptosBFT',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: '프로토콜에 슬래싱 모듈 정의는 있으나 Byzantine 행위에 대한 실제 슬래싱은 아직 활성화되지 않았습니다. 비활동 페널티(보상 감소)만 적용됩니다.',
      en: 'Slashing modules are defined in the protocol, but actual slashing for Byzantine behavior is not yet activated. Only inactivity penalties (reward reduction) apply.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '현재 Byzantine 슬래싱은 미시행 상태입니다. 검증자 성능 기반 보상 변동 (인센티브 기반 reputation)이 주된 제재 수단입니다.',
      en: 'Byzantine slashing is not currently enforced. Performance-based reward variation (incentive-driven reputation) is the primary deterrent.',
    },
    color: '#00D4AA',
    docsUrl: 'https://aptos.dev/network/blockchain/staking',
  },
  {
    id: 'stellar',
    name: 'Stellar',
    nameKo: '스텔라',
    symbol: 'XLM',
    tvlUsd: 204_399_720,
    consensus: {
      ko: 'Stellar Consensus Protocol (FBA)',
      en: 'Stellar Consensus Protocol (FBA)',
    },
    consensusFamily: 'FBA',
    slashingStatus: 'none',
    slashingNote: {
      ko: '지분 예치(staking)가 없는 Federated Byzantine Agreement 합의. 슬래싱 개념이 존재하지 않습니다.',
      en: 'Federated Byzantine Agreement consensus without staking. The concept of slashing does not apply.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '노드들이 "Quorum Slice"를 통해 서로 신뢰 관계를 구성하는 구조로, 토큰을 예치하지 않아 슬래싱할 대상이 없습니다. 악의적 노드는 다른 노드들의 quorum에서 배제되는 방식으로 제재.',
      en: 'Nodes form trust relationships via "Quorum Slices" without depositing tokens, so there is nothing to slash. Malicious nodes are penalized only by being excluded from other nodes\' quorums.',
    },
    color: '#FDDA24',
    docsUrl: 'https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol',
  },
  {
    id: 'movement',
    name: 'Movement',
    nameKo: '무브먼트',
    symbol: 'MOVE',
    tvlUsd: 165_019_159,
    consensus: {
      ko: 'Movement-BFT (AptosBFT 파생, Move VM)',
      en: 'Movement-BFT (AptosBFT derivative, Move VM)',
    },
    consensusFamily: 'AptosBFT',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: 'Aptos와 동일한 DiemBFT 계보. 현재 Byzantine 슬래싱은 구현 중이며 메인넷에서는 비활동 페널티 중심으로 운영 중입니다.',
      en: 'Same DiemBFT lineage as Aptos. Byzantine slashing is under implementation; mainnet currently enforces only inactivity penalties.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '메인넷 초기이며 Byzantine 슬래싱은 비활성화 상태입니다. 성능 기반 보상 감소 및 로테이션으로 검증자를 관리합니다.',
      en: 'Mainnet is early and Byzantine slashing is inactive. Validators are managed via performance-based reward reduction and rotation.',
    },
    color: '#FFD449',
    docsUrl: 'https://docs.movementnetwork.xyz/',
  },
  {
    id: 'cardano',
    name: 'Cardano',
    nameKo: '카르다노',
    symbol: 'ADA',
    tvlUsd: 135_543_373,
    consensus: {
      ko: 'Ouroboros Praos / Genesis (Pure PoS)',
      en: 'Ouroboros Praos / Genesis (Pure PoS)',
    },
    consensusFamily: 'Ouroboros',
    slashingStatus: 'none',
    slashingNote: {
      ko: '프로토콜 설계상 슬래싱이 없습니다. 풀 운영자의 신뢰도는 오프체인 평판과 풀 이탈로 관리됩니다.',
      en: 'By protocol design, there is no slashing. Stake-pool operator trust is managed through off-chain reputation and delegator exits.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '슬래싱 없음. 위임자의 ADA는 스테이크 풀에 예치되지 않고 지갑에 그대로 머무릅니다 (non-custodial staking). 풀 운영자의 부정은 델리게이터 이탈로 귀결됩니다.',
      en: "No slashing. Delegator ADA stays in the delegator's wallet rather than being deposited into the pool (non-custodial staking). Pool-operator misbehavior is penalized only through delegator exits.",
    },
    color: '#0033AD',
    docsUrl: 'https://docs.cardano.org/',
  },
  {
    id: 'stacks',
    name: 'Stacks',
    nameKo: '스택스',
    symbol: 'STX',
    tvlUsd: 120_918_963,
    consensus: {
      ko: 'Nakamoto + Proof of Transfer (PoX), Bitcoin finality',
      en: 'Nakamoto + Proof of Transfer (PoX), Bitcoin finality',
    },
    consensusFamily: 'Nakamoto-PoX',
    slashingStatus: 'none',
    slashingNote: {
      ko: 'PoX 설계상 STX 슬래싱이 존재하지 않습니다. 비활성/악의적 Stacker는 해당 주기의 BTC PoX 보상만 받지 못하고 signer 세트에서 제외되며, 잠긴 STX는 보존됩니다.',
      en: 'By PoX design, STX is never slashed. Inactive or malicious Stackers only forfeit their BTC PoX rewards for that cycle and are excluded from the signer set; the locked STX remains intact.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: 'Nakamoto 업그레이드(2024) 이후 signers(Stackers)가 블록 확정에 서명하지만, STX 원본은 슬래싱 대상이 아닙니다. 악의적 또는 비활성 signer는 해당 cycle의 비트코인 보상을 받지 못하며(그 BTC는 소각 주소로 전송) signer 세트에서 제외됩니다.',
      en: 'Since the Nakamoto upgrade (2024), signers (Stackers) sign block finalizations, but principal STX is never slashed. Malicious or inactive signers forfeit their BTC rewards for that cycle (with the unclaimed BTC sent to a burn address) and are removed from the signer set.',
    },
    color: '#5546FF',
    docsUrl: 'https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md',
  },
  {
    id: 'near',
    name: 'NEAR Protocol',
    nameKo: '니어 프로토콜',
    symbol: 'NEAR',
    tvlUsd: 113_172_121,
    consensus: {
      ko: 'Nightshade (샤딩) + Doomslug finality',
      en: 'Nightshade (sharding) + Doomslug finality',
    },
    consensusFamily: 'Nightshade',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: '프로토콜에 ChunkProofsChallenge 등 비잔틴 슬래싱 로직이 존재하지만 현재 메인넷에서는 실제로 활성화되지 않았습니다. 악의적 validator는 다음 에폭에서 활성 세트에서 제외되는 방식으로만 제재됩니다.',
      en: 'The protocol contains Byzantine slashing logic (e.g., ChunkProofsChallenge), but it is not currently enforced on mainnet. Malicious validators are only disciplined by being dropped from the active set in the next epoch.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '현재 슬래싱은 실제 집행되지 않습니다. 다운타임과 비잔틴 행위 모두 해당 에폭 보상을 받지 못하고 활성 세트에서 제외되는 선에서 마무리됩니다. 슬래싱 도입 시점은 미정입니다.',
      en: 'Slashing is not currently enforced in practice. Both downtime and Byzantine misbehavior are addressed only through reward forfeiture and removal from the active set in the next epoch. There is no committed timeline for activating slashing.',
    },
    color: '#17D9D4',
    docsUrl: 'https://docs.near.org/protocol/network/validators',
  },
  {
    id: 'dydx',
    name: 'dYdX Chain',
    nameKo: '디와이디엑스',
    symbol: 'DYDX',
    tvlUsd: 102_514_045,
    consensus: { ko: 'CometBFT (Cosmos SDK)', en: 'CometBFT (Cosmos SDK)' },
    consensusFamily: 'Tendermint',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: 'dYdX Chain은 `slash_fraction_double_sign`과 `slash_fraction_downtime` 모두 0으로 설정되어 있어 DYDX 스테이크가 실제로 깎이지 않습니다. 제재는 jail/tombstone을 통한 validator 세트 제거로만 이루어집니다.',
      en: 'dYdX Chain has both `slash_fraction_double_sign` and `slash_fraction_downtime` set to 0, so DYDX stake is not actually reduced. Enforcement is limited to validator-set removal via jail/tombstone.',
    },
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '스테이크 슬래시 없음, Tombstone(영구 제거)',
          en: 'No stake slash, Tombstone (permanent removal)',
        },
        severity: 'moderate',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '8,192 블록 윈도우 내 20% 미만 서명.',
          en: 'Signing fewer than 20% of blocks in an 8,192-block window.',
        },
        penalty: {
          ko: '스테이크 슬래시 없음, 2시간 Jail',
          en: 'No stake slash, 2-hour Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: 'dYdX Chain은 모든 거래 수수료를 USDC로 트레이더에게 지급하는 구조상, 토큰 차감 대신 미래 USDC 수수료 상실을 경제적 유인으로 삼아 두 슬래시 분수를 0으로 유지합니다. 악의적 validator는 tombstone 또는 jail로만 제재됩니다.',
      en: "dYdX Chain pays all trading fees to traders in USDC, so instead of token slashing, it relies on the loss of future USDC fees as the economic disincentive — both slash fractions are kept at 0. Malicious validators are disciplined only via tombstone or jail.",
    },
    color: '#6966FF',
    docsUrl: 'https://docs.dydx.xyz/',
  },
  {
    id: 'gnosis',
    name: 'Gnosis',
    nameKo: '그노시스',
    symbol: 'GNO',
    tvlUsd: 83_099_198,
    consensus: {
      ko: 'Gasper (Ethereum PoS 포크, Gnosis Beacon Chain)',
      en: 'Gasper (Ethereum PoS fork, Gnosis Beacon Chain)',
    },
    consensusFamily: 'Gasper',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '제안자 이중 서명', en: 'Proposer Equivocation' },
        description: {
          ko: '동일 슬롯에 서로 다른 블록 제안.',
          en: 'Proposing different blocks for the same slot.',
        },
        penalty: {
          ko: '초기 페널티 + 상관 페널티 최대 100%',
          en: 'Initial penalty + correlation penalty up to 100%',
        },
        severity: 'severe',
      },
      {
        name: {
          ko: '증인 이중/Surround 투표',
          en: 'Attester Double/Surround Vote',
        },
        description: {
          ko: '충돌하는 attestation 또는 포위 투표.',
          en: 'Conflicting attestations or surround votes.',
        },
        penalty: {
          ko: 'Ethereum과 동일한 구조의 슬래싱',
          en: 'Same slashing structure as Ethereum',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Gnosis Chain은 Ethereum의 Gasper를 그대로 포팅한 PoS로, 검증자 슬롯 당 1 GNO(= 32 mGNO)가 effective balance로 예치됩니다. 슬래싱된 GNO는 Ethereum과 동일하게 소각되고 고발자/제안자에게 소액 보상이 지급됩니다.',
      en: "Gnosis Chain is a direct port of Ethereum's Gasper; each validator slot holds 1 GNO (= 32 mGNO) as its effective balance. Slashed GNO is burned just as in Ethereum, with small rewards paid to the whistleblower/proposer.",
    },
    color: '#3E6957',
    docsUrl: 'https://docs.gnosischain.com/',
  },
  {
    id: 'kava',
    name: 'Kava',
    nameKo: '카바',
    symbol: 'KAVA',
    tvlUsd: 76_615_520,
    consensus: {
      ko: 'CometBFT (Cosmos SDK + Ethereum co-chain)',
      en: 'CometBFT (Cosmos SDK + Ethereum co-chain)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이 충돌 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '서명 윈도우 내 과도한 누락.',
          en: 'Excessive missed blocks within the signing window.',
        },
        penalty: { ko: '0.01% + Jail', en: '0.01% + Jail' },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '표준 Cosmos SDK 슬래싱을 따르며 슬래싱된 KAVA는 소각됩니다. Kava는 Cosmos 코-체인과 EVM 코-체인이 동일 검증자에 의해 운영되는 구조입니다.',
      en: 'Follows standard Cosmos SDK slashing; slashed KAVA is burned. Kava runs a Cosmos co-chain and an EVM co-chain operated by the same validator set.',
    },
    color: '#FF564F',
    docsUrl: 'https://docs.kava.io/',
  },
  {
    id: 'berachain',
    name: 'Berachain',
    nameKo: '베라체인',
    symbol: 'BERA',
    tvlUsd: 73_254_833,
    consensus: {
      ko: 'BeaconKit (CometBFT 기반, Proof-of-Liquidity)',
      en: 'BeaconKit (CometBFT-based, Proof-of-Liquidity)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이 충돌 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '서명 윈도우 내 과도한 누락.',
          en: 'Excessive missed blocks within the signing window.',
        },
        penalty: { ko: '0.01% + Jail', en: '0.01% + Jail' },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Berachain은 CometBFT 포크인 BeaconKit을 사용하는 Proof-of-Liquidity L1으로, 검증자는 BGT(거버넌스 토큰)를 통해 블록 보상을 얻지만 바닥 수준의 슬래싱은 BERA 본딩에 적용됩니다.',
      en: 'Berachain is a Proof-of-Liquidity L1 using BeaconKit, a CometBFT fork. Validators earn block rewards via BGT (governance token), but baseline slashing applies to BERA bonding.',
    },
    color: '#754D21',
    docsUrl: 'https://docs.berachain.com/',
  },
  {
    id: 'sei',
    name: 'Sei',
    nameKo: '세이',
    symbol: 'SEI',
    tvlUsd: 62_000_039,
    consensus: {
      ko: 'Twin-Turbo Consensus (Tendermint 기반, Cosmos SDK)',
      en: 'Twin-Turbo Consensus (Tendermint-based, Cosmos SDK)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '할당된 블록을 과도하게 놓침.',
          en: 'Missing too many assigned blocks.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.01% + 10분 Jail',
          en: '0.01% of bonded stake + 10-minute Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '슬래싱된 SEI는 기본 Cosmos SDK 동작대로 bonded pool에서 차감 후 소각됩니다. 세이 특유의 병렬 실행 엔진과 별개로, 합의/스테이킹 레이어는 표준 Cosmos SDK 슬래싱 패턴을 따릅니다.',
      en: 'Slashed SEI is deducted from the bonded pool and burned per default Cosmos SDK behavior. Although Sei features a parallel execution engine, the consensus/staking layer follows the standard Cosmos SDK slashing pattern.',
    },
    color: '#9E1F19',
    docsUrl: 'https://docs.sei.io/',
  },
  {
    id: 'hedera',
    name: 'Hedera',
    nameKo: '헤데라',
    symbol: 'HBAR',
    tvlUsd: 59_087_088,
    consensus: {
      ko: 'Hashgraph (aBFT, gossip about gossip + virtual voting)',
      en: 'Hashgraph (aBFT, gossip about gossip + virtual voting)',
    },
    consensusFamily: 'Hashgraph',
    slashingStatus: 'none',
    slashingNote: {
      ko: '운영위원회(Council) 기반 permissioned 노드 구조. 현재 공개 스테이킹/슬래싱 도입 계획은 없습니다.',
      en: 'Council-based permissioned node structure. No public staking/slashing is currently planned.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '슬래싱 없음. Hashgraph의 aBFT 특성상 악의적 노드는 수학적으로 합의를 방해할 수 없고, Council 거버넌스로 문제 노드를 제거합니다.',
      en: "No slashing. Given Hashgraph's aBFT properties, malicious nodes cannot mathematically obstruct consensus; Council governance removes problematic nodes.",
    },
    color: '#7373C5',
    docsUrl: 'https://docs.hedera.com/hedera/networks/mainnet/mainnet-nodes',
  },
  {
    id: 'ton',
    name: 'TON',
    nameKo: '톤',
    symbol: 'TON',
    tvlUsd: 58_335_105,
    consensus: { ko: 'Catchain BFT (샤딩 PoS)', en: 'Catchain BFT (sharded PoS)' },
    consensusFamily: 'Catchain-BFT',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '블록 서명 실패', en: 'Missed Block Signing' },
        description: {
          ko: '할당된 검증 작업에 대한 참여 실패가 Complaint로 접수된 경우.',
          en: 'Failure to participate in assigned validation work, surfaced via the Complaint system.',
        },
        penalty: {
          ko: '고정 101 TON 벌금 (MisbehaviourPunishmentConfig 파라미터)',
          en: 'Flat 101 TON fine (per MisbehaviourPunishmentConfig parameter)',
        },
        severity: 'moderate',
      },
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '충돌하는 블록 서명 제출.',
          en: 'Submitting conflicting block signatures.',
        },
        penalty: {
          ko: '동일한 고정 101 TON 벌금 (프로토콜은 단일 misbehaviour 파라미터로 통제)',
          en: 'Same flat 101 TON fine (the protocol uses a single misbehaviour parameter)',
        },
        severity: 'moderate',
      },
    ],
    tokenDestination: 'validator_pool',
    tokenHandlingDescription: {
      ko: 'Elector 스마트 컨트랙트가 검증 기간 동안 스테이크를 에스크로로 보관합니다. 악의적 행위는 고발(Complaint) 시 `ConfigParam40 MisbehaviourPunishmentConfig`가 정한 고정 101 TON 벌금으로 처리되며, 최초 고발자에게 약 8 TON의 보상이 지급되고 나머지는 네트워크 비용을 제외한 후 정직한 검증자들에게 재분배됩니다.',
      en: 'The Elector smart contract escrows stakes during the validation period. Misbehaviour surfaced through Complaints incurs a flat 101 TON fine set by the `ConfigParam40 MisbehaviourPunishmentConfig`. The first complainer receives ~8 TON, and the remainder is redistributed to honest validators after network costs.',
    },
    color: '#0098EA',
    docsUrl: 'https://docs.ton.org/v3/documentation/infra/nodes/validation/staking-incentives/',
  },
  {
    id: 'xrpl',
    name: 'XRP Ledger',
    nameKo: '엑스알피 레저',
    symbol: 'XRP',
    tvlUsd: 49_700_835,
    consensus: {
      ko: 'XRP Ledger Consensus Protocol (UNL 기반 FBA)',
      en: 'XRP Ledger Consensus Protocol (UNL-based FBA)',
    },
    consensusFamily: 'FBA',
    slashingStatus: 'none',
    slashingNote: {
      ko: '스테이킹이 없는 UNL(Unique Node List) 기반 합의. 슬래싱 개념이 존재하지 않습니다.',
      en: 'UNL (Unique Node List)-based consensus without staking. The concept of slashing does not apply.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '각 노드가 신뢰하는 검증자 목록(UNL)을 유지하며, 악의적 검증자는 UNL에서 제거되는 방식으로만 제재됩니다. 토큰 예치 개념이 없어 슬래싱 대상이 없습니다.',
      en: 'Each node maintains a trusted-validator list (UNL); malicious validators are penalized only by removal from UNLs. With no token deposits, there is nothing to slash.',
    },
    color: '#25A768',
    docsUrl: 'https://xrpl.org/docs/concepts/consensus-protocol',
  },
  {
    id: 'algorand',
    name: 'Algorand',
    nameKo: '알고랜드',
    symbol: 'ALGO',
    tvlUsd: 39_471_671,
    consensus: {
      ko: 'Pure PoS (PPoS), VRF 기반 committee 추첨',
      en: 'Pure PoS (PPoS), VRF-based committee sortition',
    },
    consensusFamily: 'PPoS',
    slashingStatus: 'none',
    slashingNote: {
      ko: 'Pure PoS 설계상 슬래싱이 불필요합니다. 스테이크는 잠기지 않고 VRF로 매 라운드마다 committee가 무작위 선정됩니다.',
      en: 'Pure PoS design makes slashing unnecessary. Stakes are not locked and a committee is sampled randomly via VRF each round.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '슬래싱 없음. 공격자가 사전에 committee를 표적 삼을 수 없어 Byzantine 공격이 구조적으로 어렵고, 스테이크는 항상 보호됩니다.',
      en: 'No slashing. Adversaries cannot target the committee in advance, making Byzantine attacks structurally difficult; stakes are always protected.',
    },
    color: '#CFCFCF',
    docsUrl: 'https://dev.algorand.co/concepts/protocol/overview/',
  },
  {
    id: 'eos',
    name: 'Vaulta (EOS)',
    nameKo: '볼타 (이오스)',
    symbol: 'EOS',
    tvlUsd: 39_313_566,
    consensus: { ko: 'DPoS, 21 Block Producers', en: 'DPoS, 21 Block Producers' },
    consensusFamily: 'DPoS',
    slashingStatus: 'none',
    slashingNote: {
      ko: 'DPoS 구조상 슬래싱 없음. 2025년 EOS는 Vaulta로 리브랜딩하며 금융 특화 L1으로 재포지셔닝.',
      en: 'No slashing by DPoS design. In 2025 EOS rebranded to Vaulta, repositioning as a finance-focused L1.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '슬래싱 없음. Block Producer는 투표를 통해 교체되며, 악의적 BP는 새로운 보팅 사이클에서 제외되는 방식으로 제재됩니다.',
      en: 'No slashing. Block Producers are replaced via voting; malicious BPs are penalized by being excluded from the next voting cycle.',
    },
    color: '#000000',
    docsUrl: 'https://docs.eosnetwork.com/',
  },
  {
    id: 'thorchain',
    name: 'THORChain',
    nameKo: '토르체인',
    symbol: 'RUNE',
    tvlUsd: 38_908_701,
    consensus: {
      ko: 'CometBFT (Cosmos SDK) + Churn / TSS 서명',
      en: 'CometBFT (Cosmos SDK) + Churn / TSS signing',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Sign' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '최소 본드의 5% 슬래싱',
          en: '5% of minimum bond',
        },
        severity: 'severe',
      },
      {
        name: { ko: '승인되지 않은 아웃바운드', en: 'Unauthorised Outbound / TSS Theft' },
        description: {
          ko: 'TSS로 통제되는 외부 체인 vault에서 비정상 출금이 발생해 자금이 도난되는 경우.',
          en: 'An unauthorised outbound transaction from the TSS-controlled external-chain vault (fund theft).',
        },
        penalty: {
          ko: '도난액의 1.5배까지 노드들의 RUNE 본드에서 슬래싱되어 피해 풀로 보상',
          en: 'Up to 1.5× the stolen amount slashed from node RUNE bonds and redirected to the affected pools as user reimbursement',
        },
        severity: 'severe',
      },
      {
        name: { ko: 'Observation / Sign Slash Points', en: 'Observation / Sign Slash Points' },
        description: {
          ko: '거래 관측 실패(2 points), 서명 실패(600 points), keygen 실패(1시간 수익) 등 역할별 패널티 포인트.',
          en: 'Role-specific penalty points: failing to observe (2 pts), failing to sign (600 pts), failing keygen (1 hour of revenue).',
        },
        penalty: {
          ko: '포인트 누적에 비례한 보상 감액, 다음 Churn 시 교체 확률 증가',
          en: 'Reward reduction proportional to accumulated points, higher probability of being churned out next cycle',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'validator_pool',
    tokenHandlingDescription: {
      ko: 'THORChain은 노드 운영자가 대규모 RUNE를 bond로 예치하는 "Churn" 시스템을 운영합니다. 이중 서명은 최소 본드의 5%를 차감하며, TSS를 통한 자금 도난이 발생하면 도난액의 1.5배까지 노드 RUNE 본드에서 차감되어 피해 풀의 유동성 공급자에게 보상으로 분배됩니다. 일반 관측/서명 실패는 slash point 누적을 통해 다음 churn 교체 확률을 높이는 방식입니다.',
      en: 'THORChain runs a "Churn" system where node operators bond large amounts of RUNE. Double-sign slashes 5% of minimum bond. TSS-vault theft triggers up to 1.5× the stolen amount to be slashed from node RUNE bonds and redirected to affected pools as LP reimbursement. Lesser observation/signing failures accumulate slash points that raise the probability of being churned out next cycle.',
    },
    color: '#1FC7A3',
    docsUrl: 'https://docs.thorchain.org/thornodes/overview/risks-costs-and-rewards',
  },
  {
    id: 'sonic',
    name: 'Sonic',
    nameKo: '소닉',
    symbol: 'S',
    tvlUsd: 34_030_605,
    consensus: {
      ko: 'Lachesis aBFT (DAG, 구 Fantom)',
      en: 'Lachesis aBFT (DAG, formerly Fantom)',
    },
    consensusFamily: 'Lachesis',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 이벤트에 대한 충돌 서명.',
          en: 'Conflicting signatures on the same event.',
        },
        penalty: {
          ko: '본딩 스테이크 슬래싱 + 위임자 영향',
          en: 'Bonded-stake slashing + delegator impact',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Sonic은 구 Fantom 리브랜드로 Lachesis aBFT를 계승합니다. 검증자가 S 토큰을 스테이킹하며, 이중 서명 시 본인 스테이크와 위임된 스테이크가 함께 슬래싱되어 소각됩니다.',
      en: 'Sonic (formerly Fantom) inherits Lachesis aBFT. Validators stake S token; double-signing slashes both self and delegated stake, which is burned.',
    },
    color: '#FF7C00',
    docsUrl: 'https://docs.soniclabs.com/',
  },
  {
    id: 'tezos',
    name: 'Tezos',
    nameKo: '테조스',
    symbol: 'XTZ',
    tvlUsd: 29_312_978,
    consensus: { ko: 'Tenderbake (Liquid PoS)', en: 'Tenderbake (Liquid PoS)' },
    consensusFamily: 'LPoS',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 블록 생성', en: 'Double Baking' },
        description: {
          ko: '동일 레벨에서 두 개의 서로 다른 블록을 생성.',
          en: 'Producing two different blocks at the same level.',
        },
        penalty: {
          ko: 'Adaptive 공식 S(B) = min(100%, (f(B)/T)² × 100%)',
          en: 'Adaptive formula S(B) = min(100%, (f(B)/T)² × 100%)',
        },
        severity: 'severe',
      },
      {
        name: { ko: '이중 증언', en: 'Double Attestation' },
        description: {
          ko: '동일 레벨에서 충돌하는 attestation 제출.',
          en: 'Conflicting attestations at the same level.',
        },
        penalty: {
          ko: '동일 Adaptive 공식 (단일: ~0.09%, 집단 공격: 최대 100%)',
          en: 'Same adaptive formula (single: ~0.09%, coordinated attack: up to 100%)',
        },
        severity: 'severe',
      },
      {
        name: { ko: '이중 선증언', en: 'Double Preattestation' },
        description: {
          ko: '동일 라운드에서 충돌하는 preattestation 제출.',
          en: 'Conflicting preattestations in the same round.',
        },
        penalty: { ko: '동일 Adaptive 공식', en: 'Same adaptive formula' },
        severity: 'moderate',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Paris 프로토콜(2024) 이후 Adaptive Slashing이 도입되어, 슬래싱 비율은 동일 블록 내 위반 비율 f(B)의 이차함수 형태로 스케일됩니다(T는 전체 consensus slot의 약 1/3). 고발자(denouncer) 보상은 1/(GLOBAL_LIMIT_OF_STAKING_OVER_BAKING + 2) 공식을 따르며, Quebec(2025)에서 상수가 5→9로 상향되어 현재는 슬래싱된 XTZ의 1/11이 고발자에게 지급되고 나머지는 소각됩니다(Oxford 1/2 → Paris 1/7 → Quebec 1/11).',
      en: 'Since the Paris protocol (2024), Adaptive Slashing scales slashing rates as a quadratic of the violation fraction f(B) within a block (T is ~1/3 of consensus slots). The denouncer reward follows 1/(GLOBAL_LIMIT_OF_STAKING_OVER_BAKING + 2); Quebec (2025) raised the constant from 5 to 9, so currently 1/11 of slashed XTZ is paid to the denouncer and the rest is burned (Oxford 1/2 → Paris 1/7 → Quebec 1/11).',
    },
    color: '#2C7DF7',
    docsUrl: 'https://octez.tezos.com/docs/active/adaptive_slashing.html',
  },
  {
    id: 'osmosis',
    name: 'Osmosis',
    nameKo: '오스모시스',
    symbol: 'OSMO',
    tvlUsd: 17_108_592,
    consensus: { ko: 'CometBFT (Cosmos SDK)', en: 'CometBFT (Cosmos SDK)' },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '30,000 블록 윈도우 내 5% 미만 서명.',
          en: 'Signing fewer than 5% of blocks in a 30,000-block window.',
        },
        penalty: {
          ko: '스테이크 슬래시 없음, Jail (slash_fraction_downtime=0)',
          en: 'No stake slash, Jail only (slash_fraction_downtime=0)',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '일반 스테이킹에서 슬래싱된 OSMO는 기본 Cosmos SDK 동작대로 bonded pool에서 차감 후 소각됩니다. 반면 Superfluid Staking(LP 토큰 위임)에서 발생한 슬래싱은 커뮤니티 풀로 전송됩니다. Osmosis는 다운타임에 대해 스테이크를 차감하지 않고 Jail만 적용합니다.',
      en: 'For regular staking, slashed OSMO is deducted from the bonded pool and burned per default Cosmos SDK behavior. Slashing from Superfluid Staking (LP-token delegation) instead routes to the community pool. Osmosis applies no stake slash on downtime — only jail.',
    },
    color: '#750BBB',
    docsUrl: 'https://docs.osmosis.zone/',
  },
  {
    id: 'injective',
    name: 'Injective',
    nameKo: '인젝티브',
    symbol: 'INJ',
    tvlUsd: 15_847_214,
    consensus: { ko: 'CometBFT (Cosmos SDK)', en: 'CometBFT (Cosmos SDK)' },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '100 블록 윈도우 내 50% 미만 서명.',
          en: 'Signing fewer than 50% of blocks in a 100-block window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.01% + 10분 Jail',
          en: '0.01% of bonded stake + 10-minute Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '슬래싱된 INJ는 소각되어 공급량에서 제거됩니다. 인젝티브의 주간 수수료 소각 경매(Burn Auction)와는 별개의 메커니즘입니다.',
      en: "Slashed INJ is burned, reducing supply. Separate from Injective's weekly Burn Auction (fee burning).",
    },
    color: '#00F2FE',
    docsUrl: 'https://docs.injective.network/',
  },
  {
    id: 'flow',
    name: 'Flow',
    nameKo: '플로우',
    symbol: 'FLOW',
    tvlUsd: 14_893_687,
    consensus: {
      ko: 'HotStuff 기반, 4-role PoS (Collection/Consensus/Execution/Verification)',
      en: 'HotStuff-based, 4-role PoS (Collection/Consensus/Execution/Verification)',
    },
    consensusFamily: 'HotStuff',
    slashingStatus: 'active',
    offenses: [
      {
        name: {
          ko: 'Consensus 노드 이중 서명',
          en: 'Consensus Node Equivocation',
        },
        description: {
          ko: 'Consensus 역할을 수행하는 노드의 충돌 투표.',
          en: 'Consensus-role nodes casting conflicting votes.',
        },
        penalty: {
          ko: '본딩 스테이크 대규모 슬래싱',
          en: 'Large-scale bonded-stake slashing',
        },
        severity: 'severe',
      },
      {
        name: {
          ko: 'Verification 역할 실패',
          en: 'Verification Failure',
        },
        description: {
          ko: '유효하지 않은 실행 결과에 대한 잘못된 승인.',
          en: 'Incorrectly approving an invalid execution result.',
        },
        penalty: { ko: '스테이크 일부 슬래싱', en: 'Partial stake slashing' },
        severity: 'moderate',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Flow는 4개의 역할(Collection/Consensus/Execution/Verification)로 노드를 분리한 PoS로, 각 역할별 스테이킹 요구사항이 다릅니다. Byzantine 행위 시 역할에 비례한 스테이크가 슬래싱됩니다.',
      en: 'Flow splits nodes into four roles (Collection/Consensus/Execution/Verification) with distinct staking requirements. Byzantine behavior leads to role-proportional stake slashing.',
    },
    color: '#00EF8B',
    docsUrl: 'https://developers.flow.com/',
  },
  {
    id: 'ronin',
    name: 'Ronin',
    nameKo: '로닌',
    symbol: 'RON',
    tvlUsd: 14_013_181,
    consensus: {
      ko: 'DPoS + Proof-of-Authority 하이브리드',
      en: 'DPoS + Proof-of-Authority hybrid',
    },
    consensusFamily: 'PoSA',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '영구 Jail + 최소 self-stake 슬래싱',
          en: 'Permanent Jail + minimum self-stake slashed',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임 (Tier 1)', en: 'Downtime (Tier 1)' },
        description: {
          ko: '24시간 내 100블록 이상 누락.',
          en: 'Missing 100+ blocks in a 24-hour window.',
        },
        penalty: { ko: '블록 보상 몰수', en: 'Forfeit block rewards' },
        severity: 'mild',
      },
      {
        name: { ko: '다운타임 (Tier 2)', en: 'Downtime (Tier 2)' },
        description: {
          ko: '24시간 내 500블록 이상 누락.',
          en: 'Missing 500+ blocks in a 24-hour window.',
        },
        penalty: {
          ko: '1,000 RON 슬래싱 + ~2일 Jail (credit-score bail)',
          en: '1,000 RON slashed + ~2-day Jail (credit-score bail)',
        },
        severity: 'moderate',
      },
      {
        name: { ko: '다운타임 (Tier 3)', en: 'Downtime (Tier 3)' },
        description: {
          ko: 'Tier 2 이후에도 장기 부재.',
          en: 'Prolonged absence after Tier 2.',
        },
        penalty: {
          ko: '추가 1,000 RON 슬래싱 (bailout 불가)',
          en: 'Additional 1,000 RON slashed (no bailout)',
        },
        severity: 'moderate',
      },
    ],
    tokenDestination: 'validator_pool',
    tokenHandlingDescription: {
      ko: 'Axie Infinity의 게임 특화 L1인 Ronin은 Governance Validator(12)와 Standard Validator(10)로 구성됩니다. 슬래싱된 RON은 소각되지 않고 검증자 reward pool로 환수되어 재분배됩니다. 다운타임은 3단계 tier로 운영되며 credit-score bail 시스템으로 unjail이 가능합니다.',
      en: "Ronin, Axie Infinity's gaming-focused L1, is split into Governance Validators (12) and Standard Validators (10). Slashed RON is not burned — it is recycled back into the validator reward pool. Downtime uses a three-tier system, with a credit-score bail mechanism for unjailing.",
    },
    color: '#1273EA',
    docsUrl: 'https://docs.roninchain.com/protocol/validators/slashing',
  },
  {
    id: 'kaia',
    name: 'Kaia',
    nameKo: '카이아',
    symbol: 'KAIA',
    tvlUsd: 12_562_772,
    consensus: {
      ko: 'Istanbul BFT (IBFT, 구 Klaytn + Finschia)',
      en: 'Istanbul BFT (IBFT, former Klaytn + Finschia)',
    },
    consensusFamily: 'PoS-Other',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: '현재는 블록 생성 실패에 대한 보상 차감과 committee 재배치만 운영되며, 실제 본딩 스테이크 슬래싱은 집행되지 않습니다. Kaia 로드맵의 "Autonomous Validator Slashing System(AVSS)"이 도입될 예정.',
      en: 'Currently only reward reduction and committee reshuffles are enforced; no bonded-stake slashing is active. Kaia\'s roadmap includes a planned "Autonomous Validator Slashing System (AVSS)".',
    },
    offenses: [
      {
        name: { ko: '블록 생성 실패', en: 'Missed Block Proposal' },
        description: {
          ko: 'Council 멤버가 할당된 블록을 제안하지 않음.',
          en: 'A Council member fails to propose its assigned block.',
        },
        penalty: {
          ko: '보상 감소 및 committee 재배치 (스테이크 슬래시 없음)',
          en: 'Reward reduction and committee reshuffle (no stake slash)',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: 'Kaia(구 Klaytn/Finschia 통합)는 Council 기반 IBFT 합의를 사용하지만, 현재 본딩 스테이크 슬래싱은 시행되지 않습니다. 악의적/비가용 Council 멤버는 보상이 깎이고 committee가 재배치되는 선에서 제재됩니다. 본격적인 Byzantine 슬래싱은 Kaia Evolution 로드맵의 AVSS로 미래 도입 예정입니다.',
      en: 'Kaia (merged from Klaytn and Finschia) uses Council-based IBFT but does not currently enforce bonded-stake slashing. Malicious/unavailable Council members face only reward reduction and committee reshuffles. Byzantine slashing is planned as part of the Kaia Evolution roadmap (AVSS).',
    },
    color: '#BFF009',
    docsUrl: 'https://docs.kaia.io/kaiatech/kaia-white-paper/',
  },
  {
    id: 'icp',
    name: 'Internet Computer',
    nameKo: '인터넷 컴퓨터',
    symbol: 'ICP',
    tvlUsd: 11_014_906,
    consensus: {
      ko: 'Chain Key Cryptography (DKG + Threshold signing)',
      en: 'Chain Key Cryptography (DKG + Threshold signing)',
    },
    consensusFamily: 'ChainKey',
    slashingStatus: 'none',
    slashingNote: {
      ko: '서브넷 단위 permissioned 노드 운영. 악의적 노드는 NNS(Network Nervous System) 거버넌스 투표로 제거됩니다.',
      en: 'Permissioned node operation at the subnet level. Malicious nodes are removed via NNS (Network Nervous System) governance votes.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '전통적인 지분 슬래싱 없음. 노드 제공자는 ICP 스테이킹이 아닌 NNS 화이트리스트에 의해 운영 자격을 얻으며, 문제 발생 시 NNS 투표로 자격이 박탈됩니다.',
      en: 'No traditional stake slashing. Node providers operate via NNS whitelisting rather than ICP staking, and their rights can be revoked via NNS voting if issues arise.',
    },
    color: '#29ABE2',
    docsUrl: 'https://internetcomputer.org/docs/current/concepts/governance',
  },
  {
    id: 'neutron',
    name: 'Neutron',
    nameKo: '뉴트론',
    symbol: 'NTRN',
    tvlUsd: 5_837_409,
    consensus: {
      ko: 'CometBFT (Cosmos SDK) — Mercury 업그레이드(2025.04) 이후 자체 검증자 세트를 가진 소버린 PoS',
      en: 'CometBFT (Cosmos SDK) — sovereign PoS with its own validator set after the Mercury upgrade (April 2025)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: '2025년 4월 Mercury 업그레이드로 Interchain Security를 졸업하고 자체 검증자 세트를 가진 소버린 PoS가 되었으나, 슬래시 없는(no-slashing) 모델을 채택했습니다. 악의적/비활성 validator는 tombstone 또는 jail 처리되며 NTRN 스테이크는 깎이지 않습니다.',
      en: 'After the Mercury upgrade (April 2025), Neutron graduated from Interchain Security to sovereign PoS with its own validator set but adopted a no-slashing model. Malicious or inactive validators are tombstoned or jailed; NTRN stake is not reduced.',
    },
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '스테이크 슬래시 없음, Tombstone (영구 제거)',
          en: 'No stake slash, Tombstone (permanent removal)',
        },
        severity: 'moderate',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '서명 윈도우 내 과도한 블록 누락.',
          en: 'Excessive missed blocks within the signing window.',
        },
        penalty: { ko: '스테이크 슬래시 없음, Jail', en: 'No stake slash, Jail' },
        severity: 'mild',
      },
    ],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: 'Neutron은 Mercury 업그레이드 이후 자체 검증자 세트를 갖는 소버린 PoS 체인이 되었지만, 명시적으로 slash fraction을 0으로 설정한 "no-slashing" 모델을 사용합니다. 악의적 validator는 tombstone으로 영구 제거되지만 NTRN 스테이크는 차감되지 않습니다.',
      en: 'Since the Mercury upgrade, Neutron is a sovereign PoS chain with its own validator set but uses an explicit "no-slashing" model — slash fractions are set to 0. Malicious validators are permanently removed via tombstone but NTRN stake is not reduced.',
    },
    color: '#0C0C0C',
    docsUrl: 'https://docs.neutron.org/operators/economics/slashing',
  },
  {
    id: 'filecoin',
    name: 'Filecoin',
    nameKo: '파일코인',
    symbol: 'FIL',
    tvlUsd: 4_635_342,
    consensus: {
      ko: 'Expected Consensus (EC) + Proof-of-Spacetime / Replication',
      en: 'Expected Consensus (EC) + Proof-of-Spacetime / Replication',
    },
    consensusFamily: 'PoS-Other',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '섹터 장애', en: 'Storage Fault' },
        description: {
          ko: 'WindowPoSt 증명 실패 또는 섹터 조기 종료.',
          en: 'WindowPoSt proof failure or early sector termination.',
        },
        penalty: {
          ko: '섹터 담보 일부 소각 + 종료 수수료 (일일 보상 × 최대 90일)',
          en: 'Partial sector-pledge burn + termination fee (daily reward × up to 90 days)',
        },
        severity: 'moderate',
      },
      {
        name: { ko: '합의 위반', en: 'Consensus Fault' },
        description: {
          ko: '동일 높이 블록 이중 서명 또는 부모 체인 위반.',
          en: 'Double-signing blocks at the same height or parent-chain violations.',
        },
        penalty: {
          ko: '잠금된 보상 + 블록 보상의 상당 부분 슬래싱',
          en: 'Locked rewards + substantial block-reward slashing',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Filecoin은 스토리지 제공자(마이너)가 섹터별로 pledge collateral을 예치하는 구조입니다. 슬래싱된 FIL은 시스템 주소 "f099"로 전송되어 영구 소각되며, 네트워크 전체 공급량이 감소합니다.',
      en: 'Storage providers (miners) deposit per-sector pledge collateral. Slashed FIL is sent to the system address "f099" and permanently burned, reducing the network\'s overall supply.',
    },
    color: '#0090FF',
    docsUrl: 'https://docs.filecoin.io/basics/the-blockchain/proofs',
  },
  {
    id: 'initia',
    name: 'Initia',
    nameKo: '이니시아',
    symbol: 'INIT',
    tvlUsd: 4_267_371,
    consensus: {
      ko: 'CometBFT (Cosmos SDK omnichain L1)',
      en: 'CometBFT (Cosmos SDK omnichain L1)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이 충돌 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '서명 윈도우 내 과도한 블록 누락.',
          en: 'Excessive missed blocks within the signing window.',
        },
        penalty: { ko: '0.01% + Jail', en: '0.01% + Jail' },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Initia는 Cosmos SDK 기반 omnichain L1으로 INIT 토큰의 본딩/슬래싱을 관리합니다. Minitia(roll-up)와 상호 운영되지만 L1 검증자 슬래싱은 표준 Cosmos 패턴을 따릅니다. 슬래싱된 INIT는 소각됩니다.',
      en: 'Initia is a Cosmos SDK omnichain L1 managing INIT bonding/slashing. It interoperates with Minitias (roll-ups), but L1 validator slashing follows the standard Cosmos pattern. Slashed INIT is burned.',
    },
    color: '#0FAEE9',
    docsUrl: 'https://docs.initia.xyz/',
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    nameKo: '폴카닷',
    symbol: 'DOT',
    tvlUsd: 10_000_000,
    consensus: {
      ko: 'NPoS (Nominated PoS), BABE + GRANDPA',
      en: 'NPoS (Nominated PoS), BABE + GRANDPA',
    },
    consensusFamily: 'NPoS',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: 'Backing Invalid', en: 'Backing Invalid' },
        description: {
          ko: '파라체인 검증자가 유효하지 않은 블록을 백킹.',
          en: 'A parachain validator backs an invalid block.',
        },
        penalty: {
          ko: '100% 슬래싱 + 영구 chilled',
          en: '100% slashing + permanent chill',
        },
        severity: 'severe',
      },
      {
        name: {
          ko: 'GRANDPA / BABE 이중 서명',
          en: 'GRANDPA/BABE Equivocation',
        },
        description: {
          ko: '동일 라운드, 슬롯에서 충돌하는 finality 투표 또는 블록 제안.',
          en: 'Conflicting finality votes or block proposals in the same round/slot.',
        },
        penalty: {
          ko: '공식 min((3x/n)², 1). 단일 offender: ~0.09%, 집단: 최대 100%',
          en: 'Formula min((3x/n)², 1). Single offender: ~0.09%, coordinated: up to 100%',
        },
        severity: 'severe',
      },
      {
        name: { ko: 'ForInvalid Vote', en: 'ForInvalid Vote' },
        description: {
          ko: '2차 검증자가 유효하지 않은 블록에 찬성 투표.',
          en: 'Secondary checker votes in favor of an invalid block.',
        },
        penalty: { ko: '2% 슬래싱', en: '2% slashing' },
        severity: 'moderate',
      },
      {
        name: { ko: '무응답', en: 'Unresponsiveness' },
        description: {
          ko: 'I’m Online 하트비트 미전송.',
          en: 'Failure to send I’m Online heartbeats.',
        },
        penalty: {
          ko: '0.1% 이하 (세션 마감 기준)',
          en: 'Up to 0.1% (at session close)',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'treasury',
    tokenHandlingDescription: {
      ko: '슬래싱된 DOT은 소각되지 않고 Polkadot Treasury로 전송됩니다. Treasury 기금은 OpenGov 거버넌스를 통해 생태계 그랜트, 공공재 조달, 파라체인 크라우드론 반환 등에 사용됩니다. 슬래싱은 약 27일(1 에라) 동안 지연 적용되어 거버넌스가 취소(cancel)할 수 있습니다.',
      en: 'Slashed DOT is not burned but transferred to the Polkadot Treasury. Treasury funds are used via OpenGov governance for ecosystem grants, public goods, parachain crowdloan refunds, and more. Slashing is deferred for ~27 days (1 era), during which governance can cancel it.',
    },
    color: '#E6007A',
    docsUrl: 'https://wiki.polkadot.com/learn/learn-offenses/',
  },
  {
    id: 'celestia',
    name: 'Celestia',
    nameKo: '셀레스티아',
    symbol: 'TIA',
    tvlUsd: 5_000_000,
    consensus: {
      ko: 'CometBFT (Cosmos SDK 기반 DA 레이어)',
      en: 'CometBFT (Cosmos SDK-based DA layer)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 높이에서 서로 다른 블록에 대한 서명.',
          en: 'Signing different blocks at the same height.',
        },
        penalty: {
          ko: '본딩 스테이크의 2% + Tombstone',
          en: '2% of bonded stake + Tombstone',
        },
        severity: 'moderate',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '최근 10,000 블록 중 75% 미만 서명(2,500 블록 초과 누락).',
          en: 'Signing fewer than 75% of the last 10,000 blocks (missing >2,500).',
        },
        penalty: {
          ko: '1분 Jail (unjail 후 재진입 가능). 스테이크 차감 없음 (slash_fraction_downtime=0)',
          en: '1-minute Jail (re-entry after unjail). No stake deduction (slash_fraction_downtime=0).',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '이중 서명 시 바운드된 TIA의 2%가 차감되어 기본 Cosmos SDK 동작대로 소각되고, 해당 validator는 영구 Tombstone됩니다. Cosmos Hub보다 이중 서명 슬래싱 비율을 낮게(5% → 2%) 설정하고 다운타임 슬래싱은 0%로 유지하는 것이 특징입니다.',
      en: 'On equivocation, 2% of bonded TIA is deducted and burned per default Cosmos SDK behavior, and the validator is permanently Tombstoned. Notably, Celestia sets a lower equivocation slashing rate (5% → 2%) than Cosmos Hub and keeps downtime slashing at 0%.',
    },
    color: '#7B2BF9',
    docsUrl: 'https://docs.celestia.org/operate/consensus-validators/slashing/',
  },
  {
    id: 'cosmos-hub',
    name: 'Cosmos Hub',
    nameKo: '코스모스 허브',
    symbol: 'ATOM',
    tvlUsd: 152_754,
    consensus: {
      ko: 'CometBFT (Tendermint) + Cosmos SDK x/slashing',
      en: 'CometBFT (Tendermint) + Cosmos SDK x/slashing',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Equivocation' },
        description: {
          ko: '동일 높이 블록에 대해 충돌하는 prevote/precommit 서명.',
          en: 'Conflicting prevote/precommit signatures at the same height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + 영구 Tombstone',
          en: '5% of bonded stake + permanent Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Liveness Fault' },
        description: {
          ko: '10,000 블록 윈도우 내 95% 이상 블록 서명 누락.',
          en: 'Missing at least 95% of 10,000 blocks in a signing window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.01% + 10분 Jail',
          en: '0.01% of bonded stake + 10-minute Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '슬래싱된 ATOM은 bonded pool에서 차감되어 소각됩니다 (기본 x/staking 동작). 일부 Cosmos SDK 기반 체인은 거버넌스 결정에 따라 슬래싱분을 커뮤니티 풀로 리디렉션하기도 합니다. Tombstone된 검증자는 영구적으로 활성 세트 재진입이 불가능합니다. Interchain Security v1으로 Neutron 등 consumer chain의 보안을 함께 제공합니다.',
      en: 'Slashed ATOM is deducted from the bonded pool and burned (default x/staking behavior). Some Cosmos SDK-based chains redirect slashed funds to the community pool via governance. Tombstoned validators cannot rejoin the active set. Via Interchain Security v1, Cosmos Hub also secures consumer chains like Neutron.',
    },
    color: '#6F7390',
    docsUrl: 'https://github.com/cosmos/cosmos-sdk/tree/main/x/slashing',
  },
  {
    id: 'plasma',
    name: 'Plasma',
    nameKo: '플라즈마',
    symbol: 'XPL',
    tvlUsd: 578_277_070,
    consensus: {
      ko: 'PlasmaBFT (Fast HotStuff 파생, 비트코인 앵커링)',
      en: 'PlasmaBFT (Fast HotStuff-derived, Bitcoin-anchored)',
    },
    consensusFamily: 'HotStuff',
    slashingStatus: 'active',
    offenses: [
      {
        name: {
          ko: '악의적 행동 / 다운타임',
          en: 'Misbehavior / Downtime',
        },
        description: {
          ko: '이중 서명 등 프로토콜 위반이나 장기 다운타임 시 검증자 보상 차감.',
          en: 'Double-signing, protocol violations, or extended downtime lead to validator reward forfeiture.',
        },
        penalty: {
          ko: '보상만 차감 (원금 XPL 스테이크 보존)',
          en: 'Reward forfeiture only (principal XPL stake preserved)',
        },
        severity: 'moderate',
      },
    ],
    tokenDestination: 'reward_forfeiture',
    tokenHandlingDescription: {
      ko: 'Plasma는 USDT 제로-수수료 결제에 최적화된 stablecoin L1으로, 전통적 원금 슬래싱이 아닌 "reward slashing" 모델을 채택했습니다. 위반 시 검증자는 스테이킹된 XPL 원금은 보존되고 보상만 받지 못합니다. 비트코인 체크포인팅과 결합된 소프트 슬래싱 접근.',
      en: 'Plasma is a stablecoin L1 optimized for zero-fee USDT payments. It adopts a "reward slashing" model rather than traditional stake slashing. On violations, validators retain their principal XPL stake but forfeit earned rewards. A soft-slashing approach paired with Bitcoin checkpointing.',
    },
    color: '#00E075',
    docsUrl: 'https://www.plasma.to/faq',
  },
  {
    id: 'flare',
    name: 'Flare',
    nameKo: '플레어',
    symbol: 'FLR',
    tvlUsd: 172_864_143,
    consensus: {
      ko: 'Snowman (Avalanche 파생) + FTSO 데이터 계층',
      en: 'Snowman (Avalanche-derived) + FTSO data layer',
    },
    consensusFamily: 'Snowman',
    slashingStatus: 'none',
    slashingNote: {
      ko: 'Avalanche 계열이라 P-Chain 스테이킹에 슬래싱이 없습니다. 다만 FTSO 데이터 제공자가 부정확한 가격을 제출하면 "chill" 처리되어 보상 참여에서 배제될 수 있습니다.',
      en: 'As an Avalanche-family chain, there is no slashing on P-Chain staking. However, FTSO data providers submitting inaccurate prices may be "chilled" and excluded from reward participation.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '프로토콜 레벨 슬래싱 없음. 검증자 원금과 위임자 스테이크는 모두 보호되며, FTSO data provider가 chilled되면 해당 검증자 풀의 보상만 상실합니다.',
      en: "No protocol-level slashing. Validator principal and delegator stakes are both protected. If an FTSO data provider is chilled, only that validator pool's rewards are forgone.",
    },
    color: '#E62058',
    docsUrl: 'https://flare.network/delegate-and-stake',
  },
  {
    id: 'wemix',
    name: 'WEMIX3.0',
    nameKo: '위믹스',
    symbol: 'WEMIX',
    tvlUsd: 7_620_410,
    consensus: {
      ko: 'SPoA (Stake-based Proof of Authority), 40 WONDERS',
      en: 'SPoA (Stake-based Proof of Authority), 40 WONDERS',
    },
    consensusFamily: 'PoSA',
    slashingStatus: 'active',
    offenses: [
      {
        name: {
          ko: '고의 담합 / 노드 오구성',
          en: 'Deliberate Collusion / Node Misconfiguration',
        },
        description: {
          ko: '생태계 이익에 반하는 고의적 담합 또는 노드 설정 오류로 인한 위반.',
          en: 'Deliberate collusion against ecosystem interests, or misbehavior due to node misconfiguration.',
        },
        penalty: {
          ko: '스테이크의 일부 차감 (되돌릴 수 없음)',
          en: 'Partial stake deduction (irreversible)',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'WEMIX3.0은 Wemade의 게임 특화 L1으로 40 WONDERS(NCP)가 각 1.5M WEMIX를 스테이킹합니다. 고의 담합이나 부적절한 운영이 감지되면 스테이크 일부가 영구 차감됩니다. 장기적으로 SPoA에서 완전 공개 PoS로 전환 중.',
      en: "WEMIX3.0 is Wemade's gaming-focused L1 where 40 WONDERS (NCPs) each stake 1.5M WEMIX. Deliberate collusion or improper operation leads to irreversible partial stake deduction. The roadmap calls for transitioning from SPoA to fully open PoS.",
    },
    color: '#29CCB9',
    docsUrl: 'https://www.wemix.com/wemix',
  },
  {
    id: 'stable',
    name: 'Stable',
    nameKo: '스테이블',
    symbol: 'STABLE',
    tvlUsd: 7_586_179,
    consensus: {
      ko: 'StableBFT (Delegated PoS, USDT 가스)',
      en: 'StableBFT (Delegated PoS, USDT gas)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 서로 다른 블록에 서명.',
          en: 'Signing different blocks at the same height.',
        },
        penalty: { ko: '본딩 스테이크 슬래싱', en: 'Bonded-stake slashing' },
        severity: 'severe',
      },
      {
        name: { ko: '장기 다운타임', en: 'Extended Downtime' },
        description: {
          ko: '검증자 응답 불능이 장기화될 경우.',
          en: 'Prolonged validator unresponsiveness.',
        },
        penalty: {
          ko: '본딩 스테이크 일부 슬래싱',
          en: 'Partial bonded-stake slashing',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Bitfinex 지원으로 2025년 12월 출범한 stablecoin 결제 L1. 수수료는 USDT로 결제되고 STABLE 토큰은 거버넌스/보안 용도입니다. StableBFT (DPoS) 기반으로 이중 서명 또는 장기 다운타임 시 위임된 스테이크 포함 슬래싱됩니다.',
      en: 'Stablecoin payments L1 launched Dec 2025 with Bitfinex backing. Fees settle in USDT while STABLE serves governance and security. StableBFT (DPoS) slashes bonded stake (including delegated stake) for double-signing or extended downtime.',
    },
    color: '#0066FF',
    docsUrl: 'https://www.stable.xyz/whitepaper.pdf',
  },
  {
    id: 'tempo',
    name: 'Tempo',
    nameKo: '템포',
    symbol: '-',
    tvlUsd: 2_985_401,
    consensus: {
      ko: 'Simplex BFT (결정론적 finality, Reth 기반 EVM)',
      en: 'Simplex BFT (deterministic finality, Reth-based EVM)',
    },
    consensusFamily: 'HotStuff',
    slashingStatus: 'inactive',
    slashingNote: {
      ko: '2026년 3월 18일 메인넷 런칭. 메인넷 출시 후에도 검증자 세트는 core team + 초기 파트너(Visa, Mastercard, OpenAI, Anthropic 등)로 퍼미션드 운영 중이며, 공개된 슬래싱 파라미터는 아직 없습니다.',
      en: 'Mainnet launched on Mar 18, 2026. Even post-launch the validator set is permissioned, operated by the core team and early partners (Visa, Mastercard, OpenAI, Anthropic, etc.), with no public slashing parameters yet.',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: 'Stripe와 Paradigm이 공동 설계한 결제 전용 L1으로 서브초 블록 타임과 Simplex BFT 기반 즉시 finality를 제공합니다. Series A로 $500M (밸류 $5B) 투자 유치, DoorDash, Visa, Mastercard, OpenAI, Anthropic, Shopify 등이 디자인 파트너. 메인넷 이후에도 제한된 검증자 세트로 운영 중이며, 슬래싱 조건은 점진적 탈중앙화(퍼미션리스 전환) 시점에 공개될 예정입니다.',
      en: 'A payments-focused L1 co-designed by Stripe and Paradigm, providing sub-second block times and deterministic instant finality via Simplex BFT. Raised $500M Series A at a $5B valuation with design partners including DoorDash, Visa, Mastercard, OpenAI, Anthropic, and Shopify. Even post-mainnet the network runs with a small permissioned validator set; slashing conditions will be published as the network progressively decentralizes.',
    },
    color: '#FF4500',
    docsUrl: 'https://docs.tempo.xyz/',
  },
  {
    id: 'astar',
    name: 'Astar',
    nameKo: '아스타',
    symbol: 'ASTR',
    tvlUsd: 1_925_463,
    consensus: {
      ko: 'Polkadot 파라체인 (Collator 기반) + Ethereum L2 지원',
      en: 'Polkadot parachain (collator-based) + Ethereum L2 support',
    },
    consensusFamily: 'NPoS',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: 'Collator 블록 미생산', en: 'Collator Non-Production' },
        description: {
          ko: 'Collator가 연속 2개 세션 동안 블록을 생성하지 못함.',
          en: 'A collator fails to produce blocks for two consecutive sessions.',
        },
        penalty: {
          ko: '총 스테이크의 1% 슬래싱 + 활성 세트에서 제거',
          en: '1% of total stake slashed + removal from the active set',
        },
        severity: 'moderate',
      },
      {
        name: { ko: 'Collator 거버넌스 슬래싱', en: 'Collator Governance Slashing' },
        description: {
          ko: '부적절한 운영 시 거버넌스(Council / Referendum)에 의해 강제 슬래싱.',
          en: 'Forced slashing by governance (Council / Referendum) for improper operation.',
        },
        penalty: {
          ko: '3.2M ASTR 본드 일부 슬래싱',
          en: 'Partial slashing of 3.2M ASTR bond',
        },
        severity: 'moderate',
      },
      {
        name: {
          ko: 'Polkadot 릴레이 슬래싱',
          en: 'Polkadot Relay Slashing',
        },
        description: {
          ko: 'Astar는 Polkadot 릴레이 체인 검증자에 의해 확정되며, 해당 위반은 Polkadot에서 슬래싱.',
          en: "Astar is finalized by Polkadot relay-chain validators; violations are slashed on Polkadot's side.",
        },
        penalty: {
          ko: 'Polkadot NPoS 공식 (최대 100%)',
          en: 'Polkadot NPoS formula (up to 100%)',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Astar는 Polkadot 파라체인이자 WASM+EVM 하이브리드입니다. Collator는 3.2M ASTR을 본드하며, 거버넌스 투표로 슬래싱 가능. 실제 블록 확정 보안은 Polkadot 릴레이 검증자에게 의존하므로 해당 레이어 슬래싱이 주된 안전장치입니다.',
      en: 'Astar is both a Polkadot parachain and a WASM+EVM hybrid. Collators bond 3.2M ASTR and can be slashed via governance votes. Finality security ultimately depends on Polkadot relay validators, where the main slashing layer sits.',
    },
    color: '#0070EB',
    docsUrl: 'https://docs.astar.network/',
  },
  {
    id: 'supra',
    name: 'Supra',
    nameKo: '수프라',
    symbol: 'SUPRA',
    tvlUsd: 1_566_870,
    consensus: {
      ko: 'Moonshot BFT (Tribes & Clans, MoveVM)',
      en: 'Moonshot BFT (Tribes & Clans, MoveVM)',
    },
    consensusFamily: 'HotStuff',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '악의적 검증 / 다운타임', en: 'Malicious Validation / Downtime' },
        description: {
          ko: '이중 서명, 악의적 오라클 보고, 장기 다운타임 등.',
          en: 'Double signing, malicious oracle reporting, or extended downtime.',
        },
        penalty: {
          ko: '본딩된 SUPRA 스테이크 슬래싱',
          en: 'Bonded SUPRA stake slashing',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Supra는 Moonshot BFT(서브초 finality, ~500K TPS 목표)와 MoveVM을 지원하는 수직 통합 L1입니다. 검증자는 SUPRA를 본딩하여 합의, 오라클, dVRF, 자동화 서비스를 제공하며, 악의적 행동 시 스테이크가 슬래싱됩니다.',
      en: 'Supra is a vertically integrated L1 with Moonshot BFT (sub-second finality, ~500K TPS target) and MoveVM support. Validators bond SUPRA to back consensus, oracles, dVRF, and automation; malicious behavior results in stake slashing.',
    },
    color: '#EE3A66',
    docsUrl: 'https://docs.supra.com/',
  },
  {
    id: 'somnia',
    name: 'Somnia',
    nameKo: '솜니아',
    symbol: 'SOMI',
    tvlUsd: 1_376_919,
    consensus: {
      ko: 'MultiStream Consensus (Autobahn-파생 BFT-PoS)',
      en: 'MultiStream Consensus (Autobahn-derived BFT-PoS)',
    },
    consensusFamily: 'HotStuff',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 높이 블록 또는 증명에 대한 충돌 서명.',
          en: 'Conflicting signatures on the same block or proof.',
        },
        penalty: {
          ko: '본딩 스테이크 슬래싱',
          en: 'Bonded stake slashing',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '검증자 응답 불능이 지속될 경우.',
          en: 'Sustained validator unresponsiveness.',
        },
        penalty: {
          ko: '스테이크 일부 슬래싱',
          en: 'Partial stake slashing',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '각 검증자가 독립된 data chain을 병렬 운영하고 consensus chain이 헤더를 집계하는 MultiStream 구조로 1M+ TPS를 목표. 최소 5M SOMI 스테이킹 필요. 전체 가스비의 50%가 소각되는 디플레 토큰 이코노미와 별개로, 슬래싱된 SOMI도 소각됩니다.',
      en: "MultiStream has each validator run an independent data chain in parallel with a consensus chain aggregating headers, targeting 1M+ TPS. Requires 5M SOMI minimum stake. Separate from the 50% gas-fee burn deflationary model, slashed SOMI is also burned.",
    },
    color: '#00E599',
    docsUrl: 'https://docs.somnia.network/',
  },
  {
    id: 'mantra',
    name: 'MANTRA',
    nameKo: '만트라',
    symbol: 'OM',
    tvlUsd: 1_343_920,
    consensus: {
      ko: 'CometBFT (Cosmos SDK, RWA 특화 L1)',
      en: 'CometBFT (Cosmos SDK, RWA-focused L1)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 스테이크의 5% + Tombstone',
          en: '5% of bonded stake + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '10,000 블록 윈도우 내 75% 미만 서명.',
          en: 'Signing fewer than 75% of blocks in a 10,000-block window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.1% + Jail (60초)',
          en: '0.1% of bonded stake + Jail (60s)',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'RWA 특화 Cosmos SDK 기반 L1으로 KYC/AML, identity, permissions 모듈을 내장합니다. 표준 Cosmos 슬래싱 패턴으로 OM이 소각되며 unbonding 기간은 8일입니다. 다운타임 슬래싱 비율은 기본 Cosmos SDK(0.01%)의 10배인 0.1%로 높게 설정되어 있습니다.',
      en: 'An RWA-focused Cosmos SDK L1 with built-in KYC/AML, identity, and permissions modules. Follows standard Cosmos slashing: OM is burned with an 8-day unbonding period. The downtime slash fraction is set to 0.1% — ten times the Cosmos SDK default of 0.01%.',
    },
    color: '#FFD400',
    docsUrl: 'https://docs.mantrachain.io/',
  },
  {
    id: 'story',
    name: 'Story',
    nameKo: '스토리',
    symbol: 'IP',
    tvlUsd: 914_760,
    consensus: {
      ko: 'CometBFT + Proof-of-Creativity (IP 특화 PoS)',
      en: 'CometBFT + Proof-of-Creativity (IP-focused PoS)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: {
          ko: '본딩 IP 스테이크의 5% + Tombstone (영구 제거)',
          en: '5% of bonded IP stake + Tombstone (permanent removal)',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '28,800 블록 윈도우 내 95% 이상 블록 누락.',
          en: 'Missing more than 95% of blocks in a 28,800-block window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.02% + Jail',
          en: '0.02% of bonded stake + Jail',
        },
        severity: 'mild',
      },
      {
        name: { ko: 'Self-undelegation 하한', en: 'Self-undelegation Floor' },
        description: {
          ko: 'Self-delegation 액수를 1,024 IP 아래로 undelegate.',
          en: 'Self-delegation drops below the 1,024 IP floor.',
        },
        penalty: { ko: 'Jail (슬래시 없음)', en: 'Jail (no slash)' },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Story는 지식재산(IP) 등록/라이센싱/수익화 전용 L1으로 CometBFT + Proof-of-Creativity를 사용합니다. 검증자는 IP 토큰을 본딩하며, 슬래싱된 IP는 기본 Cosmos SDK 동작대로 소각됩니다. 이중 서명은 5%, 다운타임은 0.02%, self-delegation 최소치는 1,024 IP입니다.',
      en: 'Story is an L1 dedicated to IP registration, licensing, and monetization, using CometBFT with Proof-of-Creativity. Validators bond IP tokens, and slashed IP is burned per default Cosmos SDK behavior. Double-sign slashes 5%, downtime 0.02%, and the self-delegation floor is 1,024 IP.',
    },
    color: '#A1F043',
    docsUrl: 'https://docs.story.foundation/',
  },
  {
    id: 'zetachain',
    name: 'ZetaChain',
    nameKo: '제타체인',
    symbol: 'ZETA',
    tvlUsd: 903_907,
    consensus: {
      ko: 'Cosmos SDK + Observer + TSS Signer (크로스체인)',
      en: 'Cosmos SDK + Observer + TSS Signer (cross-chain)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: 'Core validator 이중 서명', en: 'Core Validator Equivocation' },
        description: {
          ko: '동일 블록 높이에서 충돌하는 prevote/precommit 서명.',
          en: 'Conflicting prevote/precommit signatures at the same height.',
        },
        penalty: {
          ko: '본딩 ZETA의 5% + Tombstone',
          en: '5% of bonded ZETA + Tombstone',
        },
        severity: 'severe',
      },
      {
        name: {
          ko: 'Observer-Signer 실패',
          en: 'Observer-Signer Failure',
        },
        description: {
          ko: '외부 체인 이벤트 관찰 실패, 잘못된 이벤트 보고, TSS keygen/keysign 불참.',
          en: 'Failing to observe external chain events, reporting incorrect events, or missing TSS keygen/keysign.',
        },
        penalty: {
          ko: '연결된 core validator의 ZETA 스테이크 슬래싱',
          en: "Slashes the paired core validator's ZETA stake",
        },
        severity: 'moderate',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '10,000 블록 윈도우 내 5% 미만 서명.',
          en: 'Signing fewer than 5% of blocks in a 10,000-block window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.01% + 10분 Jail',
          en: '0.01% of bonded stake + 10-minute Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'ZetaChain은 Cosmos SDK 기반 크로스체인 L1으로 Observer(외부 체인 이벤트 관측)와 TSS Signer(외부 체인 트랜잭션 서명)가 합의에 참여합니다. 표준 Cosmos 슬래싱에 더해 observer/signer 역할 실패 시 연결된 core validator의 ZETA가 슬래싱됩니다.',
      en: 'ZetaChain is a Cosmos SDK cross-chain L1 where Observers (watch external-chain events) and TSS Signers (sign external-chain txs) participate in consensus. In addition to standard Cosmos slashing, observer/signer failures slash the paired core validator\'s ZETA.',
    },
    color: '#00D6AA',
    docsUrl: 'https://www.zetachain.com/docs/',
  },
  {
    id: 'vana',
    name: 'Vana',
    nameKo: '바나',
    symbol: 'VANA',
    tvlUsd: 697_926,
    consensus: {
      ko: 'Nagoya Consensus (Bittensor Yuma 파생, 퍼지 합의)',
      en: 'Nagoya Consensus (Bittensor Yuma-derived, fuzzy consensus)',
    },
    consensusFamily: 'PoS-Other',
    slashingStatus: 'active',
    offenses: [
      {
        name: {
          ko: '악의적 행동 / 12시간 이상 다운타임',
          en: 'Malicious Behavior / Downtime >12h',
        },
        description: {
          ko: '악의적 합의 참여 또는 에폭당 12시간 초과 오프라인.',
          en: 'Malicious consensus participation, or offline for more than 12 hours per epoch.',
        },
        penalty: {
          ko: '스테이크의 10% 슬래싱',
          en: '10% stake slashing',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Vana는 DataDAO를 위한 EVM 호환 L1으로, L1 검증자(64→128, 35K VANA 스테이킹)가 체인 보안을, Satya Validator(TEE 기반)가 데이터 검증을 담당합니다. Nagoya 퍼지 합의에서 악의/장기 다운타임 시 스테이크의 10%가 슬래싱됩니다.',
      en: 'Vana is an EVM-compatible L1 for DataDAOs. L1 validators (64→128, 35K VANA stake) secure the chain, while Satya validators (TEE-based) handle data validation. In Nagoya fuzzy consensus, malicious behavior or >12h downtime triggers a 10% stake slashing.',
    },
    color: '#0052FF',
    docsUrl: 'https://docs.vana.org/',
  },
  {
    id: 'canton',
    name: 'Canton Network',
    nameKo: '캔톤 네트워크',
    symbol: 'CC',
    tvlUsd: 0,
    consensus: {
      ko: 'Global Synchronizer (2/3 BFT, Digital Asset, DAML)',
      en: 'Global Synchronizer (2/3 BFT, Digital Asset, DAML)',
    },
    consensusFamily: 'PoS-Other',
    slashingStatus: 'none',
    slashingNote: {
      ko: '기관 운영자(Super Validator) ~42개가 2/3 BFT로 운영하는 permissioned 구조. Digital Asset 문서에 따르면 "검증자는 오프라인이거나 부적절한 행동을 해도 페널티를 받지 않으며, 스테이킹된 자산을 잃을 리스크도 없음" - 전통적 슬래싱 개념이 미적용됩니다.',
      en: 'Permissioned 2/3 BFT operated by ~42 institutional Super Validators. Per Digital Asset docs: "Validators are not penalized for being offline or misbehaving. There is no risk of losing staked assets because staking, in the traditional sense, is not part of the Canton validator model."',
    },
    offenses: [],
    tokenDestination: 'none',
    tokenHandlingDescription: {
      ko: '토큰 스테이킹/슬래싱 개념 없음. 악의적 Super Validator는 GSF(Global Synchronizer Foundation, Linux Foundation 파트너십) 거버넌스 투표로 자격 박탈되는 방식으로만 제재됩니다. CC 토큰은 수수료 결제와 인센티브 용도이지 보증금이 아닙니다.',
      en: 'No token staking/slashing concept. Misbehaving Super Validators are removed only via governance votes by the GSF (Global Synchronizer Foundation, Linux Foundation partnership). The CC token is used for fees and incentives, not as bonded collateral.',
    },
    color: '#0E1D3A',
    docsUrl: 'https://www.canton.network/',
  },
];

export const CHAINS: readonly Chain[] = [...RAW_CHAINS]
  .sort((a, b) => b.tvlUsd - a.tvlUsd)
  .map((chain, index) => ({ ...chain, tvlRank: index + 1 }));
