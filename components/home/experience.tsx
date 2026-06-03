import { experiences } from "@/data/experience";

export default function Experience() {
  return (
    <section className="container p-4 flex flex-col gap-8 my-8">
      <div>
        <h2 className="text-6xl">experience</h2>
      </div>

      <div className="flex flex-col gap-8">
        {experiences
          .sort((a, b) => b.id - a.id)
          .map((exp) => (
            <div key={exp.company} className="table-border pb-8 last:border-0">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <a
                    href={exp.website}
                    target="_blank"
                    className="text-3xl font-semibold animated-underline"
                  >
                    {exp.company}
                  </a>
                </div>

                <div className="flex flex-col gap-6">
                  {exp.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                        <h3 className="text-2xl font-medium">
                          {role.title}
                        </h3>
                        {role.period && (
                          <span className="text-sm text-foreground">{role.period}</span>
                        )}
                        {role.type && (
                          <span className="text-sm text-foreground">
                            ({role.type})
                          </span>
                        )}
                      </div>

                      <p className="text-base md:text-lg font-light leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                  {exp.stacks.map((stack) => (
                    <span
                      key={stack}
                      className="px-3 py-1 text-sm border-[0.5px] border-foreground hover:bg-card transition-colors duration-200"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
