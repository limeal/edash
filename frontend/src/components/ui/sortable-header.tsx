import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function SortableHeader<T>({
    column,
    title,
}: {
    column: Column<T, unknown>;
    title: string;
}) {
    const canBeSort = column.getCanSort();
    const sortDirection = column.getIsSorted();
    //const nextSortDirection = column.getNextSortingOrder();

    if (!canBeSort) return title;

    return (
        <button
            className='flex items-center gap-1'
            onClick={() => column.toggleSorting(undefined, true)}
        >
            {title}
            {sortDirection && sortDirection === 'asc' && (
                <ArrowDown className='h-4 w-4' />
            )}
            {sortDirection && sortDirection === 'desc' && (
                <ArrowUp className='h-4 w-4' />
            )}
        </button>
    );
}