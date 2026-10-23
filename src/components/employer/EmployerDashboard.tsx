import React, { useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Phone,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { CITIES_AND_AREAS, SKILL_CATEGORIES } from '../../data/mockData.ts';
import { SkillCategory } from '../../types.ts';

export const EmployerDashboard: React.FC = () => {
  const {
    currentEmployer,
    getAvailabilityCount,
    jobs,
    hireRequests,
    applications,
    setApplicantsJobId,
    setIsPostJobOpen,
    setActiveEmployerTab,
    setSelectedJobId,
    setSelectedWorkerId,
    firebaseUser,
    employerConcludeWork,
  } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<SkillCategory>('Plumber');
  const [selectedArea, setSelectedArea] = useState<string>(currentEmployer.area);

  // Dynamic live count for this selected skill & area
  const liveCount = getAvailabilityCount(selectedSkill, 'Bangalore', selectedArea);

  // Status indicator based on threshold
  const countStatus = liveCount >= 3 ? 'High' : liveCount >= 1 ? 'Moderate' : 'Low';
  const statusColor =
    countStatus === 'High'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : countStatus === 'Moderate'
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

  // Employer's active job posts
  const myJobs = jobs.filter((j) => j.employerId === currentEmployer.id || (firebaseUser && j.employerId === firebaseUser.uid));
  const openJobs = myJobs.filter((j) => j.status === 'Open');

  // Recent hire requests sent by this employer
  const recentRequests = hireRequests.filter(
    (r) => r.employerId === currentEmployer.id || (firebaseUser && r.employerId === firebaseUser.uid)
  );

  // Active workforce assignments and pending work conclusions
  const activeEngagements = hireRequests.filter(
    (r) =>
      (r.employerId === currentEmployer.id || (firebaseUser && r.employerId === firebaseUser.uid)) &&
      (r.status === 'WorkCompleted' || r.status === 'Accepted')
  );

  const awaitingConclusion = activeEngagements.filter((r) => r.status === 'WorkCompleted');

  return (
    <div className="space-y-4 pb-6">
      
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={currentEmployer.logo}
            alt={currentEmployer.name}
            className="w-11 h-11 rounded-lg object-cover ring-1 ring-slate-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {currentEmployer.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentEmployer.businessType} · {currentEmployer.area}, Bangalore
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPostJobOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Hero Availability Stats Card - Refined Obsidian Slate */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Live Workforce Availability
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Workforce Supply in Bangalore
            </h2>
          </div>

          {/* Skill & Area Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value as SkillCategory)}
              className="bg-slate-800 text-white text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500 cursor-pointer"
            >
              {SKILL_CATEGORIES.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-slate-800 text-white text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500 cursor-pointer"
            >
              <option value="All Areas" className="bg-slate-900 text-white">
                All Bangalore
              </option>
              {CITIES_AND_AREAS.Bangalore.map((a) => (
                <option key={a} value={a} className="bg-slate-900 text-white">
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter Display */}
        <div className="bg-slate-800/80 rounded-xl p-4 sm:p-5 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {liveCount}
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">
                Available {selectedSkill}s Right Now
              </span>
              <span className="text-xs text-slate-400">
                in {selectedArea} · Ready for immediate booking
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${statusColor}`}
            >
              Supply: {countStatus}
            </span>

            <button
              onClick={() => setActiveEmployerTab('availability')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View Map</span>
            </button>

            <button
              onClick={() => setActiveEmployerTab('availability')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs py-2 px-3 rounded-lg border border-slate-700 transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Shortcut */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-600 flex-1">
          <Search className="w-4 h-4 text-slate-500" />
          <span>Looking to hire a specific tradesperson?</span>
        </div>
        <button
          onClick={() => setActiveEmployerTab('workers')}
          className="text-xs font-semibold text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Browse Directory →
        </button>
      </div>

      {/* Active Workforce & Conclude Work Section */}
      {activeEngagements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Active Engagements & Conclude Work ({activeEngagements.length})
            </h2>
            {awaitingConclusion.length > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                {awaitingConclusion.length} Waiting for your conclusion
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {activeEngagements.map((req) => {
              const isWorkDone = req.status === 'WorkCompleted';
              return (
                <div
                  key={req.id}
                  className={`rounded-xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                    isWorkDone
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={req.workerAvatar}
                      alt={req.workerName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">
                          {req.workerName}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                          {req.workerSkill}
                        </span>
                        {isWorkDone ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                            Worker Completed Work · Ready to Conclude
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Active in Progress
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1">
                        <strong>{req.jobTitle}</strong> · ₹{req.proposedWage}/day · {req.location}
                      </p>

                      {isWorkDone && (
                        <p className="text-[11px] text-amber-800 font-medium mt-1">
                          👉 The worker has marked this work complete. Conclude the assignment to release their status back to Available and leave a review.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => employerConcludeWork(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Conclude Work</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Job Posts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-700" />
            My Active Job Posts ({openJobs.length})
          </h2>

          <button
            onClick={() => setActiveEmployerTab('my-jobs')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
          >
            Manage All
          </button>
        </div>

        {openJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-slate-200/80 space-y-2">
            <Briefcase className="w-7 h-7 text-slate-300 mx-auto" />
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700">No active job posts</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Post an opening to match with verified skilled trades nearby.
            </p>
            <button
              onClick={() => setIsPostJobOpen(true)}
              className="text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 inline-block mt-1 cursor-pointer transition-colors"
            >
              Post a Job Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {openJobs.map((job) => {
              const jobApps = applications.filter((a) => a.jobId === job.id);
              const pendingCount = jobApps.filter((a) => a.status === 'Pending').length;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 shadow-xs transition-colors space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {job.skillCategory}
                      </span>
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        ₹{job.payRate} / {job.payType}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.area}
                      </span>
                      <span>·</span>
                      <span>{job.duration}</span>
                    </div>

                    {/* Progress of workers needed vs hired */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                        <span>Hiring progress:</span>
                        <span>
                          <strong>{job.workersHired}</strong> of {job.workersNeeded} hired
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(job.workersHired / job.workersNeeded) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{jobApps.length} Applicants</span>
                      {pendingCount > 0 && (
                        <span className="bg-amber-600 text-white text-[10px] font-semibold px-1.5 py-0.2 rounded-full">
                          {pendingCount} new
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setApplicantsJobId(job.id)}
                      className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Hire Activity */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Recent Hire Requests
        </h2>

        {recentRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-5 text-center border border-slate-200/80 text-xs text-slate-500">
            No hire requests sent yet. Search workers or inspect availability to send an offer.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {recentRequests.slice(0, 4).map((req) => (
              <div key={req.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={req.workerAvatar}
                    alt={req.workerName}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                      {req.workerName} ({req.workerSkill})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {req.jobTitle} · ₹{req.proposedWage}/day
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-right">
                  <div>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        req.status === 'WorkCompleted'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                          : req.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                          : req.status === 'Completed'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : req.status === 'Declined'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {req.status === 'WorkCompleted' ? 'Work Done · Conclude' : req.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {req.createdAt}
                    </span>
                  </div>

                  {(req.status === 'WorkCompleted' || req.status === 'Accepted') && (
                    <button
                      onClick={() => employerConcludeWork(req.id)}
                      className="text-xs font-semibold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Conclude this work assignment"
                    >
                      Conclude
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
