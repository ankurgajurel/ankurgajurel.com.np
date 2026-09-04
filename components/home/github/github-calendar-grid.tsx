interface ContributionDay {
  contributionCount: number;
  contributionLevel: string;
  date: string;
}
const levels: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export function GithubCalendarGrid({ weeks }: { weeks: ContributionDay[][] }) {
  return (
    <div
      className="flex w-full gap-[3px] [&>div]:flex [&>div]:min-w-0 [&>div]:flex-1 [&>div]:flex-col [&>div]:gap-[3px] [&_span]:aspect-square [&_span]:rounded-[2px] [&_span]:bg-border [@media(max-width:640px)]:gap-0.5 [@media(max-width:640px)]:[&>div]:gap-0.5 [&_[data-level='1']]:bg-[#c5d7ca] dark:[&_[data-level='1']]:bg-[#293f30] [&_[data-level='2']]:bg-[#9fbea9] dark:[&_[data-level='2']]:bg-[#3d6149] [&_[data-level='3']]:bg-[#739c83] dark:[&_[data-level='3']]:bg-[#628770] [&_[data-level='4']]:bg-[#4c775e] dark:[&_[data-level='4']]:bg-[#92b19b]"
      role="img"
      aria-label="github contributions over the last year; darker squares represent more contributions"
    >
      {weeks.map((week, index) => (
        <div key={index}>
          {week.map((day) => (
            <span
              key={day.date}
              data-level={levels[day.contributionLevel] || 0}
              title={`${day.contributionCount} contributions on ${day.date}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
