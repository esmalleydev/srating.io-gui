'use client';

import Table from '@/components/ux/table/Table';
import Typography from '@/components/ux/text/Typography';
import Divider from '@/components/ux/display/Divider';
import Thead from '@/components/ux/table/Thead';
import Tr from '@/components/ux/table/Tr';
import Tbody from '@/components/ux/table/Tbody';
import Td from '@/components/ux/table/Td';

export default function Page() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'User' },
    { id: 6, name: 'Eve White', email: 'eve@example.com', role: 'Admin' },
    { id: 7, name: 'Frank Miller', email: 'frank@example.com', role: 'User' },
    { id: 8, name: 'Grace Lee', email: 'grace@example.com', role: 'Editor' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Table</Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard Table</Typography>
      <Table>
        <Thead>
          <Tr>
            {columns.map((col) => <th key={col.accessor}>{col.header}</th>)}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr key={row.id}>
              <Td>{row.id}</Td>
              <Td>{row.name}</Td>
              <Td>{row.email}</Td>
              <Td>{row.role}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Divider style={{ margin: '40px 0' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Empty Table</Typography>
      <Table>
        <Thead>
          <Tr>
            {columns.map((col) => <th key={col.accessor}>{col.header}</th>)}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
              No data available
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );
}
