import { addWeeks } from "date-fns";

export async function getGroupWeeks(): Promise<Record<string, WeekGroup>> {
    const datesGroupA = [{ from: new Date(2024, 8, 2, 12), to: new Date(2024, 8, 6, 12) }]; // Repeat every 3 weeks
    const datesGroupB = [{ from: new Date(2024, 8, 9, 12), to: new Date(2024, 8, 13, 12) }];
    const datesGroupC = [{ from: new Date(2024, 8, 16, 12), to: new Date(2024, 8, 20, 12) }];

    let lastDateStart = datesGroupC[0].from;
    let lastDateEnd = datesGroupC[0].to;
    let skippedWeeks = ["14/10/2024", "28/10/2024", "09/12/2024", "16/12/2024", "23/12/2024", "30/12/2024", "20/01/2025"];
    for (let currentWeek = 0; lastDateEnd < new Date(2025, 1, 28, 12);) {
        lastDateStart = addWeeks(lastDateStart, 1);
        lastDateEnd = addWeeks(lastDateEnd, 1);

        if (skippedWeeks.includes(lastDateStart.toLocaleDateString())) 
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