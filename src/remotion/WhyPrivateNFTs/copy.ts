// Every on-screen string of the WhyPrivateNFTs video.
// "Welcome to the public ledger. Your art. Your trades. Your wallet. Visible to everyone. Forever.
//  Go private. Powered by Aztec. Introducing the Raven House marketplace. A single click and it's yours.
//  Buy. And keep your collection private. Sell, with escrow-backed trades. One home for private collectors.
//  Unlock memberships and rewards. Discover. Mint. Trade. Own. Now live on Aztec Alpha mainnet. Raven House."

export const copy = {
  S01: { welcome: "WELCOME", toThe: "TO THE", ledger: "PUBLIC LEDGER" },
  S02: { art: "YOUR ART", trades: "YOUR TRADES", wallet: "YOUR WALLET" },
  S03: { wall: "VISIBLE TO EVERYONE", highlight: "EVERYONE" },
  S04: { word: "FOREVER." },
  S05: { word: "GO PRIVATE" },
  S07: { top: "POWERED BY", bottom: "AZTEC", zk: "zk" },
  S08: { introducing: "INTRODUCING", the: "THE" },
  S09: { label: "RAVEN HOUSE MARKETPLACE" },
  S10: {
    wall: "A SINGLE CLICK AND",
    highlight: "CLICK AND",
    yours: "IT'S YOURS",
  },
  S11: { label: "BUY" },
  S12: {
    nftName: "Veilquill #6",
    collection: "Rise of the Rivals",
    price: "10.00",
    token: "USDC",
    buyTitle: "Purchase NFT",
    buyLine: "This NFT is listed for",
    buyNow: "Buy Now",
    walletName: "Azguard Wallet",
    walletSub: "Pays the seller through the escrow contract",
    proofTitle: "Generating zero-knowledge proof…",
    proofSteps: [
      "Simulating transaction",
      "Proving in your wallet",
      "Sending to Aztec",
    ],
    successTitle: "It's yours.",
    successBody:
      "Purchase settled through escrow. Shield it to private anytime.",
    successCta: "View in My NFTs",
  },
  S13: {
    and: "AND",
    keep: "KEEP YOUR",
    collection: "COLLECTION",
    private: "PRIVATE",
  },
  S14: {
    sell: "SELL",
    with: "WITH",
    escrow: "ESCROW",
    backed: "BACKED",
    trades: "TRADES",
  },
  S15: {
    profileTitle: "My NFTs",
    tabs: ["Public", "Private", "Vouchers"],
    listTitle: "List for Sale",
    pricePlaceholder: "Enter price in USDC token",
    typedPrice: "25",
    feeRows: [
      ["Listing price", "25.00 USDC"],
      ["Held in escrow", "Until sold or cancelled"],
      ["You receive", "25.00 USDC"],
    ],
    createListing: "Create listing",
    offersTitle: "Active Offers",
    offerAmount: "22.50 USDC",
    offerBy: "by 0x2f…a91c",
    offerAge: "2 min ago",
    accept: "Accept",
    decline: "Decline",
  },
  S16: { home: "ONE HOME", for: "FOR", collectors: "PRIVATE COLLECTORS" },
  S17: {
    title: "Your collection",
    publicBadge: "Public",
    privateBadge: "Private",
    shielding: "Shielding…",
    shieldBtn: "Make private",
  },
  S18: {
    unlock: "UNLOCK",
    memberships: "MEMBERSHIPS",
    and: "AND",
    rewards: "REWARDS",
  },
  S19: {
    voucherTitle: "Raven Lounge Voucher",
    voucherCollection: "Voucher Collection · Discord holder role",
    voucherClaimed: "🎉 This voucher has been claimed!",
    voucherPrivate: "Paid out to your private balance",
    claim: "Claim Voucher",
  },
  S20: { words: ["DISCOVER", "MINT", "TRADE", "OWN"] },
  S21: { live: "NOW LIVE ON", network: "AZTEC ALPHA MAINNET" },
  S22: { url: "ravenhouse.xyz" },
} as const;
