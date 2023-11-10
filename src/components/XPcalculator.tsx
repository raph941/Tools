import { useEffect, useState } from "react";
import { Input } from "./Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

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
  const maxMonthlyXpGain = 22;
  const baseXP = 0.05;
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
    Math.round((annualXPGain / currentXPLevel) * 100) || 0
  );

  useEffect(() => {
    if (!role) {
      return;
    }

    const baseGain = (baseXP / 3) * currentXPLevel;
    const teamGain =
      (teamCredit / perfectCreditPerMonth) *
      roleMultiplier[role].team *
      maxMonthlyXpGain;
    const collectiveGain =
      (collectiveCredit / perfectCreditPerMonth) *
      roleMultiplier[role].collective *
      maxMonthlyXpGain;
    const communityGain =
      (communityCredit / perfectCreditPerMonth) *
      roleMultiplier[role].community *
      maxMonthlyXpGain;

    const totalGain = Math.round(
      baseGain + collectiveGain + teamGain + communityGain
    );
    setTotalXPGain(totalGain > maxMonthlyXpGain ? maxMonthlyXpGain : totalGain);
  }, [
    role,
    teamCredit,
    collectiveCredit,
    communityCredit,
    maxMonthlyXpGain,
    perfectCreditPerMonth,
    baseXP,
    currentXPLevel,
  ]);

  return (
    <main className="min-h-visible-screen h-full flex flex-col justify-center p-8 md:px-16">
      <h1 className="font-bold text-3xl md:text-5xl mb-16 md:mb-24">
        XP calculator
      </h1>

      <div className="flex flex-col md:flex-row gap-16 items-center md:items-start">
        <div className="flex flex-col gap-8 w-full max-w-[384px] justify-center">
          <div className="flex flex-col">
            <label className="flex flex-col text-sm leading-7">
              My role at Gitstart is
            </label>

            <Select onValueChange={(value) => setRole(value as RoleKeys)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((value) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="cursor-pointer"
                    >
                      {roleMultiplier[value].label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label className="flex flex-col text-sm leading-7">
              My XP is Currently
            </label>
            <Input
              type="number"
              value={currentXPLevel || ""}
              onChange={(e) => setCurrentXPLevel(Number(e.target.value))}
              placeholder="1000"
            />
          </div>

          {role && (
            <>
              <div className="flex flex-col">
                <label className="flex flex-col text-sm leading-7">
                  My team shipped this many credits per developer
                </label>
                <Input
                  type="number"
                  value={teamCredit || ""}
                  onChange={(e) => setTeamCredit(Number(e.target.value))}
                  placeholder="400"
                />
              </div>

              <div className="flex flex-col">
                <label className="flex flex-col text-sm leading-7">
                  My collective shipped this many credits per developer
                </label>
                <Input
                  type="number"
                  value={collectiveCredit || ""}
                  onChange={(e) => setCollectiveCredit(Number(e.target.value))}
                  placeholder="300"
                />
              </div>

              <div className="flex flex-col">
                <label className="flex flex-col text-sm leading-7">
                  My community shipped this many credits per developer
                </label>
                <Input
                  type="number"
                  value={communityCredit || ""}
                  onChange={(e) => setCommunityCredit(Number(e.target.value))}
                  placeholder="250"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center items-center w-full font-bold text-lg text-center md:text-left">
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
                  {isNaN(percentageIncrease) ? 0 : percentageIncrease}% increase
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
