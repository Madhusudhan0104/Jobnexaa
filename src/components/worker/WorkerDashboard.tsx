import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Star,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const WorkerDashboard: React.FC = () => {
  const {
    currentWorker,
    firebaseUser,
    toggleWorkerAvailability,
    hireRequests,
    acceptHireRequest,
    declineHireRequest,
    workerMarkWorkCompleted,
    jobs,
    applications,
    applyToJob,
    setSelectedJobId,
    setActiveWorkerTab,
  } = useApp();

  // Pending request specifically for this worker
  const pendingRequest = hireRequests.find(
    (hr) =>
      (hr.workerId === currentWorker.id || (firebaseUser && hr.workerId === firebaseUser.uid)) &&
      hr.status?.toLowerCase() === 'pending'
  );

  // Active (Accepted or WorkCompleted) job for this worker
  const activeJob = hireRequests.find(
    (hr) =>
      (hr.workerId === currentWorker.id || (firebaseUser && hr.workerId === firebaseUser.uid)) &&
      (hr.status === 'Accepted' || hr.status === 'WorkCompleted')
  );

  // Recommended jobs based on primarySkill
  const recommendedJobs = jobs.filter(
    (j) => j.status === 'Open' && (j.skillCategory === currentWorker.primarySkill || j.area === currentWorker.area)
  );

  // My applications
  const myApplications = applications.filter((a) => a.workerId === currentWorker.id);

  const isAvailable = currentWorker.availabilityStatus === 'available';
  const isHired = currentWorker.availabilityStatus === 'hired';

  return (
    <div className="space-y-4 pb-6">
      
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={currentWorker.avatar}
            alt={currentWorker.name}
            className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Hello, {currentWorker.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{currentWorker.primarySkill}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {currentWorker.area}, {currentWorker.city}
              </span>
              <span>·</span>
              <span className="flex items-center font-medium text-slate-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                {currentWorker.rating} ({currentWorker.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Quick wage display */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <span className="text-xs text-slate-500">Expected Wage</span>
          <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
            ₹{currentWorker.expectedWage} / {currentWorker.wageType}
          </span>
        </div>
      </div>

      {/* Availability Status Card */}
      <div className={`rounded-xl p-4 sm:p-5 border transition-all ${
        isHired
          ? 'bg-amber-50/70 border-amber-200/80'
          : isAvailable
          ? 'bg-emerald-50/60 border-emerald-200/80'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Work Availability
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 font-medium rounded ${
                  isHired
                    ? 'bg-amber-200/80 text-amber-900'
                    : isAvailable
                    ? 'bg-emerald-200/80 text-emerald-900'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {isHired ? 'Hired / In Progress' : isAvailable ? 'Available Now' : 'Off Duty'}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-md">
              {isHired
                ? 'Assigned to an active job. Mark as finished when complete to become available again.'
                : isAvailable
                ? 'Your profile is visible in local Bangalore employer search.'
                : 'Taking time off. Employers will not see you in live availability search.'}
            </p>
          </div>

          {!isHired && (
            <button
              onClick={() => toggleWorkerAvailability(currentWorker.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs shadow-xs transition-colors cursor-pointer ${
                isAvailable
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
              title="Click to toggle availability"
            >
              {isAvailable ? (
                <>
                  <ToggleRight className="w-4 h-4 text-emerald-200" />
                  <span>Available</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-slate-300" />
                  <span>Go Online</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Active Hire Request Banner (if any) */}
      {pendingRequest && (
        <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
                  New Hire Request
                </span>
                <h3 className="text-base font-bold leading-snug text-white">
                  {pendingRequest.jobTitle}
                </h3>
              </div>
            </div>
            <span className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-semibold shrink-0 tabular-nums">
              ₹{pendingRequest.proposedWage} / day
            </span>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/70 p-3 rounded-lg space-y-1 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-200">
              <span className="font-semibold">{pendingRequest.employerName}</span>
              <span>Start: {pendingRequest.startDate}</span>
            </div>
            <p className="line-clamp-2 text-slate-300 italic">"{pendingRequest.message}"</p>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{pendingRequest.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => acceptHireRequest(pendingRequest.id)}
              className="flex-1 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm py-2 px-4 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Accept Request
            </button>
            <button
              onClick={() => declineHireRequest(pendingRequest.id)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Active Job Card (when Hired) */}
      {activeJob && (
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                activeJob.status === 'WorkCompleted'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {activeJob.status === 'WorkCompleted'
                ? 'Work Completed · Awaiting Employer Conclusion'
                : 'Current Assignment (In Progress)'}
            </span>
            <span className="text-xs text-slate-500">
              Started: {activeJob.startDate}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {activeJob.jobTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Employer: {activeJob.employerName}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeJob.location}
                </span>
                <span>·</span>
                <span>Term: Ongoing (Days or Years)</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-slate-900 tabular-nums">
                ₹{activeJob.proposedWage}
              </span>
              <span className="text-[10px] text-slate-500 block">per day</span>
            </div>
          </div>

          {activeJob.status === 'WorkCompleted' ? (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Work submitted! Awaiting employer conclusion</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                You marked this work as completed. Your employer has been notified to inspect and conclude the assignment. Once concluded, your availability will reset to Available.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">
              When you have finished the tasks for this assignment, mark work complete. Your employer will review and conclude the assignment.
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <a
              href={`tel:${activeJob.employerPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              Call Employer
            </a>

            {activeJob.status === 'WorkCompleted' ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-100/80 px-3 py-2 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Pending Employer Conclusion</span>
              </div>
            ) : (
              <button
                onClick={() => workerMarkWorkCompleted(activeJob.id)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm py-2 px-3.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Work Complete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recommended Jobs Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Recommended Jobs
            </h2>
          </div>
          <button
            onClick={() => setActiveWorkerTab('jobs')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
          >
            Browse All ({jobs.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendedJobs.slice(0, 4).map((job) => {
            const hasApplied = applications.some(
              (a) => a.jobId === job.id && a.workerId === currentWorker.id
            );

            return (
              <div
                key={job.id}
                className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 shadow-xs transition-colors space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {job.skillCategory}
                    </span>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      ₹{job.payRate} / {job.payType}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedJobId(job.id)}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-700 cursor-pointer transition-colors mt-1.5 line-clamp-1"
                  >
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {job.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{job.area}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJobId(job.id)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      disabled={hasApplied}
                      onClick={() => applyToJob(job.id)}
                      className={`text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                        hasApplied
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Applications Section */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          My Applications ({myApplications.length})
        </h2>

        {myApplications.length === 0 ? (
          <div className="bg-white rounded-xl p-5 text-center border border-slate-200/80 text-slate-500 text-xs">
            No active job applications. Explore recommended openings above to apply.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {myApplications.map((app) => (
              <div key={app.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                    {app.jobTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Applied {app.appliedAt}</span>
                    <span>·</span>
                    <span>₹{app.expectedWage}/day</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    app.status === 'Accepted'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : app.status === 'Declined'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
