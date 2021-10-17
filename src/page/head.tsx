import event from "../event"
import "./head.css"
export default function Head({ type }: { type: 'home' | 'rank' } = { type: 'home' }) {
    const setPage = (page: string) => {
        event.emit('selectPage', page)

    }
    return <div className="head-container">
        <div className="list">
            <div className="item" onClick={()=>setPage('home')}>房间</div>
            <div className="item" onClick={()=>setPage('rank')}>排行榜</div>
        </div>
        <div className={`hr ${type === 'home' ? 'select-left' : 'select-right'}`}></div>
    </div>
}