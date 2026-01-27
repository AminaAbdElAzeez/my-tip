// import React, { useRef, useState } from "react";
// import { SearchOutlined } from "@ant-design/icons";
// import type { InputRef, TableColumnsType, TableColumnType } from "antd";
// import { Button, Input, Space, Table,Radio } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
// import { UsersProps } from "../../../types/users/users";
// import { UserRole } from "../../../types/users/users";
// import type { RadioChangeEvent } from 'antd';
// import { FiTrash,FiEdit } from "react-icons/fi";






// function TableList<T>({columns,  data }:{data:T[],columns}) {
//   type DataIndex = string;
//   const [searchText, setSearchText] = useState("");
//   const [searchedColumn, setSearchedColumn] = useState("");
//   //const [activeStatus, setA] = useState(1);

//   const onChange = (e: RadioChangeEvent) => {
//     console.log('radio checked', e.target.value);
   
//   };
//   const searchInput = useRef<InputRef>(null);

//   const handleSearch = (
//     selectedKeys: string[],
//     confirm: FilterDropdownProps["confirm"],
//     dataIndex: DataIndex 
//   ) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     setSearchText("");
//   };

//   // const getColumnSearchProps = (
//   //   dataIndex: DataIndex
//   // ): TableColumnType<T> => ({
//   //   filterDropdown: ({
//   //     setSelectedKeys,
//   //     selectedKeys,
//   //     confirm,
//   //     clearFilters,
//   //     close,
//   //   }) => (
//   //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
//   //       <Input
//   //         ref={searchInput}
//   //         placeholder={`Search ${dataIndex}`}
//   //         value={selectedKeys[0]}
//   //         onChange={(e) =>
//   //           setSelectedKeys(e.target.value ? [e.target.value] : [])
//   //         }
//   //         onPressEnter={() =>
//   //           handleSearch(selectedKeys as string[], confirm, dataIndex)
//   //         }
//   //         style={{ marginBottom: 8, display: "block" }}
//   //       />
//   //       <Space>
//   //         <Button
//   //           type="primary"
//   //           onClick={() =>
//   //             handleSearch(selectedKeys as string[], confirm, dataIndex)
//   //           }
//   //           icon={<SearchOutlined />}
//   //           size="small"
//   //           style={{ width: 90 }}
//   //         >
//   //           Search
//   //         </Button>
//   //         <Button
//   //           onClick={() => clearFilters && handleReset(clearFilters)}
//   //           size="small"
//   //           style={{ width: 90 }}
//   //         >
//   //           Reset
//   //         </Button>
//   //         <Button
//   //           type="link"
//   //           size="small"
//   //           onClick={() => {
//   //             confirm({ closeDropdown: false });
//   //             setSearchText((selectedKeys as string[])[0]);
//   //             setSearchedColumn(dataIndex);
//   //           }}
//   //         >
//   //           Filter
//   //         </Button>
//   //         <Button
//   //           type="link"
//   //           size="small"
//   //           onClick={() => {
//   //             close();
//   //           }}
//   //         >
//   //           Close
//   //         </Button>
//   //       </Space>
//   //     </div>
//   //   ),
//   //   filterIcon: (filtered: boolean) => (
//   //     <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
//   //   ),
//   //   onFilter: (value, record) =>
//   //     record[dataIndex]
//   //       .toString()
//   //       .toLowerCase()
//   //       .includes((value as string).toLowerCase()),
//   //   onFilterDropdownOpenChange: (visible) => {
//   //     if (visible) {
//   //       setTimeout(() => searchInput.current?.select(), 100);
//   //     }
//   //   },
//   //   render: (text) => text,
//   // });
//   // const getColumnSearchProps = (
//   //   dataIndex: DataIndex
//   // ): TableColumnType<T> => ({
//   //   filterDropdown: ({
//   //     setSelectedKeys,
//   //     selectedKeys,
//   //     confirm,
//   //     clearFilters,
//   //     close,
//   //   }) => (
//   //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
//   //       <Input
//   //         ref={searchInput}
//   //         placeholder={`Search ${dataIndex}`}
//   //         value={selectedKeys[0]}
//   //         onChange={(e) =>
//   //           setSelectedKeys(e.target.value ? [e.target.value] : [])
//   //         }
//   //         onPressEnter={() =>
//   //           handleSearch(selectedKeys as string[], confirm, dataIndex)
//   //         }
//   //         style={{ marginBottom: 8, display: "block" }}
//   //       />
//   //       <Space>
//   //         <Button
//   //           type="primary"
//   //           onClick={() =>
//   //             handleSearch(selectedKeys as string[], confirm, dataIndex)
//   //           }
//   //           icon={<SearchOutlined />}
//   //           size="small"
//   //           style={{ width: 90 }}
//   //         >
//   //           Search
//   //         </Button>
//   //         <Button
//   //           onClick={() => clearFilters && handleReset(clearFilters)}
//   //           size="small"
//   //           style={{ width: 90 }}
//   //         >
//   //           Reset
//   //         </Button>
//   //         <Button
//   //           type="link"
//   //           size="small"
//   //           onClick={() => {
//   //             confirm({ closeDropdown: false });
//   //             setSearchText((selectedKeys as string[])[0]);
//   //             setSearchedColumn(dataIndex);
//   //           }}
//   //         >
//   //           Filter
//   //         </Button>
//   //         <Button
//   //           type="link"
//   //           size="small"
//   //           onClick={() => {
//   //             close();
//   //           }}
//   //         >
//   //           Close
//   //         </Button>
//   //       </Space>
//   //     </div>
//   //   ),
//   //   filterIcon: (filtered: boolean) => (
//   //     <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
//   //   ),
//   //   onFilter: (value, record) => {
//   //     if (dataIndex === "roles") {
//   //       // Join all roles into a string and check if it contains the filter value
//   //       const roleString = ((record as unknown) as { roles: UserRole[] }).roles
//   //       .map((role) => role.role)
//   //       .join(", ");
//   //     return roleString.toLowerCase().includes((value as string).toLowerCase());
//   //   }
//   //     // Default behavior for other columns
//   //     return record[dataIndex]
//   //       .toString()
//   //       .toLowerCase()
//   //       .includes((value as string).toLowerCase());
//   //   },
//   //   onFilterDropdownOpenChange: (visible) => {
//   //     if (visible) {
//   //       setTimeout(() => searchInput.current?.select(), 100);
//   //     }
//   //   },
//   //   render: (text) => text,
//   // });
  

//   // const columns: TableColumnsType<T> = [
//   //   {
//   //     title: "User Name",
//   //     dataIndex: "userName",
//   //     key: "userName",
//   //     width: "30%",
//   //     ...getColumnSearchProps("userName"),
//   //   },
//   //   {
//   //     title: "Email",
//   //     dataIndex: "email",
//   //     key: "email",
//   //     width: "30%",
//   //     ...getColumnSearchProps("email"),
//   //   },
//   //   {
//   //     title: "Phone Number",
//   //     dataIndex: "phoneNumber",
//   //     key: "phoneNumber",
//   //     width: "20%",
//   //     ...getColumnSearchProps("phoneNumber"),
//   //     render: (text) => text || "N/A", // Handle null values
//   //   },
//   //   {
//   //     title: "Roles",
//   //     dataIndex: "roles",
//   //     key: "roles",
//   //     ...getColumnSearchProps("roles"),
//   //    // render: (roles: UserRole[]) => roles.map(role => role.role).join(", "),
//   //     render: (roles:any[]) => roles[0].role 
//   //   },{
//   //     title: "Active/InActive",
//   //     key: "actions",
//   //     render: (_, row) => (
//   //       <div className="flex">
         
//   //        <Radio.Group onChange={onChange} value={"active"}>
//   //     <Radio value={"active"} >Active</Radio>
//   //     <Radio value={"inactive"}>InActive</Radio>
      
//   //   </Radio.Group>
          
//   //       </div>
//   //     ),
//   //   },

//   //   {
//   //     title: "",
//   //     key: "actions",
//   //     render: (_, row) => (
//   //       <div className="flex">
         
//   //           <FiEdit className="text-primary cursor-pointer mx-3 text-xl"
//   //           onClick={() => console.log("Edit", row)}/>
          
//   //           <FiTrash className="text-red-700  cursor-pointer mx-3 text-xl"
//   //           onClick={() => console.log("Delete", row)}/>
          
//   //       </div>
//   //     ),
//   //   }
//   // ];

//   return <Table<T> columns={columns} dataSource={data} rowKey="id" />;
// };

// export default TableList;

