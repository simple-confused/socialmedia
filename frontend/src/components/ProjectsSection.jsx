import React from "react";
const projects = [
  {
    title: "Job Portal App",
    description:
      "A full-stack job portal for recruiters and students with email verification, Cloudinary integration, and user authentication.",
    link: "https://github.com/simple-confused/job-portal",
    imagename: "job-portal.png",
  },
  {
    title: "We Go Gym App",
    description:
      "A gym website made using React and MIUI and RapidAPI for fetching gym data.",
    imagename: "gym-website.png",
    link: "https://wegym.netlify.app/",
  },
  {
    title: "Anonymous Message App",
    description:
      "A full-stack anonymous message app made in NextJS with user authentication and MongoDB database. User can send messages to anyone.",
    imagename: "anonymous-message.png",
    link: "https://anonymousmsg.vercel.app/",
  },
];

const ProjectsSection = () => {
  return (
    <section className="py-16 bg-blue-600 text-center">
      <h2 className="text-4xl font-bold mb-10 text-white">My Projects</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="max-w-sm bg-gray-100 p-6 rounded-lg shadow-lg  hover:shadow-slate-800 transition duration-300"
          >
            <img
              src={`${project.imagename}`}
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
