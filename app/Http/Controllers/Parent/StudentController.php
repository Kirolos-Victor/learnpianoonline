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
                    'preferredTime' => $student->preferred_time,
                    'instructor' => $student->instructor ? [
                        'id' => $student->instructor->id,
                        'name' => $student->instructor->name,
                    ] : null,
                    'createdAt' => $student->created_at->format('M j, Y'),
                ];
            }),
            'availableTimeSlots' => $this->getAvailableTimeSlots($user->timezone ?? 'UTC'),
            'availableDays' => $this->getAvailableDays(),
            'preferredTimezone' => config('app.preferred_timezone', 'UTC'),
        ]);
    }

    public function store(Request $request)
    {
        $availableDays = $this->getAvailableDays();

        $request->validate([
            'name' => 'required|string|max:255|min:2',
            'age' => 'required|integer|min:5|max:100',
            'hasPiano' => 'required|boolean',
            'dayOfWeek' => 'required|string|in:' . implode(',', $availableDays),
            'preferredTime' => 'required|string',
        ], [
            'name.required' => 'Student name is required.',
            'name.string' => 'Student name must be a valid text.',
            'name.max' => 'Student name cannot exceed 255 characters.',
            'name.min' => 'Student name must be at least 2 characters.',
            'age.required' => 'Student age is required.',
            'age.integer' => 'Student age must be a valid number.',
            'age.min' => 'Student age must be at least 5 years old.',
            'age.max' => 'Student age cannot exceed 100 years old.',
            'hasPiano.required' => 'Piano access selection is required.',
            'hasPiano.boolean' => 'Piano access must be yes or no.',
            'dayOfWeek.required' => 'Preferred day selection is required.',
            'dayOfWeek.in' => 'Please select a valid day from the available options.',
            'preferredTime.required' => 'Preferred time selection is required.',
        ]);

        $student = Auth::user()->students()->create([
            'name' => $request->name,
            'age' => $request->age,
            'has_piano' => $request->hasPiano,
            'day_of_week' => $request->dayOfWeek,
            'preferred_time' => $request->preferredTime,
        ]);

        return redirect()->route('parent.students')->with('success', 'Student added successfully!');
    }

    public function update(Request $request, Student $student)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        $availableDays = $this->getAvailableDays();

        $request->validate([
            'name' => 'required|string|max:255|min:2',
            'age' => 'required|integer|min:5|max:100',
            'hasPiano' => 'required|boolean',
            'dayOfWeek' => 'required|string|in:' . implode(',', $availableDays),
            'preferredTime' => 'required|string',
        ], [
            'name.required' => 'Student name is required.',
            'name.string' => 'Student name must be a valid text.',
            'name.max' => 'Student name cannot exceed 255 characters.',
            'name.min' => 'Student name must be at least 2 characters.',
            'age.required' => 'Student age is required.',
            'age.integer' => 'Student age must be a valid number.',
            'age.min' => 'Student age must be at least 5 years old.',
            'age.max' => 'Student age cannot exceed 100 years old.',
            'hasPiano.required' => 'Piano access selection is required.',
            'hasPiano.boolean' => 'Piano access must be yes or no.',
            'dayOfWeek.required' => 'Preferred day selection is required.',
            'dayOfWeek.in' => 'Please select a valid day from the available options.',
            'preferredTime.required' => 'Preferred time selection is required.',
        ]);

        $student->update([
            'name' => $request->name,
            'age' => $request->age,
            'has_piano' => $request->hasPiano,
            'day_of_week' => $request->dayOfWeek,
            'preferred_time' => $request->preferredTime,
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
        $preferredTimezone = config('app.preferred_timezone', 'UTC');
        $startTime = config('app.preferred_start_time', '17:00');
        $endTime = config('app.preferred_end_time', '03:00');

        // Generate time slots between start and end time
        $preferredTimeSlots = $this->generateTimeSlots($startTime, $endTime, $preferredTimezone);

        foreach ($preferredTimeSlots as $preferredTime) {
            // Create a datetime in the preferred timezone
            $preferredDateTime = Carbon::createFromFormat('H:i', $preferredTime, $preferredTimezone);

            // Convert to user's timezone for display
            $userDateTime = $preferredDateTime->setTimezone($userTimezone);

            $timeSlots[] = [
                'value' => $userDateTime->format('H:i'),
                'label' => $userDateTime->format('g:i A'),
                'preferredTime' => $preferredTime,
                'userTime' => $userDateTime->format('H:i'),
            ];
        }

        return $timeSlots;
    }

    /**
     * Generate time slots between start and end time
     */
    private function generateTimeSlots($startTime, $endTime, $timezone)
    {
        $timeSlots = [];
        $start = Carbon::createFromFormat('H:i', $startTime, $timezone);
        $end = Carbon::createFromFormat('H:i', $endTime, $timezone);

        // If end time is before start time, it means it goes to the next day
        if ($end->lessThan($start)) {
            $end->addDay();
        }

        $current = $start->copy();
        while ($current->lessThanOrEqualTo($end)) {
            $timeSlots[] = $current->format('H:i');
            $current->addMinutes(30); // 30-minute intervals
        }

        return $timeSlots;
    }

    /**
     * Get available days from environment configuration
     */
    private function getAvailableDays()
    {
        $availableDays = config('app.available_days', 'monday,tuesday,wednesday,thursday,friday,saturday,sunday');

        if (is_string($availableDays)) {
            // Try to decode as JSON first
            $decoded = json_decode($availableDays, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }

            // If not JSON, split by comma
            return array_map('trim', explode(',', $availableDays));
        }

        return is_array($availableDays) ? $availableDays : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    }

    /**
     * Convert student's preferred time to the preferred timezone for scheduling
     */
    public function convertToPreferredTimezone($userTime, $userTimezone)
    {
        $preferredTimezone = config('app.preferred_timezone', 'UTC');

        $userDateTime = Carbon::createFromFormat('H:i', $userTime, $userTimezone);
        $preferredDateTime = $userDateTime->setTimezone($preferredTimezone);

        return $preferredDateTime->format('H:i:s');
    }
}
