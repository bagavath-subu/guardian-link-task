import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Skeleton,
} from "@mui/material";
import NoData from "../NoData";

export default function TableComponent({
  data: rows,
  headers: columns,
  meta,
  page = 0,
  setPage,
  clickHandler = () => {},
  loading = false,
}) {
  const [rowsPerPage, setRowsPerPage] = React.useState(
    meta?.pagination?.limit || 20
  );

  const handleChangePage = (event, newPage) => {
    console.log({ newPage });
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: { xs: "90vw", sm: "100vw", md: "100%" } }}>
      <TableContainer sx={{ maxHeight: "95%", overflowX: "scroll" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from(Array(20)).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={40}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows?.length ? (
              rows.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    onClick={() => clickHandler(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={columns.length}>
                  <NoData />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[meta?.pagination?.limit || 20]}
        component="div"
        count={meta?.pagination?.pages || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
