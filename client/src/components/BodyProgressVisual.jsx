import { getThemeClasses } from '../utils/themeClasses.js';

export default function BodyProgressVisual({ rating, theme }) {
  const progress = Math.min(Math.max(Number(rating || 1), 1), 10);
  const percent = Math.round((progress / 10) * 100);
  const classes = getThemeClasses(theme);

  return (
    <div className={`rounded-2xl border p-6 ${classes.panel}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Goal Progress</h2>
          <p className={`mt-1 text-sm ${classes.muted}`}>
            Visual progress based on your latest check-in rating.
          </p>
        </div>
        <p className="text-2xl font-black text-pink-500">{percent}%</p>
      </div>

      <div className="mt-8 flex items-end justify-center gap-10">
        <div className="text-center">
          <div className="relative mx-auto h-44 w-20 overflow-hidden rounded-full bg-slate-300/40">
            <div
              className="absolute bottom-0 left-0 w-full bg-pink-400/70 transition-all duration-700"
              style={{ height: `${100 - percent}%` }}
            />
          </div>
          <p className={`mt-3 text-sm font-semibold ${classes.muted}`}>Starting Point</p>
        </div>

        <div className="text-center">
          <div className="relative mx-auto h-44 w-20 overflow-hidden rounded-full bg-slate-300/40">
            <div
              className="absolute bottom-0 left-0 w-full bg-emerald-400/80 transition-all duration-700"
              style={{ height: `${percent}%` }}
            />
          </div>
          <p className={`mt-3 text-sm font-semibold ${classes.muted}`}>Goal Shape</p>
        </div>
      </div>

      <div className="mt-8">
        <div className={`h-3 rounded-full ${classes.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div
            className="h-3 rounded-full bg-pink-500 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className={`mt-3 text-center text-sm ${classes.muted}`}>
          Latest progress rating: {progress}/10
        </p>
      </div>
    </div>
  );
}