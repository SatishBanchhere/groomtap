// components/labs/book-appointment-dialog.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"
import { Lab } from "@/types/lab"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function BookAppointmentDialog({
                                                  lab,
                                                  open,
                                                  onOpenChange
                                              }: {
    lab: Lab,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>()
    const [patientName, setPatientName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [age, setAge] = useState("")

    const availableTimeSlots = lab.schedules?.flatMap(schedule =>
        schedule.timeSlots
            .filter(slot => slot.status === 'Available')
            .map(slot => `${schedule.day} - ${slot.start} to ${slot.end}`)
    ) || []

    const handleSubmit = () => {
        // Here you would typically send the appointment data to your backend
        console.log({
            labId: lab.id,
            date: date ? format(date, 'dd/MM/yyyy') : '',
            timeSlot: selectedTimeSlot,
            patientName,
            phoneNumber,
            age
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Book Test at {lab.labName}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Available Time Slots</label>
                        <Select onValueChange={setSelectedTimeSlot}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTimeSlots.map(slot => (
                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Patient Name</label>
                        <Input
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="tel"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Age</label>
                            <Input
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                type="number"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Book Test
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
