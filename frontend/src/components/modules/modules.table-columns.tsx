import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import SortableHeader from "../ui/sortable-header";

export const columns: ColumnDef<Module>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={row.original.url || "#"}
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
            <TooltipContent>
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
    header: ({ column }) => <SortableHeader column={column} title="Start Date" />,
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
    header: ({ column }) => <SortableHeader column={column} title="End Reg. Date" />,
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
            <TooltipContent className="flex flex-col gap-1 w-80 bg-white text-black p-2 shadow-md border-black">
              <span>Start Date: {project.startDate?.toLocaleDateString()}</span>
              <span>End Date: {project.endDate?.toLocaleDateString()}</span>
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
            <TooltipContent>
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
