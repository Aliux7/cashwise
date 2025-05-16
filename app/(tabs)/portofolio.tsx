import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import addIcon from "@/assets/icons/add.png";
import { Link } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { deleteAsset, updateAssetLot } from "@/services/assets";
import LongPressAsset from "../components/LongPressAsset";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { usePortfolioStore } from "@/store/usePortofolioStore";
import investmentIcon from "@/assets/icons/invest.png";
import cryptoIcon from "@/assets/icons/crypto.png";
import stockIcon from "@/assets/icons/stock.png";

type Asset = {
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

const API_TOKEN = "d0e06o1r01qv1dmk7pcgd0e06o1r01qv1dmk7pd0";

const portofolio = () => {
  const user = useAuthStore((state) => state.user);
  const { assets, totalValue, cryptoValue, stockValue, loading, fetchAssets } =
    usePortfolioStore();
  const [lot, setLot] = useState("");

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLongPress = (asset: any) => {
    setSelectedAsset(asset);
    setIsModalVisible(true);
    setLot(String(asset.lot));
  };

  const formatNumberWithDots = (amount: number) => {
    return amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const handleUpdateLot = async () => {
    if (!selectedAsset || !lot) return;
    try {
      setIsModalVisible(false);
      await updateAssetLot(selectedAsset.id, Number(lot));
      await fetchAssets(user?.email || "");
      setSelectedAsset(null);
    } catch (err) {
      console.error("Failed to update lot:", err);
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;
    try {
      setIsModalVisible(false);
      await deleteAsset(selectedAsset.id);
      await fetchAssets(user?.email || "");
      setSelectedAsset(null);
    } catch (err) {
      console.error("Failed to delete asset:", err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAssets(user.email);
    }
  }, [user?.email]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0288D1" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-start items-start bg-white py-3 px-5">
      <View className="w-full h-20 rounded-md overflow-hidden border border-blue-200 mt-1 mb-5">
        <LinearGradient
          colors={["#DBEAFE", "#EFF6FF", "#EFF6FF"]}
          start={[0, 0]}
          end={[1, 1]}
          className="flex flex-row justify-between items-center w-full h-full px-4"
        >
          <View>
            <Text className="text-sm text-gray-500">
              Your Total Investment Assets
            </Text>
            <Text className="text-2xl text-blue-600 mt-0.5">
              $ {formatNumberWithDots(totalValue)}
            </Text>
          </View>
          <Image
            source={investmentIcon}
            style={{ tintColor: "#51A2FF" }}
            className="size-8 self-center"
          />
        </LinearGradient>
      </View>
      <View className="flex flex-row gap-4 mb-5">
        <View className="flex-1 h-20 rounded-md overflow-hidden border border-teal-200/70">
          <LinearGradient
            colors={["#ccfbf1", "#f0fdfa", "#f0fdfa"]}
            start={[0, 0]}
            end={[1, 1]}
            className="flex justify-center items-start w-full h-full px-4"
          >
            <View className="flex flex-row justify-between w-full items-center">
              <Text className="text-xs text-gray-500 ">Your Crypto Assets</Text>
              <Image
                source={cryptoIcon}
                style={{ tintColor: "#0d9488", width: 16, height: 16 }}
              />
            </View>
            <Text className="text-lg text-teal-600 mt-0.5 truncate w-full">
              $ {formatNumberWithDots(cryptoValue)}
            </Text>
          </LinearGradient>
        </View>
        <View className="flex-1 h-20 rounded-md overflow-hidden border border-purple-200">
          <LinearGradient
            colors={["#f3e8ff", "#faf5ff", "#faf5ff"]}
            start={[0, 0]}
            end={[1, 1]}
            className="flex justify-center items-start w-full h-full px-4"
          >
            <View className="flex flex-row justify-between w-full items-center">
              <Text className="text-xs text-gray-500">Your Stock Assets</Text> 
              <Image
                source={stockIcon}
                style={{ tintColor: "#9333ea", width: 16, height: 16 }}
              />
            </View>
            <Text
              numberOfLines={1}
              className="text-lg text-purple-600 mt-0.5 truncate w-full"
            >
              $ {formatNumberWithDots(stockValue)}
            </Text>
          </LinearGradient>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center mt-2 mb-2 w-full">
        <Text className="text-gray-800 text-xl">My Portofolio</Text>
        <Link href="/addAssets">
          <View className="flex flex-row justify-center items-center gap-1">
            <Image source={addIcon} tintColor="#51A2FF" className="size-4" />
            <Text className="text-blue-500">Add Assets</Text>
          </View>
        </Link>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        {assets.some((item) => item.category === "crypto") && (
          <>
            <Text className="text-lg text-gray-700 mx-1 mt-2">
              Crypto Assets
            </Text>
            {assets
              .filter((item) => item.category === "crypto")
              .sort(
                (a, b) =>
                  Number(b.lot) * Number(b.current_price) -
                  Number(a.lot) * Number(a.current_price)
              )
              .map((item, index) => (
                <LongPressAsset
                  key={item.id}
                  item={item}
                  index={index}
                  onLongPress={handleLongPress}
                />
              ))}
          </>
        )}

        {assets.some((item) => item.category === "stock") && (
          <>
            <Text className="text-lg text-gray-700 mx-1 mt-3">
              Stock Assets
            </Text>
            {assets
              .filter((item) => item.category === "stock")
              .sort(
                (a, b) =>
                  Number(b.lot) * Number(b.current_price) -
                  Number(a.lot) * Number(a.current_price)
              )
              .map((item, index) => (
                <LongPressAsset
                  key={item.id}
                  item={item}
                  index={index}
                  onLongPress={handleLongPress}
                />
              ))}
          </>
        )}
      </ScrollView>
      {selectedAsset && (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
          onBackButtonPress={() => setIsModalVisible(false)}
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
                      className="size-10 rounded-full"
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
                    $
                    {formatNumberWithDots(Number(selectedAsset?.current_price))}
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
                  onPress={handleUpdateLot}
                  className="bg-blue-500 py-2 px-4 rounded-xl w-full my-2 items-center"
                >
                  <Text className="text-white text-lg font-semibold">
                    Save Asset
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteAsset}
                  className="py-2 px-4 rounded-xl items-center"
                >
                  <Text className="text-red-500 text-lg font-semibold">
                    Delete Asset
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
};

export default portofolio;
