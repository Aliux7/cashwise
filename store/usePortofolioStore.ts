import { create } from "zustand";
import { getAssetsByEmail } from "@/services/assets";

const API_TOKEN = "d0e06o1r01qv1dmk7pcgd0e06o1r01qv1dmk7pd0";

export type Asset = {
  id: string;
  assetId: string;
  email: string;
  lot: number;
  category: string;
  symbol: string;
  name: string;
  current_price: string;
  image: string;
};

type PortfolioStore = {
  assets: Asset[];
  totalValue: number;
  cryptoValue: number;
  stockValue: number;
  loading: boolean;
  fetchAssets: (email: string) => Promise<void>;
};

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  assets: [],
  totalValue: 0,
  cryptoValue: 0,
  stockValue: 0,
  loading: false,

  fetchAssets: async (email: string) => {
    set({ loading: true });
    try {
      const firestoreAssets = await getAssetsByEmail(email);

      const cryptoAssets = firestoreAssets.filter(
        (a) => a.category === "crypto"
      );
      const stockAssets = firestoreAssets.filter((a) => a.category === "stock");

      const cryptoIds = cryptoAssets.map((a) => a.assetId).join(",");
      let coinRes: any[] = [];
      if (cryptoIds) {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          coinRes = data;
        } else {
          console.error("Unexpected response from CoinGecko:", data);
        }
      }

      const stockQuotes = await Promise.all(
        stockAssets.map(async (asset) => {
          try {
            const res = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${asset.assetId}&token=${API_TOKEN}`
            );
            const data = await res.json();
            return {
              ...asset,
              current_price: data.c,
            };
          } catch {
            return asset;
          }
        })
      );

      const updatedAssets = firestoreAssets.map((asset) => {
        if (asset.category === "crypto") {
          const coin = coinRes.find((c) => c.id === asset.assetId);
          return coin
            ? {
                ...asset,
                symbol: coin.symbol,
                name: coin.name,
                current_price: coin.current_price,
                image: coin.image,
              }
            : asset;
        } else {
          const stock = stockQuotes.find((s) => s.assetId === asset.assetId);
          return {
            ...asset,
            ...stock,
            image: `https://logo.clearbit.com/${
              stock.name?.includes(" ")
                ? stock.assetId.toLowerCase()
                : stock.name?.toLowerCase()
            }.com`,
            symbol: asset.assetId,
          };
        }
      });

      const total = updatedAssets.reduce(
        (sum, a) => sum + Number(a.lot) * Number(a.current_price),
        0
      );
      const cryptoTotal = updatedAssets
        .filter((a) => a.category === "crypto")
        .reduce((sum, a) => sum + Number(a.lot) * Number(a.current_price), 0);
      const stockTotal = updatedAssets
        .filter((a) => a.category === "stock")
        .reduce((sum, a) => sum + Number(a.lot) * Number(a.current_price), 0);

      set({
        assets: updatedAssets,
        totalValue: total,
        cryptoValue: cryptoTotal,
        stockValue: stockTotal,
      });
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
