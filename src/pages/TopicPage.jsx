
import { useData } from "../hooks/useData";
import { NoResults } from "./NoResults";

export function TopicPage() {
  const { topics, loading, error } = useData();

  // 1. Hard Loading: No cache and fetching
  if (loading && topics.length === 0) {
    return <p>Loading...</p>;
  }

  // 2. Error: Fetch failed and no cache to fall back on
  if (error && topics.length === 0) {
    return <p>Error loading data. Please try again.</p>;
  }

  // 3. Empty: Fetch finished (or cache empty) and no results
  if (topics.length === 0) {
    return <NoResults />;
  }

  // 4. Data: Either fresh from API or from Cache
  return <>{topics.length} topics found</>;
}
