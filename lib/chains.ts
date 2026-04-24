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
      ko: '슬래싱된 ETH 중 1/512 EB는 블록 제안자와 고발자에게 보상으로 지급되고, 나머지는 소각되어 총 공급량이 감소합니다. 상관 페널티는 4,096 에폭(~18일) 내 다른 슬래싱 총량에 비례해 이론상 최대 100%까지 도달할 수 있습니다. 슬래싱된 검증자는 약 36일 후 강제 종료(exit)됩니다.',
      en: '1/512 EB of slashed ETH is paid to the block proposer and whistleblower; the remainder is burned, reducing total supply. The correlation penalty scales with the sum of all slashings within 4,096 epochs (~18 days), reaching up to 100% in the worst case. Slashed validators are force-exited after ~36 days.',
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
        name: { ko: '블록 누락', en: 'Unavailability' },
        description: {
          ko: '할당된 블록 생성을 지속적으로 실패(offline).',
          en: 'Persistently failing to produce assigned blocks (offline).',
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
      ko: 'DPoS — 27 Super Representatives',
      en: 'DPoS — 27 Super Representatives',
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
      ko: 'CometBFT (Cosmos SDK · 금융 서비스 특화 L1)',
      en: 'CometBFT (Cosmos SDK · financial-services-focused L1)',
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
      ko: 'HyperBFT (Tendermint 파생, Rust 구현)',
      en: 'HyperBFT (Tendermint-derived, Rust implementation)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '이중 서명', en: 'Double Signing' },
        description: {
          ko: '동일 라운드 · 높이에서 충돌하는 서명.',
          en: 'Conflicting signatures in the same round/height.',
        },
        penalty: {
          ko: '본딩 스테이크 슬래싱 + Jail',
          en: 'Bonded-stake slashing + Jail',
        },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '할당된 블록 서명 과도한 누락.',
          en: 'Excessive missed block signatures.',
        },
        penalty: { ko: '보상 감소 + Jail', en: 'Reduced rewards + Jail' },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Hyperliquid L1은 주문서 기반 DEX를 합의 레벨에 통합한 HyperBFT를 사용합니다. 검증자가 HYPE를 본딩하며, 이중 서명 시 스테이크가 슬래싱되고 소각됩니다. 검증자 수는 아직 제한적(~20명대 수준)으로 운영 중.',
      en: 'Hyperliquid L1 uses HyperBFT, integrating an order-book DEX at the consensus layer. Validators bond HYPE, and double-signing results in stake being slashed and burned. The validator set remains limited (roughly ~20 operators).',
    },
    color: '#97FCE4',
    docsUrl: 'https://hyperliquid.gitbook.io/hyperliquid-docs',
  },
  {
    id: 'polygon',
    name: 'Polygon PoS',
    nameKo: '폴리곤 PoS',
    symbol: 'POL',
    tvlUsd: 1_190_878_188,
    consensus: {
      ko: 'Heimdall (Tendermint) + Bor (EVM) · Ethereum L1 staking',
      en: 'Heimdall (Tendermint) + Bor (EVM) · Ethereum L1 staking',
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
        penalty: { ko: '스테이크의 약 4% + Jail', en: '~4% of stake + Jail' },
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
      ko: 'CometBFT (Cosmos SDK + Ethermint EVM)',
      en: 'CometBFT (Cosmos SDK + Ethermint EVM)',
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
      ko: '표준 Cosmos SDK 슬래싱 모델을 따릅니다. 슬래싱된 CRO는 소각됩니다. Cronos PoS 체인과 별도로 Cronos zkEVM(L2)이 있으며, zkEVM은 슬래싱 개념이 다릅니다.',
      en: 'Follows the standard Cosmos SDK slashing model. Slashed CRO is burned. Separate from the Cronos PoS chain, there is Cronos zkEVM (L2), which uses a different security model.',
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
      ko: 'Nakamoto + Proof of Transfer (PoX) · Bitcoin finality',
      en: 'Nakamoto + Proof of Transfer (PoX) · Bitcoin finality',
    },
    consensusFamily: 'Nakamoto-PoX',
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: 'Signer 부정 서명', en: 'Malicious Signer' },
        description: {
          ko: 'Nakamoto 업그레이드 후 Stackers가 되는 signer가 충돌 서명 또는 응답 불능.',
          en: 'Post-Nakamoto signers (Stackers) submit conflicting signatures or fail to respond.',
        },
        penalty: {
          ko: 'STX 스테이크 일부 슬래싱 + signer 세트에서 제외',
          en: 'Partial STX stake slashing + exclusion from the signer set',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Nakamoto 업그레이드(2024) 이후 signers (Stackers)가 블록 확정에 서명합니다. 악의적 행위 시 스테이킹된 STX 일부가 슬래싱되어 소각되며, 비트코인 reward cycle에서 제외됩니다.',
      en: 'Since the Nakamoto upgrade (2024), signers (Stackers) sign block finalizations. Malicious behavior leads to partial slashing of staked STX (burned) and exclusion from Bitcoin reward cycles.',
    },
    color: '#5546FF',
    docsUrl: 'https://docs.stacks.co/',
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
    slashingStatus: 'active',
    offenses: [
      {
        name: { ko: '블록 이중 서명', en: 'Block Double Sign' },
        description: {
          ko: '동일 높이에서 서로 다른 블록을 생성.',
          en: 'Producing different blocks at the same height.',
        },
        penalty: {
          ko: '스테이크 전액 슬래싱 (ChunkProofsChallenge)',
          en: 'Full-stake slashing (ChunkProofsChallenge)',
        },
        severity: 'severe',
      },
      {
        name: { ko: '청크 이중 생성', en: 'Chunk Double Production' },
        description: {
          ko: '동일 샤드/슬롯에서 충돌하는 청크 생산 또는 무효 상태 전이 제출.',
          en: 'Conflicting chunk production on the same shard/slot, or submitting invalid state transitions.',
        },
        penalty: { ko: '스테이크 전액 슬래싱', en: 'Full-stake slashing' },
        severity: 'severe',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: '슬래싱된 NEAR은 소각되어 총 공급량에서 제거됩니다. 다운타임은 슬래싱 대상이 아니며, 해당 검증자는 다음 에폭에서 활성 세트에서 제외되고 보상만 받지 못합니다. 비잔틴 슬래싱이 실제 발동된 사례는 매우 드문 편입니다.',
      en: 'Slashed NEAR is burned and removed from total supply. Downtime is not slashable — validators are simply dropped from the active set in the next epoch and forgo rewards. Byzantine slashing has rarely been triggered in practice.',
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
          ko: '서명 윈도우 내 과도한 블록 누락.',
          en: 'Excessive missed blocks within the signing window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.01% + 5분 Jail',
          en: '0.01% of bonded stake + 5-minute Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'community_pool',
    tokenHandlingDescription: {
      ko: '슬래싱된 DYDX는 커뮤니티 풀로 전송됩니다. dYdX Chain은 CometBFT 기반이지만 모든 거래 수수료가 USDC로 트레이더에게 지급되는 특이 구조를 가집니다.',
      en: 'Slashed DYDX is sent to the community pool. Although CometBFT-based, dYdX Chain has a distinctive structure where all trading fees are paid to traders in USDC.',
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
      ko: 'Gasper (Ethereum PoS 포크 · Gnosis Beacon Chain)',
      en: 'Gasper (Ethereum PoS fork · Gnosis Beacon Chain)',
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
      ko: 'Gnosis Chain은 Ethereum의 Gasper를 그대로 포팅한 PoS로, 검증자는 1 mGNO (1,000 GNO = 1 validator slot)를 예치합니다. 슬래싱된 mGNO는 Ethereum과 동일하게 소각되고 고발자/제안자에게 소액 보상이 지급됩니다.',
      en: "Gnosis Chain is a direct port of Ethereum's Gasper; validators deposit 1 mGNO (1,000 GNO = 1 validator slot). Slashed mGNO is burned just as in Ethereum, with small rewards paid to the whistleblower/proposer.",
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
    tokenDestination: 'community_pool',
    tokenHandlingDescription: {
      ko: '슬래싱된 SEI는 커뮤니티 풀로 전송됩니다. 세이 특유의 병렬 실행 엔진과 별개로, 합의/스테이킹 레이어는 표준 Cosmos SDK 슬래싱 패턴을 따릅니다.',
      en: 'Slashed SEI is sent to the community pool. Although Sei features a parallel execution engine, the consensus/staking layer follows the standard Cosmos SDK slashing pattern.',
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
      ko: 'Hashgraph (aBFT · gossip about gossip + virtual voting)',
      en: 'Hashgraph (aBFT · gossip about gossip + virtual voting)',
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
          ko: '할당된 검증 작업에 대한 참여 실패.',
          en: 'Failure to participate in assigned validation work.',
        },
        penalty: {
          ko: 'Complaint 시스템을 통해 스테이크의 일부 차감',
          en: 'Partial stake deduction through the Complaint system',
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
          ko: '스테이크 전액 슬래싱 가능',
          en: 'Full-stake slashing possible',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'validator_pool',
    tokenHandlingDescription: {
      ko: 'Elector 스마트 컨트랙트가 검증 기간 동안 스테이크를 에스크로로 보관합니다. 기간 종료 시 고발(Complaint)이 접수되면 차감 후 반환되며, 슬래싱된 TON은 검증자 보상 풀로 환원되어 정직한 검증자들에게 재분배됩니다.',
      en: 'The Elector smart contract escrows stakes during the validation period. Upon completion, Complaints reduce the returned stake, and slashed TON flows back into a validator-reward pool that is redistributed to honest validators.',
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
      ko: 'Pure PoS (PPoS) · VRF 기반 committee 추첨',
      en: 'Pure PoS (PPoS) · VRF-based committee sortition',
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
    consensus: { ko: 'DPoS — 21 Block Producers', en: 'DPoS — 21 Block Producers' },
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
        name: { ko: '악의적 서명', en: 'Malicious TSS Signing' },
        description: {
          ko: 'Threshold Signature에서 비정상 서명 또는 자금 도난 시도.',
          en: 'Abnormal signing or attempted fund theft during Threshold Signature.',
        },
        penalty: {
          ko: 'Bond(RUNE) 슬래싱 — 피해액의 1.5배까지',
          en: 'Bond (RUNE) slashing — up to 1.5× the stolen amount',
        },
        severity: 'severe',
      },
      {
        name: { ko: '이중 서명 / 다운타임', en: 'Double Sign / Downtime' },
        description: {
          ko: '표준 Cosmos SDK 위반.',
          en: 'Standard Cosmos SDK violations.',
        },
        penalty: {
          ko: '본딩 스테이크 슬래싱 + Jail',
          en: 'Bonded-stake slashing + Jail',
        },
        severity: 'moderate',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'THORChain은 노드 운영자가 대규모 RUNE를 bond로 예치하는 "Churn" 시스템을 운영합니다. 악의적 서명이나 자금 유용 시 bond의 최대 150%까지 슬래싱되어 시스템으로 환수되며, 일부는 사용자 손실 보상에 사용되거나 소각됩니다.',
      en: 'THORChain operates a "Churn" system where node operators bond large amounts of RUNE. Malicious signing or fund misappropriation can slash up to 150% of the bond; portions are used to compensate user losses or are burned.',
    },
    color: '#1FC7A3',
    docsUrl: 'https://docs.thorchain.org/',
  },
  {
    id: 'sonic',
    name: 'Sonic',
    nameKo: '소닉',
    symbol: 'S',
    tvlUsd: 34_030_605,
    consensus: {
      ko: 'Lachesis aBFT (DAG · 구 Fantom)',
      en: 'Lachesis aBFT (DAG · formerly Fantom)',
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
      ko: 'Paris 프로토콜(2024) 이후 Adaptive Slashing이 도입되어, 슬래싱 비율은 동일 블록 내 위반 비율 f(B)의 이차함수 형태로 스케일됩니다(T는 전체 consensus slot의 약 1/3). 슬래싱된 XTZ 중 1/7은 고발자(denouncer) 보상으로 지급되고 나머지는 소각됩니다(Oxford2의 1/2에서 축소).',
      en: 'Since the Paris protocol (2024), Adaptive Slashing scales slashing rates as a quadratic of the violation fraction f(B) within a block (T is ~1/3 of consensus slots). 1/7 of slashed XTZ is paid to the denouncer and the rest is burned (reduced from 1/2 in Oxford2).',
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
          ko: '30,000 블록 윈도우 내 과도한 블록 누락.',
          en: 'Excessive missed blocks within a 30,000-block window.',
        },
        penalty: {
          ko: '본딩 스테이크의 0.01% + Jail',
          en: '0.01% of bonded stake + Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'community_pool',
    tokenHandlingDescription: {
      ko: '슬래싱된 OSMO는 커뮤니티 풀로 전송됩니다. Osmosis의 Superfluid Staking(LP 토큰 위임) 참여자도 동일한 슬래싱 영향을 받습니다.',
      en: "Slashed OSMO is sent to the community pool. Participants in Osmosis's Superfluid Staking (LP-token delegation) are subject to the same slashing.",
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
      ko: 'HotStuff 기반 · 4-role PoS (Collection/Consensus/Execution/Verification)',
      en: 'HotStuff-based · 4-role PoS (Collection/Consensus/Execution/Verification)',
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
          ko: '동일 블록 높이 충돌 서명.',
          en: 'Conflicting signatures at the same block height.',
        },
        penalty: { ko: '스테이크 슬래싱 + Jail', en: 'Stake slashing + Jail' },
        severity: 'severe',
      },
      {
        name: { ko: '다운타임', en: 'Downtime' },
        description: {
          ko: '할당된 블록을 지속적으로 놓침.',
          en: 'Consistently missing assigned blocks.',
        },
        penalty: {
          ko: '보상 차감 + 단기 Jail',
          en: 'Reward reduction + short Jail',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Axie Infinity의 게임 특화 L1인 Ronin은 제한된 수의 Governance Validator와 Standard Validator가 운영합니다. 악의적 행위 시 RON 스테이크가 슬래싱되어 소각됩니다.',
      en: "Ronin — Axie Infinity's gaming-focused L1 — operates a limited set of Governance Validators and Standard Validators. Malicious behavior results in RON stake slashing (burned).",
    },
    color: '#1273EA',
    docsUrl: 'https://docs.roninchain.com/',
  },
  {
    id: 'kaia',
    name: 'Kaia',
    nameKo: '카이아',
    symbol: 'KLAY',
    tvlUsd: 12_562_772,
    consensus: {
      ko: 'Istanbul BFT (IBFT · 구 Klaytn + Finschia)',
      en: 'Istanbul BFT (IBFT · former Klaytn + Finschia)',
    },
    consensusFamily: 'PoS-Other',
    slashingStatus: 'active',
    slashingNote: {
      ko: '전통적인 Byzantine 슬래싱보다는 블록 생성 실패에 대한 보상 차감 및 재선출 배제 중심.',
      en: 'Focuses on reward reduction and re-election exclusion for missed block production rather than traditional Byzantine slashing.',
    },
    offenses: [
      {
        name: { ko: '블록 생성 실패', en: 'Missed Block Proposal' },
        description: {
          ko: 'Council 멤버가 할당된 블록을 제안하지 않음.',
          en: 'A Council member fails to propose its assigned block.',
        },
        penalty: {
          ko: '보상 감소 및 committee 재배치',
          en: 'Reward reduction and committee reshuffle',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'burn',
    tokenHandlingDescription: {
      ko: 'Kaia(구 Klaytn/Finschia 통합)는 Council 기반 IBFT 합의로, Byzantine 공격보다는 가용성 문제를 중심으로 관리합니다. 보상 감소가 주된 제재 수단이며 대규모 본딩 슬래싱은 활성화되지 않았습니다.',
      en: 'Kaia (merged from Klaytn and Finschia) uses Council-based IBFT consensus focused on availability rather than Byzantine attacks. Reward reduction is the primary deterrent; large-scale bonded slashing is not active.',
    },
    color: '#BFF009',
    docsUrl: 'https://docs.kaia.io/',
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
      ko: 'Interchain Security v1 (Cosmos Hub 공유 보안)',
      en: 'Interchain Security v1 (Cosmos Hub shared security)',
    },
    consensusFamily: 'Tendermint',
    slashingStatus: 'active',
    slashingNote: {
      ko: '자체 검증자 세트가 없음. Cosmos Hub의 ATOM 검증자가 Neutron 블록도 검증하며 슬래싱도 Cosmos Hub에서 이루어집니다.',
      en: "No independent validator set. Cosmos Hub's ATOM validators also validate Neutron blocks and are slashed on Cosmos Hub.",
    },
    offenses: [
      {
        name: {
          ko: 'Consumer 체인 이중 서명',
          en: 'Consumer Chain Equivocation',
        },
        description: {
          ko: 'Cosmos Hub validator가 Neutron에서 이중 서명 시 증거가 IBC로 Hub에 전달.',
          en: 'A Cosmos Hub validator equivocates on Neutron; evidence is relayed to the Hub via IBC.',
        },
        penalty: {
          ko: 'Cosmos Hub에서 ATOM 스테이크 5% 슬래싱 + Tombstone',
          en: '5% of ATOM stake slashed on Cosmos Hub + Tombstone',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'shared_security',
    tokenHandlingDescription: {
      ko: 'Neutron은 Replicated Security(Interchain Security v1) 기반으로 자체 검증자를 운영하지 않습니다. Neutron에서 이중 서명이 감지되면 IBC를 통해 Cosmos Hub로 증거가 전달되어 Hub에서 ATOM이 슬래싱됩니다. NTRN 자체는 슬래싱 대상이 아닙니다.',
      en: 'Neutron operates under Replicated Security (Interchain Security v1) without its own validators. Equivocation on Neutron is detected, relayed to Cosmos Hub via IBC, and ATOM is slashed on the Hub. NTRN itself is not slashed.',
    },
    color: '#0C0C0C',
    docsUrl: 'https://github.com/neutron-org/neutron',
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
      ko: 'NPoS (Nominated PoS) · BABE + GRANDPA',
      en: 'NPoS (Nominated PoS) · BABE + GRANDPA',
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
          ko: '동일 라운드·슬롯에서 충돌하는 finality 투표 또는 블록 제안.',
          en: 'Conflicting finality votes or block proposals in the same round/slot.',
        },
        penalty: {
          ko: '공식 min((3x/n)², 1) — 단일 offender: ~0.09%, 집단: 최대 100%',
          en: 'Formula min((3x/n)², 1) — single offender: ~0.09%, coordinated: up to 100%',
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
          ko: '최근 5,000 블록 중 25% 이상(1,250 블록 초과) 오프라인.',
          en: 'Offline for more than 25% of the last 5,000 blocks (>1,250 blocks).',
        },
        penalty: {
          ko: '1분 Jail (unjail 후 재진입 가능). 스테이크 차감 없음',
          en: '1-minute Jail (re-entry after unjail). No stake deduction.',
        },
        severity: 'mild',
      },
    ],
    tokenDestination: 'community_pool',
    tokenHandlingDescription: {
      ko: '이중 서명 시 바운드된 TIA의 2%가 차감되고, 차감된 TIA는 커뮤니티 풀로 전송됩니다. 해당 validator는 영구 Tombstone되어 재진입이 불가능합니다. Cosmos Hub보다 이중 서명 슬래싱 비율을 낮게 (5% → 2%) 설정한 것이 특징입니다.',
      en: 'On equivocation, 2% of bonded TIA is deducted and sent to the community pool. The validator is permanently Tombstoned with no re-entry. Notably, Celestia sets a lower equivocation slashing rate (5% → 2%) than Cosmos Hub.',
    },
    color: '#7B2BF9',
    docsUrl: 'https://docs.celestia.org/operate/consensus-validators/slashing/',
  },
  {
    id: 'kusama',
    name: 'Kusama',
    nameKo: '쿠사마',
    symbol: 'KSM',
    tvlUsd: 1_000_000,
    consensus: {
      ko: 'NPoS (Polkadot과 동일 · 더 공격적 파라미터)',
      en: 'NPoS (same as Polkadot · more aggressive parameters)',
    },
    consensusFamily: 'NPoS',
    slashingStatus: 'active',
    offenses: [
      {
        name: {
          ko: '이중 서명 · 유효성 위반',
          en: 'Equivocation & Invalid Validation',
        },
        description: {
          ko: 'Polkadot과 동일한 위반 유형.',
          en: 'Same violation types as Polkadot.',
        },
        penalty: {
          ko: '동일한 비례 슬래싱, 지연 기간이 더 짧음 (~7일)',
          en: 'Same proportional slashing with a shorter defer window (~7 days)',
        },
        severity: 'severe',
      },
    ],
    tokenDestination: 'treasury',
    tokenHandlingDescription: {
      ko: 'Polkadot과 동일하게 Treasury로 전송됩니다. 다만 카나리아 네트워크 특성상 거버넌스 개입 기간이 짧고 실제 슬래싱이 더 자주 실행되어 왔습니다.',
      en: 'Transferred to the Treasury just like Polkadot. However, as a canary network, governance-intervention windows are shorter and slashing has been executed more frequently in practice.',
    },
    color: '#000000',
    docsUrl: 'https://wiki.polkadot.com/learn/learn-offenses/',
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
];

export const CHAINS: readonly Chain[] = [...RAW_CHAINS]
  .sort((a, b) => b.tvlUsd - a.tvlUsd)
  .map((chain, index) => ({ ...chain, tvlRank: index + 1 }));
