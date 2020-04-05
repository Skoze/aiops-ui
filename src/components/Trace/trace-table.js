import { List } from 'antd';

// const queryOrderMap = {
//   BY_START_TIME: '开始时间',
//   BY_DURATION: '持续时间',
// };
// <div>
//         <Pagination simple pageSize={defaultPageSize} total={total} onChange={handleChange} />
//         <Dropdown
//           overlay={
//             <Menu onClick={({ key }) => onQueryOrderChange(key)}>
//               {Object.keys(queryOrderMap).map((key) => (
//                 <Menu.Item key={key}>{queryOrderMap[key]}</Menu.Item>
//               ))}
//             </Menu>
//           }
//         >
//           <span>
//             {queryOrderMap[queryOrder]}
//             <Icon type="down" />
//           </span>
//         </Dropdown>
//       </div>
// const defaultPageSize = 5;
export default function TraceTable({ items, loading }) {
  return (
    <List
      loading={loading}
      dataSource={items}
      renderItem={(item) => <List.Item>{item.endpointNames[0]}</List.Item>}
    />
  );
}
