'use client';

import { useMemo } from 'react';
import VirtualTable, { TableColumnsType } from '@/components/ux/table/VirtualTable';
import Typography from '@/components/ux/text/Typography';
import Divider from '@/components/ux/display/Divider';
import CodeBlock from '@/components/ux/text/CodeBlock';

export default function Page() {
  const columns: TableColumnsType = {
    id: { id: 'id', numeric: false, label: 'ID', tooltip: 'Tooltip for ID', organization_ids: [], views: [], graphable: false },
    name: { id: 'name', numeric: false, label: 'Name', tooltip: 'Tooltip for Name', organization_ids: [], views: [], graphable: false },
    email: { id: 'email', numeric: false, label: 'Email', tooltip: 'Tooltip for Email', organization_ids: [], views: [], graphable: false },
    role: { id: 'role', numeric: false, label: 'Role', tooltip: 'Tooltip for Role', organization_ids: [], views: [], graphable: false },
  };

  const displayColumns = ['id', 'name', 'email', 'role'];

  const rows = useMemo(() => {
    return Array.from({ length: 100000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : 'User',
    }));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Virtual Table</Typography>

      <Typography type='body1' style={{ marginBottom: 10 }}>This component allows you to display a lot of rows in a single table by virtualizing the results. It will also handling sorting by column!</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Large Dataset (100,000 rows)</Typography>
      <VirtualTable
        rows={rows}
        columns={columns}
        displayColumns={displayColumns}
        rowKey="id"
        defaultSortOrder="asc"
        defaultSortOrderBy="id"
        height={500}
        rowHeight={30}
      />

      <CodeBlock code = {`
        import { useMemo } from 'react';
        import VirtualTable, { TableColumnsType } from '@/components/ux/table/VirtualTable';

        const columns: TableColumnsType = {
          id: { id: 'id', numeric: false, label: 'ID', tooltip: 'Tooltip for ID', organization_ids: [], views: [], graphable: false },
          name: { id: 'name', numeric: false, label: 'Name', tooltip: 'Tooltip for Name', organization_ids: [], views: [], graphable: false },
          email: { id: 'email', numeric: false, label: 'Email', tooltip: 'Tooltip for Email', organization_ids: [], views: [], graphable: false },
          role: { id: 'role', numeric: false, label: 'Role', tooltip: 'Tooltip for Role', organization_ids: [], views: [], graphable: false },
        };

        const displayColumns = ['id', 'name', 'email', 'role'];

        const rows = useMemo(() => {
          return Array.from({ length: 100000 }, (_, i) => ({
            id: i + 1,
            name: \`User \${i + 1}\`,
            email: \`user\${i + 1}@example.com\`,
            role: i % 3 === 0 ? 'Admin' : 'User',
          }));
        }, []);

        <VirtualTable
          rows={rows}
          columns={columns}
          displayColumns={displayColumns}
          rowKey="id"
          defaultSortOrder="asc"
          defaultSortOrderBy="id"
          height={500}
          rowHeight={30}
        />
      `} />

      <Divider style={{ margin: '40px 0' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Small Dataset</Typography>
      <VirtualTable
        rows={rows.slice(0, 10)}
        columns={columns}
        displayColumns={displayColumns}
        rowKey="id"
        defaultSortOrder="asc"
        defaultSortOrderBy="id"
        height={200}
        rowHeight={30}
      />
    </div>
  );
}
