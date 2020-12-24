import React, { useEffect, useState } from 'react';
import { getTableDataFact, getXHRErrorMeta } from './api/api';
import { Table } from './components';

function App() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    err: {
      msg: '',
      statusCode: '',
    },
    isLoading: false,
    page: 0,
    size: 40,
    totalPages: 0,
    totalPassengers: 0,
  });

  useEffect(() => {
    generateTableColumns();
    getTableData(meta.page, meta.size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateTableColumns = () => {
    const data: any = [
      { label: 'Name', key: 'name', hasSort: true },
      { label: 'Trips', key: 'trips', hasSort: false },
      { label: 'Airline', key: 'airline', hasSort: false, renderItem: () => <div className="text-primary">Airline</div> },
      { label: 'Country', key: 'country', hasSort: false },
      { label: 'Actions', key: 'actions', hasSort: false },
    ]
    setColumns(data);
  };

  const generateTableRows = (data: any) => {
    const mapped: any = data.map((item: any) => {
      return {
        ...item,
        key: item._id,
        airline: item.airline.name,
        country: item.airline.country,
      }
    });
    const rowsData: any = [...rows, ...mapped];
    setRows(rowsData);
  };

  const getnerateMetadata = (data: any) => {
    setMeta({
      ...meta,
      ...data,
    });
  };

  const onInfinite = () => {
    if (!rows.length) return;
    const newPage = meta.page + 1;
    if (newPage > meta.totalPages) return;
    getTableData(newPage, meta.size);
  };

  const getTableData = (page: number, size: number) => {
    getnerateMetadata({
      isLoading: true,
    });
    getTableDataFact(page, size).then(response => {
      const { data, totalPages, totalPassengers } = response.data;
      getnerateMetadata({
        isLoading: false,
        err: {
          msg: '',
          statusCode: '',
        },
        page,
        size,
        totalPages,
        totalPassengers
      });
      generateTableRows(data);
    }).catch(err => {
      // We can also implement an error interceptor if all the error models from backend are sent consistently.
      const { msg, statusCode } = getXHRErrorMeta(err);
      getnerateMetadata({
        isLoading: false,
        err: {
          msg,
          statusCode,
        },
      });
    })
  };

  if (meta.err.msg) {
    // We can make reusable alert Component
    return (<div className="alert alert-danger" role="alert">
      <strong>Status code - {meta.err.statusCode}</strong>
      <div>{meta.err.msg}</div>
    </div>);
  }

  return (
    <div className="App">
      <Table
        hasInfiniteScroll
        columns={columns}
        rows={rows}
        loadingContent={
          <div className="text-center">
            {meta.isLoading && <div className="spinner-border" role="status">
            </div>}
          </div>
        }
        render={(item: any) => {
          return (
            <>
              <Table.Data>{item.name}</Table.Data>
              <Table.Data>{item.trips}</Table.Data>
              <Table.Data>{item.airline}</Table.Data>
              <Table.Data>{item.country}</Table.Data>
              <Table.Data>
                {/* Writing direct button and related css for demo, in live project i will create a reusable button component with scoped scss.  */}
                <button className="btn btn-danger btn-sm" disabled>Remove</button>
              </Table.Data>
            </>
          );
        }}
        onInfinite={onInfinite}
      >
      </Table>
    </div>
  );
}

export default App;
