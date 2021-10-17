import { useEffect, useState } from "react";
import event from "../event";
import { ListPage } from "./list";
import { RankPage } from "./rank";

export function HomePage() {
  const [page, setPage] = useState('home')
  useEffect(() => {
    event.on('selectPage', (page) => {
      setPage(page)
    })
  }, [])
  return <>
    {page === 'home' ? <ListPage></ListPage> :
      <RankPage></RankPage>}
  </>
}