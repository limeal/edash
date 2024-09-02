"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function StudentCombobox({
    email,
    setEmail,
    students,
}: {
    email: string;
    setEmail: (value: string) => void;
    students: Student[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {email
            ? students.find((student) => student.email === email)?.fullname
            : "Select students..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search student..." />
          <CommandList>
            <CommandEmpty>No students found.</CommandEmpty>
            <CommandGroup>
              {students.map((student, index) => (
                <CommandItem
                  key={index}
                  value={student.email}
                  onSelect={(currentValue) => {
                    setEmail(currentValue === email ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      email === student.email ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {student.fullname}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
