import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { Award, Crown, FileText, Star, Target, Zap } from 'lucide-react';

interface SubscriptionBenefitsProps {
    studentName: string;
    studentSlug: string;
}

const SubscriptionBenefits = ({ studentName, studentSlug }: SubscriptionBenefitsProps) => {
    const subscriptionBenefits = [
        {
            icon: Crown,
            title: 'Fun 1-on-1 Lessons',
            description: 'Learn with your own friendly teacher! 🎵',
            color: 'bg-fun-pink',
        },
        {
            icon: Target,
            title: 'Cool Songs to Learn',
            description: 'Play your favorite songs and discover new ones! 🎶',
            color: 'bg-fun-blue',
        },
        {
            icon: Award,
            title: 'Awesome Teachers',
            description: 'Learn from super nice and patient teachers! 👩‍🏫',
            color: 'bg-fun-yellow',
        },
        {
            icon: Zap,
            title: 'Flexible Times',
            description: 'Choose lesson times that work for you! ⏰',
            color: 'bg-fun-green',
        },
        {
            icon: Star,
            title: 'Earn Stars & Badges',
            description: 'Get rewards for practicing and learning! ⭐',
            color: 'bg-fun-purple',
        },
        {
            icon: FileText,
            title: 'Personalized Homework',
            description: 'Get custom practice assignments from your teacher! 📝',
            color: 'bg-fun-cyan',
        },
    ];

    const handleSubscribe = () => {
        router.visit(route('parent.subscription', { student: studentSlug }));
    };

    return (
        <div className="mx-auto max-w-4xl">
            <Card className="shadow-float rounded-3xl border-fun-orange/30 bg-gradient-to-r from-fun-orange/10 to-fun-yellow/10">
                <CardHeader>
                    <CardTitle className="flex items-center font-fredoka text-3xl text-fun-orange">
                        <Crown className="mr-3 h-8 w-8" />
                        {studentName} needs a subscription! 👑
                    </CardTitle>
                    <CardDescription className="font-comic text-xl text-fun-orange/80">
                        Subscribe to get fun piano lessons with personalized homework assignments!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {subscriptionBenefits.map((benefit, index) => (
                            <div key={index} className="flex items-start space-x-4 rounded-2xl bg-white/50 p-4">
                                <div className={`rounded-full p-3 ${benefit.color} text-white`}>
                                    <benefit.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-fredoka text-xl text-fun-purple">{benefit.title}</h4>
                                    <p className="font-comic text-lg text-gray-700">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <Button
                            className="shadow-float animate-bounce-gentle rounded-full bg-fun-green px-10 py-4 font-comic text-2xl text-white hover:bg-fun-green-600"
                            onClick={handleSubscribe}
                        >
                            <Crown className="mr-3 h-6 w-6" />
                            🎹 Subscribe Now - discover our plans
                        </Button>
                        <p className="mt-3 font-comic text-lg text-fun-orange">4 fun lessons per month • Cancel anytime! 😊</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubscriptionBenefits;
