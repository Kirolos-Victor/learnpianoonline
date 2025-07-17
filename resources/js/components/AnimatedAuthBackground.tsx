import { Heart, Music, Sparkles, Star } from 'lucide-react';
import React from 'react';

const AnimatedAuthBackground: React.FC = () => (
    <>
        <div className="pointer-events-none absolute inset-0">
            {/* Floating Music Notes */}
            <div className="animate-float-slow absolute top-20">
                <Music className="h-8 w-8 text-white/20" />
            </div>
            <div className="animate-float-medium absolute top-40 right-20">
                <Music className="h-6 w-6 text-white/30" />
            </div>
            <div className="animate-float-fast absolute bottom-32">
                <Music className="h-10 w-10 text-white/25" />
            </div>
            <div className="animate-float-slow absolute top-60 left-1/4">
                <Music className="h-7 w-7 text-white/15" />
            </div>
            <div className="animate-float-medium absolute right-1/4 bottom-20">
                <Music className="h-5 w-5 text-white/35" />
            </div>

            {/* Floating Stars */}
            <div className="animate-float-fast absolute top-32 right-10">
                <Star className="h-4 w-4 fill-current text-yellow-300" />
            </div>
            <div className="animate-float-slow absolute bottom-40 left-1/3">
                <Star className="h-6 w-6 fill-current text-yellow-200" />
            </div>
            <div className="animate-float-medium absolute top-80 right-1/4">
                <Star className="h-3 w-3 fill-current text-yellow-400" />
            </div>

            {/* Floating Hearts */}
            <div className="animate-float-medium absolute top-24 left-1/4">
                <Heart className="h-5 w-5 fill-current text-pink-300" />
            </div>
            <div className="animate-float-slow absolute right-16 bottom-60">
                <Heart className="h-4 w-4 fill-current text-pink-200" />
            </div>
            <div className="animate-float-fast absolute top-72">
                <Heart className="h-6 w-6 fill-current text-pink-400" />
            </div>

            {/* Floating Sparkles */}
            <div className="animate-float-fast absolute top-48 right-1">
                <Sparkles className="h-4 w-4 text-blue-300/40" />
            </div>
            <div className="animate-float-slow absolute bottom-32 left-1/4">
                <Sparkles className="h-5 w-5 text-blue-200/30" />
            </div>
            <div className="animate-float-medium absolute top-96 right-20">
                <Sparkles className="h-3 w-3 text-blue-400/35" />
            </div>

            {/* Additional Music Icons */}
            <div className="animate-float-slow absolute top-16 right-1/4">
                <div className="text-2xl text-white/20">♪</div>
            </div>
            <div className="animate-float-medium absolute bottom-48">
                <div className="text-xl text-white/25">♫</div>
            </div>
            <div className="animate-float-fast absolute top-32 left-1">
                <div className="text-3xl text-white/15">♩</div>
            </div>
            <div className="animate-float-slow absolute right-10 bottom-16">
                <div className="text-lg text-white/30">♬</div>
            </div>
        </div>
        <style>{`
      @keyframes float-slow {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
      }
      @keyframes float-medium {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(-3deg); }
      }
      @keyframes float-fast {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
      }
      .animate-float-slow {
        animation: float-slow 6s ease-in-out infinite;
      }
      .animate-float-medium {
        animation: float-medium 4s ease-in-out infinite;
      }
      .animate-float-fast {
        animation: float-fast 3s ease-in-out infinite;
      }
    `}</style>
    </>
);

export default AnimatedAuthBackground;
