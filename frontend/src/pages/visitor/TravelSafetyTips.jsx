import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, Search, MapPin, Phone, AlertTriangle, CheckCircle2, 
  Navigation, Clock, Bus, HelpCircle, HeartPulse, Shield, UserCheck, 
  Droplets, Info, ExternalLink, Map as MapIcon, Sparkles, PhoneCall
} from 'lucide-react';

const TravelSafetyTips = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive Authentic Travel, Safety & Tips Dataset
  const safetyCards = [
    {
      id: 'tip-1',
      category: 'Transit & Parking',
      title: 'Mandatory Satellite Parking & Free E-Shuttle System',
      subtitle: 'Tapovan (25,000 Slots) & Adgaon (15,000 Slots)',
      icon: Bus,
      badgeColor: 'bg-blue-600',
      description: 'Private cars and tourist buses are restricted inside the Panchavati core zone (4:00 AM to 11:00 PM). Park at outer satellite hubs and use free 24/7 low-floor electric shuttles.',
      location: 'Tapovan Satellite Hub A & Adgaon Hub B',
      highlights: [
        'Free Electric Shuttles running every 3 to 5 minutes to Ramkund',
        'CCTV monitored 50-acre parking lots with EV charging stations',
        'Driver resting bays and pure drinking water booths available'
      ],
      actionText: 'Get Direction to Tapovan Parking',
      queryLocation: 'Tapovan Parking, Nashik'
    },
    {
      id: 'tip-2',
      category: 'Ghat Safety',
      title: 'Shahi Snan River Safety Netting & Lifeguards',
      subtitle: 'Ramkund, Kushavarta & Laxman Ghats',
      icon: ShieldCheck,
      badgeColor: 'bg-rose-700',
      description: 'Underwater safety barriers and anti-slip rubber matting installed across all holy bathing ghats. Specialized NDRF water rescue teams and life-jackets deployed 24/7.',
      location: 'Ramkund Main Bathing Promenade',
      highlights: [
        'Stay within marked yellow buoyancy safety netting in Godavari river',
        'Separate illuminated changing rooms for female pilgrims',
        'Do not swim beyond designated ghat steps during high water release'
      ],
      actionText: 'Get Direction to Ramkund Ghat',
      queryLocation: 'Ramkund, Panchavati, Nashik'
    },
    {
      id: 'tip-3',
      category: 'Lost & Found',
      title: 'Child & Elderly RFID Wristband Registration',
      subtitle: 'Panchavati & Trimbak Central Police Posts',
      icon: UserCheck,
      badgeColor: 'bg-amber-600',
      description: 'Register your children and senior citizens at any Kumbh Police Helpdesk to receive free waterproof RFID wristbands synced with parent phone numbers for instant reunion.',
      location: 'Central Police Control Room, Panchavati',
      highlights: [
        'Free waterproof RFID tags linked to parent contact numbers',
        'Multilingual public announcement system across 400 loudspeaker poles',
        'Family reunion lounges equipped with seating and hydration'
      ],
      actionText: 'Get Direction to Police Helpdesk',
      queryLocation: 'Panchavati Police Station, Nashik'
    },
    {
      id: 'tip-4',
      category: 'Health & Hygiene',
      title: '24/7 Medical Posts & RO Drinking Water Stations',
      subtitle: 'Free First Aid, Essential Drugs & Emergency Ambulances',
      icon: HeartPulse,
      badgeColor: 'bg-emerald-600',
      description: 'Over 50 temporary medical centers with doctors and emergency ambulances (Dial 108) stationed every 500 meters along all main pilgrimage corridors.',
      location: 'Ramkund & Tapovan Medical Camps',
      highlights: [
        'Free essential medicines, ORS hydration packs, and first aid',
        'Solar-powered 10,000 LPH RO purified cold water dispensers every 200m',
        'Continuous janitorial disinfection of 2,000+ smart bio-toilets'
      ],
      actionText: 'Get Direction to Medical Booth',
      queryLocation: 'Panchavati Hospital, Nashik'
    },
    {
      id: 'tip-5',
      category: 'Helplines',
      title: 'Official 24/7 Emergency Helpline Registry',
      subtitle: 'Police, Ambulance, Fire & Pilgrim Helpdesk',
      icon: Phone,
      badgeColor: 'bg-purple-600',
      description: 'Keep these emergency numbers saved on your mobile phone for instant assistance during your Nashik-Trimbakeshwar Kumbh pilgrimage.',
      location: 'Nashik Kumbh Command Center',
      highlights: [
        'Kumbh Integrated Helpline: 112 / 0253-2575555',
        'Emergency Medical & Ambulance: 108',
        'Tourist Police & Lost Person Cell: 0253-2591244'
      ],
      actionText: 'Call Emergency Helpline (112)',
      isCallAction: true,
      phoneNumber: '112'
    },
    {
      id: 'tip-6',
      category: 'Transit & Parking',
      title: 'One-Way Pilgrim Walking Corridors on Snan Days',
      subtitle: 'Dwarka -> Tapovan -> Ramkund -> CBS Loop',
      icon: Navigation,
      badgeColor: 'bg-indigo-600',
      description: 'Strict one-way pedestrian ring routes enforced during Shahi Snan dates to prevent crowd congestion. Follow color-coded overhead signage along the riverbank.',
      location: 'Godavari Riverbank Ring Road',
      highlights: [
        'Barricaded 3.5 km walking track with cooling misting fans',
        'Baggage counter depots near Railway Station and CBS Bus Stand',
        'Senior citizen golf carts available for mobility support'
      ],
      actionText: 'Get Direction to Walking Corridor',
      queryLocation: 'Dwarka Circle, Nashik'
    }
  ];

  const filteredCards = safetyCards.filter(card => {
    const searchLow = searchTerm.toLowerCase();
    return searchLow === '' ||
      card.title.toLowerCase().includes(searchLow) ||
      card.description.toLowerCase().includes(searchLow) ||
      card.location.toLowerCase().includes(searchLow) ||
      card.category.toLowerCase().includes(searchLow);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden border border-blue-500/30">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-md border border-blue-400/40">
            🛡️
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-blue-100 leading-tight truncate">
              Travel, Safety & Visitor Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/80 font-medium mt-1 truncate">
              Essential Transit Rules, Emergency Helplines, Ghat Safety & Pilgrim Guidelines
            </p>
          </div>
        </div>

        {/* List View / Map View Toggle Buttons (Hidden on Desktop / Laptop) */}
        <div className="flex lg:hidden bg-blue-950/80 p-1.5 rounded-2xl border border-blue-400/40 text-xs self-start sm:self-auto z-10 flex-shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${viewMode === 'list' ? 'bg-white text-blue-950 shadow-md' : 'text-blue-100 hover:text-white'}`}
          >
            📋 All Guidelines ({filteredCards.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${viewMode === 'map' ? 'bg-white text-blue-950 shadow-md' : 'text-blue-100 hover:text-white'}`}
          >
            🗺️ Map View
          </button>
        </div>
      </div>

      {/* Interactive Map View Simulation (Hidden on Desktop / Laptop) */}
      {viewMode === 'map' && (
        <div className="lg:hidden bg-[#fffbeb] border-2 border-amber-300/80 rounded-[28px] p-6 sm:p-8 text-center shadow-md relative overflow-hidden flex flex-col items-center justify-center space-y-3 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-200/60 flex items-center justify-center text-amber-900 shadow-sm border border-amber-300/60">
            <MapIcon className="w-8 h-8 text-amber-900" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-950 tracking-tight">Map View Active</h3>
          <p className="text-xs sm:text-sm text-slate-700 max-w-lg leading-relaxed font-medium">
            Displaying pin markers on map. Click 'Take Me There' to start live GPS navigation.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Panchavati+Police+Control+Room,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-cyan-100/90 hover:bg-cyan-200 text-cyan-950 border border-cyan-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>👮</span>
              <span>Police Control Room</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Ramkund+Medical+Post,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🏥</span>
              <span>Medical Post #1</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Tapovan+Outer+Hub+Checkpost,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-indigo-100/90 hover:bg-indigo-200 text-indigo-950 border border-indigo-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🅿️</span>
              <span>Tapovan Outer Checkpost</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Bar Row (No tabs, all info displays directly on page) */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 text-blue-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all safety rules, parking & helplines..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
          Displaying {filteredCards.length} Guidelines
        </span>
      </div>

      {/* All Safety Guidelines Cards Displayed Directly on Page (Always Grid on Desktop) */}
      <div className={`${viewMode === 'map' ? 'hidden lg:grid' : 'grid'} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
        {filteredCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase shadow-sm ${card.badgeColor}`}>
                      {card.category}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">{card.title}</h3>
                    <p className="text-[11px] font-bold text-blue-700 mt-0.5">{card.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{card.description}</p>

                  <div className="flex items-center space-x-1.5 text-xs text-blue-900 font-bold bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-200">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{card.location}</span>
                  </div>

                  {card.highlights && (
                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                      {card.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Perfectly Aligned Pill-Shaped Action / Get Direction Button */}
              <div className="p-6 pt-0 mt-auto flex justify-start">
                {card.isCallAction ? (
                  <a
                    href={`tel:${card.phoneNumber}`}
                    className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md inline-flex items-center space-x-2 transition-all hover:scale-105 border border-blue-500 flex-shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{card.actionText}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const destinationQuery = encodeURIComponent(card.queryLocation);
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`, '_blank');
                    }}
                    className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md inline-flex items-center space-x-2 transition-all hover:scale-105 border border-blue-500 flex-shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{card.actionText}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TravelSafetyTips;
