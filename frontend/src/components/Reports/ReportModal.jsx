import React, { useState } from 'react';
import { X, Upload, MapPin, Sparkles, CheckCircle2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../../services/api';

export default function ReportModal({ 
  isOpen, 
  onClose, 
  onSubmitReport,
  onStartMapPick,
  selectedLocation
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('INFRASTRUCTURE');
  const [issueType, setIssueType] = useState('Waterlogging');
  const [areaName, setAreaName] = useState('Koramangala 5th Block');
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  if (!isOpen) return null;

  // Category -> Issue Types Mapping
  const issueTypesByCategory = {
    INFRASTRUCTURE: ['Waterlogging', 'Pothole', 'Road crack', 'Road excavation', 'Broken footpath'],
    'PUBLIC SAFETY': ['Open manhole', 'Accident', 'Fire', 'Dangerous obstruction'],
    UTILITIES: ['Broken streetlight', 'Water leakage', 'Power issue', 'Sewage overflow']
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    setIssueType(issueTypesByCategory[cat][0]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Simulated AI Evidence Analysis
    setIsAnalyzingImage(true);
    setAiAnalysis(null);

    const result = await apiService.analyzeImageEvidence(file);
    setIsAnalyzingImage(false);
    setAiAnalysis(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in the title and description.");
      return;
    }

    const lat = selectedLocation ? selectedLocation.lat : 12.9352 + (Math.random() - 0.5) * 0.05;
    const lng = selectedLocation ? selectedLocation.lng : 77.6245 + (Math.random() - 0.5) * 0.05;

    // Build incident severity from AI weight if available
    const baseSeverity = aiAnalysis ? Math.min(95, 40 + (aiAnalysis.evidenceWeight || 25)) : 65;

    const newReportData = {
      title: title.toUpperCase(),
      description,
      category,
      issueType,
      areaName,
      latitude: lat,
      longitude: lng,
      severity: baseSeverity,
      status: 'PENDING',
      reportCount: 1,
      hasImage: !!imagePreview,
      imageUrl: imagePreview || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      evidenceConfidence: aiAnalysis ? aiAnalysis.confidence : 88,
      severityFactors: {
        mlEvidence: aiAnalysis ? aiAnalysis.evidenceWeight : 25,
        citizenReports: 15,
        locationConcentration: 12,
        rapidGrowth: 8,
        publicImpact: 10
      }
    };

    onSubmitReport(newReportData);
    onClose();

    // Reset Form
    setTitle('');
    setDescription('');
    setImagePreview(null);
    setAiAnalysis(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="neo-box w-full max-w-2xl bg-[#F8F1E5] my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#B7FF2A] border-b-4 border-[#050505] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#050505]" />
            <h2 className="font-display font-black text-xl text-[#050505] uppercase tracking-wide">
              SUBMIT NEW CIVIC REPORT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#FF4F87] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-bold flex items-center justify-center cursor-pointer hover:bg-[#ff3574]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 overflow-y-auto space-y-4">
          {/* Title */}
          <div>
            <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
              REPORT TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. WATERLOGGING ON 5TH AVE JUNCTION"
              className="w-full bg-white border-3 border-[#050505] p-2.5 shadow-[3px_3px_0_#050505] font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
            />
          </div>

          {/* Category & Issue Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                CATEGORY *
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-white border-3 border-[#050505] p-2.5 shadow-[3px_3px_0_#050505] font-mono font-bold text-sm text-[#050505] focus:outline-none"
              >
                <option value="INFRASTRUCTURE">Infrastructure</option>
                <option value="PUBLIC SAFETY">Public Safety</option>
                <option value="UTILITIES">Utilities</option>
              </select>
            </div>

            <div>
              <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                ISSUE TYPE *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-white border-3 border-[#050505] p-2.5 shadow-[3px_3px_0_#050505] font-mono font-bold text-sm text-[#050505] focus:outline-none"
              >
                {issueTypesByCategory[category].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
              DESCRIPTION *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, location details, traffic impact, or hazard level..."
              className="w-full bg-white border-3 border-[#050505] p-2.5 shadow-[3px_3px_0_#050505] font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
            />
          </div>

          {/* Location Picker Section */}
          <div className="p-3.5 bg-white border-3 border-[#050505] shadow-[3px_3px_0_#050505] space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono font-black text-xs uppercase text-[#050505] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF4F87]" />
                INCIDENT LOCATION
              </label>
              {selectedLocation && (
                <span className="font-mono text-[11px] font-bold bg-[#B7FF2A] border border-[#050505] px-2 py-0.5">
                  LAT: {selectedLocation.lat}, LNG: {selectedLocation.lng}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAreaName('Koramangala 5th Block')}
                className="px-3 py-1.5 bg-[#F8F1E5] border-2 border-[#050505] font-mono font-bold text-xs hover:bg-[#FFD83D] cursor-pointer"
              >
                📍 Koramangala
              </button>
              <button
                type="button"
                onClick={() => setAreaName('Indiranagar 100ft Road')}
                className="px-3 py-1.5 bg-[#F8F1E5] border-2 border-[#050505] font-mono font-bold text-xs hover:bg-[#FFD83D] cursor-pointer"
              >
                📍 Indiranagar
              </button>
              <button
                type="button"
                onClick={() => {
                  onStartMapPick();
                  onClose();
                }}
                className="px-3 py-1.5 bg-[#4C5CFF] text-white border-2 border-[#050505] font-mono font-bold text-xs hover:bg-[#3949e6] cursor-pointer ml-auto flex items-center gap-1"
              >
                🗺️ SELECT ON MAP
              </button>
            </div>
          </div>

          {/* Image Evidence & AI Section */}
          <div className="space-y-3">
            <label className="block font-mono font-black text-xs uppercase text-[#050505]">
              EVIDENCE IMAGE (OPTIONAL - TRIGGERS AI SEVERITY ANALYSIS)
            </label>

            <div className="border-3 border-dashed border-[#050505] bg-white p-4 text-center relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-[#050505]" />
                <p className="font-bold text-xs text-[#050505]">
                  Click or drag photo here to upload
                </p>
                <span className="font-mono text-[10px] text-gray-500">
                  PNG, JPG up to 10MB
                </span>
              </div>
            </div>

            {/* Image Preview & Simulated AI Analysis Output */}
            {imagePreview && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white border-3 border-[#050505] shadow-[3px_3px_0_#050505]">
                <div>
                  <p className="font-mono font-black text-[11px] uppercase mb-1">IMAGE PREVIEW</p>
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="w-full h-32 object-cover border-2 border-[#050505]"
                  />
                </div>

                <div className="bg-[#F8F1E5] p-3 border-2 border-[#050505] flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-[#050505]">
                    <Sparkles className="w-4 h-4 text-[#4C5CFF]" />
                    <span className="font-mono font-black text-xs uppercase text-[#050505]">
                      AI ANALYSIS
                    </span>
                  </div>

                  {isAnalyzingImage ? (
                    <div className="py-4 text-center font-mono text-xs font-bold animate-pulse text-[#4C5CFF]">
                      Analyzing image pixels with ML models...
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-1 font-mono text-xs pt-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Detected:</span>
                        <span className="font-extrabold text-[#050505]">{aiAnalysis.detected}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-extrabold text-[#00D66B]">{aiAnalysis.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visual Severity:</span>
                        <span className="font-extrabold text-[#FF4F87]">{aiAnalysis.visualSeverity}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gray-300">
                        <span className="text-gray-600">Evidence Weight:</span>
                        <span className="font-black text-[#4C5CFF]">+{aiAnalysis.evidenceWeight}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[4px_4px_0_#050505] font-display font-black text-base uppercase tracking-wider hover:bg-[#ff3574] hover:shadow-[6px_6px_0_#050505] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#050505] transition-all cursor-pointer"
            >
              SUBMIT REPORT NOW
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
