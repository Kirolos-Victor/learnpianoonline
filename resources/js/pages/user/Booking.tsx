import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, User } from 'lucide-react';
import { useState } from 'react';

const Booking = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

    const instructors = [
        {
            id: 1,
            name: 'Sarah Johnson',
            specialties: ['Beginner', 'Classical', 'Jazz'],
            experience: '8 years',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b332fb94?w=150&h=150&fit=crop&crop=face',
        },
        {
            id: 2,
            name: 'Michael Chen',
            specialties: ['Advanced', 'Classical', 'Contemporary'],
            experience: '12 years',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        },
        {
            id: 3,
            name: 'Emma Rodriguez',
            specialties: ['Beginner', 'Pop', 'Music Theory'],
            experience: '6 years',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        },
    ];

    const availableDates = ['March 25, 2024', 'March 26, 2024', 'March 27, 2024', 'March 28, 2024', 'March 29, 2024'];

    const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    const handleBooking = () => {
        if (selectedDate && selectedTime && selectedInstructor) {
            console.log('Booking:', { selectedDate, selectedTime, selectedInstructor });
            // Handle booking logic here
        }
    };

    const isBookingComplete = selectedDate && selectedTime && selectedInstructor;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-piano-gradient px-6 py-8">
                <div className="container mx-auto">
                    <h1 className="mb-2 font-playfair text-3xl font-bold text-primary md:text-4xl">Book Your Live Lesson</h1>
                    <p className="text-muted-foreground">Schedule your 1-on-1 piano lesson with one of our expert instructors</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Booking Steps */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Step 1: Choose Instructor */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="text-gold mr-2 h-5 w-5" />
                                    Step 1: Choose Your Instructor
                                </CardTitle>
                                <CardDescription>Select an instructor based on your level and musical interests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {instructors.map((instructor) => (
                                        <div
                                            key={instructor.id}
                                            className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                                                selectedInstructor === instructor.name ? 'border-gold bg-gold/5' : 'border-border'
                                            }`}
                                            onClick={() => setSelectedInstructor(instructor.name)}
                                        >
                                            <div className="mb-3 flex items-center space-x-3">
                                                <img src={instructor.image} alt={instructor.name} className="h-12 w-12 rounded-full object-cover" />
                                                <div>
                                                    <h4 className="font-semibold">{instructor.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{instructor.experience} experience</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {instructor.specialties.map((specialty) => (
                                                    <Badge key={specialty} variant="outline" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 2: Choose Date */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="text-gold mr-2 h-5 w-5" />
                                    Step 2: Select Date
                                </CardTitle>
                                <CardDescription>Choose from available dates this week</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {availableDates.map((date) => (
                                        <Button
                                            key={date}
                                            variant={selectedDate === date ? 'default' : 'outline'}
                                            className={`h-auto p-3 ${selectedDate === date ? 'bg-gold hover:bg-gold/90 text-warm-brown' : ''}`}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            <div className="text-center">
                                                <div className="font-semibold">{date.split(',')[0]}</div>
                                                <div className="text-xs opacity-75">{date.split(',')[1]}</div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 3: Choose Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Clock className="text-gold mr-2 h-5 w-5" />
                                    Step 3: Select Time
                                </CardTitle>
                                <CardDescription>Pick your preferred lesson time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                                    {availableTimes.map((time) => (
                                        <Button
                                            key={time}
                                            variant={selectedTime === time ? 'default' : 'outline'}
                                            className={`${selectedTime === time ? 'bg-gold hover:bg-gold/90 text-warm-brown' : ''}`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Confirmation */}
                        {isBookingComplete && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-green-800">
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Ready to Book
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 space-y-2 text-green-700">
                                        <p>
                                            <span className="font-semibold">Instructor:</span> {selectedInstructor}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Date:</span> {selectedDate}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Time:</span> {selectedTime}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Duration:</span> 45 minutes
                                        </p>
                                    </div>
                                    <Button onClick={handleBooking} className="bg-green-600 text-white hover:bg-green-700">
                                        Confirm Booking
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Lesson Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between">
                                        <span>Duration</span>
                                        <span className="font-semibold">45 minutes</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Type</span>
                                        <span className="font-semibold">1-on-1 Live</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Platform</span>
                                        <span className="font-semibold">Zoom</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Cost</span>
                                        <span className="font-semibold text-green-600">Included</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Preparation Tips */}
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Lesson Preparation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li>• Have your piano/keyboard ready</li>
                                    <li>• Ensure stable internet connection</li>
                                    <li>• Review current homework</li>
                                    <li>• Prepare any questions</li>
                                    <li>• Good lighting on your hands/keys</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Cancellation Policy */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Policy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>
                                        <span className="font-semibold">Cancellation:</span> 24 hours notice required
                                    </p>
                                    <p>
                                        <span className="font-semibold">Rescheduling:</span> Free up to 4 hours before
                                    </p>
                                    <p>
                                        <span className="font-semibold">Late arrival:</span> Lesson time will be reduced
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Lessons */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Lessons</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="rounded-lg bg-muted p-3">
                                        <p className="text-sm font-semibold">March 25, 2:00 PM</p>
                                        <p className="text-xs text-muted-foreground">with Sarah Johnson</p>
                                    </div>
                                    <div className="text-center">
                                        <Button variant="outline" size="sm">
                                            View All Lessons
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
