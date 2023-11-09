import { useEffect, useState } from "react";

const roleMultiplier = {
  dev: {
    team: 0.7,
    collective: 0.2,
    community: 0.1,
    label: "Developer",
  },
  pm: {
    team: 0.7,
    collective: 0.2,
    community: 0.1,
    label: "Project Manager",
  },
  tl: {
    team: 0.7,
    collective: 0.2,
    community: 0.1,
    label: "Team Lead",
  },
  cl: {
    team: 0,
    collective: 0.7,
    community: 0.3,
    label: "Collective Lead",
  },
} as const;
type RoleKeys = keyof typeof roleMultiplier;
const roles = Object.keys(roleMultiplier) as RoleKeys[];

export const XPcalculator = () => {
  const maxXpGain = 22;
  const baseXP = 0.5;
  const perfectCreditPerMonth = 600;

  const [role, setRole] = useState<RoleKeys>();
  const [teamCredit, setTeamCredit] = useState<number>(0);
  const [collectiveCredit, setCollectiveCredit] = useState<number>(0);
  const [communityCredit, setCommunityCredit] = useState<number>(0);
  const [currentXPLevel, setCurrentXPLevel] = useState<number>(0);
  const [totalXPGain, setTotalXPGain] = useState<number>(0);

  const annualXPGain = Number(totalXPGain) * 12;
  const xpAfterAYear = Math.round(
    Number(currentXPLevel) + Number(annualXPGain)
  );
  const percentageIncrease = Math.round(
    (annualXPGain / Number(currentXPLevel)) * 100 || 0
  );

  useEffect(() => {
    if (!role) {
      return;
    }

    const baseGain = (baseXP / 100) * currentXPLevel;
    const teamGain =
      (teamCredit / perfectCreditPerMonth) *
      roleMultiplier[role].team *
      maxXpGain;
    const collectiveGain =
      (collectiveCredit / perfectCreditPerMonth) *
      roleMultiplier[role].collective *
      maxXpGain;
    const communityGain =
      (communityCredit / perfectCreditPerMonth) *
      roleMultiplier[role].community *
      maxXpGain;

    setTotalXPGain(
      Math.round(baseGain + collectiveGain + teamGain + communityGain)
    );
  }, [
    role,
    teamCredit,
    collectiveCredit,
    communityCredit,
    maxXpGain,
    perfectCreditPerMonth,
    baseXP,
    currentXPLevel,
  ]);

  return (
    <main className="min-h-visible-screen h-full flex flex-col justify-center p-8 md:px-16">
      <h1 className="font-bold text-3xl md:text-5xl mb-16 md:mb-24">
        XP calculator
      </h1>

      <div className="flex flex-col md:flex-row gap-16">
        <div className="flex flex-col gap-8 w-full max-w-[384px] justify-center">
          <div className="flex flex-col">
            <label className="flex flex-col text-sm leading-7">
              My role at Gitstart is
            </label>

            <select
              className="border border-gray-300 rounded-lg h-[40px] px-2"
              value={role}
              onChange={(e) => setRole(e.target.value as RoleKeys)}
            >
              <option value="" disabled selected className="text-gray-900">
                Select a role
              </option>
              {roles.map((value) => (
                <option key={value} value={value}>
                  {roleMultiplier[value].label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="flex flex-col text-sm leading-7">
              My XP is Current
            </label>
            <input
              type="number"
              value={currentXPLevel || ""}
              onChange={(e) => setCurrentXPLevel(Number(e.target.value))}
              className="border border-gray-300 rounded-lg h-[40px] px-2"
              placeholder="1000"
            />
          </div>

          {role && (
            <>
              <div className="flex flex-col">
                <label className="flex flex-col text-sm leading-7">
                  My team shipped this many credits per developer
                </label>
                <input
                  type="number"
                  value={teamCredit || ""}
                  onChange={(e) => setTeamCredit(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg h-[40px] px-2"
                  placeholder="400"
                />
              </div>

              <div className="flex flex-col">
                <label className="flex flex-col text-sm leading-7">
                  My collective shipped this many credits per developer
                </label>
                <input
                  type="number"
                  value={collectiveCredit || ""}
                  onChange={(e) => setCollectiveCredit(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg h-[40px] px-2"
                  placeholder="300"
                />
              </div>

              <div className="flex flex-col">
                <label className="flex flex-col text-sm leading-7">
                  My community shipped this many credits per developer
                </label>
                <input
                  type="number"
                  value={communityCredit || ""}
                  onChange={(e) => setCommunityCredit(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg h-[40px] px-2"
                  placeholder="250"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center items-center w-full font-bold text-lg">
          {!role ? (
            <h3 className="text-4xl md:text-5xl text-gray-400 font-bold">
              Need numbers to crunch...
            </h3>
          ) : (
            <div className="flex flex-col font-semibold leading-[48px] text-3xl md:text-4xl md:gap-[43px] gap-6">
              <p>
                You will receive{" "}
                <span className="text-green-400 font-bold">
                  +{Number(totalXPGain) || 0} XP
                </span>
              </p>
              <p>
                In 1 year, you would have{" "}
                <span className="text-green-400 font-bold">
                  {xpAfterAYear} XP
                </span>{" "}
                a{" "}
                <span className="text-green-400 font-bold">
                  {percentageIncrease}% increase
                </span>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
