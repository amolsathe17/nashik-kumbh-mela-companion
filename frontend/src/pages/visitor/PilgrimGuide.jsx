import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Compass, Calendar, BookOpen, Globe2, Sparkles, CheckCircle2, 
  ShieldCheck, MapPin, ExternalLink, Sun, Flame, Info, Heart, Droplets,
  AlertTriangle, PhoneCall, Bus, HelpCircle, UserCheck, X
} from 'lucide-react';
import api from '../../services/api';

const PilgrimGuide = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);

  const categories = [
    'All',
    'Shahi Snan',
    'About Kumbh',
    'Holy Shrines',
    'Ghats & Snan',
    'Temple Darshan',
    'How to Reach',
    'Safety & Crowd',
    'Emergency & Helplines',
    'Pilgrim Facilities',
    'Transport & Parking',
    'Do’s & Don’ts'
  ];

  // Comprehensive Pilgrim Assistance Guide Dataset (Strictly Local Nashik Kumbh Images)
  const guideData = [
    // --- SHAHI SNAN DATES ---
    {
      id: 'guide-shahi-1',
      category: 'Shahi Snan',
      title: 'Flag Hoisting (ध्वजारोहण) - Official Commencement',
      subtitle: '31 October 2026 • Ramkund & Kushavarta Kund',
      image: '/dhwajarohan.webp',
      description: 'The 21-month long Simhastha Kumbh Mela officially commences with the sacred flag hoisting (Dhwajarohan) ceremony performed simultaneously by sadhus and administrators at Ramkund and Kushavarta Kund.',
      highlights: [
        'Sacred flag hoisted at sunrise amidst Vedic chanting',
        'Official opening of Akhara camps in Tapovan and Trimbakeshwar',
        'Marks the astronomical entry of Jupiter into Leo (Simha Rashi)'
      ]
    },
    {
      id: 'guide-shahi-2',
      category: 'Shahi Snan',
      title: 'First Amrit Shahi Snan (प्रथम अमृत शाही स्नान)',
      subtitle: '02 August 2027 • Main Bathing Day',
      image: '/shahi-snan.jpg',
      description: 'The first grand royal bath date of the Simhastha Kumbh. Thousands of Nagas and Mahant Sadhus process with silver palanquins and trumpets to take the celestial dip in Godavari.',
      highlights: [
        'Royal procession of Shaivite & Vaishnavite Akharas starting at 4:00 AM',
        'Public bathing permitted after Akhara holy dips conclude',
        'Heavy security cordons & shuttle buses operational from outer parking hubs'
      ]
    },
    {
      id: 'guide-shahi-3',
      category: 'Shahi Snan',
      title: 'Second Main Amrit Shahi Snan (द्वितीय अमृत शाही स्नान)',
      subtitle: '31 August 2027 • Peak Pilgrim Bathing',
      image: '/unnamed-2025-02-03t105950ss_1738561979.jpg',
      description: 'The central and largest Shahi Snan date expected to draw millions of pilgrims to Ramkund ghats and Trimbakeshwar Jyotirlinga river banks.',
      highlights: [
        'Peak astrological alignment for holy immersion in Godavari (Dakshin Ganga)',
        'Grand floral decorations across Ramkund and Panchavati',
        'Special assistance posts along all river routes'
      ]
    },

    // --- ABOUT KUMBH MELA ---
    {
      id: 'guide-1',
      category: 'About Kumbh',
      title: 'About Nashik–Trimbakeshwar Simhastha Kumbh Mela 2026-2027',
      subtitle: 'Sacred Origin, Astrological Significance & Historical Legacy',
      image: '/dhwajarohan.webp',
      description: 'The Simhastha Kumbh Mela in Nashik and Trimbakeshwar is one of the world’s largest spiritual gatherings, celebrated every 12 years when Jupiter enters the zodiac sign of Leo (Simha Rashi) and the Sun enters Aries (Mesha Rashi). According to Hindu mythology, drops of Amrita (immortality nectar) fell at Ramkund in Nashik and Kushavarta Kund in Trimbakeshwar during the Samudra Manthan celestial churn.',
      highlights: [
        'Celebrated every 12 years on the banks of River Godavari (Dakshin Ganga)',
        'Dhwajarohan (Flag Hoisting) on 31 October 2026 marks official opening',
        'Over 35 million pilgrims expected across Nashik and Trimbakeshwar',
        'Unique dual pilgrimage sites: Ramkund for Vaishnavite Akharas and Kushavarta for Shaivite Akharas'
      ]
    },

    // --- HOLY SHRINES & SIGNIFICANCE ---
    {
      id: 'guide-2',
      category: 'Holy Shrines',
      title: 'Sacred Shrines & Holy Sites of Nashik–Panchavati',
      subtitle: 'Ramkund, Trimbakeshwar, Sita Gufa, Kalaram & Kapaleshwar',
      image: '/img_20250206_1205497474678292145460306.webp',
      description: 'Nashik and Trimbakeshwar host some of Hinduism’s most ancient pilgrimage spots. Lord Rama, Goddess Sita, and Lakshmana spent 12 years of their exile in Panchavati.',
      highlights: [
        'Ramkund: Central bathing pool built by Chhatrapati Shahu Maharaj’s commander Chintamanrao',
        'Trimbakeshwar: Ancient 10th-century black basalt temple housing the three-faced Jyotirlinga',
        'Kalaram Temple: Historic black stone temple where Lord Rama stayed during Dandakaranya exile',
        'Kapaleshwar Temple: Rare Shiva temple where Nandi is absent opposite Lord Shiva'
      ]
    },

    // --- GHATS & SNAN ---
    {
      id: 'guide-3',
      category: 'Ghats & Snan',
      title: 'Sacred Ghats & Bathing Guidelines',
      subtitle: 'Ramkund, Kushavarta Kund & Laxman Ghat Bathing Rules',
      image: '/shahi-snan.jpg',
      description: 'Sacred riverfront promenades providing safe holy immersion facilities for visiting devotees.',
      highlights: [
        'Ramkund Ghat (Panchavati): Main bathing spot for pilgrims and Vaishnav Akharas',
        'Kushavarta Kund (Trimbakeshwar): Holy dip location for Shaivite Sadhus',
        'Public Bathing Etiquette: Avoid soap, detergents, or plastic disposal in Godavari river'
      ]
    },

    // --- TEMPLE DARSHAN GUIDANCE ---
    {
      id: 'guide-4',
      category: 'Temple Darshan',
      title: 'Trimbakeshwar & Kalaram Temple Darshan Guidelines',
      subtitle: 'Queue Management, Abhishekam Booking & Dress Code',
      image: '/nagarpradakshina.webp',
      description: 'Millions seek darshan at Trimbakeshwar Jyotirlinga and Kalaram Temple during Kumbh Mela. Dedicated queue complexes and online e-pass booking systems streamline pilgrim flow.',
      highlights: [
        'Trimbakeshwar Temple Timings: 5:00 AM to 9:00 PM',
        'Special Abhishekam & Sparsh Darshan available during morning slots',
        'Traditional modest dress code mandatory (Dhoti/Kurta for men, Saree/Salwar for women)',
        'Free footwear holding counters and wheelchair ramps provided'
      ]
    },

    // --- HOW TO REACH ---
    {
      id: 'guide-5',
      category: 'How to Reach',
      title: 'How to Reach Nashik–Trimbakeshwar Kumbh Mela',
      subtitle: 'Train, Flight, State Highways & Bus Connectivity',
      image: '/shahi.jpg',
      description: 'Nashik is well connected by Indian Railways, Maharashtra State Transport buses (MSRTC), and Nashik Ozar Airport.',
      highlights: [
        'By Train: Nashik Road Station (NK) connected directly to Mumbai, Delhi, Pune, Kolkata, and Chennai.',
        'By Flight: Nashik Ozar Airport (ISK) located 24 km from city center.',
        'By Bus: MSRTC runs 5,000+ special buses from Mumbai, Pune, Shirdi, Dhule, and Sambhajinagar.'
      ]
    },

    // --- SAFETY & CROWD GUIDANCE ---
    {
      id: 'guide-6',
      category: 'Safety & Crowd',
      title: 'Crowd Safety & Stampede Prevention Guidelines',
      subtitle: 'One-Way Pedestrian Corridors & RFID Child Tracking',
      image: '/shahi.jpg',
      description: 'Comprehensive crowd safety protocol instituted by Nashik Police and Disaster Management Authority to ensure smooth, safe movement.',
      highlights: [
        'Follow mandatory One-Way Pedestrian Corridors between CBS, Ramkund, and Tapovan',
        'Get free RFID Wristbands for children and elderly at entrance helpdesks',
        'Avoid stopping on river bridges or narrow alleyways in Panchavati'
      ]
    },

    // --- EMERGENCY & HELPLINES ---
    {
      id: 'guide-7',
      category: 'Emergency & Helplines',
      title: 'Emergency Contacts, Helplines & Lost Person Cell',
      subtitle: 'Police 112, Control Room Numbers & Helpline Support',
      image: '/shahi-snan.jpg',
      description: 'Round-the-clock emergency assistance provided by Nashik District Administration, Municipal Corporation, and Police Department.',
      highlights: [
        'Police Emergency: 112',
        'Kumbh Control Room Helpline: 0253-2575555 / 0253-2578899',
        'Lost & Found Family Reunion Center: Located at Panchavati Police Station'
      ]
    },

    // --- PILGRIM FACILITIES ---
    {
      id: 'guide-8',
      category: 'Pilgrim Facilities',
      title: 'Free Annakshetra (Langar), RO Water & Sadhugram Camps',
      subtitle: 'Complimentary Meals, Clean Drinking Water & Shelters',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      description: 'Extensive free pilgrim amenities managed by Government Authorities, Religious Trusts, ISKCON, and NGOs across Nashik and Trimbakeshwar.',
      highlights: [
        'Free Annakshetra: ISKCON & Devasthan serve free Mahaprasad to 100,000+ daily in Tapovan',
        'RO Water Stations: 50+ continuous purified drinking water kiosks near ghats',
        'Tapovan Sadhugram Tent City: 50-acre free pilgrim shelter'
      ]
    },

    // --- TRANSPORT & PARKING ---
    {
      id: 'guide-9',
      category: 'Transport & Parking',
      title: 'Satellite Parking Hubs & Free Shuttle Buses',
      subtitle: 'Outer Parking Lots & Electric Shuttle Connectivity',
      image: '/kumbh-bg1.jpg',
      description: 'All private vehicles are routed to outer satellite parking lots with free electric shuttle buses running every 3 mins to Ramkund.',
      highlights: [
        'Tapovan Parking A (Aurangabad Road): 25,000 vehicle capacity',
        'Adgaon Parking B (Mumbai-Agra Highway): Main holding lot for outstation coaches',
        'Free Electric Shuttles run 24/7 between Outer Parking Hubs and Panchavati'
      ]
    },

    // --- DO'S AND DON'TS ---
    {
      id: 'guide-10',
      category: 'Do’s & Don’ts',
      title: 'Essential Do’s and Don’ts for Kumbh Mela Pilgrims',
      subtitle: 'Responsible Pilgrimage Etiquette & Guidelines',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      description: 'Follow these essential guidelines to ensure a safe, peaceful, and spiritually rewarding pilgrimage during Simhastha Kumbh.',
      highlights: [
        'DO wear RFID wristbands on children and keep emergency contact slips in pocket',
        'DO carry light cotton clothing, water bottles, and comfortable walking shoes',
        'DON’T throw plastic, trash, or soap into River Godavari or sacred bathing ghats',
        'DON’T carry heavy gold jewelry or excess cash into crowded areas'
      ]
    }
  ];

  useEffect(() => {
    const fetchDynamicGuides = async () => {
      try {
        const res = await api.get('/pilgrim-guide').catch(() => null);
        if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const apiItems = res.data.data.map(item => ({
            id: item._id,
            category: item.category || 'Shahi Snan',
            title: item.title,
            subtitle: item.eventDate ? `🗓️ ${item.eventDate}` : 'Pilgrim Guidance Note',
            image: item.image || '/shahi-snan.jpg',
            description: item.description,
            highlights: item.highlights || [item.description]
          }));
          const apiNames = new Set(apiItems.map(i => i.title));
          const combined = [...apiItems, ...guideData.filter(g => !apiNames.has(g.title))];
          setGuides(combined);
        } else {
          setGuides(guideData);
        }
      } catch (err) {
        setGuides(guideData);
      }
    };
    fetchDynamicGuides();
  }, []);

  const matchCategory = (itemCat, targetCat) => {
    if (!targetCat || targetCat === 'All') return true;
    if (!itemCat) return false;

    const item = String(itemCat).trim().toLowerCase();
    const target = String(targetCat).trim().toLowerCase();

    if (item === target) return true;

    if (target === 'shahi snan') return item === 'shahi snan';
    if (target === 'about kumbh') return item === 'about kumbh';
    if (target === 'holy shrines') return item === 'holy shrines';
    if (target === 'ghats & snan') return item === 'ghats & snan' || item === 'ghat';
    if (target === 'temple darshan') return item === 'temple darshan' || item === 'temple';
    if (target === 'how to reach') return item === 'how to reach';
    if (target === 'safety & crowd') return item === 'safety & crowd';
    if (target === 'emergency & helplines') return item === 'emergency & helplines';
    if (target === 'pilgrim facilities') return item === 'pilgrim facilities';
    if (target === 'transport & parking') return item === 'transport & parking';
    if (target.includes('do')) return item.includes('do');

    return item === target;
  };

  const filteredGuides = guides.filter(g => matchCategory(g.category, activeCategory));

  const countForCategory = (cat) => {
    return guides.filter(g => matchCategory(g.category, cat)).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            📕
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('pilgrimGuide')}</h2>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
              Comprehensive Shahi Snan Schedule, Akharas, Sacred Rituals & Visitor Guidelines
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
        {categories.map((cat) => {
          const count = countForCategory(cat);
          const isSelected = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                isSelected ? 'bg-rose-950/40 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guide Cards Grid */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div 
              key={guide.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img 
                    src={guide.image || '/shahi-snan.jpg'} 
                    alt={guide.title}
                    onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-rose-700 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow">
                    {guide.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">{guide.title}</h3>
                    <p className="text-[11px] font-bold text-rose-700 mt-0.5">{guide.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{guide.description}</p>

                  {guide.highlights && guide.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      {guide.highlights.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedGuide(guide)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> Read Full Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No guide cards found in "{activeCategory}"</h3>
          <p className="text-xs text-slate-500">Select "All" to view all available pilgrim guides.</p>
        </div>
      )}

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-rose-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                  {selectedGuide.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedGuide.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-52 rounded-2xl overflow-hidden bg-slate-900">
              <img 
                src={selectedGuide.image || '/shahi-snan.jpg'} 
                alt={selectedGuide.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p className="font-medium text-slate-800 text-sm leading-normal">{selectedGuide.description}</p>

              {selectedGuide.highlights && (
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2">
                  <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-rose-600" /> Key Pilgrim Highlights & Protocols:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedGuide.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-rose-950 font-medium">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t">
              <button
                onClick={() => setSelectedGuide(null)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PilgrimGuide;
