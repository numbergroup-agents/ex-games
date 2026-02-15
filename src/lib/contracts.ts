import { type Abi } from "viem";

// Placeholder addresses — replace after deployment
export const CONTRACTS = {
  ExToken: "0x0000000000000000000000000000000000000001" as `0x${string}`,
  ExPool: "0x0000000000000000000000000000000000000002" as `0x${string}`,
  ExComments: "0x0000000000000000000000000000000000000003" as `0x${string}`,
} as const;

export const ExTokenABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    name: "allowance", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function",
  },
  {
    inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }],
    name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function",
  },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getTier", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function",
  },
  { inputs: [], name: "name", outputs: [{ name: "", type: "string" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "stake", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "stakedBalance", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function",
  },
  { inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }],
    name: "transfer", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" }],
    name: "transferFrom", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "unstake", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  { inputs: [], name: "ADVISOR_THRESHOLD", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "ORACLE_THRESHOLD", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  // Events
  { anonymous: false, inputs: [{ indexed: true, name: "user", type: "address" }, { indexed: false, name: "amount", type: "uint256" }], name: "Staked", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, name: "user", type: "address" }, { indexed: false, name: "amount", type: "uint256" }], name: "Unstaked", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, name: "from", type: "address" }, { indexed: true, name: "to", type: "address" }, { indexed: false, name: "value", type: "uint256" }], name: "Transfer", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, name: "owner", type: "address" }, { indexed: true, name: "spender", type: "address" }, { indexed: false, name: "value", type: "uint256" }], name: "Approval", type: "event" },
] as const satisfies Abi;

export const ExPoolABI = [
  { inputs: [{ name: "_token", type: "address" }], stateMutability: "nonpayable", type: "constructor" },
  // Read functions
  { inputs: [], name: "nextMarketId", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "PLATFORM_FEE_BPS", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "LATE_BET_CAP", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarket",
    outputs: [
      { name: "creator", type: "address" },
      { name: "title", type: "string" },
      { name: "body", type: "string" },
      { name: "numOutcomes", type: "uint8" },
      { name: "deadline", type: "uint256" },
      { name: "resolved", type: "bool" },
      { name: "winningOutcome", type: "uint8" },
      { name: "totalPool", type: "uint256" },
      { name: "dramaTier", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getOutcomeLabels",
    outputs: [{ name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }, { name: "", type: "uint8" }],
    name: "outcomePools",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }, { name: "", type: "address" }, { name: "", type: "uint8" }],
    name: "userBets",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }, { name: "", type: "address" }],
    name: "claimed",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [
      { name: "title", type: "string" },
      { name: "body", type: "string" },
      { name: "outcomes", type: "string[]" },
      { name: "deadline", type: "uint256" },
      { name: "dramaTier", type: "uint8" },
    ],
    name: "createMarket",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }, { name: "outcomeIndex", type: "uint8" }, { name: "amount", type: "uint256" }],
    name: "placeBet", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }, { name: "winningOutcome", type: "uint8" }],
    name: "resolveMarket", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "claimWinnings", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }, { name: "proposedOutcome", type: "uint8" }],
    name: "disputeOutcome", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }, { name: "outcomeIndex", type: "uint8" }],
    name: "communityResolve", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "title", type: "string" },
      { indexed: false, name: "body", type: "string" },
      { indexed: false, name: "outcomes", type: "string[]" },
      { indexed: false, name: "deadline", type: "uint256" },
      { indexed: false, name: "dramaTier", type: "uint8" },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: true, name: "bettor", type: "address" },
      { indexed: false, name: "outcomeIndex", type: "uint8" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "marketId", type: "uint256" }, { indexed: false, name: "winningOutcome", type: "uint8" }],
    name: "MarketResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: true, name: "claimer", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "WinningsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: true, name: "disputer", type: "address" },
      { indexed: false, name: "proposedOutcome", type: "uint8" },
    ],
    name: "DisputeOpened",
    type: "event",
  },
] as const satisfies Abi;

export const ExCommentsABI = [
  { inputs: [{ name: "_token", type: "address" }], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ name: "marketId", type: "uint256" }, { name: "content", type: "string" }],
    name: "postComment", outputs: [{ name: "", type: "uint256" }], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "commentId", type: "uint256" }, { name: "amount", type: "uint256" }],
    name: "tipComment", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "comments",
    outputs: [
      { name: "author", type: "address" },
      { name: "marketId", type: "uint256" },
      { name: "content", type: "string" },
      { name: "totalTips", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "nextCommentId", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "commentId", type: "uint256" },
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: true, name: "author", type: "address" },
      { indexed: false, name: "content", type: "string" },
    ],
    name: "CommentPosted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "commentId", type: "uint256" },
      { indexed: true, name: "tipper", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "CommentTipped",
    type: "event",
  },
] as const satisfies Abi;
