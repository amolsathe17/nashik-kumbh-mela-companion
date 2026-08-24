import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Compass, Calendar, BookOpen, Globe2, Sparkles, CheckCircle2, 
  ShieldCheck, MapPin, ExternalLink, Sun, Flame, Info, Heart, Droplets 
} from 'lucide-react';

const PilgrimGuide = () => {
  const { t } = useLanguage();
  // By default "Shahi Snan" tab is selected as requested
  const [activeTab, setActiveTab] = useState('Shahi Snan');

  const tabs = [
    { id: 'Shahi Snan', label: '👑 Shahi Snan Dates' },
    { id: 'Ritual Guide', label: '🔱 Sacred Rituals & Traditions' },
    { id: 'Akharas', label: '🛕 Akharas & Sadhus' },
    { id: 'Temple Guide', label: '🚩 Temples & Sacred Places' },
    { id: 'Travel & Safety', label: '🛡️ Travel, Safety & Tips' },
    { id: 'All', label: 'All Guides / संपूर्ण मार्गदर्शिका' }
  ];

  // Relevant and exact photographic images for every topic/subject
  const guideData = [
    // --- 1. SHAHI SNAN DATES ---
    {
      id: 'shahi-1',
      category: 'Shahi Snan',
      title: 'Flag Hoisting (ध्वजारोहण) - Official Commencement',
      eventDate: '31 October 2026',
      location: 'Ramkund (Nashik) & Kushavarta Kund (Trimbakeshwar)',
      image: '/dhwajarohan.webp',
      description: 'The 21-month long Simhastha Kumbh Mela officially commences with the sacred flag hoisting (Dhwajarohan) ceremony performed simultaneously by sadhus and administrators at Ramkund and Kushavarta Kund.',
      highlights: [
        'Sacred flag hoisted at sunrise amidst Vedic chanting',
        'Official opening of Akhara camps in Tapovan and Trimbakeshwar',
        'Marks the astronomical entry of Jupiter into Leo (Simha Rashi)'
      ]
    },
    {
      id: 'shahi-2',
      category: 'Shahi Snan',
      title: 'Nagar Pradakshina (नगर प्रदक्षिणा) - 14 KM Holy Circuit',
      eventDate: '29 July 2027',
      location: 'Old Nashik Pilgrim Circuit',
      image: '/nagarpradakshina.webp',
      description: 'A 14 km sacred circumambulation walk around Nashik’s historic holy shrines and river ghats undertaken by thousands of pilgrims before the royal bath dates.',
      highlights: [
        '14 kilometer circumambulation circuit around old Nashik city',
        'Pilgrims walk barefoot visiting ancient river ghats and temples',
        'Sturdy, comfortable footwear recommended for visitors'
      ]
    },
    {
      id: 'shahi-3',
      category: 'Shahi Snan',
      title: 'First Amrit Shahi Snan (प्रथम अमृत शाही स्नान)',
      eventDate: '02 August 2027',
      location: 'Ramkund (Nashik) & Kushavarta Kund (Trimbakeshwar)',
      image: '/shahi-snan-for-kumbh-mela.webp',
      description: 'The first grand royal bath date of the Simhastha Kumbh. Thousands of Nagas and Mahant Sadhus process with silver palanquins and trumpets to take the celestial dip in Godavari.',
      highlights: [
        'Royal procession of Shaivite & Vaishnavite Akharas starting at 4:00 AM',
        'Public bathing permitted after Akhara holy dips conclude',
        'Heavy security cordons & shuttle buses operational from outer parking hubs'
      ]
    },
    {
      id: 'shahi-4',
      category: 'Shahi Snan',
      title: 'Second Amrit Shahi Snan (द्वितीय अमृत शाही स्नान)',
      eventDate: '31 August 2027',
      location: 'Ramkund (Nashik) & Kushavarta Kund (Trimbakeshwar)',
      image: '/shahi-snan-for-kumbh-mela.webp',
      description: 'The central and largest Shahi Snan date expected to draw millions of pilgrims to Ramkund ghats and Trimbakeshwar Jyotirlinga river banks.',
      highlights: [
        'Peak astrological alignment for holy immersion in Godavari (Dakshin Ganga)',
        'Grand floral decorations across Ramkund and Panchavati',
        'Special medical camps and missing-person booths along all river routes'
      ]
    },
    {
      id: 'shahi-5',
      category: 'Shahi Snan',
      title: 'Third Amrit Shahi Snan (तृतीय शाही स्नान - Nashik)',
      eventDate: '11 September 2027',
      location: 'Ramkund Ghat, Nashik City',
      image: '/shahi.jpg',
      description: 'The final royal bathing ceremony for Vaishnavite Akharas at Ramkund, Nashik. Banners of Lord Hanuman, Chariots, and Kirtans mark the conclusion of the main bathing phase in Nashik city.',
      highlights: [
        'Dedicated royal bath day for Vaishnavite Sadhus and Mahants in Nashik',
        'Grand evening Godavari Maha Aarti with thousands of floating lamps',
        'Continuous shuttle service operating between Nashik Road and Ghats'
      ]
    },
    {
      id: 'shahi-6',
      category: 'Shahi Snan',
      title: 'Third Amrit Shahi Snan (तृतीय शाही स्नान - Trimbakeshwar)',
      eventDate: '12 September 2027',
      location: 'Kushavarta Kund, Trimbakeshwar',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
      description: 'The final royal bath date for Shaivite Akharas at Kushavarta Kund in Trimbakeshwar near the sacred origin of River Godavari.',
      highlights: [
        'Shaivite Naga Sadhus complete their holy immersion at Kushavarta Kund',
        'Special Abhishekam at Lord Trimbakeshwar Jyotirlinga',
        'Mela closes officially on 24 July 2028 with flag lowering'
      ]
    },

    // --- 2. SACRED RITUALS & TRADITIONS ---
    {
      id: 'ritual-1',
      category: 'Ritual Guide',
      title: 'Shahi Snan (शाही स्नान) - The Celestial Royal Bath',
      eventDate: 'On Major Bathing Dates',
      location: 'Ramkund & Kushavarta Kund',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
      description: 'The supreme ritual of Kumbh Mela. Astrologically, when Jupiter enters Leo (Simha), the waters of Godavari turn into divine nectar (Amrit). Bathing during Shahi Snan is believed to cleanse lifetimes of karma.',
      highlights: [
        'Sequence: Akharas take the royal bath first, followed by general pilgrims',
        'Pilgrims chant "Narmade Har", "Har Har Gange", and "Jai Babaji"',
        'Modesty and reverence should be maintained at all ghats'
      ],
      guidelines: [
        'Do not use soap or detergents in the sacred river water',
        'Follow designated entry and exit stairs at Ramkund ghats',
        'Keep belongings in dry bags and avoid carrying gold jewelry'
      ]
    },
    {
      id: 'ritual-2',
      category: 'Ritual Guide',
      title: 'Pitri Tarpan & Shraddha (पितृ तर्पण एवं श्राद्ध)',
      eventDate: 'Rishi Panchami & Amavasya Dates',
      location: 'Ramkund Ghats, Nashik',
      image: '/68c4435662438-pitru-paksha-120221463-16x9.webp',
      description: 'Ramkund is world-famous for performing ancestral rituals (Pitri Tarpan). Lord Rama performed the Shraddha ceremony for his father King Dasharatha at Ramkund.',
      highlights: [
        'Pandits guide pilgrims through sesame water offerings (Tarpan)',
        'Perform auspiciously on Rishi Panchami (05 Sep 2027) & Shravan Purnima',
        'Brings peace to departed ancestors and ancestral blessings to the family'
      ],
      guidelines: [
        'Perform rites through verified local Purohits / Pandits',
        'Dispose of organic ritual offerings in designated green bins'
      ]
    },
    {
      id: 'ritual-3',
      category: 'Ritual Guide',
      title: 'Godavari Deep Daan & Maha Aarti (दीपदान एवं महाआरती)',
      eventDate: 'Every Evening at Sunset',
      location: 'Ramkund Ghat Banks',
      image: '/goda-aarti-chatg.webp',
      description: 'As twilight falls, thousands of floating earthen oil lamps (Diyas) adorned with marigold flowers are released into the flowing Godavari river during the rhythmic chanting of Godavari Aarti.',
      highlights: [
        'Kartik Purnima (14 Nov 2027) features over 100,000 glowing lamps',
        'Synchronization of bells, conch shells, and Vedic chants',
        'Spectacular photographic opportunity from bridge viewpoints'
      ],
      guidelines: [
        'Use eco-friendly leaf boats (Dona) for floating lamps',
        'Be careful around slippery river steps during evening crowd'
      ]
    },
    {
      id: 'ritual-4',
      category: 'Ritual Guide',
      title: 'Akhara Havans & Vedic Yagnas (हवन एवं यज्ञ)',
      eventDate: 'Daily during Mela period',
      location: 'Tapovan & Trimbakeshwar Sadhu Camps',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      description: 'Continuous sacred fire ceremonies (Havans) take place in the tents of Akharas. Sacred herbal samagri, ghee, and mantras fill the air with spiritual vibrations.',
      highlights: [
        'Visitors can receive blessings, Bhasma (sacred ash), and Prasad',
        'Guru Purnima (18 July 2027) is dedicated to honoring Akhara Gurus',
        'Quieter days before Shahi Snan are best for visiting Akhara camps'
      ],
      guidelines: [
        'Remove shoes before entering Akhara tent enclosures',
        'Seek permission before taking photos of Sadhus'
      ]
    },

    // --- 3. AKHARAS & SADHUS ---
    {
      id: 'akhara-1',
      category: 'Akharas',
      title: 'Shaivite Akharas & Naga Sadhus (शैव अखाड़ा व नागा साधु)',
      eventDate: 'Camped in Trimbakeshwar',
      location: 'Trimbakeshwar Kumbh Nagari',
      image: '/img_20250206_1205497474678292145460306.webp',
      description: 'The Shaivite Akharas (Juna, Niranjani, Mahanirvani) worship Lord Shiva. They are famous for Naga Sadhus—ascetics covered in holy ash carrying trishuls who have renounced worldly attachments.',
      highlights: [
        'Camped exclusively at Trimbakeshwar near Lord Shiva’s Jyotirlinga',
        'Historic lineage of warrior-ascetics protecting ancient dharma',
        'Procession includes decorated palanquins, tridents, and damrus'
      ]
    },
    {
      id: 'akhara-2',
      category: 'Akharas',
      title: 'Vaishnavite Akharas (वैष्णव अखाड़ा - अनी)',
      eventDate: 'Camped in Tapovan, Nashik',
      location: 'Tapovan Kumbh Nagari, Nashik',
      image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80',
      description: 'The Vaishnavite Akharas (Nirmohi, Digambar, Nirvani Ani) worship Lord Vishnu and Lord Rama. They adorn sandalwood tilaks, tulsi beads, and carry flags of Lord Hanuman.',
      highlights: [
        'Camped at Tapovan in Nashik city near Lakshmana Rekha site',
        'Vibrant Bhajans, Ramcharitmanas discourses, and Anna Kshetras (free food)',
        'Procession leads down Panchavati to Ramkund for royal baths'
      ]
    },

    // --- 4. TEMPLES & SACRED PLACES ---
    {
      id: 'place-1',
      category: 'Temple Guide',
      title: 'Trimbakeshwar Jyotirlinga Temple (त्र्यंबकेश्वर ज्योतिर्लिंग)',
      eventDate: 'Open Daily 5:00 AM - 9:00 PM',
      location: 'Trimbakeshwar, 28 km from Nashik',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
      description: 'One of the 12 sacred Jyotirlingas in India. Unique because the lingam embodies the holy Trinity: Lord Brahma, Lord Vishnu, and Lord Shiva. Kushavarta Kund here is the origin of River Godavari.',
      highlights: [
        'Ancient black stone architecture built by Peshwa Balaji Baji Rao',
        'Special Shivratri (23 Feb 2028) celebrations during Kumbh',
        'Strict dress code: Traditional Indian attire mandatory'
      ]
    },
    {
      id: 'place-2',
      category: 'Temple Guide',
      title: 'Ramkund & Godavari Ghats (रामकुंड)',
      eventDate: 'Open 24/7',
      location: 'Panchavati, Nashik',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'The central holy pool where Lord Rama, Sita, and Lakshmana bathed during their 14-year exile. Bone immersion in Ramkund is believed to dissolve into water completely.',
      highlights: [
        'Primary site for Nashik Shahi Snan and evening Aarti',
        'Surrounded by historic temples like Kapaleshwar and Ganga Mandir',
        'Cleaned & illuminated with high-density crowd management corridors'
      ]
    },
    {
      id: 'place-3',
      category: 'Temple Guide',
      title: 'Kalaram Temple & Panchavati (कालाराम मंदिर)',
      eventDate: 'Open 6:00 AM - 9:00 PM',
      location: 'Panchavati, Nashik',
      image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80',
      description: 'Historic temple built in 1788 housing a 2-foot black stone idol of Lord Rama. Panchavati is named after 5 ancient Banyan trees where Lord Rama built his hermitage.',
      highlights: [
        'Stunning black stone masonry built with 70,000 tons of basalt',
        'Close to Sita Gufa where Goddess Sita resided during exile',
        'Walking distance from Ramkund Ghat'
      ]
    },

    // --- 5. TRAVEL, SAFETY & ETIQUETTE ---
    {
      id: 'safety-1',
      category: 'Travel & Safety',
      title: 'Kumbh Logistics: Shuttle Buses & Outer Parking Hubs',
      eventDate: 'Active on Peak Bathing Days',
      location: 'Nashik Outer Ring Road',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      description: 'On Shahi Snan dates, private vehicles and taxis are restricted 5-10 km outside the city. Free government electric shuttle buses transport pilgrims from outer parking lots to inner drop zones.',
      highlights: [
        'Park vehicles at satellite hubs: Adgaon, Tapovan, Ambad, Satpur',
        'Expect 3 to 10 km walking from inner shuttle drops to river ghats',
        'Wear durable walking shoes suitable for paved and cobblestone streets'
      ],
      guidelines: [
        'Save offline maps; mobile networks may experience congestion on peak dates',
        'Identify color-coded emergency holding zones if separated from family'
      ]
    },
    {
      id: 'safety-2',
      category: 'Travel & Safety',
      title: 'Pilgrim Etiquette & Cultural Respect',
      eventDate: 'General Visitor Advice',
      location: 'All Ghats & Akhara Camps',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'Kumbh Mela is an ancient sacred pilgrimage. Following simple etiquette ensures a safe, respectful, and spiritually enriching experience for everyone.',
      highlights: [
        'Maintain quiet reverence during sacred bathing hours',
        'Ask permission before filming or photographing Sadhus in tents',
        'Free Anna Kshetras provide pure vegetarian meals (Prasad) to all'
      ],
      guidelines: [
        'Dress modestly covering shoulders and knees',
        'Keep emergency helpline numbers (112, 108) saved on your phone',
        'Utilize the Family Travel Group feature in this app to track companions'
      ]
    }
  ];

  const filteredData = guideData.filter(item => activeTab === 'All' || item.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center space-x-4 rtl:space-x-reverse relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
          🛕
        </div>
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/30 px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-100 mb-1 border border-amber-200/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Simhastha Guide 2026-2028</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">{t('pilgrimGuide')}</h2>
          <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
            Sacred Shahi Snan Dates, Akhara Traditions, Ritual Details & Visitor Etiquette
          </p>
        </div>
      </div>

      {/* Quick Summary Banner */}
      <div className="bg-white rounded-3xl p-5 border-2 border-rose-300 shadow-md space-y-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-rose-900">
          <Info className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <h3 className="font-bold text-sm sm:text-base">What is the Simhastha Kumbh Mela? (सिंहस्थ कुंभ पर्व)</h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          The <strong>Nashik-Trimbakeshwar Simhastha Kumbh Mela</strong> is celebrated once every 12 years when Jupiter enters the zodiac sign of Leo (Simha Rashi). Spanning 21 months from <strong>October 31, 2026 to July 24, 2028</strong>, the festival centers around holy river dips in the sacred <strong>Godavari River</strong> at <strong>Ramkund</strong> (Nashik) and <strong>Kushavarta Kund</strong> (Trimbakeshwar).
        </p>
      </div>

      {/* Tabs Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-2xl font-extrabold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white ring-2 ring-rose-400 scale-102'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Royal Bathing Dates Overview Box (Visible on Shahi Snan tab) */}
      {(activeTab === 'All' || activeTab === 'Shahi Snan') && (
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Calendar className="w-6 h-6 text-amber-200" />
            <h3 className="font-black text-lg sm:text-xl">Confirmed Royal Shahi Snan Dates (शाही स्नान तिथियां)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/95 text-slate-900 p-4 rounded-2xl border-2 border-amber-300 shadow-md">
              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Flag Hoisting</span>
              <div className="font-black text-base text-rose-900 mt-1">31 Oct 2026</div>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Ramkund & Trimbakeshwar</p>
            </div>
            <div className="bg-white/95 text-slate-900 p-4 rounded-2xl border-2 border-rose-300 shadow-md">
              <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded">1st Amrit Snan</span>
              <div className="font-black text-base text-rose-900 mt-1">02 Aug 2027</div>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Nashik & Trimbakeshwar</p>
            </div>
            <div className="bg-white/95 text-slate-900 p-4 rounded-2xl border-2 border-rose-400 shadow-md">
              <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded">2nd Amrit Snan</span>
              <div className="font-black text-base text-rose-900 mt-1">31 Aug 2027</div>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Central Royal Bath Date</p>
            </div>
            <div className="bg-white/95 text-slate-900 p-4 rounded-2xl border-2 border-amber-300 shadow-md">
              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">3rd Amrit Snan</span>
              <div className="font-black text-base text-rose-900 mt-1">11 & 12 Sep 2027</div>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5">11 Sep (Nashik) / 12 Sep (Trimbak)</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredData.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-3xl overflow-hidden border-2 border-rose-200 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Photographic Image matching the exact subject */}
              <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-900">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  onError={(e) => { e.target.src = '/kumbh-bg.jpg'; }}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-amber-400/40">
                  {item.category}
                </div>
                {item.eventDate && (
                  <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-xl shadow-md">
                    📅 {item.eventDate}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <h4 className="text-base sm:text-lg font-black text-slate-950 leading-tight">
                  {item.title}
                </h4>

                {item.location && (
                  <div className="flex items-center space-x-1.5 text-xs text-rose-700 font-bold">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{item.location}</span>
                  </div>
                )}

                <p className="text-xs text-slate-700 leading-relaxed">
                  {item.description}
                </p>

                {/* Highlights Bullet List */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Key Features & Significance:
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {item.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Guidelines List */}
                {item.guidelines && item.guidelines.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Important Guidelines:
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {item.guidelines.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Official Simhastha Pilgrim Guide
              </span>
              <a 
                href="https://nashik.gov.in" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center space-x-1"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PilgrimGuide;
