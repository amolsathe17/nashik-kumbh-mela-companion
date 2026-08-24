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
      recommended: "Take Eco Shuttle Bus B3 from " + fromLoc + " to " + toLoc + ". Frequency: Every 5 minutes.",
      walkingCorridor: "Pedestrian green route available with water stations and rest tents along Godavari promenade.",
      parkingNote: "Nearest recommended parking is Parking Complex A (Agra Highway Exit)."
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
          <p className="text-xs text-blue-100 font-medium">Shuttle Services, Parking Occupancy & Route Advisories</p>
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
              placeholder="e.g. Tapovan Parking / CBS Bus Stand"
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
              placeholder="e.g. Ramkund Ghat / Trimbakeshwar"
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
              <Navigation className="w-4 h-4 text-blue-600" /> Journey Guidance ({journeyResult.from} → {journeyResult.to})
            </h4>
            <p className="font-semibold text-emerald-800">🚌 {journeyResult.recommended}</p>
            <p>🚶 {journeyResult.walkingCorridor}</p>
            <p>🅿️ {journeyResult.parkingNote}</p>
          </div>
        )}
      </div>

      {/* Travel Updates List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider px-1">
          Live Transport & Parking Status
        </h3>

        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading transport updates...</div>
        ) : updates.length > 0 ? (
          <div className="space-y-3">
            {updates.map((item) => (
              <div key={item._id} className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl flex-shrink-0">
                    {item.type === 'Shuttle' ? '🚌' : item.type === 'Parking' ? '🅿️' : '🚶'}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    {item.routeFrom && item.routeTo && (
                      <p className="text-xs font-semibold text-blue-700 mt-1">
                        Route: {item.routeFrom} ➔ {item.routeTo}
                      </p>
                    )}
                  </div>
                </div>

                {item.occupancyPercentage !== undefined && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <Car className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Parking Capacity</div>
                      <div className="font-mono font-bold text-sm text-blue-800">
                        {item.occupancyPercentage}% Filled
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed text-gray-500">
            No live travel updates posted yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelParking;
