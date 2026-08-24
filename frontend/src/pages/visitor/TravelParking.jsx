import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Bus, Car, Footprints, AlertTriangle, ArrowRight, MapPin, Compass, Navigation } from 'lucide-react';
import api from '../../services/api';

const TravelParking = () => {
  const { t } = useLanguage();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Journey planner local state
  const [fromLoc, setFromLoc] = useState('');
  const [toLoc, setToLoc] = useState('');
  const [journeyResult, setJourneyResult] = useState(null);

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const res = await api.get('/travel');
        if (res.data.success) setUpdates(res.data.data);
      } catch (err) {
        console.log('Error loading travel updates');
      } finally {
        setLoading(false);
      }
    };
    fetchTravel();
  }, []);

  const handlePlanJourney = (e) => {
    e.preventDefault();
    if (!fromLoc || !toLoc) return;
    setJourneyResult({
      from: fromLoc,
      to: toLoc,
      recommended: t('recommendedShuttle') || ("Take Eco Shuttle Bus B3 from " + fromLoc + " to " + toLoc + ". Frequency: Every 5 minutes."),
      walkingCorridor: t('pedestrianGreenRoute') || "Pedestrian green route available with water stations and rest tents along Godavari promenade.",
      parkingNote: t('nearestParkingNote') || "Nearest recommended parking is Parking Complex A (Agra Highway Exit)."
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          🚌
        </div>
        <div>
          <h2 className="text-2xl font-black">{t('travelParking')}</h2>
          <p className="text-xs text-blue-100 font-medium">
            {t('travelParkingDesc') || 'Shuttle Services, Parking Occupancy & Route Advisories'}
          </p>
        </div>
      </div>

      {/* Simple Journey Planner */}
      <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-md space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-900">
          <Compass className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">{t('journeyPlanner')}</h3>
        </div>

        <form onSubmit={handlePlanJourney} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">{t('whereAreYou')}</label>
            <input
              type="text"
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              placeholder={t('fromPlaceholder') || "e.g. Tapovan Parking / CBS Bus Stand"}
              className="w-full p-3 bg-blue-50/50 border border-blue-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">{t('whereToGo')}</label>
            <input
              type="text"
              value={toLoc}
              onChange={(e) => setToLoc(e.target.value)}
              placeholder={t('toPlaceholder') || "e.g. Ramkund Ghat / Trimbakeshwar"}
              className="w-full p-3 bg-blue-50/50 border border-blue-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-transform hover:scale-101"
            >
              <span>{t('findRoute')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {journeyResult && (
          <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-300 space-y-2 text-xs text-blue-950 animate-fade-in">
            <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>{t('recommendedRoute') || 'Recommended Route'}</span>
            </h4>
            <p><strong>{t('shuttleBus') || 'Shuttle Bus'}:</strong> {journeyResult.recommended}</p>
            <p><strong>{t('walkingPath') || 'Walking Path'}:</strong> {journeyResult.walkingCorridor}</p>
            <p><strong>{t('parkingInfo') || 'Parking Info'}:</strong> {journeyResult.parkingNote}</p>
          </div>
        )}
      </div>

      {/* Live Route & Transport Updates */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Bus className="w-5 h-5 text-blue-600" />
          <span>{t('liveRouteUpdates') || 'Live Shuttle & Route Advisories'}</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading transport updates...</div>
        ) : updates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {updates.map((item) => (
              <div key={item._id} className="bg-white rounded-3xl p-5 border border-blue-200 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                    {t(item.routeType) || item.routeType}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'Clear' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {t(item.status) || item.status}
                  </span>
                </div>

                <h4 className="font-bold text-base text-gray-900">{t(item.title)}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{t(item.description)}</p>

                {item.frequency && (
                  <div className="text-[11px] font-bold text-blue-800 bg-blue-50 p-2 rounded-xl border border-blue-100">
                    ⏱️ {t('frequency') || 'Frequency'}: {t(item.frequency)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-3xl border border-blue-100 text-slate-600 text-xs font-medium">
            No active road blockages reported. Electric shuttle buses are running continuously between Outer Parking Satellite Hubs and Panchavati Ghats every 3 to 5 minutes.
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelParking;
