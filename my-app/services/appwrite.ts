import { Client, Databases, Account, ID, Query } from "react-native-appwrite";

// ✅ Get environment variables from Expo
const ENDPOINT = "https://nyc.cloud.appwrite.io/v1"; // Replace if region differs
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

/**
 * Initialize Appwrite client
 */
const client = new Client()
  .setEndpoint(ENDPOINT) // Appwrite Cloud region endpoint
  .setProject(PROJECT_ID) // Your Appwrite project ID
  .setPlatform("com.movieapp.expo"); // Replace with your Expo bundle/package name

/**
 * Initialize Appwrite services
 */
const account = new Account(client);
const databases = new Databases(client);

/**
 * Create or update a movie search record for trending tracking
 */
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingDoc = result.documents[0];
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, existingDoc.$id, {
        count: existingDoc.count + 1,
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        count: 1,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

/**
 * Fetch top trending movies based on search count
 */
export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

/**
 * Export Appwrite utilities
 */
export { client, account, databases, ID, Query };
