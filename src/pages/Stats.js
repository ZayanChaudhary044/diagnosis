// src/pages/Stats.js
import React, { useState } from "react";
import "../news.css";

/** =========================
 *  COUNTRY HEALTH SEARCH 2025
 *  REAL DATA ONLY - NO MOCK/SAMPLE/DUMMY DATA
 *  ========================= */

/** Helper Functions */
const formatNumber = (num) => {
  if (typeof num !== "number" || isNaN(num)) return "N/A";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
};

const formatPercentage = (num) => {
  if (typeof num !== "number" || isNaN(num)) return "N/A";
  return num.toFixed(2) + "%";
};

const safeNum = (v, d = 0) => (typeof v === "number" && !isNaN(v) ? v : d);

/** Fetch ONLY real country health statistics (COVID-19) */
async function fetchRealCountryStats(countryName, timeoutMs, pushLog) {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new DOMException("timeout", "AbortError")),
    timeoutMs
  );

  try {
    pushLog({ note: `Fetching REAL data for ${countryName}...` });

    const covidUrl = `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(
      countryName
    )}`;

    const res = await fetch(covidUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "HealthStatsApp/2025",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(
        `Country "${countryName}" not found or HTTP ${res.status}: ${res.statusText}`
      );
    }

    const data = await res.json();

    pushLog({
      note: `✅ Successfully loaded REAL COVID-19 data for ${data.country || countryName
        }`,
    });
    pushLog({
      note: `➕ Adding World Bank (TB/HIV/Malaria), OWID (Measles), and CDC (US weekly) if available`,
    });

    return { data, isReal: true };
  } catch (e) {
    const errorMsg =
      e?.name === "AbortError"
        ? "Request timeout"
        : e?.name === "TypeError" && e?.message?.includes("fetch")
          ? "Network error"
          : `API Error: ${e?.message || e}`;

    pushLog({
      error: `${errorMsg}`,
      debug: `Failed to fetch REAL statistics for ${countryName}. Check country name spelling.`,
    });

    throw new Error(errorMsg);
  } finally {
    clearTimeout(timer);
  }
}

/** ================
 * CDC + World Bank + OWID fetchers (browser/CORS-friendly)
 * ================ */

/** CDC NNDSS (United States weekly provisional notifiable diseases) */
async function fetchCDCNotifiableUS(pushLog) {
  const APP_TOKEN = undefined; // Optional Socrata token
  const headers = { Accept: "application/json" };
  if (APP_TOKEN) headers["X-App-Token"] = APP_TOKEN;

  const CONDITIONS = ["Measles", "Mumps", "Pertussis"];
  const encodedList = CONDITIONS.map((c) => `'${c}'`).join(",");

  const url =
    "https://data.cdc.gov/resource/x9gk-5huc.json" +
    `?$select=mmwr_year,mmwr_week,condition,sum(number_of_cases)%20as%20cases` +
    `&$where=reporting_area='UNITED STATES' AND condition in(${encodedList})` +
    `&$group=mmwr_year,mmwr_week,condition` +
    `&$order=mmwr_year DESC, mmwr_week DESC&$limit=90`;

  try {
    pushLog({ note: "📥 Loading CDC NNDSS weekly notifiable diseases (US)..." });
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`CDC NNDSS error ${res.status}`);

    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const latest = new Map();
    for (const r of rows) if (!latest.has(r.condition)) latest.set(r.condition, r);

    const reports = [];
    for (const [cond, r] of latest.entries()) {
      const cases = Number(r.cases || r.number_of_cases || 0);
      const yr = r.mmwr_year ?? "—";
      const wk = r.mmwr_week ?? "—";
      reports.push({
        disease: cond,
        cases,
        period: `MMWR ${yr}-W${String(wk).padStart(2, "0")}`,
        rate: "—",
        trend: "Stable",
        source: "CDC NNDSS",
        reportType: "Weekly (Provisional)",
      });
    }

    pushLog({ note: `✅ CDC NNDSS loaded (${reports.length} rows)` });
    return reports;
  } catch (err) {
    pushLog({ error: "CDC NNDSS fetch failed", debug: String(err) });
    return [];
  }
}

/** Generic World Bank pull with trend (latest vs previous year) */
async function fetchWorldBankSeries(iso3, indicator, label, rateLabel, pushLog) {
  const url = `https://api.worldbank.org/v2/country/${encodeURIComponent(
    iso3
  )}/indicator/${indicator}?format=json&per_page=100`;
  try {
    pushLog({ note: `📥 Loading World Bank ${label} (${indicator})...` });
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`World Bank error ${res.status}`);
    const json = await res.json();
    const arr = Array.isArray(json?.[1]) ? json[1] : [];

    // Keep rows with numeric values, newest first
    const series = arr
      .filter((row) => typeof row?.value === "number" && row?.date)
      .map((row) => ({ year: Number(row.date), value: Number(row.value) }))
      .sort((a, b) => b.year - a.year);

    if (series.length === 0) return [];

    const [latest, prev] = series;
    let trend = "Stable";
    if (prev && typeof prev.value === "number") {
      if (latest.value > prev.value) trend = "Increasing";
      else if (latest.value < prev.value) trend = "Declining";
    }

    return [
      {
        disease: label,
        cases: latest.value,
        period: String(latest.year),
        rate: rateLabel,
        trend,
        source: `World Bank (WDI ${indicator})`,
        reportType: "Annual",
      },
    ];
  } catch (err) {
    pushLog({ error: `World Bank ${label} fetch failed`, debug: String(err) });
    return [];
  }
}

/** World Bank: Malaria incidence (try two known codes; return first that works) */
async function fetchWorldBankMalaria(iso3, pushLog) {
  // Primary: per 1,000 population at risk (newer metadata)
  const primary = await fetchWorldBankSeries(
    iso3,
    "SH.MLR.INCD.P3",
    "Malaria incidence",
    "per 1k at risk",
    pushLog
  );
  if (primary.length > 0) return primary;

  // Fallback older code (if present)
  return fetchWorldBankSeries(
    iso3,
    "SH.MLR.INCD",
    "Malaria incidence",
    "per 1k at risk",
    pushLog
  );
}

/** World Bank: TB incidence (per 100k) */
async function fetchWorldBankTB(iso3, pushLog) {
  return fetchWorldBankSeries(iso3, "SH.TBS.INCD", "TB incidence", "per 100k", pushLog);
}

/** World Bank: HIV incidence rate (per 1k uninfected, ages 15–49) */
async function fetchWorldBankHIV(iso3, pushLog) {
  return fetchWorldBankSeries(
    iso3,
    "SH.HIV.INCD.ZS",
    "HIV incidence (15–49)",
    "per 1k (15–49)",
    pushLog
  );
}

/** Tiny CSV parser for OWID Grapher CSV (simple, handles quoted commas) */
function parseCSV(text) {
  const rows = [];
  let i = 0,
    field = "",
    row = [],
    inQuotes = false;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else field += c;
    }
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** OWID: Reported measles cases (annual) by country name */
async function fetchOWIDMeaslesCases(countryName, pushLog) {
  const url = "https://ourworldindata.org/grapher/reported-cases-of-measles.csv";
  try {
    pushLog({ note: "📥 Loading OWID reported measles cases (annual)..." });
    const res = await fetch(url, { headers: { Accept: "text/csv" } });
    if (!res.ok) throw new Error(`OWID error ${res.status}`);
    const text = await res.text();
    const rows = parseCSV(text);
    if (rows.length < 2) return [];

    const header = rows[0];
    const idxEntity = header.indexOf("Entity");
    const idxYear = header.indexOf("Year");
    const idxValue = header.findIndex((h) =>
      /reported-?cases-?of-?measles/i.test(h)
    );

    if (idxEntity < 0 || idxYear < 0 || idxValue < 0) return [];

    const filtered = rows
      .slice(1)
      .filter((r) => r[idxEntity] === countryName && r[idxValue] !== "")
      .map((r) => ({ year: Number(r[idxYear]), value: Number(r[idxValue]) }))
      .filter((r) => !isNaN(r.year) && !isNaN(r.value))
      .sort((a, b) => b.year - a.year);

    if (filtered.length === 0) return [];

    const [latest, prev] = filtered;
    let trend = "Stable";
    if (prev && typeof prev.value === "number") {
      if (latest.value > prev.value) trend = "Increasing";
      else if (latest.value < prev.value) trend = "Declining";
    }

    return [
      {
        disease: "Measles (reported cases)",
        cases: latest.value,
        period: String(latest.year),
        rate: "—",
        trend,
        source: "OWID (WHO-reported)",
        reportType: "Annual",
      },
    ];
  } catch (err) {
    pushLog({ error: "OWID measles fetch failed", debug: String(err) });
    return [];
  }
}

/** Fetch notifiable disease reports: World Bank (TB/HIV/Malaria), OWID (Measles), CDC (US) */
async function fetchNotifiableReports(countryData, pushLog) {
  const iso2 = countryData?.countryInfo?.iso2 || "";
  const iso3 = countryData?.countryInfo?.iso3 || "";
  const countryName = countryData?.country || "";

  const [tb, hiv, malaria, measles, cdc] = await Promise.all([
    iso3 ? fetchWorldBankTB(iso3, pushLog) : Promise.resolve([]),
    iso3 ? fetchWorldBankHIV(iso3, pushLog) : Promise.resolve([]),
    iso3 ? fetchWorldBankMalaria(iso3, pushLog) : Promise.resolve([]),
    countryName ? fetchOWIDMeaslesCases(countryName, pushLog) : Promise.resolve([]),
    iso2 === "US" ? fetchCDCNotifiableUS(pushLog) : Promise.resolve([]),
  ]);

  return [...tb, ...hiv, ...malaria, ...measles, ...cdc].filter(Boolean);
}

/** Generate real health data from API response + notifiable disease reports */
const generateRealHealthData = (countryData, notifiableReports = []) => {
  const population = countryData.population || 1;

  const covidData = [
    {
      illness: "COVID-19 Total Cases",
      cases: safeNum(countryData.cases),
      percentage: (safeNum(countryData.cases) / population) * 100,
      dataSource: "disease.sh API - Real Data",
      type: "covid",
    },
    {
      illness: "COVID-19 Deaths",
      cases: safeNum(countryData.deaths),
      percentage: (safeNum(countryData.deaths) / population) * 100,
      dataSource: "disease.sh API - Real Data",
      type: "covid",
    },
    {
      illness: "COVID-19 Recovered",
      cases: safeNum(countryData.recovered),
      percentage: (safeNum(countryData.recovered) / population) * 100,
      dataSource: "disease.sh API - Real Data",
      type: "covid",
    },
    {
      illness: "COVID-19 Active Cases",
      cases: safeNum(countryData.active),
      percentage: (safeNum(countryData.active) / population) * 100,
      dataSource: "disease.sh API - Real Data",
      type: "covid",
    },
    {
      illness: "COVID-19 Critical Cases",
      cases: safeNum(countryData.critical),
      percentage: (safeNum(countryData.critical) / population) * 100,
      dataSource: "disease.sh API - Real Data",
      type: "covid",
    },
    {
      illness: "COVID-19 Tests Conducted",
      cases: safeNum(countryData.tests),
      percentage: (safeNum(countryData.tests) / population) * 100,
      dataSource: "disease.sh API - Real Data",
      type: "covid",
    },
  ];

  const notifiableData = notifiableReports.map((report) => {
    const isRate = typeof report.rate === "string" && /per\s/i.test(report.rate);
    return {
      illness: report.disease,
      cases: typeof report.cases === "number" ? report.cases : 0,
      // Only compute % for absolute case counts, not for rates like "per 100k" / "per 1k"
      percentage:
        typeof report.cases === "number" && !isRate
          ? (report.cases / population) * 100
          : 0,
      dataSource: `${report.source} - ${report.reportType}`,
      type: "notifiable",
      period: report.period,
      rate: report.rate,
      trend: report.trend || "Stable",
    };
  });

  return [...covidData, ...notifiableData];
};

/** =========================
 *   React Component
 *  ========================= */
export default function Stats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryStats, setCountryStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [debugOpen, setDebugOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const pushLog = (entry) =>
    setLogs((prev) => [...prev, { time: new Date().toISOString(), ...entry }]);

  /** Handle country search */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setLogs([]);
    setHasSearched(true);

    pushLog({ note: `🔍 Starting REAL data search for "${searchQuery}"` });
    pushLog({
      note:
        "⚠️  Using browser-safe sources: COVID-19 (disease.sh), World Bank (TB/HIV/Malaria), OWID (Measles), CDC NNDSS (US weekly)",
    });

    try {
      const { data, isReal } = await fetchRealCountryStats(
        searchQuery.trim(),
        8000,
        pushLog
      );

      const notifiableReports = await fetchNotifiableReports(data, pushLog);

      const realHealthStats = generateRealHealthData(
        data,
        notifiableReports || []
      );

      setCountryStats({
        countryData: data,
        healthStats: realHealthStats,
        notifiableReports: notifiableReports || [],
        isReal,
        lastUpdated: new Date().toISOString(),
      });

      setLoading(false);
      pushLog({
        note: `🎯 REAL data search completed for ${data.country || searchQuery
          }!`,
      });
    } catch (e) {
      pushLog({ note: "💥 REAL data search failed", error: e.message });
      setError(
        `Failed to find REAL health statistics for "${searchQuery}". COVID-19 is available; other sources may be limited or blocked.`
      );
      setLoading(false);
    }
  };

  /** Render ONLY real country statistics */
  const renderRealCountryStats = () => {
    if (!countryStats) return null;

    const { countryData, healthStats } = countryStats;
    const population = countryData.population || 0;
    const covidStats = healthStats.filter((stat) => stat.type === "covid");
    const notifiableStats = healthStats.filter(
      (stat) => stat.type === "notifiable"
    );

    return (
      <div>
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            backgroundColor: "#e8f5e8",
            borderRadius: "6px",
            border: "1px solid #4caf50",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              color: "#2e7d32",
              marginBottom: "0.25rem",
            }}
          >
            📊 {(countryData.country || searchQuery).toUpperCase()} - REAL
            HEALTH DATA
          </div>
          <div style={{ fontSize: "0.85rem", color: "#666" }}>
            Population: {formatNumber(population)} | Updated:{" "}
            {new Date(countryStats.lastUpdated).toLocaleString()}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#2e7d32",
              marginTop: "0.25rem",
              fontWeight: "bold",
            }}
          >
            ✅ COVID-19 (API) | 🧭 TB/HIV/Malaria (World Bank) | 🧪 Measles (OWID) | 🇺🇸 CDC weekly (US)
          </div>
        </div>

        {/* COVID-19 Data Table */}
        <div style={{ marginBottom: "2rem" }}>
          <h4 style={{ color: "#1976d2", marginBottom: "1rem" }}>
            🦠 COVID-19 Statistics (Real API Data)
          </h4>
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
                backgroundColor: "#fff",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    COVID-19 Metric
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Total Cases
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Population %
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Data Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {covidStats.map((stat, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    }}
                  >
                    <td
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {stat.illness}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "right",
                        color: "#1976d2",
                        fontWeight: "500",
                      }}
                    >
                      {formatNumber(stat.cases)}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "right",
                        color: "#f57c00",
                        fontWeight: "600",
                      }}
                    >
                      {formatPercentage(stat.percentage)}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "center",
                        fontSize: "0.8rem",
                      }}
                    >
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          backgroundColor: "#4caf50",
                          color: "white",
                        }}
                      >
                        REAL API DATA
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifiable / Priority Diseases */}
        {notifiableStats.length > 0 ? (
          <div>
            <h4 style={{ color: "#1976d2", marginBottom: "1rem" }}>
              📋 Notifiable / Priority Diseases (Annual / Weekly)
            </h4>
            <div
              style={{
                overflowX: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.9rem",
                  backgroundColor: "#fff",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "left",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Disease
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Cases / Value
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Rate
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Period
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Trend
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifiableStats.map((stat, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {stat.illness}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          textAlign: "right",
                          color: "#1976d2",
                          fontWeight: "500",
                        }}
                      >
                        {formatNumber(stat.cases)}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          textAlign: "right",
                          color: "#666",
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.rate || "—"}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          textAlign: "center",
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.period || "—"}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            backgroundColor:
                              stat.trend === "Increasing" ||
                                stat.trend === "Outbreak" ||
                                stat.trend === "Epidemic"
                                ? "#f44336"
                                : stat.trend === "Declining"
                                  ? "#4caf50"
                                  : stat.trend === "Stable"
                                    ? "#2196f3"
                                    : "#ff9800",
                            color: "white",
                          }}
                        >
                          {stat.trend || "Stable"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          textAlign: "center",
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        {(stat.dataSource || "").split(" - ")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "#fff3e0",
              borderRadius: "6px",
              border: "1px solid #ff9800",
            }}
          >
            <div
              style={{ fontSize: "0.85rem", color: "#e65100", fontWeight: "bold" }}
            >
              📋 No Notifiable Disease Reports Available
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
              World Bank (TB/HIV/Malaria), OWID (measles) and CDC (US) may not have
              entries for every year/country or can be temporarily unavailable.
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="Home">
      <header className="container">
        <h3>🔍 Country Health Statistics</h3>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#e8f5e8",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "1px solid #4caf50",
          }}
        >
          <div style={{ color: "#424242", fontSize: "0.9rem" }}>
            COVID-19 (disease.sh) + TB/HIV/Malaria (World Bank) + Measles (OWID) +
            CDC NNDSS (US only).
          </div>

        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter country name (e.g., USA, Germany, Brazil, India)"
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: loading ? "#ccc" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "🔄 Searching..." : "🔍 Search"}
            </button>
          </div>
        </form>

        {/* Popular Countries Quick Search */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "#333" }}>
            💡 Popular Countries (COVID-19 + Notifiable Disease Reports):
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {[
              "USA",
              "China",
              "India",
              "Brazil",
              "Germany",
              "France",
              "UK",
              "Japan",
              "Canada",
              "Australia",
            ].map((country) => (
              <button
                key={country}
                onClick={() => {
                  setSearchQuery(country);
                  setTimeout(() => {
                    handleSearch({ preventDefault: () => { } });
                  }, 100);
                }}
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#fff",
                  border: "1px solid #1976d2",
                  borderRadius: "20px",
                  color: "#1976d2",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#c62828",
              fontSize: "1.1rem",
              fontWeight: "bold",
              backgroundColor: "#ffebee",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #ef5350",
            }}
          >
            ❌ {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #2196f3",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "1rem",
              }}
            ></div>
            <p style={{ color: "#1976d2", fontWeight: "bold" }}>
              🔄 Searching for REAL {searchQuery} data...
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              (COVID-19 + World Bank TB/HIV/Malaria + OWID Measles + CDC US weekly)
            </p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {!loading && !error && countryStats && (
          <>
            <ul className="articles">
              <li>
                <div className="newsborder">
                  <h2 className="title">
                    📊 {countryStats.countryData.country || searchQuery} - REAL
                    Health Data
                  </h2>
                  <p
                    style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}
                  >
                    Real COVID-19 (disease.sh) + TB/HIV/Malaria (World Bank) + Measles
                    (OWID) + CDC NNDSS weekly (US only)
                  </p>
                  {renderRealCountryStats()}
                  <p className="source">— disease.sh • World Bank • OWID • CDC • 2025</p>
                </div>
              </li>
            </ul>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>

              <button
                className="bmi-button-primary"
                onClick={() => {
                  setSearchQuery("");
                  setCountryStats(null);
                  setError(null);
                  setHasSearched(false);
                  setLogs([]);
                }}
              >
                🔄 New Search
              </button>
            </div>
          </>
        )}

        {!hasSearched && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#666",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Search for any country to see REAL health statistics
            </div>
            <div style={{ fontSize: "0.9rem", color: "#2e7d32" }}>
              ✅ COVID-19 + TB/HIV/Malaria (World Bank) + Measles (OWID) + CDC (US)
            </div>
          </div>
        )}

        {debugOpen && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              border: "1px solid #e9ecef",
              borderRadius: 12,
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
              fontSize: 12,
              overflowX: "auto",
              maxHeight: 400,
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: 700, color: "#1976d2" }}>
              🔍 Debug Panel - REAL DATA Search Logs
            </div>
            {logs.length === 0 ? (
              <div style={{ color: "#666" }}>(no logs yet)</div>
            ) : (
              logs.map((l, idx) => (
                <div key={idx} style={{ marginBottom: 6 }}>
                  <div>
                    [{new Date(l.time).toLocaleTimeString()}] {l.note || ""}
                  </div>
                  {l.error && (
                    <div style={{ color: "#c62828" }}>❌ Error: {l.error}</div>
                  )}
                  {l.debug && (
                    <div style={{ color: "#ff9800", fontSize: 11 }}>
                      🔧 Debug: {l.debug}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </header>
    </div>
  );
}
