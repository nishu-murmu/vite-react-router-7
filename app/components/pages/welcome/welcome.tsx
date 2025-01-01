import { Link } from "react-router";

export function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <main className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
          Welcome to Booksville
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Explore, Create, and Share Books
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/books"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Browse Books
          </Link>
          <Link
            to="/create-book"
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Create Book
          </Link>
        </div>
      </main>
      <footer className="mt-8 text-center text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Booksville. All rights reserved.
      </footer>
    </div>
  );
}
