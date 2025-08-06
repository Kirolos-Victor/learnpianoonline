import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Music, Star, User } from 'lucide-react';

const Blog = () => {
    const featuredPosts = [
        {
            id: 1,
            title: 'How to Choose the Right Piano for Online Lessons',
            excerpt: 'Discover the essential features to look for when selecting a piano or keyboard for your online piano learning journey.',
            category: 'Equipment',
            readTime: '5 min read',
            date: 'Jan 15, 2024',
            author: 'Sarah Johnson',
            slug: 'choose-right-piano-online-lessons',
            image: '/blog/piano-selection.jpg',
            featured: true,
        },
        {
            id: 2,
            title: '10 Essential Piano Exercises for Beginners',
            excerpt: 'Master these fundamental exercises to build finger strength, coordination, and musical foundation.',
            category: 'Beginner Tips',
            readTime: '8 min read',
            date: 'Jan 12, 2024',
            author: 'Michael Chen',
            slug: 'essential-piano-exercises-beginners',
            image: '/blog/piano-exercises.jpg',
            featured: true,
        },
        {
            id: 3,
            title: 'The Benefits of Live Online Piano Lessons vs. Pre-recorded Videos',
            excerpt: 'Why real-time instruction with a professional teacher makes all the difference in your learning journey.',
            category: 'Learning Tips',
            readTime: '6 min read',
            date: 'Jan 10, 2024',
            author: 'Emma Rodriguez',
            slug: 'live-online-piano-lessons-benefits',
            image: '/blog/live-lessons.jpg',
            featured: true,
        },
    ];

    const recentPosts = [
        {
            id: 4,
            title: 'How to Practice Piano Effectively at Home',
            excerpt: 'Maximize your practice time with these proven techniques used by professional pianists.',
            category: 'Practice Tips',
            readTime: '7 min read',
            date: 'Jan 8, 2024',
            author: 'David Kim',
            slug: 'practice-piano-effectively-home',
        },
        {
            id: 5,
            title: 'Understanding Piano Posture and Hand Position',
            excerpt: 'Learn the correct posture and hand positioning to prevent injury and improve performance.',
            category: 'Technique',
            readTime: '5 min read',
            date: 'Jan 5, 2024',
            author: 'Lisa Wang',
            slug: 'piano-posture-hand-position',
        },
        {
            id: 6,
            title: 'Top 5 Classical Pieces Every Piano Student Should Learn',
            excerpt: 'Discover the essential classical compositions that will enhance your musical education.',
            category: 'Music Theory',
            readTime: '6 min read',
            date: 'Jan 3, 2024',
            author: 'Robert Martinez',
            slug: 'classical-pieces-piano-students',
        },
    ];

    const categories = [
        { name: 'Beginner Tips', count: 12, color: 'bg-fun-blue' },
        { name: 'Practice Tips', count: 8, color: 'bg-fun-green' },
        { name: 'Equipment', count: 6, color: 'bg-fun-orange' },
        { name: 'Music Theory', count: 10, color: 'bg-fun-purple' },
        { name: 'Technique', count: 7, color: 'bg-fun-pink' },
        { name: 'Learning Tips', count: 9, color: 'bg-fun-blue' },
    ];

    return (
        <AppLayout>
            <Head>
                <title>Piano Learning Tips for Kids - Fun Piano Resources | Learn Piano Online</title>
                <meta
                    name="description"
                    content="Fun piano learning tips and resources for kids! Discover beginner guides, practice games, equipment advice, and fun activities to help your child learn piano. Perfect for ages 5+!"
                />
                <meta
                    name="keywords"
                    content="piano tips for kids, piano practice for children, piano learning resources kids, piano activities for kids, kids piano practice methods, fun piano learning, children piano tips"
                />
                <meta property="og:title" content="Piano Learning Tips for Kids - Fun Piano Resources | Learn Piano Online" />
                <meta
                    property="og:description"
                    content="Fun piano learning tips and resources for kids! Discover beginner guides, practice games, and fun activities to help your child learn piano."
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Piano Learning Tips for Kids - Fun Piano Resources" />
                <meta
                    name="twitter:description"
                    content="Fun piano learning tips and resources for kids! Discover beginner guides, practice games, and fun activities."
                />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="bg-piano-gradient px-6 py-16">
                    <div className="container mx-auto text-center">
                        <h1 className="mb-4 font-fredoka text-4xl font-bold text-fun-purple md:text-5xl">Fun Piano Tips for Kids! 🎹✨</h1>
                        <p className="mx-auto max-w-3xl font-comic text-xl text-gray-700">
                            Fun tips, games, and activities to help kids learn piano! Discover exciting ways to practice and improve your musical
                            skills.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Featured Posts */}
                            <section className="mb-12">
                                <h2 className="font-playfair mb-8 text-3xl font-bold text-primary">Featured Articles</h2>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {featuredPosts.map((post) => (
                                        <Card
                                            key={post.id}
                                            className="shadow-float overflow-hidden rounded-3xl border-0 bg-white transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-fun-blue/20 to-fun-purple/20 p-8">
                                                <Music className="h-12 w-12 text-fun-blue" />
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="rounded-full bg-fun-blue/10 px-3 py-1 text-sm font-medium text-fun-blue">
                                                        {post.category}
                                                    </span>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        {post.readTime}
                                                    </div>
                                                </div>
                                                <h3 className="font-playfair mb-3 text-xl font-semibold text-primary transition-colors hover:text-fun-blue">
                                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                                </h3>
                                                <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <User className="mr-1 h-3 w-3" />
                                                        {post.author}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        {post.date}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>

                            {/* Recent Posts */}
                            <section>
                                <h2 className="font-playfair mb-8 text-3xl font-bold text-primary">Recent Articles</h2>
                                <div className="space-y-6">
                                    {recentPosts.map((post) => (
                                        <Card key={post.id} className="overflow-hidden border-fun-purple/20">
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                                    <div className="aspect-video rounded-lg bg-gradient-to-br from-fun-green/20 to-fun-orange/20 p-4 md:aspect-square">
                                                        <Music className="h-8 w-8 text-fun-green" />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <span className="rounded-full bg-fun-green/10 px-3 py-1 text-sm font-medium text-fun-green">
                                                                {post.category}
                                                            </span>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                {post.readTime}
                                                            </div>
                                                        </div>
                                                        <h3 className="font-playfair mb-3 text-xl font-semibold text-primary transition-colors hover:text-fun-blue">
                                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                                        </h3>
                                                        <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <User className="mr-1 h-3 w-3" />
                                                                {post.author}
                                                            </div>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <Calendar className="mr-1 h-3 w-3" />
                                                                {post.date}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Categories */}
                            <Card className="mb-8 border-fun-purple/20">
                                <CardContent className="p-6">
                                    <h3 className="font-playfair mb-4 text-xl font-semibold text-primary">Categories</h3>
                                    <div className="space-y-3">
                                        {categories.map((category, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`mr-3 h-3 w-3 rounded-full ${category.color}`} />
                                                    <span className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-fun-blue">
                                                        {category.name}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">({category.count})</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Newsletter Signup */}
                            <Card className="bg-fun-gradient border-0">
                                <CardContent className="p-6 text-center">
                                    <Star className="mx-auto mb-4 h-12 w-12 text-fun-orange" />
                                    <h3 className="font-playfair mb-3 text-xl font-semibold text-primary">Stay Updated!</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Get the latest piano tips and learning resources delivered to your inbox.
                                    </p>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center rounded-full bg-fun-blue px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-fun-blue-600"
                                    >
                                        Join Our Community
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <section className="bg-fun-purple px-6 py-20">
                    <div className="container mx-auto text-center">
                        <h2 className="font-playfair mb-6 text-3xl font-bold text-white md:text-4xl">Ready to Put These Tips Into Practice?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
                            Start your personalized piano learning journey with our expert instructors today.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('register')}
                                className="shadow-float inline-flex items-center justify-center rounded-full bg-fun-green px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-fun-green-600"
                            >
                                🎹 Start Learning Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href={route('pricing.index')}
                                className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-fun-purple"
                            >
                                💰 View Plans
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Blog;
