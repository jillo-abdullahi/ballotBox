import { FaFireAlt, FaArrowRight } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { SiBlockchaindotcom } from "react-icons/si";
import { Link } from "@tanstack/react-router";

export default function InfoSection() {
  const stats = [
    {
      icon: <FaFireAlt className="text-gray-300 mr-2" />,
      label: "Propose Anything",
    },
    {
      icon: <BsPeopleFill className="text-gray-300 mr-2" />,
      label: "Democracy in Action",
    },
    {
      icon: <SiBlockchaindotcom className="text-gray-300 mr-2" />,
      label: "Powered by Web3",
    },
  ];
  return (
    <section className="relative overflow-hidden rounded-4xl bg p-8 md:p-12 bg-teal-bg">
      <div className="relative max-w-4xl">
        <div className="mb-3">
          <h1 className="text-4xl md:text-6xl font-bold text-teal-text mb-2 leading-tight">
            Vote on the Future
          </h1>
          <p className="text-xl md:text-2xl text-teal-text font-medium">
            Shape decisions that matter with transparent, on-chain governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center bg-teal-text/20 backdrop-blur-sm rounded-2xl px-6 py-3"
            >
              {stat.icon}
              <span className="text-gray-300 font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/create"
            className="group bg-teal-text cursor-pointer hover:bg-teal-text/90 text-teal-bg font-semibold py-4 px-8 rounded-full transition-all duration-300 flex items-center gap-3 hover:shadow-lg w-fit"
          >
            <span className="text-lg">Create a Proposal</span>
            <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
