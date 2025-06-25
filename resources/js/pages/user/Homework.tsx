import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, FileAudio, MessageCircle, Upload, Video } from 'lucide-react';
import { useState } from 'react';

const Homework = () => {
    const [newSubmission, setNewSubmission] = useState('');

    const currentAssignment = {
        title: 'C Major Scale Practice',
        description:
            'Practice the C major scale with both hands, focusing on smooth transitions and proper fingering. Record yourself playing it at 80 BPM.',
        dueDate: 'March 28, 2024',
        instruction:
            'Upload a video or audio recording of your practice session. Include any questions or challenges you faced in the notes section.',
    };

    const pastSubmissions = [
        {
            id: 1,
            title: 'Chord Progressions Exercise',
            submittedDate: 'March 20, 2024',
            status: 'reviewed',
            feedback:
                'Excellent work on the chord transitions! Your timing has improved significantly. For next time, focus on keeping your wrists relaxed during the C to F transition.',
            instructor: 'Sarah Johnson',
        },
        {
            id: 2,
            title: 'Beginner Scales',
            submittedDate: 'March 13, 2024',
            status: 'reviewed',
            feedback:
                'Good foundation! Your finger positioning is correct. Practice the scale ascending and descending more smoothly. Remember to curve your fingers.',
            instructor: 'Sarah Johnson',
        },
        {
            id: 3,
            title: 'Hand Position Exercises',
            submittedDate: 'March 6, 2024',
            status: 'reviewed',
            feedback:
                "Great start! You're maintaining proper posture. Work on keeping your fingers curved and relaxed. Practice in shorter sessions to avoid tension.",
            instructor: 'Sarah Johnson',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Homework submission:', newSubmission);
        setNewSubmission('');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-piano-gradient px-6 py-8">
                <div className="container mx-auto">
                    <h1 className="mb-2 font-playfair text-3xl font-bold text-primary md:text-4xl">Homework & Practice</h1>
                    <p className="text-muted-foreground">Submit your practice recordings and receive personalized feedback</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Current Assignment */}
                        <Card className="border-gold/50 bg-gold/5">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center">
                                        <Clock className="text-gold mr-2 h-5 w-5" />
                                        Current Assignment
                                    </CardTitle>
                                    <Badge className="bg-gold text-warm-brown">Due: {currentAssignment.dueDate}</Badge>
                                </div>
                                <CardDescription>{currentAssignment.title}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-muted-foreground">{currentAssignment.description}</p>
                                <div className="mb-6 rounded-lg bg-muted p-4">
                                    <h4 className="mb-2 font-semibold">Instructions:</h4>
                                    <p className="text-sm text-muted-foreground">{currentAssignment.instruction}</p>
                                </div>

                                {/* Upload Section */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="border-gold/30 hover:border-gold/50 rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                                        <Upload className="text-gold mx-auto mb-2 h-8 w-8" />
                                        <p className="mb-2 text-sm text-muted-foreground">Drop your audio/video files here or click to upload</p>
                                        <Button variant="outline" size="sm">
                                            Choose Files
                                        </Button>
                                        <div className="mt-3 flex justify-center space-x-4 text-xs text-muted-foreground">
                                            <span className="flex items-center">
                                                <FileAudio className="mr-1 h-3 w-3" />
                                                MP3, WAV
                                            </span>
                                            <span className="flex items-center">
                                                <Video className="mr-1 h-3 w-3" />
                                                MP4, MOV
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Notes & Questions (Optional)</label>
                                        <Textarea
                                            value={newSubmission}
                                            onChange={(e) => setNewSubmission(e.target.value)}
                                            placeholder="Share any challenges you faced or questions about this assignment..."
                                            rows={4}
                                        />
                                    </div>

                                    <Button type="submit" className="bg-gold hover:bg-gold/90 text-warm-brown">
                                        Submit Homework
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Past Submissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Submission History</CardTitle>
                                <CardDescription>Review your past assignments and instructor feedback</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {pastSubmissions.map((submission) => (
                                        <div key={submission.id} className="rounded-lg border p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <h4 className="font-semibold">{submission.title}</h4>
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <Badge variant="outline" className="border-green-600 text-green-600">
                                                        Reviewed
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="mb-3 text-sm text-muted-foreground">Submitted: {submission.submittedDate}</p>

                                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                                <div className="mb-2 flex items-center">
                                                    <MessageCircle className="mr-2 h-4 w-4 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-800">Feedback from {submission.instructor}</span>
                                                </div>
                                                <p className="text-sm text-blue-700">{submission.feedback}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Submission Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Submission Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start">
                                        <span className="text-gold mr-2">•</span>
                                        <span>Record in a quiet environment</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-gold mr-2">•</span>
                                        <span>Show your hands and keys if using video</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-gold mr-2">•</span>
                                        <span>Include multiple takes if needed</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-gold mr-2">•</span>
                                        <span>File size limit: 50MB</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-gold mr-2">•</span>
                                        <span>Submit by due date for timely feedback</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Feedback Stats */}
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="text-green-800">Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-green-700">Assignments completed</span>
                                        <span className="font-semibold text-green-800">12</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-green-700">Average score</span>
                                        <span className="font-semibold text-green-800">92%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-green-700">On-time submissions</span>
                                        <span className="font-semibold text-green-800">11/12</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Practice Tips */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recording Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Use your phone or computer's built-in recorder</li>
                                    <li>• Place device 2-3 feet away from piano</li>
                                    <li>• Practice a few times before recording</li>
                                    <li>• Don't worry about perfect recordings</li>
                                    <li>• Focus on demonstrating your progress</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homework;
