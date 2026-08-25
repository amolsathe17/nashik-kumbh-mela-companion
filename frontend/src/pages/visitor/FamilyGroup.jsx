import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, Shield, Share2, Copy, Check, Lock, MapPin, UserPlus, 
  Battery, AlertTriangle, Compass, Phone, MessageSquare, Send, 
  ExternalLink, Sparkles, RefreshCw, Radio, UserCheck, LogOut
} from 'lucide-react';

const FamilyGroup = () => {
  const { t } = useLanguage();

  // Mode states: 'welcome', 'create', 'join', 'active'
  const [activeView, setActiveView] = useState('welcome');

  // Input states
  const [hostName, setHostName] = useState('');
  const [groupNameInput, setGroupNameInput] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [memberNameInput, setMemberNameInput] = useState('');
  const [customMsgInput, setCustomMsgInput] = useState('');

  // Active Group state (persisted in localStorage)
  const [group, setGroup] = useState(() => {
    const saved = localStorage.getItem('kumbh_active_family_group');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [isSharingLoc, setIsSharingLoc] = useState(true);
  const [copied, setCopied] = useState(false);
  const [meetingPoint, setMeetingPoint] = useState('Ramkund Main Clock Tower Gate #2');
  const [messages, setMessages] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Member');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    if (group) {
      localStorage.setItem('kumbh_active_family_group', JSON.stringify(group));
      setActiveView('active');
    } else {
      localStorage.removeItem('kumbh_active_family_group');
    }
  }, [group]);

  // Initial demo messages if active
  useEffect(() => {
    if (group && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'Priya Sharma',
          text: '📍 Reached Ramkund Ghat entrance. Waiting near the clock tower.',
          time: '10:15 AM',
          type: 'info'
        },
        {
          id: 2,
          sender: 'Grandpa Ramesh',
          text: '🥤 Resting at RO Water Kiosk #1 with uncle.',
          time: '10:20 AM',
          type: 'info'
        }
      ]);
    }
  }, [group]);

  // Handle Group Creation
  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    const generatedCode = 'KUMBH-' + Math.floor(100000 + Math.random() * 900000);
    const gName = groupNameInput.trim() || `${hostName.trim() || 'Pilgrim'} Family Group`;
    
    const newGroup = {
      code: generatedCode,
      name: gName,
      createdAt: new Date().toISOString(),
      meetingPoint: 'Ramkund Main Clock Tower Gate #2',
      host: hostName.trim() || 'You',
      members: [
        {
          id: 'mem-1',
          name: `${hostName.trim() || 'You'} (Group Host)`,
          role: 'Host',
          sharing: true,
          battery: '94%',
          locationName: 'Ramkund Upper Promenade',
          distance: '0 meters (You)',
          status: 'Online',
          lastSeen: 'Just now',
          color: 'bg-amber-500'
        },
        {
          id: 'mem-2',
          name: 'Priya Sharma',
          role: 'Family Member',
          sharing: true,
          battery: '82%',
          locationName: 'Panchavati Temple Road',
          distance: '180 meters away',
          status: 'Online',
          lastSeen: '1 min ago',
          color: 'bg-purple-500'
        },
        {
          id: 'mem-3',
          name: 'Grandpa Ramesh',
          role: 'Senior Citizen',
          sharing: true,
          battery: '65%',
          locationName: 'Ramkund Water Kiosk #1',
          distance: '90 meters away',
          status: 'Online',
          lastSeen: '3 mins ago',
          color: 'bg-emerald-500'
        }
      ]
    };

    setGroup(newGroup);
  };

  // Handle Joining Group
  const handleJoinGroupSubmit = (e) => {
    e.preventDefault();
    const formattedCode = joinCodeInput.trim().toUpperCase();
    if (!formattedCode) return;

    const joinedName = memberNameInput.trim() || 'New Member';
    const newGroup = {
      code: formattedCode,
      name: `Joined Group (${formattedCode})`,
      createdAt: new Date().toISOString(),
      meetingPoint: 'Ramkund Main Clock Tower Gate #2',
      host: 'Group Leader',
      members: [
        {
          id: 'mem-you',
          name: `${joinedName} (You)`,
          role: 'Member',
          sharing: true,
          battery: '88%',
          locationName: 'Ramkund Main Entry',
          distance: '0 meters (You)',
          status: 'Online',
          lastSeen: 'Just now',
          color: 'bg-indigo-500'
        },
        {
          id: 'mem-host',
          name: 'Group Host',
          role: 'Host',
          sharing: true,
          battery: '91%',
          locationName: 'Tapovan Bus Terminal',
          distance: '1.2 km away',
          status: 'Online',
          lastSeen: 'Just now',
          color: 'bg-amber-500'
        }
      ]
    };

    setGroup(newGroup);
  };

  // Add Member
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || !group) return;

    const colors = ['bg-rose-500', 'bg-blue-500', 'bg-teal-500', 'bg-orange-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const updatedMembers = [
      ...group.members,
      {
        id: `mem-${Date.now()}`,
        name: newMemberName.trim(),
        role: newMemberRole,
        sharing: true,
        battery: '90%',
        locationName: 'Ramkund Pilgrim Area',
        distance: 'Nearby',
        status: 'Online',
        lastSeen: 'Just now',
        color: randomColor
      }
    ];

    setGroup({ ...group, members: updatedMembers });
    setNewMemberName('');
    setShowAddMember(false);
  };

  // Copy Code to Clipboard
  const handleCopyCode = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Broadcast Message
  const handleSendBroadcast = (presetText = null) => {
    const textToSend = presetText || customMsgInput.trim();
    if (!textToSend) return;

    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: presetText?.includes('SOS') ? 'sos' : 'info'
    };

    setMessages([newMsg, ...messages]);
    if (!presetText) setCustomMsgInput('');
  };

  // Leave Group
  const handleLeaveGroup = () => {
    if (window.confirm('Are you sure you want to leave / disband this family group?')) {
      setGroup(null);
      setMessages([]);
      setActiveView('welcome');
    }
  };

  // Toggle Member Location Sharing
  const toggleMemberSharing = (id) => {
    if (!group) return;
    const updated = group.members.map(m => {
      if (m.id === id) return { ...m, sharing: !m.sharing };
      return m;
    });
    setGroup({ ...group, members: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            👨‍👩‍👧‍👦
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-indigo-500/30 px-3 py-0.5 rounded-full text-[11px] font-bold text-indigo-100 mb-1 border border-indigo-200/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Opt-In Encrypted Family Safety Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('familyGroup')}</h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-0.5">
              {t('familyGroupDesc') || 'Real-time Opt-In Family Coordination, Emergency Meeting Point & SOS Broadcasts'}
            </p>
          </div>
        </div>

        {group && (
          <button
            onClick={handleLeaveGroup}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow border border-red-400/40 flex items-center space-x-1.5 self-start sm:self-auto transition-transform hover:scale-102 z-10"
          >
            <LogOut className="w-4 h-4" />
            <span>Leave Group</span>
          </button>
        )}
      </div>

      {/* Strict Voluntary Privacy Notice Banner */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 space-y-2 text-xs text-emerald-950 shadow-sm">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-900 font-bold text-sm">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{t('privacyTitle') || 'Strict Privacy & 100% Voluntary Location Control'}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {t('privacyNotice')} Location sharing is <strong>100% opt-in, encrypted, and private</strong> to your group. No location data is stored or shared with external servers. You can toggle off location sharing at any time.
        </p>
      </div>

      {/* VIEW 1: WELCOME SELECTOR (Create or Join) */}
      {!group && activeView === 'welcome' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Group Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-lg space-y-4 flex flex-col justify-between hover:border-indigo-400 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
                ➕
              </div>
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">{t('createGroup')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Create a new private family group for Nashik Kumbh Mela. Get a unique 6-digit share code to invite family, elderly relatives, and companions.
              </p>
            </div>

            <button
              onClick={() => setActiveView('create')}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-transform hover:scale-102"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Family Group</span>
            </button>
          </div>

          {/* Join Group Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-lg space-y-4 flex flex-col justify-between hover:border-purple-400 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
                🔑
              </div>
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">{t('joinGroup')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Have a 6-digit share code (e.g. KUMBH-784921) from your family host? Enter the code to join their private group instantly.
              </p>
            </div>

            <button
              onClick={() => setActiveView('join')}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-transform hover:scale-102"
            >
              <Users className="w-4 h-4" />
              <span>Join Group With Code</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: CREATE GROUP FORM */}
      {!group && activeView === 'create' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-xl space-y-5 animate-fade-in">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-indigo-900 border-b border-slate-100 pb-3">
            <UserPlus className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold tracking-tight">{t('createGroup')}</h3>
          </div>

          <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Your Name (Host):</label>
              <input
                type="text"
                required
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Family Group Name (Optional):</label>
              <input
                type="text"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                placeholder="e.g. Sharma Family Pilgrimage 2026"
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('welcome')}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-transform hover:scale-101"
              >
                Generate Code & Start Group
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: JOIN GROUP FORM */}
      {!group && activeView === 'join' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-xl space-y-5 animate-fade-in">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-purple-900 border-b border-slate-100 pb-3">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold tracking-tight">{t('joinGroup')}</h3>
          </div>

          <form onSubmit={handleJoinGroupSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Enter 6-Digit Group Code:</label>
              <input
                type="text"
                required
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="e.g. KUMBH-784921"
                className="w-full p-3.5 bg-purple-50/60 border border-purple-300 rounded-2xl text-base font-mono font-bold uppercase text-purple-950 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Your Name:</label>
              <input
                type="text"
                required
                value={memberNameInput}
                onChange={(e) => setMemberNameInput(e.target.value)}
                placeholder="e.g. Anjali Sharma"
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('welcome')}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-transform hover:scale-101"
              >
                Join Family Group
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 4: ACTIVE GROUP DASHBOARD */}
      {group && (
        <div className="space-y-6">
          {/* Active Group Code & Share Banner */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                  Active Travel Group
                </span>
                <h3 className="text-xl font-bold text-slate-950 mt-1">{group.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Host: <strong>{group.host}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-indigo-50 border-2 border-indigo-300 px-4 py-2 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Group Code</span>
                  <span className="text-base font-mono font-bold text-indigo-700">{group.code}</span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow flex items-center space-x-1.5 transition-transform hover:scale-102"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join our Nashik Kumbh Mela family group with code: ${group.code}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow flex items-center space-x-1.5 transition-transform hover:scale-102"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Master Privacy Location Toggle */}
            <div className="flex items-center justify-between bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 text-xs">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Radio className={`w-5 h-5 ${isSharingLoc ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-slate-900 block">
                    My Location Sharing: {isSharingLoc ? '🟢 ACTIVE (Sharing with Family)' : '🔴 PAUSED (Private)'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    You can toggle your location visibility on or off anytime.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsSharingLoc(!isSharingLoc)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow ${
                  isSharingLoc 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-slate-300 text-slate-800 hover:bg-slate-400'
                }`}
              >
                {isSharingLoc ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Emergency Rendezvous Meeting Point Section */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-300/40 pb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <MapPin className="w-6 h-6 text-amber-200" />
                <div>
                  <h4 className="font-bold text-lg">Designated Family Rendezvous / Meeting Point</h4>
                  <p className="text-xs text-amber-100 font-medium">Agree on a safe landmark to assemble if separated in crowds</p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(meetingPoint + ', Nashik')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white text-amber-950 hover:bg-amber-100 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 self-start sm:self-auto transition-transform hover:scale-102"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                <span>Navigate To Meeting Point</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                className="flex-1 p-3 bg-white/20 backdrop-blur-md text-white font-bold text-xs rounded-2xl border border-white/30 outline-none"
              >
                <option value="Ramkund Main Clock Tower Gate #2" className="text-slate-900">Ramkund Main Clock Tower Gate #2</option>
                <option value="Tapovan Satellite Bus Shelter #3" className="text-slate-900">Tapovan Satellite Bus Shelter #3</option>
                <option value="Kalaram Temple North Entry Gate" className="text-slate-900">Kalaram Temple North Entry Gate</option>
                <option value="Panchavati Police Control Room HQ" className="text-slate-900">Panchavati Police Control Room HQ</option>
                <option value="Trimbakeshwar Temple Main Gate #1" className="text-slate-900">Trimbakeshwar Temple Main Gate #1</option>
              </select>
            </div>
          </div>

          {/* Group Roster & Live Status Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-950 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Family Members ({group.members.length})</span>
              </h3>

              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="px-3 py-1.5 bg-indigo-100 text-indigo-900 hover:bg-indigo-200 font-bold text-xs rounded-xl border border-indigo-300 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            {/* Add Member Form Modal */}
            {showAddMember && (
              <form onSubmit={handleAddMember} className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row gap-3 text-xs animate-fade-in">
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Member Name (e.g. Sunita Devi)"
                  className="flex-1 p-2.5 bg-white border border-indigo-200 rounded-xl font-semibold outline-none"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="p-2.5 bg-white border border-indigo-200 rounded-xl font-semibold outline-none"
                >
                  <option value="Member">Family Member</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                  <option value="Child">Child / Youth</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow"
                >
                  Save Member
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.members.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-md space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className={`w-9 h-9 rounded-2xl ${mem.color} text-white font-bold flex items-center justify-center text-sm shadow`}>
                          {mem.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-950 leading-tight">{mem.name}</h4>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {mem.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-emerald-700 font-mono text-[11px] font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        <Battery className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{mem.battery}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        <span>{mem.locationName}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Distance: <strong className="text-indigo-900">{mem.distance}</strong></span>
                        <span className="text-emerald-700 font-semibold">{mem.lastSeen}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleMemberSharing(mem.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                        mem.sharing 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      Sharing: {mem.sharing ? 'ON' : 'OFF'}
                    </button>

                    <button
                      onClick={() => handleSendBroadcast(`🚨 Pinging ${mem.name}: Please check in with family!`)}
                      className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-bold text-[11px] rounded-lg flex items-center gap-1"
                    >
                      <span>Ping / Ring</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Emergency Broadcasts & Group Feed */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-md space-y-4">
            <h3 className="font-bold text-lg text-slate-950 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Family Quick Broadcast & Status Updates</span>
            </h3>

            {/* Quick Tap Buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleSendBroadcast('📍 I am waiting at the main entrance gate')}
                className="px-3 py-2 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200 font-bold rounded-xl"
              >
                📍 Waiting at main gate
              </button>
              <button
                onClick={() => handleSendBroadcast('🥤 At RO Water Kiosk near Ramkund')}
                className="px-3 py-2 bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 font-bold rounded-xl"
              >
                🥤 At RO Water Kiosk
              </button>
              <button
                onClick={() => handleSendBroadcast('🚌 Boarded Shuttle Bus to Parking')}
                className="px-3 py-2 bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 font-bold rounded-xl"
              >
                🚌 Boarded Shuttle Bus
              </button>
              <button
                onClick={() => handleSendBroadcast('🚨 SOS! I need help / separated in crowd')}
                className="px-3 py-2 bg-red-600 text-white hover:bg-red-700 font-bold rounded-xl shadow animate-pulse"
              >
                🚨 SOS Emergency Broadcast
              </button>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customMsgInput}
                onChange={(e) => setCustomMsgInput(e.target.value)}
                placeholder="Type a quick message for your family..."
                className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleSendBroadcast()}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow flex items-center space-x-1"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>

            {/* Message Roster Feed */}
            {messages.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 max-h-60 overflow-y-auto">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl text-xs flex justify-between items-start ${
                      m.type === 'sos' 
                        ? 'bg-red-50 border border-red-300 text-red-950 font-bold' 
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-indigo-900 block">{m.sender}:</span>
                      <span>{m.text}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{m.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyGroup;
