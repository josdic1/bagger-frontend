import { useData } from "../../hooks/useData";

export function VisualDashboard() {
  const { cheats, platforms, topics, userCheats, refreshing } = useData();

  // --- TACTICAL DATA CALCULATIONS ---
  const favoriteCount = userCheats.filter((uc) => uc.is_favorite).length;
  const totalItems = cheats.length + platforms.length + topics.length;
  const systemLoad = Math.min((cheats.length / 50) * 100, 100);

  // Peak Logic: Map every topic to a geometric mountain
  const peaks = topics.map((t, i) => {
    const count = cheats.filter((c) => c.topic_ids?.includes(t.id)).length;
    const h = (count / (cheats.length || 1)) * 150;
    return { x: i * 60, h, name: t.name };
  });

  // Radar Logic: Calculate 5-point node positions
  const radarPoints = [80, 60, 90, 45, 70]
    .map((val, i) => {
      const angle = (Math.PI * 2 * i) / 5;
      const r = (val / 100) * 45;
      return `${200 + r * Math.cos(angle)},${200 + r * Math.sin(angle)}`;
    })
    .join(" ");

  return (
    <div className="defcon-root">
      <style>{`
        .defcon-root { background: #020408; color: #00f2ff; padding: 20px; font-family: 'JetBrains Mono', monospace; min-height: 100vh; font-size: 12px; line-height: 1.2; }
        .defcon-layout { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: auto auto auto; gap: 15px; }
        
        /* BORDERS & GLOWS */
        .panel { background: rgba(0, 20, 40, 0.2); border: 1px solid #004466; padding: 15px; position: relative; box-shadow: inset 0 0 15px rgba(0, 242, 255, 0.05); }
        .panel::before { content: ""; position: absolute; top: -1px; left: -1px; width: 10px; height: 10px; border-top: 2px solid #00f2ff; border-left: 2px solid #00f2ff; }
        .title { color: #00f2ff; font-weight: bold; border-bottom: 1px solid #004466; margin-bottom: 10px; padding-bottom: 5px; letter-spacing: 2px; }
        
        /* GAUGES & DIALS */
        .gauge-svg { transform: rotate(-90deg); }
        .needle { transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: center; }
        
        /* TICKERS */
        .ticker-wrap { height: 100px; overflow: hidden; position: relative; }
        .ticker-move { animation: scroll-tick 20s linear infinite; }
        @keyframes scroll-tick { 0% { transform: translateY(0); } 100% { transform: translateY(-100%); } }

        /* SCANLINE ANIMATION */
        .scanline { position: fixed; top: 0; left: 0; width: 100%; height: 4px; background: rgba(0, 242, 255, 0.03); z-index: 999; pointer-events: none; animation: sweep 6s linear infinite; }
        @keyframes sweep { 0% { top: -5%; } 100% { top: 105%; } }
        
        .huge-num { font-size: 3.5rem; color: #00f2ff; text-shadow: 0 0 15px #00f2ff; }
        .warning { color: #ff0055; text-shadow: 0 0 10px #ff0055; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      <div className="scanline" />

      {/* HEADER: GLOBAL STATUS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          borderBottom: "2px solid #004466",
          paddingBottom: "10px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
            BAGGER // CRANKING_MEASUREMENT_CENTER
          </h1>
          <div style={{ color: "#004466" }}>
            LOCATION: {new Date().getTimezoneOffset()} // UNIT_ID: BRAVO_9
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={refreshing ? "warning" : ""}>
            STATUS: {refreshing ? "SYNCING_LIVE_DATA" : "LINK_ESTABLISHED"}
          </div>
          <div style={{ color: "#004466" }}>
            PKT_LOSS: 0.0021% // ENCRYPT: AES-512
          </div>
        </div>
      </div>

      <div className="defcon-layout">
        {/* ROW 1: PRIMARY MEASUREMENTS */}
        <div className="panel" style={{ gridColumn: "span 1" }}>
          <div className="title">CORE_VOLUME</div>
          <div className="huge-num">{cheats.length}</div>
          <div
            style={{ marginTop: "10px", height: "4px", background: "#002233" }}
          >
            <div
              style={{
                height: "100%",
                background: "#00f2ff",
                width: `${systemLoad}%`,
                boxShadow: "0 0 10px #00f2ff",
              }}
            />
          </div>
          <div style={{ fontSize: "9px", marginTop: "5px" }}>
            LOAD_CAPACITY: {systemLoad.toFixed(2)}%
          </div>
        </div>

        <div className="panel" style={{ gridColumn: "span 2" }}>
          <div className="title">OSCILLATING_DATA_STREAM</div>
          <svg viewBox="0 0 600 100" style={{ height: "80px", width: "100%" }}>
            <path
              d={`M0,50 Q50,${20 + (cheats.length % 50)} 100,50 T200,50 T300,50 T400,50 T500,50 T600,50`}
              fill="none"
              stroke="#00f2ff"
              strokeWidth="2"
              style={{ filter: "drop-shadow(0 0 5px #00f2ff)" }}
            />
            <path
              d="M0,70 Q50,90 100,70 T200,70 T300,70 T400,70 T500,70 T600,70"
              fill="none"
              stroke="#7000ff"
              strokeWidth="1"
              opacity="0.4"
            />
          </svg>
        </div>

        <div className="panel">
          <div className="title">SECTOR_FAVORITES</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <svg width="80" height="80" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#002233"
                strokeWidth="2"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#00ff88"
                strokeWidth="2"
                strokeDasharray={`${(favoriteCount / (cheats.length || 1)) * 113} 113`}
              />
            </svg>
            <div style={{ position: "absolute", fontSize: "1.5rem" }}>
              {favoriteCount}
            </div>
          </div>
        </div>

        {/* ROW 2: ADVANCED ANALYTICS */}
        <div className="panel" style={{ gridColumn: "span 2" }}>
          <div className="title">TOPIC_DENSITY_PEAKS</div>
          <svg viewBox="0 0 400 150" style={{ width: "100%" }}>
            {peaks.map((p, i) => (
              <polygon
                key={i}
                points={`${p.x},150 ${p.x + 30},${150 - p.h} ${p.x + 60},150`}
                fill={`rgba(0, 242, 255, ${0.1 + i * 0.05})`}
                stroke="#00f2ff"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        <div className="panel" style={{ gridColumn: "span 1" }}>
          <div className="title">RADAR_INTERCEPT</div>
          <svg viewBox="0 0 400 400" width="100%">
            <circle
              cx="200"
              cy="200"
              r="100"
              fill="none"
              stroke="#002233"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="200"
              r="50"
              fill="none"
              stroke="#002233"
              strokeWidth="1"
            />
            <polygon
              points={radarPoints}
              fill="rgba(0, 255, 136, 0.2)"
              stroke="#00ff88"
              strokeWidth="2"
            />
            <line
              x1="200"
              y1="200"
              x2="200"
              y2="100"
              stroke="#004466"
              strokeWidth="1"
              className="needle"
              style={{ transform: `rotate(${(Date.now() / 1000) % 360}deg)` }}
            />
          </svg>
        </div>

        <div className="panel">
          <div className="title">LIVE_TICKER_FEED</div>
          <div className="ticker-wrap">
            <div className="ticker-move">
              {cheats.slice(-10).map((c) => (
                <div
                  key={c.id}
                  style={{
                    borderBottom: "1px solid #002233",
                    padding: "5px 0",
                    fontSize: "8px",
                  }}
                >
                  [{new Date().toLocaleTimeString()}] INCOMING_DATA:{" "}
                  {c.title.toUpperCase()} // ID:{c.id}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: RESOURCE GANTT */}
        <div className="panel" style={{ gridColumn: "span 4" }}>
          <div className="title">RESOURCE_ALLOCATION_GANTT_MATRIX</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "15px",
            }}
          >
            {platforms.slice(0, 10).map((p) => {
              const count = cheats.filter((c) =>
                c.platform_ids?.includes(p.id),
              ).length;
              const perc = (count / (cheats.length || 1)) * 100;
              return (
                <div key={p.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "9px",
                    }}
                  >
                    <span>{p.name.toUpperCase()}</span>
                    <span>{perc.toFixed(1)}%</span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "#002233",
                      marginTop: "3px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: perc > 50 ? "#ff0055" : "#00f2ff",
                        width: `${perc}%`,
                        boxShadow: `0 0 5px ${perc > 50 ? "#ff0055" : "#00f2ff"}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px", color: "#004466", fontSize: "9px" }}>
        // DATA_CONVERGENCE_NODES: {totalItems} // BUFFER_STATE: CLEAN //
        SYSTEM_CLOCK: {new Date().toISOString()}
      </div>
    </div>
  );
}
