import { Link, Head } from '@inertiajs/react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Head>
                <title>Page Not Found - Learn Piano Online</title>
                <meta name="description" content="The page you're looking for doesn't exist. Return to our homepage to continue your piano learning journey." />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Page Not Found - Learn Piano Online" />
                <meta property="og:description" content="The page you're looking for doesn't exist. Return to our homepage." />
                <meta property="og:type" content="website" />
            </Head>
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">404</h1>
                <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
                <Link href="/" className="text-blue-500 underline hover:text-blue-700 cursor-pointer">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
