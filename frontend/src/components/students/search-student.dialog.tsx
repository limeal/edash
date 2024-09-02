"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { StudentCombobox } from "./student.combobox";

export function SearchStudentDialog({
  students,
  search,
}: {
  students: Student[];
  search: (email: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
    search(email);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Search Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <DialogHeader className="mb-4">
            <DialogTitle>Search Student</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="name">Student</Label>
            <StudentCombobox email={email} setEmail={setEmail} students={students} />
          </div>
          <DialogFooter>
            <Button type="submit">Search</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
