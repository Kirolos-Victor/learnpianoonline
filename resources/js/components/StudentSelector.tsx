import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Student {
    id: string;
    name: string;
    slug: string;
    age: number;
    hasPiano: boolean;
    isSubscribed: boolean;
    subscriptionType?: 'monthly' | 'yearly';
    subscriptionEndDate?: string;
    sessionsRemaining: number;
    instructor?: {
        id: string;
        name: string;
    };
}

interface StudentSelectorProps {
    students: Student[];
    selectedStudentSlug?: string;
    selectedStudent?: Student;
    onStudentChange: (studentSlug: string) => void;
    label?: string;
    placeholder?: string;
    showAvatar?: boolean;
}

const StudentSelector = ({
    students,
    selectedStudentSlug,
    selectedStudent,
    onStudentChange,
    label = 'Choose Your Student:',
    placeholder = 'Pick a student!',
    showAvatar = true,
}: StudentSelectorProps) => {
    if (students.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 md:mt-0">
            <Label className="mb-3 block font-comic text-lg font-bold text-white">{label}</Label>
            <Select value={selectedStudentSlug ? selectedStudent?.slug : ''} onValueChange={onStudentChange}>
                <SelectTrigger className="w-full rounded-2xl border-2 border-white/50 bg-white/90 backdrop-blur-sm md:w-72">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                    {students.map((student) => (
                        <SelectItem key={student.id} value={student.slug} className="rounded-xl">
                            <div className="flex items-center space-x-3">
                                {showAvatar && (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fun-purple font-comic text-sm text-white">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="font-comic">{student.name}</span>
                                {student.isSubscribed && <Badge className="bg-fun-green text-xs text-white">🎵 Active</Badge>}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default StudentSelector;
