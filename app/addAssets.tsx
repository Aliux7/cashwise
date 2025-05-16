import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import backIcon from "@/assets/icons/back.png";
import { LinearGradient } from "expo-linear-gradient";
import addIcon from "@/assets/icons/add.png";
import checkIcon from "@/assets/icons/check.png";
import Modal from "react-native-modal";
import { addAsset, getAssetsByEmail } from "@/services/assets";
import { useAuthStore } from "@/store/useAuthStore";

type Asset = {
  id: string;
  symbol: string;
  name: string;
  current_price: string;
  image: string;
  category: string;
};

const API_TOKEN = "d0e06o1r01qv1dmk7pcgd0e06o1r01qv1dmk7pd0";
const SYMBOLS = [
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "AAPL", name: "Apple" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "GOOG", name: "Google" },
  { symbol: "META", name: "Meta" },
  { symbol: "AVGO", name: "Broadcom" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "WMT", name: "Walmart" },
  { symbol: "JPM", name: "JPMorgan Chase" },
  { symbol: "V", name: "Visa" },
  { symbol: "MA", name: "Mastercard" },
  { symbol: "NFLX", name: "Netflix" },
  { symbol: "XOM", name: "ExxonMobil" },
];
const COINS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "usd-coin",
  "ripple",
  "staked-ether",
  "dogecoin",
  "cardano",
  "avalanche-2",
  "shiba-inu",
  "wrapped-bitcoin",
  "tron",
  "polkadot",
  "chainlink",
  "matic-network",
  "uniswap",
  "internet-computer",
  "litecoin",
  "bitcoin-cash",
  "dai",
  "aptos",
  "immutable-x",
  "filecoin",
  "leo-token",
  "near",
  "ethereum-classic",
  "arbitrum",
  "render-token",
  "stacks",
  "optimism",
  "mantle",
  "kaspa",
  "vechain",
  "monero",
  "injective-protocol",
  "maker",
  "celestia",
  "the-graph",
  "algorand",
  "quant-network",
  "fantom",
  "theta-token",
  "aevo",
  "seele",
  "okb",
  "sui",
  "bitget-token",
  "flow",
  "bitcoin-sv",
  "coredaoorg",
  "first-digital-usd",
  "gala",
  "ondo-finance",
  "bittensor",
  "bittorrent",
  "tokenize-xchange",
  "xdce-crowd-sale",
  "elrond-erd-2",
  "conflux-token",
  "thorchain",
  "kucoin-shares",
  "terra-luna",
  "iota",
  "aave",
  "osmosis",
  "ecash",
  "synthetix-network-token",
  "axie-infinity",
  "tezos",
  "mina-protocol",
  "hyperliquid",
  "rocket-pool",
  "ethena",
  "paxos-standard",
  "neo",
  "woo-network",
  "chiliz",
  "singularitynet",
  "gmx",
  "gatechain-token",
  "ocean-protocol",
  "jito",
  "helium",
  "frax",
  "blur",
  "trust-wallet-token",
  "kava",
  "worldcoin-wld",
  "zilliqa",
  "enjincoin",
  "lido-dao",
  "nexo",
  "pancakeswap-token",
  "livepeer",
  "ordinals",
  "akash-network",
  "curve-dao-token",
  "celo",
  "0x",
  "floki",
  "echelon-prime",
  "hive",
];

const addAssets = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [lot, setLot] = useState("");
  const [data, setData] = useState<Asset[]>([]);
  const [allData, setAllData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mappedStocks = await Promise.all(
          SYMBOLS.map((s) => fetchQuote(s.symbol))
        );

        const responses = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(
            ","
          )}`
        ).then((res) => res.json());

        const validCoins = responses
          .filter(
            (coin: any) => coin && coin.name && coin.current_price && coin.image
          )
          .map((coin: any) => ({
            id: coin.id,
            image: coin.image,
            symbol: coin.symbol,
            name: coin.name,
            current_price: coin.current_price,
            category: "crypto",
          }));

        const combinedAssets = [...mappedStocks, ...validCoins];

        setAllData(combinedAssets);
        setData(combinedAssets);

        const userAssets = await getAssetsByEmail(user?.email || "");
        const ownedAssetIds = userAssets.map((a) => a.assetId);
        setPortfolio(ownedAssetIds);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  useEffect(() => {
    if (search.trim() === "") {
      setData(allData);
    } else {
      const filtered = allData.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
      setData(filtered);
    }
  }, [search, allData]);

  const handleBack = () => {
    router.push("/portofolio");
  };

  const handleAddAsset = async () => {
    try {
      const newAsset = {
        assetId: selectedAsset?.id || "",
        name: selectedAsset?.name || "",
        lot: Number(lot),
        email: user?.email || "",
        category: selectedAsset?.category || "",
      };
      const docId = await addAsset(newAsset);
      console.log("Asset added with ID:", docId);
      router.replace("/portofolio");
    } catch (error) {
      console.error("Failed to add asset:", error);
    }
  };

  const fetchQuote = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_TOKEN}`
      );
      const data = await response.json();

      const match = SYMBOLS.find((item) => item.symbol === symbol);

      return {
        id: symbol,
        symbol: symbol.toLowerCase(),
        name: match?.name || symbol,
        current_price: data.c,
        image: `https://logo.clearbit.com/${
          match?.name.includes(" ")
            ? symbol.toLowerCase()
            : match?.name.toLowerCase()
        }.com`,
        category: "stock",
      };
    } catch (error) {
      console.error("Fetch error:", error);
      return {
        id: symbol,
        symbol: symbol.toLowerCase(),
        name: symbol,
        current_price: 0,
        image: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`,
        category: "stock",
      };
    }
  };

  const openModal = (coin: Asset) => {
    setSelectedAsset(coin);
    setModalVisible(true);
  };

  function formatNumberWithDots(amount: number) {
    if (typeof amount !== "number") {
      amount = Number(amount);
    }
    return amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-start items-start bg-white py-3 px-5">
      <View className="flex flex-row justify-between items-center mb-4 w-full">
        <TouchableOpacity
          onPress={handleBack}
          className="p-2 rounded-full flex flex-row justify-center items-center gap-1"
        >
          <Image
            source={backIcon}
            style={{ tintColor: "#6b7280" }}
            className="size-4"
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search Assets..."
          value={search}
          onChangeText={setSearch}
          className="flex-1 px-4 py-2"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-semibold text-gray-800 my-1">
          US Stocks
        </Text>
        {data
          .filter((item) => item?.category === "stock")
          .map((item, index) => (
            <View
              key={index}
              className="flex flex-row items-center justify-between border-b border-gray-300 w-full py-4"
              style={{
                paddingHorizontal: 4,
              }}
            >
              <View className="flex flex-row items-center justify-center gap-3">
                <Image
                  source={{ uri: item?.image }}
                  className="size-10 rounded-full border border-gray-300"
                />
                <View>
                  <Text className="text-gray-800 text-base font-semibold">
                    {item?.symbol?.toUpperCase()}
                  </Text>
                  <Text className="text-gray-500 text-sm capitalize">
                    {item.name}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                {!portfolio.includes(item.id) ? (
                  <TouchableOpacity onPress={() => openModal(item)}>
                    <View className="size-10 rounded-full justify-center items-center overflow-hidden">
                      <Image
                        source={addIcon}
                        tintColor="#6b7280"
                        className="size-6"
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View className="size-10 rounded-full justify-center items-center overflow-hidden">
                    <Image
                      source={checkIcon}
                      tintColor="#6b7280"
                      className="size-6"
                    />
                  </View>
                )}
              </View>
            </View>
          ))}

        <Text className="text-lg font-semibold text-gray-800 my-1 mt-4">
          Crypto
        </Text>
        {data
          .filter((item) => item.category === "crypto")
          .map((item, index) => (
            <View
              key={index}
              className="flex flex-row items-center justify-between border-b border-gray-300 w-full py-4"
              style={{
                paddingHorizontal: 4,
              }}
            >
              <View className="flex flex-row items-center justify-center gap-3">
                <Image
                  source={{ uri: item?.image }}
                  className="size-10 rounded-full border border-gray-300"
                />
                <View>
                  <Text className="text-gray-800 text-base font-semibold">
                    {item?.symbol?.toUpperCase()}
                  </Text>
                  <Text className="text-gray-500 text-sm capitalize">
                    {item.name}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                {!portfolio.includes(item.id) ? (
                  <TouchableOpacity onPress={() => openModal(item)}>
                    <View className="size-10 rounded-full justify-center items-center overflow-hidden">
                      <Image
                        source={addIcon}
                        tintColor="#6b7280"
                        className="size-6"
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View className="size-10 rounded-full justify-center items-center overflow-hidden">
                    <Image
                      source={checkIcon}
                      tintColor="#6b7280"
                      className="size-6"
                    />
                  </View>
                )}
              </View>
            </View>
          ))}
      </ScrollView>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="flex flex-col justify-between items-center w-full rounded-t-2xl p-6 bg-white">
          {selectedAsset && (
            <>
              <View className="flex flex-row justify-between items-center mb-4 w-full">
                <View className="flex flex-row gap-2 justify-center items-center">
                  <Image
                    source={{ uri: selectedAsset.image }}
                    className="size-10 rounded-full mb-2"
                  />
                  <View className="flex flex-col justify-center items-start">
                    <Text className="text-xl font-semibold text-gray-800 uppercase">
                      {selectedAsset.symbol}
                    </Text>
                    <Text className="text-gray-500 text-sm capitalize">
                      {selectedAsset.name}
                    </Text>
                  </View>
                </View>
                <Text className="text-lg text-green-600 mt-2 font-semibold">
                  ${formatNumberWithDots(Number(selectedAsset?.current_price))}
                </Text>
              </View>
              <TextInput
                placeholder="Lot"
                keyboardType="decimal-pad"
                value={lot}
                onChangeText={(text) => {
                  if (/^\d*\.?\d*$/.test(text)) setLot(text);
                }}
                className="border border-gray-300 rounded-xl p-3 mb-4 text-lg w-full"
              />
              <TouchableOpacity
                onPress={handleAddAsset}
                className="bg-blue-500 py-2 px-4 rounded-xl w-full my-2 items-center"
              >
                <Text className="text-white text-lg font-semibold">
                  + Add Asset
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default addAssets;
