import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { images } from "@/constants/images";

interface TrendingCardProps {
  movie: {
    movie_id: string | number;
    title: string;
    poster_url: string;
  };
  index: number;
}

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  return (
    <Link
      href={{
        pathname: "/movies/[id]", // ✅ must match /app/movies/[id].tsx
        params: { id: movie_id.toString() }, // must pass as string
      }}
      asChild
    >
      <TouchableOpacity className="w-32 relative pl-5">
        {/* Poster */}
        <Image
          source={{ uri: poster_url }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        {/* Gradient Rank Badge */}
        <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">
                {index + 1}
              </Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        {/* Title */}
        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
