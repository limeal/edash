import { getGroupWeeks } from "@/actions/calendar";
import Calendar from "@/components/calendar/calendar";
import clsx from "clsx";

export default async function Page() {
  const groups = await getGroupWeeks();

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-4 w-full justify-center">
        {Object.values(groups).map((group, index) => (
          <legend key={index} className={clsx(group.className, 'p-2')}>
            {group.title}
          </legend>
        ))}
      </div>
      <Calendar groups={groups} />
    </section>
  );
}
