import { Home } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-2 text-rose-500 text-2xl font-bold mb-2">
          <Home size={28} />
          <h1>About StayFinder</h1>
        </div>
        <p className="text-gray-700 text-lg mb-6">
          Welcome to <span className="font-semibold text-black">StayFinder</span> – your modern solution for discovering and hosting unique properties. Whether you're planning a weekend getaway, a work-from-anywhere escape, or a long-term stay, StayFinder connects you with spaces that fit your lifestyle and your needs.
        </p>

        <h2 className="text-xl font-semibold text-black mb-2">What We’re Building</h2>
        <p className="text-gray-700 mb-6">
          StayFinder is a full-stack web platform that allows users to explore, book, and list properties across various cities. Our goal is to make short-term and long-term stays more accessible, seamless, and secure for everyone — travelers, digital nomads, families, and hosts.
        </p>

        <h2 className="text-xl font-semibold text-black mb-2">Why StayFinder?</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>🏡 <span className="font-medium text-black">Discover unique stays:</span> Explore handpicked listings with real photos and detailed descriptions.</li>
          <li>🧑‍💻 <span className="font-medium text-black">For hosts:</span> List your property, manage bookings, and earn income with a clean and intuitive dashboard.</li>
          <li>🔒 <span className="font-medium text-black">Verified users & secure payments:</span> We’re focused on providing a safe and trustworthy experience.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-2">Built With ❤️</h2>
        <p className="text-gray-700">
          StayFinder is developed using modern technologies like <span className="text-black font-medium">React</span> and <span className="text-black font-medium">Node.js</span>, designed to scale and evolve with future features like messaging, maps, payments, and reviews.
        </p>
      </div>
    </div>
  );
}

export default About;
