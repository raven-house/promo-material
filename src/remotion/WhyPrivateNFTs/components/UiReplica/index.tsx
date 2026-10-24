// Pixel-faithful replicas of Raven House wallet-gated flows.
// Classes mirror frontend-app: NFTPurchaseSection, CreateListingSection, NFTOffersTab,
// profileTabs/PrivateNFTs, transfer/transferTypes, VoucherClaimStatusSection.
import {
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Eye,
  Loader,
  Lock,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import type { NftAsset } from "../../assets";
import { LOGOS, nftAt } from "../../assets";
import { copy } from "../../copy";
import { colors, FONT, ui } from "../../theme";
import { ip, range } from "../util";

const base: React.CSSProperties = {
  fontFamily: FONT,
  color: ui.text,
  boxSizing: "border-box",
};

export const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "#fff",
}) => {
  const f = useCurrentFrame();
  return (
    <Loader
      size={size}
      color={color}
      style={{ transform: `rotate(${f * 14}deg)` }}
    />
  );
};

const Button: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: number;
}> = ({ children, style, glow = 0 }) => (
  <div
    style={{
      height: 40,
      borderRadius: "0.6rem",
      background: ui.primary,
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      boxShadow:
        glow > 0
          ? `0 0 ${30 * glow}px rgba(185,163,255,${0.8 * glow}), 0 0 0 ${2 * glow}px rgba(185,163,255,${glow})`
          : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: ui.panel,
      border: `1px solid ${ui.panelBorder}`,
      borderRadius: 8,
      padding: 18,
      ...style,
    }}
  >
    {children}
  </div>
);

// Header row used by detail-like screens
const DetailHeader: React.FC<{
  name: string;
  collection: string;
  price: string;
}> = ({ name, collection, price }) => (
  <Panel>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{name}</div>
        <div
          style={{
            fontSize: 13,
            color: ui.gray500,
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {collection}
          <ShieldCheck size={14} color="#3B82F6" />
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: ui.gray400,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Eye size={13} /> owned by:
        <span
          style={{
            width: 70,
            height: 12,
            borderRadius: 4,
            background: "#4b4655",
            filter: "blur(3px)",
          }}
        />
        <Copy size={13} style={{ marginLeft: 8 }} />
      </div>
    </div>
    <div style={{ marginTop: 14, fontSize: 24, fontWeight: 700 }}>
      {price === "—" ? (
        <span style={{ fontSize: 15, color: ui.gray400, fontWeight: 500 }}>
          Not listed
        </span>
      ) : (
        <>
          {price}{" "}
          <span style={{ fontSize: 13, color: ui.gray400, fontWeight: 500 }}>
            USDC
          </span>
        </>
      )}
    </div>
  </Panel>
);

// ───────────────────────── NftDetail (page layout) ─────────────────────────
export const NftDetail: React.FC<{
  nft: NftAsset;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  name?: string;
  collection?: string;
  price?: string;
}> = ({
  nft,
  children,
  width = 1600,
  height = 900,
  name = copy.S12.nftName,
  collection = copy.S12.collection,
  price = copy.S12.price,
}) => {
  return (
    <div
      style={{
        ...base,
        width,
        height,
        background: ui.bg,
        padding: "36px 120px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          color: ui.text,
        }}
      >
        <ChevronLeft size={16} /> Back to Collection
      </div>
      <div
        style={{
          display: "flex",
          gap: 22,
          marginTop: 18,
          fontSize: 13,
          color: ui.gray500,
          borderBottom: "1px solid #2a2730",
          paddingBottom: 8,
          width: 300,
        }}
      >
        <span
          style={{
            color: "#fff",
            borderBottom: `2px solid ${colors.lavender}`,
            paddingBottom: 6,
          }}
        >
          Overview
        </span>
        <span>Listing</span>
        <span>Offers</span>
        <span>Activity</span>
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: 24 }}>
        <div style={{ width: 600 }}>
          <Img
            src={staticFile(nft.src)}
            style={{
              width: 600,
              height: 600,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <Panel style={{ marginTop: 16, fontWeight: 600, fontSize: 16 }}>
            About {collection}
          </Panel>
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}
        >
          <DetailHeader name={name} collection={collection} price={price} />
          {children}
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── BuyModal ─────────────────────────
// NFTPurchaseSection + Azguard confirm row
export const BuyModal: React.FC<{ clickAt?: number; width?: number }> = ({
  clickAt = 9999,
  width = 760,
}) => {
  const f = useCurrentFrame();
  const c = copy.S12;
  const pressing = f >= clickAt && f < clickAt + 6;
  const confirm = ip(f, [clickAt + 4, clickAt + 12], [0, 1]);
  return (
    <div
      style={{
        ...base,
        width,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          border: `1px solid ${ui.gray700}`,
          borderRadius: 6,
          padding: 20,
          background: "#16141a",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          {c.buyTitle}
        </div>
        <div style={{ textAlign: "center", marginBottom: 18, fontSize: 16 }}>
          {c.buyLine}{" "}
          <span style={{ fontWeight: 700 }}>
            {c.price} {c.token}
          </span>
        </div>
        <Button
          glow={ip(f, [clickAt - 14, clickAt - 4], [0, 1]) * (1 - confirm)}
          style={{
            transform: pressing ? "scale(0.97)" : undefined,
            background: pressing ? ui.primaryHover : ui.primary,
          }}
        >
          {f >= clickAt ? (
            <>
              <Spinner /> Purchasing...
            </>
          ) : (
            c.buyNow
          )}
        </Button>
      </div>
      <div
        style={{
          opacity: confirm,
          transform: `translateY(${(1 - confirm) * 14}px)`,
        }}
      >
        <Panel style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Img
            src={staticFile(LOGOS.azguard)}
            style={{ width: 44, height: 44, borderRadius: 10 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{c.walletName}</div>
            <div style={{ color: ui.gray400, fontSize: 12, marginTop: 2 }}>
              {c.walletSub}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              −{c.price} {c.token}
            </div>
            <div
              style={{
                color: ui.gray400,
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 4,
                justifyContent: "flex-end",
              }}
            >
              <ShieldCheck size={11} /> escrow contract
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

// ───────────────────────── ProofProgress ─────────────────────────
export const ProofProgress: React.FC<{ progress: number; width?: number }> = ({
  progress,
  width = 760,
}) => {
  const c = copy.S12;
  const R = 74;
  const circ = 2 * Math.PI * R;
  return (
    <Panel
      style={{
        ...base,
        width,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg width={190} height={190}>
        <circle
          cx={95}
          cy={95}
          r={R}
          stroke="#3a3540"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={95}
          cy={95}
          r={R}
          stroke={colors.lavender}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ * progress} ${circ}`}
          transform="rotate(-90 95 95)"
          style={{ filter: `drop-shadow(0 0 8px ${colors.purple})` }}
        />
        <text
          x={95}
          y={106}
          textAnchor="middle"
          fill="#fff"
          fontFamily={FONT}
          fontWeight={700}
          fontSize={30}
        >
          {Math.round(progress * 100)}%
        </text>
      </svg>
      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 18 }}>
        {c.proofTitle}
      </div>
      <div
        style={{
          marginTop: 18,
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {c.proofSteps.map((s, i) => {
          const done = progress > (i + 1) / 3 - 0.02;
          const active = !done && progress > i / 3;
          return (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 15,
                color: done ? "#fff" : active ? ui.text : ui.gray500,
              }}
            >
              {done ? (
                <Check size={16} color={colors.green} />
              ) : active ? (
                <Spinner size={16} color={colors.lavender} />
              ) : (
                <Clock size={16} />
              )}
              {s}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

// ───────────────────────── Success ─────────────────────────
export const PurchaseSuccess: React.FC<{ pop: number; width?: number }> = ({
  pop,
  width = 760,
}) => {
  const c = copy.S12;
  return (
    <div
      style={{
        ...base,
        width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 30,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(74,222,128,0.12)",
          border: "2px solid rgba(74,222,128,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${pop})`,
        }}
      >
        <Check size={64} color={colors.green} strokeWidth={2.4} />
      </div>
      <div
        style={{
          color: colors.green,
          fontSize: 34,
          fontWeight: 700,
          marginTop: 26,
        }}
      >
        {c.successTitle}
      </div>
      <div
        style={{
          color: ui.gray400,
          fontSize: 17,
          marginTop: 12,
          textAlign: "center",
        }}
      >
        {c.successBody}
      </div>
      <Button style={{ marginTop: 26, padding: "0 28px" }}>
        {c.successCta}
      </Button>
    </div>
  );
};

// ───────────────────────── ListForSaleModal ─────────────────────────
// CreateListingSection: border #414141 bg #28242C, input bg #201D23 with "usdc" suffix, button bg #402D4E
export const ListForSaleModal: React.FC<{
  typed: number;
  submitAt?: number;
  width?: number;
}> = ({ typed, submitAt = 9999, width = 760 }) => {
  const f = useCurrentFrame();
  const c = copy.S15;
  const text = c.typedPrice.slice(0, Math.round(typed * c.typedPrice.length));
  const ready = text.length > 0;
  const submitted = f >= submitAt;
  return (
    <div
      style={{
        ...base,
        width,
        border: `1px solid ${ui.panelBorder}`,
        background: ui.panel,
        borderRadius: 6,
        padding: "20px 20px 30px",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#fff",
          marginBottom: 14,
        }}
      >
        {c.listTitle}
      </div>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div
          style={{
            height: 46,
            background: ui.input,
            borderRadius: 6,
            border: `1px solid ${ready ? "rgba(185,163,255,0.6)" : ui.input}`,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            fontSize: 16,
            color: ready ? "#fff" : ui.panelBorder,
          }}
        >
          {ready ? text : c.pricePlaceholder}
          {typed < 1 && Math.floor(f / 8) % 2 === 0 && (
            <span
              style={{
                width: 2,
                height: 20,
                background: "#fff",
                marginLeft: 2,
              }}
            />
          )}
        </div>
        <span
          style={{
            position: "absolute",
            right: 16,
            top: 13,
            fontSize: 15,
            color: "#fff",
          }}
        >
          usdc
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 18,
        }}
      >
        {c.feeRows.map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: ui.gray400,
            }}
          >
            <span>{k}</span>
            <span style={{ color: "#fff", opacity: ready ? 1 : 0.3 }}>{v}</span>
          </div>
        ))}
      </div>
      <Button
        glow={
          ip(f, [submitAt - 12, submitAt - 2], [0, 1]) * (submitted ? 0.4 : 1)
        }
        style={{
          background: ready ? ui.primary : ui.listBtn,
          color: ready ? "#fff" : ui.muted,
          height: 44,
        }}
      >
        {submitted ? (
          <>
            <Spinner /> Listing...
          </>
        ) : (
          c.createListing
        )}
      </Button>
    </div>
  );
};

// ───────────────────────── OffersPanel ─────────────────────────
export const OffersPanel: React.FC<{ acceptAt?: number; width?: number }> = ({
  acceptAt = 9999,
  width = 760,
}) => {
  const f = useCurrentFrame();
  const c = copy.S15;
  const accepted = f >= acceptAt + 8;
  return (
    <div style={{ ...base, width }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600 }}>{c.offersTitle}</div>
        <div
          style={{
            border: `1px solid ${colors.green}`,
            color: colors.green,
            borderRadius: 999,
            fontSize: 12,
            padding: "1px 8px",
          }}
        >
          1
        </div>
      </div>
      <div
        style={{
          background: accepted ? "rgba(20,83,45,0.18)" : "#1a1820",
          border: `1px solid ${accepted ? "rgba(22,163,74,0.4)" : "#2f2b36"}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>
                {c.offerAmount}
              </span>
              {accepted && (
                <span
                  style={{
                    background: ui.green,
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 6,
                    padding: "2px 8px",
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  <Check size={12} /> Accepted
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                fontSize: 13,
                color: ui.gray400,
                marginTop: 6,
              }}
            >
              <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <User size={12} /> {c.offerBy}
              </span>
              <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <Clock size={12} /> {c.offerAge}
              </span>
            </div>
          </div>
          {!accepted && (
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  background: f >= acceptAt ? "#15803D" : ui.green,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: `0 0 ${ip(f, [acceptAt - 12, acceptAt], [0, 26])}px rgba(74,222,128,0.7)`,
                  transform:
                    f >= acceptAt && f < acceptAt + 4
                      ? "scale(0.95)"
                      : undefined,
                }}
              >
                {f >= acceptAt ? <Spinner size={16} /> : <Check size={16} />}{" "}
                {f >= acceptAt ? "" : c.accept}
              </div>
              <div
                style={{
                  border: "1px solid #f87171",
                  color: "#f87171",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <X size={16} /> {c.decline}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── CollectionList ─────────────────────────
// "Your collection" rows with public/private badges; one row shields (transfer_public_to_private)
export const CollectionList: React.FC<{
  rowsShown: number;
  shieldAt: number;
  privateAt: number;
  shieldRow?: number;
  width?: number;
  title?: string;
  seed?: number;
}> = ({
  rowsShown,
  shieldAt,
  privateAt,
  shieldRow = 3,
  width = 1500,
  title = copy.S17.title,
  seed = 4,
}) => {
  const f = useCurrentFrame();
  const c = copy.S17;
  const rows = range(8).map((i) => ({
    nft: nftAt(i * 11 + seed),
    isPrivate: i === 1 || i === 5,
  }));
  return (
    <div style={{ ...base, width, padding: "34px 40px", background: ui.bg }}>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 26,
        }}
      >
        {copy.S15.tabs.map((t, i) => (
          <div
            key={t}
            style={{
              fontSize: 13,
              padding: "4px 14px",
              borderRadius: 999,
              background: i === 0 ? ui.primary : "transparent",
              border: "1px solid #2f2b36",
              color: i === 0 ? "#fff" : ui.gray400,
            }}
          >
            {t}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {rows.map((r, i) => {
          const appear = ip(rowsShown, [i, i + 1], [0, 1]);
          const isShield = i === shieldRow;
          const shielding = isShield && f >= shieldAt && f < privateAt;
          const nowPrivate = r.isPrivate || (isShield && f >= privateAt);
          const hl = isShield
            ? ip(f, [shieldAt - 8, shieldAt], [0, 1]) *
              (1 - ip(f, [privateAt + 10, privateAt + 20], [0, 0.6]))
            : 0;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: "#1a1820",
                border: `${hl > 0 ? 2 : 1}px solid ${hl > 0 ? `rgba(185,163,255,${0.3 + 0.7 * hl})` : "#2a2730"}`,
                boxShadow:
                  hl > 0 ? `0 0 ${30 * hl}px rgba(123,92,240,0.6)` : undefined,
                borderRadius: 10,
                padding: "12px 18px",
                opacity: appear,
                transform: `translateY(${(1 - appear) * 30}px)`,
              }}
            >
              <Img
                src={staticFile(r.nft.src)}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {r.nft.collection} {r.nft.name}
                </div>
                <div style={{ fontSize: 13, color: ui.gray400, marginTop: 3 }}>
                  {r.nft.collection}
                </div>
              </div>
              {shielding && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: colors.lavender,
                    fontSize: 15,
                    marginRight: 14,
                  }}
                >
                  <Spinner size={18} color={colors.lavender} /> {c.shielding}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: nowPrivate
                    ? "rgba(123,92,240,0.18)"
                    : "rgba(255,255,255,0.06)",
                  border: `1px solid ${nowPrivate ? "rgba(185,163,255,0.6)" : "#3a3540"}`,
                  color: nowPrivate ? colors.lavender : ui.gray400,
                }}
              >
                {nowPrivate ? <Lock size={13} /> : <Eye size={13} />}
                {nowPrivate ? c.privateBadge : c.publicBadge}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "7px 14px",
                  borderRadius: 8,
                  background: nowPrivate ? "transparent" : ui.primary,
                  border: nowPrivate ? "1px solid #3a3540" : "none",
                  color: nowPrivate ? ui.gray500 : "#fff",
                  minWidth: 110,
                  textAlign: "center",
                }}
              >
                {nowPrivate ? "Transfer" : c.shieldBtn}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────── VoucherCard ─────────────────────────
export const VoucherCard: React.FC<{ claimAt: number; width?: number }> = ({
  claimAt,
  width = 640,
}) => {
  const f = useCurrentFrame();
  const c = copy.S19;
  const claiming = f >= claimAt && f < claimAt + 14;
  const claimed = f >= claimAt + 14;
  return (
    <div
      style={{
        ...base,
        width,
        background: ui.card,
        border: `1px solid ${ui.cardBorder}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 250,
          background:
            "linear-gradient(135deg, #5865F2 0%, #7B5CF0 55%, #2EE6F0 120%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Img src={staticFile(LOGOS.ravenMarkWhite)} style={{ width: 140 }} />
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          RAVEN
          <br />
          LOUNGE
        </div>
      </div>
      <div style={{ padding: 22 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{c.voucherTitle}</div>
        <div style={{ fontSize: 14, color: ui.gray400, marginTop: 4 }}>
          {c.voucherCollection}
        </div>
        <div
          style={{
            marginTop: 18,
            border: `1px solid ${ui.gray700}`,
            borderRadius: 6,
            padding: 16,
            textAlign: "center",
          }}
        >
          {claimed ? (
            <>
              <div style={{ color: "#4ADE80", fontWeight: 500, fontSize: 16 }}>
                {c.voucherClaimed}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: colors.lavender,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Lock size={13} /> {c.voucherPrivate}
              </div>
            </>
          ) : (
            <Button glow={ip(f, [claimAt - 12, claimAt], [0, 1])}>
              {claiming ? (
                <>
                  <Spinner /> Claiming...
                </>
              ) : (
                c.claim
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
