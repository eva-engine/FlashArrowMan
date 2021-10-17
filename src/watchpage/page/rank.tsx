import { useEffect, useState } from "react";
import { netPlayer } from "../../player";
import { RankToBStruct } from "../../socket/define";
import { Table } from 'antd';
import 'antd/dist/antd.css';
const columns = [
  {
    title: '昵称',
    dataIndex: 'name',
    width: 130,
    ellipsis: true
  },
  {
    title: '得分',
    dataIndex: 'score',
    width: '20%'
  },
  {
    title: '排名',
    dataIndex: 'index',
    width: '20%'
  },
];
export function RankPage({ propRanks }: { propRanks: RankToBStruct['data'] }) {

  const [state, setState] = useState({
    data: {
      list: []
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: 100
    },
    loading: false,
  });
  useEffect(() => {
    setState({
      data: propRanks,
      pagination: {
        current: 1,
        pageSize: 10,
        total: propRanks.count
      },
      loading: false,
    });
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      handleTableChange(state.pagination);
    }, 3000);
    return () => {
      clearInterval(timer);
    }
  }, [state]);
  async function handleTableChange(pagination: { current: number, pageSize: number }) {
    setState({
      loading: true,
      data: state.data,
      pagination: {
        pageSize: pagination.pageSize,
        current: pagination.current,
        total: state.pagination.total
      },
    });
    const e = await netPlayer.wantRankList((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize) as RankToBStruct;
    setState({
      data: e.data,
      pagination: {
        pageSize: pagination.pageSize,
        current: pagination.current,
        total: e.data.count
      },
      loading: false
    });
  }
  return (
    <div className="rankpage">
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={state.data.list}
        pagination={state.pagination}
        loading={state.loading}
        onChange={handleTableChange}
      />
    </div>
  )
}
