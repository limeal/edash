import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import SortableHeader from "../ui/sortable-header";
import { updateFavoriteModule } from "@/actions/modules";

export const columns: ColumnDef<Module>[] = [
  {
    accessorKey: "favorite",
    header: ({ column }) => <SortableHeader column={column} title="F" />,
    cell: ({ row }) => (
      <Button
        className="mr-2 p-1 h-fit"
        variant="link"
        onClick={() =>
          updateFavoriteModule(row.original.moduleid, !row.getValue("favorite"))
        }
      >
        <Star size={16} fill={row.getValue("favorite") ? "gold" : "none"} />
      </Button>
    ),
    sortingFn: 'auto',
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={row.original.url || "#"}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "credits",
    header: ({ column }) => <SortableHeader column={column} title="Credits" />,
    cell: ({ row }) => <div>{row.getValue("credits")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "remote",
    header: ({ column }) => <SortableHeader column={column} title="Remote" />,
    cell: ({ row }) => <div>{row.getValue("remote") ? "Yes" : "No"}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => {
      const skills: string[] = row.getValue("skills");

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-2 py-1 text-xs h-fit"
              >
                {skills.length}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-md max-h-[350px] p-4 overflow-scroll" side="left">
              <ul className="flex flex-col gap-2 list-disc list-inside">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <SortableHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => (
      <div>
        {(
          (row.getValue("startDate") as Date) || new Date()
        ).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => <SortableHeader column={column} title="End Date" />,
    cell: ({ row }) => (
      <div>
        {((row.getValue("endDate") as Date) || new Date()).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "endRegistrationDate",
    header: ({ column }) => (
      <SortableHeader column={column} title="End Reg. Date" />
    ),
    cell: ({ row }) => (
      <div>
        {(
          (row.getValue("endRegistrationDate") as Date) || new Date()
        ).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      const project: Project | undefined = row.getValue("project");

      if (!project) return null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={project.url || "#"}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {project.name}
              </Link>
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-1 w-80 bg-white text-black p-2 shadow-md border-black" side="left">
              <span>Start Date: {project.startDate?.toLocaleString()}</span>
              <span>End Date: {project.endDate?.toLocaleString()}</span>
              <span>
                Total Days:{" "}
                {Math.floor(
                  (project.endDate.getTime() - project.startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "appointements",
    header: "Appointements",
    cell: ({ row }) => {
      const appointements: string[] = row.getValue("appointements");

      if (
        !appointements.length ||
        (appointements.length === 1 && appointements[0] === "")
      )
        return null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-2 py-1 text-xs h-fit"
              >
                {appointements.length}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="p-4" side="left">
              <ul className="flex flex-col gap-2 list-disc list-inside">
                {appointements.map((appointement) => (
                  <li key={appointement}>{appointement}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
