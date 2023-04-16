import { Box, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: true,
  },
  {
    field: 'nation',
    headerName: 'Nation',
    flex: true,
  },
  {
    field: 'year',
    headerName: 'Year',
    flex: true,
  },
  {
    field: 'category',
    headerName: 'Category',
    flex: true,
  },
  {
    field: 'actions',
    type: 'actions',
    flex: true,
    getActions: (params) => [
      <Button
        onClick={() => {
          console.log(params);
        }}
        variant="outlined"
        disableElevation
        color="info"
        size="small"
      >
        View Profile
      </Button>,
    ],
  },
];

const pageSizeOptions = [10, 50, 100];

const initialState = {
  pagination: { paginationModel: { pageSize: 10 } },
};

const slots = {
  noRowsOverlay: () => (
    <Typography variant="body1" textAlign="center" mt="7%">
      There are no winners matching the search criterion
    </Typography>
  ),
};

export const Results = ({ data }) => {
  return (
    <>
      <Typography variant="h2" fontSize={40} mb="20px">
        Winners
      </Typography>
      <DataGrid
        disableRowSelectionOnClick
        autoHeight
        columns={columns}
        rows={data}
        disableColumnFilter
        disableColumnMenu
        pageSizeOptions={pageSizeOptions}
        initialState={initialState}
        slots={slots}
      />
    </>
  );
};
