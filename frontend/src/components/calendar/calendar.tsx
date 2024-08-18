import { DateRange } from "react-day-picker";
import { Calendar as ShadcnCalendar } from "../ui/calendar";

export default async function Calendar({
  groups,
}: {
  groups: Record<string, WeekGroup>;
}) {
  return (
    <ShadcnCalendar
      numberOfMonths={7}
      disableNavigation
      modifiers={Object.entries(groups).reduce((acc, [key, value]) => {
        value.dates.forEach(({ from, to }, index) => {
          acc[`${key}_${index}`] = { from, to };
        });
        return acc;
      }, {} as Record<string, DateRange>)}
      modifiersClassNames={Object.entries(groups).reduce(
        (acc, [key, value]) => {
          value.dates.forEach((_, index) => {
            acc[`${key}_${index}`] = value.className;
          });
          return acc;
        },
        {} as Record<string, string>
      )}
    />
  );
}
