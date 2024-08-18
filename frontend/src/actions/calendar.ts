import { addWeeks, format, parseISO } from "date-fns";

function isDateEqual(dateUtc1: string, dateUtc2: string) {
    return format(parseISO(dateUtc1), "yyyy-MM-dd") === format(parseISO(dateUtc2), "yyyy-MM-dd");
}

export async function getGroupWeeks(): Promise<Record<string, WeekGroup>> {
    const datesGroupA = [{ from: new Date("2024-09-02T12:00:00.000Z"), to: new Date("2024-09-06T12:00:00.000Z") }]; // Repeat every 3 weeks
    const datesGroupB = [{ from: new Date("2024-09-09T12:00:00.000Z"), to: new Date("2024-09-13T12:00:00.000Z") }];
    const datesGroupC = [{ from: new Date("2024-09-16T12:00:00.000Z"), to: new Date("2024-09-20T12:00:00.000Z") }];

    let lastDateStart = datesGroupA[0].from;
    let lastDateEnd = datesGroupA[0].to;
    let skippedWeeks = [
        new Date("2024-10-14T12:00:00.000Z"),
        new Date("2024-10-28T12:00:00.000Z"),
        new Date("2024-12-09T12:00:00.000Z"),
        new Date("2024-12-16T12:00:00.000Z"),
        new Date("2024-12-23T12:00:00.000Z"),
        new Date("2024-12-30T12:00:00.000Z"),
        new Date("2025-01-20T12:00:00.000Z")
    ];

    for (
        let currentWeek = 0;
        lastDateEnd < new Date("2025-03-01T12:00:00.000Z");
        lastDateStart = addWeeks(lastDateStart, 1),
        lastDateEnd = addWeeks(lastDateEnd, 1)
    ) {

        if (skippedWeeks.some((skippedWeek) => isDateEqual(lastDateStart.toISOString(), skippedWeek.toISOString())))
            continue;
        

        switch (currentWeek) {
            case 0:
                datesGroupA.push({ from: lastDateStart, to: lastDateEnd });
                break;
            case 1:
                datesGroupB.push({ from: lastDateStart, to: lastDateEnd });
                break;
            case 2:
                datesGroupC.push({ from: lastDateStart, to: lastDateEnd });
                break;
        }

        currentWeek = (currentWeek + 1) % 3;
    }

    return {
        weekGroupA: {
            dates: datesGroupA,
            className: "bg-blue-200",
            title: "Week A",
        },
        weekGroupB: {
            dates: datesGroupB,
            className: "bg-green-200",
            title: "Week B",
        },
        weekGroupC: {
            dates: datesGroupC,
            className: "bg-yellow-200",
            title: "Week C",
        },
        warmupDays: {
            dates: [{ from: new Date(2024, 9, 17, 12), to: new Date(2024, 9, 18, 12) }],
            className: "bg-red-200",
            title: "Warmup Days",
        },
        e2: {
            dates: [{ from: new Date(2025, 0, 23, 12), to: new Date(2025, 0, 24, 12) }],
            className: "bg-red-400",
            title: "Epitech Experience",
        },
    }
}