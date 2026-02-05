import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { DataContext } from "../contexts/DataContext";
import { AuthContext } from "../contexts/AuthContext";
import { api, retryRequest } from "../utils/api";
import { asArrayOfObjects } from "../utils/safe";

const CACHE_TTL_MS = 5 * 60 * 1000;

export function DataProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const loggedIn = !!user;

  // hard block only when we have nothing to show
  const [loading, setLoading] = useState(true);
  // background sync indicator (spin icon)
  const [refreshing, setRefreshing] = useState(false);

  const [platforms, setPlatforms] = useState([]);
  const [topics, setTopics] = useState([]);
  const [cheats, setCheats] = useState([]);
  const [userCheats, setUserCheats] = useState([]); // overlays (favorites/notes), optional

  const cacheKey = useMemo(() => {
    if (!user?.id) return null;
    return `bagger_cache_u${user.id}`;
  }, [user?.id]);

  const writeCache = useCallback(
    (nextPlatforms, nextTopics, nextCheats, nextUserCheats) => {
      if (!cacheKey) return;

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          platforms: asArrayOfObjects(nextPlatforms),
          topics: asArrayOfObjects(nextTopics),
          cheats: asArrayOfObjects(nextCheats),
          userCheats: asArrayOfObjects(nextUserCheats),
        }),
      );
      localStorage.setItem(`${cacheKey}_time`, String(Date.now()));
    },
    [cacheKey],
  );

  const readCache = useCallback(() => {
    if (!cacheKey) return null;

    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}_time`);
    if (!cachedData || !cacheTime) return null;

    const age = Date.now() - Number(cacheTime);
    if (Number.isNaN(age) || age > CACHE_TTL_MS) return null;

    try {
      const parsed = JSON.parse(cachedData);
      return {
        platforms: asArrayOfObjects(parsed?.platforms),
        topics: asArrayOfObjects(parsed?.topics),
        cheats: asArrayOfObjects(parsed?.cheats),
        userCheats: asArrayOfObjects(parsed?.userCheats),
      };
    } catch {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_time`);
      return null;
    }
  }, [cacheKey]);

  const clearCache = useCallback(() => {
    if (!cacheKey) return;
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`${cacheKey}_time`);
  }, [cacheKey]);

  const applyBootstrap = useCallback((data) => {
    const nextPlatforms = asArrayOfObjects(data?.platforms);
    const nextTopics = asArrayOfObjects(data?.topics);
    const nextCheats = asArrayOfObjects(data?.cheats);
    const nextUserCheats = asArrayOfObjects(data?.user_cheats); // backend uses user_cheats

    setPlatforms(nextPlatforms);
    setTopics(nextTopics);
    setCheats(nextCheats);
    setUserCheats(nextUserCheats);

    return { nextPlatforms, nextTopics, nextCheats, nextUserCheats };
  }, []);

  const bootstrap = useCallback(async () => {
    if (!loggedIn) return;

    const cached = readCache();

    if (cached) {
      // show cached immediately
      setPlatforms(cached.platforms);
      setTopics(cached.topics);
      setCheats(cached.cheats);
      setUserCheats(cached.userCheats);

      setLoading(false);
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await retryRequest(() => api.get("/api/users/bootstrap"));
      const { nextPlatforms, nextTopics, nextCheats, nextUserCheats } =
        applyBootstrap(data);

      writeCache(nextPlatforms, nextTopics, nextCheats, nextUserCheats);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loggedIn, readCache, applyBootstrap, writeCache]);

  // Force refresh: ignores TTL (use for “sync” button)
  const refresh = useCallback(async () => {
    if (!loggedIn) return;
    setRefreshing(true);

    try {
      const data = await api.get("/api/users/bootstrap"); // no retry needed on manual refresh
      const { nextPlatforms, nextTopics, nextCheats, nextUserCheats } =
        applyBootstrap(data);

      writeCache(nextPlatforms, nextTopics, nextCheats, nextUserCheats);
      localStorage.setItem(`${cacheKey}_time`, String(Date.now()));
    } finally {
      setRefreshing(false);
    }
  }, [loggedIn, applyBootstrap, writeCache, cacheKey]);

  useEffect(() => {
    if (authLoading) return;

    if (!loggedIn) {
      clearCache();
      setPlatforms([]);
      setTopics([]);
      setCheats([]);
      setUserCheats([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    bootstrap();
  }, [authLoading, loggedIn, bootstrap, clearCache]);

  const value = useMemo(
    () => ({
      loading,
      refreshing,
      platforms,
      topics,
      cheats,
      userCheats,
      bootstrap, // TTL-based
      refresh, // force
      clearCache,
    }),
    [
      loading,
      refreshing,
      platforms,
      topics,
      cheats,
      userCheats,
      bootstrap,
      refresh,
      clearCache,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
