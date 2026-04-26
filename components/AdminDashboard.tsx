import React, { useState, useEffect, useRef } from "react";
import {
  Resource,
  ResourceCategory,
  CATEGORY_JP,
  MirrorLink,
  Season,
  Episode,
} from "../types";
import {
  getResources,
  saveResource,
  deleteResource,
  updateResource,
} from "../data/resources";

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<"stats" | "add" | "manage">(
    "stats",
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);

  // Link Toggles
  const [showYoutube, setShowYoutube] = useState(false);
  const [showDrive, setShowDrive] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showDownload, setShowDownload] = useState(true);
  const [showDirectKey, setShowDirectKey] = useState(false);
  const [isUpcoming, setIsUpcoming] = useState(false);

  // Anime-Specific Modality
  const [isSeasonBased, setIsSeasonBased] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>([]);

  // Mirror Lists for standard resources
  const [driveLinks, setDriveLinks] = useState<MirrorLink[]>([
    { label: "GOOGLE DRIVE", url: "" },
  ]);
  const [keyLinks, setKeyLinks] = useState<MirrorLink[]>([
    { label: "ACCESS KEY", url: "" },
  ]);

  // Form State
  const [formData, setFormData] = useState<Partial<Resource>>({
    category: ResourceCategory.SOFTWARE,
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResources(getResources());
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setFormData({ category: ResourceCategory.SOFTWARE });
    setEditingId(null);
    setShowYoutube(false);
    setShowDrive(false);
    setShowKey(false);
    setShowDownload(true);
    setShowDirectKey(false);
    setIsUpcoming(false);
    setIsSeasonBased(false);
    setSeasons([]);
    setDriveLinks([{ label: "GOOGLE DRIVE", url: "" }]);
    setKeyLinks([{ label: "ACCESS KEY", url: "" }]);
    setFormError(null);
  };

  const startEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setFormData(resource);
    setShowYoutube(!!resource.youtubeId);
    setShowDownload(!!resource.downloadUrl);
    setShowDirectKey(!!resource.directKey);
    setIsUpcoming(!!resource.isUpcoming);
    setIsSeasonBased(!!resource.isSeasonBased);

    if (resource.isSeasonBased) {
      setSeasons(resource.seasons || []);
      setShowDrive(false);
      setShowKey(false);
    } else {
      setShowDrive(
        !!resource.driveUrl ||
          (!!resource.driveLinks && resource.driveLinks.length > 0),
      );
      setShowKey(
        !!resource.getKeyUrl ||
          (!!resource.keyLinks && resource.keyLinks.length > 0),
      );

      if (resource.driveLinks && resource.driveLinks.length > 0) {
        setDriveLinks(resource.driveLinks);
      } else if (resource.driveUrl) {
        setDriveLinks([{ label: "GOOGLE DRIVE", url: resource.driveUrl }]);
      }

      if (resource.keyLinks && resource.keyLinks.length > 0) {
        setKeyLinks(resource.keyLinks);
      } else if (resource.getKeyUrl) {
        setKeyLinks([{ label: "ACCESS KEY", url: resource.getKeyUrl }]);
      }
    }

    setActiveTab("add");
  };

  const addSeason = () => {
    setSeasons([
      ...seasons,
      {
        id: `s-${Date.now()}`,
        label: `SEASON ${seasons.length + 1}`,
        episodes: [],
      },
    ]);
  };

  const addEpisode = (seasonId: string) => {
    setSeasons(
      seasons.map((s) =>
        s.id === seasonId
          ? {
              ...s,
              episodes: [
                ...s.episodes,
                {
                  id: `e-${Date.now()}`,
                  number: `${s.episodes.length + 1}`,
                  driveLinks: [{ label: "DRIVE_1", url: "" }],
                  keyLinks: [{ label: "ACCESS_1", url: "" }],
                },
              ],
            }
          : s,
      ),
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("CRITICAL_ACTION: PERMANENTLY_ERASE_DATA?")) {
      const updated = deleteResource(id);
      setResources(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.description || !formData.thumbnail) {
      setFormError("CRITICAL: BASIC_METADATA_MISSING");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const dataToSave: Resource = {
        ...(formData as Resource),
        id: editingId || `res-${Date.now()}`,
        createdAt: formData.createdAt || Date.now(),
        isUpcoming: isUpcoming,
        isSeasonBased:
          formData.category === ResourceCategory.ANIME_CLIPS
            ? isSeasonBased
            : false,
      };

      if (!showYoutube) delete dataToSave.youtubeId;
      if (!showDownload) delete dataToSave.downloadUrl;
      if (!showDirectKey) delete dataToSave.directKey;

      if (dataToSave.isSeasonBased) {
        dataToSave.seasons = seasons;
        delete dataToSave.driveUrl;
        delete dataToSave.driveLinks;
        delete dataToSave.getKeyUrl;
        delete dataToSave.keyLinks;
      } else {
        const validDriveLinks = driveLinks.filter((l) => l.url.trim());
        const validKeyLinks = keyLinks.filter((l) => l.url.trim());

        if (showDrive && validDriveLinks.length > 0) {
          dataToSave.driveLinks = validDriveLinks;
          dataToSave.driveUrl = validDriveLinks[0].url;
        } else {
          delete dataToSave.driveUrl;
          delete dataToSave.driveLinks;
        }

        if (showKey && validKeyLinks.length > 0) {
          dataToSave.keyLinks = validKeyLinks;
          dataToSave.getKeyUrl = validKeyLinks[0].url;
        } else {
          delete dataToSave.getKeyUrl;
          delete dataToSave.keyLinks;
        }
      }

      let updated;
      if (editingId) {
        updated = updateResource(dataToSave);
      } else {
        updated = saveResource(dataToSave);
      }

      setResources(updated);
      setIsSubmitting(false);
      setActiveTab("manage");
      resetForm();
    }, 1000);
  };

  const generateDeploymentCode = () => {
    const resourcesJson = JSON.stringify(resources, null, 2);
    return `import { Resource, ResourceCategory } from '../types';

/**
 * PRODUCTION ARCHIVE DATA
 * Auto-generated by Resource Forensic Admin Panel
 */
const INITIAL_RESOURCES: Resource[] = ${resourcesJson} as any;

const STORAGE_KEY = 'resource_forensic_vault';
const VERSION_KEY = 'resource_forensic_version';

// Determine version based on newest item timestamp to force cache bypass for returning users
const CURRENT_VERSION = Math.max(...INITIAL_RESOURCES.map(r => r.createdAt || 0), 0);

export const getResources = (): Resource[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const storedVersion = localStorage.getItem(VERSION_KEY);

  // Auto-sync logic: If source code is newer than user's browser cache, overwrite
  if (!stored || !storedVersion || parseInt(storedVersion) < CURRENT_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    return INITIAL_RESOURCES;
  }
  
  return JSON.parse(stored);
};

export const saveResource = (resource: Resource) => {
  const resources = getResources();
  const updated = [resource, ...resources];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateResource = (updatedResource: Resource) => {
  const resources = getResources();
  const updated = resources.map(r => r.id === updatedResource.id ? updatedResource : r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteResource = (id: string) => {
  const resources = getResources();
  const updated = resources.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
`;
  };

  const copyDeploymentCode = () => {
    const code = generateDeploymentCode();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          alert(
            "CODE_COPIED: Replace the content of data/resources.ts with this code. Commit and Push to GitHub.",
          );
        })
        .catch(() => {
          fallbackCopyDeploymentCode(code);
        });
    } else {
      fallbackCopyDeploymentCode(code);
    }
  };

  const fallbackCopyDeploymentCode = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      alert(
        "CODE_COPIED: Replace the content of data/resources.ts with this code. Commit and Push to GitHub.",
      );
    } catch (err) {
      console.error("Fallback copy failed", err);
      alert("COPY_FAILED: Please manually select and copy the code below.");
    }
    document.body.removeChild(textArea);
  };

  const exportArchive = () => {
    const dataStr = JSON.stringify(resources, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute(
      "download",
      `forensic_archive_${new Date().toISOString().slice(0, 10)}.json`,
    );
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          localStorage.setItem(
            "resource_forensic_vault",
            JSON.stringify(imported),
          );
          setResources(imported);
          alert("RESTORE_PROTOCOL_COMPLETE");
        }
      } catch (err) {
        alert("RESTORE_FAILURE: CORRUPT_JSON");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="admin-dashboard-area"
      className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-mono selection:bg-white selection:text-black relative overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
              <h1 className="text-xl font-black tracking-[0.4em] uppercase">
                Control_Center
              </h1>
            </div>
            <p className="text-[9px] opacity-20 tracking-[0.2em] uppercase font-black">
              Archive_Management_Interface
            </p>
          </div>
          <div className="flex items-center gap-10 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => {
                setActiveTab("stats");
                resetForm();
              }}
              className={`text-[10px] tracking-[0.4em] uppercase font-black transition-all ${activeTab === "stats" ? "opacity-100" : "opacity-20 hover:opacity-50"}`}
            >
              Telemetry
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`text-[10px] tracking-[0.4em] uppercase font-black transition-all ${activeTab === "add" ? "opacity-100" : "opacity-20 hover:opacity-50"}`}
            >
              Ingestion
            </button>
            <button
              onClick={() => {
                setActiveTab("manage");
                resetForm();
              }}
              className={`text-[10px] tracking-[0.4em] uppercase font-black transition-all ${activeTab === "manage" ? "opacity-100" : "opacity-20 hover:opacity-50"}`}
            >
              Registry
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-2 hidden md:block" />
            <button
              onClick={onLogout}
              className="clickable group px-6 py-2 border border-red-600/10 hover:border-red-600/40 bg-red-600/5 transition-all rounded-sm flex items-center justify-center"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase font-black text-red-600">
                SIGN_OUT
              </span>
            </button>
          </div>
        </div>

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <div className="md:col-span-2 border border-white/5 bg-white/[0.01] p-10 h-80 relative overflow-hidden group">
              <span className="text-[8px] opacity-20 tracking-widest uppercase font-black">
                Archive_Volume_Distribution
              </span>
              <div className="flex items-end gap-6 h-48 mt-10">
                {Object.values(ResourceCategory).map((cat) => {
                  const count = resources.filter(
                    (r) => r.category === cat,
                  ).length;
                  return (
                    <div
                      key={cat}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-white/5 border-t border-x border-white/10 transition-all duration-1000"
                        style={{
                          height: `${(count / (resources.length || 1)) * 100}%`,
                        }}
                      />
                      <span className="text-[6px] opacity-20 mt-4 vertical-text uppercase tracking-widest">
                        {cat}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-6">
              <div className="border border-white/5 bg-white/[0.02] p-8">
                <span className="text-[8px] opacity-20 uppercase font-black">
                  TOTAL_ASSETS
                </span>
                <div className="text-6xl font-black mt-2 tracking-tighter">
                  {resources.length}
                </div>
              </div>
              <div className="border border-white/5 bg-white/[0.02] p-8">
                <span className="text-[8px] opacity-20 uppercase font-black">
                  SYSTEM_STATUS
                </span>
                <div className="text-2xl font-black mt-2 tracking-widest text-green-500">
                  NOMINAL
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.5em] opacity-30 font-black ml-1">
                  Asset_Name
                </label>
                <input
                  required
                  className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm focus:border-white/40 outline-none text-white font-black uppercase tracking-widest"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3" ref={categoryRef}>
                <label className="text-[9px] uppercase tracking-[0.5em] opacity-30 font-black ml-1">
                  Archive_Sector
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`w-full bg-white/[0.03] border border-white/10 p-5 text-sm text-left uppercase tracking-[0.2em] flex justify-between items-center transition-all ${isCategoryOpen ? "border-white/40" : ""}`}
                  >
                    <span className="font-black">{formData.category}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isCategoryOpen && (
                    <div className="absolute z-50 top-full left-0 w-full mt-2 bg-black border border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                      {Object.values(ResourceCategory).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: cat });
                            setIsCategoryOpen(false);
                          }}
                          className="w-full text-left p-5 text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors font-black"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formData.category === ResourceCategory.ANIME_CLIPS && (
              <div className="space-y-4 border border-white/10 p-6 bg-white/[0.02] animate-in slide-in-from-top-4 duration-500">
                <span className="text-[8px] uppercase tracking-[0.6em] opacity-20 font-black mb-4 block">
                  Modality_Selection
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSeasonBased(false)}
                    className={`py-4 border text-[9px] font-black uppercase tracking-widest transition-all ${!isSeasonBased ? "bg-white text-black" : "opacity-20 border-white/10"}`}
                  >
                    MOVIE_TYPE
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSeasonBased(true)}
                    className={`py-4 border text-[9px] font-black uppercase tracking-widest transition-all ${isSeasonBased ? "bg-white text-black" : "opacity-20 border-white/10"}`}
                  >
                    SEASON_TYPE
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.5em] opacity-30 font-black ml-1">
                Data_Background
              </label>
              <textarea
                required
                className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm h-32 outline-none text-white tracking-widest resize-none"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.5em] opacity-30 font-black ml-1">
                Thumbnail_Endpoint
              </label>
              <input
                required
                className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm outline-none text-white tracking-[0.1em]"
                value={formData.thumbnail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
              />
            </div>

            {/* Anime Hierarchy Builder */}
            {formData.category === ResourceCategory.ANIME_CLIPS &&
            isSeasonBased ? (
              <div className="pt-8 border-t border-white/5 space-y-12">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-[0.6em] opacity-20 font-black">
                    Sequential_Archive_Builder
                  </span>
                  <button
                    type="button"
                    onClick={addSeason}
                    className="text-[10px] font-black uppercase bg-white text-black px-10 py-4 hover:bg-zinc-200"
                  >
                    + ADD_SEASON
                  </button>
                </div>
                <div className="space-y-12">
                  {seasons.map((season, sIdx) => (
                    <div
                      key={season.id}
                      className="border border-white/10 bg-white/[0.02] p-8 space-y-8 animate-in fade-in duration-500"
                    >
                      <div className="flex justify-between border-b border-white/5 pb-4 items-center">
                        <input
                          className="bg-transparent border-none text-2xl font-black uppercase tracking-[0.2em] outline-none w-full"
                          value={season.label}
                          onChange={(e) => {
                            const updated = [...seasons];
                            updated[sIdx].label = e.target.value.toUpperCase();
                            setSeasons(updated);
                          }}
                          placeholder="SEASON_NAME"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSeasons(
                              seasons.filter((s) => s.id !== season.id),
                            )
                          }
                          className="clickable w-10 h-10 border border-red-600/20 bg-red-600/5 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-6">
                        {season.episodes.map((ep, eIdx) => (
                          <div
                            key={ep.id}
                            className="border border-dashed border-white/10 p-6 bg-black/40 space-y-6"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] opacity-20 font-black uppercase tracking-widest">
                                  SEGMENT:
                                </span>
                                <input
                                  className="bg-white/5 border border-white/10 p-2 text-xs w-20 text-center font-black"
                                  value={ep.number}
                                  onChange={(e) => {
                                    const updated = [...seasons];
                                    updated[sIdx].episodes[eIdx].number =
                                      e.target.value;
                                    setSeasons(updated);
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...seasons];
                                  updated[sIdx].episodes = updated[
                                    sIdx
                                  ].episodes.filter((epi) => epi.id !== ep.id);
                                  setSeasons(updated);
                                }}
                                className="clickable w-8 h-8 border border-red-600/20 bg-red-600/5 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <span className="text-[8px] opacity-30 uppercase font-black tracking-widest">
                                  DRIVE_NODES
                                </span>
                                {ep.driveLinks.map((dl, dlIdx) => (
                                  <div key={dlIdx} className="flex gap-2">
                                    <input
                                      className="bg-white/5 border border-white/10 p-3 text-[8px] w-24 font-black"
                                      placeholder="LABEL"
                                      value={dl.label}
                                      onChange={(e) => {
                                        const updated = [...seasons];
                                        updated[sIdx].episodes[eIdx].driveLinks[
                                          dlIdx
                                        ].label = e.target.value.toUpperCase();
                                        setSeasons(updated);
                                      }}
                                    />
                                    <input
                                      className="bg-white/5 border border-white/10 p-3 text-[8px] flex-1"
                                      placeholder="URL"
                                      value={dl.url}
                                      onChange={(e) => {
                                        const updated = [...seasons];
                                        updated[sIdx].episodes[eIdx].driveLinks[
                                          dlIdx
                                        ].url = e.target.value;
                                        setSeasons(updated);
                                      }}
                                    />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...seasons];
                                    updated[sIdx].episodes[
                                      eIdx
                                    ].driveLinks.push({
                                      label: `DRIVE_${ep.driveLinks.length + 1}`,
                                      url: "",
                                    });
                                    setSeasons(updated);
                                  }}
                                  className="text-[7px] font-black opacity-20 hover:opacity-100 uppercase tracking-widest"
                                >
                                  + ADD_DRIVE
                                </button>
                              </div>
                              <div className="space-y-3">
                                <span className="text-[8px] opacity-30 uppercase font-black tracking-widest">
                                  KEY_NODES
                                </span>
                                {ep.keyLinks.map((kl, klIdx) => (
                                  <div key={klIdx} className="flex gap-2">
                                    <input
                                      className="bg-white/5 border border-white/10 p-3 text-[8px] w-24 font-black"
                                      placeholder="LABEL"
                                      value={kl.label}
                                      onChange={(e) => {
                                        const updated = [...seasons];
                                        updated[sIdx].episodes[eIdx].keyLinks[
                                          klIdx
                                        ].label = e.target.value.toUpperCase();
                                        setSeasons(updated);
                                      }}
                                    />
                                    <input
                                      className="bg-white/5 border border-white/10 p-3 text-[8px] flex-1"
                                      placeholder="URL"
                                      value={kl.url}
                                      onChange={(e) => {
                                        const updated = [...seasons];
                                        updated[sIdx].episodes[eIdx].keyLinks[
                                          klIdx
                                        ].url = e.target.value;
                                        setSeasons(updated);
                                      }}
                                    />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...seasons];
                                    updated[sIdx].episodes[eIdx].keyLinks.push({
                                      label: `KEY_${ep.keyLinks.length + 1}`,
                                      url: "",
                                    });
                                    setSeasons(updated);
                                  }}
                                  className="text-[7px] font-black opacity-20 hover:opacity-100 uppercase tracking-widest"
                                >
                                  + ADD_KEY
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addEpisode(season.id)}
                          className="w-full border border-dashed border-white/10 py-5 text-[9px] font-black uppercase opacity-30 hover:opacity-100 hover:bg-white/[0.02] tracking-[0.4em]"
                        >
                          APPEND_SEGMENT_DATA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-8 border-t border-white/5 space-y-10">
                <div className="flex flex-col gap-4">
                  <span className="text-[9px] uppercase tracking-[0.6em] opacity-20 font-black">
                    Protocol_Gates
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {[
                      {
                        id: "dl",
                        label: "DOWNLOAD",
                        state: showDownload,
                        set: setShowDownload,
                      },
                      {
                        id: "yt",
                        label: "YOUTUBE",
                        state: showYoutube,
                        set: setShowYoutube,
                      },
                      {
                        id: "dr",
                        label: "DRIVE_SOURCE",
                        state: showDrive,
                        set: setShowDrive,
                      },
                      {
                        id: "ky",
                        label: "ACCESS_PROTOCOL",
                        state: showKey,
                        set: setShowKey,
                      },
                      {
                        id: "ck",
                        label: "CIPHER_VAULT",
                        state: showDirectKey,
                        set: setShowDirectKey,
                      },
                      {
                        id: "up",
                        label: "UPCOMING_STATUS",
                        state: isUpcoming,
                        set: setIsUpcoming,
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => t.set(!t.state)}
                        className={`py-4 border text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${t.state ? (t.id === "up" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-black") : "opacity-20 border-white/10 hover:opacity-60"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${t.state ? (t.id === "up" ? "bg-white" : "bg-black") + " animate-pulse" : "bg-white"}`}
                        />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  {showDownload && (
                    <input
                      className="w-full bg-white/[0.05] border border-white/20 p-5 text-sm outline-none text-white tracking-widest focus:border-white transition-all uppercase font-black"
                      placeholder="HTTPS://DIRECT_SOURCE"
                      value={formData.downloadUrl || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          downloadUrl: e.target.value,
                        })
                      }
                    />
                  )}
                  {showYoutube && (
                    <input
                      className="w-full bg-white/[0.05] border border-white/20 p-5 text-sm outline-none text-white tracking-widest focus:border-white transition-all uppercase font-black"
                      placeholder="YOUTUBE_IDENTIFIER"
                      value={formData.youtubeId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeId: e.target.value })
                      }
                    />
                  )}

                  {showDirectKey && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[9px] uppercase tracking-[0.5em] opacity-30 font-black ml-1">
                        Vault_Cipher_Key (Raw Key for One-Click Copy)
                      </label>
                      <input
                        className="w-full bg-blue-500/[0.05] border border-blue-500/20 p-5 text-sm outline-none text-white tracking-widest focus:border-blue-500/50 transition-all uppercase font-black"
                        placeholder="DECRYPT_KEY_EXAMPLE_123"
                        value={formData.directKey || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            directKey: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  {showDrive && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] opacity-30 font-black tracking-widest uppercase ml-1">
                          DRIVE_NODES
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setDriveLinks([
                              ...driveLinks,
                              {
                                label: `DRIVE_${driveLinks.length + 1}`,
                                url: "",
                              },
                            ])
                          }
                          className="text-[8px] text-blue-400 font-black tracking-widest uppercase hover:text-blue-300 transition-colors"
                        >
                          + ADD_ENDPOINT
                        </button>
                      </div>
                      {driveLinks.map((dl, idx) => (
                        <div
                          key={idx}
                          className="flex gap-2 animate-in slide-in-from-left-2 duration-300"
                        >
                          <input
                            className="w-32 md:w-40 bg-white/5 border border-white/10 p-4 text-[10px] font-black uppercase"
                            placeholder="LABEL"
                            value={dl.label}
                            onChange={(e) => {
                              const u = [...driveLinks];
                              u[idx].label = e.target.value.toUpperCase();
                              setDriveLinks(u);
                            }}
                          />
                          <input
                            className="flex-1 bg-white/5 border border-white/10 p-4 text-sm font-black"
                            placeholder="URL"
                            value={dl.url}
                            onChange={(e) => {
                              const u = [...driveLinks];
                              u[idx].url = e.target.value;
                              setDriveLinks(u);
                            }}
                          />
                          {driveLinks.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setDriveLinks(
                                  driveLinks.filter((_, i) => i !== idx),
                                )
                              }
                              className="clickable w-14 h-14 border border-red-600/20 bg-red-600/5 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                            >
                              <svg
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {showKey && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] opacity-30 font-black tracking-widest uppercase ml-1">
                          ACCESS_PROTOCOLS
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setKeyLinks([
                              ...keyLinks,
                              { label: `KEY_${keyLinks.length + 1}`, url: "" },
                            ])
                          }
                          className="text-[8px] text-blue-400 font-black tracking-widest uppercase hover:text-blue-300 transition-colors"
                        >
                          + ADD_PROTOCOL
                        </button>
                      </div>
                      {keyLinks.map((kl, idx) => (
                        <div
                          key={idx}
                          className="flex gap-2 animate-in slide-in-from-left-2 duration-300"
                        >
                          <input
                            className="w-32 md:w-40 bg-white/5 border border-white/10 p-4 text-[10px] font-black uppercase"
                            placeholder="LABEL"
                            value={kl.label}
                            onChange={(e) => {
                              const u = [...keyLinks];
                              u[idx].label = e.target.value.toUpperCase();
                              setKeyLinks(u);
                            }}
                          />
                          <input
                            className="flex-1 bg-white/5 border border-white/10 p-4 text-sm font-black"
                            placeholder="URL"
                            value={kl.url}
                            onChange={(e) => {
                              const u = [...keyLinks];
                              u[idx].url = e.target.value;
                              setKeyLinks(u);
                            }}
                          />
                          {keyLinks.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setKeyLinks(
                                  keyLinks.filter((_, i) => i !== idx),
                                )
                              }
                              className="clickable w-14 h-14 border border-red-600/20 bg-red-600/5 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                            >
                              <svg
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-8 md:py-10 bg-white text-black font-black uppercase tracking-[1.5em] transition-all hover:bg-zinc-200 active:scale-[0.99] text-sm"
            >
              {isSubmitting
                ? "INGESTING..."
                : editingId
                  ? "UPDATE_ARCHIVE"
                  : "COMMIT_TO_DATABASE"}
            </button>
          </form>
        )}

        {activeTab === "manage" && (
          <div className="space-y-16 pb-32 animate-in fade-in duration-700">
            {/* ARCHIVE_DATA_OPERATIONS */}
            <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 space-y-10">
              <div className="flex justify-between items-center opacity-30 text-[9px] font-black tracking-[0.5em] uppercase border-b border-white/5 pb-4">
                <span>ARCHIVE_DATA_OPERATIONS</span>
                <span>STABILITY: OPTIMAL</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
                    LOCAL_MAINTENANCE
                  </span>
                  <button
                    type="button"
                    onClick={exportArchive}
                    className="w-full py-5 border border-white/10 font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all"
                  >
                    EXPORT_ARCHIVE_JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-5 border border-white/10 font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all"
                  >
                    RESTORE_FROM_BACKUP
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleImport}
                  />
                </div>
                <div className="p-8 border border-white/10 bg-white/[0.03] flex flex-col gap-6 group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                      GITHUB_GLOBAL_SYNC
                    </span>
                  </div>
                  <p className="text-[10px] opacity-20 group-hover:opacity-40 transition-opacity uppercase leading-relaxed font-black">
                    Push local registry changes to the production repository for
                    global distribution.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeployModal(true)}
                    className="w-full mt-auto py-5 bg-blue-500/10 border border-blue-500/30 text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                  >
                    PREPARE_GLOBAL_DEPLOYMENT
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center opacity-20 text-[8px] font-black tracking-[0.5em] uppercase px-4 mb-4">
                <span>ARCHIVE_IDENTIFIER</span>
                <span>SEQUENTIAL_MAP</span>
              </div>
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="group border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-5 flex items-center justify-between transition-all rounded-sm"
                >
                  <div className="flex items-center gap-8">
                    <img
                      src={res.thumbnail}
                      className="w-24 h-14 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt=""
                    />
                    <div>
                      <h4 className="text-sm font-black tracking-widest uppercase mb-1">
                        {res.name}{" "}
                        {res.isUpcoming && (
                          <span className="text-[7px] text-blue-400 ml-2 tracking-widest">
                            [UPCOMING]
                          </span>
                        )}
                      </h4>
                      <span className="text-[8px] opacity-20 uppercase font-black tracking-[0.4em]">
                        {res.category}{" "}
                        {res.isSeasonBased ? "// SEQUENTIAL" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => startEdit(res)}
                      className="text-[9px] text-white/30 hover:text-white font-black tracking-widest p-4 transition-all"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(res.id)}
                      className="clickable w-12 h-12 border border-red-600/20 bg-red-600/5 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showDeployModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-8">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={() => setShowDeployModal(false)}
          />
          <div className="relative w-full max-w-5xl h-[80vh] bg-[#080808] border border-white/10 flex flex-col animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-widest text-blue-400">
                GITHUB_SYNC_GENERATOR
              </h3>
              <button
                type="button"
                onClick={() => setShowDeployModal(false)}
                className="p-2 opacity-30 hover:opacity-100"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-10">
              <pre className="h-full w-full bg-black/50 border border-white/5 p-8 font-mono text-xs text-white/40 overflow-y-auto no-scrollbar">
                {generateDeploymentCode()}
              </pre>
            </div>
            <div className="p-10 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
              <span className="text-[9px] opacity-20 font-black uppercase tracking-[0.3em]">
                REPLACE: data/resources.ts // PUSH TO MASTER
              </span>
              <button
                type="button"
                onClick={copyDeploymentCode}
                className="px-16 py-6 bg-white text-black font-black tracking-[1em] uppercase text-xs hover:bg-zinc-200 transition-all"
              >
                COPY_PROTOCOL_CODE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
