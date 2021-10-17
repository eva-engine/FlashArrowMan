import { useEffect, useState } from "react";
import { netPlayer } from "../../player";
import { RankToBStruct } from "../../socket/define";
import { List } from "antd";
import 'antd/dist/antd.css';

export function RankPage({ propRanks }: { propRanks: RankToBStruct['data'] }) {
  const [ranks, setRanks] = useState(propRanks);

  useEffect(() => {
    setTimeout(async () => {
      const e = await netPlayer.wantRankList() as RankToBStruct;
      setRanks(e.data);
    }, 3000);
  });
  return (
    <div className="rankpage">
      <List
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={ranks.list}
        renderItem={item => (
          <List.Item>
            {item.name}
          </List.Item>
        )}
      />
    </div>
  )
}
// import { Table } from 'antd';

// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     sorter: true,
//     render: (name:string) => `${name}`,
//     width: '20%',
//   },
//   {
//     title: 'Gender',
//     dataIndex: 'gender',
//     filters: [
//       { text: 'Male', value: 'male' },
//       { text: 'Female', value: 'female' },
//     ],
//     width: '20%',
//   },
//   {
//     title: 'Email',
//     dataIndex: 'email',
//   },
// ];

// class App extends React.Component {
//   state = {
//     data: [],
//     pagination: {
//       current: 1,
//       pageSize: 10,
//     },
//     loading: false,
//   };

//   componentDidMount() {
//     const { pagination } = this.state;
//     this.fetch({ pagination });
//   }

//   handleTableChange = (pagination, filters, sorter) => {
//     this.fetch({
//       sortField: sorter.field,
//       sortOrder: sorter.order,
//       pagination,
//       ...filters,
//     });
//   };

//   fetch = (params = {}) => {
//     this.setState({ loading: true });
//     reqwest({
//       url: 'https://randomuser.me/api',
//       method: 'get',
//       type: 'json',
//       data: getRandomuserParams(params),
//     }).then(data => {
//       console.log(data);
//       this.setState({
//         loading: false,
//         data: data.results,
//         pagination: {
//           ...params.pagination,
//           total: 200,
//           // 200 is mock data, you should read it from server
//           // total: data.totalCount,
//         },
//       });
//     });
//   };

//   render() {
//     const { data, pagination, loading } = this.state;
//     return (
//       <Table
//         columns={columns}
//         rowKey={record => record.login.uuid}
//         dataSource={data}
//         pagination={pagination}
//         loading={loading}
//         onChange={this.handleTableChange}
//       />
//     );
//   }
// }
