// src/providers/DataProvider.jsx
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { DataContext } from "../contexts/DataContext";
import { AuthContext } from "../contexts/AuthContext";
import { api, retryRequest } from "../utils/api";
import { asArrayOfObjects } from "../utils/safe";

const CACHE_TTL_MS = 5 * 60 * 1000;


export function DataProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const loggedIn = !!user;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [topics, setTopics] = useState([]);
  const [cheats, setCheats] = useState([]);
  const [userCheats, setUserCheats] = useState([]);

  const cacheKey = useMemo(
    () => (user?.id ? `bagger_cache_u${user.id}` : null),
    [user?.id],
  );

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
    const nextUserCheats = asArrayOfObjects(data?.user_cheats);

    setPlatforms(nextPlatforms);
    setTopics(nextTopics);
    setCheats(nextCheats);
    setUserCheats(nextUserCheats);

    return { nextPlatforms, nextTopics, nextCheats, nextUserCheats };
  }, []);

  const bootstrap = useCallback(async () => {
    if (!loggedIn) return;
    setError(null);

    const cached = readCache();

    if (cached) {
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
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loggedIn, readCache, applyBootstrap, writeCache]);

  const refresh = useCallback(async () => {
    if (!loggedIn) return;
    setRefreshing(true);

    try {
      const data = await retryRequest(() => api.get("/api/users/bootstrap"));
      applyBootstrap(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loggedIn, applyBootstrap]);

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

  const createTopic = useCallback(
    async (data) => {
      try {
        await retryRequest(() => api.post("/api/topics/", data));
        await refresh();
      } catch (err) {
        setError(err);
      }
    },
    [refresh],
  );

  const updateTopic = useCallback(async (topicId, updates) => {
    try {
      await retryRequest(() => api.patch(`/api/topics/${topicId}`, updates));
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
      );
    } catch (err) {
      setError(err);
    }
  }, []);

  const deleteTopic = useCallback(async (topicId) => {
    try {
      await retryRequest(() => api.delete(`/api/topics/${topicId}`));
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
    } catch (err) {
      setError(err);
    }
  }, []);

  const createPlatform = useCallback(
    async (data) => {
      try {
        await retryRequest(() => api.post("/api/platforms/", data));
        await refresh();
      } catch (err) {
        setError(err);
      }
    },
    [refresh],
  );

  const updatePlatform = useCallback(async (platformId, updates) => {
    try {
      await retryRequest(() =>
        api.patch(`/api/platforms/${platformId}`, updates),
      );
      setPlatforms((prev) =>
        prev.map((p) => (p.id === platformId ? { ...p, ...updates } : p)),
      );
    } catch (err) {
      setError(err);
    }
  }, []);

  const deletePlatform = useCallback(async (platformId) => {
    try {
      await retryRequest(() => api.delete(`/api/platforms/${platformId}`));
      setPlatforms((prev) => prev.filter((p) => p.id !== platformId));
    } catch (err) {
      setError(err);
    }
  }, []);

  const createCheat = useCallback(async (payload) => {
    try {
      const created = await retryRequest(() =>
        api.post("/api/cheats/", payload),
      );
      setCheats((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const updateCheat = useCallback(async (cheatId, patch) => {
    try {
      const updated = await retryRequest(() =>
        api.patch(`/api/cheats/${cheatId}`, patch),
      );
      setCheats((prev) => prev.map((c) => (c.id === cheatId ? updated : c)));
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const deleteCheat = useCallback(async (cheatId) => {
    try {
      await retryRequest(() => api.delete(`/api/cheats/${cheatId}`));
      setCheats((prev) => prev.filter((c) => c.id !== cheatId));
    } catch (err) {
      setError(err);
    }
  }, []);

  const value = useMemo(
    () => ({
      loading,
      refreshing,
      platforms,
      topics,
      cheats,
      userCheats,

      createTopic,
      updateTopic,
      deleteTopic,

      createPlatform,
      updatePlatform,
      deletePlatform,

      createCheat,
      updateCheat,
      deleteCheat,

      bootstrap,
      refresh,
      clearCache,
      error,
    }),
    [
      loading,
      refreshing,
      platforms,
      topics,
      cheats,
      userCheats,
      createTopic,
      updateTopic,
      deleteTopic,
      createPlatform,
      updatePlatform,
      deletePlatform,
      createCheat,
      updateCheat,
      deleteCheat,
      bootstrap,
      refresh,
      clearCache,
      error,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
