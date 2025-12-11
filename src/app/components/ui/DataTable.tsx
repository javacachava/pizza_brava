import React from 'react';

type Accessor<T> = keyof T | ((row: T) => React.ReactNode);

export interface Column<T> {
  header: string;
  accessor: Accessor<T>;
  width?: string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Array<Column<T>>;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onToggleActive?: (row: T) => void;
  rowKey?: (row: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  onToggleActive,
  rowKey
}: DataTableProps<T>) {
  const getValue = (row: T, accessor: Accessor<T>) => {
    if (typeof accessor === 'function') return accessor(row);
    return row[accessor] as any;
  };

  return (
    <table className="min-w-full bg-white border rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              style={{ width: col.width }}
              className="p-3 font-medium text-gray-700"
            >
              {col.header}
            </th>
          ))}
          {(onEdit || onDelete || onToggleActive) && (
            <th className="p-3 text-gray-700 w-32">Acciones</th>
          )}
        </tr>
      </thead>

      <tbody>
        {data.map((row, idx) => (
          <tr
            key={rowKey ? rowKey(row) : idx}
            className="border-t hover:bg-gray-50"
          >
            {columns.map((col, cidx) => (
              <td key={cidx} className="p-3">
                {getValue(row, col.accessor)}
              </td>
            ))}

            {(onEdit || onDelete || onToggleActive) && (
              <td className="p-3 flex gap-2">
                {onEdit && (
                  <button className="text-blue-600" onClick={() => onEdit(row)}>Editar</button>
                )}
                {onToggleActive && (
                  <button className="text-green-600" onClick={() => onToggleActive(row)}>Estado</button>
                )}
                {onDelete && (
                  <button className="text-red-600" onClick={() => onDelete(row)}>Borrar</button>
                )}
              </td>
            )}
          </tr>
        ))}

        {data.length === 0 && (
          <tr>
            <td
              className="p-5 text-center text-gray-500"
              colSpan={columns.length + 1}
            >
              Sin datos para mostrar
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
