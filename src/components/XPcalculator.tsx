import * as Collapsible from "@radix-ui/react-collapsible";
import { useEffect, useState } from "react";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";

const roleMultiplier = {
    dev: {
        team: 0.7,
        collective: 0.2,
        community: 0.1,
        label: 'Developer'
    },
    pm: {
        team: 0.7,
        collective: 0.2,
        community: 0.1,
        label: 'Project Manager'
    },
    tl: {
        team: 0.7,
        collective: 0.2,
        community: 0.1,
        label: 'Team Lead'
    },
    cl: {
        team: 0,
        collective: 0.7,
        community: 0.3,
        label: 'Collective Lead'
    }
} as const;
type RoleKeys = keyof typeof roleMultiplier;
const roles = Object.keys(roleMultiplier) as RoleKeys[];


export const XPcalculator = () => {
  const [isCollapsibleOpened, setIsCollapsibleOpened] =
    useState<boolean>(false);
  const [maxXpGain, setMaxXpGain] = useState<number>(22);
  const [baseXP, setBaseXP] = useState<number>(0.5);
  const [perfectCreditPerMonth, setPerfectCreditPerMonth] =
    useState<number>(600);

  const [role, setRole] = useState<RoleKeys>("dev");

  const [teamCredit, setTeamCredit] = useState<number>(0);
  const [collectiveCredit, setCollectiveCredit] = useState<number>(0);
  const [communityCredit, setCommunityCredit] = useState<number>(0);
  const [currentXPLevel, setCurrentXPLevel] = useState<number>(0);

  const [totalXPGain, setTotalXPGain] = useState<number>(0);

  useEffect(() => {
    console.log(role);
  }, [role])

  useEffect(() => {
    const baseGain = (baseXP / 100) * currentXPLevel;
    const teamGain =
      (teamCredit / perfectCreditPerMonth) * roleMultiplier[role].team * maxXpGain;
    const collectiveGain =
      (collectiveCredit / perfectCreditPerMonth) * roleMultiplier[role].collective * maxXpGain;
    const communityGain =
      (communityCredit / perfectCreditPerMonth) * roleMultiplier[role].community * maxXpGain;

    setTotalXPGain(Math.round(baseGain + collectiveGain + teamGain + communityGain))
  }, [role, teamCredit, collectiveCredit, communityCredit, maxXpGain, perfectCreditPerMonth, baseXP, currentXPLevel]);

  return (
    <div>
      <h1 className="font-semibold text-2xl md:text-3xl mb-6">XP calculator</h1>
      <p className="text-lg">
        Understand how your XP grows based on your cycle of influence.
      </p>

      <div className="mt-8">
        <Collapsible.Root
          onOpenChange={(open) => setIsCollapsibleOpened(open)}
          className=""
        >
          <Collapsible.Trigger asChild>
            <button className="flex items-center gap-8 font-semibold">
              <span>Gain Parameters</span>{" "}
              <span>
                {isCollapsibleOpened ? <Cross2Icon /> : <RowSpacingIcon />}
              </span>
            </button>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  w-full mt-6 border p-6">
              <label className="flex flex-col gap-4">
                Max XP gain per month
                <input
                  type="number"
                  value={maxXpGain}
                  onChange={(e) => setMaxXpGain(Number(e.target.value))}
                  className="border rounded-lg p-2 bg-gray-100"
                />
              </label>
              <label className="flex flex-col gap-4">
                Base XP per month
                <input
                  type="number"
                  value={baseXP}
                  onChange={(e) => setBaseXP(Number(e.target.value))}
                  className="border rounded-lg p-2 bg-gray-100"
                />
              </label>
              <label className="flex flex-col gap-4">
                Perfect credit shipperd per month
                <input
                  type="number"
                  value={perfectCreditPerMonth}
                  onChange={(e) =>
                    setPerfectCreditPerMonth(Number(e.target.value))
                  }
                  className="border rounded-lg p-2 bg-gray-100"
                />
              </label>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>

      <hr className="my-8" />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Role</label>

            <select
              className="border p-3 rounded-lg bg-gray-50"
              onChange={(e) => setRole(e.target.value as RoleKeys)}
            >
              {roles.map((value) => (
                <option key={value} value={value}>{roleMultiplier[value].label}</option>
              ))}
            </select>
          </div>
        
          <label className="flex flex-col gap-4">
            Current XP Level
            <input
              type="number"
              value={currentXPLevel || undefined}
              onChange={(e) => setCurrentXPLevel(Number(e.target.value))}
              className="border rounded-lg p-2 bg-gray-50"
              placeholder="team delivery"
            />
          </label>
          
          <label className="flex flex-col gap-4">
            Team credit per dev
            <input
              type="number"
              value={teamCredit || undefined}
              onChange={(e) => setTeamCredit(Number(e.target.value))}
              className="border rounded-lg p-2 bg-gray-50"
              placeholder="XP level"
            />
          </label>

          <label className="flex flex-col gap-4">
            Collective credit per dev
            <input
              type="number"
              value={collectiveCredit || undefined}
              onChange={(e) => setCollectiveCredit(Number(e.target.value))}
              className="border rounded-lg p-2 bg-gray-50"
              placeholder="collective delivery"
            />
          </label>

          <label className="flex flex-col gap-4">
            Community credit per dev
            <input
              type="number"
              value={communityCredit || undefined}
              onChange={(e) => setCommunityCredit(Number(e.target.value))}
              className="border rounded-lg p-2 bg-gray-50"
              placeholder="community delivery"
            />
          </label>
        </div>

        <div className="flex flex-col justify-center items-center w-full font-bold text-lg">
          <span>XP Gain:</span>
          <span className="font-normal">{totalXPGain}</span>
          <span>$ Gain:</span>
          <span className="font-normal">{Math.round(Number(totalXPGain) * 1.5)}</span>
        </div>
      </div>
    </div>
  );
};
