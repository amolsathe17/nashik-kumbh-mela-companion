import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Shield, Share2, Copy, Check, Lock, MapPin, UserPlus } from 'lucide-react';

const FamilyGroup = () => {
  const { t } = useLanguage();
  const [groupCode, setGroupCode] = useState('');
  const [joinedGroup, setJoinedGroup] = useState(null);
  const [copied, setCopied] = useState(false);
  const [meetingPoint, setMeetingPoint] = useState('');
  const [isSharingLoc, setIsSharingLoc] = useState(false);

  const handleCreateGroup = () => {
    const newCode = 'KUMBH-' + Math.floor(100000 + Math.random() * 900000);
    setGroupCode(newCode);
    setJoinedGroup({
      code: newCode,
      name: t('groupDefaultName') || "Sharma Family Pilgrimage Group",
      members: [
        { name: t('youHost') || "You (Group Host)", role: "Host", sharing: isSharingLoc },
        { name: "Priya Sharma", role: "Member", sharing: true },
        { name: "Grandpa Ramesh", role: "Member", sharing: true }
      ]
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-3xl shadow-lg flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          👨‍👩‍👧‍👦
        </div>
        <div>
          <h2 className="text-2xl font-black">{t('familyGroup')}</h2>
          <p className="text-xs text-indigo-100 font-medium">
            {t('familyGroupDesc') || 'Opt-In Private Family & Companion Coordination'}
          </p>
        </div>
      </div>

      {/* Strict Privacy Banner Requirement */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 space-y-2 text-xs text-emerald-950">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-900 font-bold text-sm">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>{t('privacyTitle') || 'Strict Privacy & Voluntary Location Control'}</span>
        </div>
        <p className="leading-relaxed">
          {t('privacyNotice')} {t('privacySubText') || 'Location data is never stored on public servers or shared with third parties. You can stop sharing anytime with one tap.'}
        </p>
      </div>

      {/* Group Action Buttons */}
      {!joinedGroup ? (
        <div className="bg-white rounded-3xl p-6 border border-indigo-200 shadow-md space-y-4 text-center">
          <h3 className="font-bold text-lg text-gray-900">{t('coordinateWithFamily') || 'Coordinate With Family & Elderly Members'}</h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            {t('coordinateDesc') || 'Create a private travel group to keep track of family members in large crowds and agree on meeting points.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleCreateGroup}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('createGroup')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Group Card */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{t(joinedGroup.name)}</h3>
                <p className="text-xs text-gray-500">{t('groupCode')}: <span className="font-mono font-bold text-indigo-700">{joinedGroup.code}</span></p>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-indigo-200"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (t('copied') || 'Copied!') : (t('shareCode') || 'Share Code')}</span>
              </button>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-gray-800">{t('shareMyLocation') || 'Share My Location With Group'}</span>
              </div>
              <button
                onClick={() => setIsSharingLoc(!isSharingLoc)}
                className={`px-3 py-1 rounded-full font-bold text-[11px] transition-colors ${
                  isSharingLoc ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {isSharingLoc ? (t('on') || 'ON') : (t('off') || 'OFF')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyGroup;
