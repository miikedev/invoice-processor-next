"use client"

import * as React from "react"

import { useQueryStates } from "nuqs"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { dateSearchParams } from "@/lib/search-params"
import { useRouter } from "next/router"


export function DatePicker() {
  const [{ date }, setDate] = useQueryStates(dateSearchParams)
  const [open, setOpen] = React.useState(false)
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(undefined)
  console.log('date in date picker', date)
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {calendarDate ? calendarDate.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={calendarDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              console.log('date in calender on select', date)
              setCalendarDate(date)
              setDate({date})
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
