import { useEffect, useState } from "react"
import { netPlayer } from "../../player";
import { ListToBStruct } from "../../socket/define";

export function HomePage({ propHomes = [] }: { propHomes?: ListToBStruct['data'] }) {
  const [homes, setHomes] = useState(propHomes);

  useEffect(() => {
    setTimeout(async () => {
      const e = await netPlayer.wantHomeList() as ListToBStruct;
      setHomes(e.data);
    }, 3000);
  });
  return (
    <div className="homepage">
      <div className="homelist">
        {
          homes.map(home => (
            <div key={home.token}>{home.masterName}</div>
          ))
        }
      </div>
      <div id="appCanvas"></div>
    </div>
  )
}