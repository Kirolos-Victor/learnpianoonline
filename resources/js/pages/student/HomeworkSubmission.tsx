import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import StudentLayout from '@/layouts/student-layout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, FileText, Mic, MicOff, Pause, Play, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface HomeworkSubmissionProps {
    studentId: string;
    lessonId: string;
    studentName: string;
    lessonNumber: number;
}

const HomeworkSubmission = ({ studentId, lessonId, studentName, lessonNumber }: HomeworkSubmissionProps) => {
    const [writtenResponse, setWrittenResponse] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setRecordedAudio(audioBlob);
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            // Handle microphone access error
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
        }
    };

    const playRecording = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const deleteRecording = () => {
        setRecordedAudio(null);
        setAudioUrl(null);
        setIsPlaying(false);
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
    };

    const handleSubmit = async () => {
        if (!writtenResponse.trim() && !recordedAudio) {
            alert('Please provide either a written response or a voice recording.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit homework logic here
            // In a real app, you would send this data to your backend
            setIsSubmitted(true);
        } catch (error) {
            // Handle submission error
            alert('Error submitting homework. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.visit('/lessons');
    };

    return (
        <StudentLayout>
            <div className="min-h-screen bg-background">
                <Head title="Homework Submission" />

                {/* Header */}
                <div className="bg-rainbow-gradient relative overflow-hidden px-6 py-12">
                    {/* Floating elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 left-10 animate-bounce-gentle text-3xl">📝</div>
                        <div className="absolute top-20 right-20 animate-bounce-gentle text-2xl" style={{ animationDelay: '0.5s' }}>
                            🎵
                        </div>
                        <div className="absolute bottom-20 left-20 animate-bounce-gentle text-2xl" style={{ animationDelay: '1s' }}>
                            ⭐
                        </div>
                        <div className="absolute right-10 bottom-10 animate-bounce-gentle text-3xl" style={{ animationDelay: '1.5s' }}>
                            🎹
                        </div>
                    </div>

                    <div className="relative z-10 container mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <Button variant="ghost" onClick={handleBack} className="mb-4 font-comic text-lg text-white hover:text-white/80">
                                    <ArrowLeft className="mr-2 h-5 w-5" />← Back to Lessons
                                </Button>
                                <h1 className="mb-3 font-fredoka text-4xl font-bold text-white drop-shadow-lg md:text-5xl">📝 Homework Time!</h1>
                                <p className="font-comic text-xl text-white/90">Complete your homework for Lesson {lessonNumber}</p>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-white/20 px-4 py-2 font-comic text-lg text-white backdrop-blur-sm">
                                    <Clock className="mr-2 h-5 w-5" />
                                    {studentName}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="mx-auto max-w-4xl space-y-8">
                        {/* Student Info */}
                        <Card className="shadow-float rounded-3xl border-fun-purple/20 bg-gradient-to-r from-fun-pink/10 to-fun-blue/10">
                            <CardHeader>
                                <CardTitle className="flex items-center font-fredoka text-3xl text-fun-purple">
                                    <FileText className="mr-3 h-8 w-8 text-fun-pink" />
                                    Lesson {lessonNumber} Homework
                                </CardTitle>
                                <CardDescription className="font-comic text-lg text-gray-600">
                                    Student: {studentName} • Lesson: {lessonNumber}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {isSubmitted ? (
                            /* Success Message */
                            <Card className="shadow-float rounded-3xl border-fun-green/30 bg-gradient-to-r from-fun-green/10 to-fun-blue/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center font-fredoka text-3xl text-fun-green">
                                        <CheckCircle className="mr-3 h-8 w-8" />
                                        🎉 Homework Submitted Successfully!
                                    </CardTitle>
                                    <CardDescription className="font-comic text-xl text-fun-green/80">
                                        Your homework for Lesson {lessonNumber} has been submitted. Great job! ⭐
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        onClick={handleBack}
                                        className="shadow-float rounded-full bg-fun-green px-8 py-4 font-comic text-xl text-white hover:bg-fun-green-600"
                                    >
                                        🎹 Return to Lessons
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Written Response */}
                                <Card className="shadow-float rounded-3xl bg-white/90 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="font-fredoka text-2xl text-fun-purple">✍️ Write About Your Lesson</CardTitle>
                                        <CardDescription className="font-comic text-lg text-gray-600">
                                            Tell us what you learned and any questions you have!
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="written-response" className="font-comic text-lg text-fun-purple">
                                                    Your Response:
                                                </Label>
                                                <Textarea
                                                    id="written-response"
                                                    placeholder="What did you learn today? What was fun? What was challenging? Any questions for your teacher? 🎵"
                                                    value={writtenResponse}
                                                    onChange={(e) => setWrittenResponse(e.target.value)}
                                                    rows={8}
                                                    className="mt-3 rounded-2xl border-2 border-fun-purple/20 font-comic text-lg focus:border-fun-purple"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Voice Recording */}
                                <Card className="shadow-float rounded-3xl bg-white/90 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="font-fredoka text-2xl text-fun-purple">🎤 Record Your Voice (Optional)</CardTitle>
                                        <CardDescription className="font-comic text-lg text-gray-600">
                                            Record your thoughts, questions, or play a song you've been practicing!
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {!recordedAudio ? (
                                                <div className="py-8 text-center">
                                                    <Button
                                                        onClick={isRecording ? stopRecording : startRecording}
                                                        className={`shadow-float rounded-full px-10 py-6 font-comic text-2xl transition-all duration-300 ${
                                                            isRecording
                                                                ? 'animate-pulse bg-fun-red text-white hover:bg-fun-red-600'
                                                                : 'bg-fun-blue text-white hover:scale-105 hover:bg-fun-blue-600'
                                                        }`}
                                                    >
                                                        {isRecording ? (
                                                            <>
                                                                <MicOff className="mr-3 h-6 w-6" />
                                                                🛑 Stop Recording
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Mic className="mr-3 h-6 w-6" />
                                                                🎤 Start Recording
                                                            </>
                                                        )}
                                                    </Button>
                                                    {isRecording && (
                                                        <p className="mt-4 font-comic text-lg text-fun-red">
                                                            🎙️ Recording in progress... Click "Stop Recording" when done!
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between rounded-2xl border border-fun-blue/30 bg-gradient-to-r from-fun-blue/20 to-fun-purple/20 p-6">
                                                        <div className="flex items-center space-x-4">
                                                            <FileText className="h-6 w-6 text-fun-blue" />
                                                            <span className="font-comic text-xl font-medium text-fun-blue">🎤 Voice Recording</span>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <Button
                                                                size="lg"
                                                                onClick={playRecording}
                                                                className="shadow-float rounded-full bg-fun-green px-6 py-3 font-comic text-lg text-white hover:bg-fun-green-600"
                                                            >
                                                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                                            </Button>
                                                            <Button
                                                                size="lg"
                                                                variant="outline"
                                                                onClick={deleteRecording}
                                                                className="rounded-full border-fun-red px-6 py-3 font-comic text-lg text-fun-red hover:text-fun-red-600"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {audioUrl && (
                                                        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Submit Button */}
                                <Card className="shadow-float rounded-3xl bg-gradient-to-r from-fun-green/10 to-fun-blue/10">
                                    <CardContent className="pt-8">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-comic text-xl text-gray-600">
                                                    {writtenResponse.trim() || recordedAudio
                                                        ? '🎉 Ready to submit your homework!'
                                                        : '📝 Please provide either a written response or voice recording'}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={(!writtenResponse.trim() && !recordedAudio) || isSubmitting}
                                                className="shadow-float rounded-full bg-fun-green px-10 py-6 font-comic text-2xl text-white transition-all duration-300 hover:scale-105 hover:bg-fun-green-600"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Clock className="mr-3 h-6 w-6 animate-spin" />
                                                        📤 Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="mr-3 h-6 w-6" />
                                                        📤 Submit Homework!
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default HomeworkSubmission;
