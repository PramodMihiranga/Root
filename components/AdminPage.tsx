import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../services/firebaseErrorHandler';
import { Calendar, Users, Activity, Settings, TrendingUp, Key } from 'lucide-react';

interface AdminPageProps {
  currentExamDate: Date;
}

const AdminPage: React.FC<AdminPageProps> = ({ currentExamDate }) => {
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [stats, setStats] = useState<{ totalLogins: number, totalActiveUsers: number }>({
    totalLogins: 0,
    totalActiveUsers: 0
  });
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const statsRef = doc(db, 'stats', 'global');
    const unsub = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          totalLogins: data.totalLogins || 0,
          totalActiveUsers: data.totalActiveUsers || 0
        });
        setStatsError('');
      } else {
        // Document might not exist yet
        setStatsError('No stats gathered yet.');
      }
    }, (err) => {
      setStatsError('Access denied. You are not an admin.');
      console.error(err);
    });

    return () => unsub();
  }, []);

  const handleUpdateDate = async () => {
    if (!newDate) {
      setErrorMessage("Please enter a valid date.");
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    setErrorMessage('');

    try {
      const dateToSave = new Date(`${newDate}T08:30:00`).toISOString();
      const settingsRef = doc(db, 'settings', 'global');
      await setDoc(settingsRef, { examDate: dateToSave }, { merge: true });
      setSuccess(true);
      setNewDate('');
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
      } catch (e: any) {
        setErrorMessage("Access Denied: You must be an authorized admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      <header className="px-2">
        <h1 className="text-3xl md:text-6xl font-black font-outfit text-white tracking-tight flex items-center gap-4">
          <Settings className="w-10 h-10 md:w-16 md:h-16 text-slate-500" />
          Admin Ops
        </h1>
        <p className="text-slate-500 text-[8px] md:text-xs uppercase font-bold tracking-[0.4em] mt-2">
          Global Settings & Platform Analytics
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-0">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2rem] border border-blue-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            <h2 className="text-xl md:text-2xl font-black font-outfit text-white mb-6 flex items-center gap-3">
              <Key className="w-6 h-6 text-blue-400" />
              Event Timeline
            </h2>
            
            <div className="space-y-6 relative z-10">
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Target Deployment Date
                </label>
                <div className="text-2xl font-bold text-blue-400 font-mono-tech">
                  {currentExamDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
                  Override Timeline Target
                </label>
                <div className="flex flex-col gap-4">
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 font-mono-tech"
                  />

                  {errorMessage && (
                    <div className="text-red-400 text-xs font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      {errorMessage}
                    </div>
                  )}
                  
                  {success && (
                    <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                      Operation Successful: Timeline updated globally.
                    </div>
                  )}

                  <button
                    onClick={handleUpdateDate}
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                  >
                    {loading ? 'Transmitting...' : 'Commit Change'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-8 rounded-[2rem] border border-emerald-500/10 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            <h2 className="text-xl md:text-2xl font-black font-outfit text-white mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-emerald-400" />
              Global Telemetry
            </h2>
            
            <div className="space-y-6 relative z-10">
               {statsError ? (
                  <div className="text-red-400 text-xs font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    {statsError}
                  </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        Total Logins
                      </label>
                      <div className="text-4xl md:text-5xl font-black text-white font-mono-tech tracking-tighter">
                        {stats.totalLogins.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                        <Users className="w-3 h-3 text-blue-400" />
                        Active Sign-ups
                      </label>
                      <div className="text-4xl md:text-5xl font-black text-white font-mono-tech tracking-tighter">
                        {stats.totalActiveUsers.toLocaleString()}
                      </div>
                    </div>
                 </div>
               )}

               {/* Danger Zone */}
               {!statsError && (
                 <div className="pt-6 mt-6 border-t border-slate-800/50">
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to completely clear the telemetry data?")) {
                          try {
                            await setDoc(doc(db, 'stats', 'global'), {
                              totalLogins: 0,
                              totalActiveUsers: 0
                            });
                          } catch (e) {
                            setStatsError('Reset failed. Access Denied.');
                          }
                        }
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-colors w-full"
                    >
                      Reset Telemetry Data
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
