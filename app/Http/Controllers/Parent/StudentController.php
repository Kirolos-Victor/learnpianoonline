<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentController extends Controller
{
    public function index()
    {
        $students = Auth::user()->students()->with('instructor')->get();
        $user = Auth::user();

        return Inertia::render('parent/Students', [
            'students' => $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                    'age' => $student->age,
                    'hasPiano' => $student->has_piano,
                    'isSubscribed' => $student->is_subscribed,
                    'subscriptionType' => $student->subscription_expires_at ?
                        ($student->subscription_expires_at->diffInDays(now()) > 30 ? 'yearly' : 'monthly') : null,
                    'subscriptionEndDate' => $student->subscription_expires_at?->format('Y-m-d'),
                    'sessionsRemaining' => $student->sessions_remaining,
                    'dayOfWeek' => $student->day_of_week,
                    'preferredTimeCairo' => $student->preferred_time_cairo,
                    'instructor' => $student->instructor ? [
                        'id' => $student->instructor->id,
                        'name' => $student->instructor->name,
                    ] : null,
                    'createdAt' => $student->created_at->format('M j, Y'),
                ];
            }),
            'availableTimeSlots' => $this->getAvailableTimeSlots($user->timezone ?? 'UTC'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:1|max:100',
            'hasPiano' => 'required|boolean',
            'dayOfWeek' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'preferredTime' => 'required|string',
        ]);

        // Convert the selected time from user's timezone to Cairo time
        $cairoTime = $this->convertToCairoTime($request->preferredTime, Auth::user()->timezone ?? 'UTC');

        $student = Auth::user()->students()->create([
            'name' => $request->name,
            'age' => $request->age,
            'has_piano' => $request->hasPiano,
            'day_of_week' => $request->dayOfWeek,
            'preferred_time_cairo' => $cairoTime,
        ]);

        return redirect()->route('parent.students')->with('success', 'Student added successfully!');
    }

    public function update(Request $request, Student $student)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:1|max:100',
            'hasPiano' => 'required|boolean',
            'dayOfWeek' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'preferredTime' => 'required|string',
        ]);

        // Convert the selected time from user's timezone to Cairo time
        $cairoTime = $this->convertToCairoTime($request->preferredTime, Auth::user()->timezone ?? 'UTC');

        $student->update([
            'name' => $request->name,
            'age' => $request->age,
            'has_piano' => $request->hasPiano,
            'day_of_week' => $request->dayOfWeek,
            'preferred_time_cairo' => $cairoTime,
        ]);

        return redirect()->route('parent.students')->with('success', 'Student updated successfully!');
    }

    public function destroy(Student $student)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        $student->delete();

        return redirect()->route('parent.students')->with('success', 'Student deleted successfully!');
    }

    /**
     * Get available time slots converted to user's timezone
     */
    private function getAvailableTimeSlots($userTimezone)
    {
        $timeSlots = [];

        // Cairo time range: 17:00 (5:00 PM) to 03:00 (3:00 AM next day)
        $cairoTimeSlots = [
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30',
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00'
        ];

        foreach ($cairoTimeSlots as $cairoTime) {
            $cairoDateTime = Carbon::createFromFormat('H:i', $cairoTime, 'Africa/Cairo');
            $userDateTime = $cairoDateTime->setTimezone($userTimezone);

            $timeSlots[] = [
                'value' => $cairoTime,
                'label' => $userDateTime->format('g:i A'),
                'cairoTime' => $cairoTime,
                'userTime' => $userDateTime->format('H:i'),
            ];
        }

        return $timeSlots;
    }

    /**
     * Convert time from user's timezone to Cairo time
     */
    private function convertToCairoTime($userTime, $userTimezone)
    {
        $userDateTime = Carbon::createFromFormat('H:i', $userTime, $userTimezone);
        $cairoDateTime = $userDateTime->setTimezone('Africa/Cairo');

        return $cairoDateTime->format('H:i:s');
    }
}
